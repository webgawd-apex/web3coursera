'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Globe, Users, Trophy, PlayCircle } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 lg:pt-52 lg:pb-40 px-6">
        <div className="container relative z-10">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-blue border-blue-500/30 text-blue-400 text-xs font-bold mb-8 uppercase tracking-widest"
            >
              <Zap size={14} className="fill-blue-400" />
              The Future of Learning is Here
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1]"
            >
              Master <span className="gradient-text">Web3</span> <br />
              with Precision.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-secondary mb-10 max-w-2xl leading-relaxed"
            >
              Luxury education for the decentralized era. Expert-led courses on Solana, 
              DeFi, and Smart Contracts. Secure your future in the blockchain revolution.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/courses" className="btn-primary group">
                Browse Courses
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/about" className="btn-outline">
                How it works
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/3 h-full overflow-hidden opacity-20 pointer-events-none hidden lg:block">
           <div className="w-[500px] h-[500px] rounded-full bg-blue-500 blur-[120px] absolute top-0 right-0 animate-pulse-glow" />
           <div className="w-[400px] h-[400px] rounded-full bg-peach-500 blur-[100px] absolute bottom-0 right-1/4 animate-float" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border-subtle bg-surface/50">
        <div className="container px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Students', value: '12K+' },
              { label: 'Premium Courses', value: '45+' },
              { label: 'Expert Mentors', value: '20+' },
              { label: 'Success Rate', value: '98%' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted text-sm uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why <span className="gradient-text">Web3 Coursera?</span></h2>
            <p className="text-secondary text-lg">We provide the tools and knowledge you need to excel in the fastest growing industry on the planet.</p>
          </div>

          <motion.div 
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Secure Solana Payments',
                desc: 'Fast, secure, and decentralized payments using SOL. Verified on-chain manually for maximum security.',
                icon: Shield,
                color: 'blue'
              },
              {
                title: 'Elite Curriculum',
                desc: 'Courses designed by industry veterans who have built protocols used by millions.',
                icon: Trophy,
                color: 'peach'
              },
              {
                title: 'Global Community',
                desc: 'Join a network of thousands of builders, developers, and entrepreneurs.',
                icon: Globe,
                color: 'blue'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                className="card p-8 group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                  feature.color === 'blue' ? 'bg-blue-500/10 group-hover:bg-blue-500' : 'bg-peach-500/10 group-hover:bg-peach-500'
                }`}>
                  <feature.icon className={`transition-colors duration-300 ${
                    feature.color === 'blue' ? 'text-blue-400 group-hover:text-white' : 'text-peach-400 group-hover:text-white'
                  }`} size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-secondary leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Courses Callout */}
      <section className="section bg-surface/30">
        <div className="container px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Start Your <span className="text-peach-400">Journey</span></h2>
              <p className="text-secondary text-lg">Select from our most popular courses and start building today.</p>
            </div>
            <Link href="/courses" className="btn-outline">View All Courses</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mock Courses */}
            {[
              { title: 'Solana Fundamentals', price: '0.5 SOL', level: 'Beginner', students: '2.4k' },
              { title: 'Rust for Smart Contracts', price: '1.2 SOL', level: 'Intermediate', students: '1.1k' },
              { title: 'Advanced DeFi Protocols', price: '2.5 SOL', level: 'Advanced', students: '800' },
            ].map((course, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="card group cursor-pointer"
              >
                <div className="relative aspect-video overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent z-10" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <PlayCircle className="text-white" size={32} />
                    </div>
                  </div>
                  <div className="w-full h-full bg-surface flex items-center justify-center text-muted font-bold text-4xl">
                    COURSE
                  </div>
                  <div className="absolute top-4 left-4 z-20">
                    <span className={`badge ${i === 1 ? 'badge-peach' : 'badge-blue'}`}>{course.level}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted mb-6">
                    <span className="flex items-center gap-1"><Users size={14} /> {course.students}</span>
                    <span className="flex items-center gap-1"><Trophy size={14} /> Certificate</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">{course.price}</div>
                    <Link href={`/courses/${i}`} className="text-blue-400 font-semibold hover:underline flex items-center gap-1">
                      Enroll Now <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section relative overflow-hidden">
        <div className="container px-6 relative z-10">
          <div className="glass-blue rounded-[2.5rem] p-12 md:p-20 text-center border-blue-500/20 glow-blue">
            <h2 className="text-4xl md:text-6xl font-black mb-8">Ready to Build the <span className="gradient-text">Future?</span></h2>
            <p className="text-xl text-blue-100/70 mb-12 max-w-2xl mx-auto">
              Join the elite circle of Web3 developers and entrepreneurs. 
              Start your first course today and pay with Solana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-orange px-12 py-4 text-lg">
                Create Free Account
              </Link>
              <Link href="/login" className="btn-outline px-12 py-4 text-lg bg-main/50">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
