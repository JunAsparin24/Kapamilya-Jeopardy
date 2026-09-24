/* =========================================================
   final-wager.js — FINAL WAGER, after the last round and
   before Fast Money. The questions are in questions.js.

     1. CATEGORY: the teams agree on one of the categories and
                  the host clicks it
     2. WAGER:    each team types its wager on their phone (up to
                  the points they have). Nobody sees the amounts;
                  the screen only shows who has locked in
     3. QUESTION: the host shows the question and starts the
                  timer; teams write their answer on a whiteboard
     4. REVEAL:   for each team the host reveals the wager, then
                  clicks ✓ (+ wager) or ✗ (− wager)
   Then the top two teams go on to Fast Money.

   Without the buzzers (game opened as a plain file), the host
   types each team's wager in at the reveal instead.
   ========================================================= */

const finalWagerStatus = document.getElementById("fw-status");
const finalWagerCategoryCards = document.getElementById("fw-categories");
const finalWagerMain = document.getElementById("fw-main");
const finalWagerCategoryElement = document.getElementById("fw-category");
const finalWagerQuestionElement = document.getElementById("fw-question");
const finalWagerTimer = document.getElementById("fw-timer");
const finalWagerAnswerElement = document.getElementById("fw-answer");
const finalWagerTeams = document.getElementById("fw-teams");
const finalWagerBackButton = document.getElementById("fw-back-button");
const finalWagerTimerButton = document.getElementById("fw-timer-button");
const finalWagerAnswerButton = document.getElementById("fw-answer-button");
const finalWagerNextButton = document.getElementById("fw-next-button");

// step: "category" → "wager" → "question" → "reveal"
let finalWager = null;

/* =========================================================
   STARTING
   ========================================================= */

function resetFinalWager() {
  const wasOnPhones = finalWager && finalWager.usePhones;
  stopFinalWagerTimer();
  finalWager = null;
  if (wasOnPhones) finalWagerRequest("/api/fw/end");
}

// Sets everything up. main.js shows the screen.
function prepareFinalWager() {
  resetFinalWager();
  finalWager = {
    step: "category",
    usePhones: isBuzzerConnected, // buzzer-host.js
    categoryIndex: null,
    // A random question from each category, picked fresh every game
    // (questionPicks[categoryIndex] = which question in that category)
    questionPicks: finalWagerQuestions.map((category) => Math.floor(Math.random() * category.questions.length)),
    maxes: {},          // teamId -> most they may wager
    lockedTeamIds: [],  // teams whose phone has sent a wager
    wagers: {},         // teamId -> amount (known after the reveal step starts)
    wagerShown: {},     // teamId -> true once the host revealed it
    results: {},        // teamId -> 1 (✓), -1 (✗) or 0
    answerShown: false,
    timeLeftMs: FINAL_WAGER_SECONDS * 1000,
    timerId: null,
    timerEndsAt: 0,
  };
  renderFinalWager();
}

// The chosen category with this game's randomly picked question:
// { name, question, answer }
function getFinalWagerCategory() {
  const category = finalWagerQuestions[finalWager.categoryIndex];
  const picked = category.questions[finalWager.questionPicks[finalWager.categoryIndex]];
  return { name: category.name, question: picked.question, answer: picked.answer };
}

function finalWagerRequest(path, data = {}) {
  return fetch(path, { method: "POST", body: JSON.stringify(data), cache: "no-store" })
    .then((response) => response.json())
    .catch(() => null);
}

/* =========================================================
   DRAWING THE SCREEN
   ========================================================= */

