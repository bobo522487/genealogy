import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  X,
  CreditCard
} from 'lucide-react';
import { 
  Dialog, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogContent, 
  DialogFooter, 
  DialogClose 
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Badge } from '../../../components/ui/badge';
import { useAppStore } from '../../../store/useAppStore';
import { Organization, PlanTier } from '../types';

interface CreateOrgModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateOrgModal: React.FC<CreateOrgModalProps> = ({
  open,
  onOpenChange
}) => {
  const { addOrganization, user } = useAppStore();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [billingEmail, setBillingEmail] = useState(user.email || 'admin@lineage.org');
  const [plan, setPlan] = useState<PlanTier>('Free');
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    // Auto-generate slug
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w\u4e00-\u9fa5-]/g, '')
      .slice(0, 30);
    setSlug(generatedSlug || 'my-organization');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('请输入组织名称');
      return;
    }

    const newOrg: Organization = {
      id: `org-${Date.now().toString(36)}`,
      name: name.trim(),
      slug: slug.trim() || `org-${Date.now()}`,
      plan,
      createdAt: new Date().toISOString().substring(0, 10),
      description: description.trim(),
      billingEmail: billingEmail.trim()
    };

    addOrganization(newOrg);
    onOpenChange(false);
    // Reset form
    setName('');
    setSlug('');
    setDescription('');
    setPlan('Free');
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Building2 size={18} className="text-primary" />
          <span>创建新组织 (New Organization)</span>
        </DialogTitle>
        <DialogDescription>
          组织是项目、团队成员、计费与协作权限的最高管理容器。
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

          {/* Org Name */}
          <div className="space-y-1.5">
            <Label htmlFor="org-name" className="text-xs font-medium">
              组织名称 (Organization Name) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="org-name"
              placeholder="例如：陈氏宗族数字化修谱理事会 / Acme Corp"
              value={name}
              onChange={handleNameChange}
              required
              className="h-9 text-xs"
            />
          </div>

          {/* Org Slug */}
          <div className="space-y-1.5">
            <Label htmlFor="org-slug" className="text-xs font-medium">
              组织标识符 (Organization Slug)
            </Label>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground bg-muted/50 px-2.5 py-2 rounded-l-md border border-r-0 border-input select-none">
                app/org/
              </span>
              <Input
                id="org-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-org-slug"
                className="h-9 text-xs rounded-l-none"
              />
            </div>
          </div>

          {/* Billing Email */}
          <div className="space-y-1.5">
            <Label htmlFor="org-email" className="text-xs font-medium">
              账单与通知邮箱 (Billing Email)
            </Label>
            <Input
              id="org-email"
              type="email"
              value={billingEmail}
              onChange={(e) => setBillingEmail(e.target.value)}
              placeholder="billing@your-org.com"
              className="h-9 text-xs"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="org-desc" className="text-xs font-medium">
              组织简介与修谱职能
            </Label>
            <Textarea
              id="org-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例如：负责华南地区陈氏大统宗谱修缮与数字化中枢运维"
              className="text-xs resize-none"
            />
          </div>

          {/* Pricing Plan Selector */}
          <div className="space-y-1.5 pt-1">
            <Label className="text-xs font-medium">选择计划套餐 (Pricing Plan)</Label>
            <div className="grid grid-cols-3 gap-2.5">
              
              {/* Free Plan */}
              <div 
                onClick={() => setPlan('Free')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  plan === 'Free'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border bg-card hover:bg-muted/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-foreground">Free</span>
                  {plan === 'Free' && <Check size={14} className="text-primary" />}
                </div>
                <div className="text-[11px] font-semibold text-muted-foreground">$0 / 月</div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  适合初试与个人修谱 (最多 2 个项目)
                </p>
              </div>

              {/* Pro Plan */}
              <div 
                onClick={() => setPlan('Pro')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  plan === 'Pro'
                    ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500'
                    : 'border-border bg-card hover:bg-muted/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Pro</span>
                    <Sparkles size={11} className="text-amber-500" />
                  </div>
                  {plan === 'Pro' && <Check size={14} className="text-emerald-500" />}
                </div>
                <div className="text-[11px] font-semibold text-muted-foreground">$25 / 月</div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  适合编委会团队 (无限制计算资源)
                </p>
              </div>

              {/* Enterprise Plan */}
              <div 
                onClick={() => setPlan('Enterprise')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  plan === 'Enterprise'
                    ? 'border-purple-500 bg-purple-500/5 ring-1 ring-purple-500'
                    : 'border-border bg-card hover:bg-muted/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Enterprise</span>
                  {plan === 'Enterprise' && <Check size={14} className="text-purple-500" />}
                </div>
                <div className="text-[11px] font-semibold text-muted-foreground">定制报价</div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  专有数据加密与 24/7 专属 SLA 支持
                </p>
              </div>

            </div>
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
            className="text-xs font-semibold"
          >
            确认创建组织
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};
