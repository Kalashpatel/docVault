// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import fileReducer from "../features/fileSlice";

const store = configureStore({
  reducer: {
    files: fileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types (File objects are not serializable)
        ignoredActions: ["files/uploadFile/pending"],
        ignoredPaths: ["files.uploadProgress"],
      },
    }),
});

export default store;