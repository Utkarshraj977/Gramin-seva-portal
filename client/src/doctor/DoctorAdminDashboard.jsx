import React, { useState, useEffect } from 'react';
import ChatRoom from '../Chat/ChatRoom'; 
import { 
  Users, 
  MessageSquare, 
  X, 
  Edit2, 
  Save, 
  LogOut,
  Stethoscope,
  Activity,
  CalendarCheck,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";
import { doctor } from "../services/api";

const DoctorAdminDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeChatPatient, setActiveChatPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('patients'); // 'patients' or 'requests'
  
  // Edit Form State
  const [editForm, setEditForm] = useState({
    Experience: '',
    Type: '',
    category: '',
    Start_time: '',
    End_time: '',
    location: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await doctor.get_profile();
      setProfile(response.data);
      setEditForm({
        Experience: response.data.Experience || '',
        Type: response.data.Type || '',
        category: response.data.category || '',
        Start_time: response.data.Start_time || '',
        End_time: response.data.End_time || '',
        location: response.data.location || ''
      });
    } catch (error) {
      console.error("Error fetching profile", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (patientId) => {
    try {
      await doctor.accept_request(patientId);
      toast.success("Patient request accepted!");
      fetchProfile(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept request");
    }
  };

  const handleRejectRequest = async (patientId) => {
    try {
      await doctor.reject_request(patientId);
      toast.success("Patient request rejected");
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request");
    }
  };

  const handleRemovePatient = async (patientId) => {
    if (!window.confirm("Are you sure you want to remove this patient?")) return;
    
    try {
      await doctor.remove_patient(patientId);
      toast.success("Patient removed successfully");
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove patient");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await doctor.update_profile(editForm);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  const handleStartChat = (patientId, patientName, patientAvatar) => {
    setActiveChatPatient({
        id: patientId,
        name: patientName,
        avatar: patientAvatar
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (isSidebarOpen) setIsEditing(false); 
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-teal-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
    </div>
  );

  if (!profile) return (
    <div className="p-8 text-center text-red-500 font-bold text-xl">
      Profile not found.
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-x-hidden">
      <Toaster position="top-center" />
      
      {/* Header */}
      <nav className="bg-gradient-to-r from-teal-800 via-teal-600 to-emerald-500 text-white shadow-xl sticky top-0 z-20 px-6 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3">
           <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/20 shadow-inner">
             <Stethoscope size={24} className="text-emerald-50" />
           </div>
           <span className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
             MediConnect <span className="font-light text-emerald-200">Pro</span>
           </span>
        </div>

        <div className="flex items-center gap-4">
           <span className="hidden md:block text-sm font-medium text-emerald-50 opacity-90">
             Dr. {profile.userInfo?.fullname}
           </span>
           <button 
             onClick={toggleSidebar}
             className="relative w-11 h-11 rounded-full border-2 border-emerald-300/50 hover:border-white transition-all shadow-lg focus:outline-none focus:ring-4 focus:ring-teal-300/30 active:scale-95 group"
           >
             <img 
               src={profile.userInfo?.avatar?.url || "https://ui-avatars.com/api/?name=Doc"} 
               alt="Profile" 
               className="w-full h-full rounded-full object-cover transition-transform group-hover:scale-110"
             />
             <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-teal-700 rounded-full animate-pulse"></div>
           </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-emerald-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 bg-emerald-50 rounded-full w-32 h-32 opacity-50 group-hover:scale-125 transition-transform"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Patients</p>
                            <h3 className="text-4xl font-extrabold text-slate-800 mt-2">{profile.patient?.length || 0}</h3>
                        </div>
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                            <Users size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-emerald-600 text-sm font-bold">
                        <span className="bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">+ Active now</span>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-violet-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 bg-violet-50 rounded-full w-32 h-32 opacity-50 group-hover:scale-125 transition-transform"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pending Requests</p>
                            <h3 className="text-4xl font-extrabold text-slate-800 mt-2">{profile.pendingPatientRequests?.length || 0}</h3>
                        </div>
                        <div className="p-3 bg-violet-100 text-violet-600 rounded-xl">
                            <Clock size={24} />
                        </div>
                    </div>
                    <div className="mt-4 text-violet-500 text-sm font-medium">
                        <span className="bg-violet-50 px-2 py-1 rounded-md border border-violet-100">Awaiting Review</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-amber-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 bg-amber-50 rounded-full w-32 h-32 opacity-50 group-hover:scale-125 transition-transform"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Today's Visits</p>
                            <h3 className="text-4xl font-extrabold text-slate-800 mt-2">0</h3>
                        </div>
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                            <CalendarCheck size={24} />
                        </div>
                    </div>
                    <div className="mt-4 text-amber-600 text-sm font-medium">
                        <span className="bg-amber-50 px-2 py-1 rounded-md border border-amber-100">No pending visits</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-3xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('patients')}
              className={`flex-1 px-6 py-4 font-bold text-sm transition-all ${
                activeTab === 'patients'
                  ? 'bg-teal-50 text-teal-700 border-b-4 border-teal-600'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <UserCheck size={18} />
                Accepted Patients ({profile.patient?.length || 0})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 px-6 py-4 font-bold text-sm transition-all ${
                activeTab === 'requests'
                  ? 'bg-violet-50 text-violet-700 border-b-4 border-violet-600'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Clock size={18} />
                Pending Requests ({profile.pendingPatientRequests?.length || 0})
              </div>
            </button>
          </div>

          {/* Accepted Patients Tab */}
          {activeTab === 'patients' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-left">Patient Info</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-left">Contact</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-left">Status</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profile.patient?.length > 0 ? (
                    profile.patient.map((pat, index) => (
                      <tr key={index} className="hover:bg-teal-50/30 transition-colors group duration-200">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img 
                                  src={pat.userInfo?.avatar?.url || "https://ui-avatars.com/api/?name=P"} 
                                  className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-slate-100 group-hover:border-teal-200 transition-colors"
                                  alt=""
                              />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-lg group-hover:text-teal-700 transition-colors">{pat.userInfo?.fullName}</p>
                              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                                  ID: {pat._id.slice(-4)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                            <div className="text-sm space-y-1">
                              <p className="text-slate-700 font-medium">{pat.userInfo?.email}</p>
                              <p className="text-slate-400 flex items-center gap-1">
                                  {pat.userInfo?.phone || "No Phone"}
                              </p>
                            </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Active
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                              <button 
                                  onClick={() => handleStartChat(pat._id, pat.userInfo?.fullName, pat.userInfo?.avatar?.url)}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-teal-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                              >
                                  <MessageSquare size={16} />
                                  Chat
                              </button>
                              <button
                                  onClick={() => handleRemovePatient(pat._id)}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                              >
                                  <UserX size={16} />
                                  Remove
                              </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center opacity-60">
                          <div className="bg-slate-100 p-5 rounded-full mb-4">
                               <Users className="w-10 h-10 text-slate-400" />
                          </div>
                          <p className="font-semibold text-slate-500 text-lg">No patients connected yet.</p>
                          <p className="text-sm text-slate-400">Your patient list is currently empty.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pending Requests Tab */}
          {activeTab === 'requests' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-left">Patient Info</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-left">Contact</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-left">Requested</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profile.pendingPatientRequests?.length > 0 ? (
                    profile.pendingPatientRequests.map((pat, index) => (
                      <tr key={index} className="hover:bg-violet-50/30 transition-colors group duration-200">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img 
                                  src={pat.userInfo?.avatar?.url || "https://ui-avatars.com/api/?name=P"} 
                                  className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-slate-100 group-hover:border-violet-200 transition-colors"
                                  alt=""
                              />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-lg group-hover:text-violet-700 transition-colors">{pat.userInfo?.fullName}</p>
                              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                                  ID: {pat._id.slice(-4)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                            <div className="text-sm space-y-1">
                              <p className="text-slate-700 font-medium">{pat.userInfo?.email}</p>
                              <p className="text-slate-400 flex items-center gap-1">
                                  {pat.userInfo?.phone || "No Phone"}
                              </p>
                            </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100">
                            <Clock size={14} />
                            Pending
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                              <button
                                  onClick={() => handleAcceptRequest(pat._id)}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                              >
                                  <CheckCircle size={16} />
                                  Accept
                              </button>
                              <button
                                  onClick={() => handleRejectRequest(pat._id)}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                              >
                                  <XCircle size={16} />
                                  Reject
                              </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center opacity-60">
                          <div className="bg-slate-100 p-5 rounded-full mb-4">
                               <Clock className="w-10 h-10 text-slate-400" />
                          </div>
                          <p className="font-semibold text-slate-500 text-lg">No pending requests.</p>
                          <p className="text-sm text-slate-400">You'll see patient requests here.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Profile Sidebar */}
      <div 
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />

      <div 
        className={`fixed top-0 right-0 h-full w-[350px] sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-32 bg-gradient-to-br from-teal-700 to-emerald-500 relative flex justify-end p-4">
              <button 
                onClick={toggleSidebar} 
                className="text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full backdrop-blur-md transition-colors h-fit"
            >
                <X size={20} />
            </button>
        </div>

        <div className="px-8 pb-8 -mt-16 h-[calc(100%-128px)] overflow-y-auto">
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                    <img 
                        src={profile.userInfo?.avatar?.url || "https://via.placeholder.com/150"} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full border-[6px] border-white shadow-xl object-cover bg-white"
                    />
                </div>
                
                <h3 className="mt-4 text-2xl font-bold text-slate-800">{profile.userInfo?.fullname}</h3>
                <span className="mt-1 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wide rounded-full">
                    {profile.category} Specialist
                </span>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Professional Info</h4>
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-sm text-teal-600 font-bold hover:text-teal-800 transition-colors hover:underline"
                    >
                        {isEditing ? "Cancel" : "Edit"}
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Experience</label>
                        {isEditing ? (
                            <input 
                              type="text" 
                              value={editForm.Experience} 
                              onChange={(e) => setEditForm({...editForm, Experience: e.target.value})}
                              className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" 
                            />
                        ) : (
                            <p className="text-slate-700 font-medium bg-slate-50 p-3 rounded-xl">{profile.Experience} years</p>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Category</label>
                        {isEditing ? (
                            <input 
                              type="text" 
                              value={editForm.category} 
                              onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                              className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" 
                            />
                        ) : (
                            <p className="text-slate-700 font-medium bg-slate-50 p-3 rounded-xl">{profile.category}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Location</label>
                        {isEditing ? (
                            <input 
                              type="text" 
                              value={editForm.location} 
                              onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                              className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" 
                            />
                        ) : (
                            <p className="text-slate-700 font-medium bg-slate-50 p-3 rounded-xl">{profile.location}</p>
                        )}
                    </div>
                </div>
             </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 bg-white border-t border-slate-100 space-y-3">
            {isEditing ? (
                <button 
                  onClick={handleUpdateProfile}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-200 hover:shadow-xl transition-all active:scale-95"
                >
                    <Save size={18} />
                    Save Changes
                </button>
            ) : (
                <button 
                  onClick={handleLogout}
                  className="w-full bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            )}
        </div>
      </div>

      {/* Chat Modal */}
      {activeChatPatient && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="relative w-full max-w-4xl h-[85vh] flex flex-col">
               <button 
                  onClick={() => setActiveChatPatient(null)}
                  className="self-end mb-2 text-white hover:text-rose-300 font-bold flex items-center gap-2 transition-colors bg-black/40 px-3 py-1 rounded-full backdrop-blur-md"
               >
                  <X size={20} /> Close Chat
               </button>

               <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-2xl">
                   <ChatRoom 
                      roomId={[profile._id, activeChatPatient.id].sort().join("-")}
                      currentUser={{
                          name: profile.userInfo.fullname || profile.userInfo.username,
                          id: profile._id
                      }}
                      targetUser={{
                          name: activeChatPatient.name,
                          avatar: activeChatPatient.avatar
                      }}
                   />
               </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAdminDashboard;