// ---------- Helpers ----------
const $ = (id) => document.getElementById(id);
const show = (stageId) => {
  document.querySelectorAll(".stage").forEach(s => s.classList.remove("active"));
  const el = $(stageId);
  if (el) el.classList.add("active");
};

const terminal = $("terminal");
const skipBtn = $("skipBtn");

let skipped = false;

// ---------- Confetti (define early so it's always available) ----------
const canvas = $("confetti");
const ctx = canvas ? canvas.getContext("2d") : null;

function resize(){
  if (!canvas) return;
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
addEventListener("resize", resize);
resize();

function burstConfetti(){
  if (!ctx || !canvas) return;

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

// ---------- Typing ----------
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function typeLines(lines){
  if (!terminal) return;
  terminal.innerHTML = "";
  for (const line of lines){
    terminal.innerHTML += `> ${line}<br>`;
    if (!skipped) await sleep(3200); // your slow timing
  }
}

if (skipBtn) {
  skipBtn.addEventListener("click", () => {
    skipped = true;
    if (terminal) terminal.innerHTML = introLines.map(l => `> ${l}`).join("<br>");
  });
}

// ---------- Stage 1: Welcome ----------
const introLines = [
  "Booting Quirky LoveOS…",
  "Scanning: Boo detected 💖",
  "Loading: my love for you..",
  "Calibrating: the butterflies in my stomach…",
  "Are you ready for me to steal your heart? 😌"
];

(async () => {
  await typeLines(introLines);
})();

$("startBtn")?.addEventListener("click", () => {
  show("stage-quiz");
  renderQuestion();
});

$("backToWelcomeBtn")?.addEventListener("click", () => show("stage-welcome"));

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
  const answers = $("answers");
  const qText = $("qText");
  if (!answers || !qText) return;

  // If idx somehow went out of range, show results safely
  if (idx >= quiz.length){
    showQuizResult(answers);
    return;
  }

  const item = quiz[idx];
  qText.textContent = item.q;

  answers.innerHTML = "";
  item.a.forEach((label, i) => {
    const b = document.createElement("button");
    b.className = "answer";
    b.textContent = label;

    b.addEventListener("click", () => {
      score += item.points[i];
      idx++;

      if (idx >= quiz.length){
        showQuizResult(answers);
      } else {
        renderQuestion();
      }
    });

    answers.appendChild(b);
  });
}

function showQuizResult(answers){
  burstConfetti();

  const qt = $("quizTitle");
  const qp = $("quizPrompt");
  const qText = $("qText");

  if (qt) qt.textContent = "💘 Compatibility Approved";
  if (qp) qp.textContent = "The AI has completed its analysis and reached a conclusion.";
  if (qText) qText.textContent = "Result: 100% certified Valentine material ✅";

  answers.innerHTML = `
    <div class="cert">
      <div class="certTop">
        <div class="certBadge">💘 Love Certificate</div>
        <div class="certId">ID: LOVE-001</div>
      </div>

      <div class="certMain">
        <div class="certLine"><span>Issued To:</span> BooBoo</div>
        <div class="certLine"><span>Issued By:</span> Your favourite human 😌</div>
        <div class="certLine"><span>Status:</span> APPROVED ✅</div>
        <div class="certLine"><span>Valid Until:</span> Forever ♾️</div>
      </div>

      <div class="certFooter">
        <div class="stamp">APPROVED</div>
        <div class="smallNote">
          Redeemable for hugs, dates, and unlimited "come here" moments.
        </div>
      </div>
    </div>
  `;

  const nextBtn = $("toPhotosBtn");
  if (nextBtn){
    nextBtn.disabled = false;
    nextBtn.textContent = "Next: memories 📸";
  }
}

$("toPhotosBtn")?.addEventListener("click", () => {
  show("stage-photos");
  renderPhoto();
});

// ---------- Stage 3: Photos ----------
const photos = [
  { src: "https://picsum.photos/id/1062/1200/800", cap: "Exhibit A: You being cute." },
  { src: "https://picsum.photos/id/1027/1200/800", cap: "Exhibit B: Me pretending I’m cool." },
  { src: "https://picsum.photos/id/1035/1200/800", cap: "Exhibit C: Us = unstoppable." }
];

let p = 0;

function renderPhoto(){
  const img = $("photo");
  const cap = $("caption");
  if (!img || !cap) return;
  img.src = photos[p].src;
  cap.textContent = photos[p].cap;
}

$("prevPhoto")?.addEventListener("click", () => { p = (p - 1 + photos.length) % photos.length; renderPhoto(); });
$("nextPhoto")?.addEventListener("click", () => { p = (p + 1) % photos.length; renderPhoto(); });

$("backToQuizBtn")?.addEventListener("click", () => show("stage-quiz"));
$("toFinalBtn")?.addEventListener("click", () => show("stage-final"));

// ---------- Stage 4: Final (No escapes / Yes grows) ----------
const noBtn = $("noBtn");
const yesBtn = $("yesBtn");
const btnRow = $("btnRow");
const hint = $("hint");

let yesSize = 1;

function moveNoButton(){
  if (!btnRow || !noBtn) return;

  const rowRect = btnRow.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const maxX = Math.max(0, rowRect.width - btnRect.width);
  const maxY = Math.max(0, rowRect.height - btnRect.height);

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

noBtn?.addEventListener("mouseenter", () => {
  if (hint) hint.textContent = "Nice try 😈";
  moveNoButton();

  if (yesBtn){
    yesSize = Math.min(2.2, yesSize + 0.12);
    yesBtn.style.transform = `scale(${yesSize})`;
  }
});

noBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  if (hint) hint.textContent = "Button said: absolutely not.";
  moveNoButton();
});

yesBtn?.addEventListener("click", () => {
  burstConfetti();
  show("stage-end");
});

$("restartBtn")?.addEventListener("click", () => {
  idx = 0; score = 0; p = 0; yesSize = 1;

  if (yesBtn) yesBtn.style.transform = "scale(1)";
  if (noBtn){
    noBtn.style.position = "relative";
    noBtn.style.left = "0";
    noBtn.style.top = "0";
  }

  const nextBtn = $("toPhotosBtn");
  if (nextBtn){
    nextBtn.disabled = true;
    nextBtn.textContent = "Next: memories 📸";
  }

  const qp = $("quizPrompt");
  if (qp) qp.textContent = "Answer honestly. There are no wrong answers… except one 😈";

  show("stage-welcome");
  typeLines(introLines);
});
