'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) throw error;

      // After login, check if the user is actually an admin
      const { data: session } = await authClient.getSession();
      const user = session?.user as { role?: string } | undefined;
      
      if (user?.role !== 'ADMIN') {
        await authClient.signOut();
        throw new Error('Access Denied: You do not have administrative privileges.');
      }

      toast.success('Admin Authenticated');
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 glow-blue">
            <Shield className="text-blue-500" size={40} />
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Admin <span className="gradient-text">Portal</span></h1>
          <p className="text-secondary text-sm">Secure authorization required for system access.</p>
        </div>

        <div className="glass p-8 md:p-10 rounded-[2.5rem] border-white/5 shadow-2xl relative">
          <div className="absolute top-0 right-0 p-6">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">Administrator ID</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input 
                  type="email" 
                  required
                  className="input !pl-14 bg-navy-900/50 border-white/5 focus:border-blue-500"
                  placeholder="admin@web3coursera.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 ml-1">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input 
                  type="password" 
                  required
                  className="input !pl-14 bg-navy-900/50 border-white/5 focus:border-blue-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-5 text-lg font-bold flex items-center justify-center gap-3 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : (
                <>
                  Login
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-xs text-muted hover:text-white transition-colors flex items-center justify-center gap-2">
             Back to site
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
