import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Trans, useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import usePageTitle from "../../../hooks/usePageTitle";
import { SCENARIOS } from "../../../functions/scenarios";
import { RISK_TYPE, RISK_CATEGORY } from "../../../types/dataverse/Riskfile";
import {
  DVRiskSummary,
  CauseRisksSummary,
  EffectRisksSummary,
} from "../../../types/dataverse/DVRiskSummary";
import {
  DVRiskSnapshot,
  RiskSnapshotResults,
} from "../../../types/dataverse/DVRiskSnapshot";

import ScenarioMatrixChart from "../../../components/charts/svg/ScenarioMatrixChart";
import ImpactSankeyChart from "../../../components/charts/svg/ImpactSankeyChart";
import ProbabilitySankyChart from "../../../components/charts/svg/ProbabilitySankeyChart";

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const AccentCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: 4,
  padding: theme.spacing(2.5, 3),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

const SplitCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  height: "100%",
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
}));

const ComingSoonChip = styled(Box)(({ theme }) => ({
  display: "inline-block",
  fontSize: "0.68rem",
  fontWeight: 500,
  padding: "2px 8px",
  borderRadius: 20,
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.disabled,
  border: `1px solid ${theme.palette.divider}`,
  marginLeft: theme.spacing(1),
}));

// ---------------------------------------------------------------------------
// Static example data — typed against real application types so TypeScript
// will flag this file if the data structures diverge from the implementation.
//
// Source: C03 "Cyber attack against a CBRNe infrastructure", extreme scenario.
// ---------------------------------------------------------------------------

const EXAMPLE_CAUSING_RISKS: CauseRisksSummary[] = [
  {
    cause_risk_id: "8a58db5b-aa6c-ed11-9561-000d3adf7089",
    cause_risk_title: "Hybrid actor",
    cause_risk_p: 0.7946,
  },
  {
    cause_risk_id: "6296cd55-aa6c-ed11-9561-000d3adf7089",
    cause_risk_title: "Software / Hardware vulnerability",
    cause_risk_p: 0.1714,
  },
  {
    cause_risk_id: null as unknown as string,
    cause_risk_title: "Other causes",
    cause_risk_p: 0.034,
  },
];

const EXAMPLE_EFFECT_RISKS: EffectRisksSummary[] = [
  {
    effect_risk_id: "d358db5b-aa6c-ed11-9561-000d3adf7089",
    effect_risk_title: "Nuclear plant incident",
    effect_risk_i: 0.7035,
  },
  {
    effect_risk_id: null as unknown as string,
    effect_risk_title: "Direct Impact",
    effect_risk_i: 0.0855,
  },
  {
    effect_risk_id: "cc58db5b-aa6c-ed11-9561-000d3adf7089",
    effect_risk_title: "Failure of electricity supply",
    effect_risk_i: 0.0785,
  },
  {
    effect_risk_id: null as unknown as string,
    effect_risk_title: "Other effects",
    effect_risk_i: 0.1325,
  },
];

const EXAMPLE_RISK_SUMMARY: DVRiskSummary = {
  cr4de_bnrariskfilesummaryid: "6596cd55-aa6c-ed11-9561-000d3adf7089",
  "cr4de_risk_file@odata.bind": null,
  _cr4de_risk_file_value: "6596cd55-aa6c-ed11-9561-000d3adf7089",
  cr4de_risk_file: null,
  cr4de_last_snapshot: null,
  cr4de_hazard_id: "C03",
  cr4de_title: "Cyber attack against a CBRNe infrastructure",
  cr4de_risk_type: RISK_TYPE.STANDARD,
  cr4de_category: RISK_CATEGORY.CYBER,
  cr4de_key_risk: false,
  cr4de_label_hilp: false,
  cr4de_label_cc: false,
  cr4de_label_cb: false,
  cr4de_label_impact: null,
  cr4de_mrs: SCENARIOS.EXTREME,
  cr4de_summary_en: "",
  cr4de_summary_nl: "",
  cr4de_summary_fr: "",
  cr4de_summary_de: "",
  cr4de_mrs_p: 3.21,
  cr4de_mrs_i: 2.48,
  cr4de_mrs_h: 2.31,
  cr4de_mrs_s: 1.77,
  cr4de_mrs_e: 1.52,
  cr4de_mrs_f: 1.94,
  cr4de_causing_risks: JSON.stringify(EXAMPLE_CAUSING_RISKS),
  cr4de_effect_risks: JSON.stringify(EXAMPLE_EFFECT_RISKS),
  cr4de_definition: null,
  cr4de_horizon_analysis: null,
  cr4de_historical_events: null,
  cr4de_intensity_parameters: null,
  cr4de_scenario_considerable: null,
  cr4de_scenario_major: null,
  cr4de_scenario_extreme: null,
};

