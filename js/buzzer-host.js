/* =========================================================
   buzzer-host.js — The host's side of the phone buzzers.

   This only switches on when the game is opened through the
   buzzer server (double-click "Start Buzzer.bat" — see the
   server/ folder). Opened as a plain file, the game works
   exactly as before, just without buzzers.

   What it does:
   - sends the team list to the server so phones can pick a team
   - checks the server a few times a second for a buzz
   - when a team buzzes: plays a sound and shows "TEAM X BUZZED IN!"
   - "Unlock buzzers" (or the U key) lets everyone buzz again
   - opening or closing a question unlocks the buzzers automatically
   ========================================================= */

const BUZZER_POLL_MS = 400;

const buzzerButton = document.getElementById("buzzer-button");
const buzzerButtonText = document.getElementById("buzzer-button-text");
const homeBuzzerJoin = document.getElementById("home-buzzer-join");
const homeBuzzerUrl = document.getElementById("home-buzzer-url");
const buzzAlert = document.getElementById("buzz-alert");
const buzzAlertTeam = document.getElementById("buzz-alert-team");
const buzzAlertUnlock = document.getElementById("buzz-alert-unlock");
const joinPanel = document.getElementById("buzzer-join-panel");
const joinPanelUnlock = document.getElementById("join-panel-unlock");
const joinPanelClose = document.getElementById("join-panel-close");
const buzzerQrElement = document.getElementById("buzzer-qr");
const buzzerJoinUrl = document.getElementById("buzzer-join-url");
const buzzerPlayerCount = document.getElementById("buzzer-player-count");

let isBuzzerConnected = false;
let buzzerState = null;      // the latest state from the server
let lastSeenBuzzId = null;   // to spot a *new* buzz
let qrCodeMadeFor = "";

/* ---------- Used by other files ---------- */

// The team that buzzed in first, or null when the buzzers are open
function getBuzzedTeamId() {
  return buzzerState && buzzerState.locked && buzzerState.winner ? buzzerState.winner.id : null;
}

async function unlockBuzzers() {
  if (!isBuzzerConnected) return;
  try {
    handleBuzzerState(await buzzerRequest("/api/unlock", { method: "POST" }));
  } catch (error) {
    // The next check will show the server as offline
  }
}

/* ---------- Talking to the server ---------- */

async function buzzerRequest(path, options = {}) {
  const response = await fetch(path, { cache: "no-store", ...options });
  if (!response.ok) throw new Error(`Buzzer server answered ${response.status}`);
  return response.json();
}

async function connectToBuzzerServer() {
  if (!location.protocol.startsWith("http")) return; // opened as a file: no server

  try {
    buzzerState = await buzzerRequest("/api/state");
  } catch (error) {
    return; // served some other way, without the buzzer server
  }

  isBuzzerConnected = true;
  lastSeenBuzzId = buzzerState.buzzId;
  buzzerButton.hidden = false;
  homeBuzzerJoin.hidden = false;

  sendTeamsToBuzzer();
  onTeamsChanged(sendTeamsToBuzzer); // teams.js — keep the phones' team list up to date
  renderBuzzerUi(false);
  setInterval(checkForBuzz, BUZZER_POLL_MS);
}

async function checkForBuzz() {
  try {
    handleBuzzerState(await buzzerRequest("/api/state"));
    buzzerButton.classList.remove("is-offline");
  } catch (error) {
    buzzerButton.classList.add("is-offline");
    buzzerButtonText.textContent = "Buzzers offline";
  }
}

function handleBuzzerState(state) {
  const isNewBuzz = state.locked && state.winner && state.buzzId !== lastSeenBuzzId;
  lastSeenBuzzId = state.buzzId;
  buzzerState = state;

  if (isNewBuzz) playBuzzSound(); // music.js
  renderBuzzerUi(isNewBuzz);
}

function sendTeamsToBuzzer() {
  if (!isBuzzerConnected) return;
  const teamList = getTeams().map(({ id, name, color }) => ({ id, name, color }));
  // Sent as plain text so the browser doesn't need an extra permission check
  fetch("/api/teams", { method: "POST", body: JSON.stringify(teamList) }).catch(() => {});
}

/* ---------- On screen ---------- */

function renderBuzzerUi(isNewBuzz) {
  const winner = getBuzzedTeamId() ? buzzerState.winner : null;
  const playerCount = buzzerState.players || 0;
  const playerText = `${playerCount} phone${playerCount === 1 ? "" : "s"} connected`;

  // Header button
  buzzerButton.classList.toggle("is-locked", Boolean(winner));
  buzzerButtonText.textContent = winner ? `${winner.name} buzzed` : `Buzzers · ${playerCount}`;

  // "TEAM X BUZZED IN!" banner (the class makes room for it at the top of the screen)
  buzzAlert.hidden = !winner;
  document.body.classList.toggle("has-buzz-alert", Boolean(winner));
  if (winner) {
    buzzAlertTeam.textContent = winner.name;
    buzzAlert.style.setProperty("--team-color", winner.color);
    if (isNewBuzz) {
      buzzAlert.classList.remove("is-new");
      void buzzAlert.offsetWidth; // restart the pop-in animation
      buzzAlert.classList.add("is-new");
    }
  }
  highlightBuzzedTeam(getBuzzedTeamId()); // scoreboard.js — marks them on the ✓/✗ row

  // How to join
  const joinUrl = (buzzerState.joinUrls && buzzerState.joinUrls[0]) || "";
  homeBuzzerUrl.textContent = joinUrl || "(no Wi-Fi address found)";
  buzzerJoinUrl.textContent = (buzzerState.joinUrls || []).join("  or  ") || "No Wi-Fi address found — is this laptop on Wi-Fi?";
  buzzerPlayerCount.textContent = playerText;
}

/* ---------- Join panel (QR code + link) ---------- */

function openJoinPanel() {
  const joinUrl = (buzzerState && buzzerState.joinUrls && buzzerState.joinUrls[0]) || "";

  // QR code (needs the qrcodejs library, which loads from the internet)
  if (joinUrl && window.QRCode && qrCodeMadeFor !== joinUrl) {
    buzzerQrElement.innerHTML = "";
    new QRCode(buzzerQrElement, { text: joinUrl, width: 220, height: 220, colorDark: "#22094a", colorLight: "#ffffff" });
    qrCodeMadeFor = joinUrl;
  }
  buzzerQrElement.hidden = !qrCodeMadeFor;

  joinPanel.hidden = false;
  joinPanelClose.focus({ preventScroll: true });
}

function closeJoinPanel() {
  joinPanel.hidden = true;
}

/* ---------- Buttons & keyboard ---------- */

buzzerButton.addEventListener("click", openJoinPanel);
homeBuzzerJoin.addEventListener("click", openJoinPanel);
joinPanelClose.addEventListener("click", closeJoinPanel);
joinPanel.addEventListener("click", (event) => { if (event.target === joinPanel) closeJoinPanel(); });
buzzAlertUnlock.addEventListener("click", unlockBuzzers);
joinPanelUnlock.addEventListener("click", unlockBuzzers);

// Listens before the question card does ("true" = capture), so Esc on the
// join panel only closes the panel, not the question behind it
document.addEventListener("keydown", (event) => {
  if (!isBuzzerConnected) return;
  const isTyping = event.target.matches("input, textarea");

  if (event.key === "Escape" && !joinPanel.hidden) {
    event.stopImmediatePropagation();
    closeJoinPanel();
  }
  if ((event.key === "u" || event.key === "U") && !isTyping) unlockBuzzers();
}, true);

connectToBuzzerServer();
