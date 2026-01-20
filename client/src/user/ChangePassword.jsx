import { useState } from "react";
import { useNavigate } from "react-router-dom";
// ✅ अब हम 'user' को import करेंगे, 'api' को नहीं
import { user } from "../services/api"; 
import { Lock, KeyRound, Eye, EyeOff, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

export default function ChangePassword() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ oldPassword: "", newPassword: "" });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (formData.newPassword.length < 6) {
      setStatus({ type: "error", message: "New password must be at least 6 characters" });
      return;
    }

    try {
      setLoading(true);

      const response = await user.change_password(formData);

      setStatus({ type: "success", message: "Password updated successfully! ✅" });
      setFormData({ oldPassword: "", newPassword: "" });

    } catch (err) {
      // Axios Error Handling
      const errorMessage = err.response?.data?.message || "Password change failed";
      
      setStatus({ type: "error", message: errorMessage });

      if (err.response?.status === 401) {
        setTimeout(() => navigate("/login"), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... बाकी का JSX कोड बिल्कुल सेम रहेगा ...
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
       {/* ... JSX Content ... */}
       {/* बस handleSubmit के अंदर का लॉजिक बदला है */}
       
       {/* Form same as before */}
       <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
           {/* ... Image Section ... */}
           <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-emerald-900">
               <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80" className="absolute inset-0 w-full h-full object-cover opacity-80" />
               <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 to-transparent flex flex-col justify-end p-8 text-white">
                   <h2 className="text-2xl font-bold mb-2">Secure Your Account</h2>
               </div>
           </div>

           {/* ... Form Section ... */}
           <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
               <h1 className="text-3xl font-bold text-gray-800 mb-8">Change Password</h1>
               
               {status.message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 text-sm font-medium border ${status.type === "error" ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}>
                  {status.message}
                </div>
               )}

               <form onSubmit={handleSubmit} className="space-y-5">
                   {/* Inputs for Old/New Password same as before */}
                   <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                       <div className="relative">
                            <input type={showOld ? "text" : "password"} name="oldPassword" value={formData.oldPassword} onChange={handleChange} required className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg" />
                            <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-3 text-gray-400">{showOld ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                       </div>
                   </div>

                   <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                       <div className="relative">
                            <input type={showNew ? "text" : "password"} name="newPassword" value={formData.newPassword} onChange={handleChange} required className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg" />
                            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-3 text-gray-400">{showNew ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                       </div>
                   </div>

                   <button type="submit" disabled={loading} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md flex justify-center items-center gap-2">
                       {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
                   </button>
               </form>

               <div className="mt-8 text-center">
                   <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-emerald-700 flex items-center justify-center gap-2 w-full"><ArrowLeft size={18} /> Back</button>
               </div>
           </div>
       </div>
    </div>
  );
}