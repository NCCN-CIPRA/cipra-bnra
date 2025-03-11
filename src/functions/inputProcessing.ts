import {
  CASCADE_ANALYSIS_QUANTI_FIELDS,
  DVCascadeAnalysis,
} from "../types/dataverse/DVCascadeAnalysis";
import { DVContact } from "../types/dataverse/DVContact";
import {
  DIRECT_ANALYSIS_QUANTI_FIELDS,
  DVDirectAnalysis,
  FieldQuality,
} from "../types/dataverse/DVDirectAnalysis";
import { DVParticipation } from "../types/dataverse/DVParticipation";
import { DVRiskCascade } from "../types/dataverse/DVRiskCascade";
import { DVRiskFile, RISK_TYPE } from "../types/dataverse/DVRiskFile";
import { SmallRisk } from "../types/dataverse/DVSmallRisk";
import { SCENARIOS, SCENARIO_PARAMS } from "./scenarios";

interface DIRECT_ANALYSIS_SECTION {
  name: string;
  label: string;
}

export interface STATS {
  min: number;
  minLabel: string;
  max: number;
  maxLabel: string;
  avg: number;
  avgLabel: string;
  std: number;
}

export enum PARAMETER {
  DP,
  DP2050,
  H,
  S,
  E,
  F,
  CB,
}

export const DIRECT_ANALYSIS_SECTIONS_STANDARD: {
  [key in PARAMETER]: DIRECT_ANALYSIS_SECTION;
} = {
  [PARAMETER.DP]: {
    name: "dp",
    label: "Direct Probability",
  },
  [PARAMETER.DP2050]: {
    name: "dp50",
    label: "Direct Probability 2050",
  },
  [PARAMETER.H]: {
    name: "h",
    label: "Direct Human Impact",
  },
  [PARAMETER.S]: {
    name: "s",
    label: "Direct Societal Impact",
  },
  [PARAMETER.E]: {
    name: "e",
    label: "Direct Environmental Impact",
  },
  [PARAMETER.F]: {
    name: "f",
    label: "Direct Financial Impact",
  },
  [PARAMETER.CB]: {
    name: "cb",
    label: "Cross-border Effects",
  },
};

export const DIRECT_ANALYSIS_SECTIONS_MANMADE: {
  [PARAMETER.DP]: DIRECT_ANALYSIS_SECTION;
} = {
  [PARAMETER.DP]: {
    name: "dp",
    label: "Motivation",
  },
};

export const getDASections = (riskFile: DVRiskFile) => {
  if (riskFile.cr4de_risk_type === RISK_TYPE.STANDARD) {
    return [
      PARAMETER.DP,
      PARAMETER.H,
      PARAMETER.S,
      PARAMETER.E,
      PARAMETER.F,
      PARAMETER.CB,
    ].map(
      (p) => DIRECT_ANALYSIS_SECTIONS_STANDARD[p]
    ) as DIRECT_ANALYSIS_SECTION[];
  }
  if (riskFile.cr4de_risk_type === RISK_TYPE.MANMADE) {
    return [
      DIRECT_ANALYSIS_SECTIONS_MANMADE[PARAMETER.DP],
    ] as DIRECT_ANALYSIS_SECTION[];
  }
  return [] as DIRECT_ANALYSIS_SECTION[];
};

function getQuantiNumbers(quantiInput: (string | null)[]) {
  const good = quantiInput.filter((i) => i !== null) as string[];

  if (good.length <= 0) return null;

  const prefix = good[0].slice(0, good[0].search(/\d/));

  return {
    prefix,
    numbers: good.map((i) => parseInt(i.replace(prefix, ""), 10)),
  };
}

export function getQuantiNumber(quantiString: string) {
  const prefix = quantiString.slice(0, quantiString.search(/\d/));

  return {
    prefix,
    number: parseFloat(quantiString.replace(prefix, "")),
  };
}

export function avg(n: number[], weights?: number[]) {
  const totalWeight = weights
    ? weights.reduce((tot, cur) => tot + cur)
    : n.length;

  return (
    Math.round(
      2 *
        n.reduce((tot, cur, i) => {
          if (weights) return tot + (cur * weights[i]) / totalWeight;
          return tot + cur / totalWeight;
        }, 0)
    ) / 2
  );
}

