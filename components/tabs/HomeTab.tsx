'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowDownRight, Users, Trophy, Shirt, CalendarDays, BarChart3 } from 'lucide-react';
import gsap from 'gsap';

const scoredSquad = {
  starters: [
    { id: 1, name: 'Sarah', pts: 12, isCaptain: true },
    { id: 2, name: 'Mike', pts: 8, isVice: true },
    { id: 3, name: 'John', pts: 6 },
    { id: 4, name: 'Emily', pts: 9 },
    { id: 5, name: 'Chris', pts: 2 },
  ],
  bench: [
    { id: 6, name: 'David', pts: 0 },
    { id: 7, name: 'Jessica', pts: 0 },
  ]
};

export function HomeTab() {
  const pointsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      if (pointsRef.current) {
        gsap.fromTo(pointsRef.current, 
          { innerHTML: 0 }, 
          { innerHTML: 49, duration: 1.5, ease: "power2.out", snap: { innerHTML: 1 } }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const PlayerPointsCard = ({ player, isBench = false }: { player: any, isBench?: boolean }) => (
    <div className={`flex flex-col items-center relative w-[72px] md:w-[84px] ${isBench ? 'opacity-80' : ''}`}>
      {player.isCaptain && (
        <div className="absolute -top-2 -right-2 z-20 w-5 h-5 bg-on-surface text-surface rounded-full flex items-center justify-center font-headline text-[10px] font-black border-2 border-surface shadow-md">
          C
        </div>
      )}
      {player.isVice && <div className="absolute -top-2 -right-2 z-20 w-5 h-5 bg-surface-container-highest text-on-surface rounded-full flex items-center justify-center font-headline text-[10px] font-black shadow-md border-2 border-surface">V</div>}
      
      <div className="relative mb-1">
        <Shirt className={`w-10 h-10 md:w-12 md:h-12 ${isBench ? 'text-outline-variant fill-surface-container-high' : 'text-primary fill-primary/20'} drop-shadow-lg`} strokeWidth={1.5} />
      </div>
      
      <div className="flex flex-col w-full text-center rounded overflow-hidden shadow-lg border border-outline-variant/10">
        <div className="bg-surface-variant text-on-surface font-label text-[10px] md:text-xs font-bold py-0.5 px-0.5 truncate leading-tight">
          {player.name}
        </div>
        <div className={`font-label text-[10px] md:text-xs font-bold py-0.5 px-0.5 truncate leading-tight ${player.pts > 5 ? 'bg-secondary text-on-secondary' : 'bg-surface-container-highest text-primary'}`}>
          {player.pts}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-4 md:space-y-6">
      
      {/* Top Header / Gameweek Selector */}
      <div className="flex items-center justify-between mt-2 md:mt-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/15">
        <button className="p-2 text-on-surface-variant hover:text-on-surface"><ArrowDownRight className="w-5 h-5 rotate-45" /></button>
        <div className="text-center">
            <h2 className="font-label text-on-surface-variant text-xs uppercase tracking-widest font-bold mb-1">Points</h2>
            <div className="font-headline text-xl md:text-2xl font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
                Round 1 <CalendarDays className="w-4 h-4 text-primary" />
            </div>
        </div>
        <button className="p-2 text-on-surface-variant hover:text-on-surface"><ArrowDownRight className="w-5 h-5 -rotate-[135deg]" /></button>
      </div>

      {/* Stats Bar (Official FPL Style) */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 h-[100px] md:h-[120px]">
        {/* Total Points */}
        <div className="col-span-1 bg-primary text-on-primary rounded-xl p-4 flex flex-col justify-center items-center shadow-[0_8px_32px_rgba(183,196,255,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-20"><Trophy className="w-12 h-12" /></div>
            <span ref={pointsRef} className="font-headline text-4xl md:text-5xl font-black tracking-tighter relative z-10">0</span>
            <span className="font-label text-[10px] md:text-xs font-bold uppercase tracking-wider mt-1 relative z-10 opacity-90">Points</span>
        </div>
        
        {/* Average */}
        <div className="col-span-1 bg-surface-container-low border border-outline-variant/15 rounded-xl p-4 flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 p-2 opacity-5"><Users className="w-10 h-10" /></div>
            <span className="font-headline text-2xl md:text-3xl font-black tracking-tight text-on-surface relative z-10">34</span>
            <span className="font-label text-[10px] md:text-xs font-bold uppercase tracking-wider text-on-surface-variant mt-1 relative z-10">Average</span>
        </div>

        {/* Highest */}
        <div className="col-span-1 bg-surface-container-low border border-outline-variant/15 rounded-xl p-4 flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 p-2 opacity-5"><BarChart3 className="w-10 h-10" /></div>
            <span className="font-headline text-2xl md:text-3xl font-black tracking-tight text-on-surface relative z-10">61</span>
            <span className="font-label text-[10px] md:text-xs font-bold uppercase tracking-wider text-on-surface-variant mt-1 relative z-10">Highest</span>
        </div>
      </div>

      {/* Rank Indicator */}
      <div className="flex justify-between items-center bg-surface-container rounded-lg p-3 md:p-4 border border-outline-variant/10">
        <span className="font-label text-sm font-semibold uppercase tracking-wider">Overall Rank</span>
        <div className="flex items-center gap-3">
            <span className="font-headline font-black text-2xl text-on-surface">2</span>
            <span className="bg-secondary/20 text-secondary border border-secondary/30 px-2 py-0.5 rounded text-xs font-label font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3"/> 1
            </span>
        </div>
      </div>

      {/* Points Pitch */}
      <div className="w-full relative rounded-t-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-[#1e2e22] border-x border-t border-primary/20">
        {/* Pitch markings */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute inset-2 md:inset-4 border border-white/50"></div>
            <div className="absolute top-1/2 left-2 right-2 md:left-4 md:right-4 h-px bg-white/50 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-20 h-20 md:w-32 md:h-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50"></div>
            <div className="absolute top-2 left-1/2 w-40 h-16 md:w-64 md:h-24 -translate-x-1/2 border border-t-0 border-white/50"></div>
            <div className="absolute bottom-2 left-1/2 w-40 h-16 md:w-64 md:h-24 -translate-x-1/2 border border-b-0 border-white/50"></div>
            <div className="w-full h-full space-y-[10%]">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`w-full h-[10%] ${i % 2 === 0 ? 'bg-black/10' : 'bg-transparent'}`} />
              ))}
            </div>
        </div>

        <div className="relative z-10 flex flex-col justify-around min-h-[380px] md:min-h-[500px] py-6 md:py-12">
            <div className="flex justify-center gap-12 md:gap-24 w-full">
                <PlayerPointsCard player={scoredSquad.starters[0]} />
                <PlayerPointsCard player={scoredSquad.starters[1]} />
            </div>
            <div className="flex justify-center gap-6 md:gap-16 w-full mt-4 md:mt-8">
                <PlayerPointsCard player={scoredSquad.starters[2]} />
                <PlayerPointsCard player={scoredSquad.starters[3]} />
                <PlayerPointsCard player={scoredSquad.starters[4]} />
            </div>
        </div>
      </div>

      {/* Points Bench */}
      <div className="bg-surface-container-high rounded-b-xl border-x border-b border-primary/20 p-4 md:p-6 mb-8 md:mb-12">
        <div className="flex justify-between items-center mb-4">
           <span className="font-label text-xs font-bold uppercase text-on-surface-variant tracking-wider">Bench</span>
           <span className="font-label text-xs font-bold uppercase text-on-surface-variant tracking-wider">0 Pts</span>
        </div>
        <div className="flex justify-center gap-6 md:gap-16 w-full relative z-10">
            {scoredSquad.bench.map((p) => (
                <PlayerPointsCard key={p.name} player={p} isBench={true} />
            ))}
        </div>
      </div>

    </div>
  );
}
