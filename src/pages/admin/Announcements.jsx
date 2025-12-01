import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Announcement = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchAnnouncements = useCallback(async () => {
    if (!token) return;
    setInitialLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/hoaadmin/getannouncements",
        authConfig
      );
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.announcements || [];
      setAnnouncements(list);
      setError("");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Could not load announcements."
      );
      setAnnouncements([]);
    } finally {
      setInitialLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAnnouncements();
  }, [token, navigate, fetchAnnouncements]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/hoaadmin/postannounce",
        form,
        authConfig
      );
      setSuccess(res.data.message || "Announcement created");
      setForm({ title: "", description: "" });
      await fetchAnnouncements();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Failed to create announcement."
      );
    } finally {
      setLoading(false);
    }
  };

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
       <div className="absolute inset-0 bg-black/40 dark:bg-black/70 pointer-events-none transition-all duration-300" />
        <main className="relative z-10 p-4 min-h-screen w-full flex flex-col items-center">
          <section className="w-full mx-auto bg-emerald-100/50 dark:bg-emerald-900/70 dark:border-emerald-800 backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8">
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Announcements
            </h2>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col mb-8 w-full gap-4"
            >
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <input
                  type="text"
                  name="title"
                  maxLength={50}
                  required
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg font-semibold bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                  style={{ color: "#000000" }}
                  placeholder="Title"
                  onChange={handleChange}
                  value={form.title}
                />
                <textarea
                  name="description"
                  maxLength={500}
                  required
                  rows={1}
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                  style={{ color: "#000000", resize: "vertical" }}
                  placeholder="Description"
                  onChange={handleChange}
                  value={form.description}
                />
                <style>{`
                  input::placeholder, textarea::placeholder {
                    color: #094232dc;
                    opacity: 1;
                  }
                  .dark input::placeholder, .dark textarea::placeholder {
                    color: #094232dc;
                    opacity: 1;
                  }
                `}</style>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="text-xl py-3 px-4 bg-teal-700 dark:bg-teal-700 hover:bg-teal-800 dark:hover:bg-emerald-900 text-white rounded-lg font-bold transition w-auto"
                >
                  {loading ? "Posting..." : "POST"}
                </button>
              </div>
            </form>

            {(error || success) && (
              <div
                className={`text-center pb-3 font-semibold text-lg ${
                  error
                    ? "text-red-600"
                    : "text-emerald-700 dark:text-emerald-200"
                }`}
              >
                {error || success}
              </div>
            )}

            {/* ANNOUNCEMENT LIST */}
            <div className="w-full overflow-x-auto rounded-xl shadow-md border border-gray-200/70 dark:border-gray-700/70">
              <table className="min-w-full text-sm md:text-base table-fixed">
                <thead>
                  <tr className="bg-gray-800/90 dark:bg-gray-900 text-white text-base md:text-lg">
                    <th className="p-4 font-semibold text-left w-2/12">
                      Title
                    </th>
                    <th className="p-4 font-semibold text-left w-5/12">
                      Description
                    </th>
                    <th className="p-4 font-semibold text-center w-3/12">
                      Posted By
                    </th>
                    <th className="p-4 font-semibold text-center w-2/12">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  {initialLoading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : announcements.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl"
                      >
                        No announcements found.
                      </td>
                    </tr>
                  ) : (
                    announcements.map((a) => (
                      <tr
                        key={a._id}
                        className="transition hover:bg-emerald-200/50 dark:hover:bg-emerald-900/50 odd:bg-white/70 even:bg-emerald-100/70 dark:odd:bg-emerald-900/40 dark:even:bg-emerald-900/60 border-b border-gray-200/70 dark:border-gray-700/60"
                      >
                        <td className="p-4 font-semibold text-emerald-900 dark:text-emerald-100 break-words">
                          {a.title}
                        </td>
                        <td className="p-4 text-emerald-800 dark:text-emerald-200 break-words whitespace-pre-wrap">
                          {a.description}
                        </td>
                        <td className="p-4 text-emerald-800 dark:text-emerald-200 text-center break-words">
                          {a.createdBy
                            ? `${a.createdBy.name} (${a.createdBy.email})`
                            : "N/A"}
                        </td>
                        <td className="p-4 text-emerald-800 dark:text-emerald-200 text-center whitespace-nowrap">
                          {a.createdAt
                            ? new Date(a.createdAt).toLocaleString()
                            : ""}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </HOAHeaderNavbar>
  );
};

export default Announcement;
