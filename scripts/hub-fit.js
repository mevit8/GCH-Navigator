/* =====================================================
   HUB FIT — scales the fixed-size hub stage (1240×760)
   down to whatever width the container offers.
   ===================================================== */
(function () {
  window.GCH = window.GCH || {};

  function fitHub() {
    const hubFit = document.getElementById("hubFit");
    const hubStage = document.getElementById("hubStage");
    if (!hubFit || !hubStage) return;
    const w = hubFit.clientWidth || hubFit.getBoundingClientRect().width;
    if (!w) return;
    const W = 1240, H = 760;
    const s = Math.min(1, w / W);
    hubStage.style.transform = "scale(" + s + ")";
    hubFit.style.height = (H * s) + "px";
  }

  GCH.fitHub = fitHub;

  const hubFit = document.getElementById("hubFit");
  if ("ResizeObserver" in window && hubFit) new ResizeObserver(fitHub).observe(hubFit);
  window.addEventListener("resize", fitHub);
  window.addEventListener("load", fitHub);
  requestAnimationFrame(fitHub);
})();
