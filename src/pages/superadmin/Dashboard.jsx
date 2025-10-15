import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 🧩 Icons
import {
  HomeIcon,
  BuildingOffice2Icon,
  UsersIcon,
  CurrencyDollarIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

// 🧭 Reusable Sidebar Link
const NavLink = ({ icon: Icon, label, onClick, isActive }) => {
  const base =
    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium";
  const active = "bg-blue-600 text-white shadow-md hover:bg-blue-700";
  const inactive =
    "text-gray-700 hover:bg-blue-200 dark:text-gray-200 dark:hover:bg-gray-700";

  return (
    <button onClick={onClick} className={`${base} ${isActive ? active : inactive}`}>
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
};

// 📊 Reusable Stat Card
const StatCard = ({ title, value, color, darkMode }) => (
  <div
    className={`p-6 rounded-xl shadow-lg transition-colors duration-300 ${
      darkMode
        ? "bg-gray-800 text-white border border-gray-700"
        : "bg-white border border-gray-200"
    }`}
  >
    <p className="text-sm text-gray-500 font-medium">{title}</p>
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

  // 🌙 Handle Dark Mode Toggle
  const handleDarkModeToggle = () => setDarkMode((prev) => !prev);

  // 🚪 Logout Handler
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // 🧩 Features List
  const features = [
    "Manage multiple Communities (create, edit, delete)",
    "Assign or remove HOA Admins for communities",
    "View all payments & transactions (global reports)",
    "Generate overall analytics reports",
    "Send system-wide notifications",
  ];

  // 🌍 Apply Dark Mode
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // 📦 Fetch Dashboard Data
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
        const adminRes = await axios.get("http://localhost:5000/auth/register", config);
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
    <div
      className={`flex flex-col h-screen w-screen transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* 🏘️ Header */}
      <header
        className={`flex items-center justify-between px-10 py-4 shadow-md transition-colors duration-300 ${
          darkMode
            ? "bg-gray-900 border-b border-gray-700"
            : "bg-blue-600 text-white border-b border-blue-600"
        }`}
      >
        <h1 className="text-4xl font-extrabold">🏘️ HOA Connect System</h1>

        {/* 🌙 Dark Mode Toggle */}
        <button
          onClick={handleDarkModeToggle}
          className="flex items-center justify-center p-3 rounded-full transition-all bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? (
            <SunIcon className="w-6 h-6 text-yellow-400" />
          ) : (
            <MoonIcon className="w-6 h-6 text-indigo-600" />
          )}
        </button>
      </header>

      {/* ⚙️ Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* 🧭 Sidebar */}
        <aside
          className={`w-72 flex-shrink-0 flex flex-col shadow-2xl transition-colors duration-300 ${
            darkMode ? "bg-gray-800 text-white" : "bg-gray-300 border-gray-300"
          }`}
        >
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <NavLink icon={HomeIcon} label="Dashboard" isActive />
            <NavLink
              icon={BuildingOffice2Icon}
              label="Communities"
              onClick={() => navigate("/manage-communities")}
            />
            <NavLink
              icon={UsersIcon}
              label="HOA Admins"
              onClick={() => navigate("/manage-admins")}
            />
            <NavLink
              icon={CurrencyDollarIcon}
              label="Payments"
              onClick={() => navigate("/payments")}
            />
            <NavLink
              icon={BellIcon}
              label="Notifications"
              onClick={() => navigate("/notifications")}
            />
          </nav>

          {/* 🚪 Logout */}
          <div className="p-4 border-t border-gray-300 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-black transition-all font-semibold shadow-md"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* 🧮 Main Dashboard */}
        <main className="flex-1 p-10 overflow-y-auto">
          <h1 className="text-4xl font-extrabold mb-10">Super Admin Dashboard</h1>

          {/* 🔢 Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <StatCard
              title="Total Communities"
              value={communitiesCount}
              color="text-blue-600 dark:text-blue-400"
              darkMode={darkMode}
            />
            <StatCard
              title="HOA Admins Assigned"
              value={hoaAdminsCount}
              color="text-purple-600 dark:text-purple-400"
              darkMode={darkMode}
            />
            <StatCard
              title="Total Payments"
              value={`₹${totalPayments.toLocaleString()}`}
              color="text-green-600 dark:text-green-400"
              darkMode={darkMode}
            />
          </div>

          {/* 🧩 Key Features */}
          <section
            className={`p-8 rounded-xl shadow-lg mb-12 transition-colors duration-300 ${
              darkMode
                ? "bg-gray-800 text-white border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
              Key Super Admin Features
            </h3>
            <ul className="list-disc pl-6 space-y-3 text-lg text-gray-700 dark:text-gray-300">
              {features.map((f, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  {f}
                </li>
              ))}
            </ul>
          </section>

          {/* 📈 Analytics Placeholder */}
          <section
            className={`p-8 rounded-xl shadow-lg transition-colors duration-300 ${
              darkMode
                ? "bg-gray-800 text-white border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
              Global Analytics Overview
            </h3>
            <div className="text-gray-500 italic text-center py-20 border-2 rounded-xl border-dashed border-gray-300 dark:border-gray-600 dark:text-gray-400">
              [Chart Component Integration Placeholder — use Recharts or Chart.js]
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
