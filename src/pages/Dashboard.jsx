// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFiles, clearMessages, selectSuccess, selectError, selectAllFiles } from "../features/fileSlice";
import UploadFile from "../components/UploadFile";
import FileList from "../components/FileList";
import SearchFilter from "../components/SearchFilter";

const defaultFilters = {
  searchText: "",
  category: "All",
  fileType: "All",
  sortBy: "newest",
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const [showUpload, setShowUpload] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const successMessage = useSelector(selectSuccess);
  const errorMessage = useSelector(selectError);
  const files = useSelector(selectAllFiles);

  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => dispatch(clearMessages()), 3500);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage, dispatch]);

  // Stats
  const totalSize = files.reduce((acc, f) => acc + (f.size || 0), 0);
  const formatTotalSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };
  const categories = [...new Set(files.map((f) => f.category))].filter(Boolean);

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dash-header">
        <div className="dash-brand">
          <span className="brand-icon">🗂️</span>
          <div>
            <h1>DocVault</h1>
            <p>Digital Document Manager</p>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setShowUpload(true)}>
          + Upload Document
        </button>
      </header>

      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <span className="stat-number">{files.length}</span>
          <span className="stat-label">Total Files</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{formatTotalSize(totalSize)}</span>
          <span className="stat-label">Storage Used</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{categories.length}</span>
          <span className="stat-label">Categories</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {files.filter((f) => f.type === "application/pdf").length}
          </span>
          <span className="stat-label">PDFs</span>
        </div>
      </div>

      {/* Toast notifications */}
      {(successMessage || errorMessage) && (
        <div className={`toast ${successMessage ? "toast-success" : "toast-error"}`}>
          {successMessage || errorMessage}
        </div>
      )}

      {/* Search & Filter */}
      <SearchFilter filters={filters} onChange={setFilters} />

      {/* File list */}
      <FileList filters={filters} />

      {/* Upload Modal */}
      {showUpload && <UploadFile onClose={() => setShowUpload(false)} />}
    </div>
  );
}
