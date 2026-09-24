/* =========================================================
   fast-money-phone.js — Fast Money on the players' phones.

   When the host starts a team's turn, that team's phone shows
   the questions one at a time, with the clock in the top left:
     - NEXT saves the answer and moves on
     - SKIP puts the question at the back of the line, so it
       comes up again at the end
   Answers are sent to the laptop as they go, but nobody sees
   them until the host reveals them. Only one phone per team
   answers (the first one to send an answer). The second team
   can't give the same answer as the first team (answer-match.js
   decides what counts as "the same").

   Every other phone just shows who's answering.
   buzzer.js calls renderFastMoneyPhone() on every check-in.
   ========================================================= */

const fmScreen = document.getElementById("fm-screen");
const fmWait = document.getElementById("fm-wait");
const fmWaitText = document.getElementById("fm-wait-text");
const fmQuiz = document.getElementById("fm-quiz");
const fmClock = document.getElementById("fm-clock");
const fmProgress = document.getElementById("fm-progress");
const fmQuestion = document.getElementById("fm-question");
const fmAnswer = document.getElementById("fm-answer");
const fmSkip = document.getElementById("fm-skip");
const fmNote = document.getElementById("fm-note");

let fmTurnId = null;       // the turn this phone is answering
let fmQuestions = [];
let fmQueue = [];          // question numbers still to answer, in order
let fmDrafts = [];         // what was typed before a skip
let fmIsFinished = false;  // this phone sent all its answers
let fmShownIndex = null;   // the question on screen right now
let fmClockEndsAt = 0;
let fmClockTimer = null;

// fastMoney: the server's Fast Money state, or null when it isn't on
function renderFastMoneyPhone(fastMoney, teams) {
  fmScreen.hidden = !fastMoney;
  if (!fastMoney) {
    stopFastMoneyClock();
    return;
  }

  const teamName = (id) => (teams.find((team) => team.id === id) || { name: "A team" }).name;
  const isMyTurn = fastMoney.turnTeamId === myTeamId && !fastMoney.turnOver;
  const teammateHasIt = fastMoney.answererId && fastMoney.answererId !== playerId;

  // A new turn for my team: fresh questionnaire
  if (isMyTurn && fastMoney.turnId !== fmTurnId) {
    fmTurnId = fastMoney.turnId;
    fmQuestions = fastMoney.questions || [];
    fmQueue = fmQuestions.map((_, index) => index);
    fmDrafts = fmQuestions.map(() => "");
    fmIsFinished = false;
    fmShownIndex = null;
  }

  // Keep the clock in step with the laptop
  if (isMyTurn) fmClockEndsAt = Date.now() + fastMoney.remainingMs;

  const showQuiz = isMyTurn && !teammateHasIt && !fmIsFinished && fmQueue.length > 0;
  fmQuiz.hidden = !showQuiz;
  fmWait.hidden = showQuiz;

  if (showQuiz) {
    startFastMoneyClock();
    showFastMoneyQuestion();
    return;
  }

  stopFastMoneyClock();
  const [firstId, secondId] = fastMoney.teamIds || [];
  const isFinalist = fastMoney.teamIds.includes(myTeamId);
  const myTeamIsDone = (fastMoney.doneTeamIds || []).includes(myTeamId);

  if (isMyTurn && teammateHasIt) {
    fmWaitText.textContent = "A teammate is answering on their phone.";
  } else if (myTeamIsDone || fmIsFinished) {
    fmWaitText.textContent = "Your answers are locked in! Wait for the host to reveal them.";
  } else if (fastMoney.turnTeamId && !fastMoney.turnOver) {
    fmWaitText.textContent = `${teamName(fastMoney.turnTeamId)} is answering…`;
  } else if (isFinalist) {
    fmWaitText.textContent = "You're in Fast Money! Your questions will show up here when the host starts your turn.";
  } else {
    fmWaitText.textContent = `${teamName(firstId)} vs ${teamName(secondId)}`;
  }
}

