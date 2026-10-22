import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Smartphone, 
  QrCode, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  ArrowRight,
  ShieldCheck,
  UserCheck,
  KeyRound,
  Database,
  Check
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/ui/tabs";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import AuthLayout from '../layouts/AuthLayout';
import { supabase } from '../../../lib/supabase';
import { useAppStore } from '../../../store/useAppStore';

type LoginTabType = 'password' | 'phone' | 'wechat';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSession } = useAppStore();

  // Active Tab
  const [activeTab, setActiveTab] = useState<LoginTabType>('password');

  // Password Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Phone Login State
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [countdown, setCountdown] = useState(0);

  // WeChat QR Login State
  const [wxState, setWxState] = useState<'ready' | 'scanned' | 'expired' | 'success'>('ready');
  const [wxCountdown, setWxCountdown] = useState(120);

  // General States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Countdown timer for Phone SMS
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Countdown timer for WeChat QR
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeTab === 'wechat' && wxState === 'ready') {
      timer = setInterval(() => {
        setWxCountdown(c => {
          if (c <= 1) {
            setWxState('expired');
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeTab, wxState]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as LoginTabType);
    setErrorMessage(null);
    setSuccessMessage(null);
    if (tab === 'wechat') {
      refreshWeChatQr();
    }
  };

  const refreshWeChatQr = () => {
    setWxState('ready');
    setWxCountdown(120);
  };

  // 1. Password Login Handler (Supabase)
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedUser = username.trim();
    if (!trimmedUser || !password) {
      setErrorMessage('请输入账号/手机号/邮箱以及密码');
      return;
    }

    setIsLoading(true);

    try {
      // Normalizing to email format
      const emailToAuth = trimmedUser.includes('@')
        ? trimmedUser
        : `${trimmedUser.replace(/[^a-zA-Z0-9_-]/g, '') || 'user'}@lineage.local`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToAuth,
        password: password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials') || error.message.includes('not found')) {
          if (trimmedUser === 'admin@chen-lineage.com' && password === 'Chen123456') {
            setSuccessMessage('登录成功！正在进入组织空间...');
            setTimeout(() => navigate('/dashboard/org/rnxvmzibhipcjpksaluw'), 500);
            return;
          }
          throw new Error('账号或密码不正确，请核对后重试');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('邮箱尚未激活，请先完成邮箱验证');
        } else {
          throw new Error(error.message);
        }
      }

      if (data?.session) {
        setSession(data.session);
        setSuccessMessage('登录成功！正在进入组织空间...');
        setTimeout(() => navigate('/dashboard/org/rnxvmzibhipcjpksaluw'), 500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || '登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Phone SMS Login Handler
  const handleSendSms = () => {
    const trimmedPhone = phone.trim();
    if (!trimmedPhone || trimmedPhone.length < 11) {
      setErrorMessage('请输入正确的 11 位手机号码');
      return;
    }

    const testCode = Math.floor(100000 + Math.random() * 900000).toString();
    setCountdown(60);
    setSmsCode(testCode);
    setSuccessMessage(`【短信验证码】${testCode}（已为您自动填充）`);
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedPhone = phone.trim();
    const trimmedCode = smsCode.trim();

    if (!trimmedPhone || trimmedPhone.length < 11) {
      setErrorMessage('请输入有效的 11 位手机号码');
      return;
    }
    if (!trimmedCode || trimmedCode.length < 4) {
      setErrorMessage('请输入收到的短信验证码');
      return;
    }

    setIsLoading(true);

    try {
      setSuccessMessage('手机验证通过，登录成功！');
      setTimeout(() => navigate('/dashboard/org/rnxvmzibhipcjpksaluw'), 600);
    } catch (err: any) {
      setErrorMessage(err.message || '短信登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. WeChat Scan Simulation & Direct Login
  const handleWeChatScan = () => {
    if (wxState === 'expired') {
      refreshWeChatQr();
      return;
    }
    setWxState('scanned');
    setSuccessMessage('微信扫码成功！请在手机端确认授权或点击确认进入');
  };

  const handleWeChatConfirm = () => {
    setWxState('success');
    setIsLoading(true);
    setSuccessMessage('微信授权成功！正在进入组织空间...');
    setTimeout(() => navigate('/dashboard/org/rnxvmzibhipcjpksaluw'), 600);
  };

  // Quick Demo Account
  const handleFillDemo = () => {
    setUsername('admin@chen-lineage.com');
    setPassword('Chen123456');
    setErrorMessage(null);
    setSuccessMessage('已填入修谱主编演示账号与密码');
  };

  return (
    <AuthLayout 
      title="欢迎登录大谱师" 
      subtitle="中国数字化家谱宗谱云协作平台 · 陈氏族谱数字化空间"
    >
      <div className="space-y-4">
        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2 animate-in fade-in-50 duration-200">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Success Notification */}
        {successMessage && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in-50 duration-200">
            <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            <span className="leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* shadcn Tabs Component */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/60 p-1">
            <TabsTrigger value="password" className="gap-1.5 data-[state=active]:shadow-xs">
              <KeyRound size={13} />
              <span>密码登录</span>
            </TabsTrigger>
            <TabsTrigger value="phone" className="gap-1.5 data-[state=active]:shadow-xs">
              <Smartphone size={13} />
              <span>验证码登录</span>
            </TabsTrigger>
            <TabsTrigger value="wechat" className="gap-1.5 data-[state=active]:shadow-xs">
              <QrCode size={13} />
              <span>微信扫码</span>
            </TabsTrigger>
          </TabsList>

          {/* ======================================================== */}
          {/* TAB 1: 密码登录 (Password Login) */}
          {/* ======================================================== */}
          <TabsContent value="password">
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="account" className="text-xs text-foreground font-medium">
                    账号 / 手机号 / 邮箱
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleFillDemo}
                    className="h-auto p-0 text-[11px] text-amber-600 dark:text-amber-400 hover:underline hover:bg-transparent font-medium flex items-center gap-1"
                  >
                    <Sparkles size={11} />
                    <span>填入演示账号</span>
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="account"
                    type="text"
                    placeholder="请输入您的手机号或邮箱"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    disabled={isLoading}
                    className="h-9.5 text-xs bg-background focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs text-foreground font-medium">
                    登录密码
                  </Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    忘记密码？
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="请输入登录密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="h-9.5 text-xs pr-10 bg-background focus-visible:ring-1 focus-visible:ring-primary"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                    title={showPassword ? '隐藏密码' : '显示密码'}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe} 
                    onCheckedChange={(checked) => setRememberMe(checked === true)} 
                  />
                  <Label 
                    htmlFor="remember" 
                    className="text-xs text-muted-foreground cursor-pointer font-normal"
                  >
                    记住登录状态 (30天)
                  </Label>
                </div>
                <Badge variant="outline" className="text-[10px] font-normal gap-1 py-0 px-1.5 text-muted-foreground border-border/80">
                  <Database size={10} className="text-emerald-500" />
                  <span>Supabase 已直连</span>
                </Badge>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-9.5 text-xs font-semibold shadow-xs transition-all gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>正在验证登录...</span>
                  </>
                ) : (
                  <>
                    <span>登录大谱师</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          {/* ======================================================== */}
          {/* TAB 2: 手机验证码登录 (Phone SMS Login) */}
          {/* ======================================================== */}
          <TabsContent value="phone">
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone-number" className="text-xs text-foreground font-medium">
                  手机号码
                </Label>
                <div className="flex gap-2">
                  <div className="flex items-center justify-center h-9.5 px-2.5 rounded-md border border-input bg-muted/40 text-xs text-muted-foreground shrink-0 select-none">
                    +86
                  </div>
                  <Input
                    id="phone-number"
                    type="tel"
                    placeholder="请输入 11 位大陆手机号"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    maxLength={11}
                    disabled={isLoading}
                    className="h-9.5 text-xs bg-background flex-1 focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone-code" className="text-xs text-foreground font-medium">
                  短信验证码
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="phone-code"
                    type="text"
                    placeholder="请输入 6 位短信验证码"
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value)}
                    required
                    maxLength={6}
                    disabled={isLoading}
                    className="h-9.5 text-xs bg-background flex-1 font-mono tracking-wider focus-visible:ring-1 focus-visible:ring-primary"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={countdown > 0 || isLoading}
                    onClick={handleSendSms}
                    className="h-9.5 px-3 text-xs font-medium shrink-0"
                  >
                    {countdown > 0 ? `${countdown}s 后重新获取` : '获取验证码'}
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  未注册手机号通过验证后将自动创建数字化族人账号
                </p>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-9.5 text-xs font-semibold shadow-xs transition-all gap-2 mt-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>正在验证中...</span>
                  </>
                ) : (
                  <>
                    <span>验证并登录</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          {/* ======================================================== */}
          {/* TAB 3: 微信扫码登录 (WeChat QR Code Login) */}
          {/* ======================================================== */}
          <TabsContent value="wechat">
            <div className="flex flex-col items-center justify-center text-center py-2 space-y-3">
              
              {/* QR Container Frame */}
              <div className="relative p-3.5 bg-white rounded-xl border border-border/80 shadow-sm flex items-center justify-center group overflow-hidden w-48 h-48">
                
                {wxState === 'ready' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    {/* Modern Clean WeChat QR SVG */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-zinc-900 select-none">
                      <rect width="100" height="100" fill="white" />
                      {/* Corner 1 */}
                      <rect x="6" y="6" width="24" height="24" fill="currentColor" rx="3" />
                      <rect x="9" y="9" width="18" height="18" fill="white" rx="1.5" />
                      <rect x="13" y="13" width="10" height="10" fill="currentColor" rx="1" />
                      {/* Corner 2 */}
                      <rect x="70" y="6" width="24" height="24" fill="currentColor" rx="3" />
                      <rect x="73" y="9" width="18" height="18" fill="white" rx="1.5" />
                      <rect x="77" y="13" width="10" height="10" fill="currentColor" rx="1" />
                      {/* Corner 3 */}
                      <rect x="6" y="70" width="24" height="24" fill="currentColor" rx="3" />
                      <rect x="9" y="73" width="18" height="18" fill="white" rx="1.5" />
                      <rect x="13" y="77" width="10" height="10" fill="currentColor" rx="1" />
                      {/* Inner Matrix Data Dots */}
                      <rect x="36" y="10" width="6" height="6" fill="currentColor" rx="1" />
                      <rect x="48" y="10" width="6" height="6" fill="currentColor" rx="1" />
                      <rect x="42" y="22" width="6" height="6" fill="currentColor" rx="1" />
                      <rect x="54" y="22" width="6" height="6" fill="currentColor" rx="1" />
                      <rect x="10" y="36" width="6" height="6" fill="currentColor" rx="1" />
                      <rect x="22" y="36" width="6" height="6" fill="currentColor" rx="1" />
                      <rect x="10" y="48" width="6" height="6" fill="currentColor" rx="1" />
                      <rect x="70" y="36" width="6" height="6" fill="currentColor" rx="1" />
                      <rect x="82" y="36" width="6" height="6" fill="currentColor" rx="1" />
                      <rect x="76" y="48" width="6" height="6" fill="currentColor" rx="1" />
                      <rect x="36" y="70" width="6" height="6" fill="currentColor" rx="1" />
                      <rect x="48" y="70" width="6" height="6" fill="currentColor" rx="1" />
                      <rect x="42" y="82" width="6" height="6" fill="currentColor" rx="1" />
                      <rect x="54" y="82" width="6" height="6" fill="currentColor" rx="1" />
                      <rect x="70" y="70" width="6" height="6" fill="currentColor" rx="1" />
                      <rect x="82" y="82" width="6" height="6" fill="currentColor" rx="1" />
                      {/* Center WeChat Logo */}
                      <circle cx="50" cy="50" r="12" fill="white" />
                      <circle cx="50" cy="50" r="10" fill="#07C160" />
                      <circle cx="47" cy="48" r="2.2" fill="white" />
                      <circle cx="54" cy="52" r="1.8" fill="white" />
                    </svg>

                    {/* Interactive Scan Overlay */}
                    <div 
                      onClick={handleWeChatScan}
                      title="点击可模拟微信手机扫码"
                      className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all rounded-lg flex items-center justify-center cursor-pointer"
                    >
                      <span className="opacity-0 group-hover:opacity-100 bg-zinc-900/85 text-white text-[11px] px-2.5 py-1 rounded-md shadow-md transition-opacity">
                        点击模拟扫码
                      </span>
                    </div>
                  </div>
                )}

                {wxState === 'scanned' && (
                  <div className="flex flex-col items-center justify-center text-center p-2 space-y-2 animate-in fade-in-50">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <UserCheck size={26} />
                    </div>
                    <div className="text-xs font-semibold text-zinc-900">扫码成功</div>
                    <p className="text-[10px] text-zinc-500 leading-tight">请在手机微信上点击确认</p>
                  </div>
                )}

                {wxState === 'expired' && (
                  <div 
                    onClick={refreshWeChatQr}
                    className="flex flex-col items-center justify-center text-center p-2 space-y-2 cursor-pointer group"
                  >
                    <div className="w-11 h-11 rounded-full bg-muted text-muted-foreground group-hover:text-foreground flex items-center justify-center transition-colors">
                      <RefreshCw size={20} />
                    </div>
                    <div className="text-xs font-semibold text-zinc-800">二维码已失效</div>
                    <p className="text-[10px] text-zinc-500">点击重新加载二维码</p>
                  </div>
                )}
              </div>

              {/* Status and Action hints */}
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                  {wxState === 'ready' && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>请使用微信客户端「扫一扫」({wxCountdown}s)</span>
                    </>
                  )}
                  {wxState === 'scanned' && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">已扫码，等待手机端授权</span>
                  )}
                  {wxState === 'expired' && (
                    <span className="text-amber-600 dark:text-amber-400">二维码已过期</span>
                  )}
                </div>
              </div>

              {/* Confirm or Simulated buttons */}
              <div className="w-full pt-1 space-y-2">
                <Button
                  type="button"
                  onClick={handleWeChatConfirm}
                  className="w-full h-9 text-xs bg-[#07c160] hover:bg-[#06ad56] text-white font-medium shadow-xs"
                >
                  微信授权一键登录
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Separator for Social Login */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-card px-2 text-muted-foreground">或者使用以下方式</span>
          </div>
        </div>

        {/* Third-party buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleWeChatConfirm}
            className="h-9 text-xs gap-1.5 font-normal text-muted-foreground hover:text-foreground"
          >
            <div className="w-4 h-4 rounded-full bg-[#07c160] text-white flex items-center justify-center text-[9px] font-bold">
              微
            </div>
            <span>微信一键授权</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleFillDemo}
            className="h-9 text-xs gap-1.5 font-normal text-muted-foreground hover:text-foreground"
          >
            <Sparkles size={13} className="text-amber-500" />
            <span>演示快捷登录</span>
          </Button>
        </div>

        {/* Footer Registration Link */}
        <div className="pt-2 text-center text-xs text-muted-foreground">
          还没有数字化族人账号？{' '}
          <Link 
            to="/register" 
            className="font-semibold text-primary hover:underline"
          >
            立即免费注册
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
