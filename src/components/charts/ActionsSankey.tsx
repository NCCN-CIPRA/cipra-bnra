import { Box, Typography, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { SCENARIOS } from "../../functions/scenarios";
import round from "../../functions/roundNumberString";
import { useTranslation } from "react-i18next";
import { Cascades } from "../../functions/cascades";
import ActionsSankeyChart from "./svg/ActionsSankeyChart";

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
                {payload.name}
              </Typography>

              <Typography variant="body1" sx={{ mt: 1 }}>
                {t("analysis.action.explained", {
                  percentage: round((100 * payload.cp) / totalProbability, 2),
                })}
              </Typography>
            </>
          )}
          {payload.hidden && (
            <>
              <Typography variant="subtitle1" color="inherit">
                {t("Other causes")}:
              </Typography>

              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
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

export default function ActionsSankey({
  riskFile = null,
  cascades = null,
  maxActions = null,
  minActionPortion = null,
  shownActionPortion = null,
  scenario,
  debug = false,
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
  const navigate = useNavigate();

  return (
    <>
      <Box sx={{ width: "100%", height: 30, mb: 2 }}>
        {/* <Typography variant="h6">Preferred Malicious Actions</Typography> */}
      </Box>
      <ActionsSankeyChart
        riskFile={riskFile}
        cascades={cascades}
        maxActions={maxActions}
        shownActionPortion={shownActionPortion}
        minActionPortion={minActionPortion}
        scenario={scenario}
        onClick={onClick}
        debug={debug}
        CustomTooltip={CustomTooltip}
        onNavigate={(id: string) => navigate(`/risks/${id}/analysis`)}
      />
    </>
  );
}
