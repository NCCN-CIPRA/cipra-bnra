import { useOutletContext } from "react-router-dom";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { BasePageContext } from "../BasePage";
import { useState } from "react";
import RiskDataAccordion from "./RiskDataAccordion";
import { Box, Link, Stack, Typography } from "@mui/material";
import CascadeSankey from "./CascadeSankey";
import TextInputBox from "../../components/TextInputBox";
import { getAverageIndirectProbability } from "../../functions/Probability";

export function CauseSection({
  riskFile,
  cascade,
}: {
  riskFile: DVRiskSnapshot;
  cascade: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown>;
}) {
  const { user } = useOutletContext<BasePageContext>();

  const [quali, setQuali] = useState<string | null>(cascade.cr4de_quali || "");

  return (
    <RiskDataAccordion
      title={
        <Stack direction="row">
          <Typography sx={{ flex: 1 }}>
            <Link
              href={`/risks/${cascade.cr4de_cause_risk._cr4de_risk_file_value}/description`}
              target="_blank"
            >
              {cascade.cr4de_cause_risk.cr4de_title}
            </Link>{" "}
            causes{" "}
            <Link
              href={`/risks/${riskFile._cr4de_risk_file_value}/description`}
              target="_blank"
            >
              {riskFile.cr4de_title}
            </Link>
          </Typography>
          <Typography variant="body1" color="warning">
            <b>
              {Math.round(
                10000 * getAverageIndirectProbability(cascade, riskFile)
              ) / 100}
              %
            </b>{" "}
            of total probabitity
          </Typography>
        </Stack>
      }
    >
      <Stack direction="column" sx={{ width: "100%" }}>
        <CascadeSankey
          cause={cascade.cr4de_cause_risk}
          effect={riskFile}
          cascade={cascade}
        />

        <Box sx={{ p: 4 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Final Consensus Results:
          </Typography>
          {user?.roles.analist ? (
            <TextInputBox
              initialValue={quali}
              setUpdatedValue={(newValue) => {
                setQuali(newValue || null);
              }}
            />
          ) : (
            <Box
              dangerouslySetInnerHTML={{
                __html: quali || "",
              }}
              sx={{
                mt: 1,
                mb: 2,
                ml: 1,
                pl: 1,
                borderLeft: "4px solid #eee",
              }}
            />
          )}
        </Box>
      </Stack>
    </RiskDataAccordion>
  );
}
