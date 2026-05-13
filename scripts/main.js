/* =====================================================
   MAIN — page bootstrap. Locks the theme to SDSN, clears
   any legacy saved theme, and kicks off the router.
   ===================================================== */
(function () {
  /* theme is locked to SDSN; clear any legacy saved selection */
  try { localStorage.removeItem("dsn-theme"); } catch (e) {}
  document.body.setAttribute("data-theme", "sdsn");

  if (!location.hash) location.hash = "#/intro";
  if (window.GCH && GCH.applyRoute) GCH.applyRoute();
})();
