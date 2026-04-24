'use client';

import { Trophy, ArrowUpRight, ArrowDownRight, Minus, Users } from 'lucide-react';
import { motion } from 'motion/react';

export function LeaderboardTab() {
  const leaderboard = [
    { id: 1, teamName: 'Unreal Madrid', manager: 'Sarah Jenkins', rank: 1, gwPts: 61, points: 342, trend: 'up' },
    { id: 2, teamName: 'Couch Potatoes', manager: 'HGZA (You)', rank: 2, gwPts: 49, points: 338, trend: 'same', isUser: true },
    { id: 3, teamName: 'Expected Goals', manager: 'Mike Ross', rank: 3, gwPts: 42, points: 335, trend: 'down' },
    { id: 4, teamName: 'Bench Warmers', manager: 'Emily Stone', rank: 4, gwPts: 55, points: 320, trend: 'up' },
    { id: 5, teamName: 'VAR Victims', manager: 'John Doe', rank: 5, gwPts: 38, points: 310, trend: 'down' },
    { id: 6, teamName: 'Goal Diggers', manager: 'Chris Evans', rank: 6, gwPts: 45, points: 295, trend: 'same' },
    { id: 7, teamName: 'Park The Bus', manager: 'David Hall', rank: 7, gwPts: 32, points: 280, trend: 'down' },
    { id: 8, teamName: 'Net Six & Chill', manager: 'Jessica Day', rank: 8, gwPts: 28, points: 265, trend: 'down' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-4 md:space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 p-4 md:p-6 bg-surface-container-low rounded-xl border border-outline-variant/15 mt-2 md:mt-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Trophy className="w-24 h-24" />
        </div>
        <div className="relative z-10 w-full flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-on-surface-variant font-label text-xs uppercase tracking-wider mb-1">
              <Users className="w-4 h-4" /> Global League
            </div>
            <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight uppercase">Overall Ranking</h2>
          </div>
        </div>
      </div>

      <div className="bg-surface-container rounded-xl shadow-[0_4px_24px_rgba(183,196,255,0.05)] border border-outline-variant/10 overflow-hidden mb-8 md:mb-12">
        {/* Table Header */}
        <div className="flex items-center px-4 py-3 bg-surface-container-low border-b border-outline-variant/15 font-label text-[10px] md:text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            <div className="w-12 md:w-16 flex justify-center">Rank</div>
            <div className="flex-1 pl-2">Team & Manager</div>
            <div className="w-12 md:w-16 text-center">GW</div>
            <div className="w-16 md:w-20 text-center">Total</div>
        </div>

        {/* FPL Style League List */}
        <div className="flex flex-col">
          {leaderboard.map((user, idx) => (
            <motion.div 
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className={`flex items-center px-4 py-3 border-b border-outline-variant/5 last:border-0 hover:bg-surface-variant/50 transition-colors ${
                user.isUser ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'
              }`}
            >
               {/* Rank & Trend */}
               <div className="w-12 md:w-16 flex flex-col items-center justify-center">
                  <span className="font-headline text-lg md:text-xl font-bold text-on-surface">{user.rank}</span>
                  {user.trend === 'up' && <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-secondary"/>}
                  {user.trend === 'down' && <ArrowDownRight className="w-3 h-3 md:w-4 md:h-4 text-error"/>}
                  {user.trend === 'same' && <Minus className="w-3 h-3 md:w-4 md:h-4 text-on-surface-variant"/>}
               </div>

               {/* Team & Manager */}
               <div className="flex-1 flex flex-col truncate pl-2 pr-2">
                  <span className={`font-label font-bold text-sm md:text-base truncate ${user.isUser ? 'text-primary' : 'text-on-surface'}`}>
                    {user.teamName}
                  </span>
                  <span className="font-label text-xs md:text-sm text-on-surface-variant truncate">
                    {user.manager}
                  </span>
               </div>

               {/* Game Week Points */}
               <div className="w-12 md:w-16 flex justify-center items-center">
                   <span className="font-headline text-sm md:text-base font-semibold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded w-full text-center">
                       {user.gwPts}
                   </span>
               </div>

               {/* Total Points */}
               <div className="w-16 md:w-20 flex justify-center items-center font-headline text-lg md:text-xl font-bold text-on-surface pl-2">
                  {user.points}
               </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
