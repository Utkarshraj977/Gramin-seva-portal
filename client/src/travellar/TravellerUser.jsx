import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bus, Map, Ticket, Navigation, ShieldCheck, Clock, CloudSun } from "lucide-react";

// 1. Hero Images specific to Passengers/Travel
const heroImages = [
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop", // Bus Journey
  "https://images.unsplash.com/photo-1478860409698-8707f313ee8b?q=80&w=2070&auto=format&fit=crop", // Nature Road
  "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop", // Passenger Waiting
];

export default function TravellerUser() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Slideshow Logic
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-[#fffbeb] min-h-screen font-sans text-slate-800">
      
      {/* --- HERO SECTION (PASSENGER THEME) --- */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Changing Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-[background-image] duration-1000 ease-in-out"
          style={{ backgroundImage: `url('${heroImages[currentImageIndex]}')` }}
        >
          {/* Amber Overlay for Warmth/Journey */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-900/90 via-black/50 to-slate-900/90"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-100 text-sm font-semibold mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Safar Suhana, Manzil Paana
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-xl animate-fade-in-up delay-100">
            Traveller & Yatri <span className="text-amber-400">Portal</span>
          </h1>
          
          <p className="text-lg md:text-xl text-amber-50 font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Apni yatra ko aasaan banayein. <span className="text-white font-bold">Bus Ticket Booking</span>, <span className="text-white font-bold">Timings Check</span> aur <span className="text-white font-bold">Safe Travel</span> ki suvidha ghar baithe.
          </p>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
           <svg className="relative block w-full h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
               <path d="M1200,0H0V120H281.94C572.9,116.24,602.45,3.86,736.48,7.23c135.34,3.4,284.64,24.33,463.52,24.33Z" className="fill-[#fffbeb]"></path>
           </svg>
        </div>
      </section>

      {/* --- MAIN CONTENT LAYOUT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: CONTENT (Span 2) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* 1. ROLE SECTION */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-l-4 border-amber-500 flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="p-4 bg-amber-50 text-amber-600 rounded-full shrink-0">
                 <Bus size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Yatri Portal ka Upyog</h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Yah portal gaon ke yatrio ke liye banaya gaya hai. Yahan aap 
                  <span className="font-semibold text-amber-700 mx-1">Bus/Auto</span> ki jankari le sakte hain, 
                  <span className="font-semibold text-amber-700 mx-1">Online Booking</span> kar sakte hain aur surakshit yatra ke niyam jan sakte hain.
                </p>
              </div>
            </div>

            {/* 2. TRAVELLER SERVICES GRID */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">🚍 Yatra Suvidhayein (Services)</h2>
                <div className="h-1 flex-grow bg-amber-100 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ServiceCard
                  title="Bus Ticket Booking"
                  img="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=500&q=80"
                  desc="Sarkari aur Private bus ki seat ghar baithe book karein."
                  list={["Select Seat", "Check Fare", "Download Ticket"]}
                  icon={<Ticket size={16} />}
                />
                <ServiceCard
                  title="Train PNR & Status"
                  img="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=500&q=80"
                  desc="Railway time table aur PNR status check karein."
                  list={["Live Status", "Seat Availability", "Station Info"]}
                  icon={<Clock size={16} />}
                />
                <ServiceCard
                  title="Taxi / Auto Seva"
                  img="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=500&q=80"
                  desc="Local ghoomne ke liye gaadi book karein."
                  list={["Fair Price Rate", "Driver Details", "Safe Ride"]}
                  icon={<Navigation size={16} />}
                />
                <ServiceCard
                  title="Road Safety"
                  img="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=500&q=80"
                  desc="Surakshit yatra ke liye niyam aur helpline."
                  list={["Emergency Call", "Report Issue", "Travel Insurance"]}
                  icon={<ShieldCheck size={16} />}
                />
              </div>
            </div>

            {/* 3. TRAVEL GUIDES & TIPS */}
            <div className="grid md:grid-cols-2 gap-6">
               {/* Safety Tips */}
               <div className="bg-white border border-amber-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                    <ShieldCheck size={20} /> Yatra Suraksha Tips
                  </h3>
                  <ul className="space-y-3">
                     {[
                       "Hamesha verified gadi me safar karein",
                       "Apna ticket aur ID proof sath rakhein",
                       "Anjan vyakti se khana na lein",
                       "Driver ka number family ko share karein"
                     ].map((item, i) => (
                       <li key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                         <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                         {item}
                       </li>
                     ))}
                  </ul>
               </div>

               {/* Destinations */}
               <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
                    <Map size={20} /> Popular Destinations
                  </h3>
                  <ul className="space-y-3">
                     {[
                       "Zila Mukhyalay (District HQ)",
                       "Najdiki Railway Station",
                       "Tehsil Office",
                       "Tourist Spots & Mandir"
                     ].map((item, i) => (
                       <li key={i} className="flex items-center gap-2 text-sm text-amber-900 font-medium">
                         <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
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
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-amber-100 text-center relative overflow-hidden group">
                 {/* Top Accent Line */}
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-amber-600"></div>
                 
                 <div className="bg-amber-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">🎒</span>
                 </div>
                 
                 <h3 className="text-2xl font-bold text-slate-800">Passenger Login</h3>
                 <p className="text-slate-500 text-sm mt-2 mb-8">
                   Apne bookings manage karne aur travel history dekhne ke liye login karein.
                 </p>
                 
                 <div className="space-y-4">
                    <Link
                      to="login"
                      className="block w-full py-4 px-6 bg-amber-600 text-white rounded-xl font-bold shadow-lg shadow-amber-200 hover:bg-amber-700 hover:-translate-y-1 transition-all duration-200"
                    >
                      Login karein
                    </Link>

                    <Link
                      to="register"
                      className="block w-full py-4 px-6 bg-white text-amber-700 border-2 border-amber-100 rounded-xl font-bold hover:bg-amber-50 hover:border-amber-200 transition-all duration-200"
                    >
                      Naya Account Banayein
                    </Link>
                 </div>

                 <p className="mt-6 text-xs text-slate-400">
                   Emergency Help? Call <span className="font-bold text-amber-600">112 / 100</span>
                 </p>
              </div>

              {/* Live Status Card */}
              <div className="bg-amber-900 rounded-2xl p-6 text-amber-50 shadow-lg border-l-4 border-amber-400">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                   <Clock size={18} className="text-amber-300"/> 
                   Live Status
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-amber-800/50 pb-2">
                    <span className="text-sm font-medium">🚍 Local Bus</span>
                    <span className="text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded">On Time</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium flex items-center gap-1"><CloudSun size={14}/> Mausam</span>
                    <span className="text-xs text-amber-200">28°C (Clear)</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-amber-800 flex justify-between text-xs">
                   <span>Location: <span className="text-amber-300">Your Village</span></span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-center border-t border-slate-800">
        <p className="font-medium tracking-wide">
          🌾 Gramin Seva Portal — Safe Journey, Happy Journey
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
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-amber-50 flex flex-col h-full">
      {/* Image */}
      <div className="h-44 overflow-hidden relative">
        <img 
          src={img} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 to-transparent"></div>
        <h3 className="absolute bottom-3 left-4 text-white text-lg font-bold drop-shadow-md flex items-center gap-2">
            {title}
        </h3>
      </div>
      
      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <p className="text-slate-600 text-sm mb-4 font-medium leading-relaxed">{desc}</p>
        <ul className="space-y-2 mt-auto pt-3 border-t border-amber-50">
          {list.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
              <span className="text-amber-500">{icon}</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}