import React, { useState } from 'react';
import { 
  Database, 
  Sparkles, 
  MapPin, 
  Key, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  ShieldCheck, 
  Server, 
  Check, 
  Cpu,
  Layers
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
import { Checkbox } from '../../../../components/ui/checkbox';
import { useAppStore } from '../../../../store/useAppStore';
import { Project } from '../../types';
import { SpaceItem } from '../../../../types';

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const REGIONS = [
  { id: 'cn-guizhou-1', name: '华南 · 贵州遵义 (中国移动/电信节点)', flag: '🇨🇳' },
  { id: 'cn-east-shanghai', name: '华东 · 上海 (低延迟华东节点)', flag: '🇨🇳' },
  { id: 'cn-south-shenzhen', name: '华南 · 深圳 (大湾区数据节点)', flag: '🇨🇳' },
  { id: 'cn-north-beijing', name: '华北 · 北京 (华北骨干中枢)', flag: '🇨🇳' },
  { id: 'ap-southeast-singapore', name: '亚太 · 新加坡 (AWS 亚太区)', flag: '🇸🇬' },
  { id: 'ap-northeast-tokyo', name: '亚太 · 东京 (AWS 日本区)', flag: '🇯🇵' },
];

const COMPUTE_SIZES = [
  { id: 'Micro', name: 'Micro (2 vCPU, 1GB RAM)', desc: '适合基础修谱、单谱系世系管理', free: true },
  { id: 'Small', name: 'Small (2 vCPU, 2GB RAM)', desc: '适合千人以上宗族、PDF古籍排版', price: '$10/mo' },
  { id: 'Medium', name: 'Medium (4 vCPU, 4GB RAM)', desc: '适合跨省大统宗谱、高频多人协同', price: '$25/mo' },
];

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  open,
  onOpenChange
}) => {
  const { 
    organizations, 
    activeOrgId, 
    addProject, 
    spaces, 
    addSpace 
  } = useAppStore();

  const activeOrg = organizations.find(o => o.id === activeOrgId) || organizations[0];

  const [selectedOrgId, setSelectedOrgId] = useState(activeOrg?.id || '');
  const [projectName, setProjectName] = useState('');
  const [projectSlug, setProjectSlug] = useState('');
  const [dbPassword, setDbPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0].id);
  const [computeSize, setComputeSize] = useState('Micro');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('大统宗谱, 世系图谱');
  const [createLinkedSpace, setCreateLinkedSpace] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update selectedOrgId if activeOrgId changes
  React.useEffect(() => {
    if (activeOrgId) {
      setSelectedOrgId(activeOrgId);
    }
  }, [activeOrgId]);

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
    let pwd = '';
    for (let i = 0; i < 16; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setDbPassword(pwd);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setProjectName(val);
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w\u4e00-\u9fa5-]/g, '')
      .slice(0, 30);
    setProjectSlug(slug || 'project');
  };

  const getPasswordStrength = () => {
    if (!dbPassword) return { score: 0, text: '无密码', color: 'bg-muted' };
    if (dbPassword.length < 8) return { score: 1, text: '弱 (建议8位以上)', color: 'bg-destructive' };
    if (dbPassword.length < 12) return { score: 2, text: '良好', color: 'bg-amber-500' };
    return { score: 3, text: '强密码 (高安全性)', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setError('请输入项目名称');
      return;
    }
    if (!dbPassword) {
      setError('请设置数据库密码');
      return;
    }

    const projectId = `proj-${Date.now().toString(36)}`;
    const regionObj = REGIONS.find(r => r.id === selectedRegion) || REGIONS[0];
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const hostRef = Math.random().toString(36).substring(2, 12);

    let linkedSpaceId: string | undefined = undefined;

    // If createLinkedSpace is checked, also bootstrap a lineage space
    if (createLinkedSpace) {
      linkedSpaceId = `space_${Date.now().toString(36)}`;
      const newSpace: SpaceItem = {
        id: linkedSpaceId,
        name: projectName.trim().includes('空间') ? projectName.trim() : `${projectName.trim()}云谱空间`,
        themeName: projectName.trim(),
        surname: '陈',
        region: regionObj.name.split(' · ')[1]?.split(' (')[0] || '贵州/遵义',
        lastModified: nowStr,
        bookCount: 1,
        branchCount: 1,
        memberCount: 1,
        articleCount: 0,
        storageSize: '1.2 MB',
        status: 'active',
        description: description.trim() || `${projectName.trim()}数字化修谱空间`
      };
      addSpace(newSpace);
    }

    const tags = tagsInput
      .split(/[,，]/)
      .map(t => t.trim())
      .filter(Boolean);

    const newProject: Project = {
      id: projectId,
      organizationId: selectedOrgId || activeOrg?.id || 'org-chen-lineage',
      name: projectName.trim(),
      slug: projectSlug.trim() || `proj-${Date.now()}`,
      region: regionObj.name.split(' (')[0],
      regionCode: regionObj.id,
      status: 'ACTIVE_HEALTHY',
      databaseVersion: 'PostgreSQL 15.6 (Supabase Edition)',
      databaseHost: `db.${hostRef}.supabase.co`,
      computeSize: `${computeSize} (2 Core, 2GB RAM)`,
      dbPassword: dbPassword,
      createdAt: nowStr,
      updatedAt: nowStr,
      restUrl: `https://${hostRef}.supabase.co/rest/v1`,
      anonKey: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(projectId).replace(/=/g, '')}.anon`,
      storageUsed: '1.2 MB',
      dbSize: '0.5 MB',
      memberCount: 1,
      tags: tags.length > 0 ? tags : ['数字化修谱'],
      description: description.trim() || `${projectName.trim()}修谱生产项目`,
      linkedSpaceId
    };

    addProject(newProject);
    onOpenChange(false);

    // Reset fields
    setProjectName('');
    setProjectSlug('');
    setDbPassword('');
    setDescription('');
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Database size={18} className="text-primary" />
          <span>新建项目 (Create a new project)</span>
        </DialogTitle>
        <DialogDescription>
          每一个项目包含独立的 PostgreSQL 数据库、RESTful API 实例、存储桶与角色权限。
        </DialogDescription>
        <DialogClose onClose={() => onOpenChange(false)} />
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <DialogContent className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
          {error && (
            <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              {error}
            </div>
          )}

          {/* Organization Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="proj-org" className="text-xs font-medium">
              所属组织 (Organization)
            </Label>
            <select
              id="proj-org"
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.plan} 计划)
                </option>
              ))}
            </select>
          </div>

          {/* Project Name */}
          <div className="space-y-1.5">
            <Label htmlFor="proj-name" className="text-xs font-medium">
              项目名称 (Project Name) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="proj-name"
              placeholder="例如：陈氏数字化大统宗谱 (生产主库)"
              value={projectName}
              onChange={handleNameChange}
              required
              className="h-9 text-xs"
            />
          </div>

          {/* Database Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="proj-pwd" className="text-xs font-medium">
                数据库根密码 (Database Password) <span className="text-destructive">*</span>
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={generateRandomPassword}
                className="h-auto p-0 text-[11px] text-primary hover:underline hover:bg-transparent font-medium flex items-center gap-1"
              >
                <RefreshCw size={11} />
                <span>生成强随机密码</span>
              </Button>
            </div>
            
            <div className="relative">
              <Input
                id="proj-pwd"
                type={showPassword ? 'text' : 'password'}
                placeholder="设置 PostgreSQL 数据库密码"
                value={dbPassword}
                onChange={(e) => setDbPassword(e.target.value)}
                required
                className="h-9 text-xs pr-10 font-mono"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
              </Button>
            </div>

            {/* Password strength meter */}
            {dbPassword && (
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">密码强度：</span>
                  <span className="font-medium">{strength.text}</span>
                </div>
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden flex gap-1">
                  <div className={`h-full flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-muted'}`} />
                  <div className={`h-full flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-muted'}`} />
                  <div className={`h-full flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-muted'}`} />
                </div>
              </div>
            )}
          </div>

          {/* Region Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="proj-region" className="text-xs font-medium">
              部署区域 (Deployment Region)
            </Label>
            <select
              id="proj-region"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.flag} {r.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-muted-foreground">
              建议选择距离您的修谱编委会宗亲最近的物理机房，以获得极低延迟体验。
            </p>
          </div>

          {/* Compute / Pricing Tier */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">计算资源规格 (Compute Sizing)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {COMPUTE_SIZES.map((size) => (
                <div
                  key={size.id}
                  onClick={() => setComputeSize(size.id)}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                    computeSize === size.id
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border bg-card hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{size.name.split(' ')[0]}</span>
                    {size.free ? (
                      <Badge variant="outline" className="text-[9px] py-0 px-1 font-normal text-emerald-600 dark:text-emerald-400">包含在套餐内</Badge>
                    ) : (
                      <span className="text-[10px] font-semibold text-muted-foreground">{size.price}</span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">
                    {size.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <Label htmlFor="proj-tags" className="text-xs font-medium">
              标签分类 (以逗号分隔)
            </Label>
            <Input
              id="proj-tags"
              placeholder="例如：大统宗谱, 世系图, 贵州遵义"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="proj-desc" className="text-xs font-medium">
              项目描述与用途
            </Label>
            <Textarea
              id="proj-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简要说明该项目负责的修谱支系、古籍文献或 API 中枢"
              className="text-xs resize-none"
            />
          </div>

          {/* Auto create linked lineage space checkbox */}
          <div className="flex items-start space-x-2 pt-1">
            <Checkbox 
              id="link-space" 
              checked={createLinkedSpace} 
              onCheckedChange={(checked) => setCreateLinkedSpace(checked === true)} 
              className="mt-0.5"
            />
            <div className="grid gap-1 leading-none">
              <Label 
                htmlFor="link-space" 
                className="text-xs font-medium cursor-pointer"
              >
                自动初始化关联的「云谱修谱工作空间」
              </Label>
              <p className="text-[11px] text-muted-foreground">
                创建项目后可直接无缝进入世系图编修、族人档案录入与古籍苏欧体例排版。
              </p>
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
            className="text-xs font-semibold shadow-xs"
          >
            确认创建项目
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};
