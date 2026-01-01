import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Target, ShieldCheck, Sprout, HeartHandshake, Globe, 
  Plus, Minus, HelpCircle 
} from "lucide-react";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 animate-fade-in">
      
      {/* --- 1. HERO SECTION --- */}
      <div className="relative h-[450px] bg-emerald-900 flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1625246333195-58197bd47d72?q=80&w=2070&auto=format&fit=crop" 
            alt="Indian Village Fields" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 via-emerald-900/80 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl px-6 pt-10">
          <span className="inline-block py-1 px-3 rounded-full bg-amber-500/20 text-amber-400 text-sm font-bold tracking-wider mb-4 border border-amber-500/40 backdrop-blur-sm">
            ABOUT GRAMIN VIKAS
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Bridging the Gap Between <br/>
            <span className="text-amber-500">Villages & Development</span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Humara maksad hai har gaon tak digital suvidhayein pahunchana aur 
            gramin bharat ko aatmanirbhar banana.
          </p>
        </div>
      </div>

      {/* --- 2. STATS BAR (Floating) --- */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl grid grid-cols-2 md:grid-cols-4 gap-8 p-8 border-b-4 border-amber-500">
           <StatItem number="500+" label="Villages Connected" />
           <StatItem number="10k+" label="Farmers Helped" />
           <StatItem number="24/7" label="Digital Support" />
           <StatItem number="100%" label="Government Schemes" />
        </div>
      </div>

      {/* --- 3. OUR MISSION & VISION --- */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
             <img src="https://images.unsplash.com/photo-1595260906806-38d5e8254884?auto=format&fit=crop&w=600&q=80" className="rounded-2xl shadow-lg mt-8 hover:scale-105 transition duration-500" alt="Education" />
             <img src="https://images.unsplash.com/photo-1534951474654-886e563204a5?auto=format&fit=crop&w=600&q=80" className="rounded-2xl shadow-lg hover:scale-105 transition duration-500" alt="Farming" />
          </div>

          {/* Text Content */}
          <div className="space-y-6">
             <div className="flex items-center gap-3 mb-2">
                <Target className="text-amber-500 w-8 h-8" />
                <h2 className="text-3xl font-bold text-gray-900">Humara Lakshya (Mission)</h2>
             </div>
             <p className="text-gray-600 text-lg leading-relaxed">
               "Gramin Vikas Portal" is not just a website, it is a movement. Our mission is to integrate technology with rural life. We aim to provide easy access to <strong>Healthcare, Education, Agriculture,</strong> and <strong>Government Services</strong> to every villager sitting at home.
             </p>
             
             <div className="space-y-4 pt-4">
                <CheckPoint text="Removing the digital divide in rural India." />
                <CheckPoint text="Providing transparent access to government schemes." />
                <CheckPoint text="Empowering farmers with modern tools." />
             </div>
          </div>
        </div>
      </section>

      {/* --- 4. CORE VALUES --- */}
      <section className="bg-emerald-50 py-20 px-6">
         <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">Why We Exist?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
               Our values define who we are. We work with honesty and dedication for the betterment of rural society.
            </p>
         </div>

         <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <ValueCard 
              icon={Globe} 
              title="Accessibility" 
              desc="Bringing services to the fingertips of every villager, regardless of location." 
            />
            <ValueCard 
              icon={ShieldCheck} 
              title="Transparency" 
              desc="Ensuring that government funds and schemes reach the right people directly." 
            />
            <ValueCard 
              icon={HeartHandshake} 
              title="Community First" 
              desc="We believe in 'Sabka Saath, Sabka Vikas'. Community is at the heart of everything we do." 
            />
         </div>
      </section>

      {/* --- 5. 🔥 FAQ SECTION (ADDED HERE) 🔥 --- */}
      <FAQSection />

      {/* --- 6. TEAM MESSAGE --- */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
         <Sprout className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
         <h2 className="text-3xl font-bold text-gray-900 mb-6">A Message from the Team</h2>
         <blockquote className="text-xl text-gray-600 italic leading-relaxed">
            "We dreamt of an India where a farmer in a remote village has the same access to information as someone in a metro city. Gramin Vikas Portal is a small step towards that big dream. Jai Hind, Jai Kisan."
         </blockquote>
         <div className="mt-8">
            <p className="font-bold text-emerald-900 text-lg">Team Gramin Vikas</p>
            <p className="text-sm text-gray-500">Digital India Initiative</p>
         </div>
      </section>

      {/* --- 7. CTA & FOOTER --- */}
      <div className="bg-emerald-900 py-12 text-center">
         <h2 className="text-2xl text-white font-bold mb-6">Ready to be a part of the change?</h2>
         <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="px-8 py-3 bg-white text-emerald-900 font-bold rounded-full shadow-lg hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              <ArrowLeft size={20} /> Back
            </button>
            <button 
               onClick={() => navigate("/login")}
               className="px-8 py-3 bg-amber-500 text-white font-bold rounded-full shadow-lg hover:bg-amber-600 transition-all"
            >
              Join Us Now
            </button>
         </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.8s ease-in-out; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

    </div>
  );
}

// --- SUB COMPONENTS ---

// 1. FAQ Component Logic
function FAQSection() {
  const faqs = [
    {
      id: 1,
      question: "Gramin Vikas Portal ka mukhya uddeshya kya hai?",
      answer: "Is portal ka main maksad gaon ke logon ko digitally saksham banana hai. Hum kheti, shiksha, swasthya, aur sarkari yojnaon ki jaankari seedha aapke mobile tak pahunchate hain taaki aapko daftar ke chakkar na kaatne padein."
    },
    {
      id: 2,
      question: "Kya is portal par registration free hai?",
      answer: "Ji haan, bilkul! Gramin Vikas Portal par account banana aur sarkari yojnaon ki jaankari lena 100% muft hai."
    },
    {
      id: 3,
      question: "Main apna password bhool gaya hoon, kya karun?",
      answer: "Fikar not! Aap login page par 'Forgot Password' par click karke apna registered mobile number dalein."
    },
    {
      id: 4,
      question: "Kya mera personal data surakshit hai?",
      answer: "Aapki suraksha hamari prathmikta hai. Humare servers par aapka data encrypted form mein store hota hai."
    }
  ];

  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 px-6 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Aaksar Puche Jaane Wale Sawal
          </h2>
          <p className="text-gray-600 text-lg">
            Aapke mann mein koi sawal hai? Yahan kuch common sawalon ke jawab hain.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div 
              key={faq.id} 
              className={`border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 ${
                openId === faq.id ? "bg-emerald-50 border-emerald-200 shadow-md" : "bg-white hover:border-emerald-300"
              }`}
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
              >
                <span className={`text-lg font-bold ${openId === faq.id ? "text-emerald-800" : "text-gray-800"}`}>
                  {faq.question}
                </span>
                <span className={`ml-4 p-2 rounded-full transition-colors ${openId === faq.id ? "bg-emerald-200 text-emerald-800" : "bg-gray-100 text-gray-500"}`}>
                  {openId === faq.id ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>

              <div 
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  openId === faq.id ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 2. Helper Components
function StatItem({ number, label }) {
  return (
    <div className="text-center">
      <p className="text-3xl md:text-4xl font-extrabold text-emerald-700 mb-1">{number}</p>
      <p className="text-sm md:text-base text-gray-500 font-medium uppercase tracking-wide">{label}</p>
    </div>
  );
}

function CheckPoint({ text }) {
   return (
      <div className="flex items-center gap-3">
         <div className="min-w-[20px] h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-600"></div>
         </div>
         <p className="text-gray-700 font-medium">{text}</p>
      </div>
   );
}

function ValueCard({ icon: Icon, title, desc }) {
   return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
         <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
            <Icon className="text-emerald-600 group-hover:text-white transition-colors" size={28} />
         </div>
         <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
         <p className="text-gray-500 leading-relaxed">{desc}</p>
      </div>
   );
}