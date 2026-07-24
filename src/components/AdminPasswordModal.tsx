import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Shield, Lock, X, KeyRound, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({ isOpen, onClose }) => {
  const { verifyAdminPassword } = useAuth();
  const { setActiveTab } = useApp();
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (verifyAdminPassword(password)) {
      setPassword('');
      onClose();
      setActiveTab('admin');
    } else {
      setErrorMsg('Password Administrator Salah! Akses Ditolak.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-sm glass-panel border border-amber-500/40 rounded-3xl p-6 sm:p-8 relative shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl glass-card text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-3 text-amber-400 shadow-lg shadow-amber-500/20">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-white gold-gradient-text uppercase font-mono tracking-wider">
              Otorisasi Admin
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Masukkan password rahasia untuk mengakses Panel Kelola WZ PROJECT.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Password Admin</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password khusus admin..."
                  className="w-full px-4 py-3 text-xs rounded-xl glass-input focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-gold w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Masuk Panel Admin</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
