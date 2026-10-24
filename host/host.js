/* =========================================================
   host.js — The host's phone screen.

   1. Enter the host code once (remembered on this phone)
   2. Whenever a tile is picked in the game, the full question
      and its answer show up here straight away — no animation
   3. Shows which team buzzed in

   The phone checks in with the laptop a couple of times a second.
   ========================================================= */

const POLL_MS = 500;
const CODE_KEY = "panalo-host-code";

const codeScreen = document.getElementById("code-screen");
const codeInput = document.getElementById("code-input");
const codeError = document.getElementById("code-error");
const hostScreen = document.getElementById("host-screen");
const connectionBanner = document.getElementById("connection-banner");
const waitingElement = document.getElementById("waiting");
const questionCard = document.getElementById("question-card");
const goldenElement = document.getElementById("golden");
const roundElement = document.getElementById("round");
const categoryElement = document.getElementById("category");
const valueElement = document.getElementById("value");
const questionElement = document.getElementById("question");
const imageElement = document.getElementById("image");
const answerElement = document.getElementById("answer");
const wordInfoElement = document.getElementById("word-info");
const wordDefinitionElement = document.getElementById("word-definition");
const wordOriginElement = document.getElementById("word-origin");
const wordSentenceElement = document.getElementById("word-sentence");
const buzzElement = document.getElementById("buzz");
const fastMoneyCard = document.getElementById("fast-money-card");
const fastMoneyList = document.getElementById("fast-money-list");

// The code can also come in the link (…/host?code=1234), handy for a bookmark
let hostCode = new URLSearchParams(location.search).get("code") || readStorage(CODE_KEY);
if (hostCode) writeStorage(CODE_KEY, hostCode);
let shownQuestionKey = null; // so the page only redraws when the question changes

/* ---------- Talking to the laptop ---------- */

// Gives up on a request after 5 seconds, so one stuck request can't stall the phone
function requestTimeout() {
  return window.AbortSignal && AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined;
}

async function checkIn() {
  if (!hostCode) return;

  try {
    const response = await fetch(`/api/host?code=${encodeURIComponent(hostCode)}`, { cache: "no-store", signal: requestTimeout() });
    if (response.status === 403) {
      showCodeScreen(true);
      return;
    }
    if (!response.ok) throw new Error(response.status);

    const state = await response.json();
    connectionBanner.hidden = true;
    codeScreen.hidden = true;
    hostScreen.hidden = false;
    render(state);
  } catch (error) {
    connectionBanner.hidden = false;
  }
}

/* ---------- Drawing the screen ---------- */

function render(state) {
  const fastMoney = state.question && state.question.fastMoney;
  const question = fastMoney ? null : state.question;

  waitingElement.hidden = Boolean(state.question);
  questionCard.hidden = !question;
  fastMoneyCard.hidden = !fastMoney;

  if (fastMoney) {
    const key = JSON.stringify(fastMoney);
    if (key !== shownQuestionKey) {
      shownQuestionKey = key;
      renderFastMoney(fastMoney);
      window.scrollTo(0, 0);
    }
  } else if (question) {
    const key = JSON.stringify(question);
    if (key !== shownQuestionKey) {
      shownQuestionKey = key;
      goldenElement.hidden = !question.golden;
      goldenElement.textContent = question.golden || "";
      roundElement.textContent = question.label || `Round ${question.round}`;
      categoryElement.textContent = question.category;
      valueElement.textContent = question.value;
      questionElement.textContent = question.question;
      answerElement.textContent = question.answer;
      const wordInfo = question.wordInfo;
      wordInfoElement.hidden = !wordInfo;
      wordDefinitionElement.textContent = wordInfo ? wordInfo.definition : "";
      wordOriginElement.textContent = wordInfo ? wordInfo.origin : "";
      wordSentenceElement.textContent = wordInfo ? wordInfo.sentence : "";
      imageElement.hidden = !question.image;
      if (question.image) imageElement.src = "/" + question.image;
      questionCard.classList.toggle("is-golden", Boolean(question.golden));
      window.scrollTo(0, 0);
    }
  } else {
    shownQuestionKey = null;
  }

  // Who buzzed in
  const winner = state.locked ? state.winner : null;
  buzzElement.hidden = !winner || !question;
  if (winner) {
    buzzElement.textContent = `${winner.name} buzzed in!`;
    buzzElement.style.setProperty("--team-color", winner.color);
  }

  renderControls(state.control);
}

