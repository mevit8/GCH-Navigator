/* =====================================================
   MODELS — registry of all decision-support modules.
   Defines display metadata for the model detail view and
   "related models" cross-links shown at the bottom of each.
   ===================================================== */
(function () {
  window.GCH = window.GCH || {};

  GCH.MODELS = {
    water: {
      name: "Water Systems",
      code: "WaterReqGCH",
      color: "var(--c-water)",
      desc: "Water supply, management, stress and allocation across regions and timesteps. Sectoral demand for energy generation, agriculture and human consumption.",
      stats: [["sectors", "6"], ["regions", "global · national"], ["horizon", "2050"], ["resolution", "watershed"]],
    },
    land: {
      name: "Land & Agri-food",
      code: "LandReqGCH",
      color: "var(--c-land)",
      desc: "Land-area calculator and agri-food systems model. Quantifies area requirements for renewables expansion (wind, solar, bioenergy) alongside crop and livestock systems.",
      stats: [["modules", "3"], ["land classes", "11"], ["horizon", "2050"], ["resolution", "0.5°"]],
    },
    energy: {
      name: "Energy & Emissions",
      code: "EnergyReqGCH",
      color: "var(--c-energy)",
      desc: "Energy-system & emissions accounting under demand and supply scenarios. Fuel-by-fuel consumption per sector and resulting GHG trajectories.",
      stats: [["fuels", "12"], ["processes", "30+"], ["horizon", "2050"], ["coupling", "LEAP"]],
    },
    economy: {
      name: "Economy & Trade",
      code: "EconomyGCH",
      color: "var(--c-econ)",
      desc: "Computable general-equilibrium model of world trade and sectoral output. Beyond-GDP accounting with ecosystem services valuation.",
      stats: [["sectors", "57"], ["regions", "141"], ["horizon", "2050"], ["coupling", "GTAP"]],
    },
    biofuel: {
      name: "Biofuels",
      code: "BiofuelGCH",
      color: "var(--c-land)",
      desc: "Feedstock yields and biofuel production potential by region. Couples crop simulation outputs with conversion-process databases.",
      stats: [["feedstocks", "9"], ["pathways", "18"], ["horizon", "2050"], ["resolution", "national"]],
    },
    scenarios: {
      name: "Scenarios & Goals",
      code: "ScenariosGCH",
      color: "var(--c-scen)",
      desc: "Library of climate scenarios, national plans and shared timelines used to drive the rest of the modelling chain.",
      stats: [["scenarios", "SSP1–5"], ["NDCs", "193"], ["horizon", "2030 · 2050"], ["sources", "IPCC · UN"]],
    },
    financing: {
      name: "Financing & Implementation",
      code: "FinancingGCH",
      color: "var(--c-fin)",
      desc: "Funding options, investment tools and ways to turn validated pathways into action — milestone-linked sovereign and concessional finance, blended capital and ecosystem services pricing.",
      stats: [["instruments", "12"], ["milestones", "ISO-aligned"], ["horizon", "2050"], ["coverage", "global"]],
    },
  };

  GCH.RELATED = {
    water:     ["land", "energy", "scenarios"],
    land:      ["water", "biofuel", "economy"],
    energy:    ["economy", "scenarios", "land"],
    economy:   ["financing", "energy", "scenarios"],
    biofuel:   ["land", "energy", "water"],
    scenarios: ["land", "water", "energy"],
    financing: ["economy", "scenarios", "land"],
  };
})();
