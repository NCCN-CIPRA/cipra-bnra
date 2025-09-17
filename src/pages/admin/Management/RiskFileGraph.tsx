import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
  consensusStarted: number;
  finished: number;
}

// const CustomTooltip = ({
//   payload,
//   label,
// }: TooltipProps<ValueType, NameType>) => {
//   if (!payload || payload.length <= 0) return <div></div>;

//   return (
//     <Box
//       sx={{ borderRadius: 4, backgroundColor: "rgba(255,255,255,.9)", p: 2 }}
//     >
//       <Typography variant="subtitle2">
//         {new Date(label).toISOString().slice(0, 10)}
//       </Typography>
//       <table>
//         <tbody>
//           {
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             payload.map((p: any) => (
//               <tr key={p.name}>
//                 <td>
//                   <Typography variant="body1" sx={{ color: p.fill }}>
//                     {p.name}:
//                   </Typography>
//                 </td>
//                 <td>
//                   <Typography
//                     variant="body1"
//                     sx={{ fontWeight: "bold", textAlign: "right", pl: 2 }}
//                   >
//                     {p.value}
//                   </Typography>
//                 </td>
//               </tr>
//             ))
//           }
//           <tr>
//             <td>
//               <Typography variant="body1" sx={{ pt: 2 }}>
//                 Total:
//               </Typography>
//             </td>
//             <td>
//               <Typography
//                 variant="body1"
//                 sx={{ fontWeight: "bold", textAlign: "right", pl: 2, pt: 2 }}
//               >
//                 {/* @ts-expect-error value */}
//                 {payload.reduce((tot, p) => tot + p.value, 0)}
//               </Typography>
//             </td>
//           </tr>
//           <tr>
//             <td>
//               <Typography variant="body1" sx={{ pt: 2 }}>
//                 % Risk files finished:
//               </Typography>
//             </td>
//             <td>
//               <Typography
//                 variant="body1"
//                 sx={{ fontWeight: "bold", textAlign: "right", pl: 2, pt: 2 }}
//               >
//                 {Math.round(
//                   (1000 * payload[0].value) /
//                     // @ts-expect-error value
//                     payload.reduce((tot, p) => tot + p.value, 0)
//                 ) / 10}
//                 %
//               </Typography>
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </Box>
//   );
// };

export default function RiskFileGraph({
  participations,
}: {
  participations: DVParticipation<
    SelectableContact,
    DVRiskFile,
    DVValidation
  >[];
}) {
  const [riskFileBuckets, setRiskFileBuckets] = useState<RFBucket[]>([]);
  const [firstDate, setFirstDate] = useState<number>(Date.now());
  const [lastDate] = useState<number>(addDays(new Date(), 1).getTime());

  useEffect(() => {
    const riskFiles: {
      [key: string]: DVParticipation<
        SelectableContact,
        DVRiskFile,
        DVValidation
      >[];
    } = {};

    let firstDateCalc = firstDate;

    participations.forEach((p) => {
      if (!p._cr4de_risk_file_value) return;

      if (!riskFiles[p._cr4de_risk_file_value])
        riskFiles[p._cr4de_risk_file_value] = [];

      riskFiles[p._cr4de_risk_file_value].push(p);

      if (
        p.cr4de_validation?.createdon &&
        new Date(p.cr4de_validation.createdon).getTime() < firstDateCalc
      ) {
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
        consensusStarted: 0,
        finished: 0,
      });

      currentDate = addDays(new Date(currentDate), 1).getTime();
    } while (currentDate <= lastDate);

    for (const participations of Object.values(riskFiles)) {
      for (let i = 0; i < dates.length; i++) {
        const d = dates[i];

        if (
          participations.some(
            (p) =>
              p.cr4de_risk_file?.cr4de_consensus_date &&
              new Date(p.cr4de_risk_file?.cr4de_consensus_date).getTime() <
                d.date
          )
        ) {
          dates[i].finished++;
        } else if (
          participations.some(
            (p) =>
              p.cr4de_risk_file?.cr4de_consensus_date &&
              addDays(
                new Date(p.cr4de_risk_file?.cr4de_consensus_date),
                -14
              ).getTime() <= d.date
          )
        ) {
          dates[i].consensusStarted++;
        } else if (
          participations.filter(
            (p) =>
              p.cr4de_cascade_analysis_finished_on &&
              new Date(p.cr4de_cascade_analysis_finished_on).getTime() <= d.date
          ).length >= 2
        ) {
          dates[i].step2BStarted++;
        } else if (
          participations.filter(
            (p) =>
              p.cr4de_direct_analysis_finished_on &&
              new Date(p.cr4de_direct_analysis_finished_on).getTime() <= d.date
          ).length >= 2
        ) {
          dates[i].step2AStarted++;
        } else if (
          participations.some(
            (p) =>
              p.cr4de_risk_file?.cr4de_validation_silent_procedure_until !=
                null &&
              addDays(
                new Date(
                  p.cr4de_risk_file?.cr4de_validation_silent_procedure_until
                ),
                -14
              ).getTime() <= d.date
          )
        ) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {/* <Tooltip content={<CustomTooltip />} /> */}
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
          dataKey="finished"
          stackId="1"
          stroke="#ff7c43"
          fill="#ff7c43"
          name="Process finished"
        />
        <Area
          type="monotone"
          dataKey="consensusStarted"
          stackId="1"
          stroke="#f95d6a"
          fill="#f95d6a"
          name="Consensus step started"
        />
        <Area
          type="monotone"
          dataKey="step2BStarted"
          stackId="1"
          stroke="#d45087"
          fill="#d45087"
          name="Step 2B finished"
        />
        <Area
          type="monotone"
          dataKey="step2AStarted"
          stackId="1"
          stroke="#a05195"
          fill="#a05195"
          name="Step 2A finished"
        />
        <Area
          type="monotone"
          dataKey="silenceProcedureStarted"
          stackId="1"
          stroke="#665191"
          fill="#665191"
          name="Validation step finished"
        />
        <Area
          type="monotone"
          dataKey="started"
          stackId="1"
          stroke="#2f4b7c"
          fill="#2f4b7c"
          name="Process started"
        />
      </AreaChart>
    </>
  );
}
