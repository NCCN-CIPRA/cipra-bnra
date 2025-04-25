export const M = {
  prefix: "M",
  title: ["learning.motivation.title", "M - Motivation"],
  intervals: [
    ["learning.motivation.rp.1", "< 1%"],
    ["learning.motivation.rp.2", "1% – 50%"],
    ["learning.motivation.rp.3", "50% – 90%"],
    ["learning.motivation.rp.4", "90% – 100%"],
  ],
  unit: [
    "learning.motivation.footer",
    "Unit: Probability of an attempted malicious action in the next 3 years",
  ],
  alternatives: [
    {
      intervals: [
        [
          "learning.motivation.q.1",
          "No indicators of motivation or action attempts",
        ],
        [
          "learning.motivation.q.2",
          "Few indicators of motivation or action attempts",
        ],
        [
          "learning.motivation.q.3",
          "Many indicators of motivation or action attempts",
        ],
        [
          "learning.motivation.q.4",
          "Proven motivation, attempted action is imminent",
        ],
      ],
      name: ["learning.motivation.alt.title", "Qualitative description"],
    },
  ],
};
