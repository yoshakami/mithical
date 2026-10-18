import { state, apiFetch, saveCards } from "../mithical.js";

function formatLuid(ins) {
  const real = ins.replace(/[^0-9]/gi, "");
  const parts = real.match(/.{1,4}/g);
  return parts ? parts.join(" ") : "";
}

function renderCards() {
  const list = document.getElementById("cards-list");
  const goWacca = document.getElementById("go-wacca-wrap");
  if (!list) return;

  list.innerHTML = "";
  state.cards.forEach((card) => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <div class="card-body">
        <div class="card-name">
          <div>${escapeHtml(card.user_name)}</div>
          <button type="button" class="btn-icon delete-card" data-luid="${card.luid}" title="Remove card">
            <span class="mdi mdi-delete" style="color:#cf6679"></span>
          </button>
        </div>
        <div class="card-luid">
          <button type="button" class="btn-icon toggle-luid" title="View full ID">
            <span class="mdi mdi-eye-off"></span>
          </button>
          <span class="luid-text">${maskLuid(card.luid)}</span>
        </div>
      </div>`;

    el.querySelector(".delete-card").onclick = () => deleteCard(card.luid);
    const toggleBtn = el.querySelector(".toggle-luid");
    const luidText = el.querySelector(".luid-text");
    let hidden = true;
    toggleBtn.onclick = () => {
      hidden = !hidden;
      toggleBtn.querySelector(".mdi").className = hidden ? "mdi mdi-eye-off" : "mdi mdi-eye";
      luidText.textContent = hidden ? maskLuid(card.luid) : formatLuid(card.luid);
    };

    list.appendChild(el);
  });

  goWacca?.classList.toggle("hidden", state.cards.length === 0);
}

function maskLuid(luid) {
  return luid.replace(/\d(?=\d{4})/g, "x").replace(/(.{4})/g, "$1 ").trim();
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function addCard() {
  const input = document.getElementById("access-code");
  const errorEl = document.getElementById("card-error");
  const messageEl = document.getElementById("card-message");
  const btn = document.getElementById("add-card-btn");
  const luid = input.value.replace(/[^0-9]/gi, "");

  errorEl.textContent = "";
  messageEl.textContent = "";

  if (luid.length < 20) {
    errorEl.textContent = "Card ID must be 20 characters long.";
    return;
  }

  if (state.cards.find((c) => c.luid === luid)) {
    errorEl.textContent = "You already added this card.";
    return;
  }

  btn.disabled = true;
  try {
    const data = await apiFetch(`/card/${luid}`);
    if (!data.user_name) throw new Error("not found");

    state.cards.push({ luid, user_name: data.user_name });
    state.activeCard = luid;
    saveCards();
    messageEl.textContent = "Card added successfully!";
    input.value = "";
    renderCards();
  } catch {
    errorEl.textContent = "Failed to find the card on the network.";
  } finally {
    btn.disabled = false;
  }
}

function deleteCard(luid) {
  state.cards = state.cards.filter((c) => c.luid !== luid);
  if (state.activeCard === luid) {
    state.activeCard = state.cards[0]?.luid || null;
  }
  saveCards();
  renderCards();
}

document.getElementById("add-card-btn")?.addEventListener("click", addCard);
document.getElementById("access-code")?.addEventListener("input", (e) => {
  e.target.value = formatLuid(e.target.value);
});
document.getElementById("access-code")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addCard();
});

renderCards();
