/* =========================================================
   scoreboard.js — Everything on screen to do with teams:

   1. The scoreboard under the game board
        - click a team name to rename it
        - click a score to type in a correction
        - × removes a team (asks "Remove?" first), + Team adds one
   2. The ✓ / ✗ buttons on the question card after the answer
      is shown (✓ adds the question's value, ✗ subtracts it —
      click again to undo)
   3. The standings on the Round Complete and Game Over screens

   The team data itself lives in teams.js.
   ========================================================= */

const scoreboardElement = document.getElementById("scoreboard");
const awardRowElement = document.getElementById("award-row");

// Awards given on the question that's open right now: { teamId: 1 (✓) or -1 (✗) }
let currentAwards = {};
let currentAwardAmount = 0;
let currentAwardTeamIds = null; // null = every team can score

const REMOVE_CONFIRM_MS = 3000;

/* =========================================================
   1. SCOREBOARD
   ========================================================= */

function renderScoreboard() {
  scoreboardElement.innerHTML = "";

  getTeams().forEach((team) => {
    scoreboardElement.appendChild(createTeamChip(team));
  });

  if (getTeams().length < MAX_TEAMS) {
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "scoreboard__add";
    addButton.textContent = "+ Team";
    addButton.setAttribute("aria-label", "Add a team");
    addButton.addEventListener("click", () => {
      addTeam();
      // Put the cursor in the new team's name so it can be typed straight away
      const nameInputs = scoreboardElement.querySelectorAll(".team-chip__name");
      const newest = nameInputs[nameInputs.length - 1];
      if (newest) { newest.focus(); newest.select(); }
    });
    scoreboardElement.appendChild(addButton);
  }
}

function createTeamChip(team) {
  const chip = document.createElement("div");
  chip.className = "team-chip";
  chip.dataset.teamId = team.id;
  chip.style.setProperty("--team-color", team.color);

  // Name — an input that looks like plain text until you click it
  const nameInput = document.createElement("input");
  nameInput.className = "team-chip__name";
  nameInput.type = "text";
  nameInput.maxLength = 24;
  nameInput.value = team.name;
  nameInput.spellcheck = false;
  nameInput.setAttribute("aria-label", "Team name");
  nameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") nameInput.blur();
    if (event.key === "Escape") { nameInput.value = team.name; nameInput.blur(); }
  });
  nameInput.addEventListener("blur", () => {
    if (!nameInput.value.trim()) nameInput.value = team.name; // don't allow blank names
    renameTeam(team.id, nameInput.value);
  });

  // Score — click to type in a correction
  const scoreButton = document.createElement("button");
  scoreButton.type = "button";
  scoreButton.className = "team-chip__score";
  scoreButton.textContent = formatMoney(team.score);
  scoreButton.title = "Click to change this score";
  scoreButton.addEventListener("click", () => startEditingScore(chip, team));

  chip.append(nameInput, scoreButton);

  // Remove (only when there's more than one team)
  if (getTeams().length > 1) {
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "team-chip__remove";
    removeButton.textContent = "×";
    removeButton.setAttribute("aria-label", `Remove ${team.name}`);
    removeButton.addEventListener("click", () => handleRemoveClick(chip, removeButton, team));
    chip.appendChild(removeButton);
  }

  return chip;
}

// First click asks "Remove?", second click (within 3 seconds) removes the team
function handleRemoveClick(chip, removeButton, team) {
  if (!chip.classList.contains("is-confirming")) {
    chip.classList.add("is-confirming");
    removeButton.textContent = "Remove?";
    setTimeout(() => {
      chip.classList.remove("is-confirming");
      removeButton.textContent = "×";
    }, REMOVE_CONFIRM_MS);
    return;
  }
  removeTeam(team.id);
}

function startEditingScore(chip, team) {
  const scoreButton = chip.querySelector(".team-chip__score");
  const input = document.createElement("input");
  input.type = "number";
  input.step = "100";
  input.className = "team-chip__score-input";
  input.value = team.score;
  input.setAttribute("aria-label", `${team.name} score`);

  let finished = false;
  const finish = (save) => {
    if (finished) return;
    finished = true;
    if (save && input.value !== "") setScore(team.id, input.value);
    renderScoreboard();
  };

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") finish(true);
    if (event.key === "Escape") finish(false);
  });
  input.addEventListener("blur", () => finish(true));

  scoreButton.replaceWith(input);
  input.focus();
  input.select();
}

// Updates just the numbers (with a little bump animation) instead of
// redrawing, so a name being typed isn't interrupted
function updateScoreboardScores() {
  let needsFullRender = scoreboardElement.querySelectorAll(".team-chip").length !== getTeams().length;

  getTeams().forEach((team) => {
    const chip = scoreboardElement.querySelector(`.team-chip[data-team-id="${team.id}"]`);
    if (!chip) { needsFullRender = true; return; }

    const scoreButton = chip.querySelector(".team-chip__score");
    const nameInput = chip.querySelector(".team-chip__name");
    if (nameInput && document.activeElement !== nameInput) nameInput.value = team.name;
    if (!scoreButton) return; // score is being edited

    const newText = formatMoney(team.score);
    if (scoreButton.textContent !== newText) {
      scoreButton.textContent = newText;
      scoreButton.classList.remove("is-bumping");
      void scoreButton.offsetWidth; // restart the animation
      scoreButton.classList.add("is-bumping");
    }
  });

  if (needsFullRender) renderScoreboard();
}

onTeamsChanged(updateScoreboardScores);

/* =========================================================
   2. ✓ / ✗ BUTTONS ON THE QUESTION CARD
   ========================================================= */

// Called when a question opens. amount = points at stake.
// teamIds = only these teams can score (the Golden Boost team), or null for all.
function prepareAwards(amount, teamIds = null) {
  currentAwards = {};
  currentAwardAmount = amount;
  currentAwardTeamIds = teamIds;
  awardRowElement.hidden = true;
  awardRowElement.innerHTML = "";
}

// Called when the answer is revealed
function showAwardRow() {
  awardRowElement.innerHTML = "";

  const eligibleTeams = getTeams().filter(
    (team) => !currentAwardTeamIds || currentAwardTeamIds.includes(team.id)
  );

  eligibleTeams.forEach((team) => {
    const award = document.createElement("div");
    award.className = "award";
    award.dataset.teamId = team.id;
    award.style.setProperty("--team-color", team.color);

    const name = document.createElement("span");
    name.className = "award__name";
    name.textContent = team.name;

    award.append(
      name,
      createAwardButton(team, 1, "✓", `${team.name} got it right: +${formatMoney(currentAwardAmount)}`),
      createAwardButton(team, -1, "✗", `${team.name} got it wrong: −${formatMoney(currentAwardAmount)}`)
    );
    awardRowElement.appendChild(award);
  });

  highlightBuzzedTeam(getBuzzedTeamId()); // buzzer-host.js
  awardRowElement.hidden = eligibleTeams.length === 0;
}

function createAwardButton(team, direction, symbol, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `award__btn award__btn--${direction > 0 ? "right" : "wrong"}`;
  button.textContent = symbol;
  button.title = label;
  button.setAttribute("aria-label", label);
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => toggleAward(team.id, direction));
  return button;
}

// ✓ or ✗ for a team. Clicking the same one again undoes it;
// switching from ✓ to ✗ corrects the score in one go.
function toggleAward(teamId, direction) {
  const previous = currentAwards[teamId] || 0;
  const next = previous === direction ? 0 : direction;

  currentAwards[teamId] = next;
  changeScore(teamId, (next - previous) * currentAwardAmount);

  const award = awardRowElement.querySelector(`.award[data-team-id="${teamId}"]`);
  if (award) {
    award.querySelector(".award__btn--right").setAttribute("aria-pressed", String(next === 1));
    award.querySelector(".award__btn--wrong").setAttribute("aria-pressed", String(next === -1));
    award.classList.toggle("is-right", next === 1);
    award.classList.toggle("is-wrong", next === -1);
  }
}

// Marks the team that buzzed in first, so the host can find them quickly
function highlightBuzzedTeam(teamId) {
  awardRowElement.querySelectorAll(".award").forEach((award) => {
    award.classList.toggle("is-buzzed", award.dataset.teamId === teamId);
  });
}

/* =========================================================
   3. STANDINGS (Round Complete / Game Over screens)
   ========================================================= */

function renderStandings(container) {
  container.innerHTML = "";
  const standings = getStandings();
  const topScore = standings.length ? standings[0].score : 0;
  container.classList.toggle("standings--wide", standings.length > 4); // two columns for lots of teams

  standings.forEach((team, index) => {
    const row = document.createElement("li");
    row.className = "standing";
    row.style.setProperty("--team-color", team.color);
    row.style.setProperty("--row-delay", `${600 + index * 120}ms`);
    if (team.score === topScore) row.classList.add("is-leader");

    const place = document.createElement("span");
    place.className = "standing__place";
    place.textContent = team.score === topScore ? "★" : String(index + 1);

    const name = document.createElement("span");
    name.className = "standing__name";
    name.textContent = team.name;

    const score = document.createElement("span");
    score.className = "standing__score";
    score.textContent = formatMoney(team.score);

    row.append(place, name, score);
    container.appendChild(row);
  });
}

// "TEAM 1 WINS!" or "IT'S A TIE!"
function getWinnerText() {
  const standings = getStandings();
  if (standings.length === 0) return "";
  const leaders = standings.filter((team) => team.score === standings[0].score);
  if (leaders.length > 1) return "It's a tie!";
  return `${leaders[0].name} wins!`;
}

renderScoreboard();
