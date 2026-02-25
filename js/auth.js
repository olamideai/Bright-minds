import { auth, db } from './firebase-config.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

window.toggleForm = function(type) {
  document.getElementById('loginForm').classList.toggle('hidden', type !== 'login');
  document.getElementById('registerForm').classList.toggle('hidden', type !== 'register');
};

window.register = async function() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  
  if (!name || !email || !password) {
    showError('regErrorMsg', 'Please fill in all fields');
    return;
  }
  
  if (password.length < 6) {
    showError('regErrorMsg', 'Password must be at least 6 characters');
    return;
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateProfile(user, { displayName: name });
    
    await setDoc(doc(db, 'users', user.uid), {
      name: name,
      email: email,
      createdAt: serverTimestamp(),
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0
    });
    
    showSuccess('regErrorMsg', 'Account created! Redirecting...');
    setTimeout(() => window.location.href = 'quiz.html', 1500);
    
  } catch (error) {
    showError('regErrorMsg', error.message);
  }
};

window.login = async function() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  if (!email || !password) {
    showError('errorMsg', 'Please fill in all fields');
    return;
  }
  
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'quiz.html';
  } catch (error) {
    showError('errorMsg', 'Invalid email or password');
  }
};

window.logout = async function() {
  try {
    await signOut(auth);
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Logout error:', error);
  }
};

onAuthStateChanged(auth, (user) => {
  if (user && window.location.pathname.includes('index.html')) {
    window.location.href = 'quiz.html';
  }
});

function showError(id, message) {
  const el = document.getElementById(id);
  el.textContent = message;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 5000);
}

function showSuccess(id, message) {
  const el = document.getElementById(id);
  el.className = 'success-message';
  el.textContent = message;
  el.style.display = 'block';
}

