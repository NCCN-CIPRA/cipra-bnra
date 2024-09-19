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
import {
  DVRiskCascade,
  getCascadeResultSnapshot,
  RISK_CASCADE_QUANTI_FIELDS,
} from "../../types/dataverse/DVRiskCascade";
import { DIRECT_ANALYSIS_QUANTI_FIELDS, DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { CASCADE_ANALYSIS_QUANTI_FIELDS, DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";
import { CascadeCalculation, DVAnalysisRun, RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { v4 as uuid } from "uuid";
import { DVParticipation } from "../../types/dataverse/DVParticipation";
import { DVContact } from "../../types/dataverse/DVContact";
import calculateMetrics from "../../functions/analysis/calculateMetrics";
import runAnalysis from "../../functions/analysis/runAnalysis";
import { getResultSnapshot, SmallRisk } from "../../types/dataverse/DVSmallRisk";
import { getCauses, getEffects } from "../../functions/cascades";
import { getCascadeParameter, getScenarioParameter, getWorstCaseScenario, SCENARIOS } from "../../functions/scenarios";
import { Cause, getYearlyProbabilityFromRelative } from "../../functions/Probability";
import round from "../../functions/roundNumberString";
import { Effect, getDirectImpact, getIndirectImpact } from "../../functions/Impact";
import { getCategoryImpactRelative } from "../../functions/TotalImpact";

const replacements: string[][] = [
  ["Animal diseases \\(not zoonoses\\)", "Animal diseases excluding zoonoses"],
  ["Subsidence and uplift including shoreline change", "Subsidence and uplift"],
  ["Biohacking \\(e.g. CRISPR\\)", "Biohacking"],
  ["Icing \\(including ice\\)", "Icing"],
  ["Solar storm \\(Solar radiation storm\\)", "Solar radiation storm"],
  ["Internet of Things \\(IOT\\)-related hazards", "Internet of Things (IOT)"],
  ["Hybrid threat", "Hybrid actor"],
  ["Left-wing extremism/terrorism", "Left-wing extremist actor"],
  ["Right-wing extremism/terrorism", "Right-wing extremist actor"],
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
  ["Infectious Diseases", "Infectious diseases"],
  ["Riverbank Erosion", "Riverbank erosion"],
  ["Information Operations", "Information operations"],
  ["Release of Biological Agents", "Release of biological agents"],
  ["Substandard and Falsified Medical Products", "Substandard and falsified medical products"],
  ["Road Traffic Accident", "Road traffic accident"],
  ["Fire or Explosion in an Urban or Residential Area", "Fire or explosion in an urban or residential area"],
  ["Invasive Species", "Invasive species"],
  ["impact represents only an estimated", "impact represents an estimated"],
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

const isNegligible = (a: string | number, b: string | number) => {
  const aN = typeof a === "string" ? parseFloat((a as string).replace(",", ".")) : (a as number);
  const bN = typeof b === "string" ? parseFloat((b as string).replace(",", ".")) : (b as number);

  return Math.abs(aN - bN) < 5;
};

const isNegligibleTI = (shouldBe: string, was: string) => {
  const sbFloat = parseFloat(shouldBe.replace(",", "."));
  const wasFloat = parseFloat(was.replace(",", "."));

  if (wasFloat <= 10 && sbFloat <= 10) return true;
  if (wasFloat <= 10 && sbFloat > 10) return Math.abs(wasFloat - sbFloat) < 4;
  if (sbFloat <= 10 && wasFloat > 10) return Math.abs(wasFloat - sbFloat) < 4;
  return Math.abs(wasFloat - sbFloat) < 10 || Math.abs(wasFloat - sbFloat) / wasFloat < 0.5;
};

const find = (s: string | null, r: RegExp) => {
  if (s === null) return r.exec("");

  const clean = s.replace(/<[^>]*>?/gm, "").replace(/[\s\u00A0]/g, " ");

  // if (clean.indexOf("An extreme failure of gas supply could have a very big") >= 0) console.log(r, clean);
  return r.exec(clean);
};

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

type ReportProblems = { [key: string]: { rf: DVRiskFile; problem: string }[] };

const last = (arr: any[]) => arr.slice(-1)[0];

export default function CorrectionsPage() {
  const api = useAPI();
  const [calculationProgress, setCalculationProgress] = useState<number | null>(null);
  const [additionalErrors, setAdditionalErrors] = useState<string>("");
  const [additionalCorrections, setAdditionalCorrections] = useState<string>("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [corrections, setCorrections] = useState<Correction[] | null>(null);
  const [reportProblems, setReportProblems] = useState<ReportProblems | null>(null);

  const {
    data: riskFiles,
    isFetching: loadingRiskFiles,
    reloadData: reloadRiskFiles,
  } = useRecords<DVRiskFile>({
    table: DataTable.RISK_FILE,
    transformResult: (rfs: DVRiskFile[]) => {
      return rfs.map((rf) => ({ ...rf, results: getResultSnapshot(rf) }));
    },
  });

  const {
    data: cascades,
    isFetching: loadingCascades,
    reloadData: reloadCascades,
  } = useRecords<DVRiskCascade>({
    table: DataTable.RISK_CASCADE,
    transformResult: (cs: DVRiskCascade[]) => {
      return cs.map((c) => ({ ...c, results: getCascadeResultSnapshot(c) }));
    },
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

  const reloadDataCascades = () => {
    reloadRiskFiles();
    reloadCascades();
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
            // console.log(m);
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

  const findBadPercentages = () => {
    if (!riskFiles || !cascades) return null;

    const problems: ReportProblems = {};

    const addProblem = (rf: DVRiskFile, problem: string) => {
      if (!problems[rf.cr4de_riskfilesid]) problems[rf.cr4de_riskfilesid] = [];

      problems[rf.cr4de_riskfilesid].push({
        rf,
        problem,
      });
    };

    const ignoreRiskFiles = ["H09"];

    const hc = riskFiles.reduce(
      (acc, rf) => ({ ...acc, [rf.cr4de_riskfilesid]: rf }),
      {} as { [id: string]: SmallRisk }
    );

    for (let rf of riskFiles.filter(
      (rf) =>
        rf.cr4de_risk_type === RISK_TYPE.STANDARD &&
        !rf.cr4de_hazard_id.startsWith("X") &&
        ignoreRiskFiles.indexOf(rf.cr4de_hazard_id) < 0
    )) {
      const mrs = rf.cr4de_mrs || SCENARIOS.EXTREME;
      const causes = getCauses(rf, cascades, hc);
      const effects = getEffects(rf, cascades, hc);

      const TPmatch = /There is an estimated[\s\u00A0]<\/span><strong style=".*">([\d\,]*)%<\/strong>/.exec(
        rf.cr4de_mrs_probability || ""
      );
      const DPmatch = /No underlying cause(?:<\/[au]>)? \(([\d\,]*)% of total probability\)/.exec(
        rf.cr4de_mrs_probability || ""
      );
      const causeMatches = causes
        .map((c) => {
          const regex = `(${c.cr4de_cause_hazard.cr4de_title
            .replace("(", "\\(")
            .replace(")", "\\)")
            .replace("&", "&amp;")})<\\/a>[\\s\\u00A0]\\(([\\d,]*)% of total probability\\)`;

          return new RegExp(regex, "g").exec(rf.cr4de_mrs_probability || "");
        })
        .filter((m) => m !== null);

      const TIHMatch = find(
        rf.cr4de_mrs_impact_h,
        /The human impact represents an estimated ([\d\,]*)% of the total impact/
      );
      const DIHMatch =
        find(rf.cr4de_mrs_impact_h, /Direct Impact\ ?([\d\,]*)% of total human impact - ([\d\,]*)% of total impact/) ||
        find(
          rf.cr4de_mrs_impact_h,
          /Direct Impact\ ?\(([\d\,]*)% of total human impact - ([\d\,]*)% of total impact\)/
        );

      const hEffectMatches = effects
        .map((c) => {
          const regexA = `(${c.cr4de_effect_hazard.cr4de_title
            .replace("(", "\\(")
            .replace(")", "\\)")})\\ ?([\\d\\,]*)% of total human impact - ([\\d\\,]*)% of total impact`;
          const regexB = `(${c.cr4de_effect_hazard.cr4de_title
            .replace("(", "\\(")
            .replace(")", "\\)")})\\ ?\\(([\\d\\,]*)% of total human impact - ([\\d\\,]*)% of total impact\\)`;

          return (
            find(rf.cr4de_mrs_impact_h, new RegExp(regexA, "g")) || find(rf.cr4de_mrs_impact_h, new RegExp(regexB, "g"))
          );
        })
        .filter((m) => m !== null);

      const TISMatch = find(
        rf.cr4de_mrs_impact_s,
        /The societal impact represents an estimated ([\d\,]*)% of the total impact/
      );
      const DISMatch =
        find(
          rf.cr4de_mrs_impact_s,
          /Direct Impact\ ?([\d\,]*)% of total societal impact - ([\d\,]*)% of total impact/
        ) ||
        find(
          rf.cr4de_mrs_impact_s,
          /Direct Impact\ ?\(([\d\,]*)% of total societal impact - ([\d\,]*)% of total impact\)/
        );
      const sEffectMatches = effects
        .map((c) => {
          const regexA = `(${c.cr4de_effect_hazard.cr4de_title
            .replace("(", "\\(")
            .replace(")", "\\)")})\\ ?([\\d\\,]*)% of total societal impact - ([\\d\\,]*)% of total impact`;
          const regexB = `(${c.cr4de_effect_hazard.cr4de_title
            .replace("(", "\\(")
            .replace(")", "\\)")})\\ ?\\(([\\d\\,]*)% of total societal impact - ([\\d\\,]*)% of total impact\\)`;

          return (
            find(rf.cr4de_mrs_impact_s, new RegExp(regexA, "g")) || find(rf.cr4de_mrs_impact_s, new RegExp(regexB, "g"))
          );
        })
        .filter((m) => m !== null);

      const TIEMatch = find(
        rf.cr4de_mrs_impact_e,
        /The environmental impact represents an estimated ([\d\,]*)% of the total impact/
      );
      const DIEMatch =
        find(
          rf.cr4de_mrs_impact_e,
          /Direct Impact\ ?([\d\,]*)% of total environmental impact - ([\d\,]*)% of total impact/
        ) ||
        find(
          rf.cr4de_mrs_impact_e,
          /Direct Impact\ ?\(([\d\,]*)% of total environmental impact - ([\d\,]*)% of total impact\)/
        );
      const eEffectMatches = effects
        .map((c) => {
          const regexA = `(${c.cr4de_effect_hazard.cr4de_title
            .replace("(", "\\(")
            .replace(")", "\\)")})\\ ?([\\d\\,]*)% of total environmental impact - ([\\d\\,]*)% of total impact`;
          const regexB = `(${c.cr4de_effect_hazard.cr4de_title
            .replace("(", "\\(")
            .replace(")", "\\)")})\\ ?\\(([\\d\\,]*)% of total environmental impact - ([\\d\\,]*)% of total impact\\)`;

          return (
            find(rf.cr4de_mrs_impact_e, new RegExp(regexA, "g")) || find(rf.cr4de_mrs_impact_e, new RegExp(regexB, "g"))
          );
        })
        .filter((m) => m !== null);

      const TIFMatch = find(
        rf.cr4de_mrs_impact_f,
        /The financial impact represents an estimated ([\d\,]*)% of the total impact/
      );
      const DIFMatch =
        find(
          rf.cr4de_mrs_impact_f,
          /Direct Impact\ ?([\d\,]*)% of total financial impact - ([\d\,]*)% of total impact/
        ) ||
        find(
          rf.cr4de_mrs_impact_f,
          /Direct Impact\ ?\(([\d\,]*)% of total financial impact - ([\d\,]*)% of total impact\)/
        );
      const fEffectMatches = effects
        .map((c) => {
          const regexA = `(${c.cr4de_effect_hazard.cr4de_title
            .replace("(", "\\(")
            .replace(")", "\\)")})\\ ?([\\d\\,]*)% of total financial impact - ([\\d\\,]*)% of total impact`;
          const regexB = `(${c.cr4de_effect_hazard.cr4de_title
            .replace("(", "\\(")
            .replace(")", "\\)")})\\ ?\\(([\\d\\,]*)% of total financial impact - ([\\d\\,]*)% of total impact\\)`;

          return (
            find(rf.cr4de_mrs_impact_f, new RegExp(regexA, "g")) || find(rf.cr4de_mrs_impact_f, new RegExp(regexB, "g"))
          );
        })
        .filter((m) => m !== null);

      const tp = getScenarioParameter(rf, "TP", mrs) || 0.00001;
      const ti = getScenarioParameter(rf, "TI", mrs) || 0.00001;

      const paretoCauses = [
        {
          name: "DP",
          p: getScenarioParameter(rf, "DP", mrs) || 0,
        },
        ...(rf.cr4de_risk_type === RISK_TYPE.MANMADE
          ? []
          : causes.map((c) => ({
              id: c.cr4de_cause_hazard.cr4de_riskfilesid,
              name: c.cr4de_cause_hazard.cr4de_title,
              p: getCascadeParameter(c, mrs, "IP") || 0,
              cascade: c,
            }))),
      ]
        .sort((a, b) => b.p - a.p)
        .reduce(
          ([cumulCauses, pCumul], c) => {
            if (pCumul / tp > 0.8) return [cumulCauses, pCumul] as [Cause[], number];

            return [[...cumulCauses, c], pCumul + c.p] as [Cause[], number];
          },
          [[], 0] as [Cause[], number]
        )[0];

      const enhEffects = [getDirectImpact(rf, mrs), ...effects.map((c) => getIndirectImpact(c, rf, mrs))];

      if (!TPmatch)
        addProblem(
          rf,
          `Missing total probability, should be: ${round(100 * getYearlyProbabilityFromRelative(tp), 2)}%`
        );
      else if (!isNegligible(round(100 * getYearlyProbabilityFromRelative(tp), 2), TPmatch[1])) {
        addProblem(
          rf,
          `Diverging total probability, should be: ${round(100 * getYearlyProbabilityFromRelative(tp), 2)}% but was: ${
            TPmatch[1]
          }%`
        );
      }

      const dp = paretoCauses.find((pc) => pc.name === "DP");
      if (dp && !DPmatch && dp.p / tp >= 0.1)
        addProblem(rf, `Missing direct probability, should be: ${round((100 * dp.p) / tp)}%`);
      else if (dp && DPmatch && !isNegligible(round((100 * dp.p) / tp), DPmatch[1])) {
        addProblem(rf, `Diverging direct probability, should be: ${round((100 * dp.p) / tp)} but was: ${DPmatch[1]}`);
      }

      for (let pc of paretoCauses) {
        if (pc.name === "DP") continue;

        const match = causeMatches.find((cm) => cm && cm[1].replace("&amp;", "&") === pc.name);

        if (!match && pc.p / tp > 0.1) {
          if (dp && !DPmatch) addProblem(rf, `Missing cause "${pc.name}" with probability: ${pc.p}%`);
        } else if (match && !isNegligible(round((100 * pc.p) / tp), match[2]))
          addProblem(
            rf,
            `Diverging indirect probability for cause ${pc.name}, should be: ${round((100 * pc.p) / tp)}% but was: ${
              match[2]
            }%`
          );
      }

      const paretoEffectsH = enhEffects
        .sort((a, b) => b.h - a.h)
        .reduce(
          ([cumulEffects, iCumul], e) => {
            if (iCumul > 0.8 && cumulEffects.length >= 3) return [cumulEffects, iCumul] as [Effect[], number];

            return [[...cumulEffects, e], iCumul + e.h] as [Effect[], number];
          },
          [[], 0] as [Effect[], number]
        )[0];

      const impactTI_H = getScenarioParameter(rf, `TI_H`, mrs) || 0.00001;
      const HTI = round((100 * impactTI_H) / ti);

      if (!TIHMatch) addProblem(rf, `Missing total human impact, should be: ${HTI}%`);
      else if (!isNegligibleTI(HTI, TIHMatch[1])) {
        addProblem(rf, `Diverging total human impact, should be: ${HTI}% but was: ${TIHMatch[1]}%`);
      }

      const dih = paretoEffectsH.find((pc) => pc.name === "Direct Impact");
      const dihRatio = dih ? (dih.h * impactTI_H) / ti : 0;
      if (dih && !DIHMatch && dihRatio >= 0.1)
        addProblem(rf, `Missing direct human impact, should be: ${round(100 * dihRatio)}%`);
      else if (dih && DIHMatch && !isNegligible(round(100 * dihRatio), DIHMatch[2])) {
        addProblem(rf, `Diverging direct human impact, should be: ${round(100 * dihRatio)} but was: ${DIHMatch[2]}`);
      }

      for (let pc of paretoEffectsH) {
        if (pc.name === "Direct Impact") continue;

        const match = hEffectMatches.find((cm) => cm && cm[1].replace("&amp;", "&") === pc.name);
        const ihRatio = (pc.h * impactTI_H) / ti;
        if (!match && ihRatio > 0.1) {
          addProblem(rf, `Missing effect "${pc.name}" with human impact: ${round(100 * ihRatio)}%`);
        } else if (match && !isNegligible(round(100 * ihRatio), match[3]))
          addProblem(
            rf,
            `Diverging indirect human impact for effect ${pc.name}, should be: ${round(100 * ihRatio)}% but was: ${
              match[3]
            }%`
          );
      }

      const paretoEffectsS = enhEffects
        .sort((a, b) => b.s - a.s)
        .reduce(
          ([cumulEffects, iCumul], e) => {
            if (iCumul > 0.8 && cumulEffects.length >= 3) return [cumulEffects, iCumul] as [Effect[], number];

            return [[...cumulEffects, e], iCumul + e.s] as [Effect[], number];
          },
          [[], 0] as [Effect[], number]
        )[0];

      const impactTI_S = getScenarioParameter(rf, `TI_S`, mrs) || 0.00001;
      const STI = round((100 * impactTI_S) / ti);

      if (!TISMatch) addProblem(rf, `Missing total societal impact, should be: ${STI}%`);
      else if (!isNegligibleTI(STI, TISMatch[1])) {
        addProblem(rf, `Diverging total societal impact, should be: ${STI}% but was: ${TISMatch[1]}%`);
      }

      const dis = paretoEffectsS.find((pc) => pc.name === "Direct Impact");
      const disRatio = dis ? (dis.s * impactTI_S) / ti : 0;
      if (dis && !DISMatch && disRatio >= 0.1)
        addProblem(rf, `Missing direct societal impact, should be: ${round(100 * disRatio)}%`);
      else if (dis && DISMatch && !isNegligible(round(100 * disRatio), DISMatch[2])) {
        addProblem(rf, `Diverging direct societal impact, should be: ${round(100 * disRatio)} but was: ${DISMatch[2]}`);
      }

      for (let pc of paretoEffectsS) {
        if (pc.name === "Direct Impact") continue;

        const match = sEffectMatches.find((cm) => cm && cm[1].replace("&amp;", "&") === pc.name);
        const isRatio = (pc.s * impactTI_S) / ti;

        if (!match && isRatio > 0.1) {
          addProblem(rf, `Missing effect "${pc.name}" with societal impact: ${round(100 * isRatio)}%`);
        } else if (match && !isNegligible(round(100 * isRatio), match[3]))
          addProblem(
            rf,
            `Diverging indirect societal impact for effect ${pc.name}, should be: ${round(100 * isRatio)}% but was: ${
              match[3]
            }%`
          );
      }

      const paretoEffectsE = enhEffects
        .sort((a, b) => b.e - a.e)
        .reduce(
          ([cumulEffects, iCumul], e) => {
            if (iCumul > 0.8 && cumulEffects.length >= 3) return [cumulEffects, iCumul] as [Effect[], number];

            return [[...cumulEffects, e], iCumul + e.e] as [Effect[], number];
          },
          [[], 0] as [Effect[], number]
        )[0];

      const impactTI_E = getScenarioParameter(rf, `TI_E`, mrs) || 0.00001;
      const ETI = round((100 * impactTI_E) / ti);

      if (!TIEMatch) addProblem(rf, `Missing total environmental impact, should be: ${ETI}%`);
      else if (!isNegligibleTI(ETI, TIEMatch[1])) {
        addProblem(rf, `Diverging total environmental impact, should be: ${ETI}% but was: ${TIEMatch[1]}%`);
      }

      const die = paretoEffectsE.find((pc) => pc.name === "Direct Impact");
      const dieRatio = die ? (die.e * impactTI_E) / ti : 0;
      if (die && !DIEMatch && dieRatio >= 0.1)
        addProblem(rf, `Missing direct environmental impact, should be: ${round(100 * dieRatio)}%`);
      else if (die && DIEMatch && !isNegligible(round(100 * dieRatio), DIEMatch[2])) {
        addProblem(
          rf,
          `Diverging direct environmental impact, should be: ${round(100 * die.e)} but was: ${DIEMatch[2]}`
        );
      }

      for (let pc of paretoEffectsE) {
        if (pc.name === "Direct Impact") continue;

        const match = eEffectMatches.find((cm) => cm && cm[1].replace("&amp;", "&") === pc.name);
        const ieRatio = (pc.e * impactTI_E) / ti;

        if (!match && ieRatio > 0.1) {
          addProblem(rf, `Missing effect "${pc.name}" with environmental impact: ${round(100 * ieRatio)}%`);
        } else if (match && !isNegligible(round(100 * ieRatio), match[3]))
          addProblem(
            rf,
            `Diverging indirect environmental impact for effect ${pc.name}, should be: ${round(
              100 * ieRatio
            )}% but was: ${match[3]}%`
          );
      }

      const paretoEffectsF = enhEffects
        .sort((a, b) => b.f - a.f)
        .reduce(
          ([cumulEffects, iCumul], e) => {
            if (iCumul > 0.8 && cumulEffects.length >= 3) return [cumulEffects, iCumul] as [Effect[], number];

            return [[...cumulEffects, e], iCumul + e.f] as [Effect[], number];
          },
          [[], 0] as [Effect[], number]
        )[0];

      const impactTI_F = getScenarioParameter(rf, `TI_F`, mrs) || 0.00001;
      const FTI = round((100 * impactTI_F) / ti);

      if (!TIFMatch) addProblem(rf, `Missing total financial impact, should be: ${FTI}%`);
      else if (!isNegligibleTI(FTI, TIFMatch[1])) {
        addProblem(rf, `Diverging total financial impact, should be: ${FTI}% but was: ${TIFMatch[1]}%`);
      }

      const dif = paretoEffectsF.find((pc) => pc.name === "Direct Impact");
      const difRatio = dif ? (dif.f * impactTI_F) / ti : 0;
      if (dif && !DIFMatch && difRatio >= 0.1)
        addProblem(rf, `Missing direct financial impact, should be: ${round(100 * difRatio)}%`);
      else if (dif && DIFMatch && !isNegligible(round(100 * difRatio), DIFMatch[2])) {
        addProblem(
          rf,
          `Diverging direct financial impact, should be: ${round(100 * difRatio)} but was: ${DIFMatch[2]}`
        );
      }

      for (let pc of paretoEffectsF) {
        if (pc.name === "Direct Impact") continue;

        const match = fEffectMatches.find((cm) => cm && cm[1].replace("&amp;", "&") === pc.name);
        const ifRatio = (pc.f * impactTI_F) / ti;

        if (!match && ifRatio > 0.1) {
          addProblem(rf, `Missing effect "${pc.name}" with financial impact: ${round(100 * ifRatio)}%`);
        } else if (match && !isNegligible(round(100 * ifRatio), match[3]))
          addProblem(
            rf,
            `Diverging indirect financial impact for effect ${pc.name}, should be: ${round(100 * ifRatio)}% but was: ${
              match[3]
            }%`
          );
      }
    }

    setReportProblems(problems);
  };

  const savePercentages = () => {};

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
          <Card sx={{ mb: 4 }}>
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
                    <Box sx={{ width: 24, height: 32, mx: 1 }}>
                      {cascades && !loadingCascades && <CheckIcon color="success" />}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ mt: "2px" }}>
                        Risk Cascades
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
            <Box sx={{ py: 2, px: 1 }}>
              {reportProblems &&
                Object.values(reportProblems).map((p) => (
                  <>
                    <Typography variant="subtitle2">{p[0].rf.cr4de_title}</Typography>
                    <Box sx={{ pl: 2, mb: 2 }}>
                      {p.map((sp) => (
                        <Typography variant="body2">{sp.problem}</Typography>
                      ))}
                    </Box>
                  </>
                ))}
            </Box>
            <Box sx={{ height: 8, mt: 2, mx: 1 }}>
              {calculationProgress !== null && <LinearProgress variant="determinate" value={calculationProgress} />}
            </Box>
          </CardContent>
          <CardActions>
            <Button disabled={isLoading} onClick={reloadDataCascades}>
              Reload data
            </Button>
            <Button disabled={isLoading} onClick={findBadPercentages}>
              Find mismatching percentages
            </Button>
            <Box sx={{ flex: 1 }} />
            <Button color="warning" disabled={corrections === null} onClick={savePercentages}>
              Save corrections
            </Button>
          </CardActions>
        </Card>
      </Container>
    </>
  );
}
