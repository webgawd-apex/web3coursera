'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Copy,
  Wallet
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminTransactions() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPurchases = async () => {
    try {
      const res = await fetch('/api/admin/purchases');
      const data = await res.json();
      setPurchases(data.purchases || []);
    } catch (err) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleVerify = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/purchases/${id}/verify`, { method: 'POST' });
      if (!res.ok) throw new Error();
      toast.success('Transaction verified');
      fetchPurchases();
    } catch (err) {
      toast.error('Verification failed');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-12 bg-slate-200 rounded-xl w-full" />
      <div className="h-64 bg-slate-200 rounded-2xl w-full" />
    </div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Transaction Ledger</h1>
        <p className="text-slate-500">Monitor and verify Solana blockchain payments.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters Bar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Signature or Wallet..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-bold border border-slate-200 transition-colors">
              <Filter size={18} />
              All Status
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Hash</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Course / Student</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchases.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1 max-w-[200px]">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-mono text-slate-900 truncate">{tx.txHash}</p>
                        <button onClick={() => copyToClipboard(tx.txHash)} className="text-slate-400 hover:text-slate-900"><Copy size={12} /></button>
                      </div>
                      <a 
                        href={`https://solscan.io/tx/${tx.txHash}`} 
                        target="_blank" 
                        className="text-[10px] text-blue-500 font-bold flex items-center gap-1 hover:underline"
                      >
                        <ExternalLink size={10} /> View on Solscan
                      </a>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-slate-900">{tx.course.title}</p>
                    <p className="text-xs text-slate-500">{tx.user.email}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-black text-slate-900">{tx.amountSOL} SOL</p>
                    <p className="text-[10px] text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-5">
                    {tx.status === 'VERIFIED' ? (
                      <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase flex items-center gap-1.5 w-fit">
                        <CheckCircle2 size={14} /> Verified
                      </span>
                    ) : tx.status === 'FAILED' ? (
                      <span className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-[10px] font-black uppercase flex items-center gap-1.5 w-fit">
                        <AlertCircle size={14} /> Failed
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-black uppercase flex items-center gap-1.5 w-fit">
                        <Clock size={14} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-2">
                      {tx.status === 'PENDING' && (
                        <button 
                          onClick={() => handleVerify(tx.id)}
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                        >
                          Verify Payment
                        </button>
                      )}
                      <button className="p-2 hover:bg-slate-100 text-slate-400 rounded-lg">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {purchases.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-500 font-medium">No transactions found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
