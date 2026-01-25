import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { sendEmails, getTemplateById } from "../services/api";

export default function SendEmail() {
  const [params] = useSearchParams();
  const templateId = params.get("template");

  const [emails, setEmails] = useState("");
  const [subject, setSubject] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [status, setStatus] = useState("");

  /* ================= LOAD TEMPLATE ================= */
  useEffect(() => {
    if (!templateId) return;

    getTemplateById(templateId).then((template) => {
      setSubject(template.subject);
      setBlocks(template.blocks);
    });
  }, [templateId]);

  /* ================= EMAIL CLEANER ================= */
  const cleanEmails = (raw) => {
    const valid = raw
      .split(/[\n,]+/)
      .map((e) => e.trim().toLowerCase())
      .filter(
        (e) =>
          e &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
      );

    return Array.from(new Set(valid));
  };

  /* ================= CSV IMPORT ================= */
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;

      const rows = text.split(/\r?\n/);
      const extractedEmails = rows
        .map((row) => row.split(",")[0]) // first column
        .map((e) => e.trim().toLowerCase())
        .filter(
          (e) =>
            e &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
        );

      const merged = cleanEmails(
        emails + "\n" + extractedEmails.join("\n")
      );

      setEmails(merged.join("\n"));
      setStatus(
        `📥 Imported ${extractedEmails.length} emails from CSV`
      );
    };

    reader.readAsText(file);
    e.target.value = ""; // reset input
  };

  /* ================= SEND ================= */
  const handleSend = async () => {
    if (!emails || !subject) {
      alert("Recipients and subject are required");
      return;
    }

    const emailArray = cleanEmails(emails);
    const total = emailArray.length;
    if (!total) {
      alert("No valid emails found");
      return;
    }

    setLoading(true);
    setStatus("Sending campaign...");
    setProgress({ current: 0, total });

    try {
      await sendEmails({
        emails: emailArray.join("\n"),
        subject,
        message,
        templateId,
        blocks,
      });

      setProgress({ current: total, total });
      setStatus("✅ Campaign sent successfully");
      setEmails("");
      setMessage("");
    } catch {
      setStatus("❌ Failed to send campaign");
    } finally {
      setLoading(false);
    }
  };

  const percentage =
    progress && progress.total
      ? Math.round((progress.current / progress.total) * 100)
      : 0;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow">
      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-2">
        📤 Send Email Campaign
      </h1>
      <p className="text-gray-500 mb-6">
        Send bulk emails using message or template
      </p>

      {/* RECIPIENTS */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Recipients
        </label>

        <textarea
          className="w-full border rounded-lg p-3 mb-3"
          placeholder="Recipients (comma or newline separated)"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          rows={4}
        />

        {/* CSV IMPORT */}
        <label className="inline-block cursor-pointer text-sm font-medium text-indigo-600 hover:underline">
          📄 Import CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* SUBJECT */}
      <input
        className="w-full border rounded-lg p-3 mb-4"
        placeholder="Email subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      {/* MESSAGE (ONLY IF NO TEMPLATE) */}
      {!templateId && (
        <textarea
          className="w-full border rounded-lg p-3 mb-6"
          placeholder="Email message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
        />
      )}

      {/* TEMPLATE PREVIEW */}
      {templateId && (
        <div className="border rounded-xl p-4 bg-gray-50 mb-6">
          <h2 className="font-semibold mb-3">
            👁 Template Preview
          </h2>

          {blocks.map((b, i) => (
            <div key={i} className="mb-3">
              {b.type === "text" && <p>{b.text}</p>}
              {b.type === "button" && (
                <span className="inline-block bg-indigo-600 text-white px-4 py-2 rounded">
                  {b.text}
                </span>
              )}
              {b.type === "divider" && <hr />}
            </div>
          ))}
        </div>
      )}

      {/* SEND BUTTON */}
      <button
        onClick={handleSend}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Sending..." : "🚀 Send Campaign"}
      </button>

      {/* STATUS */}
      {status && (
        <div className="mt-4 text-center text-sm font-medium">
          {status}
        </div>
      )}

      {/* PROGRESS BAR */}
      {progress && (
        <div className="mt-6">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{percentage}%</span>
          </div>

          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
