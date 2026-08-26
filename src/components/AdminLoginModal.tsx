import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Lock, Mail, ShieldCheck, KeyRound, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    loginAdmin,
    setIsAdminDashboardOpen,
  } = useStore();

  const [email, setEmail] = useState('admin@podifactory.com');
  const [password, setPassword] = useState('podi1234');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAdminModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = loginAdmin(email, password);
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
    }, 400);
  };

  const fillDemoCreds = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
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
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-brand text-lg font-bold text-brand-on-surface">
                  Admin Portal Login
                </h3>
                <p className="text-xs text-brand-on-surface-variant">
                  Secure price and menu management
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

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            
            {/* Quick Demo Credentials Info Chip */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                <span>Demo Admin Credentials (Click to prefill):</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fillDemoCreds('admin@podifactory.com', 'podi1234')}
                  className="px-2.5 py-1 bg-amber-100/90 hover:bg-amber-200 rounded text-[11px] font-mono font-semibold text-amber-950 transition cursor-pointer"
                >
                  admin@podifactory.com (Master Chef)
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCreds('manager@podifactory.com', 'podi1234')}
                  className="px-2.5 py-1 bg-amber-100/90 hover:bg-amber-200 rounded text-[11px] font-mono font-semibold text-amber-950 transition cursor-pointer"
                >
                  manager@podifactory.com
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

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
                placeholder="admin@podifactory.com"
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
                  className="text-[11px] text-brand-muted hover:text-brand-primary flex items-center gap-1"
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
                placeholder="Enter password..."
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
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoading ? 'VERIFYING CREDENTIALS...' : 'SIGN IN SECURELY'}</span>
            </button>

            <div className="text-[11px] text-center text-brand-muted pt-1">
              Protected dashboard for menu modifications & price updates.
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
