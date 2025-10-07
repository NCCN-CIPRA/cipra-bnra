// The functions is this file take the calculated results in the
// risk files and save them into the corresponding snaphot
// database models.
//
// These snapshots contain the actual data that is published
// to non-CIPRA users in the BNRA web application and should
// thus only be updated when a new release of the BNRA
// results is wanted

import {
  CPMatrix,
  DVCascadeSnapshot,
  serializeCauseSnapshotResults,
  serializeCPMatrix,
  SerializedCauseSnapshotResults,
  SerializedCPMatrix,
  SerializedEffectSnapshotResults,
  serializeEffectSnapshotResults,
} from "../types/dataverse/DVCascadeSnapshot";
import {
  CASCADE_RESULT_SNAPSHOT,
  CPMatrixCauseRow,
  CPMatrixEffectRow,
  DVRiskCascade,
} from "../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import {
  DVRiskSnapshot,
  parseRiskSnapshot,
  RiskSnapshotResults,
  RiskSnapshotScenarioResults,
  SerializedRiskSnapshotResults,
  serializeRiskSnapshotResults,
  serializeRiskSnapshotScenarios,
} from "../types/dataverse/DVRiskSnapshot";
import { DVRiskSummary } from "../types/dataverse/DVRiskSummary";
import {
  RISK_TYPE,
  SerializedRiskQualis,
  serializeRiskQualis,
  UnparsedRiskFields,
} from "../types/dataverse/Riskfile";
import { getCPMatrixFromOldFormat } from "./analysis/cp";
import {
  Cascades,
  getCascades,
  getCausesWithDP,
  getEffectsWithDI,
} from "./cascades";
import {
  getCategoryImpactRescaled,
  getDamageIndicatorToCategoryImpactRatio,
} from "./CategoryImpact";
import { getAbsoluteImpact } from "./Impact";
import { diScale5FromEuros } from "./indicators/impact";
import {
  pScale5FromReturnPeriodMonths,
  returnPeriodMonthsFromPDaily,
} from "./indicators/probability";
import {
  getDailyProbability,
  getYearlyProbabilityFromRelative,
} from "./Probability";
import {
  getScenarioParameter,
  getScenarioSuffix,
  SCENARIOS,
} from "./scenarios";
import { getTotalImpactAbsolute } from "./TotalImpact";

const scenarios = [SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, SCENARIOS.EXTREME];

export function getCascadeResultSnapshot(
  cascade: DVRiskCascade
): CASCADE_RESULT_SNAPSHOT | null {
  if (
    cascade.cr4de_result_snapshot === null ||
    cascade.cr4de_result_snapshot === ""
  )
    return null;

  return JSON.parse(cascade.cr4de_result_snapshot);
}

const r = (v: number | null | undefined, p: number = 100) =>
  v ? Math.round(v * p) / p : 0;

export function updateSnapshots(
  summaries: DVRiskSummary<unknown, UnparsedRiskFields>[],
  riskSnapshots: DVRiskSnapshot<
    unknown,
    SerializedRiskSnapshotResults,
    SerializedRiskQualis
  >[],
  cascadesSnapshots: DVCascadeSnapshot<
    unknown,
    unknown,
    unknown,
    SerializedCauseSnapshotResults,
    SerializedEffectSnapshotResults,
    SerializedCPMatrix
  >[],
  riskFiles: DVRiskFile[],
  cascades: DVRiskCascade[],
  realSnapshot: boolean
): {
  updatedSummaries: Partial<DVRiskSummary<unknown, UnparsedRiskFields>>[];
  updatedRiskSnapshots: Partial<
    DVRiskSnapshot<unknown, SerializedRiskSnapshotResults, SerializedRiskQualis>
  >[];
  updatedCascadesSnapshots: Partial<
    DVCascadeSnapshot<
      unknown,
      unknown,
      unknown,
      SerializedCauseSnapshotResults,
      SerializedEffectSnapshotResults,
      SerializedCPMatrix
    >
  >[];
} {
  const newSummaries: Partial<DVRiskSummary<unknown, UnparsedRiskFields>>[] =
    [];
  const newRiskSnapshots: Partial<
    DVRiskSnapshot<unknown, SerializedRiskSnapshotResults, SerializedRiskQualis>
  >[] = [];
  const updatedSummaries: Partial<
    DVRiskSummary<unknown, UnparsedRiskFields>
  >[] = [];
  const updatedRiskSnapshots: Partial<
    DVRiskSnapshot<unknown, SerializedRiskSnapshotResults, SerializedRiskQualis>
  >[] = [];
  const cascadeSnapshotDict: {
    [cascadeId: string]: Partial<
      DVCascadeSnapshot<
        unknown,
        unknown,
        unknown,
        SerializedCauseSnapshotResults,
        SerializedEffectSnapshotResults,
        SerializedCPMatrix
      >
    >;
  } = cascadesSnapshots.reduce(
    (acc, el) => ({
      ...acc,
      [el._cr4de_risk_cascade_value]: el,
    }),
    {}
  );

  for (const rf of riskFiles) {
    if (!rf.results) {
      if (rf.cr4de_result_snapshot) {
        rf.results = JSON.parse(rf.cr4de_result_snapshot);
      }
    }
  }

  const hc: { [key: string]: DVRiskFile } = riskFiles.reduce(
    (acc, sr) => ({ ...acc, [sr.cr4de_riskfilesid]: sr }),
    {}
  );
  const riskCascades: DVRiskCascade<DVRiskFile, DVRiskFile>[] = cascades
    .map((c) => ({
      ...c,
      cr4de_cause_hazard: hc[c._cr4de_cause_hazard_value],
      cr4de_effect_hazard: hc[c._cr4de_effect_hazard_value],
      results: getCascadeResultSnapshot(c),
    }))
    .filter((c) => c.cr4de_cause_hazard && c.cr4de_effect_hazard);

  const cascadeDict = riskFiles.reduce(
    (acc, rf) => getCascades(rf, acc, hc)(riskCascades),
    {} as { [key: string]: Cascades }
  );

  for (const rf of riskFiles) {
    const { newSummary, updatedSummary, newRiskSnapshot, updatedRiskSnapshot } =
      updateSnapshot(
        summaries,
        riskSnapshots,
        cascadeSnapshotDict,
        rf,
        cascadeDict[rf.cr4de_riskfilesid],
        realSnapshot
      );
    if (newSummary) newSummaries.push(newSummary);
    if (newRiskSnapshot) newRiskSnapshots.push(newRiskSnapshot);
    if (updatedSummary) updatedSummaries.push(updatedSummary);
    if (updatedRiskSnapshot) updatedRiskSnapshots.push(updatedRiskSnapshot);
  }

  return {
    updatedSummaries: [...updatedSummaries, ...newSummaries],
    updatedRiskSnapshots: [...updatedRiskSnapshots, ...newRiskSnapshots],
    updatedCascadesSnapshots: Object.values(cascadeSnapshotDict),
  };
}

