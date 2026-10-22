import React, { useState, useRef } from 'react';
import { 
  Building2, 
  ChevronDown, 
  Plus, 
  FolderKanban, 
  Users, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Sparkles, 
  CreditCard,
  Check
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useAppStore } from '../../../store/useAppStore';
import { Organization } from '../types';

interface OrgHeaderProps {
  onOpenCreateProject: () => void;
  onOpenCreateOrg: () => void;
}

export const OrgHeader: React.FC<OrgHeaderProps> = ({
  onOpenCreateProject,
  onOpenCreateOrg
}) => {
  const { 
    organizations, 
    activeOrgId, 
    setActiveOrgId, 
    activeOrgTab, 
    setActiveOrgTab,
    projects,
    teamMembers
  } = useAppStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeOrg = organizations.find(o => o.id === activeOrgId) || organizations[0];
  const orgProjects = projects.filter(p => p.organizationId === activeOrg?.id);
  const orgMembers = teamMembers.filter(m => m.organizationId === activeOrg?.id);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'Enterprise':
        return <Badge className="bg-purple-600/15 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[10px] py-0 px-1.5 font-semibold">Enterprise</Badge>;
      case 'Pro':
        return <Badge className="bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] py-0 px-1.5 font-semibold">Pro</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground text-[10px] py-0 px-1.5 font-normal">Free</Badge>;
    }
  };

  return (
    <div className="w-full bg-background border-b border-border/80 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-0">
        
        {/* Top bar: Organization Selector & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          
          {/* Org Selector */}
          <div className="flex items-center gap-3 relative" ref={dropdownRef}>
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold font-serif text-lg shrink-0 shadow-2xs">
              {activeOrg?.name ? activeOrg.name.charAt(0) : 'O'}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 group text-left hover:opacity-90 transition-opacity cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                      {activeOrg?.name || '选择组织'}
                    </h1>
                    {activeOrg && getPlanBadge(activeOrg.plan)}
                    <ChevronDown size={16} className={`text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activeOrg?.slug} · {orgProjects.length} 个项目 · {orgMembers.length} 位成员
                  </p>
                </div>
              </button>

              {/* Organization Switcher Dropdown */}
              {isDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-popover border border-border rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in-50 zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    切换组织 (Organizations)
                  </div>

                  <div className="max-h-60 overflow-y-auto divide-y divide-border/40 py-1">
                    {organizations.map((org) => {
                      const isSelected = org.id === activeOrg?.id;
                      const count = projects.filter(p => p.organizationId === org.id).length;
                      return (
                        <div
                          key={org.id}
                          onClick={() => {
                            setActiveOrgId(org.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between px-3 py-2 text-xs cursor-pointer transition-colors ${
                            isSelected ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-muted text-foreground font-bold flex items-center justify-center text-xs shrink-0 border border-border">
                              {org.name.charAt(0)}
                            </div>
                            <div className="truncate">
                              <div className="truncate font-medium">{org.name}</div>
                              <div className="text-[10px] text-muted-foreground truncate">{count} 个项目 · {org.plan}</div>
                            </div>
                          </div>
                          {isSelected && <Check size={15} className="text-primary shrink-0 ml-2" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-border mt-1 pt-1.5 px-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenCreateOrg();
                      }}
                      className="w-full justify-start text-xs h-8 text-primary font-medium hover:bg-primary/10 gap-1.5"
                    >
                      <Plus size={14} />
                      <span>创建新组织 (New Organization)</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Header Action: New Project */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              onClick={onOpenCreateProject}
              className="text-xs h-8.5 px-3.5 gap-1.5 font-semibold shadow-xs"
            >
              <Plus size={14} />
              <span>新建项目 (New Project)</span>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs (Projects, Team, Settings) */}
        <div className="flex items-center gap-1 border-t border-border/50 pt-1 -mb-px">
          <button
            type="button"
            onClick={() => setActiveOrgTab('projects')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer ${
              activeOrgTab === 'projects'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            <FolderKanban size={14} />
            <span>Projects (项目)</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground font-mono">
              {orgProjects.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveOrgTab('team')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer ${
              activeOrgTab === 'team'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            <Users size={14} />
            <span>Team (团队)</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground font-mono">
              {orgMembers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveOrgTab('settings')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer ${
              activeOrgTab === 'settings'
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            <SettingsIcon size={14} />
            <span>Settings (设置)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
