import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, Crown, ShoppingBag, Info, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NotificationDrawer: React.FC = () => {
  const { isNotificationOpen, setIsNotificationOpen, notifications } = useApp();

  if (!isNotificationOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-sm h-full glass-panel border-l border-white/10 flex flex-col p-6 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-lg text-white">Notifikasi</h3>
            </div>
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="p-2 rounded-xl glass-card text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                Belum ada notifikasi baru.
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="p-3.5 rounded-2xl glass-card border border-white/5 hover:border-amber-500/30">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                      {n.type === 'vip' ? (
                        <Crown className="w-4 h-4" />
                      ) : n.type === 'order' ? (
                        <ShoppingBag className="w-4 h-4" />
                      ) : (
                        <Info className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{n.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-slate-500 font-mono mt-2 block">{n.date}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
