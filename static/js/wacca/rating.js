import { state } from "../mithical.js";
import { songTitle, formatDifficulty } from "./profile.js";

async function getRateMulBorders() {
  const mod = await import("/assets/wacca/waccaRateMulBorders.js");
  return mod.default;
}

function getRating(difficulty, score, borders) {
  for (const border of borders) {
    if (score >= border.min) return border.multiplier * difficulty * 10;
  }
  return 0;
}

async function render() {
  const borders = await getRateMulBorders();
  const folders = [
    { name: "Hidden", sheets: [], count: 0 },
    { name: "Wacca Nana+", sheets: [], count: 100 },
  ];

  for (const music of state.profile.music) {
    const song = state.waccaSongs.find((s) => s.id === music.music_id);
    if (!song) continue;
    const diffIdx = music.music_difficulty - 1;
    const sheet = song.sheets[diffIdx];
    if (!sheet || sheet.gameVersion > state.version) continue;

    const entry = {
      song,
      difficulty: diffIdx,
      score: music.score,
      rating: getRating(sheet.difficulty, music.score, borders),
    };

    if (sheet.gameVersion < 300) folders[0].sheets.push(entry);
    else folders[1].sheets.push(entry);
  }

  folders.forEach((f) => f.sheets.sort((a, b) => b.rating - a.rating));

  const el = document.getElementById("rating-folders");
  el.innerHTML = "";
  folders.forEach((folder) => {
    const section = document.createElement("div");
    section.innerHTML = `<h2>${folder.name}</h2>`;
    const top = folder.sheets.slice(0, folder.count || folder.sheets.length);
    top.forEach((entry, i) => {
      const row = document.createElement("a");
      row.href = `/wacca/songs/${entry.song.id}`;
      row.className = "song";
      row.style.display = "block";
      row.innerHTML = `
        <div class="card-body" style="display:flex;justify-content:space-between;align-items:center">
          <div>#${i + 1} ${songTitle(entry.song)} — ${formatDifficulty(entry.song.sheets[entry.difficulty].difficulty)}</div>
          <div>${(entry.rating / 10).toFixed(1)} (${entry.score})</div>
        </div>`;
      section.appendChild(row);
    });
    el.appendChild(section);
  });
}

window.addEventListener("profileLoaded", render);
window.addEventListener("versionChanged", render);
