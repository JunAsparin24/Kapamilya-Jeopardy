/* =========================================================
   golden-boost.js — The GOLDEN BOOST reveal.

   A question with "special: true" in questions.js is the hidden
   Golden Boost. When it's picked, board.js calls
   playGoldenBoostIntro() before opening the question: a gold
   flash, spinning rays, a burst of sparkles and a big
   "GOLDEN BOOST" title (plus a sound effect from music.js).
   The question card then opens in gold (see question-screen.js
   and golden-boost.css).
   ========================================================= */

const goldenBoostOverlay = document.getElementById("golden-boost");
const goldenBoostSparkles = document.getElementById("golden-boost-sparkles");

// How long the reveal stays on screen before the golden card opens
const GOLDEN_BOOST_INTRO_MS = 2800;
const GOLDEN_BOOST_FADE_MS = 400; // must match the fade-out in golden-boost.css
const GOLDEN_BOOST_SPARKLE_COUNT = 40;

// Plays the reveal. Returns a Promise that finishes as the reveal starts
// fading out — the moment the golden question card should open.
function playGoldenBoostIntro() {
  return new Promise((resolve) => {
    createGoldenBoostSparkles();

    goldenBoostOverlay.classList.remove("is-playing", "is-leaving");
    goldenBoostOverlay.hidden = false;
    void goldenBoostOverlay.offsetHeight; // restart the CSS animations
    goldenBoostOverlay.classList.add("is-playing");

    playGoldenBoostSting(); // music.js

    const introLength = prefersReducedMotion ? 1500 : GOLDEN_BOOST_INTRO_MS;

    setTimeout(() => {
      goldenBoostOverlay.classList.add("is-leaving");
      resolve();

      setTimeout(() => {
        goldenBoostOverlay.hidden = true;
        goldenBoostOverlay.classList.remove("is-playing", "is-leaving");
      }, GOLDEN_BOOST_FADE_MS);
    }, introLength);
  });
}

// Sparkles that burst outward from the middle of the screen
function createGoldenBoostSparkles() {
  goldenBoostSparkles.innerHTML = "";
  if (prefersReducedMotion) return;

  const randomBetween = (min, max) => min + Math.random() * (max - min);

  for (let i = 0; i < GOLDEN_BOOST_SPARKLE_COUNT; i++) {
    const sparkle = document.createElement("span");
    const angle = (i / GOLDEN_BOOST_SPARKLE_COUNT) * Math.PI * 2 + randomBetween(-0.15, 0.15);
    const distance = randomBetween(28, 55); // in vmin, so it scales with the screen

    sparkle.className = "golden-boost__sparkle";
    sparkle.style.setProperty("--dx", `${Math.cos(angle) * distance}vmin`);
    sparkle.style.setProperty("--dy", `${Math.sin(angle) * distance}vmin`);
    sparkle.style.setProperty("--size", `${randomBetween(5, 12)}px`);
    sparkle.style.setProperty("--delay", `${randomBetween(250, 600)}ms`);
    sparkle.style.setProperty("--duration", `${randomBetween(1100, 1700)}ms`);
    goldenBoostSparkles.appendChild(sparkle);
  }
}
