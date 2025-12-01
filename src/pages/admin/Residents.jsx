import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Residents = () => {
  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this resident?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/hoaadmin/deleteresident/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Resident deleted successfully!");
      setError("");
      fetchResidents(); // reload list
    } catch {
      setError("Failed to delete resident.");
      setSuccess("");
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
              Residents Details
            </h2>

            {error && (
              <div className="text-center py-2 text-red-600 font-semibold text-xl">
                {error}
              </div>
            )}
            {success && (
              <div className="text-center py-2 text-green-700 font-semibold text-xl">
                {success}
              </div>
            )}

            <div className="w-full overflow-x-auto">
              <div className="rounded-xl shadow-md border border-gray-300/60 dark:border-gray-700/70 overflow-hidden">
              <table className="min-w-full table-auto bg-white/70 dark:bg-emerald-950/40">
                <thead>
                  <tr className="bg-gray-800 text-white text-lg">
                    <th className="p-4 font-semibold text-left">Name</th>
                    <th className="p-4 font-semibold text-left">Email</th>
                    <th className="p-4 font-semibold text-left">Phone</th>
                    <th className="p-4 font-semibold text-left">House Number</th>
                    <th className="p-4 font-semibold text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {residents.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-lg"
                      >
                        No residents found.
                      </td>
                    </tr>
                  )}

                  {residents.map((r, idx) => (
                    <tr
                      key={r._id}
                      className={`text-sm md:text-base transition-colors ${
                        idx % 2 === 0
                          ? "bg-white/70 dark:bg-emerald-900/40"
                          : "bg-emerald-100/60 dark:bg-emerald-900/60"
                      } hover:bg-emerald-200/60 dark:hover:bg-emerald-800/70`}
                    >
                      <td className="px-4 py-3 font-medium">
                        {r.name}
                      </td>
                      <td className="px-4 py-3 font-medium">{r.email}</td>
                      <td className="px-4 py-3 font-medium">{r.phoneNo}</td>
                      <td className="px-4 py-3 font-medium">{r.houseNumber}</td>
                      <td className="px-4 py-3 font-medium">
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="bg-green-800 hover:bg-green-900 text-white py-2 px-4 rounded-lg font-semibold shadow-md transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </HOAHeaderNavbar>
  );
};

export default Residents;