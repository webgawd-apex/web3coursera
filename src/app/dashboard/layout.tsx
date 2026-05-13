'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  History, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Bell,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const sidebarLinks = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Courses', href: '/dashboard/courses', icon: BookOpen },
  { name: 'Transactions', href: '/dashboard/transactions', icon: History },
  { name: 'Profile', href: '/dashboard/settings', icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#FCF9F1] flex font-outfit text-[#3A4D39]">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-[#3A4D39]/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-white border-r border-[#E6D5B0]/50 z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-10 h-10 bg-[#8BA88E] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#8BA88E]/20">
              <GraduationCap size={24} />
            </div>
            <span className="text-xl font-black tracking-tight text-[#3A4D39]">STUDENT HUB</span>
          </div>

          <nav className="flex-1 space-y-2">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300
                    ${isActive 
                      ? 'bg-[#8BA88E] text-white shadow-xl shadow-[#8BA88E]/20' 
                      : 'text-[#3A4D39]/60 hover:bg-[#F4F7F4] hover:text-[#8BA88E]'}
                  `}
                >
                  <link.icon size={20} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-4 pt-6 border-t border-[#E6D5B0]/30">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3.5 w-full text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-[#E6D5B0]/30 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-[#3A4D39]/60 hover:bg-[#F4F7F4] rounded-xl"
          >
            <Menu size={24} />
          </button>

          <div className="hidden md:flex items-center bg-[#F4F7F4] border border-[#E6D5B0]/50 rounded-2xl px-4 py-2 w-96 group focus-within:border-[#8BA88E] transition-all">
            <Search className="text-[#3A4D39]/40 group-focus-within:text-[#8BA88E]" size={18} />
            <input 
              type="text" 
              placeholder="Search your courses..." 
              className="bg-transparent border-none outline-none px-3 w-full text-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2.5 bg-white border border-[#E6D5B0]/50 rounded-xl text-[#3A4D39]/60 hover:text-[#8BA88E] transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#8BA88E] rounded-full border-2 border-white" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-[#F2E8CF] flex items-center justify-center font-black text-[#8BA88E] border border-[#E6D5B0]">
              JD
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 sm:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
