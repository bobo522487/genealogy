import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Dropdown, { DropdownItem } from './Dropdown';
import { 
  Building2, 
  FolderKanban, 
  Home, 
  GitBranch, 
  FileText, 
  BookOpen, 
  Share2, 
  Settings as SettingsIcon, 
  User, 
  Users, 
  SlidersHorizontal,
  ChevronRight,
  Database
} from 'lucide-react';
import { ViewMode } from '../../types';
import { useAppStore } from '../../store/useAppStore';

const Breadcrumb: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const { 
    activeView,
    setActiveView,
    organizations,
    activeOrgId,
    setActiveOrgId,
    activeOrgTab,
    setActiveOrgTab,
    projects,
    activeProjectId,
    setActiveProjectId,
    spaces,
    activeSpaceId,
    setActiveSpaceId,
    branches,
    activeBranchId,
    setActiveBranchId,
    persons,
    selectedPersonId
  } = useAppStore();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // 1. Organization Data
  const currentOrgId = activeOrgId || 'rnxvmzibhipcjpksaluw';
  const activeOrg = organizations.find(o => o.id === currentOrgId || o.slug === currentOrgId) || organizations[0];
  
  const orgItems: DropdownItem[] = organizations.map(o => ({
    id: o.id,
    label: o.name,
    group: '所有组织 (Organizations)',
    description: `${o.plan} 计划 · ${o.slug}`,
    icon: Building2
  }));

  // 2. Project Data
  const orgProjects = projects.filter(p => p.organizationId === currentOrgId);
  const displayProjects = orgProjects.length > 0 ? orgProjects : projects;
  
  // Find current active project
  const activeProject = displayProjects.find(p => p.id === activeProjectId) || displayProjects[0];
  
  const projectItems: DropdownItem[] = displayProjects.map(p => ({
    id: p.id,
    label: p.name,
    group: `组织 ${activeOrg?.name || ''} 下的项目`,
    description: `${p.region} · ${p.computeSize.toUpperCase()} · ${p.status === 'ACTIVE' ? '运行中' : '已暂停'}`,
    icon: FolderKanban
  }));

  // Determine if in Organization context vs Project context
  const isOrgContext = 
    path.startsWith('/dashboard/org') || 
    path === '/organizations' || 
    path === '/org' || 
    path === '/projects';

  // 3. Module Data (For 3rd level inside a project)
  const modules = [
    { id: 'home', label: '首页', icon: Home, route: `/space/${activeProject?.linkedSpaceId || activeSpaceId || '2c9e80729fda2a90019fe03999fe4774'}`, view: ViewMode.HOME },
    { id: 'lineage', label: '谱系', icon: GitBranch, route: '/lineage', view: ViewMode.LINEAGE },
    { id: 'articles', label: '谱文', icon: FileText, route: '/articles', view: ViewMode.ARTICLES },
    { id: 'books', label: '谱书', icon: BookOpen, route: '/books', view: ViewMode.BOOKS },
    { id: 'publish', label: '发布', icon: Share2, route: '/publish', view: ViewMode.PUBLISH },
    { id: 'settings', label: '设置', icon: SettingsIcon, route: '/settings', view: ViewMode.SETTINGS }
  ];

  // Determine current active module
  const getCurrentModule = () => {
    if (path.startsWith('/lineage') || activeView === ViewMode.LINEAGE) return modules[1];
    if (path.startsWith('/articles') || activeView === ViewMode.ARTICLES) return modules[2];
    if (path.startsWith('/books') || activeView === ViewMode.BOOKS) return modules[3];
    if (path.startsWith('/publish') || activeView === ViewMode.PUBLISH) return modules[4];
    if (path.startsWith('/settings') || activeView === ViewMode.SETTINGS) return modules[5];
    return modules[0]; // default to 首页 (Home)
  };

  const currentModule = getCurrentModule();

  const moduleItems: DropdownItem[] = modules.map(m => ({
    id: m.id,
    label: m.label,
    group: '项目功能模块',
    icon: m.icon
  }));

  // Lineage branch & person data
  const activeBranch = branches.find(b => b.id === activeBranchId) || branches[0];
  const branchItems: DropdownItem[] = branches.map(b => ({
    id: b.id,
    label: b.name,
    group: '世系分支 (Branches)',
    description: `${b.generationsCount}世 · ${b.region}`,
    icon: GitBranch
  }));

  const selectedPerson = persons.find(p => p.id === selectedPersonId);

  const Separator = () => (
    <span className="text-muted-foreground/30 mx-1.5 text-xs font-light select-none">/</span>
  );

  return (
    <div className="flex items-center text-xs select-none">
      {/* ========================================================= */}
      {/* 第一级：组织 (Organization) */}
      {/* ========================================================= */}
      <Dropdown
        triggerLabel={activeOrg?.name || '选择组织'}
        triggerIcon={Building2}
        items={orgItems}
        selectedId={activeOrg?.id}
        onSelect={(item) => {
          setActiveOrgId(item.id);
          navigate(`/dashboard/org/${item.id}`);
        }}
        searchPlaceholder="搜索或切换组织..."
        open={activeDropdown === 'org'}
        onOpenChange={(isOpen) => setActiveDropdown(isOpen ? 'org' : null)}
        className="font-medium text-foreground hover:text-primary transition-colors"
      />

      <Separator />

      {/* ========================================================= */}
      {/* 第二级：项目 (Project) 或 组织管理标签 */}
      {/* ========================================================= */}
      {isOrgContext ? (
        /* Inside Organization Dashboard: show Projects / Team / Settings tab */
        <div className="flex items-center">
          <Dropdown
            triggerLabel={
              activeOrgTab === 'team' 
                ? '团队 (Team)' 
                : activeOrgTab === 'settings' 
                ? '组织设置 (Org Settings)' 
                : '项目 (Projects)'
            }
            triggerIcon={
              activeOrgTab === 'team' 
                ? Users 
                : activeOrgTab === 'settings' 
                ? SettingsIcon 
                : FolderKanban
            }
            items={[
              { id: 'projects', label: '项目 (Projects)', icon: FolderKanban, description: '管理组织内的所有项目' },
              { id: 'team', label: '团队 (Team)', icon: Users, description: '协作者成员与权限设置' },
              { id: 'settings', label: '组织设置 (Org Settings)', icon: SettingsIcon, description: '基本信息、配额与审计日志' }
            ]}
            selectedId={activeOrgTab}
            onSelect={(item) => {
              const tab = item.id as 'projects' | 'team' | 'settings';
              setActiveOrgTab(tab);
              if (tab === 'projects') {
                navigate(`/dashboard/org/${currentOrgId}`);
              } else {
                navigate(`/dashboard/org/${currentOrgId}/${tab}`);
              }
            }}
            open={activeDropdown === 'org-tab'}
            onOpenChange={(isOpen) => setActiveDropdown(isOpen ? 'org-tab' : null)}
            className="font-medium text-muted-foreground hover:text-foreground"
          />
        </div>
      ) : (
        /* Inside Project Workspace: show Project Selector */
        <Dropdown
          triggerLabel={activeProject?.name || '选择项目'}
          triggerIcon={FolderKanban}
          items={projectItems}
          selectedId={activeProject?.id}
          onSelect={(item) => {
            setActiveProjectId(item.id);
            const targetProj = displayProjects.find(p => p.id === item.id);
            if (targetProj?.linkedSpaceId) {
              setActiveSpaceId(targetProj.linkedSpaceId);
            }
            setActiveView(ViewMode.HOME);
            navigate(`/space/${targetProj?.linkedSpaceId || activeSpaceId || '2c9e80729fda2a90019fe03999fe4774'}`);
          }}
          searchPlaceholder="搜索或切换项目..."
          open={activeDropdown === 'project'}
          onOpenChange={(isOpen) => setActiveDropdown(isOpen ? 'project' : null)}
          className="font-medium text-foreground hover:text-primary transition-colors"
        />
      )}

      {/* ========================================================= */}
      {/* 第三级：模块 (Module: 首页 / 谱系 / 谱文 / 谱书 / 发布 / 设置) */}
      {/* ========================================================= */}
      {!isOrgContext && (
        <>
          <Separator />
          <Dropdown
            triggerLabel={currentModule.label}
            triggerIcon={currentModule.icon}
            items={moduleItems}
            selectedId={currentModule.id}
            onSelect={(item) => {
              const target = modules.find(m => m.id === item.id);
              if (target) {
                setActiveView(target.view);
                navigate(target.route);
              }
            }}
            open={activeDropdown === 'module'}
            onOpenChange={(isOpen) => setActiveDropdown(isOpen ? 'module' : null)}
            className="font-semibold text-primary"
          />

          {/* Optional: Lineage Branch extension if in lineage view */}
          {currentModule.id === 'lineage' && (
            <>
              <Separator />
              <Dropdown
                triggerLabel={activeBranch?.name || '选择分支'}
                triggerIcon={GitBranch}
                items={branchItems}
                selectedId={activeBranchId}
                onSelect={(item) => {
                  setActiveBranchId(item.id);
                }}
                searchPlaceholder="查找分支世系..."
                open={activeDropdown === 'branch'}
                onOpenChange={(isOpen) => setActiveDropdown(isOpen ? 'branch' : null)}
                className="text-muted-foreground hover:text-foreground"
              />

              {selectedPerson && (
                <>
                  <Separator />
                  <div className="flex items-center gap-1 text-muted-foreground bg-muted/40 px-2 py-0.5 rounded text-[11px]">
                    <User size={12} className="text-primary" />
                    <span className="font-medium text-foreground">{selectedPerson.name}</span>
                    <span className="text-[10px] text-muted-foreground">({selectedPerson.generation}世)</span>
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Breadcrumb;
