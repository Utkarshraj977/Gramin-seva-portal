import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Key, MessageSquare, Send, Shield, Terminal, Calendar, Clock, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

// ✅ Import Service
import { cyberUser } from "../services/api";

const CyberUserRegister = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    message: "",
    Start_time: "",
    End_time: "",
    location: "",
    cyberUserKey: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.cyberUserKey.trim()) {
      toast.error("Cyber User Key is required");
      setLoading(false);
      return;
    }

    try {
      // ✅ Use Service
      const response = await cyberUser.register(formData);

      if (response) {
        toast.success("Cyber Session Registered Successfully!");
        
        // Reset Form
        setFormData({
          message: "",
          Start_time: "",
          End_time: "",
          location: "",
          cyberUserKey: "",
        });

        setTimeout(() => {
            navigate("/cyber/user/login"); 
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
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <Toaster position="top-center" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-5xl bg-white/10 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row backdrop-blur-md"
      >
        {/* Left Side: Cyber Theme */}
        <div className="md:w-2/5 bg-gradient-to-br from-emerald-800/90 to-black/90 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-10 h-10 animate-pulse text-emerald-400" />
              <h1 className="text-3xl font-bold tracking-widest">CYBER LOG</h1>
            </div>
            <p className="text-emerald-100 leading-relaxed text-lg">
              "Security is not a product, but a process."
            </p>
          </div>
          <div className="mt-10 md:mt-0 space-y-6">
             {/* Info items */}
             <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-emerald-500/20">
               <div className="bg-emerald-500/20 p-3 rounded-full"><Terminal className="text-emerald-300" size={24} /></div>
               <div><h3 className="font-semibold text-white">Session Tracking</h3><p className="text-xs text-emerald-200">Monitor active times</p></div>
             </div>
             <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-emerald-500/20">
               <div className="bg-emerald-500/20 p-3 rounded-full"><Key className="text-emerald-300" size={24} /></div>
               <div><h3 className="font-semibold text-white">Encrypted Access</h3><p className="text-xs text-emerald-200">Secure Key Verification</p></div>
             </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-3/5 p-8 md:p-12 bg-black/80">
          <h2 className="text-3xl font-bold text-white mb-2">Register Session</h2>
          <p className="text-gray-400 mb-6 text-sm">Enter your session details and cyber credentials.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Start Time & End Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 ml-1">Start Time</label>
                <div className="relative group">
                  <Calendar className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                  <input 
                    type="datetime-local" 
                    name="Start_time" 
                    value={formData.Start_time} 
                    onChange={handleChange} 
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-600 appearance-none [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400 ml-1">End Time</label>
                <div className="relative group">
                  <Clock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                  <input 
                    type="datetime-local" 
                    name="End_time" 
                    value={formData.End_time} 
                    onChange={handleChange} 
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-600 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-xs text-gray-400 ml-1">Workstation / Location</label>
              <div className="relative group">
                <MapPin className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Server Room 1 or Remote IP" className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-600" required />
              </div>
            </div>

            {/* Cyber Key */}
            <div className="space-y-1">
              <label className="text-xs text-gray-400 ml-1">Cyber User Key</label>
              <div className="relative group">
                <Key className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                <input type="text" name="cyberUserKey" value={formData.cyberUserKey} onChange={handleChange} placeholder="Enter your unique key" className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-600 font-mono tracking-wider" required />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="text-xs text-gray-400 ml-1">Log Message</label>
              <div className="relative group">
                <MessageSquare className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                <textarea name="message" value={formData.message} onChange={handleChange} rows="3" placeholder="Description of activity..." className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-600 resize-none" required></textarea>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading} className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all mt-4 ${loading ? "bg-gray-700 cursor-not-allowed" : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-emerald-500/30"}`}>
              {loading ? <Loader2 className="animate-spin" /> : <>Register Cyber User <Send size={18} /></>}
            </motion.button>

            {/* Links */}
            <div className="text-center mt-4">
               <p className="text-gray-400 text-sm">
                 Need to verify status?{" "}
                 <Link to="/cyber/user/login" className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline transition-colors">
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

export default CyberUserRegister;