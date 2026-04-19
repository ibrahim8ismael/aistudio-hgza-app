'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TopBar } from '@/components/TopBar';
import { BottomNav } from '@/components/BottomNav';
import { HomeTab } from '@/components/tabs/HomeTab';
import { PickTeamTab } from '@/components/tabs/PickTeamTab';
import { ScoresTab } from '@/components/tabs/ScoresTab';
import { LeaderboardTab } from '@/components/tabs/LeaderboardTab';

type TabType = 'home' | 'pick-team' | 'scores' | 'leaderboard';

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const tabs = {
    'home': <HomeTab />,
    'pick-team': <PickTeamTab />,
    'scores': <ScoresTab />,
    'leaderboard': <LeaderboardTab />
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 w-full relative pt-16 pb-24 md:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="w-full"
          >
            {tabs[activeTab]}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
