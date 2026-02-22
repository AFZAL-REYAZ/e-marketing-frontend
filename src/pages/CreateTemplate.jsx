import { useState } from "react";
import { createTemplate } from "../services/api";

/* =====================================================
   CREATE EMAIL TEMPLATE (CLEAN MODERN UI)
===================================================== */

export default function CreateTemplate() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);

  const [blocks, setBlocks] = useState([{ type: "text", text: "" }]);

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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ================= HEADER ================= */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Create Email Template
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Build reusable templates using blocks and preview instantly
          </p>
        </div>

        {/* ================= META CARD ================= */}
        <div className="bg-white rounded-2xl shadow-sm p-6 grid md:grid-cols-2 gap-6">
          <Input
            label="Template name"
            placeholder="Welcome email, Offer template…"
            value={name}
            onChange={setName}
          />
          <Input
            label="Subject"
            placeholder="Welcome to our platform 🚀"
            value={subject}
            onChange={setSubject}
          />
        </div>

        {/* ================= BUILDER ================= */}
        <div className="grid xl:grid-cols-2 gap-8">

          {/* ===== LEFT SIDE ===== */}
          <div className="space-y-6">

            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">
                Builder
              </h2>
              <BlockButtons blocks={blocks} setBlocks={setBlocks} />
            </div>

            <BlockEditor blocks={blocks} setBlocks={setBlocks} />

            {/* SAVE BUTTON */}
            <button
              onClick={handleSaveTemplate}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Template"}
            </button>
          </div>

          {/* ===== RIGHT SIDE PREVIEW ===== */}
          <Preview subject={subject} blocks={blocks} />
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   INPUT
===================================================== */

function Input({ label, placeholder, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-2">
        {label}
      </label>

      <input
        className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-indigo-500"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* =====================================================
   BLOCK BUTTONS
===================================================== */

function BlockButtons({ blocks, setBlocks }) {
  const add = (block) => setBlocks([...blocks, block]);

  return (
    <div className="flex gap-2 text-sm">
      <SmallBtn label="Text" onClick={() => add({ type: "text", text: "" })} />
      <SmallBtn
        label="Button"
        onClick={() => add({ type: "button", text: "", url: "" })}
      />
      <SmallBtn label="Divider" onClick={() => add({ type: "divider" })} />
    </div>
  );
}

function SmallBtn({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
    >
      + {label}
    </button>
  );
}

/* =====================================================
   BLOCK EDITOR
===================================================== */

function BlockEditor({ blocks, setBlocks }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs uppercase font-semibold text-gray-500">
              {block.type}
            </span>

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
              rows={4}
              className="w-full rounded-lg border border-gray-200 p-3 focus:ring-2 focus:ring-indigo-500"
              value={block.text}
              onChange={(e) => {
                const copy = [...blocks];
                copy[index].text = e.target.value;
                setBlocks(copy);
              }}
            />
          )}

          {block.type === "button" && (
            <div className="space-y-2">
              <input
                placeholder="Button text"
                className="w-full rounded-lg border border-gray-200 p-3"
                value={block.text}
                onChange={(e) => {
                  const copy = [...blocks];
                  copy[index].text = e.target.value;
                  setBlocks(copy);
                }}
              />
              <input
                placeholder="https://example.com"
                className="w-full rounded-lg border border-gray-200 p-3"
                value={block.url}
                onChange={(e) => {
                  const copy = [...blocks];
                  copy[index].url = e.target.value;
                  setBlocks(copy);
                }}
              />
            </div>
          )}

          {block.type === "divider" && <hr />}
        </div>
      ))}
    </div>
  );
}

/* =====================================================
   PREVIEW
===================================================== */

function Preview({ subject, blocks }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 sticky top-6">
      <div className="px-6 py-4 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-800">
          {subject || "Subject preview"}
        </h3>
      </div>

      <div className="p-6 space-y-4 text-sm">
        {blocks.map((block, index) => (
          <div key={index}>
            {block.type === "text" && (
              <p>{block.text || "Text content here..."}</p>
            )}

            {block.type === "button" && (
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs">
                {block.text || "Button"}
              </button>
            )}

            {block.type === "divider" && <hr />}
          </div>
        ))}
      </div>
    </div>
  );
}
