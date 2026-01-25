import { useState } from "react";
import { createTemplate } from "../services/api";

/* =====================================================
   CREATE EMAIL TEMPLATE PAGE
===================================================== */

export default function CreateTemplate() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [preheader, setPreheader] = useState("");

  // 🧩 BLOCK EDITOR STATE
  const [blocks, setBlocks] = useState([
    { type: "text", text: "" },
  ]);

  /* =====================================================
     SAVE TEMPLATE
  ===================================================== */
  const handleSaveTemplate = async () => {
    if (!name.trim() || !subject.trim()) {
      alert("Template name and subject are required");
      return;
    }

    if (blocks.length === 0) {
      alert("Add at least one block");
      return;
    }

    setLoading(true);

    try {
      await createTemplate({
        name,
        subject,
        blocks,
      });

      alert("✅ Template saved successfully");

      // Reset form
      setName("");
      setSubject("");
      setBlocks([{ type: "text", text: "" }]);
    } catch (error) {
      alert("❌ Failed to save template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        🧩 Create Email Template
      </h1>

      {/* TEMPLATE META */}
      <div className="mb-6 space-y-4">
        <input
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="Template name (internal)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="Email subject (shown to users)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        {/* <input
          className="w-full border p-3 rounded-lg"
          placeholder="Preheader text (optional)"
          value={preheader}
          onChange={(e) => setPreheader(e.target.value)}
        /> */}

      </div>

      {/* ADD BLOCK BUTTONS */}
      <BlockButtons blocks={blocks} setBlocks={setBlocks} />

      {/* BLOCK EDITOR */}
      <BlockEditor blocks={blocks} setBlocks={setBlocks} />

      {/* PREVIEW */}
      <Preview subject={subject} blocks={blocks} />


      {/* SAVE BUTTON */}
      <div className="mt-8">
        <button
          onClick={handleSaveTemplate}
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "💾 Save Template"}
        </button>
      </div>
    </div>
  );
}

/* =====================================================
   ADD BLOCK BUTTONS
===================================================== */

function BlockButtons({ blocks, setBlocks }) {
  return (
    <div className="flex gap-3 mb-6">
      <AddButton
        label="Text"
        onClick={() =>
          setBlocks([...blocks, { type: "text", text: "" }])
        }
      />

      <AddButton
        label="Button"
        onClick={() =>
          setBlocks([...blocks, { type: "button", text: "", url: "" }])
        }
      />

      <AddButton
        label="Divider"
        onClick={() =>
          setBlocks([...blocks, { type: "divider" }])
        }
      />
    </div>
  );
}

function AddButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="border px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
    >
      ➕ {label}
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
          className="border rounded-lg p-4 bg-white"
        >
          <div className="flex justify-between mb-2">
            <p className="font-semibold">
              {block.type.toUpperCase()} BLOCK
            </p>

            <button
              onClick={() =>
                setBlocks(blocks.filter((_, i) => i !== index))
              }
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>

          {block.type === "text" && (
            <textarea
              className="w-full border p-2 rounded"
              placeholder="Enter text..."
              value={block.text}
              onChange={(e) => {
                const copy = [...blocks];
                copy[index].text = e.target.value;
                setBlocks(copy);
              }}
            />
          )}

          {block.type === "button" && (
            <>
              <input
                className="w-full border p-2 rounded mb-2"
                placeholder="Button text"
                value={block.text}
                onChange={(e) => {
                  const copy = [...blocks];
                  copy[index].text = e.target.value;
                  setBlocks(copy);
                }}
              />

              <input
                className="w-full border p-2 rounded"
                placeholder="Button URL"
                value={block.url}
                onChange={(e) => {
                  const copy = [...blocks];
                  copy[index].url = e.target.value;
                  setBlocks(copy);
                }}
              />
            </>
          )}

          {block.type === "divider" && (
            <p className="text-gray-500 text-sm">
              Horizontal divider
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/* =====================================================
   EMAIL PREVIEW
===================================================== */

function Preview({ subject, blocks }) {
  return (
    <div className="mt-10">
      <h2 className="font-semibold mb-3 flex items-center gap-2">
        👁 Email Preview
      </h2>

      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        
        {/* SUBJECT HEADER */}
        <div className="bg-gray-100 px-5 py-3 border-b">
          <p className="text-xs text-gray-500">Subject</p>
          <h3 className="text-lg font-semibold text-gray-900">
            {subject || "Your email subject will appear here"}
          </h3>
        </div>

        {/* EMAIL BODY */}
        <div className="p-6 space-y-4">
          {blocks.map((block, index) => (
            <div key={index}>
              {block.type === "text" && (
                <p className="text-gray-800 leading-relaxed">
                  {block.text || "Your text goes here"}
                </p>
              )}

              {block.type === "button" && (
                <a
                  href={block.url || "#"}
                  className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium"
                >
                  {block.text || "Button"}
                </a>
              )}

              {block.type === "divider" && (
                <hr className="my-4" />
              )}
            </div>
          ))}
        </div>

        {/* FOOTER (Preview only) */}
        <div className="bg-gray-50 px-6 py-4 border-t text-xs text-gray-500">
          You’re receiving this email because you subscribed to ThePDFZone.
        </div>
      </div>
    </div>
  );
}

