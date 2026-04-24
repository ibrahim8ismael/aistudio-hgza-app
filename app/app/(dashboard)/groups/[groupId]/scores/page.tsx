'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Save, Settings, Users, PenSquare, Check, X, Loader2, UserPlus } from 'lucide-react';

export default function ScoresPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const { data: session, status } = useSession();
  const [activeAdminTab, setActiveAdminTab] = useState<'record' | 'settings' | 'requests'>('record');
  const [isLoading, setIsLoading] = useState(true);

  const [performances, setPerformances] = useState<Array<{
    id: string;
    name: string;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  }>>([]);

  const updateStat = (id: string, stat: keyof typeof performances[0], delta: number) => {
    setPerformances(prev => prev.map(p => {
      if (p.id === id) {
        let current = p[stat] as number;
        let newValue = Math.max(0, current + delta);
        if (stat === 'yellowCards' && newValue > 2) newValue = 2;
        if (stat === 'redCards' && newValue > 1) newValue = 1;
        return { ...p, [stat]: newValue };
      }
      return p;
    }));
  };

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
    <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-6 md:mt-4 pb-8">
      
      <div className="text-center md:text-left mb-6">
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-primary tracking-tight uppercase">League Admin</h1>
        <p className="text-on-surface-variant font-label text-sm mt-1 uppercase tracking-widest">Manage Round & League Settings</p>
      </div>

      {/* Empty State */}
      <div className="text-center py-12 px-6 rounded-2xl bg-surface-container border border-outline-variant/10">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-headline font-bold text-lg text-on-surface mb-2">No Active Round</h3>
        <p className="font-label text-sm text-on-surface-variant mb-4">
          There's no round ready for scoring. Create a new round first to record scores.
        </p>
        <p className="font-label text-xs text-on-surface-variant">
          Group: {groupId}
        </p>
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-2 bg-surface-container rounded-xl p-2 border border-outline-variant/15 overflow-x-auto no-scrollbar">
         {[
           { id: 'record', label: 'Record Scores', icon: PenSquare },
           { id: 'settings', label: 'Settings', icon: Settings },
           { id: 'requests', label: 'Join Requests', icon: Users }
         ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 p-3 rounded-lg font-label text-xs font-bold uppercase tracking-wider transition-all ${
                 activeAdminTab === tab.id 
                 ? 'bg-surface-variant text-on-surface' 
                 : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
         ))}
      </div>

      <AnimatePresence mode="wait">
        {activeAdminTab === 'record' && (
          <motion.div 
            key="record"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
             <div className="bg-surface-container rounded-xl border border-outline-variant/15 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.2)] p-6 text-center">
                <p className="font-label text-on-surface-variant">
                  No members in this group yet.
                </p>
             </div>
          </motion.div>
        )}

        {activeAdminTab === 'settings' && (
          <motion.div 
            key="settings"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
             <div className="bg-surface-container rounded-xl border border-outline-variant/15 p-6 space-y-6">
                <h3 className="font-headline font-bold text-xl uppercase text-on-surface mb-2">Points Rules</h3>
                <p className="font-label text-sm text-on-surface-variant">
                  Configure scoring rules for your group.
                </p>
                <div className="space-y-4">
                   {[
                     { label: 'Points per Goal', value: 3, id: 'pt-goal' },
                     { label: 'Points per Assist', value: 2, id: 'pt-assist' },
                     { label: 'Points per Yellow Card', value: -1, id: 'pt-yellow' },
                     { label: 'Points per Red Card', value: -3, id: 'pt-red' },
                   ].map(rule => (
                     <div key={rule.id} className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline-variant/10">
                        <span className="font-label text-sm font-semibold">{rule.label}</span>
                        <input type="number" defaultValue={rule.value} className="w-16 bg-surface-container-highest border border-outline-variant/20 rounded p-2 text-center font-headline font-bold outline-none focus:border-primary" />
                     </div>
                   ))}
                </div>
             </div>

             <button className="w-full bg-surface-container-highest hover:bg-surface-variant border border-outline-variant/20 text-on-surface font-label font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg">
                <Save className="w-5 h-5" /> Save Settings
             </button>
          </motion.div>
        )}

        {activeAdminTab === 'requests' && (
          <motion.div 
            key="requests"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
             <div className="bg-surface-container rounded-xl border border-outline-variant/15 overflow-hidden p-8 text-center">
                <p className="font-label text-on-surface-variant">No pending join requests.</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}