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
const buzzElement = document.getElementById("buzz");
const fastMoneyCard = document.getElementById("fast-money-card");
const fastMoneyList = document.getElementById("fast-money-list");

// The code can also come in the link (…/host?code=1234), handy for a bookmark
let hostCode = new URLSearchParams(location.search).get("code") || readStorage(CODE_KEY);
if (hostCode) writeStorage(CODE_KEY, hostCode);
let shownQuestionKey = null; // so the page only redraws when the question changes

/* ---------- Talking to the laptop ---------- */

async function checkIn() {
  if (!hostCode) return;

  try {
    const response = await fetch(`/api/host?code=${encodeURIComponent(hostCode)}`, { cache: "no-store" });
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
setInterval(checkIn, POLL_MS);
