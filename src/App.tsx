import { LoadScript } from "@react-google-maps/api";
import React from "react";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./components/AdminDashboard";
import { AuthProvider } from "./components/AuthContext";
import DisasterDetails from './components/DisasterDetails';
import FireAgencyDashboard from "./components/FireAgencyDashboard";
import FireMap from "./components/FireMap";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
import IncidentList from './components/IncidentList';
import ReportIncident from './components/ReportIncident';
import Login from "./components/Login";
import Signup from "./components/Signup";
import PrivateRoute from "./components/PrivateRoute";
import Sidebar from "./components/Sidebar";
import Unauthorized from "./components/Unauthorized";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

const AppContent: React.FC = () => {
  const location = useLocation(); // Get current route

  return (
    <AuthProvider>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <div className="app-container">
          {/* Hide Sidebar on login page */}
          {location.pathname !== "/login" &&location.pathname !== "/signup" &&location.pathname !== "/forgot-password" &&location.pathname !== "/" && <Sidebar />}
          
          

          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<PrivateRoute element={<FireAgencyDashboard />} allowedRoles={["fire-agency"]} />} />
              <Route path="/map" element={<PrivateRoute element={<FireMap />} allowedRoles={["fire-agency", "admin"]} />} />
              <Route path="/admin-dashboard" element={<PrivateRoute element={<AdminDashboard />} allowedRoles={["admin"]} />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/" element={<IncidentList />} />
              <Route path="/report-incident" element={<ReportIncident />} />
              <Route path="/disaster/:id" element={<DisasterDetails disaster={{
                image: "",
                unique_id: "",
                name: "",
                description: "",
                category: "",
                location: "",
                coordinates: {
                  latitude: 0,
                  longitude: 0
                },
                weather_metadata: {
                  temperature: 0,
                  humidity: "",
                  wind: ""
                },
                event_metadata: {
                  acres_burned: undefined,
                  containment: undefined
                },
                insights: {
                  risk_level: ""
                }
              }} />} />
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