function updateSnapshot(
  summaries: DVRiskSummary<unknown, UnparsedRiskFields>[],
  riskSnapshots: DVRiskSnapshot<
    unknown,
    SerializedRiskSnapshotResults,
    SerializedRiskQualis
  >[],
  cascadesSnapshots: {
    [cascadeId: string]: Partial<
      DVCascadeSnapshot<
        unknown,
        unknown,
        unknown,
        SerializedCauseSnapshotResults,
        SerializedEffectSnapshotResults,
        SerializedCPMatrix
      >
    >;
  },
  riskFile: DVRiskFile,
  cascades: Cascades,
  realSnapshot: boolean
) {
  const existingSummary: Partial<DVRiskSummary<unknown, UnparsedRiskFields>> =
    summaries.find(
      (s) => s._cr4de_risk_file_value == riskFile.cr4de_riskfilesid
    ) || {};
  const existingSnapshot: Partial<
    DVRiskSnapshot<unknown, SerializedRiskSnapshotResults, SerializedRiskQualis>
  > =
    riskSnapshots.find(
      (s) => s._cr4de_risk_file_value == riskFile.cr4de_riskfilesid
    ) || {};

  const updatedSummary = summaryFromRiskfile(riskFile, cascades);
  if (existingSummary.cr4de_bnrariskfilesummaryid) {
    updatedSummary.cr4de_bnrariskfilesummaryid =
      existingSummary.cr4de_bnrariskfilesummaryid;
  }

  const updatedSnapshot = snapshotFromRiskfile(riskFile);
  if (existingSnapshot.cr4de_bnrariskfilesnapshotid) {
    updatedSnapshot.cr4de_bnrariskfilesnapshotid =
      existingSnapshot.cr4de_bnrariskfilesnapshotid;
  }

  // for (const cause of cascades.causes) {

  // const updatedSnapshot = snapshotFromRiskfile(riskFile);
  //   const updatedCauseSnapshot = snapshotFromRiskCascade(cause);
  //   if (cascadesSnapshots[cause.cr4de_bnrariskcascadeid]) {
  //     updatedCauseSnapshot.cr4de_bnrariskcascadesnapshotid =
  //       cascadesSnapshots[cause.cr4de_bnrariskcascadeid]
  //         .cr4de_bnrariskcascadesnapshotid || "";
  //   }
  //   cascadesSnapshots[cause.cr4de_bnrariskcascadeid] = updatedCauseSnapshot;
  // }

  for (const effect of cascades.effects) {
    const updatedEffectSnapshot = snapshotFromRiskCascade(
      parseRiskSnapshot(updatedSnapshot),
      effect,
      realSnapshot
    );

    if (cascadesSnapshots[effect.cr4de_bnrariskcascadeid]) {
      updatedEffectSnapshot.cr4de_bnrariskcascadesnapshotid =
        cascadesSnapshots[effect.cr4de_bnrariskcascadeid]
          .cr4de_bnrariskcascadesnapshotid || "";
    }
    cascadesSnapshots[effect.cr4de_bnrariskcascadeid] = updatedEffectSnapshot;
  }

  const summaryHasUpdates = true;
  const snapshotHasUpdates = true;

  return {
    newSummary: updatedSummary.cr4de_bnrariskfilesummaryid
      ? undefined
      : updatedSummary,
    updatedSummary:
      updatedSummary.cr4de_bnrariskfilesummaryid && summaryHasUpdates
        ? updatedSummary
        : undefined,
    newRiskSnapshot: updatedSnapshot.cr4de_bnrariskfilesnapshotid
      ? undefined
      : updatedSnapshot,
    updatedRiskSnapshot:
      updatedSnapshot.cr4de_bnrariskfilesnapshotid && snapshotHasUpdates
        ? updatedSnapshot
        : undefined,
  };
}

