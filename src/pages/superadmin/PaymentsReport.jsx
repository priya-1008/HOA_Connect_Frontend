import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import useFetch from "../../hooks/useFetch";
import  ENDPOINTS  from "../../api/endpoints";

const PaymentsReport = () => {
  const { data: payments } = useFetch(ENDPOINTS.SUPERADMIN.PAYMENTS);

  const total = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Payments & Reports" />
        <main className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Total Payments: ₹{total}</h3>
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Resident</th>
                <th className="p-3 text-left">Community</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments?.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{p.resident?.name}</td>
                  <td className="p-3">{p.community?.name}</td>
                  <td className="p-3">₹{p.amount}</td>
                  <td className="p-3">{new Date(p.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default PaymentsReport;