function renderFinalWager() {
  if (!finalWager) return;
  const { step } = finalWager;
  const category = finalWager.categoryIndex === null ? null : getFinalWagerCategory();

  // Step 1: category cards
  finalWagerCategoryCards.hidden = step !== "category";
  if (step === "category") renderFinalWagerCategories();

  // Category, question, timer, answer
  finalWagerMain.hidden = step === "category";
  if (category) {
    finalWagerCategoryElement.textContent = category.name;
    finalWagerQuestionElement.textContent = category.question;
    finalWagerAnswerElement.textContent = category.answer;
  }
  finalWagerQuestionElement.hidden = step === "category" || step === "wager";
  finalWagerTimer.hidden = step !== "question";
  finalWagerAnswerElement.hidden = !finalWager.answerShown;

  finalWagerStatus.textContent = {
    category: "Teams: agree on ONE category",
    wager: finalWager.usePhones
      ? "Enter your wager on your phone — up to the points you have"
      : "Decide your wager — up to the points you have. Tell the host at the reveal",
    question: "Write your answer on your whiteboard",
    reveal: "Reveal each wager, then mark it right or wrong",
  }[step];

  renderFinalWagerTeams();

  // Buttons for this step
  finalWagerBackButton.hidden = step !== "wager";
  finalWagerTimerButton.hidden = step !== "question";
  finalWagerAnswerButton.hidden = step !== "question" && step !== "reveal";
  finalWagerAnswerButton.textContent = finalWager.answerShown ? "Hide answer" : "Show answer";
  finalWagerNextButton.hidden = step === "category";
  finalWagerNextButton.textContent =
    step === "wager" ? "Show question →" :
    step === "question" ? "Reveal wagers →" :
    canPlayFastMoney() ? "Continue to Fast Money →" : "See final scores →"; // fast-money.js

  updateFinalWagerTimer();
}

function renderFinalWagerCategories() {
  finalWagerCategoryCards.innerHTML = "";
  finalWagerQuestions.forEach((category, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "fw-category-card";
    card.style.setProperty("--card-delay", `${index * 120}ms`);
    card.textContent = category.name;
    card.addEventListener("click", () => chooseFinalWagerCategory(index));
    finalWagerCategoryCards.appendChild(card);
  });
}

// Wager + question steps: who has locked in. Reveal step: wagers and ✓ / ✗.
function renderFinalWagerTeams() {
  finalWagerTeams.innerHTML = "";
  const { step } = finalWager;
  if (step === "category") return;
  finalWagerTeams.classList.toggle("is-reveal", step === "reveal");

  getStandings().forEach((team) => { // teams.js — highest score first
    const row = document.createElement("div");
    row.className = "fw-team";
    row.dataset.teamId = team.id;
    row.style.setProperty("--team-color", team.color);

    const name = document.createElement("span");
    name.className = "fw-team__name";
    name.textContent = team.name;

    const score = document.createElement("span");
    score.className = "fw-team__score";
    score.textContent = formatMoney(team.score); // board.js

    row.append(name, score);

    if (step === "reveal") {
      row.append(createWagerCell(team), createResultButton(team, 1), createResultButton(team, -1));
      row.classList.toggle("is-right", finalWager.results[team.id] === 1);
      row.classList.toggle("is-wrong", finalWager.results[team.id] === -1);
    } else {
      const status = document.createElement("span");
      status.className = "fw-team__status";
      if (!finalWager.usePhones) {
        status.textContent = `Up to ${formatMoney(finalWager.maxes[team.id] || 0)}`;
      } else {
        const isLocked = finalWager.lockedTeamIds.includes(team.id);
        status.textContent = isLocked ? "✓ Wager locked in" : "Waiting…";
        row.classList.toggle("is-locked", isLocked);
      }
      row.append(status);
    }

    finalWagerTeams.appendChild(row);
  });
}

