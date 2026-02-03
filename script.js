// ---------- Helpers ----------
const $ = (id) => document.getElementById(id);
const show = (stageId) => {
  document.querySelectorAll(".stage").forEach(s => s.classList.remove("active"));
  $(stageId).classList.add("active");
};

const terminal = $("terminal");
const skipBtn = $("skipBtn");

let skipped = false;
skipBtn.addEventListener("click", () => {
  skipped = true;
  terminal.innerHTML = introLines.map(l => `> ${l}`).join("<br>");
});

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function typeLines(lines){
  terminal.innerHTML = "";
  for (const line of lines){
    terminal.innerHTML += `> ${line}<br>`;
    if (!skipped) await sleep(3200);
  }
}


// ---------- Stage 1: Welcome ----------
const introLines = [
  "Booting Quirky LoveOS…",
  "Scanning: BooBoo detected 💖",
  "Loading: my love for you..%",
  "Calibrating: the butterflies in my stomach…",
  "Are you ready for me to steal your heart? 😌"
];


(async () => {
  await typeLines(introLines);
})();

$("startBtn").addEventListener("click", () => {
  show("stage-quiz");
  renderQuestion();
});

$("backToWelcomeBtn").addEventListener("click", () => show("stage-welcome"));

// ---------- Stage 2: Quiz ----------
const quiz = [
  {
    q: "First things first… what are we?",
    a: ["Just vibing 😌", "A problem (for everyone else) 😈", "Power couple 👩‍❤️‍👨"],
    points: [1, 3, 5]
  },
  {
    q: "Pick our perfect date:",
    a: ["Food + yap yap yap 🍜", "Movie + snacks + cuddles 🍿", "Surprise plan 😏"],
    points: [2, 3, 4]
  },
  {
    q: "Which one is my weakness?",
    a: ["You 😇", "Neck kissess 💋", "Your charm 🥰"],
    points: [2, 3, 5]
  },
  {
    q: "Important security question:",
    a: ["Do you like me?", "Do you REALLY like me?", "Okay fine I love you 😤💖"],
    points: [1, 2, 6]
  },
  {
    q: "Final quiz question (no pressure):",
    a: ["I choose you over everything", "I choose you over everything", "I choose you over everything"],
    points: [3, 5, 7]
  }
];


let idx = 0;
let score = 0;

function renderQuestion(){
  const item = quiz[idx];
  $("qText").textContent = item.q;

  const answers = $("answers");
  answers.innerHTML = "";
  item.a.forEach((label, i) => {
    const b = document.createElement("button");
    b.className = "answer";
    b.textContent = label;
    b.addEventListener("click", () => {
      score += item.points[i];
      idx++;
      if (idx >= quiz.length){
        $("quizPrompt").textContent = `Result: 100% compatible. (Score: ${score})`;
        $("toPhotosBtn").disabled = false;
        $("qText").textContent = "You passed. Obviously.";
        answers.innerHTML = "";
      } else {
        renderQuestion();
      }
    });
    answers.appendChild(b);
  });
}

$("toPhotosBtn").addEventListener("click", () => {
  show("stage-photos");
  renderPhoto();
});

// ---------- Stage 3: Photos ----------
/*
Replace these with your own images later.
Easiest: upload images to the repo inside a folder called "images"
then change src to: "images/1.jpg", "images/2.jpg", etc.
*/
const photos = [
  { src: "https://picsum.photos/id/1062/1200/800", cap: "Exhibit A: You being cute." },
  { src: "https://picsum.photos/id/1027/1200/800", cap: "Exhibit B: Me pretending I’m cool." },
  { src: "https://picsum.photos/id/1035/1200/800", cap: "Exhibit C: Us = unstoppable." }
];

let p = 0;

function renderPhoto(){
  $("photo").src = photos[p].src;
  $("caption").textContent = photos[p].cap;
}

$("prevPhoto").addEventListener("click", () => { p = (p - 1 + photos.length) % photos.length; renderPhoto(); });
$("nextPhoto").addEventListener("click", () => { p = (p + 1) % photos.length; renderPhoto(); });

$("backToQuizBtn").addEventListener("click", () => show("stage-quiz"));
$("toFinalBtn").addEventListener("click", () => show("stage-final"));

// ---------- Stage 4: Final (No escapes / Yes grows) ----------
const noBtn = $("noBtn");
const yesBtn = $("yesBtn");
const btnRow = $("btnRow");
const hint = $("hint");

let yesSize = 1;

function moveNoButton(){
  const rowRect = btnRow.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  // Random position within the button row area
  const maxX = Math.max(0, rowRect.width - btnRect.width);
  const maxY = Math.max(0, rowRect.height - btnRect.height);

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

noBtn.addEventListener("mouseenter", () => {
  hint.textContent = "Nice try 😈";
  moveNoButton();

  // Also grow YES slightly each time she tries to say no
  yesSize = Math.min(2.2, yesSize + 0.12);
  yesBtn.style.transform = `scale(${yesSize})`;
});

noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  hint.textContent = "Button said: absolutely not.";
  moveNoButton();
});

yesBtn.addEventListener("click", () => {
  burstConfetti();
  show("stage-end");
});

$("restartBtn").addEventListener("click", () => {
  // reset
  idx = 0; score = 0; p = 0; yesSize = 1;
  yesBtn.style.transform = "scale(1)";
  noBtn.style.position = "relative";
  noBtn.style.left = "0";
  noBtn.style.top = "0";
  $("toPhotosBtn").disabled = true;
  $("quizPrompt").textContent = "Answer honestly. There are no wrong answers… except one 😈";
  show("stage-welcome");
  typeLines(introLines);
});

// ---------- Confetti (simple) ----------
const canvas = $("confetti");
const ctx = canvas.getContext("2d");
function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener("resize", resize); resize();

function burstConfetti(){
  const pieces = Array.from({length: 180}, () => ({
    x: innerWidth/2,
    y: innerHeight/3,
    vx: (Math.random()*10 - 5),
    vy: (Math.random()*-10 - 2),
    g: 0.22 + Math.random()*0.08,
    s: 2 + Math.random()*4,
    a: 1
  }));
  let t = 0;
  (function anim(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.a -= 0.006;
      ctx.globalAlpha = Math.max(p.a, 0);
      ctx.fillRect(p.x, p.y, p.s, p.s);
    });
    ctx.globalAlpha = 1;
    t++;
    if (t < 240) requestAnimationFrame(anim);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  })();
}
