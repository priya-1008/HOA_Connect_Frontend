import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Amenities = () => {
  const navigate = useNavigate();
  const [amenities, setAmenities] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch amenities for logged-in HOA admin's community
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAmenities = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          "http://localhost:5000/hoaadmin/getamenities",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Backend: res.status(200).json(amenities);
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.amenities)
          ? res.data.amenities
          : [];

        setAmenities(list);
      } catch (err) {
        console.error("Error fetching amenities:", err.response || err);
        setError(
          err?.response?.data?.message || "Could not load amenities for this community."
        );
        setAmenities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAmenities();
  }, [navigate, token, success]);

  // Delete amenity handler (optional, if you wired /deleteamenity/:id)
  const handleDelete = async (id) => {
    if (!token) {
      navigate("/login");
      return;
    }
    setError("");
    setSuccess("");
    setDeletingId(id);
    try {
      await axios.delete(
        `http://localhost:5000/hoaadmin/deleteamenity/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAmenities((prev) => prev.filter((a) => a._id !== id));
      setSuccess("Amenity deleted successfully.");
    } catch (err) {
      console.error("Error deleting amenity:", err.response || err);
      setError(
        err?.response?.data?.message || "Failed to delete amenity."
      );
    } finally {
      setDeletingId(null);
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
          <section
            className="
              w-full mx-auto
              bg-emerald-100/50 dark:bg-emerald-900/70
              dark:border-emerald-800
              backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8
            "
          >
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Amenities
            </h2>

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

            {/* AMENITIES LIST */}
            <div className="w-full overflow-x-auto rounded-xl shadow-md border border-gray-200/70 dark:border-gray-700/70">
              <table className="min-w-full text-sm md:text-base table-fixed">
                <thead>
                  <tr className="bg-gray-800/90 dark:bg-gray-900 text-white text-base md:text-lg">
                    <th className="p-4 font-semibold text-left w-2/12">
                      Name
                    </th>
                    <th className="p-4 font-semibold text-left w-4/12">
                      Description
                    </th>
                    <th className="p-4 font-semibold text-center w-1/12">
                      Active
                    </th>
                    <th className="p-4 font-semibold text-center w-2/12">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : amenities.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl"
                      >
                        No amenities found.
                      </td>
                    </tr>
                  ) : (
                    amenities.map((a) => (
                      <tr
                        key={a._id}
                        className="transition hover:bg-emerald-200/50 dark:hover:bg-emerald-900/50 odd:bg-white/70 even:bg-emerald-100/70 dark:odd:bg-emerald-900/40 dark:even:bg-emerald-900/60 border-b border-gray-200/70 dark:border-gray-700/60"
                      >
                        <td className="p-4 font-semibold text-emerald-900 dark:text-emerald-100 break-words">
                          {a.name}
                        </td>
                        <td className="p-4 text-emerald-800 dark:text-emerald-200 break-words whitespace-pre-wrap">
                          {a.description}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`font-bold ${
                              a.isActive ? "text-green-700" : "text-red-600"
                            }`}
                          >
                            {a.isActive ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDelete(a._id)}
                            disabled={deletingId === a._id}
                            className="py-1 px-4 bg-red-600 hover:bg-red-800 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded font-bold transition"
                          >
                            {deletingId === a._id ? "Deleting..." : "Delete"}
                          </button>
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

export default Amenities;
