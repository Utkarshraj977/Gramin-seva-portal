import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Siren, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const ComplaintAdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [ComplaintAdminKey, setComplaintAdminKey] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!ComplaintAdminKey.trim()) {
      toast.error("Admin Key is missing");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/ComplaintAdmin/adminlogin",
        { ComplaintAdminKey },
        { withCredentials: true }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Command Center Access Granted");
        
        // Redirect to Admin Dashboard
        setTimeout(() => {
          navigate("/complaint/admin/dashboard");
        }, 1500);
      }
    } catch (error) {
      // Backend returns 409 if key is wrong
      const errorMsg = error.response?.data?.message || "Unauthorized Access";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative p-4">
      {/* Dark Red Overlay for Authority vibe */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm"></div>
      <Toaster position="top-center" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md bg-white/5 border border-red-600/40 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.2)] p-8 backdrop-blur-xl"
      >
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-900/30 border border-red-500/50 mb-4 shadow-[0_0_15px_rgba(220,38,38,0.4)]">
              <ShieldCheck className="text-red-500 w-10 h-10" />
           </div>
           <h1 className="text-3xl font-extrabold text-white tracking-widest uppercase">
             Admin Panel
           </h1>
           <div className="flex items-center justify-center gap-2 mt-2">
             <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
             <p className="text-red-400/70 text-xs font-mono tracking-widest">
               RESTRICTED ACCESS
             </p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
             <label className="text-xs text-red-500 font-bold ml-1 uppercase tracking-wider">
               Master Key
             </label>
             <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-red-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  value={ComplaintAdminKey}
                  onChange={(e) => setComplaintAdminKey(e.target.value)}
                  className="w-full bg-black/60 border border-red-500/30 text-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono tracking-widest placeholder:text-gray-700"
                  placeholder="ENTER KEY"
                  required
                />
             </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            disabled={loading} 
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all mt-4 ${loading ? "bg-gray-700 cursor-not-allowed" : "bg-red-600 hover:bg-red-500 hover:shadow-red-600/40"}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>AUTHENTICATE <ArrowRight size={20} /></>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-4">
           <Link to="/complaint/admin/register" className="text-gray-500 hover:text-red-400 text-sm transition-colors font-medium">
             Register New Department
           </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ComplaintAdminLogin;