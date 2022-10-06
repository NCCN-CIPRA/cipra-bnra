import { DVValidation } from "../../types/dataverse/DVValidation";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";

import { useNavigate } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import RiskFileList from "../../components/RiskFileList";
import { DataTable } from "../../hooks/useAPI";
import useRecords from "../../hooks/useRecords";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Trans, useTranslation } from "react-i18next";

export default function ValidationIntroPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Get all validation records from O365 dataverse
  //  Dataverse security only return records that belong to the currently logged in user, i.e. the user in the "expert" column
  const { data: validations } = useRecords<DVValidation<DVRiskFile>>({
    table: DataTable.RISK_FILE,
    query: "$expand=cr4de_RiskFile",
  });

  usePageTitle(t("validation.appFullName"));
  useBreadcrumbs([
    { name: t("bnra.shortName"), url: "/" },
    { name: t("validation.appName"), url: "/validation" },
  ]);

  return (
    <>
      <Container>
        <Box mt={5}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="validation.welcomeMessage.part1">
              Welcome to the <b>BNRA 2023 - 2026 Risk File Validation Application</b>, the first step in the risk
              analysis process!
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="validation.welcomeMessage.part2">
              In this phase we present to you a first look at the hazards and their corresponding risk files for which
              you have volunteered to participate as expert. Each of these hazards should be visible in the list below.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="validation.welcomeMessage.part3">
              Because the risk files will form the basis for all of the following analytical phases, it is of utmost
              importance that the information they hold is correct and complete. A preliminary risk file has been
              written out by NCCN analists, but your topical expertise is required to validate the compiled information.
              Therefore,{" "}
              <b>
                we kindly ask you to read the different sections for each of the hazards in the list and provide any
                corrections, feedback or comments in the fields provided
              </b>
              . All input may be provided in the language you feel most comfortable with.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="validation.welcomeMessage.part4">
              If you believe an error has been made with regards to the hazards assigned to you, please get in touch
              with your contact person at NCCN, or email us at{" "}
              <a href="mailto:dist.nccn.bnra@nccn.fgov.be">dist.nccn.bnra@nccn.fgov.be</a>
            </Trans>
          </Typography>
        </Box>

        <RiskFileList
          riskFiles={validations && validations.map((v: any) => v.cr4de_RiskFile)}
          onClick={async (riskFile) => {
            if (!validations) return;

            navigate(
              `/validation/${
                validations.find((v) => v.cr4de_RiskFile.cr4de_hazard_id === riskFile.cr4de_hazard_id)
                  ?.cr4de_bnravalidationid
              }`
            );
          }}
        />
      </Container>
    </>
  );
}