export function std(n: number[], weights?: number[]) {
  const average = avg(n, weights);

  const totalWeight = weights
    ? weights.reduce((tot, cur) => tot + cur)
    : n.length;

  return (
    Math.round(
      10 *
        Math.sqrt(
          n.reduce((varTot, cur, i) => {
            if (weights) {
              return varTot + Math.pow(weights[i] * (cur - average), 2);
            }

            return varTot + Math.pow(cur - average, 2);
          }, 0) / totalWeight
        )
    ) / 10.0
  );
}

export function getAverage(quantiInput: (string | null)[], weights?: number[]) {
  const n = getQuantiNumbers(quantiInput);

  if (!n) return null;

  return `${n.prefix}${avg(n.numbers, weights)}`;
}

export function getStd(quantiInput: (string | null)[], weights?: number[]) {
  const n = getQuantiNumbers(quantiInput);

  if (!n) return null;

  return std(n.numbers, weights);
}

export function getStats(
  quantiInput: (string | null)[],
  weights?: number[]
): STATS | null {
  const n = getQuantiNumbers(quantiInput);

  if (!n)
    return {
      min: 0,
      max: 0,
      avg: 0,
      std: 0,
      minLabel: "",
      maxLabel: "",
      avgLabel: "",
    };

  const values = {
    min: Math.min(...n.numbers),
    max: Math.max(...n.numbers),
    avg: avg(n.numbers, weights),
    std: std(n.numbers, weights),
  };

  return {
    ...values,
    minLabel: `${n.prefix}${values.min}`,
    maxLabel: `${n.prefix}${values.max}`,
    avgLabel: `${n.prefix}${values.avg}`,
  };
}

export function getDASpread(
  directAnalyses: DVDirectAnalysis[],
  fieldName: keyof DVDirectAnalysis
) {
  return directAnalyses.reduce(
    (minMax, cur) => {
      if (cur[fieldName] === null) return minMax;

      const num = getQuantiNumber(cur[fieldName] as string).number;

      return [
        minMax[0] <= num ? minMax[0] : num,
        minMax[1] >= num ? minMax[1] : num,
      ];
    },
    [6, 0]
  );
}

export function getDADivergence(
  directAnalyses: DVDirectAnalysis[],
  scenario: SCENARIOS,
  section: DIRECT_ANALYSIS_SECTION
) {
  const fieldNames = getQuantiFieldNames(scenario, section);

  const stds = fieldNames.map((f) => {
    const stats = getStats(directAnalyses.map((da) => da[f] as string | null));

    if (stats === null) return null;

    return stats.std;
  });

  return (
    Math.round(
      (100 * avg(stds.filter((s) => s !== null) as number[])) /
        (section.name === "dp" ? 5 : 6)
    ) / 100
  );
}

export function getCADivergence(cascadeAnalyses: DVCascadeAnalysis[]) {
  const stds = [
    "c2c",
    "c2m",
    "c2e",
    "m2c",
    "m2m",
    "m2e",
    "e2c",
    "e2m",
    "e2e",
  ].map((f) => {
    return getStd(
      cascadeAnalyses.map(
        (ca) => ca[`cr4de_${f}` as keyof DVCascadeAnalysis] as string | null
      )
    );
  });

  return (
    Math.round((100 * avg(stds.filter((s) => s !== null) as number[])) / 6) /
    100
  );
}

export const getQualiFieldName = (
  scenario: SCENARIOS,
  parameter: DIRECT_ANALYSIS_SECTION
): keyof DVDirectAnalysis => {
  if (parameter.name === "dp") {
    return `cr4de_dp_quali_${SCENARIO_PARAMS[scenario].prefix}` as keyof DVDirectAnalysis;
  }

  if (parameter.name === "cb") {
    return `cr4de_cross_border_impact_quali_${SCENARIO_PARAMS[scenario].prefix}` as keyof DVDirectAnalysis;
  }

  return `cr4de_di_quali_${parameter.name}_${SCENARIO_PARAMS[scenario].prefix}` as keyof DVDirectAnalysis;
};

