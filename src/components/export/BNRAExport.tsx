// import { Cascades } from "../../pages/BaseRisksPage";
// import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import {
  DVRiskFile,
  RISK_CATEGORY,
  RISK_TYPE,
} from "../../types/dataverse/DVRiskFile";
// import BibliographySection from "./BibliographySection";
import { Document, Page } from "@react-pdf/renderer";

import "./fonts";
import { DPI, PAGE_SIZE } from "./styles";
import { NCCN_GREEN } from "../../functions/colors";
import { SVGImages } from "../../functions/export/renderSVG";
import CategoryFrontPage from "./CategoryFrontPage";
import { Cascades } from "../../functions/cascades";
import BibliographySection, {
  getSpecificAttachments,
} from "./BibliographySection";
import { RiskFilePDF } from "./RiskFilePDF";
import FrontPage from "./FrontPage";

const categories: (RISK_TYPE.MANMADE | RISK_CATEGORY)[] = [
  RISK_TYPE.MANMADE,
  RISK_CATEGORY.MANMADE,
  RISK_CATEGORY.CYBER,
  RISK_CATEGORY.TRANSVERSAL,
  RISK_CATEGORY.ECOTECH,
  RISK_CATEGORY.HEALTH,
  RISK_CATEGORY.NATURE,
  RISK_CATEGORY.EMERGING,
];

export function BNRAExport({
  riskFiles,
  allCascades,
  allAttachments,
  svgImages,
}: {
  riskFiles: DVRiskFile[];
  allCascades: { [key: string]: Cascades };
  allAttachments: DVAttachment<unknown, unknown, DVRiskFile>[];
  svgImages: SVGImages;
}) {
  const svgRisks = riskFiles.map((rf, i) => ({
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
      {categories.map((c) => (
        <>
          <CategoryFrontPage category={c} />
          {svgRisks
            .filter(
              (rf) =>
                rf.cr4de_risk_type === c ||
                (rf.cr4de_risk_type !== RISK_TYPE.MANMADE &&
                  rf.cr4de_risk_category === c)
            )
            .sort((a, b) => a.cr4de_hazard_id.localeCompare(b.cr4de_hazard_id))
            .map((riskFile) => {
              return (
                <RiskFilePDF
                  key={riskFile.cr4de_riskfilesid}
                  riskFile={riskFile}
                  cascades={allCascades[riskFile.cr4de_riskfilesid]}
                  attachments={null}
                  // user={user}
                  charts={riskFile.charts}
                />
              );
            })}
        </>
      ))}
      <BibliographySection
        riskFile={null}
        allAttachments={getSpecificAttachments(allAttachments)}
      />
      <Page
        size={PAGE_SIZE}
        style={{
          backgroundColor: NCCN_GREEN,
        }}
        dpi={DPI}
      ></Page>
    </Document>
  );
}
