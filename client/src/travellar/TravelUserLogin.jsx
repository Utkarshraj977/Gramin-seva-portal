import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Key, Lock, Plane, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const TravelUserLogin = () => {
  const [loading, setLoading] = useState(false);
  const [travellingUserKey, setTravellingUserKey] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Frontend Validation
    if (!/^\d{6}$/.test(travellingUserKey)) {
      toast.error("Key must be exactly 6 digits.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/traveller/traveluserlogin",
        { TravellingUserKey: travellingUserKey },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Login Successful! Redirecting...");
        
        // 👇 YAHAN CHANGE KIYA HAI: Dashboard Route
        setTimeout(() => {
          navigate("/traveller/user/dashboard"); 
        }, 1500);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Invalid Key or Unauthorized";
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
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center relative p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]"></div>
      <Toaster position="top-center" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row backdrop-blur-md"
      >
        {/* Left Side: Visuals */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-600/80 to-indigo-800/80 p-10 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-[-40px] right-[-40px] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-40px] left-[-40px] w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <Plane className="w-12 h-12 animate-pulse text-yellow-400 transform -rotate-45" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-wide mb-2">TRAVELLER ACCESS</h1>
            <p className="text-blue-100 text-lg font-light leading-relaxed">
              Enter your secure 6-digit key to manage your journey.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-10 bg-black/50 flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
              <Lock size={24} className="text-blue-400" /> Secure Login
            </h2>
            <p className="text-gray-400 text-sm">Please verify your identity.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">
                Traveller Secret Key
              </label>
              <div className="relative group">
                <Key className="absolute left-4 top-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                <input
                  type="password"
                  value={travellingUserKey}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val) && val.length <= 6) setTravellingUserKey(val);
                  }}
                  placeholder="• • • • • •"
                  className="w-full bg-white/5 border border-white/10 text-white text-center text-2xl tracking-[0.5em] rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600 placeholder:tracking-normal font-mono"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${loading ? "bg-gray-700 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-blue-500/40"}`}
            >
              {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <>Unlock Journey <ArrowRight size={20} /></>}
            </motion.button>
            
            <div className="text-center pt-2">
               <p className="text-gray-400 text-sm">
                 Don't have a key? <Link to="/traveller/user/register" className="text-blue-400 hover:text-blue-300 font-semibold hover:underline">Register New Journey</Link>
               </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default TravelUserLogin;