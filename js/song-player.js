/* =========================================================
   song-player.js — "Name that song" clips, like Songless.

   A question with an "audio" file (questions.js) gets a player on
   its card instead of the 30-second buzz clock:
     PLAY        → plays the first 0.5 seconds of the song
     LONGER CLIP → unlocks the next length (1s, 2s, 8s, 15s) and plays it
   Every clip starts from the same spot. Teams can buzz any time.
   Once the answer is shown, PLAY THE SONG plays it properly.

   Where the clips start: by default, right where the music begins
   (any silence at the very start of the file is skipped). To start
   somewhere else, e.g. at the chorus, add audioStart (in seconds)
   to the question:  audioStart: 42.5

   Clip lengths are set in SONG_CLIP_SECONDS below.
   ========================================================= */

const SONG_CLIP_SECONDS = [0.5, 1, 2, 8, 15];
const SONG_VOLUME = 0.9;
const SONG_SILENCE_LEVEL = 0.02; // quieter than this at the start counts as silence

const songPlayerElement = document.getElementById("song-player");
const songStepsElement = document.getElementById("song-steps");
const songBarUnlocked = document.getElementById("song-bar-unlocked");
const songBarFill = document.getElementById("song-bar-fill");
const songPlayButton = document.getElementById("song-play-button");
const songMoreButton = document.getElementById("song-more-button");
const songStatusElement = document.getElementById("song-status");

let songContext = null;   // Web Audio (exact clip lengths)
let song = null;          // the current song, see prepareSongPlayer()
let songLoadId = 0;       // ignores a slow load that finishes after the card has moved on

/* ---------- Public (question-screen.js) ---------- */

// Called every time a question opens. Hides the player unless the question has a song.
function prepareSongPlayer(question) {
  stopSong();
  song = null;
  songLoadId += 1;
  songPlayerElement.hidden = !question.audio;
  songPlayerElement.classList.remove("is-playing", "is-full-song");
  if (!question.audio) return;

  song = {
    url: question.audio,
    start: question.audioStart ?? null, // null = find where the music begins
    step: 0,                            // index into SONG_CLIP_SECONDS
    buffer: null,                       // decoded song (Web Audio)
    element: null,                      // fallback <audio> when Web Audio can't load it
    ready: false,
    fullSong: false,                    // true once the answer is shown
    playing: null,                      // what's playing right now
    position: 0,                        // full-song mode: where pause left off
  };

  buildSongSteps();
  updateSongControls();
  setSongStatus("Loading song…");
  loadSong(songLoadId);
}

// Answer shown: the clips are done, now the whole song can play
function switchSongToFullPlay() {
  if (!song) return;
  stopSong();
  song.fullSong = true;
  song.position = 0;
  songBarFill.style.width = "0%";
  songPlayerElement.classList.add("is-full-song");
  updateSongControls();
  setSongStatus("");
}

// Stops whatever is playing (card closing, answer shown, new clip)
function stopSong() {
  if (!song || !song.playing) return;
  const playing = song.playing;
  song.playing = null;

  if (playing.source) {
    playing.source.onended = null;
    try { playing.source.stop(); } catch { /* already stopped */ }
  }
  if (playing.element) {
    playing.element.pause();
    clearTimeout(playing.timer);
  }
  cancelAnimationFrame(playing.frame);
  songPlayerElement.classList.remove("is-playing");
  updateSongControls();
}

function isSongQuestionOpen() {
  return Boolean(song);
}

/* ---------- Loading ---------- */

async function loadSong(loadId) {
  const { url } = song;
  try {
    // Web Audio: exact timing. Needs the game to be served over http
    // (the buzzer server); opening index.html as a file can't fetch().
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const bytes = await response.arrayBuffer();
    const buffer = await getSongContext().decodeAudioData(bytes);
    if (loadId !== songLoadId) return;
    song.buffer = buffer;
    if (song.start === null) song.start = findMusicStart(buffer);
  } catch {
    // Fallback: a plain <audio> element (works when opened as a file)
    if (loadId !== songLoadId) return;
    const element = new Audio(url);
    element.preload = "auto";
    element.volume = SONG_VOLUME;
    const loaded = await new Promise((resolve) => {
      element.addEventListener("canplaythrough", () => resolve(true), { once: true });
      element.addEventListener("error", () => resolve(false), { once: true });
      element.load();
    });
    if (loadId !== songLoadId) return;
    if (!loaded) {
      setSongStatus(`Couldn't load ${url}`);
      return;
    }
    song.element = element;
    if (song.start === null) song.start = 0;
  }

  song.ready = true;
  setSongStatus("");
  updateSongControls();
}

function getSongContext() {
  if (!songContext) songContext = new (window.AudioContext || window.webkitAudioContext)();
  return songContext;
}

// Seconds into the file where the sound actually starts
function findMusicStart(buffer) {
  const samples = buffer.getChannelData(0);
  const limit = Math.min(samples.length, buffer.sampleRate * 20); // only look at the first 20s
  for (let i = 0; i < limit; i += 1) {
    if (Math.abs(samples[i]) > SONG_SILENCE_LEVEL) {
      return Math.max(0, i / buffer.sampleRate - 0.03);
    }
  }
  return 0;
}

/* ---------- Playing ---------- */

