// auth.js
window.addEventListener('DOMContentLoaded', () => {

  // ----------------------------
  // 1️⃣ Firebase modules
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

  // Pages from quiz app
  const pages = {
    home: document.getElementById("home"),
    name: document.getElementById("namePage"),
    subject: document.getElementById("subjectPage"),
    quiz: document.getElementById("quizPage"),
    result: document.getElementById("resultPage"),
    review: document.getElementById("reviewPage")
  };

  // ----------------------------
  // 4️⃣ Tab switch
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
  // 5️⃣ Login
  // ----------------------------
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        localStorage.setItem("userLoggedIn", "true"); // mark user logged in
        loginError.textContent = "";
        showSection("namePage"); // show quiz start page
      })
      .catch(error => {
        loginError.textContent = error.message;
      });
  });

  // ----------------------------
  // 6️⃣ Signup
  // ----------------------------
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
        showSection("namePage"); // go to quiz start
      })
      .catch(error => {
        signupError.textContent = error.message;
      });
  });

  // ----------------------------
  // 7️⃣ Helper to show page
  // ----------------------------
  function showSection(id) {
    // Hide all quiz pages
    Object.values(pages).forEach(p => p.classList.add("hide"));
    // Hide auth page if navigating away
    if (id !== "authPage") authPage.classList.add("hide");
    // Show the requested page
    const section = document.getElementById(id);
    if (section) section.classList.remove("hide");
  }

  // ----------------------------
  // 8️⃣ Show login if user not logged in
  // ----------------------------
  const userLoggedIn = localStorage.getItem("userLoggedIn");
  if (!userLoggedIn) {
    Object.values(pages).forEach(p => p.classList.add("hide"));
    authPage.classList.remove("hide");
  }

});
