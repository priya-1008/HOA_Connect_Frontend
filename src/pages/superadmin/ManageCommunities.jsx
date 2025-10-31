import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeaderNavbar from "./HeaderNavbar";

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
    <main className="flex-1 overflow-y-auto p-8">
      <section
        className={`rounded-xl shadow-lg px-6 py-9 transition-colors duration-300
          ${darkMode
            ? "bg-gradient-to-br from-teal-900 via-blue-100 to-teal-900 border border-teal-600"
            : "bg-gradient-to-br from-teal-900 via-blue-100 to-teal-900 border border-teal-600"
          }`}
      >
        <h2 className={`text-4xl font-bold mb-6 text-center ${darkMode ? "text-teal-900" : "text-gray-900"}`}>
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
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-teal-400
              ${darkMode
                ? "bg-slate-900 text-teal-100 border-teal-700 placeholder-teal-500"
                : "bg-white text-gray-900 placeholder-gray-500 border-teal-200"
              }`}
            required
          />
          <textarea
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-teal-400
              ${darkMode
                ? "bg-slate-900 text-teal-100 border-teal-700 placeholder-teal-500"
                : "bg-white text-gray-900 placeholder-gray-500 border-teal-200"
              }`}
            required
          />

          <div className="col-span-2 flex gap-3 mt-4 justify-center">
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow font-semibold"
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
                className="px-6 py-2 bg-teal-300 text-teal-900 rounded-lg hover:bg-teal-400 font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full rounded-lg overflow-hidden">
            <thead
              className={`${darkMode ? "bg-teal-800 text-teal-100" : "bg-teal-100 text-teal-900"}`}
            >
              <tr>
                <th className="px-4 py-2 border-b-2">Name</th>
                <th className="px-4 py-2 border-b-2">Location</th>
                <th className="px-4 py-2 border-b-2">Actions</th>
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
                  <tr
                    key={comm._id}
                    className={`${darkMode ? "hover:bg-slate-800" : "hover:bg-teal-50"} transition`}
                  >
                    <td className="px-4 py-2 border-b">{comm.name}</td>
                    <td className="px-4 py-2 border-b">{comm.location}</td>
                    <td className="px-4 py-2 border-b flex justify-center gap-3">
                      <button
                        onClick={() => startEdit(comm)}
                        className="p-2 bg-teal-500 text-white rounded hover:bg-teal-600 flex items-center gap-1"
                        title="Edit Community"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(comm._id)}
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                        title="Delete Community"
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
      </section>
    </main>
  );
};

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <HeaderNavbar darkMode={darkMode} setDarkMode={setDarkMode}>
      {/* Main content area rendered via children */}
      <ManageCommunities darkMode={darkMode} />
    </HeaderNavbar>
  );
};

export default Dashboard;
  