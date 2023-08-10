import { Quality, RiskCalculation, RiskFileMetrics } from "../../types/dataverse/DVAnalysisRun";
import { DVParticipation } from "../../types/dataverse/DVParticipation";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { getImpactScaleNumber } from "../Impact";
import { getProbabilityScaleNumber } from "../Probability";

const qualityScore = {
  [Quality.MISSING]: 0.1,
  [Quality.AVERAGE]: 0.5,
  [Quality.CONSENSUS]: 1,
};

export default function calculateMetrics(
  risk: RiskCalculation,
  allRisks: RiskCalculation[],
  riskFiles: DVRiskFile[],
  participations: DVParticipation[]
): RiskFileMetrics {
  const riskFile = riskFiles.find((r) => r.cr4de_riskfilesid === risk.riskId);

  if (!riskFile) {
    throw Error("No Risk File Found");
  }

  const causeImportanceAbs = risk.causes.reduce((imp, cause) => {
    const causeRisk = allRisks.find((r) => r.riskId === cause.riskId);
    if (!causeRisk) return imp;

    const effect = causeRisk.effects.find((e) => e.riskId === risk.riskId);
    if (!effect) return imp;

    return imp + parseFloat(getImpactScaleNumber(effect.ii));
  }, 0);
  const causeImportance = (3 * causeImportanceAbs) / (3 + causeImportanceAbs);

  const effectImportanceAbs = risk.effects.reduce((imp, effect) => {
    const effectRisk = allRisks.find((r) => r.riskId === effect.riskId);
    if (!effectRisk) return imp;

    const cause = effectRisk.causes.find((c) => c.riskId === risk.riskId);
    if (!cause) return imp;

    return imp + parseFloat(getProbabilityScaleNumber(cause.ip, "DP"));
  }, 0);
  const effectImportance = (3 * effectImportanceAbs) / (3 + effectImportanceAbs);

  const causesReliability =
    risk.causes.reduce((tot, c) => {
      if (risk.quality === Quality.CONSENSUS) return 1;

      const causeRisk = allRisks.find((r) => r.riskId === c.riskId);
      if (!causeRisk) return 0;

      const causeReliabilityAbs = participations
        .filter((p) => p._cr4de_risk_file_value === c.riskId)
        .reduce((rel, p) => {
          return rel + (p.cr4de_cascade_analysis_finished ? 0.5 : 0);
        }, 0);

      return tot + (causeRisk.reliability * causeReliabilityAbs) / (0.5 + causeReliabilityAbs);
    }, 0) / risk.causes.length;

  const effectsReliability =
    risk.effects.reduce((tot, e) => {
      if (risk.quality === Quality.CONSENSUS) return 1;

      const effectRisk = allRisks.find((r) => r.riskId === e.riskId);
      if (!effectRisk) return 0;

      const effectReliabilityAbs = participations
        .filter((p) => p._cr4de_risk_file_value === e.riskId)
        .reduce((rel, p) => {
          return rel + (p.cr4de_cascade_analysis_finished ? 0.5 : 0);
        }, 0);

      return tot + (effectRisk.reliability * effectReliabilityAbs) / (0.5 + effectReliabilityAbs);
    }, 0) / risk.effects.length;

  return {
    importance: {
      causes: causeImportance,
      effects: effectImportance,
      total:
        (riskFile.cr4de_subjective_importance +
          (parseFloat(getImpactScaleNumber(risk.ti)) * 2) / 5 +
          causeImportance / 3 +
          effectImportance / 3) /
        7,
    },

    reliability: {
      causes: causesReliability,
      effects: effectsReliability,
      total: (risk.reliability + 0.5 * causesReliability + 0.5 * effectsReliability) / 2,
    },

    divergence: {
      directAnalysis: 0,
      cascadeAnalyses: 0,
      other: 0,
      total: 0,
    },
  };
}
