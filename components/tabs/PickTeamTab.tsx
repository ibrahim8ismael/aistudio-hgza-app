'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, RotateCcw, Save, Wand2, Shirt, Info } from 'lucide-react';

const squad = {
  starters: [
    { id: 1, name: 'Sarah', fixture: 'MCI (A)', isCaptain: true },
    { id: 2, name: 'Mike', fixture: 'LIV (H)', isVice: true },
    { id: 3, name: 'John', fixture: 'ARS (A)' },
    { id: 4, name: 'Emily', fixture: 'CHE (H)' },
    { id: 5, name: 'Chris', fixture: 'TOT (A)' },
  ],
  bench: [
    { id: 6, name: 'David', fixture: 'NFO (H)' },
    { id: 7, name: 'Jessica', fixture: 'SHU (A)' },
  ]
};

export function PickTeamTab() {
  const [tripleCaptainActive, setTripleCaptainActive] = useState(false);
  const [benchBoostActive, setBenchBoostActive] = useState(false);

  const PlayerCard = ({ player, index, isBench = false }: { player: any, index: number, isBench?: boolean }) => (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`flex flex-col items-center group cursor-pointer relative w-[72px] md:w-[84px] ${isBench ? 'opacity-80 hover:opacity-100' : ''}`}
    >
      <button className="absolute -top-2 left-0 w-4 h-4 bg-surface-container-highest rounded-full text-on-surface-variant flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 border border-outline-variant/30">
        <Info className="w-3 h-3" />
      </button>

      {player.isCaptain && (
        <div className={`absolute -top-2 -right-2 z-20 w-5 h-5 ${tripleCaptainActive ? 'bg-secondary text-on-secondary shadow-[0_0_10px_rgba(125,255,162,0.6)]' : 'bg-on-surface text-surface shadow-md'} rounded-full flex items-center justify-center font-headline text-[10px] font-black border-2 border-surface transition-colors`}>
          {tripleCaptainActive ? 'TC' : 'C'}
        </div>
      )}
      {player.isVice && <div className="absolute -top-2 -right-2 z-20 w-5 h-5 bg-surface-container-highest text-on-surface rounded-full flex items-center justify-center font-headline text-[10px] font-black shadow-md border-2 border-surface">V</div>}
      
      <div className="relative mb-1">
        <Shirt className={`w-10 h-10 md:w-12 md:h-12 ${isBench && !benchBoostActive ? 'text-outline-variant fill-surface-container-high' : 'text-primary fill-primary/20'} drop-shadow-lg transition-colors duration-300`} strokeWidth={1.5} />
      </div>
      
      <div className="flex flex-col w-full text-center rounded overflow-hidden shadow-lg">
        <div className="bg-surface-variant text-on-surface font-label text-[10px] md:text-xs font-bold py-0.5 px-0.5 truncate leading-tight">
          {player.name}
        </div>
        <div className="bg-surface-container-lowest text-primary font-label text-[9px] md:text-[10px] font-semibold py-0.5 px-0.5 truncate leading-tight">
          {player.fixture}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-4 md:space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 p-4 md:p-6 bg-surface-container-low rounded-xl border border-outline-variant/15 mt-2 md:mt-4">
        <div>
          <div className="text-on-surface-variant font-label text-xs uppercase tracking-wider mb-1">Round 1 </div>
          <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight uppercase">Pick Team</h2>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none justify-center items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container-highest text-on-surface hover:bg-surface-variant transition-colors font-label text-xs font-bold uppercase flex flex-col md:flex-row">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button className="flex-1 md:flex-none justify-center items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container-highest text-on-surface hover:bg-surface-variant transition-colors font-label text-xs font-bold uppercase flex flex-col md:flex-row">
            <Wand2 className="w-4 h-4" /> Auto Pick
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-2">
        <button 
          onClick={() => setTripleCaptainActive(!tripleCaptainActive)}
          className={`flex flex-col md:flex-row justify-center items-center gap-1 md:gap-2 p-3 rounded-lg border-2 transition-all ${tripleCaptainActive ? 'bg-secondary/10 border-secondary text-secondary' : 'bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/40'}`}
        >
          <Zap className={`w-4 h-4 ${tripleCaptainActive ? 'fill-secondary' : ''}`} />
          <span className="font-label text-[10px] md:text-xs font-bold uppercase tracking-wider">Triple Captain</span>
          <span className="text-[9px] md:hidden block mt-1">{tripleCaptainActive ? 'Active' : 'Play'}</span>
        </button>
        <button 
          onClick={() => setBenchBoostActive(!benchBoostActive)}
          className={`flex flex-col md:flex-row justify-center items-center gap-1 md:gap-2 p-3 rounded-lg border-2 transition-all ${benchBoostActive ? 'bg-primary/10 border-primary text-primary' : 'bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/40'}`}
        >
          <Shirt className={`w-4 h-4 ${benchBoostActive ? 'fill-primary' : ''}`} />
          <span className="font-label text-[10px] md:text-xs font-bold uppercase tracking-wider">Bench Boost</span>
          <span className="text-[9px] md:hidden block mt-1">{benchBoostActive ? 'Active' : 'Play'}</span>
        </button>
        <button className="col-span-2 hidden md:flex justify-center items-center gap-2 p-3 rounded-lg bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-all font-label text-sm font-bold uppercase tracking-wider shadow-md">
          <Save className="w-5 h-5" /> Save Team
        </button>
      </div>

      {/* FPL Style Pitch */}
      <div className="w-full relative rounded-t-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-[#1e2e22] border-x border-t border-primary/20">
        {/* Pitch markings */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute inset-2 md:inset-4 border border-white/50"></div>
            <div className="absolute top-1/2 left-2 right-2 md:left-4 md:right-4 h-px bg-white/50 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-20 h-20 md:w-32 md:h-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50"></div>
            <div className="absolute top-2 left-1/2 w-40 h-16 md:w-64 md:h-24 -translate-x-1/2 border border-t-0 border-white/50"></div>
            <div className="absolute bottom-2 left-1/2 w-40 h-16 md:w-64 md:h-24 -translate-x-1/2 border border-b-0 border-white/50"></div>
            {/* Checkerboard grass pattern */}
            <div className="w-full h-full space-y-[10%]">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`w-full h-[10%] ${i % 2 === 0 ? 'bg-black/10' : 'bg-transparent'}`} />
              ))}
            </div>
        </div>

        <div className="relative z-10 flex flex-col justify-around min-h-[380px] md:min-h-[500px] py-6 md:py-12">
            {/* Formation: 2 - 3 */}
            <div className="flex justify-center gap-12 md:gap-24 w-full">
                <PlayerCard player={squad.starters[0]} index={0} />
                <PlayerCard player={squad.starters[1]} index={1} />
            </div>
            <div className="flex justify-center gap-6 md:gap-16 w-full mt-4 md:mt-8">
                <PlayerCard player={squad.starters[2]} index={2} />
                <PlayerCard player={squad.starters[3]} index={3} />
                <PlayerCard player={squad.starters[4]} index={4} />
            </div>
        </div>
      </div>

      {/* FPL Style Bench */}
      <div className={`rounded-b-xl border-x border-b border-primary/20 ${benchBoostActive ? 'bg-[#1e2e22]' : 'bg-surface-container-high'} p-4 md:p-6 transition-colors duration-500`}>
        <div className="flex justify-center gap-6 md:gap-16 w-full relative z-10">
            {squad.bench.map((p, idx) => (
                <PlayerCard key={p.name} player={p} index={idx + 5} isBench={!benchBoostActive} />
            ))}
        </div>
      </div>

      {/* Mobile Save Button */}
      <div className="md:hidden pt-2 pb-6">
        <button className="w-full flex justify-center items-center gap-2 p-3.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all font-label text-sm font-bold uppercase tracking-wider shadow-[0_4px_20px_rgba(183,196,255,0.2)]">
          <Save className="w-5 h-5" /> Save Team
        </button>
      </div>

    </div>
  );
}
