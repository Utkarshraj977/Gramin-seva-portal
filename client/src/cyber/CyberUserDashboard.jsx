import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Clock, Search, Send, XOctagon, 
  Briefcase, Loader2, CheckCircle, MessageSquare, 
  ShieldCheck, X, User, Zap, FileText, Settings
} from "lucide-react";
import ChatRoom from '../Chat/ChatRoom';
import DocumentUpload from '../components/DocumentUpload';
import ProfileUpdateModal from '../components/ProfileUpdateModal';
import { cyberUser } from "../services/api";

const CyberUserDashboard = () => {
  const [shops, setShops] = useState([]); 
  const [filteredShops, setFilteredShops] = useState([]); 
  const [myProfile, setMyProfile] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [searchTerm, setSearchTerm] = useState("");

  const [activeChatShop, setActiveChatShop] = useState(null);
  const [activeDocShop, setActiveDocShop] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const fetchData = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      
      const [shopsRes, profileRes] = await Promise.all([
        cyberUser.get_all_shops(),
        cyberUser.get_profile(),
      ]);

      setShops(shopsRes.data || []);
      if (!searchTerm) setFilteredShops(shopsRes.data || []);
      setMyProfile(profileRes.data);

    } catch (error) {
      console.error("Sync Error:", error);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(false);
    const intervalId = setInterval(() => fetchData(true), 3000); 
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredShops(shops);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredShops(shops.filter(s => 
        (s.location?.toLowerCase().includes(lower)) || 
        (s.userInfo?.username?.toLowerCase().includes(lower))
      ));
    }
  }, [searchTerm, shops]);

  const getMyApplication = (shop) => {
    if (!myProfile || !shop.cyberUsers) return null;
    return shop.cyberUsers.find(user => 
        String(user.userInfo?._id) === String(myProfile.userInfo?._id)
    );
  };

  const activeShop = shops.find(shop => {
      const app = getMyApplication(shop);
      return app && (app.message === 'selected' || app.status === 'selected');
  });

  const handleApply = async (adminUsername) => {
    try {
      toast.loading("Sending Request...");
      await cyberUser.apply_shop(adminUsername);
      toast.dismiss();
      toast.success("Application Sent!");
      fetchData(true); 
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  const handleWithdraw = async (adminUsername) => {
    if(!window.confirm(`Withdraw request?`)) return;
    try {
      await cyberUser.withdraw_application(adminUsername);
      toast.success("Withdrawn");
      fetchData(true);
    } catch (error) {
      toast.error("Withdrawal Failed");
    }
  };

  const handleProfileUpdate = async (data) => {
    await cyberUser.update_profile(data);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12 relative">
      <Toaster position="top-center" />

      {/* HEADER */}
      <header className="bg-white sticky top-0 z-20 shadow-sm border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-lg text-white"><ShieldCheck size={20} /></div>
                <h1 className="text-xl font-extrabold text-slate-800 hidden md:block">Gramin<span className="text-blue-600">Seva</span></h1>
            </div>
            <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search Cyber Cafes..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-full border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
            </div>
            <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="p-2 hover:bg-slate-100 rounded-full transition"
                  title="Edit Profile"
                >
                  <Settings size={20} className="text-slate-600" />
                </button>
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                    {myProfile?.userInfo?.username?.charAt(0).toUpperCase() || <User size={20}/>}
                </div>
            </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-6">
        
        {/* ACTIVE APPROVED CONNECTION */}
        <AnimatePresence>
        {activeShop && (
            <motion.div 
                initial={{y:-20, opacity:0}} animate={{y:0, opacity:1}} 
                className="mb-10 bg-emerald-600 rounded-3xl p-1 shadow-xl shadow-emerald-100"
            >
                <div className="bg-white rounded-[20px] p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-24 bg-emerald-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="flex gap-5">
                            <img 
                                src={activeShop.cyber_shopPic?.url || "https://via.placeholder.com/150"} 
                                className="h-24 w-24 rounded-2xl bg-gray-100 object-cover border-4 border-emerald-50 shadow-md"
                                alt="Shop"
                            />
                            <div>
                                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit mb-2">
                                    <CheckCircle size={12}/> Application Approved
                                </span>
                                <h2 className="text-2xl font-bold text-slate-800">{activeShop.userInfo?.username}'s Center</h2>
                                <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                                    <MapPin size={14}/> {activeShop.location}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setActiveChatShop(activeShop)}
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                            >
                                <MessageSquare size={18}/> Chat
                            </button>
                            <button 
                                onClick={() => setActiveDocShop(activeShop)}
                                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
                            >
                                <FileText size={18}/> Documents
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
        </AnimatePresence>

        {/* ALL SHOPS */}
        <div className="mb-4 flex items-center gap-2">
            <Briefcase className="text-blue-600" size={20}/>
            <h2 className="text-lg font-bold text-slate-800">Available Cyber Centers</h2>
        </div>

        {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={32}/></div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredShops.filter(s => s._id !== activeShop?._id).map((shop) => {
                    const app = getMyApplication(shop);
                    const isPending = app && (app.message !== 'selected' && app.message !== 'rejected');
                    const isRejected = app && app.message === 'rejected';

                    return (
                        <motion.div key={shop._id} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                            <div className="h-40 rounded-xl overflow-hidden mb-4 relative">
                                <img src={shop.cyber_shopPic?.url || "https://via.placeholder.com/300"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Cover"/>
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                    <Clock size={12} className="text-orange-500"/> {shop.Start_time} - {shop.End_time}
                                </div>
                            </div>
                            
                            <h3 className="font-bold text-slate-800 text-lg mb-1">{shop.userInfo?.username}</h3>
                            <p className="text-slate-500 text-sm flex items-center gap-1 mb-4"><MapPin size={14}/> {shop.location}</p>

                            <div className="pt-4 border-t border-gray-50">
                                {isPending ? (
                                    <button onClick={() => handleWithdraw(shop.userInfo.username)} className="w-full py-2.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-amber-100">
                                        <Loader2 className="animate-spin" size={16}/> Request Pending (Withdraw)
                                    </button>
                                ) : isRejected ? (
                                    <button disabled className="w-full py-2.5 bg-red-50 text-red-400 border border-red-100 rounded-xl font-bold text-sm cursor-not-allowed">
                                        Application Rejected
                                    </button>
                                ) : (
                                    <button onClick={() => handleApply(shop.userInfo.username)} className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200">
                                        <Send size={16}/> Apply Now
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        )}
      </main>

      {/* CHAT MODAL */}
      {activeChatShop && myProfile && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
           <div className="relative w-full max-w-lg h-[80vh] flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xl">
               <div className="bg-white p-4 flex justify-between items-center border-b border-gray-100 z-10">
                   <div className="flex items-center gap-3">
                       <img src={activeChatShop.cyber_shopPic?.url} className="w-10 h-10 rounded-full border border-gray-100 object-cover" alt="Shop"/>
                       <div>
                           <h3 className="font-bold text-slate-800 leading-none">{activeChatShop.userInfo?.username}</h3>
                           <span className="text-xs text-slate-500">Shop Admin</span>
                       </div>
                   </div>
                   <button onClick={() => setActiveChatShop(null)} className="hover:bg-slate-100 p-2 rounded-full transition"><X size={20}/></button>
               </div>
               
               <div className="flex-1 overflow-hidden bg-slate-50">
                   <ChatRoom 
                      roomId={[String(activeChatShop.userInfo?._id), String(myProfile.userInfo?._id)].sort().join("-")}
                      currentUser={{ 
                          name: myProfile.userInfo?.username, 
                          id: myProfile.userInfo?._id 
                      }}
                      targetUser={{ 
                          name: activeChatShop.userInfo?.username, 
                          avatar: activeChatShop.cyber_shopPic?.url 
                      }}
                   />
               </div>
           </div>
        </div>
      )}

      {/* DOCUMENT MODAL */}
      {activeDocShop && myProfile && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
           <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[85vh] overflow-y-auto">
               <div className="sticky top-0 bg-white p-4 flex justify-between items-center border-b border-gray-100 z-10">
                   <div className="flex items-center gap-3">
                       <FileText className="text-emerald-600" size={24} />
                       <div>
                           <h3 className="font-bold text-slate-800">Document Exchange</h3>
                           <p className="text-xs text-slate-500">with {activeDocShop.userInfo?.username}</p>
                       </div>
                   </div>
                   <button onClick={() => setActiveDocShop(null)} className="hover:bg-slate-100 p-2 rounded-full transition"><X size={20}/></button>
               </div>
               
               <div className="p-6">
                   <DocumentUpload 
                      roomId={[String(activeDocShop.userInfo?._id), String(myProfile.userInfo?._id)].sort().join("-")}
                      currentUserId={myProfile.userInfo?._id}
                      targetUserId={activeDocShop.userInfo?._id}
                   />
               </div>
           </div>
        </div>
      )}

      {/* PROFILE UPDATE MODAL */}
      <ProfileUpdateModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentProfile={myProfile}
        onUpdate={handleProfileUpdate}
        isAdmin={false}
      />
    </div>
  );
};

export default CyberUserDashboard;