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
   - on an open question, the team that buzzed has 15 seconds to
     answer. If time runs out they get it wrong (✗), and the buzzers
     unlock for everyone else — that team stays locked out until
     the next question
   - phones can only buzz while a question card is open; opening
     or closing a question clears any buzz automatically
   ========================================================= */

const BUZZER_POLL_MS = 400;
const ANSWER_TIME_MS = 15000;
const ANSWER_TIME_URGENT_MS = 5000; // the countdown turns red from here

const buzzerButton = document.getElementById("buzzer-button");
const buzzerButtonText = document.getElementById("buzzer-button-text");
const homeBuzzerJoin = document.getElementById("home-buzzer-join");
const homeBuzzerUrl = document.getElementById("home-buzzer-url");
const buzzAlert = document.getElementById("buzz-alert");
const buzzAlertTeam = document.getElementById("buzz-alert-team");
const buzzAlertUnlock = document.getElementById("buzz-alert-unlock");
const buzzAlertTimer = document.getElementById("buzz-alert-timer");
const joinPanel = document.getElementById("buzzer-join-panel");
const joinPanelUnlock = document.getElementById("join-panel-unlock");
const joinPanelClose = document.getElementById("join-panel-close");
const buzzerQrElement = document.getElementById("buzzer-qr");
const buzzerJoinUrl = document.getElementById("buzzer-join-url");
const buzzerPlayerCount = document.getElementById("buzzer-player-count");
const onlineJoin = document.getElementById("online-join");
const onlineQrElement = document.getElementById("online-qr");
const onlineJoinUrl = document.getElementById("online-join-url");
const hostScreenInfo = document.getElementById("host-screen-info");
const hostScreenUrl = document.getElementById("host-screen-url");
const hostScreenCode = document.getElementById("host-screen-code");

let isBuzzerConnected = false;
let buzzerState = null;      // the latest state from the server
let lastSeenBuzzId = null;   // to spot a *new* buzz
let qrCodeMadeFor = "";
let onlineQrMadeFor = "";
let blockedTeamIds = [];     // teams that ran out of time on this question
let answerTimer = null;      // { teamId, deadline, intervalId } while a team is answering

/* ---------- Used by other files ---------- */

// The team that buzzed in first, or null when the buzzers are open
function getBuzzedTeamId() {
  return buzzerState && buzzerState.locked && buzzerState.winner ? buzzerState.winner.id : null;
}

// Unlocks for every team except the ones that already ran out of time.
// Phones can only buzz while a question card is open.
async function unlockBuzzers() {
  stopAnswerTimer();
  if (!isBuzzerConnected) return;
  try {
    const body = JSON.stringify({ blocked: blockedTeamIds, open: isQuestionScreenOpen }); // question-screen.js
    handleBuzzerState(await buzzerRequest("/api/unlock", { method: "POST", body }));
  } catch (error) {
    // The next check will show the server as offline
  }
}

// Puts the open question and its answer on the host's phone (/host).
// details = { round, category, value, question, answer, image, golden } or null.
function sendQuestionToHostScreen(details) {
  if (!isBuzzerConnected) return;
  fetch("/api/question", { method: "POST", body: JSON.stringify(details) }).catch(() => {});
}

// A new question (or back to the board): everyone can buzz again,
// except any teams listed (on the Golden Boost, only one team plays)
function resetBuzzersForQuestion(lockedOutTeamIds = []) {
  blockedTeamIds = [...lockedOutTeamIds];
  unlockBuzzers();
}

/* ---------- 15 seconds to answer ---------- */

function startAnswerTimer(teamId) {
  stopAnswerTimer();
  answerTimer = { teamId, deadline: Date.now() + ANSWER_TIME_MS, intervalId: setInterval(tickAnswerTimer, 100) };
  tickAnswerTimer();
}

function stopAnswerTimer() {
  if (answerTimer) clearInterval(answerTimer.intervalId);
  answerTimer = null;
  buzzAlertTimer.hidden = true;
}

