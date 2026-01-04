import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Server, ArrowRight, Database } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const CyberAdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [cyberKey, setCyberKey] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!cyberKey.trim()) {
      toast.error("Please enter your Admin Key");
      setLoading(false);
      return;
    }

    try {
      // Connects to your adminlogin controller
      const response = await axios.post(
        "http://localhost:8000/api/v1/cyberadmin/adminlogin",
        { cyberKey },
        { withCredentials: true }
      );

      // Controller returns 201 on success
      if (response.status === 201 || response.status === 200) {
        toast.success("Admin Authorization Verified!");
        
        // Redirect to Admin Dashboard
        setTimeout(() => {
          navigate("/cyber/admin/dashboard");
        }, 1500);
      }
    } catch (error) {
      // Handles the 409 "EducatorKey is wrong" or 400 errors
      const errorMsg = error.response?.data?.message || "Authorization Failed. Check Key.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1558494949-efc535b5c47c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative p-4">
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-[2px]"></div>
      <Toaster position="top-center" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md bg-white/5 border border-emerald-500/40 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.2)] p-8 backdrop-blur-xl"
      >
        {/* Header Section */}
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-900/40 border border-emerald-500/50 mb-4 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Database className="text-emerald-400 w-10 h-10 animate-pulse" />
           </div>
           <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 tracking-wider">
             ADMIN PORTAL
           </h1>
           <p className="text-emerald-400/60 text-xs font-mono mt-2 tracking-widest">
             // SECURE CONNECTION REQUIRED
           </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
             <label className="text-xs text-emerald-500 font-bold ml-1 uppercase tracking-wider">
               Master Security Key
             </label>
             <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-emerald-600/70 group-focus-within:text-emerald-400 transition-colors" size={18} />
                <input 
                  type="password" 
                  value={cyberKey}
                  onChange={(e) => setCyberKey(e.target.value)}
                  className="w-full bg-black/50 border border-emerald-500/30 text-emerald-100 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono tracking-widest placeholder:text-emerald-800/50 placeholder:tracking-normal"
                  placeholder="Enter Key..."
                  autoFocus
                />
             </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)" }} 
            whileTap={{ scale: 0.98 }} 
            disabled={loading} 
            className={`w-full py-4 rounded-xl font-bold text-black shadow-lg flex items-center justify-center gap-2 transition-all mt-4 ${loading ? "bg-gray-700 cursor-not-allowed" : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400"}`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Verifying...</span>
              </div>
            ) : (
              <>ACCESS SYSTEM <ArrowRight size={20} /></>
            )}
          </motion.button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center border-t border-emerald-500/20 pt-4">
           <p className="text-gray-500 text-sm">
             New Administrator?{" "}
             <Link to="/cyber/admin/register" className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors font-medium">
               Initialize Registration
             </Link>
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CyberAdminLogin;