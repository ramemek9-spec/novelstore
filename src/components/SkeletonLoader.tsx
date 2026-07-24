import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse p-3 border border-white/5">
      <div className="w-full h-48 bg-slate-800/80 rounded-xl mb-3" />
      <div className="h-4 bg-slate-800/80 rounded-md w-3/4 mb-2" />
      <div className="h-3 bg-slate-800/60 rounded-md w-1/2 mb-3" />
      <div className="flex justify-between items-center">
        <div className="h-3 bg-slate-800/60 rounded-md w-1/4" />
        <div className="h-6 bg-slate-800/80 rounded-lg w-16" />
      </div>
    </div>
  );
};

export const BannerSkeleton: React.FC = () => {
  return (
    <div className="w-full h-52 sm:h-64 rounded-3xl bg-slate-800/80 animate-pulse glass-card" />
  );
};
