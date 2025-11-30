import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Complaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null); // which row is updating

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Fetch complaints
  const fetchComplaints = useCallback(async () => {
    if (!token) return navigate("/login");
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        "http://localhost:5000/hoaadmin/getcomplaints",
        authConfig
      );
      setComplaints(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError("Could not load complaints.");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, [navigate, token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchComplaints();
  }, [token, navigate, fetchComplaints]);

  // Handle status change
  const handleStatusChange = async (complaintId, newStatus) => {
    if (!token) return navigate("/login");

    setError("");
    setSuccess("");
    setUpdatingId(complaintId);

    try {
      const res = await axios.put(
        `http://localhost:5000/hoaadmin/updatecomplaint/${complaintId}`,
        { status: newStatus },
        authConfig
      );

      // Update state locally without full refetch
      const updated = res.data?.complaint || null;
      setComplaints((prev) =>
        prev.map((c) => (c._id === complaintId ? { ...c, ...updated } : c))
      );
      setSuccess(res.data?.message || "Complaint status updated");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Failed to update complaint status."
      );
    } finally {
      setUpdatingId(null);
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
              Complaints
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

            {/* COMPLAINTS LIST */}
            <div className="w-full overflow-x-auto rounded-xl shadow-md border border-gray-200/70 dark:border-gray-700/70">
              <table className="min-w-full text-sm md:text-base table-fixed">
                <thead>
                  <tr className="bg-gray-800/90 dark:bg-gray-900 text-white text-base md:text-lg">
                    <th className="p-4 font-semibold text-left w-2/12">
                      Subject
                    </th>
                    <th className="p-4 font-semibold text-left w-5/12">
                      Description
                    </th>
                    <th className="p-4 font-semibold text-center w-2/12">
                      Status
                    </th>
                    <th className="p-4 font-semibold text-center w-3/12">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : complaints.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl"
                      >
                        No complaints found.
                      </td>
                    </tr>
                  ) : (
                    complaints.map((c) => (
                      <tr
                        key={c._id}
                        className="transition hover:bg-emerald-200/50 dark:hover:bg-emerald-900/50 odd:bg-white/70 even:bg-emerald-100/70 dark:odd:bg-emerald-900/40 dark:even:bg-emerald-900/60 border-b border-gray-200/70 dark:border-gray-700/60"
                      >
                        <td className="p-4 font-semibold text-emerald-900 dark:text-emerald-100 break-words">
                          {c.subject}
                        </td>
                        <td className="p-4 text-emerald-800 dark:text-emerald-200 break-words whitespace-pre-wrap">
                          {c.description}
                        </td>
                        <td className="p-4 text-center">
                          <select
                            value={c.status || "Pending"}
                            onChange={(e) =>
                              handleStatusChange(c._id, e.target.value)
                            }
                            disabled={updatingId === c._id}
                            className="w-full max-w-xs bg-white dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>
                        <td className="p-4 text-emerald-800 dark:text-emerald-200 text-center whitespace-nowrap">
                          {c.createdAt
                            ? new Date(c.createdAt).toLocaleString()
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

export default Complaints;
