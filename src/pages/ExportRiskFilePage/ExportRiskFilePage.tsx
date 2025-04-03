import { useParams } from "react-router-dom";
import "./ExportRiskFilePage.css";
import { Box } from "@mui/material";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import SummaryImpactChart from "../../components/charts/svg/SummaryImpactChart";
import { getScenarioParameter, SCENARIOS } from "../../functions/scenarios";
import { useMemo } from "react";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import {
  getResultSnapshot,
  SmallRisk,
} from "../../types/dataverse/DVSmallRisk";
import { Document, PDFViewer } from "@react-pdf/renderer";
import useRecord from "../../hooks/useRecord";
import { DataTable } from "../../hooks/useAPI";
import { getCategoryImpactRescaled } from "../../functions/CategoryImpact";
import ProbabilitySankeyChart from "../../components/charts/svg/ProbabilitySankeyChart";
import useRecords from "../../hooks/useRecords";
import {
  DVRiskCascade,
  getCascadeResultSnapshot,
} from "../../types/dataverse/DVRiskCascade";
import {
  Cascades,
  getCatalyzingEffects,
  getCauses,
  getClimateChange,
  getEffects,
} from "../../functions/cascades";
import ImpactSankey from "../../components/charts/svg/ImpactSankeyChart";
import ImpactBarChart from "../../components/charts/svg/ImpactBarChart";
import SummarySection from "./SummarySection";
import DescriptionSection from "./DescriptionSection";
import AnalysisSection from "./AnalysisSection";
import EvolutionSection from "./EvolutionSection";
import ScenarioMatrix from "../../components/charts/ScenarioMatrix";
import BibliographySection from "./BibliographySection";
import ClimateChangeChart from "../../components/charts/ClimateChangeChart";
import "./fonts";
import useLoggedInUser, { LoggedInUser } from "../../hooks/useLoggedInUser";
import { ProbabilityBarsChart } from "../../components/charts/svg/ProbabilityBarsChart";

const barWidth = 300;
const barHeight = 500;

export default function ExportRiskFilePage() {
  const params = useParams();
  const { user } = useLoggedInUser();

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

  const { data: riskFile } = useRecord<DVRiskFile>({
    table: DataTable.RISK_FILE,
    id: params.risk_file_id || "",
    transformResult: (rf) => ({
      ...rf,
      results: getResultSnapshot(rf),
    }),
  });

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
      <ExportRiskFileCharts
        riskFile={riskFile}
        cascades={cascades}
        attachments={attachments}
        tp={tp}
        H={H}
        S={S}
        E={E}
        F={F}
        user={user}
        scenario={scenario}
      />
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
            user={user}
          />
        </Document>
      </PDFViewer>
    </Box>
  );
}

export function ExportRiskFileCharts({
  riskFile,
  cascades,
  tp,
  H,
  S,
  E,
  F,
  scenario,
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
  user: LoggedInUser | null | undefined;
  scenario: SCENARIOS;
  // hazardCatalogue: SmallRisk[] | null;
  // cascades: Cascades;
  // attachments: DVAttachment<unknown, DVAttachment<unknown, unknown>>[] | null;
}) {
  return (
    <>
      <div
        id={`pBars-${riskFile.cr4de_riskfilesid}`}
        style={{ position: "absolute", top: -100000 }}
      >
        <ProbabilityBarsChart chartWidth={200} height={100} tp={tp} />
      </div>
      <div
        id={`hChart-${riskFile.cr4de_riskfilesid}`}
        style={{ position: "absolute", top: -100000 }}
      >
        <SummaryImpactChart
          category="H"
          value={H}
          width={500}
          height={275}
          needleWidth={7}
        />
      </div>
      <div
        id={`sChart-${riskFile.cr4de_riskfilesid}`}
        style={{ position: "absolute", top: -100000 }}
      >
        <SummaryImpactChart
          category="S"
          value={S}
          width={500}
          height={275}
          needleWidth={7}
        />
      </div>
      <div
        id={`eChart-${riskFile.cr4de_riskfilesid}`}
        style={{ position: "absolute", top: -100000 }}
      >
        <SummaryImpactChart
          category="E"
          value={E}
          width={500}
          height={275}
          needleWidth={7}
        />
      </div>
      <div
        id={`fChart-${riskFile.cr4de_riskfilesid}`}
        style={{ position: "absolute", top: -100000 }}
      >
        <SummaryImpactChart
          category="F"
          value={F}
          width={500}
          height={275}
          needleWidth={7}
        />
      </div>
      <div
        id={`probChart-${riskFile.cr4de_riskfilesid}`}
        style={{ position: "absolute", top: -100000 }}
      >
        <ProbabilitySankeyChart
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
      <div
        id={`impactChart-${riskFile.cr4de_riskfilesid}`}
        style={{ position: "absolute", top: -100000 }}
      >
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
      <div
        id={`impactBarChart-${riskFile.cr4de_riskfilesid}`}
        style={{ position: "absolute", top: -100000 }}
      >
        <ImpactBarChart
          riskFile={riskFile}
          scenario={scenario}
          width={barWidth}
          height={barHeight}
        />
      </div>
      <div
        id={`scenarioChart-${riskFile.cr4de_riskfilesid}`}
        style={{ position: "absolute", top: -100000 }}
      >
        <ScenarioMatrix
          riskFile={riskFile}
          mrs={scenario}
          fontSize={20}
          width={600}
          height={540}
          radius={600}
        />
      </div>
      <div
        id={`climateChart-${riskFile.cr4de_riskfilesid}`}
        style={{ position: "absolute", top: -100000 }}
      >
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
    </>
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
  user,
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
  user: LoggedInUser | null | undefined;
  // hazardCatalogue: SmallRisk[] | null;
  // cascades: Cascades;
  // attachments: DVAttachment<unknown, DVAttachment<unknown, unknown>>[] | null;
}) {
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
      />
      <DescriptionSection riskFile={riskFile} user={user} />
      <AnalysisSection riskFile={riskFile} user={user} />
      <EvolutionSection riskFile={riskFile} cascades={cascades} user={user} />
      <BibliographySection
        riskFile={riskFile}
        allAttachments={attachments}
        user={user}
      />
    </>
  );
}
