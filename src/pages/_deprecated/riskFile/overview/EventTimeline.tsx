import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import HotelIcon from "@mui/icons-material/Hotel";
import RepeatIcon from "@mui/icons-material/Repeat";
import { Card, Typography, Stack } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import { RiskAnalysisResults, RiskCalculation } from "../../../types/dataverse/DVAnalysisRun";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import { useEffect, useState } from "react";
import { addDays } from "../../../functions/days";
import { DVContact } from "../../../types/dataverse/DVContact";

enum EventType {
  EDIT,
  INPUT,
  ANALYSIS,
  PARTICIPANT,
  PROCESS,
}

interface Event {
  type: EventType;
  time: Date;
  title: string;
  by?: DVContact;
}

const eventIcons = {
  [EventType.EDIT]: <LaptopMacIcon />,
  [EventType.INPUT]: <LaptopMacIcon />,
  [EventType.ANALYSIS]: <LaptopMacIcon />,
  [EventType.PARTICIPANT]: <LaptopMacIcon />,
  [EventType.PROCESS]: <LaptopMacIcon />,
};

export default function EventTimeline({
  riskFile,
  directAnalyses,
  cascadeAnalyses,
  calculations,
  participants,
}: {
  riskFile: DVRiskFile;
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[];
  cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[];
  calculations: RiskAnalysisResults[];
  participants: DVParticipation<DVContact>[];
}) {
  const [events, setEvents] = useState<Event[] | null>(null);

  useEffect(() => {
    const e = [];

    if (riskFile.cr4de_validation_silent_procedure_until) {
      e.push({
        type: EventType.PROCESS,
        time: addDays(new Date(riskFile.cr4de_validation_silent_procedure_until), -14),
        title: "Silence Procedure Started",
      });
      e.push({
        type: EventType.PROCESS,
        time: new Date(riskFile.cr4de_validation_silent_procedure_until),
        title: "Silence Procedure Ended",
      });
      e.push({
        type: EventType.EDIT,
        time: new Date(riskFile.modifiedon),
        title: "Risk File Edited",
      });
    }

    directAnalyses.forEach((da) => {
      e.push({
        type: EventType.INPUT,
        time: new Date(da.createdon),
        title: "Direct Analysis Started",
        by: da.cr4de_expert,
      });
      if (da.createdon !== da.modifiedon) {
        e.push({
          type: EventType.INPUT,
          time: new Date(da.modifiedon),
          title: "Direct Analysis Edited",
          by: da.cr4de_expert,
        });
      }
    });

    participants.forEach((p) => {
      if (p.createdon) {
        e.push({
          type: EventType.PARTICIPANT,
          time: new Date(p.createdon),
          title: "Participant Added",
          by: p.cr4de_contact,
        });
      }
      if (p.cr4de_validation_finished_on) {
        e.push({
          type: EventType.INPUT,
          time: new Date(p.cr4de_validation_finished_on),
          title: "Validation Finished",
          by: p.cr4de_contact,
        });
      }
      if (p.cr4de_direct_analysis_finished_on) {
        e.push({
          type: EventType.INPUT,
          time: new Date(p.cr4de_direct_analysis_finished_on),
          title: "Validation Finished",
          by: p.cr4de_contact,
        });
      }
      if (p.cr4de_cascade_analysis_finished_on) {
        e.push({
          type: EventType.INPUT,
          time: new Date(p.cr4de_cascade_analysis_finished_on),
          title: "Validation Finished",
          by: p.cr4de_contact,
        });
      }
    });

    setEvents(e.sort((a, b) => b.time.getTime() - a.time.getTime()));
  }, [riskFile, directAnalyses, cascadeAnalyses, calculations, participants]);

  return (
    <Card>
      <Timeline position="right">
        {events?.map((e) => (
          <TimelineItem>
            <TimelineOppositeContent
              sx={{ m: "auto 0", flex: 0, minWidth: 100, display: "flex", flexDirection: "column" }}
              align="right"
              color="text.secondary"
            >
              <Typography variant="subtitle2">{e.time.toLocaleDateString()}</Typography>
              <Typography variant="caption">{e.time.toLocaleTimeString()}</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot>{eventIcons[e.type]}</TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent
              sx={{ py: "12px", px: 2, display: "flex", flexDirection: "column", justifyContent: "center" }}
            >
              <Typography variant="subtitle2" component="span">
                {e.title}
              </Typography>
              {e.by && <Typography variant="caption">{e.by.emailaddress1}</Typography>}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Card>
  );
}
