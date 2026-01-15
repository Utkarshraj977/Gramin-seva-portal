import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Target, ShieldCheck, Sprout, HeartHandshake, Globe, 
  Plus, Minus, HelpCircle, ChevronRight, Users
} from "lucide-react";

export default function About() {
  const navigate = useNavigate();

  return (
    // Added a subtle background pattern to the whole page
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 overflow-x-hidden">
      
      {/* --- 1. MODERN HERO SECTION WITH WAVE --- */}
      <div className="relative h-[500px] flex items-center justify-center">
        {/* Background Image with warmer, more vibrant feel */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?q=80&w=2070&auto=format&fit=crop" 
            alt="Vibrant Indian Fields at Sunset" 
            className="w-full h-full object-cover"
          />
          {/* Modern Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/95 to-emerald-800/80"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl px-6 mt-10">
          <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/10 text-emerald-300 text-sm font-bold tracking-wider mb-6 backdrop-blur-md border border-white/20">
            <Sprout size={16} /> ABOUT GRAMIN VIKAS
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Empowering Villages,<br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
              Transforming Lives.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed font-medium">
            Humara maksad hai har gaon tak digital suvidhayein pahunchana aur 
            gramin bharat ko aatmanirbhar banana.
          </p>
        </div>

        {/* Wave Shape Divider at Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="fill-gray-50">
              <path fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,122.7C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
        </div>
      </div>

      {/* --- 2. GLASSMORPHISM STATS BAR (Floating over wave) --- */}
      <div className="max-w-5xl mx-auto px-6 relative z-20 -mt-32 md:-mt-40 mb-20">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-8 p-8 border border-white/40">
           <StatItem number="500+" label="Villages Connected" icon={Globe} />
           <StatItem number="10k+" label="Farmers Helped" icon={Users} />
           <StatItem number="24/7" label="Digital Support" icon={HelpCircle} />
           <StatItem number="100%" label="Government Schemes" icon={ShieldCheck} />
        </div>
      </div>

      {/* --- 3. MISSION & VISION (Modern Split Layout) --- */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          
          {/* Text Content (Left Side) */}
          <div className="md:col-span-5 space-y-8 order-2 md:order-1">
              <div className="inline-block p-3 bg-amber-100 rounded-2xl mb-2">
                 <Target className="text-amber-600 w-8 h-8" />
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                Humara Lakshya <br/>(Our Mission)
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                "Gramin Vikas Portal" is more than a website; it's a bridge. We aim to integrate technology seamlessly into rural life, providing easy access to <strong>Healthcare, Education, Agriculture,</strong> and <strong>Government Services</strong> to every villager sitting at home.
              </p>
              
              <div className="space-y-5 pt-4">
                 <CheckPoint text="Removing the digital divide in rural India." />
                 <CheckPoint text="Providing transparent access to government schemes." />
                 <CheckPoint text="Empowering farmers with modern tools." />
              </div>
              
              <button className="mt-4 flex items-center gap-2 text-emerald-700 font-bold hover:gap-4 transition-all">
                Learn more about our impact <ChevronRight size={20}/>
              </button>
          </div>

          {/* Image (Right Side) - Single, Impactful Image showing Tech + Rural */}
          <div className="md:col-span-7 order-1 md:order-2 relative pl-8 pt-8">
             <div className="absolute top-0 left-0 w-full h-full bg-emerald-200 rounded-[3rem] transform -rotate-3"></div>
             <img 
                src="https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=2070&auto=format&fit=crop" 
                className="relative rounded-[3rem] shadow-2xl z-10 object-cover h-[500px] w-full border-8 border-white" 
                alt="Indian farmer using technology" 
             />
          </div>
        </div>
      </section>

      {/* --- 4. CORE VALUES (Cards with Hover Effect) --- */}
      <section className="bg-emerald-900 py-24 px-6 relative overflow-hidden">
         {/* Background Pattern Subtle */}
         <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         
         <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why We Exist?</h2>
            <p className="text-emerald-200 max-w-2xl mx-auto text-lg">
               Our values define who we are. We work with honesty and dedication for the betterment of rural society.
            </p>
         </div>

         <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
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

      {/* --- 5. FAQ SECTION --- */}
      <FAQSection />

      {/* --- 6. TEAM MESSAGE (Modern Box) --- */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-amber-50 to-white p-12 rounded-[3rem] border border-amber-100 shadow-xl text-center relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-lg">
             <Sprout className="w-10 h-10 text-emerald-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-8 mt-4">A Message from the Team</h2>
          <blockquote className="text-2xl text-gray-700 italic leading-relaxed font-serif mb-8">
             "We dreamt of an India where a farmer in a remote village has the same access to information as someone in a metro city. Gramin Vikas Portal is a small step towards that big dream."
          </blockquote>
          <div className="flex flex-col items-center justify-center">
             <div className="h-1 w-20 bg-amber-500 rounded-full mb-4"></div>
             <p className="font-bold text-emerald-900 text-lg uppercase tracking-wide">Jai Hind, Jai Kisan</p>
             <p className="text-sm text-gray-500">Team Gramin Vikas</p>
          </div>
        </div>
      </section>

      {/* --- 7. MODERN CTA FOOTER --- */}
      <div className="bg-emerald-950 py-16 text-center px-6">
         <h2 className="text-3xl md:text-4xl text-white font-bold mb-8 leading-tight">Ready to be a part of the <br/> Digital Revolution?</h2>
         <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="group px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
            </button>
            <button 
               onClick={() => navigate("/login")}
               className="group px-10 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 font-bold rounded-full shadow-lg hover:shadow-amber-500/50 hover:scale-105 transition-all flex items-center gap-2"
            >
              Join Us Now <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </button>
         </div>
      </div>

    </div>
  );
}

// --- SUB COMPONENTS ---

// 1. FAQ Component (Enhanced Design)
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
      answer: "Ji haan, bilkul! Gramin Vikas Portal par account banana aur sarkari yojnaon ki jaankari lena 100% muft hai. Humara lakshya seva hai, munafa nahi."
    },
    {
      id: 3,
      question: "Main apna password bhool gaya hoon, kya karun?",
      answer: "Fikar not! Aap login page par 'Forgot Password' par click karke apna registered mobile number dalein. Hum aapko ek OTP bhejenge password reset karne ke liye."
    },
    {
      id: 4,
      question: "Kya mera personal data surakshit hai?",
      answer: "Aapki suraksha hamari prathmikta hai. Humare servers par aapka data encrypted form mein store hota hai aur hum ise kisi teesre paksh ke saath साझा nahi karte."
    }
  ];

  const [openId, setOpenId] = useState(1); // Default open first one

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto grid md:grid-cols-12 gap-10">
        
        {/* FAQ Header (Left Side) */}
        <div className="md:col-span-4">
           <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-4">
             <HelpCircle className="w-8 h-8 text-emerald-600" />
           </div>
           <h2 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
             Aaksar Puche Jaane Wale Sawal
           </h2>
           <p className="text-gray-600 text-lg mb-6">
             Have questions? We have answers.
           </p>
           <button className="text-emerald-700 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Contact Support <ChevronRight size={18} />
           </button>
        </div>

        {/* FAQ List (Right Side) */}
        <div className="md:col-span-8 space-y-4">
          {faqs.map((faq) => (
            <div 
              key={faq.id} 
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                openId === faq.id ? "bg-emerald-50 border-emerald-500 shadow-md" : "bg-white border-gray-200 hover:border-emerald-300"
              }`}
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
              >
                <span className={`text-lg font-bold ${openId === faq.id ? "text-emerald-900" : "text-gray-800"}`}>
                  {faq.question}
                </span>
                <span className={`ml-4 p-1 rounded-full transition-colors ${openId === faq.id ? "bg-emerald-200 text-emerald-800" : "bg-gray-100 text-gray-500"}`}>
                  {openId === faq.id ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>

              <div 
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  openId === faq.id ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-emerald-100 pt-4">
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

// 2. Helper Components with enhanced styling

function StatItem({ number, label, icon: Icon }) {
  return (
    <div className="text-center flex flex-col items-center group">
      <Icon className="w-8 h-8 text-emerald-500 mb-3 group-hover:scale-110 transition-transform" />
      <p className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-1">{number}</p>
      <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{label}</p>
    </div>
  );
}

function CheckPoint({ text }) {
   return (
      <div className="flex items-start gap-3">
         <div className="min-w-[24px] h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center mt-1">
            <ShieldCheck size={14} className="text-emerald-600" />
         </div>
         <p className="text-gray-700 font-medium text-lg leading-snug">{text}</p>
      </div>
   );
}

// New Value Card Design (Dark Theme)
function ValueCard({ icon: Icon, title, desc }) {
   return (
      <div className="bg-emerald-800/50 p-8 rounded-3xl border border-emerald-700/50 hover:bg-emerald-800 hover:border-emerald-600 transition-all duration-300 hover:-translate-y-2 group text-left backdrop-blur-sm shadow-lg">
         <div className="w-14 h-14 bg-emerald-700 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors shadow-inner">
            <Icon className="text-emerald-100 group-hover:text-white transition-colors" size={28} />
         </div>
         <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
         <p className="text-emerald-200/90 leading-relaxed">{desc}</p>
      </div>
   );
}