import { Document } from "@react-pdf/renderer";
import FrontPage from "./FrontPage";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { Cascades } from "../../functions/cascades";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { RiskFileCharts, SVGImages } from "../../functions/export/renderSVG";

import "./fonts";
import { getScenarioParameter, SCENARIOS } from "../../functions/scenarios";
import { getCategoryImpactRescaled } from "../../functions/CategoryImpact";
import SummarySection from "./SummarySection";
import DescriptionSection from "./DescriptionSection";
import AnalysisSection from "./AnalysisSection";
import EvolutionSection from "./EvolutionSection";
import BibliographySection, {
  getSpecificAttachments,
} from "./BibliographySection";
import { LoggedInUser } from "../../hooks/useLoggedInUser";
import MMAnalysisSection from "./MMAnalysisSection";
import EmergingDescriptionSection from "./EmergingDescriptionSection";

export type RiskFilePDFProps = {
  riskFile: DVRiskFile;
  cascades: Cascades;
  attachments: DVAttachment<unknown, unknown, DVRiskFile>[] | null;
  user?: LoggedInUser | null | undefined;
  charts: RiskFileCharts | null;
  // hazardCatalogue: SmallRisk[] | null;
  // cascades: Cascades;
};

export default function RiskFileExport({
  toExport,
  allCascades,
  allAttachments,
  svgImages,
}: {
  toExport: DVRiskFile[];
  allCascades: { [key: string]: Cascades };
  allAttachments: DVAttachment<unknown, unknown, DVRiskFile>[];
  svgImages: SVGImages;
}) {
  const svgRisks = toExport.map((rf, i) => ({
    ...rf,
    charts: svgImages.riskFiles[i],
  }));

  return (
    <Document>
      <FrontPage
        nccnLogo={svgImages.nccnLogo}
        bnraLogo={svgImages.bnraLogo}
        triangles={svgImages.triangles}
      />
      {svgRisks.map((rf) => (
        <RiskFilePDF
          key={rf.cr4de_riskfilesid}
          riskFile={rf}
          cascades={allCascades[rf.cr4de_riskfilesid]}
          attachments={allAttachments.filter(
            (a) => a.cr4de_risk_file?.cr4de_riskfilesid === rf.cr4de_riskfilesid
          )}
          // user={user}
          charts={rf.charts}
        />
      ))}
    </Document>
  );
}

export function RiskFilePDF({
  riskFile,
  cascades,
  user = null,
  charts,
  attachments,
}: RiskFilePDFProps) {
  if (riskFile.cr4de_risk_type === RISK_TYPE.STANDARD && charts) {
    const scenario = riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE;

    const tp = getScenarioParameter(riskFile, "TP", scenario) || 0;

    const H = getCategoryImpactRescaled(riskFile, "H", scenario);
    const S = getCategoryImpactRescaled(riskFile, "S", scenario);
    const E = getCategoryImpactRescaled(riskFile, "E", scenario);
    const F = getCategoryImpactRescaled(riskFile, "F", scenario);

    return (
      <>
        <SummarySection
          riskFile={riskFile}
          tp={tp}
          H={H}
          S={S}
          E={E}
          F={F}
          user={user}
          charts={charts.summary}
        />
        <DescriptionSection
          riskFile={riskFile}
          // user={user}
          scenarioChart={charts.scenarioChart}
        />
        <AnalysisSection riskFile={riskFile} charts={charts} />
        <EvolutionSection
          riskFile={riskFile}
          cascades={cascades}
          climateChangeChart={charts.climateChange}
        />
        {attachments !== null && (
          <BibliographySection
            riskFile={riskFile}
            allAttachments={getSpecificAttachments(attachments)}
            // user={user}
          />
        )}
      </>
    );
  }

  if (riskFile.cr4de_risk_type === RISK_TYPE.MANMADE && charts) {
    const scenario = riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE;

    const tp = getScenarioParameter(riskFile, "TP", scenario) || 0;

    const H = getCategoryImpactRescaled(riskFile, "H", scenario);
    const S = getCategoryImpactRescaled(riskFile, "S", scenario);
    const E = getCategoryImpactRescaled(riskFile, "E", scenario);
    const F = getCategoryImpactRescaled(riskFile, "F", scenario);

    return (
      <>
        <SummarySection
          riskFile={riskFile}
          tp={tp}
          H={H}
          S={S}
          E={E}
          F={F}
          user={user}
          charts={charts.summary}
        />
        <DescriptionSection
          riskFile={riskFile}
          // user={user}
          scenarioChart={charts.scenarioChart}
        />
        <MMAnalysisSection riskFile={riskFile} charts={charts} />
      </>
    );
  }

  if (riskFile.cr4de_risk_type === RISK_TYPE.EMERGING) {
    return (
      <>
        <EmergingDescriptionSection
          riskFile={riskFile}
          // user={user}
        />
        {/* <AnalysisSection riskFile={riskFile} charts={charts} /> */}
      </>
    );
  }
  return null;
}