export const getQuantiFieldNames = (
  scenario: SCENARIOS,
  parameter: DIRECT_ANALYSIS_SECTION
): (keyof DVDirectAnalysis)[] => {
  if (parameter.name === "dp") {
    return [
      `cr4de_dp_quanti_${SCENARIO_PARAMS[scenario].prefix}` as keyof DVDirectAnalysis,
    ];
  }

  if (parameter.name === "dp50") {
    return [
      `cr4de_dp50_quanti_${SCENARIO_PARAMS[scenario].prefix}` as keyof DVDirectAnalysis,
    ];
  }

  if (parameter.name === "cb") {
    return [];
  }

  return DIRECT_ANALYSIS_QUANTI_FIELDS.filter((f) =>
    f.match(
      new RegExp(
        `cr4de_di_quanti_${parameter.name}.{1}_${SCENARIO_PARAMS[scenario].prefix}`,
        "g"
      )
    )
  );
};

export const quantiLabels = {};

export const getQuantiLabel = (
  fieldName: keyof DVDirectAnalysis,
  rfContainer: DVRiskFile | DVDirectAnalysis<DVRiskFile>
) => {
  if (fieldName.indexOf("_dp_") >= 0) {
    if ((rfContainer as DVDirectAnalysis<DVRiskFile>).cr4de_risk_file) {
      if (
        (rfContainer as DVDirectAnalysis<DVRiskFile>).cr4de_risk_file
          .cr4de_risk_type === RISK_TYPE.STANDARD
      )
        return "Direct probability";
    } else {
      if ((rfContainer as DVRiskFile).cr4de_risk_type === RISK_TYPE.STANDARD)
        return "Direct probability";
    }
    return "Motivation";
  } else if (fieldName.indexOf("_climate_change_") >= 0) {
    if (fieldName.endsWith("_c"))
      return "Direct probability in 2050 - Considerable scenario";
    if (fieldName.endsWith("_m"))
      return "Direct probability in 2050 - Major scenario";
    if (fieldName.endsWith("_e"))
      return "Direct probability in 2050 - Extreme scenario";
  }

  return {
    ha: "Fatalities",
    hb: "Injured / sick people",
    hc: "People in need of assistance",
    sa: "Supply shortfalls and unmet human needs",
    sb: "Diminished public order and domestic security",
    sc: "Damage to the reputation of Belgium",
    sd: "Loss of confidence in or functioning of the state and/or its values",
    ea: "Damaged ecosystems",
    fa: "Financial asset damages",
    fb: "Reduction of economic performance",
  }[fieldName.replace("cr4de_di_quanti_", "").slice(0, 2)];
};

