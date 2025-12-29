import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bus, MapPin, ShieldCheck, UserCheck, AlertTriangle } from "lucide-react";

// 1. Hero Images specific to Travel/Transport
const heroImages = [
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop", // Bus/Travel
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071&auto=format&fit=crop", // Workers/People
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop", // Road/Journey
];

export default function TravellerAdmin() {
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
          {/* Cyan/Sky Overlay for Travel Theme */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/90 via-black/50 to-slate-900/90"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sky-100 text-sm font-semibold mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            Surakshit Yatra Initiative
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-xl animate-fade-in-up delay-100">
            Traveller Admin <span className="text-sky-400">Guide</span>
          </h1>
          
          <p className="text-lg md:text-xl text-sky-50 font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Safe, Verified, aur Organized travel ke liye gaon ke nagrikon ka <span className="text-white font-bold">Digital Travel Partner</span>.
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
          
          {/* LEFT COLUMN: CONTENT (Span 2) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* 1. ROLE SECTION */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-l-4 border-sky-500 flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="p-4 bg-sky-50 text-sky-600 rounded-full shrink-0">
                 <ShieldCheck size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Traveller Admin ka Role</h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Traveller Admin ka mukhya kaam yatra karne wale nagrikon ko 
                  <span className="font-semibold text-sky-700 mx-1">verify karna</span>, 
                  unki <span className="font-semibold text-sky-700 mx-1">safety ensure karna</span> 
                  aur har traveller ko uske purpose ke hisaab se sahi guidance dena hai.
                </p>
              </div>
            </div>

            {/* 2. TRAVELLER TYPES GRID */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">🧳 Types of Travellers</h2>
                <div className="h-1 flex-grow bg-slate-200 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TravellerCard
                  title="Student Traveller"
                  img="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=500&q=80"
                  desc="Education ke liye yatra karne wale students."
                  list={["College / School ID", "Admission Proof", "Guardian Details"]}
                />
                <TravellerCard
                  title="Worker / Labour"
                  img="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=500&q=80"
                  desc="Rozgar ke liye rajya ya shehar jaane wale."
                  list={["Aadhaar Card", "Employer Letter", "Work Address Proof"]}
                />
                <TravellerCard
                  title="Medical Traveller"
                  img="https://images.unsplash.com/photo-1580281657521-6c8b47f86b3c?auto=format&fit=crop&w=500&q=80"
                  desc="Ilaaj ke liye hospital jaane wale."
                  list={["Doctor Prescription", "Hospital Appt", "Emergency Contact"]}
                />
                <TravellerCard
                  title="Migrant / Relocation"
                  img="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=500&q=80"
                  desc="Permanent ya long-term relocation."
                  list={["ID Proof", "New Address", "Family Details"]}
                />
                <TravellerCard
                  title="Tourist"
                  img="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=80"
                  desc="Ghoomne aur paryatan ke liye."
                  list={["ID Proof", "Stay Details", "Return Plan"]}
                />
                <TravellerCard
                  title="Emergency Travel"
                  img="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=500&q=80"
                  desc="Accident, death, ya disaster ke cases."
                  list={["Emergency Proof", "Authority Approval", "Fast Track Pass"]}
                />
              </div>
            </div>

            {/* 3. GUIDELINES */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8">
               <h2 className="text-xl font-bold text-orange-900 mb-6 flex items-center gap-2">
                 <AlertTriangle size={24} />
                 Admin Guidelines (Niyam)
               </h2>
               <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   "Documents ko dhyan se verify karein",
                   "Galat information par request reject karein",
                   "Emergency travellers ko priority dein",
                   "Traveller data ko confidential rakhein",
                   "Safe travel instructions clearly batayein"
                 ].map((item, i) => (
                   <li key={i} className="flex items-start gap-3 text-orange-900 font-medium">
                     <span className="w-5 h-5 bg-orange-200 text-orange-700 rounded-full flex items-center justify-center text-xs mt-0.5">!</span>
                     {item}
                   </li>
                 ))}
               </ul>
            </div>

          </div>

          {/* RIGHT COLUMN: STICKY LOGIN WIDGET (Span 1) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Login Card */}
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center relative overflow-hidden group">
                 {/* Top Accent Line */}
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-400 to-sky-600"></div>
                 
                 <div className="bg-sky-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">🚌</span>
                 </div>
                 
                 <h3 className="text-2xl font-bold text-slate-800">Transport Portal</h3>
                 <p className="text-slate-500 text-sm mt-2 mb-8">
                   Bus Operators aur Transport Admins yahan login karein.
                 </p>
                 
                 <div className="space-y-4">
                    <Link
                      to="/traveller/login"
                      className="block w-full py-4 px-6 bg-sky-600 text-white rounded-xl font-bold shadow-lg shadow-sky-200 hover:bg-sky-700 hover:-translate-y-1 transition-all duration-200"
                    >
                      Login Dashboard
                    </Link>

                    <Link
                      to="/traveller/register"
                      className="block w-full py-4 px-6 bg-white text-sky-700 border-2 border-sky-100 rounded-xl font-bold hover:bg-sky-50 hover:border-sky-200 transition-all duration-200"
                    >
                      New Agency Reg.
                    </Link>
                 </div>

                 <p className="mt-6 text-xs text-slate-400">
                   Helpline: <span className="font-bold text-sky-600">1800-TRAVEL-IN</span>
                 </p>
              </div>

              {/* Status Card */}
              <div className="bg-slate-800 rounded-2xl p-6 text-slate-300 shadow-lg border-l-4 border-sky-500">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                   <MapPin size={18} className="text-sky-400"/> 
                   Live Updates
                </h4>
                <div className="space-y-3 text-sm">
                   <div className="flex justify-between border-b border-slate-700 pb-2">
                     <span>Bus Service</span>
                     <span className="text-green-400">● Running</span>
                   </div>
                   <div className="flex justify-between border-b border-slate-700 pb-2">
                     <span>Road Conditions</span>
                     <span className="text-yellow-400">● Moderate</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Weather</span>
                     <span className="text-sky-400">☁️ Clear</span>
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
          🌾 Gramin Seva Portal — Safe Travel, Strong Villages
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

/* REUSABLE TRAVELLER CARD */
function TravellerCard({ title, img, desc, list }) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full">
      {/* Image */}
      <div className="h-44 overflow-hidden relative">
        <img 
          src={img} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        <h3 className="absolute bottom-3 left-4 text-white text-lg font-bold drop-shadow-md">{title}</h3>
      </div>
      
      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <p className="text-slate-600 text-sm mb-4 font-medium leading-relaxed">{desc}</p>
        <ul className="space-y-2 mt-auto pt-3 border-t border-slate-50">
          {list.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0"></span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}