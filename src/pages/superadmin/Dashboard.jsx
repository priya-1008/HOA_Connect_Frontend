import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeaderNavbar from "./HeaderNavbar";

// 📊 Stat Card (reuse from HeaderNavbar or copy here as needed)
const StatCard = ({ title, value, color, darkMode }) => (
  <div
    className={`p-6 rounded-xl shadow-lg transition-colors duration-300 ${
      darkMode
        ? "bg-gray-800 text-white border border-gray-700"
        : "bg-white text-gray-800 border border-gray-200"
    }`}
  >
    <p className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
      {title}
    </p>
    <h2 className={`text-4xl font-extrabold mt-2 ${darkMode ? "text-gray-100" : color}`}>
      {value}
    </h2>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();

  // 🧠 State
  const [communitiesCount, setCommunitiesCount] = useState(0);
  const [hoaAdminsCount, setHoaAdminsCount] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "superadmin") {
      alert("Access Denied. Only Super Admins can view this page.");
      navigate("/login");
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchDashboardData = async () => {
      try {
        // Fetch communities count
        const communityRes = await axios.get(
          "http://localhost:5000/communities/getCommunity",
          config
        );
        setCommunitiesCount(Array.isArray(communityRes.data) ? communityRes.data.length : 0);

        // Fetch HOA admins
        const adminRes = await axios.get(
          "http://localhost:5000/auth/register",
          config
        );
        const admins =
          Array.isArray(adminRes.data) && adminRes.data.filter((u) => u.role === "admin");
        setHoaAdminsCount(admins.length);

        // Fetch total payments
        const paymentRes = await axios.get(
          "http://localhost:5000/dashboard/total-payments",
          config
        );
        setTotalPayments(paymentRes.data?.total || 0);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  return (
    <HeaderNavbar>
      <main className={`flex-1 p-10 overflow-y-auto ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
        <h1 className={`text-4xl font-extrabold mb-10 ${darkMode ? "text-white" : "text-gray-900"}`}>
          Super Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <StatCard
            title="Total Communities"
            value={communitiesCount}
            color="text-blue-600"
            darkMode={darkMode}
          />
          <StatCard
            title="HOA Admins Assigned"
            value={hoaAdminsCount}
            color="text-purple-600"
            darkMode={darkMode}
          />
          <StatCard
            title="Total Payments"
            value={`₹${totalPayments.toLocaleString()}`}
            color="text-green-600"
            darkMode={darkMode}
          />
        </div>
        <section
          className={`p-8 rounded-xl shadow-lg transition-colors duration-300 ${
            darkMode
              ? "bg-gray-800 text-gray-100 border border-gray-700"
              : "bg-white text-gray-900 border border-gray-200"
          }`}
        >
          <h3 className={`text-2xl font-semibold mb-4 border-b pb-2 ${darkMode ? "border-gray-700 text-white" : "border-gray-200 text-gray-900"}`}>
            Global Analytics Overview
          </h3>
          <div className={`italic text-center py-20 border-2 rounded-xl border-dashed ${darkMode ? "border-gray-600 text-gray-400" : "border-gray-300 text-gray-500"}`}>
            [Chart Component Integration Placeholder — use Recharts or Chart.js]
          </div>
        </section>
      </main>
    </HeaderNavbar>
  );
};

export default Dashboard;