function getSerializedRiskSnapshotResults(riskFile: DVRiskFile) {
  return serializeRiskSnapshotResults(
    scenarios.reduce((res, s) => {
      const suff = getScenarioSuffix(s);

      const tp_rel = riskFile.results?.[s]?.TP || 0;
      const tp = getDailyProbability(getYearlyProbabilityFromRelative(tp_rel));

      const tp50_rel = riskFile.results?.[s]?.TP50 || 0;
      const tp50 = getDailyProbability(
        getYearlyProbabilityFromRelative(tp50_rel)
      );

      const ti_rel = riskFile.results?.[s].TI || 0;
      const ti = getTotalImpactAbsolute(ti_rel);

      const scenarioResult: RiskSnapshotScenarioResults = {
        tp: {
          yearly: {
            scale: tp_rel,
          },
          scale5TP: tp_rel,
          rpMonths: r(returnPeriodMonthsFromPDaily(tp)),
        },
        tp50: {
          yearly: {
            scale: tp50_rel,
          },
          scale5TP: tp50_rel,
          rpMonths: r(returnPeriodMonthsFromPDaily(tp50)),
        },

        dp: {
          scaleTot: r(riskFile.results?.[s]?.DP),
          scale: pScale5FromReturnPeriodMonths(
            returnPeriodMonthsFromPDaily(
              ((riskFile.results?.[s]?.DP || 0) / tp_rel) * tp
            )
          ),
          scale5TP: r(riskFile.results?.[s]?.DP),
          scale5: pScale5FromReturnPeriodMonths(
            returnPeriodMonthsFromPDaily(
              ((riskFile.results?.[s]?.DP || 0) / tp_rel) * tp
            )
          ),
          rpMonths: r(
            returnPeriodMonthsFromPDaily(
              ((riskFile.results?.[s]?.DP || 0) / tp_rel) * tp
            )
          ),
        },
        // TODO: Something with DP50_offset
        dp50: {
          scaleTot: r(riskFile.results?.[s]?.DP50),
          scale: pScale5FromReturnPeriodMonths(
            returnPeriodMonthsFromPDaily(
              ((riskFile.results?.[s]?.DP50 || 0) / tp50_rel) * tp50
            )
          ),
          scale5TP: r(riskFile.results?.[s]?.DP50),
          scale5: pScale5FromReturnPeriodMonths(
            returnPeriodMonthsFromPDaily(
              ((riskFile.results?.[s]?.DP50 || 0) / tp50_rel) * tp50
            )
          ),
          rpMonths: r(
            returnPeriodMonthsFromPDaily(
              ((riskFile.results?.[s]?.DP50 || 0) / tp50_rel) * tp50
            )
          ),
        },

        // Motivation is set to 0 because in the new way of calculating
        // the motivation of an actor is included in the CP estimations.
        m: {
          p: 0,
          scale: 0,
          scaleTot: 0,
        },

        ti: {
          all: {
            scaleTot: r(ti_rel),
            scale5TI: r(ti_rel),
            euros: Math.round(ti),
          },
          // TODO: all category scales
          h: {
            scaleTot: r(riskFile.results?.[s]?.TI_H),
            scaleCat: r(getCategoryImpactRescaled(riskFile, "H", s)),

            scale5TI: r(riskFile.results?.[s]?.TI_H),
            scale5Cat: r(getCategoryImpactRescaled(riskFile, "H", s)),
            euros: Math.round(
              ((riskFile.results?.[s]?.TI_H || 0) * ti) / ti_rel
            ),
          },
          ha: {
            scaleTot: r(riskFile.results?.[s]?.TI_Ha),
            scaleCatRel: r(
              getDamageIndicatorToCategoryImpactRatio(riskFile, "Ha", s)
            ),
            abs: Math.round(
              ((riskFile.results?.[s].TI_Ha_abs || 0) * ti) / ti_rel
            ),
            scale5TI: r(riskFile.results?.[s]?.TI_Ha),
            scale5CatRel: r(
              getDamageIndicatorToCategoryImpactRatio(riskFile, "Ha", s)
            ),
            euros: Math.round(
              ((riskFile.results?.[s].TI_Ha_abs || 0) * ti) / ti_rel
            ),
          },
          hb: {
            scaleTot: r(riskFile.results?.[s]?.TI_Hb),
            scaleCatRel: r(
              getDamageIndicatorToCategoryImpactRatio(riskFile, "Hb", s)
            ),
            abs: Math.round(
              ((riskFile.results?.[s].TI_Hb_abs || 0) * ti) / ti_rel
            ),
            scale5TI: r(riskFile.results?.[s]?.TI_Hb),
            scale5CatRel: r(
              getDamageIndicatorToCategoryImpactRatio(riskFile, "Hb", s)
            ),
            euros: Math.round(
              ((riskFile.results?.[s].TI_Hb_abs || 0) * ti) / ti_rel
            ),
          },
          hc: {
            scaleTot: r(riskFile.results?.[s]?.TI_Hc),
            scaleCatRel: r(
              getDamageIndicatorToCategoryImpactRatio(riskFile, "Hc", s)
            ),
            abs: Math.round(
              ((riskFile.results?.[s].TI_Hc_abs || 0) * ti) / ti_rel
            ),
            scale5TI: r(riskFile.results?.[s]?.TI_Hc),
            scale5CatRel: r(
              getDamageIndicatorToCategoryImpactRatio(riskFile, "Hc", s)
            ),
            euros: Math.round(
              ((riskFile.results?.[s].TI_Hc_abs || 0) * ti) / ti_rel
            ),
          },
          s: {
            scaleTot: r(riskFile.results?.[s]?.TI_S),
            scaleCat: r(getCategoryImpactRescaled(riskFile, "S", s)),

            scale5TI: r(riskFile.results?.[s]?.TI_S),
            scale5Cat: r(getCategoryImpactRescaled(riskFile, "S", s)),
            euros: Math.round((riskFile.results?.[s]?.TI_S || 0) * ti) / ti_rel,
          },
          sa: {
            scaleTot: r(riskFile.results?.[s]?.TI_Sa),
            scaleCatRel: r(
              getDamageIndicatorToCategoryImpactRatio(riskFile, "Sa", s)
            ),
            abs: Math.round(
              ((riskFile.results?.[s].TI_Sa_abs || 0) * ti) / ti_rel
            ),
            scale5TI: r(riskFile.results?.[s]?.TI_Sa),
            scale5CatRel: r(
              getDamageIndicatorToCategoryImpactRatio(riskFile, "Sa", s)
            ),
            euros: Math.round(
              ((riskFile.results?.[s].TI_Sa_abs || 0) * ti) / ti_rel
            ),
          },
          sb: {
            scaleTot: r(riskFile.results?.[s]?.TI_Sb),
            scaleCatRel: r(
              getDamageIndicatorToCategoryImpactRatio(riskFile, "Sb", s)
            ),
            abs: Math.round(
              ((riskFile.results?.[s].TI_Sb_abs || 0) * ti) / ti_rel
            ),
            scale5TI: r(riskFile.results?.[s]?.TI_Sb),
            scale5CatRel: r(
              getDamageIndicatorToCategoryImpactRatio(riskFile, "Sb", s)
            ),
            euros: Math.round(
              ((riskFile.results?.[s].TI_Sb_abs || 0) * ti) / ti_rel
            ),
          },
          sc: {
            scaleTot: r(riskFile.results?.[s]?.TI_Sc),
            scaleCatRel: r(
              getDamageIndicatorToCategoryImpactRatio(riskFile, "Sc", s)
            ),
            abs: Math.round(
              ((riskFile.results?.[s].TI_Sc_abs || 0) * ti) / ti_rel
            ),
            scale5TI: r(riskFile.results?.[s]?.TI_Sc),
            scale5CatRel: r(
              getDamageIndicatorToCategoryImpactRatio(riskFile, "Sc", s)
            ),
            euros: Math.round(
              ((riskFile.results?.[s].TI_Sc_abs || 0) * ti) / ti_rel
            ),
          },
          sd: {
            scaleTot: r(riskFile.results?.[s]?.TI_Sd),
            scaleCatRel: r(
              getDamageIndicatorToCategoryImpactRatio(riskFile, "Sd", s)
            ),
            abs: Math.round(
              ((riskFile.results?.[s].TI_Sd_abs || 0) * ti) / ti_rel
            ),
            scale5TI: r(riskFile.results?.[s]?.TI_Sd),
            scale5CatRel: r(
              getDamageIndicatorToCategoryImpactRatio(riskFile, "Sd", s)
            ),
            euros: Math.round(
              ((riskFile.results?.[s].TI_Sd_abs || 0) * ti) / ti_rel
            ),
          },
          e: {
            scaleTot: r(riskFile.results?.[s]?.TI_E),
            scaleCat: r(getCategoryImpactRescaled(riskFile, "E", s)),

            scale5TI: r(riskFile.results?.[s]?.TI_E),
            scale5Cat: r(getCategoryImpactRescaled(riskFile, "E", s)),
            euros: Math.round(
              ((riskFile.results?.[s]?.TI_E || 0) * ti) / ti_rel
            ),
          },
          ea: {
            scaleTot: r(riskFile.results?.[s]?.TI_Ea),
            scaleCatRel: r(
              getDamageIndicatorToCategoryImpactRatio(riskFile, "Ea", s)
            ),
            abs: Math.round(
              ((riskFile.results?.[s].TI_Ea_abs || 0) * ti) / ti_rel
            ),
            scale5TI: r(riskFile.results?.[s]?.TI_Ea),
            scale5CatRel: r(
              getDamageIndicatorToCategoryImpactRatio(riskFile, "Ea", s)
            ),
            euros: Math.round(
              ((riskFile.results?.[s].TI_Ea_abs || 0) * ti) / ti_rel
            ),
          },
          f: {
            scaleTot: r(riskFile.results?.[s]?.TI_F),
            scaleCat: r(getCategoryImpactRescaled(riskFile, "F", s)),

            scale5TI: r(riskFile.results?.[s]?.TI_F),
            scale5Cat: r(getCategoryImpactRescaled(riskFile, "F", s)),
            euros: Math.round(
              ((riskFile.results?.[s]?.TI_F || 0) * ti) / ti_rel
            ),
          },
          fa: {
            scaleTot: r(riskFile.results?.[s]?.TI_Fa),
            scaleCatRel: r(
              getDamageIndicatorToCategoryImpactRatio(riskFile, "Fa", s)
            ),
            abs: Math.round(
              ((riskFile.results?.[s].TI_Fa_abs || 0) * ti) / ti_rel
            ),
            scale5TI: r(riskFile.results?.[s]?.TI_Fa),
            scale5CatRel: r(
              getDamageIndicatorToCategoryImpactRatio(riskFile, "Fa", s)
            ),
            euros: Math.round(
              ((riskFile.results?.[s].TI_Fa_abs || 0) * ti) / ti_rel
            ),
          },
          fb: {
            scaleTot: r(riskFile.results?.[s]?.TI_Fb),
            scaleCatRel: r(
              getDamageIndicatorToCategoryImpactRatio(riskFile, "Fb", s)
            ),
            abs: Math.round(
              ((riskFile.results?.[s].TI_Fb_abs || 0) * ti) / ti_rel
            ),
            scale5TI: r(riskFile.results?.[s]?.TI_Fb),
            scale5CatRel: r(
              getDamageIndicatorToCategoryImpactRatio(riskFile, "Fb", s)
            ),
            euros: Math.round(
              ((riskFile.results?.[s].TI_Fb_abs || 0) * ti) / ti_rel
            ),
          },
        },
        di: {
          all: {
            scaleTot: getScenarioParameter(riskFile, "DI", s) || 0,
          },
          ha: {
            scaleTot: getScenarioParameter(riskFile, "DI_Ha", s) || 0,
            abs: getAbsoluteImpact(riskFile[`cr4de_di_quanti_ha${suff}`]),

            scale5TI: getScenarioParameter(riskFile, "DI_Ha", s) || 0,
            scale5: diScale5FromEuros(
              ((getScenarioParameter(riskFile, "DI_Ha", s) || 0) * ti) / ti_rel
            ),
            euros: r(
              ((getScenarioParameter(riskFile, "DI_Ha", s) || 0) * ti) / ti_rel,
              1
            ),
          },
          hb: {
            scaleTot: getScenarioParameter(riskFile, "DI_Hb", s) || 0,
            abs: getAbsoluteImpact(riskFile[`cr4de_di_quanti_hb${suff}`]),

            scale5TI: getScenarioParameter(riskFile, "DI_Hb", s) || 0,
            scale5: diScale5FromEuros(
              ((getScenarioParameter(riskFile, "DI_Hb", s) || 0) * ti) / ti_rel
            ),
            euros: r(
              ((getScenarioParameter(riskFile, "DI_Hb", s) || 0) * ti) / ti_rel,
              1
            ),
          },
          hc: {
            scaleTot: getScenarioParameter(riskFile, "DI_Hc", s) || 0,
            abs: getAbsoluteImpact(riskFile[`cr4de_di_quanti_hc${suff}`]),

            scale5TI: getScenarioParameter(riskFile, "DI_Hc", s) || 0,
            scale5: diScale5FromEuros(
              ((getScenarioParameter(riskFile, "DI_Hc", s) || 0) * ti) / ti_rel
            ),
            euros: r(
              ((getScenarioParameter(riskFile, "DI_Hc", s) || 0) * ti) / ti_rel,
              1
            ),
          },
          sa: {
            scaleTot: getScenarioParameter(riskFile, "DI_Sa", s) || 0,
            abs: getAbsoluteImpact(riskFile[`cr4de_di_quanti_sa${suff}`]),

            scale5TI: getScenarioParameter(riskFile, "DI_Sa", s) || 0,
            scale5: diScale5FromEuros(
              ((getScenarioParameter(riskFile, "DI_Sa", s) || 0) * ti) / ti_rel
            ),
            euros: r(
              ((getScenarioParameter(riskFile, "DI_Sa", s) || 0) * ti) / ti_rel,
              1
            ),
          },
          sb: {
            scaleTot: getScenarioParameter(riskFile, "DI_Sb", s) || 0,
            abs: getAbsoluteImpact(riskFile[`cr4de_di_quanti_sb${suff}`]),

            scale5TI: getScenarioParameter(riskFile, "DI_Sb", s) || 0,
            scale5: diScale5FromEuros(
              ((getScenarioParameter(riskFile, "DI_Sb", s) || 0) * ti) / ti_rel
            ),
            euros: r(
              ((getScenarioParameter(riskFile, "DI_Sb", s) || 0) * ti) / ti_rel,
              1
            ),
          },
          sc: {
            scaleTot: getScenarioParameter(riskFile, "DI_Sc", s) || 0,
            abs: getAbsoluteImpact(riskFile[`cr4de_di_quanti_sc${suff}`]),

            scale5TI: getScenarioParameter(riskFile, "DI_Sc", s) || 0,
            scale5: diScale5FromEuros(
              ((getScenarioParameter(riskFile, "DI_Sc", s) || 0) * ti) / ti_rel
            ),
            euros: r(
              ((getScenarioParameter(riskFile, "DI_Sc", s) || 0) * ti) / ti_rel,
              1
            ),
          },
          sd: {
            scaleTot: getScenarioParameter(riskFile, "DI_Sd", s) || 0,
            abs: getAbsoluteImpact(riskFile[`cr4de_di_quanti_sd${suff}`]),

            scale5TI: getScenarioParameter(riskFile, "DI_Sd", s) || 0,
            scale5: diScale5FromEuros(
              ((getScenarioParameter(riskFile, "DI_Sd", s) || 0) * ti) / ti_rel
            ),
            euros: r(
              ((getScenarioParameter(riskFile, "DI_Sd", s) || 0) * ti) / ti_rel,
              1
            ),
          },
          ea: {
            scaleTot: getScenarioParameter(riskFile, "DI_Ea", s) || 0,
            abs: getAbsoluteImpact(riskFile[`cr4de_di_quanti_ea${suff}`]),

            scale5TI: getScenarioParameter(riskFile, "DI_Ea", s) || 0,
            scale5: diScale5FromEuros(
              ((getScenarioParameter(riskFile, "DI_Ea", s) || 0) * ti) / ti_rel
            ),
            euros: r(
              ((getScenarioParameter(riskFile, "DI_Ea", s) || 0) * ti) / ti_rel,
              1
            ),
          },
          fa: {
            scaleTot: getScenarioParameter(riskFile, "DI_Fa", s) || 0,
            abs: getAbsoluteImpact(riskFile[`cr4de_di_quanti_fa${suff}`]),

            scale5TI: getScenarioParameter(riskFile, "DI_Fa", s) || 0,
            scale5: diScale5FromEuros(
              ((getScenarioParameter(riskFile, "DI_Fa", s) || 0) * ti) / ti_rel
            ),
            euros: r(
              ((getScenarioParameter(riskFile, "DI_Fa", s) || 0) * ti) / ti_rel,
              1
            ),
          },
          fb: {
            scaleTot: getScenarioParameter(riskFile, "DI_Fb", s) || 0,
            abs: getAbsoluteImpact(riskFile[`cr4de_di_quanti_fb${suff}`]),

            scale5TI: getScenarioParameter(riskFile, "DI_Fb", s) || 0,
            scale5: diScale5FromEuros(
              ((getScenarioParameter(riskFile, "DI_Fb", s) || 0) * ti) / ti_rel
            ),
            euros: r(
              ((getScenarioParameter(riskFile, "DI_Fb", s) || 0) * ti) / ti_rel,
              1
            ),
          },
        },
      };

      return {
        ...res,
        [s]: scenarioResult,
      };
    }, {} as RiskSnapshotResults)
  );
}

