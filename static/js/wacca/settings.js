import { state } from "../mithical.js";

function render() {
  const el = document.getElementById("settings-options");
  if (!state.profile?.options) return;

  el.innerHTML = "<h3>Current option values (read-only)</h3>";
  const table = document.createElement("table");
  table.className = "data-table";
  table.innerHTML = "<thead><tr><th>Option ID</th><th>Value</th></tr></thead>";
  const tbody = document.createElement("tbody");

  Object.entries(state.profile.options).forEach(([id, value]) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${id}</td><td>${value}</td>`;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  el.appendChild(table);
}

window.addEventListener("profileLoaded", render);
