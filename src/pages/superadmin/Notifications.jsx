import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import ENDPOINTS from "../../api/endpoints";
import useFetch from "../../hooks/useFetch";
import HeaderNavbar from "./HeaderNavbar";
import { BellIcon } from "@heroicons/react/24/outline";

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

const SystemNotification = () => {
  const [communitiesCount, setCommunitiesCount] = useState(0);
  const [hoaAdminsCount, setHoaAdminsCount] = useState(0);
  const [analytics, setAnalytics] = useState({ totalPayments: 0 });

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const { data: announcements } = useFetch(ENDPOINTS.NOTIFICATIONS);
  const navigate = useNavigate();

  // dark mode toggle
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // fetch stats (only for superadmin)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token || userRole !== "superadmin") {
      alert("Access Denied. Only Super Admins can view this page.");
      navigate("/login");
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    // communities count
    axios
      .get("http://localhost:5000/communities/getCommunity", config)
      .then((res) =>
        setCommunitiesCount(Array.isArray(res.data) ? res.data.length : 0)
      )
      .catch(() => setCommunitiesCount(0));

    // HOA admins count
    axios
      .get("http://localhost:5000/auth/register", config)
      .then((res) => {
        const admins = Array.isArray(res.data)
          ? res.data.filter((user) => user.role === "admin")
          : [];
        setHoaAdminsCount(admins.length);
      })
      .catch(() => setHoaAdminsCount(0));

    // payments analytics
    axios
      .get("http://localhost:5000/dashboard/payments", config)
      .then((res) => setAnalytics({ totalPayments: res.data?.total || 0 }))
      .catch(() => setAnalytics({ totalPayments: 0 }));
  }, [navigate]);

  const sendNotification = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      alert("Please enter both title and message.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await api.post(
        "http://localhost:5000/superadmin/addnotifications",
        { title, message },
        config
      );

      setTitle("");
      setMessage("");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to send notification");
    }
  };

  const list = Array.isArray(announcements)
    ? announcements
    : announcements?.notifications || [];

  return (
    <HeaderNavbar darkMode={darkMode} setDarkMode={setDarkMode}>
      <main className="flex-1 overflow-y-auto space-y-10 p-4 md:p-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Communities"
            value={communitiesCount}
            color="text-teal-600"
            darkMode={darkMode}
          />
          <StatCard
            title="Total HOA Admins"
            value={hoaAdminsCount}
            color="text-teal-600"
            darkMode={darkMode}
          />
          <StatCard
            title="Total Payments"
            value={`$${analytics.totalPayments}`}
            color="text-teal-600"
            darkMode={darkMode}
          />
        </div>

        {/* Notifications Panel */}
        <section
          className={`rounded-xl shadow-xl p-6 md:p-8 transition-colors ${
            darkMode
              ? "bg-gradient-to-br from-teal-900 via-blue-100 to-teal-900 border border-teal-600"
              : "bg-gradient-to-br from-teal-900 via-blue-100 to-teal-900 border border-teal-600"
          }`}
        >
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            <BellIcon className="w-8 h-8" />
            System Notifications
          </h2>

          {/* Send Notification Form (responsive, two inputs) */}
          <form
            onSubmit={sendNotification}
            className="flex flex-col gap-3 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Notification title"
                className={`border p-3 rounded flex-1 transition-colors w-full ${
                  darkMode
                    ? "bg-gray-700 text-gray-200 border-gray-800 placeholder-gray-400"
                    : "bg-white border-gray-300 placeholder-gray-500"
                }`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Notification message"
                className={`border p-3 rounded flex-1 transition-colors w-full ${
                  darkMode
                    ? "bg-gray-700 text-gray-200 border-gray-800 placeholder-gray-400"
                    : "bg-white border-gray-300 placeholder-gray-500"
                }`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full md:w-auto bg-teal-700 text-white px-5 py-2 rounded-lg hover:bg-teal-800 transition font-semibold shadow text-center"
              >
                Send
              </button>
            </div>
          </form>

          {/* List of Notifications */}
          <div
            className={`p-4 rounded-lg mt-4 shadow ${
              darkMode
                ? "bg-gray-700 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <h3
              className={`text-2xl font-semibold mb-3 ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              All Notifications
            </h3>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {list.length > 0 ? (
                list.map((n) => (
                  <li
                    key={n._id}
                    className="border-b border-teal-100 dark:border-gray-200 pb-2 flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📢</span>
                      <span
                        className={
                          darkMode ? "text-gray-100 font-semibold" : "text-gray-900 font-semibold"
                        }
                      >
                        {n.title}
                      </span>
                    </div>
                    {n.message && (
                      <span
                        className={
                          darkMode ? "text-gray-200 text-sm pl-7" : "text-gray-700 text-sm pl-7"
                        }
                      >
                        {n.message}
                      </span>
                    )}
                  </li>
                ))
              ) : (
                <p
                  className={`text-lg ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No notifications yet.
                </p>
              )}
            </ul>
          </div>
        </section>
      </main>
    </HeaderNavbar>
  );
};

export default SystemNotification;
