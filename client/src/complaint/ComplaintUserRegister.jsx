import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AlertTriangle, MapPin, Key, MessageCircle, Send, FileWarning, ShieldAlert } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const ComplaintUserRegister = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    message: "",
    location: "",
    ComplaintUserKey: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!/^\d{6}$/.test(formData.ComplaintUserKey)) {
      toast.error("Key must be exactly 6 digits");
      setLoading(false);
      return;
    }

    try {
      // Updated Endpoint based on app.use("/api/v1/complaintuser")
      const response = await axios.post(
        "http://localhost:8000/api/v1/complaintuser/userregister",
        formData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Complaint Registered Successfully!");
        setFormData({ message: "", location: "", ComplaintUserKey: "" });
        
        // Redirect to Login
        setTimeout(() => {
            navigate("/complaint/user/login"); 
        }, 2000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?q=80&w=2073&auto=format&fit=crop')] bg-cover bg-center relative p-4">
      <div className="absolute inset-0 bg-red-950/80 backdrop-blur-sm"></div>
      <Toaster position="top-center" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl bg-white/10 border border-red-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row backdrop-blur-md"
      >
        {/* Left Side: Theme */}
        <div className="md:w-2/5 bg-gradient-to-br from-red-900 to-black p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-red-500/20 rounded-full blur-3xl"></div>
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="w-12 h-12 text-red-500 animate-pulse" />
              <h1 className="text-3xl font-bold tracking-wider">REPORT<br/>PORTAL</h1>
            </div>
            <p className="text-red-200/80 leading-relaxed mt-2">
              Securely register your complaint or issue. Your voice matters.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 bg-black/30 p-3 rounded-lg border border-red-500/20">
               <FileWarning className="text-red-400" />
               <div className="text-xs text-gray-300">Detailed Reporting</div>
            </div>
            <div className="flex items-center gap-3 bg-black/30 p-3 rounded-lg border border-red-500/20">
               <Key className="text-red-400" />
               <div className="text-xs text-gray-300">Secure PIN Access</div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-3/5 p-8 md:p-12 bg-black/50">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="text-red-500" /> Register Issue
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Location */}
            <div className="space-y-1">
              <label className="text-xs text-gray-400 ml-1">Current Location</label>
              <div className="relative group">
                <MapPin className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-red-400" size={18} />
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  placeholder="City, Department, or Area" 
                  className="w-full bg-white/5 border border-red-500/20 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-red-500 transition-all placeholder:text-gray-600" 
                  required 
                />
              </div>
            </div>

            {/* Key */}
            <div className="space-y-1">
              <label className="text-xs text-gray-400 ml-1">Secure Key (6 Digits)</label>
              <div className="relative group">
                <Key className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-red-400" size={18} />
                <input 
                  type="text" 
                  name="ComplaintUserKey" 
                  value={formData.ComplaintUserKey} 
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val) && val.length <= 6) handleChange(e);
                  }}
                  placeholder="123456" 
                  className="w-full bg-white/5 border border-red-500/20 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-red-500 transition-all placeholder:text-gray-600 font-mono tracking-widest" 
                  required 
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="text-xs text-gray-400 ml-1">Complaint Detail</label>
              <div className="relative group">
                <MessageCircle className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-red-400" size={18} />
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  rows="4" 
                  placeholder="Describe your issue..." 
                  className="w-full bg-white/5 border border-red-500/20 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-red-500 transition-all placeholder:text-gray-600 resize-none" 
                  required
                ></textarea>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              disabled={loading} 
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all mt-2 ${loading ? "bg-gray-700" : "bg-gradient-to-r from-red-600 to-red-800 hover:shadow-red-500/40"}`}
            >
              {loading ? "Registering..." : <>Submit Report <Send size={18} /></>}
            </motion.button>

            <div className="text-center pt-2">
               <p className="text-gray-400 text-sm">
                 Already registered? <Link to="/complaint/user/login" className="text-red-400 hover:underline">Check Status</Link>
               </p>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ComplaintUserRegister;