// src/App.jsx
import React from "react";
import { Provider } from "react-redux";
import store from "./app/store";
import Dashboard from "./pages/Dashboard";
import "./App.css";

export default function App() {
  return (
    <Provider store={store}>
      <Dashboard />
    </Provider>
  );
}
