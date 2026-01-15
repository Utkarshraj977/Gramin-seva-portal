import { useState } from "react";
import { Stethoscope, GraduationCap, Megaphone, ShieldCheck, Bus, UserCog, Users, ArrowRight } from "lucide-react";

const SERVICES = [
  {
    key: "doctor",
    title: "Swasthya Seva",
    subtitle: "Tele-medicine & PHC",
    icon: Stethoscope,
    img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop", // Medical
    color: "from-emerald-600 to-green-500",
    desc: "Book appointments with doctors and access health records."
  },
  {
    key: "education",
    title: "Shiksha Portal",
    subtitle: "Scholarships & E-Learning",
    icon: GraduationCap,
    img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop", // Rural Education
    color: "from-blue-600 to-cyan-500",
    desc: "Digital literacy tools and scholarship application tracking."
  },
  {
    key: "complaint",
    title: "Jan Sunwai",
    subtitle: "Grievance Redressal",
    icon: Megaphone,
    img: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=2070&auto=format&fit=crop", // Meeting/Discussion
    color: "from-orange-600 to-amber-500",
    desc: "Directly report issues to your Gram Panchayat officials."
  },
  {
    key: "cyber",
    title: "Cyber Suraksha",
    subtitle: "Digital Safety",
    icon: ShieldCheck,
    img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop", // Digital/Tech
    color: "from-indigo-600 to-purple-500",
    desc: "Report cyber frauds and learn about safe digital banking."
  },
  {
    key: "traveller",
    title: "Yatra Suvidha",
    subtitle: "Transport & Roads",
    icon: Bus,
    img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2072&auto=format&fit=crop", // Bus/Travel
    color: "from-rose-600 to-pink-500",
    desc: "Bus timings, road conditions, and travel passes."
  },
];

export default function Services() {
  const [active, setActive] = useState(null);

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans">

      {/* --- HERO SECTION --- */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax-like fix */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1623113175720-9eb974a38896?q=80&w=1935&auto=format&fit=crop')",
            filter: "brightness(0.6)"
          }}
        ></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <div className="bg-emerald-900/60 backdrop-blur-md border border-emerald-500/30 p-8 md:p-12 rounded-3xl shadow-2xl animate-fade-down">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
              Gramin <span className="text-amber-400">Vikas</span> Portal
            </h1>
            <p className="text-lg md:text-xl text-emerald-50 font-medium max-w-2xl mx-auto leading-relaxed">
              Connecting every village to the future. Access healthcare, education, and safety services in one tap.
            </p>
          </div>
        </div>
      </section>

      {/* --- SERVICES GRID --- */}
      <section className="px-4 py-20 -mt-20 relative z-20 max-w-7xl mx-auto">
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.key}
              onClick={() => setActive(active === s.key ? null : s.key)}
              className={`
                relative bg-white rounded-3xl overflow-hidden transition-all duration-300 ease-out border border-gray-100
                ${active === s.key ? "shadow-2xl ring-4 ring-emerald-500/20 scale-[1.02]" : "shadow-lg hover:-translate-y-2 hover:shadow-xl cursor-pointer"}
              `}
            >
              {/* Card Image Header */}
              <div className="relative h-48 overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-t ${s.color} opacity-80 z-10`}></div>
                <img
                  src={s.img}
                  alt={s.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Floating Icon */}
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3 text-white">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                    <s.icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold leading-none">{s.title}</h3>
                    <p className="text-xs text-white/80 mt-1 font-medium tracking-wide uppercase">{s.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  {s.desc}
                </p>

                {/* --- EXPANDABLE OPTIONS (User vs Admin) --- */}
                <div
                  className={`grid gap-3 transition-all duration-500 ease-in-out overflow-hidden
                    ${active === s.key ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}
                  `}
                >
                  {/* Admin Button */}
                  <a href={`/${s.key}/admin`} className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg text-emerald-700 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <UserCog size={20} />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-gray-800 text-sm group-hover:text-emerald-800">Admin Login</h4>
                        <p className="text-xs text-gray-500">Manage records</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-gray-400 group-hover:text-emerald-600" />
                  </a>

                  {/* User Button */}
                  <a href={`/${s.key}/user`} className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Users size={20} />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-gray-800 text-sm group-hover:text-blue-800">User Login</h4>
                        <p className="text-xs text-gray-500">Access services</p>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-gray-400 group-hover:text-blue-600" />
                  </a>
                </div>

                {/* Hint Text (Visible only when closed) */}
                {active !== s.key && (
                  <div className="flex items-center justify-center pt-2">
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest flex items-center gap-1 animate-pulse">
                      Tap to Select <ArrowRight size={12} />
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- SIMPLE FOOTER --- */}
      <footer className="text-center py-8 bg-white border-t border-gray-200 text-gray-500 text-sm">
        <p>🌱 Digital India • Strong Villages • Smart Future</p>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes fade-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-down {
          animation: fade-down 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}