export function getSerializedQualiResults(riskFile: DVRiskFile) {
  if (riskFile.cr4de_quali !== null && riskFile.cr4de_quali !== "") {
    return riskFile.cr4de_quali;
  }

  return serializeRiskQualis({
    considerable: {
      dp: riskFile.cr4de_dp_quali_c || "",
      h: riskFile.cr4de_di_quali_h_c || "",
      s: riskFile.cr4de_di_quali_s_c || "",
      e: riskFile.cr4de_di_quali_e_c || "",
      f: riskFile.cr4de_di_quali_f_c || "",
      cb: riskFile.cr4de_cross_border_impact_quali_c || "",
    },
    major: {
      dp: riskFile.cr4de_dp_quali_m || "",
      h: riskFile.cr4de_di_quali_h_m || "",
      s: riskFile.cr4de_di_quali_s_m || "",
      e: riskFile.cr4de_di_quali_e_m || "",
      f: riskFile.cr4de_di_quali_f_m || "",
      cb: riskFile.cr4de_cross_border_impact_quali_m || "",
    },
    extreme: {
      dp: riskFile.cr4de_dp_quali_e || "",
      h: riskFile.cr4de_di_quali_h_e || "",
      s: riskFile.cr4de_di_quali_s_e || "",
      e: riskFile.cr4de_di_quali_e_e || "",
      f: riskFile.cr4de_di_quali_f_e || "",
      cb: riskFile.cr4de_cross_border_impact_quali_e || "",
    },
  });
}

export function summaryFromRiskfile(
  riskFile: DVRiskFile,
  cascades: Cascades,
  showOther: boolean = false
): DVRiskSummary {
  const scenario = riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE;
  const causes = getCausesWithDP(riskFile, cascades, scenario).sort(
    (a, b) => b.p - a.p
  );
  const effects = getEffectsWithDI(riskFile, cascades, scenario).sort(
    (a, b) => b.i - a.i
  );

  let minP = 0;
  let cumulP = 0;

  const Ptot = riskFile.results ? riskFile.results[scenario].TP : 0.000001;

  if (riskFile.results) {
    for (const c of causes) {
      cumulP += c.p / Ptot;

      if (cumulP >= 0.805) {
        minP = c.p;
        break;
      }
    }
  }
  const selectedCauses = causes
    .filter((c) => c.p >= minP)
    .map((c) => ({
      cause_risk_id: "id" in c ? c.id : null,
      cause_risk_title: "id" in c ? c.name : "No underlying cause",
      cause_risk_p: c.p / Ptot,
    }));
  const otherCauses =
    selectedCauses.length < causes.length
      ? [
          {
            cause_risk_id: null,
            cause_risk_title: "Other causes",
            cause_risk_p:
              causes
                .filter((c) => c.p < minP)
                .reduce((otherP, c) => otherP + c.p, 0) / Ptot,
            other_causes: showOther
              ? causes
                  .filter((c) => c.p < minP)
                  .map((c) => ({
                    cause_risk_id: "id" in c ? c.id : null,
                    cause_risk_title:
                      "id" in c ? c.name : "No underlying cause",
                    cause_risk_p: c.p / Ptot,
                  }))
              : undefined,
          },
        ]
      : [];

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
      effect_risk_id: "id" in e ? e.id : null,
      effect_risk_title: e.name,
      effect_risk_i: e.i / Itot,
    }));

  const otherEffects =
    selectedEffects.length < effects.length
      ? [
          {
            effect_risk_id: null,
            effect_risk_title: "Other effects",
            effect_risk_i:
              effects
                .filter((c) => c.i < minI)
                .reduce((otherI, c) => otherI + c.i, 0) / Itot,
            other_effects: showOther
              ? effects
                  .filter((c) => c.i < minI)
                  .map((e) => ({
                    effect_risk_id: "id" in e ? e.id : null,
                    effect_risk_title: e.name,
                    effect_risk_i: e.i / Itot,
                  }))
              : undefined,
          },
        ]
      : [];

  return {
    cr4de_bnrariskfilesummaryid: "",

    "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`,
    _cr4de_risk_file_value: riskFile.cr4de_riskfilesid,
    cr4de_risk_file: riskFile,

    cr4de_hazard_id: riskFile.cr4de_hazard_id,
    cr4de_title: riskFile.cr4de_title,
    cr4de_risk_type: riskFile.cr4de_risk_type,
    cr4de_category: riskFile.cr4de_risk_category,
    cr4de_key_risk: riskFile.cr4de_key_risk,

    cr4de_label_hilp: riskFile.cr4de_label_hilp || false,
    cr4de_label_cc: riskFile.cr4de_label_cc || false,
    cr4de_label_cb: riskFile.cr4de_label_cb || false,
    cr4de_label_impact: riskFile.cr4de_label_impact,

    cr4de_definition: riskFile.cr4de_definition,
    cr4de_horizon_analysis: riskFile.cr4de_horizon_analysis,
    cr4de_historical_events: riskFile.cr4de_historical_events,
    cr4de_intensity_parameters: riskFile.cr4de_intensity_parameters,
    cr4de_scenario_considerable: riskFile.cr4de_scenario_considerable,
    cr4de_scenario_major: riskFile.cr4de_scenario_major,
    cr4de_scenario_extreme: riskFile.cr4de_scenario_extreme,

    cr4de_mrs: riskFile.cr4de_mrs!,
    cr4de_summary_en: riskFile.cr4de_mrs_summary!,
    cr4de_summary_nl: riskFile.cr4de_mrs_summary_nl!,
    cr4de_summary_fr: riskFile.cr4de_mrs_summary_fr!,
    cr4de_summary_de: riskFile.cr4de_mrs_summary_de!,

    cr4de_mrs_p: r(riskFile.results?.[scenario]?.TP),
    cr4de_mrs_i: r(riskFile.results?.[scenario]?.TI),
    cr4de_mrs_h: r(getCategoryImpactRescaled(riskFile, "H", scenario)),
    cr4de_mrs_s: r(getCategoryImpactRescaled(riskFile, "S", scenario)),
    cr4de_mrs_e: r(getCategoryImpactRescaled(riskFile, "E", scenario)),
    cr4de_mrs_f: r(getCategoryImpactRescaled(riskFile, "F", scenario)),

    cr4de_causing_risks:
      riskFile.cr4de_risk_type === RISK_TYPE.STANDARD
        ? JSON.stringify([...selectedCauses, ...otherCauses])
        : null,

    cr4de_effect_risks:
      riskFile.cr4de_risk_type === RISK_TYPE.EMERGING
        ? null
        : JSON.stringify([...selectedEffects, ...otherEffects]),
  };
}

