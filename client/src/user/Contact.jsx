import { useState } from "react";
import { 
  Mail, Phone, MapPin, Send, Linkedin, Github, Twitter, 
  Users, MessageSquare, Loader2, CheckCircle2, Heart, Sparkles
} from "lucide-react";

export default function Contact() {
  const [formStatus, setFormStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('loading');
    setTimeout(() => {
       setFormStatus('success');
       setTimeout(() => setFormStatus(null), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] font-sans selection:bg-emerald-200">
      
      {/* --- HERO SECTION WITH BLENDED BACKGROUND --- */}
      <div className="relative bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 pb-32 pt-20 overflow-hidden rounded-b-[3rem] shadow-2xl">
        
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-800/50 border border-emerald-700/50 text-emerald-200 text-sm mb-6 backdrop-blur-sm">
             <Sparkles size={16} /> <span className="font-medium">The Minds Behind Gramin Vikas</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Built with Passion,<br /> Driven by Friendship
          </h1>
          <p className="text-emerald-100/80 text-lg max-w-2xl mx-auto leading-relaxed">
            This portal isn't just code; it's a shared vision of two friends coming together to empower rural India. No hierarchies, just pure dedication.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-20 pb-20">
        
        {/* --- THE TEAM FRAME (Unique Joint Photo Section) --- */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-white/50 p-3 md:p-4 mb-16">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-[2rem] overflow-hidden relative group">
                
                <div className="grid md:grid-cols-2 items-center">
                    {/* LEFT: The Joint Photo */}
                    <div className="relative h-96 md:h-[500px] w-full overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-transparent transition-all duration-500 z-10"></div>
                        {/* 👇 REPLACE THIS URL with your photo together 👇 */}
                        <img 
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                            alt="Sameer and Utkarsh" 
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    {/* RIGHT: The Story */}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-6">
                            <Users className="text-emerald-600" size={32} />
                            <h2 className="text-3xl font-bold text-gray-800">Sameer & Utkarsh</h2>
                        </div>
                        
                        <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                            "We started this journey with a simple idea: technology should reach every village. Working side-by-side, we debated, coded, and designed every pixel of this portal together."
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-700 font-medium">
                                <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><CheckCircle2 size={16} /></span>
                                Full Stack Development
                            </div>
                            <div className="flex items-center gap-3 text-gray-700 font-medium">
                                <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><CheckCircle2 size={16} /></span>
                                End-to-End System Design
                            </div>
                            <div className="flex items-center gap-3 text-gray-700 font-medium">
                                <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Heart size={16} /></span>
                                Made for the Community
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8 pt-8 border-t border-gray-100">
                             <p className="text-sm text-gray-400 italic">Connect with the creators:</p>
                             <div className="flex gap-3">
                                <SocialBtn icon={Github} />
                                <SocialBtn icon={Linkedin} />
                                <SocialBtn icon={Twitter} />
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- CONTACT FORM SECTION --- */}
        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Contact Info Card */}
            <div className="bg-emerald-900 rounded-3xl p-8 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500 rounded-full blur-3xl opacity-30"></div>
                
                <div>
                    <h3 className="text-2xl font-bold mb-2">Get in Touch</h3>
                    <p className="text-emerald-200 mb-8 text-sm">Have a suggestion for the portal? We listen to every feedback.</p>
                    
                    <ul className="space-y-6">
                        <ContactItem icon={Phone} text="+91 72680 01991" label="Call Us" />
                        <ContactItem icon={Mail} text="Utksam@gmail.com" label="Email Us" />
                        <ContactItem icon={MapPin} text="Digital Village HQ, India" label="Visit Us" />
                    </ul>
                </div>

                <div className="mt-12 p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 text-center">
                    <p className="text-sm text-emerald-100">"Innovation starts with a conversation."</p>
                </div>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">Send us a Message</h3>
                        <p className="text-gray-500 text-sm">We will get back to you shortly.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                        <InputBox type="text" placeholder="Your Name" />
                        <InputBox type="tel" placeholder="Phone Number" />
                    </div>
                    <InputBox type="email" placeholder="Email Address" required />
                    
                    <textarea 
                        rows="4" 
                        placeholder="Write your message here..." 
                        className="w-full pl-6 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                        required
                    ></textarea>

                    <div className="flex justify-end">
                        <button 
                           type="submit"
                           disabled={formStatus === 'loading' || formStatus === 'success'}
                           className={`px-8 py-4 rounded-xl font-bold text-white flex items-center gap-2 transition-all shadow-lg hover:shadow-xl ${
                              formStatus === 'success' ? 'bg-green-500' : 'bg-emerald-600 hover:bg-emerald-700'
                           }`}
                        >
                           {formStatus === 'loading' ? <Loader2 className="animate-spin" /> : 
                            formStatus === 'success' ? <><CheckCircle2/> Sent!</> : 
                            <>Send Message <Send size={18} /></>}
                        </button>
                    </div>
                </form>
            </div>

        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function ContactItem({ icon: Icon, text, label }) {
   return (
      <li className="flex items-center gap-4">
         <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
            <Icon size={18} className="text-white" />
         </div>
         <div>
            <p className="text-xs text-emerald-300 font-bold uppercase">{label}</p>
            <span className="text-base font-medium">{text}</span>
         </div>
      </li>
   );
}

function SocialBtn({ icon: Icon }) {
    return (
        <a href="#" className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-emerald-600 hover:text-white transition-all duration-300">
            <Icon size={18} />
        </a>
    )
}

function InputBox({ type, placeholder, required }) {
   return (
      <input 
         type={type} 
         placeholder={placeholder}
         required={required}
         className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
      />
   );
}