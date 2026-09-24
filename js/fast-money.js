/* =========================================================
   fast-money.js — FAST MONEY, the final showdown.

   After the last round, the top two teams play (the one with
   more points goes first). The questions are in questions.js.

   WITH THE BUZZERS (the usual way):
     1. FIRST TEAM:  the host sends them somewhere private and
                     clicks START. Their phone shows the questions
                     one by one with the clock; the big screen
                     shows only the timer
     2. SECOND TEAM: same again
     3. SHOW ANSWERS: the answers appear; click each one to reveal
                     its points. Close-enough answers count; click
                     the points to change the match if needed
     4. FINISH:      the higher Fast Money total wins the game

   WITHOUT THE BUZZERS (game opened as a plain file): the host
   runs the timer, asks the questions, and types in the answers.

   The host's phone (/host) shows the questions and the survey
   answers the whole time.
   ========================================================= */

const fastMoneyStatus = document.getElementById("fm-status");
const fastMoneyBoard = document.getElementById("fm-board");
const fastMoneyColumns = [document.getElementById("fm-column-0"), document.getElementById("fm-column-1")];
const fastMoneyStage = document.getElementById("fm-stage");
const fastMoneyStageTeam = document.getElementById("fm-stage-team");
const fastMoneyStageTimer = document.getElementById("fm-stage-timer");
const fastMoneyStageText = document.getElementById("fm-stage-text");
const fastMoneyTimer = document.getElementById("fm-timer");
const fastMoneyTimerButton = document.getElementById("fm-timer-button");
const fastMoneyResetButton = document.getElementById("fm-reset-button");
const fastMoneySwapButton = document.getElementById("fm-swap-button");
const fastMoneyNextButton = document.getElementById("fm-next-button");
const fastMoneyPicker = document.getElementById("fm-picker");
const fastMoneyPickerQuestion = document.getElementById("fm-picker-question");
const fastMoneyPickerGiven = document.getElementById("fm-picker-given");
const fastMoneyPickerOptions = document.getElementById("fm-picker-options");
const fastMoneyPickerCancel = document.getElementById("fm-picker-cancel");

const NO_MATCH = -1;

// phase: "turn0" (first team) → "turn1" (second team) → "reveal"
// Each player's status during their turn: "ready" → "playing" → "done"
let fastMoney = null;
let fastMoneyWinnerText = null; // read by main.js for the Game Over screen

/* =========================================================
   STARTING
   ========================================================= */

// Fast Money needs two teams
function canPlayFastMoney() {
  return getTeams().length >= 2;
}

function resetFastMoney() {
  const wasOnPhones = fastMoney && fastMoney.usePhones;
  stopFastMoneyTimer();
  fastMoney = null;
  fastMoneyWinnerText = null;
  if (wasOnPhones) fastMoneyRequest("/api/fm/end");
}

// Sets everything up. main.js shows the screen.
function prepareFastMoney() {
  resetFastMoney();
  const [first, second] = getStandings(); // teams.js — highest score first

  fastMoney = {
    phase: "turn0",
    usePhones: isBuzzerConnected, // buzzer-host.js
    players: [first, second].map((team) => ({
      teamId: team.id,
      status: "ready",
      answered: 0,
      answers: fastMoneyQuestions.map(() => ""),
      picks: fastMoneyQuestions.map(() => null), // null = not revealed yet
    })),
    timeLeftMs: FAST_MONEY_SECONDS * 1000,
    timerId: null,
    timerEndsAt: 0,
  };

  if (fastMoney.usePhones) sendFastMoneySetup();
  renderFastMoney();

  // buzzer-host.js — the questions and survey answers on the host's phone
  sendQuestionToHostScreen({
    fastMoney: fastMoneyQuestions.map(({ question, answers }) => ({
      question,
      answers: answers.map(({ answer, points }) => ({ answer, points })),
    })),
  });
}

/* =========================================================
   TALKING TO THE BUZZER SERVER (phones mode)
   ========================================================= */

