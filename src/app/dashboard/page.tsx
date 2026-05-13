'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  PlayCircle, 
  Clock3, 
  GraduationCap, 
  Trophy, 
  ArrowRight,
  BookOpen,
  Sparkles,
  TrendingUp,
  Search,
  Loader2
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function StudentOverview() {
  const [loading, setLoading] = useState(true);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading || isPending) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-[#64856D]" size={48} />
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Welcome Hero */}
      <section className="relative overflow-hidden p-12 rounded-[3rem] bg-gradient-to-br from-[#64856D] to-[#4E6955] text-white shadow-2xl shadow-[#64856D]/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -ml-10 -mb-10" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-widest mb-6"
            >
              <Sparkles size={14} /> New Content Available
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Happy Learning, <span className="text-[#C9D9CA]">{user?.name?.split(' ')[0] || 'Student'}</span>!
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              You've completed <span className="font-bold text-white">65%</span> of your weekly goal. 
              Only 2 more lessons to reach your milestone.
            </p>
            <Link href="/dashboard/learn" className="inline-flex items-center gap-3 bg-white text-[#4E6955] px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-black/10">
              Continue Learning
              <ArrowRight size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4 shrink-0">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/10">
              <Trophy size={32} className="text-[#C9D9CA] mb-3" />
              <p className="text-2xl font-black leading-none mb-1">12</p>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Completed</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/10">
              <TrendingUp size={32} className="text-[#C9D9CA] mb-3" />
              <p className="text-2xl font-black leading-none mb-1">85%</p>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Avg. Score</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Enrolled', value: '4', sub: 'Active Courses', icon: BookOpen, color: 'sage' },
          { label: 'Lessons Done', value: '28', sub: 'Past 30 days', icon: GraduationCap, color: 'beige' },
          { label: 'Learning Streak', value: '5', sub: 'Day streak', icon: Sparkles, color: 'orange' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-[#E2EBE2] hover:shadow-xl hover:shadow-[#64856D]/5 transition-all flex items-center gap-6 group">
             <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 ${
               stat.color === 'sage' ? 'bg-[#F4F7F4] text-[#64856D]' : 
               stat.color === 'beige' ? 'bg-[#F9F5ED] text-[#D8B69B]' : 
               'bg-[#FFF7ED] text-[#FB923C]'
             }`}>
               <stat.icon size={28} />
             </div>
             <div>
               <p className="text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-1">{stat.label}</p>
               <h3 className="text-3xl font-black text-[#0F172A]">{stat.value}</h3>
               <p className="text-xs text-[#64856D] font-medium mt-1">{stat.sub}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Course Progress Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-[#0F172A]">My Recent Courses</h3>
          <Link href="/dashboard/courses" className="text-sm font-bold text-[#64856D] hover:text-[#4E6955] transition-colors flex items-center gap-2">
            View All Courses <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: 'Solana Smart Contracts', progress: 75, lastLesson: 'Introduction to Anchor', img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0' },
            { title: 'Advanced DeFi Strategies', progress: 30, lastLesson: 'Yield Farming Basics', img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee' },
          ].map((course, i) => (
            <div key={i} className="group bg-white rounded-[2.5rem] border border-[#E2EBE2] p-6 hover:shadow-2xl hover:shadow-[#64856D]/5 transition-all">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-40 h-32 rounded-3xl overflow-hidden shrink-0 relative">
                  <img src={course.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[#64856D]">
                      <PlayCircle size={24} />
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h4 className="text-lg font-black text-[#0F172A] mb-2">{course.title}</h4>
                    <p className="text-xs text-[#64748B] font-medium flex items-center gap-1.5 mb-4">
                      <Clock3 size={12} /> Next: {course.lastLesson}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black text-[#64856D] uppercase tracking-widest">{course.progress}% Complete</span>
                    </div>
                    <div className="h-2 w-full bg-[#F4F7F4] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-[#64856D] rounded-full" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
