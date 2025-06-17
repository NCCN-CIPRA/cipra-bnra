/* eslint-disable react-refresh/only-export-components */
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Trans, useTranslation } from "react-i18next";

export const Hc = {
  prefix: "Hc",
  title: ["learning.impact.hc.title", "Hc - People in need of assistance"],
  unit: [
    "learning.impact.hc.footer",
    "Unit: person days (number of people multiplied by days in need of assistance)",
  ],
  intervals: [
    ["learning.impact.hc.0", "No impact"],
    ["learning.impact.hc.1", "< 200 000"],
    ["learning.impact.hc.2", "200 001 – 2 000 000"],
    ["learning.impact.hc.3", "2 000 001 – 20 000 000"],
    ["learning.impact.hc.4", "20 000 001 – 200 000 000"],
    ["learning.impact.hc.5", "> 200 000 000"],
  ],
};

export const HcTable = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="body1" paragraph>
        <Trans i18nKey="learning.impact.hc.introduction.1">
          Indicator Hc covers people who must be evacuated, temporarily housed,
          and/or otherwise cared for before, during, and after an event. This
          may involve, for instance, housing in emergency shelters; supplying
          food to people in locations cut off from the outside world; or giving
          emergency psychological assistance to people who are not, however,
          affected by actual mental illnesses. The duration of assistance
          required by the directly affected persons is registered. Effects such
          as supply shortfalls and disruptions for large parts of the population
          are counted not under Hc, but under the indicator Sa – Supply
          shortfalls and service disruptions.
        </Trans>
      </Typography>
      <Typography variant="body1" paragraph>
        <Trans i18nKey="learning.impact.hc.introduction.2">
          The unit to quantify the need for assistance is the person day. This
          is determined by multiplying the number of people requiring assistance
          with the duration of impairment in days . The effective duration of
          assistance required by all individuals is added up. The minimum unit
          per person is one day. The duration of the requirement for assistance
          is counted, rather than the period in which assistance services are
          provided. For instance, one would count the number of days during
          which the total number of traumatised individuals require emergency
          psychological assistance, rather than the duration for which the
          members of care-providing organisations have been deployed.
        </Trans>
      </Typography>
      <Typography variant="body1" paragraph>
        <Trans i18nKey="learning.impact.hc.introduction.3">
          The cost of providing support services is accounted for in the
          indicator Fa – Financial asset damages.
        </Trans>
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 6 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hc.0.title">Hc0</Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hc.1.title">Hc1</Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hc.2.title">Hc2</Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hc.3.title">Hc3</Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hc.4.title">Hc4</Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hc.5.title">Hc5</Trans>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{t("learning.impact.hc.0", "No impact")}</TableCell>
              <TableCell>{t("learning.impact.hc.1", "< 200 000")}</TableCell>
              <TableCell>
                {t("learning.impact.hc.2", "200 001 – 2 000 000")}
              </TableCell>
              <TableCell>
                {t("learning.impact.hc.3", "2 000 001 – 20 000 000")}
              </TableCell>
              <TableCell>
                {t("learning.impact.hc.4", "20 000 001 – 200 000 000")}
              </TableCell>
              <TableCell>
                {t("learning.impact.hc.5", "> 200 000 000")}
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={10}>
                <Trans i18nKey="learning.impact.hc.footer">
                  Unit: person days (number of people multiplied by days in need
                  of assistance)
                </Trans>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
};
