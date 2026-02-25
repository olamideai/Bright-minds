import { auth, db } from './firebase-config.js';
import { QUESTION_BANK, SUBJECT_TIME, SUBJECT_INFO } from './data.js';
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
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

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  currentUser = user;
  document.getElementById('userName').textContent = user.displayName || 'Student';
  document.getElementById('welcomeName').textContent = `Welcome, ${user.displayName || 'Student'}!`;
  loadUserStats();
  initSubjectGrid();
});

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
  
  const timeUsed = Math.floor((Date.now() - quizStartTime) / 1000);
  let score = 0;
  
  questions.forEach((q, i) => {
    if (answers[i] === q.a) score++;
  });
  
  const percentage = Math.round((score / questions.length) * 100);
  
  const attemptData = {
    userId: currentUser.uid,
    userName: currentUser.displayName,
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
  
  try {
    await addDoc(collection(db, 'attempts'), attemptData);
    
    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data() || {};
    
    const newTotal = (userData.totalQuizzes || 0) + 1;
    const currentAvg = userData.averageScore || 0;
    const newAvg = Math.round(((currentAvg * (newTotal - 1)) + percentage) / newTotal);
    const newBest = Math.max(userData.bestScore || 0, percentage);
    
    await updateDoc(userRef, {
      totalQuizzes: newTotal,
      averageScore: newAvg,
      bestScore: newBest,
      lastQuizDate: serverTimestamp()
    });
    
    showResults(score, percentage, timeUsed);
    
  } catch (error) {
    console.error('Error saving attempt:', error);
    alert('Error saving results. Please try again.');
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
  
  const userRef = doc(db, 'users', currentUser.uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const data = userSnap.data();
    document.getElementById('totalAttempts').textContent = data.totalQuizzes || 0;
    loadRecentAttempts();
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
      item.innerHTML = `
        <div>
          <strong>${data.subjectTitle}</strong>
          <small>${new Date(data.submittedAt?.toDate()).toLocaleDateString()}</small>
        </div>
        <span class="score-percentage" style="color: ${data.percentage >= 60 ? 'var(--success)' : 'var(--danger)'}">${data.percentage}%</span>
      `;
      recentList.appendChild(item);
    });
  } catch (error) {
    console.error('Error loading recent:', error);
  }
}

window.toggleSidebar = function() {
  document.getElementById('sidebar').classList.toggle('show');
};

