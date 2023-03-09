import { DirectImpactField } from "./DI";

export const Ha: DirectImpactField = {
  prefix: "Ha",
  title: ["learning.impact.ha.title", "Ha - Fatalities"],
  unit: ["learning.impact.ha.footer", "Unit: number of people deceased"],
  intervals: [
    ["learning.impact.ha.0", "No impact"],
    ["learning.impact.ha.1", "< 10"],
    ["learning.impact.ha.2", "11 – 100"],
    ["learning.impact.ha.3", "101 – 1 000"],
    ["learning.impact.ha.4", "1 001 – 10 000"],
    ["learning.impact.ha.5", "> 10 000"],
  ],
};

export const Hb: DirectImpactField = {
  prefix: "Hb",
  title: ["learning.impact.hb.title", "Hb - Injured / sick people"],
  unit: ["learning.impact.hb.footer", "Unit: number of sick/injured people"],
  intervals: [
    ["learning.impact.hb.0", "No impact"],
    ["learning.impact.hb.1", "< 100"],
    ["learning.impact.hb.2", "100 – 1 000"],
    ["learning.impact.hb.3", "1 001 – 10 000"],
    ["learning.impact.hb.4", "10 001 – 100 000"],
    ["learning.impact.hb.5", "> 100 000"],
  ],
};

export const Hc: DirectImpactField = {
  prefix: "Hc",
  title: ["learning.impact.hc.title", "Hc - People in need of assistance"],
  unit: ["learning.impact.hc.footer", "Unit: person days (number of people multiplied by days in need of assistance)"],
  intervals: [
    ["learning.impact.hc.0", "No impact"],
    ["learning.impact.hc.1", "< 200 000"],
    ["learning.impact.hc.2", "200 001 – 2 000 000"],
    ["learning.impact.hc.3", "2 000 001 – 20 000 000"],
    ["learning.impact.hc.4", "20 000 001 – 200 000 000"],
    ["learning.impact.hc.5", "> 200 000 000"],
  ],
};
