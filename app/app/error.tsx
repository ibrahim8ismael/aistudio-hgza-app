'use client';

import { useEffect } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#111317] flex flex-col items-center justify-center p-6 relative overflow-hidden text-center">
      {/* Dynamic background highlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full max-h-[600px] bg-error/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-[400px] bg-[#E9C400]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-24 h-32 bg-error rounded-sm mb-8 relative z-10 shadow-[0_0_40px_rgba(255,84,73,0.4)] flex items-center justify-center border-4 border-white/10 transform rotate-12 transition-transform hover:rotate-0 duration-300">
         <AlertCircle className="w-12 h-12 text-white opacity-80" />
      </div>

      <h1 className="font-headline text-5xl md:text-6xl font-black italic text-on-surface uppercase tracking-tighter mb-4 relative z-10">
        <span className="text-error drop-shadow-[0_0_10px_rgba(255,84,73,0.5)]">Red Card!</span>
      </h1>
      
      <p className="font-label text-on-surface-variant text-base md:text-lg max-w-md mb-8 relative z-10 leading-relaxed">
        Something went wrong on the pitch. The server encountered an unexpected foul. Do you want to retake the free kick?
      </p>
      
      <button 
        onClick={() => reset()}
        className="relative z-10 px-8 py-4 bg-[#E9C400] hover:bg-[#ffe142] text-black font-headline font-bold text-lg uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_25px_rgba(233,196,0,0.3)] flex items-center gap-3 border-2 border-transparent"
      >
        <RotateCcw className="w-5 h-5" /> Try Again
      </button>
    </div>
  );
}
