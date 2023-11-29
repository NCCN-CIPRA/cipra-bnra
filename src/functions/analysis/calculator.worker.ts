/* eslint-disable no-restricted-globals */
import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";
import { DVContact } from "../../types/dataverse/DVContact";
import { DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { DVParticipation } from "../../types/dataverse/DVParticipation";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import runAnalysis from "./runAnalysis";

export interface CalculatorParams {
  riskFiles: DVRiskFile[];
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[];
  participations: DVParticipation[];
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[];
  cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[];
}

export type MessageParams =
  | {
      type: "progress";
      value: number;
    }
  | {
      type: "result";
      value: RiskCalculation[];
    };

self.onmessage = (e: MessageEvent<CalculatorParams>) => {
  const calcs = runAnalysis(e.data, (progress: number) =>
    self.postMessage({ type: "progress", value: progress } as MessageParams)
  );

  self.postMessage({
    type: "result",
    value: calcs,
  });
};

export {};

// export default () => {
//   // eslint-disable-next-line no-restricted-globals
//   self.addEventListener("message", (e?: { data: CalculatorParams }) => {
//     console.log("Running");
//     if (!e) return;
//     const calcs = runAnalysis(e.data);
//     console.log(calcs);
//     // let { users, type } = e.data;

//     // if (type === "asc") {
//     //   users = users.sort((a, b) => a.commentCount - b.commentCount);
//     // } else {
//     //   users = users.sort((a, b) => b.commentCount - a.commentCount);
//     // }

//     postMessage(null);
//   });
// };
