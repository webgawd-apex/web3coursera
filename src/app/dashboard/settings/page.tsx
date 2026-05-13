'use client';

import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Wallet, 
  Lock, 
  Save, 
  Camera,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

export default function ProfileSettings() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [wallet, setWallet] = useState('');
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Profile updated successfully');
      setSaving(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl space-y-12 pb-20">
      <div className="max-w-xl">
        <h1 className="text-4xl font-black text-[#0F172A] mb-4">Account Settings</h1>
        <p className="text-[#64748B] text-lg font-medium">Manage your personal information and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar Info */}
        <div className="space-y-8">
           <div className="relative w-32 h-32 mx-auto lg:mx-0">
             <div className="w-full h-full rounded-[2.5rem] bg-[#F2E8DF] border-4 border-white shadow-xl overflow-hidden">
               {user?.image ? (
                 <img src={user.image} className="w-full h-full object-cover" alt="" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-[#64856D]">
                   <User size={48} />
                 </div>
               )}
             </div>
             <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#64856D] text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
               <Camera size={18} />
             </button>
           </div>
           
           <div className="bg-[#F4F7F4] p-6 rounded-[2rem] space-y-4">
             <div className="flex items-center gap-3 text-[#4E6955]">
               <ShieldCheck size={20} />
               <span className="text-xs font-black uppercase tracking-widest">Account Verified</span>
             </div>
             <p className="text-xs text-[#64856D] font-medium leading-relaxed">
               Your account is fully secured. We recommend enabling 2FA for extra protection.
             </p>
           </div>
        </div>

        {/* Form Area */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleUpdate} className="bg-white p-10 rounded-[3rem] border border-[#E2EBE2] shadow-2xl shadow-[#64856D]/5 space-y-8">
            <h3 className="text-xl font-black text-[#0F172A] mb-2">Personal Information</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#64856D] uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A5BFAB]" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FDFCF9] border border-[#E2EBE2] rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-[#64856D]/20 outline-none transition-all text-[#0F172A] font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2 opacity-60">
                <label className="text-[10px] font-black text-[#64856D] uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A5BFAB]" size={18} />
                  <input 
                    type="email" 
                    disabled
                    value={user?.email || ''}
                    className="w-full bg-[#F4F7F4] border border-[#E2EBE2] rounded-2xl pl-12 pr-4 py-4 text-sm outline-none text-[#64748B] font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#64856D] uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A5BFAB]" size={18} />
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#FDFCF9] border border-[#E2EBE2] rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-[#64856D]/20 outline-none transition-all text-[#0F172A] font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#64856D] uppercase tracking-widest ml-1">Solana Wallet</label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A5BFAB]" size={18} />
                    <input 
                      type="text" 
                      placeholder="Address..."
                      value={wallet}
                      onChange={(e) => setWallet(e.target.value)}
                      className="w-full bg-[#FDFCF9] border border-[#E2EBE2] rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-[#64856D]/20 outline-none transition-all text-[#0F172A] font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={saving}
                className="w-full bg-[#64856D] hover:bg-[#4E6955] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#64856D]/20"
              >
                {saving ? 'Updating...' : <><Save size={18} /> Save Changes</>}
              </button>
            </div>
          </form>

          <div className="bg-white p-10 rounded-[3rem] border border-[#E2EBE2] shadow-2xl shadow-[#64856D]/5">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-[#0F172A]">Security</h3>
               <button className="text-[#64856D] font-bold text-xs uppercase tracking-widest flex items-center gap-1 hover:underline">
                 Reset Password <ChevronRight size={14} />
               </button>
            </div>
            <div className="flex items-center gap-4 text-[#64748B]">
               <div className="w-10 h-10 rounded-xl bg-[#F4F7F4] flex items-center justify-center text-[#64856D]">
                 <Lock size={20} />
               </div>
               <div>
                 <p className="text-sm font-bold">Password was last changed 3 months ago</p>
                 <p className="text-[10px] font-medium">Improve your security with a stronger password.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
