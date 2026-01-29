import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { sendEmails, getTemplateById } from "../services/api";

export default function SendEmail() {
  const [params] = useSearchParams();
  const templateId = params.get("template");
  const [scheduledAt, setScheduledAt] = useState("");

  const [emails, setEmails] = useState("");
  const [subject, setSubject] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [status, setStatus] = useState("");

  /* LOAD TEMPLATE */
  useEffect(() => {
    if (!templateId) return;

    getTemplateById(templateId).then((template) => {
      setSubject(template.subject);
      setBlocks(template.blocks);
    });
  }, [templateId]);

  /* EMAIL CLEANER */
  const cleanEmails = (raw) =>
    Array.from(
      new Set(
        raw
          .split(/[\n,]+/)
          .map((e) => e.trim().toLowerCase())
          .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
      )
    );

  /* CSV IMPORT */
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const rows = event.target.result.split(/\r?\n/);
      const extracted = rows
        .map((r) => r.split(",")[0])
        .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

      const merged = cleanEmails(emails + "\n" + extracted.join("\n"));
      setEmails(merged.join("\n"));
      setStatus(`📥 Imported ${extracted.length} emails`);
    };

    reader.readAsText(file);
    e.target.value = "";
  };

  /* SEND */
const handleSend = async () => {
  if (!emails || !subject) return alert("Recipients and subject required");
  const list = cleanEmails(emails);
  if (!list.length) return alert("No valid emails");

  setLoading(true);
  setStatus("⏳ Processing...");

  try {
    // 🔥 FIX: Only convert to ISO if a date actually exists
    // If user cleared the input, it should be null to send immediately
    const isoDate = scheduledAt ? new Date(scheduledAt).toISOString() : null;

    const response = await sendEmails({
      emails: list.join("\n"),
      subject,
      message,
      templateId,
      blocks,
      scheduledAt: isoDate, 
    });

    // ✅ Use the message from the server (it will say "Campaign scheduled successfully")
    setStatus(`✅ ${response.data.message}`);
    
    // Optional: Clear form on success
    if (!scheduledAt) {
       setEmails("");
       setSubject("");
    }
  } catch (error) {
    console.error("Send Error:", error);
    setStatus("❌ Failed: " + (error.response?.data?.message || "Server Error"));
  } finally {
    setLoading(false);
  }
};

  const percentage =
    progress?.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : 0;



  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-400 rounded-3xl p-4 text-white shadow-lg">
        <h1 className="text-3xl font-semibold">Email Campaign</h1>
        <p className="text-indigo-100 mt-2">
          Create and deliver bulk email campaigns with confidence
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-3xl shadow border p-8 space-y-6">
        {/* RECIPIENTS */}
        <section>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Recipients
          </label>

          <textarea
            className="w-full rounded-xl border p-4 focus:ring-2 focus:ring-indigo-500"
            rows={4}
            placeholder="email@example.com, email2@example.com"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />

          <label className="inline-flex items-center gap-2 mt-3 cursor-pointer text-sm font-medium text-indigo-600">
            📄 Import CSV
            <input type="file" accept=".csv" onChange={handleCSVUpload} hidden />
          </label>
        </section>

        {/* SUBJECT */}
        <section>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Subject
          </label>
          <input
            className="w-full rounded-xl border p-4 focus:ring-2 focus:ring-indigo-500"
            placeholder="Campaign subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </section>

        {/* MESSAGE */}
        {!templateId && (
          <section>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Message
            </label>
            <textarea
              className="w-full rounded-xl border p-4 focus:ring-2 focus:ring-indigo-500"
              rows={6}
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </section>
        )}

        {/* TEMPLATE PREVIEW */}
        {templateId && (
          <section className="bg-gray-50 rounded-2xl p-6 border">
            <h3 className="font-semibold mb-4 text-gray-800">
              👁 Template Preview
            </h3>

            <div className="space-y-4">
              {blocks.map((b, i) => (
                <div key={i}>
                  {b.type === "text" && <p>{b.text}</p>}
                  {b.type === "button" && (
                    <span className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold">
                      {b.text}
                    </span>
                  )}
                  {b.type === "divider" && <hr />}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SCHEDULE TIME */}
        <section>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Schedule time (optional)
          </label>

<div>
  <h3>TEST DATE INPUT</h3>

  <input
    type="datetime-local"
    onChange={(e) => {
      alert("CHANGED: " + e.target.value);
      console.log("FRONTEND scheduledAt:", e.target.value);
      setScheduledAt(e.target.value);
    }}
  />
</div>





          <p className="text-xs text-gray-500 mt-1">
            Leave empty to send immediately
          </p>
        </section>


        {/* SEND */}
        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-semibold transition disabled:opacity-60"
        >
          {loading
            ? "Processing..."
            : scheduledAt
            ? "⏰ Schedule Campaign"
            : "🚀 Send Campaign"}
        </button>

        {/* STATUS */}
        {status && (
          <div className="text-center text-sm font-semibold text-gray-700">
            {status}
          </div>
        )}

        {/* PROGRESS */}
        {progress && (
          <div>
            <div className="flex justify-between text-xs mb-1 text-gray-500">
              <span>Progress</span>
              <span>{percentage}%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
