import { state } from "../mithical.js";
import { songTitle, formatDifficulty } from "./profile.js";

const perPage = 50;
let page = 1;
let sortOrder = "asc";
let activeSort = "default";
let activeCategories = [];
let search = "";
let filters = { played: "all", favorite: "all", inferno: "all" };

const sortOptions = [
  { id: "default", label: "Default" },
  { id: "title", label: "Title" },
  { id: "artist", label: "Artist" },
  { id: "playCount", label: "Play Count", defaultOrder: "desc" },
  { id: "rating", label: "Rating", defaultOrder: "desc" },
];

function getFilteredSongs() {
  let results = state.waccaSongs.filter((s) => s.gameVersion <= state.version);

  const cats = activeCategories.length
    ? [...activeCategories]
    : categories.map((c) => c.ja);
  if (cats.includes("TANO*C")) cats.push("TANO*C（オリジナル）");
  results = results.filter((s) => cats.includes(s.category));

  if (filters.played === "played") {
    results = results.filter((s) => (state.profile.songs[s.id]?.playCount ?? 0) > 0);
  } else if (filters.played === "unplayed") {
    results = results.filter((s) => (state.profile.songs[s.id]?.playCount ?? 0) === 0);
  }

  if (filters.favorite === "yes") {
    results = results.filter((s) => state.profile.songs[s.id]?.favorite);
  } else if (filters.favorite === "no") {
    results = results.filter((s) => !state.profile.songs[s.id]?.favorite);
  }

  if (filters.inferno === "yes") {
    results = results.filter(
      (s) => s.sheets.filter((sh) => sh.gameVersion <= state.version).length > 3
    );
  } else if (filters.inferno === "no") {
    results = results.filter(
      (s) => s.sheets.filter((sh) => sh.gameVersion <= state.version).length <= 3
    );
  }

  if (search.length > 2 && window.fuzzysort) {
    results = window.fuzzysort
      .go(search, results, { keys: ["title", "artist", "titleEnglish"] })
      .map((r) => r.obj);
  }

  results.sort((a, b) => {
    let cmp = 0;
    switch (activeSort) {
      case "title": {
        const aT = state.language === "ja" ? a.title : a.titleEnglish || a.title;
        const bT = state.language === "ja" ? b.title : b.titleEnglish || b.title;
        cmp = aT.localeCompare(bT);
        break;
      }
      case "artist":
        cmp = a.artist.localeCompare(b.artist);
        break;
      case "playCount":
        cmp =
          (state.profile.songs[a.id]?.playCount ?? 0) -
          (state.profile.songs[b.id]?.playCount ?? 0);
        break;
      case "rating":
        cmp =
          (state.profile.songs[a.id]?.rating ?? 0) -
          (state.profile.songs[b.id]?.rating ?? 0);
        break;
      default:
        cmp = sortOrder === "asc" ? 1 : -1;
        return cmp;
    }
    return sortOrder === "asc" ? cmp : -cmp;
  });

  return results;
}

function renderSongRow(song) {
  const playerData = state.profile.songs[song.id];
  const sheets = song.sheets
    .filter((sh) => sh.gameVersion <= state.version)
    .map(
      (sh, i) =>
        `<span class="diff-pill diff-pill-${i + 1}">${formatDifficulty(sh.difficulty)}</span>`
    )
    .join("");

  const a = document.createElement("a");
  a.href = `/wacca/songs/${song.id}`;
  a.className = "song";
  a.innerHTML = `
    <div class="song-cover"><img src="/wacca/img/covers/${song.imageName}" alt="" loading="lazy"></div>
    <div class="song-info">
      <div class="song-header">
        <div>
          <div class="song-title">${songTitle(song)}</div>
          <div class="song-artist">${song.artist}</div>
        </div>
        <div>${playerData?.favorite ? "★" : ""}</div>
      </div>
      <div class="song-sheets">${sheets}</div>
    </div>`;
  return a;
}

