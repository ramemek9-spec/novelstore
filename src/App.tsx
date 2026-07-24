import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AuthModal } from './components/AuthModal';

import { DashboardView } from './views/DashboardView';
import { NovelView } from './views/NovelView';
import { MusicView } from './views/MusicView';
import { StoreView } from './views/StoreView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';

const MainContent: React.FC = () => {
  const { activeTab, settings } = useApp();
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (isLoadingScreen) {
    return (
      <LoadingScreen
        siteName={settings.siteName}
        logoUrl={settings.logoUrl}
        onComplete={() => setIsLoadingScreen(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-slate-100 flex flex-col selection:bg-amber-500/30 relative overflow-x-hidden">
      {/* Background Glows (Atmospheric) */}
      <div className="fixed top-[-10%] left-[-10%] w-[45%] h-[45%] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Premium Border Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none border border-white/5 z-50"></div>

      {/* Top Header */}
      <Navbar onOpenAuth={() => setIsAuthModalOpen(true)} />

      {/* Main Container Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pt-6 relative z-10">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'novel' && <NovelView />}
        {activeTab === 'music' && <MusicView />}
        {activeTab === 'store' && <StoreView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'admin' && <AdminView />}
      </main>

      {/* Notification Drawer */}
      <NotificationDrawer />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Bottom Android-style Glass Navigation */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </AuthProvider>
  );
}
