'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Minus, Save } from 'lucide-react';

export function ScoresTab() {
  const [performances, setPerformances] = useState([
    { id: '1', name: 'Sarah', goals: 0, assists: 0 },
    { id: '2', name: 'Mike', goals: 0, assists: 0 },
    { id: '3', name: 'John', goals: 0, assists: 0 },
    { id: '4', name: 'Emily', goals: 0, assists: 0 },
    { id: '5', name: 'Chris', goals: 0, assists: 0 },
    { id: '6', name: 'David', goals: 0, assists: 0 },
    { id: '7', name: 'Jessica', goals: 0, assists: 0 },
  ]);

  const updateStat = (id: string, stat: 'goals' | 'assists', delta: number) => {
    setPerformances(prev => prev.map(p => {
      if (p.id === id) {
        const newValue = Math.max(0, p[stat] + delta);
        return { ...p, [stat]: newValue };
      }
      return p;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 p-6 bg-surface-container-low rounded-xl border border-outline-variant/15 md:mt-4">
        <div>
          <h1 className="font-headline text-3xl font-bold text-primary tracking-tight uppercase">Record Performance</h1>
          <p className="text-on-surface-variant font-label text-sm mt-1">Admin: Input real-life stats for Round 1</p>
        </div>
        <button className="w-full md:w-auto bg-gradient-to-b from-primary to-primary-container text-on-primary font-bold px-6 py-3 rounded-md hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(183,196,255,0.15)] text-sm uppercase tracking-wider flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> Save Scores
        </button>
      </div>

      <div className="bg-surface-container rounded-xl border border-outline-variant/15 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
        <div className="grid grid-cols-12 gap-2 md:gap-4 p-4 border-b border-outline-variant/20 font-label text-[10px] sm:text-xs uppercase tracking-widest text-on-surface-variant font-semibold">
          <div className="col-span-4 flex items-center">Player</div>
          <div className="col-span-4 flex items-center justify-center text-center">Goals<span className="hidden sm:inline">&nbsp;(3 pts)</span></div>
          <div className="col-span-4 flex items-center justify-center text-center">Assists<span className="hidden sm:inline">&nbsp;(2 pts)</span></div>
        </div>

        <div className="flex flex-col">
          {performances.map((player, index) => (
            <motion.div 
              key={player.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-12 gap-2 md:gap-4 p-4 items-center bg-surface-container hover:bg-surface-container-high transition-colors border-b border-outline-variant/5 last:border-0"
            >
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center font-headline font-bold text-primary flex-shrink-0">
                  {player.name.charAt(0)}
                </div>
                <div className="font-headline font-bold text-on-surface text-sm md:text-base truncate">{player.name}</div>
              </div>

              <div className="col-span-4 flex items-center justify-center gap-2 md:gap-4">
                <button onClick={() => updateStat(player.id, 'goals', -1)} className="w-8 h-8 rounded-full bg-surface-container-highest hover:bg-surface-variant flex items-center justify-center text-on-surface-variant transition-colors flex-shrink-0 border border-outline-variant/10">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-headline font-bold text-xl md:text-2xl w-6 text-center text-on-surface">{player.goals}</span>
                <button onClick={() => updateStat(player.id, 'goals', 1)} className="w-8 h-8 rounded-full bg-surface-container-highest hover:bg-surface-variant hover:text-primary flex items-center justify-center text-on-surface-variant transition-colors flex-shrink-0 border border-outline-variant/10">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="col-span-4 flex items-center justify-center gap-2 md:gap-4">
                <button onClick={() => updateStat(player.id, 'assists', -1)} className="w-8 h-8 rounded-full bg-surface-container-highest hover:bg-surface-variant flex items-center justify-center text-on-surface-variant transition-colors flex-shrink-0 border border-outline-variant/10">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-headline font-bold text-xl md:text-2xl w-6 text-center text-on-surface">{player.assists}</span>
                <button onClick={() => updateStat(player.id, 'assists', 1)} className="w-8 h-8 rounded-full bg-surface-container-highest hover:bg-surface-variant hover:text-secondary flex items-center justify-center text-on-surface-variant transition-colors flex-shrink-0 border border-outline-variant/10">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
