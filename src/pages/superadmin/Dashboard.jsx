import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


// Heroicons
import {
  HomeIcon,
  BuildingOffice2Icon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { TbBackground } from "react-icons/tb";
import { HomeModernIcon } from "@heroicons/react/24/outline";

// Helper components
const NavLink = ({ to, icon: Icon, children, isActive, onClick }) => {
  const baseClasses =
    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium";
  const activeClasses = "bg-blue-600 text-white shadow-md hover:bg-blue-700";
  const inactiveClasses =
    "text-gray-700 hover:bg-blue-200 dark:text-gray-200 dark:hover:bg-gray-700";

  return (
    <button
      onClick={onClick ? onClick : () => {}}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <Icon className="w-5 h-5" />
      {children}
    </button>
  );
};

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
  const [communitiesCount, setCommunitiesCount] = useState(0);
  const [hoaAdminsCount, setHoaAdminsCount] = useState(0);
  const [analytics, setAnalytics] = useState({ totalPayments: 0 });
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });

  const navigate = useNavigate();

  const features = [
    "Manage multiple Communities (create, edit, delete)",
    "Assign or remove HOA Admins for communities",
    "View all payments & transactions (global reports)",
    "Generate overall analytics reports",
    "Send system-wide notifications",
  ];

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

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

    axios
      .get("http://localhost:5000/communities/getCommunity", config)
      .then((res) =>
        setCommunitiesCount(Array.isArray(res.data) ? res.data.length : 0)
      )
      .catch(() => setCommunitiesCount(0));

    axios
      .get("http://localhost:5000/auth/register", config)
      .then((res) => {
        const admins = Array.isArray(res.data)
          ? res.data.filter((user) => user.role === "admin")
          : [];
        setHoaAdminsCount(admins.length);
      })
      .catch(() => setHoaAdminsCount(0));

    axios
      .get("http://localhost:5000/dashboard/total-payments", config)
      .then((res) => setAnalytics({ totalPayments: res.data?.total || 0 }))
      .catch(() => setAnalytics({ totalPayments: 0 }));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDarkModeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div
      className={`flex flex-col h-screen w-screen transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* 🔵 Top Full-Width Header Bar */}
      <header
        className={`flex items-center bg-blue-600 justify-between px-10 py-4 shadow-md transition-colors duration-300 ${
          darkMode
            ? "bg-gray-900 text-white border-b border-gray-700"
            : "bg-blue-150 text-gray-800 border-b border-blue-150"
        }`}
      >
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-extrabold text-white dark:text-white">
          🏘️ HOA Connect System
          </h1> 
        </div>

        {/* 🔆 Dark Mode Toggle in Header */}
        <button
          onClick={handleDarkModeToggle}
          className="flex items-center justify-center p-3 rounded-full transition-all text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? (
            <SunIcon className="w-6 h-6 text-yellow-400" />
          ) : (
            <MoonIcon className="w-6 h-6 text-indigo-600" />
          )}
        </button>
      </header>

      {/* 🔵 Main Content Area: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`w-72 flex-shrink-0 flex flex-col shadow-2xl transition-colors duration-300 
          ${darkMode ? "bg-gray-800 text-white" : "bg-gray-300 border-gray-300"}`}
        >
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <NavLink icon={HomeIcon} isActive={false}>
              Dashboard
            </NavLink>
            <NavLink
              icon={BuildingOffice2Icon}
              onClick={() => navigate("/manage-communities")}
            >
              Communities
            </NavLink>

            <NavLink icon={UsersIcon} onClick={() => navigate("/manage-admins")}>
              HOA Admins
            </NavLink>

            <NavLink
              icon={CurrencyDollarIcon}
              onClick={() => navigate("/payments")}
            >
              Payments
            </NavLink>

            <NavLink icon={BellIcon} onClick={() => navigate("/notifications")}>
              Notifications
            </NavLink>
          </nav>

          <div className="p-4 border-t border-gray-300 dark:border-gray-700 space-y-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-black transition-all font-semibold shadow-md"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-10 overflow-y-auto">
          <h1 className="text-4xl font-extrabold mb-10">Super Admin Dashboard</h1>

          {/* Stats */}
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
              value={`₹${analytics.totalPayments.toLocaleString()}`}
              color="text-green-600 dark:text-green-400"
              darkMode={darkMode}
            />
          </div>

          {/* Features */}
          <div
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
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Analytics Placeholder */}
          <div
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
              [Chart Component Integration Placeholder: Use Recharts or Chart.js]
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
