'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Clock, PlayCircle, ShieldCheck, Clock3, Search, Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function StudentDashboard() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const purchasesRes = await fetch('/api/purchases');
        const purchasesData = await purchasesRes.json();
        setPurchases(purchasesData.purchases || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || isPending) return (
    <div className="pt-32 flex justify-center">
      <Loader2 className="animate-spin text-blue-500" size={48} />
    </div>
  );

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black mb-2">Welcome Back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span></h1>
            <p className="text-secondary">Track your progress and continue your Web3 mastery.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/courses" className="btn-outline">Browse More</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass p-6 rounded-3xl border-border-subtle">
              <p className="text-muted text-xs uppercase mb-4">Your Progress</p>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-secondary">Courses Completed</span>
                    <span className="text-primary font-bold">0/{purchases.length}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface p-4 rounded-2xl border border-border-subtle">
                    <p className="text-[10px] text-muted uppercase mb-1">Hours Spent</p>
                    <p className="text-xl font-bold">12.5</p>
                  </div>
                  <div className="bg-surface p-4 rounded-2xl border border-border-subtle">
                    <p className="text-[10px] text-muted uppercase mb-1">Certificates</p>
                    <p className="text-xl font-bold">0</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-3xl border-border-subtle">
              <h4 className="font-bold mb-4">Announcements</h4>
              <div className="space-y-4">
                <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                  <p className="text-xs text-blue-300 font-medium mb-1">New Course!</p>
                  <p className="text-[10px] text-secondary">Advanced DeFi Protocols is now live.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Course List */}
          <div className="lg:col-span-3">
            <h3 className="text-2xl font-bold mb-6">Your Courses</h3>
            
            {purchases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {purchases.map((purchase) => (
                  <motion.div 
                    key={purchase.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card group overflow-hidden"
                  >
                    <div className="relative aspect-video">
                      <img 
                        src={purchase.course.thumbnail || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=600'} 
                        className="w-full h-full object-cover"
                        alt={purchase.course.title}
                      />
                      <div className="absolute inset-0 bg-main/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={purchase.status === 'VERIFIED' ? `/learn/${purchase.course.slug}` : '#'}
                          className={`btn-primary ${purchase.status !== 'VERIFIED' && 'opacity-50 cursor-not-allowed'}`}
                        >
                          {purchase.status === 'VERIFIED' ? 'Continue Learning' : 'Pending Verification'}
                        </Link>
                      </div>
                      {purchase.status === 'VERIFIED' ? (
                        <div className="absolute top-4 right-4 badge badge-blue flex items-center gap-1">
                          <ShieldCheck size={12} /> Unlocked
                        </div>
                      ) : (
                        <div className="absolute top-4 right-4 badge badge-yellow flex items-center gap-1">
                          <Clock size={12} /> Verifying
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h4 className="font-bold text-lg mb-4">{purchase.course.title}</h4>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-secondary flex items-center gap-1"><BookOpen size={14} /> 12 Lessons</span>
                        <span className="text-peach-400 font-bold">0% Complete</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 glass rounded-[2rem] border-dashed border-white/10">
                <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-muted" size={32} />
                </div>
                <h4 className="text-xl font-bold mb-2">No courses yet</h4>
                <p className="text-secondary mb-8">Start your journey by enrolling in your first course.</p>
                <Link href="/courses" className="btn-primary px-8">Explore Catalog</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
