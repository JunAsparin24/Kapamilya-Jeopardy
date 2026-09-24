/* =========================================================
   teams.js — Teams and their scores.

   Like game.js, this file knows nothing about HTML. It keeps
   the list of teams, saves it in the browser (so a page refresh
   mid-game doesn't lose the scores), and tells anyone who's
   listening when something changes. scoreboard.js draws it.
   ========================================================= */

const MAX_TEAMS = 8;
const TEAMS_STORAGE_KEY = "trivia-night-teams";

// Each team gets its own colour (also used on the buzzer phones)
const TEAM_COLORS = ["#f4c76a", "#4dd4ff", "#ff6fb1", "#7ef29a", "#ff9f43", "#b388ff", "#ff5d5d", "#5dffd6"];

let teams = loadTeams(); // [{ id, name, score, color }]
let boardTeamId = null;  // the team that "has the board" (picks the next question)
const teamChangeListeners = [];

/* ---------- Reading ---------- */

function getTeams() {
  return teams;
}

function getTeam(teamId) {
  return teams.find((team) => team.id === teamId) || null;
}

// The team that picks the next question, or null if nobody has it yet
function getBoardTeamId() {
  return getTeam(boardTeamId) ? boardTeamId : null;
}

// Highest score first
function getStandings() {
  return [...teams].sort((a, b) => b.score - a.score);
}

/* ---------- Changing ---------- */

function addTeam() {
  if (teams.length >= MAX_TEAMS) return;

  const usedColors = teams.map((team) => team.color);
  const color = TEAM_COLORS.find((c) => !usedColors.includes(c)) || TEAM_COLORS[teams.length % TEAM_COLORS.length];

  // "Team 3", "Team 4", ... skipping names already taken
  let number = teams.length + 1;
  while (teams.some((team) => team.name === `Team ${number}`)) number += 1;

  teams.push(createTeam(`Team ${number}`, color));
  teamsChanged();
}

function removeTeam(teamId) {
  if (teams.length <= 1) return; // always keep at least one team
  teams = teams.filter((team) => team.id !== teamId);
  teamsChanged();
}

function renameTeam(teamId, newName) {
  const team = getTeam(teamId);
  const cleanName = String(newName).trim().slice(0, 24);
  if (!team || !cleanName || cleanName === team.name) return;

  team.name = cleanName;
  teamsChanged();
}

// Adds (or with a negative number, subtracts) points
function changeScore(teamId, amount) {
  const team = getTeam(teamId);
  if (!team || !amount) return;

  team.score += amount;
  teamsChanged();
}

function setScore(teamId, newScore) {
  const team = getTeam(teamId);
  const score = Math.round(Number(newScore));
  if (!team || !Number.isFinite(score) || score === team.score) return;

  team.score = score;
  teamsChanged();
}

// Gives a team the board (null = nobody has it)
function setBoardTeam(teamId) {
  if (teamId === boardTeamId) return;
  boardTeamId = teamId;
  teamsChanged();
}

// New game: everyone back to $0 and nobody has the board yet (team names are kept)
function resetScores() {
  teams.forEach((team) => { team.score = 0; });
  boardTeamId = null;
  teamsChanged();
}

/* ---------- Listening for changes ---------- */

// fn is called every time a team is added, removed, renamed or scores
function onTeamsChanged(fn) {
  teamChangeListeners.push(fn);
}

function teamsChanged() {
  saveTeams();
  teamChangeListeners.forEach((fn) => fn(teams));
}

/* ---------- Saving between visits ---------- */

function createTeam(name, color) {
  return {
    id: "t" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name,
    score: 0,
    color,
  };
}

function loadTeams() {
  try {
    const saved = JSON.parse(localStorage.getItem(TEAMS_STORAGE_KEY));
    if (Array.isArray(saved)) {
      const savedTeams = saved
        .filter((team) => team && team.id && team.name)
        .slice(0, MAX_TEAMS)
        .map((team, index) => ({
          id: String(team.id),
          name: String(team.name).slice(0, 24),
          score: Number(team.score) || 0,
          color: TEAM_COLORS.includes(team.color) ? team.color : TEAM_COLORS[index % TEAM_COLORS.length],
        }));
      if (savedTeams.length > 0) return savedTeams;
    }
  } catch (error) {
    // Storage unavailable or damaged — start fresh
  }
  return [createTeam("Team 1", TEAM_COLORS[0]), createTeam("Team 2", TEAM_COLORS[1])];
}

function saveTeams() {
  try {
    localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
  } catch (error) {
    // Not important if this fails
  }
}
