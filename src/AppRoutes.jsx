// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import PrivateRoute from './components/PrivateRoute';

// // Pages
// import Login from './pages/Login';
// import Dashboard from './pages/superadmin/Dashboard';
// import ManageCommunities from './pages/superadmin/ManageCommunities';
// import ManageAdmins from './pages/superadmin/ManageAdmins';
// import PaymentsReport from './pages/superadmin/PaymentsReport';
// // import Reports from './pages/superadmin/Reports';

// const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* Public Route */}
//       <Route path="/login" element={<Login />} />

//       {/* Private Routes */}
//       <Route
//         path="/"
//         element={
//           <PrivateRoute>
//             <Dashboard />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/manage-communities"
//         element={
//           <PrivateRoute>
//             <ManageCommunities />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/manage-admins"
//         element={
//           <PrivateRoute>
//             <ManageAdmins />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/payments"
//         element={
//           <PrivateRoute>
//             <PaymentsReport />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/reports"
//         element={
//           <PrivateRoute>
//             <Reports />
//           </PrivateRoute>
//         }
//       />
//     </Routes>
//   );
// };

// export default AppRoutes;
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Dashboard from './pages/superadmin/Dashboard';
import Dashboard1 from './pages/superadmin/Dashboard1';
import ManageCommunities from './pages/superadmin/ManageCommunities';
import ManageAdmins from './pages/superadmin/ManageAdmins';
import PaymentsReport from './pages/superadmin/PaymentsReport';
// import Reports from './pages/superadmin/Reports';

const AppRoutes = () => (
  <Routes>
    {/* Public Route */}
    <Route path="/" element={<Login />} />

    {/* Private Routes */}
    <Route
      path="/dashboard"
      element={
        <PrivateRoute requiredRole="superadmin">
          <Dashboard />
        </PrivateRoute>
      }
    />

    <Route
      path="/"
      element={
        <PrivateRoute requiredRole="admin">
          <AdminDashboard />
        </PrivateRoute>
      }
    />

    {/* <Route
      path="/superadmin-dashboard"
      element={
        <PrivateRoute requiredRole="superadmin">
          <Dashboard />
        </PrivateRoute>
      }
    /> */}


    <Route
      path="/manage-communities"
      element={
        <PrivateRoute>
          <ManageCommunities />
        </PrivateRoute>
      }
    />
    <Route
      path="/manage-admins"
      element={
        <PrivateRoute>
          <ManageAdmins />
        </PrivateRoute>
      }
    />
    <Route
      path="/payments"
      element={
        <PrivateRoute>
          <PaymentsReport />
        </PrivateRoute>
      }
    />
    {/* <Route
      path="/reports"
      element={
        <PrivateRoute>
          <Reports />
        </PrivateRoute>
      }
    /> */}
    {/* Redirect any unknown route to login */}
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;