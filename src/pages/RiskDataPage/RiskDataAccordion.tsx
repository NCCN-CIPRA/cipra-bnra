import {
  AccordionProps,
  AccordionSummaryProps,
  Box,
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  styled,
} from "@mui/material";
import { ReactNode, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  // "&:not(:last-child)": {
  //   borderBottom: 0,
  // },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary {...props} />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper": {
    transform: "rotate(-90deg)",
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "none",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(() => ({
  padding: 0,
  // borderBottom: "1px solid rgba(0, 0, 0, .125)",
}));

export default function RiskDataAccordion({
  title,
  initialOpen = false,
  children,
}: {
  title: ReactNode;
  initialOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(initialOpen);

  return (
    <Accordion expanded={open} TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        onClick={() => setOpen(!open)}
      >
        <Box sx={{ flex: 1 }}>{title}</Box>
        {/* {user.roles.analist &&
          discussionRequired === DiscussionRequired.REQUIRED && (
            <Tooltip title="The input received for this section was divergent and may require further discussion">
              <ErrorIcon color="warning" />
            </Tooltip>
          )}
        {user.roles.analist &&
          discussionRequired === DiscussionRequired.PREFERRED && (
            <Tooltip title="The input received for this section was divergent and may require further discussion">
              <ErrorIcon color="info" />
            </Tooltip>
          )}
        {user.roles.analist &&
          discussionRequired === DiscussionRequired.RESOLVED && (
            <Tooltip title="The input received for this section was divergent and may require further discussion">
              <CheckCircleIcon color="success" />
            </Tooltip>
          )} */}
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
