import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { 
  ArrowRight, Stethoscope, GraduationCap, Monitor, 
  Scale, Bus, CheckCircle2, Zap, Droplets, 
  FileText 
} from "lucide-react";

// 1. Define the images for the slideshow
const heroImages = [
  "https://images.unsplash.com/photo-1536679545597-c2e5e1946495?q=80&w=2069&auto=format&fit=crop", // 1. Lush Green Village (General)
  "https://images.unsplash.com/photo-1589877505343-69cb2546d803?q=80&w=2070&auto=format&fit=crop", // 2. Farmer/Agriculture
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop", // 3. Health/Doctor
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop", // 4. Education/Kids
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop", // 5. Digital Services/Computer
];

export default function Home() {
  // 2. State to track current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 3. Setup timer to change image every 2 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        // Increment index, loop back to 0 at the end (%)
        (prevIndex + 1) % heroImages.length
      );
    }, 2500); // Changed to 2.5s for a slightly better pace

    // Cleanup timer on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-gray-800">

      {/* --- HERO SECTION --- */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Changing Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-[background-image] duration-700 ease-in-out"
          style={{
            // Use the image based on current index
            backgroundImage: `url('${heroImages[currentImageIndex]}')`,
          }}
        >
          {/* Professional Overlay - Slightly darker for better text readability across different images */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/90 via-black/50 to-emerald-900/90"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-100 text-sm font-semibold mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Digital India Initiative
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-xl animate-fade-in-up delay-100">
            Gramin Seva <span className="text-amber-400">Portal</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-emerald-50 font-medium max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
            Gaon ke vikas ke liye ek digital manch — 
            <span className="font-bold text-white"> Shiksha, Swasthya, Seva aur Nyay</span>
          </p>

          <div className="animate-fade-in-up delay-300">
            <NavLink 
              to="/services" 
              className="group inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-bold rounded-full shadow-xl hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-1"
            >
              Explore Services
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </NavLink>
          </div>
        </div>

        {/* Hero Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
           <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
               <path d="M1200,0H0V120H281.94C572.9,116.24,602.45,3.86,736.48,7.23c135.34,3.4,284.64,24.33,463.52,24.33Z" className="fill-[#f8fafc]"></path>
           </svg>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            🌾 Gramin Seva kya hai?
          </h2>
          <div className="h-1.5 w-24 bg-amber-500 mx-auto rounded-full mb-8"></div>
          
          <p className="text-lg md:text-xl text-gray-600 leading-loose">
            Gramin Seva Portal gaon ke logon ke liye banaya gaya ek <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Digital Platform</span> hai.
            Yahan aapko <span className="font-semibold text-gray-900">Doctor, Education, Cyber Services, Complaints</span> aur sarkari yojna se judi saari jaankari ek hi surakshit jagah par milti hai.
          </p>
        </div>
      </section>

      {/* --- SERVICES PREVIEW --- */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">🛠️ Hamari Pramukh Sevaayein</h2>
            <p className="text-gray-500 mt-2">Sabhi suvidhayein ab aapke phone par</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <ServiceCard icon={Stethoscope} title="Doctor & Health" color="text-red-500" bg="bg-red-50" />
            <ServiceCard icon={GraduationCap} title="Education" color="text-blue-500" bg="bg-blue-50" />
            <ServiceCard icon={Monitor} title="Cyber Services" color="text-purple-500" bg="bg-purple-50" />
            <ServiceCard icon={Scale} title="Complaint System" color="text-orange-500" bg="bg-orange-50" />
            <ServiceCard icon={Bus} title="Traveller Support" color="text-emerald-500" bg="bg-emerald-50" />
          </div>
        </div>
      </section>

      {/* --- TRUST FACTORS --- */}
      <section className="py-20 px-6 bg-[#f0fdf4]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            
            {/* Left Content */}
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 leading-tight">
                🤝 Gramin Seva par <br/><span className="text-emerald-600">bharosa kyun?</span>
              </h2>
              <p className="text-gray-600 mb-8">
                Humara lakshya hai gaon ko taknik se jodna aur beech ke dalalon (middlemen) ko hatana.
              </p>
              
              <div className="space-y-4">
                <TrustItem text="Dalal-free digital seva" />
                <TrustItem text="Gaon ke liye banaya gaya system" />
                <TrustItem text="Verified admin aur services" />
                <TrustItem text="Direct block / district tak pahunch" />
                <TrustItem text="Transparent aur safe platform" />
              </div>
            </div>

            {/* Right Image/Visual */}
            <div className="md:w-1/2 relative">
               <div className="absolute -inset-4 bg-emerald-200 rounded-full blur-3xl opacity-30"></div>
               <img 
                 src="https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=2076&auto=format&fit=crop" 
                 alt="Trust" 
                 className="relative rounded-2xl shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500"
               />
            </div>
          </div>
        </div>
      </section>

      {/* --- PROBLEM & SOLUTION --- */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          🚨 Gaon ki Samasyaayein – <span className="text-emerald-600">Hamara Solution</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
           <SolutionCard 
              problem="Bijli bar-bar jana" 
              solution="Online complaint register karein" 
              icon={Zap} 
           />
           <SolutionCard 
              problem="Pani time par nahi" 
              solution="Direct Adhikari ko report karein" 
              icon={Droplets} 
           />
           <SolutionCard 
              problem="Doctor ki jankari nahi" 
              solution="Verified Doctors ki list dekhein" 
              icon={Stethoscope} 
           />
           <SolutionCard 
              problem="Sarkari form bharna mushkil" 
              solution="Cyber support se madat lein" 
              icon={FileText} 
           />
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 bg-gradient-to-br from-emerald-900 to-green-800 text-center px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Gaon ka vikas, sabke saath
          </h2>
          <p className="text-emerald-100 text-lg mb-10">
            Gramin Seva Portal ka uddeshya hai gaon ke har nagrik tak sahi seva pahunchana. Aaj hi judiye.
          </p>
          <NavLink 
            to="/register" 
            className="inline-block px-10 py-4 bg-white text-emerald-800 font-bold rounded-full shadow-2xl hover:bg-emerald-50 hover:scale-105 transition-transform"
          >
            Join Now
          </NavLink>
        </div>
      </section>

      {/* Animations */}
      <style>{`
        .animate-fade-in-up { animation: fadeInUp 1s ease-out forwards; opacity: 0; }
        .delay-100 { animation-delay: 0.2s; }
        .delay-200 { animation-delay: 0.4s; }
        .delay-300 { animation-delay: 0.6s; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ServiceCard({ icon: Icon, title, color, bg }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
      <div className={`p-4 rounded-full ${bg} ${color} mb-4 group-hover:scale-110 transition-transform`}>
        <Icon size={32} />
      </div>
      <h3 className="font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">{title}</h3>
    </div>
  );
}

function TrustItem({ text }) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
      <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
        <CheckCircle2 size={16} />
      </div>
      <span className="font-medium text-gray-700">{text}</span>
    </div>
  );
}

function SolutionCard({ problem, solution, icon: Icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-emerald-500 flex items-center gap-4 hover:shadow-lg transition-shadow">
      <div className="p-3 bg-gray-100 rounded-full text-gray-600">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-red-500 font-medium text-sm mb-1">❌ {problem}</p>
        <p className="text-emerald-700 font-bold text-lg">✔ {solution}</p>
      </div>
    </div>
  );
}
