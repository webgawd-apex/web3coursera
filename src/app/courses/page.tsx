'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, Clock, Star, PlayCircle, Loader2 } from 'lucide-react';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Fetch courses from API
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        setCourses(data.courses || []);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-black mb-4">Elite <span className="gradient-text">Curriculum</span></h1>
            <p className="text-secondary text-lg max-w-xl">Master Web3 with our curated selection of premium blockchain courses.</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="input pl-12 py-4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
            <p className="text-secondary">Loading courses...</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, i) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card group"
              >
                <Link href={`/courses/${course.slug}`}>
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={course.thumbnail || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800'} 
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <PlayCircle className="text-white" size={32} />
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="badge badge-blue">{course.level}</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-current" />)}
                      </div>
                      <span className="text-xs text-muted">(4.9/5)</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                    
                    <div className="flex items-center gap-4 text-sm text-muted mb-6">
                      <span className="flex items-center gap-1"><BookOpen size={14} /> {course._count?.lessons || 0} Lessons</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> 12h 45m</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="text-2xl font-bold text-white">{course.priceSOL} SOL</div>
                      <button className="text-peach-400 font-bold flex items-center gap-1 group/btn">
                        Enroll <BookOpen size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-3xl">
            <h3 className="text-2xl font-bold mb-2">No courses found</h3>
            <p className="text-secondary">Try searching for something else or browse all courses.</p>
          </div>
        )}
      </div>
    </div>
  );
}
