/* =========================================================
   answer-match.js — "Is that close enough?" for Fast Money.

   Shared by the game (fast-money.js, to score answers) and the
   phones (fast-money-phone.js, to stop the second team repeating
   the first team's answers).

   How it decides: it compares the KEY WORDS of what was said with
   each survey answer (and its "also" wordings), ignoring little
   words like "the", "go", "their". So for "Play video games",
   "video games", "games", "play games" and "gaming" all count.
   Small typos are fine too ("sunscren", "umbrela").
   ========================================================= */

// How close an answer must be to count (0–1). Lower = more forgiving.
const ANSWER_MATCH_THRESHOLD = 0.6;

// Words that don't change what an answer means
const FILLER_WORDS = new Set([
  "the", "a", "an", "their", "my", "your", "his", "her", "our", "some", "any",
  "to", "of", "on", "in", "at", "for", "with", "and", "or", "it", "them", "you", "i",
  "go", "get", "take", "do", "have", "be", "is", "are", "just", "like", "really",
  "time", "times", "week", "per", "thing", "things", "stuff",
]);

// Returns the index of the best-matching option, or null.
// options: [{ answer: "Food/Snacks", also: ["Baon"] }, ...]
function findFastMoneyMatch(given, options) {
  if (!normalizeAnswer(given)) return null;

  let bestIndex = null;
  let bestScore = 0;

  options.forEach((option, index) => {
    // "Food/Snacks" counts as two ways of saying it, plus any "also" wordings
    const names = [...String(option.answer).split("/"), ...(option.also || [])];
    names.forEach((name) => {
      const score = answerSimilarity(given, name);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });
  });

  return bestScore >= ANSWER_MATCH_THRESHOLD ? bestIndex : null;
}

// 0 (nothing alike) … 1 (same answer)
function answerSimilarity(given, name) {
  const said = normalizeAnswer(given);
  const target = normalizeAnswer(name);
  if (!said || !target) return 0;
  if (said === target) return 1;

  const saidWords = keyWords(said);
  const targetWords = keyWords(target);
  if (saidWords.length && saidWords.join(" ") === targetWords.join(" ")) return 1;

  // Spelling alone only counts for real typos ("sunscren"), not look-alike
  // words ("never" vs "seven", "shoes" vs "shades")
  const spelling = spellingSimilarity(said, target);
  let score = spelling >= 0.75 ? spelling : 0;

  const shared = saidWords.filter((word) => targetWords.some((other) => wordsMatch(word, other))).length;
  if (shared > 0) {
    const coversSaid = shared === saidWords.length; // "games" → all of it is in "play video games"
    const coversTarget = targetWords.every((word) => saidWords.some((other) => wordsMatch(word, other)));
    const overlap = shared / Math.max(saidWords.length, targetWords.length);
    // One is part of the other: a strong match. Just sharing a word: a weaker one.
    score = Math.max(score, coversSaid || coversTarget ? 0.8 + 0.15 * overlap : 0.6 + 0.1 * overlap);
  }
  return score;
}

// "The Brushing-Teeth!" → "brushing teeth"
function normalizeAnswer(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // é → e
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// "checking their phones" → ["check", "phone"]
function keyWords(normalized) {
  const words = normalized.split(" ").filter(Boolean);
  const important = words.filter((word) => !FILLER_WORDS.has(word));
  return (important.length ? important : words).map(stemWord);
}

// Rough word endings: games → game, glasses → glass, checking → check, dressed → dress
function stemWord(word) {
  if (/^\d+$/.test(word)) return word;
  if (word.length > 5 && word.endsWith("ing")) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith("ed")) return word.slice(0, -2);
  if (word.length > 4 && /(s|x|ch|sh)es$/.test(word)) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

// Same word, or the same word with a small typo (numbers must match exactly)
function wordsMatch(a, b) {
  if (a === b) return true;
  if (/\d/.test(a) || /\d/.test(b)) return false;
  return a.length >= 4 && b.length >= 4 && spellingSimilarity(a, b) >= 0.8;
}

// How alike two spellings are (handles typos like "sunscren")
function spellingSimilarity(a, b) {
  const longest = Math.max(a.length, b.length);
  if (longest === 0) return 1;

  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
    }
    previous = current;
  }
  return 1 - previous[b.length] / longest;
}
