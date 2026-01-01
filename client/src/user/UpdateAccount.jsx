import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, ArrowLeft, Save, Loader2, CheckCircle2, AlertCircle, ShieldAlert, LogIn } from "lucide-react";

export default function UpdateAccount() {
  const navigate = useNavigate();
  
  // States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hasSession, setHasSession] = useState(true); // 🔥 New State for Session Check

  // 🔥 Check Session on Load
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    
    // Agar user data nahi hai, to session false kar do
    if (!storedUser) {
      setHasSession(false);
    } else {
      // Agar data hai, to form me fill kar do
      const parsedUser = JSON.parse(storedUser);
      setFullName(parsedUser.fullName || "");
      setEmail(parsedUser.email || "");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!fullName || !email) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:8000/api/v1/users/update-account",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ fullName, email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      localStorage.setItem("userData", JSON.stringify(data.data));
      setMessage("Account details updated successfully ✅");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 font-sans">
      
      {/* Main Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
        
        {/* Left Side: Image & Branding */}
        <div className="relative w-full md:w-5/12 h-64 md:h-auto bg-slate-900">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000&auto=format&fit=crop"
            alt="Digital Village"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-10">
            <div className="mb-4">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase backdrop-blur-sm">
                Digital Identity
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
              Apni Pehchan, <br />
              <span className="text-emerald-400">Digital India</span> ke saath.
            </h2>
            <p className="text-gray-300 text-sm mt-2">
              Update your profile to keep your village services connected and secure.
            </p>
          </div>
        </div>

        {/* Right Side: Logic Based Content */}
        <div className="w-full md:w-7/12 p-8 md:p-12 relative bg-white flex flex-col justify-center">
          
          {/* 🔥 CONDITIONAL RENDERING STARTS HERE */}
          {hasSession ? (
            // ✅ IF SESSION EXISTS: SHOW FORM
            <>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
                  <p className="text-gray-500 text-sm mt-1">Manage your personal account details</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg border border-emerald-200">
                  {fullName ? fullName.charAt(0).toUpperCase() : "U"}
                </div>
              </div>

              {/* Feedback Messages */}
              <div className="space-y-4 mb-6">
                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm animate-pulse">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                  </div>
                )}
                {message && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl text-green-700 text-sm">
                    <CheckCircle2 size={20} />
                    <span>{message}</span>
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-xl text-white font-bold shadow-lg flex items-center justify-center gap-2 transition-all
                      ${loading ? "bg-emerald-400" : "bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5"}`}
                  >
                    {loading ? <><Loader2 className="animate-spin" size={18} /> Updating...</> : <><Save size={18} /> Save Changes</>}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full py-3.5 rounded-xl text-gray-500 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} /> Cancel & Go Back
                  </button>
                </div>
              </form>
            </>
          ) : (
            // 🚫 IF NO SESSION: SHOW ACCESS DENIED
            <div className="text-center py-10">
               <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-600 mb-6 animate-bounce">
                  <ShieldAlert size={40} />
               </div>
               
               <h2 className="text-3xl font-bold text-gray-800 mb-3">
                 Access Denied
               </h2>
               
               <p className="text-gray-500 mb-8 px-4 leading-relaxed">
                 Aap logged in nahi hain. Profile update karne ke liye kripya pehle login karein.
               </p>

               <div className="space-y-4 max-w-xs mx-auto">
                 <button
                    onClick={() => navigate("/login")}
                    className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
                 >
                    <LogIn size={20} /> Login Now
                 </button>
                 
                 <button
                    onClick={() => navigate("/")}
                    className="w-full py-3.5 px-6 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                 >
                    Go to Home
                 </button>
               </div>
            </div>
          )}
          {/* 🔥 CONDITIONAL RENDERING ENDS HERE */}

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
             <p className="text-xs text-gray-400 font-medium">Gramin Seva &copy; 2024 • Secured Profile System</p>
          </div>

        </div>
      </div>

      <style>{`
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}