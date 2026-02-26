import { auth, db } from './firebase-config.js';
import { 
  collection, 
  query, 
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  limit,
  where,
  updateDoc,
  addDoc,
  serverTimestamp,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

let currentUser = null;
let allUsers = [];
let allAttempts = [];
let selectedUsers = new Set();
let unsubscribeLiveFeed = null;

// Check if user is admin
auth.onAuthStateChanged(async user => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  currentUser = user;
  
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists() || !userSnap.data().isAdmin) {
    alert('Access denied. Admins only.');
    window.location.href = 'quiz.html';
    return;
  }
  
  loadAllData();
  setupLiveFeed();
});

async function loadAllData() {
  await Promise.all([
    loadStatistics(),
    loadUsers(),
    loadRecentAttempts(),
    loadSubjectStats()
  ]);
}

// ==================== STATISTICS ====================
async function loadStatistics() {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const attemptsSnapshot = await getDocs(collection(db, 'attempts'));
    
    let highestScore = 0;
    let totalPercentage = 0;
    let count = 0;
    
    attemptsSnapshot.forEach(doc => {
      const data = doc.data();
      const percentage = Number(data.percentage) || 0;
      if (percentage > highestScore) highestScore = percentage;
      totalPercentage += percentage;
      count++;
    });
    
    const averageScore = count > 0 ? Math.round(totalPercentage / count) : 0;
    
    document.getElementById('totalUsers').textContent = usersSnapshot.size;
    document.getElementById('totalAttempts').textContent = attemptsSnapshot.size;
    document.getElementById('highestScore').textContent = highestScore + '%';
    document.getElementById('averageScore').textContent = averageScore + '%';
    
  } catch (error) {
    console.error('Statistics error:', error);
  }
}

// ==================== USERS ====================
async function loadUsers() {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const attemptsSnapshot = await getDocs(collection(db, 'attempts'));
    
    const userStats = new Map();
    
    attemptsSnapshot.forEach(doc => {
      const data = doc.data();
      const current = userStats.get(data.userId) || { bestScore: 0, count: 0, total: 0 };
      const percentage = Number(data.percentage) || 0;
      
      userStats.set(data.userId, {
        bestScore: Math.max(current.bestScore, percentage),
        count: current.count + 1,
        total: current.total + percentage
      });
    });
    
    allUsers = [];
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      const stats = userStats.get(doc.id) || { bestScore: 0, count: 0, total: 0 };
      
      allUsers.push({
        id: doc.id,
        name: userData.name || 'Anonymous',
        email: userData.email || 'No email',
        bestScore: stats.bestScore,
        quizCount: stats.count,
        averageScore: stats.count > 0 ? Math.round(stats.total / stats.count) : 0,
        createdAt: userData.createdAt
      });
    });
    
    allUsers.sort((a, b) => b.bestScore - a.bestScore);
    renderUsersTable(allUsers);
    detectCheating();
    
  } catch (error) {
    console.error('Load users error:', error);
  }
}

function renderUsersTable(users) {
  const tbody = document.getElementById('usersTableBody');
  
  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;">No users found</td></tr>';
    return;
  }
  
  tbody.innerHTML = '';
  users.forEach((user, index) => {
    const row = document.createElement('tr');
    const isCurrentUser = user.id === currentUser.uid;
    
    row.innerHTML = `
      <td><input type="checkbox" onchange="toggleSelectUser('${user.id}')" ${selectedUsers.has(user.id) ? 'checked' : ''}></td>
      <td>#${index + 1}</td>
      <td>${user.name} ${isCurrentUser ? '(You)' : ''}</td>
      <td>${user.email}</td>
      <td style="color: ${user.bestScore >= 60 ? 'var(--success)' : 'var(--danger)'}">${user.bestScore}%</td>
      <td>${user.quizCount}</td>
      <td>
        <button class="btn btn-small" onclick="viewUserDetails('${user.id}')">View</button>
        ${isCurrentUser ? 
          '<span style="color:var(--neon);font-weight:600;">Admin</span>' : 
          `<button class="btn btn-small btn-danger" onclick="deleteUser('${user.id}', '${user.name}')">Delete</button>`
        }
      </td>
    `;
    tbody.appendChild(row);
  });
}

