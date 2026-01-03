import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { 
  Stethoscope, MapPin, Clock, Key, UploadCloud, 
  FileBadge, Activity, ChevronLeft, Loader2, CheckCircle2 
} from "lucide-react";

export default function DoctorAdminRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Form State matching Schema
  const [form, setForm] = useState({
    Experience: "",
    Type: "", // Human, Animal, Both
    category: "", // Gen Physician, Dentist, etc.
    Start_time: "",
    End_time: "",
    DoctorKey: "", // 6 Digit Pin
    location: "",
  });

  const [certificate, setCertificate] = useState(null);

  // Handle Text Inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation for Key
    if (form.DoctorKey.length !== 6) {
      alert("Doctor Key must be exactly 6 digits");
      return;
    }

    const data = new FormData();
    // Append text fields
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    
    // Append required Schema fields
    data.append("isDoctor", "true"); // Setting isDoctor to true
    if (certificate) data.append("Doctor_certificate", certificate);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/doctor/doctorregister",
        data,
        {
          withCredentials: true, // Important: Sends cookies so backend gets userInfo
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data) {
        alert("Registration Successful! Please Login.");
        navigate("/doctor/login"); // Redirect to doctor login
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[700px] animate-fade-in-up">
        
        {/* --- LEFT SIDE: MEDICAL VISUALS --- */}
        <div className="lg:w-5/12 relative bg-teal-900 hidden lg:flex flex-col justify-between p-12">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop')" }} // Doctor/Stethoscope
          ></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900 via-teal-900/60 to-transparent"></div>

          {/* Top Content */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-teal-200 hover:text-white transition-colors mb-8">
              <ChevronLeft size={18} /> Back to Home
            </Link>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Join Swasthya <br/> Seva Network
            </h1>
            <p className="text-teal-100 text-lg opacity-90">
              Register your clinic to provide verified medical services to villagers.
            </p>
          </div>

          {/* Bottom Stats */}
          <div className="relative z-10 grid gap-4">
             <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                <div className="p-3 bg-teal-500 rounded-lg text-white"><Activity size={24}/></div>
                <div>
                   <h3 className="text-white font-bold">Verified Doctors</h3>
                   <p className="text-teal-200 text-xs">Join the trusted network</p>
                </div>
             </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: FORM --- */}
        <div className="lg:w-7/12 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
          
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800">Doctor Registration</h2>
              <p className="text-slate-500 mt-2">
                Create your admin profile to manage patients and appointments.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* --- SECTION 1: PROFESSIONAL INFO --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Category (Specialization) */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Category / Specialist</label>
                  <div className="relative">
                    <Stethoscope size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      name="category"
                      placeholder="e.g. General Physician, Dentist"
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Experience (Years)</label>
                  <div className="relative">
                    <FileBadge size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      name="Experience"
                      placeholder="e.g. 5 Years"
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Type (Human/Animal) */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Patient Type</label>
                  <div className="relative">
                    <Activity size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    <select
                      name="Type"
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none appearance-none"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Human">Human Specialist</option>
                      <option value="Animal">Veterinary (Animal)</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Clinic Location</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      name="location"
                      placeholder="Village, Block, District"
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* --- SECTION 2: TIMINGS --- */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Start Time</label>
                  <div className="relative">
                    <Clock size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="time"
                      name="Start_time"
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">End Time</label>
                  <div className="relative">
                    <Clock size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="time"
                      name="End_time"
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* --- SECTION 3: SECURITY & PROOF --- */}
              <div className="pt-4 pb-2 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Security & Verification</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Doctor Key */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Set Admin Key (PIN)</label>
                    <div className="relative">
                      <Key size={18} className="absolute left-3 top-3.5 text-slate-400" />
                      <input
                        type="password"
                        name="DoctorKey"
                        placeholder="6 Digit PIN"
                        maxLength={6}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none tracking-widest font-bold"
                        required
                      />
                    </div>
                    <p className="text-xs text-slate-400">Used for Admin Login (keep safe)</p>
                  </div>

                  {/* Certificate Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">Upload Certificate</label>
                    <label className={`cursor-pointer border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all h-[52px] ${certificate ? 'border-teal-500 bg-teal-50' : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50'}`}>
                      <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => setCertificate(e.target.files[0])} required />
                      {certificate ? (
                        <div className="flex items-center gap-2">
                           <CheckCircle2 size={18} className="text-teal-600" />
                           <span className="text-sm font-semibold text-teal-800 truncate max-w-[120px]">{certificate.name}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-500">
                          <UploadCloud size={18} />
                          <span className="text-sm">Click to Upload</span>
                        </div>
                      )}
                    </label>
                  </div>

                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                disabled={loading}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-900/20 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Register Clinic & Admin"}
              </button>

              <p className="text-center text-slate-500 text-sm">
                Already registered? <Link to="/doctor/login" className="text-teal-700 font-bold hover:underline">Login here</Link>
              </p>

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