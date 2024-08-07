import { useState, useEffect, useRef, useMemo } from "react";
import {
  Container,
  Typography,
  Card,
  CardActions,
  CardContent,
  Button,
  Box,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Stack,
  LinearProgress,
  Accordion,
  CardHeader,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useRecords from "../../hooks/useRecords";
import useAPI, { DataTable } from "../../hooks/useAPI";
import { DVRiskFile, RISK_FILE_QUANTI_FIELDS, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { DVRiskCascade, RISK_CASCADE_QUANTI_FIELDS } from "../../types/dataverse/DVRiskCascade";
import { DIRECT_ANALYSIS_QUANTI_FIELDS, DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { CASCADE_ANALYSIS_QUANTI_FIELDS, DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";
import { CascadeCalculation, DVAnalysisRun, RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { v4 as uuid } from "uuid";
import { DVParticipation } from "../../types/dataverse/DVParticipation";
import { DVContact } from "../../types/dataverse/DVContact";
import calculateMetrics from "../../functions/analysis/calculateMetrics";
import runAnalysis from "../../functions/analysis/runAnalysis";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";

const replacements: string[][] = [
  ["Animal diseases (not zoonoses)", "Animal diseases excluding zoonoses"],
  ["Biohacking (e.g. CRISPR)", "Biohacking"],
  ["Icing (including ice)", "Icing"],
  ["Solar storm (Solar radiation storm)", "Solar radiation storm"],
  ["Internet of Things (IOT)-related hazards", "Internet of Things (IOT)"],
  ["Hybrid threat", "Hybrid actor"],
  ["Left-wing extremism/terrorism", "Left-wing extremist actor"],
  ["Right-wing extremism/terrorism", "Right-wing extremist actor"],
  ["Organized", "Organised"],
  ["organized", "organised"],
  ["rganization", "rganisation"],
  ["rganize", "rganise"],
  ["Religious extremism/terrorism", "Religious extremist actor"],
  ["CBRN-e", "CBRNe"],
  ["CBRN-E", "CBRNe"],
  ["CBRNE", "CBRNe"],
  ["Possible explanation for the", "Possible explanations for the"],
  ["a extreme", "an extreme"],
  ["A extreme", "an extreme"],
  ["an considerable", "a considerable"],
  ["an major", "a major"],
  ["This means that it represent the highest", "This means that it represents the highest"],
  [". No underlying cause", '. <a href="">No underlying cause</a>'],
  [". Direct Impact", '. <a href="">Direct Impact</a>'],
  ["ptimization", "ptimisation"],
  ["ptimize", "ptimise"],
  ["ersonalized", "ersonalised"],
  ["ustomize", "ustomise"],
  ["nalyzing", "nalysing"],
  ["nalyze", "nalyse"],
  ["efense", "efence"],
  ["mphasizes", "mphasises"],
  ["igitalization", "igitalisation"],
  ["ecentralized", "ecentralised"],
  ["tilizing", "tilising"],
  ["A\\.I\\.", "AI"],
  ["ynchronization", "ynchronisation"],
  ["odeling", "odelling"],
  ["rioritizing", "rioritising"],
  ["eneralized", "eneralised"],
  ["ummarized", "ummarised"],
  ["haracterized", "haracterised"],
  ["apitalize", "apitalise"],
  ["evolutionize", "evolutionise"],
  ["avoring", "avouring"],
  ["udgment", "udgement"],
  ["nauthorized", "nauthorised"],
  ["raveling", "ravelling"],
  ["overnement", "overnment"],
  ["zation", "sation"],
];

const rfFields: (keyof DVRiskFile)[] = [
  "cr4de_definition",
  "cr4de_intensity_parameters",
  "cr4de_mrs_summary",
  "cr4de_mrs_scenario",
  "cr4de_mrs_disclaimer",
  "cr4de_mrs_probability",
  "cr4de_mrs_impact_h",
  "cr4de_mrs_impact_s",
  "cr4de_mrs_impact_e",
  "cr4de_mrs_impact_f",
  "cr4de_mrs_actions",
  "cr4de_mrs_mm_impact",
  "cr4de_mrs_cc",
];

interface Correction {
  riskFile: DVRiskFile;
  fields: {
    field: keyof DVRiskFile;
    replacements: {
      match: string;
      replaceWith: string;
      indices: number[];
    }[];
  }[];
}

const last = (arr: any[]) => arr.slice(-1)[0];

export default function CorrectionsPage() {
  const api = useAPI();
  const [calculationProgress, setCalculationProgress] = useState<number | null>(null);
  const [additionalErrors, setAdditionalErrors] = useState<string>("");
  const [additionalCorrections, setAdditionalCorrections] = useState<string>("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [corrections, setCorrections] = useState<Correction[] | null>(null);

  const {
    data: riskFiles,
    isFetching: loadingRiskFiles,
    reloadData: reloadRiskFiles,
  } = useRecords<DVRiskFile>({
    table: DataTable.RISK_FILE,
  });

  usePageTitle("BNRA 2023 - 2026 Report Corrector");
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: "Analysis", url: "/analysis" },
    { name: "Calculator", url: "" },
  ]);

  const isLoading = loadingRiskFiles;

  const reloadData = () => {
    reloadRiskFiles();
  };

  const findCorrections = () => {
    if (!riskFiles) return [];

    const cors: Correction[] = [];
    const allReplacements = [...replacements];

    const es = additionalErrors.split("\n");
    const cs = additionalCorrections.split("\n");

    if (es.indexOf("") >= 0) {
      if (es[0] === "") {
        es.shift();
        cs.shift();
      } else {
        setInputError("Please remove empty lines from the left box");
      }
    }

    if (es.length !== cs.length) {
      setInputError("Each error line in the left box must have a corresponding correction line in the right box");
      return;
    } else {
      setInputError(null);
    }

    for (let i in es) {
      allReplacements.push([es[i], cs[i]]);
    }

    for (let rf of riskFiles) {
      for (let f of rfFields) {
        for (let r of allReplacements) {
          for (let m of (rf[f] || "").toString().matchAll(new RegExp(r[0], "g"))) {
            const i = m.index;
            console.log(m);
            if (cors.length <= 0 || last(cors).riskFile.cr4de_riskfilesid !== rf.cr4de_riskfilesid) {
              cors.push({ riskFile: rf, fields: [] });
            }

            if (last(cors).fields.length <= 0 || last(last(cors).fields).field !== f) {
              last(cors).fields.push({
                field: f,
                replacements: [],
              });
            }
            if (
              last(last(cors).fields).replacements.length <= 0 ||
              last(last(last(cors).fields).replacements).match !== r[0]
            ) {
              last(last(cors).fields).replacements.push({
                match: m[0],
                replaceWith: m[0].replace(new RegExp(r[0], "g"), r[1]),
                indices: [],
              });
            }

            last(last(last(cors).fields).replacements).indices.push(i);
          }
        }
      }
    }

    setCorrections(cors);
  };

  const saveCorrections = async () => {
    if (!corrections) return;

    setCalculationProgress(0);

    for (let i = 0; i < corrections.length; i++) {
      const rf = corrections[i];

      const fields: { [k in keyof Partial<DVRiskFile>]: string } = {};

      for (let f of rf.fields) {
        if (!rf.riskFile[f.field]) continue;

        let base = rf.riskFile[f.field] as string;

        for (let rep of f.replacements) {
          base = base.replaceAll(rep.match, rep.replaceWith);
        }

        fields[f.field] = base;
      }
      // console.log(fields);
      await api.updateRiskFile(rf.riskFile.cr4de_riskfilesid, fields);

      //   logger(`Saving calculations (${i + 1}/${results.length})`, 1);
      setCalculationProgress((100 * (i + 1)) / corrections.length);
    }

    // logger("Done");
  };

  return (
    <>
      <Container sx={{ mt: 4, pb: 8 }}>
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{}}>
            <Box
              sx={{
                mt: 1,
              }}
            >
              <Stack direction="row">
                <Stack direction="column" sx={{ flex: 1 }}>
                  <Stack direction="row">
                    <Box sx={{ width: 24, height: 32, mx: 1 }}>
                      {riskFiles && !loadingRiskFiles && <CheckIcon color="success" />}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ mt: "2px" }}>
                        Risk Files
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
            <Box sx={{ py: 2, px: 1 }}>
              <Typography variant="subtitle1">Additional corrections (1 per line)</Typography>
              <Stack direction="row" columnGap={4} sx={{ pt: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    label="Errors"
                    multiline
                    rows={4}
                    defaultValue=""
                    variant="filled"
                    sx={{ width: "100%" }}
                    value={additionalErrors}
                    onChange={(e) => setAdditionalErrors(e.target.value)}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    label="Corrections"
                    multiline
                    rows={4}
                    defaultValue=""
                    variant="filled"
                    sx={{ width: "100%" }}
                    value={additionalCorrections}
                    onChange={(e) => setAdditionalCorrections(e.target.value)}
                  />
                </Box>
              </Stack>
              {inputError && (
                <Typography variant="caption" color="red">
                  {inputError}
                </Typography>
              )}
            </Box>
            <Box sx={{ height: 8, mt: 2, mx: 1 }}>
              {calculationProgress !== null && <LinearProgress variant="determinate" value={calculationProgress} />}
            </Box>
          </CardContent>
          <CardActions>
            <Button disabled={isLoading} onClick={reloadData}>
              Reload data
            </Button>
            <Button disabled={isLoading} onClick={findCorrections}>
              Find corrections
            </Button>
            <Box sx={{ flex: 1 }} />
            <Button color="warning" disabled={corrections === null} onClick={saveCorrections}>
              Save corrections
            </Button>
          </CardActions>
        </Card>

        {corrections && (
          <Card>
            <CardHeader title={`${corrections.length} risk files need corrections`} />
            <CardContent>
              <Stack direction="column">
                {corrections.map((c) => {
                  return (
                    <>
                      <Typography variant="subtitle2">{c.riskFile.cr4de_title}</Typography>
                      <Box sx={{ pb: 2, ml: 2 }}>
                        {c.fields.map((f) => (
                          <>
                            <Typography variant="body2" sx={{ textDecoration: "underline" }}>
                              {f.field}
                            </Typography>
                            <Box sx={{ pl: 2 }}>
                              {f.replacements.map((rep) => (
                                <>
                                  {rep.indices.map((i) => (
                                    <Typography variant="body2">
                                      {(c.riskFile[f.field] as string).slice(i - 30, i)}
                                      <span
                                        style={{
                                          color: "white",
                                          backgroundColor: "red",
                                          textDecoration: "line-through",
                                        }}
                                      >
                                        {(c.riskFile[f.field] as string).slice(i, i + rep.match.length)}
                                      </span>
                                      <span style={{ color: "white", backgroundColor: "green" }}>
                                        {rep.replaceWith}
                                      </span>
                                      {(c.riskFile[f.field] as string).slice(
                                        i + rep.match.length,
                                        i + rep.match.length + 30
                                      )}
                                    </Typography>
                                  ))}
                                </>
                              ))}
                            </Box>
                          </>
                        ))}
                      </Box>
                    </>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
}
