'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, PlayCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  courseId: string;
}

export default function LessonModal({ isOpen, onClose, onSuccess, courseId }: LessonModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    order: '1',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/courses/${courseId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to add lesson');

      toast.success('Lesson added!');
      setFormData({ title: '', description: '', videoUrl: '', order: (parseInt(formData.order) + 1).toString() });
      onSuccess();
      onClose();
    } catch (err) {
      toast.error('Error adding lesson');
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
            className="relative w-full max-w-lg bg-surface border border-border-themed rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black">Add <span className="gradient-text">Lesson</span></h2>
                <button onClick={onClose} className="text-muted hover:text-primary"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase mb-2 ml-1">Lesson Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Introduction to Solana"
                    className="input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted uppercase mb-2 ml-1">Video URL (Embed)</label>
                  <div className="relative">
                    <PlayCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input 
                      type="url" 
                      required
                      placeholder="https://vimeo.com/..."
                      className="input pl-14"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted uppercase mb-2 ml-1">Order</label>
                  <input 
                    type="number" 
                    required
                    className="input"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted uppercase mb-2 ml-1">Description (Optional)</label>
                  <textarea 
                    placeholder="Lesson notes..."
                    className="input min-h-[80px] py-3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary flex-1 py-4 font-bold flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Add Lesson</>}
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
