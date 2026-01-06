import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { GraduationCap, Clock, DollarSign, MapPin, Star, ArrowRight, Filter } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const StudentDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // NOTE: Your route is POST
        const response = await axios.post(
          "http://localhost:8000/api/v1/student/allteacher",
          {},
          { withCredentials: true }
        );
        setTeachers(response.data?.data || []);
      } catch (error) {
        toast.error("Could not fetch educators.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Select Teacher Function
  const handleSelectTeacher = async (username) => {
    try {
      // NOTE: Your route is GET with param
      const response = await axios.get(
        `http://localhost:8000/api/v1/student/allteacher/${username}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Teacher selected successfully!");
        // Optional: Refresh data or redirect
      }
    } catch (error) {
        // If status is 400/404 etc.
      toast.error(error.response?.data?.message || "Selection failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      {/* Student Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-600 text-white p-8 rounded-b-[2.5rem] shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold mb-2">Find Your Mentor</h1>
            <p className="text-orange-100 opacity-90">Browse top educators and start your learning journey.</p>
          </div>
          <div className="hidden md:block">
             <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 flex items-center gap-2">
                <Star className="text-yellow-300 fill-yellow-300" size={18}/>
                <span className="font-semibold">{teachers.length} Educators Available</span>
             </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto p-6 -mt-8">
        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                    <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
                ))}
             </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teachers.map((teacher) => (
              <motion.div
                key={teacher._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100 flex flex-col justify-between h-full"
              >
                {/* Header Profile */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-orange-100 overflow-hidden border-2 border-orange-200">
                    <img 
                        src={teacher.Education_certificate?.url || "https://cdn-icons-png.flaticon.com/512/3429/3429694.png"} 
                        alt="Cert" 
                        className="w-full h-full object-cover"
                        // Fallback logic usually handled by a helper component
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg leading-tight">
                        {teacher.userInfo?.fullname || "Educator"}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                        {teacher.category || "General"}
                    </p>
                  </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gray-50 p-3 rounded-2xl">
                        <div className="flex items-center gap-1.5 text-orange-500 mb-1">
                            <Clock size={16}/> <span className="text-[10px] font-bold uppercase tracking-wide">Time</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-700 truncate">
                            {teacher.Start_time} - {teacher.End_time}
                        </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl">
                        <div className="flex items-center gap-1.5 text-green-600 mb-1">
                            <DollarSign size={16}/> <span className="text-[10px] font-bold uppercase tracking-wide">Fee</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-700">
                            ₹{teacher.fee}/mo
                        </p>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <GraduationCap size={16} className="text-orange-400"/>
                        <span>Exp: {teacher.Experience}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={16} className="text-orange-400"/>
                        <span className="truncate">{teacher.location}</span>
                    </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleSelectTeacher(teacher.userInfo?.username)}
                  className="w-full py-3 rounded-2xl bg-black text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors group"
                >
                  Apply Now 
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                </button>
              </motion.div>
            ))}
          </div>
        )}
        
        {!loading && teachers.length === 0 && (
            <div className="text-center py-20">
                <p className="text-gray-400 text-xl">No educators found in your area.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;