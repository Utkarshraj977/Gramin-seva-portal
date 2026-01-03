import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { MapPin, Navigation, Key, MessageSquare, Send, Plane } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom"; // Import Link & useNavigate

const TravelUserRegister = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook for redirection
  
  const [formData, setFormData] = useState({
    from: "",
    To: "",
    message: "",
    TravellingUserKey: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!/^\d{6}$/.test(formData.TravellingUserKey)) {
      toast.error("Key must be exactly 6 digits (numbers only)");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/traveller/traveluserregister",
        formData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Journey Registered Successfully! Redirecting...");
        
        // Reset Form
        setFormData({
          from: "",
          To: "",
          message: "",
          TravellingUserKey: "",
          location: "",
        });

        // Redirect to Login after 2 seconds
        setTimeout(() => {
            navigate("/traveller/user/login");
        }, 2000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <Toaster position="top-center" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-5xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row backdrop-blur-md"
      >
        {/* Left Side */}
        <div className="md:w-2/5 bg-gradient-to-br from-indigo-600/90 to-purple-800/90 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Plane className="w-10 h-10 animate-pulse text-yellow-400" />
              <h1 className="text-3xl font-bold tracking-widest">TRAVEL LOG</h1>
            </div>
            <p className="text-indigo-100 leading-relaxed text-lg">
              "The journey of a thousand miles begins with a single step."
            </p>
          </div>
          <div className="mt-10 md:mt-0 space-y-6">
             {/* Info items same as before */}
             <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5">
               <div className="bg-white/20 p-3 rounded-full"><MapPin className="text-white" size={24} /></div>
               <div><h3 className="font-semibold text-white">Live Location</h3><p className="text-xs text-indigo-200">Share where you are</p></div>
             </div>
             <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5">
               <div className="bg-white/20 p-3 rounded-full"><Key className="text-white" size={24} /></div>
               <div><h3 className="font-semibold text-white">Secure Access</h3><p className="text-xs text-indigo-200">6-Digit Personal Key</p></div>
             </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-3/5 p-8 md:p-12 bg-black/60">
          <h2 className="text-3xl font-bold text-white mb-2">Register Plan</h2>
          <p className="text-gray-400 mb-6 text-sm">Fill in the details to let others know your travel status.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* From */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400 ml-1">Origin</label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input type="text" name="from" value={formData.from} onChange={handleChange} placeholder="From City" className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600" required />
                </div>
              </div>
              {/* To */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400 ml-1">Destination</label>
                <div className="relative group">
                  <Navigation className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input type="text" name="To" value={formData.To} onChange={handleChange} placeholder="To Destination" className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600" required />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-xs text-gray-400 ml-1">Current Status</label>
              <div className="relative group">
                <MapPin className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Current Location" className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600" required />
              </div>
            </div>

            {/* Key */}
            <div className="space-y-1">
              <label className="text-xs text-gray-400 ml-1">Travel Key (6 Digits)</label>
              <div className="relative group">
                <Key className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input type="text" name="TravellingUserKey" value={formData.TravellingUserKey} onChange={(e) => { if (/^\d*$/.test(e.target.value) && e.target.value.length <= 6) handleChange(e); }} placeholder="123456" className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600 tracking-widest font-mono" required />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="text-xs text-gray-400 ml-1">Message</label>
              <div className="relative group">
                <MessageSquare className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <textarea name="message" value={formData.message} onChange={handleChange} rows="3" placeholder="Any updates?" className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-gray-600 resize-none" required></textarea>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading} className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all mt-4 ${loading ? "bg-gray-700 cursor-not-allowed" : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-indigo-500/30"}`}>
              {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <>Register Journey <Send size={18} /></>}
            </motion.button>

            {/* LOGIN LINK ADDED HERE */}
            <div className="text-center mt-4">
               <p className="text-gray-400 text-sm">
                 Already registered?{" "}
                 <Link to="/traveller/user/login" className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline transition-colors">
                   Login here
                 </Link>
               </p>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default TravelUserRegister;