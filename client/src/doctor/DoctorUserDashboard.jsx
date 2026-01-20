import React, { useState, useEffect } from 'react';
import ChatRoom from '../Chat/ChatRoom'; 
import {
  Search,
  Filter,
  MessageSquare,
  X,
  UserPlus,
  ShieldCheck,
  Stethoscope,
  MapPin,
  Clock,
  Loader2
} from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";

// ✅ Import Services
import { doctor, patient } from "../services/api";

const DoctorUserDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectingId, setConnectingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Chat State
  const [currentUser, setCurrentUser] = useState(null);
  const [activeChatDoctor, setActiveChatDoctor] = useState(null);

  // --- 1. Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Use Services (Parallel Fetch)
        const [docRes, userRes] = await Promise.all([
            doctor.get_all_doctors(),
            patient.get_current_patient()
        ]);

        // Handle Doctors Data
        setDoctors(docRes.data || []);
        setFilteredDoctors(docRes.data || []);

        // Handle Current Patient Data
        setCurrentUser(userRes.data);

      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. Search Logic ---
  useEffect(() => {
    const results = doctors.filter(doc => {
      const name = doc.userInfo?.fullname || "";
      const category = doc.category || "";
      const term = searchTerm.toLowerCase();
      return name.toLowerCase().includes(term) || category.toLowerCase().includes(term);
    });
    setFilteredDoctors(results);
  }, [searchTerm, doctors]);

  // --- 3. Connect Logic ---
  const handleConnect = async (doctorId) => {
    setConnectingId(doctorId);
    try {
      // ✅ Use Service
      await patient.select_doctor(doctorId);
      toast.success("Connected! You can now chat.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to connect.");
    } finally {
      setConnectingId(null);
    }
  };

  // --- 4. Chat Logic ---
  const handleStartChat = (doctor) => {
    if (!currentUser) {
      toast.error("Please log in to chat.");
      return;
    }
    setActiveChatDoctor(doctor);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative overflow-x-hidden">
      <Toaster position="top-center" />

      {/* --- Header --- */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-600 to-emerald-500 text-white border-b border-teal-700 sticky top-0 z-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
                Find a Specialist
              </h1>
              <p className="text-emerald-100 text-sm mt-1">
                Book appointments & chat with top-rated doctors.
              </p>
            </div>

            {/* Search Bar */}
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
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            {/* No Results */}
            {filteredDoctors.length === 0 && (
              <div className="text-center py-20">
                <div className="bg-white p-4 rounded-full inline-block mb-4 shadow-sm">
                  <Filter className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No doctors found</h3>
                <p className="text-slate-500">Try adjusting your search terms.</p>
              </div>
            )}

            {/* Doctor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doc) => (
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
                    {/* Avatar */}
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

                    {/* Info */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-teal-600 transition-colors">
                        {doc.userInfo?.fullName || "Unknown Doctor"}
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
                    <div className="mt-auto grid grid-cols-5 gap-2">
                      <button
                        onClick={() => handleConnect(doc._id)}
                        disabled={connectingId === doc._id}
                        className="col-span-4 flex items-center justify-center gap-2 bg-slate-900 hover:bg-teal-600 text-white py-3 px-4 rounded-xl font-bold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
                      >
                        {connectingId === doc._id ? (
                          <>
                            <Loader2 className="animate-spin" size={18}/>
                            <span>Connecting...</span>
                          </>
                        ) : (
                          <>
                            <UserPlus size={18} />
                            <span>Connect</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleStartChat(doc)}
                        className="col-span-1 flex items-center justify-center bg-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                        title="Chat with Doctor"
                      >
                        <MessageSquare size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* --- CHAT MODAL --- */}
      {activeChatDoctor && currentUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="relative w-full max-w-4xl h-[85vh] flex flex-col">
               <button 
                  onClick={() => setActiveChatDoctor(null)}
                  className="self-end mb-2 text-white hover:text-emerald-300 font-bold flex items-center gap-2 transition-colors bg-black/40 px-3 py-1 rounded-full backdrop-blur-md"
               >
                  <X size={20} /> Close
               </button>

               <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                   <ChatRoom 
                      // 1. Room ID: [DoctorID, PatientID]
                      roomId={[activeChatDoctor._id, currentUser._id].sort().join("-")}

                      // 2. Current User (Patient)
                      currentUser={{
                          name: currentUser.userInfo?.fullName || "Patient",
                          id: currentUser._id
                      }}

                      // 3. Target User (Doctor)
                      targetUser={{
                          name: activeChatDoctor.userInfo?.fullName || "Doctor",
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