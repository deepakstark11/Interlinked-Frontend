import React, { useContext, useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/Login.css"; // Import the new CSS file
import { AuthContext } from "./AuthContext";

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const auth = useContext(AuthContext);
  //const navigate = useNavigate();

  // Clear error when credentials change  
  useEffect(() => {
    if (error) setError(null);
  }, [credentials]);
  
  // Load remembered username if available
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setCredentials(prev => ({ ...prev, username: savedUsername }));
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await auth?.login(credentials.username, credentials.password);
    if (!success) {
      setError("Invalid username or password.");
    } else if (rememberMe) {
      localStorage.setItem("rememberedUsername", credentials.username);
    } else {
      localStorage.removeItem("rememberedUsername");
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <div className="logo-container-login">
            <img src="/interlinked_logo_white.png" alt="Interlinked Logo" className="company-logo" />
          </div>
          <h1>Welcome</h1>
          <p className="login-subtitle">Sign in to your Interlinked account</p>
          
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
                autoFocus
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

            <div className="remember-forgot">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password-link">
                  Forgot Password?
              </Link>
              
            </div>

            <button type="submit" className={`login-button ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          
          <div className="login-divider">
            <span>or</span>
          </div>
          
          <div className="social-login">
            <button className="social-button google">
              <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
              Sign in with Google
            </button>
          </div>

          <p className="footer-text">
            Don't have an account? <a href="/signup">Create account</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;