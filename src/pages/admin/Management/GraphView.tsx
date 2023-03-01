import { Box } from "@mui/material";
import { Tooltip } from "devextreme-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { addDays } from "../../../functions/days";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { SelectableContact, SelectableRiskFile } from "./Selectables";

interface Bucket {
  date: number;
  notStarted: number;
  registered: number;
  validated: number;
}

export default function GraphView({
  participations,
}: {
  participations: DVParticipation<SelectableContact, DVRiskFile>[];
}) {
  const [participationBuckets, setParticipationBuckets] = useState<Bucket[]>([]);

  useEffect(() => {
    const datedPs = participations.map((p) => ({
      validationDate: p.cr4de_validation_finished_on ? new Date(p.cr4de_validation_finished_on) : null,
      registrationDate: p.cr4de_contact.msdyn_portaltermsagreementdate
        ? new Date(p.cr4de_contact.msdyn_portaltermsagreementdate)
        : null,
      participation: p,
    }));

    let firstDate = new Date();
    let lastDate = new Date();
    datedPs.forEach((p) => {
      if (p.registrationDate && (firstDate === null || p.registrationDate < firstDate)) firstDate = p.registrationDate;
      if (p.validationDate && (lastDate === null || p.validationDate > lastDate)) lastDate = p.validationDate;
    });

    let currentDate = firstDate;
    const dates = [];

    do {
      dates.push({
        date: currentDate.getTime(),
        notStarted: participations.length,
        registered: 0,
        validated: 0,
      });

      currentDate = addDays(currentDate, 1);
    } while (currentDate < lastDate);

    for (let p of datedPs) {
      for (let i = 0; i < dates.length; i++) {
        const d = dates[i];
        if (p.registrationDate && d.date >= p.registrationDate.getTime()) {
          dates[i].notStarted--;
          dates[i].registered++;
        }
        if (p.validationDate && d.date >= p.validationDate.getTime()) {
          dates[i].validated++;
        }
      }
    }

    setParticipationBuckets(dates);
  }, [participations]);

  return (
    <Box sx={{ width: 800, height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={participationBuckets}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            domain={["auto", "auto"]}
            dataKey="date"
            tickFormatter={(d) => new Date(d).toISOString().slice(0, 10)}
            type="number"
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="validated" stackId="1" stroke="#8884d8" fill="#8884d8" />
          <Area type="monotone" dataKey="registered" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
          <Area type="monotone" dataKey="notStarted" stackId="1" stroke="#ffc658" fill="#ffc658" />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
