'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Shield, 
  Ban, 
  CheckCircle2,
  User as UserIcon,
  Download,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import CreateUserModal from '@/components/CreateUserModal';

export default function AdminStudents() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-12 bg-slate-200 rounded-xl w-full" />
      <div className="h-64 bg-slate-200 rounded-2xl w-full" />
    </div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Student Directory</h1>
          <p className="text-slate-500">Manage student access and view learning activity.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-2 font-bold text-slate-700 hover:bg-slate-50 transition-colors">
            <Download size={20} />
            Export CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-slate-900/10 font-bold"
          >
            <Plus size={20} />
            Manual Enrollment
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters Bar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email or wallet..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none">
              <option>All Roles</option>
              <option>Students</option>
              <option>Admins</option>
            </select>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-bold border border-slate-200 transition-colors">
              <Filter size={18} />
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">System Role</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered Date</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-500 border border-slate-200">
                        {user.name?.charAt(0) || <UserIcon size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1.5 w-fit ${
                      user.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {user.role === 'ADMIN' && <Shield size={12} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5">
                    <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase">
                      <CheckCircle2 size={14} /> Active
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-lg transition-all">
                        <Mail size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all">
                        <Ban size={16} />
                      </button>
                      <button className="p-2 hover:bg-slate-100 text-slate-400 rounded-lg">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-500 font-medium">No students registered yet.</p>
            </div>
          )}
        </div>
      </div>

      <CreateUserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => { setIsModalOpen(false); fetchUsers(); }}
      />
    </div>
  );
}
