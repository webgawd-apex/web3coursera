'use client';

import { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X, 
  Download, 
  MessageSquare,
  ArrowLeft,
  Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function StudyMode() {
  const { slug } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const res = await fetch(`/api/student/courses/${slug}`);
        if (!res.ok) {
           toast.error('You do not have access to this course');
           router.push('/dashboard/courses');
           return;
        }
        const data = await res.json();
        setCourse(data.course);
        setCompletedLessons(data.completedLessons || []);
        if (data.course.lessons?.length > 0) {
          setCurrentLesson(data.course.lessons[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [slug]);

  const toggleLessonCompletion = async (lessonId: string) => {
    try {
      const isCompleted = completedLessons.includes(lessonId);
      const res = await fetch(`/api/student/lessons/${lessonId}/progress`, {
        method: 'POST',
        body: JSON.stringify({ completed: !isCompleted })
      });
      if (res.ok) {
        setCompletedLessons(prev => 
          isCompleted ? prev.filter(id => id !== lessonId) : [...prev, lessonId]
        );
        toast.success(isCompleted ? 'Marked incomplete' : 'Lesson completed!');
      }
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  if (loading) {
    return <div className="h-screen bg-[#FCF9F1] flex items-center justify-center animate-pulse">
      <div className="w-16 h-16 bg-[#8BA88E] rounded-full" />
    </div>;
  }

  if (!course) return null;

  return (
    <div className="h-screen flex flex-col bg-white font-outfit text-[#3A4D39]">
      {/* Header */}
      <header className="h-16 border-b border-[#E6D5B0]/30 px-6 flex items-center justify-between shrink-0 bg-white z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/courses" className="p-2 hover:bg-[#F4F7F4] rounded-xl transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div className="h-6 w-[1px] bg-[#E6D5B0]/30 hidden sm:block" />
          <h1 className="font-black text-lg truncate max-w-[200px] sm:max-w-md">{course.title}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end mr-4">
            <span className="text-[10px] font-black text-[#8BA88E] uppercase tracking-widest">Progress</span>
            <div className="w-32 h-1.5 bg-[#F4F7F4] rounded-full mt-1 overflow-hidden">
               <div 
                 className="h-full bg-[#8BA88E] transition-all duration-500" 
                 style={{ width: `${(completedLessons.length / course.lessons.length) * 100}%` }}
               />
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2.5 bg-[#F4F7F4] text-[#8BA88E] rounded-xl lg:hidden"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Content (Video Player) */}
        <div className="flex-1 overflow-y-auto bg-[#FCF9F1] p-4 sm:p-8 lg:p-12">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Video Placeholder/Player */}
            <div className="aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl relative group">
              {currentLesson?.videoUrl ? (
                <iframe 
                  src={currentLesson.videoUrl} 
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                   <Play size={80} />
                </div>
              )}
            </div>

            {/* Lesson Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black text-[#3A4D39] mb-2">{currentLesson?.title}</h2>
                <p className="text-[#3A4D39]/60 font-medium">{currentLesson?.description || 'No description available for this lesson.'}</p>
              </div>
              <button 
                onClick={() => toggleLessonCompletion(currentLesson.id)}
                className={`
                  px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition-all shadow-xl
                  ${completedLessons.includes(currentLesson.id)
                    ? 'bg-[#8BA88E] text-white shadow-[#8BA88E]/20'
                    : 'bg-white text-[#3A4D39] border-2 border-[#E6D5B0]/50 shadow-sm hover:border-[#8BA88E]'}
                `}
              >
                <CheckCircle2 size={20} />
                {completedLessons.includes(currentLesson.id) ? 'Completed' : 'Mark as Completed'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-[#E6D5B0]/30">
               <div className="bg-white p-6 rounded-3xl border border-[#E6D5B0]/30 space-y-4">
                  <h4 className="font-black flex items-center gap-2"><Download size={18} /> Resources</h4>
                  <p className="text-sm text-[#3A4D39]/50 font-medium">Downloadable materials for this lesson will appear here.</p>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-[#E6D5B0]/30 space-y-4">
                  <h4 className="font-black flex items-center gap-2"><MessageSquare size={18} /> Discussion</h4>
                  <p className="text-sm text-[#3A4D39]/50 font-medium">Connect with other students in this course.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Lesson List) */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside 
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className="fixed inset-y-0 right-0 w-80 bg-white border-l border-[#E6D5B0]/30 z-40 lg:static lg:block shadow-2xl lg:shadow-none"
            >
              <div className="h-full flex flex-col pt-16 lg:pt-0">
                <div className="p-6 border-b border-[#E6D5B0]/30 bg-[#F4F7F4]/30">
                  <h3 className="font-black text-[#3A4D39]">Course Content</h3>
                  <p className="text-xs text-[#3A4D39]/50 font-black uppercase tracking-wider mt-1">
                    {completedLessons.length} / {course.lessons.length} COMPLETED
                  </p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {course.lessons.sort((a: any, b: any) => a.order - b.order).map((lesson: any, i: number) => {
                    const isCurrent = currentLesson?.id === lesson.id;
                    const isCompleted = completedLessons.includes(lesson.id);
                    return (
                      <button 
                        key={lesson.id}
                        onClick={() => setCurrentLesson(lesson)}
                        className={`
                          w-full flex items-start gap-3 p-4 rounded-2xl transition-all text-left
                          ${isCurrent ? 'bg-[#F4F7F4] text-[#8BA88E]' : 'hover:bg-[#F4F7F4]/50 text-[#3A4D39]'}
                        `}
                      >
                        <div className="shrink-0 mt-0.5">
                          {isCompleted ? (
                            <CheckCircle2 size={18} className="text-[#8BA88E]" />
                          ) : (
                            <Circle size={18} className="text-[#3A4D39]/20" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-black uppercase tracking-widest mb-0.5 ${isCurrent ? 'text-[#8BA88E]' : 'text-[#3A4D39]/40'}`}>
                            Lesson {i + 1}
                          </p>
                          <p className={`text-sm font-bold truncate ${isCurrent ? 'text-[#3A4D39]' : 'text-[#3A4D39]/70'}`}>
                            {lesson.title}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
