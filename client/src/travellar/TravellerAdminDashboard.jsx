import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import ChatRoom from '../Chat/ChatRoom';
import {
  MapPin, CheckCircle, XCircle, Car, Users,
  Phone, MessageSquare, X, Clock
} from "lucide-react";

const TravellerAdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("requests");

  // Chat State
  const [activeChatPassenger, setActiveChatPassenger] = useState(null);
  const [currentDriver, setCurrentDriver] = useState(null);

  // --- FETCH DATA ---
  const fetchAdminData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/traveller/gettraveladminbyid", { withCredentials: true });
      setAdminData(response.data.data.admin);
      setCurrentDriver(response.data.data.admin);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS ---
  const handleReject = async (passengerUserId) => {
    if (!window.confirm("Remove this passenger?")) return;
    try {
      // Calls the deleteServetravelleruser route
      await axios.delete(`http://localhost:8000/api/v1/traveller/deleteserveuser/${passengerUserId}`, { withCredentials: true });
      toast.success("Passenger removed");

      // Update UI
      fetchAdminData(); // Refresh data to ensure sync
    } catch (e) {
      console.error(e);
      toast.error("Failed to remove passenger");
    }
  };

  const handleAccept = async (passengerUserId) => {
    try {
      // Calls the acceptTraveller route
      await axios.patch(`http://localhost:8000/api/v1/traveller/accepttraveller/${passengerUserId}`, {}, { withCredentials: true });
      toast.success("Passenger Accepted! Moved to My Rides.");

      // Update UI
      fetchAdminData();
    } catch (error) {
      console.error(error);
      toast.error("Accept failed. Check console.");
    }
  };

  // Filter Lists Logic
  const pendingPassengers = adminData?.AllTraveller?.filter(t => t.message !== 'accepted' && t.status !== 'accepted') || [];
  const activePassengers = adminData?.AllTraveller?.filter(t => t.message === 'accepted' || t.status === 'accepted') || [];

  if (loading) return <div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10 relative">
      <Toaster position="top-center" />

      {/* HEADER */}
      <div className="bg-white sticky top-0 z-20 shadow-sm border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-300">
              <img src={adminData?.CarPhoto || "https://ui-avatars.com/api/?name=Driver"} className="h-full w-full object-cover" alt="car" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800">My Trips <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Driver</span></h1>
              <p className="text-xs text-slate-500">{adminData?.carNumber}</p>
            </div>
          </div>

          {/* TABS */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("requests")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "requests" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Requests ({pendingPassengers.length})
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "active" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              My Rides ({activePassengers.length})
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 mt-6">
        <AnimatePresence mode="wait">
          {activeTab === "requests" ? (
            <motion.div key="req" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingPassengers.length > 0 ? pendingPassengers.map(p => (
                <PassengerCard key={p.userInfo?._id || Math.random()} traveller={p} type="request" onAccept={handleAccept} onReject={handleReject} />
              )) : (
                <div className="col-span-full py-20 flex flex-col items-center text-slate-400">
                  <Users size={48} className="mb-2 opacity-20" />
                  <p>No pending requests.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="act" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePassengers.length > 0 ? activePassengers.map(p => (
                <PassengerCard key={p.userInfo?._id || Math.random()} traveller={p} type="active" onChat={() => setActiveChatPassenger(p)} onReject={handleReject} />
              )) : (
                <div className="col-span-full py-20 flex flex-col items-center text-slate-400">
                  <Car size={48} className="mb-2 opacity-20" />
                  <p>No active rides yet.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* CHAT MODAL */}
      {activeChatPassenger && currentDriver && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg h-[80vh] flex flex-col bg-white rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-indigo-600 p-3 flex justify-between items-center text-white">
              <span className="font-bold flex items-center gap-2"><MessageSquare size={18} /> {activeChatPassenger.userInfo?.fullname}</span>
              <button onClick={() => setActiveChatPassenger(null)} className="hover:bg-white/20 p-1 rounded"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatRoom
                roomId={[
                  String(currentDriver._id),
                  String(activeChatPassenger.userInfo?._id || activeChatPassenger.userInfo)
                ].sort().join("-")}

                currentUser={{
                  name: "Driver",
                  id: currentDriver._id
                }}

                targetUser={{
                  name: activeChatPassenger.userInfo?.fullname,
                  avatar: activeChatPassenger.userInfo?.avatar?.url
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUB COMPONENT: PASSENGER CARD ---
const PassengerCard = ({ traveller, type, onAccept, onReject, onChat }) => {
  const user = traveller.userInfo || {};
  
  // ✅ FIX: Safe extraction of the Passenger's User ID
  // If user is an object (populated), take _id. If user is just a string, take it directly.
  const passengerUserId = user._id || user; 

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col">
      <div className={`h-1.5 ${type === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>

      <div className="p-4 flex-1">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <img src={user.avatar?.url || "https://ui-avatars.com/api/?name=User"} className="h-10 w-10 rounded-full bg-gray-100 object-cover border border-gray-200" alt="u" />
            <div>
              <h4 className="font-bold text-slate-800">{user.fullname || "Guest User"}</h4>
              <p className="text-xs text-slate-500">@{user.username}</p>
            </div>
          </div>
          {type === 'active' && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded border border-emerald-200">ONBOARD</span>}
        </div>
        
        <div className="mt-4 bg-slate-50 p-3 rounded-lg text-sm border border-slate-100 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs uppercase font-bold">From</span>
            <span className="font-semibold text-slate-700">{traveller.from}</span>
          </div>
          <div className="w-full h-px bg-slate-200 my-1"></div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs uppercase font-bold">To</span>
            <span className="font-semibold text-slate-700">{traveller.To}</span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 pt-0 flex gap-2">
        {type === 'request' ? (
          <>
            {/* ✅ PASSING passengerUserId (the User ID) */}
            <button onClick={() => onReject(passengerUserId)} className="flex-1 py-2 text-red-500 border border-red-200 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors">Reject</button>
            <button onClick={() => onAccept(passengerUserId)} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">Accept</button>
          </>
        ) : (
          <>
            <button onClick={() => onReject(passengerUserId)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all" title="Remove"><XCircle size={20} /></button>
            {user.phone && (
              <a href={`tel:${user.phone}`} className="flex-1 py-2 border border-green-200 text-green-600 rounded-lg text-sm font-bold flex justify-center items-center gap-2 hover:bg-green-50 transition-colors">
                <Phone size={16} /> Call
              </a>
            )}
            <button onClick={onChat} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold flex justify-center items-center gap-2 hover:bg-indigo-700 transition-colors shadow-md">
              <MessageSquare size={16} /> Chat
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default TravellerAdminDashboard;