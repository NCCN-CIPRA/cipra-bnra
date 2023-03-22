import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Container,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  useTheme,
} from "@mui/material";
import { IntensityParameter } from "../../../functions/intensityParameters";
import { useState } from "react";

export default function ScenarioBox({
  title,
  color,
  scenario,
  visible,
}: {
  title: string;
  color: string;
  scenario: IntensityParameter<string>[];
  visible: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme();

  return (
    <Fade in={visible}>
      <Box
        sx={{ position: "fixed", top: 72, left: 0, width: "100%", zIndex: 1000 }}
        id="step2A-scenario-description-scroll"
      >
        <Container>
          <Accordion
            disableGutters
            elevation={4}
            expanded={!collapsed}
            onChange={(event: React.SyntheticEvent, isExpanded: boolean) => setCollapsed(!isExpanded)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon id="step2A-scenario-description-collapse" />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{ backgroundColor: `${color}66`, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
            >
              <Typography sx={{ fontWeight: "bold" }}>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <TableContainer sx={{}}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                      <TableCell sx={{ whiteSpace: "nowrap", pr: 6 }}>Parameter</TableCell>
                      <TableCell width="100%" sx={{}}>
                        Value
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {scenario.map((p) => (
                      <TableRow
                        key={p.name}
                        sx={{
                          "&:nth-of-type(even)": {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        <TableCell sx={{ maxWidth: 200, mr: 6 }}>
                          <Tooltip
                            title={
                              <Box
                                sx={{ px: 1 }}
                                dangerouslySetInnerHTML={{
                                  __html: p.description,
                                }}
                              />
                            }
                          >
                            <Box>{p.name}</Box>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{p.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Container>
      </Box>
    </Fade>
  );
}
