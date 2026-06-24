/* ============================================================
   Internship Management System (IMS)
   Firebase configuration + shared app constants
   ============================================================ */

// ---- YOUR FIREBASE CONFIG (project: internship-system) -----
const firebaseConfig = {
  apiKey: "AIzaSyC0fdN8Wj69zBHrhIUbL8559Gm8UTm2ss8",
  authDomain: "internship-system-d5a96.firebaseapp.com",
  projectId: "internship-system-d5a96",
  storageBucket: "internship-system-d5a96.firebasestorage.app",
  messagingSenderId: "24483843069",
  appId: "1:24483843069:web:8b619ccb9fc740ec19e794"
};
// ------------------------------------------------------------

// Login domain. Users sign in with just a username (e.g. "admin",
// "finance"); the app turns that into <username>@<LOGIN_DOMAIN>.
const LOGIN_DOMAIN = "ims.local";

// Default departments the system seeds with.
// Default departments (hôbes) that do clearance — Kurdish names.
const DEFAULT_DEPARTMENTS = ["کتێبخانە", "دارایی", "گەنجینە", "تۆمارگا"];

// Initialize Firebase (compat SDK, loaded via CDN in the HTML files)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Keep users signed in across page loads.
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(() => {});

// ---- Small shared helpers ----------------------------------
function usernameToEmail(username) {
  const u = String(username || "").trim().toLowerCase();
  return u.includes("@") ? u : `${u}@${LOGIN_DOMAIN}`;
}

function emailToUsername(email) {
  return String(email || "").split("@")[0];
}

async function getUserProfile(uid) {
  const snap = await db.collection("users").doc(uid).get();
  return snap.exists ? { uid, ...snap.data() } : null;
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}
