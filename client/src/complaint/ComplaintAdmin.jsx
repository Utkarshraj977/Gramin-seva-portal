import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Zap, Droplets, Map, FileText, BadgeAlert, AlertTriangle, Construction } from "lucide-react";

// 1. Hero Images specific to Complaints/Issues
const heroImages = [
  "https://images.unsplash.com/photo-1555374018-13a8994d5056?q=80&w=2064&auto=format&fit=crop", // Meeting/Discussion
  "https://images.unsplash.com/photo-1590053896435-950c05335035?q=80&w=2071&auto=format&fit=crop", // Rural Road/Infra
  "https://images.unsplash.com/photo-1526304640152-d4619684e484?q=80&w=2070&auto=format&fit=crop", // Official/Paperwork
];

export default function ComplaintAdmin() {
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
          {/* Rose/Red Overlay for Alert Theme */}
          <div className="absolute inset-0 bg-gradient-to-b from-rose-900/90 via-black/50 to-slate-900/90"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-rose-100 text-sm font-semibold mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            Gramin Shikayat Nivaran
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-xl animate-fade-in-up delay-100">
            Complaint Admin <span className="text-rose-400">Panel</span>
          </h1>
          
          <p className="text-lg md:text-xl text-rose-50 font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Gaon ki har samasya — <span className="text-white font-bold">Bhrashtachar, Bijli, Sadak</span> — seedhe prashasan tak pahunchane ka madhyam.
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
            <div className="bg-white rounded-2xl p-8 shadow-sm border-l-4 border-rose-500 flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="p-4 bg-rose-50 text-rose-600 rounded-full shrink-0">
                 <ShieldAlert size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Complaint Admin ka Role</h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Complaint Admin ka kaam hota hai gaon me hone wali samasyaon ko receive karna, verify karna aur 
                  <span className="font-semibold text-rose-700 mx-1">sahi adhikari</span> tak pahunchana. 
                  Ye system gaon aur sarkar ke beech <span className="font-semibold text-rose-700 mx-1">transparency</span> banaye rakhta hai.
                </p>
              </div>
            </div>

            {/* 2. COMPLAINT TYPES GRID */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">🚨 Major Samasyaayein</h2>
                <div className="h-1 flex-grow bg-slate-200 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ComplaintCard
                  title="Pradhan / Neta"
                  icon={BadgeAlert}
                  desc="Gaon ke pradhan ya neta dwara bhrashtachar."
                  list={["Vikas ka paisa galat jagah", "Adhura kaam", "Rishwat"]}
                />
                <ComplaintCard
                  title="Bijli Samasya"
                  icon={Zap}
                  desc="Bijli supply se judi gambhir problem."
                  list={["Bar-bar bijli katna", "Low voltage", "Transformer kharab"]}
                />
                <ComplaintCard
                  title="Pani ki Samasya"
                  icon={Droplets}
                  desc="Pine ke pani aur supply issue."
                  list={["Samay par pani nahi", "Ganda pani", "Handpump kharab"]}
                />
                <ComplaintCard
                  title="Sadak / Nali"
                  icon={Map}
                  desc="Infrastructure se judi problem."
                  list={["Sadak tooti", "Nali jam", "Barish me pani bharna"]}
                />
                <ComplaintCard
                  title="Sarkari Yojna"
                  icon={FileText}
                  desc="Awas, ration, pension me ghadbadi."
                  list={["Naam list me nahi", "Galat batwara", "Patra ko labh nahi"]}
                />
                <ComplaintCard
                  title="Anyaay / Police"
                  icon={AlertTriangle}
                  desc="Police ya adhikari ki laaparvahi."
                  list={["FIR na likhna", "Anyaaypurn vyavhar", "Dhamki"]}
                />
              </div>
            </div>

            {/* 3. MINOR COMPLAINTS & ESCALATION */}
            <div className="grid md:grid-cols-2 gap-6">
               {/* Minor Issues */}
               <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-rose-900 mb-4 flex items-center gap-2">
                    <Construction size={20} /> Minor Issues
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                     <span className="text-sm bg-slate-50 p-2 rounded text-slate-700 text-center">Street Light</span>
                     <span className="text-sm bg-slate-50 p-2 rounded text-slate-700 text-center">Awara Pashu</span>
                     <span className="text-sm bg-slate-50 p-2 rounded text-slate-700 text-center">Kachra Safai</span>
                     <span className="text-sm bg-slate-50 p-2 rounded text-slate-700 text-center">Nali Jam</span>
                  </div>
               </div>

               {/* Escalation Ladder */}
               <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-rose-900 mb-4 flex items-center gap-2">
                    <ShieldAlert size={20} /> Escalation Levels
                  </h3>
                  <ul className="space-y-3">
                     <li className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center text-xs font-bold">1</span>
                        <span className="text-sm text-rose-900">Gram / Ward Level</span>
                     </li>
                     <li className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-rose-300 text-rose-800 flex items-center justify-center text-xs font-bold">2</span>
                        <span className="text-sm text-rose-900">Block / Tehsil Level</span>
                     </li>
                     <li className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-rose-400 text-rose-900 flex items-center justify-center text-xs font-bold">3</span>
                        <span className="text-sm text-rose-900">District Magistrate (DM)</span>
                     </li>
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
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 to-rose-600"></div>
                 
                 <div className="bg-rose-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">🚨</span>
                 </div>
                 
                 <h3 className="text-2xl font-bold text-slate-800">Admin Login</h3>
                 <p className="text-slate-500 text-sm mt-2 mb-8">
                   Complaint Nodal Officers yahan login karein.
                 </p>
                 
                 <div className="space-y-4">
                    <Link
                      to="/login"
                      className="block w-full py-4 px-6 bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 hover:-translate-y-1 transition-all duration-200"
                    >
                      Officer Login
                    </Link>

                    <Link
                      to="/register"
                      className="block w-full py-4 px-6 bg-white text-rose-700 border-2 border-rose-100 rounded-xl font-bold hover:bg-rose-50 hover:border-rose-200 transition-all duration-200"
                    >
                      New Volunteer Reg.
                    </Link>
                 </div>

                 <p className="mt-6 text-xs text-slate-400">
                   Anti-Corruption Helpline: <span className="font-bold text-rose-600">1064</span>
                 </p>
              </div>

              {/* Status/Warning Card */}
              <div className="bg-rose-900 rounded-2xl p-6 text-rose-100 shadow-lg">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                   <AlertTriangle size={18} className="text-rose-400"/> 
                   Strict Warning
                </h4>
                <p className="text-sm text-rose-200 leading-relaxed">
                  Jhoothi shikayat (Fake Complaint) karna dandniya apradh hai. Kripya sahi jankari hi upload karein.
                </p>
                <div className="mt-4 pt-3 border-t border-rose-800 text-xs text-rose-400 font-mono">
                  Sec 182 IPC
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-center border-t border-slate-800">
        <p className="font-medium tracking-wide">
          🌾 Gramin Seva Portal — Nyay, Transparency aur Vikas
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

/* REUSABLE COMPLAINT CARD */
function ComplaintCard({ title, icon: Icon, desc, list }) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full">
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center gap-4 mb-4">
           <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
             <Icon size={24} />
           </div>
           <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
        
        <p className="text-slate-600 text-sm mb-4 font-medium leading-relaxed">{desc}</p>
        
        <ul className="space-y-2 mt-auto pt-3 border-t border-slate-50">
          {list.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0"></span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}