import React, { useState } from 'react';
import { 
  UserPlus, 
  Mail, 
  ShieldCheck, 
  Check, 
  UserCheck, 
  Crown, 
  Code, 
  Eye, 
  Sparkles
} from 'lucide-react';
import { 
  Dialog, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogContent, 
  DialogFooter, 
  DialogClose 
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { Badge } from '../../../../components/ui/badge';
import { useAppStore } from '../../../../store/useAppStore';
import { TeamMember, TeamRole } from '../../types';

interface InviteMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ROLES: { id: TeamRole; name: string; icon: any; color: string; desc: string; permissions: string[] }[] = [
  {
    id: 'Admin',
    name: 'Admin (编委会副主编/管理员)',
    icon: ShieldCheck,
    color: 'text-amber-500',
    desc: '拥有创建与管理项目、配置数据库、管理除所有者外成员的完整权限。',
    permissions: ['管理所有项目', '配置组织与计费', '邀请与管理成员', '访问所有数据库密钥']
  },
  {
    id: 'Developer',
    name: 'Developer (修谱编撰工程师)',
    icon: Code,
    color: 'text-blue-500',
    desc: '拥有所有项目的读写权限，可录入世系数据、调试 API 与运行 SQL 语句。',
    permissions: ['读取与写入数据', '运行 SQL 查询', '管理世系与人物', '查看只读凭据']
  },
  {
    id: 'Read-only',
    name: 'Read-only (文史顾问/校对审阅员)',
    icon: Eye,
    color: 'text-emerald-500',
    desc: '仅具备查看项目数据与世系图权限，无法修改数据表或项目基础设置。',
    permissions: ['查看世系图谱', '浏览族人档案', '提交审阅批注', '无写操作权限']
  },
];

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  open,
  onOpenChange
}) => {
  const { addTeamMember, activeOrgId, organizations } = useAppStore();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<TeamRole>('Developer');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const activeOrg = organizations.find(o => o.id === activeOrgId) || organizations[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('请输入受邀人电子邮箱');
      return;
    }

    const newMember: TeamMember = {
      id: `tm-${Date.now().toString(36)}`,
      organizationId: activeOrg?.id || 'org-chen-lineage',
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      role: selectedRole,
      joinedAt: new Date().toISOString().substring(0, 10),
      status: 'invited'
    };

    addTeamMember(newMember);
    onOpenChange(false);

    // Reset
    setEmail('');
    setName('');
    setSelectedRole('Developer');
    setMessage('');
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <UserPlus size={18} className="text-primary" />
          <span>邀请团队成员 (Invite Team Member)</span>
        </DialogTitle>
        <DialogDescription>
          邀请修谱宗亲、编委成员或技术开发者共同参与 <strong className="text-foreground">{activeOrg?.name}</strong> 组织的协同修谱。
        </DialogDescription>
        <DialogClose onClose={() => onOpenChange(false)} />
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <DialogContent className="space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="member-email" className="text-xs font-medium">
              受邀人电子邮箱 (Email Address) <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="member-email"
                type="email"
                placeholder="colleague@lineage.org 或宗亲邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9 pl-9 text-xs"
              />
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="member-name" className="text-xs font-medium">
              姓名 / 尊称 (可选)
            </Label>
            <Input
              id="member-name"
              placeholder="例如：陈文礼 (二十二世)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-2 pt-1">
            <Label className="text-xs font-medium">分配权限角色 (Assign Role)</Label>
            <div className="space-y-2">
              {ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border bg-card hover:bg-muted/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className={role.color} />
                        <span className="text-xs font-bold text-foreground">{role.name}</span>
                      </div>
                      {isSelected && <Check size={14} className="text-primary" />}
                    </div>
                    
                    <p className="text-[11px] text-muted-foreground mt-1 pl-6 leading-relaxed">
                      {role.desc}
                    </p>

                    {isSelected && (
                      <div className="flex flex-wrap gap-1 mt-2 pl-6">
                        {role.permissions.map((p) => (
                          <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                            ✓ {p}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label htmlFor="member-msg" className="text-xs font-medium">
              附带邀请留言 (可选)
            </Label>
            <Textarea
              id="member-msg"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="诚邀您加入陈氏数字化修谱编委会，参与第八次大统宗谱校对与整理..."
              className="text-xs resize-none"
            />
          </div>
        </DialogContent>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            取消
          </Button>
          <Button
            type="submit"
            size="sm"
            className="text-xs font-semibold shadow-xs"
          >
            发送邀请邮件
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};
