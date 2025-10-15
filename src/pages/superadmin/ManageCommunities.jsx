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

// 🧩 NavLink component
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

// 🏙️ ManageCommunities inside the main dashboard layout
const ManageCommunities = ({ darkMode }) => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: "", location: "" });

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const config = getAuthConfig();
      const res = await axios.get(
        "http://localhost:5000/communities/getCommunity",
        config
      );
      setCommunities(res.data || []);
    } catch (err) {
      setError("Failed to load communities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const config = getAuthConfig();
      await axios.post(
        "http://localhost:5000/communities/addCommunity",
        formData,
        config
      );
      fetchCommunities();
      setFormData({ name: "", location: "" });
    } catch (err) {
      setError("Failed to create community");
    }
  };

  const startEdit = (community) => {
    setIsEditing(true);
    setEditId(community._id);
    setFormData({
      name: community.name,
      location: community.location,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const config = getAuthConfig();
      await axios.put(
        `http://localhost:5000/communities/updateCommunity/${editId}`,
        formData,
        config
      );
      fetchCommunities();
      setIsEditing(false);
      setEditId(null);
      setFormData({ name: "", location: "" });
    } catch (err) {
      setError("Failed to update community");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this community?"))
      return;
    try {
      const config = getAuthConfig();
      await axios.delete(
        `http://localhost:5000/communities/deleteCommunity/${id}`,
        config
      );
      fetchCommunities();
    } catch (err) {
      setError("Failed to delete community");
    }
  };

  return (
    <div
      className={`flex-1 overflow-y-auto p-8 transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div
        className={`max-w-5xl mx-auto rounded-xl shadow-lg p-8 transition-colors duration-300 ${
          darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
        }`}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          Manage Communities
        </h2>

        {error && (
          <div className="mb-4 text-red-500 font-medium text-center">{error}</div>
        )}

        {/* 📝 Form Section */}
        <form
          onSubmit={isEditing ? handleUpdate : handleCreate}
          className="space-y-4 mb-8"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <textarea
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-400"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isEditing ? "Update" : "Create"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditId(null);
                  setFormData({ name: "", location: "" });
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* 📋 Table Section */}
        {loading ? (
          <p>Loading communities...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead
              className={`${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"
              }`}
            >
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {communities.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    No communities found.
                  </td>
                </tr>
              ) : (
                communities.map((comm) => (
                  <tr key={comm._id}>
                    <td className="px-4 py-2 border">{comm.name}</td>
                    <td className="px-4 py-2 border">{comm.location}</td>
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        onClick={() => startEdit(comm)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(comm._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// 🌐 Main Dashboard Layout
const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <div
      className={`flex flex-col h-screen w-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* 🔷 Header */}
      <header
        className={`flex items-center justify-between px-10 py-4 shadow-md transition-colors duration-300 ${
          darkMode
            ? "bg-gray-900 border-b border-gray-700"
            : "bg-blue-600 border-b border-blue-400"
        }`}
      >
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-extrabold text-white">
           🏘️ HOA Connect System
          </h1>
        </div>

        <button
          onClick={() => setDarkMode((p) => !p)}
          className="flex items-center justify-center p-3 rounded-full transition-all text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md"
        >
          {darkMode ? (
            <SunIcon className="w-6 h-6 text-yellow-400" />
          ) : (
            <MoonIcon className="w-6 h-6 text-indigo-600" />
          )}
        </button>
      </header>

      {/* 🔷 Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <aside
                className={`w-72 flex-shrink-0 flex flex-col shadow-2xl transition-colors duration-300 
                ${darkMode ? "bg-gray-800 text-white" : "bg-gray-300 border-gray-300"}`}
              >
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                  <NavLink icon={HomeIcon} onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    icon={BuildingOffice2Icon}
                    onClick={() => navigate("/manage-communities")}>
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
      
                  <NavLink icon={ChartBarIcon} onClick={() => navigate("/analytics")}>
                    Analytics
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
      
        {/* 🏙️ Communities Content */}
        <ManageCommunities darkMode={darkMode} />
      </div>
    </div>
  );
};

export default Dashboard;
