import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("http://localhost:5000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data?.data || res.data);
      } catch (err) {
        console.error("Could not load profile:", err);
        setError("Could not load profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
        <div className="absolute inset-0 bg-white/10 dark:bg-black/50 " />

        <main className="relative z-10 p-5 flex flex-col items-center w-full">
          <section
            className="
              w-full max-w-5xl
              bg-emerald-100/50 dark:bg-emerald-900/70 backdrop-blur-xl
              rounded-2xl shadow-2xl p-8 mt-10
            "
          >
            <h2 className="text-4xl font-extrabold mb-10 text-emerald-900 dark:text-emerald-100 text-center">
              Profile Details
            </h2>

            {loading && (
              <div className="text-center pb-3 font-semibold text-lg text-emerald-700 dark:text-emerald-200">
                Loading profile...
              </div>
            )}

            {error && !loading && (
              <div className="text-center pb-3 font-semibold text-lg text-red-600">
                {error}
              </div>
            )}

            {!loading && !error && profile && (
              <>
                {/* ==== Profile Card Upper section ===== */}
                <div className="flex items-center gap-6 bg-white/60 dark:bg-emerald-800/50 p-6 rounded-xl shadow-md mb-10">
                  <img
                    src="/avatar.png"
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-emerald-600"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-emerald-900 dark:text-white">
                      {profile.name}
                    </h3>
                    <p className="text-lg text-emerald-700 dark:text-emerald-200 capitalize">
                      {profile.role || "Resident"}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Joined:{" "}
                      {profile.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>

                {/* ========= Personal Information Card ========= */}
                <div className="bg-white/60 dark:bg-emerald-800/50 rounded-xl shadow-lg p-6 mb-8">
                  <h3 className="text-xl font-bold mb-5 text-emerald-900 dark:text-white">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-lg">
                    <p>
                      <span className="font-semibold">Full Name: </span>
                      {profile.name}
                    </p>
                    <p>
                      <span className="font-semibold">Email: </span>
                      {profile.email}
                    </p>
                    <p>
                      <span className="font-semibold">Role: </span>
                      {profile.role}
                    </p>
                  </div>
                </div>
              </>
            )}

            {!loading && !error && !profile && (
              <div className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl">
                No profile details found.
              </div>
            )}
          </section>
        </main>
      </div>
    </HOAHeaderNavbar>
  );
};

export default Profile;