function fastMoneyRequest(path, data = {}) {
  return fetch(path, { method: "POST", body: JSON.stringify(data), cache: "no-store" })
    .then((response) => response.json())
    .catch(() => null);
}

// The two teams (in turn order) and the question texts — never the survey answers
function sendFastMoneySetup() {
  fastMoneyRequest("/api/fm/setup", {
    teamIds: fastMoney.players.map((player) => player.teamId),
    questions: fastMoneyQuestions.map((item) => item.question),
    seconds: FAST_MONEY_SECONDS,
  });
}

// buzzer-host.js calls this on every check-in with the server's Fast Money state
function handleFastMoneyServerState(serverState) {
  if (!fastMoney || !fastMoney.usePhones || !serverState || !serverState.active) return;

  const playingIndex = fastMoney.players.findIndex((player) => player.status === "playing");
  if (playingIndex === -1 || serverState.turnTeamId !== fastMoney.players[playingIndex].teamId) return;
  const player = fastMoney.players[playingIndex];

  // Keep the big timer in step with the phones
  fastMoney.timerEndsAt = Date.now() + serverState.remainingMs;
  player.answered = serverState.answered;

  if (serverState.turnOver) {
    // Finished early, or time ran out
    const timeRanOut = serverState.remainingMs === 0;
    stopFastMoneyTimer();
    fastMoney.timeLeftMs = serverState.remainingMs;
    player.status = "done";
    if (timeRanOut) playTimesUpSound(); // music.js
    else playTurnDoneChime(); // sound-effects.js — they finished early
    renderFastMoney();
  } else {
    renderFastMoneyStage();
  }
}

// Fetches both teams' answers (only after both turns are over)
async function loadFastMoneyAnswers() {
  try {
    const response = await fetch("/api/fm/results", { cache: "no-store" });
    const { answers } = await response.json();
    fastMoney.players.forEach((player) => {
      const saved = answers[player.teamId];
      if (saved) player.answers = fastMoneyQuestions.map((_, index) => saved[index] || "");
    });
  } catch (error) {
    // Couldn't reach the server: answers stay blank, and the host can still pick matches by hand
  }
}

// For each question: what the first team said, plus every wording of the
// survey answer it matched. The second team's phones refuse anything close.
function sendTakenAnswers() {
  const first = fastMoney.players[0];
  const taken = fastMoneyQuestions.map((question, questionIndex) => {
    const said = first.answers[questionIndex].trim();
    if (!said) return { names: [] };
    const match = findFastMoneyMatch(said, question.answers); // answer-match.js
    const matched = match === null ? null : question.answers[match];
    const names = matched ? [...matched.answer.split("/"), ...(matched.also || [])] : [];
    return { names: [said, ...names] };
  });
  return fastMoneyRequest("/api/fm/taken", { taken });
}

/* =========================================================
   DRAWING THE SCREEN
   ========================================================= */

