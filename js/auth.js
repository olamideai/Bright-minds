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
  
  // Clear messages when switching forms
  hideMessage('errorMsg');
  hideMessage('successMsg');
  hideMessage('regErrorMsg');
  hideMessage('regSuccessMsg');
};

window.register = async function() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  
  // Hide previous messages
  hideMessage('regErrorMsg');
  hideMessage('regSuccessMsg');
  
  if (!name || !email || !password || !confirmPassword) {
    showError('regErrorMsg', 'Please fill in all fields');
    return;
  }
  
  if (password.length < 6) {
    showError('regErrorMsg', 'Password must be at least 6 characters');
    return;
  }
  
  // Check if passwords match
  if (password !== confirmPassword) {
    showError('regErrorMsg', 'Passwords do not match');
    return;
  }
  
  // Set loading state
  setButtonLoading('registerBtn', true, 'Creating Account...');
  
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
    
    // Show success message in green
    showSuccess('regSuccessMsg', 'Account created! Redirecting...');
    
    setTimeout(() => window.location.href = 'quiz.html', 1500);
    
  } catch (error) {
    showError('regErrorMsg', error.message);
    setButtonLoading('registerBtn', false, 'Sign Up');
  }
};

window.login = async function() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  // Hide previous messages
  hideMessage('errorMsg');
  hideMessage('successMsg');
  
  if (!email || !password) {
    showError('errorMsg', 'Please fill in all fields');
    return;
  }
  
  // Set loading state
  setButtonLoading('loginBtn', true, 'Signing In...');
  
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'quiz.html';
  } catch (error) {
    showError('errorMsg', 'Invalid email or password');
    setButtonLoading('loginBtn', false, 'Sign In');
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
  el.className = 'error-message';
}

function showSuccess(id, message) {
  const el = document.getElementById(id);
  el.textContent = message;
  el.style.display = 'block';
  el.className = 'success-message';
}

function hideMessage(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = 'none';
  }
}

function setButtonLoading(buttonId, isLoading, text) {
  const btn = document.getElementById(buttonId);
  const btnText = btn.querySelector('.btn-text');
  const btnLoader = btn.querySelector('.btn-loader');
  
  if (isLoading) {
    btn.disabled = true;
    btn.classList.add('btn-loading');
    btnText.textContent = text;
    btnLoader.classList.remove('hidden');
  } else {
    btn.disabled = false;
    btn.classList.remove('btn-loading');
    btnText.textContent = text;
    btnLoader.classList.add('hidden');
  }
}

// Show/Hide Password Functionality
document.addEventListener('DOMContentLoaded', function() {
  const showPasswordCheckboxes = document.querySelectorAll('.show-password');
  
  showPasswordCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const targetId = this.getAttribute('data-target');
      const passwordInput = document.getElementById(targetId);
      
      if (this.checked) {
        passwordInput.type = 'text';
      } else {
        passwordInput.type = 'password';
      }
    });
  });
});

