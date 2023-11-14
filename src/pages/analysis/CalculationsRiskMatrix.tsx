import { useMemo, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  Cell,
} from "recharts";
import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import {
  Stack,
  Typography,
  Card,
  CardContent,
  CardActions,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Box,
} from "@mui/material";
import { getMoneyString } from "../../functions/Impact";
import { SCENARIOS, SCENARIO_PARAMS } from "../../functions/scenarios";

interface MatrixRisk {
  id: string;
  title: string;
  x: number;
  y: number;
  tr: number;
  scenario: SCENARIOS;
}

export default function CalculationsRiskMatrix({ risks }: { risks: RiskCalculation[] }) {
  const [dots, setDots] = useState<MatrixRisk[] | null>(null);
  const [worstCase, setWorstCase] = useState(false);

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active) {
      return (
        <Stack sx={{ backgroundColor: "rgba(255,255,255,0.8)", border: "1px solid #eee", p: 1 }}>
          <Typography variant="subtitle1">{payload?.[0].payload.title}</Typography>
          <Typography variant="subtitle2">{`Total Probability: ${
            Math.round((payload?.[0].value as number) * 100000) / 1000
          }%`}</Typography>
          <Typography variant="subtitle2">{`Total Impact: ${getMoneyString(payload?.[1].value as number)}`}</Typography>
          <Typography variant="subtitle2">{`Total Risk: ${getMoneyString(
            payload?.[0].payload.tr as number
          )}`}</Typography>
        </Stack>
      );
    }

    return null;
  };

  useMemo(() => {
    setDots(
      risks.reduce((split, c) => {
        const rs = [c.tp_c * c.ti_c, c.tp_m * c.ti_m, c.tp_e * c.ti_e];

        if (worstCase) {
          if (c.tp_c === 0 && c.tp_m === 0 && c.tp_e === 0) return split;

          return [
            ...split,
            [
              {
                id: `${c.riskId}_c`,
                title: `Considerable ${c.riskTitle}`,
                x: c.tp_c,
                y: c.ti_c,
                tr: c.tp_c * c.ti_c,
                scenario: SCENARIOS.CONSIDERABLE,
              },
              {
                id: `${c.riskId}_m`,
                title: `Major ${c.riskTitle}`,
                x: c.tp_m,
                y: c.ti_m,
                tr: c.tp_m * c.ti_m,
                scenario: SCENARIOS.MAJOR,
              },
              {
                id: `${c.riskId}_e`,
                title: `Extreme ${c.riskTitle}`,
                x: c.tp_e,
                y: c.ti_e,
                tr: c.tp_e * c.ti_e,
                scenario: SCENARIOS.EXTREME,
              },
            ][rs.indexOf(Math.max(...rs))],
          ];
        } else {
          return [
            ...split,
            ...(c.tp_c === 0
              ? []
              : [
                  {
                    id: `${c.riskId}_c`,
                    title: `Considerable ${c.riskTitle}`,
                    x: c.tp_c,
                    y: c.ti_c,
                    tr: c.tp_c * c.ti_c,
                    scenario: SCENARIOS.CONSIDERABLE,
                  },
                ]),
            ...(c.tp_m === 0
              ? []
              : [
                  {
                    id: `${c.riskId}_m`,
                    title: `Major ${c.riskTitle}`,
                    x: c.tp_m,
                    y: c.ti_m,
                    tr: c.tp_m * c.ti_m,
                    scenario: SCENARIOS.MAJOR,
                  },
                ]),
            ...(c.tp_e === 0
              ? []
              : [
                  {
                    id: `${c.riskId}_e`,
                    title: `Extreme ${c.riskTitle}`,
                    x: c.tp_e,
                    y: c.ti_e,
                    tr: c.tp_e * c.ti_e,
                    scenario: SCENARIOS.EXTREME,
                  },
                ]),
          ];
        }
      }, [] as MatrixRisk[])
    );
  }, [risks, worstCase]);

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent sx={{ height: 600 }}>
        <ResponsiveContainer>
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey="x"
              name="probability"
              unit="%"
              scale="log"
              domain={["auto", "auto"]}
              tickCount={10}
              tickFormatter={(n) => `${Math.round(n * 100000) / 1000}`}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="impact"
              scale="log"
              domain={["auto", "auto"]}
              tickCount={10}
              tickFormatter={getMoneyString}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomTooltip />} />
            <Scatter name="A school" data={dots || []} fill="#8884d8">
              {(dots || []).map((entry, index) => (
                <Cell key={`cell-${entry.id}`} fill={SCENARIO_PARAMS[entry.scenario].color} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
      <CardActions sx={{ mx: 2 }}>
        <Box>
          <Typography variant="subtitle2">Risk matrix parameters:</Typography>
        </Box>
        <FormGroup sx={{}}>
          <FormControlLabel
            control={<Checkbox checked={worstCase} onChange={(e) => setWorstCase(e.target.checked)} />}
            label="Show only worst case scenario"
          />
        </FormGroup>
      </CardActions>
    </Card>
  );
}
