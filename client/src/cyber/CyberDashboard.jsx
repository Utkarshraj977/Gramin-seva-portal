import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { 
  Users, CheckCircle, Clock, XCircle, MapPin, 
  Briefcase, Calendar, Power, RefreshCw 
} from "lucide-react";

const CyberDashboard = () => {
  const [stats, setStats] = useState({ total: 0, selected: 0, pending: 0 });
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Backend URL (Change Port if needed)
  const BASE_URL = "http://localhost:8000/api/v1/cyberadmin";
  const token = localStorage.getItem("accessToken"); // Assuming token is stored

  // Helper for Headers
  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });

  // Fetch All Data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, profileRes] = await Promise.all([
        axios.get(`${BASE_URL}/stats`, getHeaders()),
        axios.get(`${BASE_URL}/allcyber`, getHeaders()),
        axios.get(`${BASE_URL}/profile`, getHeaders()),
      ]);

      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setProfile(profileRes.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard data. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle Action (Accept/Reject)
// Handle Accept/Reject
  const handleStatusUpdate = async (username, status) => {
    try {
      // 1. Backend API Call
      await axios.post(`${BASE_URL}/cyberSumbit`, { username, status }, getHeaders());
      
      // 2. Success Message
      const action = status === 'selected' ? 'Approved' : 'Rejected';
      toast.success(`User ${username} marked as ${action}`);
      
      // 3. IMPORTANT: Data turant refresh karein
      // Thoda delay dete hain taaki backend DB write complete kar le
      setTimeout(() => {
          fetchDashboardData();
      }, 300);

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  if (loading && !profile) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-blue-400">
      <RefreshCw className="animate-spin w-10 h-10" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans pb-10">
      <Toaster position="top-right" />
      
      {/* 1. Profile Header Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 p-8 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <img 
              src={profile?.cyber_shopPic?.url || "https://via.placeholder.com/150"} 
              alt="Shop Logo" 
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-blue-500/20 shadow-lg"
            />
            <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-gray-800"></div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white tracking-wide">
              {profile?.userInfo?.username?.toUpperCase() || "ADMIN"}'S SHOP
            </h1>
            <p className="text-gray-400 text-sm mt-1 mb-3">{profile?.userInfo?.email}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1 bg-gray-700 px-3 py-1 rounded-full">
                <MapPin size={14} className="text-blue-400" /> {profile?.location}
              </span>
              <span className="flex items-center gap-1 bg-gray-700 px-3 py-1 rounded-full">
                <Briefcase size={14} className="text-purple-400" /> {profile?.Experience} Exp
              </span>
              <span className="flex items-center gap-1 bg-gray-700 px-3 py-1 rounded-full">
                <Clock size={14} className="text-orange-400" /> {profile?.Start_time} - {profile?.End_time}
              </span>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center min-w-[150px]">
            <span className="block text-gray-400 text-xs uppercase tracking-widest">Shop Status</span>
            <span className="text-green-400 font-bold text-lg flex items-center justify-center gap-2">
              <Power size={16} /> OPEN
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        {/* 2. Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            icon={<Users size={28} />} 
            label="Total Applicants" 
            value={stats.total} 
            color="bg-gradient-to-br from-blue-600 to-blue-800" 
          />
          <StatCard 
            icon={<CheckCircle size={28} />} 
            label="Approved Requests" 
            value={stats.selected} 
            color="bg-gradient-to-br from-emerald-600 to-emerald-800" 
          />
          <StatCard 
            icon={<Clock size={28} />} 
            label="Pending Actions" 
            value={stats.pending} 
            color="bg-gradient-to-br from-amber-600 to-amber-800" 
          />
        </div>

        {/* 3. Applicants Table */}
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Calendar size={20} className="text-blue-400" /> Recent Requests
            </h2>
            <button onClick={fetchDashboardData} className="text-gray-400 hover:text-white transition">
              <RefreshCw size={18} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-700/50 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Request Message</th>
                  <th className="px-6 py-4">Requested Time</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-sm">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-700/30 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white text-base">
                          {user.userInfo?.username}
                        </div>
                        <div className="text-gray-500 text-xs">{user.userInfo?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-300 max-w-xs truncate" title={user.message}>
                        {user.message}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {user.Start_time} - {user.End_time}
                      </td>
                      <td className="px-6 py-4 text-gray-400 flex items-center gap-1">
                        <MapPin size={12}/> {user.location}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          user.message === 'selected' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                          user.message === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}>
                          {user.message === 'selected' ? 'APPROVED' : user.message === 'rejected' ? 'REJECTED' : 'PENDING'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button 
                            onClick={() => handleStatusUpdate(user.userInfo.username, "selected")}
                            className="p-2 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white rounded-lg transition-all"
                            title="Accept"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(user.userInfo.username, "rejected")}
                            className="p-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all"
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No requests received yet.
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

// Component for Stats
const StatCard = ({ icon, label, value, color }) => (
  <div className={`${color} p-6 rounded-2xl shadow-lg relative overflow-hidden group`}>
    <div className="relative z-10 flex items-center justify-between">
      <div>
        <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">{label}</p>
        <h3 className="text-4xl font-extrabold text-white mt-1 drop-shadow-md">{value}</h3>
      </div>
      <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm text-white">
        {icon}
      </div>
    </div>
    {/* Decorative circle */}
    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
  </div>
);

export default CyberDashboard;