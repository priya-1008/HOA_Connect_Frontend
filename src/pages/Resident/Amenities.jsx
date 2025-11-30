import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Amenities = () => {
  const navigate = useNavigate();
  const [amenities, setAmenities] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", community: "", isActive: true });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch amenities on mount or when a new amenity is created
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    setLoading(true);
    axios
      .get("http://localhost:5000/amenities", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAmenities(res.data.amenities || []))
      .catch(() => setError("Could not load amenities."))
      .finally(() => setLoading(false));
  }, [navigate, success]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setError("");
    setSuccess("");
  };

  // Create amenity
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/amenities",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(res.data.message);
      setForm({ name: "", description: "", community: "", isActive: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Failed to create amenity."
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete amenity (admin action)
  const handleDelete = async (amenityId) => {
    if (!window.confirm("Delete this amenity?")) return;
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/amenities/${amenityId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Amenity deleted.");
    } catch (err) {
      setError("Could not delete amenity.");
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
            w-full mx-auto
            bg-emerald-100/50 dark:bg-emerald-900/70
            dark:border-emerald-800
            backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8
          ">
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Amenities
            </h2>
            {/* FORM
            <form onSubmit={handleSubmit} className="flex flex-col mb-8 w-full gap-4"> */}
              {/* First row: Amenity Name + Amenity Description */}
              {/* <div className="flex flex-col md:flex-row gap-4 w-full">
                <input
                  type="text"
                  name="name"
                  maxLength={80}
                  required
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg font-semibold bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                  style={{ color: "#000000" }}
                  placeholder="Amenity Name"
                  onChange={handleChange}
                  value={form.name}
                />
                <input
                  type="text"
                  name="description"
                  maxLength={200}
                  required
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                  style={{ color: "#000000" }}
                  placeholder="Amenity Description"
                  onChange={handleChange}
                  value={form.description}
                />
                <style>{`
                  input::placeholder {
                    color: #888888 !important; opacity: 1;
                  }
                  .dark input::placeholder {
                    color: #b6b6b6 !important; opacity: 1;
                  }
                `}</style>
              </div> */}
              {/* Second row: Community ID full width */}
              {/* <input
                type="text"
                name="community"
                required
                className="rounded-lg border border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow w-full"
                style={{ color: "#000000" }}
                placeholder="Community ID"
                onChange={handleChange}
                value={form.community}
              />
              <style>{`
                input::placeholder {
                  color: #888888 !important; opacity: 1;
                }
                .dark input::placeholder {
                  color: #b6b6b6 !important; opacity: 1;
                }
              `}</style> */}
              {/* Third row: Active checkbox right-aligned and large */}
              {/* <div className="flex md:justify-end justify-start w-full">
                <label className="flex items-center gap-2 px-2 text-emerald-800 dark:text-emerald-100 text-xl">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="accent-emerald-700 w-6 h-6"
                    style={{
                      minWidth: "1.5rem",
                      minHeight: "1.5rem"
                    }}
                  />
                  Active
                </label>
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
            </form> */}
            {/* {(error || success) && (
              <div className={`text-center pb-3 font-semibold text-lg ${error ? "text-red-600" : "text-emerald-700 dark:text-emerald-200"}`}>{error || success}</div>
            )} */}
            {/* AMENITIES LIST */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-full rounded-xl shadow-md overflow-hidden">
                <thead>
                  <tr className="bg-gray-800/80 dark:bg-gray-800/80 text-white text-xl">
                    <th className="p-5 font-semibold">Name</th>
                    <th className="p-5 font-semibold">Description</th>
                    <th className="p-5 font-semibold">Community</th>
                    <th className="p-5 font-semibold">Active</th>
                    <th className="p-5 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {amenities.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl">
                        No amenities found.
                      </td>
                    </tr>
                  )}
                  {amenities.map((a) => (
                    <tr
                      key={a._id}
                      className="transition hover:bg-emerald-200/40 dark:hover:bg-emerald-900/40 odd:bg-white/30 even:bg-emerald-100/60 dark:odd:bg-emerald-900/40 dark:even:bg-emerald-900/60"
                    >
                      <td className="p-4 font-medium text-emerald-900 dark:text-emerald-100">{a.name}</td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">{a.description}</td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">{a.community?.name || a.community}</td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">
                        <span className={`font-bold ${a.isActive ? "text-green-700" : "text-red-600"}`}>
                          {a.isActive ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDelete(a._id)}
                          className="py-1 px-4 bg-red-600 hover:bg-red-800 text-white rounded font-bold transition"
                        >
                          Delete
                        </button>
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

export default Amenities;
