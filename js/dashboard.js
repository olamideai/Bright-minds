import { auth, db } from './firebase-config.js';
import { collection, query, limit, getDocs, where } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

let currentUser = null;
let currentTab = 'overall';

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  currentUser = user;
  setTimeout(() => {
    loadLeaderboard('overall');
    loadUserRanking();
  }, 100);
});

window.switchTab = function(tab) {
  currentTab = tab;
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
  
  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;">Loading...</td></tr>';
  if (podium) podium.style.display = 'none';
  
  try {
    let attempts = [];
    
    if (type === 'overall') {
      const q = query(collection(db, 'attempts'), limit(100));
      const snapshot = await getDocs(q);
      
      const userBest = new Map();
      snapshot.forEach(doc => {
        const data = doc.data();
        if (!userBest.has(data.userId) || userBest.get(data.userId).percentage < data.percentage) {
          userBest.set(data.userId, { id: doc.id, ...data });
        }
      });
      
      attempts = Array.from(userBest.values());
    } else {
      const q = query(collection(db, 'attempts'), where('subject', '==', type), limit(100));
      const snapshot = await getDocs(q);
      
      const userBest = new Map();
      snapshot.forEach(doc => {
        const data = doc.data();
        if (!userBest.has(data.userId) || userBest.get(data.userId).percentage < data.percentage) {
          userBest.set(data.userId, { id: doc.id, ...data });
        }
      });
      
      attempts = Array.from(userBest.values());
    }
    
    renderLeaderboard(attempts);
  } catch (error) {
    console.error('Leaderboard error:', error);
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--danger);">Error: ${error.message}</td></tr>`;
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
  
  // Sort with tie-breaker: percentage desc, then date asc
  attempts.sort((a, b) => {
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage;
    }
    const dateA = a.submittedAt?.toDate ? a.submittedAt.toDate() : new Date(0);
    const dateB = b.submittedAt?.toDate ? b.submittedAt.toDate() : new Date(0);
    return dateA - dateB;
  });
  
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
  
  // Render table with tie-aware ranking
  let currentRank = 1;
  let previousPercentage = null;
  
  attempts.slice(0, 20).forEach((attempt, index) => {
    const row = document.createElement('tr');
    const isCurrentUser = currentUser && attempt.userId === currentUser.uid;
    
    if (isCurrentUser) row.classList.add('current-user');
    
    if (previousPercentage !== null && attempt.percentage < previousPercentage) {
      currentRank = index + 1;
    }
    previousPercentage = attempt.percentage;
    
    const date = attempt.submittedAt?.toDate ? attempt.submittedAt.toDate() : new Date();
    
    row.innerHTML = `
      <td><span class="rank-number">#${currentRank}</span></td>
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
    const q = query(collection(db, 'attempts'), limit(100));
    const snapshot = await getDocs(q);
    
    const userBest = new Map();
    snapshot.forEach(doc => {
      const data = doc.data();
      if (!userBest.has(data.userId) || userBest.get(data.userId).percentage < data.percentage) {
        userBest.set(data.userId, { ...data });
      }
    });
    
    const sortedUsers = Array.from(userBest.entries())
      .sort((a, b) => b[1].percentage - a[1].percentage);
    
    const userIndex = sortedUsers.findIndex(([uid]) => uid === currentUser.uid);
    
    if (userIndex !== -1) {
      const userData = sortedUsers[userIndex][1];
      document.getElementById('userRankName').textContent = userData.userName || 'You';
      document.getElementById('userRankScore').textContent = userData.percentage + '%';
      document.getElementById('userRank').textContent = `#${userIndex + 1}`;
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
