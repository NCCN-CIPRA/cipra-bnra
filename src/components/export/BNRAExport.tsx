import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { RISK_CATEGORY, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
// import BibliographySection from "./BibliographySection";
import { Document, Page, Text } from "@react-pdf/renderer";

import { DPI, PAGE_SIZE } from "./styles";
import { NCCN_GREEN } from "../../functions/colors";
import { SVGImages } from "../../functions/export/renderSVG";
import CategoryFrontPage from "./CategoryFrontPage";
import { CascadeSnapshotCatalogue } from "../../functions/cascades";
import BibliographySection, {
  getSpecificAttachments,
} from "./BibliographySection";
import { RiskFilePDF } from "./RiskFilePDF";
import FrontPage from "./FrontPage";
import { DVRiskSummary } from "../../types/dataverse/DVRiskSummary";
import { RiskCatalogue } from "../../functions/riskfiles";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";

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
  riskSnapshots,
  allCascades,
  allAttachments,
  svgImages,
}: {
  riskFiles: DVRiskSummary[];
  riskSnapshots: RiskCatalogue;
  allCascades: CascadeSnapshotCatalogue<DVRiskSnapshot>;
  allAttachments: DVAttachment<unknown, unknown, DVRiskSnapshot>[];
  svgImages: SVGImages;
}) {
  try {
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
                    rf.cr4de_category === c)
              )
              .sort((a, b) =>
                a.cr4de_hazard_id.localeCompare(b.cr4de_hazard_id)
              )
              .map((riskFile) => {
                return (
                  <RiskFilePDF
                    key={riskFile._cr4de_risk_file_value}
                    riskSummary={riskFile}
                    riskFile={riskSnapshots[riskFile._cr4de_risk_file_value]}
                    cascades={allCascades[riskFile._cr4de_risk_file_value]}
                    attachments={null}
                    // user={user}
                    charts={riskFile.charts}
                  />
                );
              })}
          </>
        ))}
        <BibliographySection
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
  } catch (e) {
    console.log(e);
    return (
      <Document>
        <Page>
          <Text>Error</Text>
        </Page>
      </Document>
    );
  }
}
