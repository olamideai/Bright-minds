// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// 🔹 Firebase Config — replace with your own
const firebaseConfig = {
  apiKey: "AIzaSyACt6Bi_EU5ftxegxzKEplDj6v51ChZ2dE",
  authDomain: "brightmindsquiz-afac6.firebaseapp.com",
  projectId: "brightmindsquiz-afac6",
  storageBucket: "brightmindsquiz-afac6.firebasestorage.app",
  messagingSenderId: "376669933273",
  appId: "1:376669933273:web:7f2f4114e2457436cd78c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ----------------------------
// Helper: Show only one section
function showSection(sectionId) {
  document.querySelectorAll('.card').forEach(s => {
    s.classList.remove('show');
    s.classList.add('hide');
  });
  const section = document.getElementById(sectionId);
  section.classList.add('show');
  section.classList.remove('hide');
}

// ----------------------------
// Tabs: Login / Signup
const showLoginBtn = document.getElementById('showLogin');
const showSignupBtn = document.getElementById('showSignup');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

showLoginBtn.addEventListener('click', () => {
  loginForm.classList.remove('hide');
  loginForm.classList.add('show');
  signupForm.classList.remove('show');
  signupForm.classList.add('hide');
  showLoginBtn.classList.add('active');
  showSignupBtn.classList.remove('active');
});

showSignupBtn.addEventListener('click', () => {
  signupForm.classList.remove('hide');
  signupForm.classList.add('show');
  loginForm.classList.remove('show');
  loginForm.classList.add('hide');
  showSignupBtn.classList.add('active');
  showLoginBtn.classList.remove('active');
});

// ----------------------------
// LOGIN
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');

loginBtn.addEventListener('click', () => {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      loginError.textContent = '';
      showSection('namePage'); // show homepage after login
    })
    .catch(error => {
      loginError.textContent = error.message;
    });
});

// ----------------------------
// SIGNUP
const signupBtn = document.getElementById('signupBtn');
const signupError = document.getElementById('signupError');

signupBtn.addEventListener('click', () => {
  const fullName = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;

  if(password !== confirmPassword){
    signupError.textContent = "Passwords do not match";
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      updateProfile(userCredential.user, { displayName: fullName });
      signupError.textContent = '';
      showSection('namePage'); // show homepage after signup
    })
    .catch(error => {
      signupError.textContent = error.message;
    });
});
