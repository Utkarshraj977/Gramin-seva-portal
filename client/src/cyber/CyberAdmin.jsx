import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Monitor, FileText, CheckCircle2 } from "lucide-react";

// 1. Hero Images specific to Cyber/Digital Seva
const heroImages = [
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop", // Computer/Typing
  "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop", // Documents/Work
  "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop", // Digital Village Concept
];

export default function CyberAdmin() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Slideshow Logic
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3000);
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
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/90 via-black/60 to-slate-900/90"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-100 text-sm font-semibold mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Digital India Mission
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-xl animate-fade-in-up delay-100">
            Cyber Admin <span className="text-emerald-400">Portal</span>
          </h1>
          
          <p className="text-lg md:text-xl text-emerald-50 font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Gaon ke nagrikon ke liye <span className="text-white font-bold">Online Forms, Sarkari Yojna</span> aur <span className="text-white font-bold">Digital Documents</span> ka bharosemand kendr.
          </p>
        </div>

        {/* Bottom Wave (Matches Home) */}
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
            <div className="bg-white rounded-2xl p-8 shadow-sm border-l-4 border-emerald-500 flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full shrink-0">
                 <Monitor size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Cyber Admin ka Role</h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Cyber Admin gaon aur sarkar ke beech ek digital pul (bridge) hai. Aapka kaam computer ke madhyam se nagrikon ke liye
                  <span className="font-semibold text-emerald-700 mx-1">online forms bharna</span>, 
                  <span className="font-semibold text-emerald-700 mx-1">Aadhaar/PAN update</span> 
                  aur <span className="font-semibold text-emerald-700 mx-1">documents print</span> karna hai.
                </p>
              </div>
            </div>

            {/* 2. SERVICES GRID */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">🗂️ Cyber Seva ke Prakar</h2>
                <div className="h-1 flex-grow bg-slate-200 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CyberCard
                  title="🆔 Aadhaar Services"
                  img="https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=500&q=80"
                  desc="Aadhaar update, correction aur linking."
                  list={["Aadhaar Correction", "Mobile / Address Update", "Aadhaar Linking"]}
                />
                <CyberCard
                  title="💳 PAN Card Services"
                  img="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=500&q=80"
                  desc="PAN card apply aur correction."
                  list={["New PAN Apply", "PAN Correction", "PAN–Aadhaar Link"]}
                />
                <CyberCard
                  title="🎓 Scholarship Forms"
                  img="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=500&q=80"
                  desc="Students ke liye scholarship yojna."
                  list={["Pre-Matric", "Post-Matric", "Minority Scholarship"]}
                />
                <CyberCard
                  title="🏠 Awas Yojana"
                  img="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80"
                  desc="PM Awas Yojana aur housing schemes."
                  list={["Awas Apply", "Status Check", "Document Upload"]}
                />
              </div>
            </div>

            {/* 3. GUIDELINES */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
               <h2 className="text-xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                 <FileText size={24} />
                 Guidelines (Niyam)
               </h2>
               <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   "Nagrik ke documents dhyan se verify karein",
                   "Fake data ya galat entry se bachein",
                   "Receipt / Slip dena anivarya hai",
                   "User data secure rakhein",
                   "Sarkari fees se zyada charge na karein"
                 ].map((item, i) => (
                   <li key={i} className="flex items-start gap-3 text-amber-900 font-medium">
                     <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
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
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                 
                 <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">🔐</span>
                 </div>
                 
                 <h3 className="text-2xl font-bold text-slate-800">Admin Login</h3>
                 <p className="text-slate-500 text-sm mt-2 mb-8">
                   Registered Cyber Centers aur Lok Seva Kendra sanchalak yahan login karein.
                 </p>
                 
                 <div className="space-y-4">
                    <Link
                      to="login"
                      className="block w-full py-4 px-6 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all duration-200"
                    >
                      Login Dashboard
                    </Link>

                    <Link
                      to="register"
                      className="block w-full py-4 px-6 bg-white text-emerald-700 border-2 border-emerald-100 rounded-xl font-bold hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-200"
                    >
                      New Registration
                    </Link>
                 </div>

                 <p className="mt-6 text-xs text-slate-400">
                   Technical Issue? Call <span className="font-bold text-emerald-600">1800-123-4567</span>
                 </p>
              </div>

              {/* Quick Info Card */}
              <div className="bg-slate-900 rounded-2xl p-6 text-slate-300 shadow-lg">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                   <Monitor size={18} className="text-emerald-400"/> 
                   System Status
                </h4>
                <div className="space-y-3 text-sm">
                   <div className="flex justify-between">
                     <span>Server</span>
                     <span className="text-emerald-400">● Online</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Aadhaar API</span>
                     <span className="text-emerald-400">● Connected</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Form Portal</span>
                     <span className="text-yellow-400">● Slow</span>
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
          🌾 Gramin Seva Portal — Digital Empowerment for Villages
        </p>
      </footer>

      {/* CSS Animations (Same as Home) */}
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

/* REUSABLE CYBER CARD */
function CyberCard({ title, img, desc, list }) {
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
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}