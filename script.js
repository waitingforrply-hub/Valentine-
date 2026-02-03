window.addEventListener("DOMContentLoaded", () => {
  // ---------- Helpers ----------
  function $(id){ return document.getElementById(id); }
  function show(stageId){
    document.querySelectorAll(".stage").forEach(s => s.classList.remove("active"));
    const el = $(stageId);
    if (el) el.classList.add("active");
  }
  function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

  // ---------- Elements ----------
  const terminal = $("terminal");
  const skipBtn = $("skipBtn");
  const startBtn = $("startBtn");
  const backToWelcomeBtn = $("backToWelcomeBtn");

  const quizTitle = $("quizTitle");
  const quizPrompt = $("quizPrompt");
  const qText = $("qText");
  const answers = $("answers");
  const toPhotosBtn = $("toPhotosBtn");

  const photoImg = $("photo");
  const caption = $("caption");
  const prevPhoto = $("prevPhoto");
  const nextPhoto = $("nextPhoto");
  const backToQuizBtn = $("backToQuizBtn");
  const toFinalBtn = $("toFinalBtn");

  const noBtn = $("noBtn");
  const yesBtn = $("yesBtn");
  const btnRow = $("btnRow");
  const hint = $("hint");

  const restartBtn = $("restartBtn");

  // ---------- Confetti ----------
  const canvas = $("confetti");
  const ctx = canvas ? canvas.getContext("2d") : null;

  function resize(){
    if (!canvas) return;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  window.addEventListener("resize", resize);
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

  // ---------- Stage 1: Welcome ----------
  let skipped = false;

  const introLines = [
    "Booting Quirky LoveOS…",
    "Scanning: Boo detected 💖",
    "Loading: my love for you..",
    "Calibrating: the butterflies in my stomach…",
    "Are you ready for me to steal your heart? 😌"
  ];

  async function typeLines(lines){
    if (!terminal) return;
    terminal.innerHTML = "";
    for (const line of lines){
      terminal.innerHTML += `> ${line}<br>`;
      if (!skipped) await sleep(1600); // comfortable reading pace
    }
  }

  if (skipBtn){
    skipBtn.addEventListener("click", () => {
      skipped = true;
      if (terminal) terminal.innerHTML = introLines.map(l => `> ${l}`).join("<br>");
    });
  }

  // Start typing immediately
  typeLines(introLines);

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

  function showQuizResult(){
    burstConfetti();

    if (quizTitle) quizTitle.textContent = "💘 Compatibility Approved";
    if (quizPrompt) quizPrompt.textContent = "The AI has completed its analysis and reached a conclusion.";
    if (qText) qText.textContent = "Result: 100% certified Valentine material ✅";

    if (answers){
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
    }

    if (toPhotosBtn){
      toPhotosBtn.disabled = false;
      toPhotosBtn.textContent = "Next: memories 📸";
    }
  }

  function renderQuestion(){
    if (!answers || !qText) return;

    if (idx >= quiz.length){
      showQuizResult();
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
        renderQuestion();
      });

      answers.appendChild(b);
    });
  }

  // Navigation: Welcome -> Quiz
  if (startBtn){
    startBtn.addEventListener("click", () => {
      show("stage-quiz");
      renderQuestion();
    });
  }
  if (backToWelcomeBtn){
    backToWelcomeBtn.addEventListener("click", () => show("stage-welcome"));
  }

  // ---------- Stage 3: Photos ----------
const photos = [
  { src: "images/1.jpg.JPG", cap: "Exhibit A: Mid way through 💖" },
  { src: "images/2.jpg.JPG", cap: "Exhibit B: Manifestation in background 😌" },
  { src: "images/3.jpg.JPG", cap: "Exhibit C: You know why I like this 📸" },
  { src: "images/4.jpg.JPG", cap: "Exhibit D: Where it all started ✨" }
];


  let p = 0;

function renderPhoto(){
  $("photo").src = photos[p].src;
  $("caption").textContent = photos[p].cap;
}


  // force correct sizing
  img.style.objectFit = "contain";   // stops zooming
  img.style.objectPosition = "center";
  img.style.background = "rgba(0,0,0,0.25)";

  img.src = photos[p].src;
  cap.textContent = photos[p].cap;
}


  if (toPhotosBtn){
    toPhotosBtn.addEventListener("click", () => {
      show("stage-photos");
      renderPhoto();
    });
  }

  if (prevPhoto) prevPhoto.addEventListener("click", () => { p = (p - 1 + photos.length) % photos.length; renderPhoto(); });
  if (nextPhoto) nextPhoto.addEventListener("click", () => { p = (p + 1) % photos.length; renderPhoto(); });

  if (backToQuizBtn) backToQuizBtn.addEventListener("click", () => show("stage-quiz"));
  if (toFinalBtn) toFinalBtn.addEventListener("click", () => show("stage-final"));

  // ---------- Stage 4: Final ----------
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

  if (noBtn){
    noBtn.addEventListener("mouseenter", () => {
      if (hint) hint.textContent = "Nice try 😈";
      moveNoButton();
      if (yesBtn){
        yesSize = Math.min(2.2, yesSize + 0.12);
        yesBtn.style.transform = `scale(${yesSize})`;
      }
    });

    noBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (hint) hint.textContent = "Button said: absolutely not.";
      moveNoButton();
    });
  }

  if (yesBtn){
    yesBtn.addEventListener("click", () => {
      burstConfetti();
      show("stage-end");
    });
  }

  // ---------- Restart ----------
  if (restartBtn){
    restartBtn.addEventListener("click", () => {
      idx = 0; score = 0; p = 0; yesSize = 1;
      if (yesBtn) yesBtn.style.transform = "scale(1)";
      if (noBtn){
        noBtn.style.position = "relative";
        noBtn.style.left = "0";
        noBtn.style.top = "0";
      }
      if (toPhotosBtn){
        toPhotosBtn.disabled = true;
        toPhotosBtn.textContent = "Next: memories 📸";
      }
      if (quizPrompt) quizPrompt.textContent = "Answer honestly. There are no wrong answers… except one 😈";
      show("stage-welcome");
      skipped = false;
      typeLines(introLines);
    });
  }
});
