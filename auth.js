// 1️⃣ Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// 2️⃣ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyACt6Bi_EU5ftxegxzKEplDj6v51ChZ2dE",
  authDomain: "brightmindsquiz-afac6.firebaseapp.com",
  projectId: "brightmindsquiz-afac6",
  storageBucket: "brightmindsquiz-afac6.firebasestorage.app",
  messagingSenderId: "376669933273",
  appId: "1:376669933273:web:7f2f4114e2457436cd78c8"
};

// 3️⃣ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 4️⃣ DOM elements
const authPage = document.getElementById("authPage");
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginError = document.getElementById("loginError");
const signupError = document.getElementById("signupError");

// 5️⃣ Tab switching
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

// 6️⃣ Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      localStorage.setItem("userLoggedIn", "true"); // mark user logged in
      loginError.textContent = "";
      showSection("namePage"); // go to quiz start page
    })
    .catch(error => {
      loginError.textContent = error.message;
    });
});

// 7️⃣ Signup
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const fullName = signupForm.fullName.value;
  const email = signupForm.email.value;
  const password = signupForm.password.value;
  const confirmPassword = signupForm.confirmPassword.value;

  if (password !== confirmPassword) {
    signupError.textContent = "Passwords do not match";
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      updateProfile(userCredential.user, { displayName: fullName });
      localStorage.setItem("userLoggedIn", "true"); // mark user logged in
      signupError.textContent = "";
      showSection("namePage"); // go to quiz start page
    })
    .catch(error => {
      signupError.textContent = error.message;
    });
});

// 8️⃣ Helper to show page
function showSection(id) {
  document.querySelectorAll(".card").forEach(c => c.classList.add("hide"));
  const section = document.getElementById(id);
  if(section) section.classList.remove("hide");
}

// 9️⃣ Show login/signup if user is not logged in
window.addEventListener('DOMContentLoaded', () => {
  const userLoggedIn = localStorage.getItem("userLoggedIn");
  if (!userLoggedIn) {
    Object.values(pages).forEach(p => p.classList.add("hide"));
    authPage.classList.remove("hide");
  }
});
