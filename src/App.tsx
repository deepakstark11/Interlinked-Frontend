import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";
import { AuthProvider } from "./components/AuthContext";
import Sidebar from "./components/Sidebar";
import FireMap from "./components/FireMap";
import Login from "./components/Login";
import Unauthorized from "./components/Unauthorized";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./components/AdminDashboard";
import "./App.css";
import FireAgencyDashboard from "./components/FireAgencyDashboard";
import Home from "./components/Home";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

const AppContent: React.FC = () => {
  const location = useLocation(); // Get current route

  return (
    <AuthProvider>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <div className="app-container">
          {/* Hide Sidebar on login page */}
          {location.pathname !== "/login" &&location.pathname !== "/" && <Sidebar />}

          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<PrivateRoute element={<FireAgencyDashboard />} allowedRoles={["fire-agency"]} />} />
              <Route path="/map" element={<PrivateRoute element={<FireMap />} allowedRoles={["fire-agency", "admin"]} />} />
              <Route path="/admin-dashboard" element={<PrivateRoute element={<AdminDashboard />} allowedRoles={["admin"]} />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
          </div>
        </div>
      </LoadScript>
    </AuthProvider>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
