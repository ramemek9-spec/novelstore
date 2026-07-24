import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Search, CheckCircle2, Clock, XCircle, Key, ExternalLink, MessageSquare, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CodeCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeCheckModal: React.FC<CodeCheckModalProps> = ({ isOpen, onClose }) => {
  const { vipPurchases, orders, unlockedCodes, saveUnlockedCode, settings, setSelectedNovel, setReadingNovel, setActiveTab } = useApp();
  const [inputCode, setInputCode] = useState('');
  const [searched, setSearched] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const cleanInput = inputCode.trim().toLowerCase();

  // Find matches across VIP Purchases and Store Orders
  const matchedVips = vipPurchases.filter(v => {
    if (!cleanInput) return v.code && unlockedCodes.includes(v.code);
    return (
      (v.code && v.code.toLowerCase().includes(cleanInput)) ||
      (v.userName && v.userName.toLowerCase().includes(cleanInput)) ||
      (v.novelTitle && v.novelTitle.toLowerCase().includes(cleanInput))
    );
  });

  const matchedOrders = orders.filter(o => {
    if (!cleanInput) return o.code && unlockedCodes.includes(o.code);
    return (
      (o.code && o.code.toLowerCase().includes(cleanInput)) ||
      (o.userName && o.userName.toLowerCase().includes(cleanInput)) ||
      (o.productTitle && o.productTitle.toLowerCase().includes(cleanInput))
    );
  });

  const handleAddCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    saveUnlockedCode(inputCode.trim().toUpperCase());
    setSearched(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const openAdminWa = (code: string, title: string, price: number) => {
    const waNumber = settings.adminWhatsapp.replace(/[^0-9]/g, '') || '6281234567890';
    const message = `Halo Admin ${settings.siteName},

Saya ingin konfirmasi ACC Kode Akses/Transaksi:
• KODE: ${code}
• Item: ${title}
• Total: Rp ${price.toLocaleString('id-ID')}

Mohon segera di-ACC agar akses saya terbuka. Terima kasih!`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-lg glass-panel border border-amber-500/30 rounded-3xl p-6 relative max-h-[90vh] flex flex-col shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl glass-card text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white gold-gradient-text uppercase font-mono">
                Cek Status Kode Akses
              </h3>
              <p className="text-xs text-slate-400">
                Masukkan Kode Transaksi atau Nama Anda untuk cek persetujuan Admin
              </p>
            </div>
          </div>

          {/* Search Input Form */}
          <form onSubmit={handleAddCode} className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Contoh: WZ-VIP-84920 atau Nama Anda..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input uppercase font-mono tracking-wider"
              />
            </div>
            <button
              type="submit"
              className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold shrink-0"
            >
              Cek Status
            </button>
          </form>

          {/* Content List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {matchedVips.length === 0 && matchedOrders.length === 0 ? (
              <div className="text-center py-10 glass-card rounded-2xl p-6 border border-white/5">
                <Key className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-slate-300 font-semibold">
                  {searched ? 'Kode Akses atau Nama tidak ditemukan.' : 'Belum ada kode transaksi tersimpan.'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                  Silakan lakukan pembelian di katalog Novel VIP atau Store terlebih dahulu untuk mendapatkan Kode Akses.
                </p>
              </div>
            ) : (
              <>
                {/* VIP Novel Purchases */}
                {matchedVips.map((v) => {
                  const isApproved = v.status === 'APPROVED';
                  const isPending = v.status === 'PENDING';
                  return (
                    <div
                      key={v.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isApproved
                          ? 'bg-emerald-500/10 border-emerald-500/40'
                          : isPending
                          ? 'bg-amber-500/10 border-amber-500/40'
                          : 'bg-rose-500/10 border-rose-500/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 text-amber-400 font-bold border border-white/10">
                              {v.code || v.id}
                            </span>
                            <button
                              onClick={() => copyToClipboard(v.code || v.id)}
                              className="text-slate-400 hover:text-white"
                              title="Salin Kode"
                            >
                              {copiedCode === (v.code || v.id) ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <h4 className="text-xs font-bold text-white mt-1">{v.novelTitle}</h4>
                          <p className="text-[10px] text-slate-400">Pemesan: {v.userName} • Rp {v.price.toLocaleString('id-ID')}</p>
                        </div>

                        {/* Status Badge */}
                        {isApproved && (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-[10px] uppercase flex items-center gap-1 shadow-md">
                            <CheckCircle2 className="w-3 h-3" /> DI-ACC ADMIN
                          </span>
                        )}
                        {isPending && (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px] uppercase flex items-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3" /> MENUNGGU ACC
                          </span>
                        )}
                        {v.status === 'REJECTED' && (
                          <span className="px-2.5 py-1 rounded-lg bg-rose-500 text-white font-black text-[10px] uppercase flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> DITOLAK
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-end gap-2">
                        {isPending && (
                          <button
                            onClick={() => openAdminWa(v.code || v.id, v.novelTitle, v.price)}
                            className="btn-purple px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Hubungi WA Admin</span>
                          </button>
                        )}
                        {isApproved && (
                          <button
                            onClick={() => {
                              onClose();
                              setActiveTab('novel');
                            }}
                            className="btn-gold px-3.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Buka Akses Novel</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Store Product Orders */}
                {matchedOrders.map((o) => {
                  const isApproved = o.status === 'APPROVED' || o.status === 'COMPLETED';
                  const isPending = o.status === 'PENDING';
                  return (
                    <div
                      key={o.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isApproved
                          ? 'bg-emerald-500/10 border-emerald-500/40'
                          : isPending
                          ? 'bg-amber-500/10 border-amber-500/40'
                          : 'bg-rose-500/10 border-rose-500/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 text-blue-400 font-bold border border-white/10">
                              {o.code || o.id}
                            </span>
                            <button
                              onClick={() => copyToClipboard(o.code || o.id)}
                              className="text-slate-400 hover:text-white"
                              title="Salin Kode"
                            >
                              {copiedCode === (o.code || o.id) ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <h4 className="text-xs font-bold text-white mt-1">{o.productTitle}</h4>
                          <p className="text-[10px] text-slate-400">Pemesan: {o.userName} • Rp {o.price.toLocaleString('id-ID')}</p>
                        </div>

                        {isApproved && (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-[10px] uppercase flex items-center gap-1 shadow-md">
                            <CheckCircle2 className="w-3 h-3" /> DI-ACC ADMIN
                          </span>
                        )}
                        {isPending && (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px] uppercase flex items-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3" /> MENUNGGU ACC
                          </span>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-end gap-2">
                        {isPending && (
                          <button
                            onClick={() => openAdminWa(o.code || o.id, o.productTitle, o.price)}
                            className="btn-purple px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Hubungi WA Admin</span>
                          </button>
                        )}
                        {isApproved && (
                          <button
                            onClick={() => {
                              onClose();
                              setActiveTab('store');
                            }}
                            className="btn-gold px-3.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Lihat Detail Store</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
