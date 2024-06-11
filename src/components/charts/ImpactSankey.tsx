import { Layer, Rectangle, ResponsiveContainer, Sankey, TooltipProps } from "recharts";
import { Box, Card, CardContent, Typography, Tooltip, Stack } from "@mui/material";
import getCategoryColor from "../../functions/getCategoryColor";
import { useNavigate } from "react-router-dom";
import { CascadeCalculation, RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { SCENARIOS, getScenarioSuffix } from "../../functions/scenarios";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { getMoneyString } from "../../functions/Impact";

const baseY = 50;

const ISankeyNode = ({
  x,
  y,
  width,
  height,
  index,
  payload,
  containerWidth,
  totalImpact,
  totalNodes,
  showComponents,
  scenarioSuffix,
  onClick,
}: any) => {
  const navigate = useNavigate();
  const scenarioLetter = scenarioSuffix[1];

  if (payload.depth <= 0) {
    return (
      <Layer key={`CustomNode${index}`}>
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
          y={x + 30}
          fontSize="16"
          stroke="#333"
          transform="rotate(270)"
        >
          Total Impact: {`${getMoneyString(totalImpact)} / event`}
        </text>
      </Layer>
    );
  } else {
    if (payload.value <= 0) return null;

    return (
      <Layer key={`CustomNode${index}`}>
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

            navigate(`/reporting/${payload.id}`);
          }}
        />
        {showComponents ? (
          <Tooltip
            title={
              <Box sx={{}}>
                {payload.cascade && (
                  <>
                    <Typography color="inherit">{payload.name}</Typography>

                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                      II({scenarioLetter}&rarr;all): {getMoneyString(payload.cascade[`ii_${scenarioLetter}`])}
                    </Typography>

                    <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: "normal" }}>
                      TI(c): {getMoneyString(payload.cascade.effect.ti_c)}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: "normal" }}>
                      CP({scenarioLetter}&rarr;c): {Math.round(10000 * payload.cascade[`${scenarioLetter}2c`]) / 100}%
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      II({scenarioLetter}&rarr;c):{" "}
                      {getMoneyString(payload.cascade[`${scenarioLetter}2c`] * payload.cascade.effect.ti_c)}
                    </Typography>

                    <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: "normal" }}>
                      TI(m): {getMoneyString(payload.cascade.effect.ti_m)}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: "normal" }}>
                      CP({scenarioLetter}&rarr;m): {Math.round(10000 * payload.cascade[`${scenarioLetter}2m`]) / 100}%
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      II({scenarioLetter}&rarr;m):{" "}
                      {getMoneyString(payload.cascade[`${scenarioLetter}2m`] * payload.cascade.effect.ti_m)}
                    </Typography>

                    <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: "normal" }}>
                      TI(e): {getMoneyString(payload.cascade.effect.ti_e)}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: "normal" }}>
                      CP({scenarioLetter}&rarr;e): {Math.round(10000 * payload.cascade[`${scenarioLetter}2e`]) / 100}%
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      II({scenarioLetter}&rarr;e):{" "}
                      {getMoneyString(payload.cascade[`${scenarioLetter}2e`] * payload.cascade.effect.ti_e)}
                    </Typography>

                    <Typography variant="subtitle2" sx={{ mt: 1 }}>
                      CP({scenarioLetter}&rarr;0):{" "}
                      {Math.round(
                        10000 *
                          (1 -
                            payload.cascade[`${scenarioLetter}2c`] -
                            payload.cascade[`${scenarioLetter}2m`] -
                            payload.cascade[`${scenarioLetter}2e`])
                      ) / 100}
                      %
                    </Typography>
                  </>
                )}
                {payload.hidden && (
                  <>
                    <Typography color="inherit">Other effects:</Typography>

                    {payload.hidden.map((h: any) =>
                      h.cascade ? (
                        <Typography key={h.name} variant="subtitle1" sx={{ mt: 1 }}>
                          {h.name} II({scenarioLetter}&rarr;all): {getMoneyString(h.i)}
                        </Typography>
                      ) : (
                        <Typography key={h.name} variant="subtitle1" sx={{ mt: 1 }}>
                          {h.name} DI({scenarioLetter}): {getMoneyString(h.i)}
                        </Typography>
                      )
                    )}
                  </>
                )}
                {!payload.cascade && !payload.hidden && (
                  <>
                    <Typography color="inherit">Direct Impact:</Typography>

                    <Typography variant="subtitle2" sx={{ mt: 1 }}>
                      DI({scenarioLetter}): {getMoneyString(payload.i)}
                    </Typography>
                  </>
                )}
              </Box>
            }
          >
            <text
              textAnchor="end"
              x={x - 6}
              y={y + height / 2 + 4}
              fontSize="14"
              stroke="#333"
              cursor="pointer"
              onClick={() => {
                if (!payload.id) return;

                if (onClick) return onClick(payload.id);

                navigate(`/reporting/${payload.id}`);
              }}
            >
              {payload.name}
            </text>
          </Tooltip>
        ) : (
          <text
            textAnchor="end"
            x={x - 6}
            y={y + height / 2 + 4}
            fontSize="14"
            stroke="#333"
            cursor="pointer"
            onClick={() => {
              if (!payload.id) return;

              if (onClick) return onClick(payload.id);

              navigate(`/risks/${payload.id}`);
            }}
          >
            {payload.name}
          </text>
        )}
        {/* <text textAnchor="end" x={x - 6} y={y + height / 2 + 18} fontSize="12" stroke="#333" strokeOpacity="0.5">
          {`${Math.round((100 * payload.value) / totalImpact)}%`}
        </text> */}
      </Layer>
    );
  }
};

