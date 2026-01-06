import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { 
  Users, GraduationCap, IndianRupee, Clock, MapPin, 
  Search, CheckCircle, XCircle, Loader2, Edit3, Save, X, 
  BookOpen, Trash2, Download, Zap, TrendingUp, Phone, Mail
} from "lucide-react";

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
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({ fee: "", location: "", Start_time: "", End_time: "" });

  // --- API CONFIG ---
  const BASE_URL = "http://localhost:8000/api/v1/education";
  const token = localStorage.getItem("accessToken");

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });

  // --- 1. DATA FETCHING ---
  const fetchDashboardData = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);

      const [statsRes, studentsRes] = await Promise.all([
        axios.get(`${BASE_URL}/dashboard/stats`, getHeaders()),
        axios.post(`${BASE_URL}/allstudent`, {}, getHeaders())
      ]);

      const sData = statsRes.data.data;
      setStats(sData);
      
      // Initialize edit form
      if (!isEditing) {
          const [start, end] = sData.timings ? sData.timings.split(" - ") : ["", ""];
          setProfileData({
            fee: sData.fee,
            location: sData.location,
            Start_time: start,
            End_time: end
          });
      }

      // Ensure students have unique keys and data structure is correct
      const studentList = studentsRes.data.data || [];
      setStudents(studentList);
      
      // Update filtered list only if not searching
      if (!searchTerm) setFilteredStudents(studentList);

    } catch (error) {
      console.error("Dashboard Error:", error);
      if(!isBackground) toast.error("Failed to sync dashboard");
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  // Auto Refresh
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => fetchDashboardData(true), 5000);
    return () => clearInterval(interval);
  }, []);

  // --- 2. SEARCH LOGIC ---
  useEffect(() => {
    if (!searchTerm) {
      setFilteredStudents(students);
    } else {
      const lower = searchTerm.toLowerCase();
      const results = students.filter(s => 
        (s.userInfo?.fullname && s.userInfo.fullname.toLowerCase().includes(lower)) ||
        (s.subject && s.subject.toLowerCase().includes(lower)) ||
        (s.userInfo?.username && s.userInfo.username.toLowerCase().includes(lower))
      );
      setFilteredStudents(results);
    }
  }, [searchTerm, students]);

  // --- 3. ACTIONS ---
  const handleAction = async (username, type) => {
    if(!username) return toast.error("User data missing");
    
    // Optimistic UI Update: Local state ko pehle update kar do taaki UI "Jhatka" na khaye
    // This prevents "All Accept" glitch visually
    const originalStudents = [...students]; // Backup

    // Confirm Action
    if(!window.confirm(`Are you sure you want to ${type} this student?`)) return;

    let url = "";
    let method = "post";

    if (type === "accept") url = `${BASE_URL}/allstudent/submit/${username}`;
    else if (type === "reject") url = `${BASE_URL}/student/reject/${username}`;
    else if (type === "remove") {
        url = `${BASE_URL}/student/remove/${username}`;
        method = "delete";
    }

    try {
      toast.loading("Processing...");
      await axios[method](url, {}, getHeaders());
      toast.dismiss();
      toast.success(`Action Successful: ${type}`);
      
      // Refresh Data from Server to be sure
      fetchDashboardData(true);
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Action Failed");
      // Revert if failed
      setStudents(originalStudents);
    }
  };

  // --- 4. PROFILE UPDATE ---
  const handleUpdateProfile = async () => {
    try {
        toast.loading("Updating Profile...");
        await axios.patch(`${BASE_URL}/profile/update`, profileData, getHeaders());
        toast.dismiss();
        toast.success("Profile Updated");
        setIsEditing(false);
        fetchDashboardData(true);
    } catch (error) {
        toast.dismiss();
        toast.error("Update Failed");
    }
  };

  // --- 5. EXPORT CSV ---
  const downloadCSV = () => {
    const headers = ["Name, Username, Phone, Class, Board, Subject, Location, Status"];
    const rows = students.map(s => 
        `${s.userInfo?.fullname}, ${s.userInfo?.username}, ${s.userInfo?.phone || "N/A"}, ${s.clas}, ${s.board}, ${s.subject}, ${s.location}, ${s.message}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_list.csv");
    document.body.appendChild(link);
    link.click();
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
       <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
       <p className="text-slate-500 mt-4 tracking-widest text-xs uppercase">Loading Classroom...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-12">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }}} />

      {/* HEADER */}
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
            
            <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={downloadCSV}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm transition border border-slate-700"
                >
                    <Download size={16}/> <span className="hidden sm:inline">Export Data</span>
                </button>
                <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-lg text-sm border border-green-500/20">
                    <Zap size={14} className="fill-green-400"/> Status: Active
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        
        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard icon={<Users/>} title="Total Students" value={stats.totalStudents} color="text-blue-400" bg="bg-blue-500/10" border="border-blue-500/20" />
            <StatCard icon={<CheckCircle/>} title="Active Students" value={stats.activeStudents} color="text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20" />
            <StatCard icon={<Clock/>} title="Pending Requests" value={stats.pendingRequests} color="text-amber-400" bg="bg-amber-500/10" border="border-amber-500/20" />
            <StatCard icon={<IndianRupee/>} title="Est. Earnings" value={`₹${stats.estimatedEarnings}`} color="text-purple-400" bg="bg-purple-500/10" border="border-purple-500/20" />
        </div>

        {/* QUICK SETTINGS (Profile Edit) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="text-blue-500" size={20}/> Class Configuration
                </h2>
                <button onClick={() => setIsEditing(!isEditing)} className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1 transition-colors">
                    {isEditing ? <X size={14}/> : <Edit3 size={14}/>} {isEditing ? "Cancel Edit" : "Edit Details"}
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
                            <Save size={18}/> Save
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

        {/* STUDENT TABLE SECTION */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <BookOpen className="text-blue-500" size={20}/>
                    <h2 className="text-lg font-bold text-white">Student Enquiries</h2>
                    <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">{filteredStudents.length}</span>
                </div>
                
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-2.5 text-slate-500" size={18}/>
                    <input 
                      type="text" 
                      placeholder="Search name, class or subject..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full md:w-72 bg-slate-950 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-xl outline-none focus:border-blue-500 transition-colors placeholder-slate-600"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Student Profile</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Academic Details</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <tr key={student._id} className="hover:bg-slate-800/50 transition-colors group">
                                    {/* COLUMN 1: PHOTO & NAME */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {/* Logic for Photo or Initials */}
                                            {student.userInfo?.avatar?.url ? (
                                                <img 
                                                  src={student.userInfo.avatar.url} 
                                                  alt="User" 
                                                  className="h-10 w-10 rounded-full object-cover border border-slate-700"
                                                />
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

                                    {/* COLUMN 2: CONTACT (NEW) */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            {student.userInfo?.phone && (
                                                <div className="flex items-center gap-1.5 text-slate-300">
                                                    <Phone size={12} className="text-slate-500"/> 
                                                    {student.userInfo.phone}
                                                </div>
                                            )}
                                            {student.userInfo?.email && (
                                                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                                                    <Mail size={12} className="text-slate-500"/> 
                                                    {student.userInfo.email}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                                                <MapPin size={12}/> {student.location || "N/A"}
                                            </div>
                                        </div>
                                    </td>

                                    {/* COLUMN 3: ACADEMICS */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-slate-200 font-medium">{student.clas} <span className="text-slate-500 mx-1">•</span> {student.board}</span>
                                            <span className="text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded w-fit">{student.subject}</span>
                                        </div>
                                    </td>

                                    {/* COLUMN 4: STATUS */}
                                    <td className="px-6 py-4">
                                        <StatusBadge status={student.message} />
                                    </td>

                                    {/* COLUMN 5: ACTIONS */}
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                            {/* Accept Button */}
                                            <button 
                                              onClick={() => handleAction(student.userInfo?.username, "accept")}
                                              title="Accept Student"
                                              className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition-all border border-emerald-500/20 hover:border-transparent"
                                            >
                                                <CheckCircle size={18}/>
                                            </button>

                                            {/* Reject Button */}
                                            <button 
                                              onClick={() => handleAction(student.userInfo?.username, "reject")}
                                              title="Reject Student"
                                              className="p-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded-lg transition-all border border-amber-500/20 hover:border-transparent"
                                            >
                                                <XCircle size={18}/>
                                            </button>

                                            <div className="w-[1px] h-8 bg-slate-800 mx-1"></div>

                                            {/* Remove Button */}
                                            <button 
                                              onClick={() => handleAction(student.userInfo?.username, "remove")}
                                              title="Remove Permanently"
                                              className="p-2 bg-slate-800 text-slate-500 hover:bg-red-600 hover:text-white rounded-lg transition-all border border-slate-700 hover:border-transparent"
                                            >
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Search size={32} className="opacity-20"/>
                                        <p>No students found matching your search.</p>
                                    </div>
                                </td>
                            </tr>
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

const StatusBadge = ({ status }) => {
    // Normalizing status string (lowercase) to avoid case sensitivity issues
    const st = status ? status.toLowerCase() : "pending";
    
    let style = "bg-slate-800 text-slate-400 border-slate-700";
    let text = "Pending";
    let Icon = Clock;

    if (st === "selected" || st === "accepted" || st === "enrolled") {
        style = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
        text = "Enrolled";
        Icon = CheckCircle;
    } else if (st === "rejected") {
        style = "bg-red-500/10 text-red-400 border-red-500/20";
        text = "Rejected";
        Icon = XCircle;
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${style}`}>
            <Icon size={12}/> {text}
        </span>
    );
};

export default EducationDashboard;