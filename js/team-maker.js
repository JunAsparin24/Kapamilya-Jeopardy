/* =========================================================
   team-maker.js — Random team maker (from the home screen).

   1. Type everyone's names (one per line, or separated by commas)
   2. Choose how many people go on each team
   3. SHUFFLE mixes everyone up and deals them onto teams as
      evenly as possible (e.g. 7 people in 2s = 3 teams of 3, 2, 2 —
      never a team of 1 left over). Shuffle again as often as you like.
   4. USE THESE TEAMS replaces the game's teams (scores start at $0).
      Each team's members show when you hover its name on the scoreboard.

   The names are remembered on this computer for next time.
   ========================================================= */

const NAMES_STORAGE_KEY = "trivia-night-player-names";

const teamMakerElement = document.getElementById("team-maker");
const teamMakerSetup = document.getElementById("team-maker-setup");
const teamMakerNames = document.getElementById("team-maker-names");
const teamMakerSize = document.getElementById("team-maker-size");
const teamMakerSummary = document.getElementById("team-maker-summary");
const teamMakerResults = document.getElementById("team-maker-results");
const teamMakerCancel = document.getElementById("team-maker-cancel");
const teamMakerBack = document.getElementById("team-maker-back");
const teamMakerShuffle = document.getElementById("team-maker-shuffle");
const teamMakerUse = document.getElementById("team-maker-use");

let madeTeams = null; // [{ name, members }] after a shuffle

/* ---------- Opening & closing ---------- */

function openTeamMaker() {
  try { teamMakerNames.value = localStorage.getItem(NAMES_STORAGE_KEY) || ""; } catch (error) { /* fine */ }
  showTeamMakerSetup();
  teamMakerElement.hidden = false;
  void teamMakerElement.offsetHeight; // lay out the closed state first so it fades in
  teamMakerElement.classList.add("is-open");
  appElement.inert = true; // question-screen.js
  teamMakerNames.focus({ preventScroll: true });
}

function closeTeamMaker() {
  teamMakerElement.classList.remove("is-open");
  teamMakerElement.hidden = true;
  appElement.inert = false;
}

function showTeamMakerSetup() {
  madeTeams = null;
  teamMakerSetup.hidden = false;
  teamMakerResults.hidden = true;
  teamMakerBack.hidden = true;
  teamMakerCancel.hidden = false;
  teamMakerUse.hidden = true;
  teamMakerShuffle.textContent = "🎲 Shuffle";
  updateTeamMakerSummary();
}

/* ---------- Names & sizes ---------- */

function readNames() {
  const seen = new Set();
  return teamMakerNames.value
    .split(/[\n,]+/)
    .map((name) => name.trim())
    .filter((name) => {
      const key = name.toLowerCase();
      if (!name || seen.has(key)) return false; // skip blanks and repeats
      seen.add(key);
      return true;
    });
}

function readTeamSize() {
  const size = Math.round(Number(teamMakerSize.value));
  return Math.max(1, Math.min(20, Number.isFinite(size) ? size : 2));
}

// How many teams, or why it can't be done
function planTeams() {
  const names = readNames();
  const size = readTeamSize();
  // Round down so nobody is left on a team alone (7 people in 2s = 3 teams: 3, 2, 2)
  let teamCount = Math.floor(names.length / size);
  if (teamCount < 2) teamCount = Math.ceil(names.length / size); // e.g. 3 people in 2s = 2 teams
  let problem = "";
  if (names.length < 2) problem = "Add at least 2 names.";
  else if (teamCount < 2) problem = `That's everyone on one team. Try fewer than ${names.length} per team.`;
  else if (teamCount > MAX_TEAMS) problem = `That makes ${teamCount} teams, but the game fits ${MAX_TEAMS} at most. Try bigger teams.`; // teams.js
  return { names, size, teamCount, problem };
}

function updateTeamMakerSummary() {
  const { names, size, teamCount, problem } = planTeams();
  teamMakerSummary.classList.toggle("is-problem", Boolean(problem));
  if (problem) {
    teamMakerSummary.textContent = names.length ? `${names.length} ${names.length === 1 ? "person" : "people"}. ${problem}` : problem;
  } else {
    const uneven = names.length % size !== 0;
    teamMakerSummary.textContent =
      `${names.length} people → ${teamCount} teams` + (uneven ? " (some get an extra person)" : ` of ${size}`);
  }
  teamMakerShuffle.disabled = Boolean(problem);
}

/* ---------- Shuffling ---------- */

// Fisher–Yates: every order is equally likely
function shuffled(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeTeams() {
  const { names, teamCount, problem } = planTeams();
  if (problem) return;
  try { localStorage.setItem(NAMES_STORAGE_KEY, teamMakerNames.value); } catch (error) { /* fine */ }

  // Deal the shuffled names out like cards, so team sizes differ by at most one
  const groups = Array.from({ length: teamCount }, (_, index) => ({ name: `Team ${index + 1}`, members: [] }));
  shuffled(names).forEach((name, index) => groups[index % teamCount].members.push(name));
  madeTeams = groups;

  renderMadeTeams();
  playCategoryChosenSound(); // sound-effects.js
}

function renderMadeTeams() {
  teamMakerSetup.hidden = true;
  teamMakerResults.hidden = false;
  teamMakerBack.hidden = false;
  teamMakerCancel.hidden = true;
  teamMakerUse.hidden = false;
  teamMakerShuffle.textContent = "🎲 Shuffle again";

  teamMakerResults.innerHTML = "";
  madeTeams.forEach((group, index) => {
    const card = document.createElement("div");
    card.className = "team-maker__team";
    card.style.setProperty("--team-color", TEAM_COLORS[index % TEAM_COLORS.length]); // teams.js
    card.style.setProperty("--card-delay", `${index * 140}ms`);

    const title = document.createElement("p");
    title.className = "team-maker__team-name";
    title.textContent = group.name;

    const list = document.createElement("ul");
    list.className = "team-maker__members";
    group.members.forEach((member) => {
      const item = document.createElement("li");
      item.textContent = member;
      list.appendChild(item);
    });

    card.append(title, list);
    teamMakerResults.appendChild(card);
  });
  teamMakerUse.focus({ preventScroll: true });
}

function useMadeTeams() {
  if (!madeTeams) return;
  replaceTeams(madeTeams); // teams.js — scoreboard and buzzer phones update on their own
  closeTeamMaker();
}

/* ---------- Buttons & keyboard ---------- */

document.getElementById("team-maker-open").addEventListener("click", openTeamMaker);
teamMakerCancel.addEventListener("click", closeTeamMaker);
teamMakerBack.addEventListener("click", showTeamMakerSetup);
teamMakerShuffle.addEventListener("click", makeTeams);
teamMakerUse.addEventListener("click", useMadeTeams);
teamMakerNames.addEventListener("input", updateTeamMakerSummary);
teamMakerSize.addEventListener("input", updateTeamMakerSummary);
document.getElementById("team-maker-less").addEventListener("click", () => {
  teamMakerSize.value = Math.max(1, readTeamSize() - 1);
  updateTeamMakerSummary();
});
document.getElementById("team-maker-more").addEventListener("click", () => {
  teamMakerSize.value = Math.min(20, readTeamSize() + 1);
  updateTeamMakerSummary();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !teamMakerElement.hidden) closeTeamMaker();
});
