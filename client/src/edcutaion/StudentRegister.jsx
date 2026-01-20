import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, MapPin, Key, MessageCircle, Layers, Award, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { student } from "../services/api"; // ✅ Import Service

const StudentRegister = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clas: "",
    subject: "",
    board: "", 
    location: "",
    massage: "", 
    StudentKey: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!/^\d{6}$/.test(formData.StudentKey)) {
        toast.error("Student Key must be 6 digits");
        setLoading(false);
        return;
    }

    try {
      // ✅ Use student service
      const response = await student.register_profile(formData);

      if (response) {
        toast.success("Student Profile Created!");
        setTimeout(() => {
          navigate("/education/user/login");
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
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative p-4">
      {/* Vibrant Overlay */}
      <div className="absolute inset-0 bg-orange-900/40 backdrop-blur-sm mix-blend-multiply"></div>
      <div className="absolute inset-0 bg-black/40"></div>
      <Toaster position="top-center" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-5xl bg-white/95 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Side: Visuals */}
        <div className="md:w-2/5 bg-gradient-to-br from-orange-500 to-pink-600 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl"></div>
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-10 h-10 text-white" />
              <h1 className="text-3xl font-bold tracking-tight">STUDENT HUB</h1>
            </div>
            <p className="text-orange-50 text-lg font-medium leading-relaxed">
              "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."
            </p>
          </div>

          <div className="space-y-4 mt-8">
             <div className="flex items-center gap-3 bg-white/20 p-3 rounded-xl backdrop-blur-md">
                <Layers className="text-white" size={20}/>
                <div>
                    <h3 className="font-bold text-sm">Class & Board</h3>
                    <p className="text-xs text-orange-100">Customized curriculum tracking</p>
                </div>
             </div>
             <div className="flex items-center gap-3 bg-white/20 p-3 rounded-xl backdrop-blur-md">
                <Key className="text-white" size={20}/>
                <div>
                    <h3 className="font-bold text-sm">Secure Access</h3>
                    <p className="text-xs text-orange-100">Personalized Student Key</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-3/5 p-8 md:p-12 bg-white text-gray-800">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Create Profile</h2>
          <p className="text-gray-500 text-sm mb-6">Enter your academic details to get started.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Class & Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 ml-1">Class / Grade</label>
                <div className="relative group">
                  <Layers className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-orange-500" size={18} />
                  <input type="text" name="clas" value={formData.clas} onChange={handleChange} placeholder="e.g. 10th, 12th" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 ml-1">Board</label>
                <div className="relative group">
                  <Award className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-orange-500" size={18} />
                  <input type="text" name="board" value={formData.board} onChange={handleChange} placeholder="e.g. CBSE, ICSE" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" required />
                </div>
              </div>
            </div>

            {/* Subject & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 ml-1">Subject Stream</label>
                <div className="relative group">
                  <BookOpen className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-orange-500" size={18} />
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="e.g. Science, Arts" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 ml-1">Location</label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-orange-500" size={18} />
                  <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City, Area" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" required />
                </div>
              </div>
            </div>

            {/* Student Key */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 ml-1">Student Access Key</label>
              <div className="relative group">
                <Key className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-orange-500" size={18} />
                <input type="text" name="StudentKey" value={formData.StudentKey} onChange={(e) => { if (/^\d*$/.test(e.target.value) && e.target.value.length <= 6) handleChange(e); }} placeholder="Create 6-digit PIN" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-mono tracking-wider" required />
              </div>
            </div>

            {/* Message/Goal */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 ml-1">Study Goal / Message</label>
              <div className="relative group">
                <MessageCircle className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-orange-500" size={18} />
                <textarea name="massage" value={formData.massage} onChange={handleChange} rows="2" placeholder="What are your learning goals?" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none" required></textarea>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading} className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all mt-4 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"}`}>
              {loading ? "Creating..." : <>Complete Registration <ArrowRight size={18} /></>}
            </motion.button>

            <div className="text-center pt-2">
               <Link to="/education/user/login" className="text-gray-500 hover:text-orange-600 text-sm font-semibold transition-colors">Already registered? Login here</Link>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentRegister;