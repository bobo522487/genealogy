import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import ActivityBar from '../components/layout/ActivityBar';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import LineagePage from '../features/lineage/pages/LineagePage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import SpaceOverviewPage from '../features/dashboard/pages/SpaceOverviewPage';
import { OrganizationPage } from '../features/organization/pages/OrganizationPage';
import { ComingSoonPage } from '../features/placeholder/pages/ComingSoonPage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import { ViewMode } from '../types';
import { useResizable } from '../hooks/useResizable';
import { useAppStore } from '../store/useAppStore';

// --- Route Wrappers for State Sync ---

const OrganizationRoute = () => {
  const { setActiveView } = useAppStore();
  useEffect(() => {
    setActiveView(ViewMode.ORGANIZATIONS);
  }, [setActiveView]);
  return <OrganizationPage />;
};

const OverviewRoute = () => {
  const { setActiveView } = useAppStore();
  useEffect(() => {
    setActiveView(ViewMode.OVERVIEW);
  }, [setActiveView]);
  return <SpaceOverviewPage />;
};

const DashboardRoute = () => {
  const { setActiveView } = useAppStore();
  useEffect(() => {
    setActiveView(ViewMode.HOME);
  }, [setActiveView]);
  return <DashboardPage />;
};

const LineageRoute = () => {
  const { setActiveView } = useAppStore();
  useEffect(() => {
    setActiveView(ViewMode.LINEAGE);
  }, [setActiveView]);
  return <LineagePage />;
};

const ArticlesRoute = () => {
  const { setActiveView } = useAppStore();
  useEffect(() => {
    setActiveView(ViewMode.ARTICLES);
  }, [setActiveView]);
  return <ComingSoonPage module="articles" />;
};

const BooksRoute = () => {
  const { setActiveView } = useAppStore();
  useEffect(() => {
    setActiveView(ViewMode.BOOKS);
  }, [setActiveView]);
  return <ComingSoonPage module="books" />;
};

const PublishRoute = () => {
  const { setActiveView } = useAppStore();
  useEffect(() => {
    setActiveView(ViewMode.PUBLISH);
  }, [setActiveView]);
  return <ComingSoonPage module="publish" />;
};

const SettingsRoute = () => {
  const { setActiveView } = useAppStore();
  useEffect(() => {
    setActiveView(ViewMode.SETTINGS);
  }, [setActiveView]);
  return <ComingSoonPage module="settings" />;
};

// --- Main Layout Component ---

const MainLayout: React.FC<{ 
  sidebarWidth: number, 
  startResizingSidebar: any, 
  isResizingSidebar: boolean 
}> = ({ sidebarWidth, startResizingSidebar, isResizingSidebar }) => {
  const { activeView } = useAppStore();
  const isLineageView = activeView === ViewMode.LINEAGE;

  return (
    <div className={`flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden font-sans transition-colors duration-200 ${isResizingSidebar ? 'cursor-col-resize select-none' : ''}`}>
        <Header />
        
        <div className="flex-1 flex overflow-hidden">
          {/* ActivityBar - The single unified left sidebar */}
          <ActivityBar />
          
          {/* Sidebar - Only shown on Lineage (谱系) view */}
          {isLineageView && (
            <>
              <Sidebar width={sidebarWidth} />
              <div
                  className="w-[1px] bg-border hover:bg-primary cursor-col-resize z-50 relative transition-colors"
                  onMouseDown={startResizingSidebar}
              >
                 <div className="absolute inset-y-0 -left-1 w-3 cursor-col-resize z-50" />
              </div>
            </>
          )}
          
          {/* Content Area */}
          <main className="flex-1 flex overflow-hidden relative bg-background min-w-0">
             <Outlet />
          </main>
        </div>
    </div>
  );
};

const App: React.FC = () => {
  // State from Zustand Store
  const { isDarkMode, theme, initAuth } = useAppStore();

  // Initialize Supabase Auth state listener
  useEffect(() => {
    const unsubscribe = initAuth();
    return () => {
      unsubscribe?.();
    };
  }, [initAuth]);

  // Use custom hook for Left Sidebar Resizing
  const { 
    width: sidebarWidth, 
    isResizing: isResizingSidebar, 
    startResizing: startResizingSidebar 
  } = useResizable({
    initialWidth: 260,
    minWidth: 200,
    maxWidth: 480,
    edge: 'left',
    leftOffset: 56 // Width of ActivityBar
  });

  // Initialize Theme (using store value)
  useEffect(() => {
    const root = document.documentElement;
    
    // Handle Dark Mode
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Handle Themes
    root.classList.remove('theme-slack', 'theme-supabase', 'theme-vscode', 'theme-vercel');
    if (theme && theme !== 'vercel') {
        root.classList.add(`theme-${theme}`);
    }
  }, [isDarkMode, theme]);

  return (
    <HashRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Main App Routes */}
        <Route element={
          <MainLayout 
              sidebarWidth={sidebarWidth} 
              startResizingSidebar={startResizingSidebar} 
              isResizingSidebar={isResizingSidebar} 
          />
        }>
           {/* Organization Routes (Projects, Team, Settings) */}
           <Route path="/dashboard/org/:orgId" element={<OrganizationRoute />} />
           <Route path="/dashboard/org/:orgId/:tab" element={<OrganizationRoute />} />
           <Route path="/dashboard/org" element={<Navigate to="/dashboard/org/rnxvmzibhipcjpksaluw" replace />} />
           <Route path="/" element={<Navigate to="/dashboard/org/rnxvmzibhipcjpksaluw" replace />} />
           <Route path="/organizations" element={<Navigate to="/dashboard/org/rnxvmzibhipcjpksaluw" replace />} />
           <Route path="/org" element={<Navigate to="/dashboard/org/rnxvmzibhipcjpksaluw" replace />} />
           <Route path="/projects" element={<Navigate to="/dashboard/org/rnxvmzibhipcjpksaluw" replace />} />

           {/* Cloud Spaces Overview Route */}
           <Route path="/home" element={<OverviewRoute />} />
           <Route path="/overview" element={<OverviewRoute />} />
           
           {/* Space Detail & Dashboard Routes */}
           <Route path="/space/:spaceId" element={<DashboardRoute />} />
           <Route path="/space" element={<DashboardRoute />} />
           <Route path="/dashboard" element={<DashboardRoute />} />
           
           {/* Lineage (谱系) Routes */}
           <Route path="/lineage" element={<LineageRoute />} />
           <Route path="/apps/*" element={<Navigate to="/lineage" replace />} />

           {/* Module Routes: 谱文、谱书、发布、设置 */}
           <Route path="/articles" element={<ArticlesRoute />} />
           <Route path="/books" element={<BooksRoute />} />
           <Route path="/publish" element={<PublishRoute />} />
           <Route path="/settings" element={<SettingsRoute />} />

           {/* Fallback to Organizations */}
           <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
