import React from 'react';
import { 
  FileText, 
  BookOpen, 
  Send, 
  Settings, 
  Sparkles, 
  Clock, 
  ArrowLeft,
  CheckCircle2,
  Layers,
  FileCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useAppStore } from '../../../store/useAppStore';
import { ViewMode } from '../../../types';

interface ComingSoonPageProps {
  module: 'articles' | 'books' | 'publish' | 'settings';
}

const MODULE_CONFIG = {
  articles: {
    title: '谱文编修与文献库',
    subtitle: '谱序、凡例、传记、契约、赞咏等族谱文献在线录入与校勘',
    icon: FileText,
    badge: '功能规划中',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    features: [
      '历代重修序言、凡例、源流考数字化录入与排版',
      '先祖功德录、行状传记与名贤赞咏图文混排',
      '族规家训、宗约碑记与契券古文断句标点支持',
      'AI 辅助文言文句读校对与繁简体一键互转'
    ]
  },
  books: {
    title: '谱书卷册与分卷管理',
    subtitle: '大统宗谱分卷排版、卷首世系卷末数字化成书编目',
    icon: BookOpen,
    badge: '功能规划中',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    features: [
      '卷首、世系录、谱文录、卷末分卷目录自定义',
      '欧式五世一表、苏式垂丝图一键排版成书',
      '古线装谱、现代大开本高精度印刷级 PDF 导出',
      '电子翻页书生成与宗亲线上阅谱'
    ]
  },
  publish: {
    title: '宗谱发布与多端分发',
    subtitle: '数字化云谱版本发布、宗亲多端协同查阅与权限管控',
    icon: Send,
    badge: '功能规划中',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    features: [
      '版本封谱与历史修谱修次数字存档',
      '宗亲查谱小程序与移动端专属查阅授权',
      '分支权限分级管控（查阅、编辑、审阅）',
      '云端永久只读只阅防篡改归档'
    ]
  },
  settings: {
    title: '空间与系统设置',
    subtitle: '堂号信息、修谱编委会成员角色分配与安全备份',
    icon: Settings,
    badge: '功能规划中',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    features: [
      '宗族堂号、始迁祖信息与谱名元数据配置',
      '编委会主编、副主编与录入员权限分配',
      'Supabase 数据库安全快照与本地备份导出',
      '多端个性化阅读字号与主题偏好设置'
    ]
  }
};

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ module }) => {
  const navigate = useNavigate();
  const { setActiveView } = useAppStore();
  const config = MODULE_CONFIG[module];
  const Icon = config.icon;

  const handleBackHome = () => {
    setActiveView(ViewMode.OVERVIEW);
    navigate('/');
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto bg-background text-foreground select-none p-6 sm:p-10 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full mx-auto space-y-6 text-center">
        
        {/* Module Icon */}
        <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border shadow-xs ${config.bg}`}>
          <Icon size={32} className={config.color} />
        </div>

        {/* Title & Badge */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
            <Clock size={12} />
            <span>{config.badge}</span>
          </div>

          <h1 className="text-2xl font-bold font-serif tracking-tight text-foreground">
            {config.title}
          </h1>

          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            {config.subtitle}
          </p>
        </div>

        {/* Feature Highlights List */}
        <div className="bg-card border border-border/80 rounded-xl p-5 text-left shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground pb-2 border-b border-border/60">
            <Sparkles size={14} className="text-primary" />
            <span>即将支持的核心功能</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 text-xs text-muted-foreground">
            {config.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-foreground/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackHome}
            className="text-xs gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>返回首页</span>
          </Button>

          <Button 
            variant="default" 
            size="sm" 
            onClick={() => {
              setActiveView(ViewMode.LINEAGE);
              navigate('/lineage');
            }}
            className="text-xs gap-1.5"
          >
            <Layers size={14} />
            <span>前往世系谱系编修</span>
          </Button>
        </div>

      </div>
    </div>
  );
};
