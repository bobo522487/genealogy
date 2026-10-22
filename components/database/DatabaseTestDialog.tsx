import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Server, 
  Code2, 
  ArrowRight,
  X,
  CloudUpload,
  Radio
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  DEFAULT_SUPABASE_URL, 
  DEFAULT_SUPABASE_ANON_KEY, 
  testSupabaseConnection, 
  ConnectionTestResult,
  RECOMMENDED_SQL_SCHEMA,
  createCustomSupabaseClient
} from '../../lib/supabase';
import { useAppStore } from '../../store/useAppStore';

interface DatabaseTestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  autoRun?: boolean;
}

export const DatabaseTestDialog: React.FC<DatabaseTestDialogProps> = ({
  isOpen,
  onClose,
  autoRun = false
}) => {
  const { persons, branches } = useAppStore();
  const [supabaseUrl, setSupabaseUrl] = useState(DEFAULT_SUPABASE_URL);
  const [supabaseKey, setSupabaseKey] = useState(DEFAULT_SUPABASE_ANON_KEY);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [activeTab, setActiveTab] = useState<'diagnostic' | 'sync' | 'sql' | 'env'>('diagnostic');
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleRunTest = async (url = supabaseUrl, key = supabaseKey) => {
    setTesting(true);
    setSyncResult(null);
    try {
      const res = await testSupabaseConnection(url, key);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        timestamp: new Date().toISOString(),
        latencyMs: 0,
        url,
        steps: [
          {
            name: '连接异常',
            status: 'failed',
            message: err.message || '未知错误'
          }
        ],
        summary: '测试过程中发生未知异常',
        error: err.message
      });
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    if (isOpen && (autoRun || !testResult)) {
      handleRunTest();
    }
  }, [isOpen]);

  const handleCopySql = () => {
    navigator.clipboard?.writeText(RECOMMENDED_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleCopyEnv = () => {
    const envText = `VITE_SUPABASE_URL=${supabaseUrl}\nVITE_SUPABASE_ANON_KEY=${supabaseKey}\nNEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}\nNEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${supabaseKey}`;
    navigator.clipboard?.writeText(envText);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const handleSyncDataToSupabase = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const client = createCustomSupabaseClient(supabaseUrl, supabaseKey);

      // Attempt to upsert branches
      const branchPayloads = branches.map(b => ({
        id: b.id,
        name: b.name,
        type: b.type,
        parent_id: b.parentId || null,
        generation_count: b.generationCount || 1,
        member_count: b.memberCount || 0,
        updated_at: new Date().toISOString()
      }));

      const { error: branchErr } = await client
        .from('lineage_branches')
        .upsert(branchPayloads);

      if (branchErr) {
        if (branchErr.code === '42P01') {
          throw new Error("云端表 'lineage_branches' 不存在，请先在 Supabase 执行【SQL 架构】标签页中的建表脚本！");
        }
        throw branchErr;
      }

      // Attempt to upsert persons
      const personPayloads = persons.map(p => ({
        id: p.id,
        branch_id: p.branchId || null,
        name: p.name,
        gender: p.gender || 'male',
        generation: p.generation || 1,
        birth_year: p.birthYear || null,
        death_year: p.deathYear || null,
        is_alive: p.isAlive ?? true,
        father_id: p.fatherId || null,
        mother_name: p.motherName || null,
        spouse_name: p.spouseName || null,
        biography: p.biography || null,
        order_in_branch: p.order || 0,
        updated_at: new Date().toISOString()
      }));

      const { error: personErr } = await client
        .from('lineage_persons')
        .upsert(personPayloads);

      if (personErr) {
        if (personErr.code === '42P01') {
          throw new Error("云端表 'lineage_persons' 不存在，请先在 Supabase 执行【SQL 架构】标签页中的建表脚本！");
        }
        throw personErr;
      }

      setSyncResult({
        success: true,
        message: `成功将 ${branches.length} 个分支和 ${persons.length} 位族人数据同步到 Supabase 云端数据库！`
      });
    } catch (err: any) {
      setSyncResult({
        success: false,
        message: `同步失败: ${err.message || '请确保已在 Supabase 创建相关数据表并配置读写权限。'}`
      });
    } finally {
      setSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      id="modal-supabase-test-dialog"
      className="fixed inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
    >
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Database size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">Supabase 数据库连接测试与配置</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  PostgreSQL
                </span>
              </div>
              <p className="text-xs text-muted-foreground">测试与管理云端数据库实例与数据同步服务</p>
            </div>
          </div>
          <button 
            id="btn-close-supabase-modal"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-border bg-muted/10 px-6 pt-2 gap-2 text-xs font-medium">
          <button
            id="tab-diagnostic"
            onClick={() => setActiveTab('diagnostic')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'diagnostic' 
                ? 'border-primary text-primary font-semibold' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Radio size={14} />
            连接诊断与测试
          </button>
          <button
            id="tab-sync"
            onClick={() => setActiveTab('sync')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'sync' 
                ? 'border-primary text-primary font-semibold' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <CloudUpload size={14} />
            云端数据同步
          </button>
          <button
            id="tab-sql"
            onClick={() => setActiveTab('sql')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'sql' 
                ? 'border-primary text-primary font-semibold' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Code2 size={14} />
            SQL 架构脚本
          </button>
          <button
            id="tab-env"
            onClick={() => setActiveTab('env')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'env' 
                ? 'border-primary text-primary font-semibold' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Server size={14} />
            环境变量参考
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          
          {/* Configuration Inputs */}
          <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
            <div>
              <label className="block font-medium text-foreground mb-1">
                Supabase URL (项目地址)
              </label>
              <Input 
                id="input-supabase-url"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="h-8 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-foreground mb-1">
                Supabase Publishable / Anon API Key (公开访问秘钥)
              </label>
              <Input 
                id="input-supabase-key"
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="sb_publishable_... 或 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="h-8 text-xs font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                <ShieldCheck size={13} className="text-emerald-500" />
                <span>客户端安全 Key，适用于浏览器端公开访问与 RLS 控制</span>
              </div>

              <Button 
                id="btn-run-supabase-test"
                size="sm" 
                onClick={() => handleRunTest()} 
                disabled={testing}
                className="h-8 gap-1.5 font-medium shadow-xs"
              >
                {testing ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>正在测试连接...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={13} />
                    <span>立即测试连接</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* TAB 1: DIAGNOSTIC */}
          {activeTab === 'diagnostic' && (
            <div className="space-y-4">
              {testResult ? (
                <>
                  {/* Overall Result Banner */}
                  <div className={`p-3.5 rounded-lg border flex items-start gap-3 ${
                    testResult.success 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200' 
                      : 'bg-destructive/10 border-destructive/30 text-destructive'
                  }`}>
                    {testResult.success ? (
                      <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={20} className="text-destructive shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-sm flex items-center justify-between">
                        <span>{testResult.success ? '数据库连接通畅！' : '连接失败'}</span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-background/50 border border-border">
                          延迟: {testResult.latencyMs} ms
                        </span>
                      </div>
                      <p className="mt-1 text-xs opacity-90">{testResult.summary}</p>
                    </div>
                  </div>

                  {/* Step by Step list */}
                  <div className="border border-border rounded-lg divide-y divide-border overflow-hidden">
                    {testResult.steps.map((step, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between bg-card hover:bg-muted/20 transition-colors">
                        <div className="flex items-center gap-2.5">
                          {step.status === 'success' && (
                            <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                          )}
                          {step.status === 'warning' && (
                            <AlertTriangle size={15} className="text-amber-500 shrink-0" />
                          )}
                          {step.status === 'failed' && (
                            <XCircle size={15} className="text-destructive shrink-0" />
                          )}
                          <div>
                            <div className="font-medium text-foreground">{step.name}</div>
                            <div className="text-muted-foreground text-[11px]">{step.message}</div>
                          </div>
                        </div>

                        {step.durationMs !== undefined && (
                          <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {step.durationMs}ms
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Quick Action links */}
                  <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
                    <span>测试时间: {new Date(testResult.timestamp).toLocaleString()}</span>
                    <a 
                      href={supabaseUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      <span>前往 Supabase 控制台</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                  <Database size={28} className="text-muted-foreground/50" />
                  <p>点击上方“立即测试连接”按钮检测数据库连通性</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SYNC */}
          {activeTab === 'sync' && (
            <div className="space-y-4">
              <div className="bg-muted/20 border border-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground text-xs mb-1 flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-500" />
                  云谱数据与 Supabase 云端同步
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  将当前本地录入的谱系世系、族人档案数据一键推送并保存至 Supabase PostgreSQL 数据库，实现多人协同与云端长期归档。
                </p>

                <div className="grid grid-cols-2 gap-3 my-3">
                  <div className="p-2.5 rounded-md border border-border bg-card">
                    <div className="text-muted-foreground text-[11px]">待同步世系分支</div>
                    <div className="text-base font-bold text-foreground mt-0.5">{branches.length} 个</div>
                  </div>
                  <div className="p-2.5 rounded-md border border-border bg-card">
                    <div className="text-muted-foreground text-[11px]">待同步族人档案</div>
                    <div className="text-base font-bold text-foreground mt-0.5">{persons.length} 位</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-muted-foreground">
                    提示：同步前请确认已在 Supabase 执行建表 SQL。
                  </span>
                  <Button 
                    id="btn-sync-to-supabase"
                    size="sm"
                    onClick={handleSyncDataToSupabase}
                    disabled={syncing}
                    className="gap-1.5"
                  >
                    {syncing ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>正在同步数据...</span>
                      </>
                    ) : (
                      <>
                        <CloudUpload size={13} />
                        <span>开始同步到 Supabase</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {syncResult && (
                <div className={`p-3.5 rounded-lg border flex items-start gap-2.5 ${
                  syncResult.success 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200' 
                    : 'bg-destructive/10 border-destructive/30 text-destructive'
                }`}>
                  {syncResult.success ? (
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle size={16} className="text-destructive shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 text-xs">{syncResult.message}</div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SQL SCHEMA */}
          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  在 Supabase 控制台的 <strong>SQL Editor</strong> 中运行此建表脚本：
                </span>
                <Button 
                  id="btn-copy-supabase-sql"
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopySql} 
                  className="h-7 text-xs gap-1"
                >
                  {copiedSql ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  <span>{copiedSql ? '已复制' : '复制 SQL 脚本'}</span>
                </Button>
              </div>

              <pre className="p-3 bg-muted/60 border border-border rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto text-foreground max-h-56">
                {RECOMMENDED_SQL_SCHEMA}
              </pre>
            </div>
          )}

          {/* TAB 4: ENV */}
          {activeTab === 'env' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  用于本地或生产环境的 <code>.env</code> 环境变量：
                </span>
                <Button 
                  id="btn-copy-supabase-env"
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyEnv} 
                  className="h-7 text-xs gap-1"
                >
                  {copiedEnv ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  <span>{copiedEnv ? '已复制' : '复制环境变量'}</span>
                </Button>
              </div>

              <pre className="p-3 bg-muted/60 border border-border rounded-lg font-mono text-[11px] leading-relaxed text-foreground">
                {`# Supabase Configuration
VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseKey}

# Next.js / Standard Public Alias
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${supabaseKey}`}
              </pre>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-border bg-muted/20 flex items-center justify-between">
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>数据库状态：{testResult?.success ? '已连接 (Ready)' : (testing ? '检测中...' : '准备就绪')}</span>
          </div>

          <Button 
            id="btn-confirm-close-supabase-modal"
            size="sm" 
            onClick={onClose}
          >
            完成
          </Button>
        </div>
      </div>
    </div>
  );
};
