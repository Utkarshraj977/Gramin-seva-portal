import React, { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { 
  BookOpen, Search, MapPin, Clock, 
  CheckCircle, XCircle, Loader2, Send, Trash2, Edit3, X, Filter, 
  GraduationCap, RefreshCcw, Sparkles, ShieldCheck, MessageCircle, SlidersHorizontal,
  Camera, User, Save
} from "lucide-react";

import { student } from "../services/api";
import ChatRoom from "../Chat/ChatRoom";

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [allTeachers, setAllTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("find"); 
  const [searchTerm, setSearchTerm] = useState("");
  const [activeChat, setActiveChat] = useState(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    clas: "", subject: "", board: "", location: ""
  });

  // Filter State
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    subject: "",
    location: "",
    minFee: "",
    maxFee: ""
  });

  // ✅ NEW: Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // FETCH DATA
  const fetchData = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      
      const [dashRes, teachersRes] = await Promise.all([
        student.get_dashboard(),
        student.get_all_teachers()
      ]);

      setDashboardData(dashRes.data); 
      setAllTeachers(teachersRes.data);
      
      if (!isEditing && dashRes.data?.profile) {
        setProfileForm({
            clas: dashRes.data.profile.clas || "",
            subject: dashRes.data.profile.subject || "",
            board: dashRes.data.profile.board || "",
            location: dashRes.data.profile.location || ""
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

  // SEARCH & FILTER LOGIC
  useEffect(() => {
    let baseList = activeTab === "find" ? allTeachers : [];
    
    if (activeTab === "my" && dashboardData?.appliedTeachers) {
        baseList = allTeachers.filter(t => 
            dashboardData.appliedTeachers.some(at => String(at._id) === String(t._id))
        );
    }

    let results = baseList;

    if (filters.subject) {
        results = results.filter(t => 
            t.category?.toLowerCase().includes(filters.subject.toLowerCase())
        );
    }

    if (filters.location) {
        results = results.filter(t => 
            t.location?.toLowerCase().includes(filters.location.toLowerCase())
        );
    }

    if (filters.minFee) {
        results = results.filter(t => {
            const fee = parseInt(t.fee) || 0;
            return fee >= parseInt(filters.minFee);
        });
    }

    if (filters.maxFee) {
        results = results.filter(t => {
            const fee = parseInt(t.fee) || 0;
            return fee <= parseInt(filters.maxFee);
        });
    }

    if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        results = results.filter(t => 
            t.userInfo?.fullName?.toLowerCase().includes(lower) ||
            t.category?.toLowerCase().includes(lower) ||
            t.location?.toLowerCase().includes(lower)
        );
    }

    setFilteredTeachers(results);
  }, [searchTerm, allTeachers, dashboardData, activeTab, filters]);

  const clearFilters = () => {
    setFilters({
      subject: "",
      location: "",
      minFee: "",
      maxFee: ""
    });
    setSearchTerm("");
  };

  // ✅ NEW: Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ✅ NEW: Save Profile with Image
  const handleSaveProfile = async () => {
    try {
      toast.loading("Updating Profile...");
      
      // If image is selected, upload it first
      if (profileImage) {
        const formData = new FormData();
        formData.append("avatar", profileImage);
        
        // You'll need to add this endpoint to your API
        // await student.update_avatar(formData);
        toast.dismiss();
        toast.success("Profile Image Updated! (Note: Backend endpoint needed)");
      }
      
      // Update profile data
      await student.update_profile(profileForm);
      
      toast.dismiss();
      toast.success("Profile Updated Successfully");
      setShowProfileModal(false);
      setProfileImage(null);
      setImagePreview(null);
      fetchData(true);
      
    } catch (error) {
      toast.dismiss();
      toast.error("Update Failed");
    }
  };

  // ACTIONS
  const handleApply = async (username) => {
    try {
        toast.loading("Sending application...");
        await student.apply_teacher(username);
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
        await student.withdraw_application(username);
        toast.success("Withdrawn successfully");
        fetchData(true);
    } catch (error) {
        toast.error("Failed to withdraw");
    }
  };

  const handleProfileUpdate = async () => {
    try {
        await student.update_profile(profileForm);
        toast.success("Profile Updated");
        setIsEditing(false);
        fetchData(true);
    } catch (error) {
        toast.error("Update Failed");
    }
  };

  const openChat = (teacher) => {
    const myId = dashboardData?.profile?.userInfo?._id;
    const teacherId = teacher?.userInfo?._id;

    if (!myId) {
        toast.error("Error: Your User ID is missing. Please refresh.");
        return;
    }
    if (!teacherId) {
        toast.error("Error: Teacher ID is missing.");
        return;
    }
    setActiveChat(teacher);
  };

  const getApplicationStatus = (teacher) => {
      if (!dashboardData?.profile || !teacher) return { isApplied: false, status: null };
      const myProfileId = String(dashboardData.profile._id);
      const myUserId = String(dashboardData.profile.userInfo?._id || dashboardData.profile.userInfo);

      if (Array.isArray(teacher.student)) {
          const match = teacher.student.find(s => {
              const s_pid = s._id ? String(s._id) : (s.student ? String(s.student) : "");
              const s_uid = s.userInfo?._id ? String(s.userInfo._id) : (s.userInfo ? String(s.userInfo) : "");
              return (s_pid === myProfileId || s_uid === myUserId);
          });
          if (match) return { isApplied: true, status: match.message || "Enrolled" };
      }

      const inMyList = dashboardData.appliedTeachers?.some(t => String(t._id) === String(teacher._id));
      if (inMyList) return { isApplied: true, status: "Pending" };
      
      return { isApplied: false, status: null };
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
       <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
       <p className="text-slate-500 mt-4 tracking-widest text-xs uppercase animate-pulse">Loading Education Portal...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-12 selection:bg-blue-500/30 relative">
      <Toaster position="top-right" toastOptions={{ style: { background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }}} />

      {/* ✅ PROFILE EDIT MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="relative flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                    <User className="text-white" size={24}/>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                    <p className="text-blue-100 text-sm">Update your profile information</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setShowProfileModal(false);
                    setImagePreview(null);
                    setProfileImage(null);
                  }} 
                  className="p-2 hover:bg-white/20 text-white rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <div className="h-32 w-32 rounded-full bg-slate-800 overflow-hidden border-4 border-slate-700 shadow-xl">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover"/>
                    ) : dashboardData?.profile?.userInfo?.avatar?.url ? (
                      <img src={dashboardData.profile.userInfo.avatar.url} alt="Profile" className="h-full w-full object-cover"/>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-500 font-bold text-4xl bg-slate-800">
                        {dashboardData?.profile?.userInfo?.fullName?.charAt(0) || "S"}
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 p-3 rounded-full cursor-pointer shadow-lg transition-all border-4 border-slate-900 group-hover:scale-110">
                    <Camera className="text-white" size={18}/>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-slate-400 text-sm mt-3">Click camera icon to upload new photo</p>
                <p className="text-slate-500 text-xs">Max size: 5MB</p>
              </div>

              {/* Profile Info */}
              <div className="bg-slate-800/50 rounded-2xl p-6 mb-6 border border-slate-700">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <User size={18} className="text-blue-400"/> Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Full Name</p>
                    <p className="text-white font-medium">{dashboardData?.profile?.userInfo?.fullName || "Not Set"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Username</p>
                    <p className="text-white font-medium">@{dashboardData?.profile?.userInfo?.username || "Not Set"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Email</p>
                    <p className="text-white font-medium">{dashboardData?.profile?.userInfo?.email || "Not Set"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Phone</p>
                    <p className="text-white font-medium">{dashboardData?.profile?.userInfo?.phone || "Not Set"}</p>
                  </div>
                </div>
              </div>

              {/* Academic Details */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <GraduationCap size={18} className="text-blue-400"/> Academic Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 mb-2 block">Class</label>
                    <input 
                      type="text" 
                      value={profileForm.clas} 
                      onChange={(e) => setProfileForm({...profileForm, clas: e.target.value})} 
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="12th"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-2 block">Board</label>
                    <input 
                      type="text" 
                      value={profileForm.board} 
                      onChange={(e) => setProfileForm({...profileForm, board: e.target.value})} 
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="CBSE"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-2 block">Subject</label>
                    <input 
                      type="text" 
                      value={profileForm.subject} 
                      onChange={(e) => setProfileForm({...profileForm, subject: e.target.value})} 
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Physics"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-2 block">Location</label>
                    <input 
                      type="text" 
                      value={profileForm.location} 
                      onChange={(e) => setProfileForm({...profileForm, location: e.target.value})} 
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Salt Lake, Kolkata"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => {
                    setShowProfileModal(false);
                    setImagePreview(null);
                    setProfileImage(null);
                  }}
                  className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all border border-slate-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveProfile}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                  <Save size={18}/> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHAT MODAL */}
      {activeChat && (() => {
          const myId = dashboardData?.profile?.userInfo?._id;
          const teacherId = activeChat.userInfo?._id;
          
          if (!myId || !teacherId) return null;

          const roomId = [myId, teacherId].sort().join("-");

          const currentUser = {
             id: myId,
             name: dashboardData.profile.userInfo.fullName || "Me",
             avatar: dashboardData.profile.userInfo.avatar?.url
          };
          const targetUser = {
             id: teacherId,
             name: activeChat.userInfo.fullName || "Teacher",
             avatar: activeChat.userInfo.avatar?.url
          };

          return (
            <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-slate-900 w-full max-w-2xl h-[600px] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col relative zoom-in-95">
                    <div className="bg-slate-800 border-b border-slate-700 p-3 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600/20 p-2 rounded-full">
                                <MessageCircle size={18} className="text-blue-400"/>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">Chatting with {targetUser.name}</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    <span className="text-[10px] text-slate-400">Secure & Encrypted</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setActiveChat(null)} 
                            className="p-2 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-hidden relative bg-slate-950">
                        <ChatRoom 
                            roomId={roomId}
                            currentUser={currentUser}
                            targetUser={targetUser}
                        />
                    </div>
                </div>
            </div>
          );
      })()}

      {/* HERO HEADER */}
      <div className="relative bg-slate-900 border-b border-slate-800 pt-8 pb-16 px-4 overflow-hidden">
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

            {/* ✅ CLICKABLE PROFILE IMAGE */}
            <button 
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-4 bg-slate-800/80 p-2 pr-6 rounded-full border border-slate-700/50 backdrop-blur-md shadow-xl hover:border-blue-500/50 transition-all cursor-pointer group"
              title="Click to edit profile"
            >
                <div className="h-12 w-12 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 to-purple-500 relative">
                    <div className="h-full w-full rounded-full bg-slate-900 overflow-hidden">
                        {dashboardData?.profile?.userInfo?.avatar?.url ? (
                            <img src={dashboardData.profile.userInfo.avatar.url} alt="User" className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center font-bold text-white">
                                {dashboardData?.profile?.userInfo?.fullName?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="absolute inset-0 rounded-full bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors flex items-center justify-center">
                        <Edit3 size={14} className="text-white opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </div>
                </div>
                <div>
                    <h3 className="text-white font-medium text-sm">{dashboardData?.profile?.userInfo?.fullName}</h3>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Online</p>
                    </div>
                </div>
            </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        
        {/* STATS & PROFILE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
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

        {/* CONTROLS */}
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
                 <button 
                    onClick={() => setShowFilters(!showFilters)} 
                    className={`p-3 border rounded-xl transition-all shadow-sm ${showFilters ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-blue-400'}`}
                    title="Filter Options"
                 >
                    <SlidersHorizontal size={20} />
                 </button>
                <div className="relative flex-1 md:w-80">
                    <Search className="absolute left-3 top-3 text-slate-500" size={18}/>
                    <input 
                      type="text" 
                      placeholder="Search teachers..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-white pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-600 shadow-sm"
                    />
                </div>
            </div>
        </div>

        {/* FILTER PANEL */}
        {showFilters && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-sm animate-in slide-in-from-top-4 duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <Filter size={18} className="text-blue-400"/> Advanced Filters
                    </h3>
                    <button onClick={clearFilters} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                        <X size={14}/> Clear All
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">Subject</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Physics" 
                            value={filters.subject}
                            onChange={(e) => setFilters({...filters, subject: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-700 text-white px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">Location (Area)</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Salt Lake" 
                            value={filters.location}
                            onChange={(e) => setFilters({...filters, location: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-700 text-white px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">Min Fee (₹)</label>
                        <input 
                            type="number" 
                            placeholder="1000" 
                            value={filters.minFee}
                            onChange={(e) => setFilters({...filters, minFee: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-700 text-white px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 mb-1 block">Max Fee (₹)</label>
                        <input 
                            type="number" 
                            placeholder="5000" 
                            value={filters.maxFee}
                            onChange={(e) => setFilters({...filters, maxFee: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-700 text-white px-3 py-2 rounded-lg outline-none focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>
                <div className="mt-4 text-xs text-slate-500">
                    Showing {filteredTeachers.length} teacher(s) matching your criteria
                </div>
            </div>
        )}

        {/* TEACHER CARDS */}
        {filteredTeachers.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl p-16 text-center">
                <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="h-8 w-8 text-slate-600" />
                </div>
                <h3 className="text-slate-300 font-medium text-lg">No teachers found</h3>
                <p className="text-slate-500 text-sm mt-2">Try adjusting your filters or search terms</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                {filteredTeachers.map((teacher) => {
                    const { isApplied, status } = getApplicationStatus(teacher);
                    
                    const st = status ? status.toLowerCase() : "";
                    const isSelected = st === 'selected' || st === 'accepted' || st === 'enrolled' || st === 'success';
                    const isRejected = st === 'rejected';

                    return (
                        <div key={teacher._id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 hover:border-slate-700 transition-all duration-300 group flex flex-col relative">
                            
                            <div className="relative h-32 bg-slate-800 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-slate-900/60 to-slate-900"></div>
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                
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

                            <div className="px-6 relative -mt-14 flex justify-between items-end">
                                <div className="relative">
                                    <div className="h-24 w-24 rounded-2xl bg-slate-800 p-1.5 border border-slate-700 shadow-xl group-hover:scale-105 transition-transform duration-300">
                                        <div className="h-full w-full rounded-xl bg-slate-900 overflow-hidden relative">
                                            {teacher.userInfo?.avatar?.url ? (
                                                <img src={teacher.userInfo.avatar.url} alt="Teacher" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 text-slate-400 font-bold text-3xl">
                                                    {teacher.userInfo?.fullName?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-full border-4 border-slate-900" title="Verified Teacher">
                                        <Sparkles size={12} fill="white"/>
                                    </div>
                                </div>

                                <div className="text-right mb-2">
                                    <div className="text-2xl font-bold text-white tracking-tight">₹{teacher.fee}</div>
                                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider bg-slate-800 px-2 py-0.5 rounded-md inline-block">Per Month</div>
                                </div>
                            </div>

                            <div className="p-6 pt-4 flex-1 flex flex-col">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors truncate">{teacher.userInfo?.fullName}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-md font-medium">{teacher.category}</span>
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
                                </div>

                                <div className="flex gap-3">
                                    {isApplied && (
                                        <button 
                                            onClick={() => openChat(teacher)}
                                            className="p-3.5 bg-slate-800 hover:bg-blue-600 hover:text-white text-blue-500 rounded-xl border border-slate-700 hover:border-blue-500 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95 flex-shrink-0"
                                            title="Message Teacher"
                                        >
                                            <MessageCircle size={20} />
                                        </button>
                                    )}

                                    <div className="flex-1">
                                        {isApplied ? (
                                            <button 
                                                onClick={() => handleWithdraw(teacher.userInfo.username)}
                                                className="w-full py-3.5 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 text-slate-400 rounded-xl font-medium transition-all border border-slate-700 flex justify-center items-center gap-2 group/btn"
                                            >
                                                <Trash2 size={18} className="group-hover/btn:text-red-500 transition-colors"/> Withdraw
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