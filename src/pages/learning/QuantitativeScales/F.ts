import { DirectImpactField } from "./DI";

export const Fa: DirectImpactField = {
  prefix: "Fa",
  title: ["learning.impact.fa.title", "Fa - Financial asset damages"],
  intervals: [
    ["learning.impact.fa.0", "No impact"],
    ["learning.impact.fa.1", "≤ 50 million"],
    ["learning.impact.fa.2", "50 – 500 million"],
    ["learning.impact.fa.3", "0.5 – 5 billion"],
    ["learning.impact.fa.4", "5 – 50 billion"],
    ["learning.impact.fa.5", "> 50 billion"],
  ],
  unit: ["learning.impact.fa.footer", "Unit: EURO"],
};

export const Fb: DirectImpactField = {
  prefix: "Fb",
  title: ["learning.impact.fb.title", "Fb - Reduction of economic performance"],
  intervals: [
    ["learning.impact.fb.a.0", "No Impact"],
    ["learning.impact.fb.a.1", "≤ 50 million"],
    ["learning.impact.fb.a.2", "50 - 500 million"],
    ["learning.impact.fb.a.3", "0.5 - 5 billion"],
    ["learning.impact.fb.a.4", "5 - 50 billion"],
    ["learning.impact.fb.a.5", "> 50 billion"],
  ],
  unit: ["learning.impact.fb.footer", "Unit: EURO"],
  alternatives: [
    {
      name: ["learning.impact.fb.b.name", "Governmental debt (% of GDP, basis of 115%)"],
      intervals: [
        ["learning.impact.fb.b.0", "No Impact"],
        ["learning.impact.fb.b.1", "+ <1%"],
        ["learning.impact.fb.b.2", "+ 1-3%"],
        ["learning.impact.fb.b.3", "+ 3-7%"],
        ["learning.impact.fb.b.4", "+ 7-10%"],
        ["learning.impact.fb.b.5", "+ >10%"],
      ],
    },
    {
      name: ["learning.impact.fb.c.name", "Growth of unemployment"],
      intervals: [
        ["learning.impact.fb.c.0", "No Impact"],
        ["learning.impact.fb.c.1", "<5%"],
        ["learning.impact.fb.c.2", "5-10%"],
        ["learning.impact.fb.c.3", "10-30%"],
        ["learning.impact.fb.c.4", "30-70%"],
        ["learning.impact.fb.c.5", "> 70%"],
      ],
    },
    {
      name: ["learning.impact.fb.d.name", "GDP Growth"],
      intervals: [
        ["learning.impact.fb.d.0", "No Impact"],
        ["learning.impact.fb.d.1", "2%"],
        ["learning.impact.fb.d.2", "0-2%"],
        ["learning.impact.fb.d.3", "(-2) – 0%"],
        ["learning.impact.fb.d.4", "(-10) – (-2)%"],
        ["learning.impact.fb.d.5", "< (-10)%"],
      ],
    },
    {
      name: ["learning.impact.fb.e.name", "Inflation (basis of 2%)"],
      intervals: [
        ["learning.impact.fb.e.0", "No Impact"],
        ["learning.impact.fb.e.1", "Δ 1%"],
        ["learning.impact.fb.e.2", "Δ 3%"],
        ["learning.impact.fb.e.3", "Δ 5%"],
        ["learning.impact.fb.e.4", "Δ 10%"],
        ["learning.impact.fb.e.5", "Δ >10%"],
      ],
    },
    {
      name: ["learning.impact.fb.f.name", "Consumer confidence (basis of -5)"],
      intervals: [
        ["learning.impact.fb.f.0", "No Impact"],
        ["learning.impact.fb.f.1", "-1"],
        ["learning.impact.fb.f.2", "-5"],
        ["learning.impact.fb.f.3", "-10"],
        ["learning.impact.fb.f.4", "-25"],
        ["learning.impact.fb.f.5", ">-25"],
      ],
    },
  ],
};
