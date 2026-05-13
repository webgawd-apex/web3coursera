'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Play, CheckCircle, ChevronRight, Menu, X, ArrowLeft, Loader2, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LearnPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${slug}`);
        const data = await res.json();
        
        // Verify purchase
        const purchaseRes = await fetch('/api/purchases');
        const purchaseData = await purchaseRes.json();
        const isPurchased = purchaseData.purchases?.some(
          (p: any) => p.courseId === data.course.id && p.status === 'VERIFIED'
        );

        if (!isPurchased) {
          toast.error('You do not have access to this course');
          router.push(`/courses/${slug}`);
          return;
        }

        setCourse(data.course);
        if (data.course.lessons?.length > 0) {
          setCurrentLesson(data.course.lessons[0]);
        }
      } catch (err) {
        console.error('Failed to fetch course:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={48} />
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-navy-950 pt-20">
      {/* Course Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? '350px' : '0px', opacity: isSidebarOpen ? 1 : 0 }}
        className="glass border-r border-white/5 overflow-hidden flex-shrink-0 relative z-20"
      >
        <div className="p-6 w-[350px]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-black text-xl gradient-text">Curriculum</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-muted">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-2">
            {course?.lessons?.map((lesson: any, i: number) => (
              <button
                key={lesson.id}
                onClick={() => setCurrentLesson(lesson)}
                className={`w-full p-4 rounded-2xl text-left transition-all flex items-start gap-3 ${
                  currentLesson?.id === lesson.id 
                    ? 'bg-blue-500/20 border border-blue-500/30' 
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className={`mt-1 shrink-0 ${currentLesson?.id === lesson.id ? 'text-blue-400' : 'text-muted'}`}>
                  {currentLesson?.id === lesson.id ? <Play size={14} className="fill-current" /> : <div className="w-3.5 h-3.5 rounded-full border border-current" />}
                </div>
                <div>
                  <p className={`text-sm font-bold ${currentLesson?.id === lesson.id ? 'text-white' : 'text-secondary'}`}>
                    {i + 1}. {lesson.title}
                  </p>
                  <p className="text-[10px] text-muted mt-1 uppercase tracking-wider">15 minutes</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.aside>

      {/* Main Player Area */}
      <main className="flex-1 flex flex-col min-h-[calc(100vh-80px)]">
        <div className="p-4 flex items-center gap-4 bg-navy-900/50 lg:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 glass rounded-xl">
            <Menu size={20} />
          </button>
          <span className="font-bold truncate">{course?.title}</span>
        </div>

        <div className="flex-1 p-6 lg:p-12">
          <div className="max-w-5xl mx-auto">
            {/* Video Player Placeholder */}
            <div className="aspect-video rounded-[2.5rem] overflow-hidden glass border-white/10 glow-blue mb-8 relative group">
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-900/60 backdrop-blur-sm">
                  <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center mb-6 shadow-2xl">
                    <Play className="fill-white text-white ml-1" size={32} />
                  </div>
                  <p className="text-secondary font-medium">Video content from {currentLesson?.videoUrl.split('/')[2] || 'Provider'}</p>
               </div>
               {/* Real player would go here */}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="badge badge-blue">Now Playing</span>
                  <span className="text-muted text-sm tracking-widest uppercase">Module {course?.lessons?.indexOf(currentLesson) + 1}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black mb-4">{currentLesson?.title}</h1>
                <p className="text-secondary leading-relaxed">
                  {currentLesson?.description || 'In this lesson, we dive deep into the technical implementation of the concepts discussed in the previous module.'}
                </p>
              </div>
              
              <div className="flex gap-4 shrink-0">
                <button className="btn-outline px-6 py-3">Previous</button>
                <button className="btn-primary px-8 py-3">Next Lesson</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="md:col-span-2 glass p-8 rounded-3xl border-white/5">
                  <h3 className="text-xl font-bold mb-6">Resources & Links</h3>
                  <div className="space-y-4">
                    {['Exercise Files.zip', 'Documentation.pdf', 'Source Code Repository'].map((res, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-navy-800 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors cursor-pointer group">
                        <span className="text-secondary group-hover:text-white">{res}</span>
                        <ChevronRight size={18} className="text-muted" />
                      </div>
                    ))}
                  </div>
               </div>
               
               <div className="glass p-8 rounded-3xl border-white/5 flex flex-col items-center justify-center text-center">
                  <Award className="text-peach-400 mb-4" size={48} />
                  <h4 className="font-bold mb-2">Certification</h4>
                  <p className="text-xs text-secondary mb-6">Complete all lessons to unlock your on-chain certificate.</p>
                  <div className="w-full bg-navy-800 h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-peach-500 h-full" style={{ width: '10%' }}></div>
                  </div>
                  <span className="text-[10px] text-muted uppercase font-bold">10% Complete</span>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
