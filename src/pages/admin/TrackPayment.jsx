import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Payments = () => {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({});
  const [searchStatus, setSearchStatus] = useState("");

  // Fetch payments
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    setLoading(true);
    axios
      .get("http://localhost:5000/hoaadmin/getpayments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPayments(res.data || []);
        setFilteredPayments(res.data || []);
      })
      .catch(() => setError("Could not load payments."))
      .finally(() => setLoading(false));
  }, [navigate, success]);

  // Search Filter
  useEffect(() => {
    if (!searchStatus) {
      setFilteredPayments(payments);
    } else {
      const filtered = payments.filter((p) =>
        p.status.toLowerCase().includes(searchStatus.toLowerCase())
      );
      setFilteredPayments(filtered);
    }
  }, [searchStatus, payments]);

  // Handle status input change
  const handleStatusChange = (id, value) => {
    setStatusUpdate((prev) => ({ ...prev, [id]: value }));
    setError("");
    setSuccess("");
  };

  // Update payment status
  const handleUpdateStatus = async (id) => {
    const token = localStorage.getItem("token");
    const newStatus = statusUpdate[id];
    if (!newStatus) {
      setError("Please select a status.");
      return;
    }
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/hoaadmin/updatepaymentstatus/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Payment status updated.");
      setStatusUpdate((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      setError(
        err?.response?.data?.message || "Could not update payment status."
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
        }}
      >
        <div className="absolute inset-0 bg-black/40 dark:bg-black/70 pointer-events-none" />

        <main className="relative z-10 p-4 min-h-screen w-full flex flex-col items-center">
          <section className="w-full mx-auto bg-emerald-100/50 dark:bg-emerald-900/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8">

            {/* HEADER */}
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Payments
            </h2>

            {/* ERROR / SUCCESS */}
            {(error || success) && (
              <div
                className={`text-center pb-3 font-semibold text-lg ${
                  error ? "text-red-600" : "text-emerald-700 dark:text-emerald-200"
                }`}
              >
                {error || success}
              </div>
            )}

            {/* SEARCH */}
            <div className="w-full mb-6 flex justify-center">
              <select
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
                className="w-72 py-3 px-4 rounded-lg border border-gray-300 shadow bg-white dark:bg-emerald-950/40 dark:text-emerald-100 text-lg font-medium"
              >
                <option value="">Search by Status</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* PAYMENTS TABLE */}
            <div className="w-full overflow-x-auto rounded-xl shadow-md border border-gray-200/70 dark:border-gray-700/70">

              <table className="min-w-full table-fixed text-sm md:text-base">
                <thead>
                  <tr className="bg-gray-800/90 dark:bg-gray-900 text-white text-base md:text-lg">
                    <th className="p-4 text-left font-bold w-3/12">Resident</th>
                    <th className="p-4 text-left font-bold w-3/12">Email</th>
                    <th className="p-4 text-left font-bold w-2/12">Amount</th>
                    <th className="p-4 text-left font-bold w-2/12">Status</th>
                    <th className="p-4 text-left font-bold w-2/12">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl"
                      >
                        No payments found.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment, index) => (
                      <tr
                        key={payment._id}
                        className={`transition-colors ${
                          index % 2 === 0
                            ? "bg-white/100 dark:bg-emerald-900/40"
                            : "bg-emerald-100/50 dark:bg-emerald-900/60"
                        } hover:bg-emerald-200/60 dark:hover:bg-emerald-800/70`}
                      >
                        <td className="px-4 py-3 font-medium">
                          {payment.user?.name}
                        </td>
                        <td className="px-4 py-3">{payment.user?.email}</td>
                        <td className="px-4 py-3 font-semibold">
                          ₹{payment.amount}
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          {payment.status}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex gap-3 items-center">

                            {/* STATUS SELECT */}
                            <select
                              className="rounded-lg py-2 px-3 border border-gray-300 bg-white dark:bg-emerald-950/40 dark:text-emerald-100"
                              value={statusUpdate[payment._id] || ""}
                              onChange={(e) =>
                                handleStatusChange(payment._id, e.target.value)
                              }
                            >
                              <option value="">Update</option>
                              <option value="completed">Completed</option>
                              <option value="failed">Failed</option>
                              <option value="pending">Pending</option>
                            </select>

                            {/* UPDATE BUTTON */}
                            <button
                              disabled={loading}
                              onClick={() => handleUpdateStatus(payment._id)}
                              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold disabled:opacity-70"
                            >
                              {loading ? "..." : "Save"}
                            </button>
                          </div>
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

export default Payments;
