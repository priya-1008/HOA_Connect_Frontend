import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Meetings = () => {
  const navigate = useNavigate();

  // STATE
  const [meetings, setMeetings] = useState([]);
  const [form, setForm] = useState({
    title: "",
    agenda: "",
    location: "",
    meetingDate: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // FETCH MEETINGS (unchanged logic)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    setLoading(true);
    axios
      .get("http://localhost:5000/hoaadmin/getmeetings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMeetings(res.data || []))
      .catch(() => setError("Could not load meetings."))
      .finally(() => setLoading(false));
  }, [navigate, success]);

  // FORM HANDLERS
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/hoaadmin/addmeeting", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Meeting created.");
      setForm({ title: "", agenda: "", location: "", meetingDate: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create meeting.");
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
          <section className="w-full mx-auto bg-emerald-100/50 dark:bg-emerald-900/70 dark:border-emerald-800 backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8">
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Meetings
            </h2>

            {/* INSERT FORM */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col mb-8 w-full gap-4"
            >
              {/* Title + Agenda */}
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <input
                  type="text"
                  name="title"
                  maxLength={80}
                  required
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg font-semibold bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                  style={{ color: "#000000" }}
                  placeholder="Meeting Title"
                  onChange={handleChange}
                  value={form.title}
                />
                <input
                  type="text"
                  name="agenda"
                  maxLength={300}
                  required
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                  style={{ color: "#000000" }}
                  placeholder="Agenda"
                  onChange={handleChange}
                  value={form.agenda}
                />
              </div>

              {/* Location + Date */}
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <input
                  type="text"
                  name="location" // key fix: matches state
                  maxLength={300}
                  required
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                  style={{ color: "#000000" }}
                  placeholder="Meeting Place"
                  onChange={handleChange}
                  value={form.location}
                />
                <input
                  type="datetime-local"
                  name="meetingDate"
                  required
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                  value={form.meetingDate}
                  onChange={handleChange}
                  style={{ color: "#000000" }}
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="text-xl py-3 px-4 bg-teal-700 dark:bg-teal-700 hover:bg-teal-800 dark:hover:bg-emerald-900 text-white rounded-lg font-bold text-lg transition w-auto"
                >
                  {loading ? "Saving..." : "SUBMIT"}
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

            {/* DISPLAY MEETINGS (same as before) */}
            {/* DISPLAY MEETINGS */}
            <div className="w-full overflow-x-auto mt-4">
              <table className="w-full table-auto border-collapse rounded-xl shadow-md overflow-hidden bg-white/80 dark:bg-emerald-950/40">
                <thead>
                  <tr className="bg-gray-800/90 dark:bg-gray-900 text-white text-base">
                    <th className="px-6 py-4 font-semibold text-left border-b border-gray-300">
                      Title
                    </th>
                    <th className="px-6 py-4 font-semibold text-left border-b border-gray-300">
                      Agenda
                    </th>
                    <th className="px-6 py-4 font-semibold text-left border-b border-gray-300">
                      Location
                    </th>
                    <th className="px-6 py-4 font-semibold text-left border-b border-gray-300">
                      Date &amp; Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {meetings.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-6 text-center font-bold text-emerald-900/80 dark:text-emerald-100/80 italic text-lg"
                      >
                        No meetings found.
                      </td>
                    </tr>
                  )}

                  {meetings.map((meeting, index) => (
                    <tr
                      key={meeting._id || index}
                      className="odd:bg-emerald-50/80 even:bg-white/80 dark:odd:bg-emerald-900/40 dark:even:bg-emerald-900/60 hover:bg-emerald-200/50 dark:hover:bg-emerald-800/60 transition-colors"
                    >
                      <td className="px-6 py-4 align-middle text-sm md:text-base font-medium text-emerald-900 dark:text-emerald-100">
                        {meeting.title}
                      </td>
                      <td className="px-6 py-4 align-middle text-sm md:text-base text-emerald-800 dark:text-emerald-200">
                        {meeting.description || meeting.agenda}
                      </td>
                      <td className="px-6 py-4 align-middle text-sm md:text-base text-emerald-800 dark:text-emerald-200">
                        {meeting.location}
                      </td>
                      <td className="px-6 py-4 align-middle text-sm md:text-base text-emerald-800 dark:text-emerald-200 whitespace-nowrap">
                        {meeting.meetingDate
                          ? new Date(meeting.meetingDate).toLocaleString()
                          : ""}
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

export default Meetings;
