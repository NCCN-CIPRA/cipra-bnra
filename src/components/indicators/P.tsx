/* eslint-disable react-refresh/only-export-components */
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Trans, useTranslation } from "react-i18next";

export const DPRows = [
  "learning.probability.returnPeriod",
  "learning.probability.3yearLikelihood",
  "learning.probability.10yearLikelihood",
  "learning.probability.qualitative",
];

export const DP1 = [
  "learning.probability.rp.1",
  "learning.probability.3yl.1",
  "learning.probability.10yl.1",
  "learning.probability.q.1",
];
export const DP2 = [
  "learning.probability.rp.2",
  "learning.probability.3yl.2",
  "learning.probability.10yl.2",
  "learning.probability.q.2",
];
export const DP3 = [
  "learning.probability.rp.3",
  "learning.probability.3yl.3",
  "learning.probability.10yl.3",
  "learning.probability.q.3",
];
export const DP4 = [
  "learning.probability.rp.4",
  "learning.probability.3yl.4",
  "learning.probability.10yl.4",
  "learning.probability.q.4",
];
export const DP5 = [
  "learning.probability.rp.5",
  "learning.probability.3yl.5",
  "learning.probability.10yl.5",
  "learning.probability.q.5",
];

export const DPs = [DP1, DP2, DP3, DP4, DP5];

export const PTable = () => {
  const { t } = useTranslation();

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" paragraph>
          <Trans i18nKey="learning.probability.text.introduction.1">
            For estimating the probability of a risk scenario, the following 3
            measures are proposed:
          </Trans>
        </Typography>
        <ul>
          <li>
            <Typography variant="body2">
              <Trans i18nKey="learning.probability.text.introduction.2">
                The return period, i.e. the timespan expressed in years during
                which statistical computations or estimates expect a given event
                to occur at least once on average. It is expressed as occurring
                once every x years.
              </Trans>
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <Trans i18nKey="learning.probability.text.introduction.3">
                The 3 year likelihood, i.e. the probability of a given event
                occurring at least once during the next 3 years. Always takes a
                value between 0 and 100%.
              </Trans>
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <Trans i18nKey="learning.probability.text.introduction.4">
                The 10 year likelihood, i.e. the probability of a given event
                occurring at least once during the next 10 years. Always takes a
                value between 0 and 100%.
              </Trans>
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <Trans i18nKey="learning.probability.text.introduction.5">
                A qualitative description
              </Trans>
            </Typography>
          </li>
        </ul>
        <Typography variant="body1" paragraph>
          <Trans i18nKey="learning.probability.text.introduction.6">
            All these measures are essentially equivalent; they just use
            different scales. The assessment is based on five probability
            classes shown in the table below.
          </Trans>
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Trans i18nKey="learning.scales.classCode">Class Code</Trans>
              </TableCell>
              <TableCell>
                <Trans i18nKey="learning.probability.returnPeriod">
                  Return Period
                </Trans>
              </TableCell>
              <TableCell>
                <Trans i18nKey="learning.probability.3yearLikelihood">
                  3 Year Likelihood
                </Trans>
              </TableCell>
              <TableCell>
                <Trans i18nKey="learning.probability.10yearLikelihood">
                  10 Year Likelihood
                </Trans>
              </TableCell>
              <TableCell>
                <Trans i18nKey="learning.probability.qualitative">
                  Qualitative Description
                </Trans>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>DP5</TableCell>
              {DP5.map((c, i) => (
                <TableCell key={i}>{t(c)}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell>DP4</TableCell>
              {DP4.map((c, i) => (
                <TableCell key={i}>{t(c)}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell>DP3</TableCell>
              {DP3.map((c, i) => (
                <TableCell key={i}>{t(c)}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell>DP2</TableCell>
              {DP2.map((c, i) => (
                <TableCell key={i}>{t(c)}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell>DP1</TableCell>
              {DP1.map((c, i) => (
                <TableCell key={i}>{t(c)}</TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
