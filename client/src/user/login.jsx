import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { user } from "../services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // Email hata diya jaisa aapne comment kiya tha
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. API Call (Backend automatically HttpOnly Cookie set karega)
      const res = await user.login({
        username,
        password,
      });

      // ✅ 2. LocalStorage me data save karein (UI ke liye)
      // Check karein ki response me user data kahan hai (usually res.data.data.user ya res.data.user)
      const userData = res.data?.user || res.data?.data?.user;
      
      if (userData) {
          localStorage.setItem("userData", JSON.stringify(userData));
          
          // Agar accessToken bhi localStorage me rakhna chahte ho (Optional, Cookie is better)
          // localStorage.setItem("accessToken", res.data.accessToken);
      }

      // 3. Success -> Navigate
      // Agar admin hai to admin panel, nahi to profile
      navigate("/profile"); // Ya "/profile" jo bhi apka route ho
      
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 to-green-300 p-5 animate-fadeIn">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-slideUp">

        {/* LEFT IMAGE */}
        <div className="md:w-1/2 h-56 md:h-auto">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
            alt="Village India"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-green-700 mb-1">
            Welcome Back 👋
          </h2>
          <p className="text-gray-600 mb-6">
            Login to Gramin Seva Portal
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-lg font-medium transition hover:bg-green-800 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-5 text-sm text-gray-600">
            Don’t have an account?
            <NavLink
              to="/register"
              className="ml-1 text-green-700 font-semibold hover:underline"
            >
              Create one
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}