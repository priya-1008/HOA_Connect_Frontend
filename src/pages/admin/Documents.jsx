import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Documents = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch documents
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    setLoading(true);
    axios
      .get("http://localhost:5000/hoaadmin/getdocuments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDocuments(res.data.documents || []))
      .catch(() => setError("Could not load documents."))
      .finally(() => setLoading(false));
  }, [navigate, success]);

  // Handle form input change
  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFile(e.target.files[0]);
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
    setError("");
    setSuccess("");
  };

  // Upload document form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }
    const token = localStorage.getItem("token");
    setLoading(true);
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/hoaadmin/upload",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(res.data.message);
      setForm({ title: "", description: "" });
      setFile(null);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Failed to upload document."
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete document
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/hoaadmin/deletedocument/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Document deleted.");
    } catch (err) {
      setError("Could not delete document.");
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
              Documents
            </h2>
            {/* FORM */}
            <form onSubmit={handleSubmit} className="flex flex-col mb-8 w-full gap-4" encType="multipart/form-data">
              {/* First row: Title + Description */}
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <input
                  type="text"
                  name="title"
                  maxLength={80}
                  required
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg font-semibold bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                  style={{ color: "#000000" }}
                  placeholder="Document Title"
                  onChange={handleChange}
                  value={form.title}
                />
                <input
                  type="text"
                  name="description"
                  maxLength={300}
                  required
                  className="flex-1 rounded-lg border border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow"
                  style={{ color: "#000000" }}
                  placeholder="Document Description"
                  onChange={handleChange}
                  value={form.description}
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
              {/* Second row: File upload full width */}
              <input
                type="file"
                name="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                required
                className="rounded-lg border border-gray-300 py-3 px-4 text-lg bg-white dark:bg-emerald-950/30 dark:text-emerald-100 shadow w-full"
                onChange={handleChange}
              />
              {/* Third row: Submit */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="text-xl py-3 px-4 bg-teal-700 dark:bg-teal-700 hover:bg-teal-800 dark:hover:bg-emerald-900 text-white rounded-lg font-bold text-lg transition w-auto"
                >
                  {loading ? "Uploading..." : "UPLOAD"}
                </button>
              </div>
            </form>
            {(error || success) && (
              <div className={`text-center pb-3 font-semibold text-lg ${error ? "text-red-600" : "text-emerald-700 dark:text-emerald-200"}`}>{error || success}</div>
            )}
            {/* DOCUMENTS LIST */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-full rounded-xl shadow-md overflow-hidden">
                <thead>
                  <tr className="bg-gray-800/80 dark:bg-gray-800/80 text-white text-xl">
                    <th className="p-5 font-semibold">Title</th>
                    <th className="p-5 font-semibold">Description</th>
                    <th className="p-5 font-semibold">File Type</th>
                    <th className="p-5 font-semibold">Uploaded By</th>
                    <th className="p-5 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-xl">
                        No documents found.
                      </td>
                    </tr>
                  )}
                  {documents.map((doc) => (
                    <tr
                      key={doc._id}
                      className="transition hover:bg-emerald-200/40 dark:hover:bg-emerald-900/40 odd:bg-white/30 even:bg-emerald-100/60 dark:odd:bg-emerald-900/40 dark:even:bg-emerald-900/60"
                    >
                      <td className="p-4 font-medium text-emerald-900 dark:text-emerald-100">{doc.title}</td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">{doc.description}</td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">{doc.fileType}</td>
                      <td className="p-4 text-emerald-700 dark:text-emerald-200">{doc.user?.name} ({doc.user?.email})</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDelete(doc._id)}
                          className="py-1 px-4 bg-red-600 hover:bg-red-800 text-white rounded font-bold transition"
                        >
                          Delete
                        </button>
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

export default Documents;
