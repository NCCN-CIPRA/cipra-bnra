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

interface Bucket {
  date: number;
  notStarted: number;
  registered: number;
  validated: number;
}

const isValidationEmpty = (input: ValidationEditableFields) =>
  VALIDATION_EDITABLE_FIELDS.every((fieldName) => input[fieldName] === null);
const isValidationComplete = (input: ValidationEditableFields) =>
  VALIDATION_EDITABLE_FIELDS.every((fieldName) => input[fieldName] !== null);

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
        </tbody>
      </table>
    </Box>
  );
};

export default function ParticipationGraph({
  participations,
}: {
  participations: DVParticipation<SelectableContact, DVRiskFile, DVValidation>[];
}) {
  const [participationBuckets, setParticipationBuckets] = useState<Bucket[]>([]);
  const [firstDate, setFirstDate] = useState<number>(Date.now());
  const [lastDate, setLastDate] = useState<number>(Date.now());

  useEffect(() => {
    const datedPs = participations.map((p) => ({
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
        registered: 0,
        created: 0,
        modified: 0,
        completed: 0,
        validated: 0,
      });

      currentDate = addDays(new Date(currentDate), 1).getTime();
    } while (currentDate <= lastDate);

    for (let p of datedPs) {
      for (let i = 0; i < dates.length; i++) {
        const d = dates[i];

        if (p.validationFinishedDate && d.date >= p.validationFinishedDate) {
          dates[i].validated++;
        } else if (p.validationCompletedDate && d.date >= p.validationCompletedDate) {
          dates[i].completed++;
        } else if (p.validationModifiedDate && d.date >= p.validationModifiedDate) {
          if (i >= dates.length - 1) console.log(p);
          dates[i].modified++;
        } else if (p.validationCreatedDate && d.date >= p.validationCreatedDate) {
          dates[i].created++;
        } else if (p.registrationDate && d.date >= p.registrationDate) {
          dates[i].registered++;
        } else if (p.addedDate && d.date >= p.addedDate) {
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
      <Typography variant="h6">Validations Progress Overview</Typography>
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
          dataKey="validated"
          stackId="1"
          stroke="#ffa600"
          fill="#ffa600"
          name="Finished validation"
        />
        <Area
          type="monotone"
          dataKey="completed"
          stackId="1"
          stroke="#ff6e54"
          fill="#ff6e54"
          name="Filled in all fields"
        />
        <Area
          type="monotone"
          dataKey="modified"
          stackId="1"
          stroke="#dd5182"
          fill="#dd5182"
          name="Filled in at least 1 field"
        />
        <Area
          type="monotone"
          dataKey="created"
          stackId="1"
          stroke="#955196"
          fill="#955196"
          name="Looked at the risk file"
        />
        <Area type="monotone" dataKey="registered" stackId="1" stroke="#444e86" fill="#444e86" name="Registered" />
        <Area type="monotone" dataKey="notStarted" stackId="1" stroke="#003f5c" fill="#003f5c" name="Not registerd" />
      </AreaChart>
    </>
  );
}
