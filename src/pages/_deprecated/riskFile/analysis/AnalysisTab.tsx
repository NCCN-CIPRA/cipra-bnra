import { Container } from "@mui/material";
import { DVRiskFile, RISK_TYPE } from "../../../types/dataverse/DVRiskFile";
import { DVAnalysisRun } from "../../../types/dataverse/DVAnalysisRun";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
// import Standard from "../../reporting/Standard";
// import Emerging from "../../reporting/Emerging";
// import ManMade from "../../reporting/ManMade";

type RouteParams = {
  risk_id: string;
};

export default function AnalysisTab({
  riskFile,
  riskFiles,
  cascades,
}: {
  riskFile: DVRiskFile<DVAnalysisRun<unknown, string>>;
  riskFiles: DVRiskFile<DVAnalysisRun<unknown, string>>[];
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[] | null;
}) {
  if (!riskFiles || !cascades) return null;

  // if (riskFile.cr4de_risk_type === RISK_TYPE.STANDARD)
  //   return (
  //     <Container sx={{ mt: 4, pb: 8 }}>
  //       <Standard riskFile={riskFile} otherRiskFiles={riskFiles} cascades={cascades} mode="edit" />
  //     </Container>
  //   );

  // if (riskFile.cr4de_risk_type === RISK_TYPE.MANMADE)
  //   return (
  //     <Container sx={{ mt: 4, pb: 8 }}>
  //       <ManMade riskFile={riskFile} otherRiskFiles={riskFiles} cascades={cascades} mode="edit" />
  //     </Container>
  //   );

  // return (
  //   <Container sx={{ mt: 4, pb: 8 }}>
  //     <Emerging riskFile={riskFile} cascades={cascades} mode="edit" />
  //   </Container>
  // );

  return null;
}
