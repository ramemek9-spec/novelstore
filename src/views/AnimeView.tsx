import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Anime, Episode } from '../types';
import { defaultEpisodes } from '../data/initialData';
import { Film, Play, Star, Search, ChevronRight, ChevronLeft, Bookmark, Calendar, CheckCircle, Maximize2, Settings, Volume2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AnimeView: React.FC = () => {
  const {
    animes,
    selectedAnime,
    setSelectedAnime,
    streamingAnime,
    setStreamingAnime,
    toggleBookmark,
    isBookmarked,
    addHistory
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'completed'>('all');
  
  const [selectedQuality, setSelectedQuality] = useState('1080p HD');
  const [activeEpisodeIndex, setActiveEpisodeIndex] = useState(0);

  const filteredAnimes = animes.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter === 'ongoing') return matchesSearch && a.status === 'ongoing';
    if (statusFilter === 'completed') return matchesSearch && a.status === 'completed';
    return matchesSearch;
  });

  const animeEpisodes = defaultEpisodes;

  return (
    <div className="space-y-6 pb-24">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10">
        <div>
          <h2 className="text-2xl font-black text-white gold-gradient-text uppercase tracking-wider font-mono">
            Streaming Anime WZ
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Nonton anime sub Indonesia tanpa iklan, kualitas HD, update episode tercepat.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Judul Anime..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl glass-input"
            />
          </div>

          <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/10 w-full sm:w-auto justify-center">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setStatusFilter('ongoing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'ongoing' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
              }`}
            >
              Ongoing
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'completed' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Anime Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAnimes.map((anime) => (
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
              
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 text-amber-400 text-[10px] font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400" />
                {anime.rating}
              </div>

              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-purple-600/80 backdrop-blur-md text-white text-[10px] font-bold capitalize">
                {anime.status}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="p-3 rounded-full bg-amber-500 text-slate-950 shadow-xl">
                  <Play className="w-6 h-6 fill-slate-950" />
                </div>
              </div>
            </div>

            <div className="p-3">
              <h4 className="text-xs font-bold text-white truncate">{anime.title}</h4>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{anime.releaseSchedule}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ANIME DETAIL MODAL */}
      <AnimatePresence>
        {selectedAnime && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl glass-panel border border-white/10 rounded-3xl p-6 relative my-8"
            >
              <button
                onClick={() => setSelectedAnime(null)}
                className="absolute top-4 right-4 p-2 rounded-xl glass-card text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={selectedAnime.thumbnailUrl}
                  alt={selectedAnime.title}
                  className="w-36 sm:w-48 h-52 sm:h-64 object-cover rounded-2xl shadow-2xl shrink-0 mx-auto sm:mx-0"
                />

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-bold text-[10px] uppercase">
                      {selectedAnime.status}
                    </span>
                    <span className="text-amber-400 text-xs font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {selectedAnime.rating}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white">{selectedAnime.title}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Jadwal: {selectedAnime.releaseSchedule}</span>
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {selectedAnime.genres.map((g) => (
                      <span key={g} className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-semibold">
                        {g}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5 max-h-32 overflow-y-auto">
                    {selectedAnime.synopsis}
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setStreamingAnime({ anime: selectedAnime });
                        addHistory({
                          targetId: selectedAnime.id,
                          type: 'anime',
                          title: selectedAnime.title,
                          coverUrl: selectedAnime.thumbnailUrl,
                          lastReadTitle: 'Episode 1'
                        });
                        setSelectedAnime(null);
                      }}
                      className="btn-gold flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>Tonton Episode 1</span>
                    </button>

                    <button
                      onClick={() => toggleBookmark({ targetId: selectedAnime.id, type: 'anime', title: selectedAnime.title, coverUrl: selectedAnime.thumbnailUrl })}
                      className={`p-3 rounded-xl border transition-all ${
                        isBookmarked(selectedAnime.id) ? 'bg-amber-500 text-slate-950 border-amber-400' : 'glass-card text-slate-300 border-white/10'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIDEO STREAMING PLAYER MODAL */}
      <AnimatePresence>
        {streamingAnime && (
          <div className="fixed inset-0 z-50 flex flex-col bg-black text-white overflow-y-auto">
            {/* Header Controls */}
            <header className="p-4 glass-panel border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStreamingAnime(null)}
                  className="p-2 rounded-xl glass-card text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="text-sm font-bold text-white max-w-xs truncate">
                    {streamingAnime.anime.title}
                  </h3>
                  <span className="text-[10px] text-amber-400 font-semibold">
                    Episode {activeEpisodeIndex + 1}: Demi Mengalahkan Muzan
                  </span>
                </div>
              </div>

              {/* Quality Dropdown */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedQuality}
                  onChange={(e) => setSelectedQuality(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs bg-slate-900 border border-white/10 text-amber-400 font-mono"
                >
                  <option value="1080p HD">1080p Full HD</option>
                  <option value="720p HD">720p HD</option>
                  <option value="480p SD">480p SD</option>
                </select>
              </div>
            </header>

            {/* Video Canvas Container */}
            <main className="flex-1 max-w-4xl mx-auto w-full p-4 flex flex-col justify-center">
              <div className="relative aspect-video rounded-3xl overflow-hidden glass-panel border border-amber-500/30 shadow-2xl bg-slate-950">
                <video
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Controls & Episode Switcher */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    disabled={activeEpisodeIndex === 0}
                    onClick={() => setActiveEpisodeIndex(prev => Math.max(0, prev - 1))}
                    className="px-4 py-2 rounded-xl glass-card text-xs font-bold text-slate-300 disabled:opacity-50 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Episode Prev
                  </button>
                  <button
                    onClick={() => setActiveEpisodeIndex(prev => prev + 1)}
                    className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    Episode Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-slate-400">
                  Streaming Kualitas: <span className="text-amber-400 font-bold">{selectedQuality}</span>
                </div>
              </div>

              {/* Episode List Selection */}
              <div className="mt-8 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Daftar Episode ({animeEpisodes.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {animeEpisodes.map((ep, idx) => (
                    <button
                      key={ep.id}
                      onClick={() => setActiveEpisodeIndex(idx)}
                      className={`p-3 rounded-xl border text-left transition-all text-xs font-bold ${
                        idx === activeEpisodeIndex
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'glass-card border-white/5 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      Episode {ep.episodeNumber}
                    </button>
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
