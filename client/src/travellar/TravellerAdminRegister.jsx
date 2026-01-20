import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Car, MapPin, Key, CreditCard, UploadCloud, 
  Bus, ShieldCheck, ChevronLeft, Loader2, FileText 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast"; // ✅ Added Toast
import { travellerAdmin } from "../services/api"; // ✅ Import Service

export default function TravellerAdminRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
    carNumber: "",
    category: "",
    TravellingAdminKey: "",
    location: "",
    Type: "",
  });

  // File State
  const [carPhoto, setCarPhoto] = useState(null);
  const [license, setLicense] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare FormData
    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    if (carPhoto) data.append("CarPhoto", carPhoto);
    if (license) data.append("Driver_License", license);

    try {
      setLoading(true);
      
      // ✅ Use travellerAdmin service
      // Axios instance automatically sets Content-Type to multipart/form-data
      await travellerAdmin.register(data);

      toast.success("Registration Successful! Please Login.");
      
      setTimeout(() => {
        navigate("/traveller/login"); 
      }, 2000);
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed. Try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <Toaster position="top-right" />
      
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[700px] animate-fade-in-up">
        
        {/* --- LEFT SIDE: VISUALS --- */}
        <div className="lg:w-5/12 relative bg-slate-900 hidden lg:flex flex-col justify-between p-12">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop')" }} 
          ></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 via-emerald-900/60 to-transparent"></div>

          {/* Top Content */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-emerald-200 hover:text-white transition-colors mb-8">
              <ChevronLeft size={18} /> Back to Home
            </Link>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Join Gramin <br/> Transport Network
            </h1>
            <p className="text-emerald-100 text-lg opacity-90">
              Register your vehicle to help villagers travel safely and earn efficiently.
            </p>
          </div>

          {/* Bottom Stats/Info */}
          <div className="relative z-10 grid gap-4">
             <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                <div className="p-3 bg-emerald-500 rounded-lg text-white"><Bus size={24}/></div>
                <div>
                   <h3 className="text-white font-bold">Verified Partners</h3>
                   <p className="text-emerald-200 text-xs">Join 500+ registered vehicles</p>
                </div>
             </div>
             <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                <div className="p-3 bg-amber-500 rounded-lg text-white"><ShieldCheck size={24}/></div>
                <div>
                   <h3 className="text-white font-bold">Secure Income</h3>
                   <p className="text-emerald-200 text-xs">Direct payments, no middlemen</p>
                </div>
             </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: REGISTRATION FORM --- */}
        <div className="lg:w-7/12 p-8 md:p-12 overflow-y-auto">
          
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800">Register Vehicle</h2>
              <p className="text-slate-500 mt-2">
                Create your admin account to manage rides and bookings.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* --- SECTION 1: VEHICLE DETAILS --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Car Number */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Vehicle Number</label>
                  <div className="relative">
                    <CreditCard size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      name="carNumber"
                      placeholder="UP32 AB 1234"
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Category</label>
                  <div className="relative">
                    <Car size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    <select
                      name="category"
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Auto Rickshaw">Auto Rickshaw</option>
                      <option value="E-Rickshaw">E-Rickshaw</option>
                      <option value="Taxi Car">Taxi Car (Sedan/SUV)</option>
                      <option value="Jeep">Jeep / Commander</option>
                      <option value="Bus">Mini Bus / Bus</option>
                      <option value="Tractor">Tractor Trolley</option>
                    </select>
                  </div>
                </div>

                {/* Admin Key */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Set Admin Key (PIN)</label>
                  <div className="relative">
                    <Key size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="password"
                      name="TravellingAdminKey"
                      placeholder="6 Digit PIN"
                      maxLength={6}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none tracking-widest"
                      required
                    />
                  </div>
                </div>

                {/* Service Type */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Service Type</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    <select
                      name="Type"
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                      required
                    >
                      <option value="">Select Range</option>
                      <option value="Local">Local (Within Village/Block)</option>
                      <option value="Outstation">Outstation (City to City)</option>
                      <option value="Emergency">Emergency (24x7 Ambulance)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location (Full Width) */}
              <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Base Location (Village/Stand)</label>
                  <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        name="location"
                        placeholder="e.g. Rampur Bus Stand, Block-B"
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        required
                      />
                  </div>
              </div>

              {/* --- SECTION 2: DOCUMENTS --- */}
              <div className="pt-4 pb-2 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Document Verification</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Car Photo Upload */}
                  <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${carPhoto ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'}`}>
                    <label className="cursor-pointer w-full h-full flex flex-col items-center">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => setCarPhoto(e.target.files[0])} />
                      {carPhoto ? (
                        <>
                          <CheckIcon />
                          <span className="text-sm font-semibold text-emerald-700 mt-2 truncate max-w-[150px]">{carPhoto.name}</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud size={32} className="text-slate-400 mb-2" />
                          <span className="text-sm font-medium text-slate-600">Upload Vehicle Photo</span>
                          <span className="text-xs text-slate-400 mt-1">JPG/PNG only</span>
                        </>
                      )}
                    </label>
                  </div>

                  {/* License Upload */}
                  <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${license ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'}`}>
                    <label className="cursor-pointer w-full h-full flex flex-col items-center">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => setLicense(e.target.files[0])} />
                      {license ? (
                          <>
                            <CheckIcon />
                            <span className="text-sm font-semibold text-emerald-700 mt-2 truncate max-w-[150px]">{license.name}</span>
                          </>
                      ) : (
                        <>
                          <FileText size={32} className="text-slate-400 mb-2" />
                          <span className="text-sm font-medium text-slate-600">Upload Driver License</span>
                          <span className="text-xs text-slate-400 mt-1">Optional</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Register & Create Admin"}
              </button>

              <p className="text-center text-slate-500 text-sm">
                Already registered? <Link to="/traveller/login" className="text-emerald-600 font-bold hover:underline">Login here</Link>
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

// Small helper icon for success state
function CheckIcon() {
  return (
    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-1">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
    </div>
  )
}