function tickAnswerTimer() {
  const timeLeft = answerTimer.deadline - Date.now();
  if (timeLeft <= 0) {
    handleAnswerTimeUp(answerTimer.teamId);
    return;
  }
  buzzAlertTimer.hidden = false;
  const seconds = Math.ceil(timeLeft / 1000);
  buzzAlertTimer.textContent = seconds;

  // Tick for each of the last 5 seconds (sound-effects.js)
  if (seconds <= 5 && seconds !== answerTimer.lastTickSecond) {
    answerTimer.lastTickSecond = seconds;
    playCountdownTick(true);
  }
  buzzAlertTimer.classList.toggle("is-urgent", timeLeft <= ANSWER_TIME_URGENT_MS);
}

function handleAnswerTimeUp(teamId) {
  stopAnswerTimer();
  playTimesUpSound();      // music.js
  markTeamWrong(teamId);   // scoreboard.js
  if (!blockedTeamIds.includes(teamId)) blockedTeamIds.push(teamId);
  unlockBuzzers();
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
  unlockBuzzers(); // clears any old buzz; stays closed until a question opens
  sendQuestionToHostScreen(null);
  showHostScreenInfo();
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

  // The clock only runs while a question is up and its answer isn't shown yet
  const buzzedTeamId = getBuzzedTeamId();
  if (!buzzedTeamId) {
    stopAnswerTimer();
  } else if (isNewBuzz && isQuestionAwaitingAnswer()) { // question-screen.js
    startAnswerTimer(buzzedTeamId);
  }

  renderBuzzerUi(isNewBuzz);
  handleBuzzersChanged(); // question-screen.js — pauses/resumes the question text
  handleFastMoneyServerState(state.fastMoney); // fast-money.js — phones answering Fast Money
  handleFinalWagerServerState(state.finalWager); // final-wager.js — which teams have wagered
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

  // How to join: same Wi-Fi, and the online link for everyone else
  const joinUrl = (buzzerState.joinUrls && buzzerState.joinUrls[0]) || "";
  const onlineUrl = buzzerState.onlineUrl || "";
  homeBuzzerUrl.textContent = (joinUrl || "(no Wi-Fi address found)") + (onlineUrl ? "  ·  online link ready" : "");
  buzzerJoinUrl.textContent = (buzzerState.joinUrls || []).join("  or  ") || "No Wi-Fi address found — is this laptop on Wi-Fi?";
  buzzerPlayerCount.textContent = playerText;

  const onlineStatus = buzzerState.onlineStatus || "off";
  onlineJoin.hidden = onlineStatus === "off";
  onlineJoinUrl.textContent =
    onlineStatus === "on" ? onlineUrl :
    onlineStatus === "starting" ? "Starting the online link…" :
    "Online link unavailable — see the buzzer window";
  if (!joinPanel.hidden) makeJoinQrCodes(); // the online link can arrive while the panel is open
}

// QR codes for both links (needs the qrcodejs library, which loads from the internet)
function makeJoinQrCodes() {
  const joinUrl = (buzzerState && buzzerState.joinUrls && buzzerState.joinUrls[0]) || "";
  const onlineUrl = (buzzerState && buzzerState.onlineUrl) || "";

  if (joinUrl && window.QRCode && qrCodeMadeFor !== joinUrl) {
    buzzerQrElement.innerHTML = "";
    new QRCode(buzzerQrElement, { text: joinUrl, width: 200, height: 200, colorDark: "#173d2e", colorLight: "#ffffff" });
    qrCodeMadeFor = joinUrl;
  }
  buzzerQrElement.hidden = !qrCodeMadeFor;

  if (onlineUrl && window.QRCode && onlineQrMadeFor !== onlineUrl) {
    onlineQrElement.innerHTML = "";
    new QRCode(onlineQrElement, { text: onlineUrl, width: 200, height: 200, colorDark: "#173d2e", colorLight: "#ffffff" });
    onlineQrMadeFor = onlineUrl;
  }
  onlineQrElement.hidden = !onlineUrl || onlineQrMadeFor !== onlineUrl;
}

// The host screen's address and code, shown in the join panel
async function showHostScreenInfo() {
  try {
    const info = await buzzerRequest("/api/host-info");
    hostScreenUrl.textContent = info.urls[0] || "(no Wi-Fi address found)";
    hostScreenCode.textContent = info.code;
    hostScreenInfo.hidden = false;
  } catch (error) {
    // An older server without the host screen — nothing to show
  }
}

/* ---------- Join panel (QR code + link) ---------- */

function openJoinPanel() {
  makeJoinQrCodes();
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
