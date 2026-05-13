/* =====================================================
   INTRO CAROUSEL — horizontal rail of stages with dots,
   prev/next buttons and arrow-key navigation.
   ===================================================== */
(function () {
  const rail = document.getElementById("stageRail");
  if (!rail) return;

  const stages = rail.children;
    const total = stages.length;
    let idx = 0;
    const dotsEl   = document.getElementById("dots");
    const stageNum = document.getElementById("stageNum");
    const stageTotal = document.getElementById("stageTotal");
    if (stageTotal) stageTotal.textContent = String(total).padStart(2, "0");

    function renderDots() {
      if (!dotsEl) return;
      dotsEl.innerHTML = "";
      for (let i = 0; i < total; i++) {
        const b = document.createElement("button");
        if (i === idx) b.classList.add("active");
        b.setAttribute("aria-label", "go to stage " + (i + 1));
        b.addEventListener("click", () => goTo(i));
        dotsEl.appendChild(b);
      }
    }

    function goTo(i) {
      idx = Math.max(0, Math.min(total - 1, i));
      rail.style.transform = "translateX(" + (-idx * 100) + "%)";
      if (stageNum) stageNum.textContent = String(idx + 1).padStart(2, "0");
      const prev = document.getElementById("prevBtn");
      const next = document.getElementById("nextBtn");
      if (prev) prev.disabled = idx === 0;
    if (next) next.disabled = idx === total - 1;
    if (dotsEl) [...dotsEl.children].forEach((d, i2) => d.classList.toggle("active", i2 === idx));
  }

  renderDots();
  goTo(0);
  document.getElementById("prevBtn").addEventListener("click", () => goTo(idx - 1));
  document.getElementById("nextBtn").addEventListener("click", () => goTo(idx + 1));
  document.addEventListener("keydown", (e) => {
    if (!document.getElementById("view-intro").classList.contains("active")) return;
    if (e.key === "ArrowRight") goTo(idx + 1);
    if (e.key === "ArrowLeft")  goTo(idx - 1);
  });
})();
