import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const ResidentPayment = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    amount: "",
    billType: "",
    method: "UPI",
  });

  const [showGateway, setShowGateway] = useState(false);
  const [transaction, setTransaction] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (!token) return navigate("/login");

    axios
      .get("http://localhost:5000/resident/getmyprofile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.profile);
        setCommunity(res.data.profile.community);
        fetchPayments();
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const fetchPayments = () => {
    axios
      .get("http://localhost:5000/resident/getpaymenthistory", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPayments(res.data.payments))
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const initiatePayment = async () => {
    if (!form.amount || !form.billType) {
      setError("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/resident/payment/initiate",
        {
          ...form,
          userId: user._id,
          communityId: user?.community?._id || community,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTransaction(res.data);
      setShowGateway(true);
    } catch {
      setError("Failed to initiate payment");
    }
  };

  const completePayment = async () => {
    try {
      await axios.put(
        `http://localhost:5000/resident/payment/${transaction.paymentId}/success`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Payment Successful!");
      setShowGateway(false);
      fetchPayments();
    } catch {
      setError("Payment failed");
    }
  };

  const downloadReceipt = async (transactionId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/resident/payment/receipt/${transactionId}`,
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `receipt_${transactionId}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download receipt");
    }
  };

  if (loading) return <h2 className="text-center mt-20">Loading...</h2>;

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
        <div className="absolute inset-0 bg-white/10 dark:bg-black/70" />

        <main className="relative z-10 p-6 w-full flex flex-col items-center">
          {/* PAGE CARD */}
          <section className="w-full bg-emerald-100/50 dark:bg-emerald-900/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8">
            <h2 className="text-4xl font-extrabold text-center mb-7 text-emerald-900 dark:text-emerald-100">
              Payments
            </h2>

            {/* FORM */}
            {!showGateway && (
              <div className="w-full flex flex-col gap-4 mb-8">
                <input
                  type="number"
                  name="amount"
                  placeholder="Enter Amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full py-3 px-4 rounded-lg border border-gray-300 text-lg bg-white shadow"
                />

                <select
                  name="billType"
                  value={form.billType}
                  onChange={handleChange}
                  className="w-full py-3 px-4 rounded-lg border border-gray-300 text-lg bg-white shadow"
                >
                  <option value="">Select Bill Type</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="parking">Parking</option>
                  <option value="security">Security</option>
                  <option value="event">Event Charges</option>
                </select>

                <select
                  name="method"
                  value={form.method}
                  onChange={handleChange}
                  className="w-full py-3 px-4 rounded-lg border border-gray-300 text-lg bg-white shadow"
                >
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Net Banking">Net Banking</option>
                </select>

                <button
                  onClick={initiatePayment}
                  className="w-full py-3 text-xl bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg shadow"
                >
                  Proceed to Pay
                </button>
              </div>
            )}

            {/* PAYMENT GATEWAY */}
            {showGateway && (
              <div className="flex flex-col gap-4 text-center mb-8">
                <h3 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                  Payment Gateway
                </h3>

                <button
                  onClick={completePayment}
                  className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg font-bold"
                >
                  Pay Now
                </button>

                <button
                  onClick={() => setShowGateway(false)}
                  className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold"
                >
                  Cancel
                </button>
              </div>
            )}

            {(error || success) && (
              <p
                className={`text-center text-lg font-semibold mb-4 ${
                  error ? "text-red-600" : "text-green-700"
                }`}
              >
                {error || success}
              </p>
            )}

            {/* FULL WIDTH TABLE */}
            <div className="flex flex-col gap-4 text-center mb-8">
              <h2 className="text-3xl font-extrabold text-center mb-7 text-emerald-900 dark:text-emerald-100">
              Payments History
            </h2>
              <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden bg-white/80 shadow-md">
                <thead>
                  <tr className="bg-gray-800 text-white text-lg">
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Bill Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="p-6 text-center text-lg italic"
                      >
                        No payments found.
                      </td>
                    </tr>
                  )}

                  {payments.map((p) => (
                    <tr
                      key={p._id}
                      className="odd:bg-white even:bg-emerald-100/40"
                    >
                      <td className="px-4 py-3 font-medium">{p.transactionId}</td>
                      <td className="px-4 py-3 font-medium">₹{p.amount}</td>
                      <td className="px-4 py-3 font-medium">{p.billType}</td>
                      <td className="px-4 py-3 font-medium">{p.status}</td>
                      <td className="px-4 py-3 font-medium">
                        {new Date(p.transactionDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-medium text-center">
                        {p.status === "completed" ? (
                          <button
                            onClick={() => downloadReceipt(p.transactionId)}
                            className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded"
                          >
                            Download
                          </button>
                        ) : (
                          "Not Available"
                        )}
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

export default ResidentPayment;
