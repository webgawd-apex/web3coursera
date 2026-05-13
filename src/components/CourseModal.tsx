'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  course?: any; // If provided, we are editing
}

export default function CourseModal({ isOpen, onClose, onSuccess, course }: CourseModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceSOL: '',
    category: 'Blockchain',
    level: 'BEGINNER',
    thumbnail: '',
    status: 'DRAFT',
  });

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        priceSOL: course.priceSOL?.toString() || '',
        category: course.category || 'Blockchain',
        level: course.level || 'BEGINNER',
        thumbnail: course.thumbnail || '',
        status: course.status || 'DRAFT',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priceSOL: '',
        category: 'Blockchain',
        level: 'BEGINNER',
        thumbnail: '',
        status: 'DRAFT',
      });
    }
  }, [course, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = course ? `/api/admin/courses/${course.id}` : '/api/courses';
      const method = course ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save course');

      toast.success(course ? 'Course updated!' : 'Course created!');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error('Error saving course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-main/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-surface border border-border-themed rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black">{course ? 'Edit' : 'New'} <span className="gradient-text">Course</span></h2>
                <button onClick={onClose} className="text-muted hover:text-primary"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-muted uppercase mb-2 ml-1">Course Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Solana Fundamentals"
                      className="input"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-muted uppercase mb-2 ml-1">Short Description</label>
                    <textarea 
                      required
                      placeholder="Brief overview of the course..."
                      className="input min-h-[100px] py-3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-2 ml-1">Price (SOL)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      placeholder="0.5"
                      className="input"
                      value={formData.priceSOL}
                      onChange={(e) => setFormData({ ...formData, priceSOL: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-2 ml-1">Level</label>
                    <select 
                      className="input"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-2 ml-1">Category</label>
                    <input 
                      type="text" 
                      placeholder="e.g. DeFi, Rust"
                      className="input"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted uppercase mb-2 ml-1">Status</label>
                    <select 
                      className="input"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-muted uppercase mb-2 ml-1">Thumbnail URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                      <input 
                        type="url" 
                        placeholder="https://images.unsplash.com/..."
                        className="input pl-14"
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary flex-1 py-4 font-bold flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> {course ? 'Update' : 'Create'} Course</>}
                  </button>
                  <button 
                    type="button" 
                    onClick={onClose}
                    className="btn-outline px-8 py-4 font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
