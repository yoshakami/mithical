import { state, apiFetch } from "../mithical.js";
import { formatRating, getIconUrl } from "./profile.js";

async function loadLeaderboards() {
  const loading = document.getElementById("leaderboards-loading");
  const error = document.getElementById("leaderboards-error");
  const table = document.getElementById("leaderboards-table");
  const body = document.getElementById("leaderboards-body");

  try {
    const data = await apiFetch(`/wacca/user/leaderboards/${state.version}`);
    loading.classList.add("hidden");
    table.classList.remove("hidden");

    body.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
      const profile = data[i];
      const rank =
        i === 0 || data[i - 1].rating !== profile.rating ? i + 1 : "=";
      const iconUrl = await getIconUrl(profile.user_icon_id);
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${rank}</td>
        <td><img class="leaderboard-icon" src="${iconUrl}" alt=""> ${profile.user_name}</td>
        <td>${formatRating(profile.rating, i >= 10)}</td>`;
      body.appendChild(tr);
    }
  } catch {
    loading.classList.add("hidden");
    error.textContent = "Couldn't reach the API. Please try again later.";
    error.classList.remove("hidden");
  }
}

window.addEventListener("profileLoaded", loadLeaderboards);
window.addEventListener("versionChanged", loadLeaderboards);
