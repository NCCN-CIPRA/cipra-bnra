import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import RiskFileTitle from "../../components/RiskFileTitle";
import "./ExportRiskFilePage.css";
import { Box, Stack } from "@mui/material";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import SummaryCharts, { SvgChart } from "../../components/charts/SummaryCharts";
import { SCENARIOS } from "../../functions/scenarios";
import StandardAnalysis from "../RiskAnalysisPage/Standard/Standard";
import ManMadeAnalysis from "../RiskAnalysisPage/ManMade/ManMade";
import EmergingAnalysis from "../RiskAnalysisPage/Emerging/Emerging";
import StandardIdentification from "../RiskIdentificationPage/Standard/Standard";
import ManmadeIdentification from "../RiskIdentificationPage/Manmade/Manmade";
import EmergingIdentification from "../RiskIdentificationPage/Emerging/Emerging";
import Bibliography from "../RiskAnalysisPage/Bibliography";
import { BasePageContext } from "../BasePage";
import { useEffect, useState } from "react";
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
import Arial from "../../assets/fonts/ArialMT.ttf";
import NH15 from "../../assets/fonts/NHaasGroteskDSPro-15UltTh.ttf";
import NH25 from "../../assets/fonts/NHaasGroteskDSPro-25Th.ttf";
import NH45 from "../../assets/fonts/NHaasGroteskDSPro-45Lt.ttf";
import NH46 from "../../assets/fonts/NHaasGroteskDSPro-46LtIt.ttf";
import NH55 from "../../assets/fonts/NHaasGroteskDSPro-55Rg.ttf";
import NH65 from "../../assets/fonts/NHaasGroteskDSPro-65Md.ttf";
import NH66 from "../../assets/fonts/NHaasGroteskDSPro-66MdIt.ttf";
import NH75 from "../../assets/fonts/NHaasGroteskDSPro-75Bd.ttf";
import html2PDF from "../../functions/html2pdf";
import { Bar, BarChart, YAxis } from "recharts";
import svg2PDF from "../../functions/svg2PDF";
import { pbkdf2 } from "crypto";
import ProbabilityBars, { getProbabilityBars } from "../../components/charts/ProbabilityBars";
import { getCategoryImpactRescaled } from "../../functions/CategoryImpact";

// type HTMLTag = { tagName: string; tagOptions: string | null; content: string | HTMLTag[]; size: number };

// const parseTag = (tagHtml: string): HTMLTag => {
//   const closingTagIndex = tagHtml.indexOf("</");

//   const tagNameEnd = tagHtml.indexOf(" ") >= 0 ? tagHtml.indexOf(" ") : tagHtml.indexOf(">");
//   const tagName = tagHtml.slice(1, tagNameEnd);

//   const contentIndex = tagHtml.indexOf(">") + 1;
//   const content = tagHtml.slice(contentIndex, closingTagIndex);

//   const tagOptions = tagHtml[tagNameEnd] === ">" ? null : tagHtml.slice(tagNameEnd + 1, contentIndex - 1);

//   const size = closingTagIndex + tagHtml.slice(closingTagIndex).indexOf(">") + 1;
//   console.log("Parsed tag: ", tagName);

//   return { tagName, tagOptions, content, size };
// };

// const parseHtml = (html: string): HTMLTag => {
//   let currentHtml = html.replace(/<br>/g, "").replace(/<br\/>/g, "");
//   let nextTagIndex = currentHtml.slice(1).indexOf("<") + 1;

//   if (nextTagIndex < 0) {
//     console.log("empty tag");
//     return { tagName: "", tagOptions: null, content: "", size: 0 };
//   } else if (currentHtml[nextTagIndex + 1] === "/") {
//     // Process tag
//     return parseTag(currentHtml);
//   } else {
//     const innerTags = [];
//     let inner;
//     do {
//       console.log(nextTagIndex, currentHtml);
//       inner = parseHtml(currentHtml.slice(nextTagIndex));
//       console.log(inner);
//       currentHtml = currentHtml.slice(0, nextTagIndex) + currentHtml.slice(nextTagIndex + inner.size);
//       nextTagIndex = currentHtml.slice(1).indexOf("<") + 1;

//       innerTags.push(inner);
//     } while (inner.tagName !== "");
//     console.log(currentHtml);
//     const currentTag = parseTag(currentHtml);
//     console.log(currentTag);

//     const size = innerTags.reduce((t, i) => t + i.size, 0) + currentTag.size;

//     return { ...currentTag, content: innerTags, size };
//   }
// };

const getSummary = (rf: DVRiskFile, lan: string) => {
  if (lan === "nl") return rf.cr4de_mrs_summary_nl;
  if (lan === "fr") return rf.cr4de_mrs_summary_fr;
  if (lan === "de") return rf.cr4de_mrs_summary_de;
  return rf.cr4de_mrs_summary;
};

const BLACK = "#231F20";

// Font.register({
//   family: "Arial",
//   fonts: [
//     {
//       src: Arial,
//       fontWeight: 400,
//     },
//   ],
// });

