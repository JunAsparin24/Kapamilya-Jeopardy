/* =========================================================
   question-screen.js — The question card that opens on top
   of the board.

   Flow:  tile clicked → card opens and the question appears
            word by word, at about the pace it's read aloud
            (it pauses while a team is buzzed in; click the
            question to show it all at once)
          → once it's all up, teams have 30 seconds to buzz
            (see "30 seconds to buzz" below)
          → SHOW ANSWER → answer appears
          → BACK TO BOARD → question is marked as played

   The × button (or Esc) before the answer is shown puts the
   question back on the board, in case a tile was clicked by
   mistake.
   ========================================================= */

const questionScreen = document.getElementById("question-screen");
const questionCard = document.getElementById("question-card");
const questionRoundElement = document.getElementById("question-round");
const questionCategoryElement = document.getElementById("question-category");
const questionValueElement = document.getElementById("question-value");
const questionTextElement = document.getElementById("question-text");
const questionImageElement = document.getElementById("question-image");
const goldenBadge = document.getElementById("golden-badge");
const answerBlock = document.getElementById("answer-block");
const answerTextElement = document.getElementById("answer-text");
const showAnswerButton = document.getElementById("show-answer-button");
const backToBoardButton = document.getElementById("back-to-board-button");
const questionCloseButton = document.getElementById("question-close-button");
const appElement = document.querySelector(".app");

// Must match the open/close transition length in question.css
const QUESTION_SCREEN_ANIMATION_MS = 350;

// Text longer than this (in characters) is shown in a smaller size
const LONG_QUESTION_LENGTH = 110;
const LONG_ANSWER_LENGTH = 24;

// Question reveal speed: about 375 words a minute, with a short
// breath after commas and full stops. Smaller numbers = faster.
const REVEAL_WORD_MS = 160;
const REVEAL_PUNCTUATION_PAUSE_MS = 120;

let isQuestionScreenOpen = false;
let isAnswerShown = false;

let revealWords = [];   // one <span> per word of the question
let revealIndex = 0;    // how many words are showing
let revealTimer = null; // null while paused (team buzzed in) or finished

// 30 SECONDS TO BUZZ: the clock starts once the question has fully
// appeared, pauses while a team is buzzed in (their own answer clock
// takes over) and carries on if they get it wrong. At 0 the buzzers
// close and nobody gets to answer. Click the clock to pause it.
//
// GOLDEN BOOST: no buzzing — the same clock becomes "Time to answer"
// for the wagering team (ANSWER_TIME_MS, 15 seconds) and starts as
// soon as the question is up. At 0 they get it wrong (lose the wager).
const BUZZ_WINDOW_MS = 30000;
const BUZZ_WINDOW_URGENT_MS = 10000; // turns red from here

const buzzWindowElement = document.getElementById("buzz-window");
const buzzWindowLabel = document.getElementById("buzz-window-label");
const buzzWindowSeconds = document.getElementById("buzz-window-seconds");
const buzzWindowFill = document.getElementById("buzz-window-fill");

// What to start when the question finishes appearing (or null):
// { mode: "buzz" } or, on a Golden Boost, { mode: "answer", teamId }
let buzzWindowPending = null;
// While it's running: { mode, teamId, totalMs, timeLeftMs, runningSince, hostPaused, intervalId, lastTick }
let buzzWindow = null;

/* ---------- Opening ---------- */

