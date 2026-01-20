import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Key, Briefcase, Upload, Shield, X, ImageIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

// ✅ Import Service
import { cyberAdmin } from "../services/api";

const CyberAdminRegister = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Experience: "",
    Start_time: "",
    End_time: "",
    location: "",
    cyberKey: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create FormData for Multipart Upload
    const data = new FormData();
    data.append("Experience", formData.Experience);
    data.append("Start_time", formData.Start_time);
    data.append("End_time", formData.End_time);
    data.append("location", formData.location);
    data.append("cyberKey", formData.cyberKey);
    
    if (imageFile) {
      data.append("cyber_shopPic", imageFile);
    } else {
      toast.error("Shop/Cyber Picture is required");
      setLoading(false);
      return;
    }

    try {
      // ✅ Use Service: cyberAdmin.register()
      // Axios instance automatically sets Content-Type: multipart/form-data
      const response = await cyberAdmin.register(data);

      if (response) {
        toast.success("Admin Profile Created Successfully!");
        setTimeout(() => {
            navigate("/cyber/admin/login"); 
        }, 2000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration Failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      <Toaster position="top-center" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-5xl bg-white/5 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row backdrop-blur-md"
      >
        {/* Left Side: Admin Visuals */}
        <div className="md:w-1/3 bg-gradient-to-b from-black to-emerald-950/50 p-8 text-white flex flex-col justify-between border-r border-emerald-500/20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-10 h-10 text-emerald-400 animate-pulse" />
              <h1 className="text-2xl font-bold tracking-widest text-emerald-100">ADMIN CORE</h1>
            </div>
            <p className="text-emerald-200/60 text-sm leading-relaxed font-mono">
              // INITIALIZING REGISTRATION PROTOCOL...<br/>
              // VERIFY LOCATION<br/>
              // UPLOAD CREDENTIALS
            </p>
          </div>
          
          <div className="mt-8 bg-emerald-900/20 p-4 rounded-xl border border-emerald-500/20">
            <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2"><ImageIcon size={16}/> Shop Image</h3>
            <p className="text-xs text-gray-400">Upload a clear photo of your Cyber Cafe/Shop front for verification.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-2/3 p-8 bg-black/60">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">Register Shop/Admin</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Row 1: Experience & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 ml-1">Experience (Years/Details)</label>
                <div className="relative group">
                  <Briefcase className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-400" size={18} />
                  <input type="text" name="Experience" value={formData.Experience} onChange={handleInputChange} placeholder="e.g. 5 Years" className="w-full bg-white/5 border border-emerald-500/20 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-emerald-500 transition-all placeholder:text-gray-600" required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400 ml-1">Shop Location</label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-400" size={18} />
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="City, Area" className="w-full bg-white/5 border border-emerald-500/20 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-emerald-500 transition-all placeholder:text-gray-600" required />
                </div>
              </div>
            </div>

            {/* Row 2: Times */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 ml-1">Opening Time</label>
                <div className="relative group">
                  <Clock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-400" size={18} />
                  <input type="time" name="Start_time" value={formData.Start_time} onChange={handleInputChange} className="w-full bg-white/5 border border-emerald-500/20 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-emerald-500 transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400 ml-1">Closing Time</label>
                <div className="relative group">
                  <Clock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-400" size={18} />
                  <input type="time" name="End_time" value={formData.End_time} onChange={handleInputChange} className="w-full bg-white/5 border border-emerald-500/20 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-emerald-500 transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" required />
                </div>
              </div>
            </div>

            {/* Key */}
            <div className="space-y-1">
              <label className="text-xs text-gray-400 ml-1">Admin Security Key</label>
              <div className="relative group">
                <Key className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-emerald-400" size={18} />
                <input type="text" name="cyberKey" value={formData.cyberKey} onChange={handleInputChange} placeholder="Create a secure key" className="w-full bg-white/5 border border-emerald-500/20 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-emerald-500 transition-all placeholder:text-gray-600 font-mono" required />
              </div>
            </div>

            {/* File Upload Area */}
            <div className="space-y-1">
               <label className="text-xs text-gray-400 ml-1">Shop Picture</label>
               <div className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-all ${imagePreview ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-gray-600 hover:border-emerald-400/50 bg-white/5'}`}>
                 
                 {imagePreview ? (
                   <div className="relative w-full h-32">
                     <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                     <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors">
                       <X size={16} />
                     </button>
                   </div>
                 ) : (
                   <>
                     <input type="file" name="cyber_shopPic" onChange={handleFileChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                     <Upload className="text-gray-400 mb-2" size={28} />
                     <p className="text-sm text-gray-300">Click to upload or drag image here</p>
                     <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG</p>
                   </>
                 )}
               </div>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} disabled={loading} className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all mt-4 ${loading ? "bg-gray-700 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/20"}`}>
              {loading ? "Registering System..." : "Complete Registration"}
            </motion.button>
            
            <div className="text-center">
              <Link to="/cyber/admin/login" className="text-emerald-400 text-sm hover:underline">Already an Admin? Login</Link>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CyberAdminRegister;