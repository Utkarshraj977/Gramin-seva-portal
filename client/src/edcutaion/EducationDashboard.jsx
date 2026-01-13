import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
// ✅ YOUR CORRECT PATH
import ChatRoom from '../Chat/ChatRoom'; 
import { 
    Users, DollarSign, Clock, MapPin, CheckCircle, XCircle, 
    Search, Settings, LayoutDashboard, UserCheck, Menu, X, Save, MessageSquare
} from "lucide-react";

const EducationDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);

    // Data
    const [stats, setStats] = useState(null);
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Chat & User State
    const [activeChatStudent, setActiveChatStudent] = useState(null);
    const [currentEducator, setCurrentEducator] = useState(null);

    // Profile Form
    const [profileData, setProfileData] = useState({ fee: "", Start_time: "", End_time: "", location: "" });

    // --- FETCH DATA ---
    const fetchAllData = async () => {
        setLoading(true);
        try {
            // 1. Get Stats
            const statsRes = await axios.get("http://localhost:8000/api/v1/education/dashboard/stats", { withCredentials: true });
            setStats(statsRes.data.data);

            // 2. Get Current User (Fixed Logic)
            try {
                const userRes = await axios.get("http://localhost:8000/api/v1/users/current-user", { withCredentials: true });
                setCurrentEducator(userRes.data.data); // Store the User Object
                console.log("Logged In Admin ID:", userRes.data.data._id); 
            } catch (err) {
                console.error("Failed to fetch user ID for chat", err);
            }

            // Pre-fill form
            setProfileData({
                fee: statsRes.data.data.fee || "",
                Start_time: statsRes.data.data.timings?.split(" - ")[0] || "",
                End_time: statsRes.data.data.timings?.split(" - ")[1] || "",
                location: statsRes.data.data.location || ""
            });

            // 3. Get Student List
            const studentsRes = await axios.post("http://localhost:8000/api/v1/education/allstudent", {}, { withCredentials: true });
            setStudents(studentsRes.data.data || []);

        } catch (error) {
            console.error("Load Error:", error);
            toast.error("Could not sync data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // --- HANDLERS ---
    const handleApprove = async (username) => {
        try {
            await axios.post(`http://localhost:8000/api/v1/education/allstudent/submit/${username}`, {}, { withCredentials: true });
            toast.success("Student Enrolled Successfully!");
            setStudents(prev => prev.map(s =>
                s.userInfo?.username === username ? { ...s, message: 'selected' } : s
            ));
        } catch (error) {
            toast.error("Approval failed");
        }
    };

    const handleReject = async (username) => {
        if (!window.confirm("Reject this student?")) return;
        try {
            await axios.post(`http://localhost:8000/api/v1/education/student/reject/${username}`, {}, { withCredentials: true });
            toast.success("Student Rejected");
            setStudents(prev => prev.map(s =>
                s.userInfo?.username === username ? { ...s, message: 'rejected' } : s
            ));
        } catch (error) {
            toast.error("Rejection failed");
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const updatePayload = {
                fee: profileData.fee,
                location: profileData.location,
                batchTiming: `${profileData.Start_time} - ${profileData.End_time}`
            };
            await axios.patch("http://localhost:8000/api/v1/education/profile/update", updatePayload, { withCredentials: true });
            toast.success("Profile Updated!");
            fetchAllData();
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const handleStartChat = (student) => {
        setActiveChatStudent(student);
    };

    const filteredStudents = students.filter(stu =>
        stu.userInfo?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stu.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans relative">
            <Toaster position="top-right" />

            {/* SIDEBAR */}
            <motion.aside
                initial={{ x: -100 }} animate={{ x: 0 }}
                className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-900 text-white transition-all duration-300 flex flex-col shadow-2xl z-20`}
            >
                <div className="p-6 flex items-center justify-between">
                    {sidebarOpen && <h1 className="text-2xl font-bold font-serif tracking-wider text-amber-400">EDU ADMIN</h1>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-blue-800 rounded-lg">
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
                <nav className="flex-1 mt-6 px-4 space-y-3">
                    <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} open={sidebarOpen} />
                    <SidebarItem icon={<Users size={20} />} label="Students" active={activeTab === 'students'} onClick={() => setActiveTab('students')} open={sidebarOpen} />
                    <SidebarItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} open={sidebarOpen} />
                </nav>
            </motion.aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">

                {loading && !stats ? (
                    <div className="flex justify-center items-center h-full"><div className="w-12 h-12 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div></div>
                ) : (
                    <AnimatePresence mode="wait">

                        {/* 1. DASHBOARD OVERVIEW */}
                        {activeTab === 'dashboard' && (
                            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard title="Total Students" value={stats?.totalStudents || 0} icon={<Users className="text-blue-600" />} color="bg-blue-50 border-blue-200" />
                                    <StatCard title="Active Enrolled" value={stats?.activeStudents || 0} icon={<UserCheck className="text-green-600" />} color="bg-green-50 border-green-200" />
                                    <StatCard title="Pending Requests" value={stats?.pendingRequests || 0} icon={<Clock className="text-amber-600" />} color="bg-amber-50 border-amber-200" />
                                    <StatCard title="Est. Earnings" value={`₹${stats?.estimatedEarnings || 0}`} icon={<DollarSign className="text-purple-600" />} color="bg-purple-50 border-purple-200" />
                                </div>
                            </motion.div>
                        )}

                        {/* 2. STUDENTS TAB */}
                        {activeTab === 'students' && (
                            <motion.div key="students" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <div className="flex mb-6">
                                    <div className="relative w-full md:w-96">
                                        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                        <input type="text" placeholder="Search students..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredStudents.map(student => (
                                        <div key={student._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
                                            <div className={`absolute top-0 left-0 w-2 h-full ${getStatusColor(student.message)}`}></div>

                                            <div className="flex justify-between items-start mb-4 pl-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={student.userInfo?.avatar?.url || "https://ui-avatars.com/api/?name=St"} alt="av" className="w-12 h-12 rounded-full object-cover bg-gray-100 border border-gray-200" />
                                                    <div>
                                                        <h4 className="font-bold text-gray-800">{student.userInfo?.fullname}</h4>
                                                        <p className="text-xs text-gray-500">@{student.userInfo?.username}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleStartChat(student)} className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition" title="Chat">
                                                        <MessageSquare size={16} />
                                                    </button>
                                                    <Badge status={student.message} />
                                                </div>
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
                                                        className={`flex-1 py-2 rounded-lg font-semibold text-sm flex justify-center items-center gap-2 ${student.message === 'selected' ? 'bg-green-100 text-green-700 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'}`}
                                                    >
                                                        {student.message === 'selected' ? <><CheckCircle size={16} /> Enrolled</> : <>Approve <CheckCircle size={16} /></>}
                                                    </button>
                                                )}

                                                {student.message !== 'rejected' && student.message !== 'selected' && (
                                                    <button onClick={() => handleReject(student.userInfo?.username)} className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg border border-red-200 transition-colors" title="Reject Student">
                                                        <XCircle size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* 3. SETTINGS TAB */}
                        {activeTab === 'settings' && (
                            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <Settings className="text-blue-600" /> Edit Profile
                                </h3>
                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    {/* (Settings form fields - same as before) */}
                                    <div><label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Fee (₹)</label><input type="number" value={profileData.fee} onChange={(e) => setProfileData({ ...profileData, fee: e.target.value })} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label><input type="time" value={profileData.Start_time} onChange={(e) => setProfileData({ ...profileData, Start_time: e.target.value })} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                                        <div><label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label><input type="time" value={profileData.End_time} onChange={(e) => setProfileData({ ...profileData, End_time: e.target.value })} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                                    </div>
                                    <div><label className="block text-sm font-semibold text-gray-700 mb-2">Location</label><input type="text" value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                                    <button className="w-full py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2">Save Changes <Save size={18} /></button>
                                </form>
                            </motion.div>
                        )}

                    </AnimatePresence>
                )}
            </main>

            {/* 5. CHAT MODAL */}
            {activeChatStudent && currentEducator && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="relative w-full max-w-4xl h-[85vh] flex flex-col">
                        <button
                            onClick={() => setActiveChatStudent(null)}
                            className="self-end mb-2 text-white hover:text-blue-300 font-bold flex items-center gap-2 transition-colors bg-black/40 px-3 py-1 rounded-full backdrop-blur-md"
                        >
                            <X size={20} /> Close Chat
                        </button>

                        <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-2xl">
                            <ChatRoom
                                // Room ID: EducatorID-StudentID sorted
                                roomId={[String(currentEducator._id), String(activeChatStudent._id)].sort().join("-")}
                                currentUser={{
                                    // ✅ FIX: Use simple property access because currentEducator is the User object now
                                    name: currentEducator.fullname || currentEducator.username || "Educator",
                                    id: currentEducator._id
                                }}
                                targetUser={{
                                    name: activeChatStudent.userInfo?.fullname,
                                    avatar: activeChatStudent.userInfo?.avatar?.url
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

// ... Helper Components ...
const SidebarItem = ({ icon, label, active, onClick, open }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${active ? 'bg-blue-800 text-amber-400 shadow-md' : 'text-blue-100 hover:bg-blue-800/50'}`}>
        {icon} {open && <span className="font-medium">{label}</span>}
    </button>
);

const StatCard = ({ title, value, icon, color }) => (
    <div className={`p-6 rounded-2xl border ${color} shadow-sm flex items-center justify-between`}>
        <div><p className="text-gray-500 text-sm font-medium mb-1">{title}</p><h3 className="text-2xl font-bold text-gray-800">{value}</h3></div>
        <div className="p-3 bg-white rounded-full shadow-sm">{icon}</div>
    </div>
);

const Badge = ({ status }) => {
    const styles = { selected: "bg-green-100 text-green-700 border-green-200", rejected: "bg-red-100 text-red-700 border-red-200", pending: "bg-amber-100 text-amber-700 border-amber-200" };
    const text = status === 'selected' ? 'Enrolled' : status === 'rejected' ? 'Rejected' : 'Pending';
    return <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${styles[status] || styles.pending}`}>{text}</span>;
};

const getStatusColor = (status) => {
    if (status === 'selected') return 'bg-green-500';
    if (status === 'rejected') return 'bg-red-500';
    return 'bg-amber-400';
};

export default EducationDashboard;