function renderFastMoney() {
  if (!fastMoney) return;
  const { phase, usePhones } = fastMoney;
  const turnIndex = phase === "turn0" ? 0 : phase === "turn1" ? 1 : null;
  const player = turnIndex === null ? null : fastMoney.players[turnIndex];
  const teamName = (index) => getFastMoneyTeam(index).name;

  // Phones mode: during the turns only the timer is on screen
  const showStage = usePhones && phase !== "reveal";
  fastMoneyStage.hidden = !showStage;
  fastMoneyBoard.hidden = showStage;
  if (showStage) renderFastMoneyStage();
  else fastMoney.players.forEach((_, index) => renderFastMoneyColumn(index));

  // Status line
  if (phase === "reveal") {
    fastMoneyStatus.textContent = "Click each one to reveal the answer and its points";
  } else if (usePhones) {
    fastMoneyStatus.textContent = `${teamName(0)} vs ${teamName(1)}`;
  } else {
    fastMoneyStatus.textContent = `${teamName(turnIndex)} — ${FAST_MONEY_SECONDS} seconds for five questions`;
  }

  // Buttons for this step
  const isTurn = phase !== "reveal";
  fastMoneyTimer.hidden = !isTurn || usePhones;
  fastMoneyTimerButton.hidden = !isTurn || (usePhones && player.status !== "playing");
  fastMoneyResetButton.hidden = !isTurn || usePhones;
  fastMoneySwapButton.hidden = !(phase === "turn0" && player.status === "ready");
  fastMoneySwapButton.title = `Let ${teamName(1)} go first instead`;

  if (phase === "reveal") {
    fastMoneyNextButton.textContent = "Finish";
  } else if (usePhones && player.status === "ready") {
    fastMoneyNextButton.textContent = `Start ${teamName(turnIndex)}'s turn`;
  } else if (phase === "turn0") {
    fastMoneyNextButton.textContent = `${teamName(1)}'s turn →`;
  } else {
    fastMoneyNextButton.textContent = "Show answers →";
  }
  // With phones, the next step waits until the team has finished
  fastMoneyNextButton.disabled = usePhones && isTurn && player.status === "playing";

  updateFastMoneyTimer();
}

// Phones mode: the team's name, a big timer, and how it's going
function renderFastMoneyStage() {
  if (!fastMoney || fastMoney.phase === "reveal") return;
  const turnIndex = fastMoney.phase === "turn0" ? 0 : 1;
  const player = fastMoney.players[turnIndex];
  const team = getFastMoneyTeam(turnIndex);
  const total = fastMoneyQuestions.length;

  fastMoneyStage.style.setProperty("--team-color", team.color);
  fastMoneyStageTeam.textContent = team.name;
  fastMoneyStageText.textContent =
    player.status === "ready" ? "Get ready — the questions will appear on your phone" :
    player.status === "playing" ? `Answering on their phone… ${player.answered} of ${total} answered` :
    "Done! Answers are locked in";

  updateFastMoneyTimer();
}

function getFastMoneyTeam(index) {
  return getTeam(fastMoney.players[index].teamId) || { name: `Team ${index + 1}`, color: "#f4c76a" };
}

// One team's column: five answer rows, then the team name and total
function renderFastMoneyColumn(index) {
  const column = fastMoneyColumns[index];
  const player = fastMoney.players[index];
  const team = getFastMoneyTeam(index);
  const { phase } = fastMoney;

  const isTyping = phase === `turn${index}`;
  const isCovered = phase === "turn1" && index === 0; // first team's answers stay secret
  const isWaiting = phase === "turn0" && index === 1;

  column.innerHTML = "";
  column.style.setProperty("--team-color", team.color);
  column.classList.toggle("is-playing", isTyping);

  player.answers.forEach((answerText, questionIndex) => {
    const row = document.createElement("div");
    row.className = "fm-row";

    if (isTyping) {
      const input = document.createElement("input");
      input.className = "fm-row__input";
      input.type = "text";
      input.maxLength = 40;
      input.value = answerText;
      input.placeholder = `Answer ${questionIndex + 1}`;
      input.spellcheck = false;
      input.setAttribute("aria-label", `${team.name}, answer to question ${questionIndex + 1}`);
      input.addEventListener("input", () => { player.answers[questionIndex] = input.value; });
      // Enter jumps to the next box
      input.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        const next = column.querySelectorAll(".fm-row__input")[questionIndex + 1];
        if (next) next.focus(); else input.blur();
      });
      row.append(input, createPointsBubble());
    } else if (isCovered || isWaiting) {
      row.classList.add("is-covered");
      const blank = document.createElement("span");
      blank.className = "fm-row__answer";
      blank.textContent = isCovered && answerText.trim() ? "• • •" : "";
      row.append(blank, createPointsBubble());
    } else {
      row.append(createRevealButton(index, questionIndex), createPointsBubble());
      updateRevealRow(row, index, questionIndex);
    }

    column.appendChild(row);
  });

  // Team name + total
  const totalRow = document.createElement("div");
  totalRow.className = "fm-total";
  const name = document.createElement("span");
  name.className = "fm-total__name";
  name.textContent = team.name;
  const total = document.createElement("span");
  total.className = "fm-total__points";
  total.textContent = phase === "reveal" ? getFastMoneyTotal(index) : "";
  totalRow.append(name, total);
  column.appendChild(totalRow);
}

