import { auth, db } from './firebase-config.js';
import { QUESTION_BANK, SUBJECT_TIME, SUBJECT_INFO } from './data.js';
import { 
  collection, 
  addDoc, 
  doc, 
  setDoc,
  getDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

let currentUser = null;
let currentSubject = "";
let questions = [];
let currentIndex = 0;
let answers = {};
let flagged = new Set();
let timeLeft = 0;
let timerInterval = null;
let quizStartTime = null;
let quizData = null;
let userNameFromFirestore = null; // Store name fetched from Firestore

// Check if coming from history review
const urlParams = new URLSearchParams(window.location.search);
const reviewId = urlParams.get('review') || localStorage.getItem('reviewAttemptId');

if (reviewId) {
  localStorage.removeItem('reviewAttemptId');
  loadAndReviewAttempt(reviewId);
}

async function loadAndReviewAttempt(attemptId) {
  const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js");
  const { db } = await import('./firebase-config.js');
  
  const attemptRef = doc(db, 'attempts', attemptId);
  const attemptSnap = await getDoc(attemptRef);
  
  if (attemptSnap.exists()) {
    const data = attemptSnap.data();
    
    questions = data.questions;
    answers = data.answers;
    const score = data.score;
    const percentage = data.percentage;
    
    document.getElementById('quizSubject').textContent = data.subjectTitle;
    showSection('review');
    
    const correct = questions.filter((q, i) => answers[i] === q.a).length;
    const wrong = questions.filter((q, i) => answers[i] && answers[i] !== q.a).length;
    const skipped = questions.filter((q, i) => !answers[i]).length;
    
    document.getElementById('correctCount').textContent = `${correct} Correct`;
    document.getElementById('wrongCount').textContent = `${wrong} Wrong`;
    document.getElementById('skippedCount').textContent = `${skipped} Skipped`;
    
    const list = document.getElementById('reviewList');
    list.innerHTML = '';
    
    questions.forEach((q, i) => {
      const userAns = answers[i];
      const isCorrect = userAns === q.a;
      const isSkipped = !userAns;
      
      const div = document.createElement('div');
      div.className = `review-item ${isCorrect ? 'correct' : isSkipped ? 'skipped' : 'wrong'}`;
      
      let html = `<p><strong>Q${i + 1}. ${q.q}</strong></p>`;
      
      if (isSkipped) {
        html += `<p class="unanswered">Your Answer: <em>Not answered</em></p>`;
      } else {
        html += `<p class="${isCorrect ? 'correct' : 'wrong'}">Your Answer: ${userAns}. ${q.o[userAns]}</p>`;
      }
      
      if (!isCorrect) {
        html += `<p class="correct">Correct Answer: ${q.a}. ${q.o[q.a]}</p>`;
      }
      
      div.innerHTML = html;
      list.appendChild(div);
    });
    
    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.textContent = '← Back to History';
    backBtn.onclick = () => window.location.href = 'history.html';
    backBtn.style.marginTop = '20px';
    list.appendChild(backBtn);
  }
}

auth.onAuthStateChanged(async user => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  
  currentUser = user;
  
  // CRITICAL FIX: Always fetch user name from Firestore first
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      userNameFromFirestore = userSnap.data().name;
      console.log('Fetched name from Firestore:', userNameFromFirestore);
      
      // Update localStorage with fresh data
      if (userNameFromFirestore) {
        localStorage.setItem('userName', userNameFromFirestore);
      }
    }
  } catch (err) {
    console.error('Error fetching user from Firestore:', err);
  }
  
  // If displayName is missing, try to reload user
  if (!user.displayName) {
    console.log('Display name missing, attempting to reload user...');
    try {
      await user.reload();
      const refreshedUser = auth.currentUser;
      currentUser = refreshedUser;
      console.log('After reload, displayName:', refreshedUser.displayName);
    } catch (err) {
      console.error('Failed to reload user:', err);
    }
  }
  
  initializeQuizUser(currentUser);
});

function initializeQuizUser(user) {
  // PRIORITY: 1. Firestore name, 2. displayName, 3. localStorage, 4. email, 5. 'Student'
  const displayName = userNameFromFirestore || 
                     user.displayName || 
                     localStorage.getItem('userName') || 
                     user.email?.split('@')[0] || 
                     'Student';
  
  console.log('Final display name:', displayName);
  
  document.getElementById('userName').textContent = displayName;
  document.getElementById('welcomeName').textContent = `Welcome, ${displayName}!`;
  loadUserStats();
  initSubjectGrid();
}

