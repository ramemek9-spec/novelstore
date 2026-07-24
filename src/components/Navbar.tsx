import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, Shield, Key, MoreVertical, MessageSquare, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { CodeCheckModal } from './CodeCheckModal';
import { AdminPasswordModal } from './AdminPasswordModal';

export const Navbar: React.FC = () => {
  const { searchQuery, setSearchQuery, activeTab, setActiveTab, settings, setIsNotificationOpen, notifications } = useApp();
  const { isAdmin } = useAuth();

  const [isThreeDotMenuOpen, setIsThreeDotMenuOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isAdminPassModalOpen, setIsAdminPassModalOpen] = useState(false);

  const handleAdminClick = () => {
    setIsThreeDotMenuOpen(false);
    if (isAdmin) {
      setActiveTab('admin');
    } else {
      setIsAdminPassModalOpen(true);
    }
  };

  const openAdminWa = () => {
    setIsThreeDotMenuOpen(false);
    const waNumber = settings.adminWhatsapp.replace(/[^0-9]/g, '') || '6281234567890';
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent('Halo Admin ' + settings.siteName + ', saya ingin bertanya mengenai akses/layanan.')}`, '_blank');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Top-Left Section: Titik 3 Menu + Brand Logo */}
          <div className="flex items-center gap-2 relative">
            {/* Titik 3 Kiri Atas */}
            <button
              onClick={() => setIsThreeDotMenuOpen(!isThreeDotMenuOpen)}
              className="p-2.5 rounded-xl glass-card text-amber-400 hover:text-white hover:bg-white/10 transition-colors border border-amber-500/30"
              title="Menu Akses Admin & Kode"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu Titik 3 */}
            {isThreeDotMenuOpen && (
              <div className="absolute top-12 left-0 w-60 glass-panel border border-amber-500/40 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Menu Sistem WZ
                  </p>
                </div>

                <button
                  onClick={handleAdminClick}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-amber-300 hover:bg-amber-500/10 flex items-center gap-2.5 transition-colors"
                >
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>{isAdmin ? 'Akses Panel Admin (Aktif)' : 'Panel Admin (Password)'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsThreeDotMenuOpen(false);
                    setIsCodeModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-emerald-300 hover:bg-emerald-500/10 flex items-center gap-2.5 transition-colors"
                >
                  <Key className="w-4 h-4 text-emerald-400" />
                  <span>Cek Status Kode Akses</span>
                </button>

                <button
                  onClick={openAdminWa}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-purple-300 hover:bg-purple-500/10 flex items-center gap-2.5 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span>WhatsApp Admin</span>
                </button>
              </div>
            )}

            {/* Brand Logo */}
            <div 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-2.5 cursor-pointer group select-none ml-1"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-purple-600 to-blue-600 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-black tracking-wider gold-gradient-text uppercase font-mono leading-none">
                  {settings.siteName}
                </h1>
                <span className="text-[9px] text-purple-400 tracking-widest font-semibold uppercase">
                  PREMIUM STORE & NOVEL
                </span>
              </div>
            </div>
          </div>

          {/* Global Search Bar (Desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari novel VIP, anime, atau produk..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-full glass-input focus:ring-1 focus:ring-amber-500 transition-all"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cek Akses Button Direct */}
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="btn-gold flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cek Kode Akses</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2 rounded-xl glass-card text-slate-300 hover:text-amber-400 transition-colors"
              title="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
              )}
            </button>

            {/* Admin Badge if Active */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'glass-card text-amber-400 border-amber-500/30'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Active</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Code Status Checker Modal */}
      <CodeCheckModal isOpen={isCodeModalOpen} onClose={() => setIsCodeModalOpen(false)} />

      {/* Admin Password Gate Modal */}
      <AdminPasswordModal isOpen={isAdminPassModalOpen} onClose={() => setIsAdminPassModalOpen(false)} />
    </>
  );
};
