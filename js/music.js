/* =========================================================
   music.js — Background music and sound effects.

   There are no audio files: everything is played live by the
   browser's built-in synthesizer (the Web Audio API), so it's
   all original.

   Two songs (see SONGS below):
     menu — a brassy, horn-heavy fanfare for the home screen
     game — a bouncy groove for the board

   One sound effect:
     playRoundSting() — a horn fanfare when Round 2 begins

   Browsers only allow sound after the player clicks something,
   so the menu music starts on the first click anywhere.
   The ♪ button in the corner mutes ALL sound (music + effects).

   Easy things to tweak:
     MUSIC_VOLUME        — normal loudness (0 to 1)
     MUSIC_DUCKED_VOLUME — loudness while a question is open
     SOUND_EFFECT_VOLUME — loudness of the round fanfare
     each song's "tempo" — speed in beats per minute
   ========================================================= */

const MUSIC_VOLUME = 0.22;
const MUSIC_DUCKED_VOLUME = 0.012; // barely audible — set to 0 for full silence
const SOUND_EFFECT_VOLUME = 0.5;
const SOUND_PREFERENCE_KEY = "trivia-night-music"; // remembers mute between visits

// One "step" is an eighth note. 8 steps per bar, 4 bars per loop.
const STEPS_PER_BAR = 8;
const STEPS_PER_LOOP = 32;

/* =========================================================
   THE SONGS
   Notes are MIDI numbers: 60 = middle C, +1 = one semitone up,
   +12 = one octave up.
   ========================================================= */
const SONGS = {
  // Home screen: big horn chords going C → F → Ab → Bb (a classic
  // "fanfare" move), with a horn melody every other time around.
  menu: {
    tempo: 124,
    chords: [
      { bass: 36, notes: [60, 64, 67, 72] }, // C
      { bass: 41, notes: [60, 65, 69, 72] }, // F
      { bass: 44, notes: [60, 63, 68, 72] }, // Ab
      { bass: 46, notes: [62, 65, 70, 74] }, // Bb
    ],
    bassPattern: [0, 12, 0, 12, 0, 12, 7, 12], // semitones above each bar's bass note
    stabSteps: [0, 3, 6],                     // when the chord hits play in each bar
    stabInstrument: "brass",
    melody: [                                  // [step in loop, note, length in steps]
      [0, 67, 1], [1, 72, 1], [2, 76, 1], [3, 79, 3], [6, 76, 1], [7, 79, 1],
      [8, 81, 3], [11, 79, 1], [12, 77, 2], [14, 72, 2],
      [16, 75, 2], [18, 80, 2], [20, 79, 1], [21, 75, 1], [22, 72, 2],
      [24, 74, 1], [25, 77, 1], [26, 82, 2], [28, 84, 4],
    ],
    melodyInstrument: "brass",
    kickSteps: [0, 3, 4],
    snareSteps: [2, 6],
    crashEveryLoop: true,
  },

  // Game board: a lighter, bouncy groove (Fmaj7 → Dm7 → Gm7 → C7)
  game: {
    tempo: 118,
    chords: [
      { bass: 41, notes: [57, 60, 64, 65] }, // Fmaj7
      { bass: 38, notes: [57, 60, 62, 65] }, // Dm7
      { bass: 43, notes: [58, 62, 65, 67] }, // Gm7
      { bass: 36, notes: [58, 60, 64, 67] }, // C7
    ],
    bassPattern: [0, 0, 7, 12, 0, 7, 12, 7],
    stabSteps: [1, 3, 6],
    stabInstrument: "synth",
    melody: [
      [0, 72, 1], [1, 69, 1], [2, 72, 1], [3, 77, 2], [5, 76, 1], [6, 72, 2],
      [8, 74, 1], [9, 77, 1], [10, 81, 2], [12, 79, 1], [13, 77, 1], [14, 74, 2],
      [16, 70, 1], [17, 74, 1], [18, 79, 2], [20, 77, 1], [21, 74, 1], [22, 70, 2],
      [24, 72, 1], [25, 76, 1], [26, 79, 1], [27, 82, 2], [29, 81, 1], [30, 79, 2],
    ],
    melodyInstrument: "synth",
    kickSteps: [0, 4],
    snareSteps: [2, 6],
    crashEveryLoop: false,
  },
};

/* ---------- Player state ---------- */

let audioContext = null;
let masterGain = null;     // music volume (fades, ducking)
let instrumentBus = null;  // every music instrument plugs in here
let effectsBus = null;     // sound effects plug in here (not affected by ducking)
let noiseBuffer = null;

let currentSongName = "menu"; // the song that *should* be playing for this screen
let activeSong = null;        // the song actually being played right now
let schedulerTimer = null;
let songSwitchTimer = null;
let duckRestoreTimer = null;
let nextStepTime = 0;
let currentStep = 0;
let loopCount = 0;
let isMusicDucked = false;
let isMusicOn = loadSoundPreference();

