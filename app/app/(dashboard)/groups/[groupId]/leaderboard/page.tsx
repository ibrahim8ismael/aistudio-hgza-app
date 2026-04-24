'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'motion/react';
import { Trophy, Users, Loader2, UserPlus } from 'lucide-react';

export default function LeaderboardPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const { data: session, status } = useSession();
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
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 p-4 md:p-6 bg-surface-container-low rounded-xl border border-outline-variant/15 mt-2 md:mt-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Trophy className="w-24 h-24" />
        </div>
        <div className="relative z-10 w-full flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-on-surface-variant font-label text-xs uppercase tracking-wider mb-1">
              <Users className="w-4 h-4" /> Leaderboard
            </div>
            <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight uppercase">Rankings</h2>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="text-center py-12 px-6 rounded-2xl bg-surface-container border border-outline-variant/10">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-headline font-bold text-lg text-on-surface mb-2">No Rankings Yet</h3>
        <p className="font-label text-sm text-on-surface-variant mb-4">
          Complete some rounds to see the leaderboard rankings.
        </p>
        <p className="font-label text-xs text-on-surface-variant">
          Group: {groupId}
        </p>
      </div>

    </div>
  );
}