import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, Lock, ShieldCheck, ChevronLeft, 
  HeartPulse, Loader2, AlertCircle 
} from "lucide-react";

export default function DoctorUserLogin() {
  const [Patientkey, setPatientKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // API Call
      const res = await axios.post(
        "http://localhost:8000/api/v1/patient/patientlogin",
        { Patientkey },
        {
          withCredentials: true, // Important: Sends cookies
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 200) {
        alert("Login Successful! Accessing Health Records...");
        // Redirect to Patient Dashboard (or Home for now)
        navigate("/doctor/userdashboard"); 
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid Patient Key. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-fade-in-up">
        
        {/* --- LEFT SIDE: PATIENT BRANDING --- */}
        <div className="relative md:w-1/2 bg-blue-900 hidden md:flex flex-col justify-end p-12">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop')" }} 
          ></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-900/40 to-transparent"></div>

          {/* Content */}
          <div className="relative z-10 text-white">
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm">
              <HeartPulse size={16} className="text-blue-300" />
              <span className="text-xs font-semibold tracking-wide uppercase text-blue-100">Patient Portal</span>
            </div>
            <h1 className="text-4xl font-extrabold mb-4 leading-tight">
              My Health <br/> Dashboard
            </h1>
            <p className="text-blue-100 opacity-90 text-lg">
              Securely access your prescriptions, history, and doctor appointments.
            </p>
          </div>
        </div>

        {/* --- RIGHT SIDE: LOGIN FORM --- */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          
          {/* Back Link */}
          <Link to="/profile" className="absolute top-8 left-8 text-slate-400 hover:text-blue-600 transition flex items-center gap-1 text-sm font-medium">
            <ChevronLeft size={16} /> Back to Home
          </Link>

          <div className="max-w-md mx-auto w-full">
            
            {/* Header Icon */}
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 shadow-sm border border-blue-100">
              <User size={32} />
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mb-2">Patient Login</h2>
            <p className="text-slate-500 mb-8">
              Enter your <span className="font-semibold text-slate-700">6-Digit Patient PIN</span> to continue.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 text-sm font-medium animate-pulse">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Access PIN
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={20} className="text-slate-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="• • • • • •"
                    value={Patientkey}
                    maxLength={6}
                    onChange={(e) => {
                      // Only allow numbers
                      const val = e.target.value;
                      if (/^\d*$/.test(val)) setPatientKey(val);
                    }}
                    required
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-3xl tracking-[0.5em] font-bold font-mono"
                  />
                </div>
              </div>

              <button
                disabled={loading || Patientkey.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Verifying...
                  </>
                ) : (
                  "Access Records"
                )}
              </button>

              <div className="text-center pt-6 border-t border-slate-100 mt-6">
                 <p className="text-slate-500 text-sm">
                   New Patient? <Link to="/doctor/userregister" className="text-blue-700 font-bold hover:underline">Create Profile</Link>
                 </p>
                 <div className="mt-4 inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">
                    <ShieldCheck size={12} />
                    <span>Private & Confidential</span>
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