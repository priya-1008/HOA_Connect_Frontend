import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Amenities = () => {
  const navigate = useNavigate();
  const [amenities, setAmenities] = useState([]);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch all amenities created by admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    setLoading(true);
    axios
      .get("http://localhost:5000/resident/amenitylist", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAmenities(res.data.amenities || []);
      })
      .catch(() => setError("Could not load amenities."))
      .finally(() => setLoading(false));
  }, [navigate, success]);

  // Book amenity
  const handleBookAmenity = async () => {
    if (!selectedAmenity) return;
    if (!bookingDate) {
      setError("Please select a booking date.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      setBookingLoading(true);
      const res = await axios.post(
        "http://localhost:5000/resident/bookamenity",
        {
          amenityId: selectedAmenity._id,
          bookingDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(res.data.message || "Amenity booked successfully");
      setSelectedAmenity(null);
      setBookingDate("");
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

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
        <main className="relative z-10 p-4 min-h-screen w-full flex flex-col items-center">
          <section
            className="
            w-full mx-auto
            bg-emerald-100/50 dark:bg-emerald-900/70
            dark:border-emerald-800
            backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8
          "
          >
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Amenities
            </h2>

            {(error || success) && (
              <div
                className={`text-center pb-3 font-semibold text-lg ${
                  error
                    ? "text-red-600"
                    : "text-emerald-700 dark:text-emerald-200"
                }`}
              >
                {error || success}
              </div>
            )}

            {loading && (
              <p className="text-center text-emerald-900 dark:text-emerald-100 font-medium mb-4">
                Loading amenities...
              </p>
            )}

            {/* AMENITIES TABLE */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-full rounded-xl shadow-md overflow-hidden bg-white/60 dark:bg-emerald-950/40">
                <thead>
                  <tr className="bg-gray-800/90 dark:bg-gray-800/90 text-white text-base md:text-lg">
                    <th className="p-4 font-semibold text-left">Name</th>
                    <th className="p-4 font-semibold text-left">Description</th>
                    <th className="p-4 font-semibold text-left">
                      Maintenance Status
                    </th>
                    <th className="p-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {amenities.length === 0 && !loading && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-lg"
                      >
                        No amenities found.
                      </td>
                    </tr>
                  )}

                  {amenities.map((a, index) => (
                    <tr
                      key={a._id}
                      className={`text-sm md:text-base ${
                        index % 2 === 0
                          ? "bg-white/70 dark:bg-emerald-900/40"
                          : "bg-emerald-100/70 dark:bg-emerald-900/60"
                      } hover:bg-emerald-200/60 dark:hover:bg-emerald-800/70 transition-colors`}
                    >
                      <td className="px-4 py-3 font-medium text-emerald-900 dark:text-emerald-100">
                        {a.name}
                      </td>
                      <td className="px-4 py-3 text-emerald-700 dark:text-emerald-200">
                        {a.description}
                      </td>
                      <td className="px-4 py-3 text-emerald-700 dark:text-emerald-200 capitalize">
                        {a.maintenanceStatus}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedAmenity(a);
                            setError("");
                            setSuccess("");
                          }}
                          disabled={a.maintenanceStatus !== "available"}
                          className={`py-1.5 px-4 rounded font-semibold text-sm md:text-base transition 
                          ${
                            a.maintenanceStatus === "available"
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-gray-400 cursor-not-allowed text-white"
                          }`}
                        >
                          {a.maintenanceStatus === "available"
                            ? "Book"
                            : "Unavailable"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* BOOKING MODAL */}
          {selectedAmenity && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
              <div className="bg-white dark:bg-emerald-900 rounded-xl shadow-xl p-6 w-full max-w-md">
                <h3 className="text-2xl font-bold text-center mb-4 text-emerald-900 dark:text-emerald-100">
                  Book Amenity
                </h3>

                <p className="mb-2 text-emerald-800 dark:text-emerald-200 font-medium">
                  Amenity:{" "}
                  <span className="font-bold">{selectedAmenity.name}</span>
                </p>

                <label className="block text-emerald-900 dark:text-emerald-100 font-semibold mb-1">
                  Booking Date:
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-emerald-800 text-gray-900 dark:text-white"
                />

                <div className="flex justify-between mt-5">
                  <button
                    className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold"
                    onClick={() => {
                      setSelectedAmenity(null);
                      setBookingDate("");
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                    onClick={handleBookAmenity}
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? "Booking..." : "Book Now"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </HOAHeaderNavbar>
  );
};

export default Amenities;
