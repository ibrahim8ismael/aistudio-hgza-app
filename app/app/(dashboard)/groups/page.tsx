'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { PlusCircle, Search, Users, Crown, Loader2 } from 'lucide-react';

export default function GroupsPage() {
  const { data: session, status } = useSession();
  const [view, setView] = useState<'list' | 'create' | 'join'>('list');
  const [joinCode, setJoinCode] = useState('');
  const [leagueName, setLeagueName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || 'Player';

  const handleCreateGroup = async () => {
    if (!leagueName.trim()) return;
    setIsLoading(true);
    // TODO: Call API to create group
    // For now, just simulate
    setTimeout(() => {
      setIsLoading(false);
      setView('list');
    }, 1000);
  };

  const handleJoinGroup = async () => {
    if (joinCode.length < 5) return;
    setIsLoading(true);
    // TODO: Call API to join group
    // For now, just simulate
    setTimeout(() => {
      setIsLoading(false);
      setView('list');
    }, 1000);
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 md:px-8 space-y-6 pt-8 md:pt-16 min-h-[80vh] flex flex-col justify-center">
      
      <div className="text-center mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight uppercase mb-2">
          Welcome, {userName}
        </h1>
        <p className="font-label text-on-surface-variant text-sm">Join or create a group to start playing.</p>
      </div>

      {view === 'list' && (
        <div className="space-y-4">
          {/* Empty State */}
          <div className="text-center py-12 px-6 rounded-2xl bg-surface-container border border-outline-variant/10">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-headline font-bold text-lg text-on-surface mb-2">No Groups Yet</h3>
            <p className="font-label text-sm text-on-surface-variant mb-6">
              Create a new group or join one with an invite code to start playing.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setView('create')}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-surface-container-highest hover:bg-surface-variant border border-outline-variant/10 transition-colors"
              >
                <PlusCircle className="w-5 h-5 text-primary" />
                <span className="font-label text-sm font-semibold">Create Group</span>
              </button>

              <button 
                onClick={() => setView('join')}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-surface-container-highest hover:bg-surface-variant border border-outline-variant/10 transition-colors"
              >
                <Search className="w-5 h-5 text-secondary" />
                <span className="font-label text-sm font-semibold">Join via Code</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'create' && (
        <div className="bg-surface-container rounded-2xl border border-outline-variant/15 p-6 md:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
          <div className="space-y-6">
            <h3 className="font-headline font-bold text-xl text-on-surface uppercase mb-4">Create Group</h3>
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">Group Name</label>
              <input 
                type="text" 
                value={leagueName}
                onChange={e => setLeagueName(e.target.value)}
                placeholder="e.g. Office Champions" 
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface font-label outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setView('list')}
                disabled={isLoading}
                className="flex-1 py-3 font-label font-bold text-sm uppercase tracking-wider text-on-surface-variant bg-surface-container-highest hover:bg-surface-variant rounded-lg transition-colors"
              >
                Back
              </button>
              <button 
                onClick={handleCreateGroup}
                disabled={!leagueName || isLoading}
                className="flex-[2] py-3 font-label font-bold text-sm uppercase tracking-wider text-on-primary bg-primary hover:bg-primary-container disabled:opacity-50 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-lg"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>Create Group</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'join' && (
        <div className="bg-surface-container rounded-2xl border border-outline-variant/15 p-6 md:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
          <div className="space-y-6">
            <h3 className="font-headline font-bold text-xl text-on-surface uppercase mb-4">Join Group</h3>
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">Invite Code</label>
              <input 
                type="text" 
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                placeholder="e.g. X9F2K" 
                maxLength={6}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-on-surface font-label outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-center text-xl tracking-widest uppercase font-mono"
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setView('list')}
                disabled={isLoading}
                className="flex-1 py-3 font-label font-bold text-sm uppercase tracking-wider text-on-surface-variant bg-surface-container-highest hover:bg-surface-variant rounded-lg transition-colors"
              >
                Back
              </button>
              <button 
                onClick={handleJoinGroup}
                disabled={joinCode.length < 5 || isLoading}
                className="flex-[2] py-3 font-label font-bold text-sm uppercase tracking-wider text-on-secondary bg-secondary hover:brightness-110 disabled:opacity-50 rounded-lg transition-colors flex justify-center items-center shadow-lg"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>Join Group</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}