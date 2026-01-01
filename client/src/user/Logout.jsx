import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cookie, AlertCircle, LogIn } from "lucide-react"; // Icons for better UI

export default function Logout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [hasSession, setHasSession] = useState(true);

  // 🔥 1. Check for Cookies or Session on Page Load
  useEffect(() => {
    // Check if LocalStorage has data OR if Cookies exist string is not empty
    const localUser = localStorage.getItem("userData");
    const cookiesExist = document.cookie && document.cookie !== "";

    // Agar dono gayab hain, to session nahi hai
    if (!localUser && !cookiesExist) {
      setHasSession(false);
    }
  }, []);

  const handleLogout = async () => {
    const confirmLogout = window.confirm(
      "Kya aap sach me Gramin Seva Portal se logout karna chahte hain?"
    );

    if (!confirmLogout) return;

    setIsLoading(true);

    try {
      await fetch("http://localhost:8000/api/v1/users/logout", {
        method: "POST",
        credentials: "include", 
      });

      localStorage.removeItem("userData");
      
      setTimeout(() => {
        navigate("/");
      }, 500);
      
    } catch (err) {
      alert("Logout failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Image */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-emerald-900">
          <img
            src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80"
            alt="Village Landscape"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 to-transparent flex flex-col justify-end p-8">
            <h3 className="text-white text-2xl font-bold mb-1">Gramin Seva</h3>
            <p className="text-emerald-100 text-sm">Empowering Villages, Building India.</p>
          </div>
        </div>

        {/* Right Side: Logic Based Content */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          
          {/* 🔥 CONDITION: Agar Session/Cookies Hai Tabhi Logout Dikhao */}
          {hasSession ? (
            <>
              <div className="text-center md:text-left mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                </div>
                <h2 className="text-3xl font-extrabold text-gray-800 mb-3">
                  See You Soon!
                </h2>
                <p className="text-gray-500 leading-relaxed">
                  Aap <span className="font-semibold text-emerald-700">Gramin Seva Portal</span> se logout kar rahe hain. 
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className={`w-full py-3.5 px-4 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2
                    ${isLoading 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-red-600 hover:bg-red-700 hover:shadow-red-500/30 active:scale-95"
                    }`}
                >
                  {isLoading ? "Processing..." : "Yes, Secure Logout"}
                </button>

                <button
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel, Go Back
                </button>
              </div>
            </>
          ) : (
            // 🔥 CONDITION: Agar Cookies NAHI hain (No Session Message)
            <div className="text-center">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-600 mb-6 animate-pulse">
                  <Cookie size={32} />
               </div>
               
               <h2 className="text-2xl font-bold text-gray-800 mb-2">
                 No Active Session
               </h2>
               
               <p className="text-gray-500 mb-8 px-4">
                 Aapke browser me koi active <b>Cookies</b> ya <b>Session</b> nahi mila. Aap pehle se logout hain.
               </p>

               <div className="space-y-3">
                 <button
                    onClick={() => navigate("/login")}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                 >
                    <LogIn size={20} /> Login Now
                 </button>
                 
                 <button
                    onClick={() => navigate("/")}
                    className="w-full py-3.5 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
                 >
                    Go to Home
                 </button>
               </div>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-center md:justify-start gap-2 text-sm text-gray-400">
            <span>🌿 Digital India Initiative</span>
          </div>
          
        </div>
      </div>
    </div>
  );
}