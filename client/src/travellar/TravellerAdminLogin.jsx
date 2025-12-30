import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Bus, ShieldCheck, Lock, ChevronLeft, Loader2 } from "lucide-react";

export default function TravellerAdminLogin() {
  const [TravellingAdminKey, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      // Ideally, use import.meta.env.VITE_API_URL here
      const res = await fetch(
        "http://localhost:8000/api/v1/traveller/traveladminlogin",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ TravellingAdminKey }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Success Logic
      alert("Traveller Admin Login Successful");
      console.log("Traveller Admin:", data.data.travellerAdmin);
      
      // Store token or user data if needed here
      // localStorage.setItem("travellerAdmin", JSON.stringify(data.data));
      
      navigate("/dashboard");
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-fade-in-up">
        
        {/* --- LEFT SIDE: IMAGE & BRANDING --- */}
        <div className="relative md:w-1/2 bg-slate-900 hidden md:flex flex-col justify-end p-12">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2072&auto=format&fit=crop')" }} // Bus/Transport Image
          ></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 via-emerald-900/40 to-transparent"></div>

          {/* Content */}
          <div className="relative z-10 text-white">
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-sm">
              <ShieldCheck size={16} className="text-emerald-300" />
              <span className="text-xs font-semibold tracking-wide uppercase text-emerald-100">Official Admin Portal</span>
            </div>
            <h1 className="text-4xl font-extrabold mb-4 leading-tight">
              Gramin <br/> Transport Seva
            </h1>
            <p className="text-emerald-100 opacity-90 text-lg">
              Manage routes, buses, and traveller queries efficiently.
            </p>
          </div>
        </div>

        {/* --- RIGHT SIDE: LOGIN FORM --- */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          
          {/* Back Link */}
          <NavLink to="/" className="absolute top-8 left-8 text-slate-400 hover:text-emerald-600 transition flex items-center gap-1 text-sm font-medium">
            <ChevronLeft size={16} /> Back to Home
          </NavLink>

          <div className="max-w-md mx-auto w-full">
            
            {/* Header Icon */}
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 shadow-sm border border-emerald-100">
              <Bus size={32} />
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mb-2">Admin Login</h2>
            <p className="text-slate-500 mb-8">
              Enter your unique <span className="font-semibold text-slate-700">6-Digit Admin Key</span> to access the dashboard.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Access Key / PIN
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="• • • • • •"
                    value={TravellingAdminKey}
                    maxLength={6}
                    onChange={(e) => setKey(e.target.value)}
                    required
                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-center text-2xl tracking-[0.5em] font-bold"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Verifying...
                  </>
                ) : (
                  "Access Dashboard"
                )}
              </button>

              <div className="text-center pt-4">
                 <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">
                    <Lock size={12} />
                    <span>256-bit Secure Connection</span>
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