/**************************************************
 * TASFUED QUIZ APP – SINGLE SCRIPT.JS (v2.0)
 * Pure Vanilla JavaScript
 **********************************************/

/* ===============================
   1. GLOBAL VARIABLES & STATE
==================================*/
let studentname = "";
let currentSubject = "";
let questions = [];
let currentIndex = 0;
let answers= {};
let timeLeft = 0;
let quizCompleted = false;

/* ===============================
   2. QUESTION DATA (SAMPLE)
   👉 You can add more subjects
================================ */
const QUESTION_BANK = {
"PHY 101/107 (1)": [],
"PHY 101/107 (2)": [],
"PHY 101/107 (3)": []

        
};

const SUBJECT_TIME = {
   "PHY 101/107 (1)": 60 * 15,  
  "PHY 101/107 (2)": 60 * 15,   
  "PHY 101/107 (3)": 60 * 15    
  
};

/* ===============================
   3. DOM ELEMENTS
================================ */
const pages = {
  home: document.getElementById("home"),
  name: document.getElementById("namePage"),
  subject: document.getElementById("subjectPage"),
  quiz: document.getElementById("quizPage"),
  result: document.getElementById("resultPage"),
  review: document.getElementById("reviewPage")
};

const subjectList = document.getElementById("subjectList");
const questionText = document.getElementById("questionText");
const optionsBox = document.getElementById("options");
const questionNumber = document.getElementById("questionNumber");
const timerBox = document.getElementById("timer");



document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  const historyBtn = document.getElementById('historyBtn');
  const historyContent = document.getElementById('historyContent');

  menuBtn.addEventListener('click', () => {
    sidebar.classList.remove('hide');
    historyContent.classList.add('hide'); // hide history content initially
  });

  closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.add('hide');
  });

  historyBtn.addEventListener('click', () => {
    historyContent.classList.remove('hide');
  });
});



/* ===============================
   4. PAGE NAVIGATION
================================ */
function showPage(page) {
  Object.values(pages).forEach(p => p.classList.add("hide"));
  pages[page].classList.remove("hide");
}

/* ===============================
   5. INITIALIZE SUBJECT LIST
================================ */
function loadSubjects() {
  subjectList.innerHTML = "";
  Object.keys(QUESTION_BANK).forEach(sub => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = sub;
    btn.onclick = (e) => selectSubject(sub, e);
    subjectList.appendChild(btn);
  });
}

/* ===============================
   6. SUBJECT SELECTION
================================ */
function selectSubject(subject, event) {
  currentSubject = subject;
  document.querySelectorAll("#subjectList .btn").forEach(b => b.classList.remove("selected"));
  event.target.classList.add("selected");
}

/* ===============================
   7. START QUIZ
================================ */
function startQuiz() {
  if (!currentSubject) return alert("Select a subject");

  questions = QUESTION_BANK[currentSubject];
  currentIndex = 0;
  answers = {};
  quizCompleted = false;
  timeLeft = SUBJECT_TIME[currentSubject] || (60 * 10);

  startTimer();
  renderQuestion();
  saveProgress();

  document.getElementById("quizSubject").textContent = currentSubject;
  showPage("quiz");
}

/* ===============================
   8. RENDER QUESTION
================================ */
function renderQuestion() {
  const q = questions[currentIndex];
  questionNumber.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  questionText.textContent = q.q;
  optionsBox.innerHTML = "";

  for (let key in q.o) {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = `${key}. ${q.o[key]}`;
    if (answers[currentIndex] === key) div.classList.add("selected");
    div.onclick = () => selectOption(key);
    optionsBox.appendChild(div);
  }
   updateProgressBar();
}

/* ===============================
   9. SELECT OPTION
================================ */
function selectOption(key) {
  answers[currentIndex] = key;
  saveProgress();

  // Show selected style first
  renderQuestion();

  // Move to next question ONLY if not last
  setTimeout(() => {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      renderQuestion();
    }
    // If it's the last question → do nothing
  }, 150);
}
/* ===============================
   10. NEXT & PREVIOUS
================================ */
function nextQuestion() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
}

/* ===============================
   11. TIMER
================================ */
function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerBox.textContent = formatTime(timeLeft);

    // Add warning class if less than 60 seconds
    if (timeLeft <= 60) {
      timerBox.classList.add("warning");
    } else {
      timerBox.classList.remove("warning");
    }

    saveProgress();

    if (timeLeft <= 0) {
      clearInterval(timer);
      submitQuiz();
    }
  }, 750);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* ===============================
   12. SUBMIT QUIZ
================================ */
function submitQuiz() {
  clearInterval(timer);
  quizCompleted = true;
  saveProgress();

  let score = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.a) score++;
  });

  document.getElementById("resultName").innerHTML = `Name: <span class="label"> ${studentName}</span>`;
