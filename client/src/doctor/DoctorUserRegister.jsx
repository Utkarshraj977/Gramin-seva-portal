import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  MapPin, Key, MessageSquare, ChevronLeft, 
  Loader2, Activity, Calendar, HeartPulse 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { patient } from "../services/api"; // ✅ Import Service

export default function DoctorUserRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // State matching Patient Schema
  const [form, setForm] = useState({
    Age: "",
    Sex: "",
    message: "",
    location: "",
    PatientKey: "", // 6 Digit PIN
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.PatientKey.length !== 6) {
      toast.error("Patient Key (PIN) must be exactly 6 digits.");
      return;
    }
    if (!form.Sex) {
        toast.error("Please select gender.");
        return;
    }

    const payload = {
        ...form,
        isPatient: true 
    };

    try {
      setLoading(true);
      // ✅ Use Service: patient.register()
      await patient.register(payload);

      toast.success("Patient Registration Successful!");
      navigate("/doctor/userlogin"); // Changed to specific login route

    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Registration Failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <Toaster position="top-center" />
      
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[650px] animate-fade-in-up">
        
        {/* --- LEFT SIDE --- */}
        <div className="lg:w-5/12 relative bg-blue-900 hidden lg:flex flex-col justify-between p-12">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1932&auto=format&fit=crop')" }} 
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-900/60 to-transparent"></div>

          <div className="relative z-10">
            <Link to="/profile" className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-8">
              <ChevronLeft size={18} /> Back to Home
            </Link>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">Patient Portal <br/> Registration</h1>
            <p className="text-blue-100 text-lg opacity-90">Create your secure health profile to connect with doctors.</p>
          </div>

          <div className="relative z-10">
              <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                <div className="p-3 bg-blue-500 rounded-lg text-white"><HeartPulse size={24}/></div>
                <div><h3 className="text-white font-bold">Secure Health Records</h3><p className="text-blue-200 text-xs">Your privacy is our priority</p></div>
              </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: FORM --- */}
        <div className="lg:w-7/12 p-8 md:p-12 overflow-y-auto">
          <div className="max-w-xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
                <Activity size={14} /> New Patient
              </div>
              <h2 className="text-3xl font-bold text-slate-800">Create Patient Profile</h2>
              <p className="text-slate-500 mt-2">Fill in your details to get started.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* --- SECTION 1: PERSONAL DETAILS --- */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Age</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    <input type="number" name="Age" placeholder="e.g. 25" onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Gender</label>
                  <select name="Sex" onChange={handleChange} className="w-full pl-3 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition" required>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Current Location</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3.5 text-slate-400" />
                  <input type="text" name="location" placeholder="Village / City Name" onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Medical Issue / Message</label>
                <div className="relative">
                  <MessageSquare size={18} className="absolute left-3 top-3.5 text-slate-400" />
                  <textarea name="message" rows="3" placeholder="Describe your health issue briefly..." onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition resize-none" required></textarea>
                </div>
              </div>

              {/* --- SECTION 2: SECURITY --- */}
              <div className="pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Set Patient Key (PIN)</label>
                  <div className="relative">
                    <Key size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    <input type="password" name="PatientKey" placeholder="6 Digit PIN" maxLength={6} onChange={(e) => { if (/^\d*$/.test(e.target.value)) handleChange(e); }} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none tracking-widest font-bold transition" required />
                  </div>
                  <p className="text-xs text-slate-400">This 6-digit PIN will be used to access your reports securely.</p>
                </div>
              </div>

              <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
                {loading ? <Loader2 className="animate-spin" /> : "Register Patient"}
              </button>
              
              <div className="text-center mt-4">
                 <Link to={'/doctor/userlogin'} className="text-sm text-blue-600 hover:underline">Already have an account? Login</Link>
              </div>

            </form>
          </div>
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
}