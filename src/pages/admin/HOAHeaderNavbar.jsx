import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  BuildingOffice2Icon,
  UsersIcon,
  BellIcon,
  CurrencyDollarIcon,
  MegaphoneIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  FolderIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

const NAV_LINKS = [
  { label: "Dashboard", icon: HomeIcon, path: "/admin-dashboard" },
  { label: "Residents", icon: UsersIcon, path: "/residents" },
  { label: "Announcements", icon: MegaphoneIcon, path: "/announcements" },
  { label: "Complaints", icon: ClipboardDocumentListIcon, path: "/complaints" },
  { label: "Amenities", icon: BuildingOffice2Icon, path: "/amenities" },
  { label: "Documents", icon: FolderIcon, path: "/documents" },
  { label: "Meetings", icon: ChatBubbleBottomCenterTextIcon, path: "/meetings" },
  { label: "Payments", icon: CurrencyDollarIcon, path: "/track-payments" },
  { label: "Notifications", icon: BellIcon, path: "/resident-notification" },
];

// Modern Topbar NavLink
const TopNavLink = ({ icon: Icon, label, isActive, onClick }) => {
  const base =
    "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors";
  const active =
    "bg-teal-700 text-white shadow hover:bg-teal-800 dark:bg-gradient-to-r dark:from-teal-600 dark:to-teal-500";
  const inactive =
    "text-teal-900 dark:text-teal-100 hover:bg-teal-700 hover:text-white hover:bg-slate-800";
  return (
    <button
      onClick={onClick}
      className={`${base} ${isActive ? active : inactive} whitespace-nowrap`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
};

// Simple, accessible, home SVG icon (no request needed)
const GradientHomeLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8"
    viewBox="0 0 32 32"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="hoaHomeGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#14b8a6" />    {/* teal-500 */}
        <stop offset="100%" stopColor="#0e7490" />   {/* teal-700 */}
      </linearGradient>
    </defs>
    <path
      d="M4 14L16 4L28 14V28A2 2 0 0 1 26 30H6A2 2 0 0 1 4 28V14Z"
      fill="url(#hoaHomeGradient)"
      stroke="#094c49"
      strokeWidth="2"
    />
    <rect x="12" y="20" width="8" height="10" rx="2" fill="#fff" />
  </svg>
);


const HOAHeaderNavbar = ({ children }) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleDarkModeToggle = () => setDarkMode((prev) => !prev);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      className={`flex flex-col min-h-screen w-full transition-colors duration-300 ${
        darkMode ? "bg-slate-950 text-teal-100" : "bg-blue-50 text-slate-900"
      }`}
    >
      {/* Modern TopHeader */}
      <header
        className={`flex items-center justify-between px-8 py-3 shadow-lg border-b transition-colors duration-300
          ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
        style={{
          zIndex: 40,
        }}
      >
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <GradientHomeLogo darkMode={darkMode} />
          <span className={`text-2xl font-extrabold tracking-tight 
            ${darkMode ? "text-teal-400" : "text-teal-700"}`}>
            HOAConnect 
          </span>
        </div>
        {/* Nav Links (scrollable on mobile) */}
        <nav className="flex-1 flex items-center justify-center min-w-0">
          <div className="flex gap-1 md:gap-2 overflow-x-auto scrollbar-hide">
            {NAV_LINKS.map(({ label, icon: Icon, path }) => (
              <TopNavLink
                key={path}
                icon={Icon}
                label={label}
                isActive={location.pathname === path}
                onClick={() => navigate(path)}
              />
            ))}
          </div>
        </nav>
        {/* Right: Dark Mode Toggle & Logout */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDarkModeToggle}
            className="flex items-center justify-center p-2 rounded-full bg-white dark:bg-slate-800 hover:bg-teal-600 dark:hover:bg-teal-700 shadow transition"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? (
              <SunIcon className="w-6 h-6 text-yellow-400" />
            ) : (
              <MoonIcon className="w-6 h-6 text-teal-700" />
            )}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-700 text-white hover:bg-teal-800 font-semibold shadow"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" /> Logout
          </button>
        </div>
      </header>
      {/* Main content area */}
      <div className="flex-1 w-full overflow-y-auto transition-colors duration-300 p-0">
        {children}
      </div>
    </div>
  );
};

export default HOAHeaderNavbar;
