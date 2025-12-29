import { useState } from "react";
// import "./updateAccount.css";

export default function UpdateAccount() {
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  const [fullName, setFullName] = useState(userData.fullName || "");
  const [email, setEmail] = useState(userData.email || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!fullName || !email) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:8000/api/v1/users/update-account",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 🔥 MUST
          body: JSON.stringify({ fullName, email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      // update local storage
      localStorage.setItem("userData", JSON.stringify(data.data));

      setMessage("Account details updated successfully ✅");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ua-page">
      <div className="ua-card animate-fadeUp">

        {/* IMAGE SIDE */}
        <div className="ua-image">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
            alt="Village Digital India"
          />
          <div className="ua-overlay">
            🌾 Apni pehchan sudhaarein  
            <br /> Digital Gaon ke saath
          </div>
        </div>

        {/* FORM SIDE */}
        <div className="ua-form">
          <h2>Update Profile</h2>
          <p>Apni jankari hamesha sahi rakhein</p>

          {error && <div className="error-box">{error}</div>}
          {message && <div className="success-box">{message}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Details"}
            </button>
          </form>

          <span className="ua-footer">
            👤 Gramin Seva | Profile Settings
          </span>
        </div>
      </div>
    </div>
  );
}
