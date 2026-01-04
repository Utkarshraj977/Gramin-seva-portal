import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Search, Award, Laptop, FileText, Bell, Book } from "lucide-react";

// 1. Hero Images specific to Students/Learning
const heroImages = [
  "https://images.unsplash.com/photo-1427504494785-3a9ca2801561?q=80&w=2070&auto=format&fit=crop", // Library Study
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop", // Group Study
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop", // Exam/Writing
];

export default function StudentUser() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Slideshow Logic
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-[#f0f9ff] min-h-screen font-sans text-slate-800">
      
      {/* --- HERO SECTION (STUDENT THEME) --- */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Changing Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-[background-image] duration-1000 ease-in-out"
          style={{ backgroundImage: `url('${heroImages[currentImageIndex]}')` }}
        >
          {/* Sky Blue Overlay for Aspiration/Openness */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900/90 via-black/50 to-slate-900/90"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sky-100 text-sm font-semibold mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            Padhega India, Tabhi Badhega India
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-xl animate-fade-in-up delay-100">
            Student & Chhatra <span className="text-sky-400">Portal</span>
          </h1>
          
          <p className="text-lg md:text-xl text-sky-50 font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Apne sapne sach karein. <span className="text-white font-bold">Scholarships, Online Classes</span> aur <span className="text-white font-bold">Exam Updates</span> ki sahi jankari yahan payein.
          </p>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
           <svg className="relative block w-full h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
               <path d="M1200,0H0V120H281.94C572.9,116.24,602.45,3.86,736.48,7.23c135.34,3.4,284.64,24.33,463.52,24.33Z" className="fill-[#f0f9ff]"></path>
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
                 <GraduationCap size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Student Portal ka Upyog</h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Yah portal gaon ke vidyarthiyon ke liye ek digital saathi hai. Yahan aap 
                  <span className="font-semibold text-sky-700 mx-1">Study Material</span> download kar sakte hain, 
                  <span className="font-semibold text-sky-700 mx-1">Colleges</span> dhund sakte hain aur sarkari yojnaon ka labh utha sakte hain.
                </p>
              </div>
            </div>

            {/* 2. STUDENT SERVICES GRID */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">🎓 Chhatra Suvidhayein (Services)</h2>
                <div className="h-1 flex-grow bg-sky-100 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ServiceCard
                  title="Find Institute"
                  img="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=500&q=80"
                  desc="Apne nazdiki School, College ya Coaching center khojein."
                  list={["Search by Course", "View Fees Structure", "Check Faculty Info"]}
                  icon={<Search size={16} />}
                />
                <ServiceCard
                  title="Scholarships & Aid"
                  img="https://images.unsplash.com/photo-1607237138186-73d092284922?auto=format&fit=crop&w=500&q=80"
                  desc="Arthik sahayata aur chhatravriti ke liye apply karein."
                  list={["Merit Based", "Need Based Grants", "Application Guide"]}
                  icon={<Award size={16} />}
                />
                <ServiceCard
                  title="Online Classes"
                  img="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80"
                  desc="Ghar baithe expert teachers se padhai karein."
                  list={["Video Lectures", "PDF Notes", "Doubt Clearing"]}
                  icon={<Laptop size={16} />}
                />
                <ServiceCard
                  title="Results & Exams"
                  img="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=500&q=80"
                  desc="Pariksha parinam aur time-table yahan dekhein."
                  list={["Board Results", "Exam Admit Card", "Date Sheet"]}
                  icon={<FileText size={16} />}
                />
              </div>
            </div>

            {/* 3. USEFUL RESOURCES & TIPS */}
            <div className="grid md:grid-cols-2 gap-6">
               {/* Study Resources */}
               <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-sky-900 mb-4 flex items-center gap-2">
                    <Book size={20} /> Padhai ke Sadhan
                  </h3>
                  <ul className="space-y-3">
                     {[
                       "NCERT Books Download",
                       "Previous Year Question Papers",
                       "Competitive Exam Syllabus",
                       "Career Guidance Webinars"
                     ].map((item, i) => (
                       <li key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                         <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                         {item}
                       </li>
                     ))}
                  </ul>
               </div>

               {/* Success Tips */}
               <div className="bg-sky-50 border border-sky-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-sky-800 mb-4 flex items-center gap-2">
                    <Award size={20} /> Safalta ke Sutra
                  </h3>
                  <ul className="space-y-3">
                     {[
                       "Rozana Time-Table banakar padhein",
                       "Notes banana na bhoolein",
                       "Mock Test zarur dein",
                       "Stress free rahein aur healthy khayein"
                     ].map((item, i) => (
                       <li key={i} className="flex items-center gap-2 text-sm text-sky-900 font-medium">
                         <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
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
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-sky-100 text-center relative overflow-hidden group">
                 {/* Top Accent Line */}
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-400 to-sky-600"></div>
                 
                 <div className="bg-sky-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">🧑‍🎓</span>
                 </div>
                 
                 <h3 className="text-2xl font-bold text-slate-800">Student Login</h3>
                 <p className="text-slate-500 text-sm mt-2 mb-8">
                   Apni profile access karne aur scholarship track karne ke liye login karein.
                 </p>
                 
                 <div className="space-y-4">
                    <Link
                      to="login"
                      className="block w-full py-4 px-6 bg-sky-600 text-white rounded-xl font-bold shadow-lg shadow-sky-200 hover:bg-sky-700 hover:-translate-y-1 transition-all duration-200"
                    >
                      Login karein
                    </Link>

                    <Link
                      to="register"
                      className="block w-full py-4 px-6 bg-white text-sky-700 border-2 border-sky-100 rounded-xl font-bold hover:bg-sky-50 hover:border-sky-200 transition-all duration-200"
                    >
                      Naya Registration
                    </Link>
                 </div>

                 <p className="mt-6 text-xs text-slate-400">
                   Forgot Password? <span className="font-bold text-sky-600 cursor-pointer hover:underline">Reset Here</span>
                 </p>
              </div>

              {/* Notice Board Card */}
              <div className="bg-sky-900 rounded-2xl p-6 text-sky-50 shadow-lg border-l-4 border-sky-400">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                   <Bell size={18} className="text-sky-300"/> 
                   Student Notice Board
                </h4>
                <div className="space-y-3">
                  <div className="pb-2 border-b border-sky-800/50">
                    <p className="text-sm text-sky-100 font-medium">📢 Post-Matric Scholarship</p>
                    <p className="text-xs text-sky-400">Last Date: 31st Oct</p>
                  </div>
                  <div>
                    <p className="text-sm text-sky-100 font-medium">📢 Free Laptop Yojna</p>
                    <p className="text-xs text-sky-400">Reg. Opens Soon</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-sky-800 flex justify-between text-xs">
                   <span>Updates: <span className="text-green-400">Live</span></span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-center border-t border-slate-800">
        <p className="font-medium tracking-wide">
          🌾 Gramin Seva Portal — Empowering Youth, Building Future
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
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-sky-50 flex flex-col h-full">
      {/* Image */}
      <div className="h-44 overflow-hidden relative">
        <img 
          src={img} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sky-900/80 to-transparent"></div>
        <h3 className="absolute bottom-3 left-4 text-white text-lg font-bold drop-shadow-md flex items-center gap-2">
            {title}
        </h3>
      </div>
      
      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <p className="text-slate-600 text-sm mb-4 font-medium leading-relaxed">{desc}</p>
        <ul className="space-y-2 mt-auto pt-3 border-t border-sky-50">
          {list.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
              <span className="text-sky-500">{icon}</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}