// goldenWager (Golden Boost only): { teamId, amount } from the wager step,
// so only that team can score, and they win or lose their wager.
function openQuestionScreen(categoryIndex, questionIndex, goldenWager = null) {
  const question = getQuestion(categoryIndex, questionIndex);

  // Fill in the card
  questionRoundElement.textContent = `Round ${gameState.currentRound}`;
  questionCategoryElement.textContent = getCategory(categoryIndex).name;
  questionValueElement.textContent = formatMoney(question.value);
  prepareQuestionReveal(question.question);
  answerTextElement.textContent = question.answer;
  questionCard.classList.toggle("has-long-question", question.question.length > LONG_QUESTION_LENGTH);
  questionCard.classList.toggle("has-long-answer", question.answer.length > LONG_ANSWER_LENGTH);

  // Optional picture (e.g. a flag). The alt text must never give away the answer.
  if (question.image) {
    questionImageElement.src = question.image;
    questionImageElement.alt = question.imageAlt || "Picture for this question";
    questionImageElement.hidden = false;
  } else {
    questionImageElement.removeAttribute("src");
    questionImageElement.hidden = true;
  }
  questionCard.classList.toggle("has-image", Boolean(question.image));
  // No question text (e.g. Flags): just the picture, shown bigger (question.css)
  questionCard.classList.toggle("has-no-text", !question.question.trim());

  // The Golden Boost question gets a gold card and a badge (golden-boost.css)
  const isGolden = isGoldenBoost(categoryIndex, questionIndex); // game.js
  questionCard.classList.toggle("is-golden", isGolden);
  goldenBadge.hidden = !isGolden;

  // Points at stake for the ✓ / ✗ buttons (scoreboard.js)
  const wagerTeam = goldenWager && getTeam(goldenWager.teamId);
  if (wagerTeam) {
    goldenBadge.textContent = `★ Golden Boost ★  ${wagerTeam.name} wagered ${formatMoney(goldenWager.amount)}`;
    prepareAwards(goldenWager.amount, [wagerTeam.id]);
  } else {
    goldenBadge.textContent = "★ Golden Boost ★";
    prepareAwards(question.value);
  }

  // 30 seconds to buzz — or, on a Golden Boost, the wagering team's
  // answer clock, which starts without anyone buzzing
  stopBuzzWindow();
  buzzWindowPending = wagerTeam ? { mode: "answer", teamId: wagerTeam.id } : { mode: "buzz" };

  // Start in the "question only" state
  isAnswerShown = false;
  questionCard.classList.remove("is-answer-shown");
  answerBlock.hidden = true;
  showAnswerButton.hidden = false;
  backToBoardButton.hidden = true;
  questionCloseButton.hidden = false;

  // Show it. Reading offsetHeight makes the browser lay out the
  // "closed" state first, so adding .is-open plays the fade/scale-in.
  questionScreen.hidden = false;
  void questionScreen.offsetHeight;
  questionScreen.classList.add("is-open");
  document.body.classList.add("is-question-open"); // dims the board behind
  appElement.inert = true; // board can't be clicked or tabbed to while the card is open
  setMusicDucked(true); // music.js — quieter while people think
  if (!isGolden) playQuestionOpenSound(); // sound-effects.js (the Golden Boost has its own sting)

  isQuestionScreenOpen = true;
  // buzzer-host.js — opens the buzzers. Golden Boost: nobody buzzes (the
  // wagering team's clock starts on its own), so every phone stays locked.
  const lockedOutTeamIds = wagerTeam ? getTeams().map((team) => team.id) : [];
  resetBuzzersForQuestion(lockedOutTeamIds);

  // buzzer-host.js — the full question and answer, straight away, on the host's phone
  sendQuestionToHostScreen({
    round: gameState.currentRound,
    category: getCategory(categoryIndex).name,
    value: formatMoney(question.value),
    question: question.question,
    answer: question.answer,
    image: question.image || null,
    golden: isGolden ? goldenBadge.textContent : null,
  });
  showAnswerButton.focus({ preventScroll: true });

  // First word once the card has finished opening
  if (isQuestionRevealing()) scheduleNextWord(QUESTION_SCREEN_ANIMATION_MS);
  else finishQuestionReveal();
}

/* ---------- Word-by-word question ---------- */

function prepareQuestionReveal(text) {
  stopQuestionReveal();

  // Every word is on the card from the start, just invisible, so the
  // text doesn't jump around as it fills in
  questionTextElement.textContent = "";
  revealWords = text.split(/\s+/).filter(Boolean).map((word, index) => {
    const span = document.createElement("span");
    span.className = "question-word";
    span.textContent = word;
    if (index > 0) questionTextElement.append(" ");
    questionTextElement.append(span);
    return span;
  });
  revealIndex = 0;
  questionCard.classList.add("is-revealing"); // hides the picture until the text is done
}

function scheduleNextWord(delay) {
  clearTimeout(revealTimer);
  revealTimer = setTimeout(revealNextWord, delay);
}

