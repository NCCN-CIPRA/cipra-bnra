import { DVRiskFile } from "../types/dataverse/DVRiskFile";

export type RiskCatalogue = { [key: string]: DVRiskFile };

export function getRiskCatalogue(riskFiles: DVRiskFile[]): RiskCatalogue {
  return riskFiles.reduce(
    (hc, rf) => ({
      ...hc,
      [rf.cr4de_riskfilesid]: rf,
    }),
    {} as RiskCatalogue
  );
}
