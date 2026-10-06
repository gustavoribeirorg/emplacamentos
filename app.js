/* ============================================================
   Emplacamento de Veículos × Presidentes do Brasil
   Lógica da aplicação — JavaScript puro (ES2020+)
   Versão: 5.0 — dados EMBUTIDOS (não usa fetch/data.json)
   ============================================================ */

console.log("[app.js] versão 5.0 — dados embutidos, sem fetch");

/* ------------------------------------------------------------
   DADOS EMBUTIDOS
   (espelham exatamente o conteúdo de data.json; assim o site
   funciona via file:// sem servidor e sem risco de CORS)
   ------------------------------------------------------------ */
const DATA = {
  anos: [
    { ano: 1985, emplacamentos: 603623, presidenteId: "sarney" },
    { ano: 1986, emplacamentos: 675353, presidenteId: "sarney" },
    { ano: 1987, emplacamentos: 413438, presidenteId: "sarney" },
    { ano: 1988, emplacamentos: 559542, presidenteId: "sarney" },
    { ano: 1989, emplacamentos: 569231, presidenteId: "sarney" },
    { ano: 1990, emplacamentos: 534769, presidenteId: "collor" },
    { ano: 1991, emplacamentos: 604510, presidenteId: "collor" },
    { ano: 1992, emplacamentos: 600189, presidenteId: "itamar" },
    { ano: 1993, emplacamentos: 910605, presidenteId: "itamar" },
    { ano: 1994, emplacamentos: 1135001, presidenteId: "itamar" },
    { ano: 1995, emplacamentos: 1415542, presidenteId: "fhc" },
    { ano: 1996, emplacamentos: 1428509, presidenteId: "fhc" },
    { ano: 1997, emplacamentos: 1605214, presidenteId: "fhc" },
    { ano: 1998, emplacamentos: 1246064, presidenteId: "fhc" },
    { ano: 1999, emplacamentos: 1036202, presidenteId: "fhc" },
    { ano: 2000, emplacamentos: 1205070, presidenteId: "fhc" },
    { ano: 2001, emplacamentos: 1318232, presidenteId: "fhc" },
    { ano: 2002, emplacamentos: 1243467, presidenteId: "fhc" },
    { ano: 2003, emplacamentos: 1215549, presidenteId: "lula1" },
    { ano: 2004, emplacamentos: 1315358, presidenteId: "lula1" },
    { ano: 2005, emplacamentos: 1439822, presidenteId: "lula1" },
    { ano: 2006, emplacamentos: 1632947, presidenteId: "lula1" },
    { ano: 2007, emplacamentos: 2085706, presidenteId: "lula1" },
    { ano: 2008, emplacamentos: 2341304, presidenteId: "lula1" },
    { ano: 2009, emplacamentos: 2643862, presidenteId: "lula1" },
    { ano: 2010, emplacamentos: 2856540, presidenteId: "lula1" },
    { ano: 2011, emplacamentos: 2901647, presidenteId: "dilma" },
    { ano: 2012, emplacamentos: 3115223, presidenteId: "dilma" },
    { ano: 2013, emplacamentos: 3040783, presidenteId: "dilma" },
    { ano: 2014, emplacamentos: 2794687, presidenteId: "dilma" },
    { ano: 2015, emplacamentos: 2123009, presidenteId: "dilma" },
    { ano: 2016, emplacamentos: 1688288, presidenteId: "temer" },
    { ano: 2017, emplacamentos: 1856586, presidenteId: "temer" },
    { ano: 2018, emplacamentos: 2102114, presidenteId: "temer" },
    { ano: 2019, emplacamentos: 2262073, presidenteId: "bolsonaro" },
    { ano: 2020, emplacamentos: 1615942, presidenteId: "bolsonaro" },
    { ano: 2021, emplacamentos: 1558467, presidenteId: "bolsonaro" },
    { ano: 2022, emplacamentos: 1576662, presidenteId: "bolsonaro" },
    { ano: 2023, emplacamentos: 1721415, presidenteId: "lula2" },
    { ano: 2024, emplacamentos: 1948681, presidenteId: "lula2" },
    { ano: 2025, emplacamentos: 1997264, presidenteId: "lula2" },
  ],
  presidentes: [
    { id: "sarney",    nome: "José Sarney",                posse: 1985, destituicao: 1990 },
    { id: "collor",    nome: "Fernando Collor",            posse: 1990, destituicao: 1992 },
    { id: "itamar",    nome: "Itamar Franco",              posse: 1992, destituicao: 1995 },
    { id: "fhc",       nome: "Fernando Henrique Cardoso",  posse: 1995, destituicao: 2003 },
    { id: "lula1",     nome: "Luiz Inácio Lula da Silva (2003–2011)", posse: 2003, destituicao: 2011 },
    { id: "dilma",     nome: "Dilma Rousseff",             posse: 2011, destituicao: 2016 },
    { id: "temer",     nome: "Michel Temer",               posse: 2016, destituicao: 2019 },
    { id: "bolsonaro", nome: "Jair Bolsonaro",             posse: 2019, destituicao: 2023 },
    { id: "lula2",     nome: "Luiz Inácio Lula da Silva (2023–2027)", posse: 2023, destituicao: 2027 },
  ],
};

