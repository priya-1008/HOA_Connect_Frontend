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
import Dashboard from './pages/superadmin/Dashboard';
import ManageCommunities from './pages/superadmin/ManageCommunities';
import ManageAdmins from './pages/superadmin/ManageAdmins';
import PaymentsReport from './pages/superadmin/PaymentsReport';
import SystemNotification from './pages/superadmin/Notifications';
import Analytics from './pages/superadmin/ViewAnalytics';
// HOA Admin Pages
import HOAAdminDashboard from './pages/admin/AdminDashboard';



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
    <Route
      path="/notifications"
      element={
        <PrivateRoute>
         <SystemNotification />
        </PrivateRoute>
      }
    />
    <Route
      path="/analytics"
      element={
        <PrivateRoute>
         <Analytics />
        </PrivateRoute>
      }
    />

    {/*  HOA Admin Routes */}
    <Route
      path="/admin-dashboard"
      element={
        <PrivateRoute requiredRole="admin">
          <HOAAdminDashboard />
        </PrivateRoute>
      }
    />
    <Route
      path="/communities"
      element={
        <PrivateRoute requiredRole="admin">
          <Communities />
        </PrivateRoute>
      }
    />
    <Route
      path="/manage-residents"
      element={
        <PrivateRoute requiredRole="admin">
          <Residents />
        </PrivateRoute>
      }
    />
    <Route
      path="/post-announcements"
      element={
        <PrivateRoute requiredRole="admin">
          <Announcements />
        </PrivateRoute>
      }
    />
    <Route
      path="/complaints"
      element={
        <PrivateRoute requiredRole="admin">
          <Complaints />
        </PrivateRoute>
      }
    />
    <Route
      path="/amenities"
      element={
        <PrivateRoute requiredRole="admin">
          <Amenities />
        </PrivateRoute>
      }
    />
    <Route
      path="/documents"
      element={
        <PrivateRoute requiredRole="admin">
          <Documents />
        </PrivateRoute>
      }
    />
    <Route
      path="/meetings"
      element={
        <PrivateRoute requiredRole="admin">
          <Meetings />
        </PrivateRoute>
      }
    />
    <Route
      path="/polls"
      element={
        <PrivateRoute requiredRole="admin">
          <Polls />
        </PrivateRoute>
      }
    />
    <Route
      path="/notifications"
      element={
        <PrivateRoute requiredRole="admin">
          <Notifications />
        </PrivateRoute>
      }
    />
  
    {/* Redirect any unknown route to login */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;