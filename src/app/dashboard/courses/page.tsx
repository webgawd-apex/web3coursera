'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  Play,
  Layers,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MyCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user's purchased courses
    const fetchMyCourses = async () => {
      try {
        const res = await fetch('/api/student/courses');
        const data = await res.json();
        setCourses(data.courses || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
      {[1,2,3].map(i => <div key={i} className="h-80 bg-white border border-[#E6D5B0]/30 rounded-[2.5rem]" />)}
    </div>;
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#3A4D39]">My Learning</h1>
          <p className="text-[#3A4D39]/50 font-medium">Manage and continue your purchased courses.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A4D39]/30" size={18} />
            <input 
              type="text" 
              placeholder="Search your library..." 
              className="pl-12 pr-4 py-3 bg-white border border-[#E6D5B0]/50 rounded-2xl outline-none focus:border-[#8BA88E] w-full sm:w-64 transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-[#E6D5B0]/50 rounded-2xl font-bold text-[#3A4D39]/60 hover:text-[#8BA88E] transition-all">
            <Filter size={18} />
            All Categories
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, i) => (
          <motion.div 
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white border border-[#E6D5B0]/30 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#8BA88E]/30 transition-all duration-500 flex flex-col"
          >
            {/* Thumbnail */}
            <div className="aspect-video relative overflow-hidden bg-[#F4F7F4]">
              {course.thumbnail ? (
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#8BA88E]/20">
                  <BookOpen size={64} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-[#8BA88E] uppercase tracking-wider">
                {course.level}
              </div>
            </div>

            {/* Content */}
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-black text-[#8BA88E] uppercase tracking-widest bg-[#F4F7F4] px-2 py-1 rounded-md">
                  {course.category || 'Blockchain'}
                </span>
                <span className="text-[10px] font-black text-[#3A4D39]/40 uppercase tracking-widest flex items-center gap-1">
                  <Layers size={12} /> {course.lessons?.length || 0} Lessons
                </span>
              </div>
              
              <h3 className="text-xl font-black text-[#3A4D39] mb-2 leading-tight group-hover:text-[#8BA88E] transition-colors line-clamp-2">
                {course.title}
              </h3>
              
              <p className="text-sm text-[#3A4D39]/50 font-medium mb-6 line-clamp-2">
                By {course.instructor}
              </p>

              <div className="mt-auto pt-6 border-t border-[#E6D5B0]/30 flex items-center justify-between">
                <Link 
                  href={`/learn/${course.slug}`}
                  className="flex items-center gap-2 px-6 py-3 bg-[#8BA88E] text-white rounded-2xl font-bold hover:bg-[#6B8E6E] transition-all shadow-lg shadow-[#8BA88E]/20 text-sm"
                >
                  <Play size={16} fill="currentColor" />
                  Continue Learning
                </Link>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-black text-[#3A4D39]/40 uppercase">Progress</span>
                   <span className="text-sm font-black text-[#3A4D39]">0%</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="py-20 text-center bg-white border border-[#E6D5B0]/30 rounded-[3rem]">
          <div className="w-20 h-20 bg-[#F4F7F4] rounded-full flex items-center justify-center mx-auto mb-6 text-[#8BA88E]">
            <BookOpen size={40} />
          </div>
          <h3 className="text-2xl font-black text-[#3A4D39] mb-2">Your library is empty</h3>
          <p className="text-[#3A4D39]/50 font-medium mb-8 max-w-md mx-auto">
            You haven't purchased any courses yet. Explore our catalog to start your learning journey.
          </p>
          <Link 
            href="/courses"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#8BA88E] text-white rounded-2xl font-bold hover:bg-[#6B8E6E] transition-all shadow-lg shadow-[#8BA88E]/20"
          >
            Browse Courses
            <ChevronRight size={20} />
          </Link>
        </div>
      )}
    </div>
  );
}
