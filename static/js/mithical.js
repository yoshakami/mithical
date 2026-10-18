export const state = {
  cards: [],
  activeCard: null,
  theme: "Dark",
  version: 400,
  language: "en",
  difficultyInternal: true,
  profile: null,
  profileLoading: false,
  profileError: null,
  waccaSongs: [],
};

export function getApiUrl() {
  return window.MITHICAL?.apiUrl || "";
}

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${getApiUrl()}${path}`, options);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export function loadCardsFromStorage() {
  const stored = localStorage.getItem("cards");
  state.cards = stored ? JSON.parse(stored) : [];
  state.activeCard = localStorage.getItem("activeCard") || state.cards[0]?.luid || null;
}

export function saveCards() {
  localStorage.setItem("cards", JSON.stringify(state.cards));
  if (state.activeCard) {
    localStorage.setItem("activeCard", state.activeCard);
  } else {
    localStorage.removeItem("activeCard");
  }
}

export function loadSettingsFromStorage() {
  state.theme = localStorage.getItem("theme") || "Dark";
  const version = parseInt(localStorage.getItem("version") || "400", 10);
  state.version = version === 300 ? 300 : 400;
  state.language = localStorage.getItem("language") || "en";
  const diffInternal = localStorage.getItem("difficultyInternal");
  state.difficultyInternal = diffInternal === null || diffInternal === "true";
}

export function applyTheme() {
  const section = document.body.classList.contains("section-wacca") ? "wacca" : "mithical";
  const plus = section === "wacca" && state.version === 400 ? "-plus" : "";
  document.body.className = `theme-${section}-${state.theme.toLowerCase()}${plus} section-${section}`;
}

export function requireAuth() {
  if (!state.cards.length) {
    window.location.href = "/cards";
    return false;
  }
  return true;
}

export function initNav() {
  const select = document.getElementById("nav-active-card");
  if (!select) return;

  select.innerHTML = "";
  if (state.cards.length === 0) {
    const opt = document.createElement("option");
    opt.textContent = "No cards added yet";
    select.appendChild(opt);
    select.disabled = true;
    return;
  }

  state.cards.forEach((card) => {
    const opt = document.createElement("option");
    opt.value = card.luid;
    opt.textContent = card.user_name;
    if (card.luid === state.activeCard) opt.selected = true;
    select.appendChild(opt);
  });

  select.onchange = () => {
    state.activeCard = select.value;
    saveCards();
    window.dispatchEvent(new CustomEvent("activeCardChanged"));
  };
}

export function initSettingsModal() {
  const modal = document.getElementById("settings-modal");
  const openBtn = document.getElementById("settings-open");
  const closeBtn = document.getElementById("settings-close");
  if (!modal) return;

  openBtn?.addEventListener("click", () => modal.classList.add("on"));
  closeBtn?.addEventListener("click", () => modal.classList.remove("on"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("on");
  });

  setupToggle("version-toggle", state.version, (val) => {
    state.version = parseInt(val, 10);
    localStorage.setItem("version", state.version);
    applyTheme();
    window.dispatchEvent(new CustomEvent("versionChanged"));
  });

  setupToggle("theme-toggle", state.theme, (val) => {
    state.theme = val;
    localStorage.setItem("theme", state.theme);
    applyTheme();
  });

  const langSelect = document.getElementById("language-select");
  if (langSelect) {
    langSelect.value = state.language;
    langSelect.onchange = () => {
      state.language = langSelect.value;
      localStorage.setItem("language", state.language);
      window.dispatchEvent(new CustomEvent("languageChanged"));
    };
  }

  const diffCheck = document.getElementById("difficulty-internal");
  if (diffCheck) {
    diffCheck.checked = state.difficultyInternal;
    diffCheck.onchange = () => {
      state.difficultyInternal = diffCheck.checked;
      localStorage.setItem("difficultyInternal", state.difficultyInternal);
      window.dispatchEvent(new CustomEvent("difficultyInternalChanged"));
    };
  }
}

function setupToggle(id, current, onChange) {
  const el = document.getElementById(id);
  if (!el) return;
  el.querySelectorAll("button").forEach((btn) => {
    if (String(btn.dataset.value) === String(current)) btn.classList.add("active");
    btn.onclick = () => {
      el.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      onChange(btn.dataset.value);
    };
  });
}

export function markActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll("#wacca-nav a").forEach((a) => {
    const href = a.getAttribute("href");
    a.classList.toggle("active", path === href || (href !== "/wacca" && path.startsWith(href)));
  });
}

loadCardsFromStorage();
loadSettingsFromStorage();
applyTheme();
initNav();
initSettingsModal();
markActiveNav();

window.addEventListener("activeCardChanged", initNav);
