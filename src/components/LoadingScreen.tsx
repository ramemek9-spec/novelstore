import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
  siteName?: string;
  logoUrl?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, siteName = 'WZ PROJECT', logoUrl }) => {
  const [progress, setProgress] = useState<number>(0);
  const [loadingText, setLoadingText] = useState<string>('Inisialisasi sistem...');

  useEffect(() => {
    const textInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 30) {
          setLoadingText('Memuat database Firebase & Enkripsi...');
          return prev + 12;
        } else if (prev < 65) {
          setLoadingText('Menyiapkan media streaming & VIP novel...');
          return prev + 15;
        } else if (prev < 90) {
          setLoadingText('Sinkronisasi profil user...');
          return prev + 18;
        } else if (prev < 100) {
          setLoadingText('Hampir selesai...');
          return 100;
        }
        return 100;
      });
    }, 180);

    return () => clearInterval(textInterval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080c] px-6 text-center select-none overflow-hidden"
    >
      {/* Background glowing energy Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-purple-600/30 via-amber-500/20 to-blue-600/30 blur-3xl rounded-full pointer-events-none animate-pulse" />

      {/* 3D Glass Emblem */}
      <motion.div
        initial={{ scale: 0.8, rotateY: -180, opacity: 0 }}
        animate={{ scale: 1, rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative mb-8"
      >
        <div className="w-28 h-28 rounded-3xl glass-panel flex items-center justify-center p-4 border border-amber-500/40 shadow-2xl shadow-amber-500/20 relative group">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-purple-500/20 to-blue-500/20 opacity-50 blur-md" />
          
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-20 h-20 object-contain rounded-2xl relative z-10" />
          ) : (
            <div className="flex flex-col items-center justify-center relative z-10">
              <Sparkles className="w-10 h-10 text-amber-400 mb-1 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="font-extrabold text-xl tracking-wider text-white">WZ</span>
            </div>
          )}

          <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 p-1.5 rounded-full shadow-lg">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-widest gold-gradient-text uppercase font-mono">
          {siteName}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 tracking-widest uppercase">
          Streaming Anime • VIP Novel • Store Premium
        </p>
      </motion.div>

      {/* Progress Bar Container */}
      <div className="w-full max-w-md px-4">
        <div className="h-2.5 w-full bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-white/10 glass-panel">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 via-amber-500 to-blue-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.2 }}
          />
        </div>

        {/* Status Text & Percentage */}
        <div className="flex items-center justify-between mt-3 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            {loadingText}
          </span>
          <span className="text-amber-400 font-bold">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
};
