// signup.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";

const Signup = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "fire-agency",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (credentials.password !== credentials.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: credentials.username,
          email: credentials.email,
          password: credentials.password,
          role: credentials.role,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ username: data.username, role: data.role }));
      alert("Signup Successful");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-box">
          <div className="logo-container">
            <img src="/interlinked_logo_white.png" alt="Interlinked Logo" className="company-logo" />
          </div>
          <h1>Create Account</h1>
          <p className="signup-subtitle">Sign up for your Interlinked account</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSignup}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={credentials.confirmPassword}
                onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
                required
              />
            </div>
            <div className={`input-group custom-dropdown-container ${dropdownOpen ? 'open' : ''}`}>
              <select
                className="custom-dropdown"
                value={credentials.role}
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => setDropdownOpen(false)}
                onChange={(e) => {
                  setCredentials({ ...credentials, role: e.target.value });
                  setDropdownOpen(false);
                }}
              >
                <option value="fire-agency">🚒 Fire Agency</option>
                <option value="admin">🛠️ Admin</option>
              </select>

            </div>

            <button type="submit" className={`signup-button ${loading ? "loading" : ""}`} disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="footer-text">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
