import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Shield, Clock, MapPin, Key, FileBadge, Upload, X, CheckCircle, Siren } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const ComplaintAdminRegister = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "",
    Start_time: "",
    End_time: "",
    location: "",
    ComplaintAdminKey: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!file) {
        toast.error("Authority Certificate is required");
        setLoading(false);
        return;
    }

    // Create FormData for file upload
    const data = new FormData();
    data.append("category", formData.category);
    data.append("Start_time", formData.Start_time);
    data.append("End_time", formData.End_time);
    data.append("location", formData.location);
    data.append("ComplaintAdminKey", formData.ComplaintAdminKey);
    data.append("complaintAdmin_certificate", file);

    try {
      // Assuming route is /api/v1/ComplaintAdmin/register based on logic
      const response = await axios.post(
        "http://localhost:8000/api/v1/ComplaintAdmin/register", 
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        toast.success("Authority Registered Successfully!");
        setTimeout(() => {
            navigate("/complaint/admin/login"); 
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
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center relative p-4">
      <div className="absolute inset-0 bg-red-950/90 backdrop-blur-sm"></div>
      <Toaster position="top-center" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-5xl bg-white/5 border border-red-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row backdrop-blur-md"
      >
        {/* Left Side: Admin Visuals */}
        <div className="md:w-1/3 bg-gradient-to-b from-black to-red-900/40 p-8 text-white flex flex-col justify-between border-r border-red-500/20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Siren className="w-10 h-10 text-red-500 animate-pulse" />
              <h1 className="text-2xl font-bold tracking-widest text-red-100">ADMIN HQ</h1>
            </div>
            <p className="text-red-200/60 text-sm leading-relaxed font-mono">
              // COMPLAINT AUTHORITY<br/>
              // CREDENTIAL VERIFICATION<br/>
              // SECURE UPLINK
            </p>
          </div>
          
          <div className="mt-8 bg-red-900/20 p-4 rounded-xl border border-red-500/20">
            <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2"><FileBadge size={16}/> Certificate</h3>
            <p className="text-xs text-gray-400">Upload your government or department authorization certificate for validation.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-2/3 p-8 bg-black/60">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">Register Authority</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Row 1: Category & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 ml-1">Department Category</label>
                <div className="relative group">
                  <Shield className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-red-400" size={18} />
                  <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g. Traffic, Cyber, Civil" className="w-full bg-white/5 border border-red-500/20 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-red-500 transition-all placeholder:text-gray-600" required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400 ml-1">Jurisdiction / Location</label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-red-400" size={18} />
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Area of Operation" className="w-full bg-white/5 border border-red-500/20 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-red-500 transition-all placeholder:text-gray-600" required />
                </div>
              </div>
            </div>

            {/* Row 2: Times */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 ml-1">Shift Start</label>
                <div className="relative group">
                  <Clock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-red-400" size={18} />
                  <input type="time" name="Start_time" value={formData.Start_time} onChange={handleInputChange} className="w-full bg-white/5 border border-red-500/20 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-red-500 transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400 ml-1">Shift End</label>
                <div className="relative group">
                  <Clock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-red-400" size={18} />
                  <input type="time" name="End_time" value={formData.End_time} onChange={handleInputChange} className="w-full bg-white/5 border border-red-500/20 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-red-500 transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" required />
                </div>
              </div>
            </div>

            {/* Key */}
            <div className="space-y-1">
              <label className="text-xs text-gray-400 ml-1">Admin Access Key</label>
              <div className="relative group">
                <Key className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-red-400" size={18} />
                <input type="text" name="ComplaintAdminKey" value={formData.ComplaintAdminKey} onChange={handleInputChange} placeholder="Unique Security Code" className="w-full bg-white/5 border border-red-500/20 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-red-500 transition-all placeholder:text-gray-600 font-mono tracking-wider" required />
              </div>
            </div>

            {/* File Upload Area */}
            <div className="space-y-1">
               <label className="text-xs text-gray-400 ml-1">Authorization Certificate</label>
               <div className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-all ${preview ? 'border-red-500/50 bg-red-900/10' : 'border-gray-600 hover:border-red-400/50 bg-white/5'}`}>
                 
                 {preview ? (
                   <div className="relative w-full flex items-center justify-center">
                     <div className="flex items-center gap-2 text-red-300">
                        <CheckCircle size={20} />
                        <span className="text-sm font-semibold truncate max-w-[200px]">{file.name}</span>
                     </div>
                     <button type="button" onClick={removeFile} className="ml-4 bg-red-500/20 p-2 rounded-full hover:bg-red-500 hover:text-white transition-all">
                       <X size={16} />
                     </button>
                   </div>
                 ) : (
                   <>
                     <input type="file" name="complaintAdmin_certificate" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                     <Upload className="text-gray-400 mb-2" size={28} />
                     <p className="text-sm text-gray-300">Upload Certificate (PDF/Image)</p>
                   </>
                 )}
               </div>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} disabled={loading} className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all mt-4 ${loading ? "bg-gray-700 cursor-not-allowed" : "bg-gradient-to-r from-red-700 to-red-900 hover:shadow-red-500/30"}`}>
              {loading ? "Verifying Credentials..." : "Register System"}
            </motion.button>
            
            <div className="text-center">
              <Link to="/complaint/admin/login" className="text-red-400 text-sm hover:underline hover:text-red-300">Existing Authority? Login</Link>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ComplaintAdminRegister;