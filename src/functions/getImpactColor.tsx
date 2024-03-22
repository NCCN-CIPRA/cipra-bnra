export default function getImpactColor(impactPrefix: string) {
  if (impactPrefix === "Ha") return "#de6148";
  if (impactPrefix === "Hb") return "#f39d87";
  if (impactPrefix === "Hc") return "#ffd7cc";
  if (impactPrefix === "H") return "#de6148";

  if (impactPrefix === "Sa") return "#bca632";
  if (impactPrefix === "Sb") return "#d2ba37";
  if (impactPrefix === "Sc") return "#e8ce3d";
  if (impactPrefix === "Sd") return "#ffe342";
  if (impactPrefix === "S") return "#bca632";

  if (impactPrefix === "Ea") return "#83af70";
  if (impactPrefix === "E") return "#83af70";

  if (impactPrefix === "Fa") return "#6996b3";
  if (impactPrefix === "Fb") return "#c1e7ff";
  if (impactPrefix === "F") return "#6996b3";
}
