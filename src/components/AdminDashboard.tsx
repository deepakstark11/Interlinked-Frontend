import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-content">
        <section className="dashboard-card">
          <h2>System Overview</h2>
          <p>View system-wide fire alerts, incident reports, and user activity.</p>
        </section>

        <section className="dashboard-card">
          <h2>Manage Users</h2>
          <p>Add, remove, or update fire agency users.</p>
          <button>Manage Users</button>
        </section>

        <section className="dashboard-card">
          <h2>Incident Reports</h2>
          <p>Review and approve reported fire incidents.</p>
          <button>View Reports</button>
        </section>

        <section className="dashboard-card">
          <h2>Settings</h2>
          <p>Modify system settings and access controls.</p>
          <button>Open Settings</button>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
