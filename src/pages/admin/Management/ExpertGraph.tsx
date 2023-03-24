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
  firstLook: number;
  firstValidation: number;
  validationFinished: number;
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
                % Brave Experten:
              </Typography>
            </td>
            <td>
              <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "right", pl: 2, pt: 2 }}>
                {Math.round((1000 * payload[0].value) / payload.reduce((tot, p) => tot + p.value, 0)) / 10}%
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
    const dates = [];

    do {
      dates.push({
        date: currentDate,
        invited: 0,
        registered: 0,
        firstLook: 0,
        firstValidation: 0,
        validationFinished: 0,
      });

      currentDate = addDays(new Date(currentDate), 1).getTime();
    } while (currentDate <= lastDate);

    for (let e of Object.values(experts)) {
      for (let i = 0; i < dates.length; i++) {
        const d = dates[i];

        if (
          e.every((p) => p.cr4de_validation_finished_on && new Date(p.cr4de_validation_finished_on).getTime() <= d.date)
        ) {
          dates[i].validationFinished++;
        } else if (
          e.some((p) => p.cr4de_validation_finished_on && new Date(p.cr4de_validation_finished_on).getTime() <= d.date)
        ) {
          dates[i].firstValidation++;
        } else if (
          e.some(
            (p) =>
              p.cr4de_risk_file?.cr4de_validation_silent_procedure_until &&
              addDays(new Date(p.cr4de_risk_file.cr4de_validation_silent_procedure_until), -14).getTime() <= d.date
          )
        ) {
          dates[i].firstLook++;
        } else if (
          e.some(
            (p) =>
              p.cr4de_contact.msdyn_portaltermsagreementdate &&
              new Date(p.cr4de_contact.msdyn_portaltermsagreementdate).getTime() <= d.date
          )
        ) {
          dates[i].registered++;
        } else if (
          e.some((p) =>
            p.cr4de_contact?.invitations?.some((i) => new Date(i.cr4de_laatstverzonden).getTime() <= d.date)
          )
        ) {
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
          dataKey="validationFinished"
          stackId="1"
          stroke="#ffa600"
          fill="#ffa600"
          name="Finished validating all risk files"
        />
        <Area
          type="monotone"
          dataKey="firstValidation"
          stackId="1"
          stroke="#ff6e54"
          fill="#ff6e54"
          name="Finished validating first risk file"
        />
        <Area
          type="monotone"
          dataKey="firstLook"
          stackId="1"
          stroke="#dd5182"
          fill="#dd5182"
          name="First look at a risk file"
        />
        <Area type="monotone" dataKey="registered" stackId="1" stroke="#955196" fill="#955196" name="Registered" />
        <Area type="monotone" dataKey="invited" stackId="1" stroke="#003f5c" fill="#003f5c" name="Invitation sent" />
      </AreaChart>
    </>
  );
}
