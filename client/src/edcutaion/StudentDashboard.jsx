import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { 
  BookOpen, Search, MapPin, IndianRupee, Clock, User, 
  CheckCircle, XCircle, Loader2, Send, Trash2, Edit3, X, Filter, 
  GraduationCap, RefreshCcw, Sparkles, ShieldCheck
} from "lucide-react";

const StudentDashboard = () => {
  // --- STATE ---
  const [dashboardData, setDashboardData] = useState(null);
  const [allTeachers, setAllTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("find"); 
  const [searchTerm, setSearchTerm] = useState("");
  
  // Profile Editing
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    clas: "", subject: "", board: "", location: ""
  });

  // --- API CONFIG ---
  const BASE_URL = "http://localhost:8000/api/v1/education/student";
  const token = localStorage.getItem("accessToken");

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });

  // --- 1. DATA FETCHING (No Cache) ---
  const fetchData = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);

      // Unique timestamp to prevent browser caching
      const t = new Date().getTime();

      const [dashRes, teachersRes] = await Promise.all([
        axios.get(`${BASE_URL}/dashboard?_t=${t}`, getHeaders()),
        axios.get(`${BASE_URL}/allteacher?_t=${t}`, getHeaders())
      ]);

      setDashboardData(dashRes.data.data);
      setAllTeachers(teachersRes.data.data);
      
      if (!isEditing && dashRes.data.data.profile) {
        setProfileForm({
            clas: dashRes.data.data.profile.clas || "",
            subject: dashRes.data.data.profile.subject || "",
            board: dashRes.data.data.profile.board || "",
            location: dashRes.data.data.profile.location || ""
        });
      }

    } catch (error) {
      console.error("Sync Error:", error);
      if(!isBackground) toast.error("Connection unstable");
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [isEditing]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // --- 2. SEARCH LOGIC ---
  useEffect(() => {
    let baseList = activeTab === "find" ? allTeachers : [];
    
    if (activeTab === "my" && dashboardData?.appliedTeachers) {
        // Filter to show only teachers I applied to, but get fresh data from allTeachers
        baseList = allTeachers.filter(t => 
            dashboardData.appliedTeachers.some(at => String(at._id) === String(t._id))
        );
    }

    let results = baseList;
    if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        results = results.filter(t => 
            t.userInfo?.fullname?.toLowerCase().includes(lower) ||
            t.subject?.toLowerCase().includes(lower) ||
            t.location?.toLowerCase().includes(lower) ||
            t.board?.toLowerCase().includes(lower)
        );
    }
    setFilteredTeachers(results);
  }, [searchTerm, allTeachers, dashboardData, activeTab]);

  // --- 3. ACTIONS ---
  const handleApply = async (username) => {
    try {
        toast.loading("Sending application...");
        await axios.post(`${BASE_URL}/apply/${username}`, {}, getHeaders());
        toast.dismiss();
        toast.success("Application Sent!");
        fetchData(true);
    } catch (error) {
        toast.dismiss();
        toast.error(error.response?.data?.message || "Failed to apply");
    }
  };

  const handleWithdraw = async (username) => {
    if(!window.confirm("Are you sure you want to withdraw?")) return;
    try {
        await axios.post(`${BASE_URL}/withdraw/${username}`, {}, getHeaders());
        toast.success("Withdrawn successfully");
        fetchData(true);
    } catch (error) {
        toast.error("Failed to withdraw");
    }
  };

  const handleProfileUpdate = async () => {
    try {
        await axios.patch(`${BASE_URL}/profile/update`, profileForm, getHeaders());
        toast.success("Profile Updated");
        setIsEditing(false);
        fetchData(true);
    } catch (error) {
        toast.error("Update Failed");
    }
  };

  // --- 4. ADVANCED STATUS CHECKER (Logic Fix) ---
  const getApplicationStatus = (teacher) => {
      if (!dashboardData?.profile || !teacher) return { isApplied: false, status: null };

      // Helper: Convert to String safely
      const safeStr = (val) => (val ? String(val) : "");

      const myProfileId = safeStr(dashboardData.profile._id);
      const myUserId = safeStr(dashboardData.profile.userInfo?._id);

      // 1. Check inside Teacher's Students Array
      if (teacher.students && Array.isArray(teacher.students)) {
          const match = teacher.students.find(s => {
              const s_pid = s.student?._id ? safeStr(s.student._id) : safeStr(s.student);
              const s_uid = s.userInfo?._id ? safeStr(s.userInfo._id) : safeStr(s.userInfo);
              return (s_pid === myProfileId || s_uid === myUserId);
          });

          if (match) {
              return { isApplied: true, status: match.message || "pending" };
          }
      }

      // 2. Fallback: Check my applied list
      const inMyList = dashboardData.appliedTeachers?.some(t => safeStr(t._id) === safeStr(teacher._id));
      if (inMyList) {
          return { isApplied: true, status: "pending" };
      }

      return { isApplied: false, status: null };
  };


  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
       <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
       <p className="text-slate-500 mt-4 tracking-widest text-xs uppercase animate-pulse">Loading Education Portal...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-12 selection:bg-blue-500/30">
      <Toaster position="top-right" toastOptions={{ style: { background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }}} />

      {/* --- HERO HEADER --- */}
      <div className="relative bg-slate-900 border-b border-slate-800 pt-8 pb-16 px-4 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20">
                    <BookOpen className="text-white h-8 w-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Student Portal</h1>
                    <p className="text-slate-400">Find expert tutors & manage classes</p>
                </div>
            </div>

            {/* Current User Card */}
            <div className="flex items-center gap-4 bg-slate-800/80 p-2 pr-6 rounded-full border border-slate-700/50 backdrop-blur-md shadow-xl">
                <div className="h-12 w-12 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 to-purple-500">
                    <div className="h-full w-full rounded-full bg-slate-900 overflow-hidden">
                        {dashboardData?.profile?.userInfo?.avatar?.url ? (
                            <img src={dashboardData.profile.userInfo.avatar.url} alt="User" className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center font-bold text-white">
                                {dashboardData?.profile?.userInfo?.fullname?.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <h3 className="text-white font-medium text-sm">{dashboardData?.profile?.userInfo?.fullname}</h3>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Online</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        
        {/* STATS & PROFILE SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
             
             {/* Stats Card */}
             <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-blue-500/30 transition-all group">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Active Applications</p>
                        <h3 className="text-4xl font-bold text-white mt-2 group-hover:text-blue-400 transition-colors">
                            {dashboardData?.stats?.totalApplications || 0}
                        </h3>
                        <p className="text-xs text-slate-500 mt-2">Requests currently pending or active</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <Send size={24}/>
                    </div>
                </div>
             </div>

             {/* Profile Details Card */}
             <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <GraduationCap className="text-blue-500" size={20}/> Academic Profile
                    </h3>
                    <button onClick={() => setIsEditing(!isEditing)} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 border border-slate-700">
                        {isEditing ? <X size={14}/> : <Edit3 size={14}/>} {isEditing ? "Cancel" : "Edit"}
                    </button>
                </div>
                
                {isEditing ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-300 relative z-10">
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase">Class</label>
                            <input value={profileForm.clas} onChange={e=>setProfileForm({...profileForm, clas: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"/>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase">Subject</label>
                            <input value={profileForm.subject} onChange={e=>setProfileForm({...profileForm, subject: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"/>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase">Board</label>
                            <input value={profileForm.board} onChange={e=>setProfileForm({...profileForm, board: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"/>
                        </div>
                        <div className="flex items-end">
                            <button onClick={handleProfileUpdate} className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors">Save Details</button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-6 md:gap-12 relative z-10">
                        <div><p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Class</p><p className="text-white font-medium text-lg">{dashboardData?.profile?.clas || "Not Set"}</p></div>
                        <div><p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Board</p><p className="text-white font-medium text-lg">{dashboardData?.profile?.board || "Not Set"}</p></div>
                        <div><p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Subject</p><span className="text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded text-sm font-medium border border-blue-500/20">{dashboardData?.profile?.subject || "Not Set"}</span></div>
                        <div><p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Location</p><p className="text-white font-medium text-lg flex items-center gap-1"><MapPin size={14} className="text-slate-500"/> {dashboardData?.profile?.location || "Not Set"}</p></div>
                    </div>
                )}
             </div>
        </div>

        {/* --- CONTROLS SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-sm">
                <button 
                  onClick={() => setActiveTab("find")} 
                  className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === "find" ? "bg-slate-800 text-white shadow-sm ring-1 ring-slate-700" : "text-slate-400 hover:text-white"}`}
                >
                    All Teachers
                </button>
                <button 
                  onClick={() => setActiveTab("my")} 
                  className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === "my" ? "bg-slate-800 text-white shadow-sm ring-1 ring-slate-700" : "text-slate-400 hover:text-white"}`}
                >
                    My Applications
                </button>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
                 <button onClick={() => fetchData()} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all shadow-sm" title="Refresh Data">
                    <RefreshCcw size={20} />
                 </button>
                <div className="relative flex-1 md:w-80">
                    <Search className="absolute left-3 top-3 text-slate-500" size={18}/>
                    <input 
                      type="text" 
                      placeholder="Search teachers by name or subject..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-white pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-600 shadow-sm"
                    />
                </div>
            </div>
        </div>

        {/* --- TEACHER CARDS GRID --- */}
        {filteredTeachers.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl p-16 text-center">
                <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="h-8 w-8 text-slate-600" />
                </div>
                <h3 className="text-slate-300 font-medium text-lg">No teachers found</h3>
                <p className="text-slate-500 mt-2 max-w-sm mx-auto">We couldn't find any teachers matching your current filters. Try changing tabs or keywords.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                {filteredTeachers.map((teacher) => {
                    const { isApplied, status } = getApplicationStatus(teacher);
                    
                    const st = status ? status.toLowerCase() : "";
                    const isSelected = st === 'selected' || st === 'accepted' || st === 'enrolled';
                    const isRejected = st === 'rejected';

                    return (
                        <div key={teacher._id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 hover:border-slate-700 transition-all duration-300 group flex flex-col relative">
                            
                            {/* Card Header (Cover) */}
                            <div className="relative h-32 bg-slate-800 overflow-hidden">
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-slate-900/60 to-slate-900"></div>
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                
                                {/* Status Badge (Top Right) */}
                                {isApplied && (
                                    <div className="absolute top-4 right-4 z-20">
                                        <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg border flex items-center gap-1.5
                                            ${isSelected ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                                              isRejected ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                                              'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                                            {isSelected ? <ShieldCheck size={12}/> : isRejected ? <XCircle size={12}/> : <Clock size={12}/>}
                                            {isSelected ? "Enrolled" : isRejected ? "Rejected" : "Pending"}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profile Image (Overlapping) */}
                            <div className="px-6 relative -mt-14 flex justify-between items-end">
                                <div className="relative">
                                    <div className="h-24 w-24 rounded-2xl bg-slate-800 p-1.5 border border-slate-700 shadow-xl group-hover:scale-105 transition-transform duration-300">
                                        <div className="h-full w-full rounded-xl bg-slate-900 overflow-hidden relative">
                                            {teacher.userInfo?.avatar?.url ? (
                                                <img src={teacher.userInfo.avatar.url} alt="Teacher" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 text-slate-400 font-bold text-3xl">
                                                    {teacher.userInfo?.fullname?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Verified Badge */}
                                    <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-full border-4 border-slate-900" title="Verified Teacher">
                                        <Sparkles size={12} fill="white"/>
                                    </div>
                                </div>

                                <div className="text-right mb-2">
                                    <div className="text-2xl font-bold text-white tracking-tight">₹{teacher.fee}</div>
                                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider bg-slate-800 px-2 py-0.5 rounded-md inline-block">Per Month</div>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6 pt-4 flex-1 flex flex-col">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors truncate">{teacher.userInfo?.fullname}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-md font-medium">{teacher.subject}</span>
                                        <span className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-2.5 py-1 rounded-md">{teacher.board}</span>
                                        <span className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-2.5 py-1 rounded-md">{teacher.category}</span>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8 flex-1">
                                    <div className="flex items-center gap-3 text-sm text-slate-400 bg-slate-800/50 p-2 rounded-lg border border-slate-800/50">
                                        <MapPin size={16} className="text-blue-500"/> 
                                        <span className="truncate">{teacher.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-400 bg-slate-800/50 p-2 rounded-lg border border-slate-800/50">
                                        <Clock size={16} className="text-orange-500"/> 
                                        <span className="truncate">{teacher.Start_time} - {teacher.End_time}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-400 bg-slate-800/50 p-2 rounded-lg border border-slate-800/50">
                                        <BookOpen size={16} className="text-purple-500"/> 
                                        <span className="truncate">{teacher.Experience} Experience</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {isApplied ? (
                                    <button 
                                      onClick={() => handleWithdraw(teacher.userInfo.username)}
                                      className="w-full py-3.5 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 text-slate-400 rounded-xl font-medium transition-all border border-slate-700 flex justify-center items-center gap-2 group/btn"
                                    >
                                        <Trash2 size={18} className="group-hover/btn:text-red-500 transition-colors"/> Withdraw Application
                                    </button>
                                ) : (
                                    <button 
                                      onClick={() => handleApply(teacher.userInfo.username)}
                                      className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <Send size={18}/> Apply Now
                                    </button>
                                )}
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

export default StudentDashboard;