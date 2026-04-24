'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { UserCircle, ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function SetupPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user) {
      // Check if user already has username - if so, redirect to groups
      if ((session.user as any).username) {
        router.push('/groups');
      }
    }
  }, [session, status, router]);

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#111317] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0052FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Don't render if not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  const handleComplete = async () => {
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to set username');
        return;
      }

      // Redirect to groups after successful username set
      router.push('/groups');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111317] flex col items-center justify-center p-6 relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-surface-container rounded-2xl border border-outline-variant/10 p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <UserCircle className="w-10 h-10" />
          </div>
          <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-on-surface uppercase tracking-tight mb-2">
            Choose Your Username
          </h1>
          <p className="font-label text-sm text-on-surface-variant">
            This is how friends will see you on the leaderboard.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-bold">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={e => {
                setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                setError('');
              }}
              placeholder="e.g. peggy"
              maxLength={20}
              className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl p-4 text-on-surface font-headline font-bold outline-none focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF] transition-all"
            />
            <p className="font-label text-xs text-on-surface-variant">
              3-20 characters, letters, numbers, underscores only
            </p>
          </div>

          {error && (
            <p className="text-error font-label text-sm">{error}</p>
          )}
          
          <button 
            onClick={handleComplete}
            disabled={username.trim().length < 3 || isLoading}
            className="w-full bg-[#0052FF] hover:bg-[#0052FF]/90 disabled:bg-[#0052FF]/50 disabled:cursor-not-allowed text-white font-label font-bold py-4 px-4 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Setting...
              </>
            ) : (
              <>Continue <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}