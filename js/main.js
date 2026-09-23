/* =========================================================
   main.js — App startup and navigation between screens.
   Also creates the background particles and runs the
   full-screen "wipe" transition.
   ========================================================= */

const screens = {
  home: document.getElementById("home-screen"),
  game: document.getElementById("game-screen"),
  roundComplete: document.getElementById("round-complete-screen"),
  gameOver: document.getElementById("game-over-screen"),
};

const startButton = document.getElementById("start-button");
const menuButton = document.getElementById("menu-button");
const continueButton = document.getElementById("continue-button");
const playAgainButton = document.getElementById("play-again-button");
const mainMenuButton = document.getElementById("main-menu-button");

// Pause after the last question so players see the cleared board
// before the next screen sweeps in
const ROUND_END_PAUSE_MS = 1200;
let roundEndTimer = null;

// How long the Menu button waits for a second "Leave game?" click
const MENU_CONFIRM_MS = 3000;
let menuConfirmTimer = null;

const transitionWipe = document.getElementById("transition-wipe");
const wipeTitle = document.getElementById("wipe-title");
const wipeSubtitle = document.getElementById("wipe-subtitle");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Prevents double-clicks from starting two transitions at once
let isTransitioning = false;

/* ---------- Screens ---------- */

// Shows one screen and hides the others. screenName: a key of `screens` above
function showScreen(screenName) {
  Object.entries(screens).forEach(([name, element]) => {
    element.classList.toggle("is-active", name === screenName);
  });

  document.body.dataset.screen = screenName; // lets CSS dim the background during play
  window.scrollTo(0, 0);
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

// Waits for an animation to finish. The timer is a safety net: browsers can
// pause animations (e.g. in a background tab), and the game must never get stuck.
function animationDone(animation, duration) {
  return Promise.race([animation.finished, wait(duration + 100)]);
}

/* ---------- Transition wipe ----------
   1. Panel slides in and covers the screen
   2. onCovered() runs — swap screens here, the player can't see it
   3. Optional title ("ROUND 1") is shown for a moment
   4. onReveal() runs, then the panel slides away
   Reused later for round changes and the end-of-game screen. */
async function playTransition({ title = "", subtitle = "", onCovered, onReveal } = {}) {
  const slideOptions = {
    duration: prefersReducedMotion ? 1 : 450,
    easing: "cubic-bezier(0.7, 0, 0.3, 1)",
    fill: "forwards",
  };
  const holdDuration = title ? 800 : 150;

  wipeTitle.textContent = title;
  wipeSubtitle.textContent = subtitle;
  transitionWipe.hidden = false;

  const slideIn = transitionWipe.animate(
    [{ transform: "translateX(-101%)" }, { transform: "translateX(0)" }],
    slideOptions
  );
  await animationDone(slideIn, slideOptions.duration);

  if (onCovered) onCovered();
  transitionWipe.classList.add("wipe--show-text");
  await wait(holdDuration);

  if (onReveal) onReveal();
  const slideOut = transitionWipe.animate(
    [{ transform: "translateX(0)" }, { transform: "translateX(101%)" }],
    slideOptions
  );
  await animationDone(slideOut, slideOptions.duration);

  // Clean up so the next transition starts fresh
  transitionWipe.classList.remove("wipe--show-text");
  transitionWipe.hidden = true;
  slideIn.cancel();
  slideOut.cancel();
}

/* ---------- Navigation ---------- */

async function handleStartGame() {
  if (isTransitioning) return;
  isTransitioning = true;
  clearTimeout(roundEndTimer);
  resetMenuButton();
  playSong("game"); // music.js — crossfades from the menu music

  startNewGame(); // game.js — round 1, all questions unused
  await playRoundIntro();

  isTransitioning = false;
}

async function handleReturnToMenu() {
  if (isTransitioning) return;
  isTransitioning = true;
  clearTimeout(roundEndTimer);
  playSong("menu"); // music.js — back to the horn theme

  await playTransition({
    onCovered: () => showScreen("home"),
  });

  isTransitioning = false;
}

// The board's Menu button needs two clicks, so a misclick can't end a game.
// First click: button changes to "Leave game?". Second click: go to the menu.
function handleMenuButtonClick() {
  if (!menuButton.classList.contains("is-confirming")) {
    menuButton.classList.add("is-confirming");
    menuButton.textContent = "Leave game?";
    menuConfirmTimer = setTimeout(resetMenuButton, MENU_CONFIRM_MS);
    return;
  }

  resetMenuButton();
  handleReturnToMenu();
}

function resetMenuButton() {
  clearTimeout(menuConfirmTimer);
  menuButton.classList.remove("is-confirming");
  menuButton.textContent = "← Menu";
}

// The "ROUND 2 / $200 – $1,000" wipe, then the board cascades in.
// Used when a game starts and when moving to the next round.
function playRoundIntro() {
  const values = getRoundValues();
  const lowestValue = formatMoney(Math.min(...values));
  const highestValue = formatMoney(Math.max(...values));

  return playTransition({
    title: `Round ${gameState.currentRound}`,
    subtitle: `${lowestValue} – ${highestValue}`,
    onCovered: () => {
      renderGameScreen(); // board.js
      showScreen("game");
    },
    onReveal: playBoardEntrance, // board.js
  });
}

/* ---------- Between rounds ---------- */

// Called by board.js when the last question on the board is closed.
// Goes to "Round Complete", or to "Game Over" after the final round.
function handleRoundComplete() {
  const nextScreen = hasNextRound() ? showRoundCompleteScreen : showGameOverScreen;
  roundEndTimer = setTimeout(nextScreen, ROUND_END_PAUSE_MS);
}

async function showRoundCompleteScreen() {
  if (isTransitioning) return;
  isTransitioning = true;

  fillRoundCompleteScreen();
  await playTransition({
    onCovered: () => showScreen("roundComplete"),
  });

  isTransitioning = false;
}

// Fills in "ROUND 1 COMPLETE" and the preview of the next round's values
function fillRoundCompleteScreen() {
  const nextRound = gameState.currentRound + 1;

  document.getElementById("completed-round-number").textContent = gameState.currentRound;
  document.getElementById("next-round-number").textContent = nextRound;
  document.getElementById("continue-round-number").textContent = nextRound;

  const valuesList = document.getElementById("next-round-values");
  valuesList.innerHTML = "";

  getRoundValues(nextRound).forEach((value, index) => {
    const chip = document.createElement("li");
    chip.className = "value-chip";
    chip.textContent = formatMoney(value);
    chip.style.setProperty("--chip-delay", `${700 + index * 90}ms`);
    valuesList.appendChild(chip);
  });
}

async function handleContinueToNextRound() {
  if (isTransitioning) return;
  isTransitioning = true;

  advanceToNextRound(); // game.js — next round, fresh board
  playRoundSting();     // music.js — horn fanfare as the "ROUND 2" wipe comes in
  await playRoundIntro();

  isTransitioning = false;
}

/* ---------- End of game ---------- */

async function showGameOverScreen() {
  if (isTransitioning) return;
  isTransitioning = true;

  fillGameOverScreen();
  await playTransition({
    onCovered: () => showScreen("gameOver"),
    onReveal: () => launchConfetti(60),
  });

  isTransitioning = false;
}

function fillGameOverScreen() {
  const totals = getGameTotals(); // game.js

  document.getElementById("final-rounds").textContent = totals.rounds;
  document.getElementById("final-questions").textContent = totals.questions;
  document.getElementById("final-total-value").textContent = formatMoney(totals.totalValue);
}

// One burst of falling gold/purple confetti on the Game Over screen
function launchConfetti(count) {
  const container = document.getElementById("confetti");
  container.innerHTML = ""; // clear pieces from a previous game
  if (prefersReducedMotion) return;

  const colors = ["#f4c76a", "#ffe3a3", "#fff4dc", "#9a58ff", "#c7a6ff"];
  const randomBetween = (min, max) => min + Math.random() * (max - min);

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti__piece";
    piece.style.setProperty("--x", `${randomBetween(0, 100)}%`);
    piece.style.setProperty("--width", `${randomBetween(6, 11)}px`);
    piece.style.setProperty("--color", colors[i % colors.length]);
    piece.style.setProperty("--duration", `${randomBetween(2.6, 4.6)}s`);
    piece.style.setProperty("--delay", `${randomBetween(0, 0.9)}s`);
    piece.style.setProperty("--drift", `${randomBetween(-120, 120)}px`);
    piece.style.setProperty("--spin", `${randomBetween(-720, 720)}deg`);
    container.appendChild(piece);
  }
}

