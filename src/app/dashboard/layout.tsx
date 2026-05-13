'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { Search, Bell, User } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  
  // Don't show layout on specific subpages if needed
  if (pathname.startsWith('/dashboard/learn/')) {
     return <>{children}</>; // Immersive mode for learning
  }

  return (
    <div className="flex min-h-screen bg-[#FDFCF9]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Modern Minimal Header */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-[#E2EBE2] flex items-center justify-between px-10 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-8 flex-1">
            <h2 className="text-xl font-black text-[#0F172A] capitalize">
              {pathname === '/dashboard' ? 'Overview' : pathname.split('/').pop()?.replace('-', ' ')}
            </h2>
            
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A5BFAB]" size={18} />
              <input 
                type="text" 
                placeholder="Search courses, lessons..." 
                className="w-full bg-[#F4F7F4] border-none rounded-2xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[#64856D]/20 transition-all outline-none text-[#0F172A]"
              />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button className="p-2.5 text-[#A5BFAB] hover:text-[#64856D] hover:bg-[#F4F7F4] rounded-2xl transition-all relative">
              <Bell size={22} />
              <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#FB923C] rounded-full border-2 border-white" />
            </button>
            
            <div className="h-8 w-px bg-[#E2EBE2]" />
            
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-[#0F172A]">{user?.name || 'Student'}</p>
                <p className="text-[10px] text-[#64856D] font-bold uppercase tracking-wider">Free Member</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-[#F2E8DF] border border-[#E8D5C4] p-0.5 group-hover:scale-105 transition-transform">
                {user?.image ? (
                  <img src={user.image} className="w-full h-full rounded-[14px] object-cover" alt="" />
                ) : (
                  <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center text-[#64856D]">
                    <User size={20} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-10 scroll-smooth">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