export function snapshotFromRiskfile(
  riskFile: DVRiskFile
): DVRiskSnapshot<
  DVRiskFile,
  SerializedRiskSnapshotResults,
  SerializedRiskQualis
> {
  return {
    cr4de_bnrariskfilesnapshotid: "",

    "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`,
    _cr4de_risk_file_value: riskFile.cr4de_riskfilesid,
    cr4de_risk_file: riskFile,

    cr4de_hazard_id: riskFile.cr4de_hazard_id,
    cr4de_title: riskFile.cr4de_title,
    cr4de_risk_type: riskFile.cr4de_risk_type,
    cr4de_category: riskFile.cr4de_risk_category,

    cr4de_definition: riskFile.cr4de_definition!,
    cr4de_horizon_analysis: riskFile.cr4de_horizon_analysis,
    cr4de_historical_events: riskFile.cr4de_historical_events,
    cr4de_intensity_parameters: riskFile.cr4de_intensity_parameters,
    cr4de_scenarios: serializeRiskSnapshotScenarios({
      [SCENARIOS.CONSIDERABLE]: JSON.parse(
        riskFile.cr4de_scenario_considerable || ""
      ),
      [SCENARIOS.MAJOR]: JSON.parse(riskFile.cr4de_scenario_major || ""),
      [SCENARIOS.EXTREME]: JSON.parse(riskFile.cr4de_scenario_extreme || ""),
    }),
    cr4de_mrs: riskFile.cr4de_mrs!,

    cr4de_quali_scenario_mrs: riskFile.cr4de_mrs_scenario,
    cr4de_quali_disclaimer_mrs: riskFile.cr4de_mrs_disclaimer,
    cr4de_quali_p_mrs: riskFile.cr4de_mrs_probability,
    cr4de_quali_h_mrs: riskFile.cr4de_mrs_impact_h,
    cr4de_quali_s_mrs: riskFile.cr4de_mrs_impact_s,
    cr4de_quali_e_mrs: riskFile.cr4de_mrs_impact_e,
    cr4de_quali_f_mrs: riskFile.cr4de_mrs_impact_f,
    cr4de_quali_actions_mrs: riskFile.cr4de_mrs_actions,
    cr4de_quali_mm_mrs: riskFile.cr4de_mrs_mm_impact,
    cr4de_quali_cb_mrs:
      riskFile[
        `cr4de_cross_border_impact_quali${getScenarioSuffix(
          riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE
        )}`
      ],
    cr4de_quali_cc_mrs: riskFile.cr4de_mrs_cc,

    cr4de_quanti: getSerializedRiskSnapshotResults(riskFile),
    cr4de_quali: getSerializedQualiResults(riskFile),
  };
}

export const oldToNewCPMatrix = (
  cause: DVRiskSnapshot,
  cascade: DVRiskCascade,
  realSnapshot: boolean
): CPMatrixCauseRow => {
  const scenarios = [
    SCENARIOS.CONSIDERABLE,
    SCENARIOS.MAJOR,
    SCENARIOS.EXTREME,
  ];

  if (realSnapshot) {
    if (cascade.cr4de_removed) {
      return scenarios.reduce(
        (accCause, causeScenario) => ({
          ...accCause,
          [causeScenario]: scenarios.reduce(
            (accEffect, effectScenario) => ({
              ...accEffect,
              [effectScenario]: {
                abs: 0,
                scale5: 0,
                scale7: 0,
              },
            }),
            {} as CPMatrixEffectRow
          ),
        }),
        {} as CPMatrixCauseRow
      );
    }

    if (cascade.cr4de_quanti_input !== null) {
      return JSON.parse(cascade.cr4de_quanti_input);
    }
  }

  return getCPMatrixFromOldFormat(cause, cascade);
};

export function snapshotFromRiskCascade(
  cause: DVRiskSnapshot,
  cascade: DVRiskCascade,
  realSnapshot: boolean = true
): DVCascadeSnapshot<
  DVRiskCascade,
  unknown,
  unknown,
  SerializedCauseSnapshotResults,
  SerializedEffectSnapshotResults,
  SerializedCPMatrix
