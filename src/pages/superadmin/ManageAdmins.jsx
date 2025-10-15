import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

// 🧩 Reusable NavLink
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
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    phoneNo: "",
    community: "",
  });

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const config = getAuthConfig();
      const res = await axios.get(
        "http://localhost:5000/auth/getadmins",
        config
      );
      const data = Array.isArray(res.data)
        ? res.data.filter((u) => u.role === "admin")
        : [];
      setAdmins(data);
    } catch (err) {
      setError("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validateForm = () => {
    const { name, email, password, role, phoneNo } = formData;
    if (!name || !email || !phoneNo) {
      setError("All fields except community are required!");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!/^\d{10}$/.test(phoneNo)) {
      setError("Phone number must be 10 digits");
      return false;
    }
    if (!isEditing && password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    setError("");
    return true;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const config = getAuthConfig();
      const payload = {
        ...formData,
        role: "admin",
        community: formData.community || null,
      };
      console.log("Payload:", payload);
      if (!payload.community) delete payload.community;
      // convert empty string to null or remove it
      if (!payload.community) payload.community = null;
      
      await axios.post("http://localhost:5000/auth/register", payload, config);
      fetchAdmins();
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        phoneNo: "",
        community: "",
      });
    } catch {
      setError("Failed to add admin");
    }
  };

  const startEdit = (admin) => {
    setIsEditing(true);
    setEditId(admin._id);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "",
      role: admin.role,
      phoneNo: admin.phoneNo || "",
      community: admin.community?.name || "",
    });
  };

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
        role: "",
        phoneNo: "",
        community: "",
      });
    } catch {
      setError("Failed to update admin");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
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
        <h2 className="text-3xl font-bold mb-6 text-center">
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
          <div>
            <label className="block text-sm font-medium mb-1">Name </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-400"
            />
          </div>

          {!isEditing && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Password{" "}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-400"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Role </label>
            <input
              type="text"
              name="role"
              value="admin"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-400"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone No </label>
            <input
              type="text"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              required
              maxLength="10"
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Assigned Community
            </label>
            {/* <input
              type="text"
              name="community"
              value={formData.community}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-400"
            /> */}
            <select
              name="community"
              value={formData.community}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-400"
            >
              <option value="">Select Community</option>
              {communities.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2 flex gap-3 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isEditing ? "Update Admin" : "Add HOA Admin"}
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
                    role: "",
                    phoneNo: "",
                    community: "",
                  });
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* 📋 Admin Table */}
        {loading ? (
          <p>Loading admins...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead
              className={`${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"
              }`}
            >
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">Phone No</th>
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
                    <td className="px-4 py-2 border capitalize">
                      {admin.role}
                    </td>
                    <td className="px-4 py-2 border">{admin.phoneNo || "—"}</td>
                    <td className="px-4 py-2 border">
                      {admin.community?.name || "—"}
                    </td>
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        onClick={() => startEdit(admin)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setSelectedCommunity(admin._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {selectedCommunity && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-lg mb-2">
                  Assign Community to Admin
                </h3>
                <select
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, community: e.target.value }))
                  }
                  value={formData.community}
                  className="p-2 border rounded-md w-64"
                >
                  <option value="">Select Community</option>
                  {communities.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={async () => {
                    try {
                      const config = getAuthConfig();
                      await axios.post(
                        "http://localhost:5000/communities/assign-admin",
                        {
                          adminId: selectedCommunity,
                          communityId: formData.community,
                        },
                        config
                      );
                      setSelectedCommunity("");
                      fetchAdmins();
                    } catch {
                      setError("Failed to assign community");
                    }
                  }}
                  className="ml-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Assign
                </button>
                <button
                  onClick={() => setSelectedCommunity("")}
                  className="ml-3 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            )}
          </table>
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

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`w-72 flex-shrink-0 flex flex-col shadow-2xl transition-colors duration-300 
          ${
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

        {/* 👥 Admin Content */}
        <ManageAdmins darkMode={darkMode} />
      </div>
    </div>
  );
};

export default Dashboard;
