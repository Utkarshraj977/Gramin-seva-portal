import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Clock, CheckCircle2, XCircle, MapPin, Activity, Search, Home, UserCircle, 
  Building2, Phone, Mail, ShieldCheck, RefreshCcw, LayoutList, Users, Send, Filter, Loader2, 
  FileText, Upload, Image, X, UserPlus, AlertCircle, RotateCcw
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { complaintUser, complaintAdmin } from "../services/api";

const ComplaintUserDashboard = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("officials");
  
  const [complaints, setComplaints] = useState([]);
  const [officials, setOfficials] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, rejected: 0 });
  const [userProfile, setUserProfile] = useState(null);
  const [connections, setConnections] = useState({ pending: [], accepted: [], rejected: [] });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);

  const fetchAllData = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      
      const [dashboardRes, officialsRes] = await Promise.all([
        complaintUser.get_dashboard(),
        complaintAdmin.get_all_officials()
      ]);
      
      const dashData = dashboardRes.data || dashboardRes;
      
      setComplaints(dashData.complaints || []);
      setStats(dashData.stats || { total: 0, pending: 0, resolved: 0, rejected: 0 });
      setUserProfile(dashData.profile);
      setConnections(dashData.connections || { pending: [], accepted: [], rejected: [] });
      setOfficials(officialsRes.data || []);

    } catch (error) {
      console.error("Fetch Error:", error);
      if (error.response?.status === 401 && !isBackground) {
        toast.error("Session Expired");
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(() => fetchAllData(true), 10000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  const handleSendRequest = async (adminId) => {
    try {
      await complaintUser.connect_to_admin(adminId);
      toast.success("Connection request sent!");
      fetchAllData(true);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to send request";
      toast.error(msg);
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (!window.confirm("Withdraw this complaint?")) return;
    
    const prev = [...complaints];
    setComplaints(complaints.filter(c => c._id !== id));

    try {
      await complaintUser.withdraw_complaint(id);
      toast.success("Complaint withdrawn");
      fetchAllData(true);
    } catch (error) {
      toast.error("Failed to withdraw");
      setComplaints(prev);
    }
  };

  const filteredOfficials = officials.filter(o => {
    const q = searchQuery.toLowerCase();
    return (
      o.assignedWard?.toLowerCase().includes(q) ||
      o.userInfo?.fullName?.toLowerCase().includes(q) ||
      o.designation?.toLowerCase().includes(q) ||
      o.location?.toLowerCase().includes(q) ||
      o.department?.toLowerCase().includes(q)
    );
  });

  const filteredComplaints = complaints.filter(c => {
    if (statusFilter !== "All" && c.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.title?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.location?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getConnectionStatus = (adminId) => {
    const allConns = [...connections.pending, ...connections.accepted, ...connections.rejected];
    const conn = allConns.find(c => c.admin?._id === adminId);
    return conn?.status || null;
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
       <Loader2 className="animate-spin text-red-500 w-12 h-12" />
       <p className="text-slate-500 mt-4 font-mono text-sm tracking-widest animate-pulse">LOADING...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-20">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }} />

      {/* HEADER */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-4">
              <div className="p-2.5 bg-gradient-to-br from-red-600 to-red-800 rounded-xl shadow-lg">
                 <ShieldCheck className="text-white h-6 w-6" />
              </div>
              <div>
                 <h1 className="text-xl font-bold text-white">Jan Sunwai Portal</h1>
                 <p className="text-slate-400 text-xs">Citizen Dashboard</p>
              </div>
           </div>

           <div className="flex items-center gap-4 bg-slate-800/80 p-2 pr-6 rounded-full border border-slate-700/50">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-red-500 to-orange-500 p-[2px]">
                 <div className="h-full w-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center">
                    {userProfile?.avatar?.url ? (
                       <img src={userProfile.avatar.url} alt="User" className="w-full h-full object-cover" />
                    ) : (
                       <UserCircle className="text-slate-400" size={24} />
                    )}
                 </div>
              </div>
              <div>
                 <h3 className="text-white font-medium text-sm">{userProfile?.fullName || "Citizen"}</h3>
                 <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <p className="text-[10px] text-slate-400 uppercase">Online</p>
                 </div>
              </div>
              <Link to="/" className="ml-2 p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
                <Home size={16}/>
              </Link>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
           <StatCard count={stats.total} label="Total Complaints" icon={<Activity/>} color="text-blue-400" bg="bg-blue-500/10" border="border-blue-500/20" />
           <StatCard count={stats.pending} label="Pending" icon={<Clock/>} color="text-amber-400" bg="bg-amber-500/10" border="border-amber-500/20" />
           <StatCard count={stats.resolved} label="Resolved" icon={<CheckCircle2/>} color="text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20" />
           <StatCard count={connections.accepted?.length || 0} label="Connected Officials" icon={<UserPlus/>} color="text-purple-400" bg="bg-purple-500/10" border="border-purple-500/20" />
        </div>

        {/* Tab Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
           <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <TabButton active={activeTab === "officials"} onClick={() => setActiveTab("officials")} icon={Users} label="Find Officials" />
              <TabButton active={activeTab === "my-complaints"} onClick={() => setActiveTab("my-complaints")} icon={LayoutList} label="My Complaints" />
              <TabButton active={activeTab === "connections"} onClick={() => setActiveTab("connections")} icon={UserPlus} label={`Requests (${connections.pending?.length || 0})`} />
           </div>

           <div className="flex gap-3 w-full md:w-auto">
             <button onClick={() => fetchAllData()} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all">
                <RefreshCcw size={20} />
             </button>

             <div className="relative flex-1 md:w-80">
               <Search className="absolute left-3 top-3 text-slate-500" size={18} />
               <input 
                 type="text" 
                 placeholder={activeTab === "officials" ? "Search officials..." : "Search complaints..."}
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-red-500 transition-all text-sm text-white placeholder-slate-600"
               />
             </div>
           </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
           
           {/* TAB 1: OFFICIALS LIST */}
           {activeTab === "officials" && (
             <motion.div key="officials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               {filteredOfficials.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {filteredOfficials.map(official => {
                       const connStatus = getConnectionStatus(official._id);
                       return (
                         <OfficialCard 
                           key={official._id} 
                           data={official}
                           connectionStatus={connStatus}
                           onSendRequest={() => handleSendRequest(official._id)}
                           onFileComplaint={() => {
                             setSelectedAdmin(official);
                             setShowFileModal(true);
                           }}
                         />
                       );
                     })}
                  </div>
               ) : (
                  <EmptyState message="No officials found" icon={Search} />
               )}
             </motion.div>
           )}

           {/* TAB 2: MY COMPLAINTS */}
           {activeTab === "my-complaints" && (
             <motion.div key="complaints" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
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
                 <EmptyState message="No complaints found" icon={Filter} />
               )}
             </motion.div>
           )}

           {/* TAB 3: CONNECTION REQUESTS */}
           {activeTab === "connections" && (
             <motion.div key="connections" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
               
               {/* Pending */}
               <div>
                 <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                   <Clock className="text-amber-400"/> Pending Requests ({connections.pending?.length || 0})
                 </h3>
                 {connections.pending?.length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {connections.pending.map(conn => (
                       <ConnectionCard key={conn.admin?._id} connection={conn} type="pending" />
                     ))}
                   </div>
                 ) : (
                   <p className="text-slate-500 text-sm italic">No pending requests</p>
                 )}
               </div>

               {/* Accepted */}
               <div className="border-t border-slate-800 pt-6">
                 <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                   <CheckCircle2 className="text-emerald-400"/> Connected ({connections.accepted?.length || 0})
                 </h3>
                 {connections.accepted?.length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {connections.accepted.map(conn => (
                       <ConnectionCard 
                         key={conn.admin?._id} 
                         connection={conn} 
                         type="accepted"
                         onFileComplaint={() => {
                           setSelectedAdmin(conn.admin);
                           setShowFileModal(true);
                         }}
                       />
                     ))}
                   </div>
                 ) : (
                   <p className="text-slate-500 text-sm italic">No active connections yet</p>
                 )}
               </div>

               {/* ✅ NEW: Rejected Section with Retry Option */}
               {connections.rejected?.length > 0 && (
                 <div className="border-t border-slate-800 pt-6">
                   <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                     <XCircle className="text-red-400"/> Rejected ({connections.rejected.length})
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {connections.rejected.map(conn => (
                       <ConnectionCard 
                         key={conn.admin?._id} 
                         connection={conn} 
                         type="rejected"
                         onRetry={() => handleSendRequest(conn.admin._id)}
                       />
                     ))}
                   </div>
                 </div>
               )}

             </motion.div>
           )}

        </AnimatePresence>

      </div>

      {/* FILE COMPLAINT MODAL */}
      {showFileModal && selectedAdmin && (
        <FileComplaintModal
          admin={selectedAdmin}
          onClose={() => {
            setShowFileModal(false);
            setSelectedAdmin(null);
          }}
          onSuccess={() => {
            fetchAllData();
            setActiveTab("my-complaints");
            setShowFileModal(false);
            setSelectedAdmin(null);
          }}
        />
      )}
    </div>
  );
};

