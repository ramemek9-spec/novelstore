import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Novel, Anime, Product } from '../types';
import { Play, BookOpen, Star, Crown, ChevronRight, Sparkles, Flame, Clock, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const DashboardView: React.FC = () => {
  const {
    banners,
    novels,
    animes,
    products,
    history,
    setActiveTab,
    setSelectedNovel,
    setSelectedAnime,
    setSelectedProduct,
    setReadingNovel,
    setStreamingAnime,
    searchQuery,
    selectedCategory,
    setSelectedCategory
  } = useApp();

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Auto slide banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [banners.length]);

  const activeBanners = banners.filter(b => b.isActive);
  const activeBanner = activeBanners[currentBannerIndex] || activeBanners[0];

  // Filters for search
  const filteredNovels: Novel[] = novels.filter(n => !searchQuery.trim() || n.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredAnimes: Anime[] = animes.filter(a => !searchQuery.trim() || a.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredProducts: Product[] = products.filter(p => !searchQuery.trim() || p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const popularNovels = [...filteredNovels].sort((a, b) => b.rating - a.rating);
  const popularAnimes = [...filteredAnimes].sort((a, b) => b.rating - a.rating);

  const categories = ['All', 'Action', 'Fantasy', 'VIP Novel', 'Ongoing Anime', 'Digital Products'];

  return (
    <div className="space-y-8 pb-24">
      {/* 1. Banner Slider */}
      {activeBanner && (
        <div className="relative w-full h-52 sm:h-72 lg:h-80 rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl group">
          <img
            src={activeBanner.imageUrl}
            alt={activeBanner.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-[#07080c]/60 to-transparent flex flex-col justify-end p-6 sm:p-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold tracking-widest uppercase w-max mb-2">
              <Sparkles className="w-3 h-3" /> PROMO UTAMA
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-wide max-w-xl">
              {activeBanner.title}
            </h2>
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => setActiveTab('novel')}
                className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <span>Jelajahi VIP</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slider Dots */}
          <div className="absolute bottom-4 right-6 flex items-center gap-1.5">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBannerIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentBannerIndex ? 'w-6 bg-amber-400' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. Category Quick Switch Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-white shadow-lg shadow-amber-500/20'
                : 'glass-card text-slate-300 hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Continue Reading / Lanjutkan Membaca Section */}
      {history.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Lanjutkan Membaca / Tonton</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {history.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.type === 'novel') {
                    const n = novels.find(x => x.id === item.targetId);
                    if (n) setSelectedNovel(n);
                  } else {
                    const a = animes.find(x => x.id === item.targetId);
                    if (a) setSelectedAnime(a);
                  }
                }}
                className="p-3 rounded-2xl glass-card flex items-center gap-3 cursor-pointer hover:border-amber-500/40"
              >
                <img src={item.coverUrl} alt={item.title} className="w-12 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                    {item.type.toUpperCase()}
                  </span>
                  <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.lastReadTitle || 'Terakhir diakses'}</p>
                </div>
                <button className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Play className="w-4 h-4 fill-amber-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Anime Populer & Terbaru */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <span>Anime Populer</span>
          </h3>
          <button
            onClick={() => setActiveTab('anime')}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {popularAnimes.slice(0, 4).map((anime) => (
            <motion.div
              key={anime.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedAnime(anime)}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer group border border-white/5 relative"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={anime.thumbnailUrl}
                  alt={anime.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-amber-400 text-[10px] font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {anime.rating}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-3 rounded-full bg-amber-500 text-slate-950 shadow-xl">
                    <Play className="w-6 h-6 fill-slate-950" />
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-xs font-bold text-white truncate">{anime.title}</h4>
                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                  <span className="capitalize">{anime.status}</span>
                  <span className="text-purple-400 font-semibold">{anime.genres[0]}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 5. Novel VIP & Popular */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <span>Novel Rekomendasi VIP</span>
          </h3>
          <button
            onClick={() => setActiveTab('novel')}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {popularNovels.slice(0, 4).map((novel) => (
            <motion.div
              key={novel.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedNovel(novel)}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer group border border-white/5 relative"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={novel.coverUrl}
                  alt={novel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {novel.isVip ? (
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black tracking-wider uppercase flex items-center gap-1 shadow-lg">
                    <Crown className="w-3 h-3" /> VIP
                  </div>
                ) : (
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-emerald-500/80 backdrop-blur-md text-white text-[10px] font-bold">
                    GRATIS
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 text-amber-400 text-[10px] font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {novel.rating}
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-xs font-bold text-white truncate">{novel.title}</h4>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{novel.author}</p>
                <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-purple-400">{novel.genres[0]}</span>
                  <span className="text-[11px] font-bold text-amber-400">
                    {novel.isVip ? `Rp ${novel.price.toLocaleString('id-ID')}` : 'Free'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 6. Produk Terbaru Marketplace */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-400" />
            <span>Produk Store Terbaru</span>
          </h3>
          <button
            onClick={() => setActiveTab('store')}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            Ke Store <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.slice(0, 3).map((prod) => (
            <div
              key={prod.id}
              onClick={() => setSelectedProduct(prod)}
              className="glass-card rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-amber-500/40"
            >
              <img src={prod.imageUrl} alt={prod.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold inline-block mb-1">
                  {prod.category}
                </span>
                <h4 className="text-xs font-bold text-white truncate">{prod.title}</h4>
                <p className="text-xs font-black text-amber-400 mt-1">
                  Rp {prod.price.toLocaleString('id-ID')}
                </p>
                <button className="mt-2 btn-gold px-3 py-1 rounded-lg text-[10px] font-bold">
                  Beli
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
