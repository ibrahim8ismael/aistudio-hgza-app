'use client';

import { Home, LayoutTemplate, PenSquare, Trophy, Menu } from 'lucide-react';

export function BottomNav({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: any) => void }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'pick-team', label: 'Pick Team', icon: LayoutTemplate },
    { id: 'scores', label: 'Scores', icon: PenSquare },
    { id: 'leaderboard', label: 'Ranking', icon: Trophy },
  ];

  return (
    <nav className="md:hidden bg-[#1e2024]/80 backdrop-blur-lg fixed bottom-0 w-full rounded-t-3xl z-50 shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
      <div className="flex justify-around items-center px-4 pb-6 pt-3">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center justify-center transition-all duration-300 relative ${
                isActive ? 'text-secondary bg-primary/10 rounded-xl px-3 py-1 -translate-y-1' : 'text-slate-500 hover:text-primary'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="font-label text-[10px] font-semibold uppercase tracking-widest">{label}</span>
            </button>
          );
        })}
        <button className="flex flex-col items-center justify-center text-slate-500 hover:text-primary transition-all group">
          <Menu className="w-5 h-5 mb-1 group-active:translate-y-[2px]" />
          <span className="font-label text-[10px] font-semibold uppercase tracking-widest">More</span>
        </button>
      </div>
    </nav>
  );
}
