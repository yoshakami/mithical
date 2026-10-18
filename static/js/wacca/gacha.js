import { state, apiFetch } from "../mithical.js";

async function render() {
  document.getElementById("gacha-rp").textContent = state.profile.points;
  const mod = await import("/assets/wacca/waccaBoxes.js");
  const container = document.getElementById("gacha-boxes");
  container.innerHTML = "";

  mod.default.forEach((box) => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <div class="card-header"><h2>${box.name}</h2></div>
      <div class="card-body">
        <p>Cost: ${box.cost} RP</p>
        <button type="button" class="btn btn-primary spin-btn" data-box="${box.id}">Spin!</button>
        <div class="spin-result"></div>
      </div>`;
    el.querySelector(".spin-btn").onclick = async () => {
      const resultEl = el.querySelector(".spin-result");
      try {
        const data = await apiFetch(
          `/wacca/user/${state.activeCard}/gacha/${box.id}`,
          { method: "POST" }
        );
        resultEl.textContent = `Got item kind ${data.item.kind} id ${data.item.id}! RP: ${data.points}`;
        document.getElementById("gacha-rp").textContent = data.points;
      } catch {
        resultEl.textContent = "Gacha failed.";
      }
    };
    container.appendChild(el);
  });
}

window.addEventListener("profileLoaded", render);
