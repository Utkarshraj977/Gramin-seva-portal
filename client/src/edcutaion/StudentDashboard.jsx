import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ChatRoom from '../Chat/ChatRoom'; // Ensure path is correct
import { 
  BookOpen, Search, MapPin, IndianRupee, Clock,
  CheckCircle, XCircle, Loader2, Send, Trash2, Edit3, X, Filter, 
<<<<<<< HEAD
  GraduationCap, RefreshCcw, Sparkles, ShieldCheck,
  LogIn
=======
  GraduationCap, RefreshCcw, ShieldCheck, MessageSquare
>>>>>>> 6b4482a80cdbeb445ef0132555bcfafb814b9253
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const StudentDashboard = () => {
  // --- STATE ---
  const [dashboardData, setDashboardData] = useState(null);
  const [allTeachers, setAllTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("find"); 
  const [searchTerm, setSearchTerm] = useState("");
  
  // Chat
  const [activeChatTeacher, setActiveChatTeacher] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  // Profile Editing
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ clas: "", subject: "", board: "", location: "" });

  const BASE_URL = "http://localhost:8000/api/v1/education/student";
  const token = localStorage.getItem("accessToken");
  const getHeaders = () => ({ headers: { Authorization: `Bearer ${token}` }, withCredentials: true });

  // --- DATA FETCHING ---
  const fetchData = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const t = new Date().getTime(); 

      const [dashRes, teachersRes] = await Promise.all([
        axios.get(`${BASE_URL}/dashboard?_t=${t}`, getHeaders()),
        axios.get(`${BASE_URL}/allteacher?_t=${t}`, getHeaders())
      ]);

      setDashboardData(dashRes.data.data);
      setAllTeachers(teachersRes.data.data);
      
      // Full Profile for Chat (need ._id)
      setCurrentUserProfile(dashRes.data.data.profile);

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
    const interval = setInterval(() => fetchData(true), 5000); 
    return () => clearInterval(interval);
  }, [fetchData]);

  // --- SEARCH & FILTER ---
  useEffect(() => {
    let baseList = activeTab === "find" ? allTeachers : [];
    
    if (activeTab === "my" && dashboardData?.appliedTeachers) {
        // Only show teachers we have applied to
        baseList = allTeachers.filter(t => 
            dashboardData.appliedTeachers.some(at => String(at._id) === String(t._id))
        );
    }

    let results = baseList;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      results = results.filter(t => 
        t.userInfo?.fullname?.toLowerCase().includes(lower) ||
        t.subject?.toLowerCase().includes(lower)
      );
    }
    setFilteredTeachers(results);
  }, [searchTerm, allTeachers, dashboardData, activeTab]);

  // --- ACTIONS ---
  const handleApply = async (username) => {
    try {
        toast.loading("Sending application...");
        await axios.post(`${BASE_URL}/apply/${username}`, {}, getHeaders());
        toast.dismiss();
        toast.success("Application Sent!");
        fetchData(true);
    } catch (error) {
        toast.dismiss();
        toast.error("Failed to apply");
    }
  };

  const handleWithdraw = async (username) => {
    if(!window.confirm("Withdraw application?")) return;
    try {
        await axios.post(`${BASE_URL}/withdraw/${username}`, {}, getHeaders());
        toast.success("Withdrawn");
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

  const handleStartChat = (teacher) => {
      setActiveChatTeacher(teacher);
  };

  // --- LOGIC: Check Status (Pending vs Selected) ---
  const getApplicationStatus = (teacher) => {
    console.log("sammmm");
    console.log(dashboardData?.profile );
    
      if (!dashboardData?.profile || !teacher) return { isApplied: false, status: null };

      const safeStr = (val) => (val ? String(val) : "");
      const myProfileId = safeStr(dashboardData.profile._id);
<<<<<<< HEAD
      const myUserId = safeStr(dashboardData.profile.userInfo?._id);

      console.log("3333mm");
        console.log(dashboardData.profile.userInfo?._id );
        console.log(dashboardData.profile._id );
      // 1. Check inside Teacher's Students Array
      console.log(Array.isArray(teacher.student));
      if ( Array.isArray(teacher.student)) {

          const match = teacher.student.find(s => {
            console.log(s);
              const s_pid = s.student?._id ? safeStr(s.student._id) : safeStr(s.student);
              const s_uid = s.userInfo?._id ? safeStr(s.userInfo._id) : safeStr(s.userInfo);
              return (s_pid === myProfileId || s_uid === myUserId);
=======
      
      // Look inside the Teacher's 'students' array
      // Ideally, the backend populates this. If not, we might need a better check.
      if (teacher.students && Array.isArray(teacher.students)) {
          // Find 'me' in their list
          const match = teacher.students.find(s => {
              // The student field might be an ID string or an Object
              const s_id = s.student?._id ? safeStr(s.student._id) : safeStr(s.student);
              return s_id === myProfileId;
>>>>>>> 6b4482a80cdbeb445ef0132555bcfafb814b9253
          });

          if (match) {
              return { isApplied: true, status: match.message || "pending" };
          }
      }

      // Fallback: Check 'appliedTeachers' list from dashboard data
      // This confirms we applied, but doesn't give specific status inside the teacher object unless populated
      const inMyList = dashboardData.appliedTeachers?.some(t => safeStr(t._id) === safeStr(teacher._id));
      if (inMyList) {
          // If we are in the list, default to pending, BUT
          // if the backend 'appliedTeachers' endpoint returns status, we use that. 
          // Assuming default pending if not found in teacher.students
          return { isApplied: true, status: "pending" };
      }

      return { isApplied: false, status: null };
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
       <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-12 relative">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="bg-slate-900 border-b border-slate-800 pt-8 pb-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl"><BookOpen className="text-white h-8 w-8" /></div>
                <div><h1 className="text-3xl font-bold text-white">Student Portal</h1><p className="text-slate-400">Manage your classes</p></div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        
        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
             <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <p className="text-slate-400 text-xs uppercase font-bold">Applications</p>
                <h3 className="text-4xl font-bold text-white mt-2">{dashboardData?.stats?.totalApplications || 0}</h3>
             </div>
             {/* Profile Editing UI (Same as before) ... */}
        </div>

        {/* TABS & SEARCH */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button onClick={() => setActiveTab("find")} className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === "find" ? "bg-slate-800 text-white shadow-sm ring-1 ring-slate-700" : "text-slate-400 hover:text-white"}`}>All Teachers</button>
                <button onClick={() => setActiveTab("my")} className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === "my" ? "bg-slate-800 text-white shadow-sm ring-1 ring-slate-700" : "text-slate-400 hover:text-white"}`}>My Applications</button>
            </div>
            
            <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-3 text-slate-500" size={18}/>
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-900 border border-slate-800 text-white pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-blue-500 transition-all placeholder-slate-600"/>
            </div>
        </div>

        {/* TEACHER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            <AnimatePresence>
                {filteredTeachers.map((teacher) => {
                    const { isApplied, status } = getApplicationStatus(teacher);
                    
                    // Normalize Status
                    const st = status ? status.toLowerCase() : "";
                    const isSelected = st === 'selected' || st === 'accepted' || st === 'enrolled';
                    const isRejected = st === 'rejected';

                    return (
                        <motion.div key={teacher._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 relative flex flex-col">
                            {/* Header Image */}
                            <div className="relative h-32 bg-slate-800">
                                {/* Status Badge (Only if Applied) */}
                                {isApplied && (
                                    <div className="absolute top-4 right-4 z-20">
                                        <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase backdrop-blur-md border flex items-center gap-1.5 ${isSelected ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : isRejected ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                                            {isSelected ? <ShieldCheck size={12}/> : isRejected ? <XCircle size={12}/> : <Clock size={12}/>}
                                            {isSelected ? "Enrolled" : isRejected ? "Rejected" : "Pending"}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="px-6 -mt-14 relative"><div className="h-24 w-24 rounded-2xl bg-slate-800 p-1 border border-slate-700"><img src={teacher.userInfo?.avatar?.url} className="h-full w-full object-cover rounded-xl"/></div></div>

                            <div className="p-6 pt-4 flex-1 flex flex-col">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-white">{teacher.userInfo?.fullname}</h3>
                                    <p className="text-sm text-slate-500">{teacher.subject}</p>
                                </div>

                                <div className="space-y-2 mb-8 flex-1 text-sm text-slate-400">
                                    <div className="flex gap-2"><MapPin size={16}/> {teacher.location}</div>
                                    <div className="flex gap-2"><IndianRupee size={16}/> {teacher.fee} / month</div>
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="flex gap-3">
                                    {isApplied ? (
                                        <>
                                            {/* Show Chat Button ALWAYS if applied (or you can restrict to only 'selected') */}
                                            <button 
                                                onClick={() => handleStartChat(teacher)} 
                                                className="flex-1 py-3 bg-blue-600/20 text-blue-400 rounded-xl font-bold text-sm border border-blue-600/30 flex justify-center items-center gap-2 hover:bg-blue-600 hover:text-white transition-all"
                                            >
                                                <MessageSquare size={18}/> Chat
                                            </button>
                                            
                                            <button onClick={() => handleWithdraw(teacher.userInfo.username)} className="py-3 px-4 bg-slate-800 text-slate-400 rounded-xl hover:text-red-400 transition-colors" title="Withdraw">
                                                <Trash2 size={18}/>
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => handleApply(teacher.userInfo.username)} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-500 transition-all flex justify-center items-center gap-2">
                                            <Send size={18}/> Apply Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
      </div>

      {/* CHAT MODAL */}
      {activeChatTeacher && currentUserProfile && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="relative w-full max-w-4xl h-[85vh] flex flex-col">
               <button 
                  onClick={() => setActiveChatTeacher(null)}
                  className="self-end mb-2 text-white hover:text-blue-300 font-bold flex items-center gap-2 transition-colors bg-black/40 px-3 py-1 rounded-full backdrop-blur-md"
               >
                  <X size={20} /> Close Chat
               </button>

               <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-2xl">
                   <ChatRoom 
                      // Room ID: EducatorID-StudentID sorted
                      roomId={[activeChatTeacher._id, currentUserProfile._id].sort().join("-")}
                      currentUser={{
                          name: currentUserProfile.userInfo?.fullname || "Student",
                          id: currentUserProfile._id
                      }}
                      targetUser={{
                          name: activeChatTeacher.userInfo?.fullname || "Teacher",
                          avatar: activeChatTeacher.userInfo?.avatar?.url
                      }}
                   />
               </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;