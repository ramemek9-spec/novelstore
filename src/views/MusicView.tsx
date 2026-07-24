import React, { useState, useEffect, useRef } from 'react';
import { Search, Play, Pause, Music, Volume2, VolumeX, Sparkles, Heart, Radio, Disc, ExternalLink, RefreshCw } from 'lucide-react';
import { MusicTrack } from '../types';

const POPULAR_THEMES = [
  { label: 'Solo Leveling OST', query: 'Solo Leveling OST' },
  { label: 'Demon Slayer', query: 'Demon Slayer OST' },
  { label: 'Anime Lofi BGM', query: 'Anime Lofi' },
  { label: 'Japanese Cyberpunk', query: 'Japanese Cyberpunk' },
  { label: 'Attack on Titan', query: 'Attack on Titan OST' },
  { label: 'K-Drama Romance', query: 'K Drama OST' },
  { label: 'J-Pop Top Hits', query: 'J-Pop Hits' },
];

export const MusicView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('Solo Leveling OST');
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Audio Player State
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchMusicTracks = async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=30`);
      if (!res.ok) throw new Error('Gagal mengambil data lagu dari API');
      const data = await res.json();
      
      const mapped: MusicTrack[] = (data.results || []).map((item: any) => ({
        id: String(item.trackId),
        trackName: item.trackName || 'Unknown Title',
        artistName: item.artistName || 'Unknown Artist',
        collectionName: item.collectionName || 'Single/Album',
        previewUrl: item.previewUrl || '',
        artworkUrl100: (item.artworkUrl100 || '').replace('100x100bb', '400x400bb'),
        durationMs: item.trackTimeMillis || 30000,
        primaryGenreName: item.primaryGenreName || 'OST/BGM'
      }));

      setTracks(mapped);
      if (mapped.length > 0 && !currentTrack) {
        setCurrentTrack(mapped[0]);
      }
    } catch (err: any) {
      console.error('Music search error:', err);
      setErrorMsg('Gagal memuat musik dari API. Silakan coba pencarian lain.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMusicTracks(searchTerm);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMusicTracks(searchTerm);
  };

  const playTrack = (track: MusicTrack) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setTimeout(() => {
        audioRef.current?.play();
      }, 50);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 30);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const formatSecs = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Hidden HTML5 Audio Element */}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.previewUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={handleTimeUpdate}
        />
      )}

      {/* Header & Search */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 border border-purple-500/20 bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold font-mono mb-3">
            <Radio className="w-3.5 h-3.5 animate-pulse text-purple-400" /> WZ AUDIO REALTIME MUSIC SEARCH API
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
            Cari Musik & Soundtrack Official Realtime
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Dengarkan soundtrack anime, novel BGM, dan musik favorit dengan audio HD jernih langsung via iTunes Public API.
          </p>

          <form onSubmit={handleSearchSubmit} className="mt-5 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari lagu, artist, atau anime OST..."
                className="w-full bg-slate-900/90 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 font-sans shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-black flex items-center gap-2 transition shadow-lg shadow-purple-600/30 shrink-0"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Cari Lagu
            </button>
          </form>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
            {POPULAR_THEMES.map((t) => (
              <button
                key={t.label}
                onClick={() => {
                  setSearchTerm(t.query);
                  fetchMusicTracks(t.query);
                }}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold font-mono transition shrink-0 ${
                  searchTerm === t.query
                    ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Track Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
            <Disc className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
            Hasil Pencarian Musik ({tracks.length})
          </h2>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {errorMsg}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 6].map((n) => (
              <div key={n} className="p-4 rounded-2xl glass-card border border-white/5 animate-pulse flex items-center gap-3">
                <div className="w-14 h-14 bg-slate-800 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-800 rounded w-3/4"></div>
                  <div className="h-2.5 bg-slate-800 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : tracks.length === 0 ? (
          <div className="p-12 rounded-3xl glass-card text-center space-y-3">
            <Music className="w-10 h-10 text-purple-400/50 mx-auto" />
            <p className="text-xs text-slate-400">Tidak ada lagu yang ditemukan untuk "{searchTerm}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tracks.map((t) => {
              const isSelected = currentTrack?.id === t.id;
              const isFav = favorites.includes(t.id);

              return (
                <div
                  key={t.id}
                  className={`p-3.5 rounded-2xl glass-card border transition flex items-center gap-3 relative group overflow-hidden ${
                    isSelected ? 'border-purple-500/80 bg-purple-950/30 shadow-lg shadow-purple-500/10' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="relative shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-white/10 group">
                    <img src={t.artworkUrl100} alt={t.trackName} className="w-full h-full object-cover" />
                    <button
                      onClick={() => playTrack(t)}
                      className={`absolute inset-0 bg-black/50 flex items-center justify-center transition ${
                        isSelected && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {isSelected && isPlaying ? (
                        <Pause className="w-6 h-6 text-purple-400 fill-purple-400" />
                      ) : (
                        <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-black text-white truncate group-hover:text-purple-300 transition">
                      {t.trackName}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{t.artistName}</p>
                    <span className="text-[10px] text-purple-400/80 font-mono mt-1 block truncate">
                      {t.collectionName || t.primaryGenreName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleFavorite(t.id)}
                      className={`p-2 rounded-xl transition ${isFav ? 'text-rose-500 bg-rose-500/10' : 'text-slate-500 hover:text-white'}`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                    </button>
                    <button
                      onClick={() => playTrack(t)}
                      className={`p-2 rounded-xl text-xs font-black transition ${
                        isSelected && isPlaying ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/15'
                      }`}
                    >
                      {isSelected && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom Music Player */}
      {currentTrack && (
        <div className="fixed bottom-16 sm:bottom-6 left-4 right-4 max-w-4xl mx-auto z-40 p-3.5 sm:p-4 rounded-3xl bg-slate-950/95 border border-purple-500/40 backdrop-blur-2xl shadow-2xl flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-purple-500/30 relative">
              <img src={currentTrack.artworkUrl100} alt={currentTrack.trackName} className="w-full h-full object-cover" />
              {isPlaying && (
                <div className="absolute inset-0 bg-purple-900/30 backdrop-blur-[1px] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-black text-white truncate">{currentTrack.trackName}</h4>
                <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-mono font-bold shrink-0">
                  REAL API
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{currentTrack.artistName}</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => playTrack(currentTrack)}
                className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 transition"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
              </button>

              <div className="hidden sm:flex items-center gap-1.5 ml-2">
                <button onClick={toggleMute} className="text-slate-400 hover:text-white">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-16 accent-purple-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Progress Bar & Timers */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400 w-8 text-right">{formatSecs(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 30}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] font-mono text-slate-400 w-8">{formatSecs(duration)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
