import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { ShoppingBag, Search, Star, ShieldCheck, CheckCircle2, ArrowRight, X, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const StoreView: React.FC = () => {
  const { products, submitStoreOrder, userCoins, buyItemWithCoins } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Checkout Form State
  const [checkoutModalProd, setCheckoutModalProd] = useState<Product | null>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerMethod, setBuyerMethod] = useState('QRIS Instant');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderCodeSuccess, setOrderCodeSuccess] = useState<string | null>(null);
  const [coinPayError, setCoinPayError] = useState<string | null>(null);

  const categories = ['All', 'VIP Access', 'Voucher Game', 'Merchandise'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (categoryFilter !== 'All') return matchesSearch && p.category === categoryFilter;
    return matchesSearch;
  });

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutModalProd) return;
    if (!buyerName.trim()) return;
    setIsSubmittingOrder(true);

    try {
      const generatedCode = await submitStoreOrder({
        product: checkoutModalProd,
        name: buyerName.trim(),
        paymentMethod: buyerMethod
      });
      setOrderCodeSuccess(generatedCode);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> OFFICIAL MARKETPLACE
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold inline-flex items-center gap-1">
              🪙 Saldo Coin: {userCoins.toLocaleString('id-ID')} WZ
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white gold-gradient-text uppercase font-mono">
            WZ PROJECT Store
          </h2>
          <p className="text-xs text-slate-300 max-w-md">
            Layanan pengisian voucher game, lisensi VIP digital, dan merchandise resmi WZ PROJECT dengan jaminan proses instan 24 jam.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 z-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                categoryFilter === c
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'glass-card text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => (
          <motion.div
            key={prod.id}
            whileHover={{ y: -4 }}
            className="glass-card rounded-3xl p-5 border border-white/5 hover:border-amber-500/30 flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                <img
                  src={prod.imageUrl}
                  alt={prod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-amber-400 font-bold text-[10px] uppercase">
                  {prod.category}
                </span>
                {prod.isDigital && (
                  <span className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-blue-600/80 text-white font-bold text-[10px]">
                    DIGITAL
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                {prod.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {prod.description}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Harga Resmi</span>
                <span className="text-base font-black text-amber-400">
                  Rp {prod.price.toLocaleString('id-ID')}
                </span>
              </div>

              <button
                onClick={() => setCheckoutModalProd(prod)}
                className="btn-gold px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Beli</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CHECKOUT MODAL */}
      <AnimatePresence>
        {checkoutModalProd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md glass-panel border border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => {
                  setCheckoutModalProd(null);
                  setOrderCodeSuccess(null);
                }}
                className="absolute top-4 right-4 p-2 rounded-xl glass-card text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {orderCodeSuccess ? (
                <div className="text-center space-y-4 py-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-lg font-black text-white gold-gradient-text uppercase">
                    Pesanan Store Dikirim!
                  </h3>

                  <p className="text-xs text-slate-300">
                    Simpan Kode Pesanan Anda untuk mengecek status konfirmasi (ACC) Admin:
                  </p>

                  <div className="p-4 rounded-2xl bg-black/60 border border-blue-500/50">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">Kode Transaksi Store</span>
                    <span className="text-xl font-mono font-black text-blue-400 tracking-wider">
                      {orderCodeSuccess}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-left text-xs text-blue-200">
                    <p className="font-bold flex items-center gap-1.5 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Status: MENUNGGU ACC ADMIN
                    </p>
                    <p className="text-[11px] text-blue-300/80">
                      Pesan konfirmasi otomatis telah dibuka ke WhatsApp Admin. Produk akan langsung diproses begitu di-ACC.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setCheckoutModalProd(null);
                      setOrderCodeSuccess(null);
                    }}
                    className="btn-gold w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Selesai & Cek Akses
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center mx-auto mb-2 text-blue-400">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-white gold-gradient-text uppercase">
                      Checkout Pesanan Store
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Produk: <span className="text-amber-300 font-bold">{checkoutModalProd.title}</span>
                    </p>
                  </div>

                    {coinPayError && (
                      <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-[11px] font-semibold text-center">
                        {coinPayError}
                      </div>
                    )}

                    <form onSubmit={handleCheckoutSubmit} className="space-y-3.5">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">Nama Pemesan / Pembeli</label>
                        <input
                          type="text"
                          required
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          placeholder="Masukkan nama Anda..."
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input"
                        />
                      </div>

                      <div className="flex justify-between items-center p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                        <span className="text-xs text-slate-300">Total Pembayaran:</span>
                        <div className="text-right">
                          <span className="text-sm font-black text-amber-400 block">
                            Rp {checkoutModalProd.price.toLocaleString('id-ID')}
                          </span>
                          <span className="text-[10px] text-amber-300 font-mono">
                            atau {checkoutModalProd.price.toLocaleString('id-ID')} Coins
                          </span>
                        </div>
                      </div>

                      <div className="pt-1 space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCoinPayError(null);
                            const res = buyItemWithCoins(checkoutModalProd.price, checkoutModalProd.title);
                            if (res.success) {
                              setOrderCodeSuccess(res.code || 'ACC-COIN-INSTANT');
                            } else {
                              setCoinPayError(res.message);
                            }
                          }}
                          className="btn-purple w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                        >
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>Bayar Instan Saldo WZ Coin (Saldo: {userCoins.toLocaleString('id-ID')})</span>
                        </button>

                        <div className="relative my-2 text-center">
                          <span className="bg-slate-950 px-2 text-[10px] text-slate-500 font-mono">atau via WhatsApp Admin</span>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-300 block mb-1">Metode Pembayaran Manual</label>
                          <select
                            value={buyerMethod}
                            onChange={(e) => setBuyerMethod(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input bg-slate-900"
                          >
                            <option value="QRIS Instant All Payment">QRIS Instant All Payment</option>
                            <option value="DANA E-Wallet">DANA E-Wallet</option>
                            <option value="GoPay">GoPay</option>
                            <option value="OVO / ShopeePay">OVO / ShopeePay</option>
                            <option value="Transfer Bank BCA / Mandiri">Transfer Bank BCA / Mandiri</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingOrder}
                          className="btn-gold w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          <span>{isSubmittingOrder ? 'Memproses Pesanan...' : 'Kirim WhatsApp Konfirmasi'}</span>
                        </button>
                      </div>
                    </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
