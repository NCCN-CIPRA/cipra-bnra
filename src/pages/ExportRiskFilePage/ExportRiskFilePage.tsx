import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import RiskFileTitle from "../../components/RiskFileTitle";
import "./ExportRiskFilePage.css";
import { Box, Stack } from "@mui/material";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import SummaryCharts from "../../components/charts/SummaryCharts";
import { SCENARIOS } from "../../functions/scenarios";
import StandardAnalysis from "../RiskAnalysisPage/Standard/Standard";
import ManMadeAnalysis from "../RiskAnalysisPage/ManMade/ManMade";
import EmergingAnalysis from "../RiskAnalysisPage/Emerging/Emerging";
import StandardIdentification from "../RiskIdentificationPage/Standard/Standard";
import ManmadeIdentification from "../RiskIdentificationPage/Manmade/Manmade";
import EmergingIdentification from "../RiskIdentificationPage/Emerging/Emerging";
import Bibliography from "../RiskAnalysisPage/Bibliography";
import { BasePageContext } from "../BasePage";
import { useEffect } from "react";
import { Cascades } from "../BaseRisksPage";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { getResultSnapshot, SmallRisk } from "../../types/dataverse/DVSmallRisk";
import { Document, Font, Image, Page, PDFViewer, StyleSheet, Text, View } from "@react-pdf/renderer";
import { Canvg } from "canvg";
import { CategoryIcon, RiskTypeIcon } from "../../functions/getCategoryColor";
import { renderToStaticMarkup } from "react-dom/server";
import { NCCN_GREEN } from "../../functions/colors";
import useRecord from "../../hooks/useRecord";
import { DataTable } from "../../hooks/useAPI";

const getSummary = (rf: DVRiskFile, lan: string) => {
  if (lan === "nl") return rf.cr4de_mrs_summary_nl;
  if (lan === "fr") return rf.cr4de_mrs_summary_fr;
  if (lan === "de") return rf.cr4de_mrs_summary_de;
  return rf.cr4de_mrs_summary;
};

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf",
      fontWeight: 100,
    },
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfMZhrib2Bg-4.ttf",
      fontWeight: 200,
    },
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfMZhrib2Bg-4.ttf",
      fontWeight: 300,
    },
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf",
      fontWeight: 400,
    },
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf",
      fontWeight: 500,
    },
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf",
      fontWeight: 600,
    },
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf",
      fontWeight: 700,
    },
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyYMZhrib2Bg-4.ttf",
      fontWeight: 800,
    },
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWYMZhrib2Bg-4.ttf",
      fontWeight: 900,
    },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

export default function ExportRiskFilePage({}) {
  const params = useParams();

  const { data: riskFile, isFetching: loadingRiskFile } = useRecord<DVRiskFile>({
    table: DataTable.RISK_FILE,
    id: params.risk_file_id || "",
    transformResult: (rf) => ({
      ...rf,
      results: getResultSnapshot(rf),
    }),
  });

  if (!riskFile) return null;

  return (
    <Box sx={{ width: "100vw", height: "100vh" }}>
      <PDFViewer style={{ overflow: "hidden", height: "100%", width: "100%" }} height="100%" width="100%">
        <Document>
          <ExportRiskFile riskFile={riskFile} />
        </Document>
      </PDFViewer>
    </Box>
  );
}

export function ExportRiskFile({
  riskFile,
}: // hazardCatalogue,
// cascades,
// attachments,
{
  riskFile: DVRiskFile;
  // hazardCatalogue: SmallRisk[] | null;
  // cascades: Cascades;
  // attachments: DVAttachment<unknown, DVAttachment<unknown, unknown>>[] | null;
}) {
  return (
    <Page
      size="A5"
      style={{
        backgroundColor: "white",
        padding: "1.2cm",
      }}
    >
      <View style={{}}>
        <Text style={{ fontFamily: "Inter", color: "black", fontWeight: "bold" }}>{riskFile.cr4de_title}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        {riskFile.cr4de_risk_type === RISK_TYPE.STANDARD && (
          <Image src={encodeURIComponent(renderToStaticMarkup(<RiskTypeIcon riskFile={riskFile} />))} />
        )}
      </View>
      {/* <CategoryIcon category={riskFile.cr4de_risk_category} />
            {riskFile.cr4de_risk_type === RISK_TYPE.MANMADE && <RiskTypeIcon riskFile={riskFile} />}
            {/* {labels.map((l) => (
            <Box sx={{ width: 30, height: 30 }}>
              <CategoryIcon category={riskFile.cr4de_risk_category} />
            </Box>
          </Tooltip>
        ))} 
          </Stack>

          <Stack direction="row" sx={{ mt: 8 }} columnGap={4}>
            <Box id="summary-text" sx={{ flex: 1 }}>
              <Box
                className="htmleditor"
                sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
                dangerouslySetInnerHTML={{ __html: getSummary(riskFile, i18n.language) || "" }}
              />
            </Box>
            {riskFile.cr4de_risk_type !== RISK_TYPE.EMERGING && (
              <Box>
                <Box id="summary-charts" sx={{ bgcolor: "white" }}>
                  <SummaryCharts
                    riskFile={riskFile}
                    scenario={riskFile.cr4de_mrs || SCENARIOS.MAJOR}
                    manmade={riskFile.cr4de_risk_type === RISK_TYPE.MANMADE}
                  />
                </Box>
              </Box>
            )}
          </Stack>
          <View style={styles.section}>
            <Text>Section #1</Text>
          </View>
          <View style={styles.section}>
            <Text>Section #2</Text>
          </View> */}
    </Page>
  );
  //   return (
  //     <Box id="bnra-export">
  //       <ExportRiskFile
  //         hazardCatalogue={hazardCatalogue}
  //         riskFile={riskFile}
  //         cascades={cascades[riskFile.cr4de_riskfilesid]}
  //         attachments={attachments}
  //       />
  //     </Box>
  //   );
}

