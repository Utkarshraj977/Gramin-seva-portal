import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, KeyRound, Eye, EyeOff, ArrowLeft, Loader2, ShieldCheck, Cookie, LogIn } from "lucide-react";

export default function ChangePassword() {
  const navigate = useNavigate();
  
  // State management
  const [formData, setFormData] = useState({ oldPassword: "", newPassword: "" });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [hasSession, setHasSession] = useState(true);

  // Check for session/cookies on mount
  useState(() => {
    const localUser = localStorage.getItem("userData");
    const cookiesExist = document.cookie && document.cookie !== "";

    if (!localUser && !cookiesExist) {
      setHasSession(false);
    }
  }, []);

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
      const res = await fetch("http://localhost:8000/api/v1/users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Password change failed");
      }

      setStatus({ type: "success", message: "Password updated successfully! ✅" });
      setFormData({ oldPassword: "", newPassword: "" });

    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      
      {/* Main Card */}
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
        
        {/* Left Side: Image Section */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-emerald-900">
          <img
            src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80"
            alt="Secure Village"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 to-transparent flex flex-col justify-end p-8 text-white">
            <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck className="text-white w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Secure Your Account</h2>
            <p className="text-emerald-100 text-sm opacity-90">
              Surakshit bhavishya ke liye, apna password samay-samay par badalte rahein.
            </p>
          </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          
          {hasSession ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Change Password</h1>
                <p className="text-gray-500 text-sm mt-1">Please enter your current password to set a new one.</p>
              </div>

              {/* Status Messages */}
              {status.message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 text-sm font-medium border ${
                  status.type === "error" 
                    ? "bg-red-50 text-red-700 border-red-200" 
                    : "bg-green-50 text-green-700 border-green-200"
                }`}>
                  {status.type === "error" ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Old Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <KeyRound size={18} />
                    </div>
                    <input
                      type={showOld ? "text" : "password"}
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleChange}
                      placeholder="Enter current password"
                      required
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOld(!showOld)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* New Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showNew ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Create new password (min 6 chars)"
                      required
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            </>
          ) : (
            // No Session State
            <div className="text-center py-8">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-600 mb-6 animate-pulse">
                  <Cookie size={32} />
               </div>
               
               <h2 className="text-2xl font-bold text-gray-800 mb-2">
                 Session Expired
               </h2>
               
               <p className="text-gray-500 mb-8 px-4">
                 You need to be logged in to change your password. Please login to continue.
               </p>

               <div className="space-y-3">
                 <button
                    onClick={() => navigate("/login")}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                 >
                    <LogIn size={20} /> Login Now
                 </button>
               </div>
            </div>
          )}

          {/* Go Back Link */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-700 font-medium transition-colors"
            >
              <ArrowLeft size={18} />
              Back
            </button>
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