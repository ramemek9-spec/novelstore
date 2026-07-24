import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Novel, Chapter } from '../types';
import { defaultChapters } from '../data/initialData';
import { BookOpen, Star, Crown, Search, Lock, ShieldAlert, X, ChevronRight, ChevronLeft, Bookmark, Heart, Share2, Play, Pause, Settings, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NovelView: React.FC = () => {
  const {
    novels,
    selectedNovel,
    setSelectedNovel,
    submitVipPurchase,
    isItemApproved,
    readingNovel,
    setReadingNovel,
    toggleBookmark,
    isBookmarked,
    addHistory,
    settings
  } = useApp();

  const { isAdmin, userProfile } = useAuth();

  const [searchFilter, setSearchFilter] = useState('');
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'vip' | 'free'>('all');
  
  // VIP Purchase Modal State
  const [purchaseModalNovel, setPurchaseModalNovel] = useState<Novel | null>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerMethod, setBuyerMethod] = useState('QRIS Instant');
  const [isSubmittingVip, setIsSubmittingVip] = useState(false);
  const [purchasedCodeSuccess, setPurchasedCodeSuccess] = useState<string | null>(null);

  // Manual Code Check input state inside novel detail
  const [inputCodeCheck, setInputCodeCheck] = useState('');
  const [codeCheckNotice, setCodeCheckNotice] = useState<string | null>(null);

  // Reader Customization State
  const [readerFontSize, setReaderFontSize] = useState(16);
  const [readerFontFamily, setReaderFontFamily] = useState<'sans' | 'serif' | 'mono'>('serif');
  const [readerLineHeight, setReaderLineHeight] = useState(1.8);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2);

  // Comments
  const [comments, setComments] = useState<Array<{ id: string; user: string; text: string; date: string }>>([
    { id: 'c1', user: 'Sultan Read', text: 'Plot alurnya luar biasa! Apalagi pas adegan Kebangkitan!', date: 'Kemarin' }
  ]);
  const [newComment, setNewComment] = useState('');

  // Check if current novel is unlocked
  const checkNovelAccess = (novel: Novel): boolean => {
    if (!novel.isVip) return true;
    if (isAdmin) return true;
    const res = isItemApproved(novel.id, inputCodeCheck);
    return res.approved;
  };

  const filteredNovels = novels.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(searchFilter.toLowerCase()) || n.author.toLowerCase().includes(searchFilter.toLowerCase());
    if (activeTabFilter === 'vip') return matchesSearch && n.isVip;
    if (activeTabFilter === 'free') return matchesSearch && !n.isVip;
    return matchesSearch;
  });

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseModalNovel) return;
    if (!buyerName.trim()) return;
    setIsSubmittingVip(true);

    try {
      const generatedCode = await submitVipPurchase({
        novel: purchaseModalNovel,
        name: buyerName.trim(),
        paymentMethod: buyerMethod
      });
      setPurchasedCodeSuccess(generatedCode);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingVip(false);
    }
  };

  // Reader 3D Page Flip State
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  // Auto scroll effect inside reader
  React.useEffect(() => {
    if (!isAutoScrolling) return;
    const interval = setInterval(() => {
      window.scrollBy({ top: scrollSpeed, behavior: 'smooth' });
    }, 50);
    return () => clearInterval(interval);
  }, [isAutoScrolling, scrollSpeed]);

  return (
    <div className="space-y-6 pb-24">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10">
        <div>
          <h2 className="text-2xl font-black text-white gold-gradient-text uppercase tracking-wider font-mono">
            Katalog Novel WZ
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ribuan bab novel terjemahan & orisinal dengan status VIP dan Gratis.
          </p>
        </div>

        {/* Search & Tabs */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Cari Judul atau Penulis..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl glass-input"
            />
          </div>

          <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/10 w-full sm:w-auto justify-center">
            <button
              onClick={() => setActiveTabFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTabFilter === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveTabFilter('vip')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTabFilter === 'vip' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
              }`}
            >
              VIP
            </button>
            <button
              onClick={() => setActiveTabFilter('free')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTabFilter === 'free' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
              }`}
            >
              Gratis
            </button>
          </div>
        </div>
      </div>

      {/* Novel Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredNovels.map((novel) => {
          const userHasAccess = checkNovelAccess(novel);
          return (
            <motion.div
              key={novel.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedNovel(novel)}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer group border border-white/5 relative flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={novel.coverUrl}
                  alt={novel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* VIP / Free Badge */}
                {novel.isVip ? (
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black tracking-wider uppercase flex items-center gap-1 shadow-lg">
                    <Crown className="w-3 h-3" /> VIP
                  </div>
                ) : (
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-emerald-500/80 backdrop-blur-md text-white text-[10px] font-bold">
                    GRATIS
                  </div>
                )}

                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 text-amber-400 text-[10px] font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {novel.rating}
                </div>
              </div>

              <div className="p-3">
                <h4 className="text-xs font-bold text-white truncate">{novel.title}</h4>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{novel.author}</p>
                
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-purple-400">{novel.genres[0]}</span>
                  {novel.isVip ? (
                    userHasAccess ? (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Terbuka
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-400">
                        Rp {novel.price.toLocaleString('id-ID')}
                      </span>
                    )
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-bold">Gratis Baca</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* NOVEL DETAIL MODAL */}
      <AnimatePresence>
        {selectedNovel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl glass-panel border border-white/10 rounded-3xl p-6 relative my-8"
            >
              <button
                onClick={() => {
                  setSelectedNovel(null);
                  setCodeCheckNotice(null);
                  setInputCodeCheck('');
                }}
                className="absolute top-4 right-4 p-2 rounded-xl glass-card text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={selectedNovel.coverUrl}
                  alt={selectedNovel.title}
                  className="w-36 sm:w-48 h-52 sm:h-64 object-cover rounded-2xl shadow-2xl shrink-0 mx-auto sm:mx-0"
                />

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    {selectedNovel.isVip ? (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px] uppercase flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5" /> VIP NOVEL
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-bold text-[10px] uppercase">
                        GRATIS
                      </span>
                    )}
                    <span className="text-amber-400 text-xs font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {selectedNovel.rating}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white">{selectedNovel.title}</h3>
                  <p className="text-xs text-slate-400">Penulis: <span className="text-slate-200">{selectedNovel.author}</span></p>

                  <div className="flex flex-wrap gap-1.5">
                    {selectedNovel.genres.map((g) => (
                      <span key={g} className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-semibold">
                        {g}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5 max-h-32 overflow-y-auto">
                    {selectedNovel.synopsis}
                  </p>

                  {/* VIP LOCK CHECK & ACC ENFORCEMENT */}
                  {selectedNovel.isVip && !checkNovelAccess(selectedNovel) ? (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3">
                      <p className="text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5">
                        <Lock className="w-4 h-4 text-amber-400" />
                        Akses VIP Terkunci (Perlu ACC Admin)
                      </p>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={inputCodeCheck}
                          onChange={(e) => setInputCodeCheck(e.target.value)}
                          placeholder="Masukkan Kode Transaksi atau Nama..."
                          className="flex-1 px-3 py-1.5 text-xs rounded-xl glass-input uppercase font-mono"
                        />
                        <button
                          onClick={() => {
                            const res = isItemApproved(selectedNovel.id, inputCodeCheck);
                            if (res.approved) {
                              setCodeCheckNotice('✅ Kode/Nama DI-ACC ADMIN! Akses Terbuka.');
                            } else if (res.status === 'PENDING') {
                              setCodeCheckNotice('⏳ Status: MENUNGGU ACC ADMIN. Hubungi WhatsApp Admin untuk percepatan.');
                            } else {
                              setCodeCheckNotice('❌ Kode/Nama Belum Terdaftar atau Ditolak Admin.');
                            }
                          }}
                          className="btn-purple px-3 py-1.5 rounded-xl text-xs font-bold shrink-0"
                        >
                          Cek ACC
                        </button>
                      </div>

                      {codeCheckNotice && (
                        <p className="text-[11px] font-semibold text-amber-200 bg-black/40 p-2 rounded-xl">
                          {codeCheckNotice}
                        </p>
                      )}

                      <button
                        onClick={() => {
                          setPurchaseModalNovel(selectedNovel);
                          setSelectedNovel(null);
                        }}
                        className="btn-gold w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg"
                      >
                        Beli VIP Sekarang (Rp {selectedNovel.price.toLocaleString('id-ID')})
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          setReadingNovel({ novel: selectedNovel });
                          addHistory({
                            targetId: selectedNovel.id,
                            type: 'novel',
                            title: selectedNovel.title,
                            coverUrl: selectedNovel.coverUrl,
                            lastReadTitle: 'Bab 1'
                          });
                          setSelectedNovel(null);
                        }}
                        className="btn-gold flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Mulai Baca Bab 1</span>
                      </button>

                      <button
                        onClick={() => toggleBookmark({ targetId: selectedNovel.id, type: 'novel', title: selectedNovel.title, coverUrl: selectedNovel.coverUrl })}
                        className={`p-3 rounded-xl border transition-all ${
                          isBookmarked(selectedNovel.id) ? 'bg-amber-500 text-slate-950 border-amber-400' : 'glass-card text-slate-300 border-white/10'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIP PURCHASE FORM / SUCCESS MODAL */}
      <AnimatePresence>
        {purchaseModalNovel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md glass-panel border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => {
                  setPurchaseModalNovel(null);
                  setPurchasedCodeSuccess(null);
                }}
                className="absolute top-4 right-4 p-2 rounded-xl glass-card text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {purchasedCodeSuccess ? (
                <div className="text-center space-y-4 py-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-lg font-black text-white gold-gradient-text uppercase">
                    Pesanan Berhasil Dikirim!
                  </h3>

                  <p className="text-xs text-slate-300">
                    Simpan Kode Akses Transaksi Anda untuk mengecek status persetujuan (ACC) Admin:
                  </p>

                  <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/50">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">Kode Akses Anda</span>
                    <span className="text-xl font-mono font-black text-amber-400 tracking-wider">
                      {purchasedCodeSuccess}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left text-xs text-amber-200">
                    <p className="font-bold flex items-center gap-1.5 mb-1">
                      <Lock className="w-3.5 h-3.5" /> Status: MENUNGGU ACC ADMIN
                    </p>
                    <p className="text-[11px] text-amber-300/80">
                      Silakan lanjutkan pengiriman pesan bukti pembayaran ke WhatsApp Admin. Akses novel akan otomatis terbuka setelah disetujui Admin.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setPurchaseModalNovel(null);
                      setPurchasedCodeSuccess(null);
                    }}
                    className="btn-gold w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Tutup & Cek Status Nanti
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-2 text-amber-400">
                      <Crown className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-white gold-gradient-text uppercase">
                      Pembelian Novel VIP
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Novel: <span className="text-amber-300 font-bold">{purchaseModalNovel.title}</span>
                    </p>
                  </div>

                  <form onSubmit={handlePurchaseSubmit} className="space-y-4">
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

                    <div className="flex justify-between items-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                      <span className="text-xs text-slate-300">Harga Total VIP:</span>
                      <span className="text-sm font-black text-amber-400">
                        Rp {purchaseModalNovel.price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Metode Pembayaran</label>
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
                      disabled={isSubmittingVip}
                      className="btn-gold w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20 mt-2 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmittingVip ? 'Memproses Kode...' : 'Kirim Ke WhatsApp Admin'}</span>
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL NOVEL 3D E-READER MODAL */}
      <AnimatePresence>
        {readingNovel && (
          <div className="fixed inset-0 z-50 flex flex-col bg-[#08090c] text-slate-100 overflow-y-auto">
            {/* Reader Header */}
            <header className="sticky top-0 z-40 glass-panel border-b border-white/10 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setReadingNovel(null)}
                  className="p-2 rounded-xl glass-card text-slate-300 hover:text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white max-w-xs truncate">
                    {readingNovel.novel.title}
                  </h3>
                  <span className="text-[10px] text-amber-400 font-semibold">
                    Bab 1: Kuil Ganda Mencekam • Halaman {currentPage} dari {totalPages}
                  </span>
                </div>
              </div>

              {/* Settings Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isAutoScrolling ? 'bg-amber-500 text-slate-950' : 'glass-card text-slate-300'
                  }`}
                >
                  {isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">Auto Scroll</span>
                </button>

                <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs">
                  <button onClick={() => setReaderFontSize(Math.max(12, readerFontSize - 2))} className="px-2 py-0.5 hover:text-amber-400">-</button>
                  <span className="font-mono text-[11px] px-1">{readerFontSize}px</span>
                  <button onClick={() => setReaderFontSize(Math.min(26, readerFontSize + 2))} className="px-2 py-0.5 hover:text-amber-400">+</button>
                </div>
              </div>
            </header>

            {/* 3D BOOK CONTAINER */}
            <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-8 w-full flex flex-col items-center justify-center">
              <div className="relative w-full perspective-1000 my-4">
                {/* Real 3D Book Outline with Spine Shadow */}
                <motion.div
                  key={currentPage}
                  initial={{ rotateY: -15, scale: 0.96, opacity: 0 }}
                  animate={{ rotateY: 0, scale: 1, opacity: 1 }}
                  exit={{ rotateY: 15, scale: 0.96, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full bg-[#1c1917] rounded-3xl p-6 sm:p-12 border-2 border-amber-500/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden"
                >
                  {/* Book Center Spine Line */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/40 to-transparent pointer-events-none z-20" />

                  {/* Golden Foil Corner Trim */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-500/40 rounded-tl-lg pointer-events-none" />
                  <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-500/40 rounded-tr-lg pointer-events-none" />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-500/40 rounded-bl-lg pointer-events-none" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-500/40 rounded-br-lg pointer-events-none" />

                  {/* Page Content based on currentPage */}
                  <div
                    style={{
                      fontSize: `${readerFontSize}px`,
                      lineHeight: readerLineHeight,
                      fontFamily: readerFontFamily === 'serif' ? 'Georgia, serif' : readerFontFamily === 'mono' ? 'Courier, monospace' : 'sans-serif'
                    }}
                    className="space-y-6 text-amber-50/95 select-text font-serif leading-relaxed relative z-10"
                  >
                    {currentPage === 1 && (
                      <>
                        <h1 className="text-2xl sm:text-3xl font-black text-amber-400 border-b border-amber-500/30 pb-4 font-mono">
                          Bab 1: Kuil Ganda Mencekam (Bagian I)
                        </h1>
                        <p>
                          Udara di dalam ruang bawah tanah terasa sangat dingin dan menyesakkan. Jin-Woo memegang pisau belatinya dengan tangan bergetar.
                        </p>
                        <p>
                          "Apakah ini akhir dari segalanya?" bisiknya dalam hati. Di hadapannya, patung-patung batu raksasa berdiri dalam kegelapan dengan mata menyala merah keemasan.
                        </p>
                        <p>
                          Tiba-tiba, suara dentungan keras terdengar dari pintu raksasa yang tertutup rapat. Sebuah jendela sistem tembus pandang berwarna biru bercahaya muncul di depan pandangannya:
                        </p>
                        <blockquote className="p-4 rounded-2xl bg-amber-500/10 border-l-4 border-amber-500 text-amber-200 my-4 shadow-inner">
                          [Selamat! Anda telah menyelesaikan syarat rahasia "Keberanian Sang Lemah". Log in Sistem Kebangkitan dimulai...]
                        </blockquote>
                        <p>
                          Cahaya emas membungkus tubuhnya, mengalirkan energi tak terbatas ke seluruh pembuluh darahnya. Rasa sakit yang melumpuhkan perlahan berganti menjadi kekuatan murni.
                        </p>
                      </>
                    )}

                    {currentPage === 2 && (
                      <>
                        <h1 className="text-2xl sm:text-3xl font-black text-amber-400 border-b border-amber-500/30 pb-4 font-mono">
                          Bab 1: Kebangkitan Sang Monarch (Bagian II)
                        </h1>
                        <p>
                          Mata para patung batu berkedip cepat. Komandan tertinggi patung raksasa menghunus pedang raksasa sejinggi sepuluh meter ke arah Jin-Woo.
                        </p>
                        <p>
                          Namun kali ini, gerakan pedang itu terlihat sangat lambat di mata Jin-Woo. Status kecepatannya melompat drastis! Dengan satu tumpuan kaki, dia melompat ke udara bagaikan kilat.
                        </p>
                        <blockquote className="p-4 rounded-2xl bg-purple-500/10 border-l-4 border-purple-500 text-purple-200 my-4">
                          [Skill Pasif: "Indera Keajaiban Kebangkitan Level 1" Telah Diaktifkan!]
                        </blockquote>
                        <p>
                          Belati di tangannya bersinar merah pekat. Satu tebasan lembut membelah batu keras patung kuno menjadi dua bagian dengan suara gemuruh yang menggetarkan seluruh kompleks kuil bawah tanah.
                        </p>
                      </>
                    )}

                    {currentPage === 3 && (
                      <>
                        <h1 className="text-2xl sm:text-3xl font-black text-amber-400 border-b border-amber-500/30 pb-4 font-mono">
                          Bab 1: Gerbang Dungeon Terbuka (Bagian III)
                        </h1>
                        <p>
                          Keheningan kembali menyelimuti ruangan kuno tersebut. Di tengah reruntuhan patung batu, sebuah tangga emas bercahaya muncul menuju permukaan luar dungeon.
                        </p>
                        <p>
                          "Aku belum pernah merasakan kekuatan sebesar ini sebelumnya..." Jin-Woo mengepalkan tangannya dan tersenyum tipis.
                        </p>
                        <p>
                          Pemberitahuan Sistem Baru muncul kembali:
                        </p>
                        <blockquote className="p-4 rounded-2xl bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-200 my-4">
                          [Tugas Harian Tersedia: Latihan Kekuatan Solo Leveling. Selamat Datang Pemain!]
                        </blockquote>
                        <p className="text-amber-300 font-bold italic text-center pt-4">
                          -- Akhir dari Bab 1 Pratinjau --
                        </p>
                      </>
                    )}
                  </div>

                  {/* Page Footer Number */}
                  <div className="mt-8 pt-4 border-t border-amber-500/20 flex justify-between items-center text-xs text-amber-400/80 font-mono">
                    <span>WZ PROJECT 3D READER</span>
                    <span>- Halaman {currentPage} -</span>
                    <span>VIP NOVEL</span>
                  </div>
                </motion.div>
              </div>

              {/* 3D Page Flip Buttons */}
              <div className="w-full flex items-center justify-between gap-4 mt-4">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
                    currentPage <= 1 ? 'glass-card text-slate-600 opacity-50 cursor-not-allowed' : 'btn-purple text-white shadow-lg'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Balik Halaman Sebelumnya</span>
                </button>

                <div className="flex items-center gap-1">
                  {[1, 2, 3].map(p => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition-all ${
                        currentPage === p ? 'bg-amber-500 text-slate-950 scale-110 shadow-lg' : 'glass-card text-slate-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
                    currentPage >= totalPages ? 'glass-card text-slate-600 opacity-50 cursor-not-allowed' : 'btn-gold text-slate-950 shadow-lg'
                  }`}
                >
                  <span>Balik Halaman Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Comment Section */}
              <div className="w-full mt-12 space-y-4 max-w-2xl">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span>Komentar Pembaca ({comments.length})</span>
                </h4>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tulis komentar kamu..."
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl glass-input"
                  />
                  <button
                    onClick={() => {
                      if (!newComment.trim()) return;
                      setComments(prev => [{ id: 'c' + Date.now(), user: userProfile?.displayName || 'User', text: newComment, date: 'Baru saja' }, ...prev]);
                      setNewComment('');
                    }}
                    className="btn-purple px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    Kirim
                  </button>
                </div>

                <div className="space-y-2 mt-3">
                  {comments.map((c) => (
                    <div key={c.id} className="p-3 rounded-xl glass-card text-xs border border-white/5">
                      <div className="flex justify-between text-slate-400 mb-1 text-[10px]">
                        <span className="font-bold text-amber-300">{c.user}</span>
                        <span>{c.date}</span>
                      </div>
                      <p className="text-slate-200">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
