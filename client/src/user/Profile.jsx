import { useEffect, useState, useRef } from "react";
import { user as userApi } from "../services/api"; 
import { User, Mail, Phone, MapPin, X, Camera, Settings, Bell, Shield, ChevronRight, LogOut, Loader2 } from "lucide-react";
import Services from "../components/Sixcomponent/Services";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Controls the Slide-Over

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await userApi.getdetail();
      setUserData(res.data.data || res.data); 
    } catch (error) {
      console.error("Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="animate-spin text-emerald-700 h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans relative">
      
      {/* --- 1. MAIN CONTENT AREA (IMMEDIATE SERVICES) --- */}
      <div className={`transition-all duration-300 ${isProfileOpen ? 'md:mr-[400px]' : ''}`}>
        
        {/* Welcome Header */}
        <div className="bg-emerald-900 text-white pt-10 pb-20 px-6 md:px-12 relative overflow-hidden">
           {/* Background Decoration */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
           
           <div className="max-w-7xl mx-auto flex justify-between items-end relative z-10">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Namaste, {userData?.fullName?.split(" ")[0] || "User"}! 🙏
                </h1>
                <p className="text-emerald-100 opacity-90 max-w-xl">
                  Welcome to your Gramin Seva Dashboard. Access all government and village services directly from here.
                </p>
              </div>
              
              {/* Desktop: "My Profile" Button (Visible only if profile is closed) */}
              {!isProfileOpen && (
                <button 
                  onClick={() => setIsProfileOpen(true)}
                  className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full transition-all group"
                >
                  <img 
                    src={userData?.avatar?.url || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                    className="w-8 h-8 rounded-full border border-white/50"
                  />
                  <span className="font-medium">My Account</span>
                  <Settings size={16} className="group-hover:rotate-90 transition-transform duration-500" />
                </button>
              )}
           </div>
        </div>

        {/* Services Grid (Pushed up to overlap header) */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 pb-12 relative z-20">
           {/* Mobile Profile Trigger (Floating Action Button) */}
           <button 
              onClick={() => setIsProfileOpen(true)}
              className="md:hidden absolute top-[-60px] right-6 p-3 bg-amber-500 text-white rounded-full shadow-lg hover:bg-amber-600 transition"
           >
              <Settings size={24} />
           </button>

           {/* YOUR SERVICES COMPONENT */}
           <div className="animate-fade-in-up">
              <Services />
           </div>
        </div>
      </div>

      {/* --- 2. SLIDE-OVER PROFILE DRAWER --- */}
      {/* Overlay (Mobile only) */}
      {isProfileOpen && (
        <div 
          onClick={() => setIsProfileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        ></div>
      )}

      {/* The Sidebar Itself */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${isProfileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Profile Header */}
        <div className="relative h-40 bg-gradient-to-br from-emerald-800 to-green-600">
           <button 
             onClick={() => setIsProfileOpen(false)}
             className="absolute top-4 right-4 p-2 bg-black/20 text-white rounded-full hover:bg-black/40 transition"
           >
             <X size={20} />
           </button>
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-8">
           
           {/* Avatar Section (Update Logic Included) */}
           <AvatarUpdater 
              userData={userData} 
              onUpdate={() => loadUser()} 
           />

           <div className="text-center mt-3 mb-8">
              <h2 className="text-2xl font-bold text-gray-800">{userData?.fullName}</h2>
              <p className="text-emerald-600 font-medium">@{userData?.username}</p>
              <div className="flex justify-center gap-2 mt-3">
                 <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">Verified User</span>
                 <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200">Villager</span>
              </div>
           </div>

           {/* Details Section */}
           <div className="space-y-6">
              
              {/* Contact Info */}
              <div>
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Contact Information</h3>
                 <div className="bg-gray-50 rounded-2xl p-4 space-y-4 border border-gray-100">
                    <InfoRow icon={Mail} label="Email" value={userData?.email} />
                    <InfoRow icon={Phone} label="Phone" value={userData?.phone || "Not Added"} />
                    <InfoRow icon={MapPin} label="Location" value="Gram Panchayat, Bihar" />
                 </div>
              </div>

              {/* Account Settings */}
              <div>
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Settings & Privacy</h3>
                 <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100">
                    <SettingRow icon={Bell} title="Notifications" desc="SMS & Email alerts" />
                    <SettingRow icon={Shield} title="Privacy" desc="Hide profile photo" />
                    <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 text-left group transition">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-100 text-red-600 rounded-lg group-hover:bg-red-200">
                             <LogOut size={18} />
                          </div>
                          <div>
                             <p className="font-semibold text-gray-800 group-hover:text-red-700">Logout</p>
                          </div>
                       </div>
                       <ChevronRight size={16} className="text-gray-300 group-hover:text-red-400" />
                    </button>
                 </div>
              </div>

           </div>
           
           <div className="mt-8 text-center">
              <p className="text-xs text-gray-400">Gramin Vikas Portal v1.0.0</p>
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

// --- SUB-COMPONENT: AVATAR UPDATER (Handles logic cleanly) ---
function AvatarUpdater({ userData, onUpdate }) {
   const [uploading, setUploading] = useState(false);
   const fileInputRef = useRef(null);

   const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
         setUploading(true);
         const formData = new FormData();
         formData.append("avatar", file);
         await userApi.update_avatar(formData);
         await onUpdate(); // Refresh parent data
      } catch (err) {
         alert("Failed to update avatar");
      } finally {
         setUploading(false);
      }
   };

   return (
      <div className="relative -mt-12 flex justify-center">
         <div className="relative group">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white overflow-hidden">
               <img 
                  src={userData?.avatar?.url || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                  className={`w-full h-full object-cover ${uploading ? 'opacity-50' : ''}`}
               />
               {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Loader2 className="animate-spin text-emerald-600" />
                  </div>
               )}
            </div>
            
            <button 
               onClick={() => fileInputRef.current.click()}
               disabled={uploading}
               className="absolute bottom-0 right-0 p-2 bg-amber-500 text-white rounded-full border-2 border-white shadow-md hover:bg-amber-600 transition active:scale-95"
            >
               <Camera size={16} />
            </button>
            <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleFileChange} 
               className="hidden" 
               accept="image/*"
            />
         </div>
      </div>
   );
}

// --- SUB-COMPONENTS FOR UI ---
function InfoRow({ icon: Icon, label, value }) {
   return (
      <div className="flex items-center gap-4">
         <div className="p-2 bg-white border border-gray-100 rounded-lg text-emerald-600 shadow-sm">
            <Icon size={18} />
         </div>
         <div>
            <p className="text-xs text-gray-400 font-medium uppercase">{label}</p>
            <p className="text-gray-800 font-medium">{value}</p>
         </div>
      </div>
   );
}

function SettingRow({ icon: Icon, title, desc }) {
   const [active, setActive] = useState(true);
   return (
      <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
         <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
               <Icon size={18} />
            </div>
            <div>
               <p className="font-semibold text-gray-800 text-sm">{title}</p>
               <p className="text-xs text-gray-500">{desc}</p>
            </div>
         </div>
         <button 
            onClick={() => setActive(!active)}
            className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-emerald-500' : 'bg-gray-300'}`}
         >
            <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${active ? 'left-6' : 'left-1'}`}></div>
         </button>
      </div>
   );
}