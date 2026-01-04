import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Lock, ShieldAlert, Fingerprint, ArrowRight, FileWarning } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const ComplaintUserLogin = () => {
  const [loading, setLoading] = useState(false);
  const [ComplaintUserKey, setComplaintUserKey] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic Client-side Validation
    if (!ComplaintUserKey || ComplaintUserKey.trim() === "") {
      toast.error("Security Key is required");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/complaintuser/userlogin",
        { ComplaintUserKey },
        { 
          withCredentials: true // Critical: Ensures req.user is available in backend
        }
      );

      if (response.status === 200) {
        toast.success("Identity Verified. Accessing Records...");
        
        // Redirect to Complaint Dashboard
        setTimeout(() => {
          navigate("/complaint/user/dashboard");
        }, 1500);
      }
    } catch (error) {
      // Handle specific backend errors
      const status = error.response?.status;
      const errorMsg = error.response?.data?.message || "Authentication Failed";
      
      if (status === 404) {
         toast.error("User session not found. Please log in to the main app first.");
      } else if (status === 401) {
         toast.error("Invalid Key or Unauthorized Access.");
      } else {
         toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative p-4">
      {/* Dark Red Overlay */}
      <div className="absolute inset-0 bg-red-950/90 backdrop-blur-[2px]"></div>
      <Toaster position="top-center" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md bg-white/5 border border-red-500/40 rounded-3xl shadow-[0_0_40px_rgba(220,38,38,0.25)] p-8 backdrop-blur-xl"
      >
        {/* Header Visuals */}
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-900/40 border border-red-500/50 mb-4 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <ShieldAlert className="text-red-500 w-10 h-10 animate-pulse" />
           </div>
           <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 tracking-wider">
             RESTRICTED
           </h1>
           <p className="text-red-400/70 text-xs font-mono mt-2 tracking-widest uppercase">
             Complaint Reporting System
           </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
             <label className="text-xs text-red-500 font-bold ml-1 uppercase tracking-wider flex items-center gap-1">
               <Fingerprint size={14} /> Security PIN
             </label>
             <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-red-700/70 group-focus-within:text-red-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  value={ComplaintUserKey}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val) && val.length <= 6) setComplaintUserKey(val);
                  }}
                  className="w-full bg-black/50 border border-red-500/30 text-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono tracking-[0.5em] text-center text-xl placeholder:text-red-900/50 placeholder:tracking-normal"
                  placeholder="••••••"
                  required
                />
             </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(220, 38, 38, 0.4)" }} 
            whileTap={{ scale: 0.98 }} 
            disabled={loading} 
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all mt-4 ${loading ? "bg-gray-800 cursor-not-allowed" : "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700"}`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Verifying Credentials...</span>
              </div>
            ) : (
              <>ACCESS FILE <ArrowRight size={20} /></>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center border-t border-red-500/20 pt-4">
           <p className="text-gray-500 text-sm flex flex-col gap-1">
             <span>Not registered yet?</span>
             <Link to="/complaint/user/register" className="text-red-400 hover:text-red-300 hover:underline transition-colors font-semibold flex items-center justify-center gap-1">
               <FileWarning size={14}/> File New Complaint
             </Link>
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ComplaintUserLogin;