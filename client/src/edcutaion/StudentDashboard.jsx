import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Search, User, Settings, LogOut, Menu, X, 
  GraduationCap, Clock, MapPin, DollarSign, CheckCircle, 
  AlertCircle, Trash2, ArrowRight, Star
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Data States
  const [dashboardData, setDashboardData] = useState(null); // My Teachers & Stats
  const [allTeachers, setAllTeachers] = useState([]);       // For Browsing
  const [searchTerm, setSearchTerm] = useState("");

  // Profile Form State
  const [profileData, setProfileData] = useState({
    clas: "",
    board: "",
    subject: "",
    location: "",
    massage: ""
  });

  // --- API CALLS ---
  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/student/dashboard", { withCredentials: true });
      setDashboardData(res.data.data);
      
      // Pre-fill profile form
      const user = res.data.data.studentProfile;
      setProfileData({
        clas: user.clas || "",
        board: user.board || "",
        subject: user.subject || "",
        location: user.location || "",
        massage: user.massage || ""
      });
    } catch (error) {
      console.error("Dashboard Error", error);
    }
  };

  const fetchAllTeachers = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/v1/student/allteacher", {}, { withCredentials: true });
      setAllTeachers(res.data.data || []);
    } catch (error) {
      console.error("Fetch Teachers Error", error);
    }
  };

  const init = async () => {
    setLoading(true);
    await Promise.all([fetchDashboardData(), fetchAllTeachers()]);
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  // --- HANDLERS ---
  const handleApply = async (username) => {
    try {
      await axios.get(`http://localhost:8000/api/v1/student/allteacher/${username}`, { withCredentials: true });
      toast.success("Applied successfully!");
      fetchDashboardData(); // Refresh 'My Mentors'
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed");
    }
  };

  const handleWithdraw = async (username) => {
    if(!window.confirm("Are you sure you want to withdraw your application?")) return;
    try {
      await axios.post(`http://localhost:8000/api/v1/student/withdraw/${username}`, {}, { withCredentials: true });
      toast.success("Application withdrawn");
      fetchDashboardData(); // Refresh list
    } catch (error) {
      toast.error("Withdrawal failed");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch("http://localhost:8000/api/v1/student/profile/update", profileData, { withCredentials: true });
      toast.success("Profile updated!");
      fetchDashboardData();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleLogout = () => {
      // Add logic to clear cookies if needed
      navigate("/student/login");
  };

  // Filter Logic for Browse Tab
  const filteredTeachers = allTeachers.filter(t => 
    t.userInfo?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-orange-50/50 font-sans overflow-hidden">
      <Toaster position="top-center" />

      {/* SIDEBAR */}
      <motion.aside 
        initial={{ x: -100 }} animate={{ x: 0 }}
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-orange-600 to-pink-600 text-white transition-all duration-300 flex flex-col shadow-2xl z-20`}
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold tracking-wider flex gap-2 items-center"><GraduationCap/> STUDENT</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg">
            {sidebarOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-3">
          <SidebarItem icon={<BookOpen size={20}/>} label="My Mentors" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} open={sidebarOpen} />
          <SidebarItem icon={<Search size={20}/>} label="Browse Educators" active={activeTab === 'browse'} onClick={() => setActiveTab('browse')} open={sidebarOpen} />
          <SidebarItem icon={<Settings size={20}/>} label="Profile Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} open={sidebarOpen} />
        </nav>

        <div className="p-4 border-t border-white/20">
           <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-orange-100 transition-colors">
              <LogOut size={20}/>
              {sidebarOpen && <span>Logout</span>}
           </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-3xl shadow-sm border border-orange-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {activeTab === 'dashboard' ? 'My Learning Hub' : activeTab === 'browse' ? 'Find a Mentor' : 'Account Settings'}
            </h2>
            <p className="text-gray-500 text-sm">
                Hello, {dashboardData?.studentProfile?.userInfo?.fullname || "Student"} 👋
            </p>
          </div>
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center border border-orange-200 text-orange-600 font-bold">
             {dashboardData?.studentProfile?.userInfo?.fullname?.[0] || "S"}
          </div>
        </header>

        {loading ? (
           <div className="flex justify-center items-center h-64"><div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* 1. MY MENTORS (DASHBOARD) */}
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                
                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-purple-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                        <p className="text-purple-100 mb-1">Applications Sent</p>
                        <h3 className="text-4xl font-bold">{dashboardData?.totalApplications || 0}</h3>
                    </div>
                    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-center">
                        <p className="text-gray-500 text-sm">Current Status</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`w-3 h-3 rounded-full ${dashboardData?.status === 'selected' ? 'bg-green-500' : 'bg-orange-400 animate-pulse'}`}></span>
                            <span className="font-bold text-xl text-gray-800 capitalize">{dashboardData?.status === 'selected' ? 'Enrolled' : 'Pending Review'}</span>
                        </div>
                    </div>
                </div>

                {/* Applied Teachers List */}
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">My Applied Mentors</h3>
                    {dashboardData?.appliedTeachers?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {dashboardData.appliedTeachers.map((teacher, index) => (
                                <div key={index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 border border-orange-100">
                                                <User size={24}/>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800">{teacher.userInfo?.fullname}</h4>
                                                <p className="text-xs text-gray-500">{teacher.category}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleWithdraw(teacher.userInfo?.username)}
                                            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Withdraw Application"
                                        >
                                            <Trash2 size={18}/>
                                        </button>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl mb-3">
                                        <div className="flex justify-between"><span>Timing:</span> <span className="font-medium">{teacher.Start_time} - {teacher.End_time}</span></div>
                                        <div className="flex justify-between"><span>Location:</span> <span className="font-medium">{teacher.location}</span></div>
                                    </div>
                                    <div className={`text-center py-2 rounded-lg text-xs font-bold uppercase ${dashboardData.studentProfile?.message === 'selected' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {dashboardData.studentProfile?.message === 'selected' ? 'Approved' : 'Waiting for Approval'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-300">
                            <p className="text-gray-400">You haven't applied to any teachers yet.</p>
                            <button onClick={() => setActiveTab('browse')} className="mt-4 text-orange-600 font-bold hover:underline">Find a Mentor</button>
                        </div>
                    )}
                </div>
              </motion.div>
            )}

            {/* 2. BROWSE EDUCATORS */}
            {activeTab === 'browse' && (
              <motion.div key="browse" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="mb-6 relative max-w-lg">
                    <Search className="absolute left-4 top-3.5 text-gray-400" size={20}/>
                    <input 
                        type="text" 
                        placeholder="Search by name or subject (e.g. Math, Science)..." 
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTeachers.map((teacher) => {
                        const isApplied = dashboardData?.appliedTeachers?.some(t => t._id === teacher._id);
                        return (
                            <div key={teacher._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:border-orange-200 transition-all flex flex-col h-full">
                                <div className="flex items-center gap-4 mb-4">
                                    <img 
                                        src={teacher.Education_certificate?.url || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                                        alt="cert" 
                                        className="w-16 h-16 rounded-2xl object-cover bg-gray-100"
                                    />
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800 leading-tight">{teacher.userInfo?.fullname}</h3>
                                        <span className="inline-block bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 uppercase tracking-wide">{teacher.category}</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-3 mb-6 flex-1">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock size={16} className="text-orange-400"/> {teacher.Start_time} - {teacher.End_time}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <DollarSign size={16} className="text-green-500"/> ₹{teacher.fee} / month
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin size={16} className="text-blue-400"/> {teacher.location}
                                    </div>
                                </div>

                                <button 
                                    onClick={() => !isApplied && handleApply(teacher.userInfo?.username)}
                                    disabled={isApplied}
                                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isApplied ? 'bg-green-100 text-green-700 cursor-default' : 'bg-black text-white hover:bg-gray-800'}`}
                                >
                                    {isApplied ? <><CheckCircle size={18}/> Applied</> : <>Apply Now <ArrowRight size={18}/></>}
                                </button>
                            </div>
                        );
                    })}
                    {filteredTeachers.length === 0 && <div className="col-span-full text-center py-10 text-gray-400">No educators found matching your search.</div>}
                </div>
              </motion.div>
            )}

            {/* 3. SETTINGS TAB */}
            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Settings className="text-orange-500"/> Update Profile
                    </h3>
                    <form onSubmit={handleProfileUpdate} className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-2">Class / Grade</label>
                                <input type="text" value={profileData.clas} onChange={(e) => setProfileData({...profileData, clas: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="e.g. 10th"/>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-2">Board</label>
                                <input type="text" value={profileData.board} onChange={(e) => setProfileData({...profileData, board: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="e.g. CBSE"/>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-700 block mb-2">Subject Stream</label>
                            <input type="text" value={profileData.subject} onChange={(e) => setProfileData({...profileData, subject: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="e.g. Science (PCM)"/>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-700 block mb-2">My Location</label>
                            <input type="text" value={profileData.location} onChange={(e) => setProfileData({...profileData, location: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"/>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-700 block mb-2">Goal / Message</label>
                            <textarea rows="3" value={profileData.massage} onChange={(e) => setProfileData({...profileData, massage: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none resize-none" placeholder="Update your study goals..."></textarea>
                        </div>

                        <button className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all mt-4">
                            Save Changes
                        </button>
                    </form>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick, open }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${active ? 'bg-white text-orange-600 shadow-md' : 'text-orange-50 hover:bg-white/10'}`}
  >
    {icon}
    {open && <span className="font-medium">{label}</span>}
  </button>
);

export default StudentDashboard;