import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import useFetch from "../../hooks/useFetch";
import api from "../../api/axios";
import  ENDPOINTS  from "../../api/endpoints";
import { useState } from "react";
import CommunityTable from "../../components/CommunityTable";

const ManageCommunities = () => {
  const { data: communities, loading } = useFetch(ENDPOINTS.SUPERADMIN.COMMUNITIES);
  const [form, setForm] = useState({ name: "", location: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post(ENDPOINTS.SUPERADMIN.COMMUNITIES, form);
    window.location.reload();
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Manage Communities" />
        <main className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Community Name"
              className="border p-2 rounded w-1/3"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Location"
              className="border p-2 rounded w-1/3"
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Add
            </button>
          </form>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <CommunityTable communities={communities || []} />
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageCommunities;