import { CascadeCalculation } from "../types/dataverse/DVAnalysisRun";
import { DVCascadeAnalysis } from "../types/dataverse/DVCascadeAnalysis";
import {
  CauseSnapshotResults,
  DVCascadeSnapshot,
  EffectSnapshotResults,
  SerializedCauseSnapshotResults,
  SerializedEffectSnapshotResults,
} from "../types/dataverse/DVCascadeSnapshot";
import {
  DVRiskCascade,
  parseCascadeSnapshot,
} from "../types/dataverse/DVRiskCascade";
import { DVRiskFile, RISK_TYPE } from "../types/dataverse/DVRiskFile";
import {
  DVRiskSnapshot,
  RiskSnapshotResults,
} from "../types/dataverse/DVRiskSnapshot";
import {
  CauseRisksSummary,
  EffectRisksSummary,
} from "../types/dataverse/DVRiskSummary";
import { SmallRisk } from "../types/dataverse/DVSmallRisk";
import { RiskCatalogue } from "./riskfiles";
import {
  SCENARIOS,
  SCENARIO_LETTER,
  getCascadeParameter,
  getScenarioParameter,
} from "./scenarios";
import { snapshotFromRiskCascade } from "./snapshot";

export type CASCADE_LETTER =
  | "c2c"
  | "c2m"
  | "c2e"
  | "m2c"
  | "m2m"
  | "m2e"
  | "e2c"
  | "e2m"
  | "e2e";

export interface CascadeAnalysisInput {
  cr4de_c2c: number | null;
  cr4de_c2m: number | null;
  cr4de_c2e: number | null;
  cr4de_m2c: number | null;
  cr4de_m2m: number | null;
  cr4de_m2e: number | null;
  cr4de_e2c: number | null;
  cr4de_e2m: number | null;
  cr4de_e2e: number | null;

  cr4de_quali_cascade: string | null;
}

export type Cascades = {
  all: DVRiskCascade<SmallRisk, SmallRisk>[];
  causes: DVRiskCascade<SmallRisk, SmallRisk>[];
  effects: DVRiskCascade<SmallRisk, SmallRisk>[];
  catalyzingEffects: DVRiskCascade<SmallRisk, SmallRisk>[];
  climateChange: DVRiskCascade<SmallRisk, SmallRisk> | null;
};

export type CascadeSnapshots<
  Tc = unknown,
  Te = unknown,
  Rc = CauseSnapshotResults,
  Re = EffectSnapshotResults
> = {
  all: DVCascadeSnapshot<unknown, Tc, Te, Rc, Re>[];
  causes: DVCascadeSnapshot<unknown, Tc, Te, Rc, Re>[];
  effects: DVCascadeSnapshot<unknown, Tc, Te, Rc, Re>[];
  catalyzingEffects: DVCascadeSnapshot<unknown, Tc, Te, Rc, Re>[];
  climateChange: DVCascadeSnapshot<unknown, Tc, Te, Rc, Re> | null;
};

export type CascadeCatalogue = { [key: string]: Cascades };

export type CascadeSnapshotCatalogue<
  Tc = unknown,
  Te = unknown,
  Rc = CauseSnapshotResults,
  Re = EffectSnapshotResults
> = {
  [key: string]: CascadeSnapshots<Tc, Te, Rc, Re>;
};

export function getCauses(
  riskFile: SmallRisk,
  cascades: DVRiskCascade[],
  hazardCatalogue: { [id: string]: SmallRisk }
): DVRiskCascade<SmallRisk, SmallRisk>[] {
  return cascades
    .filter(
      (c) =>
        c._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
        (hazardCatalogue[c._cr4de_cause_hazard_value].cr4de_risk_type ===
          RISK_TYPE.STANDARD ||
          hazardCatalogue[c._cr4de_cause_hazard_value].cr4de_risk_type ===
            RISK_TYPE.MANMADE)
    )
    .map((c) => ({
      ...c,
      cr4de_cause_hazard: hazardCatalogue[c._cr4de_cause_hazard_value],
      cr4de_effect_hazard: hazardCatalogue[c._cr4de_effect_hazard_value],
    }));
}

export function getCausesNew(
  vars:
    | {
        riskFile: SmallRisk;
        cascades: DVRiskCascade[];
        hazardCatalogue: RiskCatalogue<unknown, RiskSnapshotResults>;
      }
    | {
        riskFile: DVRiskSnapshot;
        cascades: DVCascadeSnapshot[];
        hazardCatalogue: RiskCatalogue<unknown, RiskSnapshotResults>;
      }
): DVCascadeSnapshot<unknown, DVRiskSnapshot, DVRiskSnapshot>[] {
  if ("cr4de_riskfilesid" in vars.riskFile) {
    // SmallRisk
    const { riskFile, cascades, hazardCatalogue } = vars as {
      riskFile: SmallRisk;
      cascades: DVRiskCascade[];
      hazardCatalogue: RiskCatalogue<unknown, RiskSnapshotResults>;
    };

    return cascades
      .filter(
        (c) =>
          c._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
          (hazardCatalogue[c._cr4de_cause_hazard_value]?.cr4de_risk_type ===
            RISK_TYPE.STANDARD ||
            hazardCatalogue[c._cr4de_cause_hazard_value]?.cr4de_risk_type ===
              RISK_TYPE.MANMADE)
      )
      .map((c) => snapshotFromRiskCascade(c))
      .map((c) => ({
        ...c,
        cr4de_cause_risk: hazardCatalogue[c._cr4de_cause_risk_value],
        cr4de_effect_risk: hazardCatalogue[c._cr4de_effect_risk_value],
        cr4de_quanti_cause: JSON.parse(c.cr4de_quanti_cause),
        cr4de_quanti_effect: JSON.parse(c.cr4de_quanti_effect),
      }));
  }

  // RiskSnapshot
  const { riskFile, cascades, hazardCatalogue } = vars as {
    riskFile: DVRiskSnapshot;
    cascades: DVCascadeSnapshot[];
    hazardCatalogue: RiskCatalogue<unknown, RiskSnapshotResults>;
  };

  return cascades
    .filter(
      (c) =>
        c._cr4de_effect_risk_value === riskFile._cr4de_risk_file_value &&
        (hazardCatalogue[c._cr4de_cause_risk_value]?.cr4de_risk_type ===
          RISK_TYPE.STANDARD ||
          hazardCatalogue[c._cr4de_cause_risk_value]?.cr4de_risk_type ===
            RISK_TYPE.MANMADE)
    )
    .map((c) => ({
      ...c,
      cr4de_cause_risk: hazardCatalogue[c._cr4de_cause_risk_value],
      cr4de_effect_risk: hazardCatalogue[c._cr4de_effect_risk_value],
    }));
}

export function getCausesWithDP(
  riskFile: DVRiskFile,
  cascades: Cascades,
  scenario: SCENARIOS
) {
  return [
    {
      name: "2A.dp.title",
      p: getScenarioParameter(riskFile, "DP", scenario) || 0,
    },
    ...cascades.causes.map((c) => ({
      id: c.cr4de_cause_hazard.cr4de_riskfilesid,
      name: `risk.${c.cr4de_cause_hazard.cr4de_hazard_id}.name`,
      p: getCascadeParameter(c, scenario, "IP") || 0,
      cascade: c,
    })),
  ];
}

export function getCausesWithDPNew(
  riskFile: DVRiskSnapshot,
  cascades: CascadeSnapshots<DVRiskSnapshot, DVRiskSnapshot>,
  scenario: SCENARIOS
) {
  return [
    {
      name: "2A.dp.title",
      p: riskFile.cr4de_quanti[scenario].dp.yearly.scale,
    },
    ...cascades.causes.map((c) => ({
      id: c.cr4de_cause_risk._cr4de_risk_file_value,
      name: `risk.${c.cr4de_cause_risk.cr4de_hazard_id}.name`,
      p: c.cr4de_quanti_cause[scenario].ip.yearly.scale,
      cascade: c,
    })),
  ];
}

export function getCauseSummaries(
  riskFile: DVRiskSnapshot,
  cascades: CascadeSnapshots<DVRiskSnapshot, DVRiskSnapshot>,
  scenario: SCENARIOS,
  showOther: boolean
): CauseRisksSummary[] {
  const causes = getCausesWithDPNew(riskFile, cascades, scenario).sort(
    (a, b) => b.p - a.p
  );

  let minP = 0;
  let cumulP = 0;

  const Ptot = riskFile.cr4de_quanti[scenario].tp.yearly.scale;

  for (const c of causes) {
    cumulP += c.p / Ptot;

    if (cumulP >= 0.805) {
      minP = c.p;
      break;
    }
  }

  const selectedCauses = causes
    .filter((c) => c.p >= minP)
    .map((c) => ({
      cause_risk_id: "id" in c ? c.id : "",
      cause_risk_title: "id" in c ? c.name : "No underlying cause",
      cause_risk_p: c.p / Ptot,
    }));
  const otherCauses =
    selectedCauses.length < causes.length
      ? [
          {
            cause_risk_id: "",
            cause_risk_title: "Other causes",
            cause_risk_p:
              causes
                .filter((c) => c.p < minP)
                .reduce((otherP, c) => otherP + c.p, 0) / Ptot,
            other_causes: showOther
              ? causes
                  .filter((c) => c.p < minP)
                  .map((c) => ({
                    cause_risk_id: "id" in c ? c.id : "",
                    cause_risk_title:
                      "id" in c ? c.name : "No underlying cause",
                    cause_risk_p: c.p / Ptot,
                  }))
              : undefined,
          },
        ]
      : [];

  return [...selectedCauses, ...otherCauses];
}

export function getEffects(
  riskFile: SmallRisk,
  cascades: DVRiskCascade[],
  hazardCatalogue: { [id: string]: SmallRisk }
): DVRiskCascade<SmallRisk, SmallRisk>[] {
  return cascades
    .filter((c) => c._cr4de_cause_hazard_value === riskFile.cr4de_riskfilesid)
    .map((c) => ({
      ...c,
      cr4de_cause_hazard: hazardCatalogue[c._cr4de_cause_hazard_value],
      cr4de_effect_hazard: hazardCatalogue[c._cr4de_effect_hazard_value],
    }));
}

export function getEffectsNew(
  vars:
    | {
        riskFile: SmallRisk;
        cascades: DVRiskCascade[];
        hazardCatalogue: RiskCatalogue<unknown, RiskSnapshotResults>;
      }
    | {
        riskFile: DVRiskSnapshot;
        cascades: DVCascadeSnapshot[];
        hazardCatalogue: RiskCatalogue<unknown, RiskSnapshotResults>;
      }
): DVCascadeSnapshot<unknown, DVRiskSnapshot, DVRiskSnapshot>[] {
  if ("cr4de_riskfilesid" in vars.riskFile) {
    // SmallRisk
    const { riskFile, cascades, hazardCatalogue } = vars as {
      riskFile: SmallRisk;
      cascades: DVRiskCascade[];
      hazardCatalogue: RiskCatalogue<unknown, RiskSnapshotResults>;
    };

    return cascades
      .filter((c) => c._cr4de_cause_hazard_value === riskFile.cr4de_riskfilesid)
      .map((c) => snapshotFromRiskCascade(c))
      .map((c) => ({
        ...c,
        cr4de_cause_risk: hazardCatalogue[c._cr4de_cause_risk_value],
        cr4de_effect_risk: hazardCatalogue[c._cr4de_effect_risk_value],
        cr4de_quanti_cause: JSON.parse(c.cr4de_quanti_cause),
        cr4de_quanti_effect: JSON.parse(c.cr4de_quanti_effect),
      }));
  }

  // RiskSnapshot
  const { riskFile, cascades, hazardCatalogue } = vars as {
    riskFile: DVRiskSnapshot;
    cascades: DVCascadeSnapshot[];
    hazardCatalogue: RiskCatalogue<unknown, RiskSnapshotResults>;
  };

  return cascades
    .filter(
      (c) => c._cr4de_cause_risk_value === riskFile._cr4de_risk_file_value
    )
    .map((c) => ({
      ...c,
      cr4de_cause_risk: hazardCatalogue[c._cr4de_cause_risk_value],
      cr4de_effect_risk: hazardCatalogue[c._cr4de_effect_risk_value],
    }));
}

export function getEffectsWithDI(
  riskFile: DVRiskFile,
  cascades: Cascades,
  scenario: SCENARIOS
) {
  return [
    {
      name: "Direct Impact",
      i: getScenarioParameter(riskFile, "DI", scenario) || 0,
      iH:
        (getScenarioParameter(riskFile, "DI_Ha", scenario) || 0) +
        (getScenarioParameter(riskFile, "DI_Hb", scenario) || 0) +
        (getScenarioParameter(riskFile, "DI_Hc", scenario) || 0),
      iS:
        (getScenarioParameter(riskFile, "DI_Sa", scenario) || 0) +
        (getScenarioParameter(riskFile, "DI_Sb", scenario) || 0) +
        (getScenarioParameter(riskFile, "DI_Sc", scenario) || 0) +
        (getScenarioParameter(riskFile, "DI_Sd", scenario) || 0),
      iE: getScenarioParameter(riskFile, "DI_Ea", scenario) || 0,
      iF:
        (getScenarioParameter(riskFile, "DI_Fa", scenario) || 0) +
        (getScenarioParameter(riskFile, "DI_Fb", scenario) || 0),
    },
    ...cascades.effects.map((e) => ({
      id: e.cr4de_effect_hazard.cr4de_riskfilesid,
      name: `risk.${e.cr4de_effect_hazard.cr4de_hazard_id}.name`,
      i: getCascadeParameter(e, scenario, "II") || 0,
      iH:
        (getCascadeParameter(e, scenario, "II_Ha") || 0) +
        (getCascadeParameter(e, scenario, "II_Hb") || 0) +
        (getCascadeParameter(e, scenario, "II_Hc") || 0),
      iS:
        (getCascadeParameter(e, scenario, "II_Sa") || 0) +
        (getCascadeParameter(e, scenario, "II_Sb") || 0) +
        (getCascadeParameter(e, scenario, "II_Sc") || 0) +
        (getCascadeParameter(e, scenario, "II_Sd") || 0),
      iE: getCascadeParameter(e, scenario, "II_Ea") || 0,
      iF:
        (getCascadeParameter(e, scenario, "II_Fa") || 0) +
        (getCascadeParameter(e, scenario, "II_Fb") || 0),
      cascade: e,
    })),
  ];
}

export function getEffectsWithDINew(
  riskFile: DVRiskSnapshot,
  cascades: CascadeSnapshots<DVRiskSnapshot, DVRiskSnapshot>,
  scenario: SCENARIOS
) {
  return [
    {
      name: "Direct Impact",
      i: riskFile.cr4de_quanti[scenario].di.all.scaleTot,
      iH:
        riskFile.cr4de_quanti[scenario].di.ha.scaleTot +
        riskFile.cr4de_quanti[scenario].di.hb.scaleTot +
        riskFile.cr4de_quanti[scenario].di.hc.scaleTot,
      iS:
        riskFile.cr4de_quanti[scenario].di.sa.scaleTot +
        riskFile.cr4de_quanti[scenario].di.sb.scaleTot +
        riskFile.cr4de_quanti[scenario].di.sc.scaleTot +
        riskFile.cr4de_quanti[scenario].di.sd.scaleTot,
      iE: riskFile.cr4de_quanti[scenario].di.ea.scaleTot,
      iF:
        riskFile.cr4de_quanti[scenario].di.fa.scaleTot +
        riskFile.cr4de_quanti[scenario].di.fb.scaleTot,
    },
    ...cascades.effects.map((e) => ({
      id: e.cr4de_effect_risk._cr4de_risk_file_value,
      name: `risk.${e.cr4de_effect_risk.cr4de_hazard_id}.name`,
      i: e.cr4de_quanti_effect[scenario].ii.all.scale,
      iH:
        e.cr4de_quanti_effect[scenario].ii.ha.scale +
        e.cr4de_quanti_effect[scenario].ii.hb.scale +
        e.cr4de_quanti_effect[scenario].ii.hc.scale,
      iS:
        e.cr4de_quanti_effect[scenario].ii.sa.scale +
        e.cr4de_quanti_effect[scenario].ii.sb.scale +
        e.cr4de_quanti_effect[scenario].ii.sc.scale +
        e.cr4de_quanti_effect[scenario].ii.sd.scale,
      iE: e.cr4de_quanti_effect[scenario].ii.ea.scale,
      iF:
        e.cr4de_quanti_effect[scenario].ii.fa.scale +
        e.cr4de_quanti_effect[scenario].ii.fb.scale,
      cascade: e,
    })),
  ];
}

export function getEffectsSummaries(
  riskSnapshot: DVRiskSnapshot,
  cascades: CascadeSnapshots<DVRiskSnapshot, DVRiskSnapshot>,
  scenario: SCENARIOS,
  showOther: boolean
): EffectRisksSummary[] {
  const effects = getEffectsWithDINew(riskSnapshot, cascades, scenario).sort(
    (a, b) => b.i - a.i
  );
  const Itot = effects.reduce((tot, e) => tot + e.i, 0.000000001);

  let minI = 0;
  let cumulI = 0;
  for (const e of effects) {
    cumulI += e.i / Itot;

    if (cumulI >= 0.8) {
      minI = e.i;
      break;
    }
  }

  const selectedEffects = effects
    .filter((e) => e.i >= minI)
    .map((e) => ({
      effect_risk_id: "id" in e ? e.id : "",
      effect_risk_title: e.name,
      effect_risk_i: e.i / Itot,
    }));

  const otherEffects =
    selectedEffects.length < effects.length
      ? [
          {
            effect_risk_id: "",
            effect_risk_title: "Other effects",
            effect_risk_i:
              effects
                .filter((c) => c.i < minI)
                .reduce((otherI, c) => otherI + c.i, 0) / Itot,
            other_effects: showOther
              ? effects
                  .filter((c) => c.i < minI)
                  .map((e) => ({
                    effect_risk_id: "id" in e ? e.id : "",
                    effect_risk_title: e.name,
                    effect_risk_i: e.i / Itot,
                  }))
              : undefined,
          },
        ]
      : [];

  return [...selectedEffects, ...otherEffects];
}

export function getCatalyzingEffects<T extends DVRiskCascade>(
  riskFile: SmallRisk,
  cascades: T[],
  hazardCatalogue: { [id: string]: SmallRisk },
  includeClimateChange: boolean = true
): DVRiskCascade<SmallRisk, SmallRisk>[] {
  return cascades
    .filter(
      (c) =>
        c._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
        hazardCatalogue[c._cr4de_cause_hazard_value]?.cr4de_risk_type ===
          RISK_TYPE.EMERGING &&
        (includeClimateChange ||
          hazardCatalogue[c._cr4de_cause_hazard_value]?.cr4de_title.indexOf(
            "Climate"
          ) < 0)
    )
    .map((c) => ({
      ...c,
      cr4de_cause_hazard: hazardCatalogue[c._cr4de_cause_hazard_value],
      cr4de_effect_hazard: hazardCatalogue[c._cr4de_effect_hazard_value],
    }));
}

export function getCatalyzingEffectsNew(
  vars:
    | {
        riskFile: SmallRisk;
        cascades: DVRiskCascade[];
        hazardCatalogue: RiskCatalogue<unknown, RiskSnapshotResults>;
      }
    | {
        riskFile: DVRiskSnapshot;
        cascades: DVCascadeSnapshot[];
        hazardCatalogue: RiskCatalogue<unknown, RiskSnapshotResults>;
      },
  includeClimateChange: boolean = true
): DVCascadeSnapshot<unknown, DVRiskSnapshot, DVRiskSnapshot>[] {
  if ("cr4de_riskfilesid" in vars.riskFile) {
    // SmallRisk
    const { riskFile, cascades, hazardCatalogue } = vars as {
      riskFile: SmallRisk;
      cascades: DVRiskCascade[];
      hazardCatalogue: RiskCatalogue<unknown, RiskSnapshotResults>;
    };

    return cascades
      .filter(
        (c) =>
          c._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
          hazardCatalogue[c._cr4de_cause_hazard_value]?.cr4de_risk_type ===
            RISK_TYPE.EMERGING &&
          (includeClimateChange ||
            hazardCatalogue[c._cr4de_cause_hazard_value]?.cr4de_title.indexOf(
              "Climate"
            ) < 0)
      )
      .map((c) => snapshotFromRiskCascade(c))
      .map((c) => ({
        ...c,
        cr4de_cause_risk: hazardCatalogue[c._cr4de_cause_risk_value],
        cr4de_effect_risk: hazardCatalogue[c._cr4de_effect_risk_value],
        cr4de_quanti_cause: JSON.parse(c.cr4de_quanti_cause),
        cr4de_quanti_effect: JSON.parse(c.cr4de_quanti_effect),
      }));
  }

  // RiskSnapshot
  const { riskFile, cascades, hazardCatalogue } = vars as {
    riskFile: DVRiskSnapshot;
    cascades: DVCascadeSnapshot[];
    hazardCatalogue: RiskCatalogue<unknown, RiskSnapshotResults>;
  };

  return cascades
    .filter(
      (c) =>
        c._cr4de_effect_risk_value === riskFile._cr4de_risk_file_value &&
        hazardCatalogue[c._cr4de_cause_risk_value]?.cr4de_risk_type ===
          RISK_TYPE.EMERGING &&
        (includeClimateChange ||
          hazardCatalogue[c._cr4de_cause_risk_value]?.cr4de_title.indexOf(
            "Climate"
          ) < 0)
    )
    .map((c) => ({
      ...c,
      cr4de_cause_risk: hazardCatalogue[c._cr4de_cause_risk_value],
      cr4de_effect_risk: hazardCatalogue[c._cr4de_effect_risk_value],
    }));
}

export function getClimateChange<T extends DVRiskCascade>(
  riskFile: SmallRisk,
  cascades: T[],
  hazardCatalogue: { [id: string]: SmallRisk }
): DVRiskCascade<SmallRisk, SmallRisk> | null {
  const cc = cascades.find(
    (c) =>
      c._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
      hazardCatalogue[c._cr4de_cause_hazard_value]?.cr4de_risk_type ===
        RISK_TYPE.EMERGING &&
      hazardCatalogue[c._cr4de_cause_hazard_value]?.cr4de_title.indexOf(
        "Climate"
      ) >= 0
  );
  if (cc) {
    return {
      ...cc,
      cr4de_cause_hazard: hazardCatalogue[cc._cr4de_cause_hazard_value],
      cr4de_effect_hazard: hazardCatalogue[cc._cr4de_effect_hazard_value],
    };
  }
  return null;
}

export function getClimateChangeNew(
  vars:
    | {
        riskFile: SmallRisk;
        cascades: DVRiskCascade[];
        hazardCatalogue: RiskCatalogue<unknown, RiskSnapshotResults>;
      }
    | {
        riskFile: DVRiskSnapshot;
        cascades: DVCascadeSnapshot[];
        hazardCatalogue: RiskCatalogue<unknown, RiskSnapshotResults>;
      }
): DVCascadeSnapshot<unknown, DVRiskSnapshot, DVRiskSnapshot> | null {
  if ("cr4de_riskfilesid" in vars.riskFile) {
    // SmallRisk
    const { riskFile, cascades, hazardCatalogue } = vars as {
      riskFile: SmallRisk;
      cascades: DVRiskCascade[];
      hazardCatalogue: RiskCatalogue<unknown, RiskSnapshotResults>;
    };

    const cc = cascades.find(
      (c) =>
        c._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
        hazardCatalogue[c._cr4de_cause_hazard_value]?.cr4de_risk_type ===
          RISK_TYPE.EMERGING &&
        hazardCatalogue[c._cr4de_cause_hazard_value]?.cr4de_title.indexOf(
          "Climate"
        ) >= 0
    );
    if (cc) {
      const ss = snapshotFromRiskCascade(cc);
      return {
        ...ss,
        cr4de_cause_risk: hazardCatalogue[cc._cr4de_cause_hazard_value],
        cr4de_effect_risk: hazardCatalogue[cc._cr4de_effect_hazard_value],
        cr4de_quanti_cause: JSON.parse(ss.cr4de_quanti_cause),
        cr4de_quanti_effect: JSON.parse(ss.cr4de_quanti_effect),
      };
    }
  } else {
    // RiskSnapshot
    const { riskFile, cascades, hazardCatalogue } = vars as {
      riskFile: DVRiskSnapshot;
      cascades: DVCascadeSnapshot[];
      hazardCatalogue: RiskCatalogue<unknown, RiskSnapshotResults>;
    };

    const cc = cascades.find(
      (c) =>
        c._cr4de_effect_risk_value === riskFile._cr4de_risk_file_value &&
        hazardCatalogue[c._cr4de_cause_risk_value]?.cr4de_risk_type ===
          RISK_TYPE.EMERGING &&
        hazardCatalogue[c._cr4de_cause_risk_value]?.cr4de_title.indexOf(
          "Climate"
        ) >= 0
    );
    if (cc) {
      return {
        ...cc,
        cr4de_cause_risk: hazardCatalogue[cc._cr4de_cause_risk_value],
        cr4de_effect_risk: hazardCatalogue[cc._cr4de_effect_risk_value],
      };
    }
  }

  return null;
}

export function getCascadeField(
  causeScenario: SCENARIOS,
  effectScenario: SCENARIOS
): keyof CascadeAnalysisInput {
  if (causeScenario === SCENARIOS.CONSIDERABLE) {
    if (effectScenario === SCENARIOS.CONSIDERABLE) {
      return "cr4de_c2c";
    } else if (effectScenario === SCENARIOS.MAJOR) {
      return "cr4de_c2m";
    } else {
      return "cr4de_c2e";
    }
  } else if (causeScenario === SCENARIOS.MAJOR) {
    if (effectScenario === SCENARIOS.CONSIDERABLE) {
      return "cr4de_m2c";
    } else if (effectScenario === SCENARIOS.MAJOR) {
      return "cr4de_m2m";
    } else {
      return "cr4de_m2e";
    }
  } else {
    if (effectScenario === SCENARIOS.CONSIDERABLE) {
      return "cr4de_e2c";
    } else if (effectScenario === SCENARIOS.MAJOR) {
      return "cr4de_e2m";
    } else {
      return "cr4de_e2e";
    }
  }
}

export function getCascadeInput(ca: DVCascadeAnalysis): CascadeAnalysisInput {
  return {
    cr4de_c2c: ca.cr4de_c2c ? parseInt(ca.cr4de_c2c.slice(2), 10) : null,
    cr4de_c2m: ca.cr4de_c2m ? parseInt(ca.cr4de_c2m.slice(2), 10) : null,
    cr4de_c2e: ca.cr4de_c2e ? parseInt(ca.cr4de_c2e.slice(2), 10) : null,
    cr4de_m2c: ca.cr4de_m2c ? parseInt(ca.cr4de_m2c.slice(2), 10) : null,
    cr4de_m2m: ca.cr4de_m2m ? parseInt(ca.cr4de_m2m.slice(2), 10) : null,
    cr4de_m2e: ca.cr4de_m2e ? parseInt(ca.cr4de_m2e.slice(2), 10) : null,
    cr4de_e2c: ca.cr4de_e2c ? parseInt(ca.cr4de_e2c.slice(2), 10) : null,
    cr4de_e2m: ca.cr4de_e2m ? parseInt(ca.cr4de_e2m.slice(2), 10) : null,
    cr4de_e2e: ca.cr4de_e2e ? parseInt(ca.cr4de_e2e.slice(2), 10) : null,

    cr4de_quali_cascade: ca.cr4de_quali_cascade,
  };
}

export const getAverageCP = (
  causeScenario: SCENARIO_LETTER,
  effect: CascadeCalculation
): number => {
  const ii_s2c = effect[`${causeScenario}2c`] * effect.effect.ti_c;
  const ii_s2m = effect[`${causeScenario}2m`] * effect.effect.ti_m;
  const ii_s2e = effect[`${causeScenario}2e`] * effect.effect.ti_e;

  const ii_tot = 0.0001 + ii_s2c + ii_s2m + ii_s2e;

  return (
    (effect[`${causeScenario}2c`] * ii_s2c +
      effect[`${causeScenario}2m`] * ii_s2m +
      effect[`${causeScenario}2e`] * ii_s2e) /
    ii_tot
  );
};

export const getCascadesCatalogue = (
  riskFiles: DVRiskFile[],
  rc: { [id: string]: SmallRisk },
  cascadeList: DVRiskCascade[]
): CascadeCatalogue => {
  return riskFiles.reduce(
    (acc, rf) => getCascades(rf, acc, rc)(cascadeList),
    {} as CascadeCatalogue
  );
};

export const getCascadesCatalogueNew = (
  riskFiles: DVRiskFile[],
  rc: RiskCatalogue<unknown, RiskSnapshotResults>,
  cascadeList: DVRiskCascade[]
): CascadeSnapshotCatalogue<
  DVRiskSnapshot<unknown, RiskSnapshotResults>,
  DVRiskSnapshot<unknown, RiskSnapshotResults>
> => {
  return riskFiles.reduce(
    (acc, rf) => getCascadesNew(rf, acc, rc)(cascadeList),
    {} as CascadeSnapshotCatalogue<
      DVRiskSnapshot<unknown, RiskSnapshotResults>,
      DVRiskSnapshot<unknown, RiskSnapshotResults>
    >
  );
};

export const getCascadesSnapshotCatalogue = (
  riskFiles: DVRiskSnapshot[],
  rc: RiskCatalogue<unknown, RiskSnapshotResults>,
  cascadeSnapshotList: DVCascadeSnapshot<
    unknown,
    unknown,
    unknown,
    SerializedCauseSnapshotResults,
    SerializedEffectSnapshotResults
  >[]
): CascadeSnapshotCatalogue<
  DVRiskSnapshot<unknown, RiskSnapshotResults>,
  DVRiskSnapshot<unknown, RiskSnapshotResults>
> => {
  const parsedSnapshots = cascadeSnapshotList.map((c) =>
    parseCascadeSnapshot(c)
  );
  return riskFiles.reduce(
    (acc, rf) => getCascadeSnapshots(rf, acc, rc)(parsedSnapshots),
    {} as CascadeSnapshotCatalogue<
      DVRiskSnapshot<unknown, RiskSnapshotResults>,
      DVRiskSnapshot<unknown, RiskSnapshotResults>
    >
  );
};

export const getParsedCascadeSnapshots = (
  cascadeSnapshotList: DVCascadeSnapshot<
    unknown,
    unknown,
    unknown,
    SerializedCauseSnapshotResults,
    SerializedEffectSnapshotResults
  >[],
  riskSnapshotCatalogue: RiskCatalogue
): DVCascadeSnapshot<unknown, DVRiskSnapshot, DVRiskSnapshot>[] => {
  return cascadeSnapshotList.map((c) => ({
    ...c,
    cr4de_cause_risk: riskSnapshotCatalogue[c._cr4de_cause_risk_value],
    cr4de_effect_risk: riskSnapshotCatalogue[c._cr4de_effect_risk_value],
    cr4de_quanti_cause: JSON.parse(c.cr4de_quanti_cause),
    cr4de_quanti_effect: JSON.parse(c.cr4de_quanti_effect),
  }));
};

export const getParsedCascadesSnapshotCatalogue = (
  riskFiles: DVRiskSnapshot[],
  rc: RiskCatalogue<unknown, RiskSnapshotResults>,
  cascadeSnapshotList: DVCascadeSnapshot<
    unknown,
    unknown,
    unknown,
    CauseSnapshotResults,
    EffectSnapshotResults
  >[]
): CascadeSnapshotCatalogue<
  DVRiskSnapshot<unknown, RiskSnapshotResults>,
  DVRiskSnapshot<unknown, RiskSnapshotResults>
> => {
  return riskFiles.reduce(
    (acc, rf) => getCascadeSnapshots(rf, acc, rc)(cascadeSnapshotList),
    {} as CascadeSnapshotCatalogue<
      DVRiskSnapshot<unknown, RiskSnapshotResults>,
      DVRiskSnapshot<unknown, RiskSnapshotResults>
    >
  );
};

export const getCascades =
  (
    riskFile: DVRiskFile,
    cs: { [riskId: string]: Cascades },
    hc: { [id: string]: SmallRisk }
  ) =>
  (rcResult: DVRiskCascade[]) => {
    return {
      ...cs,
      [riskFile.cr4de_riskfilesid]: getRiskCascades(riskFile, rcResult, hc),
    };
  };

export const getCascadesNew =
  (
    riskFile: DVRiskFile,
    cs: { [riskId: string]: CascadeSnapshots },
    hc: RiskCatalogue<unknown, RiskSnapshotResults>
  ) =>
  (rcResult: DVRiskCascade[]) => {
    return {
      ...cs,
      [riskFile.cr4de_riskfilesid]: getRiskCascadesNew(riskFile, rcResult, hc),
    } as CascadeSnapshotCatalogue<
      DVRiskSnapshot<unknown, RiskSnapshotResults>,
      DVRiskSnapshot<unknown, RiskSnapshotResults>
    >;
  };

export function getCascadeSnapshots(
  riskSnapshot: DVRiskSnapshot,
  cs: CascadeSnapshotCatalogue<
    DVRiskSnapshot<unknown, RiskSnapshotResults>,
    DVRiskSnapshot<unknown, RiskSnapshotResults>
  >,
  hc: RiskCatalogue<unknown, RiskSnapshotResults>
) {
  return (rcResult: DVCascadeSnapshot[]) => {
    return {
      ...cs,
      [riskSnapshot._cr4de_risk_file_value]: getRiskCascadeSnapshots(
        riskSnapshot,
        rcResult,
        hc
      ),
    } as CascadeSnapshotCatalogue<
      DVRiskSnapshot<unknown, RiskSnapshotResults>,
      DVRiskSnapshot<unknown, RiskSnapshotResults>
    >;
  };
}

export const getRiskCascades = (
  riskFile: DVRiskFile,
  cascades: DVRiskCascade[],
  hc: { [id: string]: SmallRisk }
): Cascades => {
  const causes = getCauses(riskFile, cascades, hc);
  const effects = getEffects(riskFile, cascades, hc);
  const catalyzingEffects = getCatalyzingEffects(riskFile, cascades, hc, false);
  const climateChange = getClimateChange(riskFile, cascades, hc);

  return {
    all: [...causes, ...effects, ...catalyzingEffects],
    causes,
    effects,
    catalyzingEffects,
    climateChange,
  };
};

export const getRiskCascadesNew = (
  riskFile: DVRiskFile,
  cascades: DVRiskCascade[],
  hc: RiskCatalogue<unknown, RiskSnapshotResults>
): CascadeSnapshots<DVRiskSnapshot, DVRiskSnapshot> => {
  const causes = getCausesNew({ riskFile, cascades, hazardCatalogue: hc });
  const effects = getEffectsNew({ riskFile, cascades, hazardCatalogue: hc });
  const catalyzingEffects = getCatalyzingEffectsNew(
    { riskFile, cascades, hazardCatalogue: hc },
    false
  );
  const climateChange = getClimateChangeNew({
    riskFile,
    cascades,
    hazardCatalogue: hc,
  });

  return {
    all: [...causes, ...effects, ...catalyzingEffects],
    causes,
    effects,
    catalyzingEffects,
    climateChange,
  };
};

export function getRiskCascadeSnapshots(
  riskSnapshot: DVRiskSnapshot,
  cascades: DVCascadeSnapshot[],
  riskCatalogue: RiskCatalogue<unknown, RiskSnapshotResults>
): CascadeSnapshots<
  DVRiskSnapshot,
  DVRiskSnapshot,
  CauseSnapshotResults,
  EffectSnapshotResults
> {
  const causes = getCausesNew({
    riskFile: riskSnapshot,
    cascades,
    hazardCatalogue: riskCatalogue,
  });
  const effects = getEffectsNew({
    riskFile: riskSnapshot,
    cascades,
    hazardCatalogue: riskCatalogue,
  });
  const catalyzingEffects = getCatalyzingEffectsNew(
    {
      riskFile: riskSnapshot,
      cascades,
      hazardCatalogue: riskCatalogue,
    },
    false
  );
  const climateChange = getClimateChangeNew({
    riskFile: riskSnapshot,
    cascades,
    hazardCatalogue: riskCatalogue,
  });

  return {
    all: [...causes, ...effects, ...catalyzingEffects],
    causes,
    effects,
    catalyzingEffects,
    climateChange,
  };
}
