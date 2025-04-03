import xlsx from "xlsx";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { getScenarioParameter, SCENARIOS } from "../scenarios";
import {
  Cascades,
  getCascades,
  getCausesWithDP,
  getEffectsWithDI,
} from "../cascades";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import { t } from "i18next";
import round from "../roundNumberString";

export enum Pareto {
  SIGNIFICANT = "significant",
  OTHER = "other",
}

export type ExcelCause = {
  scenario: SCENARIOS; // The risk file scenario for which the probabilities of this cause apply
  causeId: string;
  causeTitle: string;
  pareto: Pareto; // Wether this cause is considered significant according to pareto analysis
  pRank: number; // The ranking of this cause, highest P % => rank 0
  //   pRel: string; // The relative scale of the probability (TPX)
  pAbs: number; // The absolute (daily) probability of this cause
  pPerc: number; // The percentage contribution of this cause to the total probability of the scenario
};

export type ExcelEffect = {
  scenario: SCENARIOS; // The risk file scenario for which the impacts of this effect apply
  effectId: string;
  effectTitle: string;
  iTotPareto: Pareto; // Wether this effect is considered significant according to pareto analysis
  iTotRank: number; // The ranking of the impact of this effect, highest I % => rank 0
  iTotAbs: number; // The absolute (monetary) impact of this effect
  iTotPerc: number; // The percentage contribution of the impact of this effect to the total impact of the scenario
  iHPareto: Pareto; // Wether this effect is considered significant according to pareto analysis
  iHRank: number; // The ranking of the impact of this effect, highest I % => rank 0
  iHAbs: number; // The absolute (monetary) impact of this effect
  iHPerc: number; // The percentage contribution of the impact of this effect to the total impact of the scenario
  iSPareto: Pareto; // Wether this effect is considered significant according to pareto analysis
  iSRank: number; // The ranking of the impact of this effect, highest I % => rank 0
  iSAbs: number; // The absolute (monetary) impact of this effect
  iSPerc: number; // The percentage contribution of the impact of this effect to the total impact of the scenario
  iEPareto: Pareto; // Wether this effect is considered significant according to pareto analysis
  iERank: number; // The ranking of the impact of this effect, highest I % => rank 0
  iEAbs: number; // The absolute (monetary) impact of this effect
  iEPerc: number; // The percentage contribution of the impact of this effect to the total impact of the scenario
  iFPareto: Pareto; // Wether this effect is considered significant according to pareto analysis
  iFRank: number; // The ranking of the impact of this effect, highest I % => rank 0
  iFAbs: number; // The absolute (monetary) impact of this effect
  iFPerc: number; // The percentage contribution of the impact of this effect to the total impact of the scenario
};

export default function exportExcel({
  exportedRiskFiles,
  riskFiles,
  allCascades,
  onProgress,
}: {
  exportedRiskFiles: DVRiskFile[];
  riskFiles: DVRiskFile[];
  allCascades: DVRiskCascade[];
  onProgress: (message: string) => void;
}) {
  const hc: { [key: string]: DVRiskFile } = riskFiles.reduce(
    (acc, sr) => ({ ...acc, [sr.cr4de_riskfilesid]: sr }),
    {}
  );
  const riskCascades: DVRiskCascade<SmallRisk, SmallRisk>[] = allCascades.map(
    (c) => ({
      ...c,
      cr4de_cause_hazard: hc[c._cr4de_cause_hazard_value],
      cr4de_effect_hazard: hc[c._cr4de_effect_hazard_value],
    })
  );

  const cascades: { [key: string]: Cascades } = riskFiles.reduce(
    (acc, rf) => getCascades(rf, acc, hc)(riskCascades),
    {}
  );

  const workbook = xlsx.utils.book_new();

  for (const riskFile of exportedRiskFiles) {
    addRiskFile({
      workbook,
      riskFile,
      cascades: cascades[riskFile.cr4de_riskfilesid],
    });
  }
  const excelBuffer = xlsx.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  return blob;
}

function addRiskFile({
  workbook,
  riskFile,
  cascades,
}: {
  workbook: xlsx.WorkBook;
  riskFile: DVRiskFile;
  cascades: Cascades;
}) {
  const causes = getCauses(riskFile, cascades);
  const effects = getEffects(riskFile, cascades);

  const PSheet = xlsx.utils.json_to_sheet(causes);
  xlsx.utils.book_append_sheet(
    workbook,
    PSheet,
    `P - ${riskFile.cr4de_hazard_id}`
  );

  const ISheet = xlsx.utils.json_to_sheet(effects);
  xlsx.utils.book_append_sheet(
    workbook,
    ISheet,
    `I - ${riskFile.cr4de_hazard_id}`
  );
}

