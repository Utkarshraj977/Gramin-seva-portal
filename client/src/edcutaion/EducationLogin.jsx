import React, { useState } from "react";
import { motion } from "framer-motion";
import { Key, School, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { education } from "../services/api";

const EducationLogin = () => {
  const [loading, setLoading] = useState(false);
  const [EducatorKey, setEducatorKey] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!EducatorKey.trim()) {
      toast.error("Educator Key is required");
      setLoading(false);
      return;
    }

    try {
      const response = await education.login({ EducatorKey });

      toast.success("Welcome back, Educator!");
      
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      // Redirect to Education Dashboard
      setTimeout(() => {
        navigate("/education/admin/dashboard");
      }, 1500);

    } catch (error) {
      // Handles 409/401/500 errors thrown by Axios
      const errorMsg = error.response?.data?.message || "Invalid Key or Server Error";
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
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop')] bg-cover bg-center relative p-4">
      {/* Dark overlay with blue tint */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px]"></div>
      <Toaster position="top-center" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl p-8"
      >
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-4 border border-blue-100">
              <School className="text-blue-600 w-10 h-10" />
           </div>
           <h1 className="text-3xl font-bold text-gray-800 tracking-tight font-serif">
             Faculty Login
           </h1>
           <p className="text-gray-500 text-sm mt-2">
             Enter your unique educator key to access the dashboard.
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
             <label className="text-xs font-bold text-blue-800 uppercase tracking-widest ml-1">
               Educator Key
             </label>
             <div className="relative group">
                <Key className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                  type="password" 
                  value={EducatorKey}
                  onChange={(e) => setEducatorKey(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-lg placeholder:text-gray-400"
                  placeholder="Enter Key"
                  required
                />
             </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            disabled={loading} 
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all mt-4 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>Access Dashboard <ArrowRight size={20} /></>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-5">
           <Link to="/education/admin/register" className="text-gray-500 hover:text-blue-600 text-sm transition-colors font-medium">
             New Educator? Register Here
           </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default EducationLogin;