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
  serializeEffectSnapshotResults,
} from "../types/dataverse/DVCascadeSnapshot";
import {
  CASCADE_RESULT_SNAPSHOT,
  DVRiskCascade,
} from "../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import {
  DVRiskSnapshot,
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
import { getCategoryImpactRescaled } from "./CategoryImpact";
import { SCENARIOS } from "./scenarios";

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
  riskSnapshots: DVRiskSnapshot[],
  cascadesSnapshots: DVCascadeSnapshot[],
  riskFiles: DVRiskFile[],
  cascades: DVRiskCascade[]
): {
  updatedSummaries: Partial<DVRiskSummary<unknown, UnparsedRiskFields>>[];
  updatedRiskSnapshots: Partial<DVRiskSnapshot>[];
  updatedCascadesSnapshots: Partial<DVCascadeSnapshot>[];
} {
  const newSummaries: Partial<DVRiskSummary<unknown, UnparsedRiskFields>>[] =
    [];
  const newRiskSnapshots: Partial<DVRiskSnapshot>[] = [];
  const cascadeSnapshotDict: {
    [cascadeId: string]: Partial<DVCascadeSnapshot>;
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
    const { newSummary, newRiskSnapshot } = updateSnapshot(
      summaries,
      riskSnapshots,
      cascadeSnapshotDict,
      rf,
      cascadeDict[rf.cr4de_riskfilesid]
    );
    if (newSummary) newSummaries.push(newSummary);
    if (newRiskSnapshot) newRiskSnapshots.push(newRiskSnapshot);
  }

  return {
    updatedSummaries: [...summaries, ...newSummaries],
    updatedRiskSnapshots: [...riskSnapshots, ...newRiskSnapshots],
    updatedCascadesSnapshots: Object.values(cascadeSnapshotDict),
  };
}

