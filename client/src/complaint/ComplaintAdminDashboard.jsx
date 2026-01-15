import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { 
  Shield, CheckCircle, XCircle, MessageSquare, 
  Clock, MapPin, User, AlertTriangle, RefreshCw, X 
} from "lucide-react";
// ✅ Ensure path is correct
import ChatRoom from '../Chat/ChatRoom'; 

const ComplaintAdminDashboard = () => {
  // --- STATE ---
  const [adminData, setAdminData] = useState(null); // Stores full admin doc
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  
  // Chat State
  const [activeChatUser, setActiveChatUser] = useState(null);

  // --- API CONFIG ---
  const BASE_URL = "http://localhost:8000/api/v1/ComplaintAdmin";
  // Assuming you store token in localStorage
  const token = localStorage.getItem("accessToken"); 

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });

  // --- FETCH DATA ---
  const fetchDashboard = async () => {
    try {
      // Calls our NEW controller
      const res = await axios.get(`${BASE_URL}/dashboard`, getHeaders());
      
      setAdminData(res.data.data.admin);
      setStats(res.data.data.stats);
    } catch (error) {
      console.error("Dashboard Error:", error);
    //   toast.error("Sync failed");
    } finally {
      setLoading(false);
    }
  };

  // Poll for updates every 5 seconds
  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS ---
  const handleStatusUpdate = async (complaintId, newStatus) => {
      try {
          toast.loading("Updating status...");
          await axios.post(`${BASE_URL}/update-status`, { 
              complaintId, 
              status: newStatus 
          }, getHeaders());
          
          toast.dismiss();
          toast.success(`Request ${newStatus}`);
          fetchDashboard(); // Refresh UI immediately
      } catch (error) {
          toast.dismiss();
          toast.error("Update failed");
      }
  };

  // --- FILTERS ---
  // We filter the 'AllComplaints' array from the fetched admin data
  const allComplaints = adminData?.AllComplaints || [];
  
  // "Active" = Accepted
  const activeCases = allComplaints.filter(c => c.status === 'accepted');
  
  // "Pending" = Pending (or undefined)
  const pendingCases = allComplaints.filter(c => c.status === 'pending' || !c.status);

  if (loading && !adminData) return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-blue-500">
          <Shield size={48} className="animate-pulse mb-4"/>
          <p className="font-mono text-sm tracking-widest uppercase">Loading Secure Console...</p>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-10 selection:bg-blue-500/30">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }}}/>
      
      {/* --- HEADER --- */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-3">
                <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/50">
                    <Shield className="text-blue-500" size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white tracking-wide uppercase">Officer Console</h1>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        System Online
                    </p>
                </div>
             </div>
             
             {/* Profile Snippet */}
             <div className="flex items-center gap-4 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
                 <div className="text-right hidden sm:block">
                     <p className="text-sm font-bold text-white leading-none">{adminData?.userInfo?.fullname}</p>
                     <p className="text-xs text-blue-400 font-mono mt-1">{adminData?.category || "General Unit"}</p>
                 </div>
                 <img 
                    src={adminData?.userInfo?.avatar?.url || "https://ui-avatars.com/api/?name=Officer"} 
                    className="w-10 h-10 rounded-full border-2 border-slate-600 object-cover" 
                    alt="Officer"
                 />
             </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        
        {/* --- STATS ROW --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            icon={<AlertTriangle size={24} />} 
            label="Total Reports" 
            value={stats.total} 
            color="from-slate-700 to-slate-800"
            accent="text-slate-400"
          />
          <StatCard 
            icon={<Shield size={24} />} 
            label="Active Cases" 
            value={stats.active} 
            color="from-blue-600/20 to-blue-900/20 border-blue-500/30"
            accent="text-blue-400"
          />
          <StatCard 
            icon={<Clock size={24} />} 
            label="Pending Review" 
            value={stats.pending} 
            color="from-amber-600/20 to-amber-900/20 border-amber-500/30"
            accent="text-amber-400"
          />
        </div>

        {/* --- SECTION 1: ACTIVE CASES (GRID) --- */}
        {activeCases.length > 0 && (
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 border-l-4 border-blue-500 pl-3">
                    <CheckCircle className="text-blue-500" size={20}/> Active Investigations
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeCases.map((complaint) => (
                        <div key={complaint._id} className="bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-blue-500/50 transition-all shadow-lg flex flex-col group">
                            
                            {/* User Info */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img 
                                            src={complaint.userInfo?.avatar?.url || "https://ui-avatars.com/api/?name=User"} 
                                            className="w-12 h-12 rounded-xl bg-slate-800 object-cover" 
                                            alt="User"
                                        />
                                        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-[8px] px-1.5 py-0.5 rounded text-white font-bold uppercase">
                                            User
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">
                                            {complaint.userInfo?.fullname || "Unknown"}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-mono">
                                            ID: {String(complaint._id).slice(-6).toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg">
                                    <Shield size={16} />
                                </div>
                            </div>

                            {/* Complaint Preview */}
                            <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 mb-4 h-24 overflow-y-auto">
                                <p className="text-xs text-slate-400 italic">"{complaint.message}"</p>
                            </div>

                            {/* Actions */}
                            <div className="mt-auto flex gap-2">
                                <button 
                                    onClick={() => setActiveChatUser(complaint)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
                                >
                                    <MessageSquare size={16}/> Open Channel
                                </button>
                                <button 
                                    onClick={() => handleStatusUpdate(complaint._id, "solved")}
                                    title="Mark Solved"
                                    className="px-3 bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-500 border border-slate-700 rounded-lg transition-colors"
                                >
                                    <CheckCircle size={18}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* --- SECTION 2: PENDING TABLE --- */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="text-amber-500" size={20} /> Incoming Reports
            </h2>
            <button onClick={fetchDashboard} className="text-slate-500 hover:text-white transition">
                <RefreshCw size={18}/>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-950 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Complainant</th>
                  <th className="px-6 py-4">Issue Description</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {pendingCases.length > 0 ? pendingCases.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                          <div className="font-bold text-white">{complaint.userInfo?.fullname}</div>
                          <div className="text-xs text-slate-500">{complaint.userInfo?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                          <p className="text-slate-300 max-w-xs truncate" title={complaint.message}>
                              {complaint.message}
                          </p>
                      </td>
                      <td className="px-6 py-4 text-slate-400 flex items-center gap-1 mt-2">
                          <MapPin size={12}/> {complaint.location || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button 
                            onClick={() => handleStatusUpdate(complaint._id, "accepted")}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white rounded-md transition-all font-medium text-xs"
                          >
                            <CheckCircle size={14}/> Accept
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(complaint._id, "rejected")}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-md transition-all font-medium text-xs"
                          >
                            <XCircle size={14}/> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500 italic">
                            No new reports available at this moment.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- CHAT MODAL --- */}
      {activeChatUser && adminData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="relative w-full max-w-2xl h-[80vh] flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
               {/* Chat Header */}
               <div className="bg-slate-900 p-4 flex justify-between items-center border-b border-slate-800 z-10">
                   <div className="flex items-center gap-4">
                        <img 
                            src={activeChatUser.userInfo?.avatar?.url || "https://ui-avatars.com/api/?name=U"} 
                            className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600"
                            alt="User"
                        />
                       <div>
                           <h3 className="font-bold text-white leading-none">{activeChatUser.userInfo?.fullname}</h3>
                           <p className="text-xs text-blue-400 mt-1 flex items-center gap-1">
                               <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Secure Line Active
                           </p>
                       </div>
                   </div>
                   <button 
                    onClick={() => setActiveChatUser(null)} 
                    className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-full hover:bg-red-500/20 hover:border-red-500/50 border border-transparent transition-all"
                   >
                    <X size={20}/>
                   </button>
               </div>
               
               <div className="flex-1 overflow-hidden bg-slate-950 relative">
                   <ChatRoom 
                      // 🔐 SECURE ROOM ID: [AdminID, UserID] sorted
                      roomId={[String(adminData.userInfo._id), String(activeChatUser.userInfo._id)].sort().join("-")}
                      
                      currentUser={{ 
                          name: adminData.userInfo.fullname || "Officer", 
                          id: adminData.userInfo._id 
                      }}
                      targetUser={{ 
                          name: activeChatUser.userInfo?.fullname, 
                          avatar: activeChatUser.userInfo?.avatar?.url 
                      }}
                   />
               </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---
const StatCard = ({ icon, label, value, color, accent }) => (
  <div className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg border border-slate-800/50 relative overflow-hidden group`}>
    <div className="relative z-10 flex justify-between items-start">
      <div>
        <p className={`text-xs font-bold uppercase tracking-wider ${accent} mb-1 opacity-80`}>{label}</p>
        <h3 className="text-3xl font-extrabold text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-slate-950/30 ${accent}`}>
        {icon}
      </div>
    </div>
  </div>
);

export default ComplaintAdminDashboard;