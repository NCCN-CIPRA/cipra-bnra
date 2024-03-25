import {
  CascadeCalculation,
  Quality,
  RiskCalculation,
  RiskCalculationKnownFields,
} from "../../types/dataverse/DVAnalysisRun";
import { DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";
import { DVContact } from "../../types/dataverse/DVContact";
import { DVDirectAnalysis, FieldQuality } from "../../types/dataverse/DVDirectAnalysis";
import { DVParticipation } from "../../types/dataverse/DVParticipation";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import { getAbsoluteImpact } from "../Impact";
import { getAbsoluteProbability, getDPDailyProbability } from "../Probability";
import { getAverage, getConsensusRiskFile as getConsensusRiskFileAverage } from "../inputProcessing";

const SC_FACTOR = 1;

interface Metrics {
  consensus: number;
  average: number;
  missing: number;
  total: number;
}

const getAveragesForScenarios = (
  name: string,
  parameter: string,
  field: string,
  directAnalyses: DVDirectAnalysis[],
  absoluteValueGetter: (strValue: string | null) => number
) => {
  const daField = field.indexOf("climate_change") >= 0 ? "cr4de_dp50_quanti" : field;

  const factor = daField === "di_Sc" ? SC_FACTOR : 1;

  return {
    [`${name}_c`]:
      absoluteValueGetter(
        getAverage(
          directAnalyses.map((da) => da[`${daField}_c` as keyof DVDirectAnalysis]) as string[],
          directAnalyses.map(
            (da) => (da.cr4de_quality && da.cr4de_quality[`${parameter}_c` as keyof FieldQuality]) || 2.5
          )
        )
      ) / factor,
    [`${name}_m`]:
      absoluteValueGetter(
        getAverage(
          directAnalyses.map((da) => da[`${daField}_m` as keyof DVDirectAnalysis]) as string[],
          directAnalyses.map(
            (da) => (da.cr4de_quality && da.cr4de_quality[`${parameter}_m` as keyof FieldQuality]) || 2.5
          )
        )
      ) / factor,
    [`${name}_e`]:
      absoluteValueGetter(
        getAverage(
          directAnalyses.map((da) => da[`${daField}_e` as keyof DVDirectAnalysis]) as string[],
          directAnalyses.map(
            (da) => (da.cr4de_quality && da.cr4de_quality[`${parameter}_e` as keyof FieldQuality]) || 2.5
          )
        )
      ) / factor,
  };
};

const getConsensusRiskFile = (
  riskFile: DVRiskFile,
  participations: DVParticipation[],
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[] | undefined
): RiskCalculationKnownFields => {
  const goodDAs = directAnalyses
    ? directAnalyses.filter((da) =>
        participations.some(
          (p) =>
            p._cr4de_contact_value === da.cr4de_expert.contactid &&
            p.cr4de_role === "expert" &&
            p.cr4de_direct_analysis_finished
        )
      )
    : [];

  if (
    (riskFile.cr4de_consensus_date && new Date(riskFile.cr4de_consensus_date) <= new Date()) ||
    riskFile.cr4de_risk_type === RISK_TYPE.EMERGING
  )
    return {
      quality: Quality.CONSENSUS,
      reliability: goodDAs.length,
      dp_c: getAbsoluteProbability(riskFile.cr4de_dp_quanti_c),
      dp_m: getAbsoluteProbability(riskFile.cr4de_dp_quanti_m),
      dp_e: getAbsoluteProbability(riskFile.cr4de_dp_quanti_e),

      di_Ha_c: getAbsoluteImpact(riskFile.cr4de_di_quanti_ha_c),
      di_Hb_c: getAbsoluteImpact(riskFile.cr4de_di_quanti_hb_c),
      di_Hc_c: getAbsoluteImpact(riskFile.cr4de_di_quanti_hc_c),
      di_Sa_c: getAbsoluteImpact(riskFile.cr4de_di_quanti_sa_c),
      di_Sb_c: getAbsoluteImpact(riskFile.cr4de_di_quanti_sb_c),
      di_Sc_c: getAbsoluteImpact(riskFile.cr4de_di_quanti_sc_c) / SC_FACTOR,
      di_Sd_c: getAbsoluteImpact(riskFile.cr4de_di_quanti_sd_c),
      di_Ea_c: getAbsoluteImpact(riskFile.cr4de_di_quanti_ea_c),
      di_Fa_c: getAbsoluteImpact(riskFile.cr4de_di_quanti_fa_c),
      di_Fb_c: getAbsoluteImpact(riskFile.cr4de_di_quanti_fb_c),

      di_Ha_m: getAbsoluteImpact(riskFile.cr4de_di_quanti_ha_m),
      di_Hb_m: getAbsoluteImpact(riskFile.cr4de_di_quanti_hb_m),
      di_Hc_m: getAbsoluteImpact(riskFile.cr4de_di_quanti_hc_m),
      di_Sa_m: getAbsoluteImpact(riskFile.cr4de_di_quanti_sa_m),
      di_Sb_m: getAbsoluteImpact(riskFile.cr4de_di_quanti_sb_m),
      di_Sc_m: getAbsoluteImpact(riskFile.cr4de_di_quanti_sc_m) / SC_FACTOR,
      di_Sd_m: getAbsoluteImpact(riskFile.cr4de_di_quanti_sd_m),
      di_Ea_m: getAbsoluteImpact(riskFile.cr4de_di_quanti_ea_m),
      di_Fa_m: getAbsoluteImpact(riskFile.cr4de_di_quanti_fa_m),
      di_Fb_m: getAbsoluteImpact(riskFile.cr4de_di_quanti_fb_m),

      di_Ha_e: getAbsoluteImpact(riskFile.cr4de_di_quanti_ha_e),
      di_Hb_e: getAbsoluteImpact(riskFile.cr4de_di_quanti_hb_e),
      di_Hc_e: getAbsoluteImpact(riskFile.cr4de_di_quanti_hc_e),
      di_Sa_e: getAbsoluteImpact(riskFile.cr4de_di_quanti_sa_e),
      di_Sb_e: getAbsoluteImpact(riskFile.cr4de_di_quanti_sb_e),
      di_Sc_e: getAbsoluteImpact(riskFile.cr4de_di_quanti_sc_e) / SC_FACTOR,
      di_Sd_e: getAbsoluteImpact(riskFile.cr4de_di_quanti_sd_e),
      di_Ea_e: getAbsoluteImpact(riskFile.cr4de_di_quanti_ea_e),
      di_Fa_e: getAbsoluteImpact(riskFile.cr4de_di_quanti_fa_e),
      di_Fb_e: getAbsoluteImpact(riskFile.cr4de_di_quanti_fb_e),

      dp50_c: getAbsoluteProbability(riskFile.cr4de_climate_change_quanti_c),
      dp50_m: getAbsoluteProbability(riskFile.cr4de_climate_change_quanti_m),
      dp50_e: getAbsoluteProbability(riskFile.cr4de_climate_change_quanti_e),
    };

  if (goodDAs.length > 0)
    return {
      quality: Quality.AVERAGE,
      reliability: goodDAs.length,
      ...getAveragesForScenarios("dp", "dp", "cr4de_dp_quanti", goodDAs, getAbsoluteProbability),
      ...getAveragesForScenarios("di_Ha", "h", "cr4de_di_quanti_ha", goodDAs, getAbsoluteImpact),
      ...getAveragesForScenarios("di_Hb", "h", "cr4de_di_quanti_hb", goodDAs, getAbsoluteImpact),
      ...getAveragesForScenarios("di_Hc", "h", "cr4de_di_quanti_hc", goodDAs, getAbsoluteImpact),
      ...getAveragesForScenarios("di_Sa", "s", "cr4de_di_quanti_sa", goodDAs, getAbsoluteImpact),
      ...getAveragesForScenarios("di_Sb", "s", "cr4de_di_quanti_sb", goodDAs, getAbsoluteImpact),
      ...getAveragesForScenarios("di_Sc", "s", "cr4de_di_quanti_sc", goodDAs, getAbsoluteImpact),
      ...getAveragesForScenarios("di_Sd", "s", "cr4de_di_quanti_sd", goodDAs, getAbsoluteImpact),
      ...getAveragesForScenarios("di_Ea", "e", "cr4de_di_quanti_ea", goodDAs, getAbsoluteImpact),
      ...getAveragesForScenarios("di_Fa", "f", "cr4de_di_quanti_fa", goodDAs, getAbsoluteImpact),
      ...getAveragesForScenarios("di_Fb", "f", "cr4de_di_quanti_fb", goodDAs, getAbsoluteImpact),
      ...getAveragesForScenarios("dp50", "cc", "cr4de_climate_change_quanti", goodDAs, getAbsoluteProbability),
    } as RiskCalculationKnownFields;

  return {
    quality: Quality.MISSING,
    reliability: 0,
    dp_c: 0,
    dp_m: 0,
    dp_e: 0,

    di_Ha_c: 0,
    di_Hb_c: 0,
    di_Hc_c: 0,
    di_Sa_c: 0,
    di_Sb_c: 0,
    di_Sc_c: 0,
    di_Sd_c: 0,
    di_Ea_c: 0,
    di_Fa_c: 0,
    di_Fb_c: 0,

    di_Ha_m: 0,
    di_Hb_m: 0,
    di_Hc_m: 0,
    di_Sa_m: 0,
    di_Sb_m: 0,
    di_Sc_m: 0,
    di_Sd_m: 0,
    di_Ea_m: 0,
    di_Fa_m: 0,
    di_Fb_m: 0,

    di_Ha_e: 0,
    di_Hb_e: 0,
    di_Hc_e: 0,
    di_Sa_e: 0,
    di_Sb_e: 0,
    di_Sc_e: 0,
    di_Sd_e: 0,
    di_Ea_e: 0,
    di_Fa_e: 0,
    di_Fb_e: 0,

    dp50_c: 0,
    dp50_m: 0,
    dp50_e: 0,
  };
};

const getConsensusCascade = (
  cause: DVRiskFile,
  effect: DVRiskFile,
  cascade: DVRiskCascade,
  participations: DVParticipation[],
  cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[] | undefined
) => {
  const goodCAs = cascadeAnalyses
    ? cascadeAnalyses.filter((ca) =>
        participations.some(
          (p) =>
            p._cr4de_contact_value === ca.cr4de_expert.contactid &&
            p.cr4de_role === "expert" &&
            p.cr4de_direct_analysis_finished
        )
      )
    : [];

  if (
    (effect.cr4de_consensus_date && new Date(effect.cr4de_consensus_date) <= new Date()) ||
    effect.cr4de_risk_type === RISK_TYPE.EMERGING
  ) {
    return {
      quality: Quality.CONSENSUS,
      reliabilty: goodCAs.length,
      c2c: getAbsoluteProbability(cascade.cr4de_c2c),
      c2m: getAbsoluteProbability(cascade.cr4de_c2m),
      c2e: getAbsoluteProbability(cascade.cr4de_c2e),
      m2c: getAbsoluteProbability(cascade.cr4de_m2c),
      m2m: getAbsoluteProbability(cascade.cr4de_m2m),
      m2e: getAbsoluteProbability(cascade.cr4de_m2e),
      e2c: getAbsoluteProbability(cascade.cr4de_e2c),
      e2m: getAbsoluteProbability(cascade.cr4de_e2m),
      e2e: getAbsoluteProbability(cascade.cr4de_e2e),
    };
  }

  if (goodCAs.length > 0) {
    return {
      quality: Quality.AVERAGE,
      reliabilty: goodCAs.length,
      c2c: getAbsoluteProbability(
        getAverage(
          goodCAs.map((ca) => ca.cr4de_c2c),
          goodCAs.map((ca) => ca.cr4de_quality || 2.5)
        )
      ),
      c2m: getAbsoluteProbability(
        getAverage(
          goodCAs.map((ca) => ca.cr4de_c2m),
          goodCAs.map((ca) => ca.cr4de_quality || 2.5)
        )
      ),
      c2e: getAbsoluteProbability(
        getAverage(
          goodCAs.map((ca) => ca.cr4de_c2e),
          goodCAs.map((ca) => ca.cr4de_quality || 2.5)
        )
      ),
      m2c: getAbsoluteProbability(
        getAverage(
          goodCAs.map((ca) => ca.cr4de_m2c),
          goodCAs.map((ca) => ca.cr4de_quality || 2.5)
        )
      ),
      m2m: getAbsoluteProbability(
        getAverage(
          goodCAs.map((ca) => ca.cr4de_m2m),
          goodCAs.map((ca) => ca.cr4de_quality || 2.5)
        )
      ),
      m2e: getAbsoluteProbability(
        getAverage(
          goodCAs.map((ca) => ca.cr4de_m2e),
          goodCAs.map((ca) => ca.cr4de_quality || 2.5)
        )
      ),
      e2c: getAbsoluteProbability(
        getAverage(
          goodCAs.map((ca) => ca.cr4de_e2c),
          goodCAs.map((ca) => ca.cr4de_quality || 2.5)
        )
      ),
      e2m: getAbsoluteProbability(
        getAverage(
          goodCAs.map((ca) => ca.cr4de_e2m),
          goodCAs.map((ca) => ca.cr4de_quality || 2.5)
        )
      ),
      e2e: getAbsoluteProbability(
        getAverage(
          goodCAs.map((ca) => ca.cr4de_e2e),
          goodCAs.map((ca) => ca.cr4de_quality || 2.5)
        )
      ),
    };
  }

  return {
    quality: Quality.MISSING,
    reliabilty: 0,
    c2c: 0,
    c2m: 0,
    c2e: 0,
    m2c: 0,
    m2m: 0,
    m2e: 0,
    e2c: 0,
    e2m: 0,
    e2e: 0,
  };
};

const getNormalizedCascade = (c: ReturnType<typeof getConsensusCascade>) => {
  const c20 = (1 - c.c2c) * (1 - c.c2m) * (1 - c.c2e);
  const m20 = (1 - c.m2c) * (1 - c.m2m) * (1 - c.m2e);
  const e20 = (1 - c.e2c) * (1 - c.e2m) * (1 - c.e2e);

  const cTot = c20 + c.c2c + c.c2m + c.c2e;
  const mTot = m20 + c.m2c + c.m2m + c.m2e;
  const eTot = e20 + c.e2c + c.e2m + c.e2e;

  return {
    ...c,
    c2c: c.c2c / cTot,
    c2m: c.c2m / cTot,
    c2e: c.c2e / cTot,
    m2c: c.m2c / mTot,
    m2m: c.m2m / mTot,
    m2e: c.m2e / mTot,
    e2c: c.e2c / eTot,
    e2m: c.e2m / eTot,
    e2e: c.e2e / eTot,
  };
};

export default function prepareRiskFiles(
  riskFiles: DVRiskFile[],
  riskFilesDict: { [key: string]: DVRiskFile },
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[],
  participations: DVParticipation[],
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[],
  cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[]
): RiskCalculation[] {
  const daDict: { [key: string]: DVDirectAnalysis<unknown, DVContact>[] } = directAnalyses.reduce((acc, da) => {
    if (!acc[da._cr4de_risk_file_value]) {
      return {
        ...acc,
        [da._cr4de_risk_file_value]: [da],
      };
    }
    return {
      ...acc,
      [da._cr4de_risk_file_value]: [...acc[da._cr4de_risk_file_value], da],
    };
  }, {} as { [key: string]: DVDirectAnalysis<unknown, DVContact>[] });

  const caDict: { [key: string]: DVCascadeAnalysis<unknown, unknown, DVContact>[] } = cascadeAnalyses.reduce(
    (acc, ca) => {
      if (!acc[ca._cr4de_cascade_value]) {
        return {
          ...acc,
          [ca._cr4de_cascade_value]: [ca],
        };
      }
      return {
        ...acc,
        [ca._cr4de_cascade_value]: [...acc[ca._cr4de_cascade_value], ca],
      };
    },
    {} as { [key: string]: DVCascadeAnalysis<unknown, unknown, DVContact>[] }
  );

  const calculations: RiskCalculation[] = riskFiles
    .filter((rf) => rf.cr4de_risk_type !== RISK_TYPE.EMERGING)
    .map((rf) => {
      const crf = getConsensusRiskFile(
        rf,
        participations.filter((p) => p._cr4de_risk_file_value === rf.cr4de_riskfilesid),
        daDict[rf.cr4de_riskfilesid]
      );

      const c = {
        riskId: rf.cr4de_riskfilesid,
        riskTitle: rf.cr4de_title,

        timestamp: Date.now(),

        // Initialize known fields
        ...crf,

        // Initialize unknown fields
        dp: 0,
        dp50: 0,

        ip_c: 0,
        ip_m: 0,
        ip_e: 0,

        ip: 0,

        ip50_c: 0,
        ip50_m: 0,
        ip50_e: 0,

        ip50: 0,

        tp_c: 0,
        tp_m: 0,
        tp_e: 0,

        tp: 0,

        tp50_c: 0,
        tp50_m: 0,
        tp50_e: 0,

        tp50: 0,

        rp_c: 0,
        rp_m: 0,
        rp_e: 0,

        di_Ha: crf.di_Ha_c + crf.di_Ha_m + crf.di_Ha_e,
        di_Hb: crf.di_Hb_c + crf.di_Hb_m + crf.di_Hb_e,
        di_Hc: crf.di_Hc_c + crf.di_Hc_m + crf.di_Hc_e,
        di_Sa: crf.di_Sa_c + crf.di_Sa_m + crf.di_Sa_e,
        di_Sb: crf.di_Sb_c + crf.di_Sb_m + crf.di_Sb_e,
        di_Sc: crf.di_Sc_c + crf.di_Sc_m + crf.di_Sc_e,
        di_Sd: crf.di_Sd_c + crf.di_Sd_m + crf.di_Sd_e,
        di_Ea: crf.di_Ea_c + crf.di_Ea_m + crf.di_Ea_e,
        di_Fa: crf.di_Fa_c + crf.di_Fa_m + crf.di_Fa_e,
        di_Fb: crf.di_Fb_c + crf.di_Fb_m + crf.di_Fb_e,

        di_c:
          crf.di_Ha_c +
          crf.di_Hb_c +
          crf.di_Hc_c +
          crf.di_Sa_c +
          crf.di_Sb_c +
          crf.di_Sc_c +
          crf.di_Sd_c +
          crf.di_Ea_c +
          crf.di_Fa_c +
          crf.di_Fb_c,
        di_m:
          crf.di_Ha_m +
          crf.di_Hb_m +
          crf.di_Hc_m +
          crf.di_Sa_m +
          crf.di_Sb_m +
          crf.di_Sc_m +
          crf.di_Sd_m +
          crf.di_Ea_m +
          crf.di_Fa_m +
          crf.di_Fb_m,
        di_e:
          crf.di_Ha_e +
          crf.di_Hb_e +
          crf.di_Hc_e +
          crf.di_Sa_e +
          crf.di_Sb_e +
          crf.di_Sc_e +
          crf.di_Sd_e +
          crf.di_Ea_e +
          crf.di_Fa_e +
          crf.di_Fb_e,

        di: 0,

        ii_Ha_c: 0,
        ii_Hb_c: 0,
        ii_Hc_c: 0,
        ii_Sa_c: 0,
        ii_Sb_c: 0,
        ii_Sc_c: 0,
        ii_Sd_c: 0,
        ii_Ea_c: 0,
        ii_Fa_c: 0,
        ii_Fb_c: 0,

        ii_Ha_m: 0,
        ii_Hb_m: 0,
        ii_Hc_m: 0,
        ii_Sa_m: 0,
        ii_Sb_m: 0,
        ii_Sc_m: 0,
        ii_Sd_m: 0,
        ii_Ea_m: 0,
        ii_Fa_m: 0,
        ii_Fb_m: 0,

        ii_Ha_e: 0,
        ii_Hb_e: 0,
        ii_Hc_e: 0,
        ii_Sa_e: 0,
        ii_Sb_e: 0,
        ii_Sc_e: 0,
        ii_Sd_e: 0,
        ii_Ea_e: 0,
        ii_Fa_e: 0,
        ii_Fb_e: 0,

        ii_Ha: 0,
        ii_Hb: 0,
        ii_Hc: 0,
        ii_Sa: 0,
        ii_Sb: 0,
        ii_Sc: 0,
        ii_Sd: 0,
        ii_Ea: 0,
        ii_Fa: 0,
        ii_Fb: 0,

        ii_c: 0,
        ii_m: 0,
        ii_e: 0,

        ii: 0,

        ti_Ha_c: 0,
        ti_Hb_c: 0,
        ti_Hc_c: 0,
        ti_Sa_c: 0,
        ti_Sb_c: 0,
        ti_Sc_c: 0,
        ti_Sd_c: 0,
        ti_Ea_c: 0,
        ti_Fa_c: 0,
        ti_Fb_c: 0,

        ti_Ha_m: 0,
        ti_Hb_m: 0,
        ti_Hc_m: 0,
        ti_Sa_m: 0,
        ti_Sb_m: 0,
        ti_Sc_m: 0,
        ti_Sd_m: 0,
        ti_Ea_m: 0,
        ti_Fa_m: 0,
        ti_Fb_m: 0,

        ti_Ha_e: 0,
        ti_Hb_e: 0,
        ti_Hc_e: 0,
        ti_Sa_e: 0,
        ti_Sb_e: 0,
        ti_Sc_e: 0,
        ti_Sd_e: 0,
        ti_Ea_e: 0,
        ti_Fa_e: 0,
        ti_Fb_e: 0,

        ti_Ha: 0,
        ti_Hb: 0,
        ti_Hc: 0,
        ti_Sa: 0,
        ti_Sb: 0,
        ti_Sc: 0,
        ti_Sd: 0,
        ti_Ea: 0,
        ti_Fa: 0,
        ti_Fb: 0,

        ti_c: 0,
        ti_m: 0,
        ti_e: 0,

        ti: 0,

        tr_c: 0,
        tr_m: 0,
        tr_e: 0,

        tr: 0,

        causes: [],
        effects: [],
      };

      c.di = c.di_c + c.di_m + c.di_e;

      return c;
    });

  // Create a lookup table so we can easily find a calculation by the id of its risk file
  const calculationsDict: { [key: string]: RiskCalculation } = calculations.reduce(
    (dict, calculation) => ({
      ...dict,
      [calculation.riskId]: calculation,
    }),
    {}
  );

  const hasTitle = (cascade: DVRiskCascade<SmallRisk, SmallRisk>, titles: string[]) => {
    return titles.some(
      (t) =>
        cascade.cr4de_cause_hazard.cr4de_title.indexOf(t) >= 0 ||
        cascade.cr4de_effect_hazard.cr4de_title.indexOf(t) >= 0
    );
  };

  // Create links between the risk file calculation objects according to the risk cascades
  cascades.forEach((c) => {
    if (c.cr4de_cause_hazard.cr4de_risk_type === RISK_TYPE.EMERGING) return;

    // if (hasTitle(c, ["Information", "Subsidence", "Espionage", "Interference"])) return;
    // if (hasTitle(c, ["Information", "sewage", "Building Struct", "Unrest", "Substandard"])) return;

    const cause = calculationsDict[c._cr4de_cause_hazard_value];
    const effect = calculationsDict[c._cr4de_effect_hazard_value];

    if (!cause || !effect) return;

    const cascadeCalculation = {
      cause: cause,
      effect: effect,

      cascadeId: c.cr4de_bnrariskcascadeid,
      cascadeTitle: `${cause.riskTitle} causes ${effect.riskTitle}`,

      damp: c.cr4de_damp || true,

      ...getNormalizedCascade(
        getConsensusCascade(
          riskFilesDict[c._cr4de_cause_hazard_value],
          riskFilesDict[c._cr4de_effect_hazard_value],
          c,
          participations.filter(
            (p) =>
              p._cr4de_risk_file_value === c._cr4de_cause_hazard_value ||
              p._cr4de_risk_file_value === c._cr4de_effect_hazard_value
          ),
          caDict[c.cr4de_bnrariskcascadeid]
        )
      ),

      ip_c: 0,
      ip_m: 0,
      ip_e: 0,

      ip: 0,

      ip50_c: 0,
      ip50_m: 0,
      ip50_e: 0,

      ip50: 0,

      ii_Ha_c: 0,
      ii_Hb_c: 0,
      ii_Hc_c: 0,
      ii_Sa_c: 0,
      ii_Sb_c: 0,
      ii_Sc_c: 0,
      ii_Sd_c: 0,
      ii_Ea_c: 0,
      ii_Fa_c: 0,
      ii_Fb_c: 0,

      ii_Ha_m: 0,
      ii_Hb_m: 0,
      ii_Hc_m: 0,
      ii_Sa_m: 0,
      ii_Sb_m: 0,
      ii_Sc_m: 0,
      ii_Sd_m: 0,
      ii_Ea_m: 0,
      ii_Fa_m: 0,
      ii_Fb_m: 0,

      ii_Ha_e: 0,
      ii_Hb_e: 0,
      ii_Hc_e: 0,
      ii_Sa_e: 0,
      ii_Sb_e: 0,
      ii_Sc_e: 0,
      ii_Sd_e: 0,
      ii_Ea_e: 0,
      ii_Fa_e: 0,
      ii_Fb_e: 0,

      ii_Ha: 0,
      ii_Hb: 0,
      ii_Hc: 0,
      ii_Sa: 0,
      ii_Sb: 0,
      ii_Sc: 0,
      ii_Sd: 0,
      ii_Ea: 0,
      ii_Fa: 0,
      ii_Fb: 0,

      ii_c: 0,
      ii_m: 0,
      ii_e: 0,

      ii: 0,

      ir_c: 0,
      ir_m: 0,
      ir_e: 0,

      ir: 0,
    };

    // if (
    //   (cascadeCalculation.c2c +
    //     cascadeCalculation.c2m +
    //     cascadeCalculation.c2e +
    //     cascadeCalculation.m2c +
    //     cascadeCalculation.m2m +
    //     cascadeCalculation.m2e +
    //     cascadeCalculation.e2c +
    //     cascadeCalculation.e2m +
    //     cascadeCalculation.e2e) /
    //     9 >
    //   0.3
    // ) {
    //   console.log(
    //     `${cascadeCalculation.cascadeTitle}: ${
    //       (cascadeCalculation.c2c +
    //         cascadeCalculation.c2m +
    //         cascadeCalculation.c2e +
    //         cascadeCalculation.m2c +
    //         cascadeCalculation.m2m +
    //         cascadeCalculation.m2e +
    //         cascadeCalculation.e2c +
    //         cascadeCalculation.e2m +
    //         cascadeCalculation.e2e) /
    //       9
    //     }`
    //   );
    //   return;
    // }

    cause.effects.push(cascadeCalculation);
    effect.causes.push(cascadeCalculation);
  });

  return calculations;
}