function getCauses(
  riskFile: DVRiskFile<unknown>,
  cascades: Cascades
): ExcelCause[] {
  if (!riskFile.results) throw new Error("No result snapshot");

  return [SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, SCENARIOS.EXTREME].reduce(
    (acc, s) => {
      const causes = getCausesWithDP(riskFile, cascades, s);

      return [
        ...acc,
        ...causes
          .sort((a, b) => b.p - a.p)
          .reduce(
            (acc, c) => [
              ...acc,
              {
                id: "",
                ...c,
                pCumul: causes.reduce(
                  (pCumul, prevC) =>
                    prevC.p > c.p ? pCumul + prevC.p : pCumul,
                  0
                ),
              },
            ],
            [] as { id: string; name: string; p: number; pCumul: number }[]
          )
          .map((c, i) => ({
            scenario: s,
            causeId: "id" in c ? c.id : "Direct Probability",
            causeTitle: t(c.name),
            pareto:
              c.pCumul <=
              0.8 * (getScenarioParameter(riskFile, "TP", s) || 0.001)
                ? Pareto.SIGNIFICANT
                : Pareto.OTHER,
            pRank: i + 1,
            pAbs: Math.round(100000 * c.p) / 100000,
            pPerc:
              Math.round(
                (100000 * c.p) /
                  (getScenarioParameter(riskFile, "TP", s) || 0.001)
              ) / 100000,
          }))
          .sort((a, b) => a.pRank - b.pRank),
      ];
    },
    [] as ExcelCause[]
  );
}

function getEffects(riskFile: DVRiskFile, cascades: Cascades): ExcelEffect[] {
  if (!riskFile.results) throw new Error("No result snapshot");

  return [SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, SCENARIOS.EXTREME].reduce(
    (acc, s) => {
      const effects = getEffectsWithDI(riskFile, cascades, s);

      return [
        ...acc,
        ...effects
          .sort((a, b) => b.i - a.i)
          .reduce(
            (acc, e) => [
              ...acc,
              {
                id: "",
                ...e,
                iTotCumul: effects.reduce(
                  (iCumul, prevC) =>
                    prevC.i > e.i ? iCumul + prevC.i : iCumul,
                  0
                ),
                iHCumul: effects
                  .sort((a, b) => b.iH - a.iH)
                  .reduce(
                    (iCumul, prevC) =>
                      prevC.iH > e.iH ? iCumul + prevC.iH : iCumul,
                    0
                  ),
                iSCumul: effects
                  .sort((a, b) => b.iS - a.iS)
                  .reduce(
                    (iCumul, prevC) =>
                      prevC.iS > e.iS ? iCumul + prevC.iS : iCumul,
                    0
                  ),
                iECumul: effects
                  .sort((a, b) => b.iE - a.iE)
                  .reduce(
                    (iCumul, prevC) =>
                      prevC.iE > e.iE ? iCumul + prevC.iE : iCumul,
                    0
                  ),
                iFCumul: effects
                  .sort((a, b) => b.iF - a.iF)
                  .reduce(
                    (iCumul, prevC) =>
                      prevC.iF > e.iF ? iCumul + prevC.iF : iCumul,
                    0
                  ),
                iTot: e.i,
              },
            ],
            [] as {
              id: string;
              name: string;
              iTot: number;
              iH: number;
              iS: number;
              iE: number;
              iF: number;
              iTotCumul: number;
              iHCumul: number;
              iSCumul: number;
              iFCumul: number;
              iECumul: number;
            }[]
          )
          .map((e, i) => ({
            scenario: s,
            effectId: "id" in e ? e.id : "Direct Impact",
            effectTitle: t(e.name),
            iTotPareto:
              e.iTotCumul <=
              0.8 * (getScenarioParameter(riskFile, "TI", s) || 0.001)
                ? Pareto.SIGNIFICANT
                : Pareto.OTHER,
            iTotRank: i + 1,
            iTotAbs: Math.round(100000 * e.iTot) / 100000,
            iTotPerc:
              Math.round(
                (100000 * e.iTot) /
                  (getScenarioParameter(riskFile, "TI", s) || 0.001)
              ) / 100000,
            iHPareto:
              e.iHCumul <=
              0.8 * (getScenarioParameter(riskFile, "TI_H", s) || 0.001)
                ? Pareto.SIGNIFICANT
                : Pareto.OTHER,
            iHRank: i + 1,
            iHAbs: Math.round(100000 * e.iTot) / 100000,
            iHPerc:
              Math.round(
                (100000 * e.iH) /
                  (getScenarioParameter(riskFile, "TI_H", s) || 0.001)
              ) / 100000,
            iSPareto:
              e.iSCumul <=
              0.8 * (getScenarioParameter(riskFile, "TI_S", s) || 0.001)
                ? Pareto.SIGNIFICANT
                : Pareto.OTHER,
            iSRank: 0,
            iSAbs: Math.round(100000 * e.iS) / 100000,
            iSPerc:
              Math.round(
                (100000 * e.iS) /
                  (getScenarioParameter(riskFile, "TI_S", s) || 0.001)
              ) / 100000,
            iEPareto:
              e.iECumul <=
              0.8 * (getScenarioParameter(riskFile, "TI_E", s) || 0.001)
                ? Pareto.SIGNIFICANT
                : Pareto.OTHER,
            iERank: 0,
            iEAbs: Math.round(100000 * e.iE) / 100000,
            iEPerc:
              Math.round(
                (100000 * e.iE) /
                  (getScenarioParameter(riskFile, "TI_E", s) || 0.001)
              ) / 100000,
            iFPareto:
              e.iFCumul <=
              0.8 * (getScenarioParameter(riskFile, "TI_F", s) || 0.001)
                ? Pareto.SIGNIFICANT
                : Pareto.OTHER,
            iFRank: 0,
            iFAbs: Math.round(100000 * e.iF) / 100000,
            iFPerc:
              Math.round(
                (100000 * e.iF) /
                  (getScenarioParameter(riskFile, "TI_F", s) || 0.001)
              ) / 100000,
          }))
          .sort((a, b) => a.iTotRank - b.iTotRank),
      ];
    },
    [] as ExcelEffect[]
  );
}
