import { state } from "../mithical.js";
import { formatRating, getIconUrl, songTitle } from "./profile.js";

const medalDesigns = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 4, 4, 5, 5];

function renderStageUp(rank, danRank) {
  if (!rank || rank <= 0) return "";
  const design = medalDesigns[rank - 1];
  return `
    <div class="stage-up medal-${design}">
      <div class="stage-up-inner">
        <img class="stage-up-medal" src="/wacca/img/stageup/level_${design}_${danRank}.png" alt="">
        <img class="stage-up-number" src="/wacca/img/stageup/number_${rank}.png" alt="">
      </div>
    </div>`;
}

async function render() {
  const p = state.profile;
  if (!p) return;

  const versionData = p.version_data[state.version] || p.version_data[300];
  document.getElementById("profile-name").textContent = p.user_name;
  document.getElementById("profile-level").textContent = Math.floor(p.exp / 100) + 1;
  document.getElementById("profile-rp").textContent = p.points;
  document.getElementById("profile-rate").innerHTML = formatRating(versionData.rating);

  const iconId = p.options[1003] ?? 102001;
  document.getElementById("profile-icon").src = await getIconUrl(iconId);

  const navMod = await import("/assets/wacca/waccaNavigators.js");
  const navigatorId = p.options[1004] || 310001;
  const navigator = navMod.default.find((n) => n.id === navigatorId);
  if (navigator) {
    document.getElementById("waifu-bg").style.backgroundImage =
      `url(/wacca/img/navigators/${navigator.path}.png)`;
  }

  document.getElementById("stage-up").innerHTML = renderStageUp(
    versionData.rank,
    versionData.dan_rank
  );
}

window.addEventListener("profileLoaded", render);
