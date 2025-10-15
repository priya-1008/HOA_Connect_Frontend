import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [communitiesCount, setCommunitiesCount] = useState(0);
  const [hoaAdminsCount, setHoaAdminsCount] = useState(0);
  const [analytics, setAnalytics] = useState({ totalPayments: 0 });

  const navigate = useNavigate();

  const features = [
    "Manage multiple Communities (create, edit, delete)",
    "Assign or remove HOA Admins for communities",
    "View all payments & transactions (global reports)",
    "Generate overall analytics reports",
    "Send system-wide notifications",
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token || userRole !== "superadmin") {
      alert("Access Denied. Only Super Admins can view this page.");
      navigate("/login");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Fetch total communities
    axios
      .get("http://localhost:5000/communities/getCommunity", config)
      .then((res) => {
        setCommunitiesCount(Array.isArray(res.data) ? res.data.length : 0);
      })
      .catch(() => setCommunitiesCount(0));

    // Fetch HOA admins
    axios
      .get("http://localhost:5000/auth/register", config)
      .then((res) => {
        const admins = Array.isArray(res.data)
          ? res.data.filter((user) => user.role === "admin")
          : [];
        setHoaAdminsCount(admins.length);
      })
      .catch(() => setHoaAdminsCount(0));

    // Fetch total payments
    axios
      .get("http://localhost:5000/dashboard/total-payments", config)
      .then((res) => {
        const total = res.data?.total || 0;
        setAnalytics({ totalPayments: total });
      })
      .catch(() => {
        setAnalytics({ totalPayments: 0 });
      });
  }, [navigate]);

  return (
    <div className="flex h-screen w-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 text-blue-700 text-2xl font-bold border-b border-gray-100">
          HOA Connect
        </div>
        <nav className="flex-1 p-4 space-y-2 text-left">
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-100 font-medium">
            Dashboard
          </button>
          <button
            onClick={() => navigate("/manage-communities")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-100"
          >
            Communities
          </button>
          <button
            onClick={() => navigate("/hoa-admins")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-100"
          >
            HOA Admins
          </button>
          <button
            onClick={() => navigate("/payments")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-100"
          >
            Payments
          </button>
          <button
            onClick={() => navigate("/analytics")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-100"
          >
            Analytics
          </button>
          <button
            onClick={() => navigate("/notifications")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-100"
          >
            Notifications
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-sm text-gray-500 font-medium">
              Total Communities
            </p>
            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {communitiesCount}
            </h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-sm text-gray-500 font-medium">
              HOA Admins Assigned
            </p>
            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {hoaAdminsCount}
            </h2>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-sm text-gray-500 font-medium">Total Payments</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">
              ₹{analytics.totalPayments.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h3 className="text-xl font-semibold mb-4">Super Admin Features</h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            {features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>

        {/* Analytics Graph Placeholder */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">Analytics Overview</h3>
          <div className="text-gray-500 italic text-center py-10 border rounded-lg">
            [Graph Placeholder]
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;