// --- SUB COMPONENTS ---

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
        <h3 className="text-3xl font-bold text-white">{count}</h3>
      </div>
      <div className={`p-3 rounded-xl ${bg} ${color}`}>{icon}</div>
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

// ✅ FIXED: Photo Overlap Issue
const OfficialCard = ({ data, connectionStatus, onSendRequest, onFileComplaint }) => {
  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-800 group hover:border-slate-600 flex flex-col">
       {/* Header Background */}
       <div className="h-28 bg-gradient-to-br from-slate-800 to-slate-900 relative flex items-center justify-center">
          <Building2 className="text-slate-700" size={48} />
       </div>

       {/* ✅ FIXED: Photo Container - Removed absolute positioning from parent */}
       <div className="px-6 pb-6 flex flex-col items-center -mt-12">
          {/* Photo */}
          <div className="w-24 h-24 rounded-2xl border-4 border-slate-900 bg-slate-800 overflow-hidden shadow-xl mb-4">
             {data.userInfo?.avatar?.url ? (
               <img src={data.userInfo.avatar.url} alt="Avatar" className="w-full h-full object-cover"/>
             ) : (
               <div className="w-full h-full flex items-center justify-center text-slate-600"><UserCircle size={48}/></div>
             )}
          </div>
       
          {/* Name & Designation - Now properly below photo */}
          <h3 className="font-bold text-xl text-white group-hover:text-blue-400 transition-colors text-center">{data.userInfo?.fullName || "Officer"}</h3>
          <p className="text-red-500 text-sm font-medium mb-1 uppercase text-center">{data.designation}</p>
          {data.department && data.department !== "General" && (
            <p className="text-xs text-slate-400 mb-4 text-center">{data.department}</p>
          )}

          {/* Info Items */}
          <div className="w-full space-y-3 mb-6">
             <InfoItem icon={MapPin} label="Ward" value={data.assignedWard || "All"} />
             <InfoItem icon={Building2} label="Office" value={data.location} />
             <InfoItem icon={Clock} label="Hours" value={`${data.Start_time} - ${data.End_time}`} />
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3">
             {!connectionStatus && (
               <button onClick={onSendRequest} className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all">
                  <Send size={16}/> Send Request
               </button>
             )}
             
             {connectionStatus === "Pending" && (
               <div className="w-full py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-sm flex items-center justify-center gap-2">
                  <Clock size={16}/> Request Pending
               </div>
             )}
             
             {connectionStatus === "Accepted" && (
               <button onClick={onFileComplaint} className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all">
                  <FileText size={16}/> File Complaint
               </button>
             )}
             
             {/* ✅ FIXED: Retry Option for Rejected */}
             {connectionStatus === "Rejected" && (
               <button onClick={onSendRequest} className="w-full py-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-600 hover:text-white hover:border-orange-600 font-bold text-sm flex items-center justify-center gap-2 transition-all">
                  <RotateCcw size={16}/> Retry Request
               </button>
             )}
             
             {/* Contact Info */}
             {(data.userInfo?.phone || data.userInfo?.email) && (
               <div className="grid grid-cols-2 gap-2">
                 {data.userInfo?.phone && (
                   <a href={`tel:${data.userInfo.phone}`} className="py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white">
                      <Phone size={12}/> Call
                   </a>
                 )}
                 {data.userInfo?.email && (
                   <a href={`mailto:${data.userInfo.email}`} className="py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all border bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500 hover:text-white">
                      <Mail size={12}/> Email
                   </a>
                 )}
               </div>
             )}
          </div>
       </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 text-sm text-gray-600">
     <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center shrink-0 text-slate-400">
        <Icon size={16}/>
     </div>
     <div>
        <span className="text-[10px] font-bold text-slate-500 uppercase block">{label}</span>
        <span className="font-medium text-slate-300">{value}</span>
     </div>
  </div>
);

