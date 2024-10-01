import { Layer, Rectangle, ResponsiveContainer, Sankey, TooltipProps } from "recharts";
import { Box, Typography, Card, CardContent, Tooltip } from "@mui/material";
import getCategoryColor from "../../functions/getCategoryColor";
import { useNavigate } from "react-router-dom";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { CascadeCalculation } from "../../types/dataverse/DVAnalysisRun";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { SCENARIOS, getScenarioLetter, getScenarioParameter, getScenarioSuffix } from "../../functions/scenarios";
import round from "../../functions/roundNumberString";
import { Cascades } from "../../pages/BaseRisksPage";
import { useTranslation } from "react-i18next";
import { getIndirectImpact } from "../../functions/Impact";

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
  scenarioSuffix,
  showComponents,
  onClick,
}: any) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const scenarioLetter = scenarioSuffix[1];

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
          {`${t("Preferred Malicious Actions")}:  ${round(totalProbability, 2)} / 5`}
        </text>
        {/* <text
          textAnchor="middle"
          x={-y - height / 2 - 18}
          y={x - 15}
          fontSize="16"
          stroke="#333"
          transform="rotate(270)"
        >
          Total Probability:{" "}
          {`${round(100 * getYearlyProbability(totalProbability))}% / year (${round(
            100 * totalProbability,
            3
          )}% / day)`}
        </text> */}
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
                    {t("analysis.action.explained", {
                      percentage: round((100 * payload.cp) / totalProbability, 2),
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

                  {payload.hidden.map((h: any) => (
                    <Typography key={h.name} variant="body1" sx={{ mt: 1 }}>
                      <b>{h.name}:</b>{" "}
                      {t("analysis.action.other.explained", {
                        percentage: round((100 * h.cp) / totalProbability, 2),
                      })}
                    </Typography>
                  ))}
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

// else {
//     return (
//       <Layer key={`CustomNode${index}`}>
//         <Rectangle
//           x={x}
//           y={totalNodes <= 2 ? baseY : y}
//           width={width}
//           height={totalNodes <= 2 ? 600 - 2 * baseY : height}
//           fill={getCategoryColor(payload.category)}
//           fillOpacity="1"
//           style={{ cursor: payload.id && "pointer" }}
//           onClick={() => {
//             if (!payload.id) return;

//             if (onClick) return onClick(payload.id);

//             navigate(`/reporting/${payload.id}`);
//           }}
//         />

//         <Tooltip
//           title={
//             <Box sx={{}}>
//               {payload.cascade && (
//                 <>
//                   <Typography color="inherit">{payload.name}</Typography>

//                   {showComponents && (
//                     <Typography variant="subtitle1" sx={{ mt: 1 }}>
//                       CP: {round(100 * payload.cpAvg, 2)}% / event
//                     </Typography>
//                   )}
//                   <Typography variant="subtitle1" sx={{ mt: 0 }}>
//                     Relative Preference: {round((100 * payload.cpAvg) / totalProbability, 2)}%
//                   </Typography>
//                 </>
//               )}
//               {payload.hidden && (
//                 <>
//                   <Typography color="inherit">Other actions:</Typography>

//                   {payload.hidden.map((h: any) => (
//                     <>
//                       <Typography key={h.name} variant="subtitle2" sx={{ mt: 1 }}>
//                         {h.name}
//                       </Typography>
//                       {showComponents && (
//                         <Typography key={h.name} variant="subtitle1" sx={{ mt: 0, ml: 1 }}>
//                           CP: {round(100 * h.cpAvg, 2)}% / event
//                         </Typography>
//                       )}
//                       <Typography variant="subtitle1" sx={{ mt: 0, ml: 1 }}>
//                         Relative Preference: {round((100 * h.cpAvg) / totalProbability, 2)}%
//                       </Typography>
//                     </>
//                   ))}
//                 </>
//               )}
//             </Box>
//           }
//         >
//           <text
//             textAnchor="start"
//             x={x + 15}
//             y={y + height / 2}
//             fontSize="14"
//             stroke="#333"
//             cursor="pointer"
//             onClick={() => {
//               if (!payload.id) return;

//               if (onClick) return onClick(payload.id);

//               navigate(`/reporting/${payload.id}`);
//             }}
//           >
//             {payload.name}
//           </text>
//         </Tooltip>
//         {/* <text textAnchor="start" x={x + 15} y={y + height / 2 + 18} fontSize="12" stroke="#333" strokeOpacity="0.5">
//           {`${Math.round((100 * payload.value) / totalProbability)}%`}
//         </text> */}
//       </Layer>
//     );
//   }
// };

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

export default function ActionsSankey({
  riskFile = null,
  cascades = null,
  maxActions = null,
  minActionPortion = null,
  shownActionPortion = null,
  scenario,
  debug = false,
  manmade = false,
  onClick = null,
}: {
  riskFile?: DVRiskFile | null;
  cascades?: Cascades | null;
  maxActions?: number | null;
  minActionPortion?: number | null;
  shownActionPortion?: number | null;
  scenario: SCENARIOS;
  debug?: boolean;
  manmade?: boolean;
  onClick?: ((id: string) => void) | null;
}) {
  const { t } = useTranslation();
  if (!riskFile || !cascades) return null;

  const scenarioLetter = getScenarioLetter(scenario);
  const scenarioSuffix: string = getScenarioSuffix(scenario);

  const actions = cascades.effects
    .map((e) => ({
      id: e.cr4de_effect_hazard.cr4de_riskfilesid,
      name: e.cr4de_effect_hazard.cr4de_title,
      cascade: e,
      cp: getIndirectImpact(e, riskFile, scenario).cp,
    }))
    .sort((a, b) => b.cp - a.cp);

  let minP = 0;
  const totP = actions.reduce((p, e) => p + e.cp, 0.00000001);

  if (maxActions !== null) {
    minP = actions[Math.min(maxActions - 1, actions.length - 1)].cp;
  } else if (minActionPortion !== null) {
    minP = minActionPortion * totP;
  } else if (shownActionPortion !== null) {
    let cumulP = 0;
    for (let c of actions) {
      cumulP += c.cp / totP;

      if (cumulP >= shownActionPortion) {
        minP = c.cp;
        break;
      }
    }
  }

  const nodes: any[] = [{ name: riskFile.cr4de_title }, ...actions.filter((c) => c.cp >= minP)];
  const otherActions = actions.filter((e) => e.cp < minP);

  if (minP >= 0 && otherActions.length > 0) {
    nodes.push({
      name: t("Other Actions"),
      hidden: otherActions,
    });
  }

  const links: any[] = actions
    .filter((e) => e.cp >= minP)
    .map((e, i: number) => ({
      source: i + 1,
      target: 0,
      value: Math.max(0.000000001, e.cp),
    }));
  if (minP > 0 && otherActions.length > 0)
    links.push({
      source: nodes.length - 1,
      target: 0,
      value: actions.filter((e) => e.cp < minP).reduce((tot, e) => tot + e.cp, 0.000000001),
      hidden: actions.filter((e) => e.cp < minP),
    });

  const data = {
    nodes,
    links,
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload) {
      if (payload[0].payload?.payload?.hidden) {
        return (
          <Card sx={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
            <CardContent>
              {payload[0].payload?.payload?.hidden
                .sort(
                  (a: CascadeCalculation, b: CascadeCalculation) =>
                    (b[`ip${scenarioSuffix}` as keyof CascadeCalculation] as number) -
                    (a[`ip${scenarioSuffix}` as keyof CascadeCalculation] as number)
                )
                .slice(0, 10)
                .map((c: CascadeCalculation) => (
                  <Box sx={{ margin: 0, padding: 0 }}>
                    {`${c.cause.riskTitle}:`}{" "}
                    <b>{`${
                      Math.round(
                        (10000 * (c[`ip${scenarioSuffix}` as keyof CascadeCalculation] as number)) /
                          (getScenarioParameter(riskFile, "TP", scenario) || 0)
                      ) / 100
                    }%`}</b>
                  </Box>
                ))}
            </CardContent>
          </Card>
        );
      }
    }

    return null;
  };

  return (
    <>
      <Box sx={{ width: "100%", height: 30, mb: 2 }}>
        {/* <Typography variant="h6">Preferred Malicious Actions</Typography> */}
      </Box>
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={data}
          node={
            <PSankeyNode
              onClick={onClick}
              totalProbability={totP}
              totalNodes={data.nodes.length}
              showComponents={debug}
              scenarioSuffix={scenarioSuffix}
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
