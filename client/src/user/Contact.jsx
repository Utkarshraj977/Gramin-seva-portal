import { useState } from "react";
import { 
  Mail, Phone, MapPin, Send, Linkedin, Github, Twitter, 
  User, MessageSquare, Loader2, CheckCircle2, Code2
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
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      
      {/* --- HERO HEADER --- */}
      <div className="bg-emerald-900 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cube-grow.png')] opacity-10"></div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 relative z-10">
          Meet the Makers
        </h1>
        <p className="text-emerald-100 text-lg max-w-2xl mx-auto relative z-10 px-4">
          Gramin Vikas Portal is the result of pure teamwork. Built from scratch by two passionate developers working side-by-side.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        
        {/* --- CREATORS SECTION (Identical Roles) --- */}
        <div className="grid md:grid-cols-2 gap-12 mb-24">
           
           {/* CREATOR 1: Sameer */}
           <CreatorCard 
             name="Sameer Maurya"
             role="Co-Creator & Full Stack Developer"
             img="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=500&q=80"
             bio="Contributed to every line of code. From Database architecture to UI Animations, Sameer worked on all aspects of the Gramin Vikas Portal."
             linkedin="#"
             github="#"
             twitter="#"
           />
           
           {/* CREATOR 2: Utkarsh */}
           <CreatorCard 
             name="Utkarsh Raj"
             role="Co-Creator & Full Stack Developer"
             img="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80"
             bio="Contributed to every line of code. From System Design to Frontend Logic, Utkarsh worked on all aspects of the Gramin Vikas Portal."
             linkedin="#"
             github="#"
             twitter="#"
           />

        </div>

        {/* --- CONTACT FORM SECTION --- */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-5 border border-gray-100">
           
           {/* Left: Contact Info */}
           <div className="md:col-span-2 bg-gradient-to-br from-emerald-900 to-green-800 p-10 text-white flex flex-col justify-between">
              <div>
                 <h2 className="text-2xl font-bold mb-6">Contact the Team</h2>
                 <p className="text-emerald-100 mb-8">
                    Since we built this together, you can reach out to either of us. We are available 24/7 for support.
                 </p>
                 
                 <ul className="space-y-6">
                    <ContactItem icon={Phone} text="+91 72680 01991" label="Official Support" />
                    <ContactItem icon={Mail} text="Utksam@gmail.com" label="Email Us" />
                    <ContactItem icon={MapPin} text="Gram Panchayat Bhawan, Digital Village, India" label="HQ" />
                 </ul>
              </div>
              
              <div className="flex gap-4 mt-12">
                 <SocialIcon icon={Linkedin} />
                 <SocialIcon icon={Github} />
                 <SocialIcon icon={Twitter} />
              </div>
           </div>
           
           {/* Right: Form */}
           <div className="md:col-span-3 p-10 md:p-16 bg-white">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Send us a Message</h2>
              <p className="text-gray-500 mb-8">We usually reply within a few hours.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-6">
                    <InputBox icon={User} type="text" placeholder="Your Name" required />
                    <InputBox icon={Phone} type="tel" placeholder="Phone Number" />
                 </div>
                 <InputBox icon={Mail} type="email" placeholder="Email Address" required />
                 
                 <div className="relative">
                    <div className="absolute top-4 left-4 text-gray-400">
                       <MessageSquare size={20} />
                    </div>
                    <textarea 
                       rows="4" 
                       placeholder="How can we help you?" 
                       className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                       required
                    ></textarea>
                 </div>

                 <button 
                    type="submit"
                    disabled={formStatus === 'loading' || formStatus === 'success'}
                    className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
                       formStatus === 'success' ? 'bg-green-500' : 'bg-emerald-900 hover:bg-emerald-800 hover:-translate-y-1'
                    }`}
                 >
                    {formStatus === 'loading' ? (
                       <Loader2 className="animate-spin" /> 
                    ) : formStatus === 'success' ? (
                       <> <CheckCircle2 /> Message Sent! </>
                    ) : (
                       <> Send Message <Send size={18} /> </>
                    )}
                 </button>
              </form>
           </div>

        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function CreatorCard({ name, role, img, bio, linkedin, github, twitter }) {
   return (
      <div className="group bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 relative overflow-hidden flex flex-col items-center">
         
         {/* Background Decoration */}
         <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-emerald-50 to-green-100"></div>
         
         <div className="relative z-10 -mt-4 mb-4">
            <div className="p-1 bg-white rounded-full shadow-lg inline-block">
                <img src={img} alt={name} className="w-36 h-36 rounded-full object-cover border-4 border-emerald-500" />
            </div>
         </div>
         
         <h3 className="text-2xl font-bold text-gray-800 mb-1">{name}</h3>
         
         {/* Badge for Full Contribution */}
         <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Code2 size={12} /> Mastermind
         </span>

         <p className="text-gray-600 font-medium mb-2">{role}</p>
         <p className="text-gray-500 leading-relaxed mb-6 px-4 text-sm">{bio}</p>
         
         <div className="flex justify-center gap-4 mt-auto">
            <SocialBtn href={linkedin} icon={Linkedin} color="hover:text-blue-600" />
            <SocialBtn href={github} icon={Github} color="hover:text-gray-900" />
            <SocialBtn href={twitter} icon={Twitter} color="hover:text-sky-500" />
         </div>
      </div>
   );
}

function ContactItem({ icon: Icon, text, label }) {
   return (
      <li className="flex items-start gap-4 group">
         <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm group-hover:bg-emerald-500 transition-colors">
            <Icon size={20} className="text-emerald-300 group-hover:text-white" />
         </div>
         <div>
            <p className="text-xs text-emerald-200 uppercase tracking-wide font-bold">{label}</p>
            <span className="text-lg font-medium leading-tight break-all">{text}</span>
         </div>
      </li>
   );
}

function SocialIcon({ icon: Icon }) {
   return (
      <a href="#" className="p-3 bg-white/10 rounded-full hover:bg-white hover:text-emerald-900 transition-all backdrop-blur-sm border border-white/10">
         <Icon size={20} />
      </a>
   );
}

function SocialBtn({ href, icon: Icon, color }) {
    return (
        <a href={href} className={`p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-white hover:shadow-md transition-all ${color}`}>
            <Icon size={20} />
        </a>
    )
}

function InputBox({ icon: Icon, type, placeholder, required }) {
   return (
      <div className="relative group">
         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
            <Icon size={20} />
         </div>
         <input 
            type={type} 
            placeholder={placeholder}
            required={required}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
         />
      </div>
   );
}