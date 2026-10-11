/* =========================================================
   fit.js — Nothing scrolls, on any screen size.

   If a screen (or the inside of a card or pop-up) is taller than
   the space it has, it's shrunk just enough to fit, using CSS
   zoom. It re-checks by itself whenever anything changes size:
   a new screen, the window, a question being typed out, the
   answer appearing, more teams on the scoreboard...
   ========================================================= */

const FIT_MIN_ZOOM = 0.5; // never shrink below half size
const FIT_TOLERANCE = 1.002; // ignore sub-pixel rounding

// Shrinks `parts` until `measureOverflow()` says they fit (a few passes, because
// padding around the shrunk parts doesn't shrink with them)
function shrinkToFit(parts, measureOverflow) {
  parts.forEach((part) => { part.style.zoom = ""; });
  let zoom = 1;
  for (let pass = 0; pass < 6; pass++) {
    const overflow = measureOverflow(); // 1 = fits exactly, 1.2 = 20% too big
    if (overflow <= FIT_TOLERANCE || zoom <= FIT_MIN_ZOOM) break;
    zoom = Math.max(FIT_MIN_ZOOM, zoom / overflow);
    parts.forEach((part) => { part.style.zoom = String(zoom); });
  }
}

// The active screen must fit in the window, both ways
function fitActiveScreen() {
  const screen = document.querySelector(".screen.is-active");
  if (!screen) return;
  const page = document.documentElement;
  shrinkToFit([screen], () => Math.max(
    page.scrollHeight / window.innerHeight,
    page.scrollWidth / window.innerWidth,
  ));
}

// Everything inside `container` must fit in its space without scrolling
// (`space`: how tall it may be; by default, its own height)
function fitInside(container, space = () => container.clientHeight) {
  if (!container.getClientRects().length) return; // not on screen right now
  shrinkToFit([...container.children], () => container.scrollHeight / space());
}

// Cards and pop-ups that shrink their contents to fit.
// "when": only fit while this is true (the Golden Boost title zooms in
// during its reveal, which mustn't count as "too big")
const fitContainers = [
  { container: document.querySelector(".question-card__body") }, // a long question + its answer
  { container: document.querySelector(".golden-boost__content"), when: () => goldenBoostOverlay.classList.contains("is-wagering"), space: () => goldenBoostOverlay.clientHeight }, // golden-boost.js
  { container: document.querySelector(".join-panel__card") }, // QR codes and links
];

function fitAllContainers() {
  fitContainers.forEach(({ container, when, space }) => {
    if (!when || when()) {
      fitInside(container, space);
    } else {
      [...container.children].forEach((part) => { part.style.zoom = ""; }); // back to full size
    }
  });
}

// Re-check whenever any of these change size
const screenWatcher = new ResizeObserver(() => fitActiveScreen());
document.querySelectorAll(".screen").forEach((screen) => screenWatcher.observe(screen));

const containerWatcher = new ResizeObserver(() => fitAllContainers());
fitContainers.forEach(({ container }) => {
  containerWatcher.observe(container);
  [...container.children].forEach((part) => containerWatcher.observe(part));
});
