import React, { useState } from "react";
import { motion } from "framer-motion";
import { Key, Lock, Shield, ArrowRight, Cpu, Terminal } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

// ✅ Import Service
import { cyberUser } from "../services/api";

const CyberUserLogin = () => {
  const [loading, setLoading] = useState(false);
  const [cyberUserKey, setCyberUserKey] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!/^\d{6}$/.test(cyberUserKey)) {
      toast.error("Key must be exactly 6 digits.");
      setLoading(false);
      return;
    }

    try {
      // ✅ Use Service
      // Pass as object to match req.body
      const response = await cyberUser.login({ cyberUserKey });

      if (response) {
        toast.success("Access Granted. Initializing Session...");
        setTimeout(() => {
          navigate("/cyber/user/dashboard"); 
        }, 1500);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Authentication Failed. Invalid Key.";
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
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"></div>
      <Toaster position="top-center" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl bg-white/5 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row backdrop-blur-md"
      >
        {/* Left Side: Visuals */}
        <div className="md:w-1/2 bg-gradient-to-br from-emerald-900/90 to-black/95 p-10 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-[-40px] right-[-40px] w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-40px] left-[-40px] w-40 h-40 bg-teal-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <Cpu className="w-12 h-12 animate-pulse text-emerald-400" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-wide mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              SYSTEM ACCESS
            </h1>
            <p className="text-emerald-100/70 text-lg font-mono leading-relaxed">
              &gt; Authenticate credentials.<br/>
              &gt; Establish secure link.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-10 bg-black/60 flex flex-col justify-center border-l border-white/5">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
              <Terminal size={24} className="text-emerald-500" /> User Verification
            </h2>
            <p className="text-gray-400 text-sm">Enter your session key to proceed.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-emerald-500/80 uppercase tracking-widest ml-1">
                Encrypted Key (6 Digits)
              </label>
              <div className="relative group">
                <Shield className="absolute left-4 top-4 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                <input
                  type="password"
                  value={cyberUserKey}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val) && val.length <= 6) setCyberUserKey(val);
                  }}
                  placeholder="0 0 0 0 0 0"
                  className="w-full bg-white/5 border border-emerald-500/20 text-emerald-300 text-center text-2xl tracking-[0.5em] rounded-xl py-3 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-700 placeholder:tracking-normal font-mono"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${loading ? "bg-gray-800 cursor-not-allowed" : "bg-gradient-to-r from-emerald-600 to-teal-700 hover:shadow-emerald-500/20 hover:border hover:border-emerald-400/50"}`}
            >
              {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <>Authenticate <ArrowRight size={20} /></>}
            </motion.button>
            
            <div className="text-center pt-2">
               <p className="text-gray-400 text-sm">
                 No active session? <Link to="/cyber/user/register" className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline transition-colors">Register Key</Link>
               </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CyberUserLogin;