function updateSnapshot(
  summaries: DVRiskSummary<unknown, UnparsedRiskFields>[],
  riskSnapshots: DVRiskSnapshot[],
  cascadesSnapshots: { [cascadeId: string]: Partial<DVCascadeSnapshot> },
  riskFile: DVRiskFile,
  cascades: Cascades
) {
  const updatedSummary: Partial<DVRiskSummary<unknown, UnparsedRiskFields>> =
    summaries.find(
      (s) => s._cr4de_risk_file_value == riskFile.cr4de_riskfilesid
    ) || {};
  const updatedSnapshot: Partial<DVRiskSnapshot> =
    riskSnapshots.find(
      (s) => s._cr4de_risk_file_value == riskFile.cr4de_riskfilesid
    ) || {};

  const scenario = riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE;
  const causes = getCausesWithDP(riskFile, cascades, scenario);
  const effects = getEffectsWithDI(riskFile, cascades, scenario);

  let minP = 0;
  let cumulP = 0;

  if (riskFile.results) {
    const Ptot = riskFile.results[scenario].TP;

    for (const c of causes.sort((a, b) => b.p - a.p)) {
      cumulP += c.p / Ptot;

      if (cumulP >= 0.805) {
        minP = c.p;
        break;
      }
    }
  }

  const Itot = effects.reduce((tot, e) => tot + e.i, 0.000000001);

  let minI = 0;
  let cumulI = 0;
  for (const e of effects.sort((a, b) => b.i - a.i)) {
    cumulI += e.i / Itot;

    if (cumulI >= 0.8) {
      minI = e.i;
      break;
    }
  }

  updatedSummary[
    "cr4de_risk_file@odata.bind"
  ] = `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`;

  updatedSummary.cr4de_hazard_id = riskFile.cr4de_hazard_id;
  updatedSummary.cr4de_title = riskFile.cr4de_title;
  updatedSummary.cr4de_risk_type = riskFile.cr4de_risk_type;
  updatedSummary.cr4de_category = riskFile.cr4de_risk_category;
  updatedSummary.cr4de_key_risk = riskFile.cr4de_key_risk;

  updatedSummary.cr4de_label_hilp = riskFile.cr4de_label_hilp || false;
  updatedSummary.cr4de_label_cc = riskFile.cr4de_label_cc || false;
  updatedSummary.cr4de_label_cb = riskFile.cr4de_label_cb || false;
  updatedSummary.cr4de_label_impact = riskFile.cr4de_label_impact;

  updatedSummary.cr4de_definition = riskFile.cr4de_definition;
  updatedSummary.cr4de_horizon_analysis = riskFile.cr4de_horizon_analysis;
  updatedSummary.cr4de_historical_events = riskFile.cr4de_historical_events;
  updatedSummary.cr4de_intensity_parameters =
    riskFile.cr4de_intensity_parameters;
  updatedSummary.cr4de_scenario_considerable =
    riskFile.cr4de_scenario_considerable;
  updatedSummary.cr4de_scenario_major = riskFile.cr4de_scenario_major;
  updatedSummary.cr4de_scenario_extreme = riskFile.cr4de_scenario_extreme;

  updatedSummary.cr4de_mrs = riskFile.cr4de_mrs!;
  updatedSummary.cr4de_summary_en = riskFile.cr4de_mrs_summary!;
  updatedSummary.cr4de_summary_nl = riskFile.cr4de_mrs_summary_nl!;
  updatedSummary.cr4de_summary_fr = riskFile.cr4de_mrs_summary_fr!;
  updatedSummary.cr4de_summary_de = riskFile.cr4de_mrs_summary_de!;

  updatedSummary.cr4de_mrs_p = r(riskFile.results?.[scenario]?.TP);
  updatedSummary.cr4de_mrs_i = r(riskFile.results?.[scenario]?.TI);
  updatedSummary.cr4de_mrs_h = r(
    getCategoryImpactRescaled(riskFile, "H", scenario)
  );
  updatedSummary.cr4de_mrs_s = r(
    getCategoryImpactRescaled(riskFile, "S", scenario)
  );
  updatedSummary.cr4de_mrs_e = r(
    getCategoryImpactRescaled(riskFile, "E", scenario)
  );
  updatedSummary.cr4de_mrs_f = r(
    getCategoryImpactRescaled(riskFile, "F", scenario)
  );

  updatedSummary.cr4de_causing_risks =
    riskFile.cr4de_risk_type === RISK_TYPE.STANDARD
      ? JSON.stringify(
          causes
            .filter((c) => c.p >= minP)
            .map((c) => ({
              cause_risk_id: "id" in c ? c.id : null,
              cause_risk_title: "id" in c ? c.name : "No underlying cause",
              cause_risk_p: c.p,
            }))
        )
      : null;
  updatedSummary.cr4de_effect_risks =
    riskFile.cr4de_risk_type === RISK_TYPE.EMERGING
      ? null
      : JSON.stringify(
          effects
            .filter((e) => e.i >= minI)
            .map((e) => ({
              effect_risk_id: "id" in e ? e.id : null,
              effect_risk_title: e.name,
              effect_risk_i: e.i,
            }))
        );

  updatedSnapshot[
    "cr4de_risk_file@odata.bind"
  ] = `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`;

  updatedSnapshot.cr4de_hazard_id = riskFile.cr4de_hazard_id;
  updatedSnapshot.cr4de_title = riskFile.cr4de_title;
  updatedSnapshot.cr4de_risk_type = riskFile.cr4de_risk_type;
  updatedSnapshot.cr4de_category = riskFile.cr4de_risk_category;

  updatedSnapshot.cr4de_definition = riskFile.cr4de_definition!;
  updatedSnapshot.cr4de_horizon_analysis = riskFile.cr4de_horizon_analysis;
  updatedSnapshot.cr4de_historical_events = riskFile.cr4de_historical_events;
  updatedSnapshot.cr4de_intensity_parameters =
    riskFile.cr4de_intensity_parameters;
  updatedSnapshot.cr4de_scenarios = JSON.stringify({
    [SCENARIOS.CONSIDERABLE]: riskFile.cr4de_scenario_considerable,
    [SCENARIOS.MAJOR]: riskFile.cr4de_scenario_major,
    [SCENARIOS.EXTREME]: riskFile.cr4de_scenario_extreme,
  });

  updatedSnapshot.cr4de_quali_scenario_mrs = riskFile.cr4de_mrs!;
  updatedSnapshot.cr4de_quali_disclaimer_mrs = riskFile.cr4de_mrs_disclaimer;
  updatedSnapshot.cr4de_quali_p_mrs = riskFile.cr4de_mrs_probability;
  updatedSnapshot.cr4de_quali_h_mrs = riskFile.cr4de_mrs_impact_h;
  updatedSnapshot.cr4de_quali_s_mrs = riskFile.cr4de_mrs_impact_s;
  updatedSnapshot.cr4de_quali_e_mrs = riskFile.cr4de_mrs_impact_e;
  updatedSnapshot.cr4de_quali_f_mrs = riskFile.cr4de_mrs_impact_f;
  updatedSnapshot.cr4de_quali_actions_mrs = riskFile.cr4de_mrs_actions;
  updatedSnapshot.cr4de_quali_mm_mrs = riskFile.cr4de_mrs_mm_impact;
  updatedSnapshot.cr4de_quali_cc_mrs = riskFile.cr4de_mrs_cc;

  updatedSnapshot.cr4de_quanti = serializeRiskSnapshotResults({
    considerable: {
      tp: {
        yearly: {
          scale: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TP),
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
          scale: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Ha_abs),
        },
        hb: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Hb),
          scale: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Hb_abs),
        },
        hc: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Hc),
          scale: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Hc_abs),
        },
        s: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_S),
          scaleCat: r(
            getCategoryImpactRescaled(riskFile, "S", SCENARIOS.CONSIDERABLE)
          ),
        },
        sa: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Sa),
          scale: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Sa_abs),
        },
        sb: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Sb),
          scale: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Sb_abs),
        },
        sc: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Sc),
          scale: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Sc_abs),
        },
        sd: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Sd),
          scale: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Sd_abs),
        },
        e: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_E),
          scaleCat: r(
            getCategoryImpactRescaled(riskFile, "E", SCENARIOS.CONSIDERABLE)
          ),
        },
        ea: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Ea),
          scale: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Ea_abs),
        },
        f: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_F),
          scaleCat: r(
            getCategoryImpactRescaled(riskFile, "F", SCENARIOS.CONSIDERABLE)
          ),
        },
        fa: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Fa),
          scale: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Fa_abs),
        },
        fb: {
          scaleTot: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Fb),
          scale: r(riskFile.results?.[SCENARIOS.CONSIDERABLE]?.TI_Fb_abs),
        },
      },
    },
    major: {
      tp: {
        yearly: {
          scale: r(riskFile.results?.[SCENARIOS.MAJOR]?.TP),
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
          scale: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Ha_abs),
        },
        hb: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Hb),
          scale: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Hb_abs),
        },
        hc: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Hc),
          scale: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Hc_abs),
        },
        s: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_S),
          scaleCat: r(
            getCategoryImpactRescaled(riskFile, "S", SCENARIOS.MAJOR)
          ),
        },
        sa: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Sa),
          scale: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Sa_abs),
        },
        sb: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Sb),
          scale: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Sb_abs),
        },
        sc: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Sc),
          scale: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Sc_abs),
        },
        sd: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Sd),
          scale: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Sd_abs),
        },
        e: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_E),
          scaleCat: r(
            getCategoryImpactRescaled(riskFile, "E", SCENARIOS.MAJOR)
          ),
        },
        ea: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Ea),
          scale: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Ea_abs),
        },
        f: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_F),
          scaleCat: r(
            getCategoryImpactRescaled(riskFile, "F", SCENARIOS.MAJOR)
          ),
        },
        fa: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Fa),
          scale: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Fa_abs),
        },
        fb: {
          scaleTot: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Fb),
          scale: r(riskFile.results?.[SCENARIOS.MAJOR]?.TI_Fb_abs),
        },
      },
    },

    extreme: {
      tp: {
        yearly: {
          scale: r(riskFile.results?.[SCENARIOS.EXTREME]?.TP),
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
          scale: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Ha_abs),
        },
        hb: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Hb),
          scale: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Hb_abs),
        },
        hc: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Hc),
          scale: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Hc_abs),
        },
        s: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_S),
          scaleCat: r(
            getCategoryImpactRescaled(riskFile, "S", SCENARIOS.EXTREME)
          ),
        },
        sa: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Sa),
          scale: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Sa_abs),
        },
        sb: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Sb),
          scale: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Sb_abs),
        },
        sc: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Sc),
          scale: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Sc_abs),
        },
        sd: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Sd),
          scale: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Sd_abs),
        },
        e: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_E),
          scaleCat: r(
            getCategoryImpactRescaled(riskFile, "E", SCENARIOS.EXTREME)
          ),
        },
        ea: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Ea),
          scale: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Ea_abs),
        },
        f: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_F),
          scaleCat: r(
            getCategoryImpactRescaled(riskFile, "F", SCENARIOS.EXTREME)
          ),
        },
        fa: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Fa),
          scale: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Fa_abs),
        },
        fb: {
          scaleTot: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Fb),
          scale: r(riskFile.results?.[SCENARIOS.EXTREME]?.TI_Fb_abs),
        },
      },
    },
  });

  for (const cause of cascades.causes) {
    const updatedCascadeSnapshot =
      cascadesSnapshots[cause.cr4de_bnrariskcascadeid] || {};

    updatedCascadeSnapshot[
      "cr4de_risk_cascade@odata.bind"
    ] = `https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades(${cause.cr4de_bnrariskcascadeid})`;

    updatedCascadeSnapshot[
      "cr4de_cause_risk@odata.bind"
    ] = `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${cause._cr4de_cause_hazard_value})`;

    updatedCascadeSnapshot[
      "cr4de_effect_risk@odata.bind"
    ] = `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${cause._cr4de_effect_hazard_value})`;

    updatedCascadeSnapshot.cr4de_quanti_cause = serializeCauseSnapshotResults({
      [SCENARIOS.CONSIDERABLE]: {
        ip: {
          yearly: {
            scale: r(cause.results?.IP_All2C),
          },
        },
        ip50: {
          yearly: {
            scale: r(cause.results?.IP50_All2C),
          },
        },
      },
      [SCENARIOS.MAJOR]: {
        ip: {
          yearly: {
            scale: r(cause.results?.IP_All2M),
          },
        },
        ip50: {
          yearly: {
            scale: r(cause.results?.IP50_All2M),
          },
        },
      },
      [SCENARIOS.EXTREME]: {
        ip: {
          yearly: {
            scale: r(cause.results?.IP_All2E),
          },
        },
        ip50: {
          yearly: {
            scale: r(cause.results?.IP50_All2E),
          },
        },
      },
    });

    cascadesSnapshots[cause.cr4de_bnrariskcascadeid] = updatedCascadeSnapshot;
  }

  for (const effect of cascades.effects) {
    const updatedCascadeSnapshot =
      cascadesSnapshots[effect.cr4de_bnrariskcascadeid] || {};

    updatedCascadeSnapshot[
      "cr4de_risk_cascade@odata.bind"
    ] = `https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades(${effect.cr4de_bnrariskcascadeid})`;

    updatedCascadeSnapshot[
      "cr4de_cause_risk@odata.bind"
    ] = `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${effect._cr4de_cause_hazard_value})`;

    updatedCascadeSnapshot[
      "cr4de_effect_risk@odata.bind"
    ] = `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${effect._cr4de_effect_hazard_value})`;

    if (riskFile.cr4de_risk_type !== RISK_TYPE.EMERGING) {
      updatedCascadeSnapshot.cr4de_quanti_effect =
        serializeEffectSnapshotResults({
          [SCENARIOS.CONSIDERABLE]: {
            ii: {
              all: {
                scale: r(effect.results?.II_C2All),
              },
              h: {
                scale: r(effect.results?.II_C2All_H),
              },
              ha: {
                scale: r(effect.results?.II_C2All_Ha),
              },
              hb: {
                scale: r(effect.results?.II_C2All_Hb),
              },
              hc: {
                scale: r(effect.results?.II_C2All_Hc),
              },
              s: {
                scale: r(effect.results?.II_C2All_S),
              },
              sa: {
                scale: r(effect.results?.II_C2All_Sa),
              },
              sb: {
                scale: r(effect.results?.II_C2All_Sb),
              },
              sc: {
                scale: r(effect.results?.II_C2All_Sc),
              },
              sd: {
                scale: r(effect.results?.II_C2All_Sd),
              },
              e: {
                scale: r(effect.results?.II_C2All_E),
              },
              ea: {
                scale: r(effect.results?.II_C2All_Ea),
              },
              f: {
                scale: r(effect.results?.II_C2All_F),
              },
              fa: {
                scale: r(effect.results?.II_C2All_Fa),
              },
              fb: {
                scale: r(effect.results?.II_C2All_Fb),
              },
            },
          },
          [SCENARIOS.MAJOR]: {
            ii: {
              all: {
                scale: r(effect.results?.II_C2All),
              },
              h: {
                scale: r(effect.results?.II_C2All_H),
              },
              ha: {
                scale: r(effect.results?.II_C2All_Ha),
              },
              hb: {
                scale: r(effect.results?.II_C2All_Hb),
              },
              hc: {
                scale: r(effect.results?.II_C2All_Hc),
              },
              s: {
                scale: r(effect.results?.II_C2All_S),
              },
              sa: {
                scale: r(effect.results?.II_C2All_Sa),
              },
              sb: {
                scale: r(effect.results?.II_C2All_Sb),
              },
              sc: {
                scale: r(effect.results?.II_C2All_Sc),
              },
              sd: {
                scale: r(effect.results?.II_C2All_Sd),
              },
              e: {
                scale: r(effect.results?.II_C2All_E),
              },
              ea: {
                scale: r(effect.results?.II_C2All_Ea),
              },
              f: {
                scale: r(effect.results?.II_C2All_F),
              },
              fa: {
                scale: r(effect.results?.II_C2All_Fa),
              },
              fb: {
                scale: r(effect.results?.II_C2All_Fb),
              },
            },
          },
          [SCENARIOS.EXTREME]: {
            ii: {
              all: {
                scale: r(effect.results?.II_C2All),
              },
              h: {
                scale: r(effect.results?.II_C2All_H),
              },
              ha: {
                scale: r(effect.results?.II_C2All_Ha),
              },
              hb: {
                scale: r(effect.results?.II_C2All_Hb),
              },
              hc: {
                scale: r(effect.results?.II_C2All_Hc),
              },
              s: {
                scale: r(effect.results?.II_C2All_S),
              },
              sa: {
                scale: r(effect.results?.II_C2All_Sa),
              },
              sb: {
                scale: r(effect.results?.II_C2All_Sb),
              },
              sc: {
                scale: r(effect.results?.II_C2All_Sc),
              },
              sd: {
                scale: r(effect.results?.II_C2All_Sd),
              },
              e: {
                scale: r(effect.results?.II_C2All_E),
              },
              ea: {
                scale: r(effect.results?.II_C2All_Ea),
              },
              f: {
                scale: r(effect.results?.II_C2All_F),
              },
              fa: {
                scale: r(effect.results?.II_C2All_Fa),
              },
              fb: {
                scale: r(effect.results?.II_C2All_Fb),
              },
            },
          },
        });
    }

    cascadesSnapshots[effect.cr4de_bnrariskcascadeid] = updatedCascadeSnapshot;
  }

  return {
    newSummary: updatedSummary.cr4de_bnrariskfilesummaryid
      ? undefined
      : updatedSummary,
    newRiskSnapshot: updatedSnapshot.cr4de_bnrarisksnapshotid
      ? undefined
      : updatedSnapshot,
  };
}
