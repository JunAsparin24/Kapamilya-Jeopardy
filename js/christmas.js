/* =========================================================
   christmas.js — The Christmas decorations and the home
   screen's animations (styles in christmas.css).

   Behind every screen:
     - twinkling stars in the sky
     - big crystal snowflakes falling with the snow
     - Santa's sleigh and reindeer flying across now and then
     - a snowbank along the bottom
   On the home screen and the in-between screens:
     - two decorated Christmas trees with presents underneath
     - shiny ornaments swinging from the string of lights
   Home screen text:
     - "WELCOME TO" drifts down letter by letter like snow
     - "PANALO!" drops in letter by letter, then bobs and shines
     - the numbers count up

   To take Christmas down after the holidays, delete this file's
   <script> line and christmas.css's <link> line in index.html.
   ========================================================= */

const xmasStage = document.querySelector(".stage");
const xmasRandom = (min, max) => min + Math.random() * (max - min);

/* ---------- Twinkling stars ---------- */

function createTwinklingStars(count) {
  const sky = document.createElement("div");
  sky.className = "xmas-sky";
  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    star.className = "xmas-star";
    star.style.setProperty("--x", `${xmasRandom(2, 98)}%`);
    star.style.setProperty("--y", `${xmasRandom(6, 38)}%`);
    star.style.setProperty("--s", `${xmasRandom(6, 14)}px`);
    star.style.setProperty("--d", `${xmasRandom(0, 4)}s`);
    star.style.setProperty("--t", `${xmasRandom(2.2, 4.5)}s`);
    sky.appendChild(star);
  }
  xmasStage.appendChild(sky);
}

/* ---------- Big crystal snowflakes ---------- */

function createBigSnowflakes(count) {
  if (prefersReducedMotion) return; // main.js
  const box = document.createElement("div");
  box.className = "xmas-flakes";
  for (let i = 0; i < count; i++) {
    const duration = xmasRandom(14, 26);
    box.insertAdjacentHTML("beforeend",
      `<svg class="xmas-flake" viewBox="0 0 24 24" style="--x:${xmasRandom(0, 100)}%;--size:${xmasRandom(14, 30)}px;` +
      `--duration:${duration}s;--delay:${-xmasRandom(0, duration)}s;--sway:${xmasRandom(-80, 80)}px;--spin:${xmasRandom(-360, 360)}deg;` +
      `--opacity:${xmasRandom(0.5, 0.95).toFixed(2)}"><use href="#snowflake-shape"/></svg>`);
  }
  xmasStage.appendChild(box);
}

/* ---------- Santa's sleigh ---------- */

// One reindeer, facing right. Rudolph gets the glowing red nose.
function reindeerSvg(x, isRudolph) {
  return `
    <g transform="translate(${x} 50)" class="xmas-deer">
      <path d="M-16 -2 C-14 -9 10 -10 14 -3 C16 2 12 6 4 6 L-10 6 C-15 6 -18 3 -16 -2Z"/>
      <path d="M10 -5 L18 -18 L23 -16 L16 -2Z"/>
      <ellipse cx="23" cy="-18" rx="6" ry="3.6"/>
      <path class="xmas-deer__antler" d="M20 -21 L17 -30 M18.5 -26 L14 -28 M23 -21 L25 -30 M24 -26 L28.5 -28"/>
      <path class="xmas-deer__leg" d="M-11 5 L-17 14 M-6 5 L-4 15 M7 5 L13 13 M11 4 L18 11"/>
      ${isRudolph ? `<circle class="xmas-deer__nose" cx="29" cy="-17.5" r="2.6"/>` : ""}
    </g>`;
}

function createSleigh() {
  if (prefersReducedMotion) return;
  const sleigh = document.createElement("div");
  sleigh.className = "xmas-sleigh";
  sleigh.innerHTML = `
    <svg viewBox="0 0 420 90" aria-hidden="true">
      <path class="xmas-sleigh__reins" d="M108 44 Q 200 30 312 46"/>
      ${reindeerSvg(170, false)}${reindeerSvg(222, false)}${reindeerSvg(274, false)}${reindeerSvg(330, true)}
      <g class="xmas-sleigh__body">
        <circle cx="70" cy="30" r="13"/>
        <circle cx="48" cy="27" r="7"/>
        <path d="M41 22 L48 6 L56 22Z"/>
        <circle cx="48" cy="6" r="2.4"/>
        <path d="M14 38 L104 38 Q114 38 112 52 L34 60 Q14 58 14 38Z"/>
        <path class="xmas-sleigh__runner" d="M24 66 L108 66 Q120 66 118 56 M30 60 L28 66 M96 58 L96 66 M24 66 Q12 66 14 58"/>
      </g>
    </svg>`;
  xmasStage.appendChild(sleigh);
}

