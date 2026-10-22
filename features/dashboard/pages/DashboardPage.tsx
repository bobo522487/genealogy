import React, { useState, useEffect, useRef } from 'react';
import { 
  Copy, 
  Settings, 
  Edit3, 
  HelpCircle, 
  ChevronRight, 
  CheckCircle2, 
  ExternalLink,
  BookOpen,
  GitBranch,
  FileText,
  Users,
  X,
  Database,
  ArrowLeft,
  FolderGit2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/useAppStore';
import { ViewMode } from '../../../types';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { DatabaseTestDialog } from '../../../components/database/DatabaseTestDialog';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveView, user, isAuthenticated } = useAppStore();

  const [notification, setNotification] = useState<string | null>(null);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [showEditInfoModal, setShowEditInfoModal] = useState(false);
  const [showLayoutSettingsModal, setShowLayoutSettingsModal] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);

  // Editable Project Info State
  const [projectInfo, setProjectInfo] = useState({
    title: '陈氏族谱的云谱空间',
    themeName: '陈氏族谱',
    surname: '陈',
    region: '中国/贵州/遵义/桐梓县',
    remarks: ''
  });

  // Chart Tooltip hover states
  const [hoveredBar, setHoveredBar] = useState<{ gen: string; count: number; x: number; y: number } | null>(null);

  useEffect(() => {
    setActiveView(ViewMode.HOME);
  }, [setActiveView]);

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCopyLink = () => {
    const spaceUrl = window.location.href;
    navigator.clipboard?.writeText(spaceUrl).then(() => {
      showNotice('云谱空间网址已复制到剪贴板！');
    }).catch(() => {
      showNotice('链接复制成功：' + spaceUrl);
    });
  };

  const handleNavigateToApps = (route?: string) => {
    setActiveView(ViewMode.LINEAGE);
    navigate('/lineage');
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEditInfoModal(false);
    showNotice('基本信息修改成功！');
  };

  return (
    <div 
      id="dashboard-home-wrapper"
      className="detailBlock select-none overflow-y-auto" 
      tabIndex={1} 
      style={{ outline: 'none' }}
    >
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-14 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-xl animate-in fade-in slide-in-from-top-3 text-sm font-medium">
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Space Context Bar with Back to Overview */}
      <div className="flex items-center justify-between px-6 py-2 bg-muted/20 border-b border-border/40 text-xs">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setActiveView(ViewMode.OVERVIEW);
            navigate('/');
          }}
          className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60"
        >
          <ArrowLeft size={13} />
          <span>返回所有空间概览</span>
        </Button>

        <div className="flex items-center gap-2 text-muted-foreground">
          <FolderGit2 size={13} className="text-amber-500" />
          <span>当前空间：{projectInfo.title}</span>
        </div>
      </div>

      {/* Main Box Top Area */}
      <div className="mainBox">
        
        {/* Left Box: Project Info, User, Logs, Actions */}
        <div className="leftBox">
          
          <div className="porjcetInfo">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-3">
              <div className="projectLogo flex items-center justify-center bg-amber-700/10 text-amber-700 dark:text-amber-400 dark:bg-amber-950/30 rounded-lg border border-amber-600/30 font-serif font-bold text-2xl shadow-xs">
                陈
              </div>
              <div>
                <div className="projectName bold font20 colorTitle">{projectInfo.title}</div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  <span>空间ID: 2c9e80729fda2a90</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">● 运行中</span>
                  <button 
                    id="btn-quick-test-supabase"
                    onClick={() => setShowSupabaseModal(true)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors font-medium text-[11px] cursor-pointer"
                  >
                    <Database size={11} className="text-emerald-500" />
                    <span>Supabase 数据库连接测试</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="primaryName font16 colorText">
              主题名：<span>{projectInfo.themeName}</span>
            </div> 
            <div className="primarySurname font16 colorText">
              姓氏：<span>{projectInfo.surname}</span>
            </div> 
            <div className="countriesRegions font16 colorText">
              地区：<span>{projectInfo.region}</span>
            </div> 
            <div className="remarks font16 colorText">
              备注：<span>{projectInfo.remarks || '（暂无备注）'}</span>
            </div>
          </div> 

          {/* Project Users */}
          <div className="projectUser">
            <div className="systemUser font16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="role-name">管理员：</div>
                <div className="font-medium text-foreground text-sm flex items-center gap-1.5">
                  <span className="text-primary font-bold">{user.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">({user.email})</span>
                </div>
              </div>
              {isAuthenticated && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                  Supabase 已认证
                </span>
              )}
            </div> 
            <div className="ordinaryUser font16 flex items-center gap-2">
              <div className="role-name">角色头衔：</div>
              <div className="text-sm text-muted-foreground">{user.role || '修谱编委会主编'}</div>
            </div>
          </div> 

          {/* Project Log Table */}
          <div className="projectLog">
            <div className="logTitle">
              <div className="title1 bold font18">操作日志</div> 
              <div className="title2 colorTips font14">点击箭头可自动定位继续操作</div>
            </div> 
            
            <div className="logTable">
              <table width="100%">
                <tbody>
                  <tr className="tr_title colorTips font18">
                    <td>资源名称</td> 
                    <td>操作</td> 
                    <td className="text-right">最近操作时间</td>
                  </tr>
                  <tr 
                    className="tr_text colorText font14 pointer select-hover group" 
                    onClick={() => handleNavigateToApps('/apps')}
                  >
                    <td className="td_name flex items-center gap-1.5 py-2.5">
                      <BookOpen size={14} className="text-blue-500" />
                      <span className="font-medium group-hover:underline">卷首</span>
                    </td>
                    <td className="td_user text-muted-foreground">被修改【vz5t0g8q2299】</td>
                    <td className="td_date">
                      2026-08-17 21:05:32
                      <ChevronRight size={14} className="inline ml-1 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                    </td>
                  </tr>
                  <tr 
                    className="tr_text colorText font14 pointer select-hover group" 
                    onClick={() => handleNavigateToApps('/apps')}
                  >
                    <td className="td_name flex items-center gap-1.5 py-2.5">
                      <GitBranch size={14} className="text-emerald-500" />
                      <span className="font-medium group-hover:underline">元英房世系图</span>
                    </td>
                    <td className="td_user text-muted-foreground">被修改【vz5t0g8q2299】</td>
                    <td className="td_date">
                      2026-08-17 20:57:59
                      <ChevronRight size={14} className="inline ml-1 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                    </td>
                  </tr>
                  <tr 
                    className="tr_text colorText font14 pointer select-hover group" 
                    onClick={() => handleNavigateToApps('/apps')}
                  >
                    <td className="td_name flex items-center gap-1.5 py-2.5">
                      <FileText size={14} className="text-amber-500" />
                      <span className="font-medium group-hover:underline">陈氏族谱源流世系</span>
                    </td>
                    <td className="td_user text-muted-foreground">被删除【vz5t0g8q2299】</td>
                    <td className="td_date">
                      2026-08-17 20:53:56
                      <ChevronRight size={14} className="inline ml-1 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div> 

          {/* Action Buttons */}
          <div className="projectOpen">
            <div 
              id="btn-test-supabase-connection"
              className="butOpen font18 pointer shadow-xs hover:shadow-md cursor-pointer border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600/20"
              onClick={() => setShowSupabaseModal(true)}
            >
              <Database size={16} className="text-emerald-500" />
              <span>测试 Supabase 数据库连接</span>
            </div> 

            <div 
              id="btn-goto-layout-settings"
              className="butOpen font18 pointer shadow-xs hover:shadow-md cursor-pointer"
              onClick={() => setShowLayoutSettingsModal(true)}
            >
              <Settings size={16} />
              <span>前往设置  选择版式体例</span>
            </div> 
            
            <div 
              id="btn-edit-basic-info"
              className="butEdit font18 pointer hover:border-primary/50 cursor-pointer"
              onClick={() => setShowEditInfoModal(true)}
            >
              <Edit3 size={16} />
              <span>编辑基本信息</span>
            </div> 
            
            <div 
              id="btn-copy-project-url"
              className="butCopy font18 pointer text-shadow copyProject hover:border-primary/50 cursor-pointer"
              onClick={handleCopyLink}
            >
              <Copy size={16} />
              <span>复制云谱空间网址</span>
            </div>
          </div>

        </div> 

        {/* Right Box: Resource Counts & Node Statistics */}
        <div className="rightBox">
          
          {/* 3 Metrics Cards */}
          <div className="resCount">
            <div className="resDiv resBook group hover:border-primary/50 transition-all cursor-pointer" onClick={() => handleNavigateToApps('/apps')}>
              <div className="textBorder"></div> 
              <div className="text1 font20 flex items-center justify-center gap-1.5">
                <BookOpen size={16} className="text-blue-500" />
                <span>在编谱书</span>
              </div> 
              <div className="text2"><span className="bold font24">1</span> 册</div> 
              <div className="text3 font12">已发布分享：<span>0</span> 册</div>
            </div> 
            
            <div className="resDiv resTree group hover:border-primary/50 transition-all cursor-pointer" onClick={() => handleNavigateToApps('/apps')}>
              <div className="textBorder"></div> 
              <div className="text1 font20 flex items-center justify-center gap-1.5">
                <GitBranch size={16} className="text-emerald-500" />
                <span>在编谱系</span>
              </div> 
              <div className="text2"><span className="bold font24">1</span> 册</div> 
              <div className="text3 font12">已发布分享：<span>0</span> 册</div>
            </div> 
            
            <div className="resDiv resArticle group hover:border-primary/50 transition-all cursor-pointer" onClick={() => handleNavigateToApps('/apps')}>
              <div className="text1 font20 flex items-center justify-center gap-1.5">
                <FileText size={16} className="text-amber-500" />
                <span>在编谱文</span>
              </div> 
              <div className="text2"><span className="bold font24">2</span> 篇</div> 
              <div className="text3 font12">已发布分享：<span>0</span> 篇</div>
            </div>
          </div> 

          {/* Node Count & Gender / Status Statistics */}
          <div className="nodeCount">
            <div className="topBox relative">
              <div className="numberBox">
                <div className="numberTitle bold font20 left flex items-center gap-1.5">
                  <span>人物条目总数</span>
                  <button 
                    className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                    onMouseEnter={() => setShowHelpTooltip(true)}
                    onMouseLeave={() => setShowHelpTooltip(false)}
                    onClick={() => setShowHelpTooltip(!showHelpTooltip)}
                  >
                    <HelpCircle size={15} />
                  </button>
                </div> 
                <div className="numberCount right"><span className="bold font24">1</span> 条</div>
              </div> 

              {/* Tooltip */}
              {showHelpTooltip && (
                <div className="absolute top-8 left-0 z-30 bg-popover text-popover-foreground border border-border rounded-md shadow-lg p-2.5 text-xs max-w-xs animate-in fade-in">
                  人物条目总数，是指所有云谱空间中录入谱系的全部人物节点总数量。
                </div>
              )}

              <div className="sexBox font16">
                总体男性占比<span>100</span>%（<span>1</span>） |  总体女性占比<span>0</span>%（<span>0</span>）
              </div>
            </div> 

            <div className="bottonBox font16">
              
              {/* Living Status */}
              <div className="treeBox leftTree">
                <div className="title1 bold">健在占比<span>0</span>%</div> 
                <div className="title2 bold font20 text-muted-foreground">0</div> 
                <div className="title3">
                  <div className="man">
                    <div className="bold font20 text-muted-foreground">0</div> 
                    <div className="font14">男性占比<span>0</span>%</div>
                  </div> 
                  <div className="woman">
                    <div className="bold font20 text-muted-foreground">0</div> 
                    <div className="font14">女性占比<span>0</span>%</div>
                  </div>
                </div>
              </div> 

              {/* Deceased Status */}
              <div className="treeBox rightTree border-primary/30 bg-primary/5">
                <div className="title1 bold text-primary">已故占比<span>100</span>%</div> 
                <div className="title2 bold font20 text-primary">1</div> 
                <div className="title3">
                  <div className="man">
                    <div className="bold font20 text-primary">1</div> 
                    <div className="font14">男性占比<span>100</span>%</div>
                  </div> 
                  <div className="woman">
                    <div className="bold font20 text-muted-foreground">0</div> 
                    <div className="font14">女性占比<span>0</span>%</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div> 

      {/* Guide Box (新手引导 三步成谱) */}
      <div className="guide-box flex-col flex-center">
        <div className="guide-title">人人都会用  轻松修家谱</div> 
        <div className="guide-desc">新手引导  三步成谱</div> 
        
        <div className="w-100 flex-center">
          
          {/* Step 0 */}
          <div className="item-box flex-1 flex-col flex-a-center">
            <div className="step-title">开始修谱</div> 
            <div className="step-box flex-center">
              <button 
                className="btn-item border-none hover:bg-muted"
                onClick={() => handleNavigateToApps('/apps')}
              >
                <div className="font-semibold text-foreground">登录云谱空间</div> 
                <div className="enter-tips">
                  独立登录页&nbsp;
                  <span className="link open-link text-primary font-medium hover:underline inline-flex items-center">
                    打开&gt;&gt;
                  </span>
                </div>
              </button> 
              <div className="diamond-box" style={{ width: '104.4px', right: '-105.4px' }}>
                <div className="diamond left" style={{ width: '212.8px', left: '-105.4px' }}></div>
              </div>
            </div>
          </div> 

          {/* Step 1 */}
          <div className="item-box flex-1 flex-col flex-a-center">
            <div className="step-title">第一步：录编资料</div> 
            <div className="step-box flex-col flex-j-between">
              <button 
                className="btn-item"
                onClick={() => handleNavigateToApps('/apps')}
              >
                <div className="font-semibold text-foreground">新建谱系</div>
                <div className="enter-tips">
                  录编世系资料&nbsp;
                  <span className="link text-primary font-medium hover:underline inline-flex items-center">
                    立即试试&gt;&gt;
                  </span>
                </div>
              </button> 
              
              <button 
                className="btn-item"
                onClick={() => handleNavigateToApps('/apps')}
              >
                <div className="font-semibold text-foreground">新建谱文</div>
                <div className="enter-tips">
                  录编图文资料&nbsp;
                  <span className="link text-primary font-medium hover:underline inline-flex items-center">
                    立即试试&gt;&gt;
                  </span>
                </div>
              </button> 
              
              <div className="diamond-box" style={{ width: '104.4px', right: '-105.4px' }}>
                <div className="diamond right" style={{ width: '212.8px', right: '-105.4px' }}></div>
              </div>
            </div>
          </div> 

          {/* Step 2 */}
          <div className="item-box flex-1 flex-col flex-a-center">
            <div className="step-title">第二步：编目成书</div> 
            <div className="step-box flex-center">
              <button 
                className="btn-item"
                onClick={() => handleNavigateToApps('/apps')}
              >
                <div className="font-semibold text-foreground">新建谱书</div>
                <div className="enter-tips">
                  <div>编辑目录并挂接谱系或谱文</div> 
                  <span className="link text-primary font-medium hover:underline inline-flex items-center">
                    立即试试&gt;&gt;
                  </span>
                </div>
              </button> 
              <div className="diamond-box" style={{ width: '104.4px', right: '-105.4px' }}>
                <div className="diamond left" style={{ width: '212.8px', left: '-105.4px' }}></div>
              </div>
            </div>
          </div> 

          {/* Step 3 */}
          <div className="item-box flex-1 flex-col flex-a-center">
            <div className="step-title">第三步：发布输出</div> 
            <div className="step-box flex-col flex-j-between">
              <button 
                className="btn-item"
                onClick={() => handleNavigateToApps('/apps')}
              >
                <div className="font-semibold text-foreground">发布更新</div>
                <div className="enter-tips">
                  手机微信谱及电脑网络谱&nbsp;
                  <span className="link text-primary font-medium hover:underline inline-flex items-center">
                    立即试试&gt;&gt;
                  </span>
                </div>
              </button> 
              
              <button 
                className="btn-item"
                onClick={() => handleNavigateToApps('/apps')}
              >
                <div className="font-semibold text-foreground">输出下载</div>
                <div className="enter-tips">
                  纸质谱高清矢量印刷文件&nbsp;
                  <span className="link text-primary font-medium hover:underline inline-flex items-center">
                    立即试试&gt;&gt;
                  </span>
                </div>
              </button> 
              
              <div className="diamond-box" style={{ width: '104.4px', right: '-105.4px' }}>
                <div className="diamond right" style={{ width: '212.8px', right: '-105.4px' }}></div>
              </div>
            </div>
          </div> 

          {/* Step 4 */}
          <div className="item-box flex-1 flex-col flex-a-center">
            <div className="step-title">随时管理</div> 
            <div className="step-box flex-center flex-col justify-between">
              <div className="enter-tips tips-top text-center">
                <div>如何嵌入公众号或网站</div> 
                <span 
                  onClick={() => showNotice('已开启微信公众号嵌入配置向导')}
                  className="link text-primary font-medium hover:underline inline-flex items-center cursor-pointer"
                >
                  操作指南&gt;&gt;
                </span>
              </div> 
              
              <button 
                id="btn-cloud-storage-manage"
                className="btn-item border-none my-1 hover:bg-muted font-medium text-foreground cursor-pointer flex items-center justify-center gap-1.5"
                onClick={() => setShowSupabaseModal(true)}
              >
                <Database size={14} className="text-emerald-500" />
                <span>Supabase 数据云端存储</span>
              </button> 
              
              <div className="enter-tips tips-bottom text-center">
                <div>云谱空间关联家族微站</div> 
                <span 
                  onClick={() => showNotice('已开启家族微站关联向导')}
                  className="link text-primary font-medium hover:underline inline-flex items-center cursor-pointer"
                >
                  操作指南&gt;&gt;
                </span>
              </div>
            </div>
          </div>

        </div>
      </div> 

      {/* Data Analysis Charts Section */}
      <div className="overViewCont">
        <div className="sumBlocks sunCharts">
          <div className="sumTitle">数据分析</div> 
          
          <div className="proconts">
            
            {/* Chart 1: 世序分析 */}
            <div className="blocks">
              <p className="chartsTitle">世序分析</p> 
              
              <div id="proconts" className="chartsCont relative">
                {/* SVG Bar Chart Visualization */}
                <svg className="w-full h-64 overflow-visible" viewBox="0 0 500 240">
                  {/* Grid Lines */}
                  <line x1="40" y1="40" x2="480" y2="40" stroke="currentColor" strokeDasharray="3 3" className="text-border" strokeWidth="1" />
                  <line x1="40" y1="90" x2="480" y2="90" stroke="currentColor" strokeDasharray="3 3" className="text-border" strokeWidth="1" />
                  <line x1="40" y1="140" x2="480" y2="140" stroke="currentColor" strokeDasharray="3 3" className="text-border" strokeWidth="1" />
                  <line x1="40" y1="190" x2="480" y2="190" stroke="currentColor" className="text-border" strokeWidth="1.5" />
                  
                  {/* Y Axis Labels */}
                  <text x="25" y="44" className="text-[11px] fill-muted-foreground text-right">3</text>
                  <text x="25" y="94" className="text-[11px] fill-muted-foreground text-right">2</text>
                  <text x="25" y="144" className="text-[11px] fill-muted-foreground text-right">1</text>
                  <text x="25" y="194" className="text-[11px] fill-muted-foreground text-right">0</text>

                  {/* 1世 Bar */}
                  <g 
                    className="cursor-pointer group"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredBar({ gen: '1世', count: 1, x: rect.left + 20, y: rect.top - 10 });
                    }}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <rect 
                      x="100" 
                      y="140" 
                      width="40" 
                      height="50" 
                      rx="4"
                      className="fill-emerald-500/80 hover:fill-emerald-500 transition-all duration-300"
                    />
                    <text x="120" y="210" textAnchor="middle" className="text-xs font-semibold fill-foreground">1世</text>
                    <text x="120" y="132" textAnchor="middle" className="text-xs font-bold fill-emerald-600 dark:fill-emerald-400">1人</text>
                  </g>

                  {/* 2世 Bar (0 placeholder) */}
                  <g className="cursor-pointer opacity-40">
                    <rect x="220" y="188" width="40" height="2" rx="1" className="fill-muted-foreground" />
                    <text x="240" y="210" textAnchor="middle" className="text-xs fill-muted-foreground">2世</text>
                  </g>

                  {/* 3世 Bar (0 placeholder) */}
                  <g className="cursor-pointer opacity-40">
                    <rect x="340" y="188" width="40" height="2" rx="1" className="fill-muted-foreground" />
                    <text x="360" y="210" textAnchor="middle" className="text-xs fill-muted-foreground">3世</text>
                  </g>
                </svg>

                {/* Tooltip on hover */}
                {hoveredBar && (
                  <div 
                    className="absolute z-50 bg-background/95 border border-border shadow-xl rounded-md p-3 text-xs pointer-events-none animate-in fade-in"
                    style={{ left: '160px', top: '50px' }}
                  >
                    <div className="font-semibold text-foreground mb-1">{hoveredBar.gen}</div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                      <span className="text-muted-foreground">人数:</span>
                      <span className="font-bold text-foreground">{hoveredBar.count}</span>
                    </div>
                  </div>
                )}
              </div>
            </div> 

            {/* Chart 2: 姓氏比例 */}
            <div className="blocks blocksLine">
              <p className="chartsTitle">姓氏比例</p> 
              
              <div className="relative flex items-center justify-center min-h-[260px]">
                
                {/* Center text overlay */}
                <div className="showNameAndPx">
                  <h1 className="font-serif">陈</h1> 
                  <p>100%</p>
                </div> 
                
                {/* Donut Chart */}
                <svg className="w-52 h-52 -rotate-90 transform" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    className="stroke-muted/40"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    className="stroke-amber-500 hover:stroke-amber-600 transition-all duration-300"
                    strokeWidth="10"
                    strokeDasharray="238.76"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

              </div>
              
              <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-amber-500 inline-block"></span>
                  <span className="font-medium text-foreground">陈姓</span> (1人 / 100%)
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Edit Basic Info Modal */}
      {showEditInfoModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Edit3 size={18} className="text-primary" />
                <h3 className="text-base font-bold text-foreground">编辑基本信息</h3>
              </div>
              <button 
                onClick={() => setShowEditInfoModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInfoSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">主题名 *</label>
                <Input 
                  value={projectInfo.themeName}
                  onChange={(e) => setProjectInfo({ ...projectInfo, themeName: e.target.value, title: `${e.target.value}的云谱空间` })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">姓氏 *</label>
                <Input 
                  value={projectInfo.surname}
                  onChange={(e) => setProjectInfo({ ...projectInfo, surname: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">所属地区 *</label>
                <Input 
                  value={projectInfo.region}
                  onChange={(e) => setProjectInfo({ ...projectInfo, region: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">备注信息</label>
                <textarea 
                  value={projectInfo.remarks}
                  onChange={(e) => setProjectInfo({ ...projectInfo, remarks: e.target.value })}
                  placeholder="填写家族堂号、派语、渊源等备忘说明..."
                  className="w-full h-20 rounded-md border border-input bg-transparent px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowEditInfoModal(false)}
                >
                  取消
                </Button>
                <Button type="submit" size="sm">
                  保存修改
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Layout Setting Modal */}
      {showLayoutSettingsModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Settings size={18} className="text-primary" />
                <h3 className="text-base font-bold text-foreground">选择版式体例</h3>
              </div>
              <button 
                onClick={() => setShowLayoutSettingsModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-3.5 rounded-lg border-2 border-primary bg-primary/5 cursor-pointer">
                <div className="flex items-center justify-between font-semibold text-sm text-foreground mb-1">
                  <span>欧式体例（五世一表）</span>
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-normal">当前选用</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  宋代欧阳修所创，世系图按世代横列，每五世为一单元，昭穆分明，简洁严谨。
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-border bg-card hover:bg-muted/40 cursor-pointer">
                <div className="font-semibold text-sm text-foreground mb-1">苏式体例（垂丝宝塔式）</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  宋代苏洵所创，以线条自上而下连接父子兄弟，呈宝塔垂丝状，亲疏一目了然。
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-border bg-card hover:bg-muted/40 cursor-pointer">
                <div className="font-semibold text-sm text-foreground mb-1">现代横排纲目式</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  结合现代出版物排版规范，左图右文或上图下传，适合微信手机谱与高清印刷。
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowLayoutSettingsModal(false)}
              >
                关闭
              </Button>
              <Button 
                size="sm"
                onClick={() => {
                  setShowLayoutSettingsModal(false);
                  showNotice('版式体例已应用！');
                  handleNavigateToApps('/apps');
                }}
              >
                确认并进入排版
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Supabase Database Connection Test Modal */}
      <DatabaseTestDialog 
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
        autoRun={true}
      />

    </div>
  );
};

export default DashboardPage;
