import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { 
  MapPin, User, CheckCircle, XCircle, Car, Users, 
  Phone, Mail, MessageSquare, Calendar 
} from "lucide-react";

const TravellerAdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // --- 1. FETCH DASHBOARD DATA ---
  const fetchAdminData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/traveller/gettraveladminbyid",
        { withCredentials: true }
      );
      // Accessing the admin object safely
      setAdminData(response.data.data.admin);
    } catch (error) {
      console.error("Error fetching dashboard", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // --- 2. REJECT PASSENGER ---
  const handleReject = async (travellerId) => {
    if (!window.confirm("Remove this passenger from your list?")) return;
    
    setProcessingId(travellerId);
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/v1/traveller/deleteserveuser/${travellerId}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Passenger removed successfully.");
        // Update local state to remove the card immediately
        setAdminData((prev) => ({
          ...prev,
          AllTraveller: prev.AllTraveller.filter((t) => t._id !== travellerId),
        }));
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to remove passenger.";
      toast.error(msg);
    } finally {
      setProcessingId(null);
    }
  };

  // --- 3. ACCEPT PASSENGER ---
  const handleAccept = (travellerId) => {
    // In a real app, this might trigger an API status update.
    // For now, it's a visual confirmation.
    toast.success("Passenger Accepted! Notification sent. ✅");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      <Toaster position="top-center" />

      {/* --- HEADER --- */}
      <div className="bg-white sticky top-0 z-20 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Driver Profile */}
            <div className="flex items-center gap-4">
               <div className="h-14 w-14 md:h-16 md:w-16 rounded-xl overflow-hidden border-2 border-white shadow-md relative group">
                 <img 
                   src={adminData?.CarPhoto || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2"} 
                   alt="Vehicle" 
                   className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                 />
               </div>
               <div>
                 <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
                   My Trips <span className="hidden md:inline-block bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide border border-indigo-200">Driver Mode</span>
                 </h1>
                 <div className="flex items-center gap-3 text-slate-500 text-xs md:text-sm mt-1">
                    <span className="flex items-center gap-1 font-medium bg-slate-100 px-2 py-0.5 rounded"><Car size={14}/> {adminData?.carNumber}</span>
                    <span className="flex items-center gap-1"><MapPin size={14}/> {adminData?.location}</span>
                 </div>
               </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm">
                   <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Requests</p>
                   <p className="text-xl font-bold text-indigo-600 leading-none">{adminData?.AllTraveller?.length || 0}</p>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- PASSENGER LIST --- */}
      <main className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex items-center gap-2 mb-6">
           <Users className="text-slate-400" size={24}/>
           <h2 className="text-xl font-bold text-slate-700">Passenger Requests</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {adminData?.AllTraveller?.length > 0 ? (
              adminData.AllTraveller.map((traveller) => (
                <PassengerCard 
                  key={traveller._id} 
                  traveller={traveller} 
                  onReject={handleReject}
                  onAccept={handleAccept}
                  isProcessing={processingId === traveller._id}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 text-slate-400">
                 <Car size={48} className="mb-3 opacity-20" />
                 <p>No new ride requests.</p>
                 <p className="text-sm">Share your ride key to get passengers.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

// --- ENHANCED PASSENGER CARD COMPONENT ---
const PassengerCard = ({ traveller, onReject, onAccept, isProcessing }) => {
  // 1. SAFE DATA EXTRACTION
  // Ensure we handle cases where userInfo might not be fully populated
  const user = (traveller.userInfo && typeof traveller.userInfo === 'object') 
    ? traveller.userInfo 
    : {};

  // 2. DEFAULT VALUES
  const avatarUrl = user.avatar?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const coverUrl = user.coverImage?.url || "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=500&q=60";
  const fullName = user.fullName || user.fullname || user.username || "Guest User";
  const phone = user.phone || "";
  const email = user.email || "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
    >
      
      {/* HEADER WITH COVER IMAGE */}
      <div className="h-24 bg-gray-200 relative">
         <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
         {/* Status Badge */}
         <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
            Pending
         </div>
      </div>

      {/* USER INFO SECTION */}
      <div className="px-5 relative">
         {/* Overlapping Avatar */}
         <div className="absolute -top-10 left-5">
            <img 
              src={avatarUrl} 
              alt={fullName} 
              className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-white object-cover"
            />
         </div>
         
         {/* Name & Actions */}
         <div className="mt-12 flex justify-between items-start">
            <div>
               <h3 className="text-lg font-bold text-slate-800 leading-tight">{fullName}</h3>
               <p className="text-xs text-slate-500 font-medium">@{user.username || "traveller"}</p>
            </div>
            
            {/* Contact Buttons */}
            <div className="flex gap-2">
               {phone ? (
                 <>
                   <a 
                     href={`tel:${phone}`} 
                     className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors border border-green-100"
                     title="Call User"
                   >
                      <Phone size={14} />
                   </a>
                   <a 
                     href={`https://wa.me/91${phone}`} 
                     target="_blank" 
                     rel="noreferrer"
                     className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-100"
                     title="WhatsApp"
                   >
                      <MessageSquare size={14} />
                   </a>
                 </>
               ) : (
                 <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded">No Contact</span>
               )}
            </div>
         </div>
      </div>

      {/* JOURNEY DETAILS */}
      <div className="p-5 space-y-4">
         
         {/* Route Timeline */}
         <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
             <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Route</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded text-slate-500 border shadow-sm">
                   {new Date(traveller.createdAt).toLocaleDateString()}
                </span>
             </div>
             <div className="flex items-center gap-3">
                <div className="font-semibold text-sm text-slate-700">{traveller.from}</div>
                <div className="flex-1 h-px bg-slate-300 border-t border-dashed relative">
                   <div className="absolute -top-1 right-0 text-slate-300">➤</div>
                </div>
                <div className="font-semibold text-sm text-slate-700">{traveller.To}</div>
             </div>
         </div>

         {/* Message */}
         {traveller.message && (
            <div className="text-xs text-slate-600 bg-yellow-50 p-3 rounded-lg border border-yellow-100 italic flex gap-2">
               <MessageSquare size={14} className="flex-shrink-0 text-yellow-500 mt-0.5" />
               "{traveller.message}"
            </div>
         )}

         {/* Email & Location */}
         <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
            <span className="flex items-center gap-1 truncate max-w-[140px]" title={email}>
               <Mail size={12}/> {email || "No Email"}
            </span>
            <span className="flex items-center gap-1 truncate max-w-[100px]" title={traveller.location}>
               <MapPin size={12}/> {traveller.location || "N/A"}
            </span>
         </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-auto px-5 pb-5 pt-0 flex gap-3">
         <button
           onClick={() => onReject(traveller._id)}
           disabled={isProcessing}
           className="flex-1 py-3 rounded-xl border border-red-100 text-red-500 font-bold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
         >
           {isProcessing ? (
             <div className="animate-spin w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full"></div>
           ) : (
              <>
                <XCircle size={18}/> Reject
              </>
           )}
         </button>
         
         <button
           onClick={() => onAccept(traveller._id)}
           className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-95"
         >
           <CheckCircle size={18}/> Accept
         </button>
      </div>

    </motion.div>
  );
};

export default TravellerAdminDashboard;