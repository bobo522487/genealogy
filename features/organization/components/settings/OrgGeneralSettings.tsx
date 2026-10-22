import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Trash2, 
  AlertTriangle, 
  Check, 
  Copy, 
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
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
import { Organization } from '../../types';

export const OrgGeneralSettings: React.FC = () => {
  const { 
    organizations, 
    activeOrgId, 
    updateOrganization, 
    deleteOrganization 
  } = useAppStore();

  const activeOrg = organizations.find(o => o.id === activeOrgId) || organizations[0];

  const [name, setName] = useState(activeOrg?.name || '');
  const [slug, setSlug] = useState(activeOrg?.slug || '');
  const [description, setDescription] = useState(activeOrg?.description || '');
  const [billingEmail, setBillingEmail] = useState(activeOrg?.billingEmail || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Sync state when activeOrg changes
  React.useEffect(() => {
    if (activeOrg) {
      setName(activeOrg.name);
      setSlug(activeOrg.slug);
      setDescription(activeOrg.description || '');
      setBillingEmail(activeOrg.billingEmail || '');
    }
  }, [activeOrg]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrg) return;

    updateOrganization(activeOrg.id, {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      billingEmail: billingEmail.trim()
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDeleteOrg = () => {
    if (activeOrg && deleteConfirmInput === activeOrg.name) {
      deleteOrganization(activeOrg.id);
      setIsDeleteOpen(false);
    }
  };

  if (!activeOrg) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Save Alert */}
      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <Check size={15} className="text-emerald-600 dark:text-emerald-400" />
          <span>组织设置已成功保存并实时同步！</span>
        </div>
      )}

      {/* General Form */}
      <form onSubmit={handleSave} className="bg-card border border-border/80 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <h3 className="font-bold text-sm text-foreground">常规信息 (General Settings)</h3>
            <p className="text-xs text-muted-foreground">修改组织的公开展示名称、标识符与通知邮箱</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>创建时间：</span>
            <span className="font-mono text-foreground font-medium">{activeOrg.createdAt}</span>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="edit-org-name" className="text-xs font-medium">
            组织名称 (Organization Name) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="edit-org-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-9 text-xs"
          />
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <Label htmlFor="edit-org-slug" className="text-xs font-medium">
            组织 Slug (唯一 URL 标识)
          </Label>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground bg-muted/50 px-2.5 py-2 rounded-l-md border border-r-0 border-input select-none font-mono">
              supabase.com/org/
            </span>
            <Input
              id="edit-org-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="h-9 text-xs rounded-l-none font-mono"
            />
          </div>
        </div>

        {/* Billing Email */}
        <div className="space-y-1.5">
          <Label htmlFor="edit-org-email" className="text-xs font-medium">
            账单与安全通知邮箱 (Notification & Billing Email)
          </Label>
          <Input
            id="edit-org-email"
            type="email"
            value={billingEmail}
            onChange={(e) => setBillingEmail(e.target.value)}
            className="h-9 text-xs"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="edit-org-desc" className="text-xs font-medium">
            组织简介与愿景
          </Label>
          <Textarea
            id="edit-org-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-xs resize-none"
          />
        </div>

        <div className="pt-2">
          <Button type="submit" size="sm" className="text-xs font-semibold shadow-xs">
            保存修改
          </Button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="bg-card border border-destructive/40 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-destructive font-bold text-sm border-b border-destructive/20 pb-3">
          <AlertTriangle size={17} />
          <span>危险区域 (Danger Zone) - 删除组织</span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          删除组织将永久抹除其下包含的所有项目、PostgreSQL 数据库、团队成员关联与存储文件，该操作不可逆！
        </p>

        <div className="flex items-center justify-between pt-1">
          <div className="text-xs text-muted-foreground">
            若您仅需暂停某个项目，请前往 Projects 页面进行单项目暂停。
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
            className="text-xs font-semibold"
          >
            删除此组织
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <Trash2 size={18} />
            <span>确认永久删除组织？</span>
          </DialogTitle>
          <DialogDescription>
            此操作将彻底销毁组织 <strong className="text-foreground">{activeOrg.name}</strong> 及其所有关联的项目与数据库！
          </DialogDescription>
          <DialogClose onClose={() => setIsDeleteOpen(false)} />
        </DialogHeader>

        <DialogContent className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              请输入组织名称 <strong className="text-foreground">{activeOrg.name}</strong> 以确认执行：
            </Label>
            <Input
              placeholder={activeOrg.name}
              value={deleteConfirmInput}
              onChange={(e) => setDeleteConfirmInput(e.target.value)}
              className="h-8.5 text-xs"
            />
          </div>
        </DialogContent>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsDeleteOpen(false)}
            className="text-xs"
          >
            取消
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={deleteConfirmInput !== activeOrg.name}
            onClick={handleDeleteOrg}
            className="text-xs font-semibold"
          >
            我已知晓后果，永久删除组织
          </Button>
        </DialogFooter>
      </Dialog>

    </div>
  );
};