export function ExportRiskFile2({
  hazardCatalogue,
  riskFile,
  cascades,
  attachments,
}: {
  hazardCatalogue: SmallRisk[] | null;
  riskFile: DVRiskFile;
  cascades: Cascades;
  attachments: DVAttachment<unknown, DVAttachment<unknown, unknown>>[] | null;
}) {
  const { i18n } = useTranslation();

  return (
    <Box sx={{ width: "21cm", margin: "auto", backgroundColor: "white" }}>
      <RiskFileTitle riskFile={riskFile} />

      <Stack direction="row" sx={{ mt: 8 }} columnGap={4}>
        <Box id="summary-text" sx={{ flex: 1 }}>
          <Box
            className="htmleditor"
            sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
            dangerouslySetInnerHTML={{ __html: getSummary(riskFile, i18n.language) || "" }}
          />
        </Box>
        {riskFile.cr4de_risk_type !== RISK_TYPE.EMERGING && (
          <Box>
            <Box id="summary-charts" sx={{ bgcolor: "white" }}>
              <SummaryCharts
                riskFile={riskFile}
                scenario={riskFile.cr4de_mrs || SCENARIOS.MAJOR}
                manmade={riskFile.cr4de_risk_type === RISK_TYPE.MANMADE}
              />
            </Box>
          </Box>
        )}
      </Stack>

      <Box className="break" />

      {/* <Box id="identification">
        {riskFile.cr4de_risk_type === RISK_TYPE.STANDARD && (
          <StandardIdentification
            riskFile={riskFile}
            cascades={cascades}
            mode={"view"}
            isEditing={false}
            setIsEditing={() => {}}
            reloadRiskFile={async () => {}}
            attachments={attachments || []}
            loadAttachments={async () => {}}
            hazardCatalogue={hazardCatalogue}
          />
        )}
        {riskFile.cr4de_risk_type === RISK_TYPE.MANMADE && (
          <ManmadeIdentification
            riskFile={riskFile}
            cascades={cascades}
            mode={"view"}
            isEditing={false}
            setIsEditing={() => {}}
            reloadRiskFile={async () => {}}
            attachments={attachments || []}
            loadAttachments={async () => {}}
            hazardCatalogue={hazardCatalogue}
          />
        )}
        {riskFile.cr4de_risk_type === RISK_TYPE.EMERGING && (
          <EmergingIdentification
            riskFile={riskFile}
            cascades={cascades}
            mode={"view"}
            isEditing={false}
            setIsEditing={() => {}}
            reloadRiskFile={async () => {}}
            attachments={attachments || []}
            loadAttachments={async () => {}}
            hazardCatalogue={hazardCatalogue}
          />
        )}
      </Box>

      <Box className="break" />

      <Box id="analysis">
        {riskFile.cr4de_risk_type === RISK_TYPE.STANDARD && (
          <StandardAnalysis
            riskFile={riskFile}
            cascades={cascades}
            mode={"view"}
            isEditing={false}
            setIsEditing={() => {}}
            reloadRiskFile={async () => {}}
            attachments={attachments || []}
            loadAttachments={async () => {}}
            hazardCatalogue={hazardCatalogue}
          />
        )}

        {riskFile.cr4de_risk_type === RISK_TYPE.MANMADE && (
          <ManMadeAnalysis
            riskFile={riskFile}
            cascades={cascades}
            mode={"view"}
            isEditing={false}
            setIsEditing={() => {}}
            reloadRiskFile={async () => {}}
            attachments={attachments || []}
            loadAttachments={async () => {}}
            hazardCatalogue={hazardCatalogue}
          />
        )}

        {riskFile.cr4de_risk_type === RISK_TYPE.EMERGING && (
          <EmergingAnalysis
            riskFile={riskFile}
            cascades={cascades.all}
            mode={"view"}
            isEditing={false}
            setIsEditing={() => {}}
            reloadRiskFile={async () => {}}
            attachments={attachments || []}
            loadAttachments={async () => {}}
            hazardCatalogue={hazardCatalogue}
            reloadCascades={async () => {}}
          />
        )}
      </Box>

      <Box className="break" />

      <Box id="sources" sx={{ mb: 8 }}>
        <Bibliography
          riskFile={riskFile}
          cascades={cascades.all}
          attachments={attachments}
          reloadAttachments={async () => {}}
          isExternal={true}
        />
      </Box> */}
    </Box>
  );
}
