import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Residents = () => {
  const navigate = useNavigate();

  const [residents, setResidents] = useState([]);
  const [selectedResidents, setSelectedResidents] = useState([]);
  const [form, setForm] = useState({ title: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= FETCH RESIDENTS ================= */
  const fetchResidents = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/hoaadmin/getresidents", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setResidents(res.data))
      .catch(() => setError("Could not load residents."));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    fetchResidents();
  }, [navigate]);

  /* ================= CHECKBOX LOGIC ================= */
  const handleCheckboxChange = (id) => {
    setSelectedResidents((prev) =>
      prev.includes(id)
        ? prev.filter((rid) => rid !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedResidents(residents.map((r) => r._id));
    } else {
      setSelectedResidents([]);
    }
  };

  /* ================= FORM ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedResidents.length === 0) {
      return setError("Please select at least one resident.");
    }

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/hoaadmin/createnotification",
        {
          title: form.title,
          message: form.message,
          recipients: selectedResidents,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Notification sent successfully!");
      setForm({ title: "", message: "" });
      setSelectedResidents([]);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not send notification.");
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
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />

        <main className="relative z-10 p-4 min-h-screen w-full flex flex-col items-center">
          <section className="w-full mx-auto bg-emerald-100/50 backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8">

            {/* ================= NOTIFICATION ================= */}
            <h2 className="text-4xl font-extrabold mb-8 text-center">
              Notification Details
            </h2>

            <form onSubmit={handleSubmit} className="mb-10 w-full">
              <div className="flex flex-col md:flex-row gap-5 w-full">
                <input
                  type="text"
                  name="title"
                  required
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Notification Title"
                  className="flex-1 rounded-lg border py-3 px-4 text-lg"
                />
                <input
                  type="text"
                  name="message"
                  required
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Notification Message"
                  className="flex-1 rounded-lg border py-3 px-4 text-lg"
                />
              </div>

              <div className="flex justify-center mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="text-xl py-3 px-8 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold transition"
                >
                  {loading ? "Sending..." : "SEND NOTIFICATION"}
                </button>
              </div>
            </form>

            {error && <div className="text-center text-red-600 text-lg">{error}</div>}
            {success && (
              <div className="text-center text-green-700 text-lg">{success}</div>
            )}

            {/* ================= RESIDENT TABLE ================= */}
            <h2 className="text-4xl font-extrabold my-8 text-center">
              Resident Details
            </h2>

            <div className="w-full overflow-x-auto rounded-xl shadow-md">
              <table className="min-w-full table-auto bg-white/80">
                <thead>
                  <tr className="bg-gray-800 text-white text-lg">
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Phone</th>
                    <th className="p-4 text-left">House Number</th>
                    <th className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={
                            residents.length > 0 &&
                            selectedResidents.length === residents.length
                          }
                          className="w-5 h-5 scale-125 cursor-pointer"
                        />
                        <span className="font-semibold">Select All</span>
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {residents.map((r, idx) => (
                    <tr
                      key={r._id}
                      className={`transition ${
                        idx % 2 === 0 ? "bg-white" : "bg-emerald-50"
                      } hover:bg-emerald-200/60`}
                    >
                      <td className="px-4 py-3 text-lg">{r.name}</td>
                      <td className="px-4 py-3 text-lg">{r.email}</td>
                      <td className="px-4 py-3 text-lg">{r.phoneNo}</td>
                      <td className="px-4 py-3 text-lg">{r.houseNumber}</td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedResidents.includes(r._id)}
                          onChange={() => handleCheckboxChange(r._id)}
                          className="w-5 h-5 scale-125 cursor-pointer"
                        />
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

export default Residents;
