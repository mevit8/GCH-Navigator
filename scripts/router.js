/* =====================================================
   ROUTER — hash-based view switching (intro / hub / model)
   Reads model metadata from GCH.MODELS / GCH.RELATED.
   ===================================================== */
(function () {
  window.GCH = window.GCH || {};

  function parseRoute() {
    const h = location.hash.replace(/^#/, "") || "/hub";
    const parts = h.split("/").filter(Boolean);
    if (parts.length === 0) return { name: "hub" };
    if (parts[0] === "intro") return { name: "intro" };
    if (parts[0] === "hub")   return { name: "hub" };
    if (parts[0] === "model" && parts[1]) return { name: "model", id: parts[1] };
    return { name: "hub" };
  }

  function setActiveView(name) {
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    const map = { intro: "view-intro", hub: "view-hub", model: "view-model" };
    const el = document.getElementById(map[name]);
    if (el) el.classList.add("active");
    document.querySelectorAll(".top-nav a.route-link").forEach(a => {
      const r = a.dataset.route;
      a.classList.toggle("active", r === name || (name === "model" && r === "hub"));
    });
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function renderModel(id) {
    const m = GCH.MODELS[id];
    if (!m) { location.hash = "#/hub"; return; }
    document.getElementById("modelTitle").textContent = m.name;
    document.getElementById("modelCode").textContent  = m.code;
    document.getElementById("modelHeading").textContent = m.name;
    document.getElementById("modelDesc").textContent  = m.desc;
    document.getElementById("modelSwatch").style.background = m.color;
    document.getElementById("iframeUrl").textContent  = "https://apps.gch-navigator.org/" + m.code.toLowerCase();
    document.getElementById("iframeTitle").textContent = m.name + " · " + m.code;
    document.getElementById("iframeStub").textContent = "/apps/" + id;

    const statsEl = document.getElementById("modelStats");
    statsEl.innerHTML = "";
    m.stats.forEach(([k, v]) => {
      const d = document.createElement("div");
      d.className = "stat";
      d.innerHTML = '<div class="label">' + k + '</div><div class="value">' + v + '</div>';
      statsEl.appendChild(d);
    });

    const rel = document.getElementById("relatedChips");
    rel.innerHTML = "";
    (GCH.RELATED[id] || []).forEach(rid => {
      const rm = GCH.MODELS[rid];
      const a = document.createElement("a");
      a.href = "#/model/" + rid;
      a.className = "route-link related-chip";
      a.innerHTML = '<span class="swatch" style="background:' + rm.color + '"></span>' + rm.name + ' <span style="color:var(--muted); margin-left:6px; font-family:var(--mono); font-size: 11px;">' + rm.code + '</span>';
      rel.appendChild(a);
    });

    // Update CSS var on this view scope so iframe accents follow color
    document.getElementById("view-model").style.setProperty("--acc", m.color);
  }

  function applyRoute() {
    const r = parseRoute();
    setActiveView(r.name);
    if (r.name === "model") renderModel(r.id);
    if (r.name === "hub" && GCH.fitHub) {
      requestAnimationFrame(() => { GCH.fitHub(); requestAnimationFrame(GCH.fitHub); });
    }
  }

  GCH.applyRoute = applyRoute;
  window.addEventListener("hashchange", applyRoute);
})();
