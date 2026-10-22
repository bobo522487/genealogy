

import React, { useState, useRef } from 'react';
import { Search as SearchIcon, Bell, Moon, Sun, HelpCircle, Blocks, Palette, Triangle, Database, MessageSquare, Code, LogOut, User, Building2 } from 'lucide-react';
import Breadcrumb from '../common/Breadcrumb';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAppStore, AppTheme } from '../../store/useAppStore';
import Dropdown from '../common/Dropdown';
import { useNavigate } from 'react-router-dom';
import ProfileSettingsDialog from '../../features/profile/components/ProfileSettingsDialog';
import { DatabaseTestDialog } from '../database/DatabaseTestDialog';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme, theme, setAppTheme, user, logout, isAuthenticated } = useAppStore();
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);
  
  const themeButtonRef = useRef<HTMLButtonElement>(null);
  const profileButtonRef = useRef<HTMLDivElement>(null);

  const themes: { id: AppTheme; label: string; icon: any }[] = [
    { id: 'vercel', label: 'Vercel', icon: Triangle },
    { id: 'supabase', label: 'Supabase', icon: Database },
    { id: 'slack', label: 'Slack', icon: MessageSquare },
    { id: 'vscode', label: 'VS Code', icon: Code },
  ];

  const profileItems = [
    { id: 'org', label: '组织与项目管理 (Organizations)', icon: Building2 },
    { id: 'profile', label: '个人信息设置', icon: User },
    { id: 'logout', label: isAuthenticated ? '退出登录' : '前往登录', icon: LogOut },
  ];

  const handleProfileSelect = async (item: any) => {
      if (item.id === 'logout') {
          if (isAuthenticated) {
              await logout();
          }
          navigate('/login');
      } else if (item.id === 'org') {
          navigate('/organizations');
      } else if (item.id === 'profile') {
          setIsSettingsOpen(true);
      }
      setIsProfileOpen(false);
  };

  const getInitials = (name: string) => {
      return name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
  };

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between pr-4">
        {/* Left: Logo & Context Navigation */}
        <div className="flex items-center">
          {/* Logo - Icon aligned with ActivityBar (w-14) */}
          <div className="w-14 h-14 flex items-center justify-center shrink-0">
            <Blocks size={24} className="text-primary" strokeWidth={2} />
          </div>

          {/* Breadcrumb */}
          <div className="pl-2">
            <Breadcrumb />
          </div>
        </div>

        {/* Right: Tools & Profile */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden md:flex items-center w-64 mr-2 relative">
            <SearchIcon size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input 
              className="h-8 pl-8 text-xs bg-muted/50 border-input focus-visible:ring-1 focus-visible:ring-offset-0" 
              placeholder="Search... (⌘K)" 
            />
          </div>

          <div className="relative">
            <Button 
                ref={themeButtonRef}
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-muted-foreground hover:text-foreground"
                onClick={() => setIsThemeOpen(!isThemeOpen)}
            >
                <Palette size={18} />
            </Button>
            
            <Dropdown 
                open={isThemeOpen}
                onOpenChange={setIsThemeOpen}
                anchorRef={themeButtonRef}
                triggerLabel=""
                className="hidden" // Hidden trigger because we use the button above
                items={themes.map(t => ({
                    id: t.id,
                    label: t.label,
                    icon: t.icon,
                    group: 'Themes'
                }))}
                onSelect={(item) => setAppTheme(item.id as AppTheme)}
                width={180}
                selectedId={theme}
                searchPlaceholder="Select theme..."
            />
          </div>

          {/* Supabase Database Connection Tester Button */}
          <Button
            id="header-btn-supabase"
            variant="outline"
            size="sm"
            onClick={() => setIsDatabaseOpen(true)}
            className="h-8 px-2.5 text-xs gap-1.5 border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-500/50"
            title="测试与配置 Supabase 数据库连接"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <Database size={14} className="text-emerald-500" />
            <span className="hidden sm:inline font-medium">Supabase 数据库</span>
          </Button>

          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
            <HelpCircle size={18} />
          </Button>

          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
            <Bell size={18} />
          </Button>

          <Button
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          <div className="h-5 w-px bg-border mx-1"></div>

          <div className="relative">
            <div 
                ref={profileButtonRef}
                className="w-8 h-8 bg-gradient-to-tr from-primary to-purple-500 rounded-full cursor-pointer ring-offset-background transition-all hover:ring-2 ring-ring"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
                <div className="w-full h-full flex items-center justify-center text-primary-foreground text-xs font-bold select-none">
                    {getInitials(user.name)}
                </div>
            </div>

            <Dropdown 
                open={isProfileOpen}
                onOpenChange={setIsProfileOpen}
                anchorRef={profileButtonRef}
                triggerLabel=""
                className="hidden" 
                items={profileItems}
                onSelect={handleProfileSelect}
                width={180}
                searchPlaceholder=""
                align="end"
            />
          </div>
        </div>
      </div>
    </header>

    <ProfileSettingsDialog 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
    />

    <DatabaseTestDialog 
        isOpen={isDatabaseOpen}
        onClose={() => setIsDatabaseOpen(false)}
        autoRun={true}
    />
    </>
  );
};

export default Header;