import React, { useState } from 'react';
import { 
  Database, 
  Key, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Server, 
  Terminal, 
  RefreshCw, 
  Play, 
  Pause, 
  Trash2, 
  AlertTriangle,
  Layers,
  ShieldCheck,
  Globe
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../components/ui/tabs';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Badge } from '../../../../components/ui/badge';
import { useAppStore } from '../../../../store/useAppStore';
import { Project } from '../../types';

interface ProjectSettingsModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteProject: (project: Project) => void;
}

export const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({
  project,
  open,
  onOpenChange,
  onDeleteProject
}) => {
  const { updateProject, toggleProjectStatus } = useAppStore();

  const [activeTab, setActiveTab] = useState<'api' | 'database' | 'general'>('api');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showAnonKey, setShowAnonKey] = useState(false);
  const [showServiceKey, setShowServiceKey] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [restartMessage, setRestartMessage] = useState<string | null>(null);

  // Edit fields
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  React.useEffect(() => {
    if (project) {
      setProjectName(project.name);
      setProjectDesc(project.description || '');
      setDeleteConfirmText('');
    }
  }, [project]);

  if (!project) return null;

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRestartDb = () => {
    setIsRestarting(true);
    setRestartMessage('正在重启动态数据库服务容器...');
    setTimeout(() => {
      setIsRestarting(false);
      setRestartMessage('PostgreSQL 服务已成功重启！');
      setTimeout(() => setRestartMessage(null), 3000);
    }, 1500);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateProject(project.id, {
      name: projectName.trim(),
      description: projectDesc.trim(),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });
    onOpenChange(false);
  };

  const connectionUri = `postgresql://postgres:[YOUR-PASSWORD]@${project.databaseHost}:5432/postgres`;
  const poolerUri = `postgresql://postgres.[${project.slug}]:[YOUR-PASSWORD]@aws-0-${project.regionCode}.pooler.supabase.com:6543/postgres`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Database size={18} className="text-primary" />
          <span>项目配置与凭据 (Project Settings)</span>
        </DialogTitle>
        <DialogDescription>
          {project.name} · {project.region} · {project.status}
        </DialogDescription>
        <DialogClose onClose={() => onOpenChange(false)} />
      </DialogHeader>

      <div className="space-y-4">
        {/* Restart notification */}
        {restartMessage && (
          <div className="mx-6 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>{restartMessage}</span>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={(t) => setActiveTab(t as any)} className="w-full">
          <div className="px-6 border-b border-border">
            <TabsList className="bg-muted/60 p-1">
              <TabsTrigger value="api" className="text-xs gap-1.5">
                <Key size={13} />
                <span>API 密钥 (API Keys)</span>
              </TabsTrigger>
              <TabsTrigger value="database" className="text-xs gap-1.5">
                <Server size={13} />
                <span>数据库连接 (Database)</span>
              </TabsTrigger>
              <TabsTrigger value="general" className="text-xs gap-1.5">
                <AlertTriangle size={13} />
                <span>通用与危险区 (General)</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <DialogContent className="max-h-[60vh] overflow-y-auto">
            {/* ======================================================== */}
            {/* TAB 1: API KEYS */}
            {/* ======================================================== */}
            <TabsContent value="api" className="space-y-4 m-0">
              
              {/* Project REST URL */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">项目 Project URL (REST API)</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(project.restUrl, 'url')}
                    className="h-auto p-0 text-[11px] text-primary hover:underline hover:bg-transparent font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'url' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                    <span>{copiedKey === 'url' ? '已复制' : '复制 URL'}</span>
                  </Button>
                </div>
                <Input
                  readOnly
                  value={project.restUrl}
                  className="h-9 text-xs font-mono bg-muted/40"
                />
              </div>

              {/* Anon Public Key */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Label className="text-xs font-medium">公开 API 密钥 (anon public)</Label>
                    <Badge variant="outline" className="text-[9px] py-0 px-1 font-normal text-emerald-600 dark:text-emerald-400">客户端安全</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAnonKey(!showAnonKey)}
                      className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      {showAnonKey ? <EyeOff size={11} /> : <Eye size={11} />}
                      <span>{showAnonKey ? '隐藏' : '显示'}</span>
                    </button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(project.anonKey, 'anon')}
                      className="h-auto p-0 text-[11px] text-primary hover:underline hover:bg-transparent font-medium flex items-center gap-1"
                    >
                      {copiedKey === 'anon' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                      <span>{copiedKey === 'anon' ? '已复制' : '复制'}</span>
                    </Button>
                  </div>
                </div>
                <Input
                  readOnly
                  type={showAnonKey ? 'text' : 'password'}
                  value={project.anonKey}
                  className="h-9 text-xs font-mono bg-muted/40"
                />
              </div>

              {/* Service Role Secret Key */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Label className="text-xs font-medium">服务端根密钥 (service_role secret)</Label>
                    <Badge variant="outline" className="text-[9px] py-0 px-1 font-normal text-destructive border-destructive/30">绝不可前端泄露</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowServiceKey(!showServiceKey)}
                      className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      {showServiceKey ? <EyeOff size={11} /> : <Eye size={11} />}
                      <span>{showServiceKey ? '隐藏' : '显示'}</span>
                    </button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${project.id}.service_role_secret`, 'service')}
                      className="h-auto p-0 text-[11px] text-primary hover:underline hover:bg-transparent font-medium flex items-center gap-1"
                    >
                      {copiedKey === 'service' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                      <span>{copiedKey === 'service' ? '已复制' : '复制'}</span>
                    </Button>
                  </div>
                </div>
                <Input
                  readOnly
                  type={showServiceKey ? 'text' : 'password'}
                  value={`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${project.id}.service_role_secret`}
                  className="h-9 text-xs font-mono bg-muted/40 text-destructive/90"
                />
              </div>

            </TabsContent>

            {/* ======================================================== */}
            {/* TAB 2: DATABASE CONNECTION */}
            {/* ======================================================== */}
            <TabsContent value="database" className="space-y-4 m-0">
              
              {/* Direct URI */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">直连连接串 (Direct Connection String)</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(connectionUri, 'uri')}
                    className="h-auto p-0 text-[11px] text-primary hover:underline hover:bg-transparent font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'uri' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                    <span>{copiedKey === 'uri' ? '已复制' : '复制连接串'}</span>
                  </Button>
                </div>
                <Input
                  readOnly
                  value={connectionUri}
                  className="h-9 text-xs font-mono bg-muted/40"
                />
                <p className="text-[11px] text-muted-foreground">
                  适用于 Prisma、Drizzle ORM、pgAdmin 或 Navicat 直连管理。
                </p>
              </div>

              {/* Pooler Connection */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">连接池串 (Transaction Pooler - Port 6543)</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(poolerUri, 'pooler')}
                    className="h-auto p-0 text-[11px] text-primary hover:underline hover:bg-transparent font-medium flex items-center gap-1"
                  >
                    {copiedKey === 'pooler' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                    <span>{copiedKey === 'pooler' ? '已复制' : '复制连接池串'}</span>
                  </Button>
                </div>
                <Input
                  readOnly
                  value={poolerUri}
                  className="h-9 text-xs font-mono bg-muted/40"
                />
                <p className="text-[11px] text-muted-foreground">
                  适用于 Serverless 云函数、Edge Functions 或高并发请求。
                </p>
              </div>

              {/* Quick action: Restart Database */}
              <div className="p-3 rounded-xl bg-muted/30 border border-border flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-foreground">重启数据库服务</div>
                  <div className="text-[11px] text-muted-foreground">快速刷新连接池并重载 PostgreSQL 配置文件</div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isRestarting}
                  onClick={handleRestartDb}
                  className="text-xs h-8 gap-1.5"
                >
                  <RefreshCw size={13} className={isRestarting ? 'animate-spin' : ''} />
                  <span>{isRestarting ? '重启中...' : '重启服务'}</span>
                </Button>
              </div>

            </TabsContent>

            {/* ======================================================== */}
            {/* TAB 3: GENERAL & DANGER ZONE */}
            {/* ======================================================== */}
            <TabsContent value="general" className="space-y-4 m-0">
              
              <form onSubmit={handleSaveGeneral} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-proj-name" className="text-xs font-medium">
                    项目名称
                  </Label>
                  <Input
                    id="edit-proj-name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-proj-desc" className="text-xs font-medium">
                    项目描述
                  </Label>
                  <Input
                    id="edit-proj-desc"
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <Button type="submit" size="sm" className="text-xs">
                  保存修改
                </Button>
              </form>

              {/* Pause / Resume */}
              <div className="p-3 rounded-xl bg-muted/30 border border-border flex items-center justify-between mt-4">
                <div>
                  <div className="text-xs font-semibold text-foreground">
                    {project.status === 'ACTIVE_HEALTHY' ? '暂停项目 (Pause Project)' : '恢复项目 (Resume Project)'}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {project.status === 'ACTIVE_HEALTHY' 
                      ? '暂停后将释放动态计算实例，数据库数据依然安全保存在冷存储中' 
                      : '恢复后数据库将重新上线并在 5 秒内接受请求'}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toggleProjectStatus(project.id)}
                  className="text-xs h-8 gap-1.5"
                >
                  {project.status === 'ACTIVE_HEALTHY' ? (
                    <>
                      <Pause size={13} className="text-amber-500" />
                      <span>暂停</span>
                    </>
                  ) : (
                    <>
                      <Play size={13} className="text-emerald-500" />
                      <span>恢复</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Danger Zone */}
              <div className="p-4 rounded-xl border border-destructive/40 bg-destructive/5 space-y-3">
                <div className="flex items-center gap-2 text-destructive font-bold text-xs">
                  <Trash2 size={15} />
                  <span>危险区域 (Danger Zone) - 删除项目</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  删除项目将永久抹除其下的所有 PostgreSQL 数据表、人物关系、世系图与配置，该操作不可逆！
                </p>

                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">
                    请输入项目名称 <strong className="text-foreground">{project.name}</strong> 确认删除：
                  </Label>
                  <Input
                    placeholder={project.name}
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="h-8.5 text-xs bg-background"
                  />
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={deleteConfirmText !== project.name}
                  onClick={() => {
                    onOpenChange(false);
                    onDeleteProject(project);
                  }}
                  className="text-xs h-8"
                >
                  我已知晓风险，永久删除此项目
                </Button>
              </div>

            </TabsContent>
          </DialogContent>
        </Tabs>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onOpenChange(false)}
          className="text-xs"
        >
          关闭
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
