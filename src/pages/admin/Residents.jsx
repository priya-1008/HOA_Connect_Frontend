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
      .get("http://localhost:5000/hoaadmin/getresidents", {
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
          <section
            className="
              w-full mx-auto
              bg-emerald-100/50 dark:bg-emerald-900/70
              dark:border-emerald-800
              backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8
            "
          >
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Residents Details
            </h2>

            {error && (
              <div className="text-center py-2 text-red-600 font-medium text-xl">
                {error}
              </div>
            )}

            {/* full-width table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-center rounded-xl shadow-md overflow-hidden border-separate border-spacing-0">
                <thead>
                  <tr className="bg-gray-800/90 dark:bg-gray-800/90 text-white text-lg">
                    <th className="p-4 font-semibold text-center border-b border-gray-700">
                      Name
                    </th>
                    <th className="p-4 font-semibold text-center border-b border-gray-700">
                      Email
                    </th>
                    <th className="p-4 font-semibold text-center border-b border-gray-700">
                      Phone
                    </th>
                    <th className="p-4 font-semibold text-center border-b border-gray-700">
                      House Number
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {residents.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl bg-white/40 dark:bg-emerald-900/40 border-t border-gray-300/40"
                      >
                        No residents found.
                      </td>
                    </tr>
                  )}

                  {residents.map((r, idx) => (
                    <tr
                      key={r._id}
                      className={`
                        transition
                        hover:bg-emerald-200/50 dark:hover:bg-emerald-900/50
                        ${
                          idx % 2 === 0
                            ? "bg-white/60 dark:bg-emerald-900/40"
                            : "bg-emerald-100/70 dark:bg-emerald-900/60"
                        }
                      `}
                    >
                      <td className="p-4 font-medium text-emerald-900 dark:text-emerald-100 text-center border-t border-gray-200/40">
                        {r.name}
                      </td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200 text-center border-t border-gray-200/40">
                        {r.email}
                      </td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200 text-center border-t border-gray-200/40">
                        {r.phoneNo}
                      </td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200 text-center border-t border-gray-200/40">
                        {r.houseNumber}
                      </td>
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
