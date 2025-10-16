import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  BuildingOffice2Icon,
  UsersIcon,
  BellIcon,
  CurrencyDollarIcon,
  MegaphoneIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  FolderIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const StatCard = ({ title, value, color, icon: Icon }) => (
  <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col items-start justify-center hover:scale-[1.02] transition-all duration-300">
    <div className="flex items-center gap-3 mb-3">
      <Icon className={`w-6 h-6 ${color}`} />
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    </div>
    <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    communities: 0,
    residents: 0,
    hoaAdmins: 0,
    complaints: 0,
    announcements: 0,
    amenities: 0,
    totalPayments: 0,
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    // Replace these API URLs with your actual ones
    const config = { headers: { Authorization: `Bearer ${token}` } };
    Promise.all([
      axios.get("http://localhost:5000/communities/getCommunity", config),
      axios.get("http://localhost:5000/residents", config),
      axios.get("http://localhost:5000/auth/register", config),
      axios.get("http://localhost:5000/complaints", config),
      axios.get("http://localhost:5000/announcements", config),
      axios.get("http://localhost:5000/amenities", config),
      axios.get("http://localhost:5000/dashboard/total-payments", config),
    ])
      .then(([comm, resi, users, comp, ann, ame, pay]) => {
        const hoaAdmins = users.data.filter((u) => u.role === "admin").length;
        setData({
          communities: comm.data.length,
          residents: resi.data.length,
          hoaAdmins,
          complaints: comp.data.length,
          announcements: ann.data.length,
          amenities: ame.data.length,
          totalPayments: pay.data.total || 0,
        });
      })
      .catch(() => console.log("Error fetching dashboard data"));
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-blue-700 to-blue-500 text-white flex flex-col">
        <div className="flex items-center gap-2 p-6 border-b border-blue-400">
          <img
            src="https://cdn-icons-png.flaticon.com/512/679/679922.png"
            alt="HOA Logo"
            className="w-10 h-10"
          />
          <h1 className="text-xl font-bold">HOA Admin Panel</h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-blue-400 transition-all"
          >
            <HomeIcon className="w-5 h-5" /> Dashboard
          </button>
          <button
            onClick={() => navigate("/residents")}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-blue-400 transition-all"
          >
            <UsersIcon className="w-5 h-5" /> Residents
          </button>
          <button
            onClick={() => navigate("/announcements")}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-blue-400 transition-all"
          >
            <MegaphoneIcon className="w-5 h-5" /> Announcements
          </button>
          <button
            onClick={() => navigate("/complaints")}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-blue-400 transition-all"
          >
            <ClipboardDocumentListIcon className="w-5 h-5" /> Complaints
          </button>
          <button
            onClick={() => navigate("/amenities")}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-blue-400 transition-all"
          >
            <BuildingOffice2Icon className="w-5 h-5" /> Amenities
          </button>
          <button
            onClick={() => navigate("/documents")}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-blue-400 transition-all"
          >
            <FolderIcon className="w-5 h-5" /> Documents
          </button>
          <button
            onClick={() => navigate("/meetings")}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-blue-400 transition-all"
          >
            <ChatBubbleBottomCenterTextIcon className="w-5 h-5" /> Meetings
          </button>
          <button
            onClick={() => navigate("/track-payments")}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-blue-400 transition-all"
          >
            <CurrencyDollarIcon className="w-5 h-5" /> Payments
          </button>
          <button
            onClick={() => navigate("/resident-notification")}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-blue-400 transition-all"
          >
            <BellIcon className="w-5 h-5" /> Notifications
          </button>
        </nav>

        <div className="p-4 border-t border-blue-400">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            LOG OUT
          </button>
        </div>
      </aside>

      {/* Main Section */}
      <main className="flex-1 flex flex-col overflow-y-auto relative">
        {/* Header Banner */}
        <div
          className="relative h-56 bg-cover bg-center flex items-center justify-center text-white"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=100')",
          }}
        >
          <div className="absolute inset-0 bg-blue-900/60" />
          <h1 className="relative text-4xl font-extrabold z-10">
            HOA Admin Dashboard 
          </h1>
        </div>

        {/* Stats Section */}
        <section className="p-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 -mt-10 z-20 relative">
          <StatCard
            title="Total Communities"
            value={data.communities}
            color="text-blue-600"
            icon={BuildingOffice2Icon}
          />
          <StatCard
            title="Total Residents"
            value={data.residents}
            color="text-green-600"
            icon={UsersIcon}
          />
          <StatCard
            title="Total HOA Admins"
            value={data.hoaAdmins}
            color="text-purple-600"
            icon={HomeIcon}
          />
          <StatCard
            title="Complaints"
            value={data.complaints}
            color="text-red-600"
            icon={ClipboardDocumentListIcon}
          />
          <StatCard
            title="Announcements"
            value={data.announcements}
            color="text-orange-500"
            icon={MegaphoneIcon}
          />
          <StatCard
            title="Amenities"
            value={data.amenities}
            color="text-teal-600"
            icon={CalendarDaysIcon}
          />
          <StatCard
            title="Total Payments"
            value={`₹${data.totalPayments.toLocaleString()}`}
            color="text-emerald-600"
            icon={CurrencyDollarIcon}
          />
        </section>

        {/* Analytics Placeholder */}
        <section className="px-8 pb-12">
          <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4">
              Global Analytics Overview
            </h2>
            <div className="h-64 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 italic">
              [Chart.js / Recharts Placeholder]
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
