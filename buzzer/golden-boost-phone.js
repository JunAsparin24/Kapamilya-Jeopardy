/* =========================================================
   golden-boost-phone.js — Golden Boost wager on the players' phones.

   When a team finds the Golden Boost, that team's phones show a wager
   box (up to the most they're allowed). Locking it in fills the amount
   in on the laptop; the host then reveals the question. The team can
   change it until then.

   buzzer.js calls renderGoldenBoostPhone() on every check-in.
   ========================================================= */

const gbScreen = document.getElementById("gb-screen");
const gbForm = document.getElementById("gb-form");
const gbLimit = document.getElementById("gb-limit");
const gbAmount = document.getElementById("gb-amount");
const gbSubmit = document.getElementById("gb-submit");
const gbStatus = document.getElementById("gb-phone-status");

let gbSetupShown = null; // a new Golden Boost = a fresh wager box

// goldenBoost: the server's Golden Boost state when it's OUR team's turn, or null
function renderGoldenBoostPhone(goldenBoost) {
  gbScreen.hidden = !goldenBoost;
  if (!goldenBoost) {
    gbSetupShown = null;
    return;
  }

  const max = Math.max(1, Number(goldenBoost.max) || 1);
  const setupKey = `${goldenBoost.teamId}|${max}|${goldenBoost.value}`;
  if (setupKey !== gbSetupShown) {
    gbSetupShown = setupKey;
    gbAmount.value = "";
    gbAmount.placeholder = String(Math.min(Number(goldenBoost.value) || max, max));
  }

  gbAmount.max = String(max);
  gbLimit.textContent = `You can wager up to ${max.toLocaleString("en-US")}`;

  const locked = goldenBoost.amount !== null && goldenBoost.amount !== undefined;
  gbSubmit.textContent = locked ? "Change wager" : "Lock in wager";
  gbStatus.textContent = locked
    ? `✓ Locked in: ${Number(goldenBoost.amount).toLocaleString("en-US")}. You can change it until the host reveals the question.`
    : "Talk it over, then lock in your wager.";
  gbStatus.classList.toggle("is-locked", locked);
}

gbForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const max = Number(gbAmount.max) || 1;
  const typed = Math.round(Number(gbAmount.value));
  // Blank = the suggested amount (the question's value, or less if that's over the limit)
  const amount = Math.max(1, Math.min(max, Number.isFinite(typed) && typed > 0 ? typed : Number(gbAmount.placeholder) || max));
  gbAmount.value = String(amount);
  gbAmount.blur();

  try {
    const response = await fetch("/api/gb/wager", {
      method: "POST",
      body: JSON.stringify({ teamId: myTeamId, amount }), // buzzer.js
    });
    const result = await response.json();
    if (result.goldenBoost) latestState.goldenBoost = result.goldenBoost; // buzzer.js
    if (result.accepted && navigator.vibrate) navigator.vibrate(80);
  } catch (error) {
    connectionBanner.hidden = false; // buzzer.js
  }
  render(); // buzzer.js
});
