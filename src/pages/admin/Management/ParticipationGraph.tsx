import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
} from "recharts";
import { addDays } from "../../../functions/days";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import {
  DVValidation,
  ValidationEditableFields,
  VALIDATION_EDITABLE_FIELDS,
} from "../../../types/dataverse/DVValidation";
import { SelectableContact, SelectableRiskFile } from "./Selectables";
import {
  DIRECT_ANALYSIS_EDITABLE_FIELDS,
  DVDirectAnalysis,
  DirectAnalysisEditableFields,
} from "../../../types/dataverse/DVDirectAnalysis";

interface Bucket {
  date: number;
  notStarted: number;
  validated: number;
  step2ADone: number;
  step2BDone: number;
}

const isValidationEmpty = (input: ValidationEditableFields) =>
  VALIDATION_EDITABLE_FIELDS.every((fieldName) => input[fieldName] === null);
const isValidationComplete = (input: ValidationEditableFields) =>
  VALIDATION_EDITABLE_FIELDS.every((fieldName) => input[fieldName] !== null);

const isStep2AEmpty = (input: DirectAnalysisEditableFields) =>
  DIRECT_ANALYSIS_EDITABLE_FIELDS.every((fieldName) => input[fieldName] === null);
const isStep2AComplete = (input: DirectAnalysisEditableFields) =>
  DIRECT_ANALYSIS_EDITABLE_FIELDS.every((fieldName) => input[fieldName] !== null);

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
              <Typography variant="body1" sx={{ pt: 0 }}>
                % Step 2A Finished:
              </Typography>
            </td>
            <td>
              <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "right", pl: 2, pt: 0 }}>
                {Math.round(
                  (1000 * (payload[0].value + payload[1].value)) / payload.reduce((tot, p) => tot + p.value, 0)
                ) / 10}
                %
              </Typography>
            </td>
          </tr>
          <tr>
            <td>
              <Typography variant="body1" sx={{ pt: 0 }}>
                % Step 2B Finished:
              </Typography>
            </td>
            <td>
              <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "right", pl: 2, pt: 0 }}>
                {Math.round((1000 * payload[0].value) / payload.reduce((tot, p) => tot + p.value, 0)) / 10}%
              </Typography>
            </td>
          </tr>
        </tbody>
      </table>
    </Box>
  );
};

export default function ParticipationGraph({
  participations,
}: {
  participations: DVParticipation<SelectableContact, DVRiskFile, DVValidation, DVDirectAnalysis>[];
}) {
  const [participationBuckets, setParticipationBuckets] = useState<Bucket[]>([]);
  const [firstDate, setFirstDate] = useState<number>(Date.now());
  const [lastDate, setLastDate] = useState<number>(Date.now());

  useEffect(() => {
    const datedPs = participations.map((p) => ({
      step2BFinishedDate: p.cr4de_cascade_analysis_finished_on
        ? new Date(p.cr4de_cascade_analysis_finished_on).getTime()
        : null,
      step2BStartedDate:
        p.cr4de_direct_analysis_finished_on && p.cr4de_risk_file.cr4de_step2b_enabled_on
          ? new Date(
              Math.max(
                p.cr4de_direct_analysis_finished_on as unknown as number,
                p.cr4de_risk_file.cr4de_step2b_enabled_on as unknown as number
              )
            ).getTime()
          : null,
      step2AFinishedDate: p.cr4de_direct_analysis_finished_on
        ? new Date(p.cr4de_direct_analysis_finished_on).getTime()
        : null,
      step2ACompletedDate:
        p.cr4de_direct_analysis && isStep2AComplete(p.cr4de_direct_analysis)
          ? new Date(p.cr4de_direct_analysis.modifiedon).getTime()
          : null,
      step2AModifiedDate:
        p.cr4de_direct_analysis && !isStep2AEmpty(p.cr4de_direct_analysis)
          ? new Date(p.cr4de_direct_analysis.modifiedon).getTime()
          : null,
      step2ACreatedDate: p.cr4de_direct_analysis ? new Date(p.cr4de_direct_analysis.createdon).getTime() : null,
      validationFinishedDate: p.cr4de_validation_finished_on
        ? new Date(p.cr4de_validation_finished_on).getTime()
        : null,
      validationCompletedDate:
        p.cr4de_validation && isValidationComplete(p.cr4de_validation)
          ? new Date(p.cr4de_validation.modifiedon).getTime()
          : null,
      validationModifiedDate:
        p.cr4de_validation && !isValidationEmpty(p.cr4de_validation)
          ? new Date(p.cr4de_validation.modifiedon).getTime()
          : null,
      validationCreatedDate: p.cr4de_validation ? new Date(p.cr4de_validation.modifiedon).getTime() : null,
      registrationDate: p.cr4de_contact.msdyn_portaltermsagreementdate
        ? new Date(p.cr4de_contact.msdyn_portaltermsagreementdate).getTime()
        : null,
      addedDate: p.createdon ? new Date(p.createdon).getTime() : null,
      participation: p,
    }));

    let firstDate = new Date().getTime();
    let lastDate = new Date().getTime();
    datedPs.forEach((p) => {
      if (p.registrationDate && (firstDate === null || p.registrationDate < firstDate)) firstDate = p.registrationDate;
      if (p.validationFinishedDate && (lastDate === null || p.validationFinishedDate > lastDate))
        lastDate = p.validationFinishedDate;
    });

    firstDate -= 24 * 60 * 60 * 1000;
    lastDate += 24 * 60 * 60 * 1000;
    let currentDate = firstDate;
    const dates = [];

    do {
      dates.push({
        date: currentDate,
        notStarted: 0,
        validated: 0,
        step2ADone: 0,
        step2BDone: 0,
      });

      currentDate = addDays(new Date(currentDate), 1).getTime();
    } while (currentDate <= lastDate);

    for (let p of datedPs) {
      for (let i = 0; i < dates.length; i++) {
        const d = dates[i];

        if (p.step2BFinishedDate && d.date >= p.step2BFinishedDate) {
          dates[i].step2BDone++;
        } else if (p.step2AFinishedDate && d.date >= p.step2AFinishedDate) {
          dates[i].step2ADone++;
        } else if (p.validationFinishedDate && d.date >= p.validationFinishedDate) {
          dates[i].validated++;
        } else {
          dates[i].notStarted++;
        }
      }
    }

    setParticipationBuckets(dates);
    setFirstDate(firstDate);
    setLastDate(lastDate);
  }, [participations]);

  return (
    <>
      <Typography variant="h6">Participations Overview</Typography>
      <AreaChart
        width={1000}
        height={400}
        data={participationBuckets}
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
          dataKey="step2BDone"
          stackId="1"
          stroke="#ffa600"
          fill="#ffa600"
          name="Finished step 2B"
        />
        <Area
          type="monotone"
          dataKey="step2ADone"
          stackId="1"
          stroke="#ff6e54"
          fill="#ff6e54"
          name="Finished step 2A"
        />
        <Area type="monotone" dataKey="validated" stackId="1" stroke="#955196" fill="#955196" name="Validated" />
        <Area type="monotone" dataKey="notStarted" stackId="1" stroke="#003f5c" fill="#003f5c" name="Not registered" />
      </AreaChart>
    </>
  );
}
