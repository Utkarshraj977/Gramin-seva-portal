import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Stethoscope, Activity, Building2, ShieldPlus, HeartPulse, FileBadge } from "lucide-react";

// 1. Hero Images specific to Medical/Health
const heroImages = [
  "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2091&auto=format&fit=crop", // Doctor with patient
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop", // Hospital Hallway
  "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop", // Medical Tools
];

export default function DoctorAdmin() {
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
          {/* Teal Overlay for Medical Theme */}
          <div className="absolute inset-0 bg-gradient-to-b from-teal-900/90 via-black/50 to-slate-900/90"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-100 text-sm font-semibold mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            Swasth Gramin, Samriddh Gramin
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-xl animate-fade-in-up delay-100">
            Doctor Admin <span className="text-teal-400">Panel</span>
          </h1>
          
          <p className="text-lg md:text-xl text-teal-50 font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Gaon ke <span className="text-white font-bold">Doctor, Clinic</span> aur <span className="text-white font-bold">Hospital</span> ke liye sahi niyam, suraksha aur seva margdarshan.
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
            <div className="bg-white rounded-2xl p-8 shadow-sm border-l-4 border-teal-500 flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="p-4 bg-teal-50 text-teal-600 rounded-full shrink-0">
                 <Stethoscope size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Doctor Admin ka Role</h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Doctor Admin ka kaam hota hai gaon aur aas-paas ke 
                  <span className="font-semibold text-teal-700 mx-1">Local Doctors</span>, 
                  <span className="font-semibold text-teal-700 mx-1">Medical Stores</span> aur 
                  <span className="font-semibold text-teal-700 mx-1">Hospitals</span> 
                  ko verify karna. Hum unki qualification aur patient safety ensure karte hain.
                </p>
              </div>
            </div>

            {/* 2. MEDICAL SERVICES GRID */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">🏥 Medical Seva ke Prakar</h2>
                <div className="h-1 flex-grow bg-slate-200 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DoctorCard
                  title="Local Doctor"
                  img="https://images.unsplash.com/photo-1600959907703-125ba1374c17?auto=format&fit=crop&w=500&q=80"
                  desc="Gaon me basic treatment dene wale doctor."
                  list={["MBBS / BAMS / BHMS", "State Registration", "Clinic Proof"]}
                />
                <DoctorCard
                  title="Private Clinic"
                  img="https://images.unsplash.com/photo-1580281657521-6c8b47f86b3c?auto=format&fit=crop&w=500&q=80"
                  desc="Personal ya family clinic setup."
                  list={["Doctor Registration", "Clinic Registration", "Waste Agreement"]}
                />
                <DoctorCard
                  title="Pharmacy / Store"
                  img="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=500&q=80"
                  desc="Dawai aur medical supplies."
                  list={["D.Pharm / B.Pharm", "Drug License", "Cold Storage"]}
                />
                <DoctorCard
                  title="Nursing Home"
                  img="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=500&q=80"
                  desc="Indoor patient & emergency treatment."
                  list={["Hospital Reg.", "Qualified Staff", "Emergency Ward"]}
                />
              </div>
            </div>

            {/* 3. QUALIFICATIONS & RULES */}
            <div className="grid md:grid-cols-2 gap-6">
               {/* Qualifications */}
               <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-teal-900 mb-4 flex items-center gap-2">
                    <FileBadge size={20} /> Doctor Qualification
                  </h3>
                  <ul className="space-y-3">
                     {[
                       "MBBS: NMC Registration",
                       "Ayush: State Council Reg.",
                       "Specialist: PG Degree",
                       "Regular License Renewal"
                     ].map((item, i) => (
                       <li key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                         <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                         {item}
                       </li>
                     ))}
                  </ul>
               </div>

               {/* Hospital Rules */}
               <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <ShieldPlus size={20} /> Hospital Rules
                  </h3>
                  <ul className="space-y-3">
                     {[
                       "Hygienic Environment",
                       "Emergency Equipment",
                       "Bio-waste Management",
                       "Fire Safety Backup"
                     ].map((item, i) => (
                       <li key={i} className="flex items-center gap-2 text-sm text-blue-900 font-medium">
                         <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
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
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center relative overflow-hidden group">
                 {/* Top Accent Line */}
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-teal-600"></div>
                 
                 <div className="bg-teal-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">🔐</span>
                 </div>
                 
                 <h3 className="text-2xl font-bold text-slate-800">Secure Access</h3>
                 <p className="text-slate-500 text-sm mt-2 mb-8">
                   Registered doctors aur hospital admins ke liye login portal.
                 </p>
                 
                 <div className="space-y-4">
                    <Link
                      to="/login"
                      className="block w-full py-4 px-6 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-200 hover:bg-teal-700 hover:-translate-y-1 transition-all duration-200"
                    >
                      Login Dashboard
                    </Link>

                    <Link
                      to="/register"
                      className="block w-full py-4 px-6 bg-white text-teal-700 border-2 border-teal-100 rounded-xl font-bold hover:bg-teal-50 hover:border-teal-200 transition-all duration-200"
                    >
                      New Registration
                    </Link>
                 </div>

                 <p className="mt-6 text-xs text-slate-400">
                   Emergency Help? Call <span className="font-bold text-teal-600">108 / 102</span>
                 </p>
              </div>

              {/* Status Card */}
              <div className="bg-slate-800 rounded-2xl p-6 text-slate-300 shadow-lg border-l-4 border-teal-500">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                   <HeartPulse size={18} className="text-teal-400"/> 
                   Health Alert
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Mosami bimariyon (Seasonal Flu) se bachne ke liye saaf-safai rakhein aur ubla pani piyein.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-700 flex justify-between text-xs">
                   <span>Status: <span className="text-green-400">Normal</span></span>
                   <span className="text-slate-500">Updated: Today</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-center border-t border-slate-800">
        <p className="font-medium tracking-wide">
          🌾 Gramin Seva Portal — Healthy Villages, Strong Nation
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

/* REUSABLE DOCTOR CARD */
function DoctorCard({ title, img, desc, list }) {
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
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0"></span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}