function getAveragesForScenarios(
  parameter: string,
  field: string,
  directAnalyses: DVDirectAnalysis[],
  useWeights: boolean = true
) {
  const daField =
    field.indexOf("climate_change") >= 0 ? "cr4de_dp50_quanti" : field;

  return {
    [`${field}_c`]: getAverage(
      directAnalyses.map(
        (da) => da[`${daField}_c` as keyof DVDirectAnalysis]
      ) as string[],
      useWeights
        ? directAnalyses.map(
            (da) =>
              (da.cr4de_quality &&
                da.cr4de_quality[`${parameter}_c` as keyof FieldQuality]) ||
              2.5
          )
        : undefined
    ),
    [`${field}_m`]: getAverage(
      directAnalyses.map(
        (da) => da[`${daField}_m` as keyof DVDirectAnalysis]
      ) as string[],
      useWeights
        ? directAnalyses.map(
            (da) =>
              (da.cr4de_quality &&
                da.cr4de_quality[`${parameter}_m` as keyof FieldQuality]) ||
              2.5
          )
        : undefined
    ),
    [`${field}_e`]: getAverage(
      directAnalyses.map(
        (da) => da[`${daField}_e` as keyof DVDirectAnalysis]
      ) as string[],
      useWeights
        ? directAnalyses.map(
            (da) =>
              (da.cr4de_quality &&
                da.cr4de_quality[`${parameter}_e` as keyof FieldQuality]) ||
              2.5
          )
        : undefined
    ),
  };
}
export function getConsensusRiskFile(
  directAnalyses: DVDirectAnalysis[],
  useWeights: boolean = true
) {
  return {
    ...getAveragesForScenarios(
      "dp",
      "cr4de_dp_quanti",
      directAnalyses,
      useWeights
    ),
    ...getAveragesForScenarios(
      "h",
      "cr4de_di_quanti_ha",
      directAnalyses,
      useWeights
    ),
    ...getAveragesForScenarios(
      "h",
      "cr4de_di_quanti_hb",
      directAnalyses,
      useWeights
    ),
    ...getAveragesForScenarios(
      "h",
      "cr4de_di_quanti_hc",
      directAnalyses,
      useWeights
    ),
    ...getAveragesForScenarios(
      "s",
      "cr4de_di_quanti_sa",
      directAnalyses,
      useWeights
    ),
    ...getAveragesForScenarios(
      "s",
      "cr4de_di_quanti_sb",
      directAnalyses,
      useWeights
    ),
    ...getAveragesForScenarios(
      "s",
      "cr4de_di_quanti_sc",
      directAnalyses,
      useWeights
    ),
    ...getAveragesForScenarios(
      "s",
      "cr4de_di_quanti_sd",
      directAnalyses,
      useWeights
    ),
    ...getAveragesForScenarios(
      "e",
      "cr4de_di_quanti_ea",
      directAnalyses,
      useWeights
    ),
    ...getAveragesForScenarios(
      "f",
      "cr4de_di_quanti_fa",
      directAnalyses,
      useWeights
    ),
    ...getAveragesForScenarios(
      "f",
      "cr4de_di_quanti_fb",
      directAnalyses,
      useWeights
    ),
    ...getAveragesForScenarios(
      "cc",
      "cr4de_climate_change_quanti",
      directAnalyses.filter((da) => da.cr4de_dp50_quanti_c !== null),
      useWeights
    ),
  };
}
export function getConsensusCascade(
  cascadeAnalyses: DVCascadeAnalysis[],
  isCause = false,
  useWeights: boolean = true
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c: any = {};

  for (const field of CASCADE_ANALYSIS_QUANTI_FIELDS) {
    c[`${field}${isCause ? "_cause" : ""}`] = getAverage(
      cascadeAnalyses.map((ca) => ca[field] as string),
      useWeights
        ? cascadeAnalyses.map((ca) => ca.cr4de_quality || 2.5)
        : undefined
    );
  }

  return c;
}

export const getCompletedDirectAnalyses = (
  riskFile: DVRiskFile | null,
  participants: DVParticipation[],
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[]
) => {
  return directAnalyses.filter((da) => {
    const participant = participants.find(
      (p) => p._cr4de_contact_value === da._cr4de_expert_value
    );

    if (!participant) return false;
    if (!participant.cr4de_direct_analysis_finished) return false;

    return true;
  });
};

export const getCompletedCascadeAnalyses = (
  riskFile: DVRiskFile,
  participants: DVParticipation[],
  cascades: DVRiskCascade<SmallRisk>[],
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[] | null,
  cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[]
) => {
  return cascadeAnalyses.filter((ca) => {
    if (
      !participants.some(
        (pa) =>
          pa._cr4de_contact_value === ca._cr4de_expert_value &&
          pa.cr4de_cascade_analysis_finished
      )
    ) {
      return false;
    }

    const cascade = cascades.find(
      (c) => ca._cr4de_cascade_value === c.cr4de_bnrariskcascadeid
    );

    if (!cascade) {
      return false;
    }

    if (cascade.cr4de_cause_hazard.cr4de_risk_type !== RISK_TYPE.EMERGING) {
      const ret = !CASCADE_ANALYSIS_QUANTI_FIELDS.some((f) => ca[f] === null);
      return ret;
    }

    if (
      riskFile.cr4de_title.indexOf("Climate") < 0 &&
      cascade.cr4de_cause_hazard.cr4de_title.indexOf("Climate") >= 0
    ) {
      const d = directAnalyses?.find(
        (da) => da._cr4de_expert_value === ca._cr4de_expert_value
      );

      return (
        d &&
        d.cr4de_dp50_quanti_c !== null &&
        d.cr4de_dp50_quanti_m !== null &&
        d.cr4de_dp50_quanti_e !== null &&
        d.cr4de_dp50_quali !== null
      );
    }

    return ca.cr4de_quali_cascade !== null;
  });
};
