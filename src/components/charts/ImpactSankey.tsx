import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { SCENARIOS } from "../../functions/scenarios";
import { Cascades } from "../../functions/cascades";
import ImpactSankeyChart from "./svg/ImpactSankeyChart";
import { Box, Typography, Tooltip } from "@mui/material";
import round from "../../functions/roundNumberString";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function CustomTooltip({
  x,
  y,
  height,
  payload,
  totalImpact,
  fontSize,
  onClick,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Tooltip
      title={
        <Box sx={{}}>
          {payload.cascade && (
            <>
              <Typography variant="subtitle1" color="inherit">
                {t(payload.name)}
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

              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {payload.hidden.map((h: any) =>
                h.cascade ? (
                  <Typography key={h.name} variant="body1" sx={{ mt: 1 }}>
                    <b>{t(h.name)}:</b>{" "}
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
                {t(payload.name)}
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
        {t(payload.name)}
      </text>
    </Tooltip>
  );
}

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
      <ImpactSankeyChart
        riskFile={riskFile}
        cascades={cascades}
        maxEffects={maxEffects}
        shownEffectPortion={shownEffectPortion}
        minEffectPortion={minEffectPortion}
        scenario={scenario}
        onClick={onClick}
        debug={debug}
        CustomTooltip={CustomTooltip}
      />
    </>
  );
}