const ISankeyLink = (props: any) => {
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

  const shiftedSourceY = totalNodes <= 2 ? targetY : sourceRelativeY + sourceY + (baseY - (sourceY - linkWidth / 2));

  return (
    <path
      d={`
        M${sourceX},${shiftedSourceY}
        C${sourceControlX},${shiftedSourceY} ${targetControlX},${targetY} ${targetX},${targetY}
      `}
      stroke="rgb(0, 164, 154, 0.6)"
      fill="none"
      strokeWidth={totalNodes <= 2 ? 600 - 2 * baseY : linkWidth}
      strokeOpacity="0.2"
      // {...filterProps(others)}
    />
  );
};

export default function ImpactSankey({
  riskFile = null,
  calculation,
  maxEffects = null,
  minEffectPortion = null,
  shownEffectPortion = null,
  scenario,
  debug = false,
  onClick = null,
}: {
  riskFile?: DVRiskFile | null;
  calculation: RiskCalculation | null;
  maxEffects?: number | null;
  minEffectPortion?: number | null;
  shownEffectPortion?: number | null;
  scenario: SCENARIOS;
  debug?: boolean;
  onClick?: ((id: string) => void) | null;
}) {
  if (!calculation) return null;

  let scenarioSuffix: string = getScenarioSuffix(scenario);

  const effects = [
    {
      name: "Direct Impact",
      i: calculation[`di${scenarioSuffix}` as keyof RiskCalculation] as number,
    },
    ...calculation.effects.map((c) => ({
      id: c.effect.riskId,
      name: c.effect.riskTitle,
      i: c[`ii${scenarioSuffix}` as keyof CascadeCalculation] as number,
      cascade: c,
    })),
  ];

  let minI = 0;

  if (maxEffects !== null) {
    minI =
      maxEffects === null || effects.length < maxEffects
        ? -1
        : effects.sort((a, b) => b.i - a.i)[Math.min(maxEffects - 1, effects.length - 1)].i;
  } else if (minEffectPortion !== null) {
    const Itot = effects.reduce((tot, e) => tot + e.i, 0.000000001);
    minI = minEffectPortion * Itot;
  } else if (shownEffectPortion !== null) {
    const Itot = effects.reduce((tot, e) => tot + e.i, 0.000000001);

    let cumulI = 0;
    for (let e of effects.sort((a, b) => b.i - a.i)) {
      cumulI += e.i / Itot;

      if (cumulI >= shownEffectPortion) {
        minI = e.i;
        break;
      }
    }
  }

  const nodes: any[] = [{ name: calculation.riskTitle }, ...effects.filter((c) => c.i >= minI)];
  if (minI >= 0)
    nodes.push({
      name: "Other",
      hidden: effects.filter((e: any, i: number) => e.i < minI),
    });

  const links: any[] = effects
    .filter((e) => e.i >= minI)
    .map((e, i: number) => ({
      source: 0,
      target: i + 1,
      value: Math.max(0.000000001, e.i),
    }));
  if (minI > 0)
    links.push({
      source: 0,
      target: nodes.length - 1,
      value: calculation.effects
        .filter((e: any, i: number) => (e[`ii${scenarioSuffix}` as keyof CascadeCalculation] as number) < minI)
        .reduce((tot, e) => tot + (e[`ii${scenarioSuffix}` as keyof CascadeCalculation] as number), 0.000000001),
      hidden: calculation.effects.filter(
        (e: any, i: number) => (e[`ii${scenarioSuffix}` as keyof CascadeCalculation] as number) < minI
      ),
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
                    (b[`ii${scenarioSuffix}` as keyof CascadeCalculation] as number) -
                    (a[`ii${scenarioSuffix}` as keyof CascadeCalculation] as number)
                )
                .slice(0, 10)
                .map((c: CascadeCalculation) => (
                  <Box key={c.cascadeId} sx={{ margin: 0, padding: 0 }}>
                    {`${c.effect.riskTitle}:`}{" "}
                    <b>{`${
                      Math.round(
                        (10000 * (c[`ii${scenarioSuffix}` as keyof CascadeCalculation] as number)) /
                          (calculation[`ti${scenarioSuffix}` as keyof RiskCalculation] as number)
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
      <Box sx={{ width: "100%", mb: 2, textAlign: "right" }}>
        <Typography variant="h6">
          {riskFile?.cr4de_risk_type === RISK_TYPE.MANMADE ? "Most Impactful Actions" : "Impact Breakdown"}
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={data}
          node={
            <ISankeyNode
              onClick={onClick}
              totalImpact={calculation[`ti${scenarioSuffix}` as keyof RiskCalculation]}
              totalNodes={data.nodes.length}
              showComponents={debug}
              scenarioSuffix={scenarioSuffix}
            />
          }
          link={<ISankeyLink totalNodes={data.nodes.length} />}
          nodePadding={data.nodes.length > 2 ? 100 / (data.nodes.length - 2) : 0}
          iterations={0}
        ></Sankey>
      </ResponsiveContainer>
    </>
  );
}
