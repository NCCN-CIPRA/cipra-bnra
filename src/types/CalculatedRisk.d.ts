import { DVRiskFile } from "./dataverse/DVRiskFile";
import { RiskCalculation } from "./RiskCalculation";

export interface CalculatedRisk extends DVRiskFile {
  calculated: RiskCalculation[];
}
