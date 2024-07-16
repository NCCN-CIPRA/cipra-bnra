export default function getImpactColor(impactPrefix: string) {
  if (impactPrefix === "Ha") return DAMAGE_INDICATOR_COLORS.Ha;
  if (impactPrefix === "Hb") return DAMAGE_INDICATOR_COLORS.Hb;
  if (impactPrefix === "Hc") return DAMAGE_INDICATOR_COLORS.Hc;
  if (impactPrefix === "H") return DAMAGE_INDICATOR_COLORS.H;

  if (impactPrefix === "Sa") return DAMAGE_INDICATOR_COLORS.Sa;
  if (impactPrefix === "Sb") return DAMAGE_INDICATOR_COLORS.Sb;
  if (impactPrefix === "Sc") return DAMAGE_INDICATOR_COLORS.Sc;
  if (impactPrefix === "Sd") return DAMAGE_INDICATOR_COLORS.Sd;
  if (impactPrefix === "S") return DAMAGE_INDICATOR_COLORS.S;

  if (impactPrefix === "Ea") return DAMAGE_INDICATOR_COLORS.Ea;
  if (impactPrefix === "E") return DAMAGE_INDICATOR_COLORS.E;

  if (impactPrefix === "Fa") return DAMAGE_INDICATOR_COLORS.Fa;
  if (impactPrefix === "Fb") return DAMAGE_INDICATOR_COLORS.Fb;
  if (impactPrefix === "F") return DAMAGE_INDICATOR_COLORS.F;
}

export const DAMAGE_INDICATOR_COLORS = {
  H: "#de6148",
  Ha: "#de6148",
  Hb: "#f39d87",
  Hc: "#ffd7cc",

  S: "#bca632",
  Sa: "#bca632",
  Sb: "#d2ba37",
  Sc: "#e8ce3d",
  Sd: "#ffe342",

  E: "#83af70",
  Ea: "#83af70",

  F: "#6996b3",
  Fa: "#6996b3",
  Fb: "#c1e7ff",
};

export const IMPACT_COLOR_SCALES = {
  H: ["rgba(0, 0, 0, 0.2)", "rgba(0, 0, 0, 0.35)", "rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.65)", "rgba(0, 0, 0, 0.8)"],
  S: [
    "rgba(255,223,28,0.2)",
    "rgba(255,223,28,0.35)",
    "rgba(255,223,28,0.5)",
    "rgba(255,223,28,0.65)",
    "rgba(255,223,28,0.8)",
  ],
  E: [
    "rgba(240, 73, 46, 0.2)",
    "rgba(240, 73, 46, 0.35)",
    "rgba(240, 73, 46, 0.5)",
    "rgba(240, 73, 46, 0.65)",
    "rgba(240, 73, 46, 0.8)",
  ],
  F: [
    "rgba(45, 117, 240, 0.2)",
    "rgba(45, 117, 240, 0.35)",
    "rgba(45, 117, 240, 0.5)",
    "rgba(45, 117, 240, 0.65)",
    "rgba(45, 117, 240, 0.8)",
  ],
};
