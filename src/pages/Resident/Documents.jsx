import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOAHeaderNavbar from "./HOAHeaderNavbar";

const Documents = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadLoadingId, setDownloadLoadingId] = useState(null);

  // Fetch documents
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDocs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:5000/resident/documents",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const docs = Array.isArray(res.data)
          ? res.data
          : res.data.documents || [];

        setDocuments(docs);
        setError("");
      } catch (err) {
        setError("Could not load documents.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [navigate, success]);

  // Download document with Authorization header
  const handleDownload = async (doc) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setDownloadLoadingId(doc._id);

      const res = await axios.get(
        `http://localhost:5000/resident/downloaddocument/${doc._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // important for files
        }
      );

      // Create blob URL and trigger browser download
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // use document title + extension if backend sets Content-Disposition,
      // otherwise fall back to title
      const defaultName = doc.title || "document";
      link.download = defaultName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download document.");
    } finally {
      setDownloadLoadingId(null);
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
              Documents
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

            {loading && documents.length === 0 && (
              <p className="text-center text-emerald-900 dark:text-emerald-100 font-medium mb-4">
                Loading documents...
              </p>
            )}

            {/* DOCUMENTS LIST */}
            <div className="w-full mt-2 overflow-x-auto">
              <div className="rounded-xl shadow-md border border-gray-200/70 dark:border-gray-700/70 overflow-hidden">
                <table className="min-w-full table-auto bg-white/70 dark:bg-emerald-950/40">
                  <thead>
                    <tr className="bg-gray-800/90 dark:bg-gray-800/90 text-white text-sm md:text-base">
                      <th className="p-4 text-left font-semibold">Title</th>
                      <th className="p-4 text-left font-semibold">
                        Description
                      </th>
                      <th className="p-4 text-left font-semibold">
                        File Type
                      </th>
                      <th className="p-4 text-left font-semibold">
                        Uploaded By
                      </th>
                      <th className="p-4 text-center font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.length === 0 && !loading && (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center font-bold py-6 text-emerald-900/80 dark:text-emerald-100/80 italic text-lg"
                        >
                          No documents found.
                        </td>
                      </tr>
                    )}

                    {documents.map((doc, index) => (
                      <tr
                        key={doc._id}
                        className={`text-sm md:text-base ${
                          index % 2 === 0
                            ? "bg-white/70 dark:bg-emerald-900/40"
                            : "bg-emerald-100/70 dark:bg-emerald-900/60"
                        } hover:bg-emerald-200/60 dark:hover:bg-emerald-800/70 transition-colors`}
                      >
                        <td className="px-4 py-3 font-medium text-emerald-900 dark:text-emerald-100 whitespace-nowrap">
                          {doc.title}
                        </td>
                        <td className="px-4 py-3 text-emerald-700 dark:text-emerald-200">
                          {doc.description}
                        </td>
                        <td className="px-4 py-3 text-emerald-700 dark:text-emerald-200 whitespace-nowrap">
                          {doc.fileType}
                        </td>
                        <td className="px-4 py-3 text-emerald-700 dark:text-emerald-200 whitespace-nowrap">
                          {doc.uploadedBy
                            ? `${doc.uploadedBy.name} (${doc.uploadedBy.email})`
                            : "Community Admin"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDownload(doc)}
                            disabled={downloadLoadingId === doc._id}
                            className="inline-flex items-center justify-center py-1.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white rounded font-semibold text-sm md:text-base transition"
                          >
                            {downloadLoadingId === doc._id
                              ? "Downloading..."
                              : "Download"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </HOAHeaderNavbar>
  );
};

export default Documents;
