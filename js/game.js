/* =========================================================
   game.js — Game rules and game state.

   This file knows NOTHING about HTML. It only tracks what's
   happening in the game (round, which questions are played)
   and exposes functions the UI files can call.
   Team scores live in teams.js.
   ========================================================= */

// Every question on the board is always in exactly one of these states.
const QUESTION_STATE = Object.freeze({
  UNUSED: "unused",     // Not picked yet — tile is clickable
  ACTIVE: "active",     // Currently being played
  ANSWERED: "answered", // Already played — tile is locked
});

// The single source of truth for the current game.
const gameState = {
  currentRound: 1,

  // questionStates[categoryIndex][questionIndex] → one of QUESTION_STATE
  questionStates: [],

  // While a question is being played: { categoryIndex, questionIndex }
  // Otherwise: null
  activeQuestion: null,
};

/* ---------- Round data helpers ---------- */

// How many rounds exist in questions.js (round1, round2, ...)
function getTotalRounds() {
  return Object.keys(gameData).length;
}

// Returns the data for a round from questions.js (defaults to the current round)
function getRoundData(roundNumber = gameState.currentRound) {
  return gameData[`round${roundNumber}`];
}

function getCategory(categoryIndex) {
  return getRoundData().categories[categoryIndex];
}

function getQuestion(categoryIndex, questionIndex) {
  return getCategory(categoryIndex).questions[questionIndex];
}

function getQuestionState(categoryIndex, questionIndex) {
  return gameState.questionStates[categoryIndex][questionIndex];
}

// The dollar values of a round's rows, e.g. [100, 200, 300, 400, 500]
// (read from the first category — every category uses the same values)
function getRoundValues(roundNumber = gameState.currentRound) {
  return getRoundData(roundNumber).categories[0].questions.map((question) => question.value);
}

/* ---------- Starting / resetting ---------- */

// Resets everything for a brand-new game (also used by "Play Again" later).
function startNewGame() {
  gameState.currentRound = 1;
  gameState.activeQuestion = null;
  resetQuestionStates();
}

// Marks every question in the current round as UNUSED.
// The grid is built from questions.js, so it adapts if you add categories/questions.
function resetQuestionStates() {
  const round = getRoundData();

  gameState.questionStates = round.categories.map((category) =>
    category.questions.map(() => QUESTION_STATE.UNUSED)
  );
}

/* ---------- Rounds ---------- */

function hasNextRound() {
  return gameState.currentRound < getTotalRounds();
}

// Moves to the next round with a fresh board of UNUSED questions.
function advanceToNextRound() {
  if (!hasNextRound()) {
    return;
  }

  gameState.currentRound += 1;
  gameState.activeQuestion = null;
  resetQuestionStates();
}

/* ---------- Playing questions ---------- */

// Called when a tile is clicked.
// Returns the question object if it can be played, or null if it can't
// (already played, or another question is still open).
function selectQuestion(categoryIndex, questionIndex) {
  const isAnotherQuestionOpen = gameState.activeQuestion !== null;
  const isAlreadyUsed = getQuestionState(categoryIndex, questionIndex) !== QUESTION_STATE.UNUSED;

  if (isAnotherQuestionOpen || isAlreadyUsed) {
    return null;
  }

  gameState.questionStates[categoryIndex][questionIndex] = QUESTION_STATE.ACTIVE;
  gameState.activeQuestion = { categoryIndex, questionIndex };

  return getQuestion(categoryIndex, questionIndex);
}

// Marks the open question as ANSWERED so it can't be picked again.
function finishActiveQuestion() {
  closeActiveQuestion(QUESTION_STATE.ANSWERED);
}

// Puts the open question back on the board as UNUSED
// (for when a tile was clicked by mistake).
function cancelActiveQuestion() {
  closeActiveQuestion(QUESTION_STATE.UNUSED);
}

function closeActiveQuestion(newState) {
  if (gameState.activeQuestion === null) {
    return;
  }

  const { categoryIndex, questionIndex } = gameState.activeQuestion;
  gameState.questionStates[categoryIndex][questionIndex] = newState;
  gameState.activeQuestion = null;
}

/* ---------- Progress ---------- */

function getTotalQuestionCount() {
  return gameState.questionStates.flat().length;
}

function getAnsweredQuestionCount() {
  return gameState.questionStates
    .flat()
    .filter((state) => state === QUESTION_STATE.ANSWERED).length;
}

function getRemainingQuestionCount() {
  return getTotalQuestionCount() - getAnsweredQuestionCount();
}

function isRoundComplete() {
  return getRemainingQuestionCount() === 0;
}
