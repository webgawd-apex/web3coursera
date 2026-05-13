'use client';

import { useState, useEffect } from 'react';
import { 
  PlayCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Flame, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    enrolled: 4,
    completed: 12,
    hours: 28,
    streak: 5
  });

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Welcome Section */}
      <section className="relative overflow-hidden bg-white border border-[#E6D5B0]/50 rounded-[2.5rem] p-8 sm:p-12 shadow-sm">
        <div className="relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#8BA88E] font-black uppercase tracking-[0.2em] text-xs mb-4 block"
          >
            Welcome back, Learner
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-[#3A4D39] mb-6 leading-tight"
          >
            Ready to master <br/> the <span className="text-[#8BA88E]">Decentralized Web?</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            <button className="px-8 py-4 bg-[#8BA88E] text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-[#6B8E6E] transition-all shadow-lg shadow-[#8BA88E]/20">
              Continue Learning
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>

        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4F7F4] rounded-full blur-[80px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#F2E8CF] rounded-full blur-[40px] mr-12 mb-12 opacity-50" />
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Enrolled Courses', value: stats.enrolled, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Completed Lessons', value: stats.completed, icon: CheckCircle2, color: 'text-[#8BA88E]', bg: 'bg-[#F4F7F4]' },
          { label: 'Hours Learned', value: stats.hours, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Current Streak', value: `${stats.streak} Days`, icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((item, i) => (
          <motion.div 
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-[#E6D5B0]/30 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center ${item.color} mb-4 group-hover:scale-110 transition-transform`}>
              <item.icon size={24} />
            </div>
            <p className="text-sm font-bold text-[#3A4D39]/60 mb-1">{item.label}</p>
            <p className="text-2xl font-black text-[#3A4D39]">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Learning List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-[#3A4D39]">In Progress</h2>
            <button className="text-sm font-bold text-[#8BA88E] hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            {[
              { title: 'Solana Smart Contracts', progress: 65, instructor: 'Prof. Alex', lessons: '8/12' },
              { title: 'Web3 Frontend Architecture', progress: 30, instructor: 'Sarah Chen', lessons: '4/15' },
            ].map((course) => (
              <div key={course.title} className="bg-white border border-[#E6D5B0]/30 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 group hover:border-[#8BA88E]/50 transition-all">
                <div className="w-20 h-20 bg-[#F4F7F4] rounded-2xl flex items-center justify-center text-[#8BA88E] font-black shrink-0">
                  <PlayCircle size={32} />
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-black text-lg text-[#3A4D39] truncate">{course.title}</h3>
                      <p className="text-sm text-[#3A4D39]/50 font-medium">{course.instructor}</p>
                    </div>
                    <span className="text-xs font-black text-[#8BA88E] bg-[#F4F7F4] px-2.5 py-1 rounded-lg">
                      {course.lessons}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#F4F7F4] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      className="h-full bg-[#8BA88E]"
                    />
                  </div>
                </div>
                <button className="w-full sm:w-auto px-6 py-3 bg-[#F4F7F4] text-[#8BA88E] font-bold rounded-2xl hover:bg-[#8BA88E] hover:text-white transition-all whitespace-nowrap">
                  Resume
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Motivational Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#8BA88E] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-[#8BA88E]/20">
            <div className="relative z-10">
              <TrendingUp className="mb-4 opacity-50" size={32} />
              <h3 className="text-xl font-black mb-2">Learning Streak</h3>
              <p className="text-sm text-white/80 font-medium mb-6">You've learned for 5 days straight! Keep it up to reach your goal.</p>
              <div className="flex gap-2">
                {[1,2,3,4,5,6,7].map((d) => (
                  <div key={d} className={`flex-1 h-1.5 rounded-full ${d <= 5 ? 'bg-white' : 'bg-white/20'}`} />
                ))}
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </div>

          <div className="bg-white border border-[#E6D5B0]/30 rounded-[2rem] p-6">
            <h3 className="font-black text-[#3A4D39] mb-4">Latest Achievement</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-[#3A4D39]">Quick Starter</p>
                <p className="text-xs text-[#3A4D39]/50 font-medium">Complete 5 lessons in one day</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
