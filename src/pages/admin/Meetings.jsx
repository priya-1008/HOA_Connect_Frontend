import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { useJsApiLoader } from "@react-google-maps/api";

const googleMapsApiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // <-- Replace with your own API key

const Meetings = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [form, setForm] = useState({ title: "", agenda: "", location: "", meetingDate: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Google Maps loader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapsApiKey,
    libraries: ['places'],
  });

  // usePlacesAutocomplete for location
  const {
    ready,
    value: locationInput,
    setValue: setLocationInput,
    suggestions: { status, data: locationSuggestions },
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
  });

  useEffect(() => {
    setLocationInput(form.location || "");
  }, [form.location, setLocationInput]);

  // Fetch meetings
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    setLoading(true);
    axios
      .get("http://localhost:5000/meetings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMeetings(res.data || []))
      .catch(() => setError("Could not load meetings."))
      .finally(() => setLoading(false));
  }, [navigate, success]);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // Handle location field from Google Places
  const handleLocationInput = (e) => {
    setLocationInput(e.target.value);
    setForm({ ...form, location: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSelectLocation = (description) => {
    setLocationInput(description, false);
    setForm({ ...form, location: description });
    clearSuggestions();
  };

  // Submit meeting
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/meetings",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Meeting created.");
      setForm({ title: "", agenda: "", location: "", meetingDate: "" });
      setLocationInput("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Failed to create meeting."
      );
    } finally {
      setLoading(false);
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
          <section className="
            w-full mx-auto
            bg-emerald-100/50 dark:bg-emerald-900/70
            dark:border-emerald-800
            backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8
          ">
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Meetings
            </h2>
            {/* FORM */}
            <form onSubmit={handleSubmit} className="flex flex-col mb-8 w-full gap-4">
              {/* First row: Title + Agenda */}
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <input
                  type="text"
                  name="title"
                  maxLength={80}
                  required
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg font-semibold bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                  style={{ color: "#000000" }}
                  placeholder="Meeting Title"
                  onChange={handleChange}
                  value={form.title}
                />
                <input
                  type="text"
                  name="agenda"
                  maxLength={300}
                  required
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                  style={{ color: "#000000" }}
                  placeholder="Agenda"
                  onChange={handleChange}
                  value={form.agenda}
                />
                <style>{`
                  input::placeholder {
                    color: #888888 !important; opacity: 1;
                  }
                  .dark input::placeholder {
                    color: #b6b6b6 !important; opacity: 1;
                  }
                `}</style>
              </div>
              {/* Second row: Google Places Location + Date */}
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    name="location"
                    required
                    className="w-full rounded-lg border border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                    style={{ color: "#000000" }}
                    placeholder="Location"
                    value={locationInput}
                    onChange={handleLocationInput}
                    autoComplete="off"
                    disabled={!isLoaded || !ready}
                  />
                  {status === "OK" && (
                    <ul className="absolute z-50 bg-white border border-gray-200 w-full max-h-60 overflow-y-auto rounded-lg mt-1 shadow-lg">
                      {locationSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.place_id}
                          className="cursor-pointer p-2 hover:bg-emerald-100"
                          onClick={() => handleSelectLocation(suggestion.description)}
                        >
                          {suggestion.description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <input
                  type="datetime-local"
                  name="meetingDate"
                  required
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                  value={form.meetingDate}
                  onChange={handleChange}
                  style={{ color: "#000000" }}
                />
              </div>
              {/* Submit button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="text-xl py-3 px-4 bg-teal-700 dark:bg-teal-700 hover:bg-teal-800 dark:hover:bg-emerald-900 text-white rounded-lg font-bold text-lg transition w-auto"
                >
                  {loading ? "Saving..." : "SUBMIT"}
                </button>
              </div>
            </form>
            {(error || success) && (
              <div className={`text-center pb-3 font-semibold text-lg ${error ? "text-red-600" : "text-emerald-700 dark:text-emerald-200"}`}>{error || success}</div>
            )}
            {/* MEETINGS LIST */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-full rounded-xl shadow-md overflow-hidden">
                <thead>
                  <tr className="bg-gray-800/80 dark:bg-gray-800/80 text-white text-xl">
                    <th className="p-5 font-semibold">Title</th>
                    <th className="p-5 font-semibold">Agenda</th>
                    <th className="p-5 font-semibold">Location</th>
                    <th className="p-5 font-semibold">Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {meetings.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl">
                        No meetings found.
                      </td>
                    </tr>
                  )}
                  {meetings.map((meeting) => (
                    <tr
                      key={meeting._id}
                      className="transition hover:bg-emerald-200/40 dark:hover:bg-emerald-900/40 odd:bg-white/30 even:bg-emerald-100/60 dark:odd:bg-emerald-900/40 dark:even:bg-emerald-900/60"
                    >
                      <td className="p-4 font-medium text-emerald-900 dark:text-emerald-100">{meeting.title}</td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">{meeting.description}</td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">{meeting.location}</td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">{meeting.meetingDate ? new Date(meeting.meetingDate).toLocaleString() : ""}</td>
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

export default Meetings;
