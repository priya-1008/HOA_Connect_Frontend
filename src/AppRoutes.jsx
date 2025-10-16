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


// HOA Admin Pages
import HOAAdminDashboard from './pages/admin/AdminDashboard';
import Payments from './pages/admin/TrackPayment';
import Residents from './pages/admin/Residents';
import Announcements from './pages/admin/Announcements';
import Complaints from './pages/admin/Complaints';
import Amenities from './pages/admin/Amenities';
import Documents from './pages/admin/Documents';
import Meetings from './pages/admin/Meetings';
import Polls from './pages/admin/Polls';
import Notification from './pages/admin/SendNotification';

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
      path="/track-payments"
      element={
        <PrivateRoute >
          <Payments />
        </PrivateRoute>
      }
    />
    <Route
      path="/residents"
      element={
        <PrivateRoute >
          <Residents />
        </PrivateRoute>
      }
    />
    <Route
      path="/announcements"
      element={
        <PrivateRoute >
          <Announcements />
        </PrivateRoute>
      }
    />
    <Route
      path="/complaints"
      element={
        <PrivateRoute >
          <Complaints />
        </PrivateRoute>
      }
    />
    <Route
      path="/amenities"
      element={
        <PrivateRoute >
          <Amenities />
        </PrivateRoute>
      }
    />
    <Route
      path="/documents"
      element={
        <PrivateRoute >
          <Documents />
        </PrivateRoute>
      }
    />
    <Route
      path="/meetings"
      element={
        <PrivateRoute >
          <Meetings />
        </PrivateRoute>
      }
    />
    <Route
      path="/polls"
      element={
        <PrivateRoute >
          <Polls />
        </PrivateRoute>
      }
    />
    <Route
      path="/resident-notification"
      element={
        <PrivateRoute >
          <Notification />
        </PrivateRoute>
      }
    />
  
    {/* Redirect any unknown route to login */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;