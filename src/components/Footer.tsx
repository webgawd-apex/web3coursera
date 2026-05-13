import Link from 'next/link';
import { Globe, Code2, Briefcase, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-white/5 pt-16 pb-8">
      <div className="container px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-peach-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-lg font-bold tracking-tight gradient-text">
                WEB3 <span className="text-white">COURSERA</span>
              </span>
            </Link>
            <p className="text-secondary text-sm leading-relaxed mb-6">
              The premium destination for mastering Web3, Blockchain, and Decentralized Finance. 
              Built on Solana for the next generation of builders.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-secondary hover:text-blue-400 transition-colors">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-secondary hover:text-white transition-colors">
                <Code2 size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-secondary hover:text-blue-600 transition-colors">
                <Briefcase size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/courses" className="text-secondary hover:text-white transition-colors text-sm">All Courses</Link></li>
              <li><Link href="/categories" className="text-secondary hover:text-white transition-colors text-sm">Categories</Link></li>
              <li><Link href="/instructors" className="text-secondary hover:text-white transition-colors text-sm">Instructors</Link></li>
              <li><Link href="/pricing" className="text-secondary hover:text-white transition-colors text-sm">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/help" className="text-secondary hover:text-white transition-colors text-sm">Help Center</Link></li>
              <li><Link href="/tos" className="text-secondary hover:text-white transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-secondary hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/contact" className="text-secondary hover:text-white transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Newsletter</h4>
            <p className="text-secondary text-sm mb-4">Subscribe for the latest Web3 insights.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="input py-2 flex-1"
              />
              <button className="btn-primary py-2 px-4 text-xs">Join</button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center gap-4">
          <p className="text-muted text-xs">
            © {new Date().getFullYear()} WEB3 COURSERA. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-muted hover:text-white text-xs">Terms</Link>
            <Link href="/privacy" className="text-muted hover:text-white text-xs">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
