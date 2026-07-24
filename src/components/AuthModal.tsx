import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User as UserIcon, Shield, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, resetPassword, demoLoginAsAdmin } = useAuth();
  const { settings } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        setSuccessMsg('Login berhasil! Mengalihkan...');
        setTimeout(() => onClose(), 800);
      } else if (mode === 'register') {
        await register(email, password, displayName || email);
        setSuccessMsg('Registrasi akun berhasil! Selamat datang.');
        setTimeout(() => onClose(), 800);
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setSuccessMsg('Link reset password telah dikirim.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAdminLogin = async () => {
    setEmail('admin');
    setPassword('admin123');
    await login('admin', 'admin123');
    setSuccessMsg('Login sebagai Administrator WZ berhasil!');
    setTimeout(() => onClose(), 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-md glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Top Glow Decor */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-amber-500 to-blue-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl glass-card text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-3 text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider gold-gradient-text">
            {mode === 'login' ? 'Masuk ke WZ PROJECT' : mode === 'register' ? 'Daftar Akun Baru' : 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' ? 'Akses anime HD, novel VIP & store premium' : mode === 'register' ? 'Bergabunglah dengan WZ PROJECT' : 'Masukkan email/username Anda'}
          </p>
        </div>

        {/* Success or Error Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Nama Lengkap</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Nama Pengguna"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Email atau Username</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@domain.com atau admin"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">Kata Sandi</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Lupa Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input"
                />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-slate-900 border-white/10 text-amber-500 focus:ring-0"
              />
              <label htmlFor="remember" className="text-xs text-slate-300 cursor-pointer">
                Ingat Sesi Saya
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-gold py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            {isSubmitting ? 'Memproses...' : mode === 'login' ? 'Masuk Sekarang' : mode === 'register' ? 'Buat Akun WZ' : 'Kirim Reset Email'}
          </button>
        </form>

        {/* Quick Admin Login Option */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="p-3 rounded-2xl glass-card border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Akses Administrator
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                Login: admin • Pass: admin123
              </p>
            </div>
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-[11px] uppercase whitespace-nowrap shadow-md hover:bg-amber-400 transition-colors"
            >
              1-Click Admin
            </button>
          </div>
        </div>

        {/* Toggle Mode Footer */}
        <div className="mt-4 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              Belum punya akun?{' '}
              <button onClick={() => setMode('register')} className="text-amber-400 font-bold hover:underline">
                Daftar
              </button>
            </p>
          ) : (
            <p>
              Sudah memiliki akun?{' '}
              <button onClick={() => setMode('login')} className="text-amber-400 font-bold hover:underline">
                Masuk
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};
