# 🗂️ DocVault — Digital Document Manager

A full-stack web application for uploading, organizing, previewing, and managing digital documents securely in the cloud. Built with **React**, **Redux Toolkit**, and **Firebase**.

---

## 📸 Screenshots

<!-- Dashboard -->
### Dashboard
![Dashboard](src/images/Screenshot%202026-03-17%20101449.png)



<!-- Login -->
### Login / Signup
![Auth](./screenshots/auth.png)

---

## ✅ Features

- 📤 **Upload Documents** — PDF, images, Word files with drag & drop and upload progress bar
- 📁 **Organize by Category** — Personal, Academic, Office, Certificates
- 👁 **File Preview** — In-browser PDF viewer and image lightbox
- ✏️ **Edit Metadata** — Rename title, change category, add description
- 🗑️ **Delete Files** — Remove from Firebase Storage and database instantly
- 🔍 **Search & Filter** — By file name, type, category, and sort order
- 📊 **Stats Dashboard** — Total files, storage used, category count, PDF count
- 🔐 **Authentication** — Sign up / sign in with Firebase Auth
- 👥 **Role-Based Access** — Student, Faculty, Admin roles with different permissions
- ⚡ **Real-Time UI Sync** — Redux state updates instantly on every action

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, JSX |
| State Management | Redux Toolkit, Redux Thunk |
| Cloud Storage | Firebase Storage |
| Database | Firebase Realtime Database |
| Authentication | Firebase Auth |
| Styling | Custom CSS (Syne + DM Sans fonts) |
| Build Tool | Vite |
| Deployment | Vercel / Firebase Hosting |

---

## 📂 Folder Structure

```
docvault/
├── index.html
├── vite.config.js
├── package.json
│
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    │
    ├── app/
    │   └── store.js                  # Redux store config
    │
    ├── firebase/
    │   └── firebaseConfig.js         # Firebase init (Storage, DB, Auth)
    │
    ├── features/
    │   ├── fileSlice.js              # Upload, fetch, delete, update thunks
    │   └── authSlice.js             # Login, signup, logout, role management
    │
    ├── components/
    │   ├── UploadFile.jsx            # Drag-drop upload with progress bar
    │   ├── FileList.jsx              # Filtered & sorted file grid
    │   ├── FileCard.jsx              # Per-file card with edit/delete/preview
    │   ├── SearchFilter.jsx          # Search input + filter dropdowns
    │   └── FilePreviewModal.jsx      # PDF viewer + image lightbox modal
    │
    └── pages/
        ├── AuthPage.jsx              # Login & signup page
        └── Dashboard.jsx            # Main dashboard layout
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/docvault.git
cd docvault
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Go to [Firebase Console](https://console.firebase.google.com), create a project, and enable:
- **Authentication** → Email/Password
- **Storage**
- **Realtime Database**

Then open `src/firebase/firebaseConfig.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### 4. Set Firebase Storage Rules

In Firebase Console → Storage → Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /documents/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Set Firebase Database Rules

In Firebase Console → Realtime Database → Rules:

```json
{
  "rules": {
    "files": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 👥 Role Permissions

| Action | Student | Faculty | Admin |
|---|---|---|---|
| View all files | ✅ | ✅ | ✅ |
| Download files | ✅ | ✅ | ✅ |
| Preview files | ✅ | ✅ | ✅ |
| Upload files | ✅ | ✅ | ✅ |
| Edit file metadata | ❌ | ✅ | ✅ |
| Delete files | ❌ | ❌ | ✅ |

---

## 📦 Redux Modules

| Module | Actions |
|---|---|
| `fileSlice` | `uploadFile`, `fetchFiles`, `deleteFile`, `updateFileMetadata` |
| `authSlice` | `logIn`, `signUp`, `logOut`, `setUser` |

---

## 🌐 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Firebase Hosting

```bash
npm run build
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

When prompted during `firebase init`, set the public directory to `dist` and configure as a single-page app (yes to rewriting all URLs to `index.html`).

---

## 📋 Supported File Types

| Type | Extensions |
|---|---|
| Documents | `.pdf` |
| Images | `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp` |
| Word | `.doc`, `.docx` |

Maximum file size: **20 MB**

---

## 🔥 Use Cases

- 🎓 **Colleges** — Students upload certificates, faculty upload reports, admin verifies documents
- 🏢 **Offices** — Centralized document storage with role-based access
- 🏥 **Organizations** — Secure cloud filing system for reports and records

---

## 📄 License

MIT License. Free to use and modify.

---

> Built with React + Redux Toolkit + Firebase