import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Monitor, CreditCard, FileText, Printer, Wifi, HelpCircle, Shield } from "lucide-react";

// 1. Hero Images specific to Digital Citizens
const heroImages = [
  "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=2070&auto=format&fit=crop", // Digital Village
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop", // Typing/Form
  "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop", // Internet/Connection
];

export default function CyberUser() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Slideshow Logic
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-[#f3f4f6] min-h-screen font-sans text-slate-800">
      
      {/* --- HERO SECTION (USER THEME) --- */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Changing Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-[background-image] duration-1000 ease-in-out"
          style={{ backgroundImage: `url('${heroImages[currentImageIndex]}')` }}
        >
          {/* Violet Overlay for Digital/Future Theme */}
          <div className="absolute inset-0 bg-gradient-to-b from-violet-900/90 via-black/50 to-slate-900/90"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-violet-100 text-sm font-semibold mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
            Digital India, Saksham Gaon
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-xl animate-fade-in-up delay-100">
            Digital Nagrik <span className="text-violet-400">Portal</span>
          </h1>
          
          <p className="text-lg md:text-xl text-violet-50 font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Ghar baithe <span className="text-white font-bold">Sarkari Yojna</span>, <span className="text-white font-bold">Online Form</span> aur <span className="text-white font-bold">Digital Certificates</span> banwayein.
          </p>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
           <svg className="relative block w-full h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
               <path d="M1200,0H0V120H281.94C572.9,116.24,602.45,3.86,736.48,7.23c135.34,3.4,284.64,24.33,463.52,24.33Z" className="fill-[#f3f4f6]"></path>
           </svg>
        </div>
      </section>

      {/* --- MAIN CONTENT LAYOUT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: CONTENT (Span 2) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* 1. ROLE SECTION */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-l-4 border-violet-500 flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="p-4 bg-violet-50 text-violet-600 rounded-full shrink-0">
                 <Wifi size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Digital Seva ka Upyog</h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Yah portal gaon ke nagrikon ko digital duniya se jodta hai. Yahan aap 
                  <span className="font-semibold text-violet-700 mx-1">Jati/Niwas Praman Patra</span>, 
                  <span className="font-semibold text-violet-700 mx-1">Pension</span> aur 
                  <span className="font-semibold text-violet-700 mx-1">Banking</span> suvidhaon ka labh le sakte hain.
                </p>
              </div>
            </div>

            {/* 2. USER SERVICES GRID */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">💻 Online Suvidhayein (Services)</h2>
                <div className="h-1 flex-grow bg-violet-100 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ServiceCard
                  title="Online Certificates"
                  img="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=500&q=80"
                  desc="Jati, Aay, Niwas praman patra ke liye aavedan karein."
                  list={["Income Certificate", "Caste Certificate", "Domicile Certificate"]}
                  icon={<FileText size={16} />}
                />
                <ServiceCard
                  title="Banking & Finance"
                  img="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=500&q=80"
                  desc="PM Kisan, DBT aur account balance check karein."
                  list={["Aadhaar Payment (AEPS)", "Money Transfer", "PM Kisan Samman Nidhi"]}
                  icon={<CreditCard size={16} />}
                />
                <ServiceCard
                  title="Job & Exam Form"
                  img="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=80"
                  desc="Sarkari naukri aur exam ke online form bharein."
                  list={["Govt Job Apply", "Admit Card Download", "Result Check"]}
                  icon={<Monitor size={16} />}
                />
                <ServiceCard
                  title="Print & Scan Center"
                  img="https://images.unsplash.com/photo-1562564055-71e051d33c19?auto=format&fit=crop&w=500&q=80"
                  desc="Nazdiki CSC center par document print karwayein."
                  list={["Color Xerox", "Photo Print", "Lamination"]}
                  icon={<Printer size={16} />}
                />
              </div>
            </div>

            {/* 3. DIGITAL AWARENESS & TIPS */}
            <div className="grid md:grid-cols-2 gap-6">
               {/* Digital Literacy */}
               <div className="bg-white border border-violet-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-violet-900 mb-4 flex items-center gap-2">
                    <Monitor size={20} /> Digital Saksharta
                  </h3>
                  <ul className="space-y-3">
                     {[
                       "Computer Basic Course (PMGDISHA)",
                       "Mobile Banking seekhein",
                       "Email ID banana seekhein",
                       "Online Bill Payment karein"
                     ].map((item, i) => (
                       <li key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                         <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                         {item}
                       </li>
                     ))}
                  </ul>
               </div>

               {/* Fraud Awareness */}
               <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-violet-800 mb-4 flex items-center gap-2">
                    <Shield size={20} /> Savdhaan Rahein
                  </h3>
                  <ul className="space-y-3">
                     {[
                       "OTP kisi ke sath share na karein",
                       "Anjan link par click na karein",
                       "Fake call se bachein",
                       "Sirf verified website use karein"
                     ].map((item, i) => (
                       <li key={i} className="flex items-center gap-2 text-sm text-violet-900 font-medium">
                         <span className="w-1.5 h-1.5 rounded-full bg-violet-600"></span>
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
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-violet-100 text-center relative overflow-hidden group">
                 {/* Top Accent Line */}
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-400 to-violet-600"></div>
                 
                 <div className="bg-violet-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">🧑‍💻</span>
                 </div>
                 
                 <h3 className="text-2xl font-bold text-slate-800">User Login</h3>
                 <p className="text-slate-500 text-sm mt-2 mb-8">
                   Apne application status aur documents track karne ke liye login karein.
                 </p>
                 
                 <div className="space-y-4">
                    <Link
                      to="/login"
                      className="block w-full py-4 px-6 bg-violet-600 text-white rounded-xl font-bold shadow-lg shadow-violet-200 hover:bg-violet-700 hover:-translate-y-1 transition-all duration-200"
                    >
                      Login karein
                    </Link>

                    <Link
                      to="/register"
                      className="block w-full py-4 px-6 bg-white text-violet-700 border-2 border-violet-100 rounded-xl font-bold hover:bg-violet-50 hover:border-violet-200 transition-all duration-200"
                    >
                      Naya Account Banayein
                    </Link>
                 </div>

                 <p className="mt-6 text-xs text-slate-400">
                   Help Desk: <span className="font-bold text-violet-600">support@digitalgaon.in</span>
                 </p>
              </div>

              {/* Help Desk Card */}
              <div className="bg-violet-900 rounded-2xl p-6 text-violet-50 shadow-lg border-l-4 border-violet-400">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                   <HelpCircle size={18} className="text-violet-300"/> 
                   Kya Aap Jante Hain?
                </h4>
                <p className="text-sm text-violet-100 leading-relaxed">
                  "DigiLocker app par aap apne documents jaise Aadhaar, License aur Marksheet digital roop me rakh sakte hain."
                </p>
                <div className="mt-4 pt-3 border-t border-violet-800 flex justify-between text-xs">
                   <span>Source: <span className="text-green-400">Govt of India</span></span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-center border-t border-slate-800">
        <p className="font-medium tracking-wide">
          🌾 Gramin Seva Portal — Digital Literacy for Every Village
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
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-violet-50 flex flex-col h-full">
      {/* Image */}
      <div className="h-44 overflow-hidden relative">
        <img 
          src={img} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-violet-900/80 to-transparent"></div>
        <h3 className="absolute bottom-3 left-4 text-white text-lg font-bold drop-shadow-md flex items-center gap-2">
            {title}
        </h3>
      </div>
      
      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <p className="text-slate-600 text-sm mb-4 font-medium leading-relaxed">{desc}</p>
        <ul className="space-y-2 mt-auto pt-3 border-t border-violet-50">
          {list.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
              <span className="text-violet-500">{icon}</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}