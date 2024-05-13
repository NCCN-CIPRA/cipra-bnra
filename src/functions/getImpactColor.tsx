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
  H: ["#ffd7cc", "#fabbaa", "#f29e89", "#e98169", "#de634a"],
  S: ["#fff4b8", "#eee097", "#ddcd76", "#cdb955", "#bca632"],
  E: ["#c9fdc9", "#aee8aa", "#95d28c", "#7cbd6d", "#64a84e"],
  F: ["#d8f2ff", "#bbdaec", "#a0c3d9", "#85acc6", "#6a96b4"],
};
