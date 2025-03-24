import React, { useState } from 'react';
import '../styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to handle password reset (e.g., API call)
    alert('If you are registered with this email, a password reset link has been sent to: ' + email);
  };

  return (
    <div className="forgot-page">
      <div className="forgot-password-container">
        <div className="forgot-box">
            <div className="logo-container-forgot">
            <img src="/interlinked_logo_white.png" alt="Interlinked Logo" className="company-logo" />
            </div>
        <h2>Forgot Password?</h2>
        <p className="forgot-subtitle">No Problem! Enter your email or username below and we will send you an email with instructions to reset your password.</p>
        
        <form onSubmit={handleSubmit}>
            <div className="input"> 
          <input
            type="email"
            placeholder="Enter your email address"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          </div>
          <button type="submit" className="submit-btn">
            Send Reset Link
          </button>
        </form>
        <div className="back-to-login">
          <span>
            <a href="/login">Back to Login</a>
          </span>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ForgotPassword;














