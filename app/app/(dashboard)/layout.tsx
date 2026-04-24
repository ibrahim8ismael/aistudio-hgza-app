'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutTemplate, PenLine, Trophy, Settings, LogOut, Users, Bell, Menu } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

const navigation = [
  { name: 'Home', href: '/groups/[groupId]', icon: Home },
  { name: 'Pick Team', href: '/groups/[groupId]/pick-team', icon: LayoutTemplate },
  { name: 'Scores', href: '/groups/[groupId]/scores', icon: PenLine },
  { name: 'Ranking', href: '/groups/[groupId]/leaderboard', icon: Trophy },
  { name: 'More', href: '/groups/[groupId]/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  
  // Extract groupId from current pathname
  const groupId = pathname.includes('/groups/') ? pathname.split('/')[2] : '';

  // Get user display name
  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || 'Player';
  const userImage = session?.user?.image;

  // Handle sign out
  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="min-h-screen bg-[#0d0e11]">
      {/* Mobile Header - only visible when not on groups list */}
      {groupId && (
        <header className="md:hidden fixed top-0 w-full z-50 bg-[#111317]/90 backdrop-blur-xl border-b border-white/5">
          <div className="flex justify-between items-center px-4 h-14">
            <button onClick={() => window.history.back()} className="text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <img src="/logo.svg" alt="HGZA" className="h-6 w-auto" />
            <button className="text-white">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-[#111317] border-r border-white/5 flex-col z-40">
        <div className="flex items-center gap-3 p-6 border-b border-white/5">
          {userImage ? (
            <img src={userImage} alt={userName} className="w-10 h-10 rounded-full border border-white/10 object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-label font-bold text-white text-sm truncate max-w-[140px]">{userName}</p>
            <p className="font-label text-xs text-white/50">HGZA Player</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.includes(item.href.replace('[groupId]', groupId));
            return (
              <Link
                key={item.name}
                href={groupId ? item.href.replace('[groupId]', groupId) : '#'}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-label text-sm font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link
            href="/groups"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <Users className="w-5 h-5" />
            <span className="font-label text-sm font-semibold">All Groups</span>
          </Link>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full mt-2 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-label text-sm font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:pl-64 pb-20 md:pb-0">
        <div className={`${groupId ? 'pt-14 md:pt-0' : ''} min-h-screen`}>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-[#1e2024]/95 backdrop-blur-lg border-t border-white/5 z-50">
        <div className="flex justify-around items-center px-2 pb-6 pt-3">
          {navigation.map((item) => {
            const isActive = groupId ? pathname.includes(item.href.replace('[groupId]', groupId)) : false;
            const href = groupId ? item.href.replace('[groupId]', groupId) : '#';
            
            return (
              <Link
                key={item.name}
                href={href}
                className={`flex flex-col items-center justify-center transition-all duration-200 relative ${
                  isActive 
                    ? 'text-secondary bg-primary/10 -translate-y-1 px-3 py-1 rounded-xl' 
                    : 'text-slate-500 hover:text-primary'
                }`}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="font-label text-[10px] font-semibold uppercase tracking-widest">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}