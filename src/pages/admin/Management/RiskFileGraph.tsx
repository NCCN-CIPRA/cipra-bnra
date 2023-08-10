import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis, Tooltip, TooltipProps } from "recharts";
import { addDays } from "../../../functions/days";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { DVValidation } from "../../../types/dataverse/DVValidation";
import { SelectableContact } from "./Selectables";

interface RFBucket {
  date: number;
  notStarted: number;
  started: number;
  silenceProcedureStarted: number;
  step2AStarted: number;
  step2BStarted: number;
  enoughInput2A: number;
  enoughInput2B: number;
  allInputs: number;
}

const CustomTooltip = ({ active, payload, label }: { active?: any; payload?: any[]; label?: any } = {}) => {
  if (!payload || payload.length <= 0) return <div></div>;

  return (
    <Box sx={{ borderRadius: 4, backgroundColor: "rgba(255,255,255,.9)", p: 2 }}>
      <Typography variant="subtitle2">{new Date(label).toISOString().slice(0, 10)}</Typography>
      <table>
        <tbody>
          {payload.map((p) => (
            <tr key={p.name}>
              <td>
                <Typography variant="body1" sx={{ color: p.fill }}>
                  {p.name}:
                </Typography>
              </td>
              <td>
                <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "right", pl: 2 }}>
                  {p.value}
                </Typography>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <Typography variant="body1" sx={{ pt: 2 }}>
                Total:
              </Typography>
            </td>
            <td>
              <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "right", pl: 2, pt: 2 }}>
                {payload.reduce((tot, p) => tot + p.value, 0)}
              </Typography>
            </td>
          </tr>
          <tr>
            <td>
              <Typography variant="body1" sx={{ pt: 2 }}>
                % Validation Finished:
              </Typography>
            </td>
            <td>
              <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "right", pl: 2, pt: 2 }}>
                {Math.round(
                  (1000 *
                    (payload[0].value + payload[1].value + payload[2].value + payload[3].value + payload[4].value)) /
                    payload.reduce((tot, p) => tot + p.value, 0)
                ) / 10}
                %
              </Typography>
            </td>
          </tr>
          <tr>
            <td>
              <Typography variant="body1">% Step 2A Acceptable:</Typography>
            </td>
            <td>
              <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "right", pl: 2 }}>
                {Math.round((1000 * payload[0].payload.enoughInput2A) / payload.reduce((tot, p) => tot + p.value, 0)) /
                  10}
                %
              </Typography>
            </td>
          </tr>
          <tr>
            <td>
              <Typography variant="body1">% Step 2B Acceptable:</Typography>
            </td>
            <td>
              <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "right", pl: 2 }}>
                {Math.round(
                  (1000 * payload[0].payload.enoughInput2B + payload[0].payload.allInputs) /
                    payload.reduce((tot, p) => tot + p.value, 0)
                ) / 10}
                %
              </Typography>
            </td>
          </tr>
        </tbody>
      </table>
    </Box>
  );
};

