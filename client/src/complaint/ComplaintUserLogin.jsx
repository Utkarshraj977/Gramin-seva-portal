import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, Key, Lock, Search, ArrowRight, Loader2, FileText 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

// ✅ Import Service
import { complaintUser } from "../services/api";

const ComplaintUserLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!key.trim()) {
      toast.error("Please enter your 6-digit Security PIN");
      setLoading(false);
      return;
    }

    try {
      // ✅ Use Service: complaintUser.login()
      // Note: Passing as object to match backend req.body.ComplaintUserKey
      const response = await complaintUser.login({ ComplaintUserKey: key });

      // If successful
      toast.success("Access Granted! Redirecting...");
      setTimeout(() => navigate("/complaint/user/dashboard"), 1500);

    } catch (error) {
      console.error("Login Error:", error);
      
      const status = error.response?.status;
      const msg = error.response?.data?.message || "Login Failed";

      if (status === 404) {
        toast.error("No complaints found. Please file a complaint first.");
      } else if (status === 401) {
        if (msg.includes("Invalid Security PIN")) {
           toast.error("Incorrect PIN! Please try again.");
        } else {
           toast.error("Please login to the Main Portal first.");
        }
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a0505] p-4 font-sans relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px]"></div>

      <Toaster position="top-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl bg-black/40 border border-red-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row backdrop-blur-xl"
      >
        
        {/* Left Side: Info */}
        <div className="md:w-1/2 bg-gradient-to-br from-red-950 to-black p-10 border-r border-red-500/20 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/50 mb-6">
               <Search className="text-white" size={24} />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2">
              Track <span className="text-red-500">Status.</span>
            </h2>
            <p className="text-red-200/60 text-sm leading-relaxed">
              Enter your Security PIN to view the status of your complaints, admin responses, and history.
            </p>
          </div>

          <div className="mt-8 bg-black/30 p-4 rounded-xl border border-white/5 flex items-center gap-3">
             <ShieldCheck className="text-green-500 shrink-0" size={24} />
             <div>
                <h4 className="text-sm font-bold text-gray-200">Secure Access</h4>
                <p className="text-[11px] text-gray-500">Your complaints are private.</p>
             </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center bg-zinc-900/50">
          <div className="mb-8">
             <h3 className="text-xl font-bold text-white mb-1">Welcome Back</h3>
             <p className="text-gray-500 text-sm">Access your grievance dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase ml-1">Security PIN (6-Digits)</label>
               <div className="relative group">
                 <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-red-500 transition-colors" size={18} />
                 <input 
                   type="password" 
                   inputMode="numeric"
                   value={key}
                   onChange={(e) => {
                     const val = e.target.value;
                     if (/^\d*$/.test(val) && val.length <= 6) setKey(val);
                   }}
                   placeholder="• • • • • •" 
                   className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3 pl-10 outline-none focus:border-red-500 transition-colors text-xl tracking-[0.5em] font-mono text-center placeholder:tracking-normal"
                   required
                 />
               </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>VIEW MY COMPLAINTS <ArrowRight size={18} /></>}
            </button>

            <div className="text-center pt-2">
               <p className="text-gray-500 text-sm">
                 Haven't filed a complaint yet? <br/>
                 <Link to="/complaint/user/register" className="text-red-400 hover:text-red-300 font-bold hover:underline flex items-center justify-center gap-1 mt-1">
                    <FileText size={14}/> File New Complaint
                 </Link>
               </p>
            </div>

          </form>
        </div>

      </motion.div>
    </div>
  );
};

export default ComplaintUserLogin;