import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { sendEmails, getTemplateById } from "../services/api";

export default function SendEmail() {
  const [params] = useSearchParams();
  const templateId = params.get("template");

  const [scheduledAt, setScheduledAt] = useState("");

  const [emails, setEmails] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [fileName, setFileName] = useState("");

  const [subject, setSubject] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
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
  const cleanEmails = (raw) =>
    Array.from(
      new Set(
        raw
          .split(/[\n,]+/)
          .map((e) => e.trim().toLowerCase())
          .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
      )
    );

    const fileInputRef = useRef(null);

  /* ================= CSV IMPORT ================= */
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const rows = event.target.result.split(/\r?\n/);

      const extracted = rows
        .map((r) => r.split(",")[0])
        .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

      setEmailList(extracted);
      setFileName(file.name);

      // show filename only
      setEmails(`${file.name} (${extracted.length} recipients)`);

      setStatus(`✅ ${extracted.length} recipients imported successfully`);
    };

    reader.readAsText(file);
    if (fileInputRef.current) {
  fileInputRef.current.value = "";
}

  };

  /* ================= SEND ================= */
  const handleSend = async () => {
    if (!emails || !subject) return alert("Recipients and subject required");

    const list =
      emailList.length > 0 ? emailList : cleanEmails(emails);

    if (!list.length) return alert("No valid emails");

    setLoading(true);
    setStatus("⏳ Processing...");

    try {
      const isoDate = scheduledAt
        ? new Date(scheduledAt).toISOString()
        : null;

      const response = await sendEmails({
        emails: list.join("\n"),
        subject,
        message,
        templateId,
        blocks,
        scheduledAt: isoDate,
      });

      setStatus(`✅ ${response.data.message}`);
    } catch (error) {
      setStatus("❌ Failed to send campaign");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-10 space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Email Campaign
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Create and deliver bulk email campaigns easily
          </p>
        </div>

        {/* ================= RECIPIENTS ================= */}
        <section className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">
            Recipients
          </label>

          <textarea
            className="w-full rounded-xl border border-gray-200 p-4 focus:ring-2 focus:ring-indigo-500 resize-none bg-gray-50"
            rows={4}
            value={emails}
            placeholder="Paste emails or import CSV"
            onChange={(e) => setEmails(e.target.value)}
            disabled={fileName !== ""}
          />

          <div className="flex items-center gap-4 text-sm">

            <label className="cursor-pointer text-indigo-600 font-medium hover:underline">
              📄 Import CSV
              <input
                type="file"
                accept=".csv"
                hidden
                ref={fileInputRef}
                onChange={handleCSVUpload}
              />
            </label>

            {fileName && (
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                {fileName}
              </span>
            )}

            {fileName && (
              <button
                onClick={() => {
                  setFileName("");
                  setEmailList([]);
                  setEmails("");
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        </section>

        {/* ================= SUBJECT ================= */}
        <section className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Subject
          </label>

          <input
            className="w-full rounded-xl border border-gray-200 p-4 focus:ring-2 focus:ring-indigo-500"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Campaign subject"
          />
        </section>

        {/* ================= MESSAGE ================= */}
        {!templateId && (
          <section className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Message
            </label>

            <textarea
              rows={6}
              className="w-full rounded-xl border border-gray-200 p-4 focus:ring-2 focus:ring-indigo-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </section>
        )}

        {/* ================= TEMPLATE PREVIEW ================= */}
        {templateId && (
          <section className="bg-gray-50 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-600">
              Template Preview
            </h3>

            {blocks.map((b, i) => (
              <div key={i}>
                {b.type === "text" && <p>{b.text}</p>}
                {b.type === "divider" && <hr />}
                {b.type === "button" && (
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs">
                    {b.text}
                  </button>
                )}
              </div>
            ))}
          </section>
        )}

        {/* ================= SCHEDULE ================= */}
        <section className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Schedule time (optional)
          </label>

          <input
            type="datetime-local"
            className="w-full rounded-xl border border-gray-200 p-4 focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setScheduledAt(e.target.value)}
          />

          <p className="text-xs text-gray-500">
            Leave empty to send immediately
          </p>
        </section>

        {/* ================= BUTTON ================= */}
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

        {/* ================= STATUS ================= */}
        {status && (
          <div className="bg-green-50 text-green-700 rounded-xl px-4 py-3 text-sm text-center font-medium">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
