import { Trans, useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import RiskFileTitle from "../../components/RiskFileTitle";
import "./ExportRiskFilePage.css";
import { Box, Stack } from "@mui/material";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import SummaryCharts, { SvgChart } from "../../components/charts/SummaryCharts";
import {
  getScenarioParameter,
  SCENARIO_PARAMS,
  SCENARIOS,
} from "../../functions/scenarios";
import StandardAnalysis from "../RiskAnalysisPage/Standard/Standard";
import ManMadeAnalysis from "../RiskAnalysisPage/ManMade/ManMade";
import EmergingAnalysis from "../RiskAnalysisPage/Emerging/Emerging";
import StandardIdentification from "../RiskIdentificationPage/Standard/Standard";
import ManmadeIdentification from "../RiskIdentificationPage/Manmade/Manmade";
import EmergingIdentification from "../RiskIdentificationPage/Emerging/Emerging";
import Bibliography from "../RiskAnalysisPage/Bibliography";
import { BasePageContext } from "../BasePage";
import { useEffect, useMemo, useState } from "react";
import { Cascades } from "../BaseRisksPage";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import {
  getResultSnapshot,
  SmallRisk,
} from "../../types/dataverse/DVSmallRisk";
import {
  Circle,
  Document,
  Font,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
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
import html2PDF, {
  h3Style,
  h4Style,
  h5Style,
  h6Style,
} from "../../functions/html2pdf";
import { Bar, BarChart, YAxis } from "recharts";
import svg2PDF from "../../functions/svg2PDF";
import { pbkdf2 } from "crypto";
import ProbabilityBars, {
  getProbabilityBars,
  ProbabilityBarsChart,
} from "../../components/charts/ProbabilityBars";
import { getCategoryImpactRescaled } from "../../functions/CategoryImpact";
import { getSummary } from "../../functions/translations";
import getScaleString from "../../functions/getScaleString";
import getImpactColor from "../../functions/getImpactColor";
import { SvgChart as ProbabilitySankey } from "../../components/charts/ProbabilitySankey";
import useRecords from "../../hooks/useRecords";
import {
  DVRiskCascade,
  getCascadeResultSnapshot,
} from "../../types/dataverse/DVRiskCascade";
import {
  getCatalyzingEffects,
  getCauses,
  getClimateChange,
  getEffects,
} from "../../functions/cascades";
import { SvgChart as ImpactSankey } from "../../components/charts/ImpactSankey";
import ImpactBarChart from "../../components/charts/ImpactBarChart";
import { cpSync } from "fs";
import SummarySection from "./SummarySection";
import { BLACK } from "./styles";
import Header from "./Header";
import Footer from "./Footer";
import DescriptionSection from "./DescriptionSection";
import AnalysisSection from "./AnalysisSection";
import EvolutionSection from "./EvolutionSection";
import ScenarioMatrix from "../../components/charts/ScenarioMatrix";
import BibliographySection from "./BibliographySection";
import ClimateChangeChart from "../../components/charts/ClimateChangeChart";

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

const barWidth = 300;
const barHeight = 500;

export default function ExportRiskFilePage({}) {
  const params = useParams();

  const { data: hazardCatalogue } = useRecords<SmallRisk>({
    table: DataTable.RISK_FILE,
    query:
      "$orderby=cr4de_hazard_id&$select=cr4de_hazard_id,cr4de_title,cr4de_risk_type,cr4de_risk_category,cr4de_definition,cr4de_mrs,cr4de_label_hilp,cr4de_label_cc,cr4de_label_cb,cr4de_label_impact,cr4de_result_snapshot",
    transformResult: (data: SmallRisk[]) =>
      data
        .filter((r: SmallRisk) => !r.cr4de_hazard_id.startsWith("X"))
        .map((rf) => ({
          ...rf,
          results: getResultSnapshot(rf),
        })),
  });

  const { data: riskFile, isFetching: loadingRiskFile } = useRecord<DVRiskFile>(
    {
      table: DataTable.RISK_FILE,
      id: params.risk_file_id || "",
      transformResult: (rf) => ({
        ...rf,
        results: getResultSnapshot(rf),
      }),
    }
  );

  const { data: rawCascades } = useRecords<DVRiskCascade<SmallRisk, SmallRisk>>(
    {
      table: DataTable.RISK_CASCADE,
      query: `$filter=_cr4de_cause_hazard_value eq '${params.risk_file_id}' or _cr4de_effect_hazard_value eq '${params.risk_file_id}'&$expand=cr4de_cause_hazard($select=cr4de_title,cr4de_hazard_id),cr4de_effect_hazard($select=cr4de_title,cr4de_hazard_id)`,
      transformResult: (results: DVRiskCascade[]) =>
        results.map((r) => {
          return {
            ...r,
            // cr4de_cause_hazard: hc[r._cr4de_cause_hazard_value],
            // cr4de_effect_hazard: hc[r._cr4de_effect_hazard_value],
            results: getCascadeResultSnapshot(r),
          } as DVRiskCascade<SmallRisk, SmallRisk>;
        }),
    }
  );

  const { data: attachments } = useRecords<DVAttachment<unknown, DVAttachment>>(
    {
      table: DataTable.ATTACHMENT,
      query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$expand=cr4de_referencedSource`,
      transformResult: (results: DVAttachment<unknown, DVAttachment>[]) =>
        results.map((a) =>
          a.cr4de_referencedSource
            ? {
                ...a.cr4de_referencedSource,
                cr4de_bnraattachmentid: a.cr4de_bnraattachmentid,
                cr4de_field: a.cr4de_field,
                cr4de_referencedSource: a.cr4de_referencedSource,
              }
            : a
        ),
    }
  );

  const cascades = useMemo(() => {
    if (!riskFile || !hazardCatalogue || !rawCascades) return null;

    const hc = hazardCatalogue.reduce(
      (acc, sr) => ({ ...acc, [sr.cr4de_riskfilesid]: sr }),
      {}
    );

    const causes = getCauses(riskFile, rawCascades, hc);
    const effects = getEffects(riskFile, rawCascades, hc);
    const catalyzingEffects = getCatalyzingEffects(
      riskFile,
      rawCascades,
      hc,
      false
    );
    const climateChange = getClimateChange(riskFile, rawCascades, hc);

    return {
      all: [...causes, ...effects, ...catalyzingEffects],
      causes,
      effects,
      catalyzingEffects,
      climateChange,
    };
  }, [hazardCatalogue, riskFile, rawCascades]);

  if (!riskFile || !cascades || attachments == null) return null;

  const scenario = riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE;

  const tp = getScenarioParameter(riskFile, "TP", scenario) || 0;

  const H = getCategoryImpactRescaled(riskFile, "H", scenario);
  const S = getCategoryImpactRescaled(riskFile, "S", scenario);
  const E = getCategoryImpactRescaled(riskFile, "E", scenario);
  const F = getCategoryImpactRescaled(riskFile, "F", scenario);

  return (
    <Box sx={{ width: "100vw", height: "100vh" }}>
      <div id="pBars" style={{ position: "absolute", top: -100000 }}>
        <ProbabilityBarsChart chartWidth={200} height={100} tp={tp} />
      </div>
      <div id="hChart" style={{ position: "absolute", top: -100000 }}>
        <SvgChart
          category="H"
          value={H}
          width={500}
          height={275}
          needleWidth={7}
        />
      </div>
      <div id="sChart" style={{ position: "absolute", top: -100000 }}>
        <SvgChart
          category="S"
          value={S}
          width={500}
          height={275}
          needleWidth={7}
        />
      </div>
      <div id="eChart" style={{ position: "absolute", top: -100000 }}>
        <SvgChart
          category="E"
          value={E}
          width={500}
          height={275}
          needleWidth={7}
        />
      </div>
      <div id="fChart" style={{ position: "absolute", top: -100000 }}>
        <SvgChart
          category="F"
          value={F}
          width={500}
          height={275}
          needleWidth={7}
        />
      </div>
      <div id="probChart" style={{ position: "absolute", top: -100000 }}>
        <ProbabilitySankey
          riskFile={riskFile}
          cascades={cascades}
          maxCauses={null}
          shownCausePortion={0.8}
          minCausePortion={null}
          scenario={scenario}
          onClick={() => {}}
          debug={false}
          manmade={riskFile.cr4de_risk_type === RISK_TYPE.MANMADE}
          width={400}
          height={800}
        />
      </div>
      <div id="impactChart" style={{ position: "absolute", top: -100000 }}>
        <ImpactSankey
          riskFile={riskFile}
          cascades={cascades}
          maxEffects={null}
          shownEffectPortion={0.8}
          minEffectPortion={null}
          scenario={scenario}
          onClick={() => {}}
          debug={false}
          width={400}
          height={800}
        />
      </div>
      <div id="impactBarChart" style={{ position: "absolute", top: -100000 }}>
        <ImpactBarChart
          riskFile={riskFile}
          scenario={scenario}
          width={barWidth}
          height={barHeight}
        />
      </div>
      <div id="scenarioChart" style={{ position: "absolute", top: -100000 }}>
        <ScenarioMatrix riskFile={riskFile} mrs={scenario} />
      </div>
      <div id="climateChart" style={{ position: "absolute", top: -100000 }}>
        <ClimateChangeChart
          riskFile={riskFile}
          causes={cascades.causes}
          scenario={scenario}
          width={1000}
          height={600}
          fontSize="20pt"
          xLabelDy={50}
        />
      </div>
      <PDFViewer
        style={{ overflow: "hidden", height: "100%", width: "100%" }}
        height="100%"
        width="100%"
      >
        <Document>
          <ExportRiskFile
            riskFile={riskFile}
            cascades={cascades}
            attachments={attachments}
            tp={tp}
            H={H}
            S={S}
            E={E}
            F={F}
          />
        </Document>
      </PDFViewer>
    </Box>
  );
}

export function ExportRiskFile({
  riskFile,
  cascades,
  attachments,
  tp,
  H,
  S,
  E,
  F,
}: // hazardCatalogue,
// cascades,
// attachments,
{
  riskFile: DVRiskFile;
  cascades: Cascades;
  attachments: DVAttachment[];
  tp: number;
  H: number;
  S: number;
  E: number;
  F: number;
  // hazardCatalogue: SmallRisk[] | null;
  // cascades: Cascades;
  // attachments: DVAttachment<unknown, DVAttachment<unknown, unknown>>[] | null;
}) {
  const { t } = useTranslation();

  return (
    <>
      <SummarySection riskFile={riskFile} tp={tp} H={H} S={S} E={E} F={F} />
      <DescriptionSection riskFile={riskFile} />
      <AnalysisSection riskFile={riskFile} />
      <EvolutionSection riskFile={riskFile} cascades={cascades} />
      <BibliographySection riskFile={riskFile} allAttachments={attachments} />
    </>
  );
}
