import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNo: "",
    houseNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ===================== DYNAMIC AVATAR ==========================
  const avatarUrl = useMemo(() => {
    if (!form.name) return "/avatar.png";
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      form.name
    )}&radius=50&scale=100`;
  }, [form.name]);

  // ===================== FETCH PROFILE ==========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:5000/resident/getmyprofile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data.profile;
        setProfile(data);

        setForm({
          name: data.name || "",
          email: data.email || "",
          phoneNo: data.phoneNo || "",
          houseNumber: data.houseNumber || "",
        });
      } catch (err) {
        setError("Unable to fetch profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // ===================== UPDATE PROFILE ==========================
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await axios.put(
        "http://localhost:5000/resident/updateprofile",
        {
          name: form.name,
          email: form.email,
          phone: form.phoneNo,
          house: form.houseNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Profile updated successfully!");
      setProfile(res.data.updateProfile);
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // ===================== HANDLE INPUT CHANGE ==========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <HOAHeaderNavbar>
      <div
        className="relative min-h-screen overflow-y-auto"
        style={{
          backgroundImage: "url('/Society.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />

        <main className="relative z-10 p-10 flex flex-col items-center w-full">
          <section
            className="w-full max-w-4xl bg-emerald-100/40 dark:bg-emerald-900/70 dark:bg-gray-900/70
            backdrop-blur-xl rounded-2xl shadow-2xl p-10 mt-10"
          >
            {/* Heading */}
            <h2 className="text-4xl font-extrabold mb-10 text-center text-emerald-900 dark:text-emerald-200 drop-shadow">
              My Profile
            </h2>

            {/* Status Messages */}
            {loading && (
              <p className="text-center text-lg text-emerald-600 pb-4">
                Loading profile...
              </p>
            )}

            {error && (
              <p className="text-center text-lg text-red-600 pb-4">{error}</p>
            )}

            {success && (
              <p className="text-center text-lg text-green-600 pb-4">
                {success}
              </p>
            )}

            {/* PROFILE INFO */}
            {!loading && profile && (
              <>
                {/* Avatar + Basic Info */}
                <div className="flex items-center gap-6 bg-white/70 dark:bg-emerald-800/40 p-6 rounded-xl shadow-xl mb-10">
                  <img
                    src={avatarUrl}
                    alt="Profile Avatar"
                    className="w-20 h-20 rounded-full border-4 border-emerald-600 shadow-lg bg-white"
                  />

                  <div>
                    <h3 className="text-3xl font-bold text-emerald-900 dark:text-white capitalize">
                      {profile.name}
                    </h3>

                    <p className="text-lg text-emerald-700 dark:text-emerald-200 capitalize">
                      {profile.role}
                    </p>

                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Joined: {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* PROFILE UPDATE FORM */}
                <form
                  onSubmit={handleUpdate}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/70 dark:bg-emerald-800/40 p-6 rounded-xl shadow-xl"
                >
                  {/* NAME */}
                  <div>
                    <label className="font-semibold text-gray-900 dark:text-gray-200">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full mt-2 p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="font-semibold text-gray-900 dark:text-gray-200">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full mt-2 p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  {/* PHONE */}
                  <div>
                    <label className="font-semibold text-gray-900 dark:text-gray-200">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNo"
                      value={form.phoneNo}
                      onChange={handleChange}
                      className="w-full mt-2 p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  {/* HOUSE NUMBER */}
                  <div>
                    <label className="font-semibold text-gray-900 dark:text-gray-200">
                      House Number
                    </label>
                    <input
                      type="text"
                      name="houseNumber"
                      value={form.houseNumber}
                      onChange={handleChange}
                      className="w-full mt-2 p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  {/* SAVE BUTTON */}
                  <div className="md:col-span-2 flex justify-center mt-4">
                    <button
                      disabled={saving}
                      className="px-10 py-3 rounded-xl text-white bg-emerald-700 
                      hover:bg-emerald-800 dark:bg-emerald-600 
                      dark:hover:bg-emerald-500 transition shadow-md 
                      text-lg font-semibold"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        </main>
      </div>
    </HOAHeaderNavbar>
  );
};

export default Profile;