const PRESIDENT_COLORS = [
  "#2fb8ec", "#d91016", "#05053c", "#7a5cff", "#0a9d6e",
  "#e08a00", "#c2185b", "#00838f", "#5d4037",
];

let colorMap = {};

const state = {
  anos: [],
  presidentes: [],
  selectedIds: new Set(),
  activeId: null,
  compareMode: false,
};

/* ---------- Utilidades ---------- */

const fmt = new Intl.NumberFormat("pt-BR");

function fmtCompact(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(".", ",") + " mi";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(".", ",") + " mil";
  return fmt.format(n);
}

function sumAnos(anos) {
  return anos.reduce((acc, a) => acc + a.emplacamentos, 0);
}

function anosDoPresidente(id) {
  return state.anos.filter((a) => a.presidenteId === id);
}

function totalDoPresidente(id) {
  return sumAnos(anosDoPresidente(id));
}

function mediaAnualDoPresidente(id) {
  const anos = anosDoPresidente(id);
  return anos.length ? sumAnos(anos) / anos.length : 0;
}

function getPresidente(id) {
  return state.presidentes.find((p) => p.id === id);
}

function corDoPresidente(id) {
  return colorMap[id] || "#2fb8ec";
}

function buildColorMap() {
  colorMap = {};
  state.presidentes.forEach((p, i) => {
    colorMap[p.id] = PRESIDENT_COLORS[i % PRESIDENT_COLORS.length];
  });
}

/* ---------- Carregamento (sem fetch) ---------- */

function loadData() {
  state.anos = DATA.anos;
  state.presidentes = DATA.presidentes;
  buildColorMap();
}

/* ---------- Lista de presidentes ---------- */

function renderPresidentList() {
  const ul = document.getElementById("president-list");
  ul.innerHTML = "";

  state.presidentes.forEach((p) => {
    const total = totalDoPresidente(p.id);
    const media = mediaAnualDoPresidente(p.id);
    const li = document.createElement("li");
    li.className = "president-item";
    li.dataset.id = p.id;
    li.style.setProperty("--p-color", corDoPresidente(p.id));
    li.setAttribute("role", "button");
    li.setAttribute("tabindex", "0");
    li.setAttribute("aria-pressed", "false");

    li.innerHTML = `
      <span class="p-name">
        <span class="p-dot" style="background:${corDoPresidente(p.id)}"></span>${p.nome}
      </span>
      <span class="p-years">${p.posse} – ${p.destituicao}</span>
      <span class="p-total">${fmtCompact(total)} total · ${fmtCompact(Math.round(media))}/ano</span>
    `;

    const activate = () => handlePresidentClick(p.id);
    li.addEventListener("click", activate);
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });

    ul.appendChild(li);
  });

  syncListVisualState();
}

function syncListVisualState() {
  document.querySelectorAll(".president-item").forEach((li) => {
    const id = li.dataset.id;
    li.classList.toggle("active", state.activeId === id);
    li.classList.toggle("checked", state.selectedIds.has(id));
    li.setAttribute(
      "aria-pressed",
      String(state.activeId === id || state.selectedIds.has(id))
    );
  });
}

/* ---------- Interação ---------- */

