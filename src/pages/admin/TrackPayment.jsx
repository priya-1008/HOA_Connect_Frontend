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
        <div className="absolute inset-0 bg-white/10 dark:bg-black/70 pointer-events-none" />

        <main className="relative z-10 p-4 min-h-screen w-full flex flex-col items-center">
          <section
            className="
            w-full mx-auto
            bg-emerald-100/50 dark:bg-emerald-900/70
            backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8
          "
          >
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center">
              Payments
            </h2>

            {(error || success) && (
              <div className={`text-center pb-3 font-semibold text-lg ${error ? "text-red-600" : "text-emerald-700 dark:text-emerald-200"}`}>
                {error || success}
              </div>
            )}

            {/* SEARCH FIELD */}
            <div className="w-full mb-6 flex justify-center">
              <select
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
                className="w-60 py-3 px-4 rounded-lg border bg-white shadow text-lg"
              >
                <option value="">Search by Status</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* PAYMENTS TABLE */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-full rounded-xl shadow-md overflow-hidden">
                <thead>
                  <tr className="bg-gray-800 text-white text-xl">
                    <th className="p-5 text-left">Resident</th>
                    <th className="p-5 text-left">Email</th>
                    <th className="p-5 text-left">Amount</th>
                    <th className="p-5 text-left">Status</th>
                    <th className="p-5 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-6 italic text-xl text-emerald-900/80"
                      >
                        No payments found.
                      </td>
                    </tr>
                  )}

                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="odd:bg-white/40 even:bg-emerald-100/60 hover:bg-emerald-200/40"
                    >
                      <td className="p-4 font-medium">{payment.user?.name}</td>
                      <td className="p-4">{payment.user?.email}</td>
                      <td className="p-4">₹{payment.amount}</td>
                      <td className="p-4 font-semibold">{payment.status}</td>

                      <td className="p-4">
                        <select
                          className="mr-2 rounded py-2 px-3 border"
                          value={statusUpdate[payment._id] || ""}
                          onChange={(e) =>
                            handleStatusChange(payment._id, e.target.value)
                          }
                        >
                          <option value="">Update Status</option>
                          <option value="completed">Completed</option>
                          <option value="failed">Failed</option>
                          <option value="pending">Pending</option>
                        </select>

                        <button
                          disabled={loading}
                          onClick={() => handleUpdateStatus(payment._id)}
                          className="py-2 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded"
                        >
                          {loading ? "Updating..." : "Update"}
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

export default Payments;
