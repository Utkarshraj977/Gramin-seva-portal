import React, { useState, useEffect } from 'react';
import ChatRoom from '../Chat/ChatRoom'; 
import {
  Search,
  MessageSquare,
  X,
  UserPlus,
  ShieldCheck,
  Stethoscope,
  MapPin,
  Clock,
  Loader2,
  XCircle,
  UserX,
  Edit2,
  Save,
  LogOut,
  CheckCircle
} from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";
import { doctor, patient } from "../services/api";

const DoctorUserDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [activeChatDoctor, setActiveChatDoctor] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'connected', 'pending'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editForm, setEditForm] = useState({
    Age: '',
    Sex: '',
    message: '',
    location: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [docRes, userRes] = await Promise.all([
          doctor.get_all_doctors(),
          patient.get_current_patient()
      ]);

      setDoctors(docRes.data || []);
      setFilteredDoctors(docRes.data || []);
      setCurrentUser(userRes.data);
      setEditForm({
        Age: userRes.data.Age || '',
        Sex: userRes.data.Sex || '',
        message: userRes.data.message || '',
        location: userRes.data.location || ''
      });
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const results = doctors.filter(doc => {
      const name = doc.userInfo?.fullname || "";
      const category = doc.category || "";
      const term = searchTerm.toLowerCase();
      return name.toLowerCase().includes(term) || category.toLowerCase().includes(term);
    });
    setFilteredDoctors(results);
  }, [searchTerm, doctors]);

  const handleRequestDoctor = async (doctorId) => {
    setRequestingId(doctorId);
    try {
      await patient.request_doctor(doctorId);
      toast.success("Request sent to doctor!");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    } finally {
      setRequestingId(null);
    }
  };

  const handleCancelRequest = async (doctorId) => {
    try {
      await patient.cancel_request(doctorId);
      toast.success("Request cancelled");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel request");
    }
  };

  const handleRemoveDoctor = async (doctorId) => {
    if (!window.confirm("Are you sure you want to disconnect from this doctor?")) return;
    
    try {
      await patient.remove_doctor(doctorId);
      toast.success("Doctor removed successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove doctor");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await patient.update_profile(editForm);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      fetchData();
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

  const handleStartChat = (doc) => {
    if (!currentUser) {
      toast.error("Please log in to chat.");
      return;
    }
    setActiveChatDoctor(doc);
  };

  const getDoctorStatus = (docId) => {
    if (currentUser?.doctors?.some(d => d._id === docId)) {
      return 'connected';
    }
    if (currentUser?.pendingDoctorRequests?.some(d => d._id === docId)) {
      return 'pending';
    }
    return 'available';
  };

  const getFilteredByTab = () => {
    if (activeTab === 'connected') {
      return filteredDoctors.filter(doc => 
        currentUser?.doctors?.some(d => d._id === doc._id)
      );
    }
    if (activeTab === 'pending') {
      return filteredDoctors.filter(doc => 
        currentUser?.pendingDoctorRequests?.some(d => d._id === doc._id)
      );
    }
    return filteredDoctors;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative overflow-x-hidden">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-600 to-emerald-500 text-white border-b border-teal-700 sticky top-0 z-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
                Find a Specialist
              </h1>
              <p className="text-emerald-100 text-sm mt-1">
                Request appointments & chat with top-rated doctors.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-teal-200" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or category..."
                  className="block w-full pl-10 pr-3 py-2.5 border border-teal-500 rounded-xl leading-5 bg-teal-900/30 text-white placeholder-teal-200 focus:outline-none focus:bg-teal-900/50 focus:ring-2 focus:ring-emerald-400 transition-all duration-200 sm:text-sm backdrop-blur-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {currentUser && (
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="w-10 h-10 rounded-full border-2 border-emerald-300/50 hover:border-white transition-all shadow-lg"
                >
                  <img 
                    src={currentUser.userInfo?.avatar?.url || "https://ui-avatars.com/api/?name=P"} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'all'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Doctors
          </button>
          <button
            onClick={() => setActiveTab('connected')}
            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'connected'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckCircle size={16} />
            My Doctors ({currentUser?.doctors?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock size={16} />
            Pending ({currentUser?.pendingDoctorRequests?.length || 0})
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredByTab().map((doc) => {
              const status = getDoctorStatus(doc._id);
              
              return (
                <div
                  key={doc._id}
                  className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col relative"
                >
                  <div className="h-24 bg-gradient-to-br from-teal-50 to-emerald-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-100 rounded-full blur-2xl opacity-60 -mr-10 -mt-10"></div>
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/90 text-teal-700 backdrop-blur-sm border border-teal-100 shadow-sm">
                        {doc.Type || "Specialist"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex-1 flex flex-col">
                    <div className="relative -mt-12 mb-4 flex justify-between items-end">
                      <div className="relative">
                        <img
                          src={doc.userInfo?.avatar?.url || "https://ui-avatars.com/api/?name=Doc"}
                          alt="Doctor"
                          className="w-24 h-24 rounded-2xl object-cover border-[4px] border-white shadow-md bg-white"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm" title="Verified">
                          <ShieldCheck size={14} className="text-white" />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-extrabold text-slate-800 tracking-tight">
                          {doc.Experience || 0}<span className="text-sm font-semibold text-slate-400 ml-1">yrs</span>
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Experience</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-teal-600 transition-colors">
                        {doc.userInfo?.fullname || "Unknown Doctor"}
                      </h3>
                      <div className="flex items-center gap-2 text-teal-600 text-sm font-semibold mb-4 bg-teal-50 w-fit px-2 py-1 rounded-md">
                        <Stethoscope size={16} />
                        <span>{doc.category || "General"}</span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3 text-sm text-slate-600">
                          <MapPin size={18} className="text-slate-400 mt-0.5 shrink-0" />
                          <span className="line-clamp-1 font-medium">{doc.location || "Location not available"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <Clock size={18} className="text-slate-400 shrink-0" />
                          <span className="font-medium">Available Today</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto">
                      {status === 'connected' && (
                        <div className="grid grid-cols-5 gap-2">
                          <button
                            onClick={() => handleStartChat(doc)}
                            className="col-span-4 flex items-center justify-center gap-2 bg-slate-900 hover:bg-teal-600 text-white py-3 px-4 rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                          >
                            <MessageSquare size={18} />
                            Chat
                          </button>
                          <button
                            onClick={() => handleRemoveDoctor(doc._id)}
                            className="col-span-1 flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                            title="Disconnect"
                          >
                            <UserX size={20} />
                          </button>
                        </div>
                      )}

                      {status === 'pending' && (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            disabled
                            className="flex items-center justify-center gap-2 bg-violet-100 text-violet-600 py-3 px-4 rounded-xl font-bold cursor-not-allowed"
                          >
                            <Clock size={18} className="animate-pulse" />
                            Pending
                          </button>
                          <button
                            onClick={() => handleCancelRequest(doc._id)}
                            className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white py-3 px-4 rounded-xl font-bold transition-all active:scale-95"
                          >
                            <XCircle size={18} />
                            Cancel
                          </button>
                        </div>
                      )}

                      {status === 'available' && (
                        <button
                          onClick={() => handleRequestDoctor(doc._id)}
                          disabled={requestingId === doc._id}
                          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-teal-600 text-white py-3 px-4 rounded-xl font-bold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
                        >
                          {requestingId === doc._id ? (
                            <>
                              <Loader2 className="animate-spin" size={18}/>
                              Requesting...
                            </>
                          ) : (
                            <>
                              <UserPlus size={18} />
                              Request
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Profile Sidebar */}
      <div 
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div 
        className={`fixed top-0 right-0 h-full w-[350px] sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-32 bg-gradient-to-br from-teal-700 to-emerald-500 relative flex justify-end p-4">
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full backdrop-blur-md transition-colors h-fit"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-8 pb-8 -mt-16 h-[calc(100%-128px)] overflow-y-auto">
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <img 
                src={currentUser?.userInfo?.avatar?.url || "https://via.placeholder.com/150"} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-[6px] border-white shadow-xl object-cover bg-white"
              />
            </div>
            
            <h3 className="mt-4 text-2xl font-bold text-slate-800">{currentUser?.userInfo?.fullname}</h3>
            <span className="mt-1 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wide rounded-full">
              Patient
            </span>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Personal Info</h4>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-teal-600 font-bold hover:text-teal-800 transition-colors hover:underline"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Age</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editForm.Age} 
                    onChange={(e) => setEditForm({...editForm, Age: e.target.value})}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" 
                  />
                ) : (
                  <p className="text-slate-700 font-medium bg-slate-50 p-3 rounded-xl">{currentUser?.Age}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Sex</label>
                {isEditing ? (
                  <select 
                    value={editForm.Sex} 
                    onChange={(e) => setEditForm({...editForm, Sex: e.target.value})}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-slate-700 font-medium bg-slate-50 p-3 rounded-xl">{currentUser?.Sex}</p>
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
                  <p className="text-slate-700 font-medium bg-slate-50 p-3 rounded-xl">{currentUser?.location}</p>
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
      {activeChatDoctor && currentUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl h-[85vh] flex flex-col">
            <button 
              onClick={() => setActiveChatDoctor(null)}
              className="self-end mb-2 text-white hover:text-emerald-300 font-bold flex items-center gap-2 transition-colors bg-black/40 px-3 py-1 rounded-full backdrop-blur-md"
            >
              <X size={20} /> Close
            </button>

            <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
              <ChatRoom 
                roomId={[activeChatDoctor._id, currentUser._id].sort().join("-")}
                currentUser={{
                  name: currentUser.userInfo?.fullname || "Patient",
                  id: currentUser._id
                }}
                targetUser={{
                  name: activeChatDoctor.userInfo?.fullname || "Doctor",
                  avatar: activeChatDoctor.userInfo?.avatar?.url
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorUserDashboard;