import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Payments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({}); // id: status

  // Fetch payments
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    setLoading(true);
    axios
      .get("http://localhost:5000/payments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPayments(res.data || []))
      .catch(() => setError("Could not load payments."))
      .finally(() => setLoading(false));
  }, [navigate, success]);

  // Handle status input change for a specific payment
  const handleStatusChange = (id, value) => {
    setStatusUpdate((prev) => ({ ...prev, [id]: value }));
    setError("");
    setSuccess("");
  };

  // Handle update status
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
        `http://localhost:5000/payments/${id}`,
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
              Payments
            </h2>

            {(error || success) && (
              <div className={`text-center pb-3 font-semibold text-lg ${error ? "text-red-600" : "text-emerald-700 dark:text-emerald-200"}`}>{error || success}</div>
            )}

            {/* PAYMENTS LIST */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-full rounded-xl shadow-md overflow-hidden">
                <thead>
                  <tr className="bg-gray-800/80 dark:bg-gray-800/80 text-white text-xl">
                    <th className="p-5 font-semibold">Resident</th>
                    <th className="p-5 font-semibold">Email</th>
                    <th className="p-5 font-semibold">Amount</th>
                    <th className="p-5 font-semibold">Due Date</th>
                    <th className="p-5 font-semibold">Status</th>
                    <th className="p-5 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl">
                        No payments found.
                      </td>
                    </tr>
                  )}
                  {payments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="transition hover:bg-emerald-200/40 dark:hover:bg-emerald-900/40 odd:bg-white/30 even:bg-emerald-100/60 dark:odd:bg-emerald-900/40 dark:even:bg-emerald-900/60"
                    >
                      <td className="p-4 font-medium text-emerald-900 dark:text-emerald-100">
                        {payment.user?.name}
                      </td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">
                        {payment.user?.email}
                      </td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">
                        ₹{payment.amount}
                      </td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">
                        {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : "-"}
                      </td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">
                        <span className="font-semibold">{payment.status}</span>
                      </td>
                      <td className="p-4">
                        <select
                          className="mr-2 rounded py-2 px-3 border"
                          value={statusUpdate[payment._id] || ""}
                          onChange={(e) => handleStatusChange(payment._id, e.target.value)}
                        >
                          <option value="">Update Status</option>
                          <option value="Paid">Paid</option>
                          <option value="Unpaid">Unpaid</option>
                          <option value="Overdue">Overdue</option>
                        </select>
                        <button
                          disabled={loading}
                          onClick={() => handleUpdateStatus(payment._id)}
                          className="py-2 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded font-bold transition"
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
