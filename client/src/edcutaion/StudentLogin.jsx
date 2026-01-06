import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Key, UserCheck, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const StudentLogin = () => {
  const [loading, setLoading] = useState(false);
  const [StudentKey, setStudentKey] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!StudentKey.trim()) {
      toast.error("Please enter your Student Key");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/education/student/login",
        { StudentKey },
        { withCredentials: true }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Welcome, Student!");
        
        // Redirect to Student Dashboard
        setTimeout(() => {
          navigate("/education/user/dashboard");
        }, 1500);
      }
    } catch (error) {
      // Handles 409 "StudentKey is wrong"
      const errorMsg = error.response?.data?.message || "Invalid Key";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop')] bg-cover bg-center relative p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px]"></div>
      <Toaster position="top-center" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-pink-500"></div>
        
        <div className="text-center mb-8 mt-4">
           <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-50 mb-4 border-2 border-orange-100">
              <UserCheck className="text-orange-500 w-10 h-10" />
           </div>
           <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
             Student Login
           </h1>
           <p className="text-gray-400 text-sm mt-2">
             Enter your unique key to access your classes.
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
             <label className="text-xs font-bold text-orange-500 uppercase tracking-widest ml-1">
               Student Key
             </label>
             <div className="relative group">
                <Key className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                <input 
                  type="password" 
                  value={StudentKey}
                  onChange={(e) => setStudentKey(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-mono text-xl tracking-widest placeholder:text-gray-300 placeholder:tracking-normal"
                  placeholder="PIN"
                  required
                />
             </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            disabled={loading} 
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all mt-4 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-orange-500/20"}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>Enter Portal <ArrowRight size={20} /></>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-5">
           <Link to="/education/user/register" className="text-gray-500 hover:text-orange-600 text-sm transition-colors font-medium">
             Don't have a key? Register Now
           </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentLogin;