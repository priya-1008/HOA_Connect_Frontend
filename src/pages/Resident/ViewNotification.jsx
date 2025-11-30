import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const channelOptions = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "whatsapp", label: "WhatsApp" },
];

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({
    title: "",
    message: "",
    channels: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch notifications on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    setLoading(true);
    axios
      .get("http://localhost:5000/resident/getnotification", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNotifications(res.data?.notifications || []))
      .catch(() => setError("Could not load notifications."))
      .finally(() => setLoading(false));
  }, [navigate, success]);

  return (
    <HOAHeaderNavbar>
      <div
        className="relative min-h-screen overflow-y-auto"
        style={{
          backgroundImage: "url('/Society.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-white/10 dark:bg-black/70 pointer-events-none transition-all duration-300" />
        <main className="relative z-10 p-4 min-h-screen w-full flex flex-col items-center">
          <section
            className="
            w-full mx-auto
            bg-emerald-100/50 dark:bg-emerald-900/70
            dark:border-emerald-800
            backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8
          "
          >
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Notifications
            </h2>
            {/* {(error || success) && (
              <div
                className={`text-center pb-3 font-semibold text-lg ${
                  error
                    ? "text-red-600"
                    : "text-emerald-700 dark:text-emerald-200"
                }`}
              >
                {error || success}
              </div>
            )} */}
            {/* Notifications List */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-full rounded-xl shadow-md overflow-hidden">
                <thead>
                  <tr className="bg-gray-800/80 dark:bg-gray-800/80 text-white text-xl">
                    <th className="p-5 font-semibold">Title</th>
                    <th className="p-5 font-semibold">Message</th>
                    <th className="p-5 font-semibold">Created By</th>
                    <th className="p-5 font-semibold">Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl"
                      >
                        No notifications found.
                      </td>
                    </tr>
                  )}
                  {notifications.map((n) => (
                    <tr
                      key={n._id}
                      className="transition hover:bg-emerald-200/40 dark:hover:bg-emerald-900/40 odd:bg-white/30 even:bg-emerald-100/60 dark:odd:bg-emerald-900/40 dark:even:bg-emerald-900/60"
                    >
                      <td className="p-4 font-medium text-emerald-900 dark:text-emerald-100">
                        {n.title}
                      </td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">
                        {n.message}
                      </td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">
                        {n.createdBy?.name || n.createdBy?.email || n.createdBy}
                      </td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">
                        {n.createdAt
                          ? new Date(n.createdAt).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </HOAHeaderNavbar>
  );
};

export default Notifications;
