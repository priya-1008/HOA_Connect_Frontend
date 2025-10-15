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
  ClipboardDocumentListIcon,
  DocumentDuplicateIcon,
  CalendarDaysIcon,
  MegaphoneIcon,
  InboxStackIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

// 🧭 Sidebar NavLink Component
const NavLink = ({ icon: Icon, label, isActive, onClick }) => {
  const base =
    "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all";
  const active =
    "bg-blue-600 text-white shadow-md hover:bg-blue-700";
  const inactive =
    "text-gray-800 hover:bg-blue-200 dark:text-gray-200 dark:hover:bg-gray-700";

  return (
    <button
      onClick={onClick}
      className={`${base} ${isActive ? active : inactive} w-full text-left`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
};

// 🧩 Stat Card Component
const StatCard = ({ title, value, color, darkMode }) => (
  <div
    className={`p-6 rounded-xl shadow-lg border transition-colors duration-300 ${
      darkMode
        ? "bg-gray-800 border-gray-700 text-white"
        : "bg-white border-gray-200 text-gray-800"
    }`}
  >
    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
      {title}
    </p>
    <h2 className={`text-4xl font-extrabold mt-2 ${color}`}>{value}</h2>
  </div>
);

const HOAAdminDashboard = () => {
  const navigate = useNavigate();

  // 🔢 Dashboard States
  const [counts, setCounts] = useState({
    communities: 0,
    residents: 0,
    admins: 0,
    complaints: 0,
    announcements: 0,
    amenities: 0,
    totalPayments: 0,
  });
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  // 🌗 Handle Dark Mode Toggle
  const handleDarkModeToggle = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", newMode);
      return newMode;
    });
  };

  // 🚀 Fetch Dashboard Data
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || (role !== "admin" && role !== "superadmin")) {
      alert("Access Denied. Only Super Admins and Admins can view this page.");
      navigate("/login");
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    Promise.all([
      axios.get("http://localhost:5000/communities/getCommunity", config),
      axios.get("http://localhost:5000/auth/register", config),
      axios.get("http://localhost:5000/residents/getResidents", config),
      axios.get("http://localhost:5000/complaints/getComplaints", config),
      axios.get("http://localhost:5000/announcements/getAnnouncements", config),
      axios.get("http://localhost:5000/amenities/getAmenities", config),
      axios.get("http://localhost:5000/dashboard/total-payments", config),
    ])
      .then(
        ([
          communitiesRes,
          usersRes,
          residentsRes,
          complaintsRes,
          announcementsRes,
          amenitiesRes,
          paymentsRes,
        ]) => {
          const admins = Array.isArray(usersRes.data)
            ? usersRes.data.filter((u) => u.role === "admin")
            : [];

          setCounts({
            communities: communitiesRes.data?.length || 0,
            admins: admins.length,
            residents: residentsRes.data?.length || 0,
            complaints: complaintsRes.data?.length || 0,
            announcements: announcementsRes.data?.length || 0,
            amenities: amenitiesRes.data?.length || 0,
            totalPayments: paymentsRes.data?.total || 0,
          });
        }
      )
      .catch(() => {
        setCounts({
          communities: 0,
          residents: 0,
          admins: 0,
          complaints: 0,
          announcements: 0,
          amenities: 0,
          totalPayments: 0,
        });
      });
  }, [navigate]);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // 📊 Sidebar Menu Items
  const menuItems = [
    { label: "Dashboard", icon: HomeIcon, path: "/admin-dashboard" },
    { label: "Communities", icon: BuildingOffice2Icon, path: "/communities" },
    { label: "Residents", icon: UsersIcon, path: "/manage-residents" },
    { label: "Announcements", icon: MegaphoneIcon, path: "/post-announcements" },
    { label: "Complaints", icon: ClipboardDocumentListIcon, path: "/complaints" },
    { label: "Amenities", icon: ChartBarIcon, path: "/amenities" },
    { label: "Documents", icon: DocumentDuplicateIcon, path: "/documents" },
    { label: "Meetings", icon: CalendarDaysIcon, path: "/meetings" },
    { label: "Polls", icon: InboxStackIcon, path: "/polls" },
    { label: "Notifications", icon: BellIcon, path: "/notifications" },
  ];

  return (
    <div
      className={`flex flex-col h-screen w-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* 🌐 Header */}
      <header
        className={`flex items-center justify-between px-10 py-4 shadow-md ${
          darkMode ? "bg-gray-800" : "bg-blue-600 text-white"
        }`}
      >
        <h1 className="text-3xl font-extrabold tracking-wide">
          🏘️ HOA Connect Admin Panel
        </h1>

        {/* 🌗 Dark Mode Toggle Only */}
        <button
          onClick={handleDarkModeToggle}
          className="p-3 rounded-full bg-white dark:bg-gray-700 shadow-md hover:scale-105 transition"
        >
          {darkMode ? (
            <SunIcon className="w-6 h-6 text-yellow-400" />
          ) : (
            <MoonIcon className="w-6 h-6 text-indigo-700" />
          )}
        </button>
      </header>

      {/* 🧭 Sidebar + Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`w-72 flex-shrink-0 flex flex-col justify-between transition-all duration-300 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          } shadow-lg`}
        >
          <div className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item, idx) => (
              <NavLink
                key={idx}
                icon={item.icon}
                label={item.label}
                onClick={() => navigate(item.path)}
              />
            ))}
          </div>

          {/* 🚪 Logout at Bottom */}
          <div className="p-4 border-t border-gray-300 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-all font-bold shadow-md"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              LOG OUT
            </button>
          </div>
        </aside>

        {/* Dashboard Main Content */}
        <main className="flex-1 p-10 overflow-y-auto">
          <h1 className="text-4xl font-bold mb-10">Admin Dashboard Overview</h1>

          {/* 🔹 Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
            <StatCard
              title="Total Communities"
              value={counts.communities}
              color="text-blue-600 dark:text-blue-400"
              darkMode={darkMode}
            />
            <StatCard
              title="Total Residents"
              value={counts.residents}
              color="text-indigo-600 dark:text-indigo-400"
              darkMode={darkMode}
            />
            <StatCard
              title="Total HOA Admins"
              value={counts.admins}
              color="text-purple-600 dark:text-purple-400"
              darkMode={darkMode}
            />
            <StatCard
              title="Complaints"
              value={counts.complaints}
              color="text-red-600 dark:text-red-400"
              darkMode={darkMode}
            />
            <StatCard
              title="Announcements"
              value={counts.announcements}
              color="text-orange-600 dark:text-orange-400"
              darkMode={darkMode}
            />
            <StatCard
              title="Amenities"
              value={counts.amenities}
              color="text-teal-600 dark:text-teal-400"
              darkMode={darkMode}
            />
            <StatCard
              title="Total Payments"
              value={`₹${counts.totalPayments.toLocaleString()}`}
              color="text-green-600 dark:text-green-400"
              darkMode={darkMode}
            />
          </div>

          {/* 🔸 Analytics Section */}
          <div
            className={`p-8 rounded-xl shadow-lg transition-colors duration-300 ${
              darkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2">
              Global Analytics Overview
            </h3>
            <div className="text-gray-500 italic text-center py-20 border-2 rounded-xl border-dashed dark:border-gray-600">
              [Chart Integration Placeholder — use Recharts or Chart.js here]
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HOAAdminDashboard;
