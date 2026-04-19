import Link from 'next/link';
import { Flag, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#111317] flex flex-col items-center justify-center p-6 relative overflow-hidden text-center">
      {/* Dynamic colored background highlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full max-h-[600px] bg-[#E9C400]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-[400px] bg-[#0052FF]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <Flag className="w-24 h-24 text-[#E9C400] mb-6 relative z-10 drop-shadow-[0_0_15px_rgba(233,196,0,0.3)]" />
      
      <h1 className="font-headline text-5xl md:text-7xl font-black italic text-on-surface uppercase tracking-tighter mb-4 relative z-10">
        404 <span className="text-[#0052FF]">Offside!</span>
      </h1>
      
      <p className="font-label text-on-surface-variant text-lg max-w-md mb-8 relative z-10 leading-relaxed">
        The page you're looking for has been flagged offside. It might have been moved, deleted, or never existed in this league.
      </p>
      
      <Link 
        href="/" 
        className="relative z-10 px-8 py-4 bg-[#0052FF] hover:bg-[#0052FF]/80 text-white font-label font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_20px_rgba(0,82,255,0.3)] flex items-center gap-3"
      >
        <Home className="w-5 h-5" /> Back to Stadium
      </Link>
    </div>
  );
}
