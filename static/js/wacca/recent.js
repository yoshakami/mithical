import { state } from "../mithical.js";
import { songTitle, formatDifficulty } from "./profile.js";

const difficulties = { 1: "Normal", 2: "Hard", 3: "Expert", 4: "Inferno" };

function renderPlay(play, song) {
  const sheet = song.sheets[play.info.music_difficulty - 1];
  const div = document.createElement("div");
  div.className = "play";
  div.innerHTML = `
    <a href="/wacca/songs/${song.id}" class="play-header-row">
      <div class="play-cover"><img src="/wacca/img/covers/${song.imageName}" alt=""></div>
      <div class="play-info">
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap">
          <div>
            <span class="play-title">${songTitle(song)}</span>
            <span class="play-artist">${song.artist}</span>
          </div>
          <div>${new Date(play.info.user_play_date).toLocaleString()}</div>
        </div>
        <div class="play-stats">
          <div class="play-difficulty-${play.info.music_difficulty}">
            ${formatDifficulty(sheet.difficulty)} ${difficulties[play.info.music_difficulty]}
          </div>
          <div>${play.info.score}</div>
        </div>
      </div>
    </a>
    <div class="play-detail">
      <div>Combo: ${play.info.combo} | Fast: ${play.info.fast} | Late: ${play.info.late}</div>
    </div>`;

  div.querySelector(".play-header-row").addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    div.classList.toggle("expanded");
  });

  return div;
}

function render() {
  const container = document.getElementById("recent-plays");
  const empty = document.getElementById("recent-empty");
  if (!container || !state.profile) return;

  const filtered = state.profile.playlog.filter((play) => {
    const song = state.waccaSongs.find((s) => s.id === play.info.music_id);
    if (!song) return false;
    const sheet = song.sheets[play.info.music_difficulty - 1];
    return sheet && sheet.gameVersion <= state.version;
  });

  container.innerHTML = "";
  if (filtered.length === 0) {
    empty?.classList.remove("hidden");
    return;
  }
  empty?.classList.add("hidden");

  const grouped = [];
  filtered.forEach((play) => {
    const dateStr = new Date(play.info.user_play_date).toLocaleDateString();
    let group = grouped.find((g) => g.date === dateStr);
    if (!group) {
      group = { date: dateStr, plays: [] };
      grouped.push(group);
    }
    group.plays.push(play);
  });

  grouped.forEach((group) => {
    const day = document.createElement("div");
    day.className = "play-log-day";
    day.innerHTML = `<div class="playlog-hr">${group.date}</div>`;
    group.plays.forEach((play) => {
      const song = state.waccaSongs.find((s) => s.id === play.info.music_id);
      if (song) day.appendChild(renderPlay(play, song));
    });
    container.appendChild(day);
  });
}

window.addEventListener("profileLoaded", render);
window.addEventListener("versionChanged", render);
