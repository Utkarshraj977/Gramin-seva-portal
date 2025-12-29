import { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, CreditCard, Image as ImageIcon } from "lucide-react";

// Import our custom components
import InputField from "../components/Sixcomponent/InputField";
import FileUpload from "../components/Sixcomponent/FileUpload";

const Register = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [formData, setFormData] = useState({
    email: "", username: "", password: "", fullName: "", 
    phone: "", avatar: null, coverImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Phone validation (numbers only)
    if (name === "phone") {
        if (!/^\d*$/.test(value) || value.length > 10) return;
    }

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic Client Validation
    if (formData.phone.length !== 10) {
        setError("Phone number must be exactly 10 digits");
        setLoading(false);
        return;
    }
    if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));

      const res = await axios.post("http://localhost:8000/api/v1/users/register", data);
      
      // Success? Send to login
      alert("Registration Successful!");
      navigate("/login");

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0fdf4] p-4 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
        
        {/* LEFT: Branding / Image Section */}
        <div className="hidden md:flex md:w-2/5 bg-emerald-900 relative flex-col justify-between p-10 text-white">
            <img 
              src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1000&auto=format&fit=crop" 
              alt="Rural India" 
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">Join the Community</h1>
                <p className="text-emerald-100 opacity-90">Gramin Seva Portal connects you to essential services.</p>
            </div>
            <div className="relative z-10">
                <p className="text-sm opacity-70">© 2025 Gramin Vikas</p>
            </div>
        </div>

        {/* RIGHT: Form Section */}
        <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-gray-500 mb-8">Fill in your details to get started.</p>

          {/* Global Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center">
                {error}
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
            
            {/* Row 1: Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField 
                    label="Full Name" 
                    name="fullName" 
                    type="text" 
                    icon={User} 
                    placeholder="e.g. Rahul Kumar"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />
                <InputField 
                    label="Username" 
                    name="username" 
                    type="text" 
                    icon={CreditCard} 
                    placeholder="unique_user123"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Row 2: Contacts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField 
                    label="Email Address" 
                    name="email" 
                    type="email" 
                    icon={Mail} 
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <InputField 
                    label="Phone Number" 
                    name="phone" 
                    type="text" 
                    icon={Phone} 
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Row 3: Password */}
            <InputField 
                label="Password" 
                name="password" 
                type="password" 
                icon={Lock} 
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
            />

            {/* Row 4: File Uploads */}
            <div className="grid grid-cols-2 gap-5 mt-2">
                <FileUpload 
                    label="Profile Photo" 
                    name="avatar" 
                    onChange={handleChange}
                    required 
                />
                <FileUpload 
                    label="Cover Image" 
                    name="coverImage" 
                    onChange={handleChange}
                    required 
                />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Register Now"}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?
            <NavLink to="/login" className="ml-1 text-emerald-700 font-bold hover:underline">
              Log in
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;