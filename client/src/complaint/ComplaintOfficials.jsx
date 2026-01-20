import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Building2, MapPin, Clock, Search, ShieldCheck, 
  Phone, Mail, UserCircle
} from "lucide-react";

// ✅ Import Service
import { complaintAdmin } from "../services/api";

const ComplaintOfficials = () => {
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOfficials = async () => {
      try {
        // ✅ Use Service: complaintAdmin.get_all_officials()
        // This is a public route, so it doesn't require authentication cookies
        const res = await complaintAdmin.get_all_officials();
        
        // api.js returns response.data. The actual list is usually in .data
        setOfficials(res.data || []);
      } catch (error) {
        console.error("Error fetching officials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOfficials();
  }, []);

  // Search Logic
  const filteredOfficials = officials.filter(admin => 
    admin.assignedWard?.toLowerCase().includes(search.toLowerCase()) ||
    admin.userInfo?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    admin.designation?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6 md:p-12">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Know Your <span className="text-red-600">Officials</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Find the authorized Gram Pradhan, Secretary, or Ward Member responsible for your area.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-12 relative">
         <Search className="absolute left-4 top-3.5 text-gray-400" size={20}/>
         <input 
           type="text" 
           placeholder="Search by Ward, Name or Designation..." 
           className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
           value={search}
           onChange={(e) => setSearch(e.target.value)}
         />
      </div>

      {/* Grid List */}
      {loading ? (
         <div className="text-center py-20 flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="text-slate-500">Loading Officials...</p>
         </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOfficials.length > 0 ? (
            filteredOfficials.map((admin) => (
              <AdminCard key={admin._id} data={admin} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-10 bg-white rounded-2xl border border-dashed border-gray-200">
              No officials found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AdminCard = ({ data }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group"
    >
      {/* ID Card Header Style */}
      <div className="h-24 bg-gradient-to-r from-slate-900 to-slate-800 relative">
         <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
               {data.userInfo?.avatar?.url ? (
                 <img src={data.userInfo.avatar.url} alt="Admin" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                    <UserCircle size={40}/>
                 </div>
               )}
            </div>
         </div>
         <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
            <ShieldCheck size={12} className="inline mr-1 mb-0.5 text-green-400"/> Verified
         </div>
      </div>

      <div className="pt-12 p-6">
         <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900">{data.userInfo?.fullName || "Officer Name"}</h3>
            <p className="text-red-600 font-medium text-sm">{data.designation}</p>
         </div>

         <div className="space-y-3">
            <InfoItem icon={MapPin} label="Area" value={data.assignedWard || "All Wards"} />
            <InfoItem icon={Building2} label="Office" value={data.location} />
            <InfoItem icon={Clock} label="Timings" value={`${data.Start_time} - ${data.End_time}`} />
         </div>

         <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
            {data.userInfo?.phone && (
              <a href={`tel:${data.userInfo.phone}`} className="flex-1 py-2 rounded-lg bg-green-50 text-green-700 text-xs font-bold flex items-center justify-center gap-2 hover:bg-green-100 transition-colors">
                 <Phone size={14}/> Call
              </a>
            )}
            {data.userInfo?.email && (
              <a href={`mailto:${data.userInfo.email}`} className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors">
                 <Mail size={14}/> Email
              </a>
            )}
         </div>
      </div>
    </motion.div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 text-sm text-gray-600">
     <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-gray-400">
        <Icon size={16}/>
     </div>
     <div>
        <span className="text-[10px] font-bold text-gray-400 uppercase block leading-none mb-0.5">{label}</span>
        <span className="font-medium text-slate-800">{value}</span>
     </div>
  </div>
);

export default ComplaintOfficials;