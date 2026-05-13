'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Wallet, 
  Lock, 
  Save,
  Camera,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

export default function StudentSettings() {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    walletAddress: ''
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: '', // Placeholder
        walletAddress: '' // Placeholder
      });
    }
  }, [session]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Logic to update profile would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-black text-[#3A4D39]">Settings</h1>
        <p className="text-[#3A4D39]/50 font-medium">Personalize your profile and manage account security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Avatar & Basic Info */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E6D5B0]/30 rounded-[2.5rem] p-8 text-center shadow-sm">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full rounded-[2rem] bg-[#F2E8CF] flex items-center justify-center font-black text-4xl text-[#8BA88E] border-4 border-white shadow-lg">
                {formData.name?.charAt(0) || 'U'}
              </div>
              <button className="absolute -bottom-2 -right-2 p-3 bg-[#8BA88E] text-white rounded-2xl border-4 border-white shadow-lg hover:scale-110 transition-transform">
                <Camera size={20} />
              </button>
            </div>
            <h3 className="text-xl font-black text-[#3A4D39]">{formData.name}</h3>
            <p className="text-sm text-[#3A4D39]/50 font-medium mb-6">{formData.email}</p>
            <div className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#F4F7F4] text-[#8BA88E] rounded-xl text-xs font-black uppercase tracking-wider">
              <ShieldCheck size={14} /> Student Account
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleUpdate} className="bg-white border border-[#E6D5B0]/30 rounded-[2.5rem] p-8 sm:p-10 shadow-sm space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-[#3A4D39]/40 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A4D39]/30" size={18} />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-12 pr-4 py-3.5 bg-[#F4F7F4] border border-transparent rounded-2xl outline-none focus:border-[#8BA88E] focus:bg-white transition-all font-bold text-[#3A4D39]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-[#3A4D39]/40 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A4D39]/30" size={18} />
                  <input 
                    type="email" 
                    disabled
                    value={formData.email}
                    className="w-full pl-12 pr-4 py-3.5 bg-[#F4F7F4]/50 border border-transparent rounded-2xl font-bold text-[#3A4D39]/40 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-[#3A4D39]/40 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A4D39]/30" size={18} />
                  <input 
                    type="tel" 
                    placeholder="+1 234 567 890"
                    className="w-full pl-12 pr-4 py-3.5 bg-[#F4F7F4] border border-transparent rounded-2xl outline-none focus:border-[#8BA88E] focus:bg-white transition-all font-bold text-[#3A4D39]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-[#3A4D39]/40 uppercase tracking-widest ml-1">Solana Wallet (Optional)</label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A4D39]/30" size={18} />
                  <input 
                    type="text" 
                    placeholder="Enter wallet address"
                    className="w-full pl-12 pr-4 py-3.5 bg-[#F4F7F4] border border-transparent rounded-2xl outline-none focus:border-[#8BA88E] focus:bg-white transition-all font-bold text-[#3A4D39]"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-10 py-4 bg-[#8BA88E] text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#6B8E6E] transition-all shadow-xl shadow-[#8BA88E]/20 disabled:opacity-50"
            >
              {loading ? 'Saving...' : <><Save size={20} /> Save Changes</>}
            </button>
          </form>

          <div className="bg-white border border-[#E6D5B0]/30 rounded-[2.5rem] p-8 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                <Lock size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#3A4D39]">Security</h3>
                <p className="text-sm text-[#3A4D39]/50 font-medium">Manage your password and session security.</p>
              </div>
            </div>
            <button className="px-8 py-4 border-2 border-[#E6D5B0]/50 text-[#3A4D39] font-black rounded-2xl hover:border-[#8BA88E] hover:text-[#8BA88E] transition-all">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
