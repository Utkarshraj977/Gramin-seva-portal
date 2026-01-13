import React, { useState } from "react";
// Ensure FontAwesome is imported in your project
import "@fortawesome/fontawesome-free/css/all.min.css";

export const Footer = () => {
  // State to handle the QR Code Modal
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <footer className="relative bg-slate-950 text-slate-300 font-sans overflow-hidden pt-20 pb-10">
        
        {/* --- Background Decorations --- */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          
          {/* === MAIN GRID === */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            {/* 1. BRAND & SOCIAL LINKS */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 bg-emerald-600 rounded-xl text-xl shadow-lg shadow-emerald-600/20">🌾</span>
                <span>Gramin Seva</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Gaon ke vikas ke liye ek digital manch. 
                <span className="text-emerald-400 block mt-2 font-medium">Shiksha • Swasthya • Suraksha</span>
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3 pt-2">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 text-sm transition-all hover:bg-[#1877F2] hover:text-white hover:-translate-y-1"><i className="fab fa-facebook-f"></i></a>
                <a href="https://www.instagram.com/_sameer_maurya___/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 text-sm transition-all hover:bg-pink-600 hover:text-white hover:-translate-y-1"><i className="fab fa-instagram"></i></a>
                <a href="https://x.com/SameerKush90271" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 text-sm transition-all hover:bg-black hover:text-white hover:-translate-y-1"><i className="fab fa-twitter"></i></a>
                <a href="https://www.linkedin.com/in/sameer-kushwaha-124bba189/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 text-sm transition-all hover:bg-[#0077B5] hover:text-white hover:-translate-y-1"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>

            {/* 2. QUICK LINKS */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
              <ul className="space-y-4 text-sm text-slate-400">
                {[
                  { name: "Home", href: "/home/admin" },
                  { name: "All Services", href: "/services/user" },
                  { name: "Doctor Seva", href: "/doctor/user" },
                  { name: "Education Portal", href: "/education/user" },
                  { name: "Traveller Help", href: "/travelle/user" },
                ].map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href} className="hover:text-emerald-400 hover:pl-2 transition-all flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span> {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. CONTACT INFO */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <i className="fas fa-map-marker-alt mt-1 text-emerald-500"></i>
                  <span>Gramin Seva HQ,<br/>Lucknow, Uttar Pradesh, India</span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fas fa-phone-alt text-emerald-500"></i>
                  <a href="tel:+917268001991" className="hover:text-white transition">+91 726 800 1991</a>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fas fa-envelope text-emerald-500"></i>
                  <a href="mailto:sameerkushwaha563@gmail.com" className="hover:text-white transition break-all">sameerkushwaha563@gmail.com</a>
                </li>
              </ul>
            </div>

            {/* 4. DONATION SECTION (Opens Modal) */}
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <h3 className="text-white font-bold text-lg mb-2">Support Us</h3>
              <p className="text-xs text-slate-500 mb-6">Gaon ke vikas mein chhota sa yogdan dein.</p>
              
              {/* Donate Button */}
              <button 
                onClick={() => setShowModal(true)}
                className="group w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl text-white font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] transition-all mb-6 relative overflow-hidden"
              >
                {/* Shine Animation */}
                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-[100%] transition-all duration-1000 ease-in-out"></div>
                
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-orange-100 uppercase tracking-wider">Donate</span>
                  <span className="text-lg">₹10 Pay Now</span>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                  <i className="fas fa-qrcode group-hover:scale-110 transition-transform"></i>
                </div>
              </button>

              {/* Newsletter */}
              <div>
                 <p className="text-xs text-slate-500 mb-2 font-bold uppercase">Subscribe to Updates</p>
                 <div className="flex bg-slate-950 rounded-lg border border-slate-800 overflow-hidden focus-within:border-emerald-500 transition-colors">
                    <input type="email" placeholder="Email Address" className="bg-transparent text-sm text-white px-3 py-2 w-full outline-none placeholder-slate-600"/>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 transition-colors">
                      <i className="fas fa-paper-plane text-xs"></i>
                    </button>
                 </div>
              </div>
            </div>

          </div>

          {/* === BOTTOM BAR === */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Gramin Seva Portal. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-emerald-400 transition">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-400 transition">Terms of Service</a>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 text-white bg-slate-800 hover:bg-emerald-600 px-3 py-1.5 rounded-lg transition-all">Top <i className="fas fa-arrow-up text-xs"></i></button>
            </div>
          </div>
        </div>
      </footer>

      {/* ================================ */}
      {/* PAYMENT QR MODAL COMPONENT      */}
      {/* ================================ */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
            
            {/* Header */}
            <div className="bg-emerald-600 p-4 flex justify-between items-center">
              <h3 className="text-white font-bold text-lg">Sahyog Karein (₹10)</h3>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white hover:rotate-90 transition-all text-xl">
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col items-center text-center">
              
              {/* QR Code Image (Make sure file is in public folder) */}
              <div className="bg-amber-100 p-3 rounded-xl mb-4 shadow-inner">
                {/* 👇 YAHAN AAPKA QR CODE DIKHEGA 👇 */}
                <img 
                  src="/qr.jpg" 
                  alt="Scan Payment QR" 
                  className="w-48 h-48 object-contain rounded-lg mix-blend-multiply"
                />
              </div>

              <p className="text-gray-800 font-bold text-xl">Sameer Kushwaha</p>
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full mt-2 mb-6">
                <span className="text-gray-600 font-mono text-sm">7268001991@fam</span>
                <i className="fas fa-check-circle text-emerald-500 text-xs"></i>
              </div>

              {/* Direct Payment Button (Deep Link) */}
              <a 
                href="upi://pay?pa=7268001991@fam&pn=Sameer%20Kushwaha&am=10&cu=INR"
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <span>Pay ₹10 via App</span> 
                <i className="fas fa-external-link-alt text-sm"></i>
              </a>

              <p className="text-[10px] text-gray-400 mt-4">
                Supported: GooglePay, PhonePe, Paytm, BHIM
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};