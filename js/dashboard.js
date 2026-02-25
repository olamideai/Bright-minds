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
  let q;
  
  if (type === 'overall') {
    // Get best score per user across all subjects
    q = query(
      collection(db, 'attempts'),
      orderBy('percentage', 'desc'),
      limit(50)
    );
  } else {
    q = query(
      collection(db, 'attempts'),
      where('subject', '==', type),
      orderBy('percentage', 'desc'),
      limit(50)
    );
  }
  
  try {
    const snapshot = await getDocs(q);
    const attempts = [];
    const userBestScores = new Map();
    
    snapshot.forEach(doc => {
      const data = doc.data();
      // For overall, only take best attempt per user
      if (type === 'overall') {
        if (!userBestScores.has(data.userId) || userBestScores.get(data.userId).percentage < data.percentage) {
          userBestScores.set(data.userId, { id: doc.id, ...data });
        }
      } else {
        attempts.push({ id: doc.id, ...data });
      }
    });
    
    const finalAttempts = type === 'overall' ? Array.from(userBestScores.values()) : attempts;
    renderLeaderboard(finalAttempts.slice(0, 20)); // Top 20
    
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    document.getElementById('leaderboardBody').innerHTML = '<tr><td colspan="6">Error loading leaderboard</td></tr>';
  }
}

function renderLeaderboard(attempts) {
  const podium = document.getElementById('podium');
  const tbody = document.getElementById('leaderboardBody');
  
  // Clear existing
  podium.innerHTML = '';
  tbody.innerHTML = '';
  
  if (attempts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No data yet</td></tr>';
    return;
  }
  
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
  
  // Render table (all entries)
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
    console.error('Error loading user ranking:', error);
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

