/* =====================================================
   TWEAKS PANEL — vanilla, follows host edit-mode protocol.
   Exposed knobs: bubble scale, hub canvas width, wire/center
   visibility, biofuel visibility, intro stage padding.
   ===================================================== */
(function () {
  window.GCH = window.GCH || {};

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "bubbleScale": 1,
    "hubWidth": 1440,
    "showWires": true,
    "showCenter": true,
    "stagePad": 52
  }/*EDITMODE-END*/;

  const tweaks = Object.assign({}, TWEAK_DEFAULTS);

  const panel = document.getElementById("tweaksPanel");
  if (panel) {

    function applyTweaks() {
      // bubble scale
      document.querySelectorAll(".bubble").forEach(el => {
        el.style.transformOrigin = "center";
      });
      document.documentElement.style.setProperty("--bubble-scale", tweaks.bubbleScale);

      // hub width
      const stage = document.getElementById("hubStage");
      if (stage) {
        stage.style.width = tweaks.hubWidth + "px";
        if (GCH.fitHub) GCH.fitHub();
      }

      // wires
      document.querySelectorAll(".hub-stage svg.wires").forEach(el => {
        el.style.display = tweaks.showWires ? "" : "none";
      });

      // center hub
      const ctr = document.querySelector(".center-hub");
      if (ctr) ctr.style.display = tweaks.showCenter ? "" : "none";

      // stage pad
      document.querySelectorAll(".stage").forEach(el => {
        el.style.paddingTop = tweaks.stagePad + "px";
        el.style.paddingBottom = tweaks.stagePad + "px";
      });

      // form values
      document.getElementById("tkBubble").value = tweaks.bubbleScale;
      document.getElementById("valBubble").textContent = Math.round(tweaks.bubbleScale * 100) + "%";
      document.getElementById("tkWidth").value = tweaks.hubWidth;
      document.getElementById("valWidth").textContent = tweaks.hubWidth + "px";
      document.getElementById("tkWires").checked = tweaks.showWires;
      document.getElementById("tkCenter").checked = tweaks.showCenter;
      document.getElementById("tkPad").value = tweaks.stagePad;
      document.getElementById("valPad").textContent = tweaks.stagePad + "px";
    }

    function setTweak(key, value) {
      tweaks[key] = value;
      applyTweaks();
      try {
        window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [key]: value } }, "*");
      } catch (e) {}
    }

    // Bubble-scale rule needs to override the static base rule (which has
    // higher specificity from being declared with .bubble {transform...}).
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      .bubble { transform: translate(-50%, -50%) scale(var(--bubble-scale, 1)); }
      .bubble:hover { transform: translate(-50%, -50%) scale(calc(var(--bubble-scale, 1) * 1.03)) translateY(-4px); }
      .pill { transform: translate(-50%, -50%) scale(var(--bubble-scale, 1)); }
      .pill:hover { transform: translate(-50%, -50%) scale(calc(var(--bubble-scale, 1) * 1.02)) translateY(-3px); }
    `;
    document.head.appendChild(styleEl);

    // Wire up controls
    document.getElementById("tkBubble").addEventListener("input", e => setTweak("bubbleScale", parseFloat(e.target.value)));
    document.getElementById("tkWidth").addEventListener("input", e => setTweak("hubWidth", parseInt(e.target.value, 10)));
    document.getElementById("tkWires").addEventListener("change", e => setTweak("showWires", e.target.checked));
    document.getElementById("tkCenter").addEventListener("change", e => setTweak("showCenter", e.target.checked));
    document.getElementById("tkPad").addEventListener("input", e => setTweak("stagePad", parseInt(e.target.value, 10)));

    document.getElementById("tweaksClose").addEventListener("click", () => {
      panel.classList.remove("open");
      try { window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); } catch (e) {}
    });

    // Edit-mode protocol: listen first, then announce.
    window.addEventListener("message", (ev) => {
      const d = ev.data || {};
      if (d.type === "__activate_edit_mode") panel.classList.add("open");
      if (d.type === "__deactivate_edit_mode") panel.classList.remove("open");
    });
    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch (e) {}

    applyTweaks();
  }
})();
