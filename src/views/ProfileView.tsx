import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { User, Mail, Shield, Crown, Clock, Bookmark, ShoppingBag, LogOut, Edit3, Key, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProfileView: React.FC = () => {
  const { userProfile, logout, updateProfileName, resetPassword, isAdmin } = useAuth();
  const { vipPurchases, orders, history, bookmarks } = useApp();

  const [activeTab, setActiveTab] = useState<'vip' | 'orders' | 'history' | 'bookmarks'>('vip');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userProfile?.displayName || '');
  const [editPhoto, setEditPhoto] = useState(userProfile?.photoURL || '');
  const [msg, setMsg] = useState('');

  const userVips = vipPurchases.filter(v => v.userId === userProfile?.uid);
  const userOrders = orders.filter(o => o.userId === userProfile?.uid);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileName(editName, editPhoto);
    setMsg('Profil berhasil diperbarui!');
    setIsEditing(false);
  };

  const handleResetPass = async () => {
    if (!userProfile?.email) return;
    await resetPassword(userProfile.email);
    setMsg('Email reset password telah dikirim ke ' + userProfile.email);
  };

  if (!userProfile) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto my-12">
        <User className="w-12 h-12 text-slate-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">Anda Belum Login</h3>
        <p className="text-xs text-slate-400">Silakan login untuk melihat profil, riwayat pembelian, dan status VIP novel Anda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Profile Header Glass Panel */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            {userProfile.photoURL ? (
              <img src={userProfile.photoURL} alt="Avatar" className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-500/50 shadow-2xl" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-purple-600 via-amber-500 to-blue-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl">
                {userProfile.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            {isAdmin && (
              <div className="absolute -top-2 -right-2 p-1.5 rounded-full bg-amber-500 text-slate-950 shadow-lg">
                <Crown className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-black text-white">{userProfile.displayName}</h2>
              {isAdmin && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase">
                  ADMINISTRATOR
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 font-mono flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              {userProfile.email}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-[10px] bg-slate-900/80 px-3 py-1 rounded-lg border border-white/10 font-mono text-slate-400">
                UID: {userProfile.uid}
              </span>
              <span className="text-[10px] bg-slate-900/80 px-3 py-1 rounded-lg border border-white/10 text-slate-400">
                Bergabung: {new Date(userProfile.createdAt).toLocaleDateString('id-ID')}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsEditing(true)}
              className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profil</span>
            </button>
            <button
              onClick={handleResetPass}
              className="glass-card px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 border border-white/10"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Ganti Password</span>
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-bold flex items-center justify-center gap-1.5 border border-red-500/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {msg && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs text-center">
            {msg}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 space-x-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('vip')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'vip' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>Akses VIP Novel ({userVips.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'orders' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Pesanan Store ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'history' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Riwayat ({history.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'bookmarks' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Bookmark ({bookmarks.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="space-y-3">
        {activeTab === 'vip' && (
          <div className="space-y-3">
            {userVips.length === 0 ? (
              <div className="glass-card p-8 rounded-2xl text-center text-xs text-slate-400">
                Belum ada transaksi VIP Novel.
              </div>
            ) : (
              userVips.map((v) => (
                <div key={v.id} className="p-4 rounded-2xl glass-card flex items-center justify-between gap-4 border border-white/5">
                  <div>
                    <h4 className="text-xs font-bold text-white">{v.novelTitle}</h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Metode: {v.paymentMethod} • Rp {v.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    v.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    v.status === 'REJECTED' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {v.status === 'APPROVED' ? 'VIP ACTIVE' : v.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-3">
            {userOrders.length === 0 ? (
              <div className="glass-card p-8 rounded-2xl text-center text-xs text-slate-400">
                Belum ada pesanan store.
              </div>
            ) : (
              userOrders.map((o) => (
                <div key={o.id} className="p-4 rounded-2xl glass-card flex items-center justify-between gap-4 border border-white/5">
                  <div>
                    <h4 className="text-xs font-bold text-white">{o.productTitle}</h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Harga: Rp {o.price.toLocaleString('id-ID')} • {o.paymentMethod}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    o.status === 'APPROVED' || o.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    o.status === 'REJECTED' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {o.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {history.map((h) => (
              <div key={h.id} className="p-3 rounded-2xl glass-card flex items-center gap-3">
                <img src={h.coverUrl} alt={h.title} className="w-12 h-16 rounded-xl object-cover" />
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase">{h.type}</span>
                  <h4 className="text-xs font-bold text-white">{h.title}</h4>
                  <p className="text-[10px] text-slate-400">{h.lastReadTitle || 'Terakhir dibaca'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bookmarks.map((b) => (
              <div key={b.id} className="p-3 rounded-2xl glass-card flex items-center gap-3">
                <img src={b.coverUrl} alt={b.title} className="w-12 h-16 rounded-xl object-cover" />
                <div>
                  <span className="text-[10px] text-purple-400 font-bold uppercase">{b.type}</span>
                  <h4 className="text-xs font-bold text-white">{b.title}</h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT PROFILE MODAL */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md glass-panel border border-white/10 rounded-3xl p-6 relative"
            >
              <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-white mb-4">Edit Profil Pengguna</h3>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Nama Tampilan</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">URL Foto Profil</label>
                  <input
                    type="text"
                    value={editPhoto}
                    onChange={(e) => setEditPhoto(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  />
                </div>
                <button type="submit" className="btn-gold w-full py-2.5 rounded-xl text-xs font-bold uppercase">
                  Simpan Perubahan
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
