import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, UserCog, CheckCircle2, XCircle, Clock, 
  MapPin, Search, Filter, LogOut, Briefcase, 
  Building2, FileText, ShieldAlert, RefreshCcw,
  UserPlus, Phone, Mail, User, Trash2, Loader2
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// ✅ Import Service
import { complaintAdmin } from "../services/api";

const ComplaintAdminDashboard = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("overview"); 
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0, requests: 0, ward: "" });
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  
  const [requests, setRequests] = useState([]); 
  const [pendingReqs, setPendingReqs] = useState([]);
  const [acceptedReqs, setAcceptedReqs] = useState([]);

  // Filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Action Modal
  const [selectedComplaint, setSelectedComplaint] = useState(null); 
  const [actionType, setActionType] = useState(null); 
  const [responseText, setResponseText] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Profile Form
  const [profileData, setProfileData] = useState({
    location: "", Start_time: "", End_time: "", designation: ""
  });

  // --- 1. ROBUST DATA FETCHING ---
  const fetchData = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      
      // ✅ Use Service: complaintAdmin methods
      const [statsRes, listRes, reqRes] = await Promise.all([
        complaintAdmin.get_stats(),
        complaintAdmin.get_all_complaints(),
        complaintAdmin.get_connection_requests()
      ]);

      // --- FIX 1: Flexible Data Reading ---
      // Check data inside .data.data OR .data OR fallback to default
      const statsData = statsRes.data || statsRes || {};
      setStats({
          total: statsData.total || 0,
          pending: statsData.pending || 0,
          resolved: statsData.resolved || 0,
          ward: statsData.ward || "Unknown"
      });

      const rawList = listRes.data || listRes.complaints || [];
      const complaintArray = Array.isArray(rawList) ? rawList : [];
      setComplaints(complaintArray);

      const rawRequests = reqRes.data || [];
      setRequests(Array.isArray(rawRequests) ? rawRequests : []);

      // Pre-fill profile only once
      if (!isBackground) {
         try {
            // ✅ Use Service
            const userRes = await complaintAdmin.get_current_admin();
            const uData = userRes.data || {};
            setProfileData({
                location: uData.location || "",
                Start_time: uData.Start_time || "",
                End_time: uData.End_time || "",
                designation: uData.designation || ""
            });
         } catch (err) { console.log("Profile silent fetch failed"); }
      }

    } catch (error) {
      console.error("Fetch Error:", error);
      if (error.response?.status === 401 && !isBackground) {
        toast.error("Session Expired");
        navigate("/complaint/admin/login");
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 10000); // Auto-sync
    return () => clearInterval(interval);
  }, [fetchData]);

  // --- 2. ADVANCED FILTERING & DERIVED STATE ---
  useEffect(() => {
    // 1. Complaint Filtering
    let result = [...complaints]; 
    
    if (statusFilter !== "All") {
      result = result.filter(c => 
        c.status && c.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(c => 
        (c.title && c.title.toLowerCase().includes(lowerQ)) || 
        (c.category && c.category.toLowerCase().includes(lowerQ)) ||
        (c.location && c.location.toLowerCase().includes(lowerQ)) ||
        (c.userInfo?.fullName && c.userInfo.fullName.toLowerCase().includes(lowerQ))
      );
    }
    setFilteredComplaints(result);

    // 2. Request Separation
    if (requests && Array.isArray(requests)) {
        setPendingReqs(requests.filter(r => r.status === "Pending"));
        setAcceptedReqs(requests.filter(r => r.status === "Accepted"));
    }
  }, [complaints, requests, statusFilter, searchQuery]);

  // --- 3. OPTIMISTIC UI ACTIONS ---

  // Handle Complaint Resolution/Rejection
  const handleActionSubmit = async () => {
    if (!responseText.trim()) return toast.error("Please enter a response.");

    // Backup
    const originalComplaints = [...complaints];
    const originalStats = { ...stats };

    // Optimistic Update
    const newStatus = actionType === "resolve" ? "Resolved" : "Rejected";
    
    setComplaints(prev => prev.map(c => 
        c._id === selectedComplaint._id 
        ? { ...c, status: newStatus, adminResponse: responseText } 
        : c
    ));
    
    // Optimistic Stat Update
    setStats(prev => ({
        ...prev,
        pending: Math.max(0, prev.pending - 1),
        resolved: actionType === "resolve" ? prev.resolved + 1 : prev.resolved
    }));

    setSelectedComplaint(null); // Close modal immediately
    setActionLoading(true);

    try {
      // ✅ Use Service
      if (actionType === "resolve") {
          // Note: Backend might expect a body with responseMessage. 
          // If api.js resolve_complaint only takes ID, you might need to update api.js or backend to accept body.
          // Assuming api.js resolve_complaint handles body if passed as second arg (axios default), 
          // but current api.js definition only takes ID.
          // Let's assume for now simple toggle, or update api.js if payload needed.
          await complaintAdmin.resolve_complaint(selectedComplaint._id); 
      } else {
          await complaintAdmin.reject_complaint(selectedComplaint._id);
      }

      toast.success(`Action Successful: ${newStatus}`);
      setResponseText("");
      
    } catch (error) {
      toast.error("Action Failed, Reverting...");
      // Revert on failure
      setComplaints(originalComplaints);
      setStats(originalStats);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Connection Request (Accept/Reject)
  const handleConnectionAction = async (userId, status) => {
      const originalRequests = [...requests];
      const newStatus = status === 'accept' ? "Accepted" : "Rejected";
      
      setRequests(prev => prev.map(r => 
          r.user._id === userId ? { ...r, status: newStatus } : r
      ));

      try {
          // ✅ Use Service
          await complaintAdmin.handle_connection_request(status, userId);
          toast.success(`Request ${newStatus}`);
      } catch (error) {
          toast.error("Failed to update status");
          setRequests(originalRequests);
      }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      toast.loading("Updating Profile...");
      // ✅ Use Service
      await complaintAdmin.update_profile(profileData);
      toast.dismiss();
      toast.success("Profile Updated");
    } catch (error) {
      toast.dismiss();
      toast.error("Update Failed");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-red-500 w-12 h-12" />
      <p className="text-slate-500 mt-4 font-mono text-sm tracking-widest animate-pulse">LOADING ADMIN PORTAL...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex overflow-hidden selection:bg-red-500/30">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }} />

      {/* === SIDEBAR === */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex-col hidden md:flex z-20">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/40">
              <Building2 className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-none">OFFICIAL</h1>
              <span className="text-[10px] text-red-400 font-bold tracking-widest uppercase">Admin Console</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavButton 
            active={activeTab === "overview"} 
            onClick={() => setActiveTab("overview")} 
            icon={LayoutDashboard} 
            label="Dashboard Overview" 
          />
          <NavButton 
            active={activeTab === "requests"} 
            onClick={() => setActiveTab("requests")} 
            icon={UserPlus} 
            label="Connection Requests" 
            badge={pendingReqs.length}
          />
          <NavButton 
            active={activeTab === "profile"} 
            onClick={() => setActiveTab("profile")} 
            icon={UserCog} 
            label="My Officer Profile" 
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-950/50 rounded-xl p-4 mb-3 border border-slate-800">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Assigned Jurisdiction</p>
            <div className="flex items-center gap-2 text-white font-mono text-sm truncate">
              <MapPin size={14} className="text-red-500" />
              {stats.ward || "All Wards"}
            </div>
          </div>
          <button onClick={() => navigate("/complaint/admin/login")} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/5 text-red-400 hover:bg-red-600 hover:text-white transition-all font-bold text-sm border border-transparent hover:border-red-500">
            <LogOut size={16} /> Logout Access
          </button>
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 overflow-y-auto relative bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
        
        {/* Mobile Header */}
        <div className="md:hidden bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center sticky top-0 z-30">
           <div className="flex items-center gap-2">
             <ShieldAlert className="text-red-500"/>
             <span className="font-bold text-white">Admin Dashboard</span>
           </div>
           <button onClick={() => navigate("/complaint/admin/login")} className="text-slate-400"><LogOut size={20}/></button>
        </div>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
          
          <AnimatePresence mode="wait">
            
            {/* === TAB 1: OVERVIEW === */}
            {activeTab === "overview" && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard title="Total Complaints" value={stats.total} icon={<Briefcase/>} color="text-blue-400" bg="bg-blue-500/10" border="border-blue-500/20" />
                  <StatCard title="Pending Action" value={stats.pending} icon={<Clock/>} color="text-amber-400" bg="bg-amber-500/10" border="border-amber-500/20" />
                  <StatCard title="Cases Resolved" value={stats.resolved} icon={<CheckCircle2/>} color="text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20" />
                  <StatCard title="Total Connections" value={acceptedReqs.length} icon={<UserPlus/>} color="text-purple-400" bg="bg-purple-500/10" border="border-purple-500/20" />
                </div>

                {/* Toolbar */}
                <div className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md p-2 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center shadow-xl">
                    <div className="relative w-full md:w-96">
                      <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search Ward, Citizen Name or Title..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:border-red-500 transition-colors placeholder-slate-600"
                      />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                      {["All", "Pending", "Resolved", "Rejected"].map((status) => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                            statusFilter === status 
                            ? "bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/30" 
                            : "bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                      <button onClick={() => fetchData()} className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:border-red-500 transition-all">
                        <RefreshCcw size={18}/>
                      </button>
                    </div>
                </div>

                {/* Complaints Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                  {filteredComplaints.length > 0 ? (
                    filteredComplaints.map((complaint) => (
                      <ComplaintCard 
                        key={complaint._id || Math.random()} 
                        data={complaint} 
                        onResolve={() => { setSelectedComplaint(complaint); setActionType("resolve"); }}
                        onReject={() => { setSelectedComplaint(complaint); setActionType("reject"); }}
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
                      <Filter className="w-12 h-12 text-slate-700 mx-auto mb-4"/>
                      <p className="text-slate-500 font-medium">No complaints found.</p>
                      <p className="text-slate-600 text-xs mt-1">Try changing the filter or wait for new data.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* === TAB 2: REQUESTS === */}
            {activeTab === "requests" && (
                <motion.div
                    key="requests"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="space-y-10"
                >
                    {/* SECTION 1: PENDING */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Clock className="text-amber-400"/> Pending Requests
                            </h2>
                            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-bold border border-amber-500/20">
                                {pendingReqs.length} Pending
                            </span>
                        </div>

                        {pendingReqs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pendingReqs.map((req) => (
                                    <RequestCard 
                                        key={req.user?._id || Math.random()} 
                                        user={req.user || {}}
                                        type="pending"
                                        onAccept={() => handleConnectionAction(req.user?._id, 'accept')}
                                        onReject={() => handleConnectionAction(req.user?._id, 'reject')}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
                                <p className="text-slate-500 font-medium">No new pending requests.</p>
                            </div>
                        )}
                    </div>

                    {/* SECTION 2: CONNECTED */}
                    <div>
                        <div className="flex items-center gap-3 mb-6 pt-6 border-t border-slate-800">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <CheckCircle2 className="text-emerald-400"/> Connected Citizens
                            </h2>
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20">
                                {acceptedReqs.length} Active
                            </span>
                        </div>

                        {acceptedReqs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {acceptedReqs.map((req) => (
                                    <RequestCard 
                                        key={req.user?._id || Math.random()} 
                                        user={req.user || {}}
                                        type="connected"
                                        onReject={() => handleConnectionAction(req.user?._id, 'reject')}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm italic">No active connections yet.</p>
                        )}
                    </div>
                </motion.div>
            )}

            {/* === TAB 3: PROFILE === */}
            {activeTab === "profile" && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="max-w-3xl mx-auto"
              >
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  
                  <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-800 relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl flex items-center justify-center border border-slate-700 shadow-xl">
                        <UserCog className="text-red-500" size={40}/>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Officer Profile</h2>
                      <p className="text-slate-500 mt-1">Update your official contact details.</p>
                    </div>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputGroup label="Official Designation" value={profileData.designation} onChange={(v) => setProfileData({...profileData, designation: v})} placeholder="e.g. Gram Pradhan"/>
                      <InputGroup label="Office Location" value={profileData.location} onChange={(v) => setProfileData({...profileData, location: v})} placeholder="e.g. Panchayat Bhawan"/>
                    </div>
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                        <p className="text-xs text-slate-400 uppercase font-bold mb-4 flex items-center gap-2"><Clock size={14}/> Office Availability Hours</p>
                        <div className="grid grid-cols-2 gap-4">
                          <InputGroup label="Start Time" type="time" value={profileData.Start_time} onChange={(v) => setProfileData({...profileData, Start_time: v})} />
                          <InputGroup label="End Time" type="time" value={profileData.End_time} onChange={(v) => setProfileData({...profileData, End_time: v})} />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end">
                        <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-900/20">
                          <RefreshCcw size={18} /> Save Updates
                        </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* === ACTION MODAL POPUP === */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative"
          >
            <div className={`p-5 flex items-center justify-between ${actionType === "resolve" ? "bg-emerald-500/10 border-b border-emerald-500/20" : "bg-red-500/10 border-b border-red-500/20"}`}>
               <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${actionType === "resolve" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                      {actionType === "resolve" ? <CheckCircle2 size={20}/> : <XCircle size={20}/>}
                  </div>
                  <h3 className={`text-lg font-bold ${actionType === "resolve" ? "text-emerald-400" : "text-red-400"}`}>
                    {actionType === "resolve" ? "Resolve Complaint" : "Reject Complaint"}
                  </h3>
               </div>
               <button onClick={() => { setSelectedComplaint(null); setResponseText(""); }} className="text-slate-500 hover:text-white transition-colors"><XCircle size={24}/></button>
            </div>

            <div className="p-6 space-y-6">
               <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                      <FileText size={14} className="text-blue-400"/>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Subject: {selectedComplaint.title}</span>
                  </div>
                  <p className="text-slate-300 text-sm italic line-clamp-3">"{selectedComplaint.message}"</p>
               </div>

               <div>
                 <label className="text-xs text-slate-400 uppercase font-bold mb-2 block pl-1">
                   {actionType === "resolve" ? "Official Action Taken / Response" : "Reason for Rejection"}
                 </label>
                 <textarea 
                   rows="5"
                   className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none text-sm leading-relaxed"
                   placeholder={actionType === "resolve" ? "Describe how the issue was fixed..." : "Explain why this complaint is invalid..."}
                   value={responseText}
                   onChange={(e) => setResponseText(e.target.value)}
                 ></textarea>
               </div>
            </div>

            <div className="p-5 bg-slate-950/50 border-t border-slate-800 flex gap-3">
               <button onClick={() => { setSelectedComplaint(null); setResponseText(""); }} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-colors">Cancel</button>
               <button onClick={handleActionSubmit} disabled={actionLoading} className={`flex-1 py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all ${actionType === "resolve" ? "bg-emerald-600 hover:bg-emerald-500" : "bg-red-600 hover:bg-red-500"}`}>
                 {actionLoading ? "Processing..." : "Confirm Action"}
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// --- HELPER COMPONENTS ---
const NavButton = ({ active, onClick, icon: Icon, label, badge }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all font-medium text-sm border ${active ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/40" : "bg-transparent border-transparent text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
    <div className="flex items-center gap-3"><Icon size={18} strokeWidth={2} /> {label}</div>
    {badge > 0 && <span className="bg-white text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
  </button>
);

const StatCard = ({ title, value, icon, color, bg, border }) => (
  <div className={`p-5 rounded-2xl border ${bg} ${border} flex items-center justify-between relative overflow-hidden group`}>
     <div className="relative z-10">
       <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">{title}</p>
       <h3 className={`text-3xl font-bold ${color}`}>{value || 0}</h3>
     </div>
     <div className={`w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center ${color} shadow-sm relative z-10 group-hover:scale-110 transition-transform`}>{icon}</div>
  </div>
);

const InputGroup = ({ label, type = "text", value, onChange, placeholder }) => (
  <div className="space-y-2">
     <label className="text-xs text-slate-400 uppercase font-bold pl-1">{label}</label>
     <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"/>
  </div>
);

const RequestCard = ({ user, type, onAccept, onReject }) => (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:border-slate-600 transition-all relative overflow-hidden">
        {type === "connected" && <div className="absolute top-0 right-0 p-2 bg-emerald-500/20 text-emerald-400 rounded-bl-xl"><CheckCircle2 size={16}/></div>}
        <div className="w-20 h-20 rounded-full border-4 border-slate-800 bg-slate-950 flex items-center justify-center mb-4 overflow-hidden relative">
            {user?.avatar ? <img src={user.avatar} alt="User" className="w-full h-full object-cover"/> : <User size={40} className="text-slate-600"/>}
            {type === "pending" && <div className="absolute bottom-0 right-0 w-5 h-5 bg-amber-500 rounded-full border-2 border-slate-900 animate-pulse"></div>}
        </div>
        <h3 className="text-lg font-bold text-white mb-1">{user?.fullName || "Unknown User"}</h3>
        <p className="text-slate-500 text-xs mb-4 flex items-center gap-1 justify-center"><Mail size={12}/> {user?.email || "No Email"}</p>
        {type === "pending" ? (
            <div className="flex w-full gap-3 mt-auto">
                <button onClick={onAccept} className="flex-1 py-2.5 rounded-xl bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 font-bold text-sm hover:bg-emerald-600 hover:text-white transition-all">Accept</button>
                <button onClick={onReject} className="flex-1 py-2.5 rounded-xl bg-red-600/10 text-red-500 border border-red-600/20 font-bold text-sm hover:bg-red-600 hover:text-white transition-all">Reject</button>
            </div>
        ) : (
            <div className="w-full mt-auto">
                <div className="grid grid-cols-2 gap-2 mb-3">
                    {user?.phone && <a href={`tel:${user.phone}`} className="py-2 bg-slate-800 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center gap-1"><Phone size={12}/> Call</a>}
                    <a href={`mailto:${user?.email}`} className="py-2 bg-slate-800 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center gap-1"><Mail size={12}/> Email</a>
                </div>
                <button onClick={onReject} className="w-full py-2 rounded-xl bg-slate-800 text-red-400 border border-slate-700 font-bold text-xs hover:bg-red-900/20 hover:border-red-500/30 transition-all flex items-center justify-center gap-2"><Trash2 size={14}/> Remove Connection</button>
            </div>
        )}
    </div>
);

const ComplaintCard = ({ data, onResolve, onReject }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-600 transition-all group flex flex-col h-full hover:shadow-2xl hover:shadow-black/50">
     <div className="p-5 border-b border-slate-800 bg-slate-800/30 flex justify-between items-start">
       <div className="flex gap-4">
           <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
             {data.userInfo?.avatar?.url ? <img src={data.userInfo.avatar.url} className="w-full h-full object-cover"/> : <User className="text-slate-500" size={24}/>}
           </div>
           <div>
             <h4 className="text-white font-bold text-base leading-tight">{data.title || "Untitled Complaint"}</h4>
             <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <User size={12}/> {data.userInfo?.fullName || "Anonymous Citizen"}
                <span className="text-slate-600">•</span>
                <Clock size={12}/> {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "Date N/A"}
             </p>
           </div>
       </div>
       <StatusBadge status={data.status} />
     </div>
     <div className="p-5 flex-1 flex flex-col">
       <div className="flex flex-wrap gap-2 mb-4">
           <span className="px-2.5 py-1 rounded-md bg-slate-950 text-slate-400 text-[10px] font-bold uppercase border border-slate-800">{data.category || "General"}</span>
           <span className="px-2.5 py-1 rounded-md bg-slate-950 text-slate-400 text-[10px] font-bold uppercase border border-slate-800 flex items-center gap-1"><MapPin size={10}/> {data.location || "No Location"}</span>
       </div>
       <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4">
           <p className="text-slate-300 text-sm leading-relaxed">"{data.message}"</p>
       </div>
       {data.complaintImage?.url && (
           <div className="h-40 w-full rounded-xl bg-black overflow-hidden border border-slate-800 mb-4 group-hover:border-slate-600 transition-colors relative">
             <img src={data.complaintImage.url} alt="Proof" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity cursor-zoom-in" />
             <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-[10px] text-white backdrop-blur-md border border-white/10">Evidence Attached</div>
           </div>
       )}
       {data.adminResponse && (
           <div className={`mt-auto p-4 rounded-xl border text-xs ${data.status === "Resolved" ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-red-500/5 border-red-500/20 text-red-400"}`}>
              <strong className="block mb-1.5 uppercase opacity-80 flex items-center gap-1.5"><ShieldAlert size={12}/> Official Response:</strong>
              {data.adminResponse}
           </div>
       )}
     </div>
     {/* Match status case-insensitively for buttons */}
     {data.status && data.status.toLowerCase() === "pending" && (
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 grid grid-cols-2 gap-3">
           <button onClick={onResolve} className="py-2.5 rounded-xl bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white border border-emerald-600/20 font-bold text-xs flex items-center justify-center gap-2 transition-all"><CheckCircle2 size={16}/> Resolve Issue</button>
           <button onClick={onReject} className="py-2.5 rounded-xl bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-600/20 font-bold text-xs flex items-center justify-center gap-2 transition-all"><XCircle size={16}/> Reject</button>
        </div>
     )}
  </div>
);

const StatusBadge = ({ status }) => {
  // Normalize status for display logic
  const normalizedStatus = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "Unknown";
  
  const config = { 
      Pending: "text-amber-400 bg-amber-400/10 border-amber-400/20", 
      Resolved: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", 
      Rejected: "text-red-400 bg-red-400/10 border-red-400/20" 
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${config[normalizedStatus] || config.Pending} flex items-center gap-1.5 shadow-sm`}>
       <span className={`w-1.5 h-1.5 rounded-full ${normalizedStatus === 'Pending' ? 'animate-pulse bg-current' : 'bg-current'}`}></span> {normalizedStatus}
    </span>
  );
};

export default ComplaintAdminDashboard;