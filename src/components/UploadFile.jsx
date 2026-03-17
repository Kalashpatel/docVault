// src/components/UploadFile.jsx
import React, { useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../features/fileSlice";
import { selectUploading, selectUploadProgress } from "../features/fileSlice";

const CATEGORIES = ["Personal", "Academic", "Office", "Certificates"];

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export default function UploadFile({ onClose }) {
  const dispatch = useDispatch();
  const uploading = useSelector(selectUploading);
  const uploadProgress = useSelector(selectUploadProgress);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState("Personal");
  const [description, setDescription] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const handleFile = (f) => {
    setError("");
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError("Unsupported file type. Please upload PDF, image, or Word document.");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError("File size exceeds 20 MB limit.");
      return;
    }
    setFile(f);
    if (f.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = () => setDragOver(false);

  const handleSubmit = async () => {
    if (!file) { setError("Please select a file."); return; }
    const result = await dispatch(uploadFile({ file, category, description }));
    if (uploadFile.fulfilled.match(result)) {
      onClose && onClose();
    }
  };

  const getFileIcon = (type) => {
    if (!type) return "📄";
    if (type === "application/pdf") return "📕";
    if (type.startsWith("image/")) return "🖼️";
    if (type.includes("word")) return "📘";
    return "📄";
  };

  return (
    <div className="upload-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="upload-modal">
        <div className="modal-header">
          <h2>Upload Document</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Drop zone */}
        <div
          className={`drop-zone ${dragOver ? "drag-over" : ""} ${file ? "has-file" : ""}`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => !file && inputRef.current.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
            style={{ display: "none" }}
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
          />
          {file ? (
            <div className="file-preview-info">
              {preview ? (
                <img src={preview} alt="preview" className="img-preview" />
              ) : (
                <span className="file-icon-large">{getFileIcon(file.type)}</span>
              )}
              <div className="file-meta">
                <p className="file-name">{file.name}</p>
                <p className="file-size">{formatSize(file.size)}</p>
                <button className="change-btn" onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); inputRef.current.click(); }}>
                  Change File
                </button>
              </div>
            </div>
          ) : (
            <div className="drop-placeholder">
              <div className="drop-icon">☁️</div>
              <p className="drop-title">Drag & drop your file here</p>
              <p className="drop-sub">or click to browse</p>
              <p className="drop-hint">PDF, Images, Word — max 20 MB</p>
            </div>
          )}
        </div>

        {error && <p className="upload-error">{error}</p>}

        {/* Metadata */}
        <div className="form-group">
          <label>Category</label>
          <div className="category-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`pill ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Description <span className="optional">(optional)</span></label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this document..."
            rows={2}
          />
        </div>

        {/* Progress bar */}
        {uploading && (
          <div className="progress-wrap">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
            </div>
            <span className="progress-label">{uploadProgress}%</span>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose} disabled={uploading}>Cancel</button>
          <button className="btn-upload" onClick={handleSubmit} disabled={uploading || !file}>
            {uploading ? `Uploading... ${uploadProgress}%` : "Upload Document"}
          </button>
        </div>
      </div>
    </div>
  );
}
