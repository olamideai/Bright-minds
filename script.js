/* ================== GLOBAL STATE ================== */
let QUESTIONS = {};          // Loaded from questions.json
let currentSubject = null;
let currentIndex = 0;
let answers = {};
let timerInterval = null;
let timeLeft = 0;
let studentName = "";

/* ================== LOAD QUESTIONS ================== */
fetch("https://raw.githubusercontent.com/olamideai/Brightmindsexamquiz/main/questions.json")
  .then(res => {
    if (!res.ok) throw new Error("Failed to load questions.json");
    return res.json();
  })
  .then(data => {
    QUESTIONS = data;
    console.log("Questions loaded successfully:", QUESTIONS);
  })
  .catch(err => {
    alert("Error loading questions. Make sure the JSON path is correct.");
    console.error(err);
  });

/* ================== PAGE NAVIGATION ================== */
function showPage(pageId) {
  document.querySelectorAll(".card").forEach(card => card.classList.add("hide"));
  document.getElementById(pageId).classList.remove("hide");
}

function goHome() {
  clearInterval(timerInterval);
  currentSubject = null;
  currentIndex = 0;
  answers = {};
  timeLeft = 0;
  showPage("home");
}

/* ================== NAME ================== */
function saveName() {
  const input = document.getElementById("nameInput").value.trim();
  if (!input) {
    alert("Please enter your name");
    return;
  }
  studentName = input;
  showPage("subjectPage");
}

/* ================== SUBJECT ================== */
function selectSubject(subject, btn) {
  currentSubject = subject;

  document.querySelectorAll(".subject-btn").forEach(b => b.classList.remove("selected"));
  if (btn) btn.classList.add("selected");
}

/* ================== QUIZ START ================== */
function startQuiz() {
  if (!currentSubject) {
    alert("Please select a subject");
    return;
  }

  if (!QUESTIONS[currentSubject]) {
    alert("Questions for this subject are not available yet");
    return;
  }

  currentIndex = 0;
  answers = {};

  // 30 seconds per question
  timeLeft = QUESTIONS[currentSubject].length * 30;

  showPage("quiz");
  startTimer();
  loadQuestion();
}

/* ================== LOAD QUESTION ================== */
function loadQuestion() {
  const qData = QUESTIONS[currentSubject][currentIndex];
  if (!qData) return console.error("No question found for currentIndex:", currentIndex);

  document.getElementById("subjectTitle").textContent = currentSubject;
  document.getElementById("questionNumber").textContent = `Question ${currentIndex + 1} of ${QUESTIONS[currentSubject].length}`;
  document.getElementById("questionText").textContent = qData.q;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  qData.o.forEach((optionText, index) => {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = optionText;

    if (answers[currentIndex] === index) div.classList.add("selected");
    div.onclick = () => selectOption(index);
    optionsDiv.appendChild(div);
  });
}

/* ================== SELECT OPTION ================== */
function selectOption(index) {
  answers[currentIndex] = index;
  loadQuestion();
}

/* ================== NAVIGATION ================== */
function nextQuestion() {
  if (currentIndex < QUESTIONS[currentSubject].length - 1) {
    currentIndex++;
    loadQuestion();
  } else {
    showResult();
  }
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    loadQuestion();
  }
}

/* ================== TIMER ================== */
function startTimer() {
  clearInterval(timerInterval);
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showResult();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("timer").textContent = `${minutes}:${seconds.toString().padStart(2,"0")}`;
}

/* ================== RESULT ================== */
function showResult() {
  clearInterval(timerInterval);

  const total = QUESTIONS[currentSubject].length;
  let score = 0;

  QUESTIONS[currentSubject].forEach((q,i) => {
    const correctIndex = q.a.charCodeAt(0)-65;
    if (answers[i] === correctIndex) score++;
  });

  document.getElementById("resultName").textContent = `Name: ${studentName}`;
  document.getElementById("resultSubject").textContent = `Subject: ${currentSubject}`;
  document.getElementById("scoreCircle").textContent = score;
  document.getElementById("percentCircle").textContent = Math.round((score/total)*100) + "%";

  renderAnswerReview();
  showPage("result");
}

/* ================== ANSWER REVIEW ================== */
function renderAnswerReview() {
  const list = document.getElementById("answerList");
  list.innerHTML = "";

  QUESTIONS[currentSubject].forEach((q,i) => {
    const correctIndex = q.a.charCodeAt(0)-65;
    const userIndex = answers[i];
    const p = document.createElement("p");

    if(userIndex === correctIndex){
      p.innerHTML = `Q${i+1}: <span class="correct">Correct</span>`;
    } else {
      const correctText = q.o[correctIndex];
      p.innerHTML = `Q${i+1}: <span class="wrong">Wrong</span> (Correct: ${correctText})`;
    }

    list.appendChild(p);
  });
}