function render() {
  const filtered = getFilteredSongs();
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  if (page > totalPages) page = totalPages;

  document.getElementById("songs-count").textContent =
    `Showing ${Math.min(filtered.length, perPage)} of ${filtered.length} songs (page ${page}/${totalPages})`;

  const slice = filtered.slice((page - 1) * perPage, page * perPage);
  const list = document.getElementById("songs-list");
  const empty = document.getElementById("songs-empty");
  list.innerHTML = "";
  slice.forEach((song) => list.appendChild(renderSongRow(song)));
  empty.classList.toggle("hidden", slice.length > 0);

  document.getElementById("page-info").textContent = `${page} / ${totalPages}`;
}

let categories = [];

function initUI() {
  const sortSelect = document.getElementById("sort-select");
  sortOptions.forEach((opt) => {
    const o = document.createElement("option");
    o.value = opt.id;
    o.textContent = opt.label;
    sortSelect.appendChild(o);
  });

  sortSelect.onchange = () => {
    activeSort = sortSelect.value;
    const opt = sortOptions.find((o) => o.id === activeSort);
    sortOrder = opt?.defaultOrder || "asc";
    updateSortBtn();
    page = 1;
    render();
  };

  document.getElementById("sort-direction").onclick = () => {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    updateSortBtn();
    render();
  };

  document.getElementById("song-search").oninput = (e) => {
    search = e.target.value;
    page = 1;
    render();
  };

  document.getElementById("page-prev").onclick = () => {
    if (page > 1) { page--; render(); }
  };
  document.getElementById("page-next").onclick = () => {
    page++; render();
  };

  document.getElementById("toggle-filters").onclick = () => {
    document.getElementById("song-filters").classList.toggle("hidden");
  };

  const filtersEl = document.getElementById("song-filters");
  filtersEl.innerHTML = `
    <div class="song-filter-row"><strong>Played:</strong>
      <button class="filter-btn active" data-filter="played" data-value="all">All</button>
      <button class="filter-btn" data-filter="played" data-value="unplayed">Not Played</button>
      <button class="filter-btn" data-filter="played" data-value="played">Played</button>
    </div>
    <div class="song-filter-row"><strong>Favorite:</strong>
      <button class="filter-btn active" data-filter="favorite" data-value="all">All</button>
      <button class="filter-btn" data-filter="favorite" data-value="no">No</button>
      <button class="filter-btn" data-filter="favorite" data-value="yes">Yes</button>
    </div>
    <div class="song-filter-row"><strong>Inferno:</strong>
      <button class="filter-btn active" data-filter="inferno" data-value="all">All</button>
      <button class="filter-btn" data-filter="inferno" data-value="no">No</button>
      <button class="filter-btn" data-filter="inferno" data-value="yes">Yes</button>
    </div>`;

  filtersEl.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.onclick = () => {
      filtersEl.querySelectorAll(`[data-filter="${btn.dataset.filter}"]`).forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      filters[btn.dataset.filter] = btn.dataset.value;
      page = 1;
      render();
    };
  });
}

function updateSortBtn() {
  document.getElementById("sort-direction").textContent =
    sortOrder === "asc" ? "↑ Asc" : "↓ Desc";
}

async function initCategories() {
  const mod = await import("/assets/wacca/waccaCategories.js");
  categories = mod.default.filter((c) => !c.hidden);
  const el = document.getElementById("category-toggles");
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.textContent = cat.en || cat.ja;
    btn.onclick = () => {
      btn.classList.toggle("active");
      if (activeCategories.includes(cat.ja)) {
        activeCategories = activeCategories.filter((c) => c !== cat.ja);
      } else {
        activeCategories.push(cat.ja);
      }
      page = 1;
      render();
    };
    el.appendChild(btn);
  });
}

window.addEventListener("profileLoaded", () => {
  initUI();
  initCategories().then(render);
});
window.addEventListener("languageChanged", render);
window.addEventListener("versionChanged", () => { page = 1; render(); });