// seconds: clip length, or null to play to the end (full song)
function playSongFrom(offset, seconds) {
  stopSong();
  if (!song || !song.ready) return;

  const playing = { startedAt: performance.now(), offset, seconds, frame: 0 };
  song.playing = playing;

  if (song.buffer) {
    const context = getSongContext();
    context.resume();
    const source = context.createBufferSource();
    source.buffer = song.buffer;
    const gain = context.createGain();
    source.connect(gain).connect(context.destination);

    // Tiny fades so a short clip doesn't click
    const startTime = context.currentTime + 0.03;
    const fade = seconds ? Math.min(0.015, seconds / 5) : 0.015;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(SONG_VOLUME, startTime + fade);
    if (seconds) {
      gain.gain.setValueAtTime(SONG_VOLUME, startTime + seconds - fade);
      gain.gain.linearRampToValueAtTime(0, startTime + seconds);
      source.start(startTime, offset, seconds);
    } else {
      source.start(startTime, offset);
    }
    playing.source = source;
    playing.startedAt = performance.now() + 30;
    source.onended = () => finishPlaying(playing);
  } else {
    const element = song.element;
    playing.element = element;
    element.currentTime = offset;
    element.addEventListener("playing", () => {
      if (song?.playing !== playing) return;
      playing.startedAt = performance.now();
      if (seconds) playing.timer = setTimeout(() => finishPlaying(playing), seconds * 1000);
    }, { once: true });
    element.onended = () => finishPlaying(playing);
    element.play().catch(() => finishPlaying(playing));
  }

  songPlayerElement.classList.add("is-playing");
  updateSongControls();
  animateSongBar(playing);
}

function finishPlaying(playing) {
  if (song?.playing !== playing) return;
  if (song.fullSong) song.position = 0; // reached the end
  stopSong();
  songBarFill.style.width = "0%";
}

// Moves the bar along while a clip plays
function animateSongBar(playing) {
  const total = SONG_CLIP_SECONDS[SONG_CLIP_SECONDS.length - 1];
  const tick = () => {
    if (song?.playing !== playing) return;
    const elapsed = Math.max(0, (performance.now() - playing.startedAt) / 1000);
    if (song.fullSong) {
      const length = song.buffer ? song.buffer.duration : song.element.duration || 1;
      songBarFill.style.width = `${Math.min(100, ((playing.offset + elapsed) / length) * 100)}%`;
    } else {
      songBarFill.style.width = `${Math.min(100, (Math.min(elapsed, playing.seconds) / total) * 100)}%`;
    }
    playing.frame = requestAnimationFrame(tick);
  };
  tick();
}

/* ---------- Buttons ---------- */

songPlayButton.addEventListener("click", () => {
  if (!song || !song.ready) return;

  if (song.fullSong) {
    // Play / pause the whole song
    if (song.playing) {
      const elapsed = (performance.now() - song.playing.startedAt) / 1000;
      song.position = song.playing.offset + Math.max(0, elapsed);
      stopSong();
    } else {
      playSongFrom(song.position || song.start, null);
    }
    return;
  }

  playSongFrom(song.start, SONG_CLIP_SECONDS[song.step]);
});

songMoreButton.addEventListener("click", () => {
  if (!song || song.fullSong || song.step >= SONG_CLIP_SECONDS.length - 1) return;
  song.step += 1;
  buildSongSteps();
  playSongFrom(song.start, SONG_CLIP_SECONDS[song.step]);
});

/* ---------- Drawing ---------- */

function formatClip(seconds) {
  return `${seconds}s`;
}

// The row of lengths (0.5s · 1s · 2s · 8s · 15s) and the unlocked part of the bar
function buildSongSteps() {
  const total = SONG_CLIP_SECONDS[SONG_CLIP_SECONDS.length - 1];
  songStepsElement.textContent = "";
  SONG_CLIP_SECONDS.forEach((seconds, index) => {
    const item = document.createElement("li");
    item.className = "song-step";
    if (index < song.step) item.classList.add("is-used");
    if (index === song.step) item.classList.add("is-current");
    item.textContent = formatClip(seconds);
    songStepsElement.append(item);
  });
  songBarUnlocked.style.width = `${Math.max(1, (SONG_CLIP_SECONDS[song.step] / total) * 100)}%`;
  songBarFill.style.width = "0%";
}

function updateSongControls() {
  if (!song) return;
  const isPlaying = Boolean(song.playing);
  songPlayButton.disabled = !song.ready;

  if (song.fullSong) {
    songPlayButton.textContent = isPlaying ? "❚❚ Pause" : "▶ Play the song";
    songMoreButton.hidden = true;
    return;
  }

  const clip = formatClip(SONG_CLIP_SECONDS[song.step]);
  songPlayButton.textContent = isPlaying ? `Playing ${clip}…` : `▶ Play ${clip}`;
  const next = SONG_CLIP_SECONDS[song.step + 1];
  songMoreButton.hidden = false;
  songMoreButton.disabled = !song.ready || next === undefined;
  songMoreButton.textContent = next === undefined ? "Longest clip" : `Longer clip: ${formatClip(next)} ▸`;
}

function setSongStatus(text) {
  songStatusElement.textContent = text;
  songStatusElement.hidden = !text;
}
