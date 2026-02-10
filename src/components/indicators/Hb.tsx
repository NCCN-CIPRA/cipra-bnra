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

export const Hb = {
  prefix: "Hb",
  category: "Human",
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

export const HbTable = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="body1" paragraph>
        <Trans i18nKey="learning.impact.hb.introduction.1">
          The Hb indicator includes the number of people affected by injuries or
          diseases that can be directly attributed to the event. The indicator
          takes into account physical and mental illnesses or injuries connected
          to the hazard.
        </Trans>
      </Typography>
      <Typography variant="body1" paragraph>
        <Trans i18nKey="learning.impact.hb.introduction.2">
          The basic units for this indicator are all people who suffer an
          injury, illness (incl. due to endocrine disruption) as a result of the
          event. The three levels of severity outlined below should be assessed
          accordingly. Differing degrees of injury severity are aggregated using
          weighting factors.
        </Trans>
      </Typography>
      <Typography variant="body1" paragraph>
        <Trans i18nKey="learning.impact.hb.introduction.3">
          Individuals who succumb to their injuries or illness are counted not
          under this indicator, but under Ha – Fatalities. Individuals requiring
          one-time emergency psychological care but who do not suffer from an
          underlying psychological illness are covered by indicator Hc – People
          in need of assistance. Individuals suffering from psychological trauma
          (e.g. post-traumatic stress disorder) resulting in impingement upon or
          unduly restricting their daily life are covered by indicator Sb -
          Diminished public order and domestic security.
        </Trans>
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 6 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.0.title">Hb0</Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.1.title">Hb1</Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.2.title">Hb2</Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.3.title">Hb3</Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.4.title">Hb4</Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.5.title">Hb5</Trans>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{t("learning.impact.hb.0", "No impact")}</TableCell>
              <TableCell>{t("learning.impact.hb.1", "< 100")}</TableCell>
              <TableCell>{t("learning.impact.hb.2", "100 – 1 000")}</TableCell>
              <TableCell>
                {t("learning.impact.hb.3", "1 001 – 10 000")}
              </TableCell>
              <TableCell>
                {t("learning.impact.hb.4", "10 001 – 100 000")}
              </TableCell>
              <TableCell>{t("learning.impact.hb.5", "> 100 000")}</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={10}>
                <Trans i18nKey="learning.impact.hb.footer">
                  Unit: number of sick/injured people
                </Trans>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <TableContainer component={Paper} sx={{ mb: 6 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.level">Level</Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.injury">Injury</Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.illness">Illness</Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.factor">
                  Weighting factor
                </Trans>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.level.1">Severe</Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.injury.1">
                  Hospital stay of at least 7 days
                </Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.illness.1">
                  Chronic illness requiring medical treatment
                </Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.factor.1">1</Trans>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.level.2">Moderate</Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.injury.2">
                  Hospital stay of 1–6 days
                </Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.illness.2">
                  Severe, persistent illness requiring medical treatment; full
                  recovery
                </Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.factor.2">0.1</Trans>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.level.3">Minor</Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.injury.3">
                  No permanent physical harm; medical attention, but no hospital
                  stay
                </Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.illness.3">
                  Minor illness requiring medical treatment; full recovery
                </Trans>
              </TableCell>
              <TableCell sx={{ width: "16.6%" }}>
                <Trans i18nKey="learning.impact.hb.factor.3">0.003</Trans>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={10}>
                <Trans i18nKey="learning.impact.hb.level.footer">
                  Injury and illness weighted according to their degree of
                  severity
                </Trans>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
};