function createPointsBubble() {
  const bubble = document.createElement("span");
  bubble.className = "fm-row__points";
  return bubble;
}

// In the reveal step each answer is a button: click to show its points
function createRevealButton(playerIndex, questionIndex) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "fm-row__answer fm-row__reveal";
  button.addEventListener("click", () => revealFastMoneyAnswer(playerIndex, questionIndex));
  return button;
}

function updateRevealRow(row, playerIndex, questionIndex) {
  const player = fastMoney.players[playerIndex];
  const pick = player.picks[questionIndex];
  const answerText = player.answers[questionIndex].trim();
  const button = row.querySelector(".fm-row__reveal");
  const bubble = row.querySelector(".fm-row__points");

  // Hidden (just the question number) until the host clicks it
  button.textContent = pick === null ? String(questionIndex + 1) : answerText || "—";
  button.title = pick === null ? "Click to reveal the answer and its points" : "";
  row.classList.toggle("is-hidden-answer", pick === null);
  row.classList.toggle("is-revealed", pick !== null);
  row.classList.toggle("is-miss", pick === NO_MATCH);

  bubble.textContent = pick === null ? "" : String(getPickPoints(questionIndex, pick));
  bubble.onclick = pick === null ? null : () => openFastMoneyPicker(playerIndex, questionIndex);
  bubble.classList.toggle("is-clickable", pick !== null);
  bubble.title = pick === null ? "" : "Click to change which answer this matches";
}

/* =========================================================
   REVEALING & SCORING
   ========================================================= */

function revealFastMoneyAnswer(playerIndex, questionIndex) {
  const player = fastMoney.players[playerIndex];
  if (player.picks[questionIndex] !== null) {
    openFastMoneyPicker(playerIndex, questionIndex); // already shown: fix the match
    return;
  }

  const match = findFastMoneyMatch(player.answers[questionIndex], fastMoneyQuestions[questionIndex].answers);
  setFastMoneyPick(playerIndex, questionIndex, match === null ? NO_MATCH : match);

  if (match === null) playBigBuzzer(); // sound-effects.js — "BZZZT" for no points
  else playSurveyDing();               // sound-effects.js — "DING!"
}

function setFastMoneyPick(playerIndex, questionIndex, pick) {
  fastMoney.players[playerIndex].picks[questionIndex] = pick;

  const column = fastMoneyColumns[playerIndex];
  const row = column.querySelectorAll(".fm-row")[questionIndex];
  updateRevealRow(row, playerIndex, questionIndex);

  // Restart the pop animation on the points
  const bubble = row.querySelector(".fm-row__points");
  bubble.classList.remove("is-popping");
  void bubble.offsetWidth;
  bubble.classList.add("is-popping");

  column.querySelector(".fm-total__points").textContent = getFastMoneyTotal(playerIndex);
}

function getPickPoints(questionIndex, pick) {
  return pick === NO_MATCH || pick === null ? 0 : fastMoneyQuestions[questionIndex].answers[pick].points;
}

// Only answers that have been revealed count towards the total
function getFastMoneyTotal(playerIndex) {
  return fastMoney.players[playerIndex].picks.reduce(
    (total, pick, questionIndex) => total + getPickPoints(questionIndex, pick),
    0
  );
}

/* ---------- Picking the match by hand ---------- */

