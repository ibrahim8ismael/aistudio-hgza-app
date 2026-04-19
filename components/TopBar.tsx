'use client';

import { Bell } from 'lucide-react';

export function TopBar({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: any) => void }) {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#111317]/70 backdrop-blur-xl bg-gradient-to-b from-[#1a1c20] to-transparent shadow-[0_4px_30px_rgba(183,196,255,0.06)] border-b border-white/5 md:border-none">
      <div className="flex justify-between items-center px-4 md:px-6 h-16 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkJ2y7J7PMfv3Qi9eqiqJ6AFCpN2KGYvcnXB8p66t-nIuR-ts5bDsXpkheC75bvBQXO_wg2K1iFao_U81x8NcZeU9RsKMSmR8eyul5bnziIqV6vkYnvI367G2kfmgoJXiBuWCOe-sYFEVl8Z5e9YYNn9FFaXp0ubbhB23MbiXl31ElNMcXNToRzoWbeBhgTCREtJIiKMX-tFByMPa1I99jYyboqvCJOKbvMNfTimz_b0Juy9w6M40lzM9mRs4YOt7xMc465DRtp4o" 
            alt="User avatar" 
            className="w-8 h-8 rounded-full border border-outline-variant/30 object-cover"
          />
          <span className="font-headline font-black italic text-primary text-xl hidden md:block">HGZA</span>
        </div>

        <div className="font-headline font-black italic text-primary text-xl md:hidden absolute left-1/2 -translate-x-1/2">
          HGZA
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm tracking-widest font-semibold font-label">
          {[
            { id: 'home', label: 'Home' },
            { id: 'pick-team', label: 'Pick Team' },
            { id: 'scores', label: 'Scores' },
            { id: 'leaderboard', label: 'Leaderboard' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 group relative transition-colors ${
                activeTab === tab.id ? 'text-secondary' : 'text-slate-400 hover:text-secondary'
              }`}
            >
              <span className="uppercase">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute -bottom-4 w-full h-1 bg-secondary rounded-t-lg"></div>
              )}
            </button>
          ))}
        </nav>

        <button className="text-primary hover:text-secondary transition-colors active:scale-95 duration-200">
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
