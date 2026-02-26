import { auth, db } from './firebase-config.js';
import { 
  collection, 
  query, 
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
  
  // Add small delay to ensure DOM is ready
  setTimeout(() => {
    loadLeaderboard('overall');
    loadUserRanking();
  }, 100);
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
  const tbody = document.getElementById('leaderboardBody');
  const podium = document.getElementById('podium');
  
  // Show loading state
  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;">Loading...</td></tr>';
  if (podium) podium.style.display = 'none';
  
  try {
    let attempts = [];
    
    if (type === 'overall') {
      // Get all attempts
      const q = query(
        collection(db, 'attempts'),
        limit(100)
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
      
      // Sort client-side
      attempts = Array.from(userBest.values())
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 20);
    } else {
      // For specific subject - get best per user
      const q = query(
        collection(db, 'attempts'),
        where('subject', '==', type),
        limit(100)
      );
      
      const snapshot = await getDocs(q);
      
      // Get best score per user for this subject
      const userBest = new Map();
      snapshot.forEach(doc => {
        const data = doc.data();
        if (!userBest.has(data.userId) || userBest.get(data.userId).percentage < data.percentage) {
          userBest.set(data.userId, { id: doc.id, ...data });
        }
      });
      
      // Convert to array and sort
      attempts = Array.from(userBest.values())
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 20);
    }
    
    renderLeaderboard(attempts);
    
  } catch (error) {
    console.error('Leaderboard error:', error);
    tbody.innerHTML = 
      `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--danger);">
        Error loading leaderboard. Please try again.<br>
        <small>${error.message}</small>
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
    const isCurrentUser = currentUser && attempt.userId === currentUser.uid;
    
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
    // Get all attempts to calculate actual rank
    const q = query(
      collection(db, 'attempts'),
      limit(100)
    );
    
    const snapshot = await getDocs(q);
    
    // Get best score per user
    const userBest = new Map();
    snapshot.forEach(doc => {
      const data = doc.data();
      if (!userBest.has(data.userId) || userBest.get(data.userId).percentage < data.percentage) {
        userBest.set(data.userId, { ...data });
      }
    });
    
    // Sort to get ranking
    const sortedUsers = Array.from(userBest.entries())
      .sort((a, b) => b[1].percentage - a[1].percentage);
    
    // Find current user rank
    const userIndex = sortedUsers.findIndex(([uid]) => uid === currentUser.uid);
    
    if (userIndex !== -1) {
      const userData = sortedUsers[userIndex][1];
      const userRank = userIndex + 1;
      
      document.getElementById('userRankName').textContent = userData.userName || 'You';
      document.getElementById('userRankScore').textContent = userData.percentage + '%';
      document.getElementById('userRank').textContent = `#${userRank}`;
    } else {
      document.getElementById('userRank').textContent = '#--';
      document.getElementById('userRankScore').textContent = '0%';
    }
    
  } catch (error) {
    console.error('User ranking error:', error);
    document.getElementById('userRank').textContent = '#--';
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

