'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

const availableFriends = [
  { name: 'Sarah', pts: 12, isCaptain: true },
  { name: 'Mike', pts: 8, isVice: true },
  { name: 'John', pts: 6 },
  { name: 'Emily', pts: 9 },
  { name: 'Chris', pts: 2 },
];

const benchFriends = [
  { name: 'David', pts: 0 },
  { name: 'Jessica', pts: 0 },
];

export function PickTeamTab() {
  const [tripleCaptainActive, setTripleCaptainActive] = useState(false);

  const PlayerCard = ({ player, index, isBench = false }: { player: any, index: number, isBench?: boolean }) => (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`flex flex-col items-center group cursor-pointer relative w-20 md:w-28 ${isBench ? 'opacity-70 hover:opacity-100' : ''}`}
    >
      {player.isCaptain && (
        <div className={`absolute -top-3 -right-2 z-20 w-8 h-8 ${tripleCaptainActive ? 'bg-secondary text-on-secondary shadow-[0_0_15px_rgba(125,255,162,0.6)]' : 'bg-tertiary text-on-tertiary shadow-lg'} rounded-full flex items-center justify-center font-headline text-[10px] md:text-xs font-black border-2 border-surface-dim transition-colors`}>
          {tripleCaptainActive ? 'TC' : 'C'}
        </div>
      )}
      {player.isVice && <div className="absolute -top-3 -right-2 z-20 w-8 h-8 bg-surface-container-highest text-on-surface rounded-full flex items-center justify-center font-headline text-[10px] md:text-xs font-black shadow-lg border-2 border-surface-dim">VC</div>}
      
      <div className={`w-16 h-16 md:w-20 md:h-20 bg-surface-container-high border-2 ${player.isCaptain && tripleCaptainActive ? 'border-secondary shadow-[0_0_20px_rgba(125,255,162,0.4)]' : 'border-outline-variant/30'} rounded-full md:rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.4)] group-hover:border-primary/50 transition-all transform group-hover:scale-105 duration-300 flex items-center justify-center`}>
        <span className="font-headline font-bold text-3xl text-on-surface-variant opacity-50 px-1 select-none">
          {player.name.substring(0,1).toUpperCase()}
        </span>
      </div>
      <div className="mt-2 bg-surface border border-outline-variant/15 rounded-md overflow-hidden text-center shadow-lg w-full">
        <div className="bg-surface-variant text-on-surface font-label text-xs md:text-sm font-bold py-1 px-1 truncate">{player.name}</div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 p-6 bg-surface-container-low rounded-xl border border-outline-variant/15 md:mt-4">
        <div>
          <div className="text-on-surface-variant font-label text-sm uppercase tracking-wider mb-1">Round 1</div>
          <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-primary tracking-tight uppercase">Pick Team</h2>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => setTripleCaptainActive(!tripleCaptainActive)}
            className={`flex flex-1 md:flex-none justify-center items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all ${tripleCaptainActive ? 'bg-secondary/10 border-secondary text-secondary shadow-[0_0_20px_rgba(125,255,162,0.15)]' : 'bg-surface-container border-outline-variant/20 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
          >
            <Zap className={`w-5 h-5 ${tripleCaptainActive ? 'fill-secondary' : ''}`} />
            <span className="font-headline text-xs md:text-sm font-bold uppercase tracking-wider">Triple Captain</span>
          </button>
        </div>
      </div>

      <div className="w-full relative rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5),inset_0_0_60px_rgba(183,196,255,0.05)] bg-[#10141a] border border-primary/20">
        <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute inset-4 border-2 border-primary rounded-xl"></div>
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-primary -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-around min-h-[450px] md:min-h-[550px] py-12">
            <div className="flex justify-center gap-8 md:gap-24 w-full">
                <PlayerCard player={availableFriends[0]} index={0} />
                <PlayerCard player={availableFriends[1]} index={1} />
            </div>
            <div className="flex justify-center gap-6 md:gap-20 w-full mt-12 md:mt-16">
                <PlayerCard player={availableFriends[2]} index={2} />
                <PlayerCard player={availableFriends[3]} index={3} />
                <PlayerCard player={availableFriends[4]} index={4} />
            </div>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-xl p-4 md:p-6 border border-outline-variant/15 flex flex-col items-center">
        <h3 className="font-label text-sm font-bold text-on-surface mb-6 uppercase tracking-wider flex items-center justify-center gap-2">
           Bench
        </h3>
        <div className="flex justify-center gap-8 md:gap-16 w-full pb-2">
            {benchFriends.map((p, idx) => (
                <PlayerCard key={p.name} player={p} index={idx + 5} isBench={true} />
            ))}
        </div>
      </div>
    </div>
  );
}