/* ---------- Snowbank ---------- */

function createSnowbank() {
  const bank = document.createElement("div");
  bank.className = "xmas-snowbank";
  bank.innerHTML = `
    <svg viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 60 C80 30 160 40 240 55 C330 72 400 30 500 40 C600 50 660 70 760 52 C860 34 940 46 1020 60 C1100 74 1160 46 1200 50 L1200 100 L0 100Z" fill="#e9f1f7"/>
      <path d="M0 78 C120 58 220 70 330 76 C450 82 540 60 660 68 C780 76 880 86 1000 74 C1090 66 1160 72 1200 70 L1200 100 L0 100Z" fill="#ffffff"/>
    </svg>`;
  xmasStage.appendChild(bank);
}

/* ---------- Christmas trees and presents ---------- */

function treeSvg() {
  const lights = [];
  const lightColors = ["#ff3b3b", "#ffd23f", "#3fa9ff", "#2fd36b", "#ffffff"];
  // Lights scattered over the three tiers
  [[100, 62], [82, 84], [120, 90], [70, 120], [104, 116], [132, 128], [58, 160], [92, 150],
   [126, 162], [150, 172], [44, 204], [78, 196], [112, 206], [146, 200], [168, 222], [34, 236],
   [66, 240], [100, 232], [134, 244]].forEach(([x, y], index) => {
    lights.push(`<circle class="xmas-tree__light" cx="${x}" cy="${y}" r="4.2" fill="${lightColors[index % lightColors.length]}" style="--d:${(index % 5) * 0.35}s"/>`);
  });
  return `
    <svg viewBox="0 0 200 330" aria-hidden="true">
      <defs>
        <linearGradient id="tree-green" x1="0" x2="1">
          <stop offset="0" stop-color="#156c38"/><stop offset="0.5" stop-color="#1f8a4c"/><stop offset="1" stop-color="#0f5229"/>
        </linearGradient>
        <radialGradient id="bauble-red" cx="0.35" cy="0.35"><stop offset="0" stop-color="#ff8a8a"/><stop offset="1" stop-color="#b3121f"/></radialGradient>
        <radialGradient id="bauble-gold" cx="0.35" cy="0.35"><stop offset="0" stop-color="#fff2c4"/><stop offset="1" stop-color="#d9a234"/></radialGradient>
      </defs>
      <rect x="88" y="250" width="24" height="34" rx="3" fill="#6b4222"/>
      <polygon points="100,120 18,262 182,262" fill="url(#tree-green)"/>
      <polygon points="100,72 34,192 166,192" fill="url(#tree-green)"/>
      <polygon points="100,30 52,122 148,122" fill="url(#tree-green)"/>
      <path class="xmas-tree__garland" d="M62 100 Q100 116 138 96 M48 170 Q104 192 156 160 M30 236 Q100 262 172 226"/>
      <circle cx="76" cy="104" r="7" fill="url(#bauble-red)"/>
      <circle cx="128" cy="140" r="7" fill="url(#bauble-gold)"/>
      <circle cx="60" cy="182" r="7.5" fill="url(#bauble-gold)"/>
      <circle cx="140" cy="186" r="7.5" fill="url(#bauble-red)"/>
      <circle cx="90" cy="254" r="8" fill="url(#bauble-red)"/>
      <circle cx="154" cy="250" r="8" fill="url(#bauble-gold)"/>
      ${lights.join("")}
      <polygon class="xmas-tree__star" points="100,6 104.4,17.9 117.1,18.4 107.1,26.3 110.6,38.6 100,31.5 89.4,38.6 92.9,26.3 82.9,18.4 95.6,17.9"/>
      <!-- presents -->
      <g class="xmas-gift"><rect x="22" y="276" width="46" height="40" rx="3" fill="#d6202d"/><rect x="41" y="276" width="8" height="40" fill="#ffd23f"/><rect x="22" y="290" width="46" height="8" fill="#ffd23f"/><path d="M45 276 C34 264 28 272 45 276 C62 272 56 264 45 276Z" fill="#ffd23f"/></g>
      <g class="xmas-gift"><rect x="122" y="286" width="58" height="32" rx="3" fill="#1f8a4c"/><rect x="146" y="286" width="9" height="32" fill="#fff4dc"/><path d="M150 286 C138 274 132 282 150 286 C168 282 162 274 150 286Z" fill="#fff4dc"/></g>
      <g class="xmas-gift"><rect x="74" y="296" width="40" height="24" rx="3" fill="#3f7ed8"/><rect x="90" y="296" width="8" height="24" fill="#ffffff"/></g>
    </svg>`;
}