window.toggleSelectUser = function(userId) {
  if (selectedUsers.has(userId)) {
    selectedUsers.delete(userId);
  } else {
    selectedUsers.add(userId);
  }
};

window.deleteSelectedUsers = async function() {
  if (selectedUsers.size === 0) {
    alert('No users selected!');
    return;
  }
  if (!confirm(`Delete ${selectedUsers.size} selected users?`)) return;
  
  for (const userId of selectedUsers) {
    if (userId !== currentUser.uid) {
      await deleteUser(userId, 'Selected User', false);
    }
  }
  selectedUsers.clear();
  loadAllData();
};

window.viewUserDetails = async function(userId) {
  const user = allUsers.find(u => u.id === userId);
  const attemptsQuery = query(collection(db, 'attempts'), where('userId', '==', userId));
  const snapshot = await getDocs(attemptsQuery);
  
  let attempts = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    const date = data.submittedAt?.toDate ? data.submittedAt.toDate().toLocaleString() : 'Unknown';
    attempts.push(`${data.subjectTitle || data.subject}: ${data.percentage}% (${date})`);
  });
  
  const details = `
    Name: ${user.name}
    Email: ${user.email}
    Best Score: ${user.bestScore}%
    Total Quizzes: ${user.quizCount}
    Average Score: ${user.averageScore}%
    
    Quiz History:
    ${attempts.join('\n') || 'No attempts'}
  `;
  
  alert(details);
};

// ==================== ATTEMPTS ====================
async function loadRecentAttempts() {
  try {
    const q = query(collection(db, 'attempts'), limit(50));
    const snapshot = await getDocs(q);
    
    allAttempts = [];
    snapshot.forEach(doc => {
      allAttempts.push({ id: doc.id, ...doc.data() });
    });
    
    renderAttempts(allAttempts.slice(0, 20));
    
  } catch (error) {
    console.error('Recent attempts error:', error);
  }
}

function renderAttempts(attempts) {
  const list = document.getElementById('recentAttemptsList');
  
  if (attempts.length === 0) {
    list.innerHTML = '<p class="empty-state">No attempts found</p>';
    return;
  }
  
  attempts.sort((a, b) => {
    const dateA = a.submittedAt?.toDate ? a.submittedAt.toDate() : new Date(0);
    const dateB = b.submittedAt?.toDate ? b.submittedAt.toDate() : new Date(0);
    return dateB - dateA;
  });
  
  list.innerHTML = '';
  attempts.slice(0, 20).forEach(attempt => {
    const item = document.createElement('div');
    item.className = 'attempt-item';
    const date = attempt.submittedAt?.toDate ? attempt.submittedAt.toDate().toLocaleString() : 'Unknown';
    
    item.innerHTML = `
      <div class="attempt-info">
        <strong>${attempt.userName || 'Anonymous'}</strong>
        <span>${attempt.subjectTitle || attempt.subject}</span>
        <small>${date}</small>
      </div>
      <div class="attempt-score" style="color: ${attempt.percentage >= 60 ? 'var(--success)' : 'var(--danger)'}">
        ${attempt.percentage}%
      </div>
      <button class="btn btn-small btn-danger" onclick="deleteAttempt('${attempt.id}')">Delete</button>
    `;
    list.appendChild(item);
  });
}

function setupLiveFeed() {
  const q = query(collection(db, 'attempts'), limit(20));
  
  if (unsubscribeLiveFeed) unsubscribeLiveFeed();
  
  unsubscribeLiveFeed = onSnapshot(q, (snapshot) => {
    const attempts = [];
    snapshot.forEach(doc => attempts.push({ id: doc.id, ...doc.data() }));
    renderAttempts(attempts);
  });
}