document.getElementById("resultSubject").innerHTML = `Subject: <span class="label"> ${currentSubject}</span>`;
  document.getElementById("scoreCircle").textContent = `${score} / ${questions.length}`;
  document.getElementById("percentCircle").textContent =
    Math.round((score / questions.length) * 100) + "%";

  showPage("result");
}

/* ===============================
   13. REVIEW ANSWERS (YOUR FORMAT)
================================ */
function reviewAnswers() {
  const list = document.getElementById("reviewList");
  list.innerHTML = "";

  questions.forEach((q, i) => {
    const div = document.createElement("div");
    const userAns = answers[i];

    let html = `<p><strong>Q${i + 1}. ${q.q}</strong></p>`;

    if (!userAns) {
      html += `<p class="unanswered">Your Answer: Not Answered</p>`;
      html += `<p class="correct">Correct Answer: ${q.a}. ${q.o[q.a]}</p>`;
    } else if (userAns === q.a) {
      html += `<p class="correct">Your Answer: ${userAns}. ${q.o[userAns]}</p>`;
    } else {
      html += `<p class="wrong">Your Answer: ${userAns}. ${q.o[userAns]}</p>`;
      html += `<p class="correct">Correct Answer: ${q.a}. ${q.o[q.a]}</p>`;
    }

    div.innerHTML = html + "<hr>";
    list.appendChild(div);
  });

  showPage("review");
}

/* ===============================
   14. RETAKE & GO HOME
================================ */
function retakeQuiz() {
  startQuiz();
}

function goHome() {
  clearInterval(timer);
  localStorage.clear();
  showPage("home");
}

/* ===============================
   15. AUTOSAVE (LOCAL STORAGE)
================================ */
function saveProgress() {
  localStorage.setItem("quizState", JSON.stringify({
    studentName,
    currentSubject,
    currentIndex,
    answers,
    timeLeft,
    quizCompleted
  }));
}

function loadProgress() {
  const data = JSON.parse(localStorage.getItem("quizState"));
  if (!data || data.quizCompleted) return;

  if (confirm("Resume previous quiz?")) {
    studentName = data.studentName;
    currentSubject = data.currentSubject;
    currentIndex = data.currentIndex;
    answers = data.answers;
    timeLeft = data.timeLeft;
    questions = QUESTION_BANK[currentSubject];

    startTimer();
    renderQuestion();
    showPage("quiz");
  }
}

/* ===============================
   16. EVENT LISTENERS
================================ */
document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("startBtn").onclick = () => showPage("name");

  document.getElementById("continueBtn").onclick = () => {
    studentName = document.getElementById("nameInput").value.trim();
    if (!studentName) return alert("Enter your name");
    loadSubjects();
    showPage("subject");
  };

  document.getElementById("startQuizBtn").onclick = startQuiz;
  document.getElementById("nextBtn").onclick = nextQuestion;
  document.getElementById("prevBtn").onclick = prevQuestion;

  document.getElementById("submitBtn").onclick = () => {
    if (confirm("Are you sure you want to submit the quiz?")) {
      submitQuiz();
    }
  };

   document.getElementById("backNameBtn").onclick = () => {
  showPage("name");
};

document.getElementById("backHomeBtn1").onclick = () => {
  showPage("home");
};

  document.getElementById("retakeBtn").onclick = retakeQuiz;
  document.getElementById("goHomeBtn").onclick = goHome;
  document.getElementById("reviewBtn").onclick = reviewAnswers;
  document.getElementById("backResultBtn").onclick = () => showPage("result");

  const backHomeBtn = document.getElementById("backHomeBtn");
  if (backHomeBtn) {
    backHomeBtn.onclick = () => {
      if (confirm("Are you sure you want to quit the quiz and go back home? Your progress will be lost.")) {
        goHome();
      }
    };
  }

});

/* ===============================
   17. APP BOOTSTRAP
================================ */
function bootstrap() {
  const data = JSON.parse(localStorage.getItem("quizState"));
  if (data && !data.quizCompleted) {
    if (confirm("Resume previous quiz?")) {
      studentName = data.studentName;
      currentSubject = data.currentSubject;
      currentIndex = data.currentIndex;
      answers = data.answers;
      timeLeft = data.timeLeft;
      questions = QUESTION_BANK[currentSubject];
       
     document.getElementById("quizSubject").textContent = currentSubject;
      startTimer();
      renderQuestion();
      showPage("quiz");
      return; // Exit so we don't show home page
    }
  }
  // Show home if no quiz saved or user cancels
  showPage("home");
}

bootstrap();
/* ==================================
   18. PROGRESS BAR
   ================================ */

   function updateProgressBar() {
  const progress = ((currentIndex + 1) / questions.length) * 100;
  document.getElementById("progressBar").style.width = progress + "%";
   }
