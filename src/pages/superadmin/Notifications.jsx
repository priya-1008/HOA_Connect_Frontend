import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import ENDPOINTS from "../../api/endpoints";
import useFetch from "../../hooks/useFetch";

// Icons
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


// 🔹 Reusable NavLink
const NavLink = ({ icon: Icon, children, isActive, onClick }) => {
  const baseClasses =
    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium";
  const activeClasses = "bg-blue-600 text-white shadow-md hover:bg-blue-700";
  const inactiveClasses =
    "text-gray-700 hover:bg-blue-200 dark:text-gray-200 dark:hover:bg-gray-700";

  return (
    <button
      onClick={onClick || (() => {})}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <Icon className="w-5 h-5" />
      {children}
    </button>
  );
};

// 🔹 Reusable Stat Card
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

const SystemNotification = () => {
  const [communitiesCount, setCommunitiesCount] = useState(0);
  const [hoaAdminsCount, setHoaAdminsCount] = useState(0);
  const [analytics, setAnalytics] = useState({ totalPayments: 0 });
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const { data: announcements } = useFetch(ENDPOINTS.NOTIFICATIONS);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token || userRole !== "superadmin") {
      alert("Access Denied. Only Super Admins can view this page.");
      navigate("/login");
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

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
      .get("http://localhost:5000/dashboard/payments", config)
      .then((res) => setAnalytics({ totalPayments: res.data?.total || 0 }))
      .catch(() => setAnalytics({ totalPayments: 0 }));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDarkModeToggle = () => setDarkMode((prev) => !prev);

  const sendNotification = async (e) => {
    e.preventDefault();
    if (!message.trim()) return alert("Please enter a message.");
    await api.post(ENDPOINTS.SUPERADMIN.NOTIFICATIONS, { title: message });
    setMessage("");
    window.location.reload();
  };

  return (
    <div
      className={`flex flex-col h-screen w-screen transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* 🔷 Header */}
      <header
        className={`flex items-center justify-between px-10 py-4 shadow-md ${
          darkMode
            ? "bg-gray-900 text-white border-b border-gray-700"
            : "bg-blue-600 text-white border-b border-blue-200"
        }`}
      >
        <h1 className="text-4xl font-extrabold">🏘️ HOA Connect System</h1>

        <button
          onClick={handleDarkModeToggle}
          className="p-3 rounded-full transition-all bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md"
        >
          {darkMode ? (
            <SunIcon className="w-6 h-6 text-yellow-400" />
          ) : (
            <MoonIcon className="w-6 h-6 text-indigo-600" />
          )}
        </button>
      </header>

      {/* 🔹 Main Section */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`w-72 flex-shrink-0 flex flex-col shadow-2xl transition-colors duration-300 ${
            darkMode ? "bg-gray-800 text-white" : "bg-gray-300"
          }`}
        >
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <NavLink icon={HomeIcon} isActive>
              Dashboard
            </NavLink>
            <NavLink
              icon={BuildingOffice2Icon}
              onClick={() => navigate("/manage-communities")}
            >
              Communities
            </NavLink>
            <NavLink
              icon={UsersIcon}
              onClick={() => navigate("/manage-admins")}
            >
              HOA Admins
            </NavLink>
            <NavLink
              icon={CurrencyDollarIcon}
              onClick={() => navigate("/payments")}
            >
              Payments
            </NavLink>
            
            <NavLink
              icon={BellIcon}
              onClick={() => navigate("/notifications")}
            >
              Notifications
            </NavLink>
          </nav>

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

        {/* 🔸 Dashboard Content */}
        <main className="flex-1 p-8 overflow-y-auto space-y-10">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Communities"
              value={communitiesCount}
              color="text-blue-600"
              darkMode={darkMode}
            />
            <StatCard
              title="Total HOA Admins"
              value={hoaAdminsCount}
              color="text-green-600"
              darkMode={darkMode}
            />
            <StatCard
              title="Total Payments"
              value={`$${analytics.totalPayments}`}
              color="text-purple-600"
              darkMode={darkMode}
            />
          </div>

          {/* 🔔 Notifications Panel */}
          <section
            className={`rounded-xl shadow-lg p-6 ${
              darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BellIcon className="w-6 h-6 text-blue-500" />
              System Notifications
            </h2>

            {/* Send Notification Form */}
            <form onSubmit={sendNotification} className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Enter notification message"
                className="border p-3 rounded w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
                Send
              </button>
            </form>

            {/* List of Notifications */}
            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-900 border border-gray-700" : "bg-gray-50"
              }`}
            >
              <h3 className="text-lg font-semibold mb-3">All Notifications</h3>
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {announcements?.length > 0 ? (
                  announcements.map((n) => (
                    <li
                      key={n._id}
                      className="border-b border-gray-300 dark:border-gray-700 pb-2"
                    >
                      📢 {n.title}
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No notifications yet.</p>
                )}
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SystemNotification;