/* =========================================================
   PUBLIC FUNCTIONS (used by main.js and question-screen.js)
   ========================================================= */

// Plays a song ("menu" or "game"), crossfading if another one is playing.
function playSong(songName) {
  currentSongName = songName;
  if (!isMusicOn || !setUpAudio()) return;

  audioContext.resume();
  clearTimeout(songSwitchTimer);

  if (schedulerTimer !== null && activeSong === SONGS[songName]) return; // already playing

  if (schedulerTimer !== null) {
    // Fade the old song out, then start the new one
    fadeMusicTo(0, 0.35);
    songSwitchTimer = setTimeout(() => beginSong(songName), 400);
  } else {
    beginSong(songName);
  }
}

function stopMusic() {
  clearTimeout(songSwitchTimer);
  if (schedulerTimer === null) return;

  clearInterval(schedulerTimer);
  schedulerTimer = null;
  fadeMusicTo(0, 0.3);
}

// Called by the ♪ button
function toggleMusic() {
  // Sound is "on" but hasn't been able to start yet → start it
  if (isMusicOn && schedulerTimer === null) {
    playSong(currentSongName);
    return;
  }

  isMusicOn = !isMusicOn;
  saveSoundPreference(isMusicOn);

  if (isMusicOn) {
    playSong(currentSongName);
  } else {
    stopMusic();
  }

  updateMusicButton();
}

// Fades the music almost to silence while a question is on screen
function setMusicDucked(shouldDuck) {
  isMusicDucked = shouldDuck;
  if (schedulerTimer !== null) {
    fadeMusicTo(currentTargetVolume(), shouldDuck ? 0.5 : 0.8);
  }
}

// Horn fanfare for the start of Round 2: whoosh → quick horn run up →
// big held chord with drums and a cymbal crash.
function playRoundSting() {
  if (!isMusicOn || !setUpAudio()) return;
  audioContext.resume();

  const start = audioContext.currentTime + 0.05;
  const run = 0.09; // length of each note in the run-up
  const hit = start + 0.35 + run * 3;

  // Dip the music so the fanfare stands out, then bring it back
  clearTimeout(duckRestoreTimer);
  fadeMusicTo(0.02, 0.15);
  duckRestoreTimer = setTimeout(() => fadeMusicTo(currentTargetVolume(), 0.8), 2200);

  playWhoosh(start, 0.45, effectsBus);

  [67, 72, 76].forEach((note, index) => {
    playBrass({ notes: [note], time: start + 0.35 + index * run, duration: run * 0.9, volume: 0.35, output: effectsBus });
  });

  playBrass({ notes: [60, 64, 67, 72, 76], time: hit, duration: 1.3, volume: 0.55, output: effectsBus });
  playKick(hit, effectsBus);
  playKick(hit + 0.14, effectsBus);
  playCrash(hit, 0.3, effectsBus);
}

/* ---------- Menu music starts on the first click anywhere ---------- */

function handleFirstInteraction(event) {
  // START GAME and the ♪ button handle sound themselves
  if (event.target.closest("#start-button, #music-button")) return;

  document.removeEventListener("pointerdown", handleFirstInteraction);
  document.removeEventListener("keydown", handleFirstInteraction);
  if (schedulerTimer === null) {
    playSong(currentSongName);
  }
}

document.addEventListener("pointerdown", handleFirstInteraction);
document.addEventListener("keydown", handleFirstInteraction);

/* ---------- ♪ button (bottom-right corner) ---------- */

const musicButton = document.getElementById("music-button");

function updateMusicButton() {
  musicButton.classList.toggle("is-off", !isMusicOn);
  musicButton.setAttribute("aria-pressed", String(isMusicOn));
  musicButton.setAttribute("aria-label", isMusicOn ? "Sound on — click to mute" : "Sound off — click to turn on");
  musicButton.title = isMusicOn ? "Mute sound" : "Turn sound on";
}

musicButton.addEventListener("click", toggleMusic);
updateMusicButton();

/* ---------- Remembering the mute setting ---------- */

function loadSoundPreference() {
  try {
    return localStorage.getItem(SOUND_PREFERENCE_KEY) !== "off";
  } catch (error) {
    return true; // storage unavailable (e.g. private mode) — default to on
  }
}

function saveSoundPreference(isOn) {
  try {
    localStorage.setItem(SOUND_PREFERENCE_KEY, isOn ? "on" : "off");
  } catch (error) {
    // Not important if this fails
  }
}

/* =========================================================
   The synthesizer — you shouldn't need to edit below here
   ========================================================= */

