import { useOutletContext, useParams } from "react-router-dom";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import NCCNLoader from "../../components/NCCNLoader";
import RiskFileTitle from "../../components/RiskFileTitle";
import useSavedState from "../../hooks/useSavedState";
import { useQuery } from "@tanstack/react-query";
import useAPI, { DataTable } from "../../hooks/useAPI";
import { DVChangeLog } from "../../types/dataverse/DVChangeLog";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type RouteParams = {
  risk_file_id: string;
};

export default function RiskLogPage() {
  const api = useAPI();

  const params = useParams() as RouteParams;
  const {
    user,
    riskSnapshot: riskFile,
    riskSummary,
    cascades,
  } = useOutletContext<RiskFilePageContext>();

  const { data: changeLogs } = useQuery({
    queryKey: [DataTable.CHANGE_LOG],
    queryFn: () => api.getChangeLogs(),
    select: (d) =>
      d
        .filter(
          (c) =>
            c.cr4de_changed_object_id === riskFile?._cr4de_risk_file_value ||
            cascades?.all.some(
              (ca) => c.cr4de_changed_object_id === ca._cr4de_risk_cascade_value
            )
        )
        .map((c) => ({
          ...c,
          modifiedon: new Date(c.modifiedon),
        })),
  });

  return (
    <Stack direction="column" sx={{ width: "100%" }}>
      <Container sx={{ mt: 2 }}>
        {changeLogs &&
          changeLogs
            .sort((a, b) => b.modifiedon.getTime() - a.modifiedon.getTime())
            .map((l) => (
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography component="span" variant="subtitle1">
                    [{l.modifiedon.toLocaleDateString()} -{" "}
                    {l.modifiedon.toLocaleTimeString()}]{" "}
                    <b>{l.cr4de_changed_by_email}</b> changed:{" "}
                    {l.cr4de_change_short}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <pre>{JSON.stringify(JSON.parse(l.cr4de_diff), null, 2)}</pre>
                </AccordionDetails>
              </Accordion>
            ))}
      </Container>
    </Stack>
  );
}