> {
  const newCPMatrixSnapshot = oldToNewCPMatrix(cause, cascade, realSnapshot);
  const newCPMatrix: CPMatrix = {
    [SCENARIOS.CONSIDERABLE]: {
      ...newCPMatrixSnapshot[SCENARIOS.CONSIDERABLE],
      avg: r(cascade.results?.CP_AVG_C2All),
    },
    [SCENARIOS.MAJOR]: {
      ...newCPMatrixSnapshot[SCENARIOS.MAJOR],
      avg: r(cascade.results?.CP_AVG_M2All),
    },
    [SCENARIOS.EXTREME]: {
      ...newCPMatrixSnapshot[SCENARIOS.EXTREME],
      avg: r(cascade.results?.CP_AVG_E2All),
    },
  };

  return {
    cr4de_bnrariskcascadesnapshotid: "",

    "cr4de_risk_cascade@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades(${cascade.cr4de_bnrariskcascadeid})`,
    _cr4de_risk_cascade_value: cascade.cr4de_bnrariskcascadeid,
    cr4de_risk_cascade: cascade,

    "cr4de_cause_risk@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${cascade._cr4de_cause_hazard_value})`,
    _cr4de_cause_risk_value: cascade._cr4de_cause_hazard_value,
    cr4de_cause_risk: null,

    "cr4de_effect_risk@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${cascade._cr4de_effect_hazard_value})`,
    _cr4de_effect_risk_value: cascade._cr4de_effect_hazard_value,
    cr4de_effect_risk: null,

    cr4de_quali: cascade.cr4de_quali,
    cr4de_quali_cause: cascade.cr4de_quali_cause,
    cr4de_description: cascade.cr4de_description,

    cr4de_removed: cascade.cr4de_removed,

    cr4de_quanti_cp: serializeCPMatrix(newCPMatrix),
    cr4de_quanti_cause: serializeCauseSnapshotResults({
      [SCENARIOS.CONSIDERABLE]: {
        tp: {
          rpMonths: returnPeriodMonthsFromPDaily(cascade.results?.TP_c || 0),
        },
        ip: {
          yearly: {
            scale: r(cascade.results?.IP_All2C),
          },
          scale5TP: r(cascade.results?.IP_All2C),
        },
        ip50: {
          yearly: {
            scale: r(cascade.results?.IP50_All2C),
          },
          scale5TP: r(cascade.results?.IP50_All2C),
        },
      },
      [SCENARIOS.MAJOR]: {
        tp: {
          rpMonths: returnPeriodMonthsFromPDaily(cascade.results?.TP_m || 0),
        },
        ip: {
          yearly: {
            scale: r(cascade.results?.IP_All2M),
          },
          scale5TP: r(cascade.results?.IP_All2M),
        },
        ip50: {
          yearly: {
            scale: r(cascade.results?.IP50_All2M),
          },
          scale5TP: r(cascade.results?.IP50_All2M),
        },
      },
      [SCENARIOS.EXTREME]: {
        tp: {
          rpMonths: returnPeriodMonthsFromPDaily(cascade.results?.TP_e || 0),
        },
        ip: {
          yearly: {
            scale: r(cascade.results?.IP_All2E),
          },
          scale5TP: r(cascade.results?.IP_All2E),
        },
        ip50: {
          yearly: {
            scale: r(cascade.results?.IP50_All2E),
          },
          scale5TP: r(cascade.results?.IP50_All2E),
        },
      },
    }),

    cr4de_quanti_effect: serializeEffectSnapshotResults({
      [SCENARIOS.CONSIDERABLE]: {
        ti: {
          all: {
            euros: r(cascade.results?.TI_c),
          },
          ha: {
            euros: r(cascade.results?.TI_Ha_c),
          },
          hb: {
            euros: r(cascade.results?.TI_Hb_c),
          },
          hc: {
            euros: r(cascade.results?.TI_Hc_c),
          },
          sa: {
            euros: r(cascade.results?.TI_Sa_c),
          },
          sb: {
            euros: r(cascade.results?.TI_Sb_c),
          },
          sc: {
            euros: r(cascade.results?.TI_Sc_c),
          },
          sd: {
            euros: r(cascade.results?.TI_Sd_c),
          },
          ea: {
            euros: r(cascade.results?.TI_Ea_c),
          },
          fa: {
            euros: r(cascade.results?.TI_Fa_c),
          },
          fb: {
            euros: r(cascade.results?.TI_Fb_c),
          },
        },
        ii: {
          all: {
            scale: r(cascade.results?.II_C2All),
            scale5TI: r(cascade.results?.II_C2All),
          },
          h: {
            scale: r(cascade.results?.II_C2All_H),
            scale5TI: r(cascade.results?.II_C2All_H),
          },
          ha: {
            scale: r(cascade.results?.II_C2All_Ha),
            scale5TI: r(cascade.results?.II_C2All_Ha),
          },
          hb: {
            scale: r(cascade.results?.II_C2All_Hb),
            scale5TI: r(cascade.results?.II_C2All_Hb),
          },
          hc: {
            scale: r(cascade.results?.II_C2All_Hc),
            scale5TI: r(cascade.results?.II_C2All_Hc),
          },
          s: {
            scale: r(cascade.results?.II_C2All_S),
            scale5TI: r(cascade.results?.II_C2All_S),
          },
          sa: {
            scale: r(cascade.results?.II_C2All_Sa),
            scale5TI: r(cascade.results?.II_C2All_Sa),
          },
          sb: {
            scale: r(cascade.results?.II_C2All_Sb),
            scale5TI: r(cascade.results?.II_C2All_Sb),
          },
          sc: {
            scale: r(cascade.results?.II_C2All_Sc),
            scale5TI: r(cascade.results?.II_C2All_Sc),
          },
          sd: {
            scale: r(cascade.results?.II_C2All_Sd),
            scale5TI: r(cascade.results?.II_C2All_Sd),
          },
          e: {
            scale: r(cascade.results?.II_C2All_E),
            scale5TI: r(cascade.results?.II_C2All_E),
          },
          ea: {
            scale: r(cascade.results?.II_C2All_Ea),
            scale5TI: r(cascade.results?.II_C2All_Ea),
          },
          f: {
            scale: r(cascade.results?.II_C2All_F),
            scale5TI: r(cascade.results?.II_C2All_F),
          },
          fa: {
            scale: r(cascade.results?.II_C2All_Fa),
            scale5TI: r(cascade.results?.II_C2All_Fa),
          },
          fb: {
            scale: r(cascade.results?.II_C2All_Fb),
            scale5TI: r(cascade.results?.II_C2All_Fb),
          },
        },
      },
      [SCENARIOS.MAJOR]: {
        ti: {
          all: {
            euros: r(cascade.results?.TI_m),
          },
          ha: {
            euros: r(cascade.results?.TI_Ha_m),
          },
          hb: {
            euros: r(cascade.results?.TI_Hb_m),
          },
          hc: {
            euros: r(cascade.results?.TI_Hc_m),
          },
          sa: {
            euros: r(cascade.results?.TI_Sa_m),
          },
          sb: {
            euros: r(cascade.results?.TI_Sb_m),
          },
          sc: {
            euros: r(cascade.results?.TI_Sc_m),
          },
          sd: {
            euros: r(cascade.results?.TI_Sd_m),
          },
          ea: {
            euros: r(cascade.results?.TI_Ea_m),
          },
          fa: {
            euros: r(cascade.results?.TI_Fa_m),
          },
          fb: {
            euros: r(cascade.results?.TI_Fb_m),
          },
        },
        ii: {
          all: {
            scale: r(cascade.results?.II_M2All),
            scale5TI: r(cascade.results?.II_M2All),
          },
          h: {
            scale: r(cascade.results?.II_M2All_H),
            scale5TI: r(cascade.results?.II_M2All_H),
          },
          ha: {
            scale: r(cascade.results?.II_M2All_Ha),
            scale5TI: r(cascade.results?.II_M2All_Ha),
          },
          hb: {
            scale: r(cascade.results?.II_M2All_Hb),
            scale5TI: r(cascade.results?.II_M2All_Hb),
          },
          hc: {
            scale: r(cascade.results?.II_M2All_Hc),
            scale5TI: r(cascade.results?.II_M2All_Hc),
          },
          s: {
            scale: r(cascade.results?.II_M2All_S),
            scale5TI: r(cascade.results?.II_M2All_S),
          },
          sa: {
            scale: r(cascade.results?.II_M2All_Sa),
            scale5TI: r(cascade.results?.II_M2All_Sa),
          },
          sb: {
            scale: r(cascade.results?.II_M2All_Sb),
            scale5TI: r(cascade.results?.II_M2All_Sb),
          },
          sc: {
            scale: r(cascade.results?.II_M2All_Sc),
            scale5TI: r(cascade.results?.II_M2All_Sc),
          },
          sd: {
            scale: r(cascade.results?.II_M2All_Sd),
            scale5TI: r(cascade.results?.II_M2All_Sd),
          },
          e: {
            scale: r(cascade.results?.II_M2All_E),
            scale5TI: r(cascade.results?.II_M2All_E),
          },
          ea: {
            scale: r(cascade.results?.II_M2All_Ea),
            scale5TI: r(cascade.results?.II_M2All_Ea),
          },
          f: {
            scale: r(cascade.results?.II_M2All_F),
            scale5TI: r(cascade.results?.II_M2All_F),
          },
          fa: {
            scale: r(cascade.results?.II_M2All_Fa),
            scale5TI: r(cascade.results?.II_M2All_Fa),
          },
          fb: {
            scale: r(cascade.results?.II_M2All_Fb),
            scale5TI: r(cascade.results?.II_M2All_Fb),
          },
        },
      },
      [SCENARIOS.EXTREME]: {
        ti: {
          all: {
            euros: r(cascade.results?.TI_e),
          },
          ha: {
            euros: r(cascade.results?.TI_Ha_e),
          },
          hb: {
            euros: r(cascade.results?.TI_Hb_e),
          },
          hc: {
            euros: r(cascade.results?.TI_Hc_e),
          },
          sa: {
            euros: r(cascade.results?.TI_Sa_e),
          },
          sb: {
            euros: r(cascade.results?.TI_Sb_e),
          },
          sc: {
            euros: r(cascade.results?.TI_Sc_e),
          },
          sd: {
            euros: r(cascade.results?.TI_Sd_e),
          },
          ea: {
            euros: r(cascade.results?.TI_Ea_e),
          },
          fa: {
            euros: r(cascade.results?.TI_Fa_e),
          },
          fb: {
            euros: r(cascade.results?.TI_Fb_e),
          },
        },
        ii: {
          all: {
            scale: r(cascade.results?.II_E2All),
            scale5TI: r(cascade.results?.II_E2All),
          },
          h: {
            scale: r(cascade.results?.II_E2All_H),
            scale5TI: r(cascade.results?.II_E2All_H),
          },
          ha: {
            scale: r(cascade.results?.II_E2All_Ha),
            scale5TI: r(cascade.results?.II_E2All_Ha),
          },
          hb: {
            scale: r(cascade.results?.II_E2All_Hb),
            scale5TI: r(cascade.results?.II_E2All_Hb),
          },
          hc: {
            scale: r(cascade.results?.II_E2All_Hc),
            scale5TI: r(cascade.results?.II_E2All_Hc),
          },
          s: {
            scale: r(cascade.results?.II_E2All_S),
            scale5TI: r(cascade.results?.II_E2All_S),
          },
          sa: {
            scale: r(cascade.results?.II_E2All_Sa),
            scale5TI: r(cascade.results?.II_E2All_Sa),
          },
          sb: {
            scale: r(cascade.results?.II_E2All_Sb),
            scale5TI: r(cascade.results?.II_E2All_Sb),
          },
          sc: {
            scale: r(cascade.results?.II_E2All_Sc),
            scale5TI: r(cascade.results?.II_E2All_Sc),
          },
          sd: {
            scale: r(cascade.results?.II_E2All_Sd),
            scale5TI: r(cascade.results?.II_E2All_Sd),
          },
          e: {
            scale: r(cascade.results?.II_E2All_E),
            scale5TI: r(cascade.results?.II_E2All_E),
          },
          ea: {
            scale: r(cascade.results?.II_E2All_Ea),
            scale5TI: r(cascade.results?.II_E2All_Ea),
          },
          f: {
            scale: r(cascade.results?.II_E2All_F),
            scale5TI: r(cascade.results?.II_E2All_F),
          },
          fa: {
            scale: r(cascade.results?.II_E2All_Fa),
            scale5TI: r(cascade.results?.II_E2All_Fa),
          },
          fb: {
            scale: r(cascade.results?.II_E2All_Fb),
            scale5TI: r(cascade.results?.II_E2All_Fb),
          },
        },
      },
    }),
  };
}
