// src/components/SearchFilter.jsx
import React from "react";

const CATEGORIES = ["All", "Personal", "Academic", "Office", "Certificates"];
const FILE_TYPES = ["All", "PDF", "Image", "Word"];

export default function SearchFilter({ filters, onChange }) {
  const { searchText, category, fileType, sortBy } = filters;

  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="search-filter-bar">
      <div className="search-input-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search by file name..."
          value={searchText}
          onChange={(e) => update("searchText", e.target.value)}
          className="search-input"
        />
        {searchText && (
          <button className="clear-search" onClick={() => update("searchText", "")}>✕</button>
        )}
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <label>Category</label>
          <select value={category} onChange={(e) => update("category", e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label>Type</label>
          <select value={fileType} onChange={(e) => update("fileType", e.target.value)}>
            {FILE_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select value={sortBy} onChange={(e) => update("sortBy", e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name (A–Z)</option>
            <option value="size">File Size</option>
          </select>
        </div>
      </div>
    </div>
  );
}
