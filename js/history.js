import { auth, db } from './firebase-config.js';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

let currentUser = null;
let allAttempts = [];

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  currentUser = user;
  loadHistory();
  loadStats();
});

async function loadStats() {
  const userRef = doc(db, 'users', currentUser.uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const data = userSnap.data();
    document.getElementById('totalQuizzes').textContent = data.totalQuizzes || 0;
    document.getElementById('avgScore').textContent = (data.averageScore || 0) + '%';
    document.getElementById('bestScore').textContent = (data.bestScore || 0) + '%';
    
    // Calculate total time
    const attemptsQuery = query(
      collection(db, 'attempts'),
      where('userId', '==', currentUser.uid)
    );
    const snapshot = await getDocs(attemptsQuery);
    let totalSeconds = 0;
    snapshot.forEach(doc => {
      totalSeconds += doc.data().timeUsed || 0;
    });
    const hours = Math.floor(totalSeconds / 3600);
    document.getElementById('totalTime').textContent = hours + 'h';
  }
}

async function loadHistory() {
  try {
    const q = query(
      collection(db, 'attempts'),
      where('userId', '==', currentUser.uid),
      orderBy('submittedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    allAttempts = [];
    
    snapshot.forEach(doc => {
      allAttempts.push({ id: doc.id, ...doc.data() });
    });
    
    renderHistory(allAttempts);
  } catch (error) {
    console.error('History error:', error);
    document.getElementById('historyList').innerHTML = 
      `<p class="empty-state" style="color:var(--danger)">Error loading history: ${error.message}</p>`;
  }
}


function renderHistory(attempts) {
  const list = document.getElementById('historyList');
  
  if (attempts.length === 0) {
    list.innerHTML = '<p class="empty-state">No quiz history yet. Start taking quizzes!</p>';
    return;
  }
  
  list.innerHTML = '';
  attempts.forEach((attempt, index) => {
    const item = document.createElement('div');
    item.className = 'history-item';
    
    const date = attempt.submittedAt?.toDate ? attempt.submittedAt.toDate() : new Date();
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const scoreColor = attempt.percentage >= 60 ? 'var(--success)' : 'var(--danger)';
    
    item.innerHTML = `
      <div class="history-rank">#${index + 1}</div>
      <div class="history-details">
        <h4>${attempt.subjectTitle}</h4>
        <div class="history-meta">${dateStr} at ${timeStr} • ${Math.floor(attempt.timeUsed / 60)}m ${attempt.timeUsed % 60}s</div>
      </div>
      <div class="history-score">
        <div class="score-percentage" style="color: ${scoreColor}">${attempt.percentage}%</div>
        <div class="score-fraction">${attempt.score}/${attempt.totalQuestions}</div>
      </div>
      <div class="history-actions">
        <button class="btn btn-small" onclick="reviewAttempt('${attempt.id}')">Review</button>
      </div>
    `;
    
    list.appendChild(item);
  });
}

window.filterHistory = function() {
  const subject = document.getElementById('subjectFilter').value;
  
  if (subject === 'all') {
    renderHistory(allAttempts);
  } else {
    const filtered = allAttempts.filter(a => a.subject === subject);
    renderHistory(filtered);
  }
};

window.sortHistory = function() {
  const sortType = document.getElementById('sortFilter').value;
  let sorted = [...allAttempts];
  
  switch(sortType) {
    case 'date-asc':
      sorted.sort((a, b) => (a.submittedAt?.toDate() || 0) - (b.submittedAt?.toDate() || 0));
      break;
    case 'score-desc':
      sorted.sort((a, b) => b.percentage - a.percentage);
      break;
    case 'score-asc':
      sorted.sort((a, b) => a.percentage - b.percentage);
      break;
    default: // date-desc
      sorted.sort((a, b) => (b.submittedAt?.toDate() || 0) - (a.submittedAt?.toDate() || 0));
  }
  
  renderHistory(sorted);
};

window.reviewAttempt = async function(attemptId) {
  // Store selected attempt and redirect to quiz review
  localStorage.setItem('reviewAttemptId', attemptId);
  window.location.href = 'quiz.html?review=' + attemptId;
};

window.toggleSidebar = function() {
  document.getElementById('sidebar').classList.toggle('show');
};

window.logout = async function() {
  const { auth } = await import('./firebase-config.js');
  const { signOut } = await import("https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js");
  await signOut(auth);
  window.location.href = 'index.html';
};

