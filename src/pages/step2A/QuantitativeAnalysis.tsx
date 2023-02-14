import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { Box, Button, Paper, Fade, Stack, Typography, Drawer, Slider } from "@mui/material";
import { Trans } from "react-i18next";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useMemo } from "react";
import { Scenarios, unwrap as unwrapScenarios } from "../../functions/scenarios";
import { unwrap as unwrapParameters } from "../../functions/intensityParameters";
import { useTheme } from "@mui/material/styles";
import { DPRows, DPs } from "../learning/QuantitativeScales/P";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const DPMarks = [0, 2, 4, 6, 8].map((value, i) => ({
  value,
  label: (
    <Tooltip
      title={
        <Stack sx={{ width: 500 }}>
          {DPRows.map((r, ri) => (
            <Stack direction="row">
              <Typography variant="body2" sx={{ whiteSpace: "nowrap", mr: 1, fontWeight: "bold" }}>
                <Trans i18nKey={r} />:{" "}
              </Typography>
              <Typography variant="caption">
                <Trans i18nKey={DPs[i][ri]} />
              </Typography>
            </Stack>
          ))}
        </Stack>
      }
      PopperProps={{
        sx: {
          [`& .${tooltipClasses.tooltip}`]: {
            maxWidth: "none",
          },
        },
      }}
    >
      <Typography variant="body2">DP{i + 1}</Typography>
    </Tooltip>
  ),
}));

