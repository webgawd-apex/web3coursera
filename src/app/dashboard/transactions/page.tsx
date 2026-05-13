'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Wallet,
  Copy,
  Loader2,
  Calendar,
  Hash
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function TransactionHistory() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch('/api/purchases');
        const data = await res.json();
        setPurchases(data.purchases || []);
      } catch (err) {
        toast.error('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Hash copied');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-[#64856D]" size={48} />
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="max-w-xl">
        <h1 className="text-4xl font-black text-[#0F172A] mb-4">Payment History</h1>
        <p className="text-[#64748B] text-lg font-medium">Keep track of your blockchain investments and course enrollments.</p>
      </div>

      <div className="bg-white rounded-[3rem] border border-[#E2EBE2] overflow-hidden shadow-2xl shadow-[#64856D]/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F4F7F4]/50">
                <th className="px-10 py-6 text-[10px] font-black text-[#64856D] uppercase tracking-widest">Course Detail</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#64856D] uppercase tracking-widest">Blockchain Info</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#64856D] uppercase tracking-widest">Amount</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#64856D] uppercase tracking-widest">Verification</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#64856D] uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F7F4]">
              {purchases.map((tx, i) => (
                <motion.tr 
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-[#FDFCF9] transition-colors group"
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#F4F7F4] flex items-center justify-center text-[#64856D] shrink-0">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#0F172A]">{tx.course.title}</p>
                        <p className="text-[10px] font-bold text-[#64856D] uppercase tracking-wider">Course Enrollment</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col gap-1.5 max-w-[180px]">
                      <div className="flex items-center gap-2">
                        <Hash size={12} className="text-[#A5BFAB]" />
                        <p className="text-[10px] font-mono text-[#64748B] truncate">{tx.txHash}</p>
                        <button onClick={() => copyToClipboard(tx.txHash)} className="text-[#A5BFAB] hover:text-[#64856D] transition-colors"><Copy size={12} /></button>
                      </div>
                      <a 
                        href={`https://solscan.io/tx/${tx.txHash}`} 
                        target="_blank" 
                        className="text-[10px] font-black text-[#64856D] hover:text-[#4E6955] flex items-center gap-1 transition-all underline decoration-[#E2EBE2]"
                      >
                        <ExternalLink size={10} /> Explorer
                      </a>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      <Wallet size={16} className="text-[#FB923C]" />
                      <p className="text-lg font-black text-[#0F172A]">{tx.amountSOL} <span className="text-xs text-[#64748B]">SOL</span></p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    {tx.status === 'VERIFIED' ? (
                      <span className="px-4 py-1.5 rounded-full bg-[#F4F7F4] text-[#64856D] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit">
                        <CheckCircle2 size={14} /> Confirmed
                      </span>
                    ) : (
                      <span className="px-4 py-1.5 rounded-full bg-[#FFF7ED] text-[#FB923C] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit">
                        <Clock size={14} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2 text-[#64748B]">
                      <Calendar size={14} />
                      <span className="text-xs font-bold">{new Date(tx.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {purchases.length === 0 && (
            <div className="py-32 text-center">
              <div className="w-20 h-20 bg-[#F4F7F4] rounded-full flex items-center justify-center mx-auto mb-6">
                <History className="text-[#A5BFAB]" size={32} />
              </div>
              <h4 className="text-xl font-black text-[#0F172A] mb-2">No transactions found</h4>
              <p className="text-[#64748B] font-medium">Your purchase history will appear here once you enroll.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
