import { auth, db } from './firebase-config.js';
import { 
  collection, 
  query, 
  orderBy, 
  limit,
  getDocs,
  where,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

let currentUser = null;
let currentTab = 'overall';

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  currentUser = user;
  loadLeaderboard('overall');
  loadUserRanking();
});

window.switchTab = function(tab) {
  currentTab = tab;
  
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.toLowerCase().includes(tab.toLowerCase()) || 
        (tab === 'overall' && btn.textContent === 'Overall')) {
      btn.classList.add('active');
    }
  });
  
  loadLeaderboard(tab);
};

async function loadLeaderboard(type) {
  try {
    let attempts = [];
    
    if (type === 'overall') {
      // Get all attempts, we'll filter for best per user
      const q = query(
        collection(db, 'attempts'),
        orderBy('percentage', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      
      // Get best score per user
      const userBest = new Map();
      snapshot.forEach(doc => {
        const data = doc.data();
        if (!userBest.has(data.userId) || userBest.get(data.userId).percentage < data.percentage) {
          userBest.set(data.userId, { id: doc.id, ...data });
        }
      });
      attempts = Array.from(userBest.values());
    } else {
      // Get attempts for specific subject
      const q = query(
        collection(db, 'attempts'),
        where('subject', '==', type),
        orderBy('percentage', 'desc'),
        limit(20)
      );
      const snapshot = await getDocs(q);
      snapshot.forEach(doc => {
        attempts.push({ id: doc.id, ...doc.data() });
      });
    }
    
    renderLeaderboard(attempts.slice(0, 20));
    
  } catch (error) {
    console.error('Leaderboard error:', error);
    document.getElementById('leaderboardBody').innerHTML = 
      `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--danger);">
        Error loading leaderboard. Try again later.
       </td></tr>`;
  }
}

function renderLeaderboard(attempts) {
  const podium = document.getElementById('podium');
  const tbody = document.getElementById('leaderboardBody');
  
  podium.innerHTML = '';
  tbody.innerHTML = '';
  
  if (attempts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;">No data yet</td></tr>';
    podium.style.display = 'none';
    return;
  }
  
  podium.style.display = 'flex';
  
  // Render podium (top 3)
  const top3 = attempts.slice(0, 3);
  const medals = ['🥇', '🥈', '🥉'];
  const placeNames = ['first', 'second', 'third'];
  
  top3.forEach((attempt, idx) => {
    const place = document.createElement('div');
    place.className = `podium-place ${placeNames[idx]}`;
    place.innerHTML = `
      <div class="podium-rank">${medals[idx]}</div>
      <div class="podium-name">${attempt.userName || 'Anonymous'}</div>
      <div class="podium-score">${attempt.percentage}%</div>
    `;
    podium.appendChild(place);
  });
  
  // Render table
  attempts.forEach((attempt, index) => {
    const row = document.createElement('tr');
    const isCurrentUser = attempt.userId === currentUser?.uid;
    
    if (isCurrentUser) row.classList.add('current-user');
    
    const date = attempt.submittedAt?.toDate ? attempt.submittedAt.toDate() : new Date();
    
    row.innerHTML = `
      <td><span class="rank-number">#${index + 1}</span></td>
      <td>${attempt.userName || 'Anonymous'} ${isCurrentUser ? '(You)' : ''}</td>
      <td>${attempt.subjectTitle || attempt.subject}</td>
      <td>${attempt.score}/${attempt.totalQuestions}</td>
      <td style="color: ${attempt.percentage >= 60 ? 'var(--success)' : 'var(--danger)'}">${attempt.percentage}%</td>
      <td>${date.toLocaleDateString()}</td>
    `;
    
    tbody.appendChild(row);
  });
}

async function loadUserRanking() {
  try {
    // Get user's best attempt
    const userQuery = query(
      collection(db, 'attempts'),
      where('userId', '==', currentUser.uid),
      orderBy('percentage', 'desc'),
      limit(1)
    );
    
    const userSnap = await getDocs(userQuery);
    if (!userSnap.empty) {
      const userBest = userSnap.docs[0].data();
      document.getElementById('userRankName').textContent = userBest.userName || 'You';
      document.getElementById('userRankScore').textContent = userBest.percentage + '%';
      
      // Calculate rank
      const allQuery = query(
        collection(db, 'attempts'),
        orderBy('percentage', 'desc')
      );
      
      const allSnap = await getDocs(allQuery);
      const userScores = new Map();
      
      allSnap.forEach(doc => {
        const data = doc.data();
        if (!userScores.has(data.userId) || userScores.get(data.userId) < data.percentage) {
          userScores.set(data.userId, data.percentage);
        }
      });
      
      const sortedScores = Array.from(userScores.entries()).sort((a, b) => b[1] - a[1]);
      const userRank = sortedScores.findIndex(([uid]) => uid === currentUser.uid) + 1;
      
      document.getElementById('userRank').textContent = userRank > 0 ? `#${userRank}` : '#--';
    } else {
      document.getElementById('userRank').textContent = '#--';
      document.getElementById('userRankScore').textContent = '0%';
    }
    
  } catch (error) {
    console.error('User ranking error:', error);
  }
}

window.toggleSidebar = function() {
  document.getElementById('sidebar').classList.toggle('show');
};

window.logout = async function() {
  const { auth } = await import('./firebase-config.js');
  const { signOut } = await import("https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js");
  await signOut(auth);
  window.location.href = 'index.html';
};
