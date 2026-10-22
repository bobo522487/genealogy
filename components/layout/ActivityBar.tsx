import React from 'react';
import { 
  FolderKanban, 
  Users, 
  Settings as SettingsIcon,
  Home,
  GitBranch,
  FileText,
  BookOpen,
  Share2,
  Building2,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { ViewMode } from '../../types';

const ActivityBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const { 
    activeOrgId, 
    setActiveOrgTab, 
    activeSpaceId, 
    setActiveView 
  } = useAppStore();

  const currentOrgId = activeOrgId || 'rnxvmzibhipcjpksaluw';
  const targetSpaceId = activeSpaceId || '2c9e80729fda2a90019fe03999fe4774';

  // Determine whether current context is Organization level or Project/Space level
  const isOrgContext = 
    path.startsWith('/dashboard/org') || 
    path === '/organizations' || 
    path === '/org' || 
    path === '/projects';

  // Organization-level Navigation Items: 项目 / 团队 / 组织设置
  const orgNavItems = [
    { 
      id: 'projects',
      route: `/dashboard/org/${currentOrgId}`, 
      icon: FolderKanban, 
      label: '项目',
      enLabel: 'Projects',
      isActive: () => {
        return path === `/dashboard/org/${currentOrgId}` || 
               path === '/dashboard/org' || 
               path === '/' || 
               path === '/organizations' || 
               path === '/org' || 
               path === '/projects' || 
               (!path.includes('/team') && !path.includes('/settings') && path.startsWith('/dashboard/org'));
      }
    },
    { 
      id: 'team',
      route: `/dashboard/org/${currentOrgId}/team`, 
      icon: Users, 
      label: '团队',
      enLabel: 'Team',
      isActive: () => path.includes('/team')
    },
    { 
      id: 'settings',
      route: `/dashboard/org/${currentOrgId}/settings`, 
      icon: SettingsIcon, 
      label: '组织设置',
      enLabel: 'Org Settings',
      isActive: () => path.includes('/settings')
    },
  ];

  // Specific Project-level Navigation Items: 首页 / 谱系 / 谱文 / 谱书 / 发布 / 设置
  const projectNavItems = [
    { 
      id: 'home',
      route: `/space/${targetSpaceId}`, 
      icon: Home, 
      label: '首页',
      view: ViewMode.HOME,
      isActive: () => path.startsWith('/space') || path === '/home' || path === '/overview'
    },
    { 
      id: 'lineage',
      route: '/lineage', 
      icon: GitBranch, 
      label: '谱系',
      view: ViewMode.LINEAGE,
      isActive: () => path.startsWith('/lineage') || path.startsWith('/apps')
    },
    { 
      id: 'articles',
      route: '/articles', 
      icon: FileText, 
      label: '谱文',
      view: ViewMode.ARTICLES,
      isActive: () => path.startsWith('/articles')
    },
    { 
      id: 'books',
      route: '/books', 
      icon: BookOpen, 
      label: '谱书',
      view: ViewMode.BOOKS,
      isActive: () => path.startsWith('/books')
    },
    { 
      id: 'publish',
      route: '/publish', 
      icon: Share2, 
      label: '发布',
      view: ViewMode.PUBLISH,
      isActive: () => path.startsWith('/publish')
    },
    { 
      id: 'settings',
      route: '/settings', 
      icon: SettingsIcon, 
      label: '设置',
      view: ViewMode.SETTINGS,
      isActive: () => path.startsWith('/settings')
    },
  ];

  const handleOrgNavigate = (item: typeof orgNavItems[0]) => {
    setActiveOrgTab(item.id as 'projects' | 'team' | 'settings');
    navigate(item.route);
  };

  const handleProjectNavigate = (item: typeof projectNavItems[0]) => {
    if (item.view) {
      setActiveView(item.view);
    }
    navigate(item.route);
  };

  const handleBackToOrg = () => {
    setActiveView(ViewMode.ORGANIZATIONS);
    navigate(`/dashboard/org/${currentOrgId}`);
  };

  return (
    <div className="w-16 flex flex-col items-center py-3 bg-card/70 border-r border-border text-muted-foreground z-20 select-none transition-colors justify-between h-full shrink-0">
      
      {/* Top Navigation Items */}
      <div className="flex flex-col items-center w-full space-y-2.5">
        {isOrgContext ? (
          /* Organization Context: 项目 / 团队 / 组织设置 */
          orgNavItems.map((item) => {
            const active = item.isActive();
            return (
              <button
                key={item.id}
                type="button"
                title={`${item.label} (${item.enLabel})`}
                onClick={() => handleOrgNavigate(item)}
                className={`group flex flex-col items-center justify-center w-12 py-2 rounded-xl text-center transition-all cursor-pointer relative ${
                  active 
                    ? 'text-primary bg-primary/10 font-semibold shadow-2xs' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                }`}
              >
                {active && (
                  <div className="absolute -left-2 top-2 bottom-2 w-1 rounded-r-full bg-primary" />
                )}
                <item.icon size={20} className={`mb-1 transition-transform group-hover:scale-105 ${active ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                <span className="text-[10px] tracking-tight leading-none scale-95 font-medium">
                  {item.label}
                </span>
              </button>
            );
          })
        ) : (
          /* Specific Project Context: 首页 / 谱系 / 谱文 / 谱书 / 发布 / 设置 */
          projectNavItems.map((item) => {
            const active = item.isActive();
            return (
              <button
                key={item.id}
                type="button"
                title={item.label}
                onClick={() => handleProjectNavigate(item)}
                className={`group flex flex-col items-center justify-center w-12 py-2 rounded-xl text-center transition-all cursor-pointer relative ${
                  active 
                    ? 'text-primary bg-primary/10 font-semibold shadow-2xs' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                }`}
              >
                {active && (
                  <div className="absolute -left-2 top-2 bottom-2 w-1 rounded-r-full bg-primary" />
                )}
                <item.icon size={20} className={`mb-1 transition-transform group-hover:scale-105 ${active ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                <span className="text-[10px] tracking-tight leading-none scale-95 font-medium">
                  {item.label}
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* Bottom Area */}
      <div className="flex flex-col items-center w-full space-y-2">
        {!isOrgContext && (
          <button
            type="button"
            title="返回组织与项目列表"
            onClick={handleBackToOrg}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors group"
          >
            <Building2 size={18} strokeWidth={1.8} className="group-hover:scale-105 transition-transform" />
          </button>
        )}
        <button
          type="button"
          title="系统帮助与文档"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <HelpCircle size={18} strokeWidth={1.8} />
        </button>
      </div>

    </div>
  );
};

export default ActivityBar;
