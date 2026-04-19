'use client';

import { Trophy, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';

export function LeaderboardTab() {
  const leaderboard = [
    { id: 1, name: 'Mike', rank: 1, points: 42, trend: 'up' },
    { id: 2, name: 'Alex (You)', rank: 2, points: 38, trend: 'up', isUser: true },
    { id: 3, name: 'Sarah', rank: 3, points: 35, trend: 'down' },
    { id: 4, name: 'John', rank: 4, points: 28, trend: 'same' },
    { id: 5, name: 'Emily', rank: 5, points: 24, trend: 'down' },
    { id: 6, name: 'Chris', rank: 6, points: 18, trend: 'same' },
    { id: 7, name: 'David', rank: 7, points: 15, trend: 'down' },
    { id: 8, name: 'Jessica', rank: 8, points: 12, trend: 'down' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mt-4 md:mt-8">
      <div className="flex flex-col items-center justify-center text-center p-8 bg-surface-container-low rounded-xl border border-outline-variant/15 shadow-[0_4px_40px_rgba(183,196,255,0.06)] relative overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-64 h-64 bg-tertiary/10 rounded-full blur-3xl pointer-events-none" />
        <Trophy className="w-16 h-16 text-tertiary mb-4 relative z-10" />
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface uppercase mb-2 relative z-10">Group Leaderboard</h1>
        <p className="font-body text-on-surface-variant text-sm max-w-md relative z-10">The ultimate ranking of who is the best manager in the group.</p>
      </div>

      <div className="space-y-3 bg-surface-container-lowest rounded-xl p-2 md:p-4 border border-outline-variant/10">
        {leaderboard.map((manager, index) => (
          <motion.div 
            key={manager.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-4 rounded-xl border group transition-colors ${manager.isUser ? 'bg-primary/10 border-primary/20 shadow-[0_0_20px_rgba(183,196,255,0.05)]' : 'bg-surface-container border-outline-variant/10 hover:bg-surface-container-high'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-headline font-bold text-lg ${manager.rank === 1 ? 'bg-tertiary/20 text-tertiary border border-tertiary/30' : manager.rank === 2 ? 'bg-on-surface-variant/20 text-on-surface-variant border border-on-surface-variant/30' : manager.rank === 3 ? 'bg-secondary/20 text-secondary border border-secondary/30' : 'bg-surface-variant text-on-surface border border-outline-variant/20'}`}>
                {manager.rank}
              </div>
              <div>
                <h3 className={`font-headline font-bold text-lg ${manager.isUser ? 'text-primary' : 'text-on-surface'}`}>{manager.name}</h3>
                <p className="font-label text-xs text-on-surface-variant flex items-center gap-1 mt-0.5 font-semibold">
                  {manager.trend === 'up' ? (
                      <span className="text-secondary flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> Up</span>
                  ) : manager.trend === 'down' ? (
                      <span className="text-error flex items-center gap-1"><ArrowDownRight className="w-3 h-3"/> Down</span>
                  ) : (
                      <span className="text-outline flex items-center gap-1"><span className="w-3 h-[2px] bg-outline rounded-full" /> Same</span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-right">
              <div className="font-headline text-2xl font-black text-on-surface">{manager.points} <span className="text-sm font-label text-on-surface-variant font-medium">pts</span></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