function openFastMoneyPicker(playerIndex, questionIndex) {
  const question = fastMoneyQuestions[questionIndex];
  const player = fastMoney.players[playerIndex];
  const current = player.picks[questionIndex];

  fastMoneyPickerQuestion.textContent = question.question;
  fastMoneyPickerGiven.textContent = `${getFastMoneyTeam(playerIndex).name} said: “${player.answers[questionIndex].trim() || "(nothing)"}”`;
  fastMoneyPickerOptions.innerHTML = "";

  const addOption = (label, points, pick) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "fm-picker__option";
    button.classList.toggle("is-current", pick === current);
    const text = document.createElement("span");
    text.textContent = label;
    const value = document.createElement("strong");
    value.textContent = points;
    button.append(text, value);
    button.addEventListener("click", () => {
      closeFastMoneyPicker();
      setFastMoneyPick(playerIndex, questionIndex, pick);
    });
    fastMoneyPickerOptions.appendChild(button);
  };

  question.answers.forEach((option, index) => addOption(option.answer, option.points, index));
  addOption("No match", 0, NO_MATCH);

  fastMoneyPicker.hidden = false;
  fastMoneyPickerCancel.focus({ preventScroll: true });
}

function closeFastMoneyPicker() {
  fastMoneyPicker.hidden = true;
}

/* "Close enough" matching lives in answer-match.js (findFastMoneyMatch) */

/* =========================================================
   TIMER
   ========================================================= */

function startFastMoneyTimer() {
  if (fastMoney.timerId || fastMoney.timeLeftMs <= 0) return;
  if (fastMoney.timeLeftMs === FAST_MONEY_SECONDS * 1000) playStartBell(); // sound-effects.js — "ding ding", go!
  fastMoney.timerEndsAt = Date.now() + fastMoney.timeLeftMs;
  fastMoney.timerId = setInterval(tickFastMoneyTimer, 100);
  setMusicDucked(true); // music.js
}

function stopFastMoneyTimer() {
  if (!fastMoney || !fastMoney.timerId) return;
  clearInterval(fastMoney.timerId);
  fastMoney.timerId = null;
  fastMoney.timeLeftMs = Math.max(0, fastMoney.timerEndsAt - Date.now());
  setMusicDucked(false);
}

// Timer button: manual mode = start / pause; phones mode = end the turn early
function handleFastMoneyTimerButton() {
  if (fastMoney.usePhones) {
    fastMoneyRequest("/api/fm/stop"); // the next check-in finishes the turn
    return;
  }
  if (fastMoney.timerId) stopFastMoneyTimer();
  else startFastMoneyTimer();
  updateFastMoneyTimer();
}

function resetFastMoneyTimer() {
  stopFastMoneyTimer();
  fastMoney.timeLeftMs = FAST_MONEY_SECONDS * 1000;
  updateFastMoneyTimer();
}

function tickFastMoneyTimer() {
  fastMoney.timeLeftMs = Math.max(0, fastMoney.timerEndsAt - Date.now());

  // Tick for each of the last 10 seconds (sound-effects.js)
  const seconds = Math.ceil(fastMoney.timeLeftMs / 1000);
  if (seconds > 0 && seconds <= 10 && seconds !== fastMoney.lastTickSecond) {
    fastMoney.lastTickSecond = seconds;
    playCountdownTick(true);
  }
  // In phones mode the server says when the turn is over (handleFastMoneyServerState)
  if (fastMoney.timeLeftMs === 0 && !fastMoney.usePhones) {
    stopFastMoneyTimer();
    playTimesUpSound(); // music.js
  }
  updateFastMoneyTimer();
}

