import { Document } from "@react-pdf/renderer";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import {
  CascadeSnapshotCatalogue,
  CascadeSnapshots,
} from "../../functions/cascades";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { RiskFileCharts, SVGImages } from "../../functions/export/renderSVG";
import { SCENARIOS } from "../../functions/scenarios";
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
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { DVRiskSummary } from "../../types/dataverse/DVRiskSummary";
import { RiskCatalogue } from "../../functions/riskfiles";

export type RiskFilePDFProps = {
  riskSummary: DVRiskSummary;
  riskFile: DVRiskSnapshot;
  cascades: CascadeSnapshots<DVRiskSnapshot>;
  attachments: DVAttachment<unknown, unknown, DVRiskSnapshot>[] | null;
  user?: LoggedInUser | null | undefined;
  charts: RiskFileCharts | null;
  // hazardCatalogue: SmallRisk[] | null;
  // cascades: Cascades;
};

export default function RiskFileExport({
  toExport,
  riskSnapshots,
  allCascades,
  allAttachments,
  svgImages,
}: {
  toExport: DVRiskSummary[];
  riskSnapshots: RiskCatalogue;
  allCascades: CascadeSnapshotCatalogue<DVRiskSnapshot>;
  allAttachments: DVAttachment<unknown, unknown, DVRiskSnapshot>[];
  svgImages: SVGImages;
}) {
  const svgRisks = toExport.map((rf, i) => ({
    ...rf,
    charts: svgImages.riskFiles[i],
  }));

  return (
    <Document>
      {svgRisks.map((rf) => (
        <RiskFilePDF
          key={rf._cr4de_risk_file_value}
          riskSummary={rf}
          riskFile={riskSnapshots[rf._cr4de_risk_file_value]}
          cascades={allCascades[rf._cr4de_risk_file_value]}
          attachments={allAttachments.filter(
            (a) =>
              a.cr4de_risk_file?._cr4de_risk_file_value ===
              rf._cr4de_risk_file_value
          )}
          // user={user}
          charts={rf.charts}
        />
      ))}
    </Document>
  );
}

export function RiskFilePDF({
  riskSummary,
  riskFile,
  cascades,
  user = null,
  charts,
  attachments,
}: RiskFilePDFProps) {
  if (riskFile.cr4de_risk_type === RISK_TYPE.STANDARD && charts) {
    const scenario = riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE;

    const tp = riskFile.cr4de_quanti[scenario].tp.yearly.scale;

    const H = riskFile.cr4de_quanti[scenario].ti.h.scaleCat;
    const S = riskFile.cr4de_quanti[scenario].ti.s.scaleCat;
    const E = riskFile.cr4de_quanti[scenario].ti.e.scaleCat;
    const F = riskFile.cr4de_quanti[scenario].ti.f.scaleCat;

    return (
      <>
        <SummarySection
          riskFile={riskSummary}
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
            allAttachments={getSpecificAttachments(attachments)}
            // user={user}
          />
        )}
      </>
    );
  }

  if (riskFile.cr4de_risk_type === RISK_TYPE.MANMADE && charts) {
    const scenario = riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE;

    const tp = riskFile.cr4de_quanti[scenario].tp.yearly.scale;

    const H = riskFile.cr4de_quanti[scenario].ti.h.scaleCat;
    const S = riskFile.cr4de_quanti[scenario].ti.s.scaleCat;
    const E = riskFile.cr4de_quanti[scenario].ti.e.scaleCat;
    const F = riskFile.cr4de_quanti[scenario].ti.f.scaleCat;

    return (
      <>
        <SummarySection
          riskFile={riskSummary}
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
