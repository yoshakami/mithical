import { state } from "../mithical.js";
import { songTitle, formatDifficulty } from "./profile.js";

function render() {
  const container = document.querySelector("[data-song-id]");
  const songId = parseInt(container.dataset.songId, 10);
  const song = state.waccaSongs.find((s) => s.id === songId);

  if (!song) {
    document.getElementById("song-not-found").classList.remove("hidden");
    return;
  }

  document.getElementById("song-detail").classList.remove("hidden");
  document.getElementById("song-cover").src = `/wacca/img/covers/${song.imageName}`;
  document.getElementById("song-title").textContent = songTitle(song);
  document.getElementById("song-artist").textContent = song.artist;

  const sheetsEl = document.getElementById("song-sheets");
  sheetsEl.innerHTML = song.sheets
    .filter((sh) => sh.gameVersion <= state.version)
    .map(
      (sh, i) =>
        `<span class="diff-pill diff-pill-${i + 1}">${formatDifficulty(sh.difficulty)}</span>`
    )
    .join("");

  const playerData = state.profile.songs[song.id];
  const scoresEl = document.getElementById("song-scores");
  scoresEl.innerHTML = "<h3>Your Scores</h3>";
  playerData?.scores.forEach((score, i) => {
    if (!score) return;
    const row = document.createElement("div");
    row.className = "card";
    row.innerHTML = `
      <div class="card-body">
        Difficulty ${i + 1}: ${formatDifficulty(song.sheets[i].difficulty)} —
        Score: ${score.score} | Plays: ${score.play_count} | Rating: ${(score.rating / 10).toFixed(1)}
      </div>`;
    scoresEl.appendChild(row);
  });
}

window.addEventListener("profileLoaded", render);
window.addEventListener("languageChanged", render);
