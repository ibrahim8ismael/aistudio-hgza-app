'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowDownRight, Users, Play, Trophy } from 'lucide-react';
import gsap from 'gsap';
import { motion } from 'motion/react';

export function HomeTab() {
  const rankRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      if (rankRef.current) {
        gsap.fromTo(rankRef.current, 
          { innerHTML: 0 }, 
          { innerHTML: 2, duration: 2, ease: "power3.out", snap: { innerHTML: 1 }, 
          onUpdate: function() {
            if(rankRef.current) rankRef.current.innerHTML = Number(Math.round(Number(this.targets()[0].innerHTML))).toLocaleString();
          }
        });
      }

      if (pointsRef.current) {
        gsap.fromTo(pointsRef.current, 
          { innerHTML: 0 }, 
          { innerHTML: 38, duration: 1.5, ease: "power2.out", snap: { innerHTML: 1 } }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      <section className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden shadow-[0_4px_40px_rgba(183,196,255,0.06)] md:mt-4">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="font-label text-primary font-bold uppercase tracking-wider text-xs mb-1">Round 1 Status</h2>
            <div className="font-headline text-3xl md:text-4xl font-black tracking-tighter text-on-surface">
              IN PROGRESS
            </div>
            <p className="font-label text-on-surface-variant text-[10px] mt-2 uppercase tracking-widest">Waiting for admin to record performance</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 bg-surface-container rounded-xl p-6 md:p-8 relative overflow-hidden shadow-[0_8px_32px_rgba(183,196,255,0.08)] flex flex-col justify-between min-h-[320px]">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4 select-none">
             <Trophy className="w-[300px] h-[300px] text-tertiary" strokeWidth={1} />
          </div>
          
          <div className="flex justify-between items-start mb-6 z-10">
            <h3 className="font-label text-primary font-bold uppercase tracking-wider text-sm">My Performance</h3>
            <div className="bg-surface-container-highest px-3 py-1 rounded-full text-xs font-label text-on-surface flex items-center gap-2 border border-outline-variant/30">
              Round 1
            </div>
          </div>

          <div className="z-10 mt-auto">
            <div className="font-headline font-semibold text-on-surface-variant uppercase text-sm mb-1">Rank</div>
            <div className="flex items-baseline gap-4 mb-4">
              <span ref={rankRef} className="font-headline text-6xl md:text-8xl font-black tracking-tighter text-tertiary">0</span>
              <span className="font-headline text-3xl md:text-4xl font-black tracking-tighter text-on-surface-variant">/ 8</span>
              <span className="bg-secondary/20 text-secondary border border-secondary/30 px-2 py-1 rounded-md text-sm font-label font-bold flex flex-row items-center gap-1">
                <ArrowUpRight className="w-4 h-4"/> 1
              </span>
            </div>
            
            <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/20">
              <div className="flex flex-col">
                 <span className="font-label text-xs uppercase text-on-surface-variant">Total Points</span>
                 <div className="flex items-end gap-1">
                    <span ref={pointsRef} className="text-3xl font-bold font-headline text-primary">0</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 border border-outline-variant/15 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-label text-on-surface font-bold uppercase tracking-wider text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Group Actions
            </h3>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 py-4">
            <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center border-4 border-surface-container-highest">
              <span className="font-headline text-3xl font-black text-on-surface">8</span>
            </div>
            <div>
              <p className="font-label font-bold text-on-surface mb-1">Friends in Group</p>
              <p className="font-label text-xs text-on-surface-variant">Invite more friends</p>
            </div>
          </div>
          <button className="w-full bg-surface-container-highest hover:bg-surface-variant text-on-surface font-label font-semibold py-3 rounded-md transition-colors text-sm border border-outline-variant/20 tracking-wider">
            INVITE FRIENDS
          </button>
        </div>
      </section>

      <section className="bg-surface-container rounded-xl p-6 shadow-[0_4px_24px_rgba(183,196,255,0.05)] border border-outline-variant/10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-label text-on-surface font-bold uppercase tracking-wider text-sm flex items-center gap-2">
            Round Action
          </h3>
        </div>
        <div className="w-full flex items-center justify-center bg-surface-container-low p-12 rounded-xl border border-outline-variant/10 border-dashed">
            <div className="text-center space-y-4 max-w-md">
                <Play className="w-12 h-12 text-primary mx-auto opacity-50" />
                <h4 className="font-headline text-xl font-bold">Waiting for round to end</h4>
                <p className="text-on-surface-variant text-sm">Once the round is marked complete, your final scores will be calculated based on real-life goals and assists from your selected friends.</p>
            </div>
        </div>
      </section>
    </div>
  );
}
