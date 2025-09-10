// The functions is this file take the calculated results in the
// risk files and save them into the corresponding snaphot
// database models.
//
// These snapshots contain the actual data that is published
// to non-CIPRA users in the BNRA web application and should
// thus only be updated when a new release of the BNRA
// results is wanted

import {
  DVCascadeSnapshot,
  serializeCauseSnapshotResults,
  SerializedCauseSnapshotResults,
  SerializedEffectSnapshotResults,
  serializeEffectSnapshotResults,
} from "../types/dataverse/DVCascadeSnapshot";
import {
  CASCADE_RESULT_SNAPSHOT,
  DVRiskCascade,
} from "../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import {
  DVRiskSnapshot,
  SerializedRiskSnapshotResults,
  serializeRiskSnapshotResults,
} from "../types/dataverse/DVRiskSnapshot";
import { DVRiskSummary } from "../types/dataverse/DVRiskSummary";
import { RISK_TYPE, UnparsedRiskFields } from "../types/dataverse/Riskfile";
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
import {
  getScenarioParameter,
  getScenarioSuffix,
  SCENARIOS,
} from "./scenarios";

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
  riskSnapshots: DVRiskSnapshot<unknown, SerializedRiskSnapshotResults>[],
  cascadesSnapshots: DVCascadeSnapshot<
    unknown,
    unknown,
    unknown,
    SerializedCauseSnapshotResults,
    SerializedEffectSnapshotResults
  >[],
  riskFiles: DVRiskFile[],
  cascades: DVRiskCascade[]
): {
  updatedSummaries: Partial<DVRiskSummary<unknown, UnparsedRiskFields>>[];
  updatedRiskSnapshots: Partial<
    DVRiskSnapshot<unknown, SerializedRiskSnapshotResults>
  >[];
  updatedCascadesSnapshots: Partial<
    DVCascadeSnapshot<
      unknown,
      unknown,
      unknown,
      SerializedCauseSnapshotResults,
      SerializedEffectSnapshotResults
    >
  >[];
} {
  const newSummaries: Partial<DVRiskSummary<unknown, UnparsedRiskFields>>[] =
    [];
  const newRiskSnapshots: Partial<
    DVRiskSnapshot<unknown, SerializedRiskSnapshotResults>
  >[] = [];
  const updatedSummaries: Partial<
    DVRiskSummary<unknown, UnparsedRiskFields>
  >[] = [];
  const updatedRiskSnapshots: Partial<
    DVRiskSnapshot<unknown, SerializedRiskSnapshotResults>
  >[] = [];
  const cascadeSnapshotDict: {
    [cascadeId: string]: Partial<
      DVCascadeSnapshot<
        unknown,
        unknown,
        unknown,
        SerializedCauseSnapshotResults,
        SerializedEffectSnapshotResults
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
        cascadeDict[rf.cr4de_riskfilesid]
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
  riskSnapshots: DVRiskSnapshot<unknown, SerializedRiskSnapshotResults>[],
  cascadesSnapshots: {
    [cascadeId: string]: Partial<
      DVCascadeSnapshot<
        unknown,
        unknown,
        unknown,
        SerializedCauseSnapshotResults,
        SerializedEffectSnapshotResults
      >
    >;
  },
  riskFile: DVRiskFile,
  cascades: Cascades
) {
  const existingSummary: Partial<DVRiskSummary<unknown, UnparsedRiskFields>> =
    summaries.find(
      (s) => s._cr4de_risk_file_value == riskFile.cr4de_riskfilesid
    ) || {};
  const existingSnapshot: Partial<
    DVRiskSnapshot<unknown, SerializedRiskSnapshotResults>
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

  for (const cause of cascades.causes) {
    const updatedCauseSnapshot = snapshotFromRiskCascade(cause);
    if (cascadesSnapshots[cause.cr4de_bnrariskcascadeid]) {
      updatedCauseSnapshot.cr4de_bnrariskcascadesnapshotid =
        cascadesSnapshots[cause.cr4de_bnrariskcascadeid]
          .cr4de_bnrariskcascadesnapshotid || "";
    }
    cascadesSnapshots[cause.cr4de_bnrariskcascadeid] = updatedCauseSnapshot;
  }

  for (const effect of cascades.effects) {
    const updatedEffectSnapshot = snapshotFromRiskCascade(effect);
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
  return serializeRiskSnapshotResults({
    considerable: {
      dp: {
        yearly: {
          scale: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.DP),
        },
      },
      dp50: {
        yearly: {
          scale: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.DP50),
        },
      },
      tp: {
        yearly: {
          scale: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TP),
        },
      },
      tp50: {
        yearly: {
          scale: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TP50),
        },
      },
      ti: {
        all: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI),
        },
        h: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_H),
          scaleCat: r(
            getCategoryImpactRescaled(riskFile, "H", SCENARIOS.CONSIDERABLE)
          ),
        },
        ha: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Ha),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Ha",
              SCENARIOS.CONSIDERABLE
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.CONSIDERABLE].TI_Ha_abs),
        },
        hb: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Hb),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Hb",
              SCENARIOS.CONSIDERABLE
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Hb_abs),
        },
        hc: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Hc),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Hc",
              SCENARIOS.CONSIDERABLE
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Hc_abs),
        },
        s: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_S),
          scaleCat: r(
            getCategoryImpactRescaled(riskFile, "S", SCENARIOS.CONSIDERABLE)
          ),
        },
        sa: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Sa),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Sa",
              SCENARIOS.CONSIDERABLE
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Sa_abs),
        },
        sb: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Sb),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Sb",
              SCENARIOS.CONSIDERABLE
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Sb_abs),
        },
        sc: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Sc),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Sc",
              SCENARIOS.CONSIDERABLE
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Sc_abs),
        },
        sd: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Sd),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Sd",
              SCENARIOS.CONSIDERABLE
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Sd_abs),
        },
        e: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_E),
          scaleCat: r(
            getCategoryImpactRescaled(riskFile, "E", SCENARIOS.CONSIDERABLE)
          ),
        },
        ea: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Ea),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Ea",
              SCENARIOS.CONSIDERABLE
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Ea_abs),
        },
        f: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_F),
          scaleCat: r(
            getCategoryImpactRescaled(riskFile, "F", SCENARIOS.CONSIDERABLE)
          ),
        },
        fa: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Fa),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Fa",
              SCENARIOS.CONSIDERABLE
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Fa_abs),
        },
        fb: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Fb),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Fb",
              SCENARIOS.CONSIDERABLE
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Fb_abs),
        },
      },
      di: {
        all: {
          scale:
            getScenarioParameter(riskFile, "DI", SCENARIOS.CONSIDERABLE) || 0,
        },
        ha: {
          scale:
            getScenarioParameter(riskFile, "DI_Ha", SCENARIOS.CONSIDERABLE) ||
            0,
        },
        hb: {
          scale:
            getScenarioParameter(riskFile, "DI_Hb", SCENARIOS.CONSIDERABLE) ||
            0,
        },
        hc: {
          scale:
            getScenarioParameter(riskFile, "DI_Hc", SCENARIOS.CONSIDERABLE) ||
            0,
        },
        sa: {
          scale:
            getScenarioParameter(riskFile, "DI_Sa", SCENARIOS.CONSIDERABLE) ||
            0,
        },
        sb: {
          scale:
            getScenarioParameter(riskFile, "DI_Sb", SCENARIOS.CONSIDERABLE) ||
            0,
        },
        sc: {
          scale:
            getScenarioParameter(riskFile, "DI_Sc", SCENARIOS.CONSIDERABLE) ||
            0,
        },
        sd: {
          scale:
            getScenarioParameter(riskFile, "DI_Sd", SCENARIOS.CONSIDERABLE) ||
            0,
        },
        ea: {
          scale:
            getScenarioParameter(riskFile, "DI_Ea", SCENARIOS.CONSIDERABLE) ||
            0,
        },
        fa: {
          scale:
            getScenarioParameter(riskFile, "DI_Fa", SCENARIOS.CONSIDERABLE) ||
            0,
        },
        fb: {
          scale:
            getScenarioParameter(riskFile, "DI_Fb", SCENARIOS.CONSIDERABLE) ||
            0,
        },
      },
    },
    major: {
      tp: {
        yearly: {
          scale: r(riskFile.results?.[SCENARIOS.MAJOR]?.TP),
        },
      },
      tp50: {
        yearly: {
          scale: r(riskFile.results?.[SCENARIOS.MAJOR]?.TP50),
        },
      },
      dp: {
        yearly: {
          scale: r(riskFile.results?.[SCENARIOS.MAJOR]?.DP),
        },
      },
      dp50: {
        yearly: {
          scale: r(riskFile.results?.[SCENARIOS.MAJOR]?.DP50),
        },
      },
      ti: {
        all: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI),
        },
        h: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_H),
          scaleCat: r(
            getCategoryImpactRescaled(riskFile, "H", SCENARIOS.MAJOR)
          ),
        },
        ha: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Ha),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Ha",
              SCENARIOS.MAJOR
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Ha_abs),
        },
        hb: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Hb),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Hb",
              SCENARIOS.MAJOR
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Hb_abs),
        },
        hc: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Hc),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Hc",
              SCENARIOS.MAJOR
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Hc_abs),
        },
        s: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_S),
          scaleCat: r(
            getCategoryImpactRescaled(riskFile, "S", SCENARIOS.MAJOR)
          ),
        },
        sa: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Sa),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Sa",
              SCENARIOS.MAJOR
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Sa_abs),
        },
        sb: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Sb),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Sb",
              SCENARIOS.MAJOR
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Sb_abs),
        },
        sc: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Sc),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Sc",
              SCENARIOS.MAJOR
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Sc_abs),
        },
        sd: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Sd),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Sd",
              SCENARIOS.MAJOR
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Sd_abs),
        },
        e: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_E),
          scaleCat: r(
            getCategoryImpactRescaled(riskFile, "E", SCENARIOS.MAJOR)
          ),
        },
        ea: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Ea),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Ea",
              SCENARIOS.MAJOR
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Ea_abs),
        },
        f: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_F),
          scaleCat: r(
            getCategoryImpactRescaled(riskFile, "F", SCENARIOS.MAJOR)
          ),
        },
        fa: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Fa),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Fa",
              SCENARIOS.MAJOR
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Fa_abs),
        },
        fb: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Fb),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Fb",
              SCENARIOS.MAJOR
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Fb_abs),
        },
      },
      di: {
        all: {
          scale: getScenarioParameter(riskFile, "DI", SCENARIOS.MAJOR) || 0,
        },
        ha: {
          scale: getScenarioParameter(riskFile, "DI_Ha", SCENARIOS.MAJOR) || 0,
        },
        hb: {
          scale: getScenarioParameter(riskFile, "DI_Hb", SCENARIOS.MAJOR) || 0,
        },
        hc: {
          scale: getScenarioParameter(riskFile, "DI_Hc", SCENARIOS.MAJOR) || 0,
        },
        sa: {
          scale: getScenarioParameter(riskFile, "DI_Sa", SCENARIOS.MAJOR) || 0,
        },
        sb: {
          scale: getScenarioParameter(riskFile, "DI_Sb", SCENARIOS.MAJOR) || 0,
        },
        sc: {
          scale: getScenarioParameter(riskFile, "DI_Sc", SCENARIOS.MAJOR) || 0,
        },
        sd: {
          scale: getScenarioParameter(riskFile, "DI_Sd", SCENARIOS.MAJOR) || 0,
        },
        ea: {
          scale: getScenarioParameter(riskFile, "DI_Ea", SCENARIOS.MAJOR) || 0,
        },
        fa: {
          scale: getScenarioParameter(riskFile, "DI_Fa", SCENARIOS.MAJOR) || 0,
        },
        fb: {
          scale: getScenarioParameter(riskFile, "DI_Fb", SCENARIOS.MAJOR) || 0,
        },
      },
    },

    extreme: {
      tp: {
        yearly: {
          scale: r(riskFile.results?.[SCENARIOS.EXTREME]?.TP),
        },
      },
      tp50: {
        yearly: {
          scale: r(riskFile.results?.[SCENARIOS.EXTREME]?.TP50),
        },
      },
      dp: {
        yearly: {
          scale: r(riskFile.results?.[SCENARIOS.EXTREME]?.DP),
        },
      },
      dp50: {
        yearly: {
          scale: r(riskFile.results?.[SCENARIOS.EXTREME]?.DP50),
        },
      },
      ti: {
        all: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI),
        },
        h: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_H),
          scaleCat: r(
            getCategoryImpactRescaled(riskFile, "H", SCENARIOS.EXTREME)
          ),
        },
        ha: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Ha),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Ha",
              SCENARIOS.EXTREME
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Ha_abs),
        },
        hb: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Hb),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Hb",
              SCENARIOS.EXTREME
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Hb_abs),
        },
        hc: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Hc),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Hc",
              SCENARIOS.EXTREME
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Hc_abs),
        },
        s: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_S),
          scaleCat: r(
            getCategoryImpactRescaled(riskFile, "S", SCENARIOS.EXTREME)
          ),
        },
        sa: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Sa),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Sa",
              SCENARIOS.EXTREME
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Sa_abs),
        },
        sb: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Sb),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Sb",
              SCENARIOS.EXTREME
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Sb_abs),
        },
        sc: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Sc),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Sc",
              SCENARIOS.EXTREME
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Sc_abs),
        },
        sd: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Sd),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Sd",
              SCENARIOS.EXTREME
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Sd_abs),
        },
        e: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_E),
          scaleCat: r(
            getCategoryImpactRescaled(riskFile, "E", SCENARIOS.EXTREME)
          ),
        },
        ea: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Ea),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Ea",
              SCENARIOS.EXTREME
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Ea_abs),
        },
        f: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_F),
          scaleCat: r(
            getCategoryImpactRescaled(riskFile, "F", SCENARIOS.EXTREME)
          ),
        },
        fa: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Fa),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Fa",
              SCENARIOS.EXTREME
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Fa_abs),
        },
        fb: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Fb),
          scaleCatRel: r(
            getDamageIndicatorToCategoryImpactRatio(
              riskFile,
              "Fb",
              SCENARIOS.EXTREME
            )
          ),
          abs: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Fb_abs),
        },
      },
      di: {
        all: {
          scale: getScenarioParameter(riskFile, "DI", SCENARIOS.EXTREME) || 0,
        },
        ha: {
          scale:
            getScenarioParameter(riskFile, "DI_Ha", SCENARIOS.EXTREME) || 0,
        },
        hb: {
          scale:
            getScenarioParameter(riskFile, "DI_Hb", SCENARIOS.EXTREME) || 0,
        },
        hc: {
          scale:
            getScenarioParameter(riskFile, "DI_Hc", SCENARIOS.EXTREME) || 0,
        },
        sa: {
          scale:
            getScenarioParameter(riskFile, "DI_Sa", SCENARIOS.EXTREME) || 0,
        },
        sb: {
          scale:
            getScenarioParameter(riskFile, "DI_Sb", SCENARIOS.EXTREME) || 0,
        },
        sc: {
          scale:
            getScenarioParameter(riskFile, "DI_Sc", SCENARIOS.EXTREME) || 0,
        },
        sd: {
          scale:
            getScenarioParameter(riskFile, "DI_Sd", SCENARIOS.EXTREME) || 0,
        },
        ea: {
          scale:
            getScenarioParameter(riskFile, "DI_Ea", SCENARIOS.EXTREME) || 0,
        },
        fa: {
          scale:
            getScenarioParameter(riskFile, "DI_Fa", SCENARIOS.EXTREME) || 0,
        },
        fb: {
          scale:
            getScenarioParameter(riskFile, "DI_Fb", SCENARIOS.EXTREME) || 0,
        },
      },
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
): DVRiskSnapshot<DVRiskFile, SerializedRiskSnapshotResults> {
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
    cr4de_scenarios: JSON.stringify({
      [SCENARIOS.CONSIDERABLE]: riskFile.cr4de_scenario_considerable,
      [SCENARIOS.MAJOR]: riskFile.cr4de_scenario_major,
      [SCENARIOS.EXTREME]: riskFile.cr4de_scenario_extreme,
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
  };
}

export function snapshotFromRiskCascade(
  cascade: DVRiskCascade
): DVCascadeSnapshot<
  DVRiskCascade,
  unknown,
  unknown,
  SerializedCauseSnapshotResults,
  SerializedEffectSnapshotResults
> {
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

    cr4de_quanti_cause: serializeCauseSnapshotResults({
      [SCENARIOS.CONSIDERABLE]: {
        cp: {
          matrix: {
            considerable: cascade.cr4de_c2c || "CP0",
            major: cascade.cr4de_m2c || "CP0",
            extreme: cascade.cr4de_e2c || "CP0",
          },
        },
        ip: {
          yearly: {
            scale: r(cascade.results?.IP_All2C),
          },
        },
        ip50: {
          yearly: {
            scale: r(cascade.results?.IP50_All2C),
          },
        },
      },
      [SCENARIOS.MAJOR]: {
        cp: {
          matrix: {
            considerable: cascade.cr4de_c2m || "CP0",
            major: cascade.cr4de_m2m || "CP0",
            extreme: cascade.cr4de_e2m || "CP0",
          },
        },
        ip: {
          yearly: {
            scale: r(cascade.results?.IP_All2M),
          },
        },
        ip50: {
          yearly: {
            scale: r(cascade.results?.IP50_All2M),
          },
        },
      },
      [SCENARIOS.EXTREME]: {
        cp: {
          matrix: {
            considerable: cascade.cr4de_c2e || "CP0",
            major: cascade.cr4de_m2e || "CP0",
            extreme: cascade.cr4de_e2e || "CP0",
          },
        },
        ip: {
          yearly: {
            scale: r(cascade.results?.IP_All2E),
          },
        },
        ip50: {
          yearly: {
            scale: r(cascade.results?.IP50_All2E),
          },
        },
      },
    }),

    cr4de_quanti_effect: serializeEffectSnapshotResults({
      [SCENARIOS.CONSIDERABLE]: {
        cp: {
          avg: r(cascade.results?.CP_AVG_C2All),
          matrix: {
            considerable: cascade.cr4de_c2c || "CP0",
            major: cascade.cr4de_c2m || "CP0",
            extreme: cascade.cr4de_c2e || "CP0",
          },
        },
        ii: {
          all: {
            scale: r(cascade.results?.II_C2All),
          },
          h: {
            scale: r(cascade.results?.II_C2All_H),
          },
          ha: {
            scale: r(cascade.results?.II_C2All_Ha),
          },
          hb: {
            scale: r(cascade.results?.II_C2All_Hb),
          },
          hc: {
            scale: r(cascade.results?.II_C2All_Hc),
          },
          s: {
            scale: r(cascade.results?.II_C2All_S),
          },
          sa: {
            scale: r(cascade.results?.II_C2All_Sa),
          },
          sb: {
            scale: r(cascade.results?.II_C2All_Sb),
          },
          sc: {
            scale: r(cascade.results?.II_C2All_Sc),
          },
          sd: {
            scale: r(cascade.results?.II_C2All_Sd),
          },
          e: {
            scale: r(cascade.results?.II_C2All_E),
          },
          ea: {
            scale: r(cascade.results?.II_C2All_Ea),
          },
          f: {
            scale: r(cascade.results?.II_C2All_F),
          },
          fa: {
            scale: r(cascade.results?.II_C2All_Fa),
          },
          fb: {
            scale: r(cascade.results?.II_C2All_Fb),
          },
        },
      },
      [SCENARIOS.MAJOR]: {
        cp: {
          avg: r(cascade.results?.CP_AVG_M2All),
          matrix: {
            considerable: cascade.cr4de_m2c || "CP0",
            major: cascade.cr4de_m2m || "CP0",
            extreme: cascade.cr4de_m2e || "CP0",
          },
        },
        ii: {
          all: {
            scale: r(cascade.results?.II_C2All),
          },
          h: {
            scale: r(cascade.results?.II_C2All_H),
          },
          ha: {
            scale: r(cascade.results?.II_C2All_Ha),
          },
          hb: {
            scale: r(cascade.results?.II_C2All_Hb),
          },
          hc: {
            scale: r(cascade.results?.II_C2All_Hc),
          },
          s: {
            scale: r(cascade.results?.II_C2All_S),
          },
          sa: {
            scale: r(cascade.results?.II_C2All_Sa),
          },
          sb: {
            scale: r(cascade.results?.II_C2All_Sb),
          },
          sc: {
            scale: r(cascade.results?.II_C2All_Sc),
          },
          sd: {
            scale: r(cascade.results?.II_C2All_Sd),
          },
          e: {
            scale: r(cascade.results?.II_C2All_E),
          },
          ea: {
            scale: r(cascade.results?.II_C2All_Ea),
          },
          f: {
            scale: r(cascade.results?.II_C2All_F),
          },
          fa: {
            scale: r(cascade.results?.II_C2All_Fa),
          },
          fb: {
            scale: r(cascade.results?.II_C2All_Fb),
          },
        },
      },
      [SCENARIOS.EXTREME]: {
        cp: {
          avg: r(cascade.results?.CP_AVG_E2All),
          matrix: {
            considerable: cascade.cr4de_e2c || "CP0",
            major: cascade.cr4de_e2m || "CP0",
            extreme: cascade.cr4de_e2e || "CP0",
          },
        },
        ii: {
          all: {
            scale: r(cascade.results?.II_C2All),
          },
          h: {
            scale: r(cascade.results?.II_C2All_H),
          },
          ha: {
            scale: r(cascade.results?.II_C2All_Ha),
          },
          hb: {
            scale: r(cascade.results?.II_C2All_Hb),
          },
          hc: {
            scale: r(cascade.results?.II_C2All_Hc),
          },
          s: {
            scale: r(cascade.results?.II_C2All_S),
          },
          sa: {
            scale: r(cascade.results?.II_C2All_Sa),
          },
          sb: {
            scale: r(cascade.results?.II_C2All_Sb),
          },
          sc: {
            scale: r(cascade.results?.II_C2All_Sc),
          },
          sd: {
            scale: r(cascade.results?.II_C2All_Sd),
          },
          e: {
            scale: r(cascade.results?.II_C2All_E),
          },
          ea: {
            scale: r(cascade.results?.II_C2All_Ea),
          },
          f: {
            scale: r(cascade.results?.II_C2All_F),
          },
          fa: {
            scale: r(cascade.results?.II_C2All_Fa),
          },
          fb: {
            scale: r(cascade.results?.II_C2All_Fb),
          },
        },
      },
    }),
  };
}
