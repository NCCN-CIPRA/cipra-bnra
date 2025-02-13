import { Layer, Rectangle, ResponsiveContainer, Sankey } from "recharts";
import { Box, Typography, Tooltip } from "@mui/material";
import getCategoryColor from "../../functions/getCategoryColor";
import { useNavigate } from "react-router-dom";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import {
  SCENARIOS,
  getCascadeParameter,
  getScenarioParameter,
  getScenarioSuffix,
} from "../../functions/scenarios";
import round from "../../functions/roundNumberString";
import { Cascades } from "../../pages/BaseRisksPage";
import { useTranslation } from "react-i18next";

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
  fontSize,
  onClick,
}: any) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const scenarioLetter = scenarioSuffix[1];

  if (payload.depth <= 0) {
    return (
      <Layer className="total-impact" key={`CustomNode${index}`}>
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
          fontSize={fontSize || "16"}
          stroke="#333"
          transform="rotate(270)"
        >
          {`${t("Total Impact")}: ${round(totalImpact, 2)} / 5`}
        </text>
      </Layer>
    );
  } else {
    if (payload.value <= 0) return null;

    return (
      <Layer className="impact-effect" key={`CustomNode${index}`}>
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
                    {t("analysis.effect.explained", {
                      percentage: round((100 * payload.i) / totalImpact, 2),
                    })}
                  </Typography>

                  {/* <Typography variant="subtitle1" sx={{ mt: 1 }}>
                          II({scenarioLetter}&rarr;all): {getMoneyString(payload.cascade[`ii_${scenarioLetter}`])}
                        </Typography>

                        <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: "normal" }}>
                          TI(c): {getMoneyString(payload.cascade.effect.ti_c)}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: "normal" }}>
                          CP({scenarioLetter}&rarr;c):{" "}
                          {Math.round(10000 * payload.cascade[`${scenarioLetter}2c`]) / 100}%
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                          II({scenarioLetter}&rarr;c):{" "}
                          {getMoneyString(payload.cascade[`${scenarioLetter}2c`] * payload.cascade.effect.ti_c)}
                        </Typography>

                        <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: "normal" }}>
                          TI(m): {getMoneyString(payload.cascade.effect.ti_m)}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: "normal" }}>
                          CP({scenarioLetter}&rarr;m):{" "}
                          {Math.round(10000 * payload.cascade[`${scenarioLetter}2m`]) / 100}%
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                          II({scenarioLetter}&rarr;m):{" "}
                          {getMoneyString(payload.cascade[`${scenarioLetter}2m`] * payload.cascade.effect.ti_m)}
                        </Typography>

                        <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: "normal" }}>
                          TI(e): {getMoneyString(payload.cascade.effect.ti_e)}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: "normal" }}>
                          CP({scenarioLetter}&rarr;e):{" "}
                          {Math.round(10000 * payload.cascade[`${scenarioLetter}2e`]) / 100}%
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
                        </Typography> */}
                </>
              )}
              {payload.hidden && (
                <>
                  <Typography variant="subtitle1" color="inherit">
                    {t("Other effects")}:
                  </Typography>

                  {payload.hidden.map((h: any) =>
                    h.cascade ? (
                      <Typography key={h.name} variant="body1" sx={{ mt: 1 }}>
                        <b>{h.name}:</b>{" "}
                        {t("analysis.effect.other.explained", {
                          percentage: round((100 * h.i) / totalImpact, 2),
                        })}
                      </Typography>
                    ) : (
                      <Typography key={h.name} variant="body1" sx={{ mt: 1 }}>
                        <b>{t("2A.dp.title", "Direct Impact")}</b>
                        {": "}
                        {t("analysis.effect.other.explained", {
                          percentage: round((100 * h.i) / totalImpact, 2),
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
                    <b>{t("2A.dp.title", "Direct Impact")}</b>
                    {": "}
                    {t("analysis.di.explained", {
                      percentage: round((100 * payload.i) / totalImpact, 2),
                    })}
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
            fontSize={fontSize - 2 || "14"}
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

  const shiftedSourceY =
    totalNodes <= 2
      ? targetY
      : sourceRelativeY + sourceY + (baseY - (sourceY - linkWidth / 2));

  return (
    <path
      d={`
        M${sourceX},${shiftedSourceY}
        C${sourceControlX},${shiftedSourceY} ${targetControlX},${targetY} ${targetX},${targetY}
      `}
      stroke="rgb(102,200,194)"
      fill="none"
      strokeWidth={totalNodes <= 2 ? 600 - 2 * baseY : linkWidth}
      strokeOpacity="0.2"
      // {...filterProps(others)}
    />
  );
};

export default function ImpactSankey({
  riskFile = null,
  cascades = null,
  maxEffects = null,
  minEffectPortion = null,
  shownEffectPortion = null,
  scenario,
  debug = false,
  onClick = null,
}: {
  riskFile?: DVRiskFile | null;
  cascades?: Cascades | null;
  maxEffects?: number | null;
  minEffectPortion?: number | null;
  shownEffectPortion?: number | null;
  scenario: SCENARIOS;
  debug?: boolean;
  onClick?: ((id: string) => void) | null;
}) {
  return (
    <>
      <Box sx={{ width: "100%", height: 30, mb: 2, textAlign: "right" }}>
        {/* <Typography variant="h6">
          {riskFile?.cr4de_risk_type === RISK_TYPE.MANMADE ? "Most Impactful Actions" : "Impact Breakdown"}
        </Typography> */}
      </Box>
      <SvgChart
        riskFile={riskFile}
        cascades={cascades}
        maxEffects={maxEffects}
        shownEffectPortion={shownEffectPortion}
        minEffectPortion={minEffectPortion}
        scenario={scenario}
        onClick={onClick}
        debug={debug}
      />
    </>
  );
}

export const SvgChart = ({
  riskFile = null,
  cascades = null,
  maxEffects = null,
  minEffectPortion = null,
  shownEffectPortion = null,
  scenario,
  debug = false,
  width = "100%",
  height = "100%",
  onClick = null,
}: {
  riskFile?: DVRiskFile | null;
  cascades?: Cascades | null;
  maxEffects?: number | null;
  minEffectPortion?: number | null;
  shownEffectPortion?: number | null;
  scenario: SCENARIOS;
  debug?: boolean;
  width?: number | string;
  height?: number | string;
  onClick?: ((id: string) => void) | null;
}) => {
  const { t } = useTranslation();
  if (!riskFile || !cascades) return null;

  let scenarioSuffix: string = getScenarioSuffix(scenario);

  const effects = [
    {
      name: t("Direct Impact"),
      i: getScenarioParameter(riskFile, "DI", scenario) || 0,
    },
    ...cascades.effects.map((e) => ({
      id: e.cr4de_effect_hazard.cr4de_riskfilesid,
      name: t(
        `risk.${e.cr4de_effect_hazard.cr4de_hazard_id}.name`,
        e.cr4de_effect_hazard.cr4de_title
      ),
      i: getCascadeParameter(e, scenario, "II") || 0,
      cascade: e,
    })),
  ];

  let minI = 0;
  const totI = effects.reduce((t, e) => t + e.i, 0);

  if (maxEffects !== null) {
    minI =
      maxEffects === null || effects.length < maxEffects
        ? -1
        : effects.sort((a, b) => b.i - a.i)[
            Math.min(maxEffects - 1, effects.length - 1)
          ].i;
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

  const nodes: any[] = [
    { name: t(`risk.${riskFile.cr4de_hazard_id}.name`, riskFile.cr4de_title) },
    ...effects.filter((c) => c.i >= minI),
  ];
  if (minI >= 0)
    nodes.push({
      name: t("Other"),
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
      value: effects
        .filter((e: any, i: number) => e.i < minI)
        .reduce((tot, e) => tot + e.i, 0.000000001),
      hidden: effects.filter((e: any, i: number) => e.i < minI),
    });

  const data = {
    nodes,
    links,
  };

  if (typeof width === "string" || typeof height === "string") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={data}
          node={
            <ISankeyNode
              onClick={onClick}
              totalImpact={getScenarioParameter(riskFile, "TI", scenario) || 0}
              totalNodes={data.nodes.length}
              showComponents={debug}
              scenarioSuffix={scenarioSuffix}
            />
          }
          link={<ISankeyLink totalNodes={data.nodes.length} />}
          nodePadding={
            data.nodes.length > 2 ? 100 / (data.nodes.length - 2) : 0
          }
          iterations={0}
        ></Sankey>
      </ResponsiveContainer>
    );
  }

  return (
    <Sankey
      width={width as number}
      height={height as number}
      data={data}
      node={
        <ISankeyNode
          onClick={onClick}
          totalImpact={getScenarioParameter(riskFile, "TI", scenario) || 0}
          totalNodes={data.nodes.length}
          showComponents={debug}
          scenarioSuffix={scenarioSuffix}
          fontSize={22}
        />
      }
      link={<ISankeyLink totalNodes={data.nodes.length} />}
      nodePadding={data.nodes.length > 2 ? 100 / (data.nodes.length - 2) : 0}
      iterations={0}
    ></Sankey>
  );
};