function handlePresidentClick(id) {
  if (state.compareMode) {
    if (state.selectedIds.has(id)) state.selectedIds.delete(id);
    else state.selectedIds.add(id);
  } else {
    state.activeId = state.activeId === id ? null : id;
    state.selectedIds.clear();
  }
  syncListVisualState();
  renderChart();
  renderComparison();
}

function clearSelection() {
  state.activeId = null;
  state.selectedIds.clear();
  syncListVisualState();
  renderChart();
  renderComparison();
}

/* ---------- Gráfico ---------- */

function renderChart() {
  const chartEl = document.getElementById("chart");
  const titleEl = document.getElementById("chart-title");
  const subtitleEl = document.getElementById("chart-subtitle");
  const statEl = document.getElementById("stat-total");
  const legendEl = document.getElementById("legend");

  const emComparacao = state.compareMode && state.selectedIds.size > 0;
  let highlightIds = new Set();
  let anosVisiveis = state.anos;

  if (emComparacao) {
    highlightIds = new Set(state.selectedIds);
    anosVisiveis = state.anos; // série completa, com destaque
  } else if (state.activeId) {
    highlightIds = new Set([state.activeId]);
    anosVisiveis = state.anos.filter((a) => a.presidenteId === state.activeId);
  }

  if (emComparacao) {
    const nomes = [...highlightIds].map((id) => getPresidente(id)?.nome ?? id);
    titleEl.textContent = `Comparação: ${nomes.length} presidente(s)`;
    subtitleEl.textContent = nomes.join(" · ");
  } else if (state.activeId) {
    const p = getPresidente(state.activeId);
    titleEl.textContent = p.nome;
    subtitleEl.textContent = `Mandato ${p.posse}–${p.destituicao} · ${anosVisiveis.length} ano(s)`;
  } else {
    titleEl.textContent = "Todos os anos (1985–2025)";
    subtitleEl.textContent = "Total geral de emplacamentos no período completo.";
  }

  const anosDestaque = highlightIds.size
    ? state.anos.filter((a) => highlightIds.has(a.presidenteId))
    : state.anos;
  const total = sumAnos(anosDestaque);
  statEl.querySelector(".stat-value").textContent = fmt.format(total);

  chartEl.innerHTML = "";
  if (anosVisiveis.length === 0) {
    chartEl.innerHTML = `<p class="hint" style="margin:auto">Nenhum ano no filtro.</p>`;
    legendEl.innerHTML = "";
    return;
  }

  const max = Math.max(...anosVisiveis.map((a) => a.emplacamentos));
  const CHART_HEIGHT = 340;

  anosVisiveis.forEach((a) => {
    const alturaPx = Math.max(4, Math.round((a.emplacamentos / max) * CHART_HEIGHT));
    const wrap = document.createElement("div");
    wrap.className = "bar-wrap";
    wrap.title = `${a.ano}: ${fmt.format(a.emplacamentos)} veículos`;

    const bar = document.createElement("div");
    bar.className = "bar";

    if (emComparacao) {
      if (highlightIds.has(a.presidenteId)) {
        bar.style.background = corDoPresidente(a.presidenteId);
      } else {
        bar.classList.add("other-president");
      }
    } else if (highlightIds.size === 1) {
      bar.style.background = corDoPresidente([...highlightIds][0]);
    }

    bar.style.height = alturaPx + "px";

    const val = document.createElement("span");
    val.className = "bar-value";
    val.textContent = fmtCompact(a.emplacamentos);

    const lbl = document.createElement("span");
    lbl.className = "bar-label";
    lbl.textContent = a.ano;

    wrap.appendChild(val);
    wrap.appendChild(bar);
    wrap.appendChild(lbl);
    chartEl.appendChild(wrap);
  });

  renderLegend(highlightIds, emComparacao);
}

/* ---------- Legenda ---------- */

function renderLegend(highlightIds, emComparacao) {
  const legendEl = document.getElementById("legend");
  legendEl.innerHTML = "";

  const addItem = (color, label) => {
    const item = document.createElement("span");
    item.className = "legend-item";
    item.innerHTML = `<span class="legend-swatch" style="background:${color}"></span>${label}`;
    legendEl.appendChild(item);
  };

  if (emComparacao) {
    highlightIds.forEach((id) => {
      const p = getPresidente(id);
      addItem(corDoPresidente(id), p ? p.nome : id);
    });
    addItem("#c9d6e8", "Demais anos");
  } else if (highlightIds.size === 1) {
    addItem(corDoPresidente([...highlightIds][0]), "Anos do mandato");
  } else {
    addItem("#2fb8ec", "Emplacamentos por ano");
  }
}