// ==================== SUBJECT STATS ====================
async function loadSubjectStats() {
  try {
    const snapshot = await getDocs(collection(db, 'attempts'));
    const subjectStats = {};
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const sub = data.subjectTitle || data.subject || 'Unknown';
      if (!subjectStats[sub]) {
        subjectStats[sub] = { attempts: 0, total: 0, highest: 0 };
      }
      const pct = Number(data.percentage) || 0;
      subjectStats[sub].attempts++;
      subjectStats[sub].total += pct;
      if (pct > subjectStats[sub].highest) subjectStats[sub].highest = pct;
    });
    
    Object.keys(subjectStats).forEach(sub => {
      subjectStats[sub].average = Math.round(subjectStats[sub].total / subjectStats[sub].attempts);
    });
    
    renderSubjectStats(subjectStats);
    
  } catch (error) {
    console.error('Subject stats error:', error);
  }
}

function renderSubjectStats(stats) {
  const container = document.getElementById('subjectStats');
  if (!container) return;
  
  container.innerHTML = '';
  Object.entries(stats).forEach(([subject, data]) => {
    const div = document.createElement('div');
    div.className = 'stat-card';
    div.innerHTML = `
      <h4>${subject}</h4>
      <p>Attempts: ${data.attempts}</p>
      <p>Avg: ${data.average}%</p>
      <p>High: ${data.highest}%</p>
    `;
    container.appendChild(div);
  });
}

// ==================== DATE FILTER ====================
window.filterByDate = function() {
  const startInput = document.getElementById('startDate').value;
  const endInput = document.getElementById('endDate').value;
  
  if (!startInput || !endInput) {
    renderAttempts(allAttempts);
    return;
  }
  
  const start = new Date(startInput);
  const end = new Date(endInput);
  end.setHours(23, 59, 59);
  
  const filtered = allAttempts.filter(attempt => {
    const date = attempt.submittedAt?.toDate ? attempt.submittedAt.toDate() : null;
    return date && date >= start && date <= end;
  });
  
  renderAttempts(filtered);
};

window.resetDateFilter = function() {
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
  renderAttempts(allAttempts);
};

