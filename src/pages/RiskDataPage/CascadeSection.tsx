import { useOutletContext } from "react-router-dom";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { BasePageContext } from "../BasePage";
import { ReactNode, useState } from "react";
import RiskDataAccordion from "./RiskDataAccordion";
import { Box, Link, Stack, Typography } from "@mui/material";
import CascadeSankey from "./CascadeSankey";
import TextInputBox from "../../components/TextInputBox";

export function CascadeSection({
  cause,
  effect,
  cascade,
  subtitle = null,
}: {
  cause: DVRiskSnapshot;
  effect: DVRiskSnapshot;
  cascade: DVCascadeSnapshot<unknown, unknown, unknown>;
  subtitle?: ReactNode;
}) {
  const { user } = useOutletContext<BasePageContext>();

  const [quali, setQuali] = useState<string | null>(cascade.cr4de_quali || "");

  // const [quali, setQuali] = useState<string | null>(
  //   cascade.cr4de_quali_cause || ""
  // );

  return (
    <RiskDataAccordion
      title={
        <Stack direction="row">
          <Typography
            sx={{
              flex: 1,
              textDecoration: cascade.cr4de_removed ? "line-through" : "none",
            }}
          >
            <Link
              href={`/risks/${cause._cr4de_risk_file_value}/description`}
              target="_blank"
            >
              {cause.cr4de_title}
            </Link>{" "}
            causes{" "}
            <Link
              href={`/risks/${effect._cr4de_risk_file_value}/description`}
              target="_blank"
            >
              {effect.cr4de_title}
            </Link>
          </Typography>
          {subtitle}
        </Stack>
      }
    >
      <Stack direction="column" sx={{ width: "100%" }}>
        <CascadeSankey cause={cause} effect={effect} cascade={cascade} />

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
