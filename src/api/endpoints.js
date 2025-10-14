

// export const ENDPOINTS = {
//   AUTH: {
//     LOGIN: "/auth/login",
//     REGISTER: "/auth/register",
//   },
//   SUPERADMIN: {
//     COMMUNITIES: "/communities",
//     ADMINS: "/users/admins",
//     PAYMENTS: "/payments",
//     NOTIFICATIONS: "/announcements/latest",
//   },
// };
const BASE_URL = "http://localhost:5000";

const ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,
  DASHBOARD: `${BASE_URL}/dashboard`,
  NOTIFICATIONS: `${BASE_URL}/notifications`,
  ANNOUNCEMENTS: `${BASE_URL}/announcements`,
  COMMUNITY: `${BASE_URL}/communities`,
};

export default ENDPOINTS;
