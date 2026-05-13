'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  BookOpen, 
  PlayCircle, 
  CheckCircle2, 
  Clock, 
  Loader2,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPurchases = async () => {
    try {
      const res = await fetch('/api/purchases');
      const data = await res.json();
      setCourses(data.purchases || []);
    } catch (err) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const filteredCourses = courses.filter(p => 
    p.course.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-[#64856D]" size={48} />
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-xl">
          <h1 className="text-4xl font-black text-[#0F172A] mb-4">My Learning Library</h1>
          <p className="text-[#64748B] text-lg font-medium">Continue your journey where you left off. All your purchased courses in one place.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A5BFAB]" size={18} />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-[#E2EBE2] rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#64856D]/20 outline-none transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-[#E2EBE2] rounded-2xl font-bold text-[#64856D] hover:bg-[#F4F7F4] transition-all shadow-sm">
            <Filter size={18} />
            Categories
          </button>
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCourses.map((purchase, i) => (
            <motion.div 
              key={purchase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-[2.5rem] border border-[#E2EBE2] overflow-hidden hover:shadow-2xl hover:shadow-[#64856D]/10 transition-all flex flex-col h-full"
            >
              <div className="relative aspect-[16/10] overflow-hidden shrink-0">
                <img 
                  src={purchase.course.thumbnail || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0'} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt="" 
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Link 
                    href={purchase.status === 'VERIFIED' ? `/learn/${purchase.course.slug}` : '#'}
                    className={`p-4 rounded-full bg-white text-[#64856D] shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-300 ${purchase.status !== 'VERIFIED' && 'cursor-not-allowed grayscale'}`}
                  >
                    <PlayCircle size={32} />
                  </Link>
                </div>
                <div className="absolute top-6 left-6">
                  <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    purchase.status === 'VERIFIED' ? 'bg-[#F4F7F4] text-[#64856D]' : 'bg-[#FFF7ED] text-[#FB923C]'
                  }`}>
                    {purchase.status === 'VERIFIED' ? 'Unlocked' : 'Pending'}
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-black text-[#0F172A] mb-4 line-clamp-1 group-hover:text-[#64856D] transition-colors">{purchase.course.title}</h3>
                
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-8 h-8 rounded-full bg-[#F2E8DF] flex items-center justify-center text-[10px] font-bold text-[#64856D]">
                     {purchase.course.instructor?.charAt(0) || 'I'}
                   </div>
                   <p className="text-xs font-bold text-[#64748B]">by {purchase.course.instructor || 'Academy Expert'}</p>
                </div>

                <div className="mt-auto space-y-4">
                  <div className="flex justify-between items-end">
                     <div className="flex items-center gap-2 text-[#64856D]">
                        <BookOpen size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">12 Lessons</span>
                     </div>
                     <span className="text-xs font-black text-[#64856D]">0% Done</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#F4F7F4] rounded-full overflow-hidden">
                    <div className="h-full bg-[#64856D] w-0 rounded-full" />
                  </div>
                  
                  <Link 
                    href={purchase.status === 'VERIFIED' ? `/learn/${purchase.course.slug}` : '#'}
                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                      purchase.status === 'VERIFIED' 
                      ? 'bg-[#64856D] text-white hover:bg-[#4E6955] shadow-lg shadow-[#64856D]/20' 
                      : 'bg-[#F9F5ED] text-[#D8B69B] cursor-not-allowed'
                    }`}
                  >
                    {purchase.status === 'VERIFIED' ? (
                      <>Start Learning <ArrowRight size={16} /></>
                    ) : (
                      <>Waiting for Verification <Clock size={16} /></>
                    )}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-white rounded-[4rem] border border-dashed border-[#E2EBE2]">
          <div className="w-24 h-24 bg-[#F4F7F4] rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="text-[#64856D]" size={40} />
          </div>
          <h3 className="text-2xl font-black text-[#0F172A] mb-4">No courses yet</h3>
          <p className="text-[#64748B] font-medium max-w-sm mx-auto mb-10">Start your mastery journey by exploring our elite Web3 curriculum.</p>
          <Link href="/courses" className="btn-primary bg-[#64856D] hover:bg-[#4E6955] px-10 py-4 shadow-xl shadow-[#64856D]/20">
            Browse Catalog
          </Link>
        </div>
      )}
    </div>
  );
}
