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
"PHY 101/107 (1)": [
   {
      q: "The maximum range of a projectile occurs at:",
      o: { A: "30°", B: "45°", C: "60°", D: "90°" },
      a: "B"
    },
    {
      q: "A car travelling at 30 m/s overcomes a frictional force of 600 N. The power developed is:",
      o: { A: "12,000 W", B: "15,000 W", C: "18,000 W", D: "20,000 W" },
      a: "C"
    },
    {
      q: "The device that converts heat energy into electrical energy is:",
      o: { A: "Generator", B: "Transformer", C: "Turbine", D: "Thermocouple" },
      a: "D"
    },
    {
      q: "The point where the line of best fit cuts the vertical axis is called:",
      o: { A: "Slope", B: "Intercept", C: "Gradient", D: "Origin" },
      a: "B"
    },
    {
      q: "Given T² = 4π²L/g, what is the correct equation for the value of g if a graph of T² is plotted against L?",
      o: { A: "g = 4π²/S", B: "g = 4π²", C: "g = 4π²S", D: "g = 1/S" },
      a: "A"
    },
    {
      q: "A body moving at constant speed accelerates when it is in:",
      o: { A: "Straight line motion", B: "Circular motion", C: "At rest", D: "Uniform motion" },
      a: "B"
    },
    {
      q: "A body accelerates uniformly from rest at 2 m/s². Its velocity after 4 s is:",
      o: { A: "4 m/s", B: "6 m/s", C: "8 m/s", D: "10 m/s" },
      a: "C"
    },
    {
      q: "A force of 100 N acts on 0.15 kg for 0.03 s. The change in speed is:",
      o: { A: "10 m/s", B: "15 m/s", C: "20 m/s", D: "25 m/s" },
      a: "C"
    },
    {
      q: "An object undergoes oscillatory motion when it moves:",
      o: { A: "In a straight line", B: "To and fro about a mean position", C: "Randomly", D: "In a circle" },
      a: "B"
    },
    {
      q: "A body rotates in a circle of radius 2.5 m with angular speed 5 rad/s. The radial acceleration is:",
      o: { A: "25 m/s²", B: "50 m/s²", C: "62.5 m/s²", D: "75 m/s²" },
      a: "C"
    },

    {
      q: "If A = 5i + 2j + k and B = 2i + 4j − 3k, then A × B equals:",
      o: {
        A: "−10i + 17j + 16k",
        B: "10i − 17j − 16k",
        C: "16i + 17j − 10k",
        D: "−16i + 10j + 17k"
      },
      a: "A"
    },

    {
      q: "The potential energy stored in a stretched spring is:",
      o: { A: "½kx", B: "kx", C: "½kx²", D: "kx²" },
      a: "C"
    },

    {
      q: "If a = −100x, the period of oscillation is approximately:",
      o: { A: "0.2 s", B: "0.4 s", C: "0.63 s", D: "1 s" },
      a: "C"
    },

    {
      q: "Which of the following is NOT a unit of energy?",
      o: { A: "Watt", B: "Joule", C: "Calorie", D: "kWh" },
      a: "A"
    },

    {
      q: "If X = 5t² + 2, the instantaneous velocity at t = 2 s is:",
      o: { A: "10 m/s", B: "15 m/s", C: "20 m/s", D: "25 m/s" },
      a: "C"
    },

    {
      q: "The unit “cycle per second” is called:",
      o: { A: "Period", B: "Frequency", C: "Hertz", D: "Amplitude" },
      a: "C"
    },

    {
      q: "The trajectory of a projectile is:",
      o: { A: "Circle", B: "Straight line", C: "Parabola", D: "Ellipse" },
      a: "C"
    },

    {
      q: "Which is a fundamental unit?",
      o: { A: "m/s", B: "candela", C: "newton", D: "m/s²" },
      a: "B"
    },

    {
      q: "For T = KLˣgʸ, the values of x and y are:",
      o: { A: "1, 0", B: "½, −½", C: "½, ½", D: "1, −1" },
      a: "B"
    },

    {
      q: "From velocity–time points (20,5) and (10,3), acceleration is:",
      o: { A: "0.1 m/s²", B: "0.2 m/s²", C: "0.3 m/s²", D: "0.5 m/s²" },
      a: "B"
    },
{
      q: "If F = 2i + 4j and S = i + 5j, work done is:",
      o: { A: "20 J", B: "22 J", C: "18 J", D: "24 J" },
      a: "B"
    },
    {
      q: "Which of the following is derived?",
      o: { A: "kg", B: "m", C: "K", D: "N" },
      a: "D"
    },
    {
      q: "The slope of a displacement–time graph represents:",
      o: { A: "Acceleration", B: "Velocity", C: "Force", D: "Distance" },
      a: "B"
    },
    {
      q: "Time of flight (u = 20 m/s, 30° to horizontal):",
      o: { A: "1 s", B: "2 s", C: "3 s", D: "4 s" },
      a: "B"
    },
    {
      q: "Fundamental quantities are:",
      o: {
        A: "Length, mass and time",
        B: "Speed, length and time",
        C: "Speed, mass and distance",
        D: "Distance, speed and time"
      },
      a: "A"
    },
    {
      q: "For T = kmˣlʸgᶻ, correct values are:",
      o: { A: "1, 0, 1", B: "0, −½, ½", C: "0, ½, −½", D: "0, 1, ½" },
      a: "C"
    },
    {
      q: "Power when F = 20 N, v = 0.2 m/s:",
      o: { A: "2 W", B: "4 W", C: "6 W", D: "8 W" },
      a: "B"
    },
    {
      q: "If no net force acts, this is:",
      o: {
        A: "Newton’s First Law",
        B: "Newton’s Second Law",
        C: "Newton’s Third Law",
        D: "Law of Gravitation"
      },
      a: "A"
    },
    {
      q: "Bullet reaching 500 m vertically, initial velocity is:",
      o: { A: "50 m/s", B: "80 m/s", C: "100 m/s", D: "120 m/s" },
      a: "C"
    },
    {
      q: "Final momentum (F = 5 N, t = 5 s):",
      o: { A: "10 kg·m/s", B: "20 kg·m/s", C: "25 kg·m/s", D: "30 kg·m/s" },
      a: "C"
    },
    {
      q: "Acceleration equals:",
      o: {
        A: "Gradient of displacement–time",
        B: "Gradient of velocity–time",
        C: "Area under speed–time",
        D: "Area under displacement–time"
      },
      a: "B"
    },
    {
      q: "A chemical balance measures:",
      o: { A: "Weight", B: "Mass", C: "Density", D: "Volume" },
      a: "B"
    },
    {
      q: "Power developed (100 N at 30 m/s):",
      o: { A: "2000 W", B: "3000 W", C: "4000 W", D: "5000 W" },
      a: "B"
    },
    {
      q: "Unit of moment of inertia:",
      o: { A: "kg/m²", B: "kg·m²", C: "kg/m³", D: "kg/cm²" },
      a: "B"
    },
    {
      q: "Energy stored in stretched elastic material is:",
      o: {
        A: "Kinetic energy",
        B: "Elastic potential energy",
        C: "Gravitational energy",
        D: "Heat energy"
      },
      a: "B"
    },
    {
      q: "Time to maximum height is:",
      o: { A: "u/g", B: "ucosθ/g", C: "usinθ/g", D: "2usinθ/g" },
      a: "C"
    },
    {
      q: "Acceleration formula is:",
      o: { A: "(v−u)/t", B: "(u−v)/t", C: "(2v−u)/t", D: "(v+u)/t" },
      a: "A"
    },
    {
      q: "A body of mass 1000 kg is released from a height of 10 m. Determine its kinetic energy just before it strikes the ground (g = 10 m/s²).",
      o: { A: "50,000 J", B: "100,000 J", C: "10,000 J", D: "1,000 J" },
      a: "B"
    },
    {
      q: "Calculate the gravitational force between Earth (6.0 × 10²⁴ kg) and Moon (7.0 × 10²² kg) separated by 4.0 × 10⁸ m. (G = 6.7 × 10⁻¹¹ Nm²/kg²)",
      o: {
        A: "1.75 × 10²⁰ N",
        B: "1.75 × 10¹⁹ N",
        C: "1.75 × 10²¹ N",
        D: "1.75 × 10²² N"
      },
      a: "A"
    },
    {
      q: "The product PV has the same dimension as:",
      o: { A: "Pressure", B: "Force", C: "Work", D: "Density" },
      a: "C"
    },
    {
      q: "To determine the density of a liquid after measuring its volume, the student must measure its:",
      o: { A: "Temperature", B: "Pressure", C: "Mass", D: "Height" },
      a: "C"
    },
    {
      q: "When a body is thrown vertically upward, its velocity at maximum height is:",
      o: { A: "Maximum", B: "10 m/s", C: "Zero", D: "Constant" },
      a: "C"
    },
    {
      q: "Material that returns to original form after stress removal is said to be:",
      o: { A: "Plastic", B: "Elastic", C: "Rigid", D: "Brittle" },
      a: "B"
    },
    {
      q: "When linear momentum is constant, the net force acting is:",
      o: { A: "Maximum", B: "Zero", C: "Increasing", D: "Constant" },
      a: "B"
    },
    {
      q: "Which pair is made up of vectors?",
      o: {
        A: "Speed & displacement",
        B: "Mass & force",
        C: "Displacement & acceleration",
        D: "Momentum & length"
      },
      a: "C"
    },
    {
      q: "The SI unit of power is:",
      o: { A: "Joule", B: "Newton", C: "Watt", D: "Pascal" },
      a: "C"
    },
    {
      q: "A pendulum makes 50 oscillations in 60 seconds. Its period is:",
      o: { A: "1.2 s", B: "0.83 s", C: "0.5 s", D: "1.0 s" },
      a: "A"
    },
    {
      q: "A car starts from rest and covers 40 m in 10 s. Acceleration is:",
      o: { A: "0.4 m/s²", B: "0.8 m/s²", C: "4 m/s²", D: "2 m/s²" },
      a: "B"
    },
    {
      q: "Unit equivalent to Watt is:",
      o: {
        A: "kg·m·s⁻²",
        B: "kg·m²·s⁻³",
        C: "kg·m²·s⁻²",
        D: "kg·m²·s⁻¹"
      },
      a: "B"
    },
    {
      q: "If a = (−3 + t²) m/s² and velocity at t = 0 is zero, velocity at t = 3 s is:",
      o: { A: "15 m/s", B: "−3 m/s", C: "9 m/s", D: "6 m/s" },
      a: "D"
   }
    
],
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