function updateFastMoneyTimer() {
  const seconds = Math.ceil(fastMoney.timeLeftMs / 1000);
  const text = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const isRunning = Boolean(fastMoney.timerId);

  [fastMoneyTimer, fastMoneyStageTimer].forEach((timer) => {
    timer.textContent = text;
    timer.classList.toggle("is-running", isRunning);
    timer.classList.toggle("is-urgent", isRunning && seconds <= 10);
    timer.classList.toggle("is-done", fastMoney.timeLeftMs === 0);
  });

  if (fastMoney.usePhones) {
    fastMoneyTimerButton.textContent = "End turn early";
    fastMoneyTimerButton.disabled = false;
    return;
  }
  fastMoneyTimerButton.textContent =
    isRunning ? "Pause" :
    fastMoney.timeLeftMs === 0 ? "Time's up" :
    fastMoney.timeLeftMs < FAST_MONEY_SECONDS * 1000 ? "Resume" :
    "Start timer";
  fastMoneyTimerButton.disabled = fastMoney.timeLeftMs === 0;
}

/* =========================================================
   MOVING THROUGH THE STEPS
   ========================================================= */

async function handleFastMoneyNext() {
  if (!fastMoney) return;
  const { phase, usePhones } = fastMoney;
  const turnIndex = phase === "turn0" ? 0 : phase === "turn1" ? 1 : null;
  const player = turnIndex === null ? null : fastMoney.players[turnIndex];

  // Phones mode: START sends the questions to this team's phones
  if (usePhones && player && player.status === "ready") {
    // The second team can't repeat the first team's answers
    if (turnIndex === 1) {
      fastMoneyNextButton.disabled = true;
      await loadFastMoneyAnswers();
      await sendTakenAnswers();
    }
    player.status = "playing";
    fastMoney.timeLeftMs = FAST_MONEY_SECONDS * 1000;
    startFastMoneyTimer();
    renderFastMoney();
    fastMoneyRequest("/api/fm/start", { teamId: player.teamId });
    return;
  }
  if (usePhones && player && player.status === "playing") return; // wait for them to finish

  stopFastMoneyTimer();
  if (phase === "turn0") {
    fastMoney.phase = "turn1";
    fastMoney.timeLeftMs = FAST_MONEY_SECONDS * 1000;
  } else if (phase === "turn1") {
    if (usePhones) {
      fastMoneyNextButton.disabled = true;
      await loadFastMoneyAnswers();
    }
    fastMoney.phase = "reveal";
  } else {
    finishFastMoney();
    return;
  }
  renderFastMoney();
}

// Higher Fast Money total wins (unrevealed answers count as 0)
function finishFastMoney() {
  const totals = [getFastMoneyTotal(0), getFastMoneyTotal(1)];
  const names = [getFastMoneyTeam(0).name, getFastMoneyTeam(1).name];
  const winnerText = totals[0] === totals[1]
    ? `It's a tie! ${totals[0]}–${totals[1]}`
    : totals[0] > totals[1]
      ? `${names[0]} wins! ${totals[0]}–${totals[1]}`
      : `${names[1]} wins! ${totals[1]}–${totals[0]}`;

  resetFastMoney(); // also tells the phones Fast Money is over
  fastMoneyWinnerText = winnerText;
  sendQuestionToHostScreen(null); // buzzer-host.js
  showGameOverScreen(); // main.js
}

// The second-place team goes first instead
function swapFastMoneyOrder() {
  if (!fastMoney || fastMoney.phase !== "turn0" || fastMoney.players[0].status !== "ready") return;
  fastMoney.players.reverse();
  if (fastMoney.usePhones) sendFastMoneySetup();
  resetFastMoneyTimer();
  renderFastMoney();
}

/* ---------- Buttons & keyboard ---------- */

fastMoneyTimerButton.addEventListener("click", handleFastMoneyTimerButton);
fastMoneyResetButton.addEventListener("click", resetFastMoneyTimer);
fastMoneySwapButton.addEventListener("click", swapFastMoneyOrder);
fastMoneyNextButton.addEventListener("click", handleFastMoneyNext);
fastMoneyPickerCancel.addEventListener("click", closeFastMoneyPicker);
fastMoneyPicker.addEventListener("click", (event) => { if (event.target === fastMoneyPicker) closeFastMoneyPicker(); });

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !fastMoneyPicker.hidden) closeFastMoneyPicker();
});