Font.register({
  family: "NH",
  fonts: [
    {
      src: NH15,
      fontWeight: 100,
    },
    {
      src: NH25,
      fontWeight: 200,
    },
    {
      src: NH45,
      fontWeight: 300,
    },
    {
      src: NH46,
      fontWeight: 300,
      fontStyle: "italic",
    },
    {
      src: NH55,
      fontWeight: 400,
    },
    {
      src: NH65,
      fontWeight: 500,
    },
    {
      src: NH66,
      fontWeight: 500,
      fontStyle: "italic",
    },
    {
      src: NH75,
      fontWeight: 700,
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
      <div id="pBars" style={{ position: "absolute", top: -100000 }}>
        <ProbabilityBars chartWidth={200} tp={2.5} />
      </div>
      <div id="hChart" style={{ position: "absolute", top: -100000 }}>
        <SvgChart
          category="H"
          value={getCategoryImpactRescaled(riskFile, "H", riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE)}
          width={1000}
          height={500}
        />
      </div>
      <div id="sChart" style={{ position: "absolute", top: -100000 }}>
        <SvgChart
          category="S"
          value={getCategoryImpactRescaled(riskFile, "S", riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE)}
          width={1000}
          height={500}
        />
      </div>
      <div id="eChart" style={{ position: "absolute", top: -100000 }}>
        <SvgChart
          category="E"
          value={getCategoryImpactRescaled(riskFile, "E", riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE)}
          width={1000}
          height={500}
        />
      </div>
      <div id="fChart" style={{ position: "absolute", top: -100000 }}>
        <SvgChart
          category="F"
          value={getCategoryImpactRescaled(riskFile, "F", riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE)}
          width={1000}
          height={500}
        />
      </div>
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
  const [pBarChart, setpBarChart] = useState("");
  const [hChart, setHChart] = useState("");
  const [sChart, setSChart] = useState("");
  const [eChart, setEChart] = useState("");
  const [fChart, setFChart] = useState("");

  useEffect(() => {
    setTimeout(() => {
      svg2PDF(document.querySelector("#pBars")?.outerHTML || "").then((uri) => setpBarChart(uri || ""));
      svg2PDF(document.querySelector("#hChart svg")?.outerHTML || "").then((uri) => setHChart(uri || ""));
      svg2PDF(document.querySelector("#sChart svg")?.outerHTML || "").then((uri) => setSChart(uri || ""));
      svg2PDF(document.querySelector("#eChart svg")?.outerHTML || "").then((uri) => setEChart(uri || ""));
      svg2PDF(document.querySelector("#fChart svg")?.outerHTML || "").then((uri) => setFChart(uri || ""));
    }, 1000);
  }, []);

  return (
    <Page
      size="B5"
      style={{
        backgroundColor: "white",
        padding: "2cm",
        color: BLACK,
      }}
    >
      <View style={{ marginBottom: "1cm" }}>
        <Text style={{ fontFamily: "NH", fontWeight: 700, fontSize: "20pt" }}>{riskFile.cr4de_title}</Text>
      </View>
      {/* <View style={{ flexDirection: "row" }}>
        {riskFile.cr4de_risk_type === RISK_TYPE.STANDARD && (
          <Image src={encodeURIComponent(renderToStaticMarkup(<RiskTypeIcon riskFile={riskFile} />))} />
        )}
      </View> */}
      {/* <View style={{ marginTop: "15pt" }}>
        <Text style={{ fontFamily: "NH", fontWeight: 700, color: NCCN_GREEN, fontSize: "16pt" }}>Description</Text>
      </View> */}
      {html2PDF(riskFile.cr4de_mrs_summary)}

      <View
        style={{
          position: "absolute",
          top: "4cm",
          right: "1.2cm",
          // backgroundColor: "black",
          height: "15cm",
          width: "3.8cm",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <View style={{ width: "3.8cm", height: "3.8cm" }}>
          {pBarChart && (
            <Image
              src={pBarChart}
              style={{
                marginTop: "0.8cm",
                width: "100%",
              }}
            />
          )}
        </View>
        <View style={{ width: "3.8cm", height: "3.8cm" }}>
          {hChart && (
            <Image
              src={hChart}
              style={{
                marginTop: "0.8cm",
                width: "3.8cm",
                height: "2cm",
              }}
            />
          )}
        </View>
        <View style={{ width: "3.8cm", height: "3.8cm" }}>
          {sChart && (
            <Image
              src={sChart}
              style={{
                marginTop: "0.8cm",
                width: "3.8cm",
                height: "1.9cm",
              }}
            />
          )}
        </View>
        <View style={{ width: "3.8cm", height: "3.8cm" }}>
          {eChart && (
            <Image
              src={eChart}
              style={{
                marginTop: "0.8cm",
                width: "3.8cm",
                height: "1.9cm",
              }}
            />
          )}
        </View>
        <View style={{ width: "3.8cm", height: "3.8cm" }}>
          {fChart && (
            <Image
              src={fChart}
              style={{
                marginTop: "0.8cm",
                width: "3.8cm",
                height: "1.9cm",
              }}
            />
          )}
        </View>
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
