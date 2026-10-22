import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Fallback configuration provided by user
export const DEFAULT_SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  'https://sdrzrmtnmlmklvscnvfc.supabase.co';

export const DEFAULT_SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  'sb_publishable_etd8JCiNoI-yj--llFZwNQ_ijbHtqXe';

export const createCustomSupabaseClient = (url: string = DEFAULT_SUPABASE_URL, key: string = DEFAULT_SUPABASE_ANON_KEY): SupabaseClient => {
  return createClient(url.trim(), key.trim(), {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  });
};

// Singleton default client instance
export const supabase = createCustomSupabaseClient();

export interface ConnectionTestResult {
  success: boolean;
  timestamp: string;
  latencyMs: number;
  url: string;
  steps: {
    name: string;
    status: 'success' | 'failed' | 'warning' | 'pending';
    message: string;
    details?: any;
    durationMs?: number;
  }[];
  summary: string;
  error?: string;
}

/**
 * Runs diagnostic connection tests against Supabase
 */
export async function testSupabaseConnection(
  customUrl: string = DEFAULT_SUPABASE_URL, 
  customKey: string = DEFAULT_SUPABASE_ANON_KEY
): Promise<ConnectionTestResult> {
  const startTime = performance.now();
  const targetUrl = (customUrl || DEFAULT_SUPABASE_URL).trim();
  const targetKey = (customKey || DEFAULT_SUPABASE_ANON_KEY).trim();

  const steps: ConnectionTestResult['steps'] = [];
  let overallSuccess = true;
  let summary = '';

  // Step 1: Validate URL & Key format
  const step1Start = performance.now();
  try {
    const parsed = new URL(targetUrl);
    if (!parsed.protocol.startsWith('http')) {
      throw new Error('URL 必须以 http:// 或 https:// 开头');
    }
    if (!targetKey) {
      throw new Error('Supabase Publishable / Anon Key 不能为空');
    }
    steps.push({
      name: '参数校验',
      status: 'success',
      message: `Supabase URL 与 API Key 格式正确 (${parsed.hostname})`,
      durationMs: Math.round(performance.now() - step1Start)
    });
  } catch (err: any) {
    steps.push({
      name: '参数校验',
      status: 'failed',
      message: `参数格式错误: ${err.message}`,
      durationMs: Math.round(performance.now() - step1Start)
    });
    return {
      success: false,
      timestamp: new Date().toISOString(),
      latencyMs: Math.round(performance.now() - startTime),
      url: targetUrl,
      steps,
      summary: '参数格式不合法，连接测试中止',
      error: err.message
    };
  }

  // Create temporary client for test
  const client = createClient(targetUrl, targetKey);

  // Step 2: Test REST API / Health Endpoint
  const step2Start = performance.now();
  try {
    const healthUrl = `${targetUrl.replace(/\/$/, '')}/rest/v1/`;
    const res = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'apikey': targetKey,
        'Authorization': `Bearer ${targetKey}`
      }
    });

    const duration = Math.round(performance.now() - step2Start);
    if (res.ok || res.status === 200 || res.status === 404 || res.status === 401 || res.status === 400) {
      // 200: Open/Schema info; 401: Invalid key; 404/others: Server reachable
      if (res.status === 401) {
        steps.push({
          name: 'REST API 握手',
          status: 'warning',
          message: `服务器响应 401 Unauthorized，请核对 API Key 是否有效`,
          details: { status: res.status, statusText: res.statusText },
          durationMs: duration
        });
      } else {
        steps.push({
          name: 'REST API 握手',
          status: 'success',
          message: `Supabase PostgREST 服务连接成功 (HTTP ${res.status} ${res.statusText || 'OK'})`,
          details: { status: res.status, statusText: res.statusText },
          durationMs: duration
        });
      }
    } else {
      steps.push({
        name: 'REST API 握手',
        status: 'warning',
        message: `HTTP 响应状态码: ${res.status} ${res.statusText}`,
        details: { status: res.status },
        durationMs: duration
      });
    }
  } catch (err: any) {
    steps.push({
      name: 'REST API 握手',
      status: 'failed',
      message: `网络请求失败: ${err.message || '可能存在跨域或网络阻止'}`,
      durationMs: Math.round(performance.now() - step2Start)
    });
    overallSuccess = false;
  }

  // Step 3: Test Auth Service
  const step3Start = performance.now();
  try {
    const { data, error } = await client.auth.getSession();
    const duration = Math.round(performance.now() - step3Start);
    if (error) {
      steps.push({
        name: 'Auth 身份认证服务',
        status: 'warning',
        message: `Auth 提示: ${error.message}`,
        details: error,
        durationMs: duration
      });
    } else {
      steps.push({
        name: 'Auth 身份认证服务',
        status: 'success',
        message: `Auth 服务响应正常 (当前会话: ${data.session ? '已登录' : '游客/未登录'})`,
        details: { hasSession: !!data.session },
        durationMs: duration
      });
    }
  } catch (err: any) {
    steps.push({
      name: 'Auth 身份认证服务',
      status: 'warning',
      message: `Auth 检查异常: ${err.message}`,
      durationMs: Math.round(performance.now() - step3Start)
    });
  }

  // Step 4: Test Database Table Query
  const step4Start = performance.now();
  try {
    // Try querying a generic or test query
    const { error: queryError } = await client
      .from('lineage_persons')
      .select('count', { count: 'exact', head: true });

    const duration = Math.round(performance.now() - step4Start);
    if (!queryError) {
      steps.push({
        name: '数据表探测 (lineage_persons)',
        status: 'success',
        message: `数据表 'lineage_persons' 已存在并可正常查询访问`,
        durationMs: duration
      });
    } else {
      // 42P01 in postgres means relation does not exist
      if (queryError.code === '42P01' || queryError.message.includes('does not exist')) {
        steps.push({
          name: '数据表探测 (lineage_persons)',
          status: 'success',
          message: `数据库连接正常 (表 'lineage_persons' 尚未创建，可一键执行 SQL 初始化)`,
          details: queryError,
          durationMs: duration
        });
      } else {
        steps.push({
          name: '数据表探测',
          status: 'warning',
          message: `表访问提示 (${queryError.code || 'Info'}): ${queryError.message}`,
          details: queryError,
          durationMs: duration
        });
      }
    }
  } catch (err: any) {
    steps.push({
      name: '数据表探测',
      status: 'warning',
      message: `查询异常: ${err.message}`,
      durationMs: Math.round(performance.now() - step4Start)
    });
  }

  const totalDuration = Math.round(performance.now() - startTime);

  const hasFailedStep = steps.some(s => s.status === 'failed');
  overallSuccess = !hasFailedStep;

  if (overallSuccess) {
    summary = `数据库连接测试成功！耗时 ${totalDuration}ms，Supabase 服务响应正常。`;
  } else {
    summary = `数据库连接测试遇到问题，请检查网络或 API Key 设置。`;
  }

  return {
    success: overallSuccess,
    timestamp: new Date().toISOString(),
    latencyMs: totalDuration,
    url: targetUrl,
    steps,
    summary
  };
}

