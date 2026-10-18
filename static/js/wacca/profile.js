import { state, apiFetch, requireAuth } from "../mithical.js";

let waccaSongsLoaded = false;

export async function loadWaccaSongs() {
  if (waccaSongsLoaded && state.waccaSongs.length) return state.waccaSongs;
  const mod = await import("/assets/wacca/waccaSongs.js");
  state.waccaSongs = mod.default;
  waccaSongsLoaded = true;
  return state.waccaSongs;
}

export function formatRating(rating, simple = false, decimals = 1) {
  const realRate = (rating ?? 0) / 10;
  const formatted = realRate.toFixed(decimals);
  const colors = [
    { from: 250, color: "rainbow" },
    { from: 220, color: "gold" },
    { from: 190, color: "silver" },
    { from: 160, color: "blue" },
    { from: 130, color: "purple" },
    { from: 100, color: "red" },
    { from: 60, color: "yellow" },
    { from: 30, color: "darkblue" },
    { from: 0, color: "white" },
  ];
  const color = colors.find((c) => realRate >= c.from)?.color || "white";
  return `<span class="rating-${color}${simple ? " simple" : ""}">${formatted}</span>`;
}

export function formatDifficulty(difficulty, includeZero = false) {
  if (state.difficultyInternal) {
    return includeZero ? difficulty.toFixed(1) : difficulty;
  }
  if (difficulty % 1 > 0.6) return Math.floor(difficulty) + "+";
  return Math.floor(difficulty);
}

export async function getIconUrl(iconId) {
  const mod = await import("/assets/wacca/waccaIcons.js");
  const icon = mod.default.find((i) => i.id === iconId);
  return icon ? `/wacca/img/icons/${icon.path}.png` : "/wacca/img/icons/S01/uT_UICN_S01_00_001.png";
}

export function songTitle(song) {
  if (state.language === "ja") return song.title;
  return song.titleEnglish || song.title;
}

function cacheSongInfo(song) {
  const favorite = state.profile.favorite_music_entries.includes(song.id);
  let playCount = 0;
  let rating = 0;
  const scores = [];

  for (let d = 1; d <= song.sheets.length; d++) {
    const music = state.profile.music.find(
      (m) => m.music_id === song.id && m.music_difficulty === d
    );
    if (music) {
      playCount += music.play_count;
      scores.push(music);
      rating = Math.max(rating, music.rating);
    } else {
      scores.push(null);
    }
  }

  return { favorite, scores, playCount, rating };
}

function cachePlayerSongs() {
  if (!state.profile) return;
  state.profile.songs = {};
  for (const song of state.waccaSongs) {
    state.profile.songs[song.id] = cacheSongInfo(song);
  }
}

export async function loadProfile() {
  if (!requireAuth()) return null;

  const loadingEl = document.getElementById("profile-loading");
  const errorEl = document.getElementById("profile-error");
  const contentEl = document.getElementById("profile-content");

  loadingEl?.classList.remove("hidden");
  errorEl?.classList.add("hidden");
  contentEl?.classList.add("hidden");

  try {
    await loadWaccaSongs();
    state.profile = await apiFetch(`/wacca/user/${state.activeCard}/${state.version}`);

    if (!localStorage.getItem("version")) {
      state.version = state.profile.version_data[300] ? 400 : 300;
      localStorage.setItem("version", state.version);
    }

    cachePlayerSongs();

    loadingEl?.classList.add("hidden");
    contentEl?.classList.remove("hidden");
    window.dispatchEvent(new CustomEvent("profileLoaded"));
    return state.profile;
  } catch (err) {
    console.error(err);
    loadingEl?.classList.add("hidden");
    if (errorEl) {
      errorEl.textContent = "Couldn't reach the API. Please try again later.";
      errorEl.classList.remove("hidden");
    }
    return null;
  }
}

window.addEventListener("activeCardChanged", loadProfile);
window.addEventListener("versionChanged", loadProfile);

if (document.getElementById("profile-loading")) {
  loadProfile();
}
