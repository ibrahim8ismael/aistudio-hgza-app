'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { PlusCircle, Search, Copy, Save } from 'lucide-react';

export function NoLeagueView({ onJoinDummyLeague }: { onJoinDummyLeague: () => void }) {
  const [view, setView] = useState<'options' | 'create' | 'join'>('options');
  const [joinCode, setJoinCode] = useState('');
  const [leagueName, setLeagueName] = useState('');

  return (
    <div className="max-w-xl mx-auto px-4 md:px-8 space-y-6 pt-8 md:pt-16 min-h-[80vh] flex flex-col justify-center">
      
      <div className="text-center mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight uppercase mb-2">Welcome to HGZA</h1>
        <p className="font-label text-on-surface-variant text-sm">Join a group to start picking your team and scoring points.</p>
      </div>

      <motion.div 
        key={view}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface-container rounded-2xl border border-outline-variant/15 p-6 md:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
      >
        {view === 'options' && (
          <div className="space-y-4">
            <button 
              onClick={() => setView('create')}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-container-highest hover:bg-surface-variant border border-outline-variant/10 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-headline font-bold text-lg text-on-surface">Create a League</h3>
                  <p className="font-label text-xs text-on-surface-variant">Start a new group and invite friends</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => setView('join')}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-container-highest hover:bg-surface-variant border border-outline-variant/10 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-headline font-bold text-lg text-on-surface">Join via Code</h3>
                  <p className="font-label text-xs text-on-surface-variant">Enter a code given by your admin</p>
                </div>
              </div>
            </button>

            <div className="pt-4 mt-2 border-t border-outline-variant/10 text-center">
               <button 
                 onClick={onJoinDummyLeague}
                 className="font-label text-xs font-bold text-primary hover:text-secondary uppercase tracking-widest transition-colors"
               >
                 Or enter demo league
               </button>
            </div>
          </div>
        )}

        {view === 'create' && (
          <div className="space-y-6">
            <h3 className="font-headline font-bold text-xl text-on-surface uppercase mb-4">Create League</h3>
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">League Name</label>
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
                onClick={() => setView('options')}
                className="flex-1 py-3 font-label font-bold text-sm uppercase tracking-wider text-on-surface-variant bg-surface-container-highest hover:bg-surface-variant rounded-lg transition-colors"
              >
                Back
              </button>
              <button 
                onClick={onJoinDummyLeague}
                disabled={!leagueName}
                className="flex-[2] py-3 font-label font-bold text-sm uppercase tracking-wider text-on-primary bg-primary hover:bg-primary-container disabled:opacity-50 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-lg"
              >
                <Save className="w-4 h-4" /> Create
              </button>
            </div>
          </div>
        )}

        {view === 'join' && (
          <div className="space-y-6">
            <h3 className="font-headline font-bold text-xl text-on-surface uppercase mb-4">Join League</h3>
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
                onClick={() => setView('options')}
                className="flex-1 py-3 font-label font-bold text-sm uppercase tracking-wider text-on-surface-variant bg-surface-container-highest hover:bg-surface-variant rounded-lg transition-colors"
              >
                Back
              </button>
              <button 
                onClick={onJoinDummyLeague}
                disabled={joinCode.length < 5}
                className="flex-[2] py-3 font-label font-bold text-sm uppercase tracking-wider text-on-secondary bg-secondary hover:brightness-110 disabled:opacity-50 rounded-lg transition-colors flex justify-center items-center shadow-lg"
              >
                Join League
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
