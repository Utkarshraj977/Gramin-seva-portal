import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { 
  MapPin, Clock, Search, Send, XOctagon, 
  Briefcase, Filter, Loader2, CheckCircle, XCircle, Zap, 
  Bell, LogOut, LayoutDashboard, ShieldCheck 
} from "lucide-react";

const CyberUserDashboard = () => {
  // --- STATE MANAGEMENT ---
  const [shops, setShops] = useState([]); 
  const [filteredShops, setFilteredShops] = useState([]); 
  const [myProfile, setMyProfile] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [searchTerm, setSearchTerm] = useState("");

  // --- API CONFIG ---
  const BASE_URL = "http://localhost:8000/api/v1/cyberuser";
  const token = localStorage.getItem("accessToken");

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });

  // --- 1. DATA FETCHING ---
  const fetchData = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);

      const [shopsRes, profileRes] = await Promise.all([
        axios.get(`${BASE_URL}/allcyber`, getHeaders()),
        axios.get(`${BASE_URL}/profile`, getHeaders()),
      ]);

      setShops(shopsRes.data.data);
      if (!searchTerm) { 
          setFilteredShops(shopsRes.data.data);
      }
      setMyProfile(profileRes.data.data);

    } catch (error) {
      console.error("Sync Error:", error);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  // --- 2. POLLING ---
  useEffect(() => {
    fetchData(false);
    const intervalId = setInterval(() => {
        fetchData(true); 
    }, 3000); 
    return () => clearInterval(intervalId);
  }, []);

  // --- 3. SEARCH LOGIC ---
  useEffect(() => {
    if (!searchTerm) {
      setFilteredShops(shops);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const results = shops.filter(shop => 
        (shop.location && shop.location.toLowerCase().includes(lowerTerm)) || 
        (shop.userInfo?.username && shop.userInfo.username.toLowerCase().includes(lowerTerm))
      );
      setFilteredShops(results);
    }
  }, [searchTerm, shops]);

  // --- 4. HELPERS ---
  const hasAppliedTo = (shop) => {
    if (!myProfile || !shop.cyberUsers) return false;
    return shop.cyberUsers.some(user => 
        String(user.userInfo?._id) === String(myProfile.userInfo?._id)
    );
  };

  // Helper to calculate total active applications
  const getActiveApplicationsCount = () => {
     if (!shops || !myProfile) return 0;
     return shops.filter(shop => hasAppliedTo(shop)).length;
  };

  const getStatusForShop = (shop) => {
    if (!myProfile || !shop.cyberUsers) return null;
    const myApplication = shop.cyberUsers.find(user => 
        String(user.userInfo?._id) === String(myProfile.userInfo?._id)
    );
    if (!myApplication) return null;

    const rawStatus = myApplication.status || myApplication.message || "pending";
    const status = rawStatus.toLowerCase();

    if (status === 'selected' || status === 'accepted') {
        return { 
            className: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.4)]", 
            text: "Approved", 
            icon: <CheckCircle size={14} className="text-emerald-400"/> 
        };
    } else if (status === 'rejected') {
        return { 
            className: "bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]", 
            text: "Rejected", 
            icon: <XCircle size={14} className="text-red-400"/> 
        };
    } else {
        return { 
            className: "bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.4)]", 
            text: "Pending", 
            icon: <Loader2 size={14} className="animate-spin text-amber-400"/> 
        };
    }
  };

  // --- 6. ACTIONS ---
  const handleApply = async (adminUsername) => {
    try {
      toast.loading("Sending Request...");
      await axios.post(`${BASE_URL}/apply/${adminUsername}`, {}, getHeaders());
      toast.dismiss();
      toast.success("Application Sent!");
      fetchData(true); 
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Application Failed");
    }
  };

  const handleWithdraw = async (adminUsername) => {
    if(!window.confirm(`Withdraw request from ${adminUsername}?`)) return;
    try {
      await axios.post(`${BASE_URL}/withdraw`, { adminUsername }, getHeaders());
      toast.success("Request Withdrawn");
      fetchData(true);
    } catch (error) {
      toast.error("Withdrawal Failed");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
      <Loader2 className="animate-spin text-blue-500 w-16 h-16" />
      <p className="mt-6 text-slate-400 font-medium tracking-wider animate-pulse">CONNECTING TO CYBER NETWORK...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 font-sans pb-12 text-slate-200">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' },
        }}
      />

      {/* --- HEADER (FULL & RICH) --- */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
                
                {/* LEFT: Logo & Brand */}
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                        <ShieldCheck size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-wide leading-none">
                            Gramin<span className="text-blue-400">Seva</span>
                        </h1>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">
                            Cyber Portal
                        </p>
                    </div>
                </div>

                {/* CENTER: Quick Stats (Hidden on small screens) */}
                <div className="hidden md:flex items-center gap-6 bg-slate-800/50 px-6 py-2 rounded-full border border-slate-700/50">
                    <div className="flex items-center gap-2">
                        <LayoutDashboard size={14} className="text-slate-400"/>
                        <span className="text-xs text-slate-400 font-medium">Available Shops:</span>
                        <span className="text-sm font-bold text-white">{shops.length}</span>
                    </div>
                    <div className="h-4 w-[1px] bg-slate-700"></div>
                    <div className="flex items-center gap-2">
                        <Zap size={14} className="text-yellow-400"/>
                        <span className="text-xs text-slate-400 font-medium">Your Active Requests:</span>
                        <span className="text-sm font-bold text-white">{getActiveApplicationsCount()}</span>
                    </div>
                </div>

                {/* RIGHT: User Profile & Actions */}
                <div className="flex items-center gap-6">
                   {/* Notification Icon */}
                   <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                   </button>

                   {/* User Profile */}
                   <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
                       <div className="text-right hidden sm:block">
                           <p className="text-sm font-bold text-white leading-tight">{myProfile?.userInfo?.username}</p>
                           <p className="text-xs text-blue-400 font-medium">{myProfile?.location || "User"}</p>
                       </div>
                       <div className="relative group cursor-pointer">
                          <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                          <div className="relative bg-slate-800 h-10 w-10 rounded-full flex items-center justify-center text-blue-400 font-bold border border-slate-700 shadow-sm">
                              {myProfile?.userInfo?.username?.charAt(0).toUpperCase()}
                          </div>
                       </div>
                   </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Search Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Briefcase className="text-blue-500" size={28}/> 
                  Find Cyber Centers
                </h2>
                <p className="text-slate-400 text-sm">Apply for printing, scanning, and online form services.</p>
            </div>
            
            <div className="relative w-full md:w-96 group">
              <div className="relative flex items-center bg-slate-900 rounded-xl border border-slate-800 group-focus-within:border-blue-500/50 transition-colors shadow-sm">
                  <Search className="absolute left-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search by name or location..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-transparent text-slate-200 placeholder-slate-600 border-none focus:ring-0 rounded-xl"
                  />
              </div>
            </div>
        </div>

        {/* Shop Grid */}
        {filteredShops.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-24 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
             <div className="bg-slate-800 p-4 rounded-full mb-4 shadow-inner">
                <Filter size={40} className="text-slate-600"/>
             </div>
             <h3 className="text-lg font-semibold text-slate-300">No Shops Found</h3>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredShops.map((shop) => {
              const isApplied = hasAppliedTo(shop);
              const statusBadge = getStatusForShop(shop); 

              return (
                <div key={shop._id} className="group relative bg-slate-900 rounded-2xl border border-slate-800 hover:border-blue-500/30 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10">
                  
                  {/* Image Area */}
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={shop.cyber_shopPic?.url || "https://images.unsplash.com/photo-1614064641938-3bcee529cf92?q=80&w=1000&auto=format&fit=crop"} 
                      alt="Cyber Shop" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                    
                    {/* Status Badge */}
                    {isApplied && statusBadge && (
                        <div className={`absolute top-3 right-3 z-10 ${statusBadge.className} px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md text-xs font-bold uppercase tracking-wider`}>
                          {statusBadge.icon} {statusBadge.text}
                        </div>
                    )}
                    
                    <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white truncate drop-shadow-lg group-hover:text-blue-400 transition-colors">
                            {shop.userInfo?.username}'s Hub
                        </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3 text-slate-400">
                            <div className="bg-slate-800 p-2 rounded-lg text-blue-500">
                                <MapPin size={16} />
                            </div>
                            <span className="font-medium truncate">{shop.location}</span>
                        </div>

                        <div className="flex items-center gap-3 text-slate-400">
                            <div className="bg-slate-800 p-2 rounded-lg text-orange-500">
                                <Clock size={16} />
                            </div>
                            <span className="font-medium">{shop.Start_time} - {shop.End_time}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto pt-6 border-t border-slate-800">
                      {isApplied ? (
                         <button 
                           onClick={() => handleWithdraw(shop.userInfo.username)}
                           className="relative w-full py-3 bg-transparent border border-red-500/50 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 overflow-hidden"
                         >
                           <XOctagon size={18}/> Withdraw Request
                         </button>
                      ) : (
                         <button 
                           onClick={() => handleApply(shop.userInfo.username)}
                           className="relative w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-600/40 flex items-center justify-center gap-2 group/btn"
                         >
                           <Send size={18} className="group-hover/btn:translate-x-1 transition-transform"/> Apply Now
                         </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CyberUserDashboard;