/* =========================================================
   board.js — Draws the game screen (header, board, footer)
   and handles tile clicks.

   It reads state from game.js and asks game.js to make
   changes — it never decides game rules on its own.
   ========================================================= */

const boardElement = document.getElementById("board");
const roundNumberElement = document.getElementById("round-number");
const boardStatusElement = document.getElementById("board-status");
const questionsRemainingElement = document.getElementById("questions-remaining");
const roundProgressBar = document.getElementById("round-progress-bar");

// A short pause after clicking a tile so its "picked" glow is visible
// before the question screen opens.
const TILE_PICK_DELAY_MS = 450;

// How long the board's cascade-in animation takes (see game.css)
const BOARD_ENTRANCE_MS = 1600;

let tilePickTimer = null;
let boardEntranceTimer = null;

/* ---------- Helpers ---------- */

// 1000 → "$1,000"   -300 → "-$300"
function formatMoney(amount) {
  const sign = amount < 0 ? "-" : "";
  return `${sign}$${Math.abs(amount).toLocaleString("en-US")}`;
}

function getTileElement(categoryIndex, questionIndex) {
  return boardElement.querySelector(
    `.tile[data-category="${categoryIndex}"][data-question="${questionIndex}"]`
  );
}

/* ---------- Drawing the game screen ---------- */

// Draws everything for the current round. The board starts hidden so
// playBoardEntrance() can animate it in.
function renderGameScreen() {
  clearTimeout(tilePickTimer);
  clearTimeout(boardEntranceTimer);

  updateHeader();
  renderBoard();
  updateBoardFooter();
  showWhoPicksNext();

  boardElement.classList.remove("board--entering", "board--locked");
  boardElement.classList.add("board--pre-enter");
}

function updateHeader() {
  roundNumberElement.textContent = gameState.currentRound;
}

// Builds the category headers and tiles from questions.js.
// CSS grid fills row by row, so we add all headers first,
// then row 1 of every category, then row 2, and so on.
function renderBoard() {
  const categories = getRoundData().categories;
  const rowCount = Math.max(...categories.map((category) => category.questions.length));

  boardElement.style.setProperty("--category-count", categories.length);
  boardElement.style.setProperty("--row-count", rowCount);
  boardElement.innerHTML = "";

  categories.forEach((category, categoryIndex) => {
    boardElement.appendChild(createCategoryHeader(category, categoryIndex));
  });

  for (let questionIndex = 0; questionIndex < rowCount; questionIndex++) {
    categories.forEach((category, categoryIndex) => {
      boardElement.appendChild(createTile(categoryIndex, questionIndex));
    });
  }
}

function createCategoryHeader(category, categoryIndex) {
  const header = document.createElement("div");
  header.className = "category";
  header.style.setProperty("--enter-delay", `${categoryIndex * 70}ms`);

  const name = document.createElement("span");
  name.className = "category__name";
  name.textContent = category.name;

  header.appendChild(name);
  return header;
}

function createTile(categoryIndex, questionIndex) {
  const question = getQuestion(categoryIndex, questionIndex);

  const tile = document.createElement("button");
  tile.type = "button";
  tile.className = "tile";
  tile.dataset.category = categoryIndex;
  tile.dataset.question = questionIndex;

  // Tiles cascade in row by row, slightly offset per column
  tile.style.setProperty("--enter-delay", `${350 + questionIndex * 80 + categoryIndex * 40}ms`);

  const valueLabel = document.createElement("span");
  valueLabel.className = "tile__value";
  valueLabel.textContent = formatMoney(question.value);

  const playedLabel = document.createElement("span");
  playedLabel.className = "tile__played";
  playedLabel.textContent = "Played";

  tile.append(valueLabel, playedLabel);
  tile.addEventListener("click", () => handleTileClick(categoryIndex, questionIndex));

  updateTile(tile, categoryIndex, questionIndex);
  return tile;
}

