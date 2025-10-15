import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import useFetch from "../../hooks/useFetch";
import  ENDPOINTS  from "../../api/endpoints";

const ManageAdmins = () => {
  const { data: admins } = useFetch(ENDPOINTS.SUPERADMIN.ADMINS);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Manage HOA Admins" />
        <main className="p-6">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Assigned Community</th>
              </tr>
            </thead>
            <tbody>
              {admins?.map((a) => (
                <tr key={a._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{a.name}</td>
                  <td className="p-3">{a.email}</td>
                  <td className="p-3">{a.community?.name || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};
