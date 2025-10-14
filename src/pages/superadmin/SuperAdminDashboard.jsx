import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
  // State for dashboard metrics
  const [communitiesCount, setCommunitiesCount] = useState(0);
  const [hoaAdminsCount, setHoaAdminsCount] = useState(0);
  const [analytics, setAnalytics] = useState(null);
  const [features] = useState([
    'Manage multiple Communities (create, edit, delete)',
    'Assign or remove HOA Admins for communities',
    'View all payments & transactions (global reports)',
    'Generate overall analytics reports',
    'Send system-wide notifications',
  ]);

  useEffect(() => {
    // Fetch Communities Count
    axios.get('http://localhost:5000/communities')
      .then(res => setCommunitiesCount(Array.isArray(res.data) ? res.data.length : 0))
      .catch(() => setCommunitiesCount(0));

    // Fetch HOA Admins Count
    axios.get('http://localhost:5000/auth/register')
      .then(res => {
        // If API only returns ALL users, filter by admin role:
        const admins = Array.isArray(res.data)
          ? res.data.filter(user => user.role === 'admin')
          : [];
        setHoaAdminsCount(admins.length);
      })
      .catch(() => setHoaAdminsCount(0));

    // Fetch Total Payments (assuming /dashboard/total-payments exists)
    // axios.get('/dashboard/total-payments')
    //   .then(res => setTotalPayments(res.data.total))
    //   .catch(() => setTotalPayments(0));
  }, []);


  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">HOA Connect</div>
        <nav>
          <ul>
            <li className="active">Super Admin Dashboard</li>
            <li onClick={() => navigate('/manage-communities')} style={{cursor: 'pointer'}}>Communities</li>
            <li>HOA Admins</li>
            <li>Payments</li>
            <li>Analytics</li>
            <li>Notifications</li>
          </ul>
        </nav>
      </aside>
      <main className="dashboard-main">
        <h1>Super Admin Dashboard</h1>
        <div className="main-cards">
          <div className="card">
            <h2>Total Communities</h2>
            <p>{communitiesCount}</p>
          </div>
          <div className="card">
            <h2>HOA Admins Assigned</h2>
            <p>{hoaAdminsCount}</p>
          </div>
          <div className="card">
            <h2>Total Payments</h2>
            {/* <p>${dashboard.totalPayments}</p> */}
          </div>
        </div>
        <div className="dashboard-sections">
          <section className="section">
            <h3>Super Admin Features</h3>
            <ul>
              {features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </section>
          <section className="section">
            <h3>Analytics Overview</h3>
            <div className="analytics-placeholder">
              {analytics ? (
                <div>
                  {/* Render analytics data, charts, etc */}
                  <pre>{JSON.stringify(analytics, null, 2)}</pre>
                </div>
              ) : (
                "[Graph Placeholder]"
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
