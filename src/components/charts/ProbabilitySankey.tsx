import { Layer, Rectangle, ResponsiveContainer, Sankey } from "recharts";
import { Box, Typography, Tooltip } from "@mui/material";
import getCategoryColor from "../../functions/getCategoryColor";
import { useNavigate } from "react-router-dom";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { SCENARIOS, getCascadeParameter, getScenarioParameter, getScenarioSuffix } from "../../functions/scenarios";
import round from "../../functions/roundNumberString";
import { Cascades } from "../../pages/BaseRisksPage";
import { useTranslation } from "react-i18next";

const baseY = 50;

const PSankeyNode = ({
  x,
  y,
  width,
  height,
  index,
  payload,
  containerWidth,
  totalProbability,
  totalNodes,
  scenario,
  showComponents,
  onClick,
}: any) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (payload.depth > 0) {
    return (
      <Layer className="total-probability" key={`CustomNode${index}`} height="50px">
        <Rectangle
          x={x}
          y={baseY}
          width={width}
          height={totalNodes <= 2 ? 600 - 2 * baseY : height}
          fill={getCategoryColor(payload.category)}
          fillOpacity="1"
        />
        <text
          textAnchor="middle"
          x={-y - height / 2 - 18}
          y={x - 15}
          fontSize="16"
          stroke="#333"
          transform="rotate(270)"
        >
          {`${t("Total Probability")}:  ${round(totalProbability, 2)} / 5`}
        </text>
      </Layer>
    );
  } else {
    return (
      <Layer className="probability-cause" key={`CustomNode${index}`}>
        <Rectangle
          x={x}
          y={totalNodes <= 2 ? baseY : y}
          width={width}
          height={totalNodes <= 2 ? 600 - 2 * baseY : height}
          fill={getCategoryColor(payload.category)}
          fillOpacity="1"
          style={{ cursor: payload.id && "pointer" }}
          onClick={() => {
            if (!payload.id) return;

            if (onClick) return onClick(payload.id);

            navigate(`/risks/${payload.id}/analysis`);
          }}
        />

        <Tooltip
          title={
            <Box sx={{}}>
              {payload.cascade && (
                <>
                  <Typography variant="subtitle1" color="inherit">
                    {payload.name}
                  </Typography>

                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {t("analysis.cause.explained", {
                      percentage: round((100 * payload.p) / totalProbability, 2),
                    })}
                  </Typography>

                  {/* <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    IP(all&rarr;{scenarioLetter}):{" "}
                    {Math.round(1000000 * payload.cascade[`ip_${scenarioLetter}`]) / 10000}% / day
                  </Typography>

                  <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: "normal" }}>
                    TP(c): {Math.round(1000000 * payload.cascade.cause.tp_c) / 10000}% / day
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: "normal" }}>
                    CP(c&rarr;{scenarioLetter}): {Math.round(10000 * payload.cascade[`c2${scenarioLetter}`]) / 100}%
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    IP(c&rarr;{scenarioLetter}):{" "}
                    {Math.round(1000000 * payload.cascade.cause.tp_c * payload.cascade[`c2${scenarioLetter}`]) / 10000}%
                    / day
                  </Typography>

                  <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: "normal" }}>
                    TP(m): {Math.round(1000000 * payload.cascade.cause.tp_m) / 10000}% / day
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: "normal" }}>
                    CP(m&rarr;{scenarioLetter}): {Math.round(10000 * payload.cascade[`m2${scenarioLetter}`]) / 100}%
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    IP(m&rarr;{scenarioLetter}):{" "}
                    {Math.round(1000000 * payload.cascade.cause.tp_m * payload.cascade[`m2${scenarioLetter}`]) / 10000}%
                    / day
                  </Typography>

                  <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: "normal" }}>
                    TP(e): {Math.round(1000000 * payload.cascade.cause.tp_e) / 10000}% / day
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: "normal" }}>
                    CP(e&rarr;{scenarioLetter}): {Math.round(10000 * payload.cascade[`e2${scenarioLetter}`]) / 100}%
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    IP(e&rarr;{scenarioLetter}):{" "}
                    {Math.round(1000000 * payload.cascade.cause.tp_e * payload.cascade[`e2${scenarioLetter}`]) / 10000}%
                    / day
                  </Typography> */}
                </>
              )}
              {payload.hidden && (
                <>
                  <Typography variant="subtitle1" color="inherit">
                    {t("Other causes")}:
                  </Typography>

                  {payload.hidden.map((h: any) =>
                    h.cascade ? (
                      <Typography key={h.name} variant="body1" sx={{ mt: 1 }}>
                        <b>{h.name}:</b>{" "}
                        {t("analysis.cause.other.explained", {
                          percentage: round((100 * h.p) / totalProbability, 2),
                        })}
                      </Typography>
                    ) : (
                      <Typography key={h.name} variant="body1" sx={{ mt: 1 }}>
                        <b>{t("2A.dp.title", "Direct Probability")}</b>
                        {": "}
                        {t("analysis.cause.other.explained", {
                          percentage: round((100 * h.p) / totalProbability, 2),
                        })}
                      </Typography>
                    )
                  )}
                </>
              )}
              {!payload.cascade && !payload.hidden && (
                <>
                  <Typography variant="subtitle1" color="inherit">
                    {payload.name}
                  </Typography>

                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <b>{t("2A.dp.title", "Direct Probability")}</b>
                    {": "}
                    {t("analysis.dp.explained", {
                      percentage: round((100 * payload.p) / totalProbability, 2),
                    })}
                  </Typography>
                </>
              )}
            </Box>
          }
        >
          <text
            textAnchor="start"
            x={x + 15}
            y={y + height / 2}
            fontSize="14"
            stroke="#333"
            cursor="pointer"
            onClick={() => {
              if (!payload.id) return;

              if (onClick) return onClick(payload.id);

              navigate(`/risks/${payload.id}/analysis`);
            }}
          >
            {payload.name}
          </text>
        </Tooltip>
      </Layer>
    );
  }
};

