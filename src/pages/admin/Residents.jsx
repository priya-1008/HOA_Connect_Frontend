import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Residents = () => {
  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    axios
      .get("http://localhost:5000/residents", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setResidents(res.data))
      .catch(() => setError("Could not load residents."));
  }, [navigate]);

  return (
    <HOAHeaderNavbar>
      <div
        className="relative min-h-screen overflow-y-auto"
        style={{
          backgroundImage: "url('/Society.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-white/10 dark:bg-black/70 pointer-events-none transition-all duration-300" />
        <main className="relative z-10 p-4 min-h-screen w-full flex flex-col justify-top items-center">
          <section className="
            w-full
            mx-auto
            bg-emerald-100/50 dark:bg-emerald-900/70
             dark:border-emerald-800
            backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8
          ">
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Residents Details
            </h2>
            {error && (
              <div className="text-center py-2 text-red-600 font-medium text-xl">{error}</div>
            )}
            <div className="w-full overflow-x-auto">
              <table className="min-w-full rounded-xl shadow-md overflow-hidden">
                <thead>
                  <tr className="bg-gray-800/80 dark:bg-gray-800/80 text-white text-xl">
                    <th className="p-5 font-semibold">Name</th>
                    <th className="p-5 font-semibold">Email</th>
                    <th className="p-5 font-semibold">Phone</th>
                    <th className="p-5 font-semibold">House Number</th>
                  </tr>
                </thead>
                <tbody>
                  {residents.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl">
                        No residents found.
                      </td>
                    </tr>
                  )}
                  {residents.map((r) => (
                    <tr
                      key={r._id}
                      className="transition hover:bg-emerald-200/40 dark:hover:bg-emerald-900/40 odd:bg-white/30 even:bg-emerald-100/60 dark:odd:bg-emerald-900/40 dark:even:bg-emerald-900/60"
                    >
                      <td className="p-4 font-medium text-emerald-900 dark:text-emerald-100">{r.name}</td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">{r.email}</td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">{r.phoneNo}</td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">{r.houseNumber}</td>
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

export default Residents;
