/* =========================================================
   buzzer.js — The phone buzzer.

   1. The player picks their team (the list comes from the game)
   2. A big button: TAP TO ANSWER
   3. The first team to tap locks everyone else out until the
      host clicks "Unlock buzzers" in the game

   The phone checks in with the laptop a few times a second.
   ========================================================= */

const POLL_MS = 350;
const TEAM_KEY = "trivia-buzzer-team";
const PLAYER_KEY = "trivia-buzzer-player";

const teamScreen = document.getElementById("team-screen");
const teamList = document.getElementById("team-list");
const noTeamsMessage = document.getElementById("no-teams-message");
const buzzScreen = document.getElementById("buzz-screen");
const buzzButton = document.getElementById("buzz-button");
const buzzButtonMain = document.getElementById("buzz-button-main");
const buzzButtonSub = document.getElementById("buzz-button-sub");
const buzzStatus = document.getElementById("buzz-status");
const changeTeamButton = document.getElementById("change-team-button");
const connectionBanner = document.getElementById("connection-banner");

const playerId = getOrCreatePlayerId();
let myTeamId = readStorage(TEAM_KEY);
let latestState = null;
let isSendingBuzz = false;
let lastCelebratedBuzzId = null;
let isChoosingTeam = false;

/* ---------- Talking to the laptop ---------- */

async function checkIn() {
  try {
    const response = await fetch(`/api/state?player=${encodeURIComponent(playerId)}`, { cache: "no-store" });
    if (!response.ok) throw new Error(response.status);
    latestState = await response.json();
    connectionBanner.hidden = true;
    render();
  } catch (error) {
    connectionBanner.hidden = false;
  }
}

async function buzz() {
  if (isSendingBuzz || !latestState || latestState.locked) return;
  isSendingBuzz = true;
  showButton("sending", "…", "");

  try {
    const response = await fetch("/api/buzz", {
      method: "POST",
      body: JSON.stringify({ teamId: myTeamId, playerId }),
    });
    const result = await response.json();
    if (result.state) latestState = result.state;
  } catch (error) {
    connectionBanner.hidden = false;
  }

  isSendingBuzz = false;
  render();
}

/* ---------- Drawing the screen ---------- */

function render() {
  if (!latestState || isSendingBuzz) return;

  const teams = latestState.teams || [];
  const myTeam = teams.find((team) => team.id === myTeamId);

  // No team chosen yet (or the host renamed/removed it) → pick one
  if (!myTeam || isChoosingTeam) {
    renderTeamPicker(teams);
    return;
  }

  teamScreen.hidden = true;
  buzzScreen.hidden = false;
  changeTeamButton.hidden = false;
  changeTeamButton.textContent = `${myTeam.name} · change`;
  document.documentElement.style.setProperty("--team-color", myTeam.color);

  const winner = latestState.locked ? latestState.winner : null;

  if (!winner) {
    showButton("ready", "Tap to answer", "");
    buzzStatus.textContent = "";
  } else if (winner.id === myTeamId) {
    showButton("won", "You're first!", "Answer now");
    buzzStatus.textContent = "Waiting for the host…";
    celebrate(latestState.buzzId);
  } else {
    showButton("locked", "Locked", `${winner.name} buzzed first`);
    buzzStatus.textContent = "Wait for the host to unlock";
  }
}

function renderTeamPicker(teams) {
  buzzScreen.hidden = true;
  teamScreen.hidden = false;
  changeTeamButton.hidden = true;
  noTeamsMessage.hidden = teams.length > 0;

  // Only redraw when the team list actually changed (keeps taps reliable)
  const signature = JSON.stringify(teams);
  if (teamList.dataset.signature === signature) return;
  teamList.dataset.signature = signature;

  teamList.innerHTML = "";
  teams.forEach((team) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "team-option";
    button.textContent = team.name;
    button.style.setProperty("--team-color", team.color);
    button.addEventListener("click", () => chooseTeam(team.id));
    teamList.appendChild(button);
  });
}

function chooseTeam(teamId) {
  myTeamId = teamId;
  isChoosingTeam = false;
  writeStorage(TEAM_KEY, teamId);
  render();
}

function showButton(mode, mainText, subText) {
  buzzButton.dataset.mode = mode;
  buzzButton.disabled = mode !== "ready";
  buzzButtonMain.textContent = mainText;
  buzzButtonSub.textContent = subText;
}

// Buzz once and flash when your team gets in first
function celebrate(buzzId) {
  if (lastCelebratedBuzzId === buzzId) return;
  lastCelebratedBuzzId = buzzId;
  if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
}

/* ---------- Buttons ---------- */

// pointerdown fires the instant a finger touches — faster than "click"
buzzButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  buzz();
});

// Keyboard (space / enter) for anyone using a laptop as a buzzer
buzzButton.addEventListener("keydown", (event) => {
  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    buzz();
  }
});

changeTeamButton.addEventListener("click", () => {
  isChoosingTeam = true;
  teamList.dataset.signature = ""; // force the list to redraw
  render();
});

/* ---------- Remembering this phone ---------- */

function getOrCreatePlayerId() {
  let id = readStorage(PLAYER_KEY);
  if (!id) {
    id = "p" + Math.random().toString(36).slice(2, 10);
    writeStorage(PLAYER_KEY, id);
  }
  return id;
}

function readStorage(key) {
  try { return localStorage.getItem(key); } catch (error) { return null; }
}

function writeStorage(key, value) {
  try { localStorage.setItem(key, value); } catch (error) { /* not important */ }
}

/* ---------- Start ---------- */

checkIn();
setInterval(checkIn, POLL_MS);
