// src/features/fileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  ref as dbRef,
  set,
  get,
  remove,
  update,
  child,
} from "firebase/database";
import { storage, database } from "../firebase/firebaseConfig";
import { v4 as uuidv4 } from "uuid";

// ─── THUNKS ──────────────────────────────────────────────────────────────────

// Upload a file to Firebase Storage and save metadata to Realtime DB
export const uploadFile = createAsyncThunk(
  "files/uploadFile",
  async ({ file, category = "Personal", description = "" }, { rejectWithValue, dispatch }) => {
    try {
      const fileId = uuidv4();
      const storageRef = ref(storage, `documents/${fileId}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            dispatch(setUploadProgress(progress));
          },
          (error) => reject(rejectWithValue(error.message)),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const metadata = {
              id: fileId,
              name: file.name,
              title: file.name,
              type: file.type,
              size: file.size,
              category,
              description,
              uploadDate: new Date().toISOString(),
              downloadURL,
              storagePath: `documents/${fileId}_${file.name}`,
            };
            await set(dbRef(database, `files/${fileId}`), metadata);
            resolve(metadata);
          }
        );
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch all file metadata from Firebase Realtime Database
export const fetchFiles = createAsyncThunk(
  "files/fetchFiles",
  async (_, { rejectWithValue }) => {
    try {
      const snapshot = await get(child(dbRef(database), "files"));
      if (snapshot.exists()) {
        return Object.values(snapshot.val());
      }
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a file from Firebase Storage and its metadata from DB
export const deleteFile = createAsyncThunk(
  "files/deleteFile",
  async ({ id, storagePath }, { rejectWithValue }) => {
    try {
      const fileRef = ref(storage, storagePath);
      await deleteObject(fileRef);
      await remove(dbRef(database, `files/${id}`));
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update file metadata (title, category, description)
export const updateFileMetadata = createAsyncThunk(
  "files/updateFileMetadata",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      await update(dbRef(database, `files/${id}`), updates);
      return { id, updates };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ─── SLICE ────────────────────────────────────────────────────────────────────

const fileSlice = createSlice({
  name: "files",
  initialState: {
    items: [],
    loading: false,
    uploading: false,
    uploadProgress: 0,
    error: null,
    successMessage: null,
  },
  reducers: {
    setUploadProgress(state, action) {
      state.uploadProgress = action.payload;
    },
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Upload
    builder
      .addCase(uploadFile.pending, (state) => {
        state.uploading = true;
        state.uploadProgress = 0;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 100;
        state.items.unshift(action.payload);
        state.successMessage = `"${action.payload.title}" uploaded successfully!`;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload || "Upload failed.";
      });

    // Fetch
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.sort(
          (a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)
        );
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch files.";
      });

    // Delete
    builder
      .addCase(deleteFile.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.items = state.items.filter((f) => f.id !== action.payload);
        state.successMessage = "File deleted successfully.";
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.error = action.payload || "Delete failed.";
      });

    // Update metadata
    builder
      .addCase(updateFileMetadata.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        const file = state.items.find((f) => f.id === id);
        if (file) Object.assign(file, updates);
        state.successMessage = "File details updated.";
      })
      .addCase(updateFileMetadata.rejected, (state, action) => {
        state.error = action.payload || "Update failed.";
      });
  },
});

export const { setUploadProgress, clearMessages } = fileSlice.actions;

// ─── SELECTORS ────────────────────────────────────────────────────────────────
export const selectAllFiles = (state) => state.files.items;
export const selectLoading = (state) => state.files.loading;
export const selectUploading = (state) => state.files.uploading;
export const selectUploadProgress = (state) => state.files.uploadProgress;
export const selectError = (state) => state.files.error;
export const selectSuccess = (state) => state.files.successMessage;

export default fileSlice.reducer;