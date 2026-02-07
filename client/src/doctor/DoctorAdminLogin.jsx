import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Stethoscope, Lock, ShieldCheck, ChevronLeft, 
  Activity, Loader2, AlertCircle 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast"; // ✅ Added Toast
import { doctor } from "../services/api"; // ✅ Import Service

export default function DoctorAdminLogin() {
  const [DoctorKey, setDoctorKey] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Use Service: doctor.login()
      // Pass as object { DoctorKey } to match req.body
     
      const res = await doctor.login({ DoctorKey });

      toast.success("Login Successful! Welcome Doctor.");
      // Redirect to Doctor Dashboard
      setTimeout(() => {
          navigate("/doctor/admindashboard");
      }, 1000);

    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Invalid Doctor Key. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <Toaster position="top-center" />
      
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-fade-in-up">
        
        {/* --- LEFT SIDE: MEDICAL BRANDING --- */}
        <div className="relative md:w-1/2 bg-teal-900 hidden md:flex flex-col justify-end p-12">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop')" }} 
          ></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900 via-teal-900/40 to-transparent"></div>

          {/* Content */}
          <div className="relative z-10 text-white">
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 backdrop-blur-sm">
              <Activity size={16} className="text-teal-300" />
              <span className="text-xs font-semibold tracking-wide uppercase text-teal-100">Secure Medical Portal</span>
            </div>
            <h1 className="text-4xl font-extrabold mb-4 leading-tight">
              Swasthya Seva <br/> Admin Panel
            </h1>
            <p className="text-teal-100 opacity-90 text-lg">
              Secure access for verified doctors and clinic administrators.
            </p>
          </div>
        </div>

        {/* --- RIGHT SIDE: LOGIN FORM --- */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          
          {/* Back Link */}
          <Link to="/" className="absolute top-8 left-8 text-slate-400 hover:text-teal-600 transition flex items-center gap-1 text-sm font-medium">
            <ChevronLeft size={16} /> Back to Home
          </Link>

          <div className="max-w-md mx-auto w-full">
            
            {/* Header Icon */}
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 text-teal-600 shadow-sm border border-teal-100">
              <Stethoscope size={32} />
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mb-2">Doctor Login</h2>
            <p className="text-slate-500 mb-8">
              Please enter your unique <span className="font-semibold text-slate-700">6-Digit Doctor Key</span> to access patient records.
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Secure Access PIN
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={20} className="text-slate-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="• • • • • •"
                    value={DoctorKey}
                    maxLength={6}
                    onChange={(e) => {
                      // Only allow numbers
                      const val = e.target.value;
                      if (/^\d*$/.test(val)) setDoctorKey(val);
                    }}
                    required
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-center text-3xl tracking-[0.5em] font-bold font-mono"
                  />
                </div>
              </div>

              <button
                disabled={loading || DoctorKey.length !== 6}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-900/20 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Verifying Credentials...
                  </>
                ) : (
                  "Access Dashboard"
                )}
              </button>

              <div className="text-center pt-6 border-t border-slate-100 mt-6">
                  <p className="text-slate-500 text-sm">
                    Don't have an ID? <Link to="/doctor/register" className="text-teal-700 font-bold hover:underline">Register Clinic</Link>
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">
                    <ShieldCheck size={12} />
                    <span>HIPAA Compliant Security</span>
                  </div>
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