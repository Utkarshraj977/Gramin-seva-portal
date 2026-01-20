import React, { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Clock, MapPin, DollarSign, Upload, Key, X, CheckCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { education } from "../services/api"; // ✅ Using centralized API

const EducationRegister = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fee: "",
    Experience: "",
    category: "",
    Start_time: "",
    End_time: "",
    location: "",
    EducatorKey: "",
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
      toast.error("Education Certificate is required");
      setLoading(false);
      return;
    }

    // Create FormData
    const data = new FormData();
    data.append("fee", formData.fee);
    data.append("Experience", formData.Experience);
    data.append("category", formData.category);
    data.append("Start_time", formData.Start_time);
    data.append("End_time", formData.End_time);
    data.append("location", formData.location);
    data.append("EducatorKey", formData.EducatorKey);
    data.append("Education_certificate", file);

    try {
      // ✅ Use the education service
      // Note: api.js returns response.data, so we don't check response.status here
      const response = await education.register_profile(data);

      if (response) {
        toast.success("Educator Profile Created Successfully!");
        setTimeout(() => {
          navigate("/education/admin/login");
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
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-sm"></div>
      <Toaster position="top-center" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-5xl bg-white/10 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row backdrop-blur-md"
      >
        {/* Left Side: Visuals */}
        <div className="md:w-1/3 bg-gradient-to-br from-blue-900 to-indigo-900 p-8 text-white flex flex-col justify-between border-r border-white/10 relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-amber-500/20 rounded-full blur-3xl"></div>
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="w-10 h-10 text-amber-400" />
              <h1 className="text-2xl font-serif font-bold tracking-wide text-white">EDU PORTAL</h1>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed italic">
              "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
            </p>
          </div>
          
          <div className="mt-8 bg-white/5 p-4 rounded-xl border border-white/10">
            <h3 className="text-amber-300 font-bold mb-2 flex items-center gap-2 text-sm"><Upload size={14}/> Document Upload</h3>
            <p className="text-xs text-gray-300">Please upload a valid teaching certificate or degree for verification.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-2/3 p-8 bg-white/95 text-gray-800">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b-2 border-amber-500 inline-block pb-1">Teacher Registration</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Category & Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 ml-1">Subject / Category</label>
                <div className="relative group">
                  <BookOpen className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-600" size={18} />
                  <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g. Mathematics" className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 ml-1">Experience</label>
                <div className="relative group">
                  <GraduationCap className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-600" size={18} />
                  <input type="text" name="Experience" value={formData.Experience} onChange={handleInputChange} placeholder="e.g. 5 Years" className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" required />
                </div>
              </div>
            </div>

            {/* Fee & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 ml-1">Monthly Fee</label>
                <div className="relative group">
                  <DollarSign className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-600" size={18} />
                  <input type="number" name="fee" value={formData.fee} onChange={handleInputChange} placeholder="Amount" className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 ml-1">Institute Location</label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-600" size={18} />
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="City, Area" className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" required />
                </div>
              </div>
            </div>

            {/* Time Slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 ml-1">Start Time</label>
                <div className="relative">
                   <Clock className="absolute left-3 top-3.5 text-gray-400" size={18}/>
                   <input type="time" name="Start_time" value={formData.Start_time} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500" />
                </div>
               </div>
               <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 ml-1">End Time</label>
                <div className="relative">
                   <Clock className="absolute left-3 top-3.5 text-gray-400" size={18}/>
                   <input type="time" name="End_time" value={formData.End_time} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500" />
                </div>
               </div>
            </div>

            {/* Educator Key */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 ml-1">Educator Secret Key</label>
              <div className="relative group">
                <Key className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-600" size={18} />
                <input type="text" name="EducatorKey" value={formData.EducatorKey} onChange={handleInputChange} placeholder="Unique Access Key" className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono tracking-wider" required />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-1">
               <label className="text-xs font-semibold text-gray-600 ml-1">Certificate</label>
               <div className={`relative border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center transition-all bg-gray-50 ${preview ? 'border-green-500' : 'border-gray-300 hover:border-blue-400'}`}>
                 
                 {preview ? (
                   <div className="flex items-center justify-between w-full px-4">
                     <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle size={20} />
                        <span className="text-sm font-medium truncate max-w-[150px]">{file.name}</span>
                     </div>
                     <button type="button" onClick={removeFile} className="bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-200">
                       <X size={16} />
                     </button>
                   </div>
                 ) : (
                   <>
                     <input type="file" name="Education_certificate" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                     <div className="flex items-center gap-2 text-gray-500">
                       <Upload size={20} />
                       <span className="text-sm">Upload File</span>
                     </div>
                   </>
                 )}
               </div>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} disabled={loading} className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all mt-2 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-blue-500/30"}`}>
              {loading ? "Creating Profile..." : "Register as Educator"}
            </motion.button>
            
            <div className="text-center">
              <Link to="/education/admin/login" className="text-blue-600 text-sm hover:underline font-semibold">Already registered? Login</Link>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EducationRegister;