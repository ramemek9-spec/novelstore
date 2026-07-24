import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Novel, Anime, Product, Banner, VipPurchase, Order, SiteSettings } from '../types';
import { db, seedDefaultDataToFirestore } from '../lib/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import {
  Shield, Users, BookOpen, Film, ShoppingBag, Image, Settings, CheckCircle2, XCircle,
  Plus, Edit, Trash2, Crown, Sparkles, RefreshCw, Send, Lock, Unlock, Eye, Check
} from 'lucide-react';
import { motion } from 'motion/react';

export const AdminView: React.FC = () => {
  const { isAdmin, userProfile, login } = useAuth();
  const {
    novels, animes, products, banners, vipPurchases, orders, settings, customCodes,
    saveSettingsToFirebase, updateVipStatus, updateOrderStatus, saveProduct, deleteProduct,
    createCustomCode, topupCoinsManually
  } = useApp();

  const [adminTab, setAdminTab] = useState<
    'stats' | 'novels' | 'store' | 'codes' | 'vips' | 'orders' | 'settings'
  >('stats');

  const [statusMsg, setStatusMsg] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);

  // Admin login state on page
  const [inputUsername, setInputUsername] = useState('');
  const [inputPass, setInputPass] = useState('');
  const [loginErr, setLoginErr] = useState('');

  // Novel Form State
  const [newNovelTitle, setNewNovelTitle] = useState('');
  const [newNovelAuthor, setNewNovelAuthor] = useState('');
  const [newNovelCover, setNewNovelCover] = useState('');
  const [newNovelSynopsis, setNewNovelSynopsis] = useState('');
  const [newNovelIsVip, setNewNovelIsVip] = useState(true);
  const [newNovelPrice, setNewNovelPrice] = useState(25000);

  // Product Form State
  const [prodTitle, setProdTitle] = useState('');
  const [prodPrice, setProdPrice] = useState(15000);
  const [prodCategory, setProdCategory] = useState<'akun_game' | 'script_bot' | 'ecourse' | 'ebook' | 'jasa_digital'>('akun_game');
  const [prodCover, setProdCover] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodDownloadUrl, setProdDownloadUrl] = useState('');
  const [prodIsDigital, setProdIsDigital] = useState(true);

  // Custom Code & Coin Deposit Generator State
  const [codeType, setCodeType] = useState<'COIN_DEPOSIT' | 'VIP_NOVEL' | 'STORE_ITEM'>('COIN_DEPOSIT');
  const [customCodeInput, setCustomCodeInput] = useState('');
  const [coinDepositValue, setCoinDepositValue] = useState(25000);
  const [selectedTargetId, setSelectedTargetId] = useState('');

  // Manual Coin Deposit
  const [topupAmount, setTopupAmount] = useState(10000);

  // Settings State
  const [siteName, setSiteName] = useState(settings.siteName);
  const [adminWhatsapp, setAdminWhatsapp] = useState(settings.adminWhatsapp);
  const [adminEmail, setAdminEmail] = useState(settings.adminEmail);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErr('');
    try {
      const success = await login(inputPass);
      if (!success) {
        setLoginErr('Password Admin salah! Silakan coba lagi.');
      }
    } catch (e: any) {
      setLoginErr('Gagal memverifikasi password admin.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="glass-panel p-8 sm:p-10 rounded-3xl text-center space-y-5 max-w-md mx-auto my-12 border border-amber-500/30 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
          <Shield className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white uppercase gold-gradient-text">Panel Admin WZ PROJECT</h3>
          <p className="text-xs text-slate-400 mt-1">
            Masukkan Password Khusus Admin untuk Mengakses Pengaturan & ACC Pesanan.
          </p>
        </div>

        {loginErr && (
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold">
            {loginErr}
          </div>
        )}

        <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-xs text-slate-300 font-semibold mb-1 block">Password Administrator</label>
            <input
              type="password"
              required
              value={inputPass}
              onChange={(e) => setInputPass(e.target.value)}
              placeholder="Masukkan password admin..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input"
            />
          </div>
          <button type="submit" className="w-full btn-gold py-3 rounded-xl text-xs font-bold uppercase tracking-wider">
            Masuk Panel Admin
          </button>
        </form>
      </div>
    );
  }

  const handleSeedData = async () => {
    setIsSeeding(true);
    const res = await seedDefaultDataToFirestore();
    setStatusMsg(res.message);
    setIsSeeding(false);
  };

  const handleAddNovel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNovelTitle.trim()) return;

    const novelData: Partial<Novel> = {
      title: newNovelTitle,
      author: newNovelAuthor || 'Admin WZ',
      coverUrl: newNovelCover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      synopsis: newNovelSynopsis || 'Sinopsis novel VIP baru.',
      rating: 5.0,
      genres: ['Fantasy', 'VIP'],
      isVip: newNovelIsVip,
      price: newNovelPrice,
      status: 'published',
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'novels'), novelData);
      setStatusMsg('Novel baru berhasil ditambahkan!');
      setNewNovelTitle('');
      setNewNovelSynopsis('');
    } catch (e: any) {
      setStatusMsg('Gagal menambahkan novel: ' + e?.message);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim()) return;

    const newProd: Product = {
      id: 'prod-' + Date.now(),
      title: prodTitle.trim(),
      price: prodPrice,
      category: prodCategory,
      imageUrl: prodCover || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      description: prodDesc || 'Produk digital kualitas tinggi WZ Project.',
      isDigital: prodIsDigital,
      stock: 999,
      isPublished: true,
      createdAt: new Date().toISOString()
    };

    const ok = await saveProduct(newProd);
    if (ok) {
      setStatusMsg(`Produk "${prodTitle}" berhasil disimpan ke Firebase Store!`);
      setProdTitle('');
      setProdDesc('');
      setProdCover('');
      setProdDownloadUrl('');
    } else {
      setStatusMsg('Gagal menyimpan produk.');
    }
  };

  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCode = (customCodeInput.trim() || ('WZ-' + Math.floor(100000 + Math.random() * 900000))).toUpperCase();

    let targetTitle = '';
    if (codeType === 'VIP_NOVEL') {
      const matchN = novels.find(n => n.id === selectedTargetId);
      targetTitle = matchN ? matchN.title : 'VIP Novel';
    } else if (codeType === 'STORE_ITEM') {
      const matchP = products.find(p => p.id === selectedTargetId);
      targetTitle = matchP ? matchP.title : 'Store Item';
    }

    await createCustomCode({
      code: finalCode,
      type: codeType,
      coinValue: codeType === 'COIN_DEPOSIT' ? coinDepositValue : undefined,
      targetId: codeType !== 'COIN_DEPOSIT' ? selectedTargetId : undefined,
      targetTitle: codeType !== 'COIN_DEPOSIT' ? targetTitle : undefined,
      isUsed: false
    });

    setStatusMsg(`Kode "${finalCode}" berhasil dibuat & aktif!`);
    setCustomCodeInput('');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SiteSettings = {
      ...settings,
      siteName,
      adminWhatsapp,
      adminEmail,
      logoUrl
    };
    const ok = await saveSettingsToFirebase(updated);
    if (ok) setStatusMsg('Pengaturan website & WhatsApp Admin berhasil diperbarui!');
    else setStatusMsg('Gagal menyimpan pengaturan ke Firebase.');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Admin Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white gold-gradient-text uppercase font-mono">
              Admin Control Panel WZ
            </h2>
            <p className="text-xs text-slate-400">
              Kelola seluruh data produk, novel VIP, kode akses & deposit coin secara real-time.
            </p>
          </div>
        </div>

        <button
          onClick={handleSeedData}
          disabled={isSeeding}
          className="btn-purple px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
        >
          <RefreshCw className={`w-4 h-4 ${isSeeding ? 'animate-spin' : ''}`} />
          <span>{isSeeding ? 'Seeding...' : '1-Click Seed Data Initial'}</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold text-center">
          {statusMsg}
        </div>
      )}

      {/* Admin Sub Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
        <button
          onClick={() => setAdminTab('stats')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            adminTab === 'stats' ? 'bg-amber-500 text-slate-950' : 'glass-card text-slate-400 hover:text-white'
          }`}
        >
          📊 Ringkasan
        </button>
        <button
          onClick={() => setAdminTab('vips')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            adminTab === 'vips' ? 'bg-amber-500 text-slate-950' : 'glass-card text-slate-400 hover:text-white'
          }`}
        >
          💳 ACC VIP Novel ({vipPurchases.filter(v => v.status === 'PENDING').length})
        </button>
        <button
          onClick={() => setAdminTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            adminTab === 'orders' ? 'bg-amber-500 text-slate-950' : 'glass-card text-slate-400 hover:text-white'
          }`}
        >
          🛒 Pesanan Store ({orders.filter(o => o.status === 'PENDING').length})
        </button>
        <button
          onClick={() => setAdminTab('store')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            adminTab === 'store' ? 'bg-amber-500 text-slate-950' : 'glass-card text-slate-400 hover:text-white'
          }`}
        >
          🛍️ Tambah/Kelola Produk
        </button>
        <button
          onClick={() => setAdminTab('novels')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            adminTab === 'novels' ? 'bg-amber-500 text-slate-950' : 'glass-card text-slate-400 hover:text-white'
          }`}
        >
          📚 Kelola Novel
        </button>
        <button
          onClick={() => setAdminTab('codes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            adminTab === 'codes' ? 'bg-amber-500 text-slate-950' : 'glass-card text-slate-400 hover:text-white'
          }`}
        >
          🔑 Generator Kode & Coin
        </button>
        <button
          onClick={() => setAdminTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            adminTab === 'settings' ? 'bg-amber-500 text-slate-950' : 'glass-card text-slate-400 hover:text-white'
          }`}
        >
          ⚙️ Setting Website & WA
        </button>
      </div>

      {/* TAB CONTENTS */}
      {/* 1. STATS OVERVIEW */}
      {adminTab === 'stats' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl glass-card border border-amber-500/30">
            <span className="text-[10px] text-amber-400 font-bold uppercase">Total Novel</span>
            <h3 className="text-2xl font-black text-white mt-1">{novels.length}</h3>
          </div>
          <div className="p-4 rounded-2xl glass-card border border-purple-500/30">
            <span className="text-[10px] text-purple-400 font-bold uppercase">Total Anime</span>
            <h3 className="text-2xl font-black text-white mt-1">{animes.length}</h3>
          </div>
          <div className="p-4 rounded-2xl glass-card border border-blue-500/30">
            <span className="text-[10px] text-blue-400 font-bold uppercase">Produk Store</span>
            <h3 className="text-2xl font-black text-white mt-1">{products.length}</h3>
          </div>
          <div className="p-4 rounded-2xl glass-card border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 font-bold uppercase">Pending VIP</span>
            <h3 className="text-2xl font-black text-white mt-1">
              {vipPurchases.filter(v => v.status === 'PENDING').length}
            </h3>
          </div>
        </div>
      )}

      {/* 2. ACC VIP PURCHASES */}
      {adminTab === 'vips' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center justify-between">
            <span>Daftar Pembelian VIP Novel</span>
            <span className="text-xs text-amber-400 font-normal">Klik ACC APPROVED untuk membuka akses user</span>
          </h3>
          <div className="space-y-3">
            {vipPurchases.length === 0 ? (
              <div className="p-8 rounded-2xl glass-card text-center text-xs text-slate-400">
                Belum ada pengajuan VIP.
              </div>
            ) : (
              vipPurchases.map((v) => (
                <div key={v.id} className="p-4 rounded-2xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/10 relative overflow-hidden">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-amber-400">{v.novelTitle}</span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-black/60 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold">
                        KODE: {v.code || 'WZ-VIP-00000'}
                      </span>
                      <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400 font-mono">
                        {v.paymentMethod}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1.5">
                      Pemesan: <span className="font-bold text-white">{v.userName}</span>
                    </p>
                    <span className="text-xs font-bold text-amber-300 mt-1 block">
                      Harga: Rp {v.price.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {v.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => updateVipStatus(v.id, 'APPROVED')}
                          className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
                        >
                          <Check className="w-4 h-4" /> ACC APPROVED
                        </button>
                        <button
                          onClick={() => updateVipStatus(v.id, 'REJECTED')}
                          className="px-3 py-2 rounded-xl bg-red-500/20 text-red-400 font-bold text-xs hover:bg-red-500/30"
                        >
                          Tolak
                        </button>
                      </>
                    ) : (
                      <span className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
                        v.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}>
                        {v.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. STORE ORDERS */}
      {adminTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center justify-between">
            <span>Daftar Pesanan Store</span>
            <span className="text-xs text-blue-400 font-normal">Konfirmasi ACC pesanan item store</span>
          </h3>
          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="p-8 rounded-2xl glass-card text-center text-xs text-slate-400">
                Belum ada pesanan store.
              </div>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="p-4 rounded-2xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/10">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-black text-blue-400">{o.productTitle}</h4>
                      <span className="px-2.5 py-0.5 rounded-lg bg-black/60 border border-blue-500/50 text-blue-300 font-mono text-xs font-bold">
                        KODE: {o.code || 'WZ-ORD-00000'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1.5">
                      Pemesan: <span className="font-bold text-white">{o.userName}</span>
                    </p>
                    <span className="text-xs font-bold text-amber-300 mt-1 block">
                      Harga: Rp {o.price.toLocaleString('id-ID')} • Metode: {o.paymentMethod}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {o.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => updateOrderStatus(o.id, 'APPROVED')}
                          className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
                        >
                          <Check className="w-4 h-4" /> ACC APPROVED
                        </button>
                        <button
                          onClick={() => updateOrderStatus(o.id, 'REJECTED')}
                          className="px-3 py-2 rounded-xl bg-red-500/20 text-red-400 font-bold text-xs"
                        >
                          Tolak
                        </button>
                      </>
                    ) : (
                      <span className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
                        o.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}>
                        {o.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. STORE PRODUCT MANAGEMENT */}
      {adminTab === 'store' && (
        <div className="space-y-6">
          <form onSubmit={handleAddProduct} className="p-6 rounded-3xl glass-panel space-y-4 border border-blue-500/30">
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-400" /> Tambah Produk Store Baru
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Nama / Judul Produk</label>
                <input
                  type="text"
                  required
                  value={prodTitle}
                  onChange={(e) => setProdTitle(e.target.value)}
                  placeholder="Contoh: Akun MLBB Mythic, Script Bot WA..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  required
                  value={prodPrice}
                  onChange={(e) => setProdPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Kategori Produk</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input bg-slate-900"
                >
                  <option value="akun_game">Akun Game / Top Up</option>
                  <option value="script_bot">Script & Source Code Bot</option>
                  <option value="ecourse">E-Course / Modul Belajar</option>
                  <option value="ebook">E-Book Premium</option>
                  <option value="jasa_digital">Jasa Digital / Premium Pass</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">URL Cover Gambar Produk</label>
                <input
                  type="text"
                  value={prodCover}
                  onChange={(e) => setProdCover(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Link Download / Tautan Akses Digital</label>
              <input
                type="text"
                value={prodDownloadUrl}
                onChange={(e) => setProdDownloadUrl(e.target.value)}
                placeholder="https://drive.google.com/... atau https://t.me/..."
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Deskripsi Produk</label>
              <textarea
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
                rows={3}
                placeholder="Deskripsi detail fasilitas & keunggulan produk..."
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
              />
            </div>

            <button type="submit" className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase">
              Simpan Produk Ke Store
            </button>
          </form>

          {/* List Existing Products with Delete */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase font-mono">Daftar Produk Store ({products.length})</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((p) => (
                <div key={p.id} className="p-3.5 rounded-2xl glass-card flex items-center justify-between gap-3 border border-white/10">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.imageUrl} alt={p.title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-white truncate">{p.title}</h5>
                      <span className="text-[11px] text-amber-400 font-semibold block mt-0.5">
                        Rp {p.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/40 transition shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. CODE GENERATOR & DEPOSIT COIN */}
      {adminTab === 'codes' && (
        <div className="space-y-6">
          {/* Manual Coin Deposit Direct */}
          <div className="p-6 rounded-3xl glass-panel border border-amber-500/30 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Topup Coin Manual Admin
            </h3>
            <p className="text-xs text-slate-400">
              Tambah saldo WZ Coins langsung secara instan untuk akun pengguna aktif.
            </p>
            <div className="flex items-center gap-3 max-w-md">
              <input
                type="number"
                value={topupAmount}
                onChange={(e) => setTopupAmount(Number(e.target.value))}
                className="px-3.5 py-2 text-xs rounded-xl glass-input flex-1"
                placeholder="Jumlah Coin..."
              />
              <button
                onClick={() => {
                  topupCoinsManually(topupAmount, 'Admin Topup');
                  setStatusMsg(`Berhasil menambah ${topupAmount.toLocaleString('id-ID')} WZ Coins ke akun!`);
                }}
                className="btn-gold px-4 py-2 rounded-xl text-xs font-bold shrink-0"
              >
                + Tambah Coin
              </button>
            </div>
          </div>

          {/* Create Code Form */}
          <form onSubmit={handleCreateCode} className="p-6 rounded-3xl glass-panel space-y-4 border border-purple-500/30">
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" /> Buat Kode Akses & Kode Deposit Coin Custom
            </h3>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Tipe Kode / Promo</label>
              <select
                value={codeType}
                onChange={(e) => setCodeType(e.target.value as any)}
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input bg-slate-900"
              >
                <option value="COIN_DEPOSIT">Deposit WZ Coin (Saldo Otomatis)</option>
                <option value="VIP_NOVEL">Buka Akses VIP Novel Spesifik</option>
                <option value="STORE_ITEM">Buka Akses Produk Store Spesifik</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Kustom Kode (Kosongkan Untuk Acak)</label>
                <input
                  type="text"
                  value={customCodeInput}
                  onChange={(e) => setCustomCodeInput(e.target.value)}
                  placeholder="Contoh: BONUS2026, SULTAN100K..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input uppercase font-mono"
                />
              </div>

              {codeType === 'COIN_DEPOSIT' ? (
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Nilai Deposit Coin</label>
                  <input
                    type="number"
                    value={coinDepositValue}
                    onChange={(e) => setCoinDepositValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  />
                </div>
              ) : codeType === 'VIP_NOVEL' ? (
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Pilih Novel Target</label>
                  <select
                    value={selectedTargetId}
                    onChange={(e) => setSelectedTargetId(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input bg-slate-900"
                  >
                    <option value="">-- Pilih Novel --</option>
                    {novels.map(n => (
                      <option key={n.id} value={n.id}>{n.title}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Pilih Produk Target</label>
                  <select
                    value={selectedTargetId}
                    onChange={(e) => setSelectedTargetId(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input bg-slate-900"
                  >
                    <option value="">-- Pilih Produk --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button type="submit" className="btn-purple px-6 py-2.5 rounded-xl text-xs font-bold uppercase shadow-lg">
              Generate & Aktifkan Kode
            </button>
          </form>

          {/* List Custom Codes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase font-mono">Daftar Kode Custom ({customCodes.length})</h4>
            <div className="space-y-2">
              {customCodes.map(c => (
                <div key={c.id} className="p-3 rounded-2xl glass-card flex items-center justify-between text-xs border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-amber-400 bg-black/60 px-2.5 py-1 rounded-xl border border-amber-500/30">
                      {c.code}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Tipe: {c.type} {c.coinValue ? `(${c.coinValue.toLocaleString('id-ID')} Coins)` : c.targetTitle ? `(${c.targetTitle})` : ''}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.isUsed ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {c.isUsed ? 'Sudah Terpakai' : 'Aktif'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. NOVEL MANAGEMENT FORM */}
      {adminTab === 'novels' && (
        <div className="space-y-6">
          <form onSubmit={handleAddNovel} className="p-6 rounded-3xl glass-panel space-y-4 border border-white/10">
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" /> Tambah Novel Baru
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Judul Novel</label>
                <input
                  type="text"
                  required
                  value={newNovelTitle}
                  onChange={(e) => setNewNovelTitle(e.target.value)}
                  placeholder="Judul Novel..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Penulis / Author</label>
                <input
                  type="text"
                  value={newNovelAuthor}
                  onChange={(e) => setNewNovelAuthor(e.target.value)}
                  placeholder="Penulis..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">URL Cover Image</label>
              <input
                type="text"
                value={newNovelCover}
                onChange={(e) => setNewNovelCover(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Sinopsis Ringkas</label>
              <textarea
                value={newNovelSynopsis}
                onChange={(e) => setNewNovelSynopsis(e.target.value)}
                rows={3}
                placeholder="Sinopsis novel..."
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Status Akses</label>
                <select
                  value={newNovelIsVip ? 'vip' : 'free'}
                  onChange={(e) => setNewNovelIsVip(e.target.value === 'vip')}
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input bg-slate-900"
                >
                  <option value="vip">VIP (Berbayar / Butuh ACC)</option>
                  <option value="free">GRATIS (Bebas Baca)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Harga VIP (Rp)</label>
                <input
                  type="number"
                  value={newNovelPrice}
                  onChange={(e) => setNewNovelPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                />
              </div>
            </div>

            <button type="submit" className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase">
              Simpan Novel
            </button>
          </form>
        </div>
      )}

      {/* 5. WEBSITE & WHATSAPP SETTINGS */}
      {adminTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl glass-panel space-y-4 border border-white/10">
          <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
            <Settings className="w-4 h-4 text-amber-400" /> Pengaturan Website & WhatsApp Admin
          </h3>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">Nama Website / Brand</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">Nomor WhatsApp Admin (Untuk Format Pesanan VIP & Store)</label>
            <input
              type="text"
              value={adminWhatsapp}
              onChange={(e) => setAdminWhatsapp(e.target.value)}
              placeholder="6281234567890"
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-input font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Contoh format internasional: 6281234567890 (Tanpa tanda + atau spasi).
            </span>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">Email Resmi Admin</label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
            />
          </div>

          <button type="submit" className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase">
            Simpan Pengaturan
          </button>
        </form>
      )}
    </div>
  );
};
