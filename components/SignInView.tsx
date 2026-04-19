'use client';

import { motion } from 'motion/react';
import { Trophy, LogIn } from 'lucide-react';

export function SignInView({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="min-h-screen bg-[#111317] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full max-h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface-container rounded-2xl border border-outline-variant/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 relative z-10 text-center"
      >
        <div className="w-20 h-20 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-6 border border-outline-variant/20 shadow-inner">
          <Trophy className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="font-headline text-3xl font-black italic text-primary uppercase tracking-tighter mb-2">
          HGZA
        </h1>
        <p className="font-label text-on-surface-variant text-sm mb-8">
          The ultimate fantasy friends game.
        </p>

        <div className="space-y-4">
          <button 
            onClick={onSignIn}
            className="w-full bg-surface-container-highest hover:bg-surface-variant text-on-surface font-label font-bold py-3.5 px-4 rounded-xl transition-all border border-outline-variant/20 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
          
          <button 
            onClick={onSignIn}
            className="w-full bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] font-label font-bold py-3.5 px-4 rounded-xl transition-all border border-[#1877F2]/20 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>
        </div>

        <button 
          onClick={onSignIn}
          className="mt-8 text-on-surface-variant font-label text-xs hover:text-primary transition-colors uppercase tracking-widest"
        >
          Skip for now (Demo)
        </button>
      </motion.div>
    </div>
  );
}
