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
    document.getElementById("iframeUrl").textContent  = m.url || ("https://apps.gch-navigator.org/" + m.code.toLowerCase());
    document.getElementById("iframeTitle").textContent = m.name + " · " + m.code;

    // Connection status pill in the model bar
    const statusEl = document.querySelector("#view-model .model-bar .right");
    if (statusEl) {
      statusEl.innerHTML = m.url
        ? '<span class="pip"></span><span>connected · streamlit runtime</span><span style="color:var(--rule-strong);">|</span><span>last sync · just now</span>'
        : '<span class="pip pip-pending"></span><span>in development · awaiting deployment</span>';
    }

    const openBtn = document.getElementById("iframeOpenBtn");
    if (openBtn) {
      if (m.url) {
        openBtn.href = m.url;
        openBtn.style.display = "";
      } else {
        openBtn.removeAttribute("href");
        openBtn.style.display = "none";
      }
    }

    // Swap iframe slot: real <iframe> if a url is wired, otherwise the placeholder.
    const frame = document.querySelector("#view-model .iframe-frame");
    if (frame) {
      const existingIframe = frame.querySelector("iframe.live-embed");
      const placeholder = frame.querySelector(".iframe-placeholder");
      if (m.url) {
        if (placeholder) placeholder.style.display = "none";
        let iframe = existingIframe;
        if (!iframe) {
          iframe = document.createElement("iframe");
          iframe.className = "live-embed";
          iframe.setAttribute("loading", "lazy");
          iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
          iframe.setAttribute("allow", "clipboard-read; clipboard-write; fullscreen");
          frame.appendChild(iframe);
        }
        iframe.style.display = "";
        iframe.title = m.name + " · " + m.code;
        if (iframe.src !== m.url) iframe.src = m.url;
      } else {
        if (existingIframe) existingIframe.style.display = "none";
        if (placeholder) placeholder.style.display = "";
      }
    }

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
    // Always start a fresh model view un-maximized
    const vm = document.getElementById("view-model");
    if (vm) vm.classList.remove("frame-maxed");
    const maxBtn = document.getElementById("iframeMaxBtn");
    if (maxBtn) {
      const lbl = maxBtn.querySelector(".lbl");
      if (lbl) lbl.textContent = "Expand";
    }
    if (r.name === "model") renderModel(r.id);
    if (r.name === "hub" && GCH.fitHub) {
      requestAnimationFrame(() => { GCH.fitHub(); requestAnimationFrame(GCH.fitHub); });
    }
  }

  // Maximize / restore toggle for the embedded app
  document.addEventListener("click", function (e) {
    const btn = e.target.closest("#iframeMaxBtn");
    if (!btn) return;
    e.preventDefault();
    const vm = document.getElementById("view-model");
    if (!vm) return;
    const maxed = vm.classList.toggle("frame-maxed");
    const lbl = btn.querySelector(".lbl");
    if (lbl) lbl.textContent = maxed ? "Restore" : "Expand";
    if (maxed) window.scrollTo({ top: 0, behavior: "instant" });
  });

  // Esc exits maximized mode
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    const vm = document.getElementById("view-model");
    if (vm && vm.classList.contains("frame-maxed")) {
      vm.classList.remove("frame-maxed");
      const lbl = document.querySelector("#iframeMaxBtn .lbl");
      if (lbl) lbl.textContent = "Expand";
    }
  });

  GCH.applyRoute = applyRoute;
  window.addEventListener("hashchange", applyRoute);
})();