// Creates the audio system the first time it's needed.
// Returns false if the browser doesn't support Web Audio.
function setUpAudio() {
  if (audioContext) return true;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return false;

  audioContext = new AudioContextClass();

  // Music: instruments → compressor → master volume → speakers
  instrumentBus = audioContext.createDynamicsCompressor();
  masterGain = audioContext.createGain();
  masterGain.gain.value = 0;
  instrumentBus.connect(masterGain);
  masterGain.connect(audioContext.destination);

  // Sound effects: their own path, so ducking the music doesn't affect them
  // effects → compressor → effects volume → speakers
  const effectsVolume = audioContext.createGain();
  effectsVolume.gain.value = SOUND_EFFECT_VOLUME;
  effectsBus = audioContext.createDynamicsCompressor();
  effectsBus.connect(effectsVolume);
  effectsVolume.connect(audioContext.destination);

  // One second of white noise, reused for drums and the whoosh
  noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate);
  const samples = noiseBuffer.getChannelData(0);
  for (let i = 0; i < samples.length; i++) {
    samples[i] = Math.random() * 2 - 1;
  }

  return true;
}

function beginSong(songName) {
  activeSong = SONGS[songName];
  currentStep = 0;
  loopCount = 0;
  nextStepTime = audioContext.currentTime + 0.05;

  clearInterval(schedulerTimer);
  // Every 25ms, queue up any notes due in the next ~0.15s.
  // (Scheduling slightly ahead keeps the rhythm steady.)
  schedulerTimer = setInterval(scheduleUpcomingSteps, 25);
  fadeMusicTo(currentTargetVolume(), 0.8);
}

function currentTargetVolume() {
  return isMusicDucked ? MUSIC_DUCKED_VOLUME : MUSIC_VOLUME;
}

function fadeMusicTo(volume, seconds) {
  if (!audioContext) return;
  const now = audioContext.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(masterGain.gain.value, now);
  masterGain.gain.linearRampToValueAtTime(volume, now + seconds);
}

function scheduleUpcomingSteps() {
  const now = audioContext.currentTime;
  const stepSeconds = 60 / activeSong.tempo / 2;

  // If the tab was in the background and we fell behind, skip ahead
  // instead of playing a burst of missed notes.
  if (nextStepTime < now - 0.2) {
    nextStepTime = now + 0.05;
  }

  while (nextStepTime < now + 0.15) {
    playStep(activeSong, currentStep, nextStepTime, stepSeconds);
    nextStepTime += stepSeconds;
    currentStep += 1;

    if (currentStep === STEPS_PER_LOOP) {
      currentStep = 0;
      loopCount += 1;
    }
  }
}

// Plays everything that happens on one eighth-note step of a song
function playStep(song, step, time, stepSeconds) {
  const bar = Math.floor(step / STEPS_PER_BAR);
  const stepInBar = step % STEPS_PER_BAR;
  const chord = song.chords[bar];

  // Drums
  if (song.kickSteps.includes(stepInBar)) playKick(time);
  if (song.snareSteps.includes(stepInBar)) playSnare(time);
  playHiHat(time, stepInBar % 2 === 1 ? 0.09 : 0.05);
  if (song.crashEveryLoop && step === 0) playCrash(time, 0.12);

  // Bass
  playNote({
    note: chord.bass + song.bassPattern[stepInBar],
    time,
    duration: stepSeconds * 0.85,
    wave: "sawtooth",
    volume: 0.32,
    filterFrequency: 520,
  });

  // Chord stabs
  if (song.stabSteps.includes(stepInBar)) {
    if (song.stabInstrument === "brass") {
      playBrass({ notes: chord.notes, time, duration: 0.2, volume: 0.3 });
    } else {
      chord.notes.forEach((note) => {
        playNote({ note, time, duration: 0.11, wave: "sawtooth", volume: 0.07, filterFrequency: 2400 });
      });
    }
  }

  // Melody every other loop; a soft bell arpeggio on the loops in between
  if (loopCount % 2 === 0) {
    song.melody.filter(([melodyStep]) => melodyStep === step).forEach(([, note, length]) => {
      const duration = stepSeconds * length * 0.9;
      if (song.melodyInstrument === "brass") {
        playBrass({ notes: [note + 12], time, duration, volume: 0.22 });
      } else {
        playNote({ note, time, duration, wave: "square", volume: 0.09, filterFrequency: 3200 });
      }
    });
  } else if (stepInBar % 2 === 0) {
    const arpeggioNote = chord.notes[(stepInBar / 2) % chord.notes.length] + 12;
    playNote({ note: arpeggioNote, time, duration: 0.35, wave: "sine", volume: 0.12, release: 0.3 });
  }
}

/* ---------- Instruments ---------- */

