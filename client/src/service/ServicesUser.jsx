import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Stethoscope, GraduationCap, Monitor, Scale, Bus, 
  Landmark, ArrowRight, CheckCircle2, Phone 
} from "lucide-react";

// 1. Hero Images (User Focused)
const heroImages = [
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop", // Community Service
  "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2070&auto=format&fit=crop", // Village Connectivity
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop", // Digital Help
];

export default function ServicesUser() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Slideshow Logic
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-[#ecfeff] min-h-screen font-sans text-slate-800">
      
      {/* --- HERO SECTION (USER THEME) --- */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Changing Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-[background-image] duration-1000 ease-in-out"
          style={{ backgroundImage: `url('${heroImages[currentImageIndex]}')` }}
        >
          {/* Cyan Overlay for Fresh/Public Theme */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/90 via-black/50 to-slate-900/90"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cyan-100 text-sm font-semibold mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Har Gaon, Har Suvidha
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-xl animate-fade-in-up delay-100">
            Gramin Seva <span className="text-cyan-400">User Hub</span>
          </h1>
          
          <p className="text-lg md:text-xl text-cyan-50 font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Ab har zarurat puri hogi ghar baithe. <span className="text-white font-bold">Health, Education, Travel</span> aur <span className="text-white font-bold">Banking</span> ki suvidha ek click par.
          </p>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
           <svg className="relative block w-full h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
               <path d="M1200,0H0V120H281.94C572.9,116.24,602.45,3.86,736.48,7.23c135.34,3.4,284.64,24.33,463.52,24.33Z" className="fill-[#ecfeff]"></path>
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
                <h2 className="text-3xl font-bold text-slate-900">🌐 Aapke Liye Suvidhayein</h2>
                <div className="h-1 flex-grow bg-cyan-200 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <ServiceCard
                  title="Health & Medicine"
                  icon={Stethoscope}
                  img="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=500&q=80"
                  desc="Doctor se salah lein aur dawai mangwayein."
                  points={["Book Appointment", "Find Medicine", "Ambulance"]}
                  link="/patient"
                  color="text-teal-600"
                />

                <ServiceCard
                  title="Student Corner"
                  icon={GraduationCap}
                  img="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=500&q=80"
                  desc="Scholarship, result aur online classes."
                  points={["Scholarship Form", "Exam Results", "E-Library"]}
                  link="/student"
                  color="text-indigo-600"
                />

                <ServiceCard
                  title="Travel Booking"
                  icon={Bus}
                  img="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=500&q=80"
                  desc="Bus aur train ticket book karein."
                  points={["Bus Ticket", "Train Status", "Taxi Service"]}
                  link="/traveller"
                  color="text-sky-600"
                />

                <ServiceCard
                  title="Digital Seva"
                  icon={Monitor}
                  img="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80"
                  desc="Jati, Aay, Niwas aur Banking seva."
                  points={["Certificates", "Aadhaar/PAN", "Banking"]}
                  link="/cyber-user"
                  color="text-violet-600"
                />

                <ServiceCard
                  title="Complaint Box"
                  icon={Scale}
                  img="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=500&q=80"
                  desc="Apni samasya darj karein."
                  points={["Report Issue", "Track Status", "Officer Contact"]}
                  link="/complaint-user"
                  color="text-rose-600"
                />

                <ServiceCard
                  title="Sarkari Yojna"
                  icon={Landmark}
                  img="https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=500&q=80"
                  desc="Sarkar ki nayi yojnaon ka labh uthayein."
                  points={["Check Eligibility", "Apply Online", "Benefits List"]}
                  link="/cyber-user" // Linking to Cyber User for schemes
                  color="text-amber-600"
                />

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: STICKY LOGIN WIDGET (Span 1) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Login Card */}
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-cyan-100 text-center relative overflow-hidden group">
                 {/* Top Accent Line */}
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 to-cyan-600"></div>
                 
                 <div className="bg-cyan-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">👤</span>
                 </div>
                 
                 <h3 className="text-2xl font-bold text-slate-800">User Login</h3>
                 <p className="text-slate-500 text-sm mt-2 mb-8">
                   Apne Gramin ID se login karein aur sabhi suvidhaon ka labh lein.
                 </p>
                 
                 <div className="space-y-4">
                    <Link
                      to="/login"
                      className="block w-full py-4 px-6 bg-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-cyan-200 hover:bg-cyan-700 hover:-translate-y-1 transition-all duration-200"
                    >
                      Login karein
                    </Link>

                    <Link
                      to="/register"
                      className="block w-full py-4 px-6 bg-white text-cyan-700 border-2 border-cyan-100 rounded-xl font-bold hover:bg-cyan-50 hover:border-cyan-200 transition-all duration-200"
                    >
                      Naya Khata (Register)
                    </Link>
                 </div>
              </div>

              {/* Why Join Us */}
              <div className="bg-cyan-900 rounded-2xl p-6 text-cyan-100 shadow-lg">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                   <CheckCircle2 size={18} className="text-cyan-400"/> 
                   Gramin Seva ke Fayde
                </h4>
                <ul className="space-y-3 text-sm">
                   <li className="flex gap-2">
                     <span className="text-cyan-400">➜</span> Ek Portal, Sabhi Seva
                   </li>
                   <li className="flex gap-2">
                     <span className="text-cyan-400">➜</span> Samay aur Paisa bachega
                   </li>
                   <li className="flex gap-2">
                     <span className="text-cyan-400">➜</span> Bhrashtachar mukt seva
                   </li>
                   <li className="flex gap-2">
                     <span className="text-cyan-400">➜</span> 24x7 Online Access
                   </li>
                </ul>
                <div className="mt-6 pt-4 border-t border-cyan-800 flex items-center gap-3">
                    <div className="p-2 bg-cyan-700 rounded-lg text-white">
                        <Phone size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-cyan-300">Helpline (Toll Free)</p>
                        <p className="text-white font-bold tracking-wider">1800-111-222</p>
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
          🌾 Gramin Seva Portal — Empowering Every Villager
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
                Open Service <ArrowRight size={16} />
            </div>
        </div>
        </div>
    </Link>
  );
}