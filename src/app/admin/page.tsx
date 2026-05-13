'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Check, X, Shield, Users, BookOpen, 
  DollarSign, Loader2, PlayCircle, Eye, Search, 
  ChevronRight, Calendar, Mail, ExternalLink, LayoutDashboard
} from 'lucide-react';
import toast from 'react-hot-toast';
import CourseModal from '@/components/CourseModal';
import LessonModal from '@/components/LessonModal';
import CreateUserModal from '@/components/CreateUserModal';
import Link from 'next/link';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'users'>('overview');
  const [courses, setCourses] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, purchasesRes, usersRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/admin/purchases'),
        fetch('/api/admin/users')
      ]);
      
      const coursesData = await coursesRes.json();
      const purchasesData = await purchasesRes.json();
      const usersData = await usersRes.json();
      
      setCourses(coursesData.courses || []);
      setPurchases(purchasesData.purchases || []);
      setUsers(usersData.users || []);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerifyPurchase = async (purchaseId: string) => {
    try {
      const res = await fetch(`/api/admin/purchases/${purchaseId}/verify`, {
        method: 'POST',
      });
      if (res.ok) {
        toast.success('Purchase verified!');
        fetchData();
      } else {
        toast.error('Failed to verify');
      }
    } catch (err) {
      toast.error('Error verifying purchase');
    }
  };

  const handleToggleAdmin = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'STUDENT' : 'ADMIN';
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (res.ok) {
        toast.success(`User role updated to ${newRole}`);
        fetchData();
      } else {
        toast.error('Failed to update role');
      }
    } catch (err) {
      toast.error('Error updating role');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course? All lessons will be removed.')) return;
    
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Course deleted');
        fetchData();
      } else {
        toast.error('Delete failed');
      }
    } catch (err) {
      toast.error('Error deleting course');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Total Students', value: users.length, icon: Users, color: 'blue' },
    { label: 'Active Courses', value: courses.length, icon: BookOpen, color: 'peach' },
    { label: 'Total Revenue', value: '4.2 SOL', icon: DollarSign, color: 'green' },
    { label: 'Pending Verification', value: purchases.filter(p => p.status === 'PENDING').length, icon: Shield, color: 'yellow' }
  ];

  if (loading && courses.length === 0) return (
    <div className="pt-32 flex justify-center h-screen items-center">
      <Loader2 className="animate-spin text-blue-500" size={48} />
    </div>
  );

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center glow-blue">
               <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Admin <span className="gradient-text">Center</span></h1>
              <p className="text-secondary text-sm">Managing WEB3 COURSERA Ecosystem</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsUserModalOpen(true)}
              className="btn-outline py-4 px-8 flex items-center gap-2 font-bold"
            >
              <Users size={20} /> Create User
            </button>
            <button 
              onClick={() => { setSelectedCourse(null); setIsCourseModalOpen(true); }}
              className="btn-primary py-4 px-8 flex items-center gap-2 font-bold"
            >
              <Plus size={20} /> Create Course
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-12 p-2 glass rounded-[2rem] border-white/5 w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'courses', label: 'Inventory', icon: BookOpen },
            { id: 'users', label: 'Users', icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all duration-300 ${
                activeTab === tab.id 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                : 'text-secondary hover:bg-white/5'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                {stats.map((stat, i) => (
                  <div key={i} className="glass p-6 rounded-[2rem] border-white/5 glow-blue-sm">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-surface text-primary`}>
                        <stat.icon size={28} />
                      </div>
                      <div>
                        <p className="text-muted text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-3xl font-black text-primary">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pending Payments */}
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Shield className="text-peach-400" /> Pending Payments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {purchases.filter(p => p.status === 'PENDING').length > 0 ? (
                  purchases.filter(p => p.status === 'PENDING').map(purchase => (
                    <div key={purchase.id} className="glass p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4">
                         <span className="badge badge-peach">Awaiting Verification</span>
                      </div>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-[10px] text-muted uppercase font-bold tracking-widest mb-1">Student</p>
                          <p className="font-bold text-lg">{purchase.user.name}</p>
                          <p className="text-xs text-secondary">{purchase.user.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-muted uppercase font-bold tracking-widest mb-1">Course</p>
                          <p className="font-bold">{purchase.course.title}</p>
                          <p className="text-peach-400 font-black">{purchase.amountSOL} SOL</p>
                        </div>
                      </div>
                      <div className="mb-8">
                        <p className="text-[10px] text-muted uppercase font-bold tracking-widest mb-2">Solana Transaction Hash</p>
                        <div className="bg-main p-4 rounded-2xl border border-border-subtle flex items-center justify-between group">
                          <code className="text-[10px] text-blue-300 break-all">{purchase.txHash}</code>
                          <a href={`https://solscan.io/tx/${purchase.txHash}`} target="_blank" className="p-2 text-muted hover:text-white"><Eye size={16} /></a>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => handleVerifyPurchase(purchase.id)} className="btn-primary flex-1 py-4 font-bold flex items-center justify-center gap-2"><Check size={20} /> Approve Enrollment</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 glass p-20 rounded-[3rem] text-center border-dashed border-white/10">
                    <Shield className="text-muted mx-auto mb-4" size={48} />
                    <p className="text-muted font-medium">All clear! No pending payments.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'courses' && (
            <motion.div 
              key="courses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <BookOpen className="text-blue-400" /> Course Inventory
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {courses.map(course => (
                  <div key={course.id} className="glass p-6 rounded-[3rem] border-white/5 group hover:border-blue-500/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-3xl overflow-hidden bg-surface">
                           {course.thumbnail ? <img src={course.thumbnail} className="w-full h-full object-cover" alt="" /> : <BookOpen className="m-auto text-muted" size={32} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-xl">{course.title}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${course.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{course.status}</span>
                          </div>
                          <p className="text-sm text-secondary">{course.priceSOL} SOL • {course._count?.lessons || 0} Lessons</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedCourse(course); setIsCourseModalOpen(true); }} className="p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-2xl text-blue-400"><Edit size={18} /></button>
                        <button onClick={() => handleDeleteCourse(course.id)} className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-2xl text-red-400"><Trash2 size={18} /></button>
                      </div>
                    </div>
                    <div className="pt-8 border-t border-border-subtle">
                       <p className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Curriculum</p>
                       <div className="space-y-3 mb-6">
                          {course.lessons?.length > 0 ? (
                            course.lessons.slice(0, 3).map((lesson: any) => (
                              <div key={lesson.id} className="flex items-center justify-between p-3 bg-surface/50 rounded-xl border border-border-subtle">
                                <div className="flex items-center gap-3">
                                  <PlayCircle size={14} className="text-blue-400" />
                                  <span className="text-sm font-medium">{lesson.title}</span>
                                </div>
                                <span className="text-[10px] text-muted">Lesson {lesson.order}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-muted italic">No lessons added yet.</p>
                          )}
                          {course.lessons?.length > 3 && <p className="text-xs text-blue-400 font-bold ml-1">+{course.lessons.length - 3} more lessons</p>}
                       </div>
                       <button 
                        onClick={() => { setSelectedCourse(course); setIsLessonModalOpen(true); }}
                        className="btn-outline w-full py-3 text-xs font-bold flex items-center justify-center gap-2"
                       >
                         <Plus size={14} /> Add Curriculum Item
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div 
              key="users"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <Users className="text-blue-400" /> Student Directory
                </h3>
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                  <input 
                    type="text"
                    placeholder="Search by name or email..."
                    className="input pl-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="glass rounded-[2.5rem] border-white/5 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface/50 border-b border-white/5">
                      <th className="px-8 py-5 text-xs font-bold text-muted uppercase tracking-widest">Student</th>
                      <th className="px-8 py-5 text-xs font-bold text-muted uppercase tracking-widest">Role</th>
                      <th className="px-8 py-5 text-xs font-bold text-muted uppercase tracking-widest text-center">Admin Access</th>
                      <th className="px-8 py-5 text-xs font-bold text-muted uppercase tracking-widest">Enrollments</th>
                      <th className="px-8 py-5 text-xs font-bold text-muted uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-peach-500 flex items-center justify-center font-bold text-white shadow-lg">
                              {user.name[0]}
                            </div>
                            <div>
                              <p className="font-bold">{user.name}</p>
                              <p className="text-xs text-secondary">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${user.role === 'ADMIN' ? 'bg-blue-500/20 text-blue-400' : 'bg-surface text-secondary'}`}>
                             {user.role}
                           </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleToggleAdmin(user.id, user.role)}
                              className={`p-2 rounded-xl border transition-all ${
                                user.role === 'ADMIN' 
                                ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                                : 'bg-surface border-border-subtle text-muted hover:text-blue-400'
                              }`}
                              title={user.role === 'ADMIN' ? 'Revoke Admin Access' : 'Grant Admin Access'}
                            >
                              <Shield size={18} />
                            </button>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <BookOpen size={14} className="text-muted" />
                            <span className="font-bold">{user._count?.purchases || 0} Courses</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button className="p-2 text-muted hover:text-white transition-colors"><Mail size={18} /></button>
                           <button className="p-2 text-muted hover:text-white transition-colors ml-2"><ChevronRight size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="p-20 text-center text-muted">
                    No users found matching your search.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <CourseModal 
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSuccess={fetchData}
        course={selectedCourse}
      />
      <LessonModal 
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        onSuccess={fetchData}
        courseId={selectedCourse?.id}
      />
      <CreateUserModal 
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}
