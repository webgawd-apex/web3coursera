'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, User, LayoutDashboard, LogOut, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import ThemeToggle from './ThemeToggle';
import { authClient } from '@/lib/auth-client';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success('Logged out');
      router.push('/');
      router.refresh();
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3 glass-blue' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-peach-500 flex items-center justify-center glow-blue">
            <span className="text-white font-bold text-xl">W</span>
          </div>
          <span className="text-xl font-bold tracking-tight gradient-text">
            WEB3 <span className="text-primary">COURSERA</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="/courses" 
            className={`transition-colors font-medium ${isActive('/courses') ? 'text-primary' : 'text-secondary hover:text-primary'}`}
          >
            Courses
          </Link>
          <Link 
            href="/about" 
            className={`transition-colors font-medium ${isActive('/about') ? 'text-primary' : 'text-secondary hover:text-primary'}`}
          >
            About
          </Link>
          
          <div className="h-6 w-px bg-white/10 mx-2" />

          {user ? (
            <div className="flex items-center gap-6">
              {(user as any)?.role === 'ADMIN' && (
                <Link 
                  href="/admin" 
                  className={`flex items-center gap-2 transition-colors font-medium ${isActive('/admin') ? 'text-primary' : 'text-secondary hover:text-primary'}`}
                >
                  <Shield size={18} className="text-blue-400" />
                  Admin
                </Link>
              )}
              <Link 
                href="/dashboard" 
                className={`flex items-center gap-2 transition-colors font-medium ${isActive('/dashboard') ? 'text-primary' : 'text-secondary hover:text-primary'}`}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-secondary hover:text-red-400 transition-colors font-medium"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/login" className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-medium">
                <LogIn size={18} />
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Get Started
              </Link>
              <ThemeToggle />
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-primary" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass overflow-hidden"
          >
            <div className="container px-6 py-8 flex flex-col gap-6">
              <Link href="/courses" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                Courses
              </Link>
              <Link href="/about" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                About
              </Link>
              
              <div className="h-px w-full bg-white/10" />
              
              {user ? (
                <>
                  {(user as any)?.role === 'ADMIN' && (
                    <Link href="/admin" className="flex items-center gap-2 text-lg font-medium text-blue-400" onClick={() => setIsOpen(false)}>
                      <Shield size={20} />
                      Admin Panel
                    </Link>
                  )}
                  <Link href="/dashboard" className="flex items-center gap-2 text-lg font-medium" onClick={() => setIsOpen(false)}>
                    <LayoutDashboard size={20} />
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="flex items-center gap-2 text-lg font-medium text-red-400"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="flex items-center gap-2 text-lg font-medium" onClick={() => setIsOpen(false)}>
                    <LogIn size={20} />
                    Login
                  </Link>
                  <Link href="/register" className="btn-primary w-full text-center" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                  <div className="flex justify-center mt-2">
                    <ThemeToggle />
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
