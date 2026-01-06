import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, DollarSign, Clock, MapPin, CheckCircle, XCircle, 
  Search, Settings, LayoutDashboard, UserCheck, Menu, X, Save
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const EducationDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Profile Form State
  const [profileData, setProfileData] = useState({
    fee: "",
    Start_time: "",
    End_time: "",
    location: ""
  });

  // FETCH DATA
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Stats
      const statsRes = await axios.get("http://localhost:8000/api/v1/education/dashboard/stats", { withCredentials: true });
      setStats(statsRes.data.data);
      
      // Pre-fill profile form
      setProfileData({
        fee: statsRes.data.data.fee || "",
        Start_time: statsRes.data.data.batchTiming?.split(" - ")[0] || "",
        End_time: statsRes.data.data.batchTiming?.split(" - ")[1] || "",
        location: "" // Location might need to be fetched separately if not in stats, or added to stats API
      });

      // 2. Fetch Students
      const studentsRes = await axios.post("http://localhost:8000/api/v1/education/allstudent", {}, { withCredentials: true });
      setStudents(studentsRes.data.data);

    } catch (error) {
      console.error("Dashboard Load Error:", error);
      toast.error("Syncing data..."); // Soft error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // HANDLERS
  const handleApprove = async (username) => {
    try {
      await axios.post(`http://localhost:8000/api/v1/education/allstudent/submit/${username}`, {}, { withCredentials: true });
      toast.success("Student Approved!");
      fetchAllData(); // Refresh data
    } catch (error) {
      toast.error("Approval failed");
    }
  };

  const handleReject = async (username) => {
    if(!window.confirm("Are you sure you want to reject this student?")) return;
    try {
      await axios.post(`http://localhost:8000/api/v1/education/student/reject/${username}`, {}, { withCredentials: true });
      toast.success("Student Rejected");
      fetchAllData();
    } catch (error) {
      toast.error("Rejection failed");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch("http://localhost:8000/api/v1/education/profile/update", profileData, { withCredentials: true });
      toast.success("Profile Updated Successfully!");
      fetchAllData();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  // Filter Logic
  const filteredStudents = students.filter(stu => 
    stu.userInfo?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stu.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Toaster position="top-right" />

      {/* SIDEBAR */}
      <motion.aside 
        initial={{ x: -100 }} animate={{ x: 0 }}
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-900 text-white transition-all duration-300 flex flex-col shadow-2xl z-20`}
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-2xl font-bold font-serif tracking-wider text-amber-400">EDU ADMIN</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-blue-800 rounded-lg">
            {sidebarOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-3">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="Overview" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} open={sidebarOpen} />
          <SidebarItem icon={<Users size={20}/>} label="Students" active={activeTab === 'students'} onClick={() => setActiveTab('students')} open={sidebarOpen} />
          <SidebarItem icon={<Settings size={20}/>} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} open={sidebarOpen} />
        </nav>

        <div className="p-4 border-t border-blue-800">
           {sidebarOpen && <p className="text-xs text-blue-300 text-center">v1.0.0 GraminSeva</p>}
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {activeTab === 'dashboard' ? 'Dashboard Overview' : activeTab === 'students' ? 'Student Management' : 'Profile Settings'}
            </h2>
            <p className="text-gray-500 text-sm">Welcome back, Educator</p>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-full text-blue-700 font-semibold text-sm border border-blue-100">
             {new Date().toDateString()}
          </div>
        </header>

        {loading && !stats ? (
           <div className="flex justify-center items-center h-64"><div className="loader border-4 border-blue-600 rounded-full w-12 h-12 animate-spin border-t-transparent"></div></div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* 1. DASHBOARD OVERVIEW TAB */}
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard title="Total Students" value={stats?.totalStudents || 0} icon={<Users className="text-blue-600"/>} color="bg-blue-50 border-blue-200" />
                  <StatCard title="Active Enrolled" value={stats?.activeStudents || 0} icon={<UserCheck className="text-green-600"/>} color="bg-green-50 border-green-200" />
                  <StatCard title="Pending Requests" value={stats?.pendingRequests || 0} icon={<Clock className="text-amber-600"/>} color="bg-amber-50 border-amber-200" />
                  <StatCard title="Est. Earnings" value={`₹${stats?.estimatedEarnings || 0}`} icon={<DollarSign className="text-purple-600"/>} color="bg-purple-50 border-purple-200" />
                </div>

                {/* Recent Activity / Quick View */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                   <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Admissions</h3>
                   {students.filter(s => s.message === 'selected').length > 0 ? (
                      <div className="space-y-3">
                        {students.filter(s => s.message === 'selected').slice(0, 5).map(student => (
                           <div key={student._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                              <div className="flex items-center gap-3">
                                 <img src={student.userInfo?.avatar || "https://via.placeholder.com/40"} alt="av" className="w-10 h-10 rounded-full object-cover border border-gray-200"/>
                                 <div>
                                    <p className="font-semibold text-gray-800">{student.userInfo?.fullname}</p>
                                    <p className="text-xs text-gray-500">{student.subject} | {student.clas}</p>
                                 </div>
                              </div>
                              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md">Active</span>
                           </div>
                        ))}
                      </div>
                   ) : (
                      <p className="text-gray-400 text-sm">No active students yet.</p>
                   )}
                </div>
              </motion.div>
            )}

            {/* 2. STUDENTS TAB */}
            {activeTab === 'students' && (
              <motion.div 
                key="students"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex mb-6">
                   <div className="relative w-full md:w-96">
                      <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search students..." 
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                   {filteredStudents.map(student => (
                      <div key={student._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
                         <div className={`absolute top-0 left-0 w-2 h-full ${getStatusColor(student.message)}`}></div>
                         
                         <div className="flex justify-between items-start mb-4 pl-4">
                            <div className="flex items-center gap-3">
                               <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                                  <img src={student.userInfo?.avatar} alt="u" className="w-full h-full object-cover"/>
                               </div>
                               <div>
                                  <h4 className="font-bold text-gray-800">{student.userInfo?.fullname}</h4>
                                  <p className="text-xs text-gray-500">@{student.userInfo?.username}</p>
                               </div>
                            </div>
                            <Badge status={student.message} />
                         </div>

                         <div className="pl-4 space-y-2 mb-6 text-sm text-gray-600">
                            <div className="flex justify-between border-b border-dashed border-gray-200 pb-1"><span>Class:</span> <span className="font-medium text-gray-800">{student.clas} ({student.board})</span></div>
                            <div className="flex justify-between border-b border-dashed border-gray-200 pb-1"><span>Subject:</span> <span className="font-medium text-gray-800">{student.subject}</span></div>
                            <div className="flex justify-between pb-1"><span>Location:</span> <span className="font-medium text-gray-800">{student.location}</span></div>
                         </div>

                         <div className="pl-4 flex gap-3">
                            {student.message !== 'rejected' && (
                               <button 
                                 onClick={() => handleApprove(student.userInfo?.username)}
                                 disabled={student.message === 'selected'}
                                 className={`flex-1 py-2 rounded-lg font-semibold text-sm flex justify-center items-center gap-2 ${student.message === 'selected' ? 'bg-gray-100 text-gray-400 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'}`}
                               >
                                  {student.message === 'selected' ? 'Enrolled' : <>Approve <CheckCircle size={16}/></>}
                               </button>
                            )}
                            
                            {student.message !== 'rejected' && (
                               <button 
                                 onClick={() => handleReject(student.userInfo?.username)}
                                 className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
                                 title="Reject Student"
                               >
                                  <XCircle size={18}/>
                               </button>
                            )}
                         </div>
                      </div>
                   ))}
                   {filteredStudents.length === 0 && <p className="col-span-full text-center text-gray-400 py-10">No students found.</p>}
                </div>
              </motion.div>
            )}

            {/* 3. SETTINGS TAB */}
            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-200"
              >
                 <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Settings className="text-blue-600"/> Edit Profile Details
                 </h3>
                 <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Fee (₹)</label>
                       <input 
                         type="number" 
                         value={profileData.fee}
                         onChange={(e) => setProfileData({...profileData, fee: e.target.value})}
                         className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Batch Start Time</label>
                          <input 
                            type="time" 
                            value={profileData.Start_time}
                            onChange={(e) => setProfileData({...profileData, Start_time: e.target.value})}
                            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Batch End Time</label>
                          <input 
                            type="time" 
                            value={profileData.End_time}
                            onChange={(e) => setProfileData({...profileData, End_time: e.target.value})}
                            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                       </div>
                    </div>
                    <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">Institute Location</label>
                       <input 
                         type="text" 
                         value={profileData.location}
                         onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                         placeholder="City, Area"
                         className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                       />
                    </div>

                    <div className="pt-4">
                       <button className="w-full py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2">
                          Save Changes <Save size={18}/>
                       </button>
                    </div>
                 </form>
              </motion.div>
            )}

          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

// Helper Components
const SidebarItem = ({ icon, label, active, onClick, open }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${active ? 'bg-blue-800 text-amber-400 shadow-md' : 'text-blue-100 hover:bg-blue-800/50'}`}
  >
    {icon}
    {open && <span className="font-medium">{label}</span>}
  </button>
);

const StatCard = ({ title, value, icon, color }) => (
  <div className={`p-6 rounded-2xl border ${color} shadow-sm flex items-center justify-between`}>
     <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
     </div>
     <div className="p-3 bg-white rounded-full shadow-sm">{icon}</div>
  </div>
);

const Badge = ({ status }) => {
   const styles = {
      selected: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200"
   };
   const text = status === 'selected' ? 'Enrolled' : status === 'rejected' ? 'Rejected' : 'Pending';
   
   return (
      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${styles[status] || styles.pending}`}>
         {text}
      </span>
   );
};

const getStatusColor = (status) => {
   if (status === 'selected') return 'bg-green-500';
   if (status === 'rejected') return 'bg-red-500';
   return 'bg-amber-400';
};

export default EducationDashboard;