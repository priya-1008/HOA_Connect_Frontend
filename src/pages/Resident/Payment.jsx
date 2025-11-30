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
  const [receiptPdf, setReceiptPdf] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [payments, setPayments] = useState([]);

  // Fetch logged-in user
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
  }, [token, navigate]);

  // Fetch payment history
  const fetchPayments = () => {
    axios
      .get("http://localhost:5000/resident/getpaymenthistory", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPayments(res.data.payments))
      .catch((err) => console.log(err));
  };

  // Handle form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // STEP 1 → Initiate Payment
  const initiatePayment = async () => {
    if (!user || !community) {
      return setError("User data not loaded. Try again.");
    }

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
      setError("Payment initiation failed");
    }
  };

  // STEP 2 → Complete Dummy Payment
  const completePayment = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/resident/payment/${transaction.paymentId}/success`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Payment Successful!");
      // setReceiptPdf(res.data.pdf ? transaction.transactionId : transaction.transactionId);
      setReceiptPdf(transaction.transactionId);
      setShowGateway(false);
      fetchPayments(); // Refresh payment history
    } catch {
      setError("Payment failed while completing");
    }
  };

  // Download receipt from history
  const downloadReceipt = async (transactionId) => {
    try {
      const token = localStorage.getItem("token");

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
      link.setAttribute("download", `receipt_${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download receipt");
    }
  };

  if (loading) return <h2 className="text-center mt-20">Loading...</h2>;

  return (
    <HOAHeaderNavbar>
      <div className="min-h-screen flex flex-col items-center py-12 px-6 bg-[url('/Society.jpg')] bg-cover bg-center">
        <div className="w-full max-w-2xl bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-10 mb-10">
          <h2 className="text-4xl font-bold text-center mb-8 text-emerald-800">
            Pay
          </h2>

          {error && (
            <p className="bg-red-500/20 text-red-800 py-2 rounded text-center mb-4 font-bold">
              {error}
            </p>
          )}
          {success && (
            <p className="bg-green-500/20 text-green-800 py-2 rounded text-center mb-4 font-bold">
              {success}
            </p>
          )}

          {/* ===== FORM ===== */}
          {!showGateway && (
            <div className="space-y-6">
              <input
                type="number"
                name="amount"
                placeholder="Enter Amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full py-3 px-4 border rounded-lg"
              />

              <select
                name="billType"
                value={form.billType}
                onChange={handleChange}
                className="w-full py-3 px-4 border rounded-lg"
              >
                <option value="">Select Bill Type</option>
                <option value="maintenance">Maintenance</option>
                <option value="amenity">Parking</option>
                <option value="penalty">Security</option>
                <option value="event">Event Charges</option>
              </select>

              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                className="w-full py-3 px-4 border rounded-lg"
              >
                <option value="UPI">UPI</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Net Banking">Net Banking</option>
              </select>

              <button
                onClick={initiatePayment}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold"
              >
                Proceed to Pay
              </button>
            </div>
          )}

          {/* ===== DUMMY PAYMENT GATEWAY ===== */}
          {showGateway && (
            <div className="text-center space-y-6 mt-6">
              <h3 className="text-3xl font-bold text-emerald-700">
                Payment Gateway
              </h3>
              <p className="text-lg text-gray-700">
                Bill Type: <b>{form.billType}</b> <br />
                Amount: <b>₹{form.amount}</b>
              </p>

              <button
                onClick={completePayment}
                className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg font-bold"
              >
                Pay Now
              </button>

              <button
                onClick={() => setShowGateway(false)}
                className="w-full py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold"
              >
                Cancel
              </button>
            </div>
          )}

          {/* ===== RECEIPT DOWNLOAD AFTER PAYMENT ===== */}
          {receiptPdf && (
            <div className="text-center mt-6">
              <button
                onClick={() => downloadReceipt(receiptPdf)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Download Receipt
              </button>
            </div>
          )}
        </div>

        {/* ===== PAYMENT HISTORY ===== */}
        <div className="w-full max-w-4xl bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-emerald-800 text-center">
            Payment History
          </h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-emerald-100">
                  <th className="border px-4 py-2">Transaction ID</th>
                  <th className="border px-4 py-2">Amount</th>
                  <th className="border px-4 py-2">Bill Type</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {payments && payments.length > 0 ? (
                  payments.map((p) => (
                    <tr key={p._id}>
                      <td className="border px-4 py-2">{p.transactionId}</td>
                      <td className="border px-4 py-2">₹{p.amount}</td>
                      <td className="border px-4 py-2">{p.billType}</td>
                      <td className="border px-4 py-2 capitalize">
                        {p.status}
                      </td>
                      <td className="border px-4 py-2">
                        {new Date(p.transactionDate).toLocaleDateString()}
                      </td>
                      <td className="border px-4 py-2 text-center">
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HOAHeaderNavbar>
  );
};

export default ResidentPayment;
