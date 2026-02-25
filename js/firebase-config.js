import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD3F-UbR6PWNlu5FiELF8C9JvDIjo2Ptog",
  authDomain: "brightminds-quiz.firebaseapp.com",
  projectId: "brightminds-quiz",
  storageBucket: "brightminds-quiz.firebasestorage.app",
  messagingSenderId: "520516877024",
  appId: "1:520516877024:web:3310b7678ba23d1094ae85",
  measurementId: "G-XYF3JQ5HZ3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

