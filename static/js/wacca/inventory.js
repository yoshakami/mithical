import { state } from "../mithical.js";

let activeTab = "navigators";
let showUnowned = false;

const dataLoaders = {
  navigators: () => import("/assets/wacca/waccaNavigators.js"),
  icons: () => import("/assets/wacca/waccaIcons.js"),
  titles: () => import("/assets/wacca/waccaTitles.js"),
};

function ownedIds(kind) {
  return (state.profile.items || [])
    .filter((item) => item.kind === kind)
    .map((item) => item.id);
}

async function render() {
  const grid = document.getElementById("inventory-grid");
  grid.innerHTML = "";

  const loader = dataLoaders[activeTab];
  if (!loader) return;
  const mod = await loader();
  const items = mod.default;
  const owned = new Set(ownedIds(getKindId(activeTab)));

  items.forEach((item) => {
    if (!showUnowned && !owned.has(item.id)) return;
    const cell = document.createElement("div");
    cell.className = "card";
    cell.style.opacity = owned.has(item.id) ? "1" : "0.4";
    const imgPath = getImagePath(activeTab, item);
    cell.innerHTML = `
      <div class="card-body" style="text-align:center;padding:8px">
        ${imgPath ? `<img src="${imgPath}" alt="" style="max-width:100%;height:80px;object-fit:contain">` : ""}
        <div style="font-size:0.75rem;margin-top:4px">${item.name || item.path || item.id}</div>
      </div>`;
    grid.appendChild(cell);
  });
}

function getKindId(tab) {
  return { navigators: 1, icons: 2, titles: 3 }[tab] ?? 1;
}

function getImagePath(tab, item) {
  if (tab === "navigators") return `/wacca/img/navigators/${item.path}.png`;
  if (tab === "icons") return `/wacca/img/icons/${item.path}.png`;
  return null;
}

document.getElementById("inventory-tab")?.querySelectorAll("button").forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll("#inventory-tab button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeTab = btn.dataset.value;
    render();
  };
});

document.getElementById("show-unowned")?.addEventListener("change", (e) => {
  showUnowned = e.target.checked;
  render();
});

window.addEventListener("profileLoaded", render);
