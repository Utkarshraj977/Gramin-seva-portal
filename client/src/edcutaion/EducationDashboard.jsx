import React, { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { 
  Users, GraduationCap, IndianRupee, Clock, MapPin, 
  Search, CheckCircle, XCircle, Loader2, Edit3, Save, X, 
  BookOpen, Trash2, TrendingUp, Phone, Mail, 
  MessageCircle, ShieldCheck
} from "lucide-react";

// ✅ Import centralized API service
import { education } from "../services/api";

// ⚠️ CHECK THIS PATH: If ChatRoom.jsx is in the same folder, use "./ChatRoom"
import ChatRoom from "../Chat/ChatRoom";

const EducationDashboard = () => {
  // --- STATE ---
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    pendingRequests: 0,
    estimatedEarnings: 0,
    fee: 0,
    location: "",
    timings: ""
  });
  
  const [activeList, setActiveList] = useState([]);
  const [enquiryList, setEnquiryList] = useState([]);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("active"); // 'active' | 'requests'
  const [searchTerm, setSearchTerm] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  
  // Teacher Data
  const [teacherProfile, setTeacherProfile] = useState(null);

  // Profile Edit
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({ fee: "", location: "", Start_time: "", End_time: "" });

  // --- 1. DATA FETCHING ---
  const fetchDashboardData = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);

      // ✅ Use education service methods (No manual headers needed if using Cookies/Interceptor)
      const [statsRes, studentsRes] = await Promise.all([
        education.get_stats(),
        education.get_all_students({}) // Pass empty filter object
      ]);

      const sData = statsRes.data; // api.js returns response.data directly
      setStats(sData);

      // Auto-set teacher profile if available in stats
      if (sData.teacherProfile || sData.userInfo) {
          setTeacherProfile(sData.teacherProfile || sData.userInfo);
      }

      if (!isEditing) {
          const [start, end] = sData.timings ? sData.timings.split(" - ") : ["", ""];
          setProfileData({
            fee: sData.fee,
            location: sData.location,
            Start_time: start,
            End_time: end
          });
      }

      const allStudents = studentsRes.data || []; // api.js returns response.data

      // Filter Logic
      const active = [];
      const pending = [];

      allStudents.forEach(student => {
          const rawStatus = student.message || student.status || "pending";
          const status = rawStatus.toLowerCase();

          if (['accepted', 'enrolled', 'selected', 'success'].includes(status)) {
              active.push(student);
          } else {
              pending.push(student);
          }
      });

      setActiveList(active);
      setEnquiryList(pending);

    } catch (error) {
      console.error("Dashboard Error:", error);
      if(!isBackground) toast.error("Failed to sync dashboard");
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [isEditing]);

  const fetchTeacherProfile = useCallback(async () => {
      if (teacherProfile) return; 

      try {
          // ✅ Use education service
          const res = await education.get_current_teacher(); 
          if(res.data) {
             setTeacherProfile(res.data);
             return;
          }
      } catch (e) {
          console.warn("User profile fetch failed.");
      }
      
      try {
        const localUser = localStorage.getItem("user");
        if(localUser) setTeacherProfile(JSON.parse(localUser));
      } catch(e) {}

  }, [teacherProfile]);

  useEffect(() => {
    fetchDashboardData();
    fetchTeacherProfile();
    const interval = setInterval(() => fetchDashboardData(true), 5000);
    return () => clearInterval(interval);
  }, [fetchDashboardData, fetchTeacherProfile]);

  // --- 2. ACTION HANDLERS ---
  const handleAction = async (username, type) => {
    if(!username) return toast.error("User data missing");
    
    const msg = type === "remove" 
        ? "This will permanently remove the student. Continue?" 
        : `Are you sure you want to ${type} this student?`;

    if(!window.confirm(msg)) return;

    try {
      toast.loading("Processing...");
      
      // ✅ Use specialized API methods from api.js
      if (type === "accept") {
        await education.accept_student(username);
      } else if (type === "reject") {
        await education.reject_student(username);
      } else if (type === "remove") {
        await education.remove_student(username);
      }

      toast.dismiss();
      toast.success(`Action Successful: ${type}`);
      fetchDashboardData(true);
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Action Failed");
    }
  };

  const handleUpdateProfile = async () => {
    try {
        toast.loading("Updating Profile...");
        // ✅ Use education service
        await education.update_profile(profileData);
        toast.dismiss();
        toast.success("Profile Updated");
        setIsEditing(false);
        fetchDashboardData(true);
    } catch (error) {
        toast.dismiss();
        toast.error("Update Failed");
    }
  };

  const openChat = async (student) => {
    if (!teacherProfile?._id) {
        toast.error("Error: Teacher ID missing. Refreshing...");
        fetchTeacherProfile();
        return;
    }
    if (!student?.userInfo?._id) {
        toast.error("Error: Student ID is missing.");
        return;
    }
    setActiveChat(student);
  };

  const getDisplayList = () => {
      const list = currentTab === "active" ? activeList : enquiryList;
      if (!searchTerm) return list;
      const lower = searchTerm.toLowerCase();
      return list.filter(s => 
        (s.userInfo?.fullname && s.userInfo.fullname.toLowerCase().includes(lower)) ||
        (s.subject && s.subject.toLowerCase().includes(lower))
      );
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
       <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
       <p className="text-slate-500 mt-4 tracking-widest text-xs uppercase animate-pulse">Loading Classroom...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-12 relative">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }}} />

      {/* --- CHAT MODAL --- */}
      {activeChat && teacherProfile && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 w-full max-w-2xl h-[600px] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col relative">
                <div className="bg-slate-800 border-b border-slate-700 p-3 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600/20 p-2 rounded-full">
                            <MessageCircle size={18} className="text-blue-400"/>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-sm">Chatting with {activeChat.userInfo?.fullname || "Student"}</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                <span className="text-[10px] text-slate-400">Online • {activeChat.clas}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setActiveChat(null)} className="p-2 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-hidden relative bg-slate-950">
                    <ChatRoom 
                        roomId={[String(teacherProfile._id), String(activeChat.userInfo._id)].sort().join("-")}
                        currentUser={{
                            id: teacherProfile._id,
                            name: teacherProfile.fullname || "Teacher",
                            avatar: teacherProfile.avatar?.url
                        }}
                        targetUser={{
                            id: activeChat.userInfo._id,
                            name: activeChat.userInfo.fullname || "Student",
                            avatar: activeChat.userInfo.avatar?.url
                        }} 
                    />
                </div>
            </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/20">
                    <GraduationCap className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Teacher Admin</h1>
                    <p className="text-xs text-slate-400 font-medium">Manage Batch & Earnings</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm text-white font-medium">{teacherProfile?.fullname || "Teacher"}</p>
                        <p className="text-[10px] text-slate-500">Instructor</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                        {teacherProfile?.avatar?.url ? (
                            <img src={teacherProfile.avatar.url} alt="Profile" className="h-full w-full object-cover"/>
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-slate-500 font-bold bg-slate-800">T</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        
        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard icon={<Users/>} title="Total Students" value={stats.totalStudents} color="text-blue-400" bg="bg-blue-500/10" border="border-blue-500/20" />
            <StatCard icon={<CheckCircle/>} title="Active Students" value={stats.activeStudents} color="text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20" />
            <StatCard icon={<Clock/>} title="Pending Requests" value={stats.pendingRequests} color="text-amber-400" bg="bg-amber-500/10" border="border-amber-500/20" />
            <StatCard icon={<IndianRupee/>} title="Est. Earnings" value={`₹${stats.estimatedEarnings}`} color="text-purple-400" bg="bg-purple-500/10" border="border-purple-500/20" />
        </div>

        {/* --- PROFILE CONFIG --- */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="text-blue-500" size={20}/> Class Configuration
                </h2>
                <button onClick={() => setIsEditing(!isEditing)} className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1 transition-colors">
                    {isEditing ? <X size={14}/> : <Edit3 size={14}/>} {isEditing ? "Cancel" : "Edit"}
                </button>
            </div>

            {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in duration-300">
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500 ml-1">Monthly Fee (₹)</label>
                        <input type="number" value={profileData.fee} onChange={(e) => setProfileData({...profileData, fee: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors"/>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500 ml-1">Location</label>
                        <input type="text" value={profileData.location} onChange={(e) => setProfileData({...profileData, location: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors"/>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500 ml-1">Time Slot (Start - End)</label>
                        <div className="flex gap-2">
                             <input type="text" placeholder="10:00" value={profileData.Start_time} onChange={(e) => setProfileData({...profileData, Start_time: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-white outline-none focus:border-blue-500"/>
                             <input type="text" placeholder="12:00" value={profileData.End_time} onChange={(e) => setProfileData({...profileData, End_time: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-white outline-none focus:border-blue-500"/>
                        </div>
                    </div>
                    <div className="flex items-end">
                        <button onClick={handleUpdateProfile} className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-6 py-2 flex items-center justify-center gap-2 transition-colors">
                            <Save size={18}/> Save Changes
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-wrap gap-4 md:gap-8 text-sm text-slate-400">
                    <div className="flex items-center gap-3 bg-slate-950/50 px-4 py-2 rounded-lg border border-slate-800">
                        <div className="bg-slate-800 p-1.5 rounded text-blue-400"><IndianRupee size={16}/></div>
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase">Fee</p>
                            <p className="text-white font-medium">₹{stats.fee} <span className="text-slate-600 text-xs">/month</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-950/50 px-4 py-2 rounded-lg border border-slate-800">
                        <div className="bg-slate-800 p-1.5 rounded text-orange-400"><MapPin size={16}/></div>
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase">Location</p>
                            <p className="text-white font-medium">{stats.location || "Not Set"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-950/50 px-4 py-2 rounded-lg border border-slate-800">
                        <div className="bg-slate-800 p-1.5 rounded text-purple-400"><Clock size={16}/></div>
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase">Schedule</p>
                            <p className="text-white font-medium">{stats.timings || "Not Set"}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* --- TABS --- */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm mb-20">
            <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 w-full md:w-auto">
                    <button 
                        onClick={() => setCurrentTab("active")}
                        className={`flex-1 md:flex-none px-6 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2
                        ${currentTab === "active" ? "bg-slate-800 text-white shadow-sm ring-1 ring-slate-700" : "text-slate-400 hover:text-white"}`}
                    >
                       <ShieldCheck size={16} className={currentTab === "active" ? "text-emerald-500" : ""}/> 
                       Classroom <span className="ml-1 bg-slate-700/50 px-1.5 rounded text-[10px]">{activeList.length}</span>
                    </button>
                    <button 
                        onClick={() => setCurrentTab("requests")}
                        className={`flex-1 md:flex-none px-6 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2
                        ${currentTab === "requests" ? "bg-slate-800 text-white shadow-sm ring-1 ring-slate-700" : "text-slate-400 hover:text-white"}`}
                    >
                       <BookOpen size={16} className={currentTab === "requests" ? "text-amber-500" : ""}/> 
                       Enquiries <span className="ml-1 bg-slate-700/50 px-1.5 rounded text-[10px]">{enquiryList.length}</span>
                    </button>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-2.5 text-slate-500" size={18}/>
                    <input 
                      type="text" 
                      placeholder="Search student name..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-xl outline-none focus:border-blue-500 transition-colors placeholder-slate-600 text-sm"
                    />
                </div>
            </div>

            {/* Content Table */}
            <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-left">
                    <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Student Profile</th>
                            <th className="px-6 py-4">Contact Info</th>
                            <th className="px-6 py-4">Academic Details</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm">
                        {getDisplayList().length > 0 ? (
                            getDisplayList().map((student) => (
                                <tr key={student._id} className="hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {student.userInfo?.avatar?.url ? (
                                                <img src={student.userInfo.avatar.url} alt="User" className="h-10 w-10 rounded-full object-cover border border-slate-700"/>
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold text-lg border border-blue-500/20">
                                                    {student.userInfo?.fullname?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-white">{student.userInfo?.fullname || "Unknown"}</div>
                                                <div className="text-xs text-slate-500">@{student.userInfo?.username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 text-slate-400">
                                            {student.userInfo?.phone && <div className="flex items-center gap-2"><Phone size={12}/> {student.userInfo.phone}</div>}
                                            {student.userInfo?.email && <div className="flex items-center gap-2"><Mail size={12}/> {student.userInfo.email}</div>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-slate-300">{student.clas} • {student.board}</div>
                                        <div className="text-xs text-blue-400 mt-0.5">{student.subject}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            {currentTab === "active" ? (
                                                <>
                                                    <button onClick={() => openChat(student)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
                                                        <MessageCircle size={14}/> Chat
                                                    </button>
                                                    <button onClick={() => handleAction(student.userInfo?.username, "remove")} title="Expel Student" className="p-2 bg-slate-800 text-slate-500 hover:bg-red-900/50 hover:text-red-400 rounded-lg transition-colors border border-slate-700 hover:border-red-900/50 ml-2">
                                                        <Trash2 size={16}/>
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => handleAction(student.userInfo?.username, "accept")} title="Accept" className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors border border-emerald-500/20">
                                                        <CheckCircle size={18}/>
                                                    </button>
                                                    <button onClick={() => handleAction(student.userInfo?.username, "reject")} title="Reject" className="p-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded-lg transition-colors border border-amber-500/20">
                                                        <XCircle size={18}/>
                                                    </button>
                                                    <button onClick={() => handleAction(student.userInfo?.username, "remove")} title="Delete Request" className="p-2 bg-slate-800 text-slate-500 hover:bg-red-600 hover:text-white rounded-lg transition-colors border border-slate-700">
                                                        <Trash2 size={18}/>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500">No {currentTab} students found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const StatCard = ({ icon, title, value, color, bg, border }) => (
    <div className={`bg-slate-900 border ${border} p-6 rounded-2xl flex items-center justify-between hover:shadow-lg transition-shadow`}>
        <div>
            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${bg} ${color}`}>
            {icon}
        </div>
    </div>
);

export default EducationDashboard;