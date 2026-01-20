import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Clock, CheckCircle2, XCircle, 
  MapPin, Activity, Search, Home, UserCircle, 
  Building2, Phone, Mail, ShieldCheck, RefreshCcw,
  LayoutList, Users, Send, UserCheck, Filter, Loader2
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

// ✅ Import Services
import { complaintUser, complaintAdmin } from "../services/api";

const ComplaintUserDashboard = () => {
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("my-complaints"); // 'my-complaints' | 'officials'
  
  // Data States
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  
  const [officials, setOfficials] = useState([]); // List of all Admins
  const [myConnections, setMyConnections] = useState([]); // List of requests I sent
  const [filteredOfficials, setFilteredOfficials] = useState([]);
  
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [userProfile, setUserProfile] = useState(null);

  // Search & Filter
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // --- 1. ROBUST DATA FETCHING ---
  const fetchAllData = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      
      // ✅ Use Services (Parallel Fetching)
      const [dashboardRes, officialsRes] = await Promise.all([
        complaintUser.get_dashboard(),
        complaintAdmin.get_all_officials() // Public route to get officials list
      ]);
      
      // Destructuring Response based on Controller
      // api.js returns response.data directly
      const { complaints, stats, profile, connections } = dashboardRes.data || dashboardRes;
      
      setComplaints(complaints || []);
      setStats(stats || { total: 0, pending: 0, resolved: 0 });
      setUserProfile(profile);
      setMyConnections(connections || []); 
      setOfficials(officialsRes.data || []);

    } catch (error) {
      console.error("Fetch Error:", error);
      if (error.response?.status === 401 && !isBackground) {
        toast.error("Session Expired");
        // navigate("/complaint/user/login"); // Optional: Auto redirect
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [navigate]);

  // Auto-refresh mechanism
  useEffect(() => {
    fetchAllData();
    const interval = setInterval(() => fetchAllData(true), 5000); // 5s refresh
    return () => clearInterval(interval);
  }, [fetchAllData]);

  // --- 2. ADVANCED SEARCH & FILTER LOGIC ---
  useEffect(() => {
    const lowerQ = searchQuery.toLowerCase();

    if (activeTab === "my-complaints") {
      let result = complaints;
      if (statusFilter !== "All") result = result.filter(c => c.status === statusFilter);
      if (searchQuery) result = result.filter(c => c.title.toLowerCase().includes(lowerQ));
      setFilteredComplaints(result);
    } else {
      // Filter Officials
      let result = officials;
      if (searchQuery) {
        result = result.filter(o => 
          o.assignedWard?.toLowerCase().includes(lowerQ) || 
          o.userInfo?.fullName?.toLowerCase().includes(lowerQ) ||
          o.designation?.toLowerCase().includes(lowerQ) ||
          o.location?.toLowerCase().includes(lowerQ)
        );
      }
      setFilteredOfficials(result);
    }
  }, [complaints, officials, activeTab, statusFilter, searchQuery]);

  // --- 3. OPTIMISTIC UI ACTIONS ---

  // Connect Request Logic with Optimistic Update
  const handleApply = async (adminId) => {
    // 1. Create a temporary connection object for optimistic update
    const tempConnection = { 
        admin: adminId, 
        status: "Pending", 
        _id: "temp_" + Date.now() 
    };

    // 2. Backup current state
    const previousConnections = [...myConnections];

    // 3. Optimistically update UI
    setMyConnections(prev => [...prev, tempConnection]);
    toast.loading("Sending Request...");

    try {
      // ✅ Use Service: complaintUser.connect_admin(id)
      await complaintUser.connect_admin(adminId);
      
      toast.dismiss();
      toast.success("Request Sent Successfully!");
      // 4. Fetch actual data to confirm/sync
      fetchAllData(true); 
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to connect");
      // 5. Revert state on error
      setMyConnections(previousConnections);
    }
  };

  // Withdraw Complaint with Confirmation
  const handleDeleteComplaint = async (id) => {
    if (!window.confirm("Are you sure you want to withdraw this complaint?")) return;
    
    // Backup
    const previousComplaints = [...complaints];
    
    // Optimistic Remove
    setComplaints(prev => prev.filter(c => c._id !== id));

    try {
      // ✅ Use Service: complaintUser.withdraw_complaint(id)
      await complaintUser.withdraw_complaint(id);
      
      toast.success("Complaint Withdrawn");
      fetchAllData(true); 
    } catch (error) {
      toast.error("Failed to withdraw");
      // Revert
      setComplaints(previousComplaints);
    }
  };

  // Helper to safely check connection status
  const getConnectionStatus = (adminId) => {
      if (!myConnections || myConnections.length === 0) return "None";
      
      const conn = myConnections.find(c => {
          // Handle populated object vs raw ID string
          const connAdminId = c.admin?._id || c.admin;
          return String(connAdminId) === String(adminId);
      });
      
      return conn ? conn.status : "None";
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
       <Loader2 className="animate-spin text-red-500 w-12 h-12" />
       <p className="text-slate-500 mt-4 font-mono text-sm tracking-widest animate-pulse">LOADING PORTAL...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 font-sans pb-20 text-slate-200 selection:bg-red-500/30">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }} />

      {/* === HEADER === */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-4">
              <div className="p-2.5 bg-gradient-to-br from-red-600 to-red-800 rounded-xl shadow-lg shadow-red-900/20">
                 <ShieldCheck className="text-white h-6 w-6" />
              </div>
              <div>
                 <h1 className="text-xl font-bold text-white tracking-tight">Jan Sunwai</h1>
                 <p className="text-slate-400 text-xs font-medium">Citizen Grievance Portal</p>
              </div>
           </div>

           {/* User Profile Pill */}
           <div className="flex items-center gap-4 bg-slate-800/80 p-2 pr-6 rounded-full border border-slate-700/50 shadow-xl">
              <div className="h-10 w-10 rounded-full p-[2px] bg-gradient-to-tr from-red-500 to-orange-500">
                 <div className="h-full w-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center">
                    {userProfile?.avatar?.url ? (
                       <img src={userProfile.avatar.url} alt="User" className="h-full w-full object-cover" />
                    ) : (
                       <UserCircle className="text-slate-400" size={24} />
                    )}
                 </div>
              </div>
              <div>
                 <h3 className="text-white font-medium text-sm">{userProfile?.fullName || "Citizen"}</h3>
                 <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Online</p>
                 </div>
              </div>
              <Link to="/" className="ml-2 p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"><Home size={16}/></Link>
           </div>
        </div>
      </div>

      {/* === BODY === */}
      <div className="max-w-7xl mx-auto px-4 mt-8 relative z-10">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <StatCard count={stats.total} label="Total Filed" icon={<Activity/>} color="text-blue-400" bg="bg-blue-500/10" border="border-blue-500/20" />
           <StatCard count={stats.pending} label="Pending Action" icon={<Clock/>} color="text-amber-400" bg="bg-amber-500/10" border="border-amber-500/20" />
           <StatCard count={stats.resolved} label="Resolved Cases" icon={<CheckCircle2/>} color="text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20" />
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
           <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-sm">
              <TabButton active={activeTab === "my-complaints"} onClick={() => setActiveTab("my-complaints")} icon={LayoutList} label="My Complaints" />
              <TabButton active={activeTab === "officials"} onClick={() => setActiveTab("officials")} icon={Users} label="Find Officials" />
           </div>

           <div className="flex gap-3 w-full md:w-auto">
             <button onClick={() => fetchAllData()} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all shadow-sm" title="Refresh">
                <RefreshCcw size={20} />
             </button>

             <div className="relative flex-1 md:w-80">
               <Search className="absolute left-3 top-3 text-slate-500" size={18} />
               <input 
                 type="text" 
                 placeholder={activeTab === "my-complaints" ? "Search complaints..." : "Search Ward, Name..."}
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-red-500 transition-all text-sm text-white placeholder-slate-600 shadow-sm"
               />
             </div>
           </div>

           {activeTab === "my-complaints" && (
             <Link to="/complaint/user/register" className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 transition-transform hover:scale-105 text-sm">
               <Plus size={18} /> File New
             </Link>
           )}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
           
           {/* === TAB 1: MY COMPLAINTS === */}
           {activeTab === "my-complaints" && (
             <motion.div 
               key="complaints"
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
               className="space-y-6"
             >
               {/* Filters */}
               <div className="flex gap-2 overflow-x-auto pb-2">
                  {["All", "Pending", "Resolved", "Rejected"].map(status => (
                    <button 
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${statusFilter === status ? "bg-red-500/10 border-red-500 text-red-400" : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"}`}
                    >
                      {status}
                    </button>
                  ))}
               </div>

               {filteredComplaints.length > 0 ? (
                 <div className="grid grid-cols-1 gap-4">
                   {filteredComplaints.map(item => (
                     <ComplaintCard key={item._id} data={item} onDelete={() => handleDeleteComplaint(item._id)} />
                   ))}
                 </div>
               ) : (
                 <EmptyState message="No complaints found matching criteria." icon={Filter} />
               )}
             </motion.div>
           )}

           {/* === TAB 2: OFFICIALS (CONNECTION REQUESTS) === */}
           {activeTab === "officials" && (
             <motion.div 
               key="officials"
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
             >
               {filteredOfficials.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {filteredOfficials.map(official => {
                        const status = getConnectionStatus(official._id);

                        return (
                           <OfficialCard 
                             key={official._id} 
                             data={official} 
                             status={status}
                             onApply={() => handleApply(official._id)}
                           />
                        );
                     })}
                  </div>
               ) : (
                  <EmptyState message="No officials found." icon={Search} />
               )}
             </motion.div>
           )}

        </AnimatePresence>

      </div>
    </div>
  );
};

/* --- SUB COMPONENTS --- */

const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${active ? "bg-slate-800 text-white shadow-sm ring-1 ring-slate-700" : "text-slate-400 hover:text-white"}`}
  >
    <Icon size={16} /> {label}
  </button>
);

const StatCard = ({ count, label, icon, color, bg, border }) => (
  <div className={`bg-slate-900 border ${border} p-6 rounded-2xl flex items-center justify-between hover:shadow-lg transition-shadow`}>
      <div>
        <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">{count}</h3>
      </div>
      <div className={`p-3 rounded-xl ${bg} ${color}`}>
        {icon}
      </div>
  </div>
);

const EmptyState = ({ message, icon: Icon }) => (
  <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="text-slate-600" size={32} />
      </div>
      <p className="text-slate-500 text-sm font-medium">{message}</p>
  </div>
);

// --- COMPLAINT CARD ---
const ComplaintCard = ({ data, onDelete }) => {
  const isResolved = data.status === "Resolved";
  const isRejected = data.status === "Rejected";

  return (
    <div className="bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row gap-6 relative overflow-hidden group hover:border-slate-700 transition-all">
       <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isResolved ? "bg-emerald-500" : isRejected ? "bg-red-500" : "bg-amber-500"}`}></div>
       
       <div className="w-full md:w-36 h-36 bg-slate-950 rounded-2xl overflow-hidden shrink-0 border border-slate-800 group-hover:border-slate-600 transition-colors">
         {data.complaintImage?.url ? (
            <img src={data.complaintImage.url} alt="Proof" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
         ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-700"><Activity/></div>
         )}
       </div>

       <div className="flex-1 flex flex-col justify-between">
          <div>
              <div className="flex justify-between items-start mb-3">
                 <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block mb-1">{data.category} • {new Date(data.createdAt).toLocaleDateString()}</span>
                    <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">{data.title}</h3>
                 </div>
                 <StatusBadge status={data.status} />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 font-medium bg-slate-800/50 w-fit px-2 py-1 rounded-lg border border-slate-800">
                 <MapPin size={12} className="text-red-500"/> {data.location}
              </div>
              
              <p className="text-sm text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4 italic leading-relaxed">"{data.message}"</p>
          </div>

          {/* Admin Response Section */}
          {data.adminResponse && (
             <div className={`p-4 rounded-xl border text-sm flex gap-3 ${isResolved ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                <ShieldCheck size={18} className="shrink-0 mt-0.5"/>
                <div><span className="block text-[10px] font-bold uppercase opacity-70 mb-1">Official Response</span>{data.adminResponse}</div>
             </div>
          )}

          {data.status === "Pending" && (
             <div className="mt-4 flex justify-end">
                <button onClick={onDelete} className="flex items-center gap-2 text-xs font-bold text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-red-500/20">
                   <Trash2 size={14} /> Withdraw Complaint
                </button>
             </div>
          )}
       </div>
    </div>
  );
};

// --- OFFICIAL CARD (STATUS LOGIC) ---
const OfficialCard = ({ data, status, onApply }) => {
  const isPending = status === "Pending";
  const isAccepted = status === "Accepted"; // Means Connected
  const isRejected = status === "Rejected";

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all border border-slate-800 group hover:border-slate-600 flex flex-col relative">
       {/* Header */}
       <div className="h-28 bg-gradient-to-br from-slate-800 to-slate-900 relative">
          <div className="absolute top-4 right-4">
             {/* Badge based on Status */}
             {isAccepted ? (
                <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border border-emerald-500/30 flex items-center gap-1.5 backdrop-blur-md">
                   <UserCheck size={12}/> Connected
                </div>
             ) : isRejected ? (
                <div className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border border-red-500/30 flex items-center gap-1.5 backdrop-blur-md">
                   <XCircle size={12}/> Rejected
                </div>
             ) : isPending ? (
                <div className="bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border border-amber-500/30 flex items-center gap-1.5 backdrop-blur-md">
                   <Clock size={12}/> Request Sent
                </div>
             ) : (
                <div className="bg-slate-700/50 text-slate-400 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border border-slate-600 backdrop-blur-md">Official</div>
             )}
          </div>
       </div>

       <div className="px-6 relative -mt-14">
          <div className="w-24 h-24 rounded-2xl border-4 border-slate-900 bg-slate-800 absolute overflow-hidden shadow-xl">
             {data.userInfo?.avatar?.url ? (
               <img src={data.userInfo.avatar.url} alt="Avatar" className="w-full h-full object-cover"/>
             ) : (
               <div className="w-full h-full flex items-center justify-center text-slate-600"><UserCircle size={48}/></div>
             )}
          </div>
       </div>
       
       <div className="pt-14 px-6 pb-6 flex-1 flex flex-col">
          <h3 className="font-bold text-xl text-white group-hover:text-blue-400 transition-colors">{data.userInfo?.fullName || "Officer Name"}</h3>
          <p className="text-red-500 text-sm font-medium mb-6 uppercase tracking-wide">{data.designation}</p>

          <div className="space-y-3 mb-6 flex-1">
             <div className="flex items-center gap-3 text-sm text-slate-400 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/50">
                <MapPin size={16} className="text-blue-500"/> <span className="truncate">{data.assignedWard || "All"}</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-slate-400 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/50">
                <Building2 size={16} className="text-orange-500"/> <span className="truncate">{data.location}</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-slate-400 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/50">
                <Clock size={16} className="text-purple-500"/> <span className="truncate">{data.Start_time} - {data.End_time}</span>
             </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-800">
             {status === "None" || !status ? (
                <button 
                  onClick={onApply}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                   <Send size={16}/> Connect Request
                </button>
             ) : isAccepted ? (
                // Only show Contact Info if Accepted
                <div className="grid grid-cols-2 gap-3">
                   {data.userInfo?.phone && (
                      <a href={`tel:${data.userInfo.phone}`} className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white">
                         <Phone size={14}/> Call
                      </a>
                   )}
                   {data.userInfo?.email && (
                      <a href={`mailto:${data.userInfo.email}`} className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500 hover:text-white">
                         <Mail size={14}/> Email
                      </a>
                   )}
                </div>
             ) : (
                <button disabled className="w-full py-3 rounded-xl bg-slate-800 text-slate-500 font-bold text-sm border border-slate-700 cursor-not-allowed opacity-70">
                   {isRejected ? "Request Rejected" : "Request Sent..."}
                </button>
             )}
          </div>
       </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Resolved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Rejected: "bg-red-500/10 text-red-500 border-red-500/20",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
};

export default ComplaintUserDashboard;