/* ---------- The questionnaire ---------- */

// Only redraws when the question changes, so typing isn't interrupted
function showFastMoneyQuestion() {
  const index = fmQueue[0];
  if (index === fmShownIndex) return;
  fmShownIndex = index;

  const answeredCount = fmQuestions.length - fmQueue.length;
  fmProgress.textContent = `${answeredCount + 1} of ${fmQuestions.length}`;
  fmQuestion.textContent = fmQuestions[index];
  fmAnswer.value = fmDrafts[index];
  fmNote.textContent = fmQueue.length > 1 ? "" : "Last one!";
  fmNote.classList.remove("is-warning");
  fmSkip.disabled = fmQueue.length <= 1;
  fmAnswer.focus();
}

// NEXT: save this answer and move on
fmQuiz.addEventListener("submit", (event) => {
  event.preventDefault();
  const index = fmQueue[0];
  if (index === undefined) return;
  const answer = fmAnswer.value.trim();

  // A blank answer is a skip, unless it's the last question left
  if (!answer && fmQueue.length > 1) {
    skipFastMoneyQuestion();
    return;
  }

  // The second team can't repeat what the first team said (answer-match.js)
  if (answer && isFastMoneyAnswerTaken(index, answer)) {
    fmNote.textContent = "The other team already said that! Try a different answer.";
    fmNote.classList.add("is-warning");
    fmAnswer.select();
    return;
  }

  fmQueue.shift();
  fmDrafts[index] = answer;
  const isLast = fmQueue.length === 0;
  if (isLast) fmIsFinished = true;
  sendFastMoneyAnswer(index, answer, isLast);

  if (isLast) {
    render(); // buzzer.js — shows "Your answers are locked in!"
  } else {
    showFastMoneyQuestion();
  }
});

function isFastMoneyAnswerTaken(index, answer) {
  const taken = latestState && latestState.fastMoney && latestState.fastMoney.taken; // buzzer.js
  const names = taken && taken[index] ? taken[index].names || [] : [];
  if (names.length === 0) return false;
  return findFastMoneyMatch(answer, [{ answer: names[0], also: names.slice(1) }]) !== null;
}

// SKIP: this question goes to the back of the line
function skipFastMoneyQuestion() {
  if (fmQueue.length <= 1) return;
  const index = fmQueue.shift();
  fmDrafts[index] = fmAnswer.value;
  fmQueue.push(index);
  showFastMoneyQuestion();
}

fmSkip.addEventListener("click", skipFastMoneyQuestion);

function sendFastMoneyAnswer(index, answer, finished) {
  fetch("/api/fm/answer", {
    method: "POST",
    body: JSON.stringify({ teamId: myTeamId, playerId, index, answer, finished }),
  }).catch(() => {
    connectionBanner.hidden = false; // buzzer.js
  });
}

/* ---------- Clock (top left) ---------- */

function startFastMoneyClock() {
  if (!fmClockTimer) fmClockTimer = setInterval(tickFastMoneyClock, 200);
  tickFastMoneyClock();
}

function stopFastMoneyClock() {
  clearInterval(fmClockTimer);
  fmClockTimer = null;
}

function tickFastMoneyClock() {
  const timeLeft = Math.max(0, fmClockEndsAt - Date.now());
  const seconds = Math.ceil(timeLeft / 1000);
  fmClock.textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  fmClock.classList.toggle("is-urgent", seconds <= 10);

  // Time's up: whatever is typed in the box right now still counts
  if (timeLeft === 0 && !fmIsFinished && fmQueue.length > 0) {
    const index = fmQueue[0];
    const draft = fmAnswer.value.trim();
    fmIsFinished = true;
    fmAnswer.blur();
    if (draft && !isFastMoneyAnswerTaken(index, draft)) sendFastMoneyAnswer(index, draft, true);
    stopFastMoneyClock();
    fmQuiz.hidden = true;
    fmWait.hidden = false;
    fmWaitText.textContent = "Time's up! Your answers are locked in.";
  }
}
