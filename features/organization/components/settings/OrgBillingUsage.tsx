import React, { useState } from 'react';
import { 
  CreditCard, 
  Sparkles, 
  Check, 
  HardDrive, 
  Database, 
  Activity, 
  Users, 
  FileText, 
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { useAppStore } from '../../../../store/useAppStore';

export const OrgBillingUsage: React.FC = () => {
  const { 
    organizations, 
    activeOrgId, 
    billingUsage, 
    projects,
    teamMembers 
  } = useAppStore();

  const activeOrg = organizations.find(o => o.id === activeOrgId) || organizations[0];
  const orgProjects = projects.filter(p => p.organizationId === activeOrg?.id);

  const [isUpgraded, setIsUpgraded] = useState(false);

  // Storage calculation
  const totalDbStorageMb = orgProjects.reduce((acc, p) => acc + parseFloat(p.storageUsed || '0'), 0);

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Current Plan Overview Card */}
      <div className="bg-card border border-border/80 rounded-xl p-5 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">当前订阅套餐：</span>
              <Badge className="bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs py-0.5 px-2.5 font-bold">
                {activeOrg?.plan || 'Pro'} 专业版
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-foreground">
              $25.00 <span className="text-xs text-muted-foreground font-normal">/ 月 (按月结算)</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              下次自动账单计费日：<span className="font-mono text-foreground font-medium">{billingUsage.nextBillingDate}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-8.5 gap-1.5"
            >
              <CreditCard size={13} />
              <span>更新付款方式</span>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={() => setIsUpgraded(true)}
              className="text-xs h-8.5 gap-1.5 font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
            >
              <Sparkles size={13} />
              <span>{isUpgraded ? '已是企业尊享计划' : '升级至 Enterprise'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Resource Usage Breakdown (Meters) */}
      <div className="bg-card border border-border/80 rounded-xl p-5 shadow-xs space-y-4">
        <div className="border-b border-border/60 pb-3">
          <h3 className="font-bold text-sm text-foreground">资源配额与使用量概览 (Resource Usage)</h3>
          <p className="text-xs text-muted-foreground">实时统计组织内所有项目的数据库存储、带宽消耗与活跃认证数</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Meter 1: Projects Count */}
          <div className="p-3.5 rounded-lg bg-muted/30 border border-border/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <Database size={14} className="text-primary" />
                <span>运行中项目 (Active Projects)</span>
              </div>
              <span className="font-mono text-muted-foreground">
                {orgProjects.length} / {billingUsage.projectsLimit} 个
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all" 
                style={{ width: `${(orgProjects.length / billingUsage.projectsLimit) * 100}%` }} 
              />
            </div>
            <div className="text-[10px] text-muted-foreground">
              当前组织已使用 {((orgProjects.length / billingUsage.projectsLimit) * 100).toFixed(0)}% 项目配额
            </div>
          </div>

          {/* Meter 2: Database Storage */}
          <div className="p-3.5 rounded-lg bg-muted/30 border border-border/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <HardDrive size={14} className="text-emerald-500" />
                <span>数据库占用容量 (Database Storage)</span>
              </div>
              <span className="font-mono text-muted-foreground">
                {totalDbStorageMb.toFixed(1)} MB / 8.00 GB
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all" 
                style={{ width: `${(totalDbStorageMb / 8192) * 100 + 1}%` }} 
              />
            </div>
            <div className="text-[10px] text-muted-foreground">
              包含 PostgreSQL 结构表、世系拓扑图与人物档案索引数据
            </div>
          </div>

          {/* Meter 3: Bandwidth */}
          <div className="p-3.5 rounded-lg bg-muted/30 border border-border/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <Activity size={14} className="text-blue-500" />
                <span>月度出网流量 (Egress Bandwidth)</span>
              </div>
              <span className="font-mono text-muted-foreground">
                {billingUsage.bandwidthUsedGb} GB / {billingUsage.bandwidthLimitGb} GB
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all" 
                style={{ width: `${(billingUsage.bandwidthUsedGb / billingUsage.bandwidthLimitGb) * 100}%` }} 
              />
            </div>
            <div className="text-[10px] text-muted-foreground">
              当前消耗仅占总配额的 1.9%，服务平稳高速
            </div>
          </div>

          {/* Meter 4: Auth Users */}
          <div className="p-3.5 rounded-lg bg-muted/30 border border-border/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <Users size={14} className="text-purple-500" />
                <span>月活跃族人/用户数 (Monthly Active Users)</span>
              </div>
              <span className="font-mono text-muted-foreground">
                {billingUsage.authUsersCount} / {billingUsage.authUsersLimit.toLocaleString()} 位
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 rounded-full transition-all" 
                style={{ width: `${(billingUsage.authUsersCount / billingUsage.authUsersLimit) * 100}%` }} 
              />
            </div>
            <div className="text-[10px] text-muted-foreground">
              支持短信验证码、微信扫码与邮箱直连身份鉴权
            </div>
          </div>

        </div>
      </div>

      {/* Plan Features Checklist */}
      <div className="bg-card border border-border/80 rounded-xl p-5 shadow-xs space-y-3">
        <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">
          Pro 计划专属特权权益
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Check size={14} className="text-emerald-500 shrink-0" />
            <span>无项目休眠限制 (Projects never pause)</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Check size={14} className="text-emerald-500 shrink-0" />
            <span>每日 7 天自动点对点备份 (PITR Recovery)</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Check size={14} className="text-emerald-500 shrink-0" />
            <span>支持微服务连接池 (PgBouncer Pooler)</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Check size={14} className="text-emerald-500 shrink-0" />
            <span>编委会多人协同与自定义角色权限 (RBAC)</span>
          </div>
        </div>
      </div>

    </div>
  );
};
