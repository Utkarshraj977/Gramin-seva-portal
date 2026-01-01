import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Zap, Droplets, Map, FileText, BadgeAlert, AlertTriangle, Send } from "lucide-react";

// 1. Hero Images specific to Public Grievances
const heroImages = [
  "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=2070&auto=format&fit=crop", // Public Meeting
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop", // Discussion
  "https://images.unsplash.com/photo-1590053896435-950c05335035?q=80&w=2071&auto=format&fit=crop", // Damaged Road/Infra
];

export default function ComplaintUser() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Slideshow Logic
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-[#fef2f2] min-h-screen font-sans text-slate-800">
      
      {/* --- HERO SECTION (USER THEME) --- */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Changing Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-[background-image] duration-1000 ease-in-out"
          style={{ backgroundImage: `url('${heroImages[currentImageIndex]}')` }}
        >
          {/* Red Overlay for Urgency/Action */}
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/90 via-black/50 to-slate-900/90"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-red-100 text-sm font-semibold mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Aapki Awaaz, Hamara Prayas
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-xl animate-fade-in-up delay-100">
            Jan Shikayat <span className="text-red-400">Portal</span>
          </h1>
          
          <p className="text-lg md:text-xl text-red-50 font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Apne gaon ki samasya ab seedhe sarkar tak pahunchayein. <span className="text-white font-bold">Bhrashtachar</span> aur <span className="text-white font-bold">Laparwahi</span> ke khilaf awaaz uthayein.
          </p>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
           <svg className="relative block w-full h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
               <path d="M1200,0H0V120H281.94C572.9,116.24,602.45,3.86,736.48,7.23c135.34,3.4,284.64,24.33,463.52,24.33Z" className="fill-[#fef2f2]"></path>
           </svg>
        </div>
      </section>

      {/* --- MAIN CONTENT LAYOUT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: CONTENT (Span 2) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* 1. ROLE SECTION */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-l-4 border-red-500 flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="p-4 bg-red-50 text-red-600 rounded-full shrink-0">
                 <Send size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Shikayat Darj Karein</h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Yah portal aam nagrikon ke liye hai. Yahan aap 
                  <span className="font-semibold text-red-700 mx-1">Sadak, Pani, Bijli</span> ya kisi 
                  <span className="font-semibold text-red-700 mx-1">Sarkari Adhikari</span> ke khilaf shikayat darj kar sakte hain. Aapki pehchan gupt rakhi jayegi.
                </p>
              </div>
            </div>

            {/* 2. COMPLAINT CATEGORIES GRID */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">📝 Kis Tarah ki Shikayat?</h2>
                <div className="h-1 flex-grow bg-red-100 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ComplaintCard
                  title="Report Corruption"
                  icon={BadgeAlert}
                  desc="Rishwat maangna ya fund ka galat upyog."
                  list={["Pradhan / Secretary Complaint", "Ration Dealer Issue", "Awas Yojana Fraud"]}
                />
                <ComplaintCard
                  title="Electricity / Water"
                  icon={Zap}
                  desc="Bijli katauti ya ganda pani supply."
                  list={["No Electricity", "Transformer Burnt", "Handpump Repair"]}
                />
                <ComplaintCard
                  title="Road & Sanitation"
                  icon={Map}
                  desc="Tooti sadak aur gandagi ki samasya."
                  list={["Road Repair Request", "Drainage Blockage", "Garbage Cleaning"]}
                />
                <ComplaintCard
                  title="Police & Crime"
                  icon={ShieldAlert}
                  desc="Kanoon vyavastha aur suraksha."
                  list={["FIR Registration Issue", "Illegal Activities", "Harassment"]}
                />
              </div>
            </div>

            {/* 3. HOW IT WORKS */}
            <div className="bg-white border border-red-100 rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-red-900 mb-6 flex items-center gap-2">
                   <FileText size={24} /> Shikayat Nivaaran Prakriya (Process)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                   <div className="p-4 bg-red-50 rounded-xl">
                      <div className="w-10 h-10 bg-red-200 text-red-800 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">1</div>
                      <h3 className="font-bold text-slate-800 mb-1">Shikayat Karein</h3>
                      <p className="text-sm text-slate-600">Form bharein aur photo upload karein.</p>
                   </div>
                   <div className="p-4 bg-red-50 rounded-xl">
                      <div className="w-10 h-10 bg-red-200 text-red-800 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">2</div>
                      <h3 className="font-bold text-slate-800 mb-1">Jaanch (Verify)</h3>
                      <p className="text-sm text-slate-600">Adhikari mauke par jakar jaanch karenge.</p>
                   </div>
                   <div className="p-4 bg-red-50 rounded-xl">
                      <div className="w-10 h-10 bg-red-200 text-red-800 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">3</div>
                      <h3 className="font-bold text-slate-800 mb-1">Samadhan</h3>
                      <p className="text-sm text-slate-600">Samasya hal hogi aur aapko suchit kiya jayega.</p>
                   </div>
                </div>
            </div>

          </div>

          {/* RIGHT COLUMN: STICKY LOGIN WIDGET (Span 1) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Login Card */}
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 text-center relative overflow-hidden group">
                 {/* Top Accent Line */}
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 to-red-600"></div>
                 
                 <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">📢</span>
                 </div>
                 
                 <h3 className="text-2xl font-bold text-slate-800">User Login</h3>
                 <p className="text-slate-500 text-sm mt-2 mb-8">
                   Apni darj ki gayi shikayat ki sthiti (status) janne ke liye login karein.
                 </p>
                 
                 <div className="space-y-4">
                    <Link
                      to="/login"
                      className="block w-full py-4 px-6 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 hover:-translate-y-1 transition-all duration-200"
                    >
                      Login karein
                    </Link>

                    <Link
                      to="/register"
                      className="block w-full py-4 px-6 bg-white text-red-700 border-2 border-red-100 rounded-xl font-bold hover:bg-red-50 hover:border-red-200 transition-all duration-200"
                    >
                      Nayi Shikayat (Register)
                    </Link>
                 </div>

                 <p className="mt-6 text-xs text-slate-400">
                   CM Helpline Number: <span className="font-bold text-red-600">181 / 1076</span>
                 </p>
              </div>

              {/* Warning Card */}
              <div className="bg-red-900 rounded-2xl p-6 text-red-100 shadow-lg border-l-4 border-red-400">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                   <AlertTriangle size={18} className="text-red-400"/> 
                   Note
                </h4>
                <p className="text-sm text-red-200 leading-relaxed">
                  "Galat ya jhoothi shikayat karne par aapke khilaf karwai ho sakti hai. Saboot ke sath hi shikayat karein."
                </p>
                <div className="mt-4 pt-3 border-t border-red-800 text-xs text-red-400 font-mono">
                   Public Notice
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-center border-t border-slate-800">
        <p className="font-medium tracking-wide">
          🌾 Gramin Seva Portal — Justice for Every Villager
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
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-red-50 flex flex-col h-full">
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
              <Icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
        
        <p className="text-slate-600 text-sm mb-4 font-medium leading-relaxed">{desc}</p>
        
        <ul className="space-y-2 mt-auto pt-3 border-t border-red-50">
          {list.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}