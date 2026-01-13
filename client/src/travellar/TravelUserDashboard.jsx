import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
// ✅ Ensure this path matches your file structure
import ChatRoom from '../Chat/ChatRoom';
import {
  Search, Filter, MapPin, Phone, User, CheckCircle,
  Car, Loader2, Zap, MessageSquare, X, Clock, Navigation,
  XCircle, AlertCircle
} from "lucide-react";

const TravelUserDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Active Ride State
  const [activeRide, setActiveRide] = useState(null);
  const [activeChatDriver, setActiveChatDriver] = useState(null);

  // Filters & Search
  const [filterType, setFilterType] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Loading states for specific actions
  const [joiningId, setJoiningId] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);

  // --- 1. FETCH DATA & CHECK STATUS ---
  const fetchData = async () => {
    try {
      // A. Get Current User (Passenger)
      const userRes = await axios.get('http://localhost:8000/api/v1/users/current-user', { withCredentials: true });
      const user = userRes.data.data;
      setCurrentUser(user);

      // B. Get All Drivers (Admins)
      let url = "http://localhost:8000/api/v1/traveller/allTravelAdmin";
      // Apply Filters
      if (filterCategory !== "All") url = `http://localhost:8000/api/v1/traveller/gettraveladminCat/${filterCategory}`;
      else if (filterType !== "All") url = `http://localhost:8000/api/v1/traveller/gettraveladminTyp/${filterType}`;

      const response = await axios.get(url, { withCredentials: true });
      const driversList = response.data.data.Alladmin || response.data.data || [];
      setAdmins(Array.isArray(driversList) ? driversList : []);

      // C. Find the driver who accepted ME
      const myAcceptedDriver = driversList.find(driver => {
        if (!driver.AllTraveller || !Array.isArray(driver.AllTraveller)) return false;

        const myRecord = driver.AllTraveller.find(t => {
          const t_uid = t.userInfo?._id ? String(t.userInfo._id) : String(t.userInfo);
          return t_uid === String(user._id);
        });

        return myRecord && (myRecord.message === 'accepted' || myRecord.status === 'accepted');
      });

      setActiveRide(myAcceptedDriver || null);

    } catch (error) {
      console.error("Dashboard Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Poll for updates
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [filterCategory, filterType]);

  // --- 2. JOIN RIDE HANDLER ---
  const handleJoinDriver = async (adminId) => {
    setJoiningId(adminId);
    try {
      await axios.patch(`http://localhost:8000/api/v1/traveller/setuserintoadmin/${adminId}`, {}, { withCredentials: true });
      toast.success("Request Sent! Waiting for driver approval.");
      fetchData();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to join";
      toast.error(msg);
    } finally {
      setJoiningId(null);
    }
  };

  // --- 3. CANCEL RIDE/REQUEST HANDLER ---
  const handleCancelRide = async (adminId) => {
    if (!window.confirm("Are you sure you want to cancel this ride/request?")) return;

    setCancelingId(adminId);
    try {
      // NOTE: You need to add this endpoint to your backend (User removing themselves)
      await axios.patch(`http://localhost:8000/api/v1/traveller/leave-admin/${adminId}`, {}, { withCredentials: true });
      toast.success("Ride cancelled successfully");
      setActiveRide(null); // Clear active ride locally immediately
      fetchData();
    } catch (error) {
      // Fallback: If specific endpoint doesn't exist, try the delete endpoint (though that is usually for admins)
      toast.error(error.response?.data?.message || "Failed to cancel ride");
    } finally {
      setCancelingId(null);
    }
  };

  const handleStartChat = (driver) => {
    setActiveChatDriver(driver);
  };

  const displayedAdmins = admins.filter((admin) => {
    if (!searchQuery) return true;
    return admin.userInfo?.fullname?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-10 relative">
      <Toaster position="top-center" />

      {/* HEADER */}
      <header className="bg-white sticky top-0 z-20 shadow-sm border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white"><Car size={20} /></div>
            <h1 className="text-xl font-extrabold text-slate-800 hidden md:block">Traveller<span className="text-indigo-600">Pro</span></h1>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search drivers..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-full border-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 shadow-sm">
            {currentUser?.fullname?.charAt(0) || <User size={20} />}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-6">

        {/* --- SECTION 1: MY ACCEPTED RIDE (The "Section" requested) --- */}
        <AnimatePresence>
          {activeRide && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="mb-10"
            >
              <div className="flex items-center gap-2 mb-3 px-1">
                <Zap className="text-amber-500 fill-amber-500" size={20} />
                <h2 className="text-lg font-bold text-slate-800">Current Ride Status</h2>
              </div>

              <div className="bg-white rounded-[24px] p-6 shadow-xl shadow-emerald-100 border border-emerald-100 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-16 -mt-16 z-0 mix-blend-multiply opacity-50"></div>

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    {/* Driver Info */}
                    <div className="flex gap-5">
                      <div className="h-24 w-24 rounded-2xl bg-gray-200 overflow-hidden border-4 border-white shadow-md flex-shrink-0">
                        <img src={activeRide.userInfo?.avatar?.url || activeRide.CarPhoto} className="h-full w-full object-cover" alt="Driver" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <CheckCircle size={12} /> Confirmed
                          </span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800">{activeRide.userInfo?.fullname}</h2>
                        <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold border border-slate-200 text-sm">{activeRide.carNumber}</span>
                          <span>•</span>
                          <span className="text-sm">{activeRide.category}</span>
                        </p>
                      </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="flex flex-col gap-3 w-full md:w-auto min-w-[200px]">
                      <button
                        onClick={() => handleStartChat(activeRide)}
                        className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        <MessageSquare size={18} /> Message Driver
                      </button>

                      <div className="flex gap-2">
                        {activeRide.userInfo?.phone && (
                          <a href={`tel:${activeRide.userInfo.phone}`} className="flex-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all">
                            <Phone size={18} /> Call
                          </a>
                        )}
                        <button
                          onClick={() => handleCancelRide(activeRide._id)}
                          disabled={cancelingId === activeRide._id}
                          className="flex-1 bg-red-50 text-red-600 border border-red-100 px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
                        >
                          {cancelingId === activeRide._id ? <Loader2 className="animate-spin" size={18} /> : <XCircle size={18} />}
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="mt-8 pt-6 border-t border-dashed border-slate-200 flex flex-col sm:flex-row gap-8">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Navigation size={20} /></div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Pickup Location</p>
                        <p className="font-semibold text-slate-800 text-lg leading-tight">{activeRide.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl"><Zap size={20} /></div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Status</p>
                        <p className="font-semibold text-slate-800 text-lg leading-tight">Driver is on the way</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- SECTION 2: FILTERS --- */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-slate-400 mr-2 flex items-center gap-1 font-medium text-sm"><Filter size={16} /> Filter:</span>
          {["All", "Taxi Car", "Auto Rickshaw", "Bus", "Jeep"].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${filterCategory === cat ? 'bg-slate-800 text-white shadow-md scale-105' : 'bg-white border border-gray-200 text-slate-600 hover:bg-gray-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- SECTION 3: AVAILABLE DRIVERS LIST --- */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {displayedAdmins.map((admin) => (
                <DriverCard
                  key={admin._id}
                  admin={admin}
                  onJoin={handleJoinDriver}
                  onCancel={handleCancelRide}
                  isJoining={joiningId === admin._id}
                  isCanceling={cancelingId === admin._id}
                  currentUser={currentUser}
                  onChat={() => handleStartChat(admin)}
                  hasActiveRide={!!activeRide}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* --- 4. CHAT MODAL --- */}
      {activeChatDriver && currentUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg h-[80vh] flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
            {/* Chat Header */}
            <div className="bg-white p-4 flex justify-between items-center border-b border-gray-100 z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={activeChatDriver.userInfo?.avatar?.url || "https://ui-avatars.com/api/?name=Driver"} className="w-10 h-10 rounded-full border border-gray-100 object-cover" alt="dr" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 leading-none">{activeChatDriver.userInfo?.fullname}</h3>
                  <span className="text-xs text-slate-500">Active Now</span>
                </div>
              </div>
              <button onClick={() => setActiveChatDriver(null)} className="hover:bg-slate-100 p-2 rounded-full transition text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-hidden bg-slate-50 relative">
              <ChatRoom
                // ✅ MATCHING LOGIC: Admin ID + Current User ID
                roomId={[
                  String(activeChatDriver._id),
                  String(currentUser._id)
                ].sort().join("-")}

                currentUser={{
                  name: currentUser.fullname || "Passenger",
                  id: currentUser._id
                }}

                targetUser={{
                  name: activeChatDriver.userInfo?.fullname,
                  avatar: activeChatDriver.userInfo?.avatar?.url
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- DRIVER CARD COMPONENT ---
const DriverCard = ({ admin, onJoin, onCancel, isJoining, isCanceling, currentUser, onChat, hasActiveRide }) => {
  let isRequested = false;
  let isAccepted = false;

  if (admin.AllTraveller && currentUser) {
    const record = admin.AllTraveller.find(t => {
      const t_id = t.userInfo?._id ? String(t.userInfo._id) : String(t.userInfo);
      return t_id === String(currentUser._id);
    });
    if (record) {
      isRequested = true;
      isAccepted = record.message === 'accepted' || record.status === 'accepted';
    }
  }

  // If accepted, hide this card from the main list (since it's in the top section) 
  // OR show it with "Joined" status. Let's hide it to reduce clutter if preferred, 
  // but for clarity we'll show it as "Active".
  if (isAccepted) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all flex flex-col h-full group">

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={admin.userInfo?.avatar?.url || "https://ui-avatars.com/api/?name=D"} className="h-12 w-12 rounded-xl bg-gray-100 object-cover border border-gray-200" alt="dr" />
          <div>
            <h3 className="font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{admin.userInfo?.fullname}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-1"><Car size={10} /> {admin.carNumber}</p>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded uppercase border border-slate-200">{admin.category}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <MapPin size={16} className="text-indigo-500 flex-shrink-0" />
        <span className="truncate font-medium">{admin.location}</span>
      </div>

      <div className="mt-auto">
        {isRequested ? (
          <button
            onClick={() => onCancel(admin._id)}
            disabled={isCanceling}
            className="w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:border-red-200"
          >
            {isCanceling ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={16} />}
            Cancel Request
          </button>
        ) : (
          <button
            onClick={() => !hasActiveRide && onJoin(admin._id)}
            disabled={isJoining || hasActiveRide}
            className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${hasActiveRide ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-slate-200 hover:shadow-indigo-200'}`}
          >
            {isJoining ? <Loader2 className="animate-spin" size={16} /> : hasActiveRide ? "Ride in Progress" : "Join Ride"}
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default TravelUserDashboard;