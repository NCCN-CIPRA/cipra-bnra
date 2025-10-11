import { useOutletContext } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import { useQuery } from "@tanstack/react-query";
import useAPI, { DataTable } from "../../hooks/useAPI";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function RiskLogPage() {
  const api = useAPI();
  const { riskSnapshot: riskFile, cascades } =
    useOutletContext<RiskFilePageContext>();

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
                    {l.cr4de_change_short}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography component="span" variant="caption" sx={{ mr: 1 }}>
                    [{l.modifiedon.toLocaleDateString()} -{" "}
                    {l.modifiedon.toLocaleTimeString()}]
                  </Typography>
                  <Typography component="span" variant="subtitle1">
                    <b>{l.cr4de_changed_by_email}</b> changed:{" "}
                  </Typography>

                  <pre>{JSON.stringify(JSON.parse(l.cr4de_diff), null, 2)}</pre>
                </AccordionDetails>
              </Accordion>
            ))}
      </Container>
    </Stack>
  );
}
