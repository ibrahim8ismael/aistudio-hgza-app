'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowUpRight, ArrowDownRight, Users, Trophy, Shirt, CalendarDays, BarChart3, Clock, Loader2, UserPlus } from 'lucide-react';
import gsap from 'gsap';

export default function GroupHomePage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const { data: session, status } = useSession();
  const pointsRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    let ctx = gsap.context(() => {
      if (pointsRef.current) {
        gsap.fromTo(pointsRef.current, 
          { innerHTML: 0 }, 
          { innerHTML: 0, duration: 0 }
        );
      }
    });

    const countdown = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev;
        secs--;
        if (secs < 0) { secs = 59; mins--; }
        if (mins < 0) { mins = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
        return { days, hours, mins, secs };
      });
    }, 1000);

    return () => {
        ctx.revert();
        clearInterval(countdown);
    }
  }, [isLoading]);

  const formatZero = (num: number) => num < 10 ? `0${num}` : num;

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-4 md:space-y-6">
      
      {/* No Group Selected State */}
      <div className="text-center py-12 px-6 rounded-2xl bg-surface-container border border-outline-variant/10">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-headline font-bold text-xl text-on-surface mb-2">Select a Group</h3>
        <p className="font-label text-sm text-on-surface-variant mb-6">
          Choose a group from your groups list to view your squad and scores.
        </p>
        <p className="font-label text-xs text-on-surface-variant">
          Group ID: {groupId}
        </p>
      </div>

    </div>
  );
}