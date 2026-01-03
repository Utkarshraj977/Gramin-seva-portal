import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { 
  Search, Filter, MapPin, Phone, User, CheckCircle, 
  Car, Loader2, Zap, ShieldCheck 
} from "lucide-react";

const TravelUserDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters State
  const [filterType, setFilterType] = useState("All"); 
  const [filterCategory, setFilterCategory] = useState("All"); 
  const [searchQuery, setSearchQuery] = useState("");
  
  const [joiningId, setJoiningId] = useState(null); 

  // --- 1. FETCH ADMINS (Logic for Filters) ---
  const fetchAdmins = async () => {
    setLoading(true);
    let url = "http://localhost:8000/api/v1/traveller/allTravelAdmin"; // Default URL

    // Agar user ne koi specific filter select kiya hai, to URL change karo
    if (filterCategory !== "All") {
        url = `http://localhost:8000/api/v1/traveller/gettraveladminCat/${filterCategory}`;
    } else if (filterType !== "All") {
        url = `http://localhost:8000/api/v1/traveller/gettraveladminTyp/${filterType}`;
    }

    try {
      const response = await axios.get(url, {
        withCredentials: true 
      });
      
      // Backend response structure handle karna (kabhi {data: []} hota hai, kabhi {data: {Alladmin: []}})
      const data = response.data.data.Alladmin || response.data.data || [];
      setAdmins(Array.isArray(data) ? data : []);
      
    } catch (error) {
      console.error("Error fetching admins", error);
      // 404 ane par list empty kar do
      if (error.response && error.response.status === 404) {
          setAdmins([]);
      } else {
          toast.error("Could not load transporters.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- 2. JOIN RIDE FUNCTION (PATCH Request) ---
  const handleJoinDriver = async (adminId) => {
    setJoiningId(adminId);
    try {
      // ✅ Using PATCH method as per your requirement
      const response = await axios.patch(
        `http://localhost:8000/api/v1/traveller/setuserintoadmin/${adminId}`,
        {}, // Body empty hai
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        toast.success("Ride Joined Successfully! ✅");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to join ride";
      toast.error(msg);
    } finally {
      setJoiningId(null);
    }
  };

  // Effect: Jab bhi Filter change ho, API call karo
  useEffect(() => {
    fetchAdmins();
  }, [filterCategory, filterType]); 

  // --- 3. CLIENT SIDE SEARCH LOGIC ---
  const displayedAdmins = admins.filter((admin) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    // Search by Name, Location, or Car Number
    return (
        admin.userInfo?.fullname?.toLowerCase().includes(q) || 
        admin.location?.toLowerCase().includes(q) ||
        admin.carNumber?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-10">
      <Toaster position="top-center" reverseOrder={false} />

      {/* --- HEADER --- */}
      <header className="bg-white sticky top-0 z-30 shadow-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
                    <Car className="text-white" size={24} />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-800 hidden md:block tracking-tight">
                    Traveller<span className="text-indigo-600">Pro</span>
                </h1>
            </div>

            {/* Search Bar */}
            <div className="relative w-full max-w-lg">
                <Search className="absolute left-4 top-3 text-gray-400 pointer-events-none" size={20} />
                <input 
                    type="text" 
                    placeholder="Search Driver, Location or Vehicle No..." 
                    className="w-full pl-12 pr-4 py-2.5 bg-gray-100 border border-transparent rounded-full focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all shadow-inner"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Profile Icon */}
            <div className="flex-shrink-0 w-11 h-11 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold hover:bg-indigo-100 transition-colors cursor-pointer">
                <User size={22}/>
            </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 mt-8">
        
        {/* Filters Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 text-slate-500 font-medium">
              <Filter size={20} className="text-indigo-500" />
              <span>Filter Drivers By:</span>
           </div>
           
           <div className="flex flex-wrap gap-3">
               {/* Category Filter */}
               <select 
                 className="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer hover:bg-white transition-all"
                 value={filterCategory}
                 onChange={(e) => {
                     setFilterCategory(e.target.value);
                     setFilterType("All");
                 }}
               >
                  <option value="All">All Categories</option>
                  <option value="Taxi Car">🚕 Taxi Car</option>
                  <option value="Auto Rickshaw">🛺 Auto Rickshaw</option>
                  <option value="Bus">🚌 Bus</option>
                  <option value="Jeep">🚙 Jeep</option>
               </select>

               {/* Type Filter */}
               <select 
                 className="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer hover:bg-white transition-all"
                 value={filterType}
                 onChange={(e) => {
                     setFilterType(e.target.value);
                     setFilterCategory("All");
                 }}
               >
                  <option value="All">All Service Types</option>
                  <option value="Local">📍 Local</option>
                  <option value="Outstation">🗺️ Outstation</option>
                  <option value="Emergency">🚑 Emergency</option>
               </select>
           </div>
        </div>

        {/* --- LOADING & GRID --- */}
        {loading ? (
           <div className="flex flex-col items-center justify-center h-80">
              <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
              <p className="text-slate-500 font-medium animate-pulse">Finding nearby drivers...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <AnimatePresence>
               {displayedAdmins.length > 0 ? (
                 displayedAdmins.map((admin) => (
                   <DriverCard 
                      key={admin._id} 
                      admin={admin} 
                      onJoin={handleJoinDriver} 
                      isJoining={joiningId === admin._id}
                   />
                 ))
               ) : (
                 <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200"
                 >
                    <div className="bg-gray-50 p-6 rounded-full mb-4">
                        <Car className="text-gray-300" size={64} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700">No Drivers Found</h3>
                    <p className="text-slate-400 mt-2">Try changing the filters or search query.</p>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

// --- MODERN DRIVER CARD COMPONENT ---
const DriverCard = ({ admin, onJoin, isJoining }) => {
  const { userInfo, carNumber, category, location, Type, CarPhoto } = admin;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
    >
      {/* Image Area */}
      <div className="h-48 bg-gray-100 relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
         <img 
           src={CarPhoto || "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"} 
           alt="Vehicle" 
           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
         />
         
         {/* Badges */}
         <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
            <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-indigo-700 shadow-lg uppercase tracking-wider flex items-center gap-1">
                <Car size={12}/> {category}
            </span>
            <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white shadow-lg uppercase tracking-wider flex items-center gap-1 ${Type === 'Emergency' ? 'bg-red-500' : 'bg-emerald-500'}`}>
                {Type === 'Emergency' ? <ShieldCheck size={12}/> : <MapPin size={12}/>} {Type}
            </span>
         </div>

         {/* Driver Avatar (Overlapping) */}
         <div className="absolute -bottom-6 left-5 z-20">
            <img 
               src={userInfo?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
               alt="Driver" 
               className="w-16 h-16 rounded-2xl border-4 border-white shadow-md bg-white object-cover"
            />
         </div>
      </div>

      {/* Card Content */}
      <div className="pt-10 px-5 pb-5 flex-grow flex flex-col">
         
         <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-800 leading-tight mb-1">
               {userInfo?.fullname || "Verified Driver"}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
               <MapPin size={16} className="text-indigo-400" />
               <span className="truncate">{location || "Location not shared"}</span>
            </div>
         </div>

         {/* Info Strip */}
         <div className="bg-slate-50 rounded-xl p-3.5 mb-6 flex justify-between items-center border border-slate-100">
            <div>
               <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Car Number</p>
               <p className="font-mono font-bold text-slate-700 text-sm">{carNumber}</p>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="text-right">
               <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Availability</p>
               <p className="text-emerald-600 font-bold text-sm flex items-center justify-end gap-1">
                  <Zap size={14} fill="currentColor" /> Online
               </p>
            </div>
         </div>

         {/* Action Buttons */}
         <div className="mt-auto flex gap-3">
            <motion.button 
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-white border-2 border-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
            >
               <Phone size={18} /> Call
            </motion.button>

            {/* JOIN BUTTON */}
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => onJoin(admin._id)}
              disabled={isJoining}
              className={`flex-[2] py-3 rounded-xl font-bold text-white shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2
                ${isJoining 
                  ? "bg-indigo-400 cursor-wait" 
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                }`}
            >
              {isJoining ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Join Ride <CheckCircle size={20} />
                </>
              )}
            </motion.button>
         </div>

      </div>
    </motion.div>
  );
};

export default TravelUserDashboard;