// Typed snapshot — cr4de_quanti is the parsed RiskSnapshotResults object
// constructed from the real API response for C03.
const EXAMPLE_SNAPSHOT: DVRiskSnapshot<unknown, RiskSnapshotResults> = {
  cr4de_bnrariskfilesnapshotid: "55fb4b3e-a656-f011-877a-000d3ab805fb",
  "cr4de_risk_file@odata.bind": null,
  _cr4de_risk_file_value: "6596cd55-aa6c-ed11-9561-000d3adf7089",
  cr4de_risk_file: null,
  cr4de_hazard_id: "C03",
  cr4de_title: "Cyber attack against a CBRNe infrastructure",
  cr4de_risk_type: RISK_TYPE.STANDARD,
  cr4de_category: RISK_CATEGORY.CYBER,
  cr4de_definition: "",
  cr4de_horizon_analysis: null,
  cr4de_historical_events: null,
  cr4de_intensity_parameters: null,
  cr4de_scenarios: null,
  cr4de_mrs: SCENARIOS.EXTREME,
  cr4de_quali_scenario_mrs: null,
  cr4de_quali_disclaimer_mrs: null,
  cr4de_quali_p_mrs: null,
  cr4de_quali_h_mrs: null,
  cr4de_quali_s_mrs: null,
  cr4de_quali_e_mrs: null,
  cr4de_quali_f_mrs: null,
  cr4de_quali_actions_mrs: null,
  cr4de_quali_mm_mrs: null,
  cr4de_quali_cb_mrs: null,
  cr4de_quali_cc_mrs: null,
  cr4de_quanti_results: null,
  cr4de_quali: "" as unknown as never,
  cr4de_quanti: {
    [SCENARIOS.CONSIDERABLE]: {
      tp: { yearly: { scale: 3.08 }, scale5TP: 3.08, rpMonths: 67.65 },
      tp50: { yearly: { scale: 3.1 }, scale5TP: 3.1, rpMonths: 66.44 },
      dp: {
        scaleTot: 0.06,
        scale: 2.5,
        scale5TP: 0.06,
        scale5: 2.5,
        rpMonths: 3237.62,
      },
      dp50: {
        scaleTot: 0.06,
        scale: 2.6,
        scale5TP: 0.06,
        scale5: 2.6,
        rpMonths: 3196.89,
      },
      m: { p: 0, scale: 0, scaleTot: 0 },
      ti: {
        all: { scaleTot: 0.39, scale5TI: 0.39, euros: 309592000 },
        h: {
          scaleTot: 0.14,
          scaleCat: 0.45,
          scale5TI: 0.14,
          scale5Cat: 0.45,
          euros: 115000000,
        },
        ha: {
          scaleTot: 0.04,
          scaleCatRel: 0.28,
          abs: 1040000000,
          scale5TI: 0.04,
          scale5CatRel: 0.28,
          euros: 1040000000,
        },
        hb: {
          scaleTot: 0.05,
          scaleCatRel: 0.38,
          abs: 1120000000,
          scale5TI: 0.05,
          scale5CatRel: 0.38,
          euros: 1120000000,
        },
        hc: {
          scaleTot: 0.05,
          scaleCatRel: 0.34,
          abs: 1120000000,
          scale5TI: 0.05,
          scale5CatRel: 0.34,
          euros: 1120000000,
        },
        s: {
          scaleTot: 0.1,
          scaleCat: 0.4,
          scale5TI: 0.1,
          scale5Cat: 0.4,
          euros: 77879999,
        },
        sa: {
          scaleTot: 0.03,
          scaleCatRel: 0.29,
          abs: 880000000,
          scale5TI: 0.03,
          scale5CatRel: 0.29,
          euros: 880000000,
        },
        sb: {
          scaleTot: 0.04,
          scaleCatRel: 0.44,
          abs: 1040000000,
          scale5TI: 0.04,
          scale5CatRel: 0.44,
          euros: 1040000000,
        },
        sc: {
          scaleTot: 0.02,
          scaleCatRel: 0.17,
          abs: 720000000,
          scale5TI: 0.02,
          scale5CatRel: 0.17,
          euros: 720000000,
        },
        sd: {
          scaleTot: 0.01,
          scaleCatRel: 0.09,
          abs: 560000000,
          scale5TI: 0.01,
          scale5CatRel: 0.09,
          euros: 560000000,
        },
        e: {
          scaleTot: 0.01,
          scaleCat: 0.1,
          scale5TI: 0.01,
          scale5Cat: 0.1,
          euros: 9432000,
        },
        ea: {
          scaleTot: 0.01,
          scaleCatRel: 1.0,
          abs: 640000000,
          scale5TI: 0.01,
          scale5CatRel: 1.0,
          euros: 640000000,
        },
        f: {
          scaleTot: 0.13,
          scaleCat: 0.44,
          scale5TI: 0.13,
          scale5Cat: 0.44,
          euros: 107280000,
        },
        fa: {
          scaleTot: 0.08,
          scaleCatRel: 0.63,
          abs: 1280000000,
          scale5TI: 0.08,
          scale5CatRel: 0.63,
          euros: 1280000000,
        },
        fb: {
          scaleTot: 0.05,
          scaleCatRel: 0.37,
          abs: 1120000000,
          scale5TI: 0.05,
          scale5CatRel: 0.37,
          euros: 1120000000,
        },
      },
      di: {
        all: { scaleTot: 0.05875 },
        ha: {
          scaleTot: 0.00625,
          abs: 5000000,
          scale5TI: 0.00625,
          scale5: 0.5,
          euros: 5000000,
        },
        hb: {
          scaleTot: 0.00625,
          abs: 5000000,
          scale5TI: 0.00625,
          scale5: 0.5,
          euros: 5000000,
        },
        hc: {
          scaleTot: 0.00625,
          abs: 5000000,
          scale5TI: 0.00625,
          scale5: 0.5,
          euros: 5000000,
        },
        sa: {
          scaleTot: 0.00625,
          abs: 5000000,
          scale5TI: 0.00625,
          scale5: 0.5,
          euros: 5000000,
        },
        sb: {
          scaleTot: 0.00625,
          abs: 5000000,
          scale5TI: 0.00625,
          scale5: 0.5,
          euros: 5000000,
        },
        sc: {
          scaleTot: 0.00063,
          abs: 504000,
          scale5TI: 0.00063,
          scale5: 0.0,
          euros: 504000,
        },
        sd: {
          scaleTot: 0.00063,
          abs: 504000,
          scale5TI: 0.00063,
          scale5: 0.0,
          euros: 504000,
        },
        ea: { scaleTot: 0.0, abs: 0, scale5TI: 0.0, scale5: 0.0, euros: 0 },
        fa: {
          scaleTot: 0.02,
          abs: 16000000,
          scale5TI: 0.02,
          scale5: 1.0,
          euros: 16000000,
        },
        fb: {
          scaleTot: 0.00625,
          abs: 5000000,
          scale5TI: 0.00625,
          scale5: 0.5,
          euros: 5000000,
        },
      },
    },
    [SCENARIOS.MAJOR]: {
      tp: { yearly: { scale: 3.02 }, scale5TP: 3.02, rpMonths: 72.06 },
      tp50: { yearly: { scale: 3.03 }, scale5TP: 3.03, rpMonths: 71.49 },
      dp: {
        scaleTot: 0.01,
        scale: 1.5,
        scale5TP: 0.01,
        scale5: 1.5,
        rpMonths: 32388.2,
      },
      dp50: {
        scaleTot: 0.01,
        scale: 1.5,
        scale5TP: 0.01,
        scale5: 1.5,
        rpMonths: 32212.39,
      },
      m: { p: 0, scale: 0, scaleTot: 0 },
      ti: {
        all: { scaleTot: 1.53, scale5TI: 1.53, euros: 1867400575 },
        h: {
          scaleTot: 0.61,
          scaleCat: 1.37,
          scale5TI: 0.61,
          scale5Cat: 1.37,
          euros: 750140450,
        },
        ha: {
          scaleTot: 0.09,
          scaleCatRel: 0.15,
          abs: 2201690598,
          scale5TI: 0.09,
          scale5CatRel: 0.15,
          euros: 2201690598,
        },
        hb: {
          scaleTot: 0.15,
          scaleCatRel: 0.25,
          abs: 2568639031,
          scale5TI: 0.15,
          scale5CatRel: 0.25,
          euros: 2568639031,
        },
        hc: {
          scaleTot: 0.37,
          scaleCatRel: 0.6,
          abs: 3057903608,
          scale5TI: 0.37,
          scale5CatRel: 0.6,
          euros: 3057903608,
        },
        s: {
          scaleTot: 0.41,
          scaleCat: 1.14,
          scale5TI: 0.41,
          scale5Cat: 1.14,
          euros: 501496191,
        },
        sa: {
          scaleTot: 0.09,
          scaleCatRel: 0.22,
          abs: 2201690598,
          scale5TI: 0.09,
          scale5CatRel: 0.22,
          euros: 2201690598,
        },
        sb: {
          scaleTot: 0.24,
          scaleCatRel: 0.58,
          abs: 2813271319,
          scale5TI: 0.24,
          scale5CatRel: 0.58,
          euros: 2813271319,
        },
        sc: {
          scaleTot: 0.04,
          scaleCatRel: 0.11,
          abs: 1834742165,
          scale5TI: 0.04,
          scale5CatRel: 0.11,
          euros: 1834742165,
        },
        sd: {
          scaleTot: 0.04,
          scaleCatRel: 0.09,
          abs: 1712426020,
          scale5TI: 0.04,
          scale5CatRel: 0.09,
          euros: 1712426020,
        },
        e: {
          scaleTot: 0.11,
          scaleCat: 0.47,
          scale5TI: 0.11,
          scale5Cat: 0.47,
          euros: 131844572,
        },
        ea: {
          scaleTot: 0.11,
          scaleCatRel: 1.0,
          abs: 2324006742,
          scale5TI: 0.11,
          scale5CatRel: 1.0,
          euros: 2324006742,
        },
        f: {
          scaleTot: 0.4,
          scaleCat: 1.12,
          scale5TI: 0.4,
          scale5Cat: 1.12,
          euros: 483931593,
        },
        fa: {
          scaleTot: 0.25,
          scaleCatRel: 0.63,
          abs: 2813271319,
          scale5TI: 0.25,
          scale5CatRel: 0.63,
          euros: 2813271319,
        },
        fb: {
          scaleTot: 0.15,
          scaleCatRel: 0.37,
          abs: 2446322886,
          scale5TI: 0.15,
          scale5CatRel: 0.37,
          euros: 2446322886,
        },
      },
      di: {
        all: { scaleTot: 0.19948 },
        ha: {
          scaleTot: 0.00409,
          abs: 5002730,
          scale5TI: 0.00409,
          scale5: 0.5,
          euros: 5002730,
        },
        hb: {
          scaleTot: 0.00409,
          abs: 5002730,
          scale5TI: 0.00409,
          scale5: 0.5,
          euros: 5002730,
        },
        hc: {
          scaleTot: 0.01308,
          abs: 15998952,
          scale5TI: 0.01308,
          scale5: 1.0,
          euros: 15998952,
        },
        sa: {
          scaleTot: 0.00409,
          abs: 5002730,
          scale5TI: 0.00409,
          scale5: 0.5,
          euros: 5002730,
        },
        sb: {
          scaleTot: 0.13081,
          abs: 160001748,
          scale5TI: 0.13081,
          scale5: 2.0,
          euros: 160001748,
        },
        sc: {
          scaleTot: 0.01308,
          abs: 15998952,
          scale5TI: 0.01308,
          scale5: 1.0,
          euros: 15998952,
        },
        sd: {
          scaleTot: 0.01308,
          abs: 15998952,
          scale5TI: 0.01308,
          scale5: 1.0,
          euros: 15998952,
        },
        ea: { scaleTot: 0.0, abs: 0, scale5TI: 0.0, scale5: 0.0, euros: 0 },
        fa: {
          scaleTot: 0.01308,
          abs: 15998952,
          scale5TI: 0.01308,
          scale5: 1.0,
          euros: 15998952,
        },
        fb: {
          scaleTot: 0.00409,
          abs: 5002730,
          scale5TI: 0.00409,
          scale5: 0.5,
          euros: 5002730,
        },
      },
    },
    [SCENARIOS.EXTREME]: {
      tp: { yearly: { scale: 3.21 }, scale5TP: 3.21, rpMonths: 58.91 },
      tp50: { yearly: { scale: 3.22 }, scale5TP: 3.22, rpMonths: 58.53 },
      dp: {
        scaleTot: 0.01,
        scale: 1.5,
        scale5TP: 0.01,
        scale5: 1.5,
        rpMonths: 32364.85,
      },
      dp50: {
        scaleTot: 0.01,
        scale: 1.5,
        scale5TP: 0.01,
        scale5: 1.5,
        rpMonths: 32215.5,
      },
      m: { p: 0, scale: 0, scaleTot: 0 },
      ti: {
        all: { scaleTot: 2.48, scale5TI: 2.48, euros: 8680907339 },
        h: {
          scaleTot: 1.16,
          scaleCat: 2.31,
          scale5TI: 1.16,
          scale5Cat: 2.31,
          euros: 4059938581,
        },
        ha: {
          scaleTot: 0.06,
          scaleCatRel: 0.05,
          abs: 7346532206,
          scale5TI: 0.06,
          scale5CatRel: 0.05,
          euros: 7346532206,
        },
        hb: {
          scaleTot: 0.17,
          scaleCatRel: 0.14,
          abs: 9095706540,
          scale5TI: 0.17,
          scale5CatRel: 0.14,
          euros: 9095706540,
        },
        hc: {
          scaleTot: 0.94,
          scaleCatRel: 0.81,
          abs: 11544550609,
          scale5TI: 0.94,
          scale5CatRel: 0.81,
          euros: 11544550609,
        },
        s: {
          scaleTot: 0.44,
          scaleCat: 1.77,
          scale5TI: 0.44,
          scale5Cat: 1.77,
          euros: 1549873410,
        },
        sa: {
          scaleTot: 0.15,
          scaleCatRel: 0.35,
          abs: 8745871673,
          scale5TI: 0.15,
          scale5CatRel: 0.35,
          euros: 8745871673,
        },
        sb: {
          scaleTot: 0.22,
          scaleCatRel: 0.5,
          abs: 9445541407,
          scale5TI: 0.22,
          scale5CatRel: 0.5,
          euros: 9445541407,
        },
        sc: {
          scaleTot: 0.04,
          scaleCatRel: 0.08,
          abs: 6646862472,
          scale5TI: 0.04,
          scale5CatRel: 0.08,
          euros: 6646862472,
        },
        sd: {
          scaleTot: 0.03,
          scaleCatRel: 0.07,
          abs: 6297027605,
          scale5TI: 0.03,
          scale5CatRel: 0.07,
          euros: 6297027605,
        },
        e: {
          scaleTot: 0.28,
          scaleCat: 1.52,
          scale5TI: 0.28,
          scale5Cat: 1.52,
          euros: 985904622,
        },
        ea: {
          scaleTot: 0.28,
          scaleCatRel: 1.0,
          abs: 9795376274,
          scale5TI: 0.28,
          scale5CatRel: 1.0,
          euros: 9795376274,
        },
        f: {
          scaleTot: 0.6,
          scaleCat: 1.94,
          scale5TI: 0.6,
          scale5Cat: 1.94,
          euros: 2085190724,
        },
        fa: {
          scaleTot: 0.4,
          scaleCatRel: 0.66,
          abs: 10145211141,
          scale5TI: 0.4,
          scale5CatRel: 0.66,
          euros: 10145211141,
        },
        fb: {
          scaleTot: 0.2,
          scaleCatRel: 0.34,
          abs: 9095706540,
          scale5TI: 0.2,
          scale5CatRel: 0.34,
          euros: 9095706540,
        },
      },
      di: {
        all: { scaleTot: 0.2121 },
        ha: {
          scaleTot: 0.00457,
          abs: 15987453,
          scale5TI: 0.00457,
          scale5: 1.0,
          euros: 15987453,
        },
        hb: {
          scaleTot: 0.01429,
          abs: 49991402,
          scale5TI: 0.01429,
          scale5: 1.5,
          euros: 49991402,
        },
        hc: {
          scaleTot: 0.01429,
          abs: 49991402,
          scale5TI: 0.01429,
          scale5: 1.5,
          euros: 49991402,
        },
        sa: {
          scaleTot: 0.00143,
          abs: 5002639,
          scale5TI: 0.00143,
          scale5: 0.5,
          euros: 5002639,
        },
        sb: {
          scaleTot: 0.14292,
          abs: 499983992,
          scale5TI: 0.14292,
          scale5: 2.5,
          euros: 499983992,
        },
        sc: {
          scaleTot: 0.01429,
          abs: 49991402,
          scale5TI: 0.01429,
          scale5: 1.5,
          euros: 49991402,
        },
        sd: {
          scaleTot: 0.01429,
          abs: 49991402,
          scale5TI: 0.01429,
          scale5: 1.5,
          euros: 49991402,
        },
        ea: { scaleTot: 0.0, abs: 0, scale5TI: 0.0, scale5: 0.0, euros: 0 },
        fa: {
          scaleTot: 0.00457,
          abs: 15987453,
          scale5TI: 0.00457,
          scale5: 1.0,
          euros: 15987453,
        },
        fb: {
          scaleTot: 0.00143,
          abs: 5002639,
          scale5TI: 0.00143,
          scale5: 0.5,
          euros: 5002639,
        },
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function AggregationAndReportingPage() {
  const { t } = useTranslation();

  usePageTitle(t("learning.reporting.title", "Aggregation and reporting"));
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t("learning.reporting.title", "Aggregation and reporting"),
      url: "/learning/aggregation-reporting",
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          <Trans i18nKey="learning.reporting.title">
            Aggregation and reporting
          </Trans>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.reporting.intro">
            Once the simulations have run, the raw output — thousands of sampled
            cascade networks — is aggregated into a set of statistics and
            visualisations that make the results interpretable. This page
            explains the main outputs published on the BNRA platform and how to
            read them. All examples below use real data from the risk file for
            "Cyber attack against a CBRNe infrastructure" (C03).
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Risk summary                                                        */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.reporting.summary.title">Risk summary</Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.reporting.summary.body">
            The risk summary page presents the quantitative results in the most
            compact form possible, intended for an audience that wants a quick
            read rather than a deep analysis. It shows a single probability bar
            on a scale from 0 to 5 for the most relevant scenario, and four
            speedometer-style gauges — one per impact domain — each also on a 0
            to 5 scale. Together these five values give an immediate impression
            of both the likelihood and the nature of the harm associated with
            the risk.
          </Trans>
        </Typography>

        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.reporting.summary.mrs.title">
              The most relevant scenario
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.reporting.summary.mrs.body">
              Each risk has three scenarios, but not all are equally informative
              at a glance. The most relevant scenario (MRS) is the one that
              represents the highest total risk, calculated as the product of
              total probability and total impact on a common scale. It is this
              scenario that is shown in the summary view and serves as the
              primary basis for cross-risk comparisons. The MRS is not
              necessarily the most severe scenario: an extreme but
              near-impossible event may carry less total risk than a major
              scenario that occurs regularly.
            </Trans>
          </Typography>
        </AccentCard>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Scenario risk matrix                                               */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.reporting.matrix.title">
            Scenario risk matrix
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.reporting.matrix.body">
            The scenario risk matrix plots all three scenarios of a risk on a
            probability-impact grid. Probability is on the vertical axis and
            total impact on the horizontal axis, both expressed on the 0 to 5
            scale. The background gradient runs from green (low risk,
            bottom-left) to red (high risk, top-right). The most relevant
            scenario is highlighted; the other two are shown at reduced opacity.
            Diagonal iso-risk lines connect points of equal total risk
            (probability x impact), making it easy to see which scenarios
            contribute most.
          </Trans>
        </Typography>

        <ChartContainer sx={{ p: 2 }}>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block", mb: 1 }}
          >
            {t(
              "learning.reporting.matrix.example",
              "Example: Cyber attack against a CBRNe infrastructure (C03)",
            )}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <ScenarioMatrixChart
              riskFile={EXAMPLE_SNAPSHOT}
              mrs={SCENARIOS.EXTREME}
              maxScale={5}
              width={320}
              height={290}
            />
          </Box>
        </ChartContainer>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Butterfly diagram                                                   */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.reporting.butterfly.title">
            The butterfly diagram
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.reporting.butterfly.body">
            The butterfly diagram is the central visualisation on each risk
            analysis page. It is a two-sided Sankey diagram, with probability on
            the left and impact on the right, meeting at the risk scenario in
            the middle.
          </Trans>
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SplitCard>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                <Trans i18nKey="learning.reporting.butterfly.probability.title">
                  Left side: probability causes
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.reporting.butterfly.probability.body">
                  Each band flowing into the risk scenario from the left
                  represents a cause — either the direct probability (no
                  underlying cause) or a cascade from another risk. The width of
                  each band is proportional to that cause's relative
                  contribution to the total probability of the scenario.
                </Trans>
              </Typography>
            </SplitCard>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SplitCard>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                <Trans i18nKey="learning.reporting.butterfly.impact.title">
                  Right side: impact effects
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.reporting.butterfly.impact.body">
                  Each band flowing out to the right represents a contribution
                  to the total impact — either the direct impact of the scenario
                  itself, or the expected impact of a downstream cascade. The
                  width of each band is proportional to that effect's share of
                  the total mean impact. The impact side can be filtered by
                  domain (human, societal, environmental, financial) or by
                  individual indicator.
                </Trans>
              </Typography>
            </SplitCard>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.reporting.butterfly.example.intro">
            The two sides of the example below use C03 data for the extreme
            scenario. The probability side shows that the hybrid actor group is
            the dominant cause (approximately 79% of total probability). The
            impact side shows that most of the total impact flows through a
            nuclear plant incident cascade rather than the direct impact of the
            cyber attack itself.
          </Trans>
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <ChartContainer sx={{ p: 2, mb: 1 }}>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", display: "block", mb: 1 }}
              >
                {t(
                  "learning.reporting.butterfly.causeLabel",
                  "Probability side — relative contributions of causes",
                )}
              </Typography>
              <Box sx={{ height: 500 }}>
                <ProbabilitySankyChart
                  riskSummary={EXAMPLE_RISK_SUMMARY}
                  riskFile={EXAMPLE_SNAPSHOT}
                  scenario={SCENARIOS.EXTREME}
                  width="100%"
                  height="100%"
                />
              </Box>
            </ChartContainer>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <ChartContainer sx={{ p: 2 }}>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", display: "block", mb: 1 }}
              >
                {t(
                  "learning.reporting.butterfly.effectLabel",
                  "Impact side — relative contributions of effects",
                )}
              </Typography>
              <Box sx={{ height: 500 }}>
                <ImpactSankeyChart
                  riskSummary={EXAMPLE_RISK_SUMMARY}
                  riskFile={EXAMPLE_SNAPSHOT}
                  scenario={SCENARIOS.EXTREME}
                  width="100%"
                  height="100%"
                />
              </Box>
            </ChartContainer>
          </Grid>
        </Grid>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Advanced statistics                                                 */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.reporting.advanced.title">
            Advanced statistics
            <ComingSoonChip>coming soon</ComingSoonChip>
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.reporting.advanced.body">
            For risks that have been processed by the latest version of the
            simulation engine, a dedicated Risk Statistics page will provide a
            more detailed view of the full output distributions. These
            statistics are currently being rolled out and will become available
            progressively.
          </Trans>
        </Typography>

        <Grid container spacing={1.5}>
          {[
            {
              titleKey: "learning.reporting.advanced.histogram.title",
              titleDefault: "Impact histogram",
              bodyKey: "learning.reporting.advanced.histogram.body",
              bodyDefault:
                "A histogram of total impact per indicator across all simulation runs, with a fitted Gaussian distribution overlaid. Shows the actual spread of outcomes rather than just the mean.",
            },
            {
              titleKey: "learning.reporting.advanced.boxplot.title",
              titleDefault: "Impact boxplots per indicator",
              bodyKey: "learning.reporting.advanced.boxplot.body",
              bodyDefault:
                "A boxplot for each of the ten damage indicators plus total impact, showing minimum, quartiles, and maximum across all runs. Equivalent to the histogram but summarises all indicators in one chart.",
            },
            {
              titleKey: "learning.reporting.advanced.effectbars.title",
              titleDefault: "Expected impact per cascade effect",
              bodyKey: "learning.reporting.advanced.effectbars.body",
              bodyDefault:
                "A horizontal bar chart with one bar per potential downstream cascade and one for direct impact, showing the mean contribution to total impact with uncertainty bars. A more detailed view of the impact side of the butterfly diagram.",
            },
            {
              titleKey: "learning.reporting.advanced.effectprob.title",
              titleDefault: "Probability of cascade effects",
              bodyKey: "learning.reporting.advanced.effectprob.body",
              bodyDefault:
                "A horizontal bar chart showing how likely each downstream cascade is to activate, expressed as a probability across all simulation runs.",
            },
            {
              titleKey: "learning.reporting.advanced.rootcause.title",
              titleDefault: "Probability of root causes",
              bodyKey: "learning.reporting.advanced.rootcause.body",
              bodyDefault:
                "A horizontal bar chart showing the relative contribution of each root cause — including the direct probability — to the total probability of the scenario, with uncertainty bars.",
            },
            {
              titleKey: "learning.reporting.advanced.firstorder.title",
              titleDefault: "Probability of first-order causes",
              bodyKey: "learning.reporting.advanced.firstorder.body",
              bodyDefault:
                "Similar to the root cause chart, but shows the distribution of first-order (direct) causes only — risks that immediately precede this one in the cascade chain, rather than tracing back to the ultimate root.",
            },
          ].map((card) => (
            <Grid key={card.titleKey} size={{ xs: 12, sm: 6 }}>
              <SplitCard sx={{ opacity: 0.75 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  {t(card.titleKey, card.titleDefault)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  {t(card.bodyKey, card.bodyDefault)}
                </Typography>
              </SplitCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Cross-catalogue risk matrix                                         */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.reporting.riskmatrix.title">
            Cross-catalogue risk matrix
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.reporting.riskmatrix.body">
            A risk matrix that plots all risks in the catalogue on a single
            probability-impact grid allows every risk to be seen in context and
            compared directly. Each point represents either the most relevant
            scenario of a risk (default view) or all three scenarios of every
            risk. Category and scenario are encoded by shape and colour
            respectively. Hovering over any point shows the risk name, total
            probability, total impact, and expected annualised impact.
          </Trans>
        </Typography>

        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.reporting.riskmatrix.where.title">
              Where to find it
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.reporting.riskmatrix.where.body">
              The full cross-catalogue risk matrix is available on the BNRA
              platform under the Results section. It is not embedded here
              because it requires the complete catalogue data to be meaningful —
              a partial matrix with a single example risk would be misleading
              rather than illustrative.
            </Trans>
          </Typography>
        </AccentCard>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Prev navigation — this is the last methodology page                */}
      {/* ------------------------------------------------------------------ */}
      <Box
        sx={{
          mt: 2,
          pt: 3,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          component={RouterLink}
          to="/learning/monte-carlo-simulation"
          startIcon={<ChevronLeftIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.reporting.prev">
            Previous: Monte Carlo simulation
          </Trans>
        </Button>
        <Button
          component={RouterLink}
          to="/learning/climate-change"
          endIcon={<ChevronRightIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.reporting.next">Next: Climate change</Trans>
        </Button>
      </Box>
    </Container>
  );
}