function revealNextWord() {
  revealTimer = null;
  if (getBuzzedTeamId()) return; // buzzer-host.js — paused; handleBuzzersChanged() resumes it

  const word = revealWords[revealIndex];
  revealIndex += 1;
  word.classList.add("is-shown");

  if (revealIndex >= revealWords.length) {
    finishQuestionReveal();
  } else {
    const hasPunctuation = /[,.;:?!]$/.test(word.textContent);
    scheduleNextWord(REVEAL_WORD_MS + (hasPunctuation ? REVEAL_PUNCTUATION_PAUSE_MS : 0));
  }
}

// Shows the whole question straight away
function finishQuestionReveal() {
  stopQuestionReveal();
  revealWords.forEach((word) => word.classList.add("is-shown"));
  revealIndex = revealWords.length;
  questionCard.classList.remove("is-revealing");

  // The whole question is up: the clock begins
  if (buzzWindowPending && isQuestionScreenOpen && !isAnswerShown) startBuzzWindow(buzzWindowPending);
}

/* ---------- 30 seconds to buzz (Golden Boost: 15 seconds to answer) ---------- */

function startBuzzWindow({ mode, teamId = null }) {
  buzzWindowPending = null;
  const totalMs = mode === "answer" ? ANSWER_TIME_MS : BUZZ_WINDOW_MS; // ANSWER_TIME_MS: buzzer-host.js
  buzzWindow = { mode, teamId, totalMs, timeLeftMs: totalMs, runningSince: Date.now(), hostPaused: false, intervalId: setInterval(tickBuzzWindow, 100), lastTick: null };
  buzzWindowElement.className = "buzz-window";
  buzzWindowElement.hidden = false;
  tickBuzzWindow();
}

function stopBuzzWindow() {
  buzzWindowPending = null;
  if (buzzWindow) clearInterval(buzzWindow.intervalId);
  buzzWindow = null;
  buzzWindowElement.hidden = true;
}

// How much of the 30 seconds is left right now
function getBuzzWindowTimeLeft() {
  if (!buzzWindow) return 0;
  const runningFor = buzzWindow.runningSince ? Date.now() - buzzWindow.runningSince : 0;
  return buzzWindow.timeLeftMs - runningFor;
}

function tickBuzzWindow() {
  if (!buzzWindow) return;

  // Paused while a team is answering (buzzer-host.js) or the host paused it.
  // (On a Golden Boost nobody buzzes, so only the host can pause it.)
  const isAnswerClock = buzzWindow.mode === "answer";
  const teamIsAnswering = !isAnswerClock && Boolean(getBuzzedTeamId());
  const shouldRun = !teamIsAnswering && !buzzWindow.hostPaused;
  if (!shouldRun && buzzWindow.runningSince) {
    buzzWindow.timeLeftMs = getBuzzWindowTimeLeft(); // bank the time used so far
    buzzWindow.runningSince = null;
  } else if (shouldRun && !buzzWindow.runningSince) {
    buzzWindow.runningSince = Date.now();
  }

  const timeLeft = getBuzzWindowTimeLeft();
  if (timeLeft <= 0) {
    endBuzzWindow();
    return;
  }

  const seconds = Math.ceil(timeLeft / 1000);
  buzzWindowSeconds.textContent = seconds;
  buzzWindowFill.style.width = `${(timeLeft / buzzWindow.totalMs) * 100}%`;
  buzzWindowLabel.textContent =
    teamIsAnswering ? "Answering…" :
    buzzWindow.hostPaused ? "Paused" :
    isAnswerClock ? "Time to answer" : "Time to buzz";
  const urgentMs = isAnswerClock ? ANSWER_TIME_URGENT_MS : BUZZ_WINDOW_URGENT_MS; // buzzer-host.js
  buzzWindowElement.classList.toggle("is-paused", !shouldRun);
  buzzWindowElement.classList.toggle("is-urgent", shouldRun && timeLeft <= urgentMs);

  // A soft tick for each of the last 5 seconds (sound-effects.js)
  if (shouldRun && seconds <= 5 && seconds !== buzzWindow.lastTick) {
    buzzWindow.lastTick = seconds;
    playCountdownTick();
  }
}

