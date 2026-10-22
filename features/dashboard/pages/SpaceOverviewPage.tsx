import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderGit2, 
  BookOpen, 
  GitBranch, 
  FileText, 
  Users, 
  HardDrive, 
  BarChart3, 
  Plus, 
  ArrowRight, 
  ChevronRight, 
  Clock, 
  Settings, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Database,
  Search,
  CheckCircle2,
  Trash2,
  Share2,
  UploadCloud,
  FileCheck,
  Award
} from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { ViewMode, SpaceItem } from '../../../types';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Badge } from '../../../components/ui/badge';
import { 
  Dialog, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogContent, 
  DialogFooter, 
  DialogClose 
} from '../../../components/ui/dialog';
import { CreateSpaceModal } from '../components/CreateSpaceModal';

const SpaceOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    spaces, 
    activeSpaceId, 
    setActiveSpaceId, 
    addSpace, 
    deleteSpace, 
    setActiveView,
    user 
  } = useAppStore();

  // Modals state
  const [showNewSpaceModal, setShowNewSpaceModal] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [showMoreStatsModal, setShowMoreStatsModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Navigate to specific space dashboard
  const handleEnterSpace = (spaceId: string) => {
    setActiveSpaceId(spaceId);
    setActiveView(ViewMode.HOME);
    navigate(`/space/${spaceId}`);
  };

  // Quick edit lineage
  const handleDirectLineage = (spaceId: string) => {
    setActiveSpaceId(spaceId);
    setActiveView(ViewMode.LINEAGE);
    navigate('/lineage');
  };

  // Handle Create Space
  const handleCreateSpaceSubmit = (spaceData: Partial<SpaceItem>) => {
    if (!spaceData.name) return;

    const newId = `space_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const createdSpace: SpaceItem = {
      id: newId,
      name: spaceData.name.trim(),
      themeName: spaceData.themeName?.trim() || spaceData.name.trim().replace('的云谱空间', ''),
      surname: spaceData.surname?.trim() || '陈',
      region: spaceData.region?.trim() || '贵州/黔南/都匀市',
      lastModified: nowStr,
      bookCount: 1,
      branchCount: 1,
      memberCount: 1,
      articleCount: 1,
      storageSize: '2.4 MB',
      status: 'active',
      level: spaceData.level || 1,
      remarks: spaceData.remarks?.trim() || '',
      description: spaceData.description?.trim() || `${spaceData.name}数字化修谱空间`
    };

    addSpace(createdSpace);
    setShowNewSpaceModal(false);
    showToast(`云谱空间「${createdSpace.name}」创建成功！`);
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto bg-background text-foreground select-none pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg shadow-xl animate-in fade-in slide-in-from-top-3 text-xs font-medium">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ======================================================== */}
        {/* 1. DATA BOX (顶部数据统计指标区) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 bg-card border border-border/80 rounded-xl p-3 sm:p-4 shadow-xs backdrop-blur-sm">
          
          {/* Count 1: 云谱空间 */}
          <div className="flex flex-col justify-between p-2.5 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors relative group">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">云谱空间</span>
              <FolderGit2 size={15} className="text-amber-600 dark:text-amber-400 opacity-80" />
            </div>
            <div className="flex items-baseline gap-1 text-foreground">
              <span className="text-2xl font-bold font-serif text-amber-700 dark:text-amber-400">
                {spaces.length}
              </span>
              <span className="text-xs text-muted-foreground">个</span>
            </div>
            <div className="w-full h-0.5 bg-amber-500/20 rounded-full mt-2 group-hover:bg-amber-500/50 transition-colors" />
          </div>

          {/* Count 2: 在编谱书 */}
          <div className="flex flex-col justify-between p-2.5 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors relative group">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">在编谱书</span>
              <BookOpen size={15} className="text-blue-500 opacity-80" />
            </div>
            <div className="flex items-baseline gap-1 text-foreground">
              <span className="text-2xl font-bold font-serif text-blue-600 dark:text-blue-400">
                {spaces.reduce((acc, s) => acc + s.bookCount, 0)}
              </span>
              <span className="text-xs text-muted-foreground">册</span>
            </div>
            <div className="w-full h-0.5 bg-blue-500/20 rounded-full mt-2 group-hover:bg-blue-500/50 transition-colors" />
          </div>

          {/* Count 3: 在编谱系 */}
          <div className="flex flex-col justify-between p-2.5 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors relative group">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">在编谱系</span>
              <GitBranch size={15} className="text-emerald-500 opacity-80" />
            </div>
            <div className="flex items-baseline gap-1 text-foreground">
              <span className="text-2xl font-bold font-serif text-emerald-600 dark:text-emerald-400">
                {spaces.reduce((acc, s) => acc + s.branchCount, 0)}
              </span>
              <span className="text-xs text-muted-foreground">个</span>
            </div>
            <div className="w-full h-0.5 bg-emerald-500/20 rounded-full mt-2 group-hover:bg-emerald-500/50 transition-colors" />
          </div>

          {/* Count 4: 在编谱文 */}
          <div className="flex flex-col justify-between p-2.5 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors relative group">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">在编谱文</span>
              <FileText size={15} className="text-purple-500 opacity-80" />
            </div>
            <div className="flex items-baseline gap-1 text-foreground">
              <span className="text-2xl font-bold font-serif text-purple-600 dark:text-purple-400">
                {spaces.reduce((acc, s) => acc + s.articleCount, 0)}
              </span>
              <span className="text-xs text-muted-foreground">篇</span>
            </div>
            <div className="w-full h-0.5 bg-purple-500/20 rounded-full mt-2 group-hover:bg-purple-500/50 transition-colors" />
          </div>

          {/* Count 5: 协作团队 */}
          <div 
            onClick={() => setShowInviteModal(true)}
            className="flex flex-col justify-between p-2.5 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors relative group cursor-pointer"
          >
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">协作团队</span>
              <Users size={15} className="text-teal-500 opacity-80" />
            </div>
            <div className="flex items-baseline gap-1 text-foreground">
              <span className="text-2xl font-bold font-serif text-teal-600 dark:text-teal-400">
                0
              </span>
              <span className="text-xs text-muted-foreground">位</span>
            </div>
            <div className="w-full h-0.5 bg-teal-500/20 rounded-full mt-2 group-hover:bg-teal-500/50 transition-colors" />
          </div>

          {/* Count 6: 云盘存储 (管理) */}
          <div className="flex flex-col justify-between p-2.5 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors relative group">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium flex items-center gap-1">
                云盘存储
                <button
                  type="button"
                  onClick={() => setShowStorageModal(true)}
                  className="text-[10px] text-primary hover:underline font-normal cursor-pointer ml-1"
                >
                  管理
                </button>
              </span>
              <HardDrive size={15} className="text-cyan-500 opacity-80" />
            </div>
            <div className="flex items-baseline gap-1 text-foreground">
              <span className="text-xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
                11.7
              </span>
              <span className="text-xs text-muted-foreground">MB</span>
            </div>
            <div className="w-full h-0.5 bg-cyan-500/20 rounded-full mt-2 group-hover:bg-cyan-500/50 transition-colors" />
          </div>

          {/* Count 7: 更多统计 (Clickable) */}
          <div 
            onClick={() => setShowMoreStatsModal(true)}
            className="col-span-2 sm:col-span-2 lg:col-span-1 flex flex-col justify-between p-2.5 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-primary mb-1">
              <span className="text-xs font-medium">更多统计</span>
              <BarChart3 size={15} className="text-primary group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-center gap-1 text-primary text-xs font-semibold mt-1">
              <span>查看指标</span>
              <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="w-full h-0.5 bg-primary/30 rounded-full mt-2 group-hover:bg-primary transition-colors" />
          </div>

        </div>

        {/* ======================================================== */}
        {/* 2. RECENT PROJECTS / SPACES (最近操作 / 云谱空间列表) */}
        {/* ======================================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight text-foreground font-serif">
                最近操作
              </h2>
              <span className="text-xs text-muted-foreground">
                ({spaces.length} 个云谱空间)
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              点击卡片即可直接进入该谱空间进行修谱编撰
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spaces.map((space) => (
              <div
                key={space.id}
                onClick={() => handleEnterSpace(space.id)}
                className="group relative bg-card border border-border/80 hover:border-primary/50 rounded-xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                {/* Top: Space Logo, Title & Time */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-700/10 text-amber-700 dark:text-amber-400 dark:bg-amber-950/30 border border-amber-600/30 flex items-center justify-center font-serif font-bold text-2xl shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    {space.surname || '陈'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                        {space.name}
                      </h3>
                      <Badge variant="outline" className="text-[10px] font-normal py-0 px-1.5 shrink-0 bg-muted/40">
                        {space.surname}氏
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                      <Clock size={11} />
                      <span>{space.lastModified}</span>
                    </div>
                  </div>
                </div>

                {/* Mid: Space Metadata Badges */}
                <div className="grid grid-cols-3 gap-2 py-2 px-2.5 bg-muted/30 rounded-lg text-center text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">在编谱书</span>
                    <span className="font-semibold text-foreground">{space.bookCount} 册</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">世系分支</span>
                    <span className="font-semibold text-foreground">{space.branchCount} 个</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">已录族人</span>
                    <span className="font-semibold text-foreground">{space.memberCount} 位</span>
                  </div>
                </div>

                {/* Bottom: Region and Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                  <span className="text-[11px] text-muted-foreground truncate max-w-[170px]" title={space.region}>
                    {space.region}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDirectLineage(space.id);
                      }}
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-primary"
                    >
                      <GitBranch size={12} className="mr-1" />
                      <span>编修世系</span>
                    </Button>

                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnterSpace(space.id);
                      }}
                      className="h-7 px-2.5 text-xs gap-1 font-medium group-hover:bg-primary shadow-2xs"
                    >
                      <span>进入空间</span>
                      <ArrowRight size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Space Card */}
            <div
              onClick={() => setShowNewSpaceModal(true)}
              className="border-2 border-dashed border-border/80 hover:border-primary/60 hover:bg-muted/20 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[190px] group"
            >
              <div className="w-11 h-11 rounded-full bg-muted group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary flex items-center justify-center mb-2 transition-colors">
                <Plus size={22} />
              </div>
              <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                新建云谱空间
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 max-w-[190px]">
                建立新的堂号世系、分谱或数字化修谱工程
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. BOTTOM BANNER (平台特色与数字化云谱愿景) */}
        {/* ======================================================== */}
        <div className="relative rounded-2xl bg-gradient-to-br from-card via-card to-muted/50 border border-border/80 p-5 sm:p-6 overflow-hidden shadow-sm">
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-serif font-bold text-base shadow-xs">
                  谱
                </div>
                <div className="text-base sm:text-lg font-bold text-foreground font-serif tracking-tight">
                  中国领先的互联网家谱服务平台
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                数据化、智能化、云端化“数智云谱”的开创者与引领者。支持多人在线云端修谱、自动生成苏式/欧式世系图排版、云盘加密存储与多端宗亲协作。
              </p>
            </div>

            {/* Quick feature pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 shrink-0 w-full md:w-auto">
              <div className="p-2.5 rounded-lg bg-background/80 border border-border/60 text-xs flex items-center gap-2 shadow-2xs">
                <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                <span className="font-medium text-foreground">云端数据加密</span>
              </div>
              <div className="p-2.5 rounded-lg bg-background/80 border border-border/60 text-xs flex items-center gap-2 shadow-2xs">
                <Sparkles size={14} className="text-amber-500 shrink-0" />
                <span className="font-medium text-foreground">AI 智能排版</span>
              </div>
              <div className="p-2.5 rounded-lg bg-background/80 border border-border/60 text-xs flex items-center gap-2 shadow-2xs col-span-2 sm:col-span-1">
                <Share2 size={14} className="text-blue-500 shrink-0" />
                <span className="font-medium text-foreground">跨端实时协同</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* MODAL 1: 新建云谱空间弹窗 */}
      {/* ======================================================== */}
      <CreateSpaceModal 
        open={showNewSpaceModal} 
        onOpenChange={setShowNewSpaceModal} 
        onCreateSpace={handleCreateSpaceSubmit} 
      />

      {/* ======================================================== */}
      {/* MODAL 2: 云盘存储管理弹窗 */}
      {/* ======================================================== */}
      <Dialog open={showStorageModal} onOpenChange={setShowStorageModal}>
        <DialogHeader>
          <DialogTitle>云盘存储空间管理</DialogTitle>
          <DialogDescription>
            管理当前大谱师账户的云端谱书扫描件、照片多媒体与 PostgreSQL 数据库占用容量。
          </DialogDescription>
          <DialogClose onClose={() => setShowStorageModal(false)} />
        </DialogHeader>

        <DialogContent className="space-y-4">
          {/* Progress bar */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">已使用 11.7 MB</span>
              <span className="text-muted-foreground">总容量 5.00 GB (0.2%)</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '0.23%' }} />
            </div>
          </div>

          {/* Breakdown items */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60">
              <div className="flex items-center gap-2">
                <FileCheck size={14} className="text-blue-500" />
                <span>谱书文献与章程 (PDF/DOC)</span>
              </div>
              <span className="font-mono text-muted-foreground">6.4 MB</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60">
              <div className="flex items-center gap-2">
                <GitBranch size={14} className="text-emerald-500" />
                <span>世系图谱与人物关系数据</span>
              </div>
              <span className="font-mono text-muted-foreground">3.8 MB</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/60">
              <div className="flex items-center gap-2">
                <Database size={14} className="text-amber-500" />
                <span>Supabase 结构化数据库表项</span>
              </div>
              <span className="font-mono text-muted-foreground">1.5 MB</span>
            </div>
          </div>
        </DialogContent>

        <DialogFooter>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => {
              setShowStorageModal(false);
              showToast('存储配额状态良好，剩余 4.98 GB');
            }}
            className="text-xs"
          >
            完成
          </Button>
        </DialogFooter>
      </Dialog>

      {/* ======================================================== */}
      {/* MODAL 3: 更多统计弹窗 */}
      {/* ======================================================== */}
      <Dialog open={showMoreStatsModal} onOpenChange={setShowMoreStatsModal}>
        <DialogHeader>
          <DialogTitle>大谱师 · 综合统计指标</DialogTitle>
          <DialogDescription>
            全空间数字化编修进度、人物世代跨度与字辈谱牒汇总。
          </DialogDescription>
          <DialogClose onClose={() => setShowMoreStatsModal(false)} />
        </DialogHeader>

        <DialogContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-muted/40 border border-border">
              <span className="text-muted-foreground text-[11px] block">世系总世代跨度</span>
              <span className="text-xl font-bold font-serif text-foreground">35 世</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 border border-border">
              <span className="text-muted-foreground text-[11px] block">已录入族人总量</span>
              <span className="text-xl font-bold font-serif text-foreground">28 人</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 border border-border">
              <span className="text-muted-foreground text-[11px] block">谱书字辈收录</span>
              <span className="text-xl font-bold font-serif text-foreground">24 字</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 border border-border">
              <span className="text-muted-foreground text-[11px] block">谱文数字化归档率</span>
              <span className="text-xl font-bold font-serif text-emerald-600 dark:text-emerald-400">92 %</span>
            </div>
          </div>
        </DialogContent>

        <DialogFooter>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => setShowMoreStatsModal(false)}
            className="text-xs"
          >
            关闭
          </Button>
        </DialogFooter>
      </Dialog>

      {/* ======================================================== */}
      {/* MODAL 4: 邀请协作团队弹窗 */}
      {/* ======================================================== */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogHeader>
          <DialogTitle>邀请修谱编委会成员</DialogTitle>
          <DialogDescription>
            邀请宗亲、族长或文史学者加入云谱空间共同录入和校对族谱。
          </DialogDescription>
          <DialogClose onClose={() => setShowInviteModal(false)} />
        </DialogHeader>

        <DialogContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="invite-phone" className="text-xs font-medium">
              受邀人手机号或邮箱
            </Label>
            <Input
              id="invite-phone"
              placeholder="请输入宗亲手机号或电子邮箱"
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invite-role" className="text-xs font-medium">
              分配协作角色
            </Label>
            <select
              id="invite-role"
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="editor">修谱编辑（可录入与修改世系）</option>
              <option value="reviewer">校对审核员（可查看与提交审阅批注）</option>
              <option value="admin">编委会副主编（具备空间管理权限）</option>
            </select>
          </div>
        </DialogContent>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowInviteModal(false)}
            className="text-xs"
          >
            取消
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              setShowInviteModal(false);
              showToast('已生成邀请链接并发送通知！');
            }}
            className="text-xs font-medium"
          >
            发送邀请
          </Button>
        </DialogFooter>
      </Dialog>

    </div>
  );
};

export default SpaceOverviewPage;
