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

export const Ha = {
  prefix: "Ha",
  title: ["learning.impact.ha.title", "Ha - Fatalities"],
  unit: ["learning.impact.ha.footer", "Unit: number of people deceased"],
  intervals: [
    ["learning.impact.ha.0", "No impact"],
    ["learning.impact.ha.1", "< 10"],
    ["learning.impact.ha.2", "11 – 100"],
    ["learning.impact.ha.3", "101 – 1 000"],
    ["learning.impact.ha.4", "1 001 – 10 000"],
    ["learning.impact.ha.5", "> 10 000"],
  ],
};

export const Hb = {
  prefix: "Hb",
  title: ["learning.impact.hb.title", "Hb - Injured / sick people"],
  unit: ["learning.impact.hb.footer", "Unit: number of sick/injured people"],
  intervals: [
    ["learning.impact.hb.0", "No impact"],
    ["learning.impact.hb.1", "< 100"],
    ["learning.impact.hb.2", "100 – 1 000"],
    ["learning.impact.hb.3", "1 001 – 10 000"],
    ["learning.impact.hb.4", "10 001 – 100 000"],
    ["learning.impact.hb.5", "> 100 000"],
  ],
};

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

export const HaTable = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="body1" paragraph>
        <Trans i18nKey="learning.impact.ha.introduction">
          The damage indicator Ha relates to all people whose deaths can be
          directly attributed to the event.
        </Trans>
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 6 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.ha.0.title">Ha0</Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.ha.1.title">Ha1</Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.ha.2.title">Ha2</Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.ha.3.title">Ha3</Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.ha.4.title">Ha4</Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.ha.5.title">Ha5</Trans>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{t("learning.impact.ha.0", "No impact")}</TableCell>
              <TableCell>{t("learning.impact.ha.1", "< 10")}</TableCell>
              <TableCell>{t("learning.impact.ha.2", "11 – 100")}</TableCell>
              <TableCell>{t("learning.impact.ha.3", "101 – 1 000")}</TableCell>
              <TableCell>
                {t("learning.impact.ha.4", "1 001 – 10 000")}
              </TableCell>
              <TableCell>{t("learning.impact.ha.5", "> 10 000")}</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={10}>
                <Trans i18nKey="learning.impact.ha.footer">
                  Units: number of people deceased
                </Trans>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
};
