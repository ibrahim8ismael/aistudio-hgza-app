'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { UserCircle, ArrowRight } from 'lucide-react';

export function SetupProfileView({ onComplete }: { onComplete: (name: string) => void }) {
  const [username, setUsername] = useState('');

  return (
    <div className="min-h-screen bg-[#111317] flex col items-center justify-center p-6 relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-surface-container rounded-2xl border border-outline-variant/10 p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <UserCircle className="w-10 h-10" />
          </div>
          <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-on-surface uppercase tracking-tight mb-2">
            Create Manager Profile
          </h1>
          <p className="font-label text-sm text-on-surface-variant">
            Choose your manager name. This is how friends will see you on the leaderboard.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">Manager Name</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. PepG" 
              maxLength={20}
              className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl p-4 text-on-surface font-headline font-bold outline-none focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF] transition-all"
            />
          </div>
          
          <button 
            onClick={() => onComplete(username)}
            disabled={username.trim().length < 3}
            className="w-full bg-[#0052FF] hover:bg-[#0052FF]/90 disabled:bg-[#0052FF]/50 disabled:cursor-not-allowed text-white font-label font-bold py-4 px-4 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
