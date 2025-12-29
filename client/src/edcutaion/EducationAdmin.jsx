import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, BookOpen, School, CheckCircle2, AlertCircle } from "lucide-react";

// 1. Hero Images specific to Education
const heroImages = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop", // University/Graduation
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop", // Classroom/Kids
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop", // Library/Books
];

export default function EducationAdmin() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Slideshow Logic
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3500); // Slightly slower change for reading comfort
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
          {/* Indigo Overlay for Academic Look */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/90 via-black/60 to-slate-900/90"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 text-sm font-semibold mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Shiksha Sashaktikaran Abhiyan
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-xl animate-fade-in-up delay-100">
            Education Admin <span className="text-indigo-400">Panel</span>
          </h1>
          
          <p className="text-lg md:text-xl text-indigo-50 font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Gaon ke <span className="text-white font-bold">Schools, Coaching</span> aur <span className="text-white font-bold">Colleges</span> ke liye sahi margdarshan aur digital verification system.
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
            <div className="bg-white rounded-2xl p-8 shadow-sm border-l-4 border-indigo-500 flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full shrink-0">
                 <GraduationCap size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Education Admin ka Role</h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Education Admin ka mukhya kaam gaon aur aas-paas ke 
                  <span className="font-semibold text-indigo-700 mx-1">School</span>, 
                  <span className="font-semibold text-indigo-700 mx-1">Coaching</span> aur 
                  <span className="font-semibold text-indigo-700 mx-1">Colleges</span> 
                  ki manyata (recognition) verify karna aur shiksha ki gunwatta (quality) ko sudharna hai.
                </p>
              </div>
            </div>

            {/* 2. INSTITUTION TYPES GRID */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">🏫 Shikshan Sanstha ke Prakar</h2>
                <div className="h-1 flex-grow bg-slate-200 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EduCard
                  title="Primary / Middle School"
                  img="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=500&q=80"
                  desc="Class 1 se 8 tak ki basic shiksha."
                  list={["State Board Recognition", "Qualified Teachers", "Basic Infrastructure"]}
                />
                <EduCard
                  title="High School / Inter"
                  img="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=500&q=80"
                  desc="Class 9 se 12 tak ki shiksha."
                  list={["Board Affiliation", "Subject Wise Faculty", "Lab & Library"]}
                />
                <EduCard
                  title="Coaching Institute"
                  img="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=500&q=80"
                  desc="Competitive aur academic coaching."
                  list={["Registration Certificate", "Experienced Faculty", "Student Records"]}
                />
                <EduCard
                  title="Degree College"
                  img="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=500&q=80"
                  desc="Higher education aur degree courses."
                  list={["University Approval", "Qualified Professors", "Campus Facilities"]}
                />
              </div>
            </div>

            {/* 3. GUIDELINES (Split into Cards) */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Teacher Qualification */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                   <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                     <BookOpen size={20} /> Teacher Qualification
                   </h3>
                   <ul className="space-y-3">
                     {[
                       "Primary: D.El.Ed / BTC",
                       "High School: B.Ed + Grad",
                       "Inter: B.Ed + Post Grad",
                       "Coaching: Subject Expert"
                     ].map((item, i) => (
                       <li key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                         <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                         {item}
                       </li>
                     ))}
                   </ul>
                </div>

                {/* School Requirements */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
                   <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                     <School size={20} /> School Requirements
                   </h3>
                   <ul className="space-y-3">
                     {[
                       "Safe & Hygienic Building",
                       "Separate Toilets (Boys/Girls)",
                       "Clean Drinking Water",
                       "Playground Area",
                     ].map((item, i) => (
                       <li key={i} className="flex items-center gap-2 text-sm text-amber-900 font-medium">
                         <CheckCircle2 size={16} className="text-amber-600"/>
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
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-400 to-indigo-600"></div>
                 
                 <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">🔐</span>
                 </div>
                 
                 <h3 className="text-2xl font-bold text-slate-800">Institute Login</h3>
                 <p className="text-slate-500 text-sm mt-2 mb-8">
                   Registered School / Coaching Admins yahan login karein.
                 </p>
                 
                 <div className="space-y-4">
                    <Link
                      to="/login"
                      className="block w-full py-4 px-6 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-200"
                    >
                      Login Dashboard
                    </Link>

                    <Link
                      to="/register"
                      className="block w-full py-4 px-6 bg-white text-indigo-700 border-2 border-indigo-100 rounded-xl font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200"
                    >
                      New Institute Reg.
                    </Link>
                 </div>

                 <p className="mt-6 text-xs text-slate-400">
                   Support Email: <span className="font-bold text-indigo-600">edu-help@graminseva.in</span>
                 </p>
              </div>

              {/* Status/Notice Card */}
              <div className="bg-indigo-900 rounded-2xl p-6 text-indigo-100 shadow-lg">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                   <AlertCircle size={18} className="text-indigo-400"/> 
                   Important Notice
                </h4>
                <p className="text-sm text-indigo-200 leading-relaxed">
                  Sabhi schools ko 31st March tak apne student records aur scholarship data update karna anivarya hai.
                </p>
                <div className="mt-4 pt-3 border-t border-indigo-800 text-xs text-indigo-400 font-mono">
                  Ref: EDU/2024/UPD-05
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-center border-t border-slate-800">
        <p className="font-medium tracking-wide">
          🌾 Gramin Seva Portal — Strong Education, Strong Villages
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

/* REUSABLE EDU CARD */
function EduCard({ title, img, desc, list }) {
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
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}