export default function QuantitativeAnalysis({
  riskFile,
  scenarioName,
}: {
  riskFile: DVRiskFile;
  scenarioName: keyof Scenarios;
}) {
  const theme = useTheme();

  const scenarios = useMemo(
    () =>
      unwrapScenarios(
        unwrapParameters(riskFile.cr4de_intensity_parameters),
        riskFile.cr4de_scenario_considerable,
        riskFile.cr4de_scenario_major,
        riskFile.cr4de_scenario_extreme
      ),
    [riskFile]
  );

  const scenario = scenarios[scenarioName];

  return (
    <Box>
      <Stack sx={{ mb: 4, ml: 1 }} rowGap={2}>
        <Typography variant="body2">
          <Trans i18nKey="2A.quanti.info.1">
            Explanation about filling in the quantitative analysis for the {scenarioName} scenario
          </Trans>
        </Typography>
        <Typography variant="body2">
          <Trans i18nKey="2A.quanti.info.2">The scenario under review is the following</Trans>
        </Typography>
        <TableContainer component={Paper}>
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
      </Stack>

      <Stack sx={{ mt: 4, ml: 1 }} rowGap={2}>
        <Typography variant="subtitle1">
          <Trans i18nKey="2A.quanti.dp.title">Direct Probability</Trans>
        </Typography>
        <Typography variant="body2">
          <Trans i18nKey="2A.quanti.dp.info.1">Explanation about filling in the direct probabilty value</Trans>
        </Typography>

        <Box sx={{ mx: 4, my: 2 }}>
          <Slider
            aria-label="DP"
            defaultValue={0}
            //   getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={8}
            marks={DPMarks}
          />
        </Box>
      </Stack>

      <Stack sx={{ mt: 4, ml: 1 }} rowGap={2}>
        <Typography variant="subtitle1">
          <Trans i18nKey="2A.quanti.hi.title">Human Impact</Trans>
        </Typography>
        <Typography variant="body2">
          <Trans i18nKey="2A.quanti.hi.info.1">Explanation about filling in the direct probabilty value</Trans>
        </Typography>

        <Typography variant="subtitle2">
          <Trans i18nKey="2A.quanti.ha.title">Ha - Human Casualties</Trans>
        </Typography>

        <Box sx={{ mx: 4, my: 2 }}>
          <Slider
            aria-label="Ha"
            defaultValue={0}
            //   getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={8}
            marks={DPMarks}
          />
        </Box>

        <Typography variant="subtitle2">
          <Trans i18nKey="2A.quanti.ha.title">Hb - Injured / Sick people</Trans>
        </Typography>

        <Box sx={{ mx: 4, my: 2 }}>
          <Slider
            aria-label="Hb"
            defaultValue={0}
            //   getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={8}
            marks={DPMarks}
          />
        </Box>

        <Typography variant="subtitle2">
          <Trans i18nKey="2A.quanti.ha.title">Hc - People in need of assistance</Trans>
        </Typography>

        <Box sx={{ mx: 4, my: 2 }}>
          <Slider
            aria-label="Hc"
            defaultValue={0}
            //   getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={8}
            marks={DPMarks}
          />
        </Box>
      </Stack>

      <Stack sx={{ mt: 4, ml: 1 }} rowGap={2}>
        <Typography variant="subtitle1">
          <Trans i18nKey="2A.quanti.si.title">Societal Impact</Trans>
        </Typography>
        <Typography variant="body2">
          <Trans i18nKey="2A.quanti.si.info.1">Explanation about filling in the societal impact values</Trans>
        </Typography>

        <Typography variant="subtitle2">
          <Trans i18nKey="2A.quanti.sa.title">Sa - Human Casualties</Trans>
        </Typography>

        <Box sx={{ mx: 4, my: 2 }}>
          <Slider
            aria-label="Ha"
            defaultValue={0}
            //   getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={8}
            marks={DPMarks}
          />
        </Box>

        <Typography variant="subtitle2">
          <Trans i18nKey="2A.quanti.sb.title">Sb - Injured / Sick people</Trans>
        </Typography>

        <Box sx={{ mx: 4, my: 2 }}>
          <Slider
            aria-label="Hb"
            defaultValue={0}
            //   getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={8}
            marks={DPMarks}
          />
        </Box>

        <Typography variant="subtitle2">
          <Trans i18nKey="2A.quanti.sc.title">Sc - People in need of assistance</Trans>
        </Typography>

        <Box sx={{ mx: 4, my: 2 }}>
          <Slider
            aria-label="Hc"
            defaultValue={0}
            //   getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={8}
            marks={DPMarks}
          />
        </Box>

        <Typography variant="subtitle2">
          <Trans i18nKey="2A.quanti.sd.title">Sd - People in need of assistance</Trans>
        </Typography>

        <Box sx={{ mx: 4, my: 2 }}>
          <Slider
            aria-label="Hc"
            defaultValue={0}
            //   getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={8}
            marks={DPMarks}
          />
        </Box>
      </Stack>

      <Stack sx={{ mt: 4, ml: 1 }} rowGap={2}>
        <Typography variant="subtitle1">
          <Trans i18nKey="2A.quanti.ei.title">Environmental Impact</Trans>
        </Typography>
        <Typography variant="body2">
          <Trans i18nKey="2A.quanti.ei.info.1">Explanation about filling in the environmental impact values</Trans>
        </Typography>

        <Typography variant="subtitle2">
          <Trans i18nKey="2A.quanti.ea.title">Ea - Human Casualties</Trans>
        </Typography>

        <Box sx={{ mx: 4, my: 2 }}>
          <Slider
            aria-label="Ha"
            defaultValue={0}
            //   getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={8}
            marks={DPMarks}
          />
        </Box>
      </Stack>

      <Stack sx={{ mt: 4, ml: 1 }} rowGap={2}>
        <Typography variant="subtitle1">
          <Trans i18nKey="2A.quanti.fi.title">Financial Impact</Trans>
        </Typography>
        <Typography variant="body2">
          <Trans i18nKey="2A.quanti.fi.info.1">Explanation about filling in the financial impact values</Trans>
        </Typography>

        <Typography variant="subtitle2">
          <Trans i18nKey="2A.quanti.fa.title">Fa - Human Casualties</Trans>
        </Typography>

        <Box sx={{ mx: 4, my: 2 }}>
          <Slider
            aria-label="Ha"
            defaultValue={0}
            //   getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={8}
            marks={DPMarks}
          />
        </Box>

        <Typography variant="subtitle2">
          <Trans i18nKey="2A.quanti.Fb.title">Fb - Injured / Sick people</Trans>
        </Typography>

        <Box sx={{ mx: 4, my: 2 }}>
          <Slider
            aria-label="Hb"
            defaultValue={0}
            //   getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={8}
            marks={DPMarks}
          />
        </Box>
      </Stack>

      {/* <Stack sx={{ mt: 4, ml: 1 }} rowGap={2}>
        <Typography variant="subtitle1">
          <Trans i18nKey="2A.quanti.cc.title">Effect of climate change</Trans>
        </Typography>
        <Typography variant="body2">
          <Trans i18nKey="2A.quanti.cc.info.1">
            Explanation about filling in the adjusted direct probability value
          </Trans>
        </Typography>

        <Box sx={{ mx: 4, my: 2 }}>
          <Slider
            aria-label="DP"
            defaultValue={0}
            //   getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={8}
            marks={DPMarks}
          />
        </Box>
      </Stack> */}
    </Box>
  );
}
