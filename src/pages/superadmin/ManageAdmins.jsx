import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  BuildingOffice2Icon,
  UsersIcon,
  CurrencyDollarIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

// 🧩 Reusable NavLink Component
const NavLink = ({ icon: Icon, children, isActive, onClick }) => {
  const base =
    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium";
  const active = "bg-blue-600 text-white shadow-md hover:bg-blue-700";
  const inactive =
    "text-gray-700 hover:bg-blue-200 dark:text-gray-200 dark:hover:bg-gray-700";
  return (
    <button
      onClick={onClick}
      className={`${base} ${isActive ? active : inactive}`}
    >
      <Icon className="w-5 h-5" />
      {children}
    </button>
  );
};

// 👥 Manage Admins Component
const ManageAdmins = ({ darkMode }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [communities, setCommunities] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNo: "",
    houseNumber: "",
    communityId: "",
  });

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // Fetch Admins
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const config = getAuthConfig();
      const res = await axios.get("http://localhost:5000/auth/getadmins", config);
      setAdmins(res.data);
    } catch {
      setError("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Communities
  const fetchCommunities = async () => {
    try {
      const config = getAuthConfig();
      const res = await axios.get(
        "http://localhost:5000/communities/getCommunity",
        config
      );
      setCommunities(res.data);
    } catch {
      setError("Failed to load communities");
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchCommunities();
  }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validateForm = () => {
    const { name, email, password, phoneNo } = formData;
    if (!name || !email || !phoneNo) {
      setError("All required fields must be filled!");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Invalid email format!");
      return false;
    }
    if (!/^\d{10}$/.test(phoneNo)) {
      setError("Phone number must be 10 digits!");
      return false;
    }
    if (!isEditing && password.length < 6) {
      setError("Password must be at least 6 characters!");
      return false;
    }
    setError("");
    return true;
  };

  // Add Admin
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const config = getAuthConfig();
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "admin",
        phoneNo: formData.phoneNo,
        houseNumber: formData.houseNumber,
        communityId: formData.communityId,
      };

      await axios.post("http://localhost:5000/auth/register", payload, config);
      fetchAdmins();
      setFormData({
        name: "",
        email: "",
        password: "",
        phoneNo: "",
        houseNumber: "",
        communityId: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add admin");
    }
  };

  // Start Editing
  const startEdit = (admin) => {
    setIsEditing(true);
    setEditId(admin._id);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "",
      phoneNo: admin.phoneNo || "",
      houseNumber: admin.houseNumber || "",
      communityId: admin.communityId?._id || "",
    });
  };

  // Update Admin
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const config = getAuthConfig();
      await axios.put(
        `http://localhost:5000/auth/update-admin/${editId}`,
        formData,
        config
      );
      fetchAdmins();
      setIsEditing(false);
      setEditId(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        phoneNo: "",
        houseNumber: "",
        communityId: "",
      });
    } catch {
      setError("Failed to update admin");
    }
  };

  // Delete Admin
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this admin?")) return;
    try {
      const config = getAuthConfig();
      await axios.delete(`http://localhost:5000/auth/delete/${id}`, config);
      fetchAdmins();
    } catch {
      setError("Failed to delete admin");
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
          Manage HOA Admins
        </h2>

        {error && (
          <div className="mb-4 text-red-500 font-medium text-center">
            {error}
          </div>
        )}

        {/* 📝 Admin Form */}
        <form
          onSubmit={isEditing ? handleUpdate : handleCreate}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          {!isEditing && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
          )}
          <input
            type="text"
            name="phoneNo"
            placeholder="Phone Number"
            maxLength="10"
            value={formData.phoneNo}
            onChange={handleChange}
            className="p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="houseNumber"
            placeholder="House Number"
            value={formData.houseNumber}
            onChange={handleChange}
            className="p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <select
            name="communityId"
            value={formData.communityId}
            onChange={handleChange}
            className="p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Community</option>
            {communities.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="col-span-2 flex gap-3 mt-4 justify-center">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
            >
              {isEditing ? "Update Admin" : "Add Admin"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditId(null);
                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                    phoneNo: "",
                    houseNumber: "",
                    communityId: "",
                  });
                }}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* 📋 Admins Table */}
        {loading ? (
          <p className="text-center">Loading admins...</p>
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
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Phone</th>
                  <th className="px-4 py-2 border">House</th>
                  <th className="px-4 py-2 border">Community</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No admins found.
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin._id}>
                      <td className="px-4 py-2 border">{admin.name}</td>
                      <td className="px-4 py-2 border">{admin.email}</td>
                      <td className="px-4 py-2 border">{admin.phoneNo}</td>
                      <td className="px-4 py-2 border">{admin.houseNumber}</td>
                      <td className="px-4 py-2 border">
                        {admin.communityId?.name || "—"}
                      </td>
                      <td className="px-4 py-2 border flex justify-center gap-3">
                        <button
                          onClick={() => startEdit(admin)}
                          className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-1"
                          title="Edit Admin"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(admin._id)}
                          className="p-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                          title="Delete Admin"
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

// 🌐 Dashboard Layout
const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div
      className={`flex flex-col h-screen w-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Header */}
      <header
        className={`flex items-center justify-between px-10 py-4 shadow-md transition-colors duration-300 ${
          darkMode ? "bg-gray-900" : "bg-blue-600"
        }`}
      >
        <h1 className="text-3xl font-bold text-white">🏘️ HOA Connect System</h1>
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow hover:scale-110 transition-all"
        >
          {darkMode ? (
            <SunIcon className="w-6 h-6 text-yellow-400" />
          ) : (
            <MoonIcon className="w-6 h-6 text-indigo-600" />
          )}
        </button>
      </header>

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`w-72 flex-shrink-0 flex flex-col shadow-lg ${
            darkMode ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <NavLink icon={HomeIcon} onClick={() => navigate("/dashboard")}>
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
              isActive={true}
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
            <NavLink icon={BellIcon} onClick={() => navigate("/notifications")}>
              Notifications
            </NavLink>
          </nav>
          <div className="p-4 border-t dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <ManageAdmins darkMode={darkMode} />
      </div>
    </div>
  );
};

export default Dashboard;
