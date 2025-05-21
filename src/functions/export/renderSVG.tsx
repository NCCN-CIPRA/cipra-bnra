import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { ProbabilityBarsChart } from "../../components/charts/svg/ProbabilityBarsChart";
import { getScenarioParameter, SCENARIOS } from "../scenarios";
import { getCategoryImpactRescaled } from "../CategoryImpact";
import SummaryImpactChart from "../../components/charts/svg/SummaryImpactChart";
import ScenarioMatrixChart from "../../components/charts/svg/ScenarioMatrixChart";
import { Cascades } from "../cascades";
import ProbabilitySankeyChart from "../../components/charts/svg/ProbabilitySankeyChart";
import ImpactSankeyChart from "../../components/charts/svg/ImpactSankeyChart";
import ImpactBarChart from "../../components/charts/svg/ImpactBarChart";
import ClimateChangeChart from "../../components/charts/svg/ClimateChangeChart";
import ActionsSankeyChart from "../../components/charts/svg/ActionsSankeyChart";
import { ReactElement } from "react";
import NCCNLogo from "../../assets/icons/NCCNLogo";
import BNRALogo from "../../assets/icons/BNRALogo";
import NCCNDetail from "../../assets/icons/NCCNDetail";

export type SummaryCharts = {
  pBarChartURI: string;
  hChartURI: string;
  sChartURI: string;
  eChartURI: string;
  fChartURI: string;
};

export type AnalysisCharts = {
  probability: string;
  impact: string;
  impactBars: string;
};

export type RiskFileCharts = {
  summary: SummaryCharts;
  scenarioChart: string;
  sankey: AnalysisCharts;
  climateChange: string;
};

export type SVGImages = {
  nccnLogo: string;
  bnraLogo: string;
  triangles: string;
  riskFiles: (RiskFileCharts | null)[];
};

const barWidth = 300;
const barHeight = 500;

export default async function renderSVG(
  riskFiles: DVRiskFile[],
  allCascades: { [key: string]: Cascades },
  svg2PDF: (
    jsxChart: ReactElement,
    width: number,
    height: number,
    type?: string
  ) => Promise<string>
) {
  return {
    nccnLogo: await svg2PDF(<NCCNLogo />, 100, 100, "image/png"),
    bnraLogo: await svg2PDF(<BNRALogo />, 100, 100, "image/png"),
    triangles: await svg2PDF(<NCCNDetail />, 100, 100, "image/png"),
    riskFiles: await Promise.all(
      riskFiles.map((rf) => {
        return renderRFCharts(rf, allCascades[rf.cr4de_riskfilesid], svg2PDF);
      })
    ),
  };
}

export async function renderRFCharts(
  riskFile: DVRiskFile,
  cascades: Cascades,
  svg2PDF: (
    jsxChart: ReactElement,
    width: number,
    height: number,
    type?: string
  ) => Promise<string>
) {
  if (riskFile.cr4de_risk_type === RISK_TYPE.EMERGING) {
    return null;
  }

  const scenario = riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE;

  const tp = getScenarioParameter(riskFile, "TP", scenario) || 0;

  const H = getCategoryImpactRescaled(riskFile, "H", scenario);
  const S = getCategoryImpactRescaled(riskFile, "S", scenario);
  const E = getCategoryImpactRescaled(riskFile, "E", scenario);
  const F = getCategoryImpactRescaled(riskFile, "F", scenario);

  return {
    summary: {
      pBarChartURI: await svg2PDF(
        <ProbabilityBarsChart chartWidth={2000} height={1000} tp={tp} />,
        2000,
        1000
      ),
      hChartURI: await svg2PDF(
        <SummaryImpactChart
          category="H"
          value={H}
          width={5000}
          height={2500}
          needleWidth={70}
        />,
        5000,
        2500
      ),
      sChartURI: await svg2PDF(
        <SummaryImpactChart
          category="S"
          value={S}
          width={5000}
          height={2500}
          needleWidth={70}
        />,
        5000,
        2500
      ),
      eChartURI: await svg2PDF(
        <SummaryImpactChart
          category="E"
          value={E}
          width={5000}
          height={2500}
          needleWidth={70}
        />,
        5000,
        2500
      ),
      fChartURI: await svg2PDF(
        <SummaryImpactChart
          category="F"
          value={F}
          width={5000}
          height={2500}
          needleWidth={70}
        />,
        5000,
        2500
      ),
    },
    scenarioChart: await svg2PDF(
      <ScenarioMatrixChart
        riskFile={riskFile}
        mrs={scenario}
        fontSize={20}
        width={600}
        height={540}
        radius={600}
      />,
      5000,
      2500
    ),
    sankey: {
      probability: await svg2PDF(
        riskFile.cr4de_risk_type === RISK_TYPE.STANDARD ? (
          <ProbabilitySankeyChart
            riskFile={riskFile}
            cascades={cascades}
            maxCauses={null}
            shownCausePortion={0.8}
            minCausePortion={null}
            scenario={scenario}
            onClick={() => {}}
            debug={false}
            manmade={false}
            width={400}
            height={800}
          />
        ) : (
          <ActionsSankeyChart
            riskFile={riskFile}
            cascades={cascades}
            maxActions={null}
            shownActionPortion={0.8}
            minActionPortion={null}
            scenario={scenario}
            onClick={() => {}}
            debug={false}
            width={400}
            height={800}
          />
        ),
        5000,
        2500
      ),
      impact: await svg2PDF(
        <ImpactSankeyChart
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
        />,
        5000,
        2500
      ),
      impactBars: await svg2PDF(
        <ImpactBarChart
          riskFile={riskFile}
          scenario={scenario}
          width={barWidth}
          height={barHeight}
        />,
        5000,
        2500
      ),
    },
    climateChange: await svg2PDF(
      <ClimateChangeChart
        riskFile={riskFile}
        causes={cascades.causes}
        scenario={scenario}
        width={1000}
        height={600}
        fontSize="20pt"
        xLabelDy={50}
      />,
      5000,
      2500
    ),
  };
}
