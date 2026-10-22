import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  MailCheck, 
  UserPlus, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAppStore } from '../../../store/useAppStore';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSession } = useAppStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('修谱编委会主编');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccessAwaitingConfirm, setIsSuccessAwaitingConfirm] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setErrorMessage('请输入您的姓名或修谱称谓');
      return;
    }
    if (!trimmedEmail) {
      setErrorMessage('请输入电子邮箱');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('密码长度至少需要 6 个字符');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('两次输入的密码不一致，请重新输入');
      return;
    }

    setIsLoading(true);

    try {
      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: password,
        options: {
          data: {
            name: trimmedName,
            role: role
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered') || error.message.includes('already registered')) {
          throw new Error('该邮箱已注册账号，请直接前往登录或通过忘记密码重置。');
        } else if (error.message.includes('Password should be at least 6 characters')) {
          throw new Error('密码强度不足，长度至少需 6 位字符。');
        } else if (error.message.includes('rate limit')) {
          throw new Error('注册操作过于频繁，请稍候再试。');
        } else {
          throw new Error(`注册失败: ${error.message}`);
        }
      }

      if (data?.session) {
        // If email confirmation is disabled in Supabase, session is active immediately
        setSession(data.session);
        navigate('/');
      } else if (data?.user) {
        // User created, waiting for email confirmation
        setRegisteredEmail(trimmedEmail);
        setIsSuccessAwaitingConfirm(true);
      } else {
        throw new Error('未获取到注册响应数据，请重试');
      }
    } catch (err: any) {
      setErrorMessage(err.message || '注册失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // If waiting for email confirmation screen
  if (isSuccessAwaitingConfirm) {
    return (
      <AuthLayout 
        title="账号创建成功" 
        subtitle="已将激活信息同步至 Supabase 数据库"
      >
        <div className="text-center space-y-4 py-2">
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <MailCheck size={28} />
          </div>

          <div>
            <h3 className="font-bold text-base text-foreground mb-1">请验证您的邮箱</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              我们已向 <strong className="text-foreground">{registeredEmail}</strong> 发送了一封账号确认邮件。
            </p>
          </div>

          <div className="p-3 bg-muted/40 rounded-lg border border-border text-xs text-left space-y-1.5 text-muted-foreground">
            <div className="flex items-center gap-1.5 text-foreground font-medium">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>温馨提示：</span>
            </div>
            <p>1. 请登录您的邮箱查收激活链接；</p>
            <p>2. 若未收到，请检查垃圾邮件箱；</p>
            <p>3. 如在 Supabase 后台已关闭邮箱验证，可直接点击下方按钮登录。</p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button 
              id="btn-goto-login-after-register"
              onClick={() => navigate('/login')}
              className="w-full h-9 text-xs font-semibold"
            >
              前往登录
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsSuccessAwaitingConfirm(false)}
              className="w-full h-8 text-xs"
            >
              返回注册界面
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="注册新账号" 
      subtitle="在 Supabase 数据库建立您的族谱管理档案"
    >
      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-start gap-2 animate-in fade-in">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1">
          <Label htmlFor="name" className="text-xs font-medium text-foreground">姓名 / 称谓 *</Label>
          <Input 
            id="name" 
            placeholder="例如：陈建华、修谱编委" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
            autoComplete="name"
            className="h-8.5 text-xs"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="email" className="text-xs font-medium text-foreground">电子邮箱 *</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="name@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            autoComplete="email"
            className="h-8.5 text-xs"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="role" className="text-xs font-medium text-foreground">管理角色</Label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full h-8.5 text-xs rounded-md border border-input bg-background px-3 py-1 text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            disabled={isLoading}
          >
            <option value="修谱编委会主编">修谱编委会主编</option>
            <option value="族谱管理员">族谱管理员</option>
            <option value="族谱校对员">族谱校对员</option>
            <option value="族人成员">族人成员</option>
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="text-xs font-medium text-foreground">设置密码 (至少6位) *</Label>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? 'text' : 'password'} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
              autoComplete="new-password"
              className="h-8.5 text-xs pr-9"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword" className="text-xs font-medium text-foreground">确认密码 *</Label>
          <Input 
            id="confirmPassword" 
            type={showPassword ? 'text' : 'password'} 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required 
            autoComplete="new-password"
            className="h-8.5 text-xs"
            disabled={isLoading}
          />
        </div>

        <Button 
          id="btn-submit-register"
          type="submit" 
          className="w-full h-9 text-xs font-semibold gap-1.5 shadow-xs mt-2" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>正在创建账号...</span>
            </>
          ) : (
            <>
              <UserPlus size={14} />
              <span>创建 Supabase 账号</span>
            </>
          )}
        </Button>
      </form>
      
      {/* Bottom Switch */}
      <div className="mt-5 text-center text-xs border-t border-border pt-4">
        <span className="text-muted-foreground">已有账号？ </span>
        <Link to="/login" className="font-semibold text-primary hover:underline">
          立即登录
        </Link>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
