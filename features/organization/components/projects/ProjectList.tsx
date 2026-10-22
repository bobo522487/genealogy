import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  LayoutGrid, 
  List, 
  ArrowUpDown, 
  ChevronDown, 
  Check, 
  Database, 
  ServerCrash,
  MoreVertical,
  Settings,
  Trash2,
  ExternalLink,
  Pause,
  Play
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
import { Project } from '../../types';
import { ProjectCard } from './ProjectCard';
import { ProjectSettingsModal } from './ProjectSettingsModal';
import { useNavigate } from 'react-router-dom';
import { ViewMode } from '../../../../types';

interface ProjectListProps {
  onOpenCreateProject: () => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  onOpenCreateProject
}) => {
  const navigate = useNavigate();
  const { 
    projects, 
    activeOrgId, 
    deleteProject, 
    toggleProjectStatus,
    setActiveSpaceId,
    setActiveView,
    spaces,
    organizations 
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE_HEALTHY' | 'PAUSED'>('ALL');
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'recent' | 'size'>('name');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const statusRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const activeOrg = organizations.find(o => o.id === activeOrgId || o.slug === activeOrgId) || organizations[0];
  const orgProjects = projects.filter(p => p.organizationId === activeOrg?.id || p.organizationId === 'rnxvmzibhipcjpksaluw');

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusMenuOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return orgProjects.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = 
        statusFilter === 'ALL' || p.status === statusFilter;

      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'size') return parseFloat(b.storageUsed) - parseFloat(a.storageUsed);
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [orgProjects, searchQuery, statusFilter, sortBy]);

  const handleOpenSettings = (proj: Project) => {
    setSelectedProject(proj);
    setIsSettingsOpen(true);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  const handleEnterProject = (p: Project) => {
    if (p.linkedSpaceId) {
      setActiveSpaceId(p.linkedSpaceId);
      setActiveView(ViewMode.HOME);
      navigate(`/space/${p.linkedSpaceId}`);
    } else if (spaces.length > 0) {
      setActiveSpaceId(spaces[0].id);
      setActiveView(ViewMode.HOME);
      navigate(`/space/${spaces[0].id}`);
    } else {
      setActiveView(ViewMode.LINEAGE);
      navigate('/lineage');
    }
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'name':
        return 'Sorted by name';
      case 'recent':
        return 'Sorted by updated';
      case 'size':
        return 'Sorted by size';
      default:
        return 'Sorted by name';
    }
  };

  const getStatusLabel = () => {
    switch (statusFilter) {
      case 'ACTIVE_HEALTHY':
        return 'Active';
      case 'PAUSED':
        return 'Paused';
      default:
        return 'Status';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Projects
        </h1>
      </div>

      {/* Toolbar Matching the Screenshot */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        
        {/* Left Toolbar Items: Search, Status, Sort */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-64 md:w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search for a project"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 pr-8 text-xs sm:text-sm bg-background border-border/80 rounded-md focus-visible:ring-1 focus-visible:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative" ref={statusRef}>
            <button
              type="button"
              onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
              className={`h-9 px-3 rounded-md border text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer ${
                statusFilter !== 'ALL'
                  ? 'border-primary/50 bg-primary/5 text-primary font-medium'
                  : 'border-border/80 bg-background text-foreground hover:bg-muted/40'
              }`}
            >
              <span>{getStatusLabel()}</span>
              <ChevronDown size={14} className={`text-muted-foreground transition-transform ${isStatusMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isStatusMenuOpen && (
              <div className="absolute left-0 top-full mt-1 w-36 bg-popover border border-border rounded-lg shadow-lg z-50 py-1 text-xs animate-in fade-in-50 zoom-in-95">
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('ALL');
                    setIsStatusMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-muted"
                >
                  <span>All Statuses</span>
                  {statusFilter === 'ALL' && <Check size={13} className="text-primary" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('ACTIVE_HEALTHY');
                    setIsStatusMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-muted text-emerald-600 dark:text-emerald-400"
                >
                  <span>Active</span>
                  {statusFilter === 'ACTIVE_HEALTHY' && <Check size={13} className="text-emerald-600 dark:text-emerald-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('PAUSED');
                    setIsStatusMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-muted text-amber-600 dark:text-amber-400"
                >
                  <span>Paused</span>
                  {statusFilter === 'PAUSED' && <Check size={13} className="text-amber-600 dark:text-amber-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Sorted By Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
              className="h-9 px-3 rounded-md border border-border/80 bg-background text-xs sm:text-sm text-foreground hover:bg-muted/40 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowUpDown size={13} className="text-muted-foreground" />
              <span>{getSortLabel()}</span>
            </button>

            {isSortMenuOpen && (
              <div className="absolute left-0 top-full mt-1 w-40 bg-popover border border-border rounded-lg shadow-lg z-50 py-1 text-xs animate-in fade-in-50 zoom-in-95">
                <button
                  type="button"
                  onClick={() => {
                    setSortBy('name');
                    setIsSortMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-muted"
                >
                  <span>Sorted by name</span>
                  {sortBy === 'name' && <Check size={13} className="text-primary" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy('recent');
                    setIsSortMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-muted"
                >
                  <span>Sorted by updated</span>
                  {sortBy === 'recent' && <Check size={13} className="text-primary" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy('size');
                    setIsSortMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-muted"
                >
                  <span>Sorted by size</span>
                  {sortBy === 'size' && <Check size={13} className="text-primary" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Toolbar Items: Grid/List Toggle & Green New Project Button */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 text-muted-foreground">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'text-foreground bg-muted' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={17} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'text-foreground bg-muted' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
              }`}
              title="List View"
            >
              <List size={17} />
            </button>
          </div>

          {/* Green New Project Button (Supabase Style) */}
          <Button
            type="button"
            onClick={onOpenCreateProject}
            className="h-9 px-3.5 text-xs sm:text-sm font-medium bg-[#3ecf8e] hover:bg-[#3ecf8e]/90 text-zinc-950 border-0 rounded-md shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Plus size={15} className="stroke-[2.5]" />
            <span>New project</span>
          </Button>
        </div>

      </div>

      {/* Projects Display: Grid or List */}
      {filteredProjects.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpenSettings={handleOpenSettings}
                onDeleteProject={(p) => setProjectToDelete(p)}
              />
            ))}
          </div>
        ) : (
          /* List View */
          <div className="border border-border/80 rounded-xl overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground">
                    <th className="py-3 px-4 font-medium">Name</th>
                    <th className="py-3 px-4 font-medium">Region</th>
                    <th className="py-3 px-4 font-medium">Compute</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Database</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredProjects.map((project) => {
                    const isHealthy = project.status === 'ACTIVE_HEALTHY';
                    return (
                      <tr 
                        key={project.id}
                        onClick={() => handleEnterProject(project)}
                        className="hover:bg-muted/40 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 font-semibold text-foreground">
                          {project.name}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {project.region}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <span className="px-1.5 py-0.5 rounded border border-border/80 text-[10px] uppercase bg-muted/20">
                            {project.computeSize ? project.computeSize.split(' ')[0] : 'NANO'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {isHealthy ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              <span>Paused</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground font-mono text-[11px]">
                          {project.databaseHost}
                        </td>
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenSettings(project)}
                              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
                              title="Settings"
                            >
                              <Settings size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setProjectToDelete(project)}
                              className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-muted/60 text-muted-foreground mx-auto flex items-center justify-center">
            <Database size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">没有找到匹配的项目</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'ALL'
                ? '请尝试调整搜索关键字或筛选条件'
                : '当前组织下暂无项目，立即创建您的第一个数字化修谱项目吧！'}
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={onOpenCreateProject}
            className="text-xs gap-1.5 font-semibold bg-[#3ecf8e] text-zinc-950 hover:bg-[#3ecf8e]/90"
          >
            <Plus size={14} />
            <span>New project</span>
          </Button>
        </div>
      )}

      {/* Project Settings Modal */}
      <ProjectSettingsModal
        project={selectedProject}
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        onDeleteProject={(p) => setProjectToDelete(p)}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <ServerCrash size={18} />
            <span>确认删除项目</span>
          </DialogTitle>
          <DialogDescription>
            您即将删除项目 <strong className="text-foreground">{projectToDelete?.name}</strong>。此操作将永久抹除所有数据库表、世系图与配置！
          </DialogDescription>
          <DialogClose onClose={() => setProjectToDelete(null)} />
        </DialogHeader>

        <DialogContent className="space-y-3">
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
            ⚠️ 警告：该操作不可撤销，请确保已备份重要数据。
          </div>
        </DialogContent>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setProjectToDelete(null)}
            className="text-xs"
          >
            取消
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleConfirmDelete}
            className="text-xs font-semibold"
          >
            确认彻底删除
          </Button>
        </DialogFooter>
      </Dialog>

    </div>
  );
};
