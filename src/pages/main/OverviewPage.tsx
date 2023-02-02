import { DVRiskFile } from "../../types/dataverse/DVRiskFile";

import { useOutletContext } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import { DataTable } from "../../hooks/useAPI";
import useRecords from "../../hooks/useRecords";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Trans, useTranslation } from "react-i18next";
import { DVParticipation } from "../../types/dataverse/DVParticipation";
import ExpertRiskFileList from "../../components/ExpertRiskFileList";
import { AuthPageContext } from "../AuthPage";

export default function OverviewPage() {
  const { t } = useTranslation();
  const { user } = useOutletContext<AuthPageContext>();

  // Get all participation records from O365 dataverse
  const { data: participations } = useRecords<DVParticipation<undefined, DVRiskFile>>({
    table: DataTable.PARTICIPATION,
    query: `$filter=_cr4de_contact_value eq ${user?.contactid} and cr4de_role eq 'expert'&$expand=cr4de_risk_file`,
  });

  usePageTitle(t("analysis.overviewTitle"));
  useBreadcrumbs([
    { name: t("bnra.shortName", "BNRA"), url: "/" },
    { name: t("analysis.overview.breadcrumbTitle", "Overview"), url: "/overview" },
  ]);

  return (
    <>
      <Container>
        <Box mt={5} mb={5}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="analysis.welcomeMessage.part1">
              Welcome to the <b>BNRA 2023 - 2026 Risk Identification and Analysis Application</b>.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="analysis.welcomeMessage.part2">
              Below you will find a list of risk files for which you have volunteered to participate as expert. Each of
              these hazards should be visible in the list below.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="analysis.welcomeMessage.part4">
              If you believe an error has been made with regards to the risk files assigned to you, please get in touch
              with your contact person at NCCN, or email us at{" "}
              <a href="mailto:cipra.bnra@nccn.fgov.be">cipra.bnra@nccn.fgov.be</a>
            </Trans>
          </Typography>
        </Box>

        <ExpertRiskFileList participations={participations} />
      </Container>
    </>
  );
}