// Time ran out.
//   Buzz clock: nobody buzzed — close the buzzers, no one gets to answer.
//   Golden Boost answer clock: the wagering team didn't answer — they get it wrong.
function endBuzzWindow() {
  const { mode, teamId } = buzzWindow;
  clearInterval(buzzWindow.intervalId);
  buzzWindow = null;
  buzzWindowElement.className = "buzz-window is-over";
  buzzWindowSeconds.textContent = "0";
  buzzWindowFill.style.width = "0%";
  playTimesUpSound(); // music.js

  if (mode === "answer") {
    buzzWindowLabel.textContent = "Time's up";
    markTeamWrong(teamId); // scoreboard.js — they lose their wager
  } else {
    buzzWindowLabel.textContent = "Time's up — no one buzzed";
    closeBuzzersTimeUp(); // buzzer-host.js
  }
}

// Click the clock to pause or resume it (e.g. to explain something)
buzzWindowElement.addEventListener("click", () => {
  if (!buzzWindow) return;
  buzzWindow.hostPaused = !buzzWindow.hostPaused;
  tickBuzzWindow();
});

function stopQuestionReveal() {
  clearTimeout(revealTimer);
  revealTimer = null;
}

function isQuestionRevealing() {
  return revealIndex < revealWords.length;
}

// buzzer-host.js calls this whenever the buzzers change:
// a team buzzing in pauses the question, unlocking carries on
function handleBuzzersChanged() {
  if (!isQuestionScreenOpen || !isQuestionRevealing()) return;
  if (!getBuzzedTeamId() && !revealTimer) scheduleNextWord(REVEAL_WORD_MS);
}

// True while a team could still be answering (buzzer-host.js uses
// this to decide whether to start the 15-second clock)
function isQuestionAwaitingAnswer() {
  return isQuestionScreenOpen && !isAnswerShown;
}

/* ---------- Revealing the answer ---------- */

function showAnswer() {
  if (!isQuestionScreenOpen || isAnswerShown) return;
  isAnswerShown = true;

  finishQuestionReveal();
  stopAnswerTimer(); // buzzer-host.js — no more countdown once the answer is out
  stopBuzzWindow();
  playAnswerRevealSound(); // sound-effects.js
  questionCard.classList.add("is-answer-shown"); // triggers the reveal animation
  answerBlock.hidden = false;
  showAnswerButton.hidden = true;
  backToBoardButton.hidden = false;

  // Once the answer is seen, the question counts as played — no more ×
  questionCloseButton.hidden = true;

  showAwardRow(); // scoreboard.js — ✓ / ✗ for each team

  // On short screens the answer may be below the fold — bring it into view
  answerBlock.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion ? "auto" : "smooth" });

  backToBoardButton.focus({ preventScroll: true });
}

/* ---------- Closing ---------- */

// markAsPlayed: true  → question is ANSWERED (tile locks)
//               false → question goes back to UNUSED (tile playable again)
async function closeQuestionScreen(markAsPlayed) {
  if (!isQuestionScreenOpen) return;
  isQuestionScreenOpen = false;

  // Remember which question this was before game.js clears it
  const { categoryIndex, questionIndex } = gameState.activeQuestion;

  if (markAsPlayed) {
    finishActiveQuestion();
  } else {
    cancelActiveQuestion();
  }
  awardRowElement.hidden = true;
  stopQuestionReveal();
  stopBuzzWindow();
  resetBuzzersForQuestion(); // buzzer-host.js — clears any buzz and closes the buzzers
  sendQuestionToHostScreen(null); // buzzer-host.js — host's phone goes back to "waiting"

  // Play the closing animation, then hide
  questionScreen.classList.remove("is-open");
  document.body.classList.remove("is-question-open");
  setMusicDucked(false);
  await wait(QUESTION_SCREEN_ANIMATION_MS); // wait() lives in main.js
  questionScreen.hidden = true;
  appElement.inert = false;

  handleQuestionClosed(categoryIndex, questionIndex); // board.js updates the tile
}

/* ---------- Buttons & keyboard ---------- */

showAnswerButton.addEventListener("click", showAnswer);
backToBoardButton.addEventListener("click", () => closeQuestionScreen(true));
questionCloseButton.addEventListener("click", () => closeQuestionScreen(false));
questionTextElement.addEventListener("click", () => { if (isQuestionScreenOpen) finishQuestionReveal(); });

document.addEventListener("keydown", (event) => {
  if (!isQuestionScreenOpen || event.key !== "Escape") return;

  // Esc does the same as the visible close option
  closeQuestionScreen(isAnswerShown);
});
