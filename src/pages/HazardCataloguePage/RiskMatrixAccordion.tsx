import { Accordion, AccordionDetails, AccordionSummary, Box, CircularProgress, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { RiskPageContext } from "../BaseRisksPage";
import { useNavigate, useOutletContext } from "react-router-dom";
import RiskMatrix from "../../components/charts/RiskMatrix";

export default function RiskMatrixAccordion({}) {
  const navigate = useNavigate();
  const { riskFiles, loadAllRiskFiles, allRiskFilesLoaded, allRiskFilesLoading } = useOutletContext<RiskPageContext>();
  const [expanded, setExpanded] = useState<boolean>(allRiskFilesLoaded);
  const [loading, setLoading] = useState(true);

  const toggleExpand = () => {
    if (!expanded) {
      setExpanded(true);
      if (!allRiskFilesLoaded && !allRiskFilesLoading) {
        loadAllRiskFiles();
      }
    } else {
      setExpanded(false);
    }
  };

  return (
    <Box sx={{ mt: 2, mb: 3 }}>
      <Accordion expanded={expanded} onChange={toggleExpand}>
        <AccordionSummary sx={{ textAlign: "center" }} expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2" sx={{ opacity: expanded ? 0 : 1 }}>
            Risk Matrix
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {allRiskFilesLoaded ? (
            <Box sx={{ width: "100%", height: 750, mb: 4, pl: 2, mt: -4, pr: 2 }}>
              <RiskMatrix
                calculations={Object.values(riskFiles)
                  .filter((rf) => rf.cr4de_latest_calculation && rf.cr4de_latest_calculation.cr4de_results)
                  .map((rf) => rf.cr4de_latest_calculation!.cr4de_results!)}
                setSelectedNodeId={(id) => navigate(`/risks/${id}`)}
              />
            </Box>
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress sx={{ mb: 3 }} />
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
