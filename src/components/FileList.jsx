// src/components/FileList.jsx
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectAllFiles, selectLoading } from "../features/fileSlice";
import FileCard from "./FileCard";

const matchesType = (file, fileType) => {
  if (fileType === "All") return true;
  if (fileType === "PDF") return file.type === "application/pdf";
  if (fileType === "Image") return file.type?.startsWith("image/");
  if (fileType === "Word") return file.type?.includes("word");
  return true;
};

export default function FileList({ filters }) {
  const files = useSelector(selectAllFiles);
  const loading = useSelector(selectLoading);

  const { searchText, category, fileType, sortBy } = filters;

  const filtered = useMemo(() => {
    let result = [...files];

    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      result = result.filter(
        (f) =>
          (f.title || f.name).toLowerCase().includes(q) ||
          f.name.toLowerCase().includes(q)
      );
    }

    if (category !== "All") {
      result = result.filter((f) => f.category === category);
    }

    if (fileType !== "All") {
      result = result.filter((f) => matchesType(f, fileType));
    }

    switch (sortBy) {
      case "oldest":
        result.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
        break;
      case "name":
        result.sort((a, b) => (a.title || a.name).localeCompare(b.title || b.name));
        break;
      case "size":
        result.sort((a, b) => (b.size || 0) - (a.size || 0));
        break;
      default: // newest
        result.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    }

    return result;
  }, [files, searchText, category, fileType, sortBy]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Loading documents...</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📂</div>
        <h3>No documents yet</h3>
        <p>Upload your first document to get started.</p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h3>No results found</h3>
        <p>Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="file-grid">
      {filtered.map((file) => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  );
}