function midiToFrequency(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

// A single pitched note: oscillator → optional low-pass filter → volume envelope
function playNote({ note, time, duration, wave, volume, filterFrequency, release = 0.05, output = instrumentBus }) {
  const oscillator = audioContext.createOscillator();
  const envelope = audioContext.createGain();

  oscillator.type = wave;
  oscillator.frequency.value = midiToFrequency(note);

  let lastNode = oscillator;
  if (filterFrequency) {
    const filter = audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = filterFrequency;
    oscillator.connect(filter);
    lastNode = filter;
  }

  // Quick fade in, hold, then fade out (avoids clicks)
  envelope.gain.setValueAtTime(0, time);
  envelope.gain.linearRampToValueAtTime(volume, time + 0.01);
  envelope.gain.setValueAtTime(volume, time + duration);
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration + release);

  lastNode.connect(envelope);
  envelope.connect(output);

  oscillator.start(time);
  oscillator.stop(time + duration + release + 0.05);
}

// Synth "horns": two slightly out-of-tune sawtooth waves per note, with a
// filter that opens quickly at the start — that "blat" is what sounds brassy.
function playBrass({ notes, time, duration, volume, output = instrumentBus }) {
  const filter = audioContext.createBiquadFilter();
  const envelope = audioContext.createGain();
  const release = 0.12;

  filter.type = "lowpass";
  filter.Q.value = 1.5;
  filter.frequency.setValueAtTime(450, time);
  filter.frequency.linearRampToValueAtTime(3200, time + 0.06);
  filter.frequency.exponentialRampToValueAtTime(1500, time + Math.max(duration, 0.1));

  envelope.gain.setValueAtTime(0, time);
  envelope.gain.linearRampToValueAtTime(volume, time + 0.03);
  envelope.gain.setValueAtTime(volume * 0.85, time + duration);
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration + release);

  filter.connect(envelope);
  envelope.connect(output);

  // Keep chords from getting louder than single notes
  const perOscillatorVolume = 1 / (notes.length * 2);

  notes.forEach((note) => {
    [-7, 7].forEach((detuneCents) => {
      const oscillator = audioContext.createOscillator();
      const oscillatorGain = audioContext.createGain();
      oscillator.type = "sawtooth";
      oscillator.frequency.value = midiToFrequency(note);
      oscillator.detune.value = detuneCents;
      oscillatorGain.gain.value = perOscillatorVolume;
      oscillator.connect(oscillatorGain);
      oscillatorGain.connect(filter);
      oscillator.start(time);
      oscillator.stop(time + duration + release + 0.05);
    });
  });
}

function playKick(time, output = instrumentBus) {
  const oscillator = audioContext.createOscillator();
  const envelope = audioContext.createGain();

  oscillator.frequency.setValueAtTime(150, time);
  oscillator.frequency.exponentialRampToValueAtTime(45, time + 0.12);
  envelope.gain.setValueAtTime(0.9, time);
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + 0.3);

  oscillator.connect(envelope);
  envelope.connect(output);
  oscillator.start(time);
  oscillator.stop(time + 0.32);
}

function playSnare(time) {
  playNoise({ time, volume: 0.3, decay: 0.16, filterType: "highpass", filterFrequency: 1400 });
  playNote({ note: 54, time, duration: 0.02, wave: "triangle", volume: 0.18, release: 0.08 });
}

function playHiHat(time, volume) {
  playNoise({ time, volume, decay: 0.04, filterType: "highpass", filterFrequency: 7500 });
}

function playCrash(time, volume, output = instrumentBus) {
  playNoise({ time, volume, decay: 1.4, filterType: "highpass", filterFrequency: 5000, output });
}

// Rising "whoosh": noise through a filter that sweeps upward
function playWhoosh(time, duration, output = instrumentBus) {
  const source = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const envelope = audioContext.createGain();

  source.buffer = noiseBuffer;
  filter.type = "bandpass";
  filter.Q.value = 2;
  filter.frequency.setValueAtTime(300, time);
  filter.frequency.exponentialRampToValueAtTime(5000, time + duration);
  envelope.gain.setValueAtTime(0.0001, time);
  envelope.gain.exponentialRampToValueAtTime(0.5, time + duration * 0.8);
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration + 0.1);

  source.connect(filter);
  filter.connect(envelope);
  envelope.connect(output);
  source.start(time);
  source.stop(time + duration + 0.15);
}

function playNoise({ time, volume, decay, filterType, filterFrequency, output = instrumentBus }) {
  const source = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const envelope = audioContext.createGain();

  source.buffer = noiseBuffer;
  source.loop = true; // the buffer is 1s; long sounds like the crash need more
  filter.type = filterType;
  filter.frequency.value = filterFrequency;
  envelope.gain.setValueAtTime(volume, time);
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + decay);

  source.connect(filter);
  filter.connect(envelope);
  envelope.connect(output);
  source.start(time);
  source.stop(time + decay + 0.02);
}
