import React from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from '../assets/servicecard';

const Home = () => {
  const services = [
    { title: "Doctor Services", icon: "🩺", desc: "Tele-consultation and appointments with nearby PHC doctors." },
    { title: "Government Schemes", icon: "🏛️", desc: "Information on Awas Yojana, MNREGA, and pension schemes." },
    { title: "Gramin Complaint", icon: "📢", desc: "Direct grievance redressal system for village issues." },
    { title: "Education Helpdesk", icon: "🎓", desc: "Scholarship info and digital literacy resources for students." },
    { title: "Travelling Info", icon: "🚌", desc: "Bus timings, train schedules, and road connectivity updates." },
    { title: "Agriculture", icon: "🌾", desc: "Mandi prices, weather updates, and soil health card details." },
  ];
  
  return (
    <div className="animate-fade-in">
      
      {/* --- HERO SECTION (SAFE VERSION) --- */}
      <section className="relative w-full py-24 px-4 overflow-hidden bg-emerald-900">
        
        {/* Background Image with CSS Animation */}
        <div 
           className="absolute inset-0 z-0 opacity-40 animate-pulse-slow"
           style={{
             backgroundImage: "url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2070&auto=format&fit=crop')",
             backgroundSize: 'cover',
             backgroundPosition: 'center',
           }}
        ></div>

        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-black/30 z-0"></div>
            
        <div className="container mx-auto text-center z-10 relative">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-white drop-shadow-lg">
            Hamara Gaon, <span className="text-amber-400">Hamara Vikas</span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-50 max-w-2xl mx-auto mb-10 font-medium drop-shadow-md">
            One-stop digital portal for healthcare, farming, education, and government services dedicated to rural prosperity.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login">
              <button className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-xl transition transform hover:scale-105 w-full sm:w-auto">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="px-8 py-3 bg-white text-emerald-900 hover:bg-gray-100 font-bold rounded-lg shadow-xl transition transform hover:scale-105 w-full sm:w-auto">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Our Services</h2>
          <div className="h-1 w-24 bg-amber-500 mx-auto mt-2 rounded"></div>
          <p className="text-gray-600 mt-3">Essential facilities available at your fingertips.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              title={service.title}
              icon={service.icon}
              description={service.desc}
            />
          ))}
        </div>
      </section>
      
       {/* --- VISUAL IMAGE SECTION --- */}
       <section className="bg-emerald-50 py-12">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
             <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=800" 
                  alt="Gramin Digital Center" 
                  className="rounded-lg shadow-xl border-4 border-white"
                />
             </div>
             <div className="md:w-1/2 text-left">
                <h3 className="text-2xl font-bold text-emerald-800 mb-4">Why use this portal?</h3>
                <ul className="space-y-3 text-gray-700">
                   <li className="flex items-center"><span className="text-amber-600 mr-2 font-bold">✓</span> Save time and travel costs</li>
                   <li className="flex items-center"><span className="text-amber-600 mr-2 font-bold">✓</span> Direct access to Government Officers</li>
                   <li className="flex items-center"><span className="text-amber-600 mr-2 font-bold">✓</span> Real-time Agriculture Data</li>
                </ul>
             </div>
          </div>
       </section>
    </div>
  );
};

export default Home;