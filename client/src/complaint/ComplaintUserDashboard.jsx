import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
// ✅ Ensure this path matches your file structure
import ChatRoom from '../Chat/ChatRoom'; 
import { 
  Shield, Search, MessageSquare, Siren, 
  UserPlus, Clock, CheckCircle, MapPin, 
  Loader2, AlertTriangle, X
} from "lucide-react";

const ComplaintUserDashboard = () => {
  // --- STATE ---
  const [allAdmins, setAllAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [myRequest, setMyRequest] = useState(null); // { requestStatus: 'pending'|'accepted', assignedAdmin: {...} }
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Chat State
  const [chatOpen, setChatOpen] = useState(false);

  // --- API CONFIG ---
  const BASE_URL = "http://localhost:8000/api/v1";
  const token = localStorage.getItem("accessToken");

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      // 1. Get Current User (for ID)
      const userRes = await axios.get(`${BASE_URL}/users/current-user`, getHeaders());
      setCurrentUser(userRes.data.data);

      // 2. Get All Officers (Admins)
      const adminsRes = await axios.get(`${BASE_URL}/ComplaintAdmin/allcomplaint`, getHeaders());
      const adminsList = adminsRes.data.data || [];
      setAllAdmins(adminsList);
      
      if(!searchTerm) setFilteredAdmins(adminsList);

      // 3. Get My Request Status
      // (Backend must return: { requestStatus: '...', assignedAdmin: { _id, ... } })
      const statusRes = await axios.get(`${BASE_URL}/complaintuser/my-status`, getHeaders());
      setMyRequest(statusRes.data.data);

    } catch (error) {
      console.error("Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Poll for updates (Real-time status changes)
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Search Logic
  useEffect(() => {
    if (!searchTerm) {
      setFilteredAdmins(allAdmins);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredAdmins(allAdmins.filter(a => 
        (a.location?.toLowerCase().includes(lower)) || 
        (a.category?.toLowerCase().includes(lower)) ||
        (a.userInfo?.fullname?.toLowerCase().includes(lower))
      ));
    }
  }, [searchTerm, allAdmins]);

  // --- HANDLERS ---
  const handleConnect = async (adminId) => {
    // Prompt for a reason/message
    const message = prompt("Please describe your emergency or complaint briefly:");
    if (!message) return;

    try {
      toast.loading("Sending Alert...");
      await axios.post(`${BASE_URL}/complaintuser/select-user/${adminId}`, { message }, getHeaders());
      toast.dismiss();
      toast.success("Complaint Registered. Waiting for Officer.");
      fetchData(); 
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  };

  // --- RENDER HELPERS ---
  const getAdminStatus = (adminId) => {
    // Check if this specific admin is the one assigned to me
    if (myRequest?.assignedAdmin?._id === adminId) {
       return myRequest.requestStatus; // 'pending' or 'accepted'
    }
    // If I have an active request with SOMEONE ELSE, disable everyone else
    if (myRequest?.assignedAdmin) return 'disabled';
    
    return 'available';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12 relative">
      <Toaster position="top-center" />

      {/* --- HEADER --- */}
      <header className="bg-white sticky top-0 z-20 shadow-sm border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <div className="bg-red-600 p-2 rounded-lg text-white shadow-red-200 shadow-lg">
                    <Siren size={24} className="animate-pulse" />
                </div>
                <div>
                    <h1 className="text-xl font-extrabold text-slate-800 hidden md:block tracking-tight">
                        Citizen<span className="text-red-600">Safe</span>
                    </h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden md:block">Emergency Response Portal</p>
                </div>
            </div>

            <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search Departments or Locations..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-full border-none focus:ring-2 focus:ring-red-500 outline-none transition-all"
                />
            </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        
        {/* --- SECTION 1: ACTIVE EMERGENCY (Top Card) --- */}
        <AnimatePresence>
        {myRequest?.requestStatus === 'accepted' && myRequest.assignedAdmin && (
            <motion.div 
                initial={{y:-20, opacity:0}} animate={{y:0, opacity:1}} 
                className="mb-10 bg-emerald-600 rounded-3xl p-1 shadow-2xl shadow-emerald-200"
            >
                <div className="bg-white rounded-[20px] p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-24 bg-emerald-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="flex gap-5">
                            <div className="h-24 w-24 rounded-2xl bg-slate-100 border-4 border-emerald-50 flex items-center justify-center text-4xl shadow-sm">
                                👮‍♂️
                            </div>
                            <div>
                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit mb-2 border border-emerald-200">
                                    <CheckCircle size={14}/> Case Active
                                </span>
                                <h2 className="text-2xl font-bold text-slate-800">
                                    Officer {myRequest.assignedAdmin.userInfo?.fullname}
                                </h2>
                                <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                                    <Shield size={16} className="text-emerald-500"/> 
                                    {myRequest.assignedAdmin.category || "General Unit"}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <button 
                                onClick={() => setChatOpen(true)}
                                className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95"
                            >
                                <MessageSquare size={18}/> Secure Chat
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
        </AnimatePresence>

        {/* --- SECTION 2: AVAILABLE OFFICERS GRID --- */}
        <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Shield className="text-slate-400" size={20}/>
            <h2 className="text-lg font-bold text-slate-700">Available Authorities</h2>
        </div>

        {loading ? (
           <div className="flex justify-center py-20"><Loader2 className="animate-spin text-red-600" size={32}/></div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAdmins.filter(a => a._id !== myRequest?.assignedAdmin?._id).map((admin) => {
                    const status = getAdminStatus(admin._id);

                    return (
                        <motion.div 
                            key={admin._id} 
                            initial={{opacity:0, y:10}} 
                            animate={{opacity:1, y:0}} 
                            className={`bg-white rounded-2xl p-5 border shadow-sm hover:shadow-xl transition-all group ${status === 'disabled' ? 'opacity-50 grayscale' : 'border-gray-100 hover:border-red-100'}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={admin.userInfo?.avatar?.url || "https://ui-avatars.com/api/?name=Officer"} 
                                        className="h-14 w-14 rounded-2xl bg-slate-100 object-cover border border-slate-200"
                                        alt="Officer"
                                    />
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg leading-tight">{admin.userInfo?.fullname}</h3>
                                        <p className="text-xs text-red-500 font-bold uppercase tracking-wider mt-1">
                                            {admin.category || "Police Dept"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 rounded-xl p-3 mb-5 border border-slate-100">
                                <p className="text-slate-500 text-sm flex items-center gap-2">
                                    <MapPin size={16} className="text-slate-400"/> 
                                    <span className="truncate font-medium">{admin.location}</span>
                                </p>
                                <p className="text-slate-400 text-xs mt-1 ml-6">
                                    Active: {admin.Start_time} - {admin.End_time}
                                </p>
                            </div>

                            <div className="mt-auto">
                                {status === 'pending' ? (
                                    <button disabled className="w-full py-3 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl font-bold text-sm flex items-center justify-center gap-2 animate-pulse cursor-wait">
                                        <Clock size={18}/> Request Pending...
                                    </button>
                                ) : status === 'disabled' ? (
                                    <button disabled className="w-full py-3 bg-gray-100 text-gray-400 border border-gray-200 rounded-xl font-bold text-sm cursor-not-allowed">
                                        Unavailable (Case Active)
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleConnect(admin._id)} 
                                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-600 transition-colors shadow-lg shadow-slate-200 group-hover:shadow-red-200"
                                    >
                                        <AlertTriangle size={18} className="text-red-500 group-hover:text-white transition-colors"/> 
                                        Report Complaint
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        )}
      </main>

      {/* --- CHAT MODAL --- */}
      {chatOpen && myRequest?.assignedAdmin && currentUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="relative w-full max-w-lg h-[80vh] flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20">
               {/* Chat Header */}
               <div className="bg-slate-900 p-4 flex justify-between items-center border-b border-slate-800 z-10">
                   <div className="flex items-center gap-3">
                       <div className="relative">
                           <img 
                                src={myRequest.assignedAdmin.userInfo?.avatar?.url || "https://ui-avatars.com/api/?name=Officer"} 
                                className="w-10 h-10 rounded-full border border-slate-600 object-cover bg-slate-800"
                                alt="Officer"
                           />
                           <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900"></div>
                       </div>
                       <div>
                           <h3 className="font-bold text-white leading-none">Officer {myRequest.assignedAdmin.userInfo?.fullname}</h3>
                           <span className="text-xs text-blue-400 font-medium">Secure Line Encrypted</span>
                       </div>
                   </div>
                   <button onClick={() => setChatOpen(false)} className="hover:bg-slate-800 p-2 rounded-full transition text-slate-400 hover:text-white"><X size={20}/></button>
               </div>
               
               <div className="flex-1 overflow-hidden bg-slate-100 relative">
                   <ChatRoom 
                      // 🔐 CRITICAL: Room ID must match Admin's logic: [AdminID, UserID].sort().join("-")
                      roomId={[String(myRequest.assignedAdmin._id), String(currentUser._id)].sort().join("-")}
                      
                      currentUser={{ 
                          name: currentUser.fullname, 
                          id: currentUser._id 
                      }}
                      targetUser={{ 
                          name: myRequest.assignedAdmin.userInfo?.fullname, 
                          avatar: myRequest.assignedAdmin.userInfo?.avatar?.url 
                      }}
                   />
               </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintUserDashboard;