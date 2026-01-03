import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Calendar, MapPin, Phone, Heart, Activity, Pill } from "lucide-react";

// 1. Hero Images specific to Patients/Village Health
const heroImages = [
  "https://images.unsplash.com/photo-1576091160550-2187d80aeff2?q=80&w=2070&auto=format&fit=crop", // Patient Consultation
  "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=2032&auto=format&fit=crop", // Rural Health Camp
  "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop", // Medicine/Care
];

export default function PatientUser() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Slideshow Logic
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-[#f0fdf4] min-h-screen font-sans text-slate-800">
      
      {/* --- HERO SECTION (PATIENT THEME) --- */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Changing Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-[background-image] duration-1000 ease-in-out"
          style={{ backgroundImage: `url('${heroImages[currentImageIndex]}')` }}
        >
          {/* Emerald Overlay for Healing/Wellness Theme */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/90 via-black/50 to-slate-900/90"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-100 text-sm font-semibold mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Aapki Sehat, Hamari Zimmedari
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-xl animate-fade-in-up delay-100">
            Patient & Rogi <span className="text-emerald-400">Portal</span>
          </h1>
          
          <p className="text-lg md:text-xl text-emerald-50 font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Ab gaon me <span className="text-white font-bold">Doctor Dhundna</span> aur <span className="text-white font-bold">Appointment Book</span> karna hua aasaan. 
            Ghar baithe sahi upchar payein.
          </p>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
           <svg className="relative block w-full h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
               <path d="M1200,0H0V120H281.94C572.9,116.24,602.45,3.86,736.48,7.23c135.34,3.4,284.64,24.33,463.52,24.33Z" className="fill-[#f0fdf4]"></path>
           </svg>
        </div>
      </section>

      {/* --- MAIN CONTENT LAYOUT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: CONTENT (Span 2) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* 1. ROLE SECTION */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-l-4 border-emerald-500 flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full shrink-0">
                 <User size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Patient Portal ka Upyog</h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Is portal ke madhyam se aap apne nazdiki 
                  <span className="font-semibold text-emerald-700 mx-1">Clinics</span>, 
                  <span className="font-semibold text-emerald-700 mx-1">Specialist Doctors</span> ko khoj sakte hain aur online appointment le sakte hain taaki clinic par bheed me khada na hona pade.
                </p>
              </div>
            </div>

            {/* 2. PATIENT SERVICES GRID */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">🩺 Rogi Suvidhayein (Services)</h2>
                <div className="h-1 flex-grow bg-emerald-100 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ServiceCard
                  title="Find Nearby Doctor"
                  img="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80"
                  desc="Apne gaon ya shahar ke verified doctors ki list dekhein."
                  list={["Search by Disease", "View Fees & Timing", "Read Reviews"]}
                  icon={<MapPin size={16} />}
                />
                <ServiceCard
                  title="Book Appointment"
                  img="https://images.unsplash.com/photo-1516549655169-df83a0929519?auto=format&fit=crop&w=500&q=80"
                  desc="Lambe intezaar se bachein, pehle se number lagayein."
                  list={["Instant Booking", "Digital Token", "SMS Reminder"]}
                  icon={<Calendar size={16} />}
                />
                <ServiceCard
                  title="Medicine & Pharmacy"
                  img="https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=500&q=80"
                  desc="Janiye kaunsi dawai kis store par uplabdh hai."
                  list={["Stock Availability", "Home Delivery Info", "Generic Options"]}
                  icon={<Pill size={16} />}
                />
                <ServiceCard
                  title="Emergency / Ambulance"
                  img="https://images.unsplash.com/photo-1588775405975-6c1595f4e156?auto=format&fit=crop&w=500&q=80"
                  desc="Aapatkalin sthiti me turant madad prapt karein."
                  list={["Call 108/102", "Driver Contact", "Nearest Hospital"]}
                  icon={<Phone size={16} />}
                />
              </div>
            </div>

            {/* 3. HEALTH TIPS & SCHEMES */}
            <div className="grid md:grid-cols-2 gap-6">
               {/* Government Schemes */}
               <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                    <Activity size={20} /> Sarkari Yojnaein
                  </h3>
                  <ul className="space-y-3">
                     {[
                       "Ayushman Bharat Card: ₹5 Lakh Free",
                       "Janani Suraksha Yojana (Pregnant Women)",
                       "Free Dialysis & Testing Program",
                       "Generic Medicine (Jan Aushadhi Kendra)"
                     ].map((item, i) => (
                       <li key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                         {item}
                       </li>
                     ))}
                  </ul>
               </div>

               {/* Patient Rights */}
               <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
                    <Heart size={20} /> Aapke Adhikar (Rights)
                  </h3>
                  <ul className="space-y-3">
                     {[
                       "Sahi Upchar aur Samman ka Adhikar",
                       "Prescription aur Report ki Copy lena",
                       "Treatment ke kharche ki jankari",
                       "Doctor ki qualification janne ka haq"
                     ].map((item, i) => (
                       <li key={i} className="flex items-center gap-2 text-sm text-emerald-900 font-medium">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                         {item}
                       </li>
                     ))}
                  </ul>
               </div>
            </div>

          </div>

          {/* RIGHT COLUMN: STICKY LOGIN WIDGET (Span 1) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Login Card */}
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-emerald-100 text-center relative overflow-hidden group">
                 {/* Top Accent Line */}
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                 
                 <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">🧑‍⚕️</span>
                 </div>
                 
                 <h3 className="text-2xl font-bold text-slate-800">Patient Login</h3>
                 <p className="text-slate-500 text-sm mt-2 mb-8">
                   Apna appointment book karne aur medical history dekhne ke liye login karein.
                 </p>
                 
                 <div className="space-y-4">
                    <Link
                      to="/doctor/userlogin"
                      className="block w-full py-4 px-6 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all duration-200"
                    >
                      Login karein
                    </Link>

                    <Link
                      to="/doctor/userregister"
                      className="block w-full py-4 px-6 bg-white text-emerald-700 border-2 border-emerald-100 rounded-xl font-bold hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-200"
                    >
                      Naya Khata Banayein
                    </Link>
                 </div>

                 <p className="mt-6 text-xs text-slate-400">
                   Health ID / ABHA Card se bhi login kar sakte hain.
                 </p>
              </div>

              {/* Status Card */}
              <div className="bg-emerald-800 rounded-2xl p-6 text-emerald-50 shadow-lg border-l-4 border-emerald-400">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                   <Activity size={18} className="text-emerald-300"/> 
                   Health Tip of the Day
                </h4>
                <p className="text-sm text-emerald-100 leading-relaxed">
                  "Rozana kam se kam 8 gilas paani piyein aur seasonal phal (fruits) khayein. Swasth rahein, mast rahein."
                </p>
                <div className="mt-4 pt-3 border-t border-emerald-700 flex justify-between text-xs">
                   <span>Topic: <span className="text-emerald-300">Hydration</span></span>
                   <span className="text-emerald-200">Date: Today</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-center border-t border-slate-800">
        <p className="font-medium tracking-wide">
          🌾 Gramin Seva Portal — Connecting Patients to Care
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
function ServiceCard({ title, img, desc, list, icon }) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-emerald-50 flex flex-col h-full">
      {/* Image */}
      <div className="h-44 overflow-hidden relative">
        <img 
          src={img} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent"></div>
        <h3 className="absolute bottom-3 left-4 text-white text-lg font-bold drop-shadow-md flex items-center gap-2">
            {title}
        </h3>
      </div>
      
      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <p className="text-slate-600 text-sm mb-4 font-medium leading-relaxed">{desc}</p>
        <ul className="space-y-2 mt-auto pt-3 border-t border-emerald-50">
          {list.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
              <span className="text-emerald-500">{icon}</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}