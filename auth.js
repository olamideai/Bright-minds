// ----------------------------
// 1️⃣ Import Firebase modules
// ----------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// ----------------------------
// 2️⃣ Firebase config
// ----------------------------
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ----------------------------
// 3️⃣ DOM elements
// ----------------------------
const authPage = document.getElementById("authPage");
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginError = document.getElementById("loginError");
const signupError = document.getElementById("signupError");

// ----------------------------
// 4️⃣ Show auth page if user not logged in
// ----------------------------
window.addEventListener('DOMContentLoaded', () => {
  const userLoggedIn = localStorage.getItem("userLoggedIn");
  if (!userLoggedIn) {
    // hide all other pages
    document.querySelectorAll(".card").forEach(c => c.classList.add("hide"));
    authPage.classList.remove("hide");
  }
});

// ----------------------------
// 5️⃣ Tab switch
// ----------------------------
loginTab.addEventListener("click", () => {
  loginTab.classList.add("active");
  signupTab.classList.remove("active");
  loginForm.classList.remove("hide");
  signupForm.classList.add("hide");
});

signupTab.addEventListener("click", () => {
  signupTab.classList.add("active");
  loginTab.classList.remove("active");
  signupForm.classList.remove("hide");
  loginForm.classList.add("hide");
});

// ----------------------------
// 6️⃣ Login
// ----------------------------
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      localStorage.setItem("userLoggedIn", "true"); // mark user logged in
      loginError.textContent = "";
      showSection("home"); // go to home/quiz start page
    })
    .catch(error => {
      loginError.textContent = error.message;
    });
});

// ----------------------------
// 7️⃣ Signup
// ----------------------------
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const fullName = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("signupConfirm").value;

  if (password !== confirmPassword) {
    signupError.textContent = "Passwords do not match";
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      updateProfile(userCredential.user, { displayName: fullName });
      localStorage.setItem("userLoggedIn", "true"); // mark user logged in
      signupError.textContent = "";
      showSection("home"); // go to home/quiz start page
    })
    .catch(error => {
      signupError.textContent = error.message;
    });
});

// ----------------------------
// 8️⃣ Helper to show page
// ----------------------------
function showSection(id) {
  document.querySelectorAll(".card").forEach(c => c.classList.add("hide"));
  const section = document.getElementById(id);
  if(section) section.classList.remove("hide");
}
