import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, CheckCircle, Clock, XCircle, MapPin, 
  Briefcase, MessageSquare, RefreshCw, X, Zap
} from "lucide-react";
import ChatRoom from '../Chat/ChatRoom'; 

// ✅ Import Service
import { cyberAdmin } from "../services/api";

const CyberDashboard = () => {
  const [stats, setStats] = useState({ total: 0, selected: 0, pending: 0 });
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Chat State
  const [activeChatUser, setActiveChatUser] = useState(null);

  const fetchDashboardData = async () => {
    try {
      // ✅ Use Service: cyberAdmin methods
      const [statsRes, usersRes, profileRes] = await Promise.all([
        cyberAdmin.get_stats(),
        cyberAdmin.get_all_users(),
        cyberAdmin.get_profile(),
      ]);

      // api.js returns response.data directly
      setStats(statsRes.data || statsRes);
      setUsers(usersRes.data || usersRes);
      setProfile(profileRes.data || profileRes);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (username, status) => {
    try {
      // ✅ Use Service: cyberAdmin.update_user_status(username, status)
      await cyberAdmin.update_user_status(username, status);
      toast.success(`User ${status}`);
      fetchDashboardData();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  // Filter Users
  const activeClients = users.filter(u => u.message === 'selected' || u.status === 'selected');
  const pendingClients = users.filter(u => u.message !== 'selected' && u.status !== 'selected' && u.message !== 'rejected');

  if (loading && !profile) return <div className="min-h-screen flex items-center justify-center"><RefreshCw className="animate-spin text-blue-600"/></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-10">
      <Toaster position="top-right" />
      
      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 px-8 py-6 shadow-sm mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
             <div>
                <h1 className="text-2xl font-extrabold text-slate-800">{profile?.userInfo?.username}'s Admin</h1>
                <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1"><MapPin size={12}/> {profile?.location}</span>
                </p>
             </div>
             <div className="flex items-center gap-4">
                 <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold text-sm">
                   Open: {profile?.Start_time} - {profile?.End_time}
                 </div>
                 <img src={profile?.cyber_shopPic?.url} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" alt="Me"/>
             </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard icon={<Users size={24}/>} label="Total Requests" value={stats.total} color="bg-blue-600" />
          <StatCard icon={<CheckCircle size={24}/>} label="Active Clients" value={stats.selected} color="bg-emerald-500" />
          <StatCard icon={<Clock size={24}/>} label="Pending Actions" value={stats.pending} color="bg-amber-500" />
        </div>

        {/* --- SECTION 1: ACTIVE CLIENTS (CHAT ENABLED) --- */}
        {activeClients.length > 0 && (
            <div className="mb-10">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Zap className="text-emerald-500" size={20}/> Active Clients (Approved)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeClients.map(client => (
                        <div key={client._id} className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex flex-col hover:shadow-md transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg">
                                    {client.userInfo?.username?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{client.userInfo?.username}</h3>
                                    <p className="text-xs text-slate-500">{client.userInfo?.email}</p>
                                </div>
                            </div>
                            <div className="mt-auto">
                                <button 
                                    onClick={() => setActiveChatUser(client)}
                                    className="w-full bg-blue-600 text-white py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100"
                                >
                                    <MessageSquare size={16}/> Chat Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* --- SECTION 2: PENDING REQUESTS --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock size={18} className="text-amber-500" /> Pending Requests
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {pendingClients.length > 0 ? pendingClients.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium text-slate-700">{user.userInfo?.username}</td>
                      <td className="px-6 py-4 text-slate-500">{user.message}</td>
                      <td className="px-6 py-4 flex justify-center gap-2">
                        <button onClick={() => handleStatusUpdate(user.userInfo.username, "selected")} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"><CheckCircle size={18}/></button>
                        <button onClick={() => handleStatusUpdate(user.userInfo.username, "rejected")} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><XCircle size={18}/></button>
                      </td>
                    </tr>
                )) : (
                    <tr><td colSpan="3" className="text-center py-8 text-slate-400">No pending requests</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- CHAT MODAL --- */}
      {activeChatUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
           <div className="relative w-full max-w-lg h-[80vh] flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xl">
               <div className="bg-white p-4 flex justify-between items-center border-b border-gray-100 z-10">
                   <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                           {activeChatUser.userInfo?.username?.charAt(0)}
                       </div>
                       <div>
                           <h3 className="font-bold text-slate-800 leading-none">{activeChatUser.userInfo?.username}</h3>
                           <span className="text-xs text-emerald-500 font-bold">Approved Client</span>
                       </div>
                   </div>
                   <button onClick={() => setActiveChatUser(null)} className="hover:bg-slate-100 p-2 rounded-full transition"><X size={20}/></button>
               </div>
               
               <div className="flex-1 overflow-hidden bg-slate-50">
                   <ChatRoom 
                      // Room ID: [AdminID, UserID] sorted
                      // profile._id is admin ID, activeChatUser.userInfo._id is user ID
                      roomId={[String(profile.userInfo?._id), String(activeChatUser.userInfo?._id)].sort().join("-")}
                      currentUser={{ 
                          name: profile.userInfo?.username, 
                          id: profile.userInfo?._id 
                      }}
                      targetUser={{ 
                          name: activeChatUser.userInfo?.username, 
                          avatar: "" 
                      }}
                   />
               </div>
           </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className={`${color} p-6 rounded-2xl shadow-lg relative overflow-hidden text-white`}>
    <div className="relative z-10">
      <p className="opacity-80 text-xs font-bold uppercase tracking-wider">{label}</p>
      <h3 className="text-3xl font-extrabold mt-1">{value}</h3>
    </div>
    <div className="absolute right-4 bottom-4 opacity-20">{icon}</div>
  </div>
);

export default CyberDashboard;