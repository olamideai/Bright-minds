import { auth, db } from './firebase-config.js';
import { 
  collection, 
  query, 
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  limit,
  orderBy,
  where
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

let currentUser = null;
let allUsers = [];
let allAttempts = [];

// Check if user is admin
auth.onAuthStateChanged(async user => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  currentUser = user;
  
  // Check admin status (you can set this in Firestore)
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists() || !userSnap.data().isAdmin) {
    alert('Access denied. Admins only.');
    window.location.href = 'quiz.html';
    return;
  }
  
  loadAllData();
});

async function loadAllData() {
  await Promise.all([
    loadStatistics(),
    loadUsers(),
    loadRecentAttempts()
  ]);
}

async function loadStatistics() {
  try {
    // Get all users
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const totalUsers = usersSnapshot.size;
    
    // Get all attempts
    const attemptsSnapshot = await getDocs(collection(db, 'attempts'));
    const totalAttempts = attemptsSnapshot.size;
    
    // Calculate highest and average score
    let highestScore = 0;
    let totalPercentage = 0;
    let count = 0;
    
    attemptsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.percentage > highestScore) highestScore = data.percentage;
      totalPercentage += data.percentage;
      count++;
    });
    
    const averageScore = count > 0 ? Math.round(totalPercentage / count) : 0;
    
    // Update UI
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('totalAttempts').textContent = totalAttempts;
    document.getElementById('highestScore').textContent = highestScore + '%';
    document.getElementById('averageScore').textContent = averageScore + '%';
    
  } catch (error) {
    console.error('Statistics error:', error);
  }
}

async function loadUsers() {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const attemptsSnapshot = await getDocs(collection(db, 'attempts'));
    
    // Process attempts to get best score per user
    const userStats = new Map();
    
    attemptsSnapshot.forEach(doc => {
      const data = doc.data();
      const current = userStats.get(data.userId) || { bestScore: 0, count: 0 };
      
      userStats.set(data.userId, {
        bestScore: Math.max(current.bestScore, data.percentage),
        count: current.count + 1
      });
    });
    
    // Build users array
    allUsers = [];
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      const stats = userStats.get(doc.id) || { bestScore: 0, count: 0 };
      
      allUsers.push({
        id: doc.id,
        name: userData.name || 'Anonymous',
        email: userData.email || 'No email',
        bestScore: stats.bestScore,
        quizCount: stats.count,
        createdAt: userData.createdAt
      });
    });
    
    // Sort by best score
    allUsers.sort((a, b) => b.bestScore - a.bestScore);
    
    renderUsersTable(allUsers);
    
  } catch (error) {
    console.error('Load users error:', error);
    document.getElementById('usersTableBody').innerHTML = 
      `<tr><td colspan="6" style="text-align:center;color:var(--danger);">Error loading users</td></tr>`;
  }
}

function renderUsersTable(users) {
  const tbody = document.getElementById('usersTableBody');
  
  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;">No users found</td></tr>';
    return;
  }
  
  tbody.innerHTML = '';
  users.forEach((user, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>#${index + 1}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td style="color: ${user.bestScore >= 60 ? 'var(--success)' : 'var(--danger)'}">${user.bestScore}%</td>
      <td>${user.quizCount}</td>
      <td>
        <button class="btn btn-small btn-danger" onclick="deleteUser('${user.id}', '${user.name}')">
          Delete
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function searchUsers() {
  const searchTerm = document.getElementById('userSearch').value.toLowerCase();
  const filtered = allUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm) || 
    user.email.toLowerCase().includes(searchTerm)
  );
  renderUsersTable(filtered);
}

async function loadRecentAttempts() {
  try {
    const q = query(
      collection(db, 'attempts'),
      limit(20)
    );
    
    const snapshot = await getDocs(q);
    const list = document.getElementById('recentAttemptsList');
    
    if (snapshot.empty) {
      list.innerHTML = '<p class="empty-state">No attempts yet</p>';
      return;
    }
    
    let attempts = [];
    snapshot.forEach(doc => {
      attempts.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort by date
    attempts.sort((a, b) => {
      const dateA = a.submittedAt?.toDate ? a.submittedAt.toDate() : new Date(0);
      const dateB = b.submittedAt?.toDate ? b.submittedAt.toDate() : new Date(0);
      return dateB - dateA;
    });
    
    list.innerHTML = '';
    attempts.forEach(attempt => {
      const item = document.createElement('div');
      item.className = 'attempt-item';
      
      const date = attempt.submittedAt?.toDate ? attempt.submittedAt.toDate() : new Date();
      
      item.innerHTML = `
        <div class="attempt-info">
          <strong>${attempt.userName || 'Anonymous'}</strong>
          <span>${attempt.subjectTitle || attempt.subject}</span>
          <small>${date.toLocaleString()}</small>
        </div>
        <div class="attempt-score" style="color: ${attempt.percentage >= 60 ? 'var(--success)' : 'var(--danger)'}">
          ${attempt.percentage}%
        </div>
        <button class="btn btn-small btn-danger" onclick="deleteAttempt('${attempt.id}')">
          Delete
        </button>
      `;
      list.appendChild(item);
    });
    
  } catch (error) {
    console.error('Recent attempts error:', error);
  }
}

window.confirmResetLeaderboard = function() {
  if (confirm('⚠️ WARNING: This will DELETE ALL quiz scores!\n\nAre you sure you want to reset the entire leaderboard?')) {
    if (confirm('This action CANNOT be undone. Type "RESET" to confirm.')) {
      resetLeaderboard();
    }
  }
};

async function resetLeaderboard() {
  try {
    const snapshot = await getDocs(collection(db, 'attempts'));
    
    // Delete all attempts
    const deletePromises = [];
    snapshot.forEach(docSnapshot => {
      deletePromises.push(deleteDoc(doc(db, 'attempts', docSnapshot.id)));
    });
    
    await Promise.all(deletePromises);
    
    // Reset user stats
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
    
    alert('✅ Leaderboard reset successfully!');
    loadAllData();
    
  } catch (error) {
    console.error('Reset error:', error);
    alert('❌ Error resetting leaderboard: ' + error.message);
  }
}

window.deleteUser = async function(userId, userName) {
  if (!confirm(`Delete user "${userName}"?\n\nThis will remove their account and all quiz history.`)) {
    return;
  }
  
  try {
    // Delete user's attempts
    const attemptsQuery = query(collection(db, 'attempts'), where('userId', '==', userId));
    const attemptsSnap = await getDocs(attemptsQuery);
    
    const deletePromises = [];
    attemptsSnap.forEach(docSnapshot => {
      deletePromises.push(deleteDoc(doc(db, 'attempts', docSnapshot.id)));
    });
    await Promise.all(deletePromises);
    
    // Delete user document
    await deleteDoc(doc(db, 'users', userId));
    
    alert(`✅ User "${userName}" deleted successfully!`);
    loadAllData();
    
  } catch (error) {
    console.error('Delete user error:', error);
    alert('❌ Error deleting user: ' + error.message);
  }
};

window.deleteAttempt = async function(attemptId) {
  if (!confirm('Delete this quiz attempt?')) return;
  
  try {
    await deleteDoc(doc(db, 'attempts', attemptId));
    alert('✅ Attempt deleted!');
    loadAllData();
  } catch (error) {
    console.error('Delete attempt error:', error);
    alert('❌ Error deleting attempt');
  }
};

window.toggleSidebar = function() {
  document.getElementById('sidebar').classList.toggle('show');
};

window.logout = async function() {
  const { signOut } = await import("https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js");
  await signOut(auth);
  window.location.href = 'index.html';
};
