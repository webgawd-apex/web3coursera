'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Play, CheckCircle, ShieldCheck, Wallet, ArrowLeft, Loader2, PlayCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import CheckoutModal from '@/components/CheckoutModal';
import { authClient } from '@/lib/auth-client';

export default function CourseDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await fetch(`/api/courses/${slug}`);
        const courseData = await courseRes.json();
        setCourse(courseData.course);
      } catch (err) {
        console.error('Failed to fetch:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={48} />
    </div>
  );

  if (!course) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
      <button onClick={() => router.back()} className="btn-outline">Go Back</button>
    </div>
  );

  const handleEnrollClick = () => {
    if (!user) {
      toast.error('Please login to enroll');
      router.push('/login');
      return;
    }
    setIsCheckoutOpen(true);
  };

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="container">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-muted hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to courses
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-10">
              <span className="badge badge-peach mb-4">{course.category || 'Blockchain'}</span>
              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">{course.title}</h1>
              <p className="text-xl text-secondary leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="aspect-video rounded-[2rem] overflow-hidden glass border-white/10 relative mb-12 group">
               <img 
                 src={course.thumbnail || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200'} 
                 className="w-full h-full object-cover opacity-60"
                 alt="Preview"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                 <button className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center glow-blue hover:scale-110 transition-transform">
                   <Play className="fill-white text-white ml-1" size={32} />
                 </button>
               </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8">What you&apos;ll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  'Advanced Solana smart contract development',
                  'Building high-performance DeFi protocols',
                  'Professional Rust programming for Web3',
                  'On-chain security best practices',
                  'Integrating web3 wallets into dApps',
                  'Designing scalable tokenomics systems'
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <CheckCircle className="text-blue-400 shrink-0" size={24} />
                    <span className="text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8">Course Curriculum</h2>
              <div className="space-y-4">
                {course.lessons?.map((lesson: any, i: number) => (
                  <div key={lesson.id} className="glass p-6 rounded-2xl flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center text-blue-400 font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-bold">{lesson.title}</h4>
                        <p className="text-xs text-muted">Lesson {i + 1} • 15 min</p>
                      </div>
                    </div>
                    <PlayCircle className="text-muted group-hover:text-blue-400 transition-colors" size={24} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Pricing */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 glass p-8 rounded-[2.5rem] border-white/10 glow-blue">
              <div className="text-center mb-8">
                <p className="text-secondary mb-2">Lifetime Access</p>
                <div className="text-5xl font-black gradient-text mb-4">{course.priceSOL} SOL</div>
                <div className="badge badge-green">Limited Time Offer</div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-secondary text-sm">
                  <ShieldCheck className="text-blue-400" size={18} />
                  Verified on-chain via Solana
                </div>
                <div className="flex items-center gap-3 text-secondary text-sm">
                  <CheckCircle className="text-blue-400" size={18} />
                  Certificate of completion
                </div>
                <div className="flex items-center gap-3 text-secondary text-sm">
                  <Wallet className="text-blue-400" size={18} />
                  Direct P2P payment
                </div>
              </div>

              <button 
                onClick={handleEnrollClick}
                className="btn-primary w-full py-5 text-xl font-bold mb-4"
              >
                Enroll Now
              </button>
              <p className="text-center text-xs text-muted">
                Secure transaction powered by Solana Mainnet
              </p>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        course={course}
        user={user}
      />
    </div>
  );
}
