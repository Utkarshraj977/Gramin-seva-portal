import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { complaintUser } from "../services/api";

const ComplaintUserRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ComplaintUserKey, setComplaintUserKey] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!ComplaintUserKey) {
      toast.error("Please enter Security PIN");
      return;
    }

    if (!/^\d{6}$/.test(ComplaintUserKey)) {
      toast.error("Security PIN must be 6 digits");
      return;
    }

    try {
      setLoading(true);
      await complaintUser.register({ ComplaintUserKey });
      toast.success("Registration Successful!");
      setTimeout(() => navigate("/complaint/user/dashboard"), 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration Failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans py-10 px-4">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />

      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-red-600 to-red-800 rounded-xl shadow-lg shadow-red-900/20">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Register Account</h1>
              <p className="text-slate-400 text-sm">Create your complaint portal account</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
          
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              <ShieldCheck size={16} className="inline mr-2" />
              Create 6-Digit Security PIN *
            </label>
            <input
              type="password"
              value={ComplaintUserKey}
              onChange={(e) => setComplaintUserKey(e.target.value)}
              placeholder="e.g., 123456"
              maxLength="6"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-red-500 transition-colors text-center text-2xl tracking-widest"
              required
            />
            <p className="text-xs text-slate-500 mt-2">Remember this PIN for future logins</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <ShieldCheck size={20} />
                Register Account
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ComplaintUserRegister;