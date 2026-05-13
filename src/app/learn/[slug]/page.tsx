'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  PlayCircle, 
  CheckCircle2, 
  Download, 
  MessageSquare, 
  Menu,
  X,
  Loader2,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function LearningInterface() {
  const { slug } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${slug}`);
        const data = await res.json();
        setCourse(data.course);
      } catch (err) {
        toast.error('Failed to load course');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#FDFCF9]">
      <Loader2 className="animate-spin text-[#64856D]" size={48} />
    </div>
  );

  if (!course) return <div>Course not found</div>;

  const lessons = course.lessons || [];
  const currentLesson = lessons[currentLessonIdx];

  return (
    <div className="flex h-screen bg-[#FDFCF9] overflow-hidden">
      {/* Sidebar Navigation */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside 
            initial={{ x: -350 }}
            animate={{ x: 0 }}
            exit={{ x: -350 }}
            className="w-80 md:w-96 bg-white border-r border-[#E2EBE2] flex flex-col z-50 fixed inset-y-0 lg:relative"
          >
            <div className="p-8 border-b border-[#E2EBE2]">
              <button 
                onClick={() => router.push('/dashboard/courses')}
                className="flex items-center gap-2 text-[#64856D] hover:text-[#4E6955] text-xs font-black uppercase tracking-widest mb-6 transition-all group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Courses
              </button>
              <h2 className="text-xl font-black text-[#0F172A] mb-2">{course.title}</h2>
              <div className="flex items-center gap-4">
                 <div className="flex-1 h-1.5 bg-[#F4F7F4] rounded-full overflow-hidden">
                   <div className="h-full bg-[#64856D] w-[30%] rounded-full" />
                 </div>
                 <span className="text-[10px] font-black text-[#64856D]">30%</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {lessons.map((lesson: any, i: number) => (
                <button
                  key={lesson.id}
                  onClick={() => setCurrentLessonIdx(i)}
                  className={`w-full flex items-start gap-4 p-4 rounded-[1.5rem] text-left transition-all group ${
                    currentLessonIdx === i 
                    ? 'bg-[#F4F7F4] border border-[#64856D]/10' 
                    : 'hover:bg-[#FDFCF9]'
                  }`}
                >
                  <div className={`mt-0.5 shrink-0 ${currentLessonIdx === i ? 'text-[#64856D]' : 'text-[#A5BFAB]'}`}>
                    {i < 3 ? <CheckCircle2 size={20} className="text-[#64856D]" /> : <PlayCircle size={20} />}
                  </div>
                  <div>
                    <p className={`text-xs font-black uppercase tracking-widest mb-1 ${currentLessonIdx === i ? 'text-[#64856D]' : 'text-[#64748B]'}`}>
                      Lesson {i + 1}
                    </p>
                    <h4 className={`text-sm font-bold leading-tight ${currentLessonIdx === i ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>
                      {lesson.title}
                    </h4>
                    <p className="text-[10px] text-[#A5BFAB] mt-2 font-bold uppercase tracking-widest">{lesson.duration || '12'} MIN</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Learning Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Toggle Sidebar Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-6 left-6 z-40 p-3 bg-white border border-[#E2EBE2] rounded-2xl text-[#64856D] shadow-xl hover:scale-105 transition-all lg:flex items-center gap-2 hidden"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Header (Mobile) */}
        <div className="lg:hidden p-6 border-b border-[#E2EBE2] flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-40">
           <button onClick={() => setSidebarOpen(true)} className="p-3 bg-[#F4F7F4] rounded-2xl text-[#64856D]">
             <Menu size={20} />
           </button>
           <h2 className="text-sm font-black text-[#0F172A] truncate px-4">{currentLesson?.title}</h2>
           <div className="w-10" />
        </div>

        <div className="flex-1 overflow-y-auto pb-20">
          {/* Video Container */}
          <div className="bg-black w-full aspect-video relative group">
            {currentLesson?.videoUrl ? (
              <iframe 
                src={currentLesson.videoUrl} 
                className="w-full h-full"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white space-y-4">
                <PlayCircle size={64} className="text-[#C9D9CA] opacity-50" />
                <p className="text-sm font-bold uppercase tracking-widest opacity-50">Preparing your lesson...</p>
              </div>
            )}
          </div>

          {/* Lesson Content Area */}
          <div className="max-w-4xl mx-auto p-8 md:p-12 space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4F7F4] text-[#64856D] text-[10px] font-black uppercase tracking-widest mb-4"
                >
                  <Sparkles size={14} /> Lesson in Progress
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-4">{currentLesson?.title}</h1>
                <p className="text-[#64748B] text-lg font-medium leading-relaxed max-w-2xl">
                  {currentLesson?.description || 'In this lesson, we will explore the core concepts and practical applications of this module.'}
                </p>
              </div>
              
              <div className="flex gap-4">
                 <button className="flex items-center gap-2 px-6 py-3 bg-white border border-[#E2EBE2] rounded-2xl font-bold text-[#64856D] hover:bg-[#F4F7F4] transition-all shadow-sm">
                   <Download size={18} />
                   Resources
                 </button>
              </div>
            </div>

            <div className="h-px bg-[#E2EBE2] w-full" />

            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <button 
                disabled={currentLessonIdx === 0}
                onClick={() => setCurrentLessonIdx(idx => idx - 1)}
                className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm text-[#64856D] border border-[#E2EBE2] disabled:opacity-30 hover:bg-[#F4F7F4] transition-all"
              >
                <ChevronLeft size={20} />
                Previous Lesson
              </button>
              
              <button 
                onClick={() => toast.success('Lesson marked as completed!')}
                className="w-full md:w-auto flex items-center justify-center gap-3 px-12 py-4 bg-[#64856D] text-white rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-[#64856D]/20"
              >
                <CheckCircle2 size={20} />
                Mark as Completed
              </button>

              <button 
                disabled={currentLessonIdx === lessons.length - 1}
                onClick={() => setCurrentLessonIdx(idx => idx + 1)}
                className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm text-[#64856D] border border-[#E2EBE2] disabled:opacity-30 hover:bg-[#F4F7F4] transition-all"
              >
                Next Lesson
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="h-16 bg-white border-t border-[#E2EBE2] px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-xs font-bold text-[#64856D]">
               <MessageSquare size={16} />
               Discussion
             </div>
             <div className="w-px h-6 bg-[#E2EBE2]" />
             <div className="flex items-center gap-2 text-xs font-bold text-[#64856D]">
               <GraduationCap size={16} />
               Module Summary
             </div>
          </div>
          <p className="text-[10px] font-black text-[#A5BFAB] uppercase tracking-widest hidden sm:block">
            WEB3 COURSERA • PREMIUM LEARNING EXPERIENCE
          </p>
        </div>
      </main>
    </div>
  );
}
