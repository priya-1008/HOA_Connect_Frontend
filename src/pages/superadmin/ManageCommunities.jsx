import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageCommunities = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // For create / edit form
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    // add other fields your community has
  });

  const navigate = useNavigate();

  // Utility: get token and config
  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Fetch communities
  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const config = getAuthConfig();
      const res = await axios.get("http://localhost:5000/communities/getCommunity", config);
      setCommunities(res.data || []);
    } catch (err) {
      console.error("Error fetching communities:", err);
      setError("Failed to load communities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle create new
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const config = getAuthConfig();
      await axios.post("http://localhost:5000/communities/addCommunity", formData, config);
      // refresh list
      fetchCommunities();
      // reset form
      setFormData({ name: "", location: "" });
    } catch (err) {
      console.error("Error creating community:", err);
      setError("Failed to create community");
    }
  };

  // Start editing
  const startEdit = (community) => {
    setIsEditing(true);
    setEditId(community._id);  // or community.id, depending on schema
    setFormData({
      name: community.name,
      location: community.location,
      // map other fields
    });
  };

  // Handle update
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
      console.error("Error updating community:", err);
      setError("Failed to update community");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this community?")) return;
    try {
      const config = getAuthConfig();
      await axios.delete(`http://localhost:5000/communities/deleteCommunity/${id}`, config);
      fetchCommunities();
    } catch (err) {
      console.error("Error deleting community:", err);
      setError("Failed to delete community");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Manage Communities</h2>

        {/* Error */}
        {error && (
          <div className="mb-4 text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={isEditing ? handleUpdate : handleCreate}
          className="mb-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <textarea
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-2">
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
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Communities List */}
        {loading ? (
          <p>Loading communities...</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {communities.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-4 py-2 text-center">
                    No communities found.
                  </td>
                </tr>
              )}
              {communities.map((comm) => (
                <tr key={comm._id || comm.id}>
                  <td className="px-4 py-2 border">{comm.name}</td>
                  <td className="px-4 py-2 border">{comm.location}</td>
                  <td className="px-4 py-2 border space-x-2">
                    <button
                      onClick={() => startEdit(comm)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comm._id || comm.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageCommunities;