/* ---------- Game controls ----------
   Jump to a round / Final Wager / Fast Money, and choose the Final
   Wager question. The game runs the command (js/host-control.js). */

const controlsSection = document.getElementById("controls");
const controlsNow = document.getElementById("controls-now");
const controlsJump = document.getElementById("controls-jump");
const fwChoice = document.getElementById("fw-choice");
const fwRandomButton = document.getElementById("fw-random");
const fwPicker = document.getElementById("fw-picker");
const controlsToast = document.getElementById("controls-toast");
let jumpKey = "";
let pickerKey = "";
let toastTimer = null;

const SCREEN_NAMES = {
  home: "Main menu",
  rules: "Rules slide",
  roundComplete: "Round complete",
  finalWager: "Final Wager",
  fastMoney: "Fast Money",
  gameOver: "Game over",
};

function renderControls(control) {
  controlsSection.hidden = !control;
  if (!control) return;
  const fw = control.finalWager || { categories: [] };

  // What's on screen now
  controlsNow.textContent =
    control.screen === "game" ? `Round ${control.round} board` :
    control.screen === "finalWager" && fw.step ? `Final Wager (${fw.step})` :
    SCREEN_NAMES[control.screen] || control.screen;

  // Jump buttons (only rebuilt when something changes, so taps aren't lost)
  const currentTarget =
    control.screen === "game" || control.screen === "roundComplete" ? `round${control.round}` :
    control.screen === "finalWager" ? "finalWager" :
    control.screen === "fastMoney" ? "fastMoney" : "";
  const newJumpKey = `${control.totalRounds}|${currentTarget}`;
  if (newJumpKey !== jumpKey) {
    jumpKey = newJumpKey;
    controlsJump.innerHTML = "";
    const targets = [];
    for (let round = 1; round <= control.totalRounds; round++) {
      targets.push({ key: `round${round}`, label: `Round ${round}`, command: { action: "goto", target: "round", round } });
    }
    targets.push({ key: "finalWager", label: "Final Wager", command: { action: "goto", target: "finalWager" } });
    targets.push({ key: "fastMoney", label: "Fast Money", command: { action: "goto", target: "fastMoney" } });

    targets.forEach(({ key, label, command }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "controls__jump-button";
      button.classList.toggle("is-current", key === currentTarget);
      button.textContent = label;
      button.addEventListener("click", () => {
        const note = key.startsWith("round") ? "\n\nThat round starts with a fresh board. Scores are kept." : "";
        if (confirm(`Jump to ${label} now?${note}`)) sendCommand(command, `Jumping to ${label}…`);
      });
      controlsJump.appendChild(button);
    });
  }

  // Final Wager: what's chosen
  const tooLate = fw.step === "question" || fw.step === "reveal";
  const describe = (pick) => {
    const category = fw.categories[pick.categoryIndex];
    if (!category) return "";
    const question = pick.questionIndex === null || pick.questionIndex === undefined ? null : category.questions[pick.questionIndex];
    return question ? `${category.name}: "${question.question}"` : `${category.name} (a random question)`;
  };
  fwChoice.textContent =
    fw.chosen ? `${tooLate ? "Playing" : "Chosen"}: ${describe(fw.chosen)}${tooLate ? " (too late to change now)" : ""}` :
    fw.preset ? `Next pick: ${describe(fw.preset)}` :
    "Random: the game picks the category and question";
  fwRandomButton.hidden = !fw.preset || tooLate;
  fwPicker.classList.toggle("is-locked", tooLate);

  // The list of categories and questions (rebuilt only when the questions change)
  const newPickerKey = JSON.stringify(fw.categories);
  if (newPickerKey !== pickerKey) {
    pickerKey = newPickerKey;
    buildFinalWagerPicker(fw.categories);
  }

  // Highlight the current choice
  const active = fw.chosen || fw.preset;
  fwPicker.querySelectorAll("[data-category]").forEach((button) => {
    const categoryIndex = Number(button.dataset.category);
    const questionIndex = button.dataset.question === "" ? null : Number(button.dataset.question);
    // "Any question" is lit only while a category-only pick is waiting to be used;
    // otherwise the exact question is lit
    const isActive = Boolean(active) && active.categoryIndex === categoryIndex && (
      questionIndex === null
        ? !fw.chosen && fw.preset.questionIndex === null
        : active.questionIndex === questionIndex
    );
    button.classList.toggle("is-active", isActive);
    button.disabled = tooLate;
  });
}

