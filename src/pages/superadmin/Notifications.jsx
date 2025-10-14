import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import useFetch from "../../hooks/useFetch";
import api from "../../api/axios";
import  ENDPOINTS  from "../../api/endpoints";
import { useState } from "react";

const Notifications = () => {
  const { data: announcements } = useFetch(ENDPOINTS.SUPERADMIN.NOTIFICATIONS);
  const [message, setMessage] = useState("");

  const sendNotification = async (e) => {
    e.preventDefault();
    await api.post(ENDPOINTS.SUPERADMIN.NOTIFICATIONS, { title: message });
    setMessage("");
    window.location.reload();
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="System Notifications" />
        <main className="p-6 space-y-6">
          <form onSubmit={sendNotification} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter notification message"
              className="border p-2 rounded w-full"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Send
            </button>
          </form>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">All Notifications</h3>
            <ul className="space-y-2">
              {announcements?.map((n) => (
                <li key={n._id} className="text-gray-700">
                  📢 {n.title}
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;