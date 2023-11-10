import { DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";
import { DVContact } from "../../types/dataverse/DVContact";
import { DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { DVParticipation } from "../../types/dataverse/DVParticipation";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import convergeImpacts from "./convergeImpacts";
import convergeProbabilities from "./convergeProbabilities";
import prepareRiskFiles from "./prepareRiskFiles";

export default async function runAnalysis({
  riskFiles,
  cascades,
  participations,
  directAnalyses,
  cascadeAnalyses,
  runs,
}: {
  riskFiles: DVRiskFile[];
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[];
  //   contacts: DVContact[];
  participations: DVParticipation[];
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[];
  cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[];
  runs: number;
}) {
  const riskFilesDict = riskFiles.reduce(
    (d, c) => ({
      ...d,
      [c.cr4de_riskfilesid]: c,
    }),
    {} as { [key: string]: DVRiskFile }
  );
  const cascadesDict = cascades.reduce(
    (d, c) => ({
      ...d,
      [c.cr4de_bnrariskcascadeid]: c,
    }),
    {}
  );

  const calculations = await prepareRiskFiles(
    riskFiles,
    riskFilesDict,
    cascades,
    participations,
    directAnalyses,
    cascadeAnalyses
  );

  convergeProbabilities(calculations, console.log, runs);

  //   convergeImpacts(calculations, console.log, 30);

  return calculations;
}
