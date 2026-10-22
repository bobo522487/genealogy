import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Code, 
  Eye, 
  Crown, 
  MoreVertical, 
  Trash2, 
  Mail, 
  Clock, 
  Check, 
  RotateCw,
  UserX
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Badge } from '../../../../components/ui/badge';
import { 
  Dialog, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogContent, 
  DialogFooter, 
  DialogClose 
} from '../../../../components/ui/dialog';
import { useAppStore } from '../../../../store/useAppStore';
import { TeamMember, TeamRole } from '../../types';
import { InviteMemberModal } from './InviteMemberModal';

export const TeamMemberList: React.FC = () => {
  const { 
    teamMembers, 
    activeOrgId, 
    updateTeamMemberRole, 
    deleteTeamMember,
    organizations 
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | TeamRole>('ALL');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [resendSuccessId, setResendSuccessId] = useState<string | null>(null);

  const activeOrg = organizations.find(o => o.id === activeOrgId) || organizations[0];
  const orgMembers = teamMembers.filter(m => m.organizationId === activeOrg?.id);

  const filteredMembers = useMemo(() => {
    return orgMembers.filter(m => {
      const matchesSearch = 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'ALL' || m.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [orgMembers, searchQuery, roleFilter]);

  const handleResendInvite = (member: TeamMember) => {
    setResendSuccessId(member.id);
    setTimeout(() => setResendSuccessId(null), 2500);
  };

  const getRoleIcon = (role: TeamRole) => {
    switch (role) {
      case 'Owner':
        return <Crown size={14} className="text-amber-500" />;
      case 'Admin':
        return <ShieldCheck size={14} className="text-amber-600 dark:text-amber-400" />;
      case 'Developer':
        return <Code size={14} className="text-blue-500" />;
      case 'Read-only':
        return <Eye size={14} className="text-emerald-500" />;
    }
  };

  const getRoleBadge = (role: TeamRole) => {
    switch (role) {
      case 'Owner':
        return <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] py-0 px-2 font-semibold">Owner (所有者)</Badge>;
      case 'Admin':
        return <Badge className="bg-amber-600/15 text-amber-700 dark:text-amber-300 border-amber-600/30 text-[10px] py-0 px-2 font-semibold">Admin (编委主编)</Badge>;
      case 'Developer':
        return <Badge className="bg-blue-600/15 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] py-0 px-2 font-semibold">Developer (修谱编撰)</Badge>;
      case 'Read-only':
        return <Badge className="bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] py-0 px-2 font-semibold">Read-only (校对审阅)</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="搜索成员姓名、邮箱或角色..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9 text-xs bg-background"
          />
        </div>

        {/* Filters and CTA */}
        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="h-8.5 rounded-md border border-input bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">全部角色 ({orgMembers.length})</option>
            <option value="Owner">所有者 (Owner)</option>
            <option value="Admin">管理员 (Admin)</option>
            <option value="Developer">编撰工程师 (Developer)</option>
            <option value="Read-only">审阅员 (Read-only)</option>
          </select>

          <Button
            type="button"
            size="sm"
            onClick={() => setIsInviteOpen(true)}
            className="h-8.5 text-xs gap-1.5 font-semibold shadow-xs"
          >
            <UserPlus size={14} />
            <span>邀请成员 (Invite)</span>
          </Button>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">成员信息 (User)</th>
                <th className="py-3 px-4">组织角色 (Role)</th>
                <th className="py-3 px-4">加入状态 (Status)</th>
                <th className="py-3 px-4">加入时间 (Joined)</th>
                <th className="py-3 px-4 text-right">操作 (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredMembers.map((member) => {
                const isOwner = member.role === 'Owner';
                return (
                  <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                    
                    {/* User Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-9 h-9 rounded-full object-cover border border-border shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                            {member.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-foreground flex items-center gap-1.5">
                            <span>{member.name}</span>
                            {member.isCurrentUser && (
                              <Badge variant="outline" className="text-[9px] py-0 px-1 font-normal bg-muted/60">您自己</Badge>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role selector or badge */}
                    <td className="py-3.5 px-4">
                      {isOwner ? (
                        getRoleBadge(member.role)
                      ) : (
                        <select
                          value={member.role}
                          onChange={(e) => updateTeamMemberRole(member.id, e.target.value as TeamRole)}
                          className="h-7 rounded-md border border-input bg-background px-2 py-0 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                        >
                          <option value="Admin">Admin (管理员)</option>
                          <option value="Developer">Developer (编撰)</option>
                          <option value="Read-only">Read-only (审阅)</option>
                        </select>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {member.status === 'active' ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>已加入</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                          <Clock size={12} />
                          <span>已发送邀请</span>
                        </div>
                      )}
                    </td>

                    {/* Joined date */}
                    <td className="py-3.5 px-4 text-muted-foreground font-mono text-[11px]">
                      {member.joinedAt}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {member.status === 'invited' && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResendInvite(member)}
                            className="h-7 px-2 text-[11px] text-primary hover:bg-primary/10 gap-1"
                          >
                            {resendSuccessId === member.id ? (
                              <>
                                <Check size={11} className="text-emerald-500" />
                                <span className="text-emerald-500">已重发</span>
                              </>
                            ) : (
                              <>
                                <RotateCw size={11} />
                                <span>重发邀请</span>
                              </>
                            )}
                          </Button>
                        )}

                        {!isOwner && !member.isCurrentUser && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setMemberToDelete(member)}
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            title="移出组织"
                          >
                            <Trash2 size={13} />
                          </Button>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="p-8 text-center text-xs text-muted-foreground">
            没有找到匹配的团队成员
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <InviteMemberModal
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
      />

      {/* Delete Member Confirmation */}
      <Dialog open={!!memberToDelete} onOpenChange={(open) => !open && setMemberToDelete(null)}>
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <UserX size={18} />
            <span>移除团队成员</span>
          </DialogTitle>
          <DialogDescription>
            确认将 <strong className="text-foreground">{memberToDelete?.name}</strong> ({memberToDelete?.email}) 移出当前组织？该成员将失去对所有项目的访问权限。
          </DialogDescription>
          <DialogClose onClose={() => setMemberToDelete(null)} />
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMemberToDelete(null)}
            className="text-xs"
          >
            取消
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              if (memberToDelete) {
                deleteTeamMember(memberToDelete.id);
                setMemberToDelete(null);
              }
            }}
            className="text-xs font-semibold"
          >
            确认移出
          </Button>
        </DialogFooter>
      </Dialog>

    </div>
  );
};
