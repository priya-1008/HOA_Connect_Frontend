import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Heroicons
import {
  HomeIcon,
  BuildingOffice2Icon,
  UsersIcon,
  CurrencyDollarIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  PencilSquareIcon,
  MoonIcon,
  TrashIcon
} from "@heroicons/react/24/outline";

// 🧩 NavLink component
const NavLink = ({ icon: Icon, children, isActive, onClick }) => {
  const baseClasses =
    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium";
  const activeClasses = "bg-blue-600 text-white shadow-md hover:bg-blue-700";
  const inactiveClasses =
    "text-gray-700 hover:bg-blue-200 dark:text-gray-200 dark:hover:bg-gray-700";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <Icon className="w-5 h-5" />
      {children}
    </button>
  );
};

// 🏙️ ManageCommunities
const ManageCommunities = ({ darkMode }) => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: "", location: "" });

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/communities/getCommunity",
        getAuthConfig()
      );
      setCommunities(res.data || []);
    } catch {
      setError("Failed to load communities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/communities/addCommunity",
        formData,
        getAuthConfig()
      );
      fetchCommunities();
      setFormData({ name: "", location: "" });
      setError("");
    } catch {
      setError("Failed to create community");
    }
  };

  const startEdit = (comm) => {
    setIsEditing(true);
    setEditId(comm._id);
    setFormData({ name: comm.name, location: comm.location });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/communities/updateCommunity/${editId}`,
        formData,
        getAuthConfig()
      );
      fetchCommunities();
      setIsEditing(false);
      setEditId(null);
      setFormData({ name: "", location: "" });
      setError("");
    } catch {
      setError("Failed to update community");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this community?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/communities/deleteCommunity/${id}`,
        getAuthConfig()
      );
      fetchCommunities();
      setError("");
    } catch {
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
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-300">
          Manage Communities
        </h2>

        {error && (
          <div className="mb-4 text-red-500 font-medium text-center">{error}</div>
        )}

        {/* Form Section */}
        <form
          onSubmit={isEditing ? handleUpdate : handleCreate}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <input
            type="text"
            name="name"
            placeholder="Community Name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
            required
          />
          <textarea
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
            required
          />

          <div className="col-span-2 flex gap-3 mt-4 justify-center">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
            >
              {isEditing ? "Update Community" : "Add Community"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditId(null);
                  setFormData({ name: "", location: "" });
                }}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Table Section */}
        {loading ? (
          <p className="text-center">Loading communities...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead
                className={`${
                  darkMode ? "bg-gray-700 text-white" : "bg-blue-100 text-black"
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
                      <td className="px-4 py-2 border flex justify-center gap-3">
                        <button
                          onClick={() => startEdit(comm)}
                          className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-1" title="Edit Communities"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(comm._id)}
                          className="p-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                          title="Delete Communities"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
        <h1 className="text-4xl font-extrabold text-white">
          🏘️ HOA Connect System
        </h1>

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
        <aside
          className={`w-72 flex-shrink-0 flex flex-col shadow-2xl transition-colors duration-300 ${
            darkMode ? "bg-gray-800 text-white" : "bg-gray-300 border-gray-300"
          }`}
        >
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <NavLink icon={HomeIcon} onClick={() => navigate("/dashboard")}>
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

        <ManageCommunities darkMode={darkMode} />
      </div>
    </div>
  );
};

export default Dashboard;
