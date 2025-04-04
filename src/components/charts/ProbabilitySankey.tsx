import { Box, Typography, Tooltip } from "@mui/material";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { SCENARIOS } from "../../functions/scenarios";
import { Cascades } from "../../functions/cascades";
import ProbabilitySankeyChart from "./svg/ProbabilitySankeyChart";
import round from "../../functions/roundNumberString";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function CustomTooltip({
  x,
  y,
  height,
  payload,
  totalProbability,
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

              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {payload.hidden.map((h: any) =>
                h.cascade ? (
                  <Typography key={h.name} variant="body1" sx={{ mt: 1 }}>
                    <b>{t(h.name)}:</b>{" "}
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
                {t(payload.name)}
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
  const navigate = useNavigate();

  return (
    <>
      <Box sx={{ width: "100%", height: 30, mb: 2 }}>
        {/* <Typography variant="h6">Probability Breakdown</Typography> */}
      </Box>
      <ProbabilitySankeyChart
        riskFile={riskFile}
        cascades={cascades}
        maxCauses={maxCauses}
        shownCausePortion={shownCausePortion}
        minCausePortion={minCausePortion}
        scenario={scenario}
        onClick={onClick}
        debug={debug}
        manmade={manmade}
        CustomTooltip={CustomTooltip}
        onNavigate={(id: string) => navigate(`/risks/${id}/analysis`)}
      />
    </>
  );
}
