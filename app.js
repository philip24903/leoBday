(() => {
  const config = window.QUIZ_CONFIG;
  const questions = config.questions;

  const state = {
    currentIndex: 0,
    attemptsLeft: 3,
    resolved: false,
    resolvedCorrectly: false,
    interactionLocked: false,
    revealedSlots: new Set(),
    videoWatched: false,
    videoMissing: false,
    introIndex: 0,
    questionVideoPaths: [],
    questionVideoDurations: [],
    questionDurationsPromise: null,
    currentVideoPart: 0,
    betweenQuestionVideos: false,
    questionPlaybackActive: false,
    introMode: "opening"
  };

  const els = {
    moderatorScreen: document.getElementById("moderatorScreen"),
    moderatorGrid: document.getElementById("moderatorGrid"),
    introVideoScreen: document.getElementById("introVideoScreen"),
    introVideo: document.getElementById("introVideo"),
    introVideoFallback: document.getElementById("introVideoFallback"),
    introVideoPlayBtn: document.getElementById("introVideoPlayBtn"),
    introScreen: document.getElementById("introScreen"),
    quizScreen: document.getElementById("quizScreen"),
    finaleScreen: document.getElementById("finaleScreen"),
    startBtn: document.getElementById("startBtn"),
    questionCountIntro: document.getElementById("questionCountIntro"),
    questionLabel: document.getElementById("questionLabel"),
    progressCurrent: document.getElementById("progressCurrent"),
    progressTotal: document.getElementById("progressTotal"),
    progressBar: document.getElementById("progressBar"),
    solutionPanel: document.getElementById("solutionPanel"),
    solvedCount: document.getElementById("solvedCount"),
    letterBoard: document.getElementById("letterBoard"),
    video: document.getElementById("questionVideo"),
    postVideoImage: document.getElementById("postVideoImage"),
    videoActionBtn: document.getElementById("videoActionBtn"),
    videoMissing: document.getElementById("videoMissing"),
    missingCopy: document.getElementById("missingCopy"),
    answerEyebrow: document.getElementById("answerEyebrow"),
    answerTitle: document.getElementById("answerTitle"),
    answerHint: document.getElementById("answerHint"),
    answerForm: document.getElementById("answerForm"),
    answerInput: document.getElementById("answerInput"),
    submitBtn: document.getElementById("submitBtn"),
    attempts: document.getElementById("attempts"),
    revealBox: document.getElementById("revealBox"),
    revealedAnswer: document.getElementById("revealedAnswer"),
    continueBtn: document.getElementById("continueBtn"),
    reactionOverlay: document.getElementById("reactionOverlay"),
    reactionVideo: document.getElementById("reactionVideo"),
    reactionLabel: document.getElementById("reactionLabel"),
    reactionFallback: document.getElementById("reactionFallback"),
    reactionFallbackText: document.getElementById("reactionFallbackText"),
    reactionFallbackBtn: document.getElementById("reactionFallbackBtn"),
    reactionNextBtn: document.getElementById("reactionNextBtn"),
    toast: document.getElementById("toast"),
    finalWord: document.getElementById("finalWord"),
    flyingLetter: document.getElementById("flyingLetter"),
    confettiCanvas: document.getElementById("confettiCanvas")
  };

  const screens = [
    els.moderatorScreen,
    els.introVideoScreen,
    els.introScreen,
    els.quizScreen,
    els.finaleScreen
  ];

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

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
    screens.forEach(screen => {
      screen.classList.toggle("is-active", screen === target);
    });
  }

  let toastTimer = null;
  function showToast(message, duration = 2400) {
    window.clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.classList.remove("is-hidden");
    requestAnimationFrame(() => els.toast.classList.add("is-visible"));

    toastTimer = window.setTimeout(() => {
      els.toast.classList.remove("is-visible");
      window.setTimeout(() => els.toast.classList.add("is-hidden"), 220);
    }, duration);
  }

  let moderatorSwapLocked = false;

  function buildModeratorOptions() {
    els.moderatorGrid.innerHTML = "";

    config.moderatorOptions.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `moderator-option ${option.preferred ? "is-preferred" : "is-decoy"}`;
      button.dataset.preferred = option.preferred ? "true" : "false";
      button.style.order = String(index);

      if (option.preferred) {
        button.innerHTML = `
          <span class="moderator-badge">EMPFOHLEN</span>
          <strong>${option.label}</strong>
          <span class="moderator-select-copy">Auswählen →</span>
        `;
        button.addEventListener("click", startIntroSequence);
      } else {
        button.innerHTML = `
          <span class="moderator-badge moderator-badge-placeholder" aria-hidden="true">&nbsp;</span>
          <strong>${option.label}</strong>
          <span class="moderator-select-copy">Auswählen</span>
        `;
        button.addEventListener("pointerenter", event => {
          if (event.pointerType !== "touch") swapPreferredModeratorWith(button);
        });
        button.addEventListener("click", event => {
          event.preventDefault();
          event.stopPropagation();
          swapPreferredModeratorWith(button);
        });
      }

      els.moderatorGrid.appendChild(button);
    });
  }

  function swapPreferredModeratorWith(decoy) {
    if (!decoy || !decoy.classList.contains("is-decoy")) return;
    if (moderatorSwapLocked) return;

    const preferred = els.moderatorGrid.querySelector(".is-preferred");
    if (!preferred || preferred === decoy) return;

    const buttons = [...els.moderatorGrid.querySelectorAll(".moderator-option")];
    const firstRects = new Map(buttons.map(button => [button, button.getBoundingClientRect()]));
    const preferredOrder = preferred.style.order;

    preferred.style.order = decoy.style.order;
    decoy.style.order = preferredOrder;

    const lastRects = new Map(buttons.map(button => [button, button.getBoundingClientRect()]));
    moderatorSwapLocked = true;

    buttons.forEach(button => {
      const first = firstRects.get(button);
      const last = lastRects.get(button);
      const deltaX = first.left - last.left;
      const deltaY = first.top - last.top;

      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;

      button.animate(
        [
          { transform: `translate(${deltaX}px, ${deltaY}px)`, offset: 0 },
          { transform: "translate(0, 0)", offset: 1 }
        ],
        {
          duration: 520,
          easing: "cubic-bezier(.18,.82,.22,1)",
          fill: "none"
        }
      );
    });

    preferred.classList.add("is-jumping");
    window.setTimeout(() => {
      preferred.classList.remove("is-jumping");
      moderatorSwapLocked = false;
    }, 540);
  }

  els.moderatorGrid.addEventListener("pointermove", event => {
    if (event.pointerType === "touch" || moderatorSwapLocked) return;

    const decoys = [...els.moderatorGrid.querySelectorAll(".is-decoy")];
    let nearest = null;
    let nearestDistance = Infinity;

    decoys.forEach(button => {
      const rect = button.getBoundingClientRect();
      const dx = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right);
      const dy = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom);
      const distance = Math.hypot(dx, dy);
      if (distance < nearestDistance) {
        nearest = button;
        nearestDistance = distance;
      }
    });

    if (nearest && nearestDistance < 34) {
      swapPreferredModeratorWith(nearest);
    }
  });

  function startIntroSequence() {
    state.introMode = "opening";
    state.introIndex = 0;
    const topLine = els.introVideoScreen.querySelector(".intro-video-topline");
    if (topLine) topLine.classList.remove("is-hidden");
    showScreen(els.introVideoScreen);
    playIntroVideo(state.introIndex);
  }

  function showIntroFallback(message, mode) {
    els.introVideoFallback.querySelector("p").textContent = message;
    els.introVideoFallback.classList.remove("is-hidden");
    els.introVideoPlayBtn.dataset.mode = mode;
    els.introVideoPlayBtn.textContent = mode === "skip" ? "Überspringen" : "Video starten";
  }

  function advanceIntro() {
    els.introVideo.pause();
    state.introIndex += 1;
    if (state.introIndex >= config.media.introVideos.length) {
      els.introVideo.removeAttribute("src");
      els.introVideo.load();
      showScreen(els.introScreen);
      return;
    }
    playIntroVideo(state.introIndex);
  }

  function playIntroVideo(index) {
    const src = config.media.introVideos[index];
    els.introVideoFallback.classList.add("is-hidden");

    els.introVideo.pause();
    els.introVideo.removeAttribute("src");
    els.introVideo.load();
    els.introVideo.src = src;
    els.introVideo.load();

    els.introVideo.onended = advanceIntro;
    els.introVideo.onerror = () => {
      showIntroFallback(`Das Intro-Video ${pad2(index + 1)} wurde nicht gefunden.`, "skip");
    };

    const playPromise = els.introVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        showIntroFallback("Das Video konnte nicht automatisch gestartet werden.", "play");
      });
    }
  }

  els.introVideoPlayBtn.addEventListener("click", () => {
    if (els.introVideoPlayBtn.dataset.mode === "skip") {
      if (state.introMode === "finale") {
        showFinale();
      } else {
        advanceIntro();
      }
      return;
    }

    els.introVideoFallback.classList.add("is-hidden");
    els.introVideo.play().catch(() => {
      showIntroFallback(
        state.introMode === "finale"
          ? "Das Abschlussvideo lässt sich hier nicht starten. Du kannst direkt zum Geschenk weitergehen."
          : "Das Video lässt sich hier nicht starten. Du kannst es überspringen.",
        "skip"
      );
    });
  });

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

  function setAnswerInteraction(enabled) {
    const active = enabled && !state.resolved;
    els.answerInput.disabled = !active;
    els.submitBtn.disabled = !active;
    els.answerForm.classList.toggle("is-locked", !active);
  }

  function resetAnswerUi() {
    state.attemptsLeft = 3;
    state.resolved = false;
    state.resolvedCorrectly = false;
    state.interactionLocked = false;
    els.answerInput.value = "";
    els.answerInput.placeholder = "Erst Video vollständig ansehen …";
    setAnswerInteraction(false);
    els.revealBox.classList.add("is-hidden");
    els.continueBtn.classList.add("is-hidden");
    els.continueBtn.classList.remove("is-highlighted");
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
    els.videoActionBtn.classList.toggle(
      "is-resolved-replay",
      state.resolved && state.resolvedCorrectly && state.videoWatched && !state.videoMissing
    );

    if (state.betweenQuestionVideos) {
      els.videoActionBtn.disabled = true;
      els.videoActionBtn.textContent = "Gleich geht's weiter …";
      return;
    }

    if (state.videoMissing) {
      els.videoActionBtn.disabled = true;
      els.videoActionBtn.textContent = "Video fehlt";
      return;
    }

    if (!els.video.paused && !els.video.ended) {
      const remaining = totalQuestionRemainingTime();
      els.videoActionBtn.disabled = true;
      els.videoActionBtn.textContent = `Noch ${formatTime(remaining)}`;
      return;
    }

    els.videoActionBtn.disabled = false;
    els.videoActionBtn.textContent = state.videoWatched ? "Nochmal abspielen" : "Los geht's!";
  }

  function showPostVideoImage() {
    if (!els.postVideoImage.getAttribute("src")) {
      els.video.classList.add("is-obscured");
      return;
    }
    els.video.classList.add("is-hidden-media");
    els.postVideoImage.classList.remove("is-hidden");
  }

  function showQuestionVideo({ blurred = false } = {}) {
    els.postVideoImage.classList.add("is-hidden");
    els.video.classList.remove("is-hidden-media");
    els.video.classList.toggle("is-obscured", blurred);
  }

  function questionVideoPaths(question) {
    const files = Array.isArray(question.videoFiles) && question.videoFiles.length
      ? question.videoFiles
      : [`${pad2(question.id)}.mp4`];

    return files.map(file => `${config.media.questionsDirectory}/${file}`);
  }

  const videoDurationCache = new Map();

  function probeVideoDuration(src) {
    if (videoDurationCache.has(src)) {
      return Promise.resolve(videoDurationCache.get(src));
    }

    return new Promise(resolve => {
      const probe = document.createElement("video");
      probe.preload = "metadata";
      probe.muted = true;

      const finish = duration => {
        probe.removeAttribute("src");
        probe.load();
        const value = Number.isFinite(duration) ? duration : 0;
        videoDurationCache.set(src, value);
        resolve(value);
      };

      probe.addEventListener("loadedmetadata", () => finish(probe.duration), { once: true });
      probe.addEventListener("error", () => finish(0), { once: true });
      probe.src = src;
      probe.load();
    });
  }

  function preloadQuestionDurations(paths) {
    return Promise.all(paths.map(probeVideoDuration)).then(durations => {
      if (paths.length === state.questionVideoPaths.length &&
          paths.every((path, index) => path === state.questionVideoPaths[index])) {
        state.questionVideoDurations = durations;
        updateVideoActionButton();
      }
      return durations;
    });
  }

  function totalQuestionRemainingTime() {
    const currentDuration = Number.isFinite(els.video.duration)
      ? els.video.duration
      : (state.questionVideoDurations[state.currentVideoPart] || 0);
    let remaining = Math.max(0, currentDuration - (els.video.currentTime || 0));

    for (let index = state.currentVideoPart + 1; index < state.questionVideoPaths.length; index += 1) {
      remaining += state.questionVideoDurations[index] || 0;
    }

    // Die reale Sekunde Schwarzblende gehört zur verbleibenden Wartezeit dazu.
    const transitionsLeft = Math.max(0, state.questionVideoPaths.length - 1 - state.currentVideoPart);
    remaining += transitionsLeft;

    return remaining;
  }

  function currentQuestionVideoFilename() {
    const path = state.questionVideoPaths[state.currentVideoPart] || "";
    return path.split("/").pop() || `${pad2(questions[state.currentIndex].id)}.mp4`;
  }

  function setQuestionVideoSource(partIndex) {
    state.currentVideoPart = partIndex;
    state.videoMissing = false;
    els.videoMissing.classList.add("is-hidden");

    els.video.pause();
    els.video.removeAttribute("src");
    els.video.load();

    const src = state.questionVideoPaths[partIndex];
    const filename = currentQuestionVideoFilename();
    els.missingCopy.textContent = `Lege ${filename} in files/Fragen.`;
    els.video.src = src;
    els.video.load();
  }

  function reactionVideoPath(kind, question) {
    const directory = kind === "correct"
      ? config.media.correctDirectory
      : config.media.wrongDirectory;
    return `${directory}/${pad2(question.id)}.mp4`;
  }

  function loadQuestionVideo(question) {
    state.videoWatched = false;
    state.videoMissing = false;
    state.betweenQuestionVideos = false;
    state.questionPlaybackActive = false;
    state.questionVideoPaths = questionVideoPaths(question);
    state.questionVideoDurations = [];
    state.questionDurationsPromise = preloadQuestionDurations([...state.questionVideoPaths]);
    state.currentVideoPart = 0;
    els.video.style.opacity = "";
    els.video.parentElement.style.background = "";
    els.videoMissing.classList.add("is-hidden");

    const images = config.media.postImages || [];
    if (images.length) {
      els.postVideoImage.src = images[state.currentIndex % images.length];
    } else {
      els.postVideoImage.removeAttribute("src");
    }
    els.postVideoImage.alt = `Bild nach Frage ${pad2(question.id)}`;

    showQuestionVideo({ blurred: true });
    setQuestionVideoSource(0);
    updateVideoActionButton();
  }

  async function playCurrentVideo() {
    if (state.videoMissing || state.betweenQuestionVideos) return;

    if (state.questionVideoPaths.length > 1 && state.questionDurationsPromise) {
      els.videoActionBtn.disabled = true;
      els.videoActionBtn.textContent = "Wird vorbereitet …";
      await state.questionDurationsPromise.catch(() => {});
    }

    if (state.videoWatched) {
      setQuestionVideoSource(0);
    } else if (els.video.ended) {
      els.video.currentTime = 0;
    }

    state.questionPlaybackActive = true;
    els.video.style.opacity = "";
    els.video.parentElement.style.background = "";
    showQuestionVideo({ blurred: false });

    try {
      await els.video.play();
    } catch {
      state.questionPlaybackActive = false;
      showQuestionVideo({ blurred: true });
      els.videoActionBtn.disabled = false;
      els.videoActionBtn.textContent = state.videoWatched ? "Nochmal abspielen" : "Los geht's!";
    }
  }

  async function advanceQuestionVideoPart() {
    if (state.currentVideoPart >= state.questionVideoPaths.length - 1) return false;

    state.betweenQuestionVideos = true;
    updateVideoActionButton();

    // Eine Sekunde echte Schwarzblende zwischen Einstieg und eigentlicher Frage.
    els.video.style.opacity = "0";
    els.video.parentElement.style.background = "#000";
    await new Promise(resolve => window.setTimeout(resolve, 1000));

    setQuestionVideoSource(state.currentVideoPart + 1);

    try {
      showQuestionVideo({ blurred: false });
      await els.video.play();
      showQuestionVideo({ blurred: false });
      els.video.parentElement.style.background = "";
      requestAnimationFrame(() => {
        els.video.style.opacity = "1";
      });
    } catch {
      state.questionPlaybackActive = false;
      els.video.style.opacity = "";
      els.video.parentElement.style.background = "";
      showQuestionVideo({ blurred: true });
      els.videoActionBtn.disabled = false;
      els.videoActionBtn.textContent = "Video starten";
    } finally {
      state.betweenQuestionVideos = false;
      updateVideoActionButton();
    }

    return true;
  }

  function renderQuestion() {
    const question = questions[state.currentIndex];
    const ordinal = pad2(question.id);

    els.questionLabel.textContent = `Frage ${ordinal}`;
    els.progressCurrent.textContent = pad2(state.currentIndex + 1);
    els.progressTotal.textContent = String(questions.length);
    els.progressBar.style.width = `${((state.currentIndex + 1) / questions.length) * 100}%`;
    els.answerEyebrow.textContent = question.eyebrow || "Deine Lösung";
    els.answerTitle.textContent = question.title || "Wie lautet die Lösung?";
    els.answerHint.textContent = question.hint || "Gib das vollständige Lösungswort ein. Groß- und Kleinschreibung sind egal.";

    resetAnswerUi();
    loadQuestionVideo(question);

    if (state.currentIndex === 0 && state.revealedSlots.size === 0) {
      els.solutionPanel.classList.add("is-hidden");
    } else {
      els.solutionPanel.classList.remove("is-hidden");
    }

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
    els.flyingLetter.getAnimations().forEach(item => item.cancel());

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

  function playReaction(kind, question) {
    return new Promise(resolve => {
      let finished = false;
      const src = reactionVideoPath(kind, question);
      const waitsForNextClick = kind === "correct";

      function cleanupAndResolve() {
        if (finished) return;
        finished = true;
        els.reactionVideo.pause();
        els.reactionVideo.removeAttribute("src");
        els.reactionVideo.load();
        els.reactionOverlay.classList.add("is-hidden");
        els.reactionFallback.classList.add("is-hidden");
        els.reactionNextBtn.classList.add("is-hidden");
        els.reactionNextBtn.onclick = null;
        resolve();
      }

      function showNextButton() {
        if (!waitsForNextClick || finished) return;
        els.reactionNextBtn.classList.remove("is-hidden");
        els.reactionNextBtn.focus({ preventScroll: true });
      }

      els.reactionLabel.textContent = kind === "correct" ? "Richtig" : "Falsch";
      els.reactionLabel.className = `reaction-label ${kind === "correct" ? "is-correct" : "is-wrong"}`;
      els.reactionFallback.classList.add("is-hidden");
      els.reactionVideo.classList.remove("is-hidden");
      els.reactionNextBtn.classList.add("is-hidden");
      els.reactionOverlay.classList.remove("is-hidden");

      els.reactionNextBtn.onclick = cleanupAndResolve;
      els.reactionFallbackBtn.onclick = waitsForNextClick ? showNextButton : cleanupAndResolve;
      els.reactionVideo.onended = waitsForNextClick ? showNextButton : cleanupAndResolve;
      els.reactionVideo.onerror = () => {
        els.reactionVideo.classList.add("is-hidden");
        els.reactionFallbackText.textContent = `Das Reaktionsvideo ${pad2(question.id)}.mp4 wurde im Ordner ${kind === "correct" ? "Richtig" : "Falsch"} nicht gefunden.`;
        els.reactionFallback.classList.remove("is-hidden");
        if (waitsForNextClick) showNextButton();
      };

      els.reactionVideo.src = src;
      els.reactionVideo.load();
      const playPromise = els.reactionVideo.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          els.reactionVideo.classList.add("is-hidden");
          els.reactionFallbackText.textContent = "Das Reaktionsvideo konnte nicht automatisch gestartet werden.";
          els.reactionFallback.classList.remove("is-hidden");
          if (waitsForNextClick) showNextButton();
        });
      }
    });
  }

  async function resolveQuestion(correct, exhausted = false) {
    const question = questions[state.currentIndex];
    state.resolved = true;
    state.resolvedCorrectly = correct;
    state.interactionLocked = true;
    setAnswerInteraction(false);
    updateVideoActionButton();

    if (correct) {
      await playReaction("correct", question);
    } else if (exhausted) {
      els.revealedAnswer.textContent = question.displayAnswer;
      els.revealBox.classList.remove("is-hidden");
    }

    if (question.id === 1) {
      els.solutionPanel.classList.remove("is-hidden");
      buildBoard();
    } else {
      await animateLetterToSlot(question);
    }

    if (correct) {
      state.interactionLocked = false;
      goNext();
      return;
    }

    els.continueBtn.textContent = state.currentIndex === questions.length - 1
      ? "Geschenk enthüllen"
      : "Weiter zur nächsten Frage";
    els.continueBtn.classList.remove("is-hidden");
    els.continueBtn.classList.remove("is-highlighted");
    state.interactionLocked = false;
  }

  async function checkAnswer(rawValue) {
    if (state.resolved || state.interactionLocked) return;

    const value = normalize(rawValue);
    if (!value) {
      showToast("Gib zuerst eine Antwort ein.");
      return;
    }

    const question = questions[state.currentIndex];
    const accepted = question.answers.some(answer => normalize(answer) === value);

    if (accepted) {
      await resolveQuestion(true);
      return;
    }

    state.attemptsLeft -= 1;
    renderAttempts();

    if (state.attemptsLeft === 2) {
      state.interactionLocked = true;
      setAnswerInteraction(false);
      await playReaction("wrong", question);
      state.interactionLocked = false;
      setAnswerInteraction(true);
      els.answerInput.select();
      els.answerInput.focus();
      return;
    }

    if (state.attemptsLeft === 1) {
      showToast("Du hast jetzt nur noch einen Versuch.", 2800);
      els.answerInput.select();
      els.answerInput.focus();
      return;
    }

    if (state.attemptsLeft <= 0) {
      await resolveQuestion(false, true);
    }
  }

  function goNext() {
    if (!state.resolved || state.interactionLocked) return;

    if (state.currentIndex >= questions.length - 1) {
      playFinaleVideo();
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
    state.resolvedCorrectly = false;
    state.interactionLocked = false;
    state.revealedSlots.clear();
    buildBoard();
    showScreen(els.quizScreen);
    renderQuestion();
  }

  function playFinaleVideo() {
    state.introMode = "finale";
    const topLine = els.introVideoScreen.querySelector(".intro-video-topline");
    if (topLine) topLine.classList.add("is-hidden");

    showScreen(els.introVideoScreen);
    els.introVideoFallback.classList.add("is-hidden");
    els.introVideo.pause();
    els.introVideo.removeAttribute("src");
    els.introVideo.load();
    els.introVideo.src = config.media.finaleVideo;
    els.introVideo.load();

    els.introVideo.onended = showFinale;
    els.introVideo.onerror = () => {
      showIntroFallback("Das Abschlussvideo wurde nicht gefunden. Du kannst direkt zum Geschenk weitergehen.", "skip");
    };

    const playPromise = els.introVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        showIntroFallback("Das Abschlussvideo konnte nicht automatisch gestartet werden.", "play");
      });
    }
  }

  function showFinale() {
    els.video.pause();
    els.introVideo.pause();
    els.introVideo.removeAttribute("src");
    els.introVideo.load();
    const topLine = els.introVideoScreen.querySelector(".intro-video-topline");
    if (topLine) topLine.classList.remove("is-hidden");
    state.introMode = "opening";
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
      pieces.forEach(piece => {
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.rot += piece.vr;
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rot);
        ctx.globalAlpha = piece.alpha;
        const lightness = piece.tone > .5 ? 78 : 62;
        ctx.fillStyle = `hsl(39 52% ${lightness}%)`;
        ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
        ctx.restore();
      });

      if (now - start < 5200) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, width, height);
    }
    requestAnimationFrame(frame);
  }

  els.questionCountIntro.textContent = String(questions.length);
  els.progressTotal.textContent = String(questions.length);

  els.startBtn.addEventListener("click", startQuiz);

  els.answerForm.addEventListener("submit", event => {
    event.preventDefault();
    checkAnswer(els.answerInput.value);
  });

  els.continueBtn.addEventListener("click", goNext);
  els.videoActionBtn.addEventListener("click", playCurrentVideo);

  els.video.addEventListener("play", () => {
    showQuestionVideo({ blurred: false });
    updateVideoActionButton();
  });

  els.video.addEventListener("timeupdate", updateVideoActionButton);
  els.video.addEventListener("durationchange", updateVideoActionButton);

  els.video.addEventListener("pause", () => {
    if (!els.video.ended && !state.videoMissing && !state.betweenQuestionVideos) {
      showQuestionVideo({ blurred: true });
    }
    updateVideoActionButton();
  });

  els.video.addEventListener("ended", async () => {
    if (state.currentVideoPart < state.questionVideoPaths.length - 1) {
      await advanceQuestionVideoPart();
      return;
    }

    state.questionPlaybackActive = false;
    state.videoWatched = true;
    els.video.style.opacity = "";
    els.video.parentElement.style.background = "";
    showPostVideoImage();
    updateVideoActionButton();
    if (!state.resolved && !state.interactionLocked) {
      els.answerInput.placeholder = "Antwort eingeben …";
      setAnswerInteraction(true);
      window.setTimeout(() => els.answerInput.focus(), 120);
    }
  });

  els.video.addEventListener("error", () => {
    state.questionPlaybackActive = false;
    state.videoMissing = true;
    state.betweenQuestionVideos = false;
    els.video.style.opacity = "";
    els.video.parentElement.style.background = "";
    els.videoMissing.classList.remove("is-hidden");
    els.postVideoImage.classList.add("is-hidden");
    els.video.classList.add("is-hidden-media");
    updateVideoActionButton();
  });

  els.video.addEventListener("loadedmetadata", () => {
    state.videoMissing = false;
    els.videoMissing.classList.add("is-hidden");

    if (Number.isFinite(els.video.duration)) {
      state.questionVideoDurations[state.currentVideoPart] = els.video.duration;
      const src = state.questionVideoPaths[state.currentVideoPart];
      if (src) videoDurationCache.set(src, els.video.duration);
    }

    // Während einer laufenden Mehrteil-Frage darf der neu geladene Teil nicht wieder verschwimmen.
    showQuestionVideo({ blurred: !state.questionPlaybackActive });
    updateVideoActionButton();
  });

  els.postVideoImage.addEventListener("error", () => {
    els.postVideoImage.classList.add("is-hidden");
    els.postVideoImage.removeAttribute("src");
    els.video.classList.remove("is-hidden-media");
    els.video.classList.add("is-obscured");
  });

  buildModeratorOptions();
  buildBoard();
})();