export default function RiskFileGraph({
  participations,
}: {
  participations: DVParticipation<SelectableContact, DVRiskFile, DVValidation>[];
}) {
  const [riskFileBuckets, setRiskFileBuckets] = useState<RFBucket[]>([]);
  const [firstDate, setFirstDate] = useState<number>(Date.now());
  const [lastDate, setLastDate] = useState<number>(addDays(new Date(), 1).getTime());

  useEffect(() => {
    const riskFiles: { [key: string]: DVParticipation<SelectableContact, DVRiskFile, DVValidation>[] } = {};

    let firstDateCalc = firstDate;

    participations.forEach((p) => {
      if (!p._cr4de_risk_file_value) return;

      if (!riskFiles[p._cr4de_risk_file_value]) riskFiles[p._cr4de_risk_file_value] = [];

      riskFiles[p._cr4de_risk_file_value].push(p);

      if (p.cr4de_validation?.createdon && new Date(p.cr4de_validation.createdon).getTime() < firstDateCalc) {
        firstDateCalc = new Date(p.cr4de_validation.createdon).getTime();
      }
    });

    setFirstDate(firstDateCalc);

    let currentDate = addDays(new Date(firstDateCalc), -1).getTime();
    const dates = [];

    do {
      dates.push({
        date: currentDate,
        notStarted: 0,
        started: 0,
        silenceProcedureStarted: 0,
        step2AStarted: 0,
        step2BStarted: 0,
        enoughInput2A: 0,
        enoughInput2B: 0,
        allInputs: 0,
      });

      currentDate = addDays(new Date(currentDate), 1).getTime();
    } while (currentDate <= lastDate);

    for (let participations of Object.values(riskFiles)) {
      for (let i = 0; i < dates.length; i++) {
        const d = dates[i];

        if (
          participations.filter(
            (p) =>
              p.cr4de_direct_analysis_finished_on && new Date(p.cr4de_direct_analysis_finished_on).getTime() <= d.date
          ).length >= 2
        ) {
          dates[i].enoughInput2A++;
        }

        if (
          participations.every(
            (p) =>
              p.cr4de_cascade_analysis_finished_on && new Date(p.cr4de_cascade_analysis_finished_on).getTime() <= d.date
          )
        ) {
          dates[i].allInputs++;
        } else if (
          participations.filter(
            (p) =>
              p.cr4de_cascade_analysis_finished_on && new Date(p.cr4de_cascade_analysis_finished_on).getTime() <= d.date
          ).length >= 2
        ) {
          dates[i].enoughInput2B++;
        } else if (
          participations.filter(
            (p) =>
              p.cr4de_cascade_analysis_finished_on && new Date(p.cr4de_cascade_analysis_finished_on).getTime() <= d.date
          ).length >= 1
        ) {
          dates[i].step2BStarted++;
        } else if (
          participations.filter(
            (p) =>
              p.cr4de_direct_analysis_finished_on && new Date(p.cr4de_direct_analysis_finished_on).getTime() <= d.date
          ).length >= 1
        ) {
          dates[i].step2AStarted++;
        } else if (
          participations.some(
            (p) =>
              p.cr4de_risk_file?.cr4de_validation_silent_procedure_until != null &&
              addDays(new Date(p.cr4de_risk_file?.cr4de_validation_silent_procedure_until), -14).getTime() <= d.date
          )
        ) {
          console.log(participations);
          dates[i].silenceProcedureStarted++;
        } else if (
          participations.filter(
            (p) =>
              p.cr4de_role === "expert" &&
              p.cr4de_validation_finished_on !== null &&
              new Date(p.cr4de_validation_finished_on).getTime() <= d.date
          ).length >= 1
        ) {
          dates[i].started++;
        } else {
          dates[i].notStarted++;
        }
      }
    }

    setRiskFileBuckets(dates);
  }, [participations]);

  return (
    <>
      <Typography variant="h6">Risk File Progress Overview</Typography>
      <AreaChart
        width={1000}
        height={400}
        data={riskFileBuckets}
        margin={{
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          domain={[firstDate, lastDate]}
          dataKey="date"
          tickFormatter={(d) => new Date(d).toISOString().slice(0, 10)}
          type="number"
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        {/* <Area
          type="monotone"
          dataKey="enoughInput"
          stackId="1"
          stroke="#ffa600"
          fill="#ffa600"
          name="Ready for consensus"
        /> */}
        <Area
          type="monotone"
          dataKey="allInputs"
          stackId="1"
          stroke="#ff7c43"
          fill="#ff7c43"
          name="All inputs received"
        />
        <Area
          type="monotone"
          dataKey="enoughInput2B"
          stackId="1"
          stroke="#f95d6a"
          fill="#f95d6a"
          name="Ready for consensus"
        />
        <Area
          type="monotone"
          dataKey="step2BStarted"
          stackId="1"
          stroke="#d45087"
          fill="#d45087"
          name="Step 2B started"
        />
        <Area
          type="monotone"
          dataKey="step2AStarted"
          stackId="1"
          stroke="#a05195"
          fill="#a05195"
          name="Step 2A started"
        />
        <Area
          type="monotone"
          dataKey="silenceProcedureStarted"
          stackId="1"
          stroke="#665191"
          fill="#665191"
          name="Silence procedure started"
        />
        <Area
          type="monotone"
          dataKey="started"
          stackId="1"
          stroke="#2f4b7c"
          fill="#2f4b7c"
          name="Validation phase started"
        />
        <Area
          type="monotone"
          dataKey="notStarted"
          stackId="1"
          stroke="#003f5c"
          fill="#003f5c"
          name="Process not started"
        />
      </AreaChart>
    </>
  );
}
