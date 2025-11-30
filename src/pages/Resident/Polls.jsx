import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Polls = () => {
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [form, setForm] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch polls
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    setLoading(true);
    axios
      .get("http://localhost:5000/hoaadmin/getpolls", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPolls(res.data || []))
      .catch(() => setError("Could not load polls."))
      .finally(() => setLoading(false));
  }, [navigate, success]);

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // Create poll
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { question, option1, option2, option3, option4 } = form;

    // Collect non-empty options into array (min 2)
    const options = [option1, option2, option3, option4].filter(
      (o) => o && o.trim() !== ""
    );
    if (!question.trim()) {
      setError("Question is required.");
      return;
    }
    if (options.length < 2) {
      setError("Please provide at least two options.");
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/hoaadmin/addpoll",
        { question, options },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Poll created successfully.");
      setForm({
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create poll.");
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
          <section
            className="
            w-full mx-auto
            bg-emerald-100/50 dark:bg-emerald-900/70
            dark:border-emerald-800
            backdrop-blur-lg rounded-2xl shadow-xl p-8 my-8
          "
          >
            <h2 className="text-4xl font-extrabold mb-7 text-emerald-900 dark:text-emerald-100 text-center tracking-wider">
              Polls
            </h2>
            {/* {(error || success) && (
              <div
                className={`text-center pb-3 font-semibold text-lg ${
                  error
                    ? "text-red-600"
                    : "text-emerald-700 dark:text-emerald-200"
                }`}
              >
                {error || success}
              </div>
            )} */}

            {/* POLLS LIST */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-full rounded-xl shadow-md overflow-hidden table-auto">
                <thead>
                  <tr className="bg-gray-800/90 dark:bg-gray-900 text-white text-lg">
                    <th className="p-4 font-semibold text-left w-2/5">
                      Question
                    </th>
                    <th className="p-4 font-semibold text-left w-2/5">
                      Options
                    </th>
                    <th className="p-4 font-semibold text-center w-1/5">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {polls.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl"
                      >
                        No polls found.
                      </td>
                    </tr>
                  )}
                  {polls.map((poll) => (
                    <tr
                      key={poll._id}
                      className="transition hover:bg-emerald-200/50 dark:hover:bg-emerald-900/50 odd:bg-white/70 even:bg-emerald-100/70 dark:odd:bg-emerald-900/40 dark:even:bg-emerald-900/60 border-b border-gray-200/70 dark:border-gray-700/60"
                    >
                      <td className="px-4 py-3 align-top font-medium text-emerald-900 dark:text-emerald-100">
                        {poll.question}
                      </td>
                      <td className="px-4 py-3 align-top text-emerald-700 dark:text-emerald-200">
                        <ul className="list-disc list-inside space-y-1">
                          {poll.options?.map((opt) => (
                            <li key={opt._id}>
                              {opt.text}
                              <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                                ({opt.votes} votes)
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-3 text-center text-emerald-700 dark:text-emerald-200 whitespace-nowrap">
                        {poll.createdAt
                          ? new Date(poll.createdAt).toLocaleString()
                          : "-"}
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

export default Polls;
