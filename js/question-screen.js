/* =========================================================
   question-screen.js — The question card that opens on top
   of the board.

   Flow:  tile clicked → card opens with the question
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

let isQuestionScreenOpen = false;
let isAnswerShown = false;

/* ---------- Opening ---------- */

function openQuestionScreen(categoryIndex, questionIndex) {
  const question = getQuestion(categoryIndex, questionIndex);

  // Fill in the card
  questionRoundElement.textContent = `Round ${gameState.currentRound}`;
  questionCategoryElement.textContent = getCategory(categoryIndex).name;
  questionValueElement.textContent = formatMoney(question.value);
  questionTextElement.textContent = question.question;
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

  isQuestionScreenOpen = true;
  showAnswerButton.focus({ preventScroll: true });
}

/* ---------- Revealing the answer ---------- */

function showAnswer() {
  if (!isQuestionScreenOpen || isAnswerShown) return;
  isAnswerShown = true;

  questionCard.classList.add("is-answer-shown"); // triggers the reveal animation
  answerBlock.hidden = false;
  showAnswerButton.hidden = true;
  backToBoardButton.hidden = false;

  // Once the answer is seen, the question counts as played — no more ×
  questionCloseButton.hidden = true;

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

document.addEventListener("keydown", (event) => {
  if (!isQuestionScreenOpen || event.key !== "Escape") return;

  // Esc does the same as the visible close option
  closeQuestionScreen(isAnswerShown);
});