// The wager: hidden until clicked. With no wager from a phone, the host types it.
function createWagerCell(team) {
  const wager = finalWager.wagers[team.id];
  const max = finalWager.maxes[team.id] || 0;

  if (wager === undefined || wager === null) {
    const input = document.createElement("input");
    input.className = "fw-team__wager-input";
    input.type = "number";
    input.min = "0";
    input.max = String(max);
    input.step = "100";
    input.placeholder = "Wager";
    input.title = `Type ${team.name}'s wager (up to ${formatMoney(max)})`;
    input.setAttribute("aria-label", `${team.name}'s wager, up to ${formatMoney(max)}`);
    input.addEventListener("change", () => {
      const amount = Math.max(0, Math.min(max, Math.round(Number(input.value) || 0)));
      finalWager.wagers[team.id] = amount;
      finalWager.wagerShown[team.id] = true;
      renderFinalWagerTeams();
    });
    return input;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "fw-team__wager";
  const isShown = finalWager.wagerShown[team.id];
  button.classList.toggle("is-shown", Boolean(isShown));
  button.textContent = isShown ? formatMoney(wager) : "Reveal wager";
  button.addEventListener("click", () => {
    if (finalWager.wagerShown[team.id]) return;
    finalWager.wagerShown[team.id] = true;
    playRevealPopSound(); // sound-effects.js
    renderFinalWagerTeams();
  });
  return button;
}

function createResultButton(team, direction) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `award__btn award__btn--${direction > 0 ? "right" : "wrong"}`; // same look as the ✓ / ✗ on questions
  button.textContent = direction > 0 ? "✓" : "✗";
  const label = `${team.name} got it ${direction > 0 ? "right" : "wrong"}`;
  button.title = label;
  button.setAttribute("aria-label", label);
  button.setAttribute("aria-pressed", String(finalWager.results[team.id] === direction));
  // The wager has to be revealed first
  button.disabled = !finalWager.wagerShown[team.id];
  button.addEventListener("click", () => setFinalWagerResult(team.id, direction));
  return button;
}

/* =========================================================
   STEPS
   ========================================================= */

function chooseFinalWagerCategory(index) {
  finalWager.categoryIndex = index;
  finalWager.step = "wager";
  finalWager.lockedTeamIds = [];
  finalWager.maxes = {};
  getTeams().forEach((team) => { finalWager.maxes[team.id] = Math.max(0, team.score); });

  const category = getFinalWagerCategory();
  if (finalWager.usePhones) {
    finalWagerRequest("/api/fw/setup", { category: category.name, maxes: finalWager.maxes });
  }
  // buzzer-host.js — the question and answer on the host's phone
  sendQuestionToHostScreen({
    label: "Final Wager",
    category: category.name,
    value: "Wager",
    question: category.question,
    answer: category.answer,
    image: null,
    golden: null,
  });
  playCategoryChosenSound(); // sound-effects.js
  renderFinalWager();
}

function backToFinalWagerCategories() {
  if (finalWager.usePhones) finalWagerRequest("/api/fw/end");
  finalWager.step = "category";
  finalWager.categoryIndex = null;
  sendQuestionToHostScreen(null);
  renderFinalWager();
}

async function handleFinalWagerNext() {
  const { step } = finalWager;

  if (step === "wager") {
    finalWager.step = "question";
    if (finalWager.usePhones) finalWagerRequest("/api/fw/phase", { phase: "question" }); // wagers are now locked
    playFinalQuestionSting(); // sound-effects.js
    renderFinalWager();
    return;
  }

  if (step === "question") {
    stopFinalWagerTimer();
    finalWagerNextButton.disabled = true;
    if (finalWager.usePhones) {
      finalWagerRequest("/api/fw/phase", { phase: "reveal" });
      await loadFinalWagers();
    }
    finalWagerNextButton.disabled = false;
    finalWager.step = "reveal";
    renderFinalWager();
    return;
  }

  // Reveal step done: on to Fast Money (main.js)
  resetFinalWager();
  sendQuestionToHostScreen(null);
  continueAfterFinalWager();
}

async function loadFinalWagers() {
  try {
    const response = await fetch("/api/fw/results", { cache: "no-store" });
    const { wagers } = await response.json();
    Object.entries(wagers || {}).forEach(([teamId, amount]) => { finalWager.wagers[teamId] = Number(amount) || 0; });
  } catch (error) {
    // Couldn't reach the server: the host types the wagers in instead
  }
}

