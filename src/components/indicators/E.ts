import { DirectImpactField } from "../../pages/learning/QuantitativeScales/DI";

export const Ea: DirectImpactField = {
  prefix: "Ea",
  title: ["learning.impact.ea.title", "Ea - Damaged ecosystems"],
  intervals: [
    ["learning.impact.ea.0", "No impact"],
    ["learning.impact.ea.1", "< 10"],
    ["learning.impact.ea.2", "11 – 100"],
    ["learning.impact.ea.3", "101 – 1 000"],
    ["learning.impact.ea.4", "1 001 – 10 000"],
    ["learning.impact.ea.5", "> 10 000"],
  ],
  unit: [
    "learning.impact.ea.footer",
    "Unit: affected area multiplied by number of years of adverse effects (km² x years)",
  ],
};
