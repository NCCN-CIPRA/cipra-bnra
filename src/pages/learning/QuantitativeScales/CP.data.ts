export type ConditionalProbabilityField = {
  prefix: string;
  title: string[];
  intervals: string[][];
  unit: string[];
  alternatives?: {
    intervals: string[][];
    name: string[];
  }[];
};

export const CP: ConditionalProbabilityField = {
  prefix: "CP",
  title: ["learning.cp.title", "CP - Conditional Probability"],
  unit: ["learning.cp.footer", "Unit: probability of cascade effect occuring"],
  intervals: [
    ["learning.cp.0", "0%"],
    ["learning.cp.1", "< 1%"],
    ["learning.cp.2", "1% – 10%"],
    ["learning.cp.3", "10% – 50%"],
    ["learning.cp.4", "50% – 90%"],
    ["learning.cp.5", "> 90%"],
  ],
};
