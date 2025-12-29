import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Stethoscope, GraduationCap, Monitor, Scale, Bus, 
  Landmark, ArrowRight, CheckCircle2, Phone 
} from "lucide-react";

// 1. Hero Images (Mix of all services)
const heroImages = [
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop", // Digital/Cyber
  "https://images.unsplash.com/photo-1576765974257-b414c0b8f5b4?q=80&w=2070&auto=format&fit=crop", // Health
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop", // Education
];

export default function Services() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Slideshow Logic
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-800">
      
      {/* --- HERO SECTION (HOME STYLE) --- */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Changing Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-[background-image] duration-1000 ease-in-out"
          style={{ backgroundImage: `url('${heroImages[currentImageIndex]}')` }}
        >
          {/* Emerald Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/90 via-black/50 to-slate-900/90"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-100 text-sm font-semibold mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            All-in-One Gramin Portal
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-xl animate-fade-in-up delay-100">
            Gramin Seva <span className="text-emerald-400">Services</span>
          </h1>
          
          <p className="text-lg md:text-xl text-emerald-50 font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Gaon ke har nagrik ke liye — <span className="text-white font-bold">Swasthya, Shiksha, Digital Seva</span> aur <span className="text-white font-bold">Nyay</span> ek hi jagah par.
          </p>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
           <svg className="relative block w-full h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
               <path d="M1200,0H0V120H281.94C572.9,116.24,602.45,3.86,736.48,7.23c135.34,3.4,284.64,24.33,463.52,24.33Z" className="fill-[#f8fafc]"></path>
           </svg>
        </div>
      </section>

      {/* --- MAIN CONTENT LAYOUT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: SERVICES GRID (Span 2) */}
          <div className="lg:col-span-2 space-y-12">
            
            <div>
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-3xl font-bold text-slate-900">🌟 Hamari Pramukh Sevaayein</h2>
                <div className="h-1 flex-grow bg-slate-200 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <ServiceCard
                  title="Doctor & Health"
                  icon={Stethoscope}
                  img="https://images.unsplash.com/photo-1576765974257-b414c0b8f5b4?auto=format&fit=crop&w=500&q=80"
                  desc="Local doctor, clinic, aur health camps ki jankari."
                  points={["Doctor verification", "Clinic details", "Patient support"]}
                  link="/doctor"
                  color="text-teal-600"
                />

                <ServiceCard
                  title="Education"
                  icon={GraduationCap}
                  img="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=500&q=80"
                  desc="School, coaching, scholarship aur teacher info."
                  points={["Nearby schools", "Scholarship info", "Edu complaints"]}
                  link="/education"
                  color="text-indigo-600"
                />

                <ServiceCard
                  title="Cyber & Digital"
                  icon={Monitor}
                  img="https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=500&q=80"
                  desc="Aadhaar, PAN, yojna forms aur online seva."
                  points={["Form filling", "Govt schemes", "Digital help"]}
                  link="/cyber"
                  color="text-emerald-600"
                />

                <ServiceCard
                  title="Complaint & Nyay"
                  icon={Scale}
                  img="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=500&q=80"
                  desc="Bijli, pani, pradhan, yojna aur daily complaints."
                  points={["Major complaints", "Escalation", "Tracking system"]}
                  link="/complaint"
                  color="text-rose-600"
                />

                <ServiceCard
                  title="Traveller Support"
                  icon={Bus}
                  img="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=500&q=80"
                  desc="Gaon se bahar jaane walon ke liye madad."
                  points={["Student travel", "Medical travel", "Migration guide"]}
                  link="/traveller"
                  color="text-sky-600"
                />

                <ServiceCard
                  title="Sarkari Yojna"
                  icon={Landmark}
                  img="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=500&q=80"
                  desc="Awas, pension, ration aur anya yojna."
                  points={["Eligibility check", "Apply guidance", "Status support"]}
                  link="/cyber" // Linking to Cyber as it handles forms
                  color="text-amber-600"
                />

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: STICKY LOGIN WIDGET (Span 1) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Login Card */}
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center relative overflow-hidden group">
                 {/* Top Accent Line */}
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                 
                 <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">🔐</span>
                 </div>
                 
                 <h3 className="text-2xl font-bold text-slate-800">Seva Login</h3>
                 <p className="text-slate-500 text-sm mt-2 mb-8">
                   Apne vibhag (Department) me login karne ke liye niche click karein.
                 </p>
                 
                 <div className="space-y-4">
                    <Link
                      to="/login"
                      className="block w-full py-4 px-6 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all duration-200"
                    >
                      Login Dashboard
                    </Link>

                    <Link
                      to="/register"
                      className="block w-full py-4 px-6 bg-white text-emerald-700 border-2 border-emerald-100 rounded-xl font-bold hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-200"
                    >
                      New Registration
                    </Link>
                 </div>
              </div>

              {/* Why Choose Us (Moved from bottom to sidebar) */}
              <div className="bg-slate-900 rounded-2xl p-6 text-slate-300 shadow-lg">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                   <CheckCircle2 size={18} className="text-emerald-400"/> 
                   Gramin Seva Kyun?
                </h4>
                <ul className="space-y-3 text-sm">
                   <li className="flex gap-2">
                     <span className="text-emerald-500">✔</span> Gaon ke liye ekmatra platform
                   </li>
                   <li className="flex gap-2">
                     <span className="text-emerald-500">✔</span> Dalalon se azadi
                   </li>
                   <li className="flex gap-2">
                     <span className="text-emerald-500">✔</span> Sahi jankari, Sahi samay
                   </li>
                   <li className="flex gap-2">
                     <span className="text-emerald-500">✔</span> Direct Govt Access
                   </li>
                </ul>
                <div className="mt-6 pt-4 border-t border-slate-700 flex items-center gap-3">
                    <div className="p-2 bg-emerald-600 rounded-lg text-white">
                        <Phone size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Helpline Number</p>
                        <p className="text-white font-bold tracking-wider">1800-555-000</p>
                    </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-center border-t border-slate-800">
        <p className="font-medium tracking-wide">
          🌾 Gramin Seva Portal — Gaon ke vikas ke liye ek kadam
        </p>
      </footer>

      {/* CSS Animations */}
      <style>{`
        .animate-fade-in-up { animation: fadeInUp 1s ease-out forwards; opacity: 0; }
        .delay-100 { animation-delay: 0.2s; }
        .delay-200 { animation-delay: 0.4s; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* REUSABLE SERVICE CARD */
function ServiceCard({ title, img, desc, points, link, icon: Icon, color }) {
  return (
    <Link to={link} className="group block h-full">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col h-full transform hover:-translate-y-1">
        {/* Image */}
        <div className="h-44 overflow-hidden relative">
            <img 
            src={img} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
            
            {/* Title Overlay */}
            <div className="absolute bottom-3 left-4 flex items-center gap-2">
                <div className={`p-1.5 bg-white/90 rounded-lg ${color}`}>
                    <Icon size={18} />
                </div>
                <h3 className="text-white text-lg font-bold drop-shadow-md">{title}</h3>
            </div>
        </div>
        
        {/* Content */}
        <div className="p-5 flex-grow flex flex-col">
            <p className="text-slate-600 text-sm mb-4 font-medium leading-relaxed">{desc}</p>
            
            <ul className="space-y-2 mt-auto">
            {points.map((p, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                <span className={`w-1.5 h-1.5 rounded-full ${color.replace('text', 'bg')} flex-shrink-0`}></span>
                {p}
                </li>
            ))}
            </ul>

            <div className={`mt-4 pt-3 border-t border-slate-50 flex items-center gap-2 text-sm font-bold ${color} opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0`}>
                View Details <ArrowRight size={16} />
            </div>
        </div>
        </div>
    </Link>
  );
}