// Copies a question's state from game.js onto its tile.
// CSS uses the data-state attribute to style UNUSED / ACTIVE / ANSWERED.
function updateTile(tile, categoryIndex, questionIndex) {
  const state = getQuestionState(categoryIndex, questionIndex);
  const question = getQuestion(categoryIndex, questionIndex);
  const categoryName = getCategory(categoryIndex).name;

  tile.dataset.state = state;
  tile.disabled = state === QUESTION_STATE.ANSWERED;

  // Once the Golden Boost has been played, its tile stays gold so everyone
  // remembers where it was. (Before that it looks like any other tile.)
  const isGoldenPlayed = isGoldenBoost(categoryIndex, questionIndex) && state === QUESTION_STATE.ANSWERED;
  tile.classList.toggle("tile--golden-played", isGoldenPlayed);
  tile.querySelector(".tile__played").textContent = isGoldenPlayed ? "Golden Boost" : "Played";

  const playedNote = state === QUESTION_STATE.ANSWERED ? ", already played" : "";
  tile.setAttribute("aria-label", `${categoryName} for ${formatMoney(question.value)}${playedNote}`);
}

function refreshTile(categoryIndex, questionIndex) {
  updateTile(getTileElement(categoryIndex, questionIndex), categoryIndex, questionIndex);

  // Lock the rest of the board while a question is open
  boardElement.classList.toggle("board--locked", gameState.activeQuestion !== null);
}

/* ---------- Footer ---------- */

function updateBoardFooter() {
  const remaining = getRemainingQuestionCount();
  const total = getTotalQuestionCount();
  const percentPlayed = ((total - remaining) / total) * 100;

  questionsRemainingElement.textContent = remaining;
  roundProgressBar.style.width = `${percentPlayed}%`;
}

function setBoardStatus(message, isHighlighted = false) {
  boardStatusElement.textContent = message;
  boardStatusElement.classList.toggle("is-highlight", isHighlighted);
}

// "Team 1 has the board — pick a question", or asks who goes first
function showWhoPicksNext() {
  const boardTeam = getTeam(getBoardTeamId()); // teams.js
  if (boardTeam) {
    setBoardStatus(`${boardTeam.name} has the board — pick a question`);
  } else {
    setBoardStatus("Who picks first? Click the ♛ next to their team", true);
  }
}

// The board changing hands (or a team being renamed) updates the line,
// unless a question is being played or the round is over
onTeamsChanged(() => {
  if (gameState.activeQuestion === null && !isRoundComplete()) showWhoPicksNext();
});

/* ---------- Animations ---------- */

// Plays the cascade-in animation for the categories and tiles.
function playBoardEntrance() {
  boardElement.classList.remove("board--pre-enter");
  boardElement.classList.add("board--entering");

  // Remove the class afterwards so it doesn't interfere with tile-state animations
  boardEntranceTimer = setTimeout(() => {
    boardElement.classList.remove("board--entering");
  }, BOARD_ENTRANCE_MS);
}

/* ---------- Tile clicks ---------- */

function handleTileClick(categoryIndex, questionIndex) {
  // game.js decides whether this question can be played
  const question = selectQuestion(categoryIndex, questionIndex);
  if (question === null) {
    return;
  }

  refreshTile(categoryIndex, questionIndex); // tile turns ACTIVE (gold glow)
  playTileSelectSound(); // sound-effects.js
  setBoardStatus(`${getCategory(categoryIndex).name} for ${formatMoney(question.value)}`, true);

  // Let the tile glow for a moment, then open the question (question-screen.js).
  // The hidden Golden Boost question gets its big reveal first (golden-boost.js).
  tilePickTimer = setTimeout(async () => {
    let goldenWager = null;
    if (isGoldenBoost(categoryIndex, questionIndex)) {
      goldenWager = await playGoldenBoostIntro(question); // waits for the host to enter the wager
    }
    openQuestionScreen(categoryIndex, questionIndex, goldenWager);
  }, TILE_PICK_DELAY_MS);
}

// Called by question-screen.js after the question screen closes.
// game.js has already updated the question's state by this point.
function handleQuestionClosed(categoryIndex, questionIndex) {
  refreshTile(categoryIndex, questionIndex);
  updateBoardFooter();

  if (isRoundComplete()) {
    setBoardStatus("Board cleared!", true);
    handleRoundComplete(); // main.js moves on to the next screen
    return;
  }

  showWhoPicksNext();

  // Keep keyboard focus on the board. A played tile is disabled,
  // so focus goes back to the tile only if it's still playable.
  const tile = getTileElement(categoryIndex, questionIndex);
  if (!tile.disabled) {
    tile.focus({ preventScroll: true });
  }
}
