// src/components/FileCard.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteFile, updateFileMetadata } from "../features/fileSlice";

const CATEGORIES = ["Personal", "Academic", "Office", "Certificates"];

const formatSize = (bytes) => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const getFileIcon = (type) => {
  if (!type) return "📄";
  if (type === "application/pdf") return "📕";
  if (type.startsWith("image/")) return "🖼️";
  if (type.includes("word")) return "📘";
  return "📄";
};

const getCategoryColor = (cat) => ({
  Personal: "#6366f1",
  Academic: "#0ea5e9",
  Office: "#f59e0b",
  Certificates: "#10b981",
}[cat] || "#94a3b8");

export default function FileCard({ file }) {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(file.title || file.name);
  const [category, setCategory] = useState(file.category || "Personal");
  const [description, setDescription] = useState(file.description || "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = () => {
    dispatch(updateFileMetadata({ id: file.id, updates: { title, category, description } }));
    setEditing(false);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      dispatch(deleteFile({ id: file.id, storagePath: file.storagePath }));
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="file-card">
      <div className="card-top">
        <span className="file-icon-card">{getFileIcon(file.type)}</span>
        <span
          className="category-badge"
          style={{ backgroundColor: getCategoryColor(editing ? category : file.category) }}
        >
          {editing ? category : (file.category || "—")}
        </span>
      </div>

      {editing ? (
        <div className="edit-fields">
          <input
            className="edit-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="File title"
          />
          <select
            className="edit-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <textarea
            className="edit-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description..."
            rows={2}
          />
          <div className="edit-actions">
            <button className="btn-save" onClick={handleSave}>Save</button>
            <button className="btn-cancel-sm" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="card-title" title={file.title || file.name}>
            {file.title || file.name}
          </h3>
          {file.description && <p className="card-desc">{file.description}</p>}
          <div className="card-meta">
            <span>📅 {formatDate(file.uploadDate)}</span>
            <span>💾 {formatSize(file.size)}</span>
          </div>
        </>
      )}

      <div className="card-actions">
        <a
          href={file.downloadURL}
          target="_blank"
          rel="noreferrer"
          className="btn-download"
          title="Download"
        >
          ⬇ Download
        </a>
        {!editing && (
          <button className="btn-edit" onClick={() => setEditing(true)} title="Edit">
            ✏️
          </button>
        )}
        <button
          className={`btn-delete ${confirmDelete ? "confirm" : ""}`}
          onClick={handleDelete}
          title={confirmDelete ? "Click again to confirm" : "Delete"}
        >
          {confirmDelete ? "Sure?" : "🗑️"}
        </button>
      </div>
    </div>
  );
}