export const RECOMMENDED_SQL_SCHEMA = `-- 建议在 Supabase SQL Editor 中执行以下脚本，以创建族谱与人物云端数据表：

-- 1. 族谱分支表 (lineage_branches)
CREATE TABLE IF NOT EXISTS public.lineage_branches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'branch',
  parent_id TEXT,
  generation_count INT DEFAULT 1,
  member_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. 谱系人物档案表 (lineage_persons)
CREATE TABLE IF NOT EXISTS public.lineage_persons (
  id TEXT PRIMARY KEY,
  branch_id TEXT REFERENCES public.lineage_branches(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female')) DEFAULT 'male',
  generation INT NOT NULL DEFAULT 1,
  birth_year TEXT,
  death_year TEXT,
  is_alive BOOLEAN DEFAULT true,
  father_id TEXT,
  mother_name TEXT,
  spouse_name TEXT,
  biography TEXT,
  order_in_branch INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 启用 RLS (行级安全策略)
ALTER TABLE public.lineage_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lineage_persons ENABLE ROW LEVEL SECURITY;

-- 4. 允许公开读取或通过 Anon Key 操作 (可按需调整安全权限)
CREATE POLICY "Allow public read access on branches" ON public.lineage_branches FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on branches" ON public.lineage_branches FOR ALL USING (true);

CREATE POLICY "Allow public read access on persons" ON public.lineage_persons FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on persons" ON public.lineage_persons FOR ALL USING (true);
`;
