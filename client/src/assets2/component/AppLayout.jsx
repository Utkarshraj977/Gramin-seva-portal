import { useEffect, useState } from "react";
import { Outlet, useNavigation, useNavigate } from "react-router-dom";
import UserHeader from "./Header";
import { UserFooter } from "./Footer/Footer";
import { Loader2, ShieldAlert, LogIn, LockKeyhole } from "lucide-react";

/* 🔵 1. Modern Top Loading Bar */
const TopLoader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-emerald-100 overflow-hidden">
      <div className="h-full bg-emerald-600 animate-progress-bar shadow-[0_0_10px_#059669]"></div>
    </div>
  );
};

/* 🔵 2. Modern Skeleton Loader */
const SkeletonPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-pulse">
      <div className="h-64 md:h-80 bg-slate-200 rounded-3xl mb-10 w-full"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
           <div className="h-40 bg-slate-200 rounded-2xl w-full"></div>
           <div className="h-40 bg-slate-200 rounded-2xl w-full"></div>
        </div>
        <div className="col-span-1">
           <div className="h-80 bg-slate-200 rounded-2xl w-full"></div>
        </div>
      </div>
    </div>
  );
};

const AppLayouttt = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  
  // 🔥 Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // 🔥 Check for Login on Mount
  useEffect(() => {
    // Yahan hum LocalStorage check kar rahe hain (aap cookies check bhi add kar sakte hain)
    const user = localStorage.getItem("userData");
    
    if (!user) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
    setAuthChecked(true); // Check complete ho gaya
  }, []);

  const isLoading = navigation.state === "loading";
  const isSubmitting = navigation.state === "submitting";
  const isBusy = isLoading || isSubmitting;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] font-sans text-slate-800 relative">
      
      {/* 🔝 Top Loader */}
      {isBusy && <TopLoader />}

      {/* 🔰 Header (Always visible) */}
      <UserHeader />

      {/* 🧱 Main Content Area (PROTECTED) */}
      <main className="flex-grow flex flex-col w-full relative">
        
        {/* Case 1: Loading Route */}
        {isLoading || !authChecked ? (
          <SkeletonPage />
        ) : isAuthenticated ? (
          // Case 2: User IS Logged In -> Show Outlet
          <div className="animate-fade-in flex-grow flex flex-col">
            <Outlet />
          </div>
        ) : (
          // Case 3: User is NOT Logged In -> Show Restricted Access Message
          <div className="flex-grow flex items-center justify-center p-4 animate-fade-in">
             <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-red-100">
                
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-50 text-red-500 mb-6 relative">
                   <ShieldAlert size={48} />
                   <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-red-100">
                      <LockKeyhole size={20} className="text-red-600" />
                   </div>
                </div>

                <h2 className="text-3xl font-bold text-slate-800 mb-3">
                  Login Required
                </h2>
                
                <p className="text-slate-500 mb-8 leading-relaxed text-lg">
                  Is page ko dekhne ke liye aapko login karna padega. Kripya apne account me sign-in karein.
                </p>

                <div className="space-y-4">
                   <button
                      onClick={() => navigate("/login")}
                      className="w-full py-4 px-6 rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                   >
                      <LogIn size={24} /> Login to Continue
                   </button>
                   
                   <p className="text-sm text-slate-400">
                      Don't have an account? <span onClick={() => navigate("/register")} className="text-emerald-600 font-bold cursor-pointer hover:underline">Register Here</span>
                   </p>
                </div>

             </div>
          </div>
        )}

      </main>

      {/* 🔐 Submitting Indicator */}
      {isSubmitting && (
        <div className="fixed bottom-6 right-6 bg-emerald-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 animate-slide-up border border-emerald-700">
           <Loader2 className="animate-spin h-5 w-5 text-emerald-400" />
           <span className="font-medium text-sm tracking-wide">Processing...</span>
        </div>
      )}

      {/* 🔻 Footer (Always visible) */}
      <UserFooter />

      {/* GLOBAL ANIMATION STYLES */}
      <style>{`
        @keyframes progressBar {
          0% { width: 0%; margin-left: 0; }
          50% { width: 50%; margin-left: 25%; }
          100% { width: 100%; margin-left: 100%; }
        }
        .animate-progress-bar {
          animation: progressBar 1.5s infinite linear;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AppLayouttt;