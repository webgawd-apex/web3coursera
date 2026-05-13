'use client';

import { useState, useEffect } from 'react';
import { 
  Wallet, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Search,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentTransactions() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch('/api/student/purchases');
        const data = await res.json();
        setPurchases(data.purchases || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  if (loading) {
    return <div className="space-y-4 animate-pulse">
      <div className="h-12 bg-white rounded-2xl w-full" />
      <div className="h-64 bg-white rounded-[2.5rem] w-full" />
    </div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-[#3A4D39]">Billing History</h1>
        <p className="text-[#3A4D39]/50 font-medium">Review your course purchases and blockchain signatures.</p>
      </div>

      <div className="bg-white border border-[#E6D5B0]/30 rounded-[2.5rem] shadow-sm overflow-hidden">
        {/* Table Head */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F4F7F4]/50">
                <th className="px-8 py-5 text-[10px] font-black text-[#8BA88E] uppercase tracking-widest">Transaction</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#8BA88E] uppercase tracking-widest">Course</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#8BA88E] uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#8BA88E] uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-[#8BA88E] uppercase tracking-widest text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6D5B0]/20">
              {purchases.map((tx, i) => (
                <tr key={tx.id} className="hover:bg-[#F4F7F4]/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-mono text-[#3A4D39] truncate max-w-[120px]">{tx.txHash}</p>
                      <a 
                        href={`https://solscan.io/tx/${tx.txHash}`} 
                        target="_blank" 
                        className="text-[10px] text-[#8BA88E] font-black flex items-center gap-1 hover:underline"
                      >
                        <ExternalLink size={10} /> View on Solana
                      </a>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-[#3A4D39]">{tx.course.title}</p>
                    <p className="text-xs text-[#3A4D39]/50 font-medium">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-[#3A4D39]">{tx.amountSOL} SOL</p>
                  </td>
                  <td className="px-8 py-6">
                    {tx.status === 'VERIFIED' ? (
                      <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase flex items-center gap-1.5 w-fit">
                        <CheckCircle2 size={12} /> Verified
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-black uppercase flex items-center gap-1.5 w-fit">
                        <Clock size={12} /> Processing
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2.5 bg-[#F4F7F4] text-[#8BA88E] rounded-xl hover:bg-[#8BA88E] hover:text-white transition-all">
                      <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {purchases.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-[#F4F7F4] rounded-full flex items-center justify-center mx-auto mb-4 text-[#8BA88E]">
                <Wallet size={32} />
              </div>
              <p className="text-[#3A4D39]/50 font-bold">No transactions found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
