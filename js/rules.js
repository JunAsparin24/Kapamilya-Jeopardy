/* =========================================================
   rules.js — The rules slide shown at the start of each segment
   (Round 1, Round 2, Final Wager, Fast Money).

   main.js shows it after the segment's title wipe; the host
   explains the rules, then clicks the button to begin.

   To change what a slide says, edit getRules() below.
   Words wrapped in **double stars** are shown in gold.
   ========================================================= */

const rulesEyebrow = document.getElementById("rules-eyebrow");
const rulesTitle = document.getElementById("rules-title");
const rulesList = document.getElementById("rules-list");
const rulesButton = document.getElementById("rules-button");

let rulesContinue = null; // what the button does (set by showRules)

// segment: "round1", "round2", "finalWager" or "fastMoney"
function getRules(segment) {
  const valueRange = (round) => {
    const values = getRoundValues(round); // game.js
    return `${formatMoney(Math.min(...values))}–${formatMoney(Math.max(...values))}`;
  };
  const answerSeconds = Math.round(ANSWER_TIME_MS / 1000); // buzzer-host.js
  const buzzSeconds = Math.round(BUZZ_WINDOW_MS / 1000);   // question-screen.js
  const categories = finalWagerQuestions.map((item) => item.name).join(", "); // questions.js
  const finalWagerTime = `${Math.floor(FINAL_WAGER_SECONDS / 60)}:${String(FINAL_WAGER_SECONDS % 60).padStart(2, "0")}`;

  switch (segment) {
    case "round1":
      return {
        eyebrow: "Round 1",
        title: "How to Play",
        rules: [
          `The team that **has the board ♛** picks a category and a value (${valueRange(1)}).`,
          `**Buzz in on your phone** — first to buzz answers. You have **${buzzSeconds} seconds** to buzz; if nobody does, **no one answers**.`,
          `After you buzz, you have **${answerSeconds} seconds** to answer out loud.`,
          "**Right:** win the points and the board. **Wrong:** lose the points, and the other teams can buzz in.",
          "If nobody gets it, the board stays with the team that picked.",
          `Somewhere hides the **★ Golden Boost** — the team that finds it wagers up to their points, then answers alone in **${answerSeconds} seconds**.`,
        ],
        button: "Start Round 1",
      };

    case "round2":
      return {
        eyebrow: "Round 2",
        title: "Double Up",
        rules: [
          `Same rules as Round 1, but every question is worth **double** (${valueRange(2)}).`,
          `You still have **${buzzSeconds} seconds to buzz** on each question.`,
          "A **new Golden Boost** is hiding somewhere on this board.",
          "Wrong answers still cost you points — **buzz carefully!**",
          "The top teams after this round have the best shot at the end.",
        ],
        button: "Start Round 2",
      };

    case "finalWager":
      return {
        eyebrow: "Next up",
        title: "Final Wager",
        rules: [
          `All teams agree on **one category**: ${categories}.`,
          "**Secretly wager on your phone** — anything from 0 up to the points you have.",
          `Then the question appears. You have **${finalWagerTime}** to write your answer on your **whiteboard**.`,
          "**Right:** add your wager. **Wrong:** lose it.",
          "The **top two teams** after Final Wager go to Fast Money!",
        ],
        button: "Choose the category",
      };

    case "fastMoney":
      return {
        eyebrow: "The final showdown",
        title: "Fast Money",
        rules: [
          "Only the **top two teams** play. **First place goes first**; the other team waits somewhere they can't hear.",
          `**Five survey questions** appear on your phone. You have **${FAST_MONEY_SECONDS} seconds** for all five.`,
          "Stuck? Tap **Skip** — the question comes back at the end.",
          "The second team **can't repeat** an answer the first team gave.",
          "Each answer scores **how many people in the survey said it**.",
          "The **highest Fast Money total wins the game!**",
        ],
        button: "Let's play Fast Money",
      };

    default:
      return { eyebrow: "", title: "Rules", rules: [], button: "Continue" };
  }
}

// Fills in the slide. main.js shows the screen; onContinue runs when the host clicks the button.
function showRules(segment, onContinue) {
  const { eyebrow, title, rules, button } = getRules(segment);
  rulesEyebrow.textContent = eyebrow;
  rulesTitle.textContent = title;
  rulesButton.textContent = button;
  rulesContinue = onContinue;

  rulesList.innerHTML = "";
  rules.forEach((rule, index) => {
    const item = document.createElement("li");
    item.className = "rules__item reveal";
    item.style.setProperty("--reveal-delay", `${450 + index * 110}ms`);
    const text = document.createElement("span"); // one piece, so the sentence flows normally
    appendWithGold(text, rule);
    item.appendChild(text);
    rulesList.appendChild(item);
  });
}

// "Win **the points**" → text, then a gold <strong>
function appendWithGold(element, text) {
  text.split("**").forEach((part, index) => {
    if (!part) return;
    if (index % 2 === 1) {
      const strong = document.createElement("strong");
      strong.textContent = part;
      element.appendChild(strong);
    } else {
      element.appendChild(document.createTextNode(part));
    }
  });
}

rulesButton.addEventListener("click", () => {
  if (!rulesContinue) return;
  const next = rulesContinue;
  rulesContinue = null; // one click only
  next();
});
