import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Clock, 
  Terminal, 
  Users, 
  Database, 
  CreditCard,
  Lock
} from 'lucide-react';
import { Input } from '../../../../components/ui/input';
import { Badge } from '../../../../components/ui/badge';
import { useAppStore } from '../../../../store/useAppStore';

export const OrgAuditLogs: React.FC = () => {
  const { auditLogs, activeOrgId, organizations } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const activeOrg = organizations.find(o => o.id === activeOrgId) || organizations[0];
  const orgLogs = auditLogs.filter(l => l.organizationId === activeOrg?.id);

  const filteredLogs = orgLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'ALL' || log.type === filterType;

    return matchesSearch && matchesType;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'project':
        return <Badge variant="outline" className="text-[10px] text-blue-500 border-blue-500/30 bg-blue-500/5">Project</Badge>;
      case 'team':
        return <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/30 bg-emerald-500/5">Team</Badge>;
      case 'billing':
        return <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/30 bg-amber-500/5">Billing</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] text-purple-500 border-purple-500/30 bg-purple-500/5">Security</Badge>;
    }
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="搜索审计日志、操作人或目标对象..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8.5 pl-9 text-xs bg-background"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-8.5 rounded-md border border-input bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="ALL">全部操作类型</option>
          <option value="project">项目相关 (Project)</option>
          <option value="team">团队权限 (Team)</option>
          <option value="billing">账单计费 (Billing)</option>
          <option value="security">安全策略 (Security)</option>
        </select>
      </div>

      <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-4">操作人 (Actor)</th>
                <th className="py-2.5 px-4">事件操作 (Action)</th>
                <th className="py-2.5 px-4">目标对象 (Target)</th>
                <th className="py-2.5 px-4">类型</th>
                <th className="py-2.5 px-4 font-mono">时间 (Timestamp)</th>
                <th className="py-2.5 px-4 text-right font-mono">IP 地址</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      {log.actorAvatar ? (
                        <img src={log.actorAvatar} alt={log.actor} className="w-5 h-5 rounded-full object-cover" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                          {log.actor.charAt(0)}
                        </div>
                      )}
                      <span>{log.actor}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-foreground">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground font-mono text-[11px] truncate max-w-[200px]">
                    {log.target}
                  </td>
                  <td className="py-3 px-4">
                    {getTypeBadge(log.type)}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground font-mono text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 text-right text-muted-foreground font-mono text-[11px]">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="p-8 text-center text-xs text-muted-foreground">
            暂无审计日志记录
          </div>
        )}
      </div>
    </div>
  );
};
