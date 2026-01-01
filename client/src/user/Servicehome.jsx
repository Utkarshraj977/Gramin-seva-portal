import { useState } from "react";
import { 
  Stethoscope, Tractor, GraduationCap, Bus, Landmark, Wifi, 
  X, CheckCircle2, ArrowRight, Sprout, ShieldCheck 
} from "lucide-react";

export default function Services() {
  const [selectedService, setSelectedService] = useState(null);

  // Data Array with Details for Modal
  const services = [
    {
      id: 1,
      title: "Healthcare Services",
      tagline: "Swasth Gaon, Samriddh Gaon",
      desc: "Connect with top doctors via video call, book hospital appointments, and get emergency ambulance support instantly.",
      features: ["Video Consultation", "Medicine Delivery", "Ambulance Booking"],
      icon: Stethoscope,
      theme: "red",
      bg: "bg-red-50",
      text: "text-red-600",
      border: "hover:border-red-400"
    },
    {
      id: 2,
      title: "Agriculture & Farming",
      tagline: "Kisan ki unnati, Desh ki pragati",
      desc: "Get real-time mandi prices, weather updates, soil testing labs info, and government subsidy details directly.",
      features: ["Mandi Rates", "Soil Health Card", "Crop Insurance"],
      icon: Tractor,
      theme: "green",
      bg: "bg-green-50",
      text: "text-green-600",
      border: "hover:border-green-400"
    },
    {
      id: 3,
      title: "Education & Skills",
      tagline: "Padhega India, Tabhi Badhega India",
      desc: "Access free online courses, scholarship forms, and vocational training programs for village youth.",
      features: ["Online Classes", "Skill Training", "Library Access"],
      icon: GraduationCap,
      theme: "blue",
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "hover:border-blue-400"
    },
    {
      id: 4,
      title: "Transport Seva",
      tagline: "Surakshit Yatra, Sugam Safar",
      desc: "Check local bus timings, book tickets online, and report road connectivity issues in your area.",
      features: ["Bus Schedule", "Ticket Booking", "Road Safety"],
      icon: Bus,
      theme: "amber",
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "hover:border-amber-400"
    },
    {
      id: 5,
      title: "Govt Schemes",
      tagline: "Sarkar Aapke Dwar",
      desc: "Direct application links for Pradhan Mantri Awas Yojana, Ration Card, Pension, and other welfare schemes.",
      features: ["Ration Card", "PM Awas Yojana", "Pension Scheme"],
      icon: Landmark,
      theme: "purple",
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "hover:border-purple-400"
    },
    {
      id: 6,
      title: "Cyber & Digital",
      tagline: "Digital Saksharta Abhiyan",
      desc: "Learn how to use computers, apply for digital certificates, and stay safe from online frauds.",
      features: ["Digital Literacy", "CSC Locator", "Cyber Security"],
      icon: Wifi,
      theme: "cyan",
      bg: "bg-cyan-50",
      text: "text-cyan-600",
      border: "hover:border-cyan-400"
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans relative">
      
      {/* --- HERO HEADER --- */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 pt-20 pb-32 px-6 relative overflow-hidden text-center rounded-b-[3rem] shadow-2xl">
        
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-bounce"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-amber-400 opacity-10 rounded-full blur-2xl animate-pulse"></div>
        
        <div className="relative z-10 animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-emerald-200 text-sm font-medium backdrop-blur-md mb-6 shadow-lg">
             <Sprout size={16} className="animate-spin-slow" /> Essential Village Services
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-md">
            Hamara Gaon, <span className="text-amber-400">Digital Gaon</span>
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto leading-relaxed opacity-90">
            Access healthcare, farming, education, and government facilities 
            with a single click. Empowering rural India, one click at a time.
          </p>
        </div>
      </div>

      {/* --- SERVICES GRID --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 pb-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {services.map((service, index) => (
            <div 
              key={service.id}
              onClick={() => setSelectedService(service)}
              className={`group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border-2 border-transparent transition-all duration-500 transform hover:-translate-y-3 cursor-pointer relative overflow-hidden ${service.border}`}
              style={{ animationDelay: `${index * 100}ms` }} // Staggered Animation
            >
              {/* Hover Gradient Background */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${service.bg.replace("bg-", "bg-gradient-to-br from-white to-")}`}></div>

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl ${service.bg} flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-inner`}>
                <service.icon size={32} className={service.text} />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-emerald-800 transition-colors">
                {service.title}
              </h3>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {service.tagline}
              </p>
              <p className="text-gray-500 leading-relaxed mb-6 line-clamp-3">
                {service.desc}
              </p>

              {/* Fake Button */}
              <div className="flex items-center gap-2 font-bold text-sm text-gray-800 group-hover:text-emerald-600 transition-colors">
                Explore More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* --- 3. MODAL (POPUP) --- */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setSelectedService(null)}
          ></div>

          {/* Modal Content */}
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 animate-scale-up">
            
            {/* Modal Header Color */}
            <div className={`h-32 ${selectedService.bg} flex items-center justify-center relative`}>
               <button 
                 onClick={() => setSelectedService(null)}
                 className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-gray-700"
               >
                 <X size={24} />
               </button>
               <selectedService.icon size={64} className={`${selectedService.text} opacity-80`} />
            </div>

            {/* Modal Body */}
            <div className="p-8">
               <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedService.title}</h2>
               <p className="text-emerald-600 font-medium mb-6">{selectedService.tagline}</p>
               
               <p className="text-gray-600 text-lg leading-relaxed mb-8">
                 {selectedService.desc}
               </p>

               <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                 <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                   <ShieldCheck size={18} className="text-emerald-600"/> Key Features
                 </h4>
                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {selectedService.features.map((feature, idx) => (
                     <li key={idx} className="flex items-center gap-2 text-gray-600">
                       <CheckCircle2 size={16} className="text-green-500" /> {feature}
                     </li>
                   ))}
                 </ul>
               </div>

               <button 
                 onClick={() => {
                   alert(`Redirecting to ${selectedService.title} Portal...`);
                   setSelectedService(null);
                 }}
                 className="w-full py-4 bg-emerald-900 text-white font-bold rounded-xl hover:bg-emerald-800 transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
               >
                 Access This Service Now <ArrowRight size={20} />
               </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CUSTOM CSS FOR ANIMATIONS --- */}
      <style>{`
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-scale-up { animation: scaleUp 0.3s ease-out; }
        .animate-spin-slow { animation: spin 10s linear infinite; }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}