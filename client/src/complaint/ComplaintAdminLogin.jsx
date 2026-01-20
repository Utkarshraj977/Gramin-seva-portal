import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, Key, ShieldCheck, Loader2, ArrowRight, Lock 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { complaintAdmin } from "../services/api"; // ✅ Import Service

const ComplaintAdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!key.trim()) {
      toast.error("Please enter your Admin Key");
      setLoading(false);
      return;
    }

    try {
      // ✅ Use Service: complaintAdmin.login()
      // Pass as object { ComplaintAdminKey: "..." }
      const response = await complaintAdmin.login({ ComplaintAdminKey: key });

      // If successful (no error thrown)
      toast.success("Welcome Back, Official!");
      setTimeout(() => navigate("/complaint/admin/dashboard"), 1500);

    } catch (error) {
      console.error("Login Error:", error);
      
      const status = error.response?.status;
      const msg = error.response?.data?.message || "Login Failed";

      if (status === 404) {
        toast.error("Admin Profile not found. Please Register first.");
      } else if (status === 401) {
        if (msg.includes("Invalid Admin Key")) {
           toast.error("Incorrect Secret Key!");
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-40"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[120px]"></div>

      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row backdrop-blur-xl"
      >
        
        {/* Left Side: Info */}
        <div className="md:w-1/2 bg-gradient-to-br from-slate-900 to-slate-950 p-10 border-r border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/50 mb-6">
               <Building2 className="text-white" size={24} />
            </div>
            
            <h2 className="text-3xl font-bold text-slate-200 mb-2">
              Official <span className="text-red-500">Access.</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Secure login for Gram Pradhans, Ward Members, and Department Heads to manage public grievances.
            </p>
          </div>

          <div className="mt-8 bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
             <ShieldCheck className="text-green-400 shrink-0" size={24} />
             <div>
                <h4 className="text-sm font-bold text-slate-200">Secure Gateway</h4>
                <p className="text-xs text-slate-500">End-to-end encrypted session.</p>
             </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <div className="mb-8">
             <h3 className="text-xl font-bold text-white mb-1">Welcome Back</h3>
             <p className="text-slate-500 text-sm">Enter your secret key to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-400 uppercase ml-1">Secret Key / PIN</label>
               <div className="relative group">
                 <Lock className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-red-500 transition-colors" size={18} />
                 <input 
                   type="password" 
                   value={key}
                   onChange={(e) => setKey(e.target.value)}
                   placeholder="••••••••" 
                   className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl p-3 pl-10 outline-none focus:border-red-500 transition-colors text-lg tracking-widest font-mono"
                   required
                 />
               </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>ACCESS DASHBOARD <ArrowRight size={18} /></>}
            </button>

            <div className="text-center pt-2">
               <p className="text-slate-500 text-sm">
                 Not registered as an official? <br/>
                 <Link to="/complaint/admin/register" className="text-red-400 hover:text-red-300 font-bold hover:underline">Apply for Official Account</Link>
               </p>
            </div>

          </form>
        </div>

      </motion.div>
    </div>
  );
};

export default ComplaintAdminLogin;