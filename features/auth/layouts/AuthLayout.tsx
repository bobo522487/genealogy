import React from 'react';
import { Database, Moon, Sun, ArrowLeft, Shield } from 'lucide-react';
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { useAppStore } from "../../../store/useAppStore";
import { Link, useNavigate } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const { isDarkMode, toggleTheme } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-6 animate-in fade-in duration-300 relative overflow-hidden">
      
      {/* Subtle modern dot-grid background */}
      <div 
        className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--border) 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Decorative gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[320px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Actions */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="text-xs text-muted-foreground hover:text-foreground gap-1.5 h-8 px-3 rounded-full hover:bg-muted"
        >
          <ArrowLeft size={14} />
          <span>返回首页</span>
        </Button>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-card/80 border-border text-[11px] text-muted-foreground shadow-2xs font-normal">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Supabase 数据库认证</span>
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            title="切换明暗主题"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </div>
      </div>

      <div className="w-full max-w-[420px] space-y-4 z-10 my-auto pt-6 pb-4">
        {/* Brand & Title Header */}
        <div className="flex flex-col items-center text-center space-y-1.5">
          <Link to="/" className="group flex flex-col items-center">
            <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20 rounded-2xl flex items-center justify-center mb-2 shadow-xs font-serif font-bold text-2xl group-hover:scale-105 transition-transform">
              陈
            </div>
            <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              大谱师 · 陈氏族谱云空间
            </div>
          </Link>
          
          <h2 className="text-xl font-bold tracking-tight text-foreground font-serif">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Main Card */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-2xl shadow-xl p-5 sm:p-6 backdrop-blur-sm">
          {children}
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-2 pt-1">
          <Shield size={12} className="text-emerald-500" />
          <span>基于 Supabase PostgreSQL 实时数据安全鉴权与加密存储</span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
