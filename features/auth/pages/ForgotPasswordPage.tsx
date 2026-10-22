import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, Mail, Send } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('请输入注册时的电子邮箱');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: `${window.location.origin}/#/login`
      });

      if (error) {
        if (error.message.includes('rate limit')) {
          throw new Error('请求过于频繁，请稍候再试。');
        } else {
          throw new Error(`发送重置邮件失败: ${error.message}`);
        }
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || '发送失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="找回密码" 
      subtitle="输入注册邮箱，我们将向您发送重置密码的安全链接"
    >
      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-start gap-2 animate-in fade-in">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium text-foreground">注册电子邮箱</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              autoComplete="email"
              className="h-9 text-xs"
              disabled={isLoading}
            />
          </div>

          <Button 
            id="btn-send-reset-email"
            type="submit" 
            className="w-full h-9 text-xs font-semibold gap-1.5 shadow-xs" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>正在发送邮件...</span>
              </>
            ) : (
              <>
                <Send size={13} />
                <span>发送密码重置链接</span>
              </>
            )}
          </Button>
        </form>
      ) : (
        <div className="text-center space-y-4 py-1">
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 size={28} />
          </div>

          <div>
            <h3 className="font-bold text-sm text-foreground mb-1">重置邮件已发送</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              请检查您的邮箱 <strong className="text-foreground">{email}</strong>，点击邮件内的链接完成密码重置。
            </p>
          </div>

          <div className="p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground border border-border">
            若未收到邮件，请检查垃圾箱，或在 60 秒后重试。
          </div>
        </div>
      )}

      <div className="mt-6 text-center text-xs">
        <Link to="/login" className="font-medium text-primary hover:underline inline-flex items-center gap-1.5">
          <ArrowLeft size={13} /> 
          <span>返回登录界面</span>
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
