import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { isSupabaseConfigured } from '../services/supabaseClient';
import {
  X,
  Lock,
  Mail,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  Send,
  Loader2,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    loginAdmin,
    requestMagicLink,
    setIsAdminDashboardOpen,
  } = useStore();

  const [authMode, setAuthMode] = useState<'password' | 'magic_link'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAdminModalOpen) return null;

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await loginAdmin(email, password);
      setIsLoading(false);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          setIsAdminModalOpen(false);
          setIsAdminDashboardOpen(true);
        }, 600);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err?.message || 'Login failed.');
    }
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await requestMagicLink(email);
      setIsLoading(false);
      if (res.success) {
        setSuccessMsg(res.message);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err?.message || 'Failed to send magic link.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAdminModalOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        {/* Dialog Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md bg-brand-surface-card rounded-2xl shadow-2xl overflow-hidden z-10 border border-brand-outline-variant/40 my-auto"
          style={{
            backgroundColor: 'var(--color-surface-card)',
            borderColor: 'var(--color-outline-variant)',
          }}
        >
          {/* Header */}
          <div className="p-5 border-b border-brand-outline-variant/30 flex items-center justify-between bg-brand-surface-container/50">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-xs"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-brand text-lg font-bold text-brand-on-surface">
                  Admin Portal Login
                </h3>
                <p className="text-xs text-brand-on-surface-variant">
                  Sign in to manage catalog, pricing & settings
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAdminModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-brand-surface text-brand-on-surface transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          {isSupabaseConfigured && (
            <div className="flex border-b border-brand-outline-variant/30 bg-brand-surface-container/30 px-5 pt-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('password');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`pb-2 font-bold font-label-brand transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  authMode === 'password'
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-brand-muted hover:text-brand-on-surface'
                }`}
                style={{
                  borderColor: authMode === 'password' ? 'var(--color-primary)' : 'transparent',
                  color: authMode === 'password' ? 'var(--color-primary)' : 'inherit',
                }}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Password Login</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('magic_link');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`pb-2 font-bold font-label-brand transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  authMode === 'magic_link'
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-brand-muted hover:text-brand-on-surface'
                }`}
                style={{
                  borderColor: authMode === 'magic_link' ? 'var(--color-primary)' : 'transparent',
                  color: authMode === 'magic_link' ? 'var(--color-primary)' : 'inherit',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Passwordless Magic Link</span>
              </button>
            </div>
          )}

          {/* Form Content */}
          <div className="p-5 sm:p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">{errorMsg}</p>
                  {isSupabaseConfigured && errorMsg.includes('Invalid') && (
                    <p className="text-[11px] text-red-600">
                      💡 Tip: Create your admin user in your Supabase Dashboard: <strong>Authentication &gt; Users &gt; "Add user" &gt; "Create user"</strong>.
                    </p>
                  )}
                </div>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* PASSWORD LOGIN FORM */}
            {authMode === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-label-brand font-bold uppercase tracking-wider text-brand-on-surface flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-brand-muted" />
                    <span>Admin Email</span>
                  </label>
                  <input
                    id="admin-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. your-email@gmail.com"
                    className="w-full text-sm p-3 bg-brand-surface-card border border-brand-outline-variant/70 rounded-lg text-brand-on-surface focus:outline-none focus:ring-2 focus:ring-brand-primary/40 shadow-2xs"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-label-brand font-bold uppercase tracking-wider text-brand-on-surface flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-brand-muted" />
                      <span>Password</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-brand-muted hover:text-brand-primary flex items-center gap-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <input
                    id="admin-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your Supabase admin password..."
                    className="w-full text-sm p-3 bg-brand-surface-card border border-brand-outline-variant/70 rounded-lg text-brand-on-surface focus:outline-none focus:ring-2 focus:ring-brand-primary/40 shadow-2xs"
                  />
                </div>

                {/* Submit Button */}
                <button
                  id="admin-login-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 text-xs font-label-brand font-bold tracking-widest uppercase text-white shadow-md active:scale-98 transition-all cursor-pointer rounded-brand-btn flex items-center justify-center gap-2 mt-2"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-on-primary)',
                    borderRadius: 'var(--radius-btn)',
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AUTHENTICATING WITH SUPABASE...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>SIGN IN SECURELY</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* MAGIC LINK FORM */}
            {authMode === 'magic_link' && (
              <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                  <p>
                    Enter your email to receive a passwordless, cryptographically signed login link directly to your inbox.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-label-brand font-bold uppercase tracking-wider text-brand-on-surface flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-brand-muted" />
                    <span>Your Admin Email</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. your-email@gmail.com"
                    className="w-full text-sm p-3 bg-brand-surface-card border border-brand-outline-variant/70 rounded-lg text-brand-on-surface focus:outline-none focus:ring-2 focus:ring-brand-primary/40 shadow-2xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 text-xs font-label-brand font-bold tracking-widest uppercase text-white shadow-md active:scale-98 transition-all cursor-pointer rounded-brand-btn flex items-center justify-center gap-2 mt-2"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-on-primary)',
                    borderRadius: 'var(--radius-btn)',
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>SENDING MAGIC LINK...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>SEND MAGIC LOGIN LINK</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