// ✅ FIXED: Added Retry functionality
const ConnectionCard = ({ connection, type, onFileComplaint, onRetry }) => {
  const admin = connection.admin;
  
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:border-slate-600 transition-all">
        <div className="w-20 h-20 rounded-full border-4 border-slate-800 bg-slate-950 overflow-hidden mb-4">
            {admin?.userInfo?.avatar?.url ? (
              <img src={admin.userInfo.avatar.url} alt="Admin" className="w-full h-full object-cover"/>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600"><UserCircle size={40}/></div>
            )}
        </div>
        <h3 className="text-lg font-bold text-white mb-1">{admin?.userInfo?.fullName || "Official"}</h3>
        <p className="text-red-500 text-xs font-bold uppercase mb-1">{admin?.designation}</p>
        <p className="text-slate-500 text-xs mb-4">{admin?.assignedWard}</p>
        
        {type === "accepted" && onFileComplaint && (
          <button onClick={onFileComplaint} className="w-full py-2.5 rounded-xl bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 font-bold text-sm hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2">
            <FileText size={14}/> File Complaint
          </button>
        )}
        
        {type === "pending" && (
          <div className="w-full py-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-sm flex items-center justify-center gap-2">
            <Clock size={14}/> Pending
          </div>
        )}

        {/* ✅ NEW: Retry Button for Rejected */}
        {type === "rejected" && onRetry && (
          <button onClick={onRetry} className="w-full py-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold text-sm hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center gap-2">
            <RotateCcw size={14}/> Retry Request
          </button>
        )}
    </div>
  );
};