function createTrees() {
  ["left", "right"].forEach((side) => {
    const tree = document.createElement("div");
    tree.className = `xmas-tree xmas-tree--${side}`;
    tree.innerHTML = treeSvg();
    xmasStage.appendChild(tree);
  });
}

/* ---------- Ornaments hanging from the lights ---------- */

function createHangingOrnaments() {
  const colors = [["#ff6b6b", "#a3141f"], ["#ffe9a6", "#d39b2a"], ["#8fd3ff", "#1f6fc4"], ["#8ff0b0", "#16793e"], ["#ffffff", "#c9d6e2"]];
  const box = document.createElement("div");
  box.className = "xmas-ornaments";
  [[6, 70], [14, 120], [22, 60], [78, 90], [86, 50], [94, 110]].forEach(([x, length], index) => {
    const [light, dark] = colors[index % colors.length];
    const ornament = document.createElement("span");
    ornament.className = "xmas-ornament";
    ornament.style.setProperty("--x", `${x}%`);
    ornament.style.setProperty("--len", `${length}px`);
    ornament.style.setProperty("--light", light);
    ornament.style.setProperty("--dark", dark);
    ornament.style.setProperty("--swing", `${xmasRandom(2.6, 3.8)}s`);
    ornament.style.setProperty("--delay", `${-xmasRandom(0, 3)}s`);
    box.appendChild(ornament);
  });
  xmasStage.appendChild(box);
}

/* ---------- Home screen text ---------- */

// Wraps every letter in its own <span> so each can animate on its own.
// Screen readers still read the whole word.
function splitIntoLetters(element, className) {
  const text = element.textContent;
  element.setAttribute("aria-label", text);
  element.textContent = "";
  [...text].forEach((character, index) => {
    const letter = document.createElement("span");
    letter.className = className;
    letter.setAttribute("aria-hidden", "true");
    letter.style.setProperty("--i", index);
    letter.textContent = character === " " ? " " : character;
    element.appendChild(letter);
  });
}

// The home screen numbers count up from 0
function countUpHomeStats() {
  if (prefersReducedMotion) return;
  ["stat-rounds", "stat-categories", "stat-questions"].forEach((id, index) => {
    const element = document.getElementById(id);
    const target = Number(element.textContent) || 0;
    const start = performance.now() + 700 + index * 120;
    const duration = 1100;
    element.textContent = "0";
    const step = (now) => {
      const t = Math.max(0, Math.min(1, (now - start) / duration));
      element.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

/* ---------- Start ---------- */

createTwinklingStars(26);
createBigSnowflakes(16);
createSleigh();
createTrees();
createHangingOrnaments();
createSnowbank();

splitIntoLetters(document.getElementById("home-welcome"), "xmas-snowletter");
splitIntoLetters(document.getElementById("home-title"), "xmas-letter");

// Count up every time the home screen comes back into view
const homeScreenElement = document.getElementById("home-screen");
let homeWasActive = false;
new MutationObserver(() => {
  const isActive = homeScreenElement.classList.contains("is-active");
  if (isActive && !homeWasActive) countUpHomeStats();
  homeWasActive = isActive;
}).observe(homeScreenElement, { attributes: true, attributeFilter: ["class"] });
homeWasActive = true;
countUpHomeStats();
