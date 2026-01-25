import { useState } from "react";
import { createTemplate } from "../services/api";

/* =====================================================
   CREATE EMAIL TEMPLATE (PREMIUM UI)
===================================================== */

export default function CreateTemplate() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);

  const [blocks, setBlocks] = useState([
    { type: "text", text: "" },
  ]);

  const handleSaveTemplate = async () => {
    if (!name.trim() || !subject.trim()) {
      alert("Template name and subject are required");
      return;
    }

    setLoading(true);
    try {
      await createTemplate({ name, subject, blocks });
      alert("✅ Template saved successfully");

      setName("");
      setSubject("");
      setBlocks([{ type: "text", text: "" }]);
    } catch {
      alert("❌ Failed to save template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

      {/* ================= HEADER ================= */}
      <div>
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">
          Email templates
        </p>
        <h1 className="text-3xl font-semibold text-gray-900 mt-1">
          Create new template
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl">
          Build reusable email templates using blocks. These templates can be
          used in campaigns and broadcasts.
        </p>
      </div>

      {/* ================= TEMPLATE META ================= */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Template name"
          placeholder="Welcome email, Offer template…"
          value={name}
          onChange={setName}
        />
        <Input
          label="Email subject"
          placeholder="Welcome to our platform 🚀"
          value={subject}
          onChange={setSubject}
        />
      </div>

      {/* ================= BUILDER ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* ===== LEFT: BLOCK EDITOR ===== */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Template builder
            </h2>
            <BlockButtons blocks={blocks} setBlocks={setBlocks} />
          </div>

          <BlockEditor blocks={blocks} setBlocks={setBlocks} />
        </div>

        {/* ===== RIGHT: PREVIEW ===== */}
        <Preview subject={subject} blocks={blocks} />
      </div>

      {/* ================= SAVE ================= */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveTemplate}
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition disabled:opacity-50 shadow-sm"
        >
          {loading ? "Saving…" : "Save template"}
        </button>
      </div>
    </div>
  );
}

/* =====================================================
   SMALL COMPONENTS
===================================================== */

function Input({ label, placeholder, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* ================= ADD BLOCK BUTTONS ================= */

function BlockButtons({ blocks, setBlocks }) {
  return (
    <div className="flex gap-2">
      <AddBtn label="Text" onClick={() =>
        setBlocks([...blocks, { type: "text", text: "" }])
      } />
      <AddBtn label="Button" onClick={() =>
        setBlocks([...blocks, { type: "button", text: "", url: "" }])
      } />
      <AddBtn label="Divider" onClick={() =>
        setBlocks([...blocks, { type: "divider" }])
      } />
    </div>
  );
}

function AddBtn({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200"
    >
      + {label}
    </button>
  );
}

/* ================= BLOCK EDITOR ================= */

function BlockEditor({ blocks, setBlocks }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
        >
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold text-gray-700 uppercase">
              {block.type}
            </p>
            <button
              onClick={() =>
                setBlocks(blocks.filter((_, i) => i !== index))
              }
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>

          {block.type === "text" && (
            <textarea
              className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-indigo-500"
              rows={4}
              placeholder="Write your email content here…"
              value={block.text}
              onChange={(e) => {
                const copy = [...blocks];
                copy[index].text = e.target.value;
                setBlocks(copy);
              }}
            />
          )}

          {block.type === "button" && (
            <div className="space-y-3">
              <input
                className="w-full rounded-xl border border-gray-300 p-3 text-sm"
                placeholder="Button text"
                value={block.text}
                onChange={(e) => {
                  const copy = [...blocks];
                  copy[index].text = e.target.value;
                  setBlocks(copy);
                }}
              />
              <input
                className="w-full rounded-xl border border-gray-300 p-3 text-sm"
                placeholder="https://example.com"
                value={block.url}
                onChange={(e) => {
                  const copy = [...blocks];
                  copy[index].url = e.target.value;
                  setBlocks(copy);
                }}
              />
            </div>
          )}

          {block.type === "divider" && (
            <p className="text-sm text-gray-500">
              A horizontal divider will appear here
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/* ================= PREVIEW ================= */

function Preview({ subject, blocks }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b bg-gray-50">
        <p className="text-xs text-gray-500 uppercase tracking-widest">
          Email preview
        </p>
        <h3 className="text-lg font-semibold text-gray-900 mt-1">
          {subject || "Your subject line will appear here"}
        </h3>
      </div>

      <div className="p-6 space-y-4">
        {blocks.map((block, index) => (
          <div key={index}>
            {block.type === "text" && (
              <p className="text-gray-800 leading-relaxed">
                {block.text || "Your email content will appear here."}
              </p>
            )}
            {block.type === "button" && (
              <a
                href="#"
                className="inline-block mt-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
              >
                {block.text || "Button"}
              </a>
            )}
            {block.type === "divider" && <hr className="my-4" />}
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t bg-gray-50 text-xs text-gray-500">
        You’re receiving this email because you subscribed to Good Mail.
      </div>
    </div>
  );
}