const PSankeyLink = (props: any) => {
  const {
    index,
    targetRelativeY,
    sourceRelativeY,
    sourceX,
    sourceY,
    sourceControlX,
    targetX,
    targetY,
    targetControlX,
    linkWidth,
    totalNodes,
  } = props;

  const shiftedTargetY = totalNodes <= 2 ? sourceY : targetRelativeY + targetY + (baseY - (targetY - linkWidth / 2));

  return (
    <path
      d={`
        M${sourceX},${sourceY}
        C${sourceControlX},${sourceY} ${targetControlX},${shiftedTargetY} ${targetX},${shiftedTargetY}
      `}
      stroke="rgb(0, 164, 154, 0.6)"
      fill="none"
      strokeWidth={totalNodes <= 2 ? 600 - 2 * baseY : linkWidth}
      strokeOpacity="0.2"
      // {...filterProps(others)}
    />
  );
};

export default function ProbabilitySankey({
  riskFile = null,
  cascades = null,
  maxCauses = null,
  minCausePortion = null,
  shownCausePortion = null,
  scenario,
  debug = false,
  manmade = false,
  onClick = null,
}: {
  riskFile?: DVRiskFile | null;
  cascades?: Cascades | null;
  maxCauses?: number | null;
  minCausePortion?: number | null;
  shownCausePortion?: number | null;
  scenario: SCENARIOS;
  debug?: boolean;
  manmade?: boolean;
  onClick?: ((id: string) => void) | null;
}) {
  const { t } = useTranslation();
  if (!riskFile || !cascades) return null;

  const scenarioSuffix: string = getScenarioSuffix(scenario);

  const causes = [
    {
      name: manmade ? t("learning.motivation.text.title", "Motivation") : t("2A.dp.title", "Direct Probability"),
      p: getScenarioParameter(riskFile, "DP", scenario) || 0,
    },
    ...(manmade
      ? []
      : cascades.causes.map((c) => ({
          id: c.cr4de_cause_hazard.cr4de_riskfilesid,
          name: t(`risk.${c.cr4de_cause_hazard.cr4de_hazard_id}.name`, c.cr4de_cause_hazard.cr4de_title),
          p: getCascadeParameter(c, scenario, "IP") || 0,
          cascade: c,
        }))),
  ];

  let minP = 0;

  if (manmade) {
    minP = -1;
  } else if (maxCauses !== null) {
    minP =
      maxCauses === null || causes.length <= maxCauses
        ? -1
        : causes.sort((a, b) => b.p - a.p)[Math.min(maxCauses - 1, causes.length - 1)].p;
  } else if (minCausePortion !== null) {
    const Ptot = causes.reduce((tot, c) => tot + c.p, 0.000000001);
    minP = minCausePortion * Ptot;
  } else if (shownCausePortion !== null) {
    const Ptot = causes.reduce((tot, c) => tot + c.p, 0.000000001);

    let cumulP = 0;
    for (let c of causes.sort((a, b) => b.p - a.p)) {
      cumulP += c.p / Ptot;

      if (cumulP >= shownCausePortion) {
        minP = c.p;
        break;
      }
    }
  }

  const nodes: any[] = [
    { name: t(`risk.${riskFile.cr4de_hazard_id}.name`, riskFile.cr4de_title) },
    ...causes.filter((c) => c.p >= minP),
  ];
  const otherCauses = causes.filter((c: any, i: number) => c.p < minP);

  if (minP >= 0 && !manmade && otherCauses.length > 0) {
    nodes.push({
      name: t("Other"),
      hidden: otherCauses,
    });
  }

  const links: any[] = causes
    .filter((e) => e.p >= minP)
    .map((e, i: number) => ({
      source: i + 1,
      target: 0,
      value: Math.max(0.000000001, e.p),
    }));
  if (minP > 0 && otherCauses.length > 0)
    links.push({
      source: nodes.length - 1,
      target: 0,
      value: causes.filter((e: any, i: number) => e.p < minP).reduce((tot, e) => tot + e.p, 0.000000001),
      hidden: causes.filter((e: any, i: number) => e.p < minP),
    });

  const data = {
    nodes,
    links,
  };

  return (
    <>
      <Box sx={{ width: "100%", height: 30, mb: 2 }}>
        {/* <Typography variant="h6">Probability Breakdown</Typography> */}
      </Box>
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={data}
          node={
            <PSankeyNode
              onClick={onClick}
              totalProbability={getScenarioParameter(riskFile, "TP", scenario)}
              totalNodes={data.nodes.length}
              showComponents={debug}
              scenarioSuffix={scenario}
            />
          }
          link={<PSankeyLink totalNodes={data.nodes.length} />}
          nodePadding={data.nodes.length > 2 ? 100 / (data.nodes.length - 2) : 0}
          iterations={0}
        ></Sankey>
      </ResponsiveContainer>
    </>
  );
}
