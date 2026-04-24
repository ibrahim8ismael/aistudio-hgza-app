'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Save, Settings, Users, PenSquare, Check, X } from 'lucide-react';

export function ScoresTab() {
  const [activeAdminTab, setActiveAdminTab] = useState<'record' | 'settings' | 'requests'>('record');
  
  const [performances, setPerformances] = useState([
    { id: '1', name: 'Sarah', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
    { id: '2', name: 'Mike', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
    { id: '3', name: 'John', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
    { id: '4', name: 'Emily', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
    { id: '5', name: 'Chris', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  ]);

  const updateStat = (id: string, stat: keyof typeof performances[0], delta: number) => {
    setPerformances(prev => prev.map(p => {
      if (p.id === id) {
        let current = p[stat] as number;
        let newValue = Math.max(0, current + delta);
        if (stat === 'yellowCards' && newValue > 2) newValue = 2; // Max 2 yellows
        if (stat === 'redCards' && newValue > 1) newValue = 1; // Max 1 red
        return { ...p, [stat]: newValue };
      }
      return p;
    }));
  };

  const requests = [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com' },
    { id: 2, name: 'Sam Taylor', email: 'sam@example.com' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-6 md:mt-4 pb-8">
      
      <div className="text-center md:text-left mb-6">
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-primary tracking-tight uppercase">League Admin</h1>
        <p className="text-on-surface-variant font-label text-sm mt-1 uppercase tracking-widest">Manage Round & League Settings</p>
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
             <div className="bg-surface-container rounded-xl border border-outline-variant/15 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
               
               {/* Header Info */}
               <div className="grid grid-cols-12 gap-2 p-4 border-b border-outline-variant/20 font-label text-[10px] md:text-xs uppercase tracking-widest text-on-surface-variant font-semibold">
                 <div className="col-span-12 md:col-span-4 mb-2 md:mb-0">Player</div>
                 <div className="col-span-6 md:col-span-2 text-center text-primary">Goal</div>
                 <div className="col-span-6 md:col-span-2 text-center text-secondary">Assist</div>
                 <div className="col-span-6 md:col-span-2 text-center text-yellow-500">Yellow</div>
                 <div className="col-span-6 md:col-span-2 text-center text-error">Red</div>
               </div>

               {/* Rows */}
               <div className="flex flex-col">
                  {performances.map((player) => (
                    <div key={player.id} className="grid grid-cols-12 gap-2 md:gap-4 p-4 items-center bg-surface-container hover:bg-surface-container-high transition-colors border-b border-outline-variant/5 last:border-0">
                      
                      <div className="col-span-12 md:col-span-4 flex items-center gap-3 mb-2 md:mb-0">
                        <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center font-headline font-bold text-primary flex-shrink-0">
                          {player.name.charAt(0)}
                        </div>
                        <div className="font-headline font-bold text-on-surface text-base truncate">{player.name}</div>
                      </div>

                      <div className="col-span-6 md:col-span-2 flex items-center justify-center gap-2">
                         <button onClick={() => updateStat(player.id, 'goals', -1)} className="w-6 h-6 rounded bg-surface-container-highest hover:bg-surface-variant flex items-center justify-center text-on-surface-variant"><Minus className="w-3 h-3" /></button>
                         <span className="font-headline font-bold text-lg w-4 text-center">{player.goals}</span>
                         <button onClick={() => updateStat(player.id, 'goals', 1)} className="w-6 h-6 rounded bg-surface-container-highest hover:bg-surface-variant hover:text-primary flex items-center justify-center text-on-surface-variant"><Plus className="w-3 h-3" /></button>
                      </div>

                      <div className="col-span-6 md:col-span-2 flex items-center justify-center gap-2">
                         <button onClick={() => updateStat(player.id, 'assists', -1)} className="w-6 h-6 rounded bg-surface-container-highest hover:bg-surface-variant flex items-center justify-center text-on-surface-variant"><Minus className="w-3 h-3" /></button>
                         <span className="font-headline font-bold text-lg w-4 text-center">{player.assists}</span>
                         <button onClick={() => updateStat(player.id, 'assists', 1)} className="w-6 h-6 rounded bg-surface-container-highest hover:bg-surface-variant hover:text-secondary flex items-center justify-center text-on-surface-variant"><Plus className="w-3 h-3" /></button>
                      </div>

                      <div className="col-span-6 md:col-span-2 flex items-center justify-center gap-2">
                         <button onClick={() => updateStat(player.id, 'yellowCards', -1)} className="w-6 h-6 rounded bg-surface-container-highest hover:bg-surface-variant flex items-center justify-center text-on-surface-variant"><Minus className="w-3 h-3" /></button>
                         <span className="font-headline font-bold text-lg w-4 text-center">{player.yellowCards}</span>
                         <button onClick={() => updateStat(player.id, 'yellowCards', 1)} className="w-6 h-6 rounded bg-surface-container-highest hover:bg-surface-variant hover:text-yellow-500 flex items-center justify-center text-on-surface-variant"><Plus className="w-3 h-3" /></button>
                      </div>

                      <div className="col-span-6 md:col-span-2 flex items-center justify-center gap-2">
                         <button onClick={() => updateStat(player.id, 'redCards', -1)} className="w-6 h-6 rounded bg-surface-container-highest hover:bg-surface-variant flex items-center justify-center text-on-surface-variant"><Minus className="w-3 h-3" /></button>
                         <span className="font-headline font-bold text-lg w-4 text-center">{player.redCards}</span>
                         <button onClick={() => updateStat(player.id, 'redCards', 1)} className="w-6 h-6 rounded bg-surface-container-highest hover:bg-surface-variant hover:text-error flex items-center justify-center text-on-surface-variant"><Plus className="w-3 h-3" /></button>
                      </div>

                    </div>
                  ))}
               </div>
             </div>

             <button className="w-full bg-primary hover:bg-primary-container text-on-primary font-label font-bold py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(183,196,255,0.2)] flex items-center justify-center gap-2 uppercase tracking-widest">
                <Save className="w-5 h-5" /> Publish Round Scores
             </button>
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
             <div className="bg-surface-container rounded-xl border border-outline-variant/15 overflow-hidden">
                {requests.length > 0 ? requests.map((req, i) => (
                  <div key={req.id} className={`flex flex-col md:flex-row items-center justify-between p-4 ${i !== requests.length - 1 ? 'border-b border-outline-variant/10' : ''}`}>
                    <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                      <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center font-headline font-bold">{req.name.charAt(0)}</div>
                      <div className="text-left">
                        <p className="font-label font-bold text-on-surface">{req.name}</p>
                        <p className="font-label text-xs text-on-surface-variant">{req.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                       <button className="flex-1 md:flex-none py-2 px-4 bg-outline-variant/10 hover:bg-error/20 text-error rounded-lg font-label text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1">
                          <X className="w-4 h-4" /> Reject
                       </button>
                       <button className="flex-1 md:flex-none py-2 px-4 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg font-label text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1 text-center">
                          <Check className="w-4 h-4" /> Approve
                       </button>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-on-surface-variant font-label">No pending join requests.</div>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
