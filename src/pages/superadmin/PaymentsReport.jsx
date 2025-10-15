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

// ✅ Reusable NavLink component
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

const PaymentsReport = () => {
  const [payments, setPayments] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const navigate = useNavigate();

  // ✅ Apply dark mode to document root
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // ✅ Fetch payments data securely
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
      .get("http://localhost:5000/payments/getAll", config)
      .then((res) => setPayments(res.data || []))
      .catch((err) => console.error("Error fetching payments:", err));
  }, [navigate]);

  const total = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDarkModeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div
      className={`flex flex-col h-screen w-screen transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* 🔵 Header */}
      <header
        className={`flex items-center bg-blue-600 justify-between px-10 py-4 shadow-md transition-colors duration-300 ${
          darkMode
            ? "bg-gray-900 text-white border-b border-gray-700"
            : "bg-blue-600 text-white border-b border-blue-600"
        }`}
      >
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-extrabold"> 🏘️ HOA Connect System</h1>
        </div>

        {/* 🔆 Dark Mode Toggle */}
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

      {/* 🔵 Main Content: Sidebar + Table */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`w-72 flex-shrink-0 flex flex-col shadow-2xl transition-colors duration-300 ${
            darkMode ? "bg-gray-800 text-white" : "bg-gray-300 border-gray-300"
          }`}
        >
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <NavLink
              icon={HomeIcon}
              onClick={() => navigate("/superadmin-dashboard")}
            >
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
              isActive={true}
            >
              Payments
            </NavLink>

            <NavLink icon={ChartBarIcon} onClick={() => navigate("/analytics")}>
              Analytics
            </NavLink>

            <NavLink icon={BellIcon} onClick={() => navigate("/notifications")}>
              Notifications
            </NavLink>
          </nav>

          {/* Logout */}
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

        {/* 🔵 Main Payments Report Section */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          <h2 className="text-3xl font-bold mb-6">Payments & Reports</h2>

          {/* Total Payments Summary */}
          <div
            className={`p-6 rounded-xl shadow-md text-center text-2xl font-semibold ${
              darkMode
                ? "bg-gray-800 text-green-400 border border-gray-700"
                : "bg-white text-green-600 border border-gray-200"
            }`}
          >
            Total Payments: ₹{total.toLocaleString()}
          </div>

          {/* Payments Table */}
          <div
            className={`rounded-xl overflow-hidden shadow-lg ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <table className="min-w-full text-left">
              <thead
                className={`${
                  darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100"
                }`}
              >
                <tr>
                  <th className="p-4">Resident</th>
                  <th className="p-4">Community</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.length > 0 ? (
                  payments.map((p) => (
                    <tr
                      key={p._id}
                      className={`border-t ${
                        darkMode
                          ? "border-gray-700 hover:bg-gray-700"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <td className="p-4">{p.resident?.name || "N/A"}</td>
                      <td className="p-4">{p.community?.name || "N/A"}</td>
                      <td className="p-4 font-semibold text-green-600 dark:text-green-400">
                        ₹{p.amount}
                      </td>
                      <td className="p-4">
                        {new Date(p.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center p-6 text-gray-500 dark:text-gray-400"
                    >
                      No payment records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentsReport;
