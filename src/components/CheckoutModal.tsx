'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ExternalLink, Loader2, Wallet, ShieldCheck, Info } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
  user: any;
}

const PLATFORM_WALLET = process.env.NEXT_PUBLIC_PLATFORM_WALLET_ADDRESS || '8j9Uf7yEkGg6D7nK6x7L4D8K9p6F3sH2n7M5w3R1z9Y'; 

export default function CheckoutModal({ isOpen, onClose, course, user }: CheckoutModalProps) {
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyWallet = () => {
    navigator.clipboard.writeText(PLATFORM_WALLET);
    setCopied(true);
    toast.success('Address copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHash) return toast.error('Please enter the transaction hash');

    setLoading(true);
    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          txHash: txHash.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to submit transaction');

      toast.success('Payment submitted! We will verify it shortly.');
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-main/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-surface border border-border-themed rounded-[2.5rem] overflow-hidden shadow-2xl glow-blue"
          >
            <div className="flex flex-col md:flex-row">
              {/* Payment Info */}
              <div className="p-8 md:p-12 md:w-1/2 border-b md:border-b-0 md:border-r border-white/5">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest mb-4">
                  <Wallet size={14} /> Direct Solana Payment
                </div>
                <h2 className="text-3xl font-black mb-6">Complete <br />Enrollment</h2>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <p className="text-muted text-xs uppercase mb-2">Course</p>
                    <p className="font-bold text-lg">{course.title}</p>
                  </div>
                  <div>
                    <p className="text-muted text-xs uppercase mb-2">Total Amount</p>
                    <p className="font-black text-3xl text-peach-400">{course.priceSOL} SOL</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex gap-3">
                  <Info className="text-blue-400 shrink-0" size={18} />
                  <p className="text-xs text-secondary leading-relaxed">
                    Send exactly <span className="text-primary font-bold">{course.priceSOL} SOL</span> to the address shown. Once sent, paste the transaction hash below.
                  </p>
                </div>
              </div>

              {/* Action Area */}
              <div className="p-8 md:p-12 md:w-1/2 bg-main/30">
                <button onClick={onClose} className="absolute top-6 right-6 text-muted hover:text-primary transition-colors">
                  <X size={24} />
                </button>

                <div className="flex flex-col items-center mb-8">
                  <div className="p-4 bg-white rounded-3xl mb-4">
                    <QRCodeSVG value={PLATFORM_WALLET} size={150} />
                  </div>
                  <div className="flex items-center gap-2 bg-surface p-2 pl-4 rounded-xl border border-border-subtle w-full">
                    <p className="text-xs text-secondary truncate flex-1">{PLATFORM_WALLET}</p>
                    <button 
                      onClick={copyWallet}
                      className="p-2 bg-navy-700 hover:bg-navy-600 rounded-lg transition-colors"
                    >
                      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-muted uppercase mb-2 ml-1">Transaction Signature (Hash)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Paste your Solana signature here..."
                      className="input py-3 text-sm"
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                    />
                  </div>
                  <button 
                    disabled={loading}
                    className="btn-orange w-full py-4 font-bold flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                      <>
                        <ShieldCheck size={20} />
                        Verify Payment
                      </>
                    )}
                  </button>
                  <a 
                    href="https://solscan.io" 
                    target="_blank" 
                    className="flex items-center justify-center gap-1 text-[10px] text-muted hover:text-white transition-colors uppercase tracking-widest"
                  >
                    View on Solscan <ExternalLink size={10} />
                  </a>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