// COMPLAINT CARD
const ComplaintCard = ({ data, onDelete }) => {
  const isResolved = data.status === "Resolved";
  const isRejected = data.status === "Rejected";

  return (
    <div className="bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row gap-6 relative overflow-hidden group hover:border-slate-700 transition-all">
       <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isResolved ? "bg-emerald-500" : isRejected ? "bg-red-500" : "bg-amber-500"}`}></div>
       
       <div className="w-full md:w-36 h-36 bg-slate-950 rounded-2xl overflow-hidden shrink-0 border border-slate-800">
         {data.complaintImage?.url ? (
            <img src={data.complaintImage.url} alt="Proof" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
         ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-700"><Activity/></div>
         )}
       </div>

       <div className="flex-1 flex flex-col justify-between">
          <div>
              <div className="flex justify-between items-start mb-3">
                 <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block mb-1">
                      {data.category} • {new Date(data.createdAt).toLocaleDateString()}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">{data.title}</h3>
                    {data.adminInfo?.userInfo && (
                      <p className="text-xs text-slate-400 mt-1">Filed to: {data.adminInfo.userInfo.fullName} ({data.adminInfo.designation})</p>
                    )}
                 </div>
                 <StatusBadge status={data.status} />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 font-medium bg-slate-800/50 w-fit px-2 py-1 rounded-lg border border-slate-800">
                 <MapPin size={12} className="text-red-500"/> {data.location}
              </div>
              
              <p className="text-sm text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4 italic">"{data.message}"</p>
          </div>

          {data.adminResponse && (
             <div className={`p-4 rounded-xl border text-sm flex gap-3 ${isResolved ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                <ShieldCheck size={18} className="shrink-0 mt-0.5"/>
                <div>
                  <span className="block text-[10px] font-bold uppercase opacity-70 mb-1">Official Response</span>
                  {data.adminResponse}
                </div>
             </div>
          )}

          {data.status === "Pending" && (
             <div className="mt-4 flex justify-end">
                <button onClick={onDelete} className="flex items-center gap-2 text-xs font-bold text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-red-500/20">
                   <Trash2 size={14} /> Withdraw
                </button>
             </div>
          )}
       </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Resolved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Rejected: "bg-red-500/10 text-red-500 border-red-500/20",
    "In Progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
};

// FILE COMPLAINT MODAL
const FileComplaintModal = ({ admin, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "Other",
    message: "",
    location: "",
    complaintImage: null
  });

  const categories = ["Electricity", "Water", "Roads", "Sanitation", "Health", "Education", "Other"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setFormData({ ...formData, complaintImage: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.message || !formData.location) {
      toast.error("Please fill all required fields");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("message", formData.message);
    data.append("location", formData.location);
    if (formData.complaintImage) {
      data.append("complaintImage", formData.complaintImage);
    }

    try {
      setLoading(true);
      await complaintUser.file_complaint(admin._id, data);
      toast.success("Complaint filed successfully!");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to file complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
      >
        
        <div className="p-5 flex items-center justify-between bg-gradient-to-r from-red-600 to-red-700 border-b border-red-600">
          <div>
            <h3 className="text-lg font-bold text-white">File Complaint</h3>
            <p className="text-xs text-red-100 mt-1">To: {admin.userInfo?.fullName} - {admin.designation}</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              <FileText size={16} className="inline mr-2" />
              Complaint Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Street Light Not Working"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-red-500 transition-colors"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              <MapPin size={16} className="inline mr-2" />
              Location / Ward *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Ward No. 5"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-red-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Detailed Description *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Explain your issue..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-red-500 resize-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              <Image size={16} className="inline mr-2" />
              Evidence Photo (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="complaint-image-modal"
            />
            <label
              htmlFor="complaint-image-modal"
              className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-slate-950 border-2 border-dashed border-slate-800 rounded-xl cursor-pointer hover:border-red-500 transition-colors"
            >
              <Upload size={20} className="text-slate-500" />
              <span className="text-slate-500 text-sm">
                {formData.complaintImage ? formData.complaintImage.name : "Click to upload"}
              </span>
            </label>
            {imagePreview && (
              <div className="mt-3 h-32 rounded-xl overflow-hidden border border-slate-800">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

        </form>

        <div className="p-5 bg-slate-950/50 border-t border-slate-800 flex gap-3">
          <button 
            type="button"
            onClick={onClose} 
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={18} />
                Submit
              </>
            )}
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default ComplaintUserDashboard;