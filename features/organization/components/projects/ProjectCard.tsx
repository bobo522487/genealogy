import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MoreVertical, 
  Play, 
  Pause, 
  Settings, 
  Trash2, 
  ExternalLink, 
  Key, 
  Copy, 
  Check, 
  GitBranch, 
  ArrowRight
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useAppStore } from '../../../../store/useAppStore';
import { Project } from '../../types';
import { ViewMode } from '../../../../types';

interface ProjectCardProps {
  project: Project;
  onOpenSettings: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenSettings,
  onDeleteProject
}) => {
  const navigate = useNavigate();
  const { toggleProjectStatus, setActiveProjectId, setActiveSpaceId, setActiveView, spaces } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEnterProject = () => {
    setActiveProjectId(project.id);
    // If project is linked to a space, navigate directly to that space
    if (project.linkedSpaceId) {
      setActiveSpaceId(project.linkedSpaceId);
      setActiveView(ViewMode.HOME);
      navigate(`/space/${project.linkedSpaceId}`);
    } else {
      // If there are existing spaces, use the first one or open overview
      if (spaces.length > 0) {
        setActiveSpaceId(spaces[0].id);
        setActiveView(ViewMode.HOME);
        navigate(`/space/${spaces[0].id}`);
      } else {
        setActiveView(ViewMode.LINEAGE);
        navigate('/lineage');
      }
    }
  };

  const handleCopyRestUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(project.restUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const isHealthy = project.status === 'ACTIVE_HEALTHY';
  const computeBadgeText = project.computeSize ? project.computeSize.split(' ')[0].toUpperCase() : 'NANO';

  return (
    <div 
      onClick={handleEnterProject}
      className="group relative bg-card border border-border/80 hover:border-foreground/30 dark:hover:border-foreground/40 rounded-xl p-5 shadow-2xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between min-h-[148px]"
    >
      {/* Top Header: Title & 3-dots Menu */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-base sm:text-lg text-foreground tracking-tight group-hover:text-primary transition-colors truncate">
            {project.name}
          </h3>

          {/* 3-dots More Actions Menu */}
          <div className="relative shrink-0" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="项目更多操作"
            >
              <MoreVertical size={16} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-xl shadow-xl z-50 py-1 text-xs animate-in fade-in-50 zoom-in-95">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleEnterProject();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-foreground hover:bg-muted text-left"
                >
                  <ExternalLink size={13} className="text-muted-foreground" />
                  <span>进入修谱工作空间</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenSettings(project);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-foreground hover:bg-muted text-left"
                >
                  <Key size={13} className="text-muted-foreground" />
                  <span>查看 API 密钥 & 连接串</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    toggleProjectStatus(project.id);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-foreground hover:bg-muted text-left"
                >
                  {isHealthy ? (
                    <>
                      <Pause size={13} className="text-amber-500" />
                      <span>暂停项目数据库</span>
                    </>
                  ) : (
                    <>
                      <Play size={13} className="text-emerald-500" />
                      <span>恢复项目运行</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenSettings(project);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-foreground hover:bg-muted text-left"
                >
                  <Settings size={13} className="text-muted-foreground" />
                  <span>项目设置</span>
                </button>

                <div className="border-t border-border my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDeleteProject(project);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-destructive hover:bg-destructive/10 text-left"
                >
                  <Trash2 size={13} />
                  <span>删除项目</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Subtitle / Region */}
        <div className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-normal tracking-wide">
          {project.region}
        </div>
      </div>

      {/* Bottom Row: NANO Tag / Badge */}
      <div className="pt-4 flex items-center justify-between">
        <div className="inline-flex items-center px-2 py-0.5 rounded border border-border/80 bg-muted/20 text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-medium select-none">
          {computeBadgeText}
        </div>

        {/* Subtle hover prompt icon */}
        <div className="text-muted-foreground/40 group-hover:text-primary transition-colors">
          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0.5 duration-200" />
        </div>
      </div>
    </div>
  );
};
