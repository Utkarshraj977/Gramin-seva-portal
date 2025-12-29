import React from "react";
// Ensure FontAwesome is imported in your index.html or index.js
import "@fortawesome/fontawesome-free/css/all.min.css";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 font-sans">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-12">

        {/* 1. BRAND SECTION */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">🌾</span> Gramin Seva
          </h2>
          <p className="text-sm leading-relaxed text-gray-400">
            Gaon ke vikas ke liye ek digital manch jahan 
            <b className="text-emerald-400"> shiksha, swasthya, suraksha</b> aur 
            <b className="text-emerald-400"> nagrik seva</b> ek jagah uplabdh hai.
          </p>
        </div>

        {/* 2. QUICK LINKS */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-6 border-b-2 border-emerald-600 inline-block pb-1">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="/home" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">Home</a></li>
            <li><a href="/services" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">All Services</a></li>
            <li><a href="/doctor" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">Doctor Seva</a></li>
            <li><a href="/education" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">Education</a></li>
            <li><a href="/complaint" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">Complaints</a></li>
            <li><a href="/cyber" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">Cyber Safety</a></li>
            <li><a href="/traveller" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">Traveller Help</a></li>
          </ul>
        </div>

        {/* 3. LEGAL LINKS */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-6 border-b-2 border-emerald-600 inline-block pb-1">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">User Guidelines</a></li>
          </ul>
        </div>

        {/* 4. CONTACT INFO */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-6 border-b-2 border-emerald-600 inline-block pb-1">Contact</h4>
          <div className="space-y-4 text-sm">
            <p className="flex items-center gap-3">
              <i className="fas fa-phone text-emerald-500"></i> 
              <span className="hover:text-white transition">+91 726 800 1991</span>
            </p>
            <p className="flex items-center gap-3">
              <i className="fas fa-envelope text-emerald-500"></i> 
              <span className="hover:text-white transition">sameerkushwaha563@gmail.com</span>
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">
            <a href="https://www.facebook.com" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all transform hover:-translate-y-1">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com/_sameer_maurya___/" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gradient-to-tr from-yellow-400 to-purple-600 hover:text-white transition-all transform hover:-translate-y-1">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://x.com/SameerKush90271" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-black hover:text-white transition-all transform hover:-translate-y-1">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.linkedin.com/in/sameer-kushwaha-124bba189/" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#0077B5] hover:text-white transition-all transform hover:-translate-y-1">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        {/* 5. NEWSLETTER */}
        <div className="col-span-1 md:col-span-2 xl:col-span-1">
          <h4 className="text-lg font-semibold text-white mb-6 border-b-2 border-emerald-600 inline-block pb-1">Gaon Updates</h4>
          <p className="text-sm text-gray-400 mb-4">
            Gaon se judi yojna, seva aur updates seedhe aapke email par.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-emerald-900/50">
              Subscribe
            </button>
          </form>
        </div>

      </div>

      {/* --- BOTTOM BAR --- */}
      <div className="container mx-auto px-6 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} <span className="text-white font-medium">Gramin Seva Portal</span>. 
          Digital India for Rural Growth 🇮🇳
        </p>

        <a 
          href="#" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mt-4 md:mt-0 flex items-center gap-2 hover:text-emerald-400 transition cursor-pointer"
        >
          Back to top <i className="fas fa-arrow-up"></i>
        </a>
      </div>
    </footer>
  );
};