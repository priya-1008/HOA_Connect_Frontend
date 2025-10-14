import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

// import Navbar from "../../components/Navbar";
// import Sidebar from "../../components/Sidebar";
// import DashboardCard from "../../components/DashboardCard";
// import LoadingSpinner from "../../components/LoadingSpinner";

import { fetchDashboardData } from "../../api/axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import {
  Bell,
  Users,
  FileText,
  DollarSign,
  Home,
  BarChart2,
  Settings,
} from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    users: 0,
    posts: 0,
    comments: 0,
    analytics: [],
    notifications: [],
    announcements: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashRes = await fetchDashboardData();
        // fetchDashboardData(),
        // fetchNotifications(),
        // fetchAnnouncements(),
        // ]);

        setDashboardData({
          users: dashRes?.data?.users || 0,
          posts: dashRes?.data?.posts || 0,
          comments: dashRes?.data?.comments || 0,
          analytics: dashRes?.data?.analytics || [],
          notifications: dashRes?.data?.notifications || [],
          announcements: dashRes?.data?.announcements || [],
        });
      } catch (error) {
        console.error("Error fetching dashboard info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // if (loading) return <LoadingSpinner />;

  const chartData = {
    labels: dashboardData.analytics?.map((item) => item.date) || [],
    datasets: [
      {
        label: "Daily Analytics",
        data: dashboardData.analytics?.map((item) => item.value) || [],
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
      },
    ],
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 text-blue-700 text-2xl font-bold border-b border-gray-100">
          HOA Connect
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium">
            <Bell size={18} /> Announcements
          </button>

          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100">
            <Users size={18} /> Residents
          </button>

          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100">
            <FileText size={18} /> Complaints
          </button>

          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100">
            <DollarSign size={18} /> Payments
          </button>

          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100">
            <Home size={18} /> Amenities
          </button>

          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100">
            <BarChart2 size={18} /> Analytics
          </button>

          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100">
            <Settings size={18} /> Settings
          </button>
        </nav>
      </aside>
      {/* Main Dashboard */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
            Logout
          </button>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-gray-500 text-sm font-medium">Total Residents</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              {dashboardData.users}
            </h2>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-gray-500 text-sm font-medium">
              Pending Complaints
            </p>
            <h2 className="text-3xl font-bold text-red-500 mt-2">
              {dashboardData.complaints}
            </h2>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-gray-500 text-sm font-medium">Total Payments</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">
              ₹{dashboardData.payments}
            </h2>
          </div>
        </div>

        {/* Announcements & Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Announcements */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4">Announcements</h3>
            {dashboardData.announcements?.length > 0 ? (
              <ul className="space-y-3 text-gray-700">
                {dashboardData.announcements.map((item, index) => (
                  <li key={index}>📢 {item.title || item.message}</li>
                ))}
              </ul>
            ) : (
              <p>No announcements available</p>
            )}
            <button className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
              View All
            </button>
          </div>
          {/* Analytics Graph */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4">Community Analytics</h3>
            {dashboardData.analytics?.length > 0 ? (
              <Line data={chartData} />
            ) : (
              <p>No analytics data available</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