function buildFinalWagerPicker(categories) {
  const openIndexes = [...fwPicker.querySelectorAll("details")].map((details, index) => details.open ? index : -1);
  fwPicker.innerHTML = "";

  categories.forEach((category, categoryIndex) => {
    const details = document.createElement("details");
    details.className = "fw-picker__category";
    details.open = openIndexes.includes(categoryIndex);

    const summary = document.createElement("summary");
    summary.textContent = category.name;
    details.appendChild(summary);

    // Any question in this category
    details.appendChild(makePickButton(categoryIndex, null, "Any question in this category", "The game picks one at random"));

    category.questions.forEach((question, questionIndex) => {
      details.appendChild(makePickButton(categoryIndex, questionIndex, question.question, `Answer: ${question.answer}`));
    });
    fwPicker.appendChild(details);
  });
}

function makePickButton(categoryIndex, questionIndex, text, note) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "fw-picker__question";
  button.dataset.category = categoryIndex;
  button.dataset.question = questionIndex === null ? "" : questionIndex;

  const main = document.createElement("span");
  main.textContent = text;
  const small = document.createElement("small");
  small.textContent = note;
  button.append(main, small);

  button.addEventListener("click", () => {
    sendCommand({ action: "fwPick", categoryIndex, questionIndex }, "Final Wager choice sent");
  });
  return button;
}

fwRandomButton.addEventListener("click", () => sendCommand({ action: "fwRandom" }, "Back to a random pick"));

async function sendCommand(command, message) {
  try {
    const response = await fetch(`/api/host/command?code=${encodeURIComponent(hostCode)}`, {
      method: "POST",
      body: JSON.stringify(command),
      cache: "no-store",
    });
    if (response.status === 403) { showCodeScreen(true); return; }
    if (!response.ok) throw new Error(response.status);
    showToast(`✓ ${message}`);
  } catch (error) {
    showToast("Couldn't reach the game. Try again.");
  }
}

function showToast(text) {
  controlsToast.textContent = text;
  controlsToast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { controlsToast.hidden = true; }, 2500);
}

// Fast Money: each question with its survey answers and points
function renderFastMoney(questions) {
  fastMoneyList.innerHTML = "";
  questions.forEach(({ question, answers }) => {
    const item = document.createElement("li");
    item.className = "fm-list__item";

    const text = document.createElement("p");
    text.className = "fm-list__question";
    text.textContent = question;

    const answerList = document.createElement("ul");
    answerList.className = "fm-list__answers";
    answers.forEach(({ answer, points }) => {
      const row = document.createElement("li");
      const name = document.createElement("span");
      name.textContent = answer;
      const value = document.createElement("strong");
      value.textContent = points;
      row.append(name, value);
      answerList.appendChild(row);
    });

    item.append(text, answerList);
    fastMoneyList.appendChild(item);
  });
}

/* ---------- Host code ---------- */

function showCodeScreen(wasWrong) {
  hostCode = null;
  writeStorage(CODE_KEY, "");
  hostScreen.hidden = true;
  codeScreen.hidden = false;
  codeError.hidden = !wasWrong;
  codeInput.value = "";
  codeInput.focus();
}

codeScreen.addEventListener("submit", (event) => {
  event.preventDefault();
  const code = codeInput.value.trim();
  if (!code) return;
  hostCode = code;
  writeStorage(CODE_KEY, code);
  codeError.hidden = true;
  checkIn();
});

/* ---------- Remembering this phone ---------- */

function readStorage(key) {
  try { return localStorage.getItem(key); } catch (error) { return null; }
}

function writeStorage(key, value) {
  try { localStorage.setItem(key, value); } catch (error) { /* not important */ }
}

/* ---------- Start ---------- */

if (hostCode) {
  checkIn();
} else {
  showCodeScreen(false);
}
// Asks again only after the last answer arrives (no pile-up on a busy laptop)
async function pollLoop() {
  await checkIn();
  setTimeout(pollLoop, POLL_MS);
}
setTimeout(pollLoop, POLL_MS);
