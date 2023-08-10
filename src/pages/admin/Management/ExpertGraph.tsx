import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis, Tooltip, TooltipProps } from "recharts";
import { addDays } from "../../../functions/days";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import {
  DVValidation,
  ValidationEditableFields,
  VALIDATION_EDITABLE_FIELDS,
} from "../../../types/dataverse/DVValidation";
import { SelectableContact, SelectableRiskFile } from "./Selectables";

interface ExpertBucket {
  date: number;
  invited: number;
  registered: number;
  validationFinished: number;
  step2AFinished: number;
  step2BFinished: number;
}

const CustomTooltip = ({ active, payload, label }: { active?: any; payload?: any[]; label?: any } = {}) => {
  if (!payload || payload.length <= 0) return <div></div>;

  const l = payload.length - 1;
  const total = payload.reduce((tot, p) => tot + p.value, 0);

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
                {total}
              </Typography>
            </td>
          </tr>
          <tr>
            <td>
              <Typography variant="body1" sx={{ pt: 2 }}>
                Registration Retention:
              </Typography>
            </td>
            <td>
              <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "right", pl: 2, pt: 2 }}>
                {Math.round((1000 * (total - payload[l].value)) / total) / 10}%
              </Typography>
            </td>
          </tr>
          <tr>
            <td>
              <Typography variant="body1" sx={{ pt: 0 }}>
                Validation Retention:
              </Typography>
            </td>
            <td>
              <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "right", pl: 2, pt: 0 }}>
                {Math.round((1000 * (total - payload[l].value - payload[l - 1].value)) / (total - payload[l].value)) /
                  10}
                %
              </Typography>
            </td>
          </tr>
          <tr>
            <td>
              <Typography variant="body1" sx={{ pt: 0 }}>
                Step 2A Retention:
              </Typography>
            </td>
            <td>
              <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "right", pl: 2, pt: 0 }}>
                {Math.round(
                  (1000 * (total - payload[l].value - payload[l - 1].value - payload[l - 2].value)) /
                    (total - payload[l].value - payload[l - 1].value)
                ) / 10}
                %
              </Typography>
            </td>
          </tr>
          <tr>
            <td>
              <Typography variant="body1" sx={{ pt: 0 }}>
                Step 2B Retention:
              </Typography>
            </td>
            <td>
              <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "right", pl: 2, pt: 0 }}>
                {Math.round(
                  (1000 *
                    (total - payload[l].value - payload[l - 1].value - payload[l - 2].value - payload[l - 3].value)) /
                    (total - payload[l].value - payload[l - 1].value - payload[l - 2].value)
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

export default function ExpertGraph({
  participations,
}: {
  participations: DVParticipation<SelectableContact, DVRiskFile, DVValidation>[];
}) {
  const [expertBuckets, setExpertBuckets] = useState<ExpertBucket[]>([]);
  const [firstDate, setFirstDate] = useState<number>(new Date(2023, 1, 12).getTime());
  const [lastDate, setLastDate] = useState<number>(addDays(new Date(), 1).getTime());

  useEffect(() => {
    const experts: { [key: string]: DVParticipation<SelectableContact, DVRiskFile, DVValidation>[] } = {};

    let firstDateCalc = firstDate;

    participations.forEach((p) => {
      if (!p._cr4de_contact_value) return;

      if (!experts[p._cr4de_contact_value]) experts[p._cr4de_contact_value] = [];

      experts[p._cr4de_contact_value].push(p);
    });

    let currentDate = firstDateCalc;
    const dates: ExpertBucket[] = [];

    do {
      dates.push({
        date: currentDate,
        invited: 0,
        registered: 0,
        validationFinished: 0,
        step2AFinished: 0,
        step2BFinished: 0,
      });

      currentDate = addDays(new Date(currentDate), 1).getTime();
    } while (currentDate <= lastDate);

    for (let e of Object.values(experts)) {
      for (let i = 0; i < dates.length; i++) {
        const d = dates[i];

        if (
          e.every(
            (p) =>
              p.cr4de_cascade_analysis_finished_on && new Date(p.cr4de_cascade_analysis_finished_on).getTime() <= d.date
          )
        ) {
          dates[i].step2BFinished++;
        } else if (
          e.every(
            (p) =>
              p.cr4de_direct_analysis_finished_on && new Date(p.cr4de_direct_analysis_finished_on).getTime() <= d.date
          )
        ) {
          dates[i].step2AFinished++;
        } else if (
          e.every((p) => p.cr4de_validation_finished_on && new Date(p.cr4de_validation_finished_on).getTime() <= d.date)
        ) {
          dates[i].validationFinished++;
        } else if (
          e.some(
            (p) =>
              p.cr4de_contact.msdyn_portaltermsagreementdate &&
              new Date(p.cr4de_contact.msdyn_portaltermsagreementdate).getTime() <= d.date
          )
        ) {
          dates[i].registered++;
        } else {
          dates[i].invited++;
        }
      }
    }

    setExpertBuckets(dates);
  }, [participations]);

  return (
    <>
      <Typography variant="h6">Expert Engagement Overview</Typography>
      <AreaChart
        width={1000}
        height={400}
        data={expertBuckets}
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
          dataKey="step2BFinished"
          stackId="1"
          stroke="#d45087"
          fill="#d45087"
          name="Finished step 2B"
        />
        <Area
          type="monotone"
          dataKey="step2AFinished"
          stackId="1"
          stroke="#a05195"
          fill="#a05195"
          name="Finished step 2A"
        />
        <Area
          type="monotone"
          dataKey="validationFinished"
          stackId="1"
          stroke="#665191"
          fill="#665191"
          name="Finished validation step"
        />
        <Area type="monotone" dataKey="registered" stackId="1" stroke="#2f4b7c" fill="#2f4b7c" name="Registered" />
        <Area type="monotone" dataKey="invited" stackId="1" stroke="#003f5c" fill="#003f5c" name="Invitation sent" />
      </AreaChart>
    </>
  );
}
