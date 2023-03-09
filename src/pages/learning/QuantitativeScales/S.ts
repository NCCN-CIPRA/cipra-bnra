import { DirectImpactField } from "./DI";

export const Sa: DirectImpactField = {
  prefix: "Sa",
  title: ["learning.impact.sa.title", "Sa - Supply shortfalls and unmet human needs"],
  intervals: [
    ["learning.impact.sa.0", "No impact"],
    ["learning.impact.sa.1", "< 10 000"],
    ["learning.impact.sa.2", "10 001 – 100 000"],
    ["learning.impact.sa.3", "100 001 – 1 000 000"],
    ["learning.impact.sa.4", "1 000 001 – 10 000 000"],
    ["learning.impact.sa.5", "> 10 000 000"],
  ],
  unit: ["learning.impact.sa.footer", "Unit: person days (number of people multiplied by days of unmet needs)"],
};

export const Sb: DirectImpactField = {
  prefix: "Sb",
  title: ["learning.impact.sb.title", "Sb - Diminished public order and domestic security"],
  intervals: [
    ["learning.impact.sb.0", "No impact"],
    ["learning.impact.sb.1", "< 100 000"],
    ["learning.impact.sb.2", "100 001 – 1 000 000"],
    ["learning.impact.sb.3", "1 000 001 – 1 000 000"],
    ["learning.impact.sb.4", "10 000 001 – 100 000 000"],
    ["learning.impact.sb.5", "> 100 000 000"],
  ],
  unit: ["learning.impact.sb.footer", "Unit: person days (number of people multiplied by days of impact)"],
};

export const Sc: DirectImpactField = {
  prefix: "Sc",
  title: ["learning.impact.sc.title", "Sc - Damage to the reputation of Belgium"],
  intervals: [
    ["learning.impact.sc.0", "No impact"],
    [
      "learning.impact.sc.1",
      "Damage to reputation lasting only a few days and related to issues of medium importance (e.g. negative coverage in foreign media)",
    ],
    [
      "learning.impact.sc.2",
      "Damage to reputation lasting from one up to a few weeks and related to important issues (e.g. negative coverage in foreign media)",
    ],
    [
      "learning.impact.sc.3",
      "Damage to reputation lasting several weeks and related to important issues, but with minor impact on Belgium’s standing and international cooperation",
    ],
    [
      "learning.impact.sc.4",
      "Considerable damage to reputation lasting several weeks, with impact on Belgium’s standing and international cooperation (e.g. termination of significant agreements with Belgium, expulsion of Belgian ambassador)",
    ],
    [
      "learning.impact.sc.5",
      "Lasting, severe and even irreversible loss of reputation with far reaching impact on Belgium’s standing and international cooperation (e.g. political isolation, boycotts)",
    ],
  ],
  unit: ["learning.impact.sc.footer", "Unit: qualitative according to significance and duration"],
};

export const Sd: DirectImpactField = {
  prefix: "Sd",
  title: ["learning.impact.sd.title", "Sd - Loss of confidence in or functioning of the state and/or its values"],
  intervals: [
    ["learning.impact.sd.0", "No impact"],
    [
      "learning.impact.sd.1",
      "Impairment of confidence related to issues of medium significance (e.g. very critical coverage in Belgian media), possible threat of impairment of a state function lasting only a few days.",
    ],
    [
      "learning.impact.sd.2",
      "Damage to confidence related to significant issues (e.g. extremely critical coverage in Belgian media; occasional demonstrations), partial impairment of a state function or marginal infringement of citizens' freedoms and rights  lasting for one up to a few weeks.",
    ],
    [
      "learning.impact.sd.3",
      "Damage to confidence related to significant issues (e.g. strikes, larger demonstrations), impairment of a state function or infringements of some citizens' freedoms and rights lasting for several weeks up to a few months.",
    ],
    [
      "learning.impact.sd.4",
      "Considerable damage to general confidence (e.g. extended strikes in many areas, mass demonstrations across Belgium), impairment of some state functions or partial infringements of citizens' freedoms and rights lasting several months up to a year.",
    ],
    [
      "learning.impact.sd.5",
      "Lasting, severe or even irreversible loss of general confidence (formation of local or regional groups for self-organisation of public life, up to the point of vigilante group formation), total impairment of state functions or massive and widespread infringement of citizens' freedoms and rights.",
    ],
  ],
  unit: ["learning.impact.sd.footer", "Unit: qualitative according to significance and duration"],
};
