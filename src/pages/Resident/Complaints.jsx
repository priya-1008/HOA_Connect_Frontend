import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Complaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ subject: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch complaints
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    setLoading(true);
    axios
      .get("http://localhost:5000/complaints/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setComplaints(res.data))
      .catch(() => setError("Could not load complaints."))
      .finally(() => setLoading(false));
  }, [navigate, success]);

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // Submit new complaint
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/complaints",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(res.data.message);
      setForm({ subject: "", description: "" });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Failed to submit complaint."
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
        <div className="absolute inset-0 bg-white/10 dark:bg-black/70 pointer-events-none transition-all duration-300" />
        <main className="relative z-10 p-4 min-h-screen w-full flex flex-col items-center">
          <section className="
            w-full
            mx-auto
            bg-emerald-100/50 dark:bg-emerald-900/70
            dark:border-emerald-800
            backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8
          ">
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Complaints
            </h2>
            {/* FORM */}
            <form onSubmit={handleSubmit} className="flex flex-col mb-8 w-full gap-4">
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <input
                  type="text"
                  name="subject"
                  maxLength={80}
                  required
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg font-semibold bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                  style={{
                    color: "#000000",
                  }}
                  placeholder="Subject"
                  onChange={handleChange}
                  value={form.subject}
                />
                <textarea
                  name="description"
                  maxLength={500}
                  required
                  rows={1}
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                  style={{
                    color: "#000000",
                    resize: "vertical"
                  }}
                  placeholder="Description"
                  onChange={handleChange}
                  value={form.description}
                />
                <style>{`
                  input::placeholder, textarea::placeholder {
                    color: #046c4e;
                    opacity: 1;
                  }
                  .dark input::placeholder, .dark textarea::placeholder {
                    color: #38b2ac;
                    opacity: 1;
                  }
                `}</style>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="text-xl py-3 px-4 bg-teal-700 dark:bg-teal-700 hover:bg-teal-800 dark:hover:bg-emerald-900 text-white rounded-lg font-bold text-lg transition w-auto"
                >
                  {loading ? "Submitting..." : "SUBMIT"}
                </button>
              </div>
            </form>
            {(error || success) && (
              <div className={`text-center pb-3 font-semibold text-lg ${error ? "text-red-600" : "text-emerald-700 dark:text-emerald-200"}`}>{error || success}</div>
            )}
            {/* COMPLAINTS LIST */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-full rounded-xl shadow-md overflow-hidden">
                <thead>
                  <tr className="bg-gray-800/80 dark:bg-gray-800/80 text-white text-xl">
                    <th className="p-5 font-semibold">Subject</th>
                    <th className="p-5 font-semibold">Description</th>
                    <th className="p-5 font-semibold">Status</th>
                    <th className="p-5 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl">
                        No complaints found.
                      </td>
                    </tr>
                  )}
                  {complaints.map((c) => (
                    <tr
                      key={c._id}
                      className="transition hover:bg-emerald-200/40 dark:hover:bg-emerald-900/40 odd:bg-white/30 even:bg-emerald-100/60 dark:odd:bg-emerald-900/40 dark:even:bg-emerald-900/60"
                    >
                      <td className="p-4 font-medium text-emerald-900 dark:text-emerald-100">{c.subject}</td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">{c.description}</td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">{c.status || "Pending"}</td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}</td>
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

export default Complaints;