function initSubjectGrid() {
  const grid = document.getElementById('subjectGrid');
  grid.innerHTML = '';
  
  Object.keys(SUBJECT_INFO).forEach(key => {
    const info = SUBJECT_INFO[key];
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.innerHTML = `
      <h3>${info.title}</h3>
      <p>${info.description}</p>
      <small>${info.questions} questions • ${info.time}</small>
    `;
    card.onclick = () => selectSubject(key, card);
    grid.appendChild(card);
  });
}

function selectSubject(subject, cardElement) {
  currentSubject = subject;
  document.querySelectorAll('.subject-card').forEach(c => c.classList.remove('selected'));
  cardElement.classList.add('selected');
}

window.showSection = function(sectionName) {
  document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
  document.getElementById(sectionName + 'Section').classList.remove('hidden');
};

window.startQuiz = function() {
  if (!currentSubject) {
    alert('Please select a subject first!');
    return;
  }
  
  // Validate questions exist
  if (!QUESTION_BANK[currentSubject] || QUESTION_BANK[currentSubject].length === 0) {
    alert('Questions for this subject are not available yet. Please select another subject.');
    return;
  }
  
  questions = [...QUESTION_BANK[currentSubject]];
  questions.sort(() => Math.random() - 0.5);
  
  currentIndex = 0;
  answers = {};
  flagged = new Set();
  timeLeft = SUBJECT_TIME[currentSubject];
  quizStartTime = Date.now();
  
  document.getElementById('quizSubject').textContent = SUBJECT_INFO[currentSubject].title;
  showSection('quiz');
  renderQuestion();
  startTimer();
  initPalette();
};

function renderQuestion() {
  const q = questions[currentIndex];
  document.getElementById('questionCounter').textContent = `${currentIndex + 1}/${questions.length}`;
  document.getElementById('questionText').textContent = q.q;
  
  const grid = document.getElementById('optionsGrid');
  grid.innerHTML = '';
  
  Object.keys(q.o).forEach(key => {
    const option = document.createElement('div');
    option.className = 'option';
    if (answers[currentIndex] === key) option.classList.add('selected');
    
    option.innerHTML = `
      <span class="option-key">${key}.</span>
      <span class="option-text">${q.o[key]}</span>
    `;
    option.onclick = () => selectOption(key);
    grid.appendChild(option);
  });
  
  updateProgress();
  updatePalette();
  updateFlagButton();
  
  document.getElementById('prevBtn').disabled = currentIndex === 0;
  document.getElementById('nextBtn').textContent = 
    currentIndex === questions.length - 1 ? 'Finish' : 'Next →';
}

function selectOption(key) {
  answers[currentIndex] = key;
  renderQuestion();
  
  if (currentIndex < questions.length - 1) {
    setTimeout(() => {
      currentIndex++;
      renderQuestion();
    }, 300);
  }
}

window.nextQuestion = function() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    confirmSubmit();
  }
};

window.prevQuestion = function() {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
};

window.flagQuestion = function() {
  if (flagged.has(currentIndex)) {
    flagged.delete(currentIndex);
  } else {
    flagged.add(currentIndex);
  }
  updateFlagButton();
  updatePalette();
};

function updateFlagButton() {
  const btn = document.getElementById('flagBtn');
  if (flagged.has(currentIndex)) {
    btn.classList.add('flagged');
    btn.textContent = '🚩 Flagged';
  } else {
    btn.classList.remove('flagged');
    btn.textContent = '🚩 Flag';
  }
}

function initPalette() {
  const palette = document.getElementById('questionPalette');
  palette.innerHTML = '';
  
  for (let i = 0; i < questions.length; i++) {
    const btn = document.createElement('button');
    btn.className = 'palette-btn';
    btn.textContent = i + 1;
    btn.onclick = () => {
      currentIndex = i;
      renderQuestion();
    };
    palette.appendChild(btn);
  }
}

function updatePalette() {
  const buttons = document.querySelectorAll('.palette-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.remove('current', 'answered', 'flagged');
    if (idx === currentIndex) btn.classList.add('current');
    if (answers[idx]) btn.classList.add('answered');
    if (flagged.has(idx)) btn.classList.add('flagged');
  });
}

