import {
  Bell,
  Users,
  FileText,
  DollarSign,
  Home,
  BarChart2,
  Settings,
} from "lucide-react";

export default function Dashboard1() {
  return (
    <div className="flex h-screen w-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 text-blue-700 text-2xl font-bold border-b border-gray-100">
          HOA Connect
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium">
            <Bell size={18} /> Announcements
          </button>

          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100">
            <Users size={18} /> Residents
          </button>

          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100">
            <FileText size={18} /> Complaints
          </button>

          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100">
            <DollarSign size={18} /> Payments
          </button>

          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100">
            <Home size={18} /> Amenities
          </button>

          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100">
            <BarChart2 size={18} /> Analytics
          </button>

          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100">
            <Settings size={18} /> Settings
          </button>
        </nav>
      </aside>

      {/* Main Dashboard */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-gray-500 text-sm font-medium">Total Residents</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">120</h2>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-gray-500 text-sm font-medium">
              Pending Complaints
            </p>
            <h2 className="text-3xl font-bold text-red-500 mt-2">15</h2>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-gray-500 text-sm font-medium">Total Payments</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">$25,600</h2>
          </div>
        </div>

        {/* Announcements and Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4">Announcements</h3>
            <ul className="space-y-3 text-gray-700">
              <li>💧 Water supply maintenance on Oct 15</li>
              <li>🏠 Community meeting on Oct 18</li>
              <li>🎉 Festival celebration planned</li>
            </ul>
            <button className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
              View All
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow flex items-center justify-center text-gray-400">
            [Graph Placeholder]
          </div>
        </div>
      </main>
    </div>
  );
}
