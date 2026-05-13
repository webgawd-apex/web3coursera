'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  History, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy
} from 'lucide-react';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: GraduationCap, label: 'My Courses', href: '/dashboard/courses' },
  { icon: BookOpen, label: 'Continue Learning', href: '/dashboard/learn' },
  { icon: History, label: 'Transactions', href: '/dashboard/transactions' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success('Signed out');
    window.location.href = '/login';
  };

  return (
    <aside 
      className={`bg-white border-r border-[#E2EBE2] h-screen sticky top-0 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="p-8 flex items-center justify-between">
        <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'} transition-all`}>
          <div className="w-10 h-10 rounded-2xl bg-[#64856D] flex items-center justify-center shrink-0 shadow-lg shadow-[#64856D]/20">
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-[#0F172A] tracking-tight leading-none">STUDENT</span>
            <span className="text-[10px] font-bold text-[#64856D] tracking-widest uppercase">Portal</span>
          </div>
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-[#F4F7F4] rounded-xl text-[#64856D] transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                isActive 
                ? 'bg-[#F4F7F4] text-[#64856D]' 
                : 'text-[#64748B] hover:text-[#64856D] hover:bg-[#F4F7F4]/50'
              }`}
            >
              <item.icon size={22} className={isActive ? 'text-[#64856D]' : 'group-hover:text-[#64856D] transition-colors'} />
              {!isCollapsed && (
                <span className={`font-semibold text-sm ${isActive ? 'text-[#0F172A]' : ''}`}>
                  {item.label}
                </span>
              )}
              {isActive && (
                <div className="absolute left-0 w-1.5 h-6 bg-[#64856D] rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Motivational Card */}
      {!isCollapsed && (
        <div className="mx-6 mb-6 p-6 rounded-3xl bg-[#F2E8DF] relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-all" />
          <Trophy size={32} className="text-[#82A38A] mb-4" />
          <h4 className="text-sm font-black text-[#4E6955] mb-2 uppercase tracking-wide">Daily Streak</h4>
          <p className="text-xs text-[#64856D] font-medium leading-relaxed">
            You're on a 5-day learning streak. Keep it up!
          </p>
        </div>
      )}

      {/* Footer / User */}
      <div className="p-6 border-t border-[#E2EBE2]">
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[#64748B] hover:text-red-500 hover:bg-red-50 transition-all group`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-semibold text-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
