import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  Building2, UserCheck, Key, MapPin, UploadCloud, 
  Clock, ShieldCheck, FileText, Loader2, ArrowRight, X 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const ComplaintAdminRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form Fields based on Backend Model
  const [formData, setFormData] = useState({
    designation: "Gram Pradhan",
    assignedWard: "",
    category: "General Administration",
    Start_time: "",
    End_time: "",
    location: "",
    ComplaintAdminKey: ""
  });

  const [certificate, setCertificate] = useState(null);
  const [preview, setPreview] = useState(null);

  // Cleanup memory for preview image
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertificate(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeFile = (e) => {
    e.preventDefault(); // Prevent form submission
    setCertificate(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!certificate) {
      toast.error("Official ID/Certificate upload is required");
      setLoading(false);
      return;
    }

    // Key validation (Optional: length check)
    if (formData.ComplaintAdminKey.length < 4) {
      toast.error("Secret Key must be at least 4 characters");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      data.append("complaintAdmin_certificate", certificate);

      const response = await axios.post(
        "http://localhost:8000/api/v1/ComplaintAdmin/register",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Admin Registration Successful!");
        
        // Form Reset
        setFormData({
            designation: "Gram Pradhan",
            assignedWard: "",
            category: "General Administration",
            Start_time: "",
            End_time: "",
            location: "",
            ComplaintAdminKey: ""
        });
        setCertificate(null);
        setPreview(null);

        // Redirect
        setTimeout(() => navigate("/complaint/admin/login"), 2000);
      }
    } catch (error) {
      console.error("Admin Reg Error:", error);
      const errorMsg = error.response?.data?.message || "Registration Failed";
      
      if (error.response?.status === 401) {
        toast.error("Authentication Error: Please login to the main portal first.");
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-40"></div>
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-900/20 rounded-full blur-[100px]"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-red-900/10 rounded-full blur-[100px]"></div>

      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-6xl bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row backdrop-blur-xl"
      >
        
        {/* Left Side: Branding & Info */}
        <div className="lg:w-1/3 bg-gradient-to-b from-slate-900 to-slate-950 p-10 border-r border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
               <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/50">
                  <Building2 className="text-white" size={24} />
               </div>
               <div>
                  <h1 className="text-2xl font-bold text-white tracking-wide">ADMIN PORTAL</h1>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">Official Registration</p>
               </div>
            </div>
            
            <h2 className="text-3xl font-bold text-slate-200 mb-4">
              Manage Public <br/>
              <span className="text-red-500">Grievances.</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Register here to become an authorized Complaint Administrator. You will be responsible for resolving issues in your ward or department.
            </p>
          </div>

          <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 space-y-4">
             <div className="flex gap-3">
                <ShieldCheck className="text-green-400 shrink-0" size={20} />
                <div>
                   <h4 className="text-sm font-bold text-slate-200">Official Verification</h4>
                   <p className="text-xs text-slate-500">Upload valid ID proof for approval.</p>
                </div>
             </div>
             <div className="flex gap-3">
                <Key className="text-blue-400 shrink-0" size={20} />
                <div>
                   <h4 className="text-sm font-bold text-slate-200">Secure Access</h4>
                   <p className="text-xs text-slate-500">Use a strong PIN for daily login.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:w-2/3 p-8 lg:p-12 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-8">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
               <UserCheck className="text-red-500" /> Officer Details
             </h2>
             <span className="text-xs bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20">
               Official Use Only
             </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Role & Ward */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Designation / Post</label>
                  <select 
                    name="designation" 
                    value={formData.designation} 
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl p-3 outline-none focus:border-red-500 transition-colors text-sm"
                  >
                    <option>Gram Pradhan</option>
                    <option>Ward Member</option>
                    <option>Sachiv (Secretary)</option>
                    <option>BDO Officer</option>
                    <option>Other</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Assigned Ward / Area</label>
                  <input 
                    type="text" 
                    name="assignedWard" 
                    value={formData.assignedWard} 
                    onChange={handleChange}
                    placeholder="e.g. Ward No. 5" 
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl p-3 outline-none focus:border-red-500 transition-colors text-sm"
                    required
                  />
               </div>
            </div>

            {/* 2. Department & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Department Category</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl p-3 outline-none focus:border-red-500 transition-colors text-sm"
                  >
                    <option>General Administration</option>
                    <option>Public Works (PWD)</option>
                    <option>Water Supply</option>
                    <option>Sanitation & Health</option>
                    <option>Education</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Office Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-500" size={16} />
                    <input 
                      type="text" 
                      name="location" 
                      value={formData.location} 
                      onChange={handleChange}
                      placeholder="e.g. Panchayat Bhawan" 
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl p-3 pl-10 outline-none focus:border-red-500 transition-colors text-sm"
                      required
                    />
                  </div>
               </div>
            </div>

            {/* 3. Timings & Key */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Start Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 text-slate-500" size={16} />
                    <input 
                      type="time" 
                      name="Start_time" 
                      value={formData.Start_time} 
                      onChange={handleChange}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl p-3 pl-10 outline-none focus:border-red-500 transition-colors text-sm"
                      required
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">End Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 text-slate-500" size={16} />
                    <input 
                      type="time" 
                      name="End_time" 
                      value={formData.End_time} 
                      onChange={handleChange}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl p-3 pl-10 outline-none focus:border-red-500 transition-colors text-sm"
                      required
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Secret Key</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 text-slate-500" size={16} />
                    {/* 👇 SECURITY FIX: type="password" */}
                    <input 
                      type="password" 
                      name="ComplaintAdminKey" 
                      value={formData.ComplaintAdminKey} 
                      onChange={handleChange}
                      placeholder="Create Password" 
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl p-3 pl-10 outline-none focus:border-red-500 transition-colors text-sm font-mono tracking-widest"
                      required
                    />
                  </div>
               </div>
            </div>

            {/* 4. Certificate Upload */}
            <div className="space-y-2 pt-2">
               <label className="text-xs font-bold text-slate-400 uppercase ml-1">Upload ID / Certificate</label>
               <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:bg-slate-800/50 transition-colors relative cursor-pointer group">
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    accept="image/*,.pdf" 
                  />
                  {preview ? (
                     <div className="relative h-24 flex items-center justify-center">
                        {/* Check if it's likely an image by preview string or extension logic (simplified here) */}
                        {certificate?.type.startsWith("image/") ? (
                             <img src={preview} alt="Preview" className="h-full object-contain rounded-md shadow-lg" />
                        ) : (
                            <div className="flex items-center gap-2 text-slate-200 bg-slate-800 p-3 rounded-lg border border-slate-600">
                                <FileText className="text-red-400" />
                                <span className="text-sm truncate max-w-[150px]">{certificate?.name}</span>
                            </div>
                        )}
                        
                        <button 
                            onClick={removeFile}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 z-20"
                        >
                            <X size={14} />
                        </button>
                     </div>
                  ) : (
                     <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-slate-300">
                        <div className="p-3 bg-slate-800 rounded-full">
                           <UploadCloud size={24} />
                        </div>
                        <p className="text-xs">Drag & drop or click to upload ID proof</p>
                     </div>
                  )}
               </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
               <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {loading ? <Loader2 className="animate-spin" /> : <>REGISTER OFFICIAL <ArrowRight size={18} /></>}
               </button>
            </div>

            <div className="text-center">
               <p className="text-slate-500 text-sm">
                 Already have an account? <Link to="/complaint/admin/login" className="text-red-400 hover:text-red-300 font-bold hover:underline">Officer Login</Link>
               </p>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ComplaintAdminRegister;