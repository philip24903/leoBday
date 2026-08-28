(() => {
  const config = window.QUIZ_CONFIG;
  const questions = config.questions;

  const state = {
    currentIndex: 0,
    attemptsLeft: 3,
    resolved: false,
    revealedSlots: new Set(),
    videoWatched: false,
    videoMissing: false
  };

  const els = {
    introScreen: document.getElementById("introScreen"),
    quizScreen: document.getElementById("quizScreen"),
    finaleScreen: document.getElementById("finaleScreen"),
    startBtn: document.getElementById("startBtn"),
    restartBtn: document.getElementById("restartBtn"),
    questionLabel: document.getElementById("questionLabel"),
    progressCurrent: document.getElementById("progressCurrent"),
    progressBar: document.getElementById("progressBar"),
    solutionPanel: document.getElementById("solutionPanel"),
    solvedCount: document.getElementById("solvedCount"),
    letterBoard: document.getElementById("letterBoard"),
    video: document.getElementById("questionVideo"),
    postVideoImage: document.getElementById("postVideoImage"),
    videoActionBtn: document.getElementById("videoActionBtn"),
    videoMissing: document.getElementById("videoMissing"),
    missingCopy: document.getElementById("missingCopy"),
    answerTitle: document.getElementById("answerTitle"),
    answerHint: document.getElementById("answerHint"),
    answerForm: document.getElementById("answerForm"),
    answerInput: document.getElementById("answerInput"),
    submitBtn: document.getElementById("submitBtn"),
    attempts: document.getElementById("attempts"),
    feedback: document.getElementById("feedback"),
    revealBox: document.getElementById("revealBox"),
    revealedAnswer: document.getElementById("revealedAnswer"),
    continueBtn: document.getElementById("continueBtn"),
    flyingLetter: document.getElementById("flyingLetter"),
    confettiCanvas: document.getElementById("confettiCanvas")
  };

  function normalize(value) {
    return value
      .trim()
      .toLocaleLowerCase("de-DE")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[–—]/g, "-")
      .replace(/\s+/g, " ");
  }

  function showScreen(target) {
    [els.introScreen, els.quizScreen, els.finaleScreen].forEach(screen => {
      screen.classList.toggle("is-active", screen === target);
    });
  }

  function buildBoard() {
    els.letterBoard.innerHTML = "";
    config.slots.forEach((char, index) => {
      const slot = document.createElement("div");
      slot.className = "letter-slot" + (char === " " ? " is-space" : "");
      slot.dataset.index = index;
      slot.setAttribute("aria-label", `Zeichen ${index + 1}`);
      if (state.revealedSlots.has(index)) {
        slot.classList.add("is-filled");
        slot.textContent = char === " " ? "" : char;
      }
      els.letterBoard.appendChild(slot);
    });
    updateSolvedCount();
  }

  function updateSolvedCount() {
    els.solvedCount.textContent = String(state.revealedSlots.size);
  }

  function renderAttempts() {
    els.attempts.innerHTML = `
      <span class="attempts-label">Übrige<br>Versuche</span>
      <strong class="attempts-number">${state.attemptsLeft}</strong>
    `;
    els.attempts.classList.toggle("is-last", state.attemptsLeft === 1);
    els.attempts.classList.toggle("is-empty", state.attemptsLeft === 0);
  }

  function resetAnswerUi() {
    state.attemptsLeft = 3;
    state.resolved = false;
    els.answerInput.value = "";
    els.answerInput.disabled = false;
    els.submitBtn.disabled = false;
    els.feedback.textContent = "";
    els.feedback.className = "feedback";
    els.revealBox.classList.add("is-hidden");
    els.continueBtn.classList.add("is-hidden");
    renderAttempts();
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "--:--";
    const total = Math.ceil(seconds);
    const minutes = Math.floor(total / 60);
    const secs = total % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function updateVideoActionButton() {
    els.videoActionBtn.classList.toggle("is-missing", state.videoMissing);

    if (state.videoMissing) {
      els.videoActionBtn.disabled = true;
      els.videoActionBtn.textContent = "Video fehlt";
      return;
    }

    if (!els.video.paused && !els.video.ended) {
      const remaining = els.video.duration - els.video.currentTime;
      els.videoActionBtn.disabled = true;
      els.videoActionBtn.textContent = `Noch ${formatTime(remaining)}`;
      return;
    }

    els.videoActionBtn.disabled = false;
    els.videoActionBtn.textContent = state.videoWatched ? "Nochmal abspielen" : "Los geht's!";
  }

  function showPostVideoImage() {
    els.video.classList.add("is-hidden-media");
    els.postVideoImage.classList.remove("is-hidden");
  }

  function showVideo({ blurred = false } = {}) {
    els.postVideoImage.classList.add("is-hidden");
    els.video.classList.remove("is-hidden-media");
    els.video.classList.toggle("is-obscured", blurred);
  }

  function loadVideo(question) {
    els.video.pause();
    els.video.removeAttribute("src");
    els.video.load();

    state.videoWatched = false;
    state.videoMissing = false;
    els.videoMissing.classList.add("is-hidden");
    els.missingCopy.textContent = `Lege ${question.video} in den Unterordner files.`;

    const images = config.postImages || [];
    if (images.length) {
      els.postVideoImage.src = images[state.currentIndex % images.length];
    } else {
      els.postVideoImage.removeAttribute("src");
    }
    els.postVideoImage.alt = `Bild nach Frage ${String(question.id).padStart(2, "0")}`;

    showVideo({ blurred: true });
    els.video.src = question.video;
    els.video.load();
    updateVideoActionButton();
  }

  async function playCurrentVideo() {
    if (state.videoMissing) return;

    if (state.videoWatched || els.video.ended) {
      els.video.currentTime = 0;
    }

    showVideo({ blurred: false });

    try {
      await els.video.play();
    } catch {
      showVideo({ blurred: true });
      els.videoActionBtn.disabled = false;
      els.videoActionBtn.textContent = state.videoWatched ? "Nochmal abspielen" : "Los geht's!";
    }
  }

  function renderQuestion() {
    const question = questions[state.currentIndex];
    const ordinal = String(question.id).padStart(2, "0");

    els.questionLabel.textContent = `Frage ${ordinal}`;
    els.progressCurrent.textContent = String(state.currentIndex + 1).padStart(2, "0");
    els.progressBar.style.width = `${((state.currentIndex + 1) / questions.length) * 100}%`;
    els.answerTitle.textContent = question.title || "Wie lautet die Lösung?";
    els.answerHint.textContent = question.hint || "Gib das vollständige Lösungswort ein. Groß- und Kleinschreibung sind egal.";

    resetAnswerUi();
    loadVideo(question);

    // Erst nach der Einstiegsfrage werden die 12 Platzhalter sichtbar.
    if (state.currentIndex === 0 && state.revealedSlots.size === 0) {
      els.solutionPanel.classList.add("is-hidden");
    } else {
      els.solutionPanel.classList.remove("is-hidden");
    }

    setTimeout(() => els.answerInput.focus(), 180);
  }

  async function animateLetterToSlot(question) {
    if (question.slotIndex === null || question.slotIndex === undefined) return;
    if (state.revealedSlots.has(question.slotIndex)) return;

    const slot = els.letterBoard.querySelector(`[data-index="${question.slotIndex}"]`);
    if (!slot) return;

    const sourceRect = els.answerInput.getBoundingClientRect();
    const targetRect = slot.getBoundingClientRect();
    const isSpace = question.letter === " ";
    const symbol = isSpace ? "·" : question.letter;

    els.flyingLetter.textContent = symbol;
    els.flyingLetter.style.display = "grid";
    els.flyingLetter.style.left = `${sourceRect.left + sourceRect.width / 2 - 29}px`;
    els.flyingLetter.style.top = `${sourceRect.top + sourceRect.height / 2 - 29}px`;

    const dx = (targetRect.left + targetRect.width / 2) - (sourceRect.left + sourceRect.width / 2);
    const dy = (targetRect.top + targetRect.height / 2) - (sourceRect.top + sourceRect.height / 2);

    const animation = els.flyingLetter.animate([
      { transform: "translate(0, 0) scale(.7)", opacity: 0 },
      { transform: "translate(0, -22px) scale(1.08)", opacity: 1, offset: .22 },
      { transform: `translate(${dx}px, ${dy}px) scale(.76)`, opacity: 1 }
    ], {
      duration: 900,
      easing: "cubic-bezier(.18,.78,.22,1)",
      fill: "forwards"
    });

    await animation.finished.catch(() => {});
    els.flyingLetter.style.display = "none";
    els.flyingLetter.getAnimations().forEach(a => a.cancel());

    state.revealedSlots.add(question.slotIndex);
    slot.classList.add("is-filled");
    slot.textContent = isSpace ? "" : question.letter;
    updateSolvedCount();

    slot.animate([
      { transform: "scale(.82)", boxShadow: "0 0 0 rgba(214,173,98,0)" },
      { transform: "scale(1.08)", boxShadow: "0 0 34px rgba(214,173,98,.20)" },
      { transform: "scale(1)", boxShadow: "0 0 0 rgba(214,173,98,0)" }
    ], { duration: 520, easing: "ease-out" });
  }

  async function resolveQuestion(correct, exhausted = false) {
    const question = questions[state.currentIndex];
    state.resolved = true;
    els.answerInput.disabled = true;
    els.submitBtn.disabled = true;

    if (correct) {
      els.feedback.textContent = question.id === 1
        ? "Richtig. Jetzt weißt du, wie viele Zeichen dein Lösungswort hat."
        : "Richtig. Der nächste Buchstabe gehört dir.";
      els.feedback.className = "feedback success";
    } else if (exhausted) {
      els.feedback.textContent = "Drei Versuche sind vorbei. Du bekommst die richtige Lösung trotzdem.";
      els.feedback.className = "feedback error";
      els.revealedAnswer.textContent = question.displayAnswer;
      els.revealBox.classList.remove("is-hidden");
    }

    if (question.id === 1) {
      (config.giftedSlots || []).forEach(index => state.revealedSlots.add(index));
      els.solutionPanel.classList.remove("is-hidden");
      buildBoard();
    } else {
      await animateLetterToSlot(question);
    }

    els.continueBtn.textContent = state.currentIndex === questions.length - 1
      ? "Geschenk enthüllen"
      : "Weiter zur nächsten Frage";
    els.continueBtn.classList.remove("is-hidden");
  }

  function checkAnswer(rawValue) {
    if (state.resolved) return;
    const value = normalize(rawValue);
    if (!value) {
      els.feedback.textContent = "Gib zuerst eine Antwort ein.";
      els.feedback.className = "feedback error";
      return;
    }

    const question = questions[state.currentIndex];
    const accepted = question.answers.some(answer => normalize(answer) === value);

    if (accepted) {
      resolveQuestion(true);
      return;
    }

    state.attemptsLeft -= 1;
    renderAttempts();

    if (state.attemptsLeft <= 0) {
      resolveQuestion(false, true);
    } else {
      const noun = state.attemptsLeft === 1 ? "Versuch" : "Versuche";
      els.feedback.textContent = `Leider falsch. Noch ${state.attemptsLeft} ${noun}.`;
      els.feedback.className = "feedback error";
      els.answerInput.select();
    }
  }

  function goNext() {
    if (!state.resolved) return;
    if (state.currentIndex >= questions.length - 1) {
      showFinale();
      return;
    }
    state.currentIndex += 1;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startQuiz() {
    state.currentIndex = 0;
    state.attemptsLeft = 3;
    state.resolved = false;
    state.revealedSlots.clear();
    buildBoard();
    showScreen(els.quizScreen);
    renderQuestion();
  }

  function showFinale() {
    els.video.pause();
    showScreen(els.finaleScreen);
    els.finalWord.textContent = config.finalPhrase;
    launchConfetti();
  }

  function launchConfetti() {
    const canvas = els.confettiCanvas;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: -30 - Math.random() * height * .5,
      w: 4 + Math.random() * 6,
      h: 8 + Math.random() * 10,
      vy: 2.2 + Math.random() * 3.4,
      vx: -1.1 + Math.random() * 2.2,
      rot: Math.random() * Math.PI,
      vr: -.08 + Math.random() * .16,
      alpha: .55 + Math.random() * .45,
      tone: Math.random()
    }));

    const start = performance.now();
    function frame(now) {
      ctx.clearRect(0, 0, width, height);
      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;
        const lightness = p.tone > .5 ? 78 : 62;
        ctx.fillStyle = `hsl(39 52% ${lightness}%)`;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (now - start < 5200) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, width, height);
    }
    requestAnimationFrame(frame);
  }

  els.startBtn.addEventListener("click", startQuiz);
  els.restartBtn.addEventListener("click", () => {
    showScreen(els.introScreen);
  });

  els.answerForm.addEventListener("submit", event => {
    event.preventDefault();
    checkAnswer(els.answerInput.value);
  });

  els.continueBtn.addEventListener("click", goNext);

  els.videoActionBtn.addEventListener("click", playCurrentVideo);

  els.video.addEventListener("play", () => {
    showVideo({ blurred: false });
    updateVideoActionButton();
  });

  els.video.addEventListener("timeupdate", updateVideoActionButton);
  els.video.addEventListener("durationchange", updateVideoActionButton);

  els.video.addEventListener("pause", () => {
    if (!els.video.ended && !state.videoMissing) {
      showVideo({ blurred: true });
    }
    updateVideoActionButton();
  });

  els.video.addEventListener("ended", () => {
    state.videoWatched = true;
    showPostVideoImage();
    updateVideoActionButton();
  });

  els.video.addEventListener("error", () => {
    state.videoMissing = true;
    els.videoMissing.classList.remove("is-hidden");
    els.postVideoImage.classList.add("is-hidden");
    els.video.classList.add("is-hidden-media");
    updateVideoActionButton();
  });

  els.video.addEventListener("loadedmetadata", () => {
    state.videoMissing = false;
    els.videoMissing.classList.add("is-hidden");
    showVideo({ blurred: true });
    updateVideoActionButton();
  });

  els.postVideoImage.addEventListener("error", () => {
    // Falls ein Standbild noch fehlt, bleibt nach dem Video eine neutrale Fläche sichtbar.
    els.postVideoImage.removeAttribute("src");
    els.postVideoImage.alt = "Standbild noch nicht vorhanden";
  });

  buildBoard();
})();
