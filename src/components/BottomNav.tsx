import React, { useState } from 'react';
import { useApp, ActiveTab } from '../context/AppContext';
import { Home, BookOpen, Music, ShoppingBag, Key } from 'lucide-react';
import { CodeCheckModal } from './CodeCheckModal';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const navItems: Array<{ id: ActiveTab | 'check_code'; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { id: 'novel', label: 'Novel VIP', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'music', label: 'Musik Real', icon: <Music className="w-5 h-5" /> },
    { id: 'store', label: 'Store', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'check_code', label: 'Cek Akses', icon: <Key className="w-5 h-5" /> },
  ];

  const handleNavClick = (id: ActiveTab | 'check_code') => {
    if (id === 'check_code') {
      setIsCodeModalOpen(true);
    } else {
      setActiveTab(id);
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-white/10 px-2 py-2 sm:py-2.5">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-300 relative ${
                  isActive
                    ? 'text-amber-400 font-bold scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-purple-500/10 rounded-2xl blur-xs -z-10" />
                )}
                
                <div className={`p-1 rounded-xl transition-transform ${isActive ? 'bg-amber-500/20 text-amber-300 shadow-sm shadow-amber-500/50' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-[11px] mt-1 font-medium tracking-wide">
                  {item.label}
                </span>

                {isActive && (
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-0.5 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <CodeCheckModal isOpen={isCodeModalOpen} onClose={() => setIsCodeModalOpen(false)} />
    </>
  );
};