/* ---------- Comparação ---------- */

function renderComparison() {
  const emptyEl = document.getElementById("compare-empty");
  const resultEl = document.getElementById("compare-result");
  const countEl = document.getElementById("compare-count");

  if (state.selectedIds.size < 2) {
    emptyEl.hidden = false;
    resultEl.hidden = true;
    resultEl.innerHTML = "";
    countEl.textContent = "";
    return;
  }

  emptyEl.hidden = true;
  resultEl.hidden = false;

  const rows = [...state.selectedIds]
    .map((id) => {
      const p = getPresidente(id);
      const anos = anosDoPresidente(id);
      const total = sumAnos(anos);
      return {
        id,
        nome: p ? p.nome : id,
        anosRange: p ? `${p.posse}–${p.destituicao}` : "",
        nAnos: anos.length,
        total,
        media: anos.length ? total / anos.length : 0,
        cor: corDoPresidente(id),
      };
    })
    .sort((a, b) => b.total - a.total);

  const maxTotal = rows[0].total;
  const winner = rows[0];
  const melhorMedia = rows.reduce(
    (best, r) => (r.media > best.media ? r : best),
    rows[0]
  );

  countEl.textContent = `${rows.length} selecionados`;

  let html = `
    <div class="compare-table">
      <div class="compare-table-head">
        <span>Presidente</span>
        <span>Total no mandato</span>
        <span>Média anual</span>
      </div>
  `;

  rows.forEach((r, idx) => {
    const pctTotal = maxTotal > 0 ? (r.total / maxTotal) * 100 : 0;
    const isWinnerTotal = idx === 0;
    const isBestMedia = r.id === melhorMedia.id;

    html += `
      <div class="compare-row ${isWinnerTotal ? "is-winner" : ""}"
           style="--row-color:${r.cor}">
        <span class="compare-name">
          ${r.nome}
          <small>${r.anosRange} · ${r.nAnos} ano(s)</small>
        </span>
        <span class="compare-metric">
          <span class="compare-bar-track">
            <span class="compare-bar-fill" style="width:${pctTotal.toFixed(1)}%"></span>
          </span>
          <span class="compare-total">${fmt.format(r.total)}</span>
        </span>
        <span class="compare-media ${isBestMedia ? "is-best-media" : ""}">
          ${fmt.format(Math.round(r.media))}
          ${isBestMedia ? '<span class="media-badge">melhor média</span>' : ""}
        </span>
      </div>
    `;
  });

  html += `</div>`;
  resultEl.innerHTML = html;

  const note = document.createElement("p");
  note.className = "compare-note";
  note.innerHTML = `
    Maior <strong>volume total</strong>: <strong>${winner.nome}</strong>
    (${fmt.format(winner.total)} veículos).
    ${melhorMedia.id !== winner.id
      ? `Maior <strong>média anual</strong>: <strong>${melhorMedia.nome}</strong>
         (${fmt.format(Math.round(melhorMedia.media))} veículos/ano).`
      : `Também tem a maior média anual
         (${fmt.format(Math.round(melhorMedia.media))} veículos/ano).`
    }
  `;
  resultEl.appendChild(note);
}

/* ---------- Toggle ---------- */

function setupCompareToggle() {
  const toggle = document.getElementById("toggle-compare");
  toggle.addEventListener("change", () => {
    state.compareMode = toggle.checked;
    if (state.compareMode) {
      if (state.activeId) {
        state.selectedIds.add(state.activeId);
        state.activeId = null;
      }
    } else {
      const first = [...state.selectedIds][0] ?? null;
      state.activeId = first;
      state.selectedIds.clear();
    }
    syncListVisualState();
    renderChart();
    renderComparison();
  });
}

/* ---------- Init ---------- */

function init() {
  loadData();
  renderPresidentList();
  renderChart();
  renderComparison();
  setupCompareToggle();

  document.getElementById("btn-clear").addEventListener("click", clearSelection);
}

document.addEventListener("DOMContentLoaded", init);