// ==================== EXPORT ====================
window.exportData = function() {
  let csv = 'Rank,Name,Email,Best Score,Average Score,Quizzes Taken\n';
  allUsers.forEach((user, index) => {
    csv += `${index + 1},"${user.name}","${user.email}",${user.bestScore}%,${user.averageScore}%,${user.quizCount}\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `brightminds_users_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

// ==================== CHEATING DETECTION ====================
function detectCheating() {
  const suspicious = [];
  
  allAttempts.forEach(attempt => {
    const timeUsed = attempt.timeUsed || 0;
    const percentage = attempt.percentage || 0;
    const totalQuestions = attempt.totalQuestions || 1;
    const timePerQuestion = timeUsed / totalQuestions;
    
    // Flag: 100% score with less than 5 seconds per question
    if (percentage === 100 && timePerQuestion < 5) {
      suspicious.push({
        user: attempt.userName,
        subject: attempt.subjectTitle || attempt.subject,
        reason: `Perfect score in ${Math.floor(timeUsed/60)}m ${timeUsed%60}s (${timePerQuestion.toFixed(1)}s/question)`,
        timeUsed: timeUsed
      });
    }
  });
  
  const alertDiv = document.getElementById('cheatingAlerts');
  if (alertDiv && suspicious.length > 0) {
    alertDiv.innerHTML = `
      <h3>⚠️ Suspicious Activity (${suspicious.length})</h3>
      ${suspicious.map(s => `<p><strong>${s.user}</strong> - ${s.subject}: ${s.reason}</p>`).join('')}
    `;
  }
}

// ==================== ANNOUNCEMENTS ====================
window.sendAnnouncement = async function() {
  const message = prompt('Enter announcement message for all users:');
  if (!message || message.trim() === '') return;
  
  try {
    await addDoc(collection(db, 'announcements'), {
      message: message.trim(),
      sentBy: currentUser.uid,
      sentByName: currentUser.displayName || 'Admin',
      sentAt: serverTimestamp(),
      readBy: []
    });
    
    alert('✅ Announcement sent to all users!');
  } catch (error) {
    alert('❌ Error: ' + error.message);
  }
};

// ==================== BACKUP & RESTORE ====================
window.backupData = async function() {
  try {
    const backup = {
      users: allUsers,
      attempts: allAttempts,
      timestamp: serverTimestamp(),
      createdBy: currentUser.uid
    };
    
    await addDoc(collection(db, 'backups'), backup);
    alert('✅ Backup created successfully!');
    loadBackups();
    
  } catch (error) {
    alert('❌ Backup failed: ' + error.message);
  }
};

window.loadBackups = async function() {
  const snapshot = await getDocs(collection(db, 'backups'));
  const list = document.getElementById('backupsList');
  if (!list) return;
  
  list.innerHTML = '';
  snapshot.forEach(doc => {
    const data = doc.data();
    const date = data.timestamp?.toDate ? data.timestamp.toDate().toLocaleString() : 'Unknown';
    
    const item = document.createElement('div');
    item.innerHTML = `
      <span>Backup: ${date}</span>
      <button onclick="restoreData('${doc.id}')">Restore</button>
      <button onclick="deleteBackup('${doc.id}')">Delete</button>
    `;
    list.appendChild(item);
  });
};

// ==================== RESET & DELETE ====================
window.confirmResetLeaderboard = function() {
  if (confirm('⚠️ WARNING: This will DELETE ALL quiz scores!\n\nThis action CANNOT be undone.\n\nAre you sure?')) {
    const confirmText = prompt('Type "RESET" to confirm:');
    if (confirmText === 'RESET') {
      resetLeaderboard();
    } else {
      alert('Reset cancelled. Scores are safe.');
    }
  }
};

async function resetLeaderboard() {
  try {
    // Delete all attempts
    const attemptsSnapshot = await getDocs(collection(db, 'attempts'));
    const deletePromises = [];
    attemptsSnapshot.forEach(docSnapshot => {
      deletePromises.push(deleteDoc(doc(db, 'attempts', docSnapshot.id)));
    });
    await Promise.all(deletePromises);
    
    // Reset all user stats
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const userResetPromises = [];
    usersSnapshot.forEach(userDoc => {
      userResetPromises.push(
        updateDoc(doc(db, 'users', userDoc.id), {
          totalQuizzes: 0,
          averageScore: 0,
          bestScore: 0
        })
      );
    });
    await Promise.all(userResetPromises);
    
    alert('✅ All scores have been reset!');
    loadAllData();
    
  } catch (error) {
    console.error('Reset error:', error);
    alert('❌ Error resetting scores: ' + error.message);
  }
}

window.deleteUser = async function(userId, userName, showAlert = true) {
  if (userId === currentUser.uid) {
    alert('❌ You cannot delete your own admin account!');
    return;
  }
  
  if (showAlert && !confirm(`Delete "${userName}"?\nThis removes their quiz history.`)) return;
  
  try {
    const attemptsQuery = query(collection(db, 'attempts'), where('userId', '==', userId));
    const attemptsSnap = await getDocs(attemptsQuery);
    
    const deletePromises = [];
    attemptsSnap.forEach(docSnapshot => {
      deletePromises.push(deleteDoc(doc(db, 'attempts', docSnapshot.id)));
    });
    await Promise.all(deletePromises);
    
    await deleteDoc(doc(db, 'users', userId));
    
    if (showAlert) {
      alert(`✅ "${userName}" deleted!`);
      loadAllData();
    }
    
  } catch (error) {
    console.error('Delete user error:', error);
    if (showAlert) alert('❌ Error: ' + error.message);
  }
};

window.deleteAttempt = async function(attemptId) {
  if (!confirm('Delete this attempt?')) return;
  
  try {
    await deleteDoc(doc(db, 'attempts', attemptId));
    alert('✅ Deleted!');
    loadAllData();
  } catch (error) {
    alert('❌ Error');
  }
};

// ==================== UI ====================
window.toggleSidebar = function() {
  document.getElementById('sidebar').classList.toggle('show');
};

window.logout = async function() {
  if (unsubscribeLiveFeed) unsubscribeLiveFeed();
  const { signOut } = await import("https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js");
  await signOut(auth);
  window.location.href = 'index.html';
};
