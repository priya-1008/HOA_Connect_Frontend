import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeaderNavbar from "./HeaderNavbar";

import {
  H1Icon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

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
      const res = await axios.get(
        "http://localhost:5000/auth/getadmins",
        config
      );
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
    <main className={`flex-1 overflow-y-auto`}>
      <section
        className={`rounded-xl shadow-lg px-6 py-9 transition-colors duration-300
    ${
      darkMode
        ? "bg-gradient-to-br from-teal-900 via-blue-100 to-teal-900 border border-teal-600"
        : "bg-gradient-to-br from-teal-900 via-blue-100 to-teal-900 border border-teal-600"
    }`}
      >
        <h1
          className={`text-4xl font-bold mb-6 text-center
          ${darkMode ? "text-teal-900" : "text-gray-900"}`}
        >
          Manage HOA Admins
        </h1>

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
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-teal-400
              ${
                darkMode
                  ? "bg-slate-900 text-teal-100 border-teal-700 placeholder-teal-750"
                  : "bg-white text-gray-900  placeholder-gray-750"
              }`}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-teal-400
              ${
                darkMode
                  ? "bg-slate-900 text-teal-100 border-teal-700 placeholder-teal-750"
                  : "bg-white text-gray-900  placeholder-gray-750"
              }`}
          />
          {!isEditing && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`p-3 border rounded-lg focus:ring-2 focus:ring-teal-400
                ${
                  darkMode
                    ? "bg-slate-900 text-teal-100 border-teal-700 placeholder-teal-750"
                    : "bg-white text-gray-900  placeholder-gray-750"
                }`}
            />
          )}
          <input
            type="text"
            name="phoneNo"
            placeholder="Phone Number"
            maxLength="10"
            value={formData.phoneNo}
            onChange={handleChange}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-teal-400
              ${
                darkMode
                  ? "bg-slate-900 text-teal-100 border-teal-700 placeholder-teal-750"
                  : "bg-white text-gray-900  placeholder-gray-750"
              }`}
          />
          <input
            type="text"
            name="houseNumber"
            placeholder="House Number"
            value={formData.houseNumber}
            onChange={handleChange}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-teal-400
              ${
                darkMode
                  ? "bg-slate-900 text-teal-100 border-teal-700 placeholder-teal-750"
                  : "bg-white text-gray-900  placeholder-gray-750"
              }`}
          />
          <select
            name="communityId"
            value={formData.communityId}
            onChange={handleChange}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-teal-400
              ${
                darkMode
                  ? "bg-slate-900 text-teal-100 border-teal-700 placeholder-teal-750"
                  : "bg-white text-gray-900  placeholder-gray-750"
              }`}
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
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow font-semibold"
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
                className="px-6 py-2 bg-teal-300 text-teal-900 rounded-lg hover:bg-teal-400 font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* 📋 Admins Table */}
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full rounded-lg overflow-hidden">
            <thead
              className={`${
                darkMode
                  ? "bg-teal-800 text-teal-100"
                  : "bg-teal-100 text-teal-900"
              }`}
            >
              <tr>
                <th className="px-4 py-2 border-b-2">Name</th>
                <th className="px-4 py-2 border-b-2">Email</th>
                <th className="px-4 py-2 border-b-2">Phone</th>
                <th className="px-4 py-2 border-b-2">House</th>
                <th className="px-4 py-2 border-b-2">Community</th>
                <th className="px-4 py-2 border-b-2">Actions</th>
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
                  <tr
                    key={admin._id}
                    className={`${
                      darkMode ? "hover:bg-slate-800" : "hover:bg-teal-50"
                    } transition`}
                  >
                    <td className="px-4 py-2 border-b">{admin.name}</td>
                    <td className="px-4 py-2 border-b">{admin.email}</td>
                    <td className="px-4 py-2 border-b">{admin.phoneNo}</td>
                    <td className="px-4 py-2 border-b">{admin.houseNumber}</td>
                    <td className="px-4 py-2 border-b">
                      {admin.communityId?.name || "—"}
                    </td>
                    <td className="px-4 py-2 border-b flex justify-center gap-3">
                      <button
                        onClick={() => startEdit(admin)}
                        className="p-2 bg-teal-500 text-white rounded hover:bg-teal-600 flex items-center gap-1"
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
      </section>
    </main>
  );
};

// 🌐 Dashboard Layout Page
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
      <ManageAdmins darkMode={darkMode} />
    </HeaderNavbar>
  );
};

export default Dashboard;
