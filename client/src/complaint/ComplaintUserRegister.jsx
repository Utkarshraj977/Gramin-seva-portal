import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  AlertTriangle, MapPin, Key, MessageCircle, Send, 
  ShieldAlert, FileText, List, Loader2, Camera, X 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const ComplaintUserRegister = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Reference for file input to reset it properly

  // State for Text Data
  const [formData, setFormData] = useState({
    title: "",
    category: "Electricity",
    message: "",
    location: "",
    ComplaintUserKey: "",
  });

  // State for Image File
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Cleanup Memory (Avoid Memory Leaks)
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = (e) => {
    e.preventDefault();
    setPreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset input value to allow re-uploading same file
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!/^\d{6}$/.test(formData.ComplaintUserKey)) {
      toast.error("Security PIN must be exactly 6 digits");
      setLoading(false);
      return;
    }

    try {
      // 1. Create FormData
      const dataToSend = new FormData();
      dataToSend.append("title", formData.title);
      dataToSend.append("category", formData.category);
      dataToSend.append("message", formData.message);
      dataToSend.append("location", formData.location);
      dataToSend.append("ComplaintUserKey", formData.ComplaintUserKey);
      
      if (imageFile) {
        dataToSend.append("complaintImage", imageFile);
      }

      // 2. API Call
      const response = await axios.post(
        "http://localhost:8000/api/v1/complaintuser/register", 
        dataToSend,
        { 
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Complaint Registered Successfully!");
        
        // Reset Form
        setFormData({ title: "", category: "Electricity", message: "", location: "", ComplaintUserKey: "" });
        setImageFile(null);
        setPreview(null);
        
        setTimeout(() => {
            navigate("/complaint/user/login"); 
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Registration Failed";
      
      if (error.response?.status === 401 || error.response?.status === 500) {
         toast.error("Please ensure you are Logged In to the main portal.");
      } else {
         toast.error(errorMsg);
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
    <div className="min-h-screen flex items-center justify-center bg-[#1a0505] p-4 font-sans relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-red-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-orange-600/10 rounded-full blur-[80px]"></div>

      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }}/>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-5xl bg-black/40 border border-red-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row backdrop-blur-xl"
      >
        {/* Left Side: Info */}
        <div className="md:w-2/5 bg-gradient-to-br from-red-900/90 to-black p-10 text-white flex flex-col justify-between border-r border-red-500/20">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-red-600 rounded-xl shadow-lg shadow-red-900/50">
                <ShieldAlert className="w-8 h-8 text-white" />
              </div>
              <div>
                 <h1 className="text-2xl font-bold tracking-wide">JAN SUNWAI</h1>
                 <p className="text-[10px] text-red-300 uppercase tracking-widest">Secure Reporting</p>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">
              Report Issues <br/>
              <span className="text-red-500">Securely.</span>
            </h2>
            <p className="text-red-200/70 text-sm leading-relaxed mb-6">
              Raise your voice against corruption, broken roads, or electricity issues. Your identity is protected.
            </p>
          </div>
          
          {/* Instructions */}
          <div className="bg-black/30 p-4 rounded-xl border border-red-500/10">
             <h4 className="text-red-400 font-bold text-xs mb-2 uppercase">Important</h4>
             <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                <li>Remember your 6-Digit PIN.</li>
                <li>Upload clear photos for proof.</li>
                <li>Track status using your PIN later.</li>
             </ul>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-3/5 p-8 md:p-12 bg-zinc-900/60 overflow-y-auto max-h-[90vh]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={24} /> New Complaint
            </h2>
            <span className="text-xs font-mono text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20 animate-pulse">LIVE</span>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Category & Key */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Category</label>
                  <div className="relative">
                    <List className="absolute left-3 top-3.5 text-gray-500" size={16} />
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 text-gray-300 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-red-500 appearance-none text-sm transition-colors hover:bg-black/60"
                    >
                      <option>Electricity</option>
                      <option>Water</option>
                      <option>Roads</option>
                      <option>Sanitation</option>
                      <option>Corruption</option>
                      <option>Education</option>
                      <option>Health</option>
                      <option>Other</option>
                    </select>
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Create PIN (6-Digits)</label>
                  <div className="relative group">
                    <Key className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-red-500" size={16} />
                    <input 
                      type="password" 
                      inputMode="numeric"
                      name="ComplaintUserKey" 
                      value={formData.ComplaintUserKey} 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val) && val.length <= 6) handleChange(e);
                      }}
                      placeholder="e.g. 123456" 
                      className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-red-500 font-mono tracking-widest text-sm transition-colors hover:bg-black/60" 
                      required 
                    />
                  </div>
               </div>
            </div>

            {/* Location & Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Location</label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-red-500" size={16} />
                  <input 
                    type="text" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    placeholder="Ward No, Area..." 
                    className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-red-500 text-sm transition-colors hover:bg-black/60" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Subject</label>
                  <div className="relative group">
                    <FileText className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-red-500" size={16} />
                    <input 
                      type="text" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleChange} 
                      placeholder="Brief Subject..." 
                      className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-red-500 text-sm transition-colors hover:bg-black/60" 
                      required 
                    />
                  </div>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Description</label>
              <div className="relative group">
                <MessageCircle className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-red-500" size={16} />
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  rows="3" 
                  placeholder="Describe details of the issue..." 
                  className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:border-red-500 resize-none text-sm transition-colors hover:bg-black/60" 
                  required
                ></textarea>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-1.5">
               <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Photo Proof (Optional)</label>
               <div className="relative border border-dashed border-gray-600 rounded-xl p-4 text-center hover:bg-white/5 transition-colors cursor-pointer bg-black/20">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  />
                  {preview ? (
                     <div className="relative h-24 w-full flex items-center justify-center">
                        <img src={preview} alt="Preview" className="h-full rounded-md object-contain shadow-lg" />
                        <button 
                          onClick={removeImage} 
                          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 rounded-full p-1 transition-colors z-20"
                        >
                          <X size={12} className="text-white"/>
                        </button>
                     </div>
                  ) : (
                     <div className="flex flex-col items-center gap-2 text-gray-500">
                        <Camera size={20} />
                        <span className="text-xs">Click or Drag to upload image</span>
                     </div>
                  )}
               </div>
            </div>

            {/* Submit Button */}
            <motion.button 
              whileHover={{ scale: 1.01 }} 
              whileTap={{ scale: 0.99 }} 
              disabled={loading} 
              className={`w-full py-4 rounded-xl font-bold text-white shadow-xl flex items-center justify-center gap-2 transition-all mt-4 
                ${loading ? "bg-zinc-800 cursor-not-allowed" : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-red-900/30"}`}
            >
              {loading ? <Loader2 className="animate-spin" /> : <>FILE COMPLAINT <Send size={18} /></>}
            </motion.button>

            <div className="text-center pt-2">
               <p className="text-gray-500 text-xs">
                 Already filed? <Link to="/complaint/user/login" className="text-red-400 font-bold hover:text-red-300 hover:underline">Track Status</Link>
               </p>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ComplaintUserRegister;