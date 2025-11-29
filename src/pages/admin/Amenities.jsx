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
