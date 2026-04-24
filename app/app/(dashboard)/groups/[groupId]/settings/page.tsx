'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { UserCircle, LogOut, Info, Settings, Trophy, ChevronRight, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || 'Player';
  const userEmail = session?.user?.email || '';
  const userImage = session?.user?.image;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 space-y-6 md:mt-4">
      
      <div className="flex flex-col items-center justify-center py-6">
        <div className="w-24 h-24 mb-4 rounded-full border-4 border-surface-container-highest shadow-xl overflow-hidden bg-primary/20 flex items-center justify-center relative">
          {userImage ? (
            <img src={userImage} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <UserCircle className="w-12 h-12 text-primary" />
          )}
          <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <h2 className="font-headline text-2xl font-bold text-on-surface">{userName}</h2>
        <p className="font-label text-sm text-on-surface-variant mt-1">
          {userEmail}
        </p>
      </div>

      <div className="bg-surface-container rounded-2xl border border-outline-variant/10 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
        <div className="px-4 py-3 bg-surface-container-low border-b border-outline-variant/10">
          <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">Profile</span>
        </div>
        <button className="w-full flex items-center justify-between p-4 hover:bg-surface-variant/50 transition-colors border-b border-outline-variant/5">
          <div className="flex items-center gap-3">
            <UserCircle className="w-5 h-5 text-on-surface-variant" />
            <span className="font-label text-sm font-semibold text-on-surface">Account Details</span>
          </div>
          <ChevronRight className="w-4 h-4 text-on-surface-variant" />
        </button>
        <button className="w-full flex items-center justify-between p-4 hover:bg-surface-variant/50 transition-colors">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-on-surface-variant" />
            <span className="font-label text-sm font-semibold text-on-surface">Preferences</span>
          </div>
          <ChevronRight className="w-4 h-4 text-on-surface-variant" />
        </button>
      </div>

      <div className="bg-surface-container rounded-2xl border border-outline-variant/10 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
        <div className="px-4 py-3 bg-surface-container-low border-b border-outline-variant/10">
          <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">About</span>
        </div>
        <button className="w-full flex items-center justify-between p-4 hover:bg-surface-variant/50 transition-colors border-b border-outline-variant/5">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-primary" />
            <div className="text-left">
               <span className="font-label text-sm font-semibold text-on-surface block">About HGZA</span>
               <span className="font-body text-xs text-on-surface-variant">Version 1.0.0</span>
             </div>
           </div>
           <ChevronRight className="w-4 h-4 text-on-surface-variant" />
        </button>
      </div>

      <button 
        onClick={handleSignOut}
        className="w-full mt-4 flex items-center justify-center gap-2 p-4 rounded-xl bg-error/10 text-error hover:bg-error/20 transition-colors font-label text-sm font-bold uppercase tracking-wider"
      >
        <LogOut className="w-4 h-4" /> Sign Out
      </button>

    </div>
  );
}