function startTimer() {
  clearInterval(timerInterval);
  updateTimerDisplay();
  
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      submitQuiz();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const display = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const timerEl = document.getElementById('timer');
  timerEl.textContent = display;
  
  if (timeLeft <= 60) {
    timerEl.classList.add('warning');
  } else {
    timerEl.classList.remove('warning');
  }
}

function updateProgress() {
  const progress = ((currentIndex + 1) / questions.length) * 100;
  document.getElementById('progressBar').style.width = progress + '%';
  document.getElementById('progressText').textContent = Math.round(progress) + '%';
}

window.confirmSubmit = function() {
  const answered = Object.keys(answers).length;
  const unattempted = questions.length - answered;
  
  let message = `You have answered ${answered} out of ${questions.length} questions.`;
  if (unattempted > 0) message += `\n\n${unattempted} questions unanswered.`;
  if (flagged.size > 0) message += `\n${flagged.size} questions flagged for review.`;
  message += '\n\nSubmit anyway?';
  
  if (confirm(message)) {
    submitQuiz();
  }
};

async function submitQuiz() {
  clearInterval(timerInterval);
  
  // DEBUG: Check user data
  console.log('=== SUBMISSION DEBUG ===');
  console.log('currentUser:', currentUser);
  console.log('currentUser.uid:', currentUser?.uid);
  console.log('currentUser.displayName:', currentUser?.displayName);
  
  // DEFENSIVE: Ensure we have a valid user
  if (!currentUser) {
    alert('Error: No user logged in!');
    return;
  }
  
  if (!currentUser.uid) {
    alert('Error: User has no UID!');
    return;
  }
  
  // DEFENSIVE: Ensure we have a user name - use same priority as initializeQuizUser
  let userName = userNameFromFirestore || 
                currentUser.displayName || 
                localStorage.getItem('userName') || 
                currentUser.email?.split('@')[0] || 
                'Anonymous';
  
  console.log('Final userName for submission:', userName);
  
  try {
    const timeUsed = Math.floor((Date.now() - quizStartTime) / 1000);
    let score = 0;
    
    questions.forEach((q, i) => {
      if (answers[i] === q.a) score++;
    });
    
    const percentage = Math.round((score / questions.length) * 100);
    
    const attemptData = {
      userId: currentUser.uid,
      userName: userName,
      subject: currentSubject,
      subjectTitle: SUBJECT_INFO[currentSubject].title,
      score: score,
      totalQuestions: questions.length,
      percentage: percentage,
      timeUsed: timeUsed,
      timeLeft: timeLeft,
      answers: answers,
      questions: questions.map(q => ({ q: q.q, a: q.a, o: q.o })),
      submittedAt: serverTimestamp()
    };
    
    console.log('Attempt data:', attemptData);
    
    // Save the attempt
    await addDoc(collection(db, 'attempts'), attemptData);
    console.log('Attempt saved successfully');
    
    // Update user stats using setDoc with merge
    const userRef = doc(db, 'users', currentUser.uid);
    
    try {
      const userSnap = await getDoc(userRef);
      let userData = {};
      
      if (userSnap.exists()) {
        userData = userSnap.data();
        console.log('Existing user data:', userData);
      } else {
        console.log('User document does not exist, creating new one');
      }
      
      const newTotal = (userData.totalQuizzes || 0) + 1;
      const currentAvg = userData.averageScore || 0;
      const newAvg = Math.round(((currentAvg * (newTotal - 1)) + percentage) / newTotal);
      const newBest = Math.max(userData.bestScore || 0, percentage);
      
      // Use setDoc with merge: true instead of updateDoc
      await setDoc(userRef, {
        name: userName,
        email: currentUser.email,
        totalQuizzes: newTotal,
        averageScore: newAvg,
        bestScore: newBest,
        lastQuizDate: serverTimestamp()
      }, { merge: true });
      
      console.log('User stats updated successfully');
      
    } catch (userUpdateError) {
      console.error('Error updating user stats:', userUpdateError);
    }
    
    showResults(score, percentage, timeUsed);
    
  } catch (error) {
    console.error('Full error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    alert('Error saving results: ' + error.message + '\nCode: ' + error.code);
  }
}

function showResults(score, percentage, timeUsed) {
  showSection('result');
  
  document.getElementById('resultSubject').textContent = SUBJECT_INFO[currentSubject].title;
  document.getElementById('scoreValue').textContent = `${score}/${questions.length}`;
  document.getElementById('percentValue').textContent = percentage + '%';
  
  const mins = Math.floor(timeUsed / 60);
  const secs = timeUsed % 60;
  document.getElementById('timeValue').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
  
  let message = '';
  if (percentage >= 80) message = '🌟 Outstanding! Excellent performance!';
  else if (percentage >= 60) message = '👍 Good job! Keep practicing!';
  else if (percentage >= 40) message = '💪 Not bad! Room for improvement.';
  else message = '📚 Keep studying! You\'ll do better next time.';
  
  document.getElementById('perfMessage').textContent = message;
  quizData = { questions, answers, score };
}

window.reviewAnswers = function() {
  showSection('review');
  
  const correct = quizData.questions.filter((q, i) => quizData.answers[i] === q.a).length;
  const wrong = quizData.questions.filter((q, i) => quizData.answers[i] && quizData.answers[i] !== q.a).length;
  const skipped = quizData.questions.filter((q, i) => !quizData.answers[i]).length;
  
  document.getElementById('correctCount').textContent = `${correct} Correct`;
  document.getElementById('wrongCount').textContent = `${wrong} Wrong`;
  document.getElementById('skippedCount').textContent = `${skipped} Skipped`;
  
  const list = document.getElementById('reviewList');
  list.innerHTML = '';
  
  quizData.questions.forEach((q, i) => {
    const userAns = quizData.answers[i];
    const isCorrect = userAns === q.a;
    const isSkipped = !userAns;
    
    const div = document.createElement('div');
    div.className = `review-item ${isCorrect ? 'correct' : isSkipped ? 'skipped' : 'wrong'}`;
    
    let html = `<p><strong>Q${i + 1}. ${q.q}</strong></p>`;
    
    if (isSkipped) {
      html += `<p class="unanswered">Your Answer: <em>Not answered</em></p>`;
    } else {
      html += `<p class="${isCorrect ? 'correct' : 'wrong'}">Your Answer: ${userAns}. ${q.o[userAns]}</p>`;
    }
    
    if (!isCorrect) {
      html += `<p class="correct">Correct Answer: ${q.a}. ${q.o[q.a]}</p>`;
    }
    
    div.innerHTML = html;
    list.appendChild(div);
  });
};

window.retakeQuiz = function() {
  startQuiz();
};

window.goHome = function() {
  currentSubject = '';
  showSection('home');
  loadUserStats();
};

async function loadUserStats() {
  if (!currentUser) return;
  
  try {
    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      document.getElementById('totalAttempts').textContent = data.totalQuizzes || 0;
      loadRecentAttempts();
    } else {
      console.log('No user stats found');
      document.getElementById('totalAttempts').textContent = '0';
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

async function loadRecentAttempts() {
  try {
    const q = query(
      collection(db, 'attempts'),
      where('userId', '==', currentUser.uid),
      orderBy('submittedAt', 'desc'),
      limit(5)
    );
    
    const snapshot = await getDocs(q);
    const recentList = document.getElementById('recentList');
    
    if (snapshot.empty) {
      recentList.innerHTML = '<p class="empty-state">No recent quizzes. Start your first one!</p>';
      return;
    }
    
    recentList.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const item = document.createElement('div');
      item.className = 'activity-item';
      
      const date = data.submittedAt?.toDate ? data.submittedAt.toDate() : new Date();
      
      item.innerHTML = `
        <div>
          <strong>${data.subjectTitle}</strong>
          <small>${date.toLocaleDateString()}</small>
        </div>
        <span class="score-percentage" style="color: ${data.percentage >= 60 ? 'var(--success)' : 'var(--danger)'}; font-weight: bold;">
          ${data.percentage}%
        </span>
      `;
      recentList.appendChild(item);
    });
  } catch (error) {
    console.error('Error loading recent:', error);
    document.getElementById('recentList').innerHTML = '<p class="empty-state">Error loading recent quizzes</p>';
  }
}

window.toggleSidebar = function() {
  document.getElementById('sidebar').classList.toggle('show');
};

window.logout = async function() {
  const { auth } = await import('./firebase-config.js');
  const { signOut } = await import("https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js");
  await signOut(auth);
  localStorage.removeItem('userName'); // Clear stored name
  window.location.href = 'index.html';
};
