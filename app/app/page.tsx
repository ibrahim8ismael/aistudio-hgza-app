'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TopBar } from '@/components/TopBar';
import { BottomNav } from '@/components/BottomNav';
import { HomeTab } from '@/components/tabs/HomeTab';
import { PickTeamTab } from '@/components/tabs/PickTeamTab';
import { ScoresTab } from '@/components/tabs/ScoresTab';
import { LeaderboardTab } from '@/components/tabs/LeaderboardTab';
import { MoreTab } from '@/components/tabs/MoreTab';
import { LandingView } from '@/components/LandingView';
import { SetupProfileView } from '@/components/SetupProfileView';
import { NoLeagueView } from '@/components/NoLeagueView';

type TabType = 'home' | 'pick-team' | 'scores' | 'leaderboard' | 'more';

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [hasLeague, setHasLeague] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');

  if (!isAuthenticated) {
    return <LandingView onSignIn={() => setIsAuthenticated(true)} />;
  }

  if (!hasProfile) {
    return <SetupProfileView onComplete={(name) => setHasProfile(true)} />;
  }

  const tabs = {
    'home': hasLeague ? <HomeTab /> : <NoLeagueView onJoinDummyLeague={() => setHasLeague(true)} />,
    'pick-team': hasLeague ? <PickTeamTab /> : <NoLeagueView onJoinDummyLeague={() => setHasLeague(true)} />,
    'scores': hasLeague ? <ScoresTab /> : <NoLeagueView onJoinDummyLeague={() => setHasLeague(true)} />,
    'leaderboard': hasLeague ? <LeaderboardTab /> : <NoLeagueView onJoinDummyLeague={() => setHasLeague(true)} />,
    'more': <MoreTab onSignOut={() => { setIsAuthenticated(false); setHasLeague(false); setHasProfile(false); }} />
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
            className="w-full h-full"
          >
            {tabs[activeTab]}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
