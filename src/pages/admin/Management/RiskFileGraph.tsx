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
  moreThan2Done: number;
  twoLeft: number;
  oneLeft: number;
  validationComplete: number;
  silenceProcedureStarted: number;
  step2AStarted: number;
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
                  (1000 * (payload[0].value + payload[1].value + payload[2].value)) /
                    payload.reduce((tot, p) => tot + p.value, 0)
                ) / 10}
                %
              </Typography>
            </td>
          </tr>
          <tr>
            <td>
              <Typography variant="body1">% Validation Acceptable:</Typography>
            </td>
            <td>
              <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "right", pl: 2 }}>
                {Math.round(
                  (1000 *
                    (payload[0].value +
                      payload[1].value +
                      payload[2].value +
                      payload[3].value +
                      payload[4].value +
                      payload[5].value)) /
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
        moreThan2Done: 0,
        twoLeft: 0,
        oneLeft: 0,
        validationComplete: 0,
        silenceProcedureStarted: 0,
        step2AStarted: 0,
      });

      currentDate = addDays(new Date(currentDate), 1).getTime();
    } while (currentDate <= lastDate);

    for (let participations of Object.values(riskFiles)) {
      for (let i = 0; i < dates.length; i++) {
        const d = dates[i];

        if (
          participations.some(
            (p) =>
              p.cr4de_risk_file?.cr4de_validation_silent_procedure_until &&
              new Date(p.cr4de_risk_file.cr4de_validation_silent_procedure_until).getTime() <= d.date
          )
        ) {
          dates[i].step2AStarted++;
        } else if (
          participations.some(
            (p) =>
              p.cr4de_risk_file?.cr4de_validation_silent_procedure_until &&
              addDays(new Date(p.cr4de_risk_file.cr4de_validation_silent_procedure_until), -14).getTime() <= d.date
          )
        ) {
          dates[i].silenceProcedureStarted++;
        } else if (
          participations.every(
            (p) =>
              p.cr4de_role !== "expert" ||
              (p.cr4de_validation_finished_on && new Date(p.cr4de_validation_finished_on).getTime() <= d.date)
          )
        ) {
          dates[i].validationComplete++;
        } else if (
          participations.filter(
            (p) =>
              p.cr4de_role === "expert" &&
              (p.cr4de_validation_finished_on === null ||
                (p.cr4de_validation_finished_on && new Date(p.cr4de_validation_finished_on).getTime() > d.date))
          ).length === 1 &&
          participations.filter(
            (p) =>
              p.cr4de_role === "expert" &&
              p.cr4de_validation_finished_on !== null &&
              new Date(p.cr4de_validation_finished_on).getTime() <= d.date
          ).length >= 2
        ) {
          dates[i].oneLeft++;
        } else if (
          participations.filter(
            (p) =>
              p.cr4de_role === "expert" &&
              (p.cr4de_validation_finished_on === null ||
                (p.cr4de_validation_finished_on && new Date(p.cr4de_validation_finished_on).getTime() > d.date))
          ).length === 2 &&
          participations.filter(
            (p) =>
              p.cr4de_role === "expert" &&
              p.cr4de_validation_finished_on !== null &&
              new Date(p.cr4de_validation_finished_on).getTime() <= d.date
          ).length >= 2
        ) {
          dates[i].twoLeft++;
        } else if (
          participations.filter(
            (p) =>
              p.cr4de_role === "expert" &&
              p.cr4de_validation_finished_on !== null &&
              new Date(p.cr4de_validation_finished_on).getTime() <= d.date
          ).length >= 2
        ) {
          dates[i].moreThan2Done++;
        } else if (
          participations.filter(
            (p) =>
              p.cr4de_role === "expert" &&
              p.cr4de_validation !== null &&
              new Date(p.cr4de_validation.createdon).getTime() <= d.date
          ).length >= 1 &&
          participations.filter((p) => p.cr4de_role === "expert").length > 0
        ) {
          dates[i].started++;
        } else {
          dates[i].notStarted++;
          if (i >= dates.length - 1)
            console.log(
              new Date(d.date),
              participations[0].cr4de_risk_file.cr4de_title,
              participations,
              participations.filter(
                (p) =>
                  p.cr4de_role === "expert" &&
                  (p.cr4de_validation_finished_on === null ||
                    new Date(p.cr4de_validation_finished_on).getTime() > d.date)
              ).length
            );
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
        <Area
          type="monotone"
          dataKey="step2AStarted"
          stackId="1"
          stroke="#ffa600"
          fill="#ffa600"
          name="Step 2A started"
        />
        <Area
          type="monotone"
          dataKey="silenceProcedureStarted"
          stackId="1"
          stroke="#ff7c43"
          fill="#ff7c43"
          name="Silence procedure started"
        />
        <Area
          type="monotone"
          dataKey="validationComplete"
          stackId="1"
          stroke="#f95d6a"
          fill="#f95d6a"
          name="All validations finished"
        />
        <Area
          type="monotone"
          dataKey="oneLeft"
          stackId="1"
          stroke="#d45087"
          fill="#d45087"
          name="1 validation left, 2 or more done"
        />
        <Area
          type="monotone"
          dataKey="twoLeft"
          stackId="1"
          stroke="#a05195"
          fill="#a05195"
          name="2 validations left, 2 or more done"
        />
        <Area
          type="monotone"
          dataKey="moreThan2Done"
          stackId="1"
          stroke="#665191"
          fill="#665191"
          name="> 2 validations left, 2 or more done"
        />
        <Area
          type="monotone"
          dataKey="started"
          stackId="1"
          stroke="#2f4b7c"
          fill="#2f4b7c"
          name="> 2 validations left, less than 2 done"
        />
        <Area
          type="monotone"
          dataKey="notStarted"
          stackId="1"
          stroke="#003f5c"
          fill="#003f5c"
          name="Validation not started"
        />
      </AreaChart>
    </>
  );
}