// ✓ adds the wager, ✗ takes it away; clicking the same one again undoes it
function setFinalWagerResult(teamId, direction) {
  const previous = finalWager.results[teamId] || 0;
  const next = previous === direction ? 0 : direction;
  const wager = finalWager.wagers[teamId] || 0;

  finalWager.results[teamId] = next;
  changeScore(teamId, (next - previous) * wager); // teams.js
  if (next === 1) playCorrectSound(); // sound-effects.js
  if (next === -1) playWrongSound();
  renderFinalWagerTeams();
}

// buzzer-host.js calls this on every check-in: which teams have locked in a wager
function handleFinalWagerServerState(serverState) {
  if (!finalWager || !finalWager.usePhones || !serverState || !serverState.active) return;
  if (finalWager.step !== "wager" && finalWager.step !== "question") return;

  const locked = serverState.lockedTeamIds || [];
  if (locked.join() === finalWager.lockedTeamIds.join()) return;
  if (locked.some((id) => !finalWager.lockedTeamIds.includes(id))) playWagerLockedSound(); // sound-effects.js
  finalWager.lockedTeamIds = locked;
  renderFinalWagerTeams();
}

/* =========================================================
   TIMER
   ========================================================= */

function toggleFinalWagerTimer() {
  if (finalWager.timerId) {
    stopFinalWagerTimer();
  } else if (finalWager.timeLeftMs > 0) {
    finalWager.timerEndsAt = Date.now() + finalWager.timeLeftMs;
    finalWager.timerId = setInterval(tickFinalWagerTimer, 100);
    setMusicDucked(true); // music.js
  }
  updateFinalWagerTimer();
}

function stopFinalWagerTimer() {
  if (!finalWager || !finalWager.timerId) return;
  clearInterval(finalWager.timerId);
  finalWager.timerId = null;
  finalWager.timeLeftMs = Math.max(0, finalWager.timerEndsAt - Date.now());
  setMusicDucked(false);
}

function tickFinalWagerTimer() {
  finalWager.timeLeftMs = Math.max(0, finalWager.timerEndsAt - Date.now());

  // A soft clock tick every second, louder for the last 10 (sound-effects.js)
  const seconds = Math.ceil(finalWager.timeLeftMs / 1000);
  if (seconds > 0 && seconds !== finalWager.lastTickSecond) {
    finalWager.lastTickSecond = seconds;
    playCountdownTick(seconds <= 10);
  }
  if (finalWager.timeLeftMs === 0) {
    stopFinalWagerTimer();
    playTimesUpSound(); // music.js
  }
  updateFinalWagerTimer();
}

function updateFinalWagerTimer() {
  const seconds = Math.ceil(finalWager.timeLeftMs / 1000);
  const isRunning = Boolean(finalWager.timerId);
  finalWagerTimer.textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  finalWagerTimer.classList.toggle("is-running", isRunning);
  finalWagerTimer.classList.toggle("is-urgent", isRunning && seconds <= 10);
  finalWagerTimer.classList.toggle("is-done", finalWager.timeLeftMs === 0);

  finalWagerTimerButton.textContent =
    isRunning ? "Pause" :
    finalWager.timeLeftMs === 0 ? "Time's up" :
    finalWager.timeLeftMs < FINAL_WAGER_SECONDS * 1000 ? "Resume" :
    "Start timer";
  finalWagerTimerButton.disabled = finalWager.timeLeftMs === 0;
}

/* ---------- Buttons ---------- */

finalWagerBackButton.addEventListener("click", backToFinalWagerCategories);
finalWagerTimerButton.addEventListener("click", toggleFinalWagerTimer);
finalWagerAnswerButton.addEventListener("click", () => {
  finalWager.answerShown = !finalWager.answerShown;
  renderFinalWager();
});
finalWagerNextButton.addEventListener("click", handleFinalWagerNext);
