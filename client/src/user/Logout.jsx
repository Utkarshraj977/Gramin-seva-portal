import { useNavigate } from "react-router-dom";
// import "./logout.css";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // 🔔 CONFIRMATION ALERT
    const confirmLogout = window.confirm(
      "Kya aap sach me Gramin Seva Portal se logout karna chahte hain?"
    );

    if (!confirmLogout) return;

    try {
      await fetch("http://localhost:8000/api/v1/users/logout", {
        method: "POST",
        credentials: "include", // 🔥 cookies clear karne ke liye
      });

      localStorage.removeItem("userData");
      navigate("/");
    } catch (err) {
      alert("Logout failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="logout-page">
      <div className="logout-card">

        {/* IMAGE */}
        <div className="logout-image">
          <img
            src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
            alt="Village Nature"
          />
        </div>

        {/* CONTENT */}
        <div className="logout-content">
          <h2>Logout Confirmation</h2>
          <p>
            Aap <b>Gramin Seva Portal</b> se logout kar rahe hain.  
            Aap kabhi bhi dobara login karke  
            gaon ke vikas ka hissa ban sakte hain.
          </p>

          <div className="logout-actions">
            <button className="cancel-btn" onClick={() => navigate("/dashboard")}>
              Cancel
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <span className="footer-text">
            🌿 Digital India for Villages
          </span>
        </div>

      </div>
    </div>
  );
}
