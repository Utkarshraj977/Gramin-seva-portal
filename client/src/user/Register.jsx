import { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  User, Mail, Lock, Phone, CreditCard, Camera, Image as ImageIcon, 
  ArrowRight, Loader2, CheckCircle2 
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [formData, setFormData] = useState({
    email: "", username: "", password: "", fullName: "", 
    phone: "", avatar: null, coverImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Phone validation (numbers only)
    if (name === "phone") {
        if (!/^\d*$/.test(value) || value.length > 10) return;
    }

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic Client Validation
    if (formData.phone.length !== 10) {
        setError("Phone number must be exactly 10 digits");
        setLoading(false);
        return;
    }
    if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));

      // Ideally use env variable: import.meta.env.VITE_API_URL
      await axios.post("http://localhost:8000/api/v1/users/register", data);
      
      alert("Registration Successful!");
      navigate("/login");

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4 md:p-8 font-sans">
      
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up border border-white/50">
        
        {/* HEADER */}
        <div className="bg-emerald-900 px-8 py-10 text-center relative overflow-hidden">
           {/* Decorative circles */}
           <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-10 -translate-y-10"></div>
           <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-10 translate-y-10"></div>
           
           <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 relative z-10">
             Create Account
           </h1>
           <p className="text-emerald-200 text-sm md:text-base relative z-10">
             Join Gramin Seva Portal today
           </p>
        </div>

        {/* FORM CONTAINER */}
        <div className="p-8 md:p-10">
          
          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">
            
            {/* SECTION 1: PERSONAL DETAILS */}
            <div className="space-y-4">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Personal Details</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                     <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                     <div className="relative">
                        <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input 
                           type="text" name="fullName" placeholder="Rahul Kumar"
                           value={formData.fullName} onChange={handleChange} required
                           className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all hover:bg-white"
                        />
                     </div>
                  </div>

                  <div className="space-y-1">
                     <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
                     <div className="relative">
                        <CreditCard className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input 
                           type="text" name="username" placeholder="user_123"
                           value={formData.username} onChange={handleChange} required
                           className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all hover:bg-white"
                        />
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                     <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
                     <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input 
                           type="email" name="email" placeholder="rahul@mail.com"
                           value={formData.email} onChange={handleChange} required
                           className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all hover:bg-white"
                        />
                     </div>
                  </div>

                  <div className="space-y-1">
                     <label className="text-sm font-semibold text-gray-700 ml-1">Phone</label>
                     <div className="relative">
                        <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input 
                           type="text" name="phone" placeholder="9876543210"
                           value={formData.phone} onChange={handleChange} required
                           className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all hover:bg-white"
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* SECTION 2: SECURITY */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Security</h3>
               <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                  <div className="relative">
                     <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                     <input 
                        type="password" name="password" placeholder="••••••••"
                        value={formData.password} onChange={handleChange} required
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all hover:bg-white"
                     />
                  </div>
                  <p className="text-xs text-gray-400 ml-1 mt-1">Must be at least 6 characters long.</p>
               </div>
            </div>

            {/* SECTION 3: UPLOADS */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Profile Setup</h3>
               
               <div className="grid grid-cols-2 gap-4">
                  {/* Avatar Upload */}
                  <label className={`cursor-pointer border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${formData.avatar ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'}`}>
                     <input type="file" name="avatar" className="hidden" onChange={handleChange} accept="image/*" required />
                     {formData.avatar ? (
                        <>
                           <CheckCircle2 className="text-emerald-600 mb-2" size={24} />
                           <span className="text-xs font-semibold text-emerald-800 truncate max-w-[100px]">{formData.avatar.name}</span>
                        </>
                     ) : (
                        <>
                           <Camera className="text-gray-400 mb-2" size={24} />
                           <span className="text-xs font-medium text-gray-600">Upload Photo</span>
                        </>
                     )}
                  </label>

                  {/* Cover Upload */}
                  <label className={`cursor-pointer border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${formData.coverImage ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'}`}>
                     <input type="file" name="coverImage" className="hidden" onChange={handleChange} accept="image/*" required />
                     {formData.coverImage ? (
                        <>
                           <CheckCircle2 className="text-emerald-600 mb-2" size={24} />
                           <span className="text-xs font-semibold text-emerald-800 truncate max-w-[100px]">{formData.coverImage.name}</span>
                        </>
                     ) : (
                        <>
                           <ImageIcon className="text-gray-400 mb-2" size={24} />
                           <span className="text-xs font-medium text-gray-600">Cover Image</span>
                        </>
                     )}
                  </label>
               </div>
            </div>

            {/* SUBMIT */}
            <button
               type="submit"
               disabled={loading}
               className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-emerald-900/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
               {loading ? <Loader2 className="animate-spin" size={20} /> : <>Register Now <ArrowRight size={20} /></>}
            </button>

          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account? 
            <NavLink to="/login" className="ml-1 text-emerald-700 font-bold hover:underline">
              Log in here
            </NavLink>
          </p>

        </div>
      </div>

      <style>{`
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Register;