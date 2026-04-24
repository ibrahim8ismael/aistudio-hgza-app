'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'motion/react';
import { Zap, RotateCcw, Save, Wand2, Shirt, Info, Loader2, UserPlus } from 'lucide-react';

export default function PickTeamPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const { data: session, status } = useSession();
  const [tripleCaptainActive, setTripleCaptainActive] = useState(false);
  const [benchBoostActive, setBenchBoostActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-4 md:space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 p-4 md:p-6 bg-surface-container-low rounded-xl border border-outline-variant/15 mt-2 md:mt-4">
        <div>
          <div className="text-on-surface-variant font-label text-xs uppercase tracking-wider mb-1">Group </div>
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

      {/* Empty State */}
      <div className="text-center py-12 px-6 rounded-2xl bg-surface-container border border-outline-variant/10">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-headline font-bold text-lg text-on-surface mb-2">No Active Round</h3>
        <p className="font-label text-sm text-on-surface-variant mb-4">
          There's no active round to pick a team for. Wait for your group admin to create a new round.
        </p>
        <p className="font-label text-xs text-on-surface-variant">
          Group: {groupId}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-2">
        <button 
          onClick={() => setTripleCaptainActive(!tripleCaptainActive)}
          className={`flex flex-col md:flex-row justify-center items-center gap-1 md:gap-2 p-3 rounded-lg border-2 transition-all ${tripleCaptainActive ? 'bg-secondary/10 border-secondary text-secondary' : 'bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/40'}`}
        >
          <Zap className={`w-4 h-4 ${tripleCaptainActive ? 'fill-secondary' : ''}`} />
          <span className="font-label text-[10px] md:text-xs font-bold uppercase tracking-wider">Triple Captain</span>
        </button>
        <button 
          onClick={() => setBenchBoostActive(!benchBoostActive)}
          className={`flex flex-col md:flex-row justify-center items-center gap-1 md:gap-2 p-3 rounded-lg border-2 transition-all ${benchBoostActive ? 'bg-primary/10 border-primary text-primary' : 'bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/40'}`}
        >
          <Shirt className={`w-4 h-4 ${benchBoostActive ? 'fill-primary' : ''}`} />
          <span className="font-label text-[10px] md:text-xs font-bold uppercase tracking-wider">Bench Boost</span>
        </button>
        <button className="col-span-2 hidden md:flex justify-center items-center gap-2 p-3 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all font-label text-sm font-bold uppercase tracking-wider shadow-md">
          <Save className="w-5 h-5" /> Save Team
        </button>
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