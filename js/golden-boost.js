/* =========================================================
   golden-boost.js — The GOLDEN BOOST reveal.

   One question per round is the hidden Golden Boost (game.js picks
   a random one — see RANDOM_GOLDEN_BOOST). When it's picked, board.js
   calls playGoldenBoostIntro() before opening the question:

     Stage 1: gold flash, spinning rays, sparkles and a big
              "GOLDEN BOOST" title (plus a sound from music.js)
     Stage 2: the team that has the board found it (if nobody has
              the board yet, the host picks the team). The host types
              in their wager (up to the points they have), then
              clicks REVEAL QUESTION

   Nothing about the question is shown until that click, so teams
   wager without knowing what's coming. The question card then
   opens in gold, and only that team can win (or lose) the wager.
   ========================================================= */

const goldenBoostOverlay = document.getElementById("golden-boost");
const goldenBoostSparkles = document.getElementById("golden-boost-sparkles");
const goldenWagerForm = document.getElementById("golden-wager");
const goldenWagerPrompt = document.getElementById("golden-wager-prompt");
const goldenWagerTeams = document.getElementById("golden-wager-teams");
const goldenWagerAmount = document.getElementById("golden-wager-amount");
const goldenWagerHint = document.getElementById("golden-wager-hint");

// How long stage 1 plays before the wager step appears
const GOLDEN_BOOST_INTRO_MS = 2200;
const GOLDEN_BOOST_FADE_MS = 400; // must match the fade-out in golden-boost.css
const GOLDEN_BOOST_SPARKLE_COUNT = 40;

let selectedWagerTeamId = null;
let currentGoldenQuestion = null;

// Plays the reveal and waits for the host. Resolves with the wager
// ({ teamId, amount }, or null if no team was picked) the moment the
// host clicks REVEAL QUESTION — that's when the golden card should open.
function playGoldenBoostIntro(question) {
  return new Promise((resolve) => {
    createGoldenBoostSparkles();

    goldenBoostOverlay.classList.remove("is-playing", "is-leaving", "is-wagering");
    goldenWagerForm.hidden = true;
    goldenBoostOverlay.hidden = false;
    void goldenBoostOverlay.offsetHeight; // restart the CSS animations
    goldenBoostOverlay.classList.add("is-playing");

    playGoldenBoostSting(); // music.js

    // Stage 2 appears once the title has landed
    setTimeout(() => showWagerStep(question), prefersReducedMotion ? 600 : GOLDEN_BOOST_INTRO_MS);

    goldenWagerForm.onsubmit = (event) => {
      event.preventDefault();
      goldenWagerForm.onsubmit = null;

      const team = selectedWagerTeamId && getTeam(selectedWagerTeamId);
      let wager = null;
      if (team) {
        // Blank box = the question's value; never more than the team is allowed
        const maxWager = getMaxWager(team);
        const typedAmount = Math.round(Number(goldenWagerAmount.value));
        const amount = Number.isFinite(typedAmount) && typedAmount > 0 ? typedAmount : question.value;
        wager = { teamId: team.id, amount: Math.min(amount, maxWager) };
      }

      goldenBoostOverlay.classList.add("is-leaving");
      resolve(wager);

      setTimeout(() => {
        goldenBoostOverlay.hidden = true;
        goldenBoostOverlay.classList.remove("is-playing", "is-leaving", "is-wagering");
      }, GOLDEN_BOOST_FADE_MS);
    };
  });
}

/* ---------- Stage 2: who's playing, and how much? ---------- */

function showWagerStep(question) {
  currentGoldenQuestion = question;
  selectedWagerTeamId = null;
  goldenWagerAmount.value = "";
  goldenWagerAmount.placeholder = String(question.value);
  goldenWagerAmount.removeAttribute("max");
  goldenWagerTeams.innerHTML = "";

  getTeams().forEach((team) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "golden-wager__team";
    button.textContent = team.name;
    button.style.setProperty("--team-color", team.color);
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", "false");
    button.addEventListener("click", () => selectWagerTeam(team.id));
    goldenWagerTeams.appendChild(button);
    button.dataset.teamId = team.id;
  });

  // The team with the board picked this question, so it's theirs.
  // (With only one team, it must be them.)
  const boardTeam = getTeam(getBoardTeamId()) || (getTeams().length === 1 ? getTeams()[0] : null);
  goldenWagerTeams.hidden = Boolean(boardTeam);
  goldenWagerPrompt.textContent = boardTeam ? `${boardTeam.name} found it!` : "Who found it?";
  if (boardTeam) selectWagerTeam(boardTeam.id);
  updateWagerHint();

  goldenWagerForm.hidden = false;
  goldenBoostOverlay.classList.add("is-wagering");
  if (!boardTeam) {
    goldenWagerTeams.querySelector("button").focus({ preventScroll: true });
  } else {
    goldenWagerAmount.focus({ preventScroll: true });
  }
}

function selectWagerTeam(teamId) {
  selectedWagerTeamId = teamId;
  goldenWagerTeams.querySelectorAll(".golden-wager__team").forEach((button) => {
    button.setAttribute("aria-checked", String(button.dataset.teamId === teamId));
  });
  updateWagerHint();
  goldenWagerAmount.focus({ preventScroll: true });
}

// A team can wager up to the points it already has. A team on $0 (or
// below) can wager up to the question's own value, so it still has
// something to play for.
function getMaxWager(team) {
  return team.score > 0 ? team.score : currentGoldenQuestion.value;
}

function updateWagerHint() {
  const team = selectedWagerTeamId && getTeam(selectedWagerTeamId);
  goldenWagerHint.classList.remove("is-capped");

  if (!team) {
    goldenWagerHint.textContent = "Pick the team that found it";
    return;
  }

  const maxWager = getMaxWager(team);
  goldenWagerAmount.max = String(maxWager);
  goldenWagerAmount.placeholder = String(Math.min(currentGoldenQuestion.value, maxWager));

  // If a bigger wager was typed before picking this team, bring it down
  if (Number(goldenWagerAmount.value) > maxWager) goldenWagerAmount.value = String(maxWager);

  goldenWagerHint.textContent = team.score > 0
    ? `${team.name} has ${formatMoney(team.score)} · can wager up to ${formatMoney(maxWager)}`
    : `${team.name} has ${formatMoney(team.score)} · can wager up to ${formatMoney(maxWager)} (the question's value)`;
}

// Typing more than the limit snaps back to the limit, with a little flash
goldenWagerAmount.addEventListener("input", () => {
  const team = selectedWagerTeamId && getTeam(selectedWagerTeamId);
  if (!team) return;

  const maxWager = getMaxWager(team);
  if (Number(goldenWagerAmount.value) > maxWager) {
    goldenWagerAmount.value = String(maxWager);
    goldenWagerHint.classList.remove("is-capped");
    void goldenWagerHint.offsetWidth; // restart the flash
    goldenWagerHint.classList.add("is-capped");
  }
});

/* ---------- Stage 1: sparkles bursting outward ---------- */

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