/* ---------- Developer shortcut ----------
   Playing 25 questions to test a round change takes a while.
   Type  devFinishRound()  in the browser console (F12) to mark every
   question except the bottom-right one as played. Safe to delete. */
function devFinishRound() {
  if (gameState.activeQuestion !== null) return;

  const states = gameState.questionStates;
  states.forEach((category) => category.fill(QUESTION_STATE.ANSWERED));

  const lastCategory = states[states.length - 1];
  lastCategory[lastCategory.length - 1] = QUESTION_STATE.UNUSED;

  renderBoard();
  updateBoardFooter();
}

/* ---------- Home screen ---------- */

// Fills in "2 ROUNDS / 5 CATEGORIES / 25 QUESTIONS" from questions.js
// so the home screen stays accurate if the data changes.
function fillHomeStats() {
  const firstRound = getRoundData(1);
  const questionsPerRound = firstRound.categories.reduce(
    (total, category) => total + category.questions.length,
    0
  );

  document.getElementById("stat-rounds").textContent = getTotalRounds();
  document.getElementById("stat-categories").textContent = firstRound.categories.length;
  document.getElementById("stat-questions").textContent = questionsPerRound;
}

// Creates the slow-rising gold particles in the background
function createBackgroundParticles(count) {
  if (prefersReducedMotion) return;

  const container = document.getElementById("particles");
  const randomBetween = (min, max) => min + Math.random() * (max - min);

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");
    const duration = randomBetween(16, 32);

    particle.className = "particle";
    particle.style.setProperty("--x", `${randomBetween(0, 100)}%`);
    particle.style.setProperty("--size", `${randomBetween(2, 5)}px`);
    particle.style.setProperty("--duration", `${duration}s`);
    particle.style.setProperty("--delay", `${-randomBetween(0, duration)}s`); // negative = already mid-flight on load
    particle.style.setProperty("--sway", `${randomBetween(-60, 60)}px`);
    particle.style.setProperty("--opacity", randomBetween(0.25, 0.7).toFixed(2));

    container.appendChild(particle);
  }
}

/* ---------- Startup ---------- */

function init() {
  fillHomeStats();
  createBackgroundParticles(28);

  startButton.addEventListener("click", handleStartGame);
  menuButton.addEventListener("click", handleMenuButtonClick);
  continueButton.addEventListener("click", handleContinueToNextRound);
  playAgainButton.addEventListener("click", handleStartGame); // full reset: round 1, fresh board
  mainMenuButton.addEventListener("click", handleReturnToMenu);
}

init();
