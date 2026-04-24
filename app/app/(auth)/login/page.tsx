'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Users, Activity, Trophy, X } from 'lucide-react';
import { useSession } from 'next-auth/react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/groups';
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.push(callbackUrl);
    }
  }, [session, callbackUrl, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0d0e11] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0052FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSignIn = async (provider: string) => {
    setIsLoading(provider);
    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(null);
    }
  };

  const handleDemoLogin = () => {
    router.push('/groups');
  };

  return (
    <div className="min-h-screen bg-[#0d0e11] flex flex-col relative font-sans text-on-surface">
       <header className="w-full flex justify-between items-center p-6 md:px-12 max-w-7xl mx-auto z-20">
           <img src="/logo.svg" alt="HGZA" className="h-8 w-auto" />
           <button 
             onClick={() => setShowAuthModal(true)} 
             className="text-white font-label font-semibold text-sm px-5 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
           >
              Log In
           </button>
       </header>

       <main className="flex-1 flex flex-col items-center justify-center px-6 text-center z-10 py-20">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="w-full max-w-4xl mx-auto">
               <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-tight mb-6">
                 Draft your friends.<br />
                 Rule the league.
               </h1>
               <p className="font-body text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
                 A private fantasy sports experience where you build a team from your real-life friends. Score points based on their actual performance.
               </p>

               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                   <button 
                      onClick={() => setShowAuthModal(true)} 
                      className="w-full sm:w-auto bg-[#0052FF] hover:bg-[#0052FF]/90 text-white font-label font-bold text-sm px-8 py-4 rounded-lg uppercase tracking-widest transition-colors"
                   >
                      Start Playing
                   </button>
                   <button className="w-full sm:w-auto bg-transparent hover:bg-white/5 text-white border border-white/20 font-label font-bold text-sm px-8 py-4 rounded-lg uppercase tracking-widest transition-colors">
                      How it works
                   </button>
               </div>
           </motion.div>
       </main>

       <section className="w-full bg-[#111317] border-t border-white/5 py-24 z-10">
           <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">
               <div className="text-left space-y-3">
                  <Users className="w-6 h-6 text-[#0052FF] mb-2" />
                  <h3 className="font-headline font-bold text-xl text-white">Private Leagues</h3>
                  <p className="font-body text-on-surface-variant text-sm leading-relaxed">
                    Create groups and invite only the people you know. Your league, your rules.
                  </p>
               </div>
               <div className="text-left space-y-3">
                  <Activity className="w-6 h-6 text-[#E9C400] mb-2" />
                  <h3 className="font-headline font-bold text-xl text-white">Live Tracking</h3>
                  <p className="font-body text-on-surface-variant text-sm leading-relaxed">
                    Assign real-life goals, assists, and cards every week to automatically calculate fantasy points.
                  </p>
               </div>
               <div className="text-left space-y-3">
                  <Trophy className="w-6 h-6 text-[#0052FF] mb-2" />
                  <h3 className="font-headline font-bold text-xl text-white">Strategic Depth</h3>
                  <p className="font-body text-on-surface-variant text-sm leading-relaxed">
                    Set captains, utilize tactical chips, and climb the global leaderboard to win.
                  </p>
               </div>
           </div>
       </section>

       <AnimatePresence>
         {showAuthModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }} 
                   exit={{ opacity: 0 }}
                   onClick={() => setShowAuthModal(false)}
                   className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95, y: 10 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95, y: 10 }}
                   className="w-full max-w-md bg-[#16181c] rounded-2xl border border-white/10 shadow-2xl relative z-10 overflow-hidden"
                >
                   <button 
                     onClick={() => setShowAuthModal(false)}
                     className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-white transition-colors"
                   >
                     <X className="w-5 h-5" />
                   </button>

                   <div className="p-8 pb-10 text-center">
                       <h2 className="font-headline text-2xl font-black text-white uppercase tracking-tight mb-2 mt-4">
                         Welcome Back
                       </h2>
                       <p className="font-body text-on-surface-variant text-sm mb-8">
                         Sign in to manage your squad.
                       </p>

                       <div className="space-y-3">
                         <button 
                           onClick={() => handleSignIn('google')}
                           disabled={isLoading !== null}
                           className="w-full bg-white hover:bg-gray-100 text-black font-label font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-3 text-sm disabled:opacity-50"
                         >
                           {isLoading === 'google' ? (
                             <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                           ) : (
                             <svg className="w-4 h-4" viewBox="0 0 24 24">
                               <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                               <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                               <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                               <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                             </svg>
                           )}
                           Continue with Google
                         </button>
                         
                         <button 
                           onClick={() => handleSignIn('facebook')}
                           disabled={isLoading !== null}
                           className="w-full bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-label font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-3 text-sm disabled:opacity-50"
                         >
                           {isLoading === 'facebook' ? (
                             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                           ) : (
                             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                               <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                             </svg>
                           )}
                           Continue with Facebook
                         </button>
                       </div>

                       <div className="mt-8 pt-6 border-t border-white/5">
                           <button 
                             onClick={handleDemoLogin}
                             className="text-on-surface-variant hover:text-white font-label text-xs font-semibold transition-colors uppercase tracking-widest text-center w-full"
                           >
                             Skip for now (Preview Demo)
                           </button>
                       </div>
                   </div>
                </motion.div>
            </div>
         )}
       </AnimatePresence>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d0e11] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0052FF] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}