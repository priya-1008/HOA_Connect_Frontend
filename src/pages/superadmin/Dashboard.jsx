import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeaderNavbar from "./HeaderNavbar";

// 🔹 Reusable Stat Card
const StatCard = ({ title, value, color, darkMode }) => (
  <div
    className={`p-6 rounded-xl shadow-lg transition-colors duration-300 ${
      darkMode
        ? "bg-gradient-to-br from-teal-100 via-blue-100 to-teal-900 text-gray-700 border border-violet-800"
        : "bg-gradient-to-br from-teal-100 via-indigo-50 to-teal-900 text-violet-900 border border-violet-300"
    }`}
  >
    <p className="text-sm font-medium mb-1 text-teal-900">{title}</p>
    <h2 className={`text-4xl font-extrabold mt-2 ${color}`}>{value}</h2>
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

  const [stats, setStats] = useState({
    totalCommunities: 0,
    totalHOAAdmins: 0,
    totalAmenities: 0,
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/superadmin/dashboard", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) =>
        setStats({
          totalCommunities: res.data.totalCommunities,
          totalHOAAdmins: res.data.totalHOAAdmins,
          totalAmenities: res.data.totalAmenities,
        })
      )
      .catch((err) => console.error("Error loading stats:", err));
  }, []);

  return (
    <HeaderNavbar darkMode={darkMode} setDarkMode={setDarkMode}>
      <main className="flex-1 overflow-y-auto space-y-10">
        {/* Dashboard Header */}
        <h1
          className="text-4xl font-extrabold mb-6 flex items-center gap-2 
        text-gray-900"
        >
          Super Admin Dashboard
        </h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Communities"
            value={stats.totalCommunities}
            color="text-blue-600"
            darkMode={darkMode}
          />
          <StatCard
            title="HOA Admins"
            value={stats.totalHOAAdmins}
            color="text-purple-600"
            darkMode={darkMode}
          />
          <StatCard
            title="Total Amenities"
            value={stats.totalAmenities}
            color="text-green-600"
            darkMode={darkMode}
          />
        </div>

        {/* Analytics Section */}
        <section
          className={`rounded-xl shadow-xl p-8 transition-colors
          ${
            darkMode
              ? "bg-gradient-to-br from-teal-900 via-blue-100 to-teal-900 border border-teal-600"
              : "bg-gradient-to-br from-teal-900 via-blue-100 to-teal-900 border border-teal-600"
          }`}
        >
          <h3
            className={`text-2xl font-semibold mb-4 border-b pb-2
          ${
            darkMode
              ? "border-gray-700 text-white"
              : "border-gray-200 text-gray-900"
          }`}
          >
            Global Analytics Overview
          </h3>
          <div
            className={`italic text-center py-20 border-2 rounded-xl border-dashed 
          ${
            darkMode
              ? "border-gray-600 text-gray-400"
              : "border-gray-300 text-gray-500"
          }`}
          >
            [Chart Component Integration Placeholder — use Recharts or Chart.js]
          </div>
        </section>
      </main>
    </HeaderNavbar>
  );
};

export default Dashboard;
