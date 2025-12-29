import { useState } from "react";
// import "./changePassword.css";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:8000/api/v1/users/change-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // 🔥 MUST
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Password change failed");
      }

      setMessage("Password changed successfully ✅");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-page">
      <div className="cp-card animate-fadeUp">

        {/* IMAGE SIDE */}
        <div className="cp-image">
          <img
            src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
            alt="Village Nature"
          />
          <div className="cp-overlay-text">
            🌾 Secure your account<br />for a better tomorrow
          </div>
        </div>

        {/* FORM SIDE */}
        <div className="cp-form">
          <h2>Change Password</h2>
          <p>Apna account surakshit rakhein</p>

          {error && <div className="error-box">{error}</div>}
          {message && <div className="success-box">{message}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>

          <span className="cp-footer">
            🔒 Gramin Seva | Digital India for Villages
          </span>
        </div>
      </div>
    </div>
  );
}
