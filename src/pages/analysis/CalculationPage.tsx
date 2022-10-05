import { useEffect, useState } from "react";
import { Container, Typography, Paper, Button, Stack } from "@mui/material";
import { getAbsoluteImpact } from "../../functions/Impact";

const dps: { [key: string]: number } = {
  DP0: 0,
  "DP0.5": 0.001,
  DP1: 0.0016,
  "DP1.5": 0.003,
  DP2: 0.0036,
  "DP2.5": 0.01,
  DP3: 0.016,
  "DP3.5": 0.03,
  DP4: 0.036,
  "DP4.5": 0.1,
  DP5: 0.16,
  M0: 0,
  "M0.5": 0.001,
  M1: 0.0016,
  "M1.5": 0.003,
  M2: 0.0036,
  "M2.5": 0.01,
  M3: 0.016,
  "M3.5": 0.03,
  M4: 0.036,
  "M4.5": 0.1,
  M5: 0.16,
};
const getDP = (scale: string | null) => {
  if (scale === null) return 0;

  return dps[scale];
};
const cps: { [key: string]: number } = {
  CP0: 0,
  "CP0.5": 0.001,
  CP1: 0.004,
  "CP1.5": 0.01,
  CP2: 0.04,
  "CP2.5": 0.1,
  CP3: 0.3,
  "CP3.5": 0.5,
  CP4: 0.7,
  "CP4.5": 0.9,
  CP5: 0.95,
};
const getCP = (scale: string | null) => {
  if (scale === null) return 0;

  return cps[scale];
};

const calculateTotalProbabilities = (risk: any) => {
  risk.tp_c = risk.dp_c + risk.ip_c;
  risk.tp_m = risk.dp_m + risk.ip_m;
  risk.tp_e = risk.dp_e + risk.ip_e;

  risk.tp = risk.tp_c + risk.tp_m + risk.tp_e;

  // Relative probabilities
  risk.rp_c = risk.tp_c / (risk.tp || 1);
  risk.rp_m = risk.tp_m / (risk.tp || 1);
  risk.rp_e = risk.tp_e / (risk.tp || 1);
};

const calculateTotalImpacts = (risk: any) => {
  risk.di_Ha = risk.rp_c * risk.di_Ha_c + risk.rp_m * risk.di_Ha_m + risk.rp_e * risk.di_Ha_e;
  risk.di_Hb = risk.rp_c * risk.di_Hb_c + risk.rp_m * risk.di_Hb_m + risk.rp_e * risk.di_Hb_e;
  risk.di_Hc = risk.rp_c * risk.di_Hc_c + risk.rp_m * risk.di_Hc_m + risk.rp_e * risk.di_Hc_e;
  risk.di_Sa = risk.rp_c * risk.di_Sa_c + risk.rp_m * risk.di_Sa_m + risk.rp_e * risk.di_Sa_e;
  risk.di_Sb = risk.rp_c * risk.di_Sb_c + risk.rp_m * risk.di_Sb_m + risk.rp_e * risk.di_Sb_e;
  risk.di_Sc = risk.rp_c * risk.di_Sc_c + risk.rp_m * risk.di_Sc_m + risk.rp_e * risk.di_Sc_e;
  risk.di_Sd = risk.rp_c * risk.di_Sd_c + risk.rp_m * risk.di_Sd_m + risk.rp_e * risk.di_Sd_e;
  risk.di_Ea = risk.rp_c * risk.di_Ea_c + risk.rp_m * risk.di_Ea_m + risk.rp_e * risk.di_Ea_e;
  risk.di_Fa = risk.rp_c * risk.di_Fa_c + risk.rp_m * risk.di_Fa_m + risk.rp_e * risk.di_Fa_e;
  risk.di_Fb = risk.rp_c * risk.di_Fb_c + risk.rp_m * risk.di_Fb_m + risk.rp_e * risk.di_Fb_e;

  risk.di =
    risk.di_Ha +
    risk.di_Hb +
    risk.di_Hc +
    risk.di_Sa +
    risk.di_Sb +
    risk.di_Sc +
    risk.di_Sd +
    risk.di_Ea +
    risk.di_Fa +
    risk.di_Fb;

  risk.ti_Ha_c = risk.di_Ha_c + risk.ii_Ha_c;
  risk.ti_Hb_c = risk.di_Hb_c + risk.ii_Hb_c;
  risk.ti_Hc_c = risk.di_Hc_c + risk.ii_Hc_c;
  risk.ti_Sa_c = risk.di_Sa_c + risk.ii_Sa_c;
  risk.ti_Sb_c = risk.di_Sb_c + risk.ii_Sb_c;
  risk.ti_Sc_c = risk.di_Sc_c + risk.ii_Sc_c;
  risk.ti_Sd_c = risk.di_Sd_c + risk.ii_Sd_c;
  risk.ti_Ea_c = risk.di_Ea_c + risk.ii_Ea_c;
  risk.ti_Fa_c = risk.di_Fa_c + risk.ii_Fa_c;
  risk.ti_Fb_c = risk.di_Fb_c + risk.ii_Fb_c;

  risk.ti_Ha_m = risk.di_Ha_m + risk.ii_Ha_m;
  risk.ti_Hb_m = risk.di_Hb_m + risk.ii_Hb_m;
  risk.ti_Hc_m = risk.di_Hc_m + risk.ii_Hc_m;
  risk.ti_Sa_m = risk.di_Sa_m + risk.ii_Sa_m;
  risk.ti_Sb_m = risk.di_Sb_m + risk.ii_Sb_m;
  risk.ti_Sc_m = risk.di_Sc_m + risk.ii_Sc_m;
  risk.ti_Sd_m = risk.di_Sd_m + risk.ii_Sd_m;
  risk.ti_Ea_m = risk.di_Ea_m + risk.ii_Ea_m;
  risk.ti_Fa_m = risk.di_Fa_m + risk.ii_Fa_m;
  risk.ti_Fb_m = risk.di_Fb_m + risk.ii_Fb_m;

  risk.ti_Ha_e = risk.di_Ha_e + risk.ii_Ha_e;
  risk.ti_Hb_e = risk.di_Hb_e + risk.ii_Hb_e;
  risk.ti_Hc_e = risk.di_Hc_e + risk.ii_Hc_e;
  risk.ti_Sa_e = risk.di_Sa_e + risk.ii_Sa_e;
  risk.ti_Sb_e = risk.di_Sb_e + risk.ii_Sb_e;
  risk.ti_Sc_e = risk.di_Sc_e + risk.ii_Sc_e;
  risk.ti_Sd_e = risk.di_Sd_e + risk.ii_Sd_e;
  risk.ti_Ea_e = risk.di_Ea_e + risk.ii_Ea_e;
  risk.ti_Fa_e = risk.di_Fa_e + risk.ii_Fa_e;
  risk.ti_Fb_e = risk.di_Fb_e + risk.ii_Fb_e;

  risk.ti_c =
    risk.ti_Ha_c +
    risk.ti_Hb_c +
    risk.ti_Hc_c +
    risk.ti_Sa_c +
    risk.ti_Sb_c +
    risk.ti_Sc_c +
    risk.ti_Sd_c +
    risk.ti_Ea_c +
    risk.ti_Fa_c +
    risk.ti_Fb_c;

  risk.ti_m =
    risk.ti_Ha_m +
    risk.ti_Hb_m +
    risk.ti_Hc_m +
    risk.ti_Sa_m +
    risk.ti_Sb_m +
    risk.ti_Sc_m +
    risk.ti_Sd_m +
    risk.ti_Ea_m +
    risk.ti_Fa_m +
    risk.ti_Fb_m;

  risk.ti_e =
    risk.ti_Ha_e +
    risk.ti_Hb_e +
    risk.ti_Hc_e +
    risk.ti_Sa_e +
    risk.ti_Sb_e +
    risk.ti_Sc_e +
    risk.ti_Sd_e +
    risk.ti_Ea_e +
    risk.ti_Fa_e +
    risk.ti_Fb_e;

  risk.ti_Ha = risk.rp_c * risk.ti_Ha_c + risk.rp_m * risk.ti_Ha_m + risk.rp_e * risk.ti_Ha_e;
  risk.ti_Hb = risk.rp_c * risk.ti_Hb_c + risk.rp_m * risk.ti_Hb_m + risk.rp_e * risk.ti_Hb_e;
  risk.ti_Hc = risk.rp_c * risk.ti_Hc_c + risk.rp_m * risk.ti_Hc_m + risk.rp_e * risk.ti_Hc_e;
  risk.ti_Sa = risk.rp_c * risk.ti_Sa_c + risk.rp_m * risk.ti_Sa_m + risk.rp_e * risk.ti_Sa_e;
  risk.ti_Sb = risk.rp_c * risk.ti_Sb_c + risk.rp_m * risk.ti_Sb_m + risk.rp_e * risk.ti_Sb_e;
  risk.ti_Sc = risk.rp_c * risk.ti_Sc_c + risk.rp_m * risk.ti_Sc_m + risk.rp_e * risk.ti_Sc_e;
  risk.ti_Sd = risk.rp_c * risk.ti_Sd_c + risk.rp_m * risk.ti_Sd_m + risk.rp_e * risk.ti_Sd_e;
  risk.ti_Ea = risk.rp_c * risk.ti_Ea_c + risk.rp_m * risk.ti_Ea_m + risk.rp_e * risk.ti_Ea_e;
  risk.ti_Fa = risk.rp_c * risk.ti_Fa_c + risk.rp_m * risk.ti_Fa_m + risk.rp_e * risk.ti_Fa_e;
  risk.ti_Fb = risk.rp_c * risk.ti_Fb_c + risk.rp_m * risk.ti_Fb_m + risk.rp_e * risk.ti_Fb_e;

  risk.ti =
    risk.ti_Ha +
    risk.ti_Hb +
    risk.ti_Hc +
    risk.ti_Sa +
    risk.ti_Sb +
    risk.ti_Sc +
    risk.ti_Sd +
    risk.ti_Ea +
    risk.ti_Fa +
    risk.ti_Fb;
};

const calculateIndirectProbabilities = (risk: any) => {
  risk.causes.forEach((cause: any) => {
    cause.ip_c =
      cause.C2C * (cause.cause.tp_c || 0) + cause.M2C * (cause.cause.tp_m || 0) + cause.E2C * (cause.cause.tp_e || 0);
    cause.ip_m =
      cause.C2M * (cause.cause.tp_c || 0) + cause.M2M * (cause.cause.tp_m || 0) + cause.E2M * (cause.cause.tp_e || 0);
    cause.ip_e =
      cause.C2E * (cause.cause.tp_c || 0) + cause.M2E * (cause.cause.tp_m || 0) + cause.E2E * (cause.cause.tp_e || 0);

    cause.ip = cause.ip_c + cause.ip_m + cause.ip_e;
  });
  risk.ip_c = risk.causes.reduce((acc: number, effect: any) => acc + effect.ip_c, 0);
  risk.ip_m = risk.causes.reduce((acc: number, effect: any) => acc + effect.ip_m, 0);
  risk.ip_e = risk.causes.reduce((acc: number, effect: any) => acc + effect.ip_e, 0);

  risk.ip = risk.ip_c + risk.ip_m + risk.ip_e;
};

const calculateIndirectImpacts = (risk: any) => {
  risk.effects.forEach((effect: any) => {
    effect.ii_Ha_c =
      effect.C2C * (effect.effect.ti_Ha_c || 0) +
      effect.C2M * (effect.effect.ti_Ha_m || 0) +
      effect.C2E * (effect.effect.ti_Ha_e || 0);
    effect.ii_Hb_c =
      effect.C2C * (effect.effect.ti_Hb_c || 0) +
      effect.C2M * (effect.effect.ti_Hb_m || 0) +
      effect.C2E * (effect.effect.ti_Hb_e || 0);
    effect.ii_Hc_c =
      effect.C2C * (effect.effect.ti_Hc_c || 0) +
      effect.C2M * (effect.effect.ti_Hc_m || 0) +
      effect.C2E * (effect.effect.ti_Hc_e || 0);
    effect.ii_Sa_c =
      effect.C2C * (effect.effect.ti_Sa_c || 0) +
      effect.C2M * (effect.effect.ti_Sa_m || 0) +
      effect.C2E * (effect.effect.ti_Sa_e || 0);
    effect.ii_Sb_c =
      effect.C2C * (effect.effect.ti_Sb_c || 0) +
      effect.C2M * (effect.effect.ti_Sb_m || 0) +
      effect.C2E * (effect.effect.ti_Sb_e || 0);
    effect.ii_Sc_c =
      effect.C2C * (effect.effect.ti_Sc_c || 0) +
      effect.C2M * (effect.effect.ti_Sc_m || 0) +
      effect.C2E * (effect.effect.ti_Sc_e || 0);
    effect.ii_Sd_c =
      effect.C2C * (effect.effect.ti_Sd_c || 0) +
      effect.C2M * (effect.effect.ti_Sd_m || 0) +
      effect.C2E * (effect.effect.ti_Sd_e || 0);
    effect.ii_Ea_c =
      effect.C2C * (effect.effect.ti_Ea_c || 0) +
      effect.C2M * (effect.effect.ti_Ea_m || 0) +
      effect.C2E * (effect.effect.ti_Ea_e || 0);
    effect.ii_Fa_c =
      effect.C2C * (effect.effect.ti_Fa_c || 0) +
      effect.C2M * (effect.effect.ti_Fa_m || 0) +
      effect.C2E * (effect.effect.ti_Fa_e || 0);
    effect.ii_Fb_c =
      effect.C2C * (effect.effect.ti_Fb_c || 0) +
      effect.C2M * (effect.effect.ti_Fb_m || 0) +
      effect.C2E * (effect.effect.ti_Fb_e || 0);

    effect.ii_Ha_m =
      effect.M2C * (effect.effect.ti_Ha_c || 0) +
      effect.M2M * (effect.effect.ti_Ha_m || 0) +
      effect.M2E * (effect.effect.ti_Ha_e || 0);
    effect.ii_Hb_m =
      effect.M2C * (effect.effect.ti_Hb_c || 0) +
      effect.M2M * (effect.effect.ti_Hb_m || 0) +
      effect.M2E * (effect.effect.ti_Hb_e || 0);
    effect.ii_Hc_m =
      effect.M2C * (effect.effect.ti_Hc_c || 0) +
      effect.M2M * (effect.effect.ti_Hc_m || 0) +
      effect.M2E * (effect.effect.ti_Hc_e || 0);
    effect.ii_Sa_m =
      effect.M2C * (effect.effect.ti_Sa_c || 0) +
      effect.M2M * (effect.effect.ti_Sa_m || 0) +
      effect.M2E * (effect.effect.ti_Sa_e || 0);
    effect.ii_Sb_m =
      effect.M2C * (effect.effect.ti_Sb_c || 0) +
      effect.M2M * (effect.effect.ti_Sb_m || 0) +
      effect.M2E * (effect.effect.ti_Sb_e || 0);
    effect.ii_Sc_m =
      effect.M2C * (effect.effect.ti_Sc_c || 0) +
      effect.M2M * (effect.effect.ti_Sc_m || 0) +
      effect.M2E * (effect.effect.ti_Sc_e || 0);
    effect.ii_Sd_m =
      effect.M2C * (effect.effect.ti_Sd_c || 0) +
      effect.M2M * (effect.effect.ti_Sd_m || 0) +
      effect.M2E * (effect.effect.ti_Sd_e || 0);
    effect.ii_Ea_m =
      effect.M2C * (effect.effect.ti_Ea_c || 0) +
      effect.M2M * (effect.effect.ti_Ea_m || 0) +
      effect.M2E * (effect.effect.ti_Ea_e || 0);
    effect.ii_Fa_m =
      effect.M2C * (effect.effect.ti_Fa_c || 0) +
      effect.M2M * (effect.effect.ti_Fa_m || 0) +
      effect.M2E * (effect.effect.ti_Fa_e || 0);
    effect.ii_Fb_m =
      effect.M2C * (effect.effect.ti_Fb_c || 0) +
      effect.M2M * (effect.effect.ti_Fb_m || 0) +
      effect.M2E * (effect.effect.ti_Fb_e || 0);

    effect.ii_Ha_e =
      effect.E2C * (effect.effect.ti_Ha_c || 0) +
      effect.E2M * (effect.effect.ti_Ha_m || 0) +
      effect.E2E * (effect.effect.ti_Ha_e || 0);
    effect.ii_Hb_e =
      effect.E2C * (effect.effect.ti_Hb_c || 0) +
      effect.E2M * (effect.effect.ti_Hb_m || 0) +
      effect.E2E * (effect.effect.ti_Hb_e || 0);
    effect.ii_Hc_e =
      effect.E2C * (effect.effect.ti_Hc_c || 0) +
      effect.E2M * (effect.effect.ti_Hc_m || 0) +
      effect.E2E * (effect.effect.ti_Hc_e || 0);
    effect.ii_Sa_e =
      effect.E2C * (effect.effect.ti_Sa_c || 0) +
      effect.E2M * (effect.effect.ti_Sa_m || 0) +
      effect.E2E * (effect.effect.ti_Sa_e || 0);
    effect.ii_Sb_e =
      effect.E2C * (effect.effect.ti_Sb_c || 0) +
      effect.E2M * (effect.effect.ti_Sb_m || 0) +
      effect.E2E * (effect.effect.ti_Sb_e || 0);
    effect.ii_Sc_e =
      effect.E2C * (effect.effect.ti_Sc_c || 0) +
      effect.E2M * (effect.effect.ti_Sc_m || 0) +
      effect.E2E * (effect.effect.ti_Sc_e || 0);
    effect.ii_Sd_e =
      effect.E2C * (effect.effect.ti_Sd_c || 0) +
      effect.E2M * (effect.effect.ti_Sd_m || 0) +
      effect.E2E * (effect.effect.ti_Sd_e || 0);
    effect.ii_Ea_e =
      effect.E2C * (effect.effect.ti_Ea_c || 0) +
      effect.E2M * (effect.effect.ti_Ea_m || 0) +
      effect.E2E * (effect.effect.ti_Ea_e || 0);
    effect.ii_Fa_e =
      effect.E2C * (effect.effect.ti_Fa_c || 0) +
      effect.E2M * (effect.effect.ti_Fa_m || 0) +
      effect.E2E * (effect.effect.ti_Fa_e || 0);
    effect.ii_Fb_e =
      effect.E2C * (effect.effect.ti_Fb_c || 0) +
      effect.E2M * (effect.effect.ti_Fb_m || 0) +
      effect.E2E * (effect.effect.ti_Fb_e || 0);
  });

  risk.ii_Ha_c = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Ha_c, 0);
  risk.ii_Hb_c = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Hb_c, 0);
  risk.ii_Hc_c = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Hc_c, 0);
  risk.ii_Sa_c = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Sa_c, 0);
  risk.ii_Sb_c = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Sb_c, 0);
  risk.ii_Sc_c = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Sc_c, 0);
  risk.ii_Sd_c = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Sd_c, 0);
  risk.ii_Ea_c = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Ea_c, 0);
  risk.ii_Fa_c = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Fa_c, 0);
  risk.ii_Fb_c = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Fb_c, 0);

  risk.ii_Ha_m = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Ha_m, 0);
  risk.ii_Hb_m = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Hb_m, 0);
  risk.ii_Hc_m = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Hc_m, 0);
  risk.ii_Sa_m = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Sa_m, 0);
  risk.ii_Sb_m = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Sb_m, 0);
  risk.ii_Sc_m = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Sc_m, 0);
  risk.ii_Sd_m = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Sd_m, 0);
  risk.ii_Ea_m = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Ea_m, 0);
  risk.ii_Fa_m = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Fa_m, 0);
  risk.ii_Fb_m = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Fb_m, 0);

  risk.ii_Ha_e = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Ha_e, 0);
  risk.ii_Hb_e = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Hb_e, 0);
  risk.ii_Hc_e = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Hc_e, 0);
  risk.ii_Sa_e = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Sa_e, 0);
  risk.ii_Sb_e = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Sb_e, 0);
  risk.ii_Sc_e = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Sc_e, 0);
  risk.ii_Sd_e = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Sd_e, 0);
  risk.ii_Ea_e = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Ea_e, 0);
  risk.ii_Fa_e = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Fa_e, 0);
  risk.ii_Fb_e = risk.effects.reduce((acc: number, effect: any) => acc + effect.ii_Fb_e, 0);

  risk.ii_Ha = risk.rp_c * risk.ii_Ha_c + risk.rp_m * risk.ii_Ha_m + risk.rp_e * risk.ii_Ha_e;
  risk.ii_Hb = risk.rp_c * risk.ii_Hb_c + risk.rp_m * risk.ii_Hb_m + risk.rp_e * risk.ii_Hb_e;
  risk.ii_Hc = risk.rp_c * risk.ii_Hc_c + risk.rp_m * risk.ii_Hc_m + risk.rp_e * risk.ii_Hc_e;
  risk.ii_Sa = risk.rp_c * risk.ii_Sa_c + risk.rp_m * risk.ii_Sa_m + risk.rp_e * risk.ii_Sa_e;
  risk.ii_Sb = risk.rp_c * risk.ii_Sb_c + risk.rp_m * risk.ii_Sb_m + risk.rp_e * risk.ii_Sb_e;
  risk.ii_Sc = risk.rp_c * risk.ii_Sc_c + risk.rp_m * risk.ii_Sc_m + risk.rp_e * risk.ii_Sc_e;
  risk.ii_Sd = risk.rp_c * risk.ii_Sd_c + risk.rp_m * risk.ii_Sd_m + risk.rp_e * risk.ii_Sd_e;
  risk.ii_Ea = risk.rp_c * risk.ii_Ea_c + risk.rp_m * risk.ii_Ea_m + risk.rp_e * risk.ii_Ea_e;
  risk.ii_Fa = risk.rp_c * risk.ii_Fa_c + risk.rp_m * risk.ii_Fa_m + risk.rp_e * risk.ii_Fa_e;
  risk.ii_Fb = risk.rp_c * risk.ii_Fb_c + risk.rp_m * risk.ii_Fb_m + risk.rp_e * risk.ii_Fb_e;

  risk.ii =
    risk.ii_Ha +
    risk.ii_Hb +
    risk.ii_Hc +
    risk.ii_Sa +
    risk.ii_Sb +
    risk.ii_Sc +
    risk.ii_Sd +
    risk.ii_Ea +
    risk.ii_Fa +
    risk.ii_Fb;
};

export default function CalculationPage() {
  const [riskFiles, setRiskFiles] = useState<any[] | null>(null);
  const [cascades, setCascades] = useState<any[] | null>(null);

  const [log, setLog] = useState(["Idle..."]);
  const [isCalculating, setIsCalculating] = useState(false);

  const [results, setResults] = useState<any[] | null>(null);

  useEffect(() => {
    const getRiskFiles = async function () {
      try {
        const response = await fetch(`https://bnra.powerappsportals.com/_api/cr4de_riskfileses`, {
          method: "GET",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQzMjMxOCwibmJmIjoxNjY0NDMyMzE5LCJleHAiOjE2NjQ0MzMyMTksImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.DSkyEOprtyUJ6juSh5fp1wRUTuH29GQpvLKpGS-rAJfOO98ZQmhzCkdj4zbq3BEH_XJDEJ2wIlvuNscu1HhfV55A37im1Lt0R-Im3rikctYX4mcVRlCCQJ00NA_KUJs5EPigqBZjo7FY9o1xjVuhXo1mOTs3Ozo18inuX0i5mWcuwEQ4oUPxS__NC4ARKTKfGJ4SHcxC3cdQfCLsCfi--AKfYZh5It4YXnuLnttNkRcFDD08lFBBlVKMOprwCcXJNCvzXEbJx9l9silBz_xWYUjed2PIY0ob_ErUiAj6uvMfJDtRu9cgj0pj2EEXyugYFASI2SU9lpz5_yzgFr5c_w",
            __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
            "Content-Type": "application/json",
          },
        });

        const responseJson = await response.json();

        setRiskFiles(responseJson.value);
      } catch (e) {
        console.log(e);
      }
    };

    const getCascades = async function () {
      try {
        const response = await fetch(`https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades`, {
          method: "GET",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQzMjMxOCwibmJmIjoxNjY0NDMyMzE5LCJleHAiOjE2NjQ0MzMyMTksImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.DSkyEOprtyUJ6juSh5fp1wRUTuH29GQpvLKpGS-rAJfOO98ZQmhzCkdj4zbq3BEH_XJDEJ2wIlvuNscu1HhfV55A37im1Lt0R-Im3rikctYX4mcVRlCCQJ00NA_KUJs5EPigqBZjo7FY9o1xjVuhXo1mOTs3Ozo18inuX0i5mWcuwEQ4oUPxS__NC4ARKTKfGJ4SHcxC3cdQfCLsCfi--AKfYZh5It4YXnuLnttNkRcFDD08lFBBlVKMOprwCcXJNCvzXEbJx9l9silBz_xWYUjed2PIY0ob_ErUiAj6uvMfJDtRu9cgj0pj2EEXyugYFASI2SU9lpz5_yzgFr5c_w",
            __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
            "Content-Type": "application/json",
          },
        });

        const responseJson = await response.json();

        setCascades(responseJson.value);
      } catch (e) {
        console.log(e);
      }
    };

    getRiskFiles();
    getCascades();
  }, []);

  const prepareRiskFiles = async () => {
    if (!riskFiles || !cascades || isCalculating) return [];

    setIsCalculating(true);

    const innerLog = [];

    innerLog.push("Linking risk files...");
    setLog(innerLog);

    const rfs: any[] = await new Promise((resolve) => {
      const rawRf = riskFiles.map((r) => ({ ...r, causes: [], effects: [] }));
      const rfDict = rawRf.reduce(
        (acc, el) => ({
          ...acc,
          [el.cr4de_riskfilesid]: el,
        }),
        {}
      );

      cascades.forEach((c) => {
        const cause = rfDict[c._cr4de_cause_hazard_value];
        const effect = rfDict[c._cr4de_effect_hazard_value];

        const rawCascade = { ...c, cause, effect };

        effect.causes.push(rawCascade);
        cause.effects.push(rawCascade);
      });

      setTimeout(() => resolve(rawRf));
    });

    innerLog.push("Setting absolute values for DP, DI and CP...");
    setLog(innerLog);

    await new Promise<void>((resolve) => {
      rfs.forEach((rf) => {
        rf.dp_c = getDP(rf.cr4de_dp_quanti_c);
        rf.dp_m = getDP(rf.cr4de_dp_quanti_m);
        rf.dp_e = getDP(rf.cr4de_dp_quanti_e);

        rf.di_Ha_c = getAbsoluteImpact(rf.cr4de_di_quanti_ha_c);
        rf.di_Hb_c = getAbsoluteImpact(rf.cr4de_di_quanti_hb_c);
        rf.di_Hc_c = getAbsoluteImpact(rf.cr4de_di_quanti_hc_c);
        rf.di_Sa_c = getAbsoluteImpact(rf.cr4de_di_quanti_sa_c);
        rf.di_Sb_c = getAbsoluteImpact(rf.cr4de_di_quanti_sb_c);
        rf.di_Sc_c = getAbsoluteImpact(rf.cr4de_di_quanti_sc_c);
        rf.di_Sd_c = getAbsoluteImpact(rf.cr4de_di_quanti_sd_c);
        rf.di_Ea_c = getAbsoluteImpact(rf.cr4de_di_quanti_ea_c);
        rf.di_Fa_c = getAbsoluteImpact(rf.cr4de_di_quanti_fa_c);
        rf.di_Fb_c = getAbsoluteImpact(rf.cr4de_di_quanti_fb_c);

        rf.di_Ha_m = getAbsoluteImpact(rf.cr4de_di_quanti_ha_m);
        rf.di_Hb_m = getAbsoluteImpact(rf.cr4de_di_quanti_hb_m);
        rf.di_Hc_m = getAbsoluteImpact(rf.cr4de_di_quanti_hc_m);
        rf.di_Sa_m = getAbsoluteImpact(rf.cr4de_di_quanti_sa_m);
        rf.di_Sb_m = getAbsoluteImpact(rf.cr4de_di_quanti_sb_m);
        rf.di_Sc_m = getAbsoluteImpact(rf.cr4de_di_quanti_sc_m);
        rf.di_Sd_m = getAbsoluteImpact(rf.cr4de_di_quanti_sd_m);
        rf.di_Ea_m = getAbsoluteImpact(rf.cr4de_di_quanti_ea_m);
        rf.di_Fa_m = getAbsoluteImpact(rf.cr4de_di_quanti_fa_m);
        rf.di_Fb_m = getAbsoluteImpact(rf.cr4de_di_quanti_fb_m);

        rf.di_Ha_e = getAbsoluteImpact(rf.cr4de_di_quanti_ha_e);
        rf.di_Hb_e = getAbsoluteImpact(rf.cr4de_di_quanti_hb_e);
        rf.di_Hc_e = getAbsoluteImpact(rf.cr4de_di_quanti_hc_e);
        rf.di_Sa_e = getAbsoluteImpact(rf.cr4de_di_quanti_sa_e);
        rf.di_Sb_e = getAbsoluteImpact(rf.cr4de_di_quanti_sb_e);
        rf.di_Sc_e = getAbsoluteImpact(rf.cr4de_di_quanti_sc_e);
        rf.di_Sd_e = getAbsoluteImpact(rf.cr4de_di_quanti_sd_e);
        rf.di_Ea_e = getAbsoluteImpact(rf.cr4de_di_quanti_ea_e);
        rf.di_Fa_e = getAbsoluteImpact(rf.cr4de_di_quanti_fa_e);
        rf.di_Fb_e = getAbsoluteImpact(rf.cr4de_di_quanti_fb_e);

        rf.effects.forEach((c: any) => {
          c.C2C = getCP(c.cr4de_c2c);
          c.C2M = getCP(c.cr4de_c2m);
          c.C2E = getCP(c.cr4de_c2e);
          c.M2C = getCP(c.cr4de_m2c);
          c.M2M = getCP(c.cr4de_m2m);
          c.M2E = getCP(c.cr4de_m2e);
          c.E2C = getCP(c.cr4de_e2c);
          c.E2M = getCP(c.cr4de_e2m);
          c.E2E = getCP(c.cr4de_e2e);
        });
      });

      setTimeout(resolve, 1000);
    });

    return [rfs, innerLog];
  };

  const calculateProbabilities = async (rfs: any[], innerLog: string[]) => {
    if (!riskFiles || !cascades) return;

    innerLog.push("Calculating absolute direct probability and impact...");
    setLog(innerLog);

    let lastTotalProbability = 0;

    for (let run = 1; run <= 10; run++) {
      innerLog.push("Calculating indirect probabilities...");
      setLog(innerLog);

      await new Promise<void>((resolve) => {
        rfs.forEach((rf: any) => calculateIndirectProbabilities(rf));

        setTimeout(resolve, 1000);
      });

      innerLog.push(`Calculating total probabilities (run ${run})...`);
      setLog(innerLog);

      await new Promise<void>((resolve) => {
        rfs.forEach((rf) => calculateTotalProbabilities(rf));

        setTimeout(resolve, 1000);
      });

      let totalProbability = 0;
      for (let j = 0; j < riskFiles.length; j++) {
        totalProbability += rfs[j].tp;

        if (isNaN(totalProbability)) {
          console.log(j, rfs[j]);
          throw new Error();
        }
      }
      const deltaTotalProbability = Math.abs(totalProbability - lastTotalProbability);

      if (deltaTotalProbability < 0.001) {
        innerLog.push(
          `Convergence reached (Total Probability: ${Math.round(1000 * totalProbability) / 1000}, Delta: ${
            Math.round(1000 * deltaTotalProbability) / 1000
          })...`
        );
        setLog(innerLog);
        break;
      } else {
        innerLog.push(
          `No convergence (Total Probability: ${Math.round(1000 * totalProbability) / 1000}, Delta: ${
            Math.round(1000 * deltaTotalProbability) / 1000
          })...`
        );
        setLog(innerLog);
        lastTotalProbability = totalProbability;
      }
    }
  };

  const calculateImpacts = async (rfs: any[], innerLog: string[]) => {
    if (!riskFiles || !cascades) return;

    innerLog.push("Calculating absolute direct probability and impact...");
    setLog(innerLog);

    let lastTotalImpact = 0;

    for (let run = 1; run <= 10; run++) {
      innerLog.push("Calculating indirect impacts...");
      setLog(innerLog);

      await new Promise<void>((resolve) => {
        rfs.forEach((rf: any) => calculateIndirectImpacts(rf));

        setTimeout(resolve, 1000);
      });

      innerLog.push(`Calculating total impact (run ${run})...`);
      setLog(innerLog);

      await new Promise<void>((resolve) => {
        rfs.forEach((rf) => calculateTotalImpacts(rf));

        setTimeout(resolve, 1000);
      });

      let totalImpact = 0;
      for (let j = 0; j < riskFiles.length; j++) {
        totalImpact += rfs[j].ti;

        if (isNaN(totalImpact)) {
          console.log(j, rfs[j]);
          throw new Error();
        }
      }
      const deltaTotalImpact = Math.abs(totalImpact - lastTotalImpact);

      if (deltaTotalImpact < 1) {
        innerLog.push(
          `Convergence reached (Total Impact: ${Math.round(totalImpact)}, Delta: ${Math.round(deltaTotalImpact)})...`
        );
        setLog(innerLog);
        break;
      } else {
        innerLog.push(
          `No convergence (Total Impact: ${Math.round(totalImpact)}, Delta: ${Math.round(deltaTotalImpact)})...`
        );
        setLog(innerLog);
        lastTotalImpact = totalImpact;
      }
    }
  };

  const saveResults = async () => {
    if (!results || isCalculating) return;

    const innerLog = log;

    innerLog.push(`Saving calculations (0/${results.length})`);
    setLog(innerLog);

    for (let i = 0; i < results.length; i++) {
      const rf = results[i];

      const calculatedFields = {
        dp_c: rf.dp_c,
        dp_m: rf.dp_m,
        dp_e: rf.dp_e,
        dp: rf.dp_c + rf.dp_m + rf.dp_e,

        ip_c: rf.ip_c,
        ip_m: rf.ip_m,
        ip_e: rf.ip_e,
        ip: rf.ip,

        tp_c: rf.tp_c,
        tp_m: rf.tp_m,
        tp_e: rf.tp_e,
        tp: rf.tp,

        rp_c: rf.rp_c,
        rp_m: rf.rp_m,
        rp_e: rf.rp_e,

        di_Ha_c: Math.round(rf.di_Ha_c),
        di_Hb_c: Math.round(rf.di_Hb_c),
        di_Hc_c: Math.round(rf.di_Hc_c),
        di_Sa_c: Math.round(rf.di_Sa_c),
        di_Sb_c: Math.round(rf.di_Sb_c),
        di_Sc_c: Math.round(rf.di_Sc_c),
        di_Sd_c: Math.round(rf.di_Sd_c),
        di_Ea_c: Math.round(rf.di_Ea_c),
        di_Fa_c: Math.round(rf.di_Fa_c),
        di_Fb_c: Math.round(rf.di_Fb_c),

        di_Ha_m: Math.round(rf.di_Ha_m),
        di_Hb_m: Math.round(rf.di_Hb_m),
        di_Hc_m: Math.round(rf.di_Hc_m),
        di_Sa_m: Math.round(rf.di_Sa_m),
        di_Sb_m: Math.round(rf.di_Sb_m),
        di_Sc_m: Math.round(rf.di_Sc_m),
        di_Sd_m: Math.round(rf.di_Sd_m),
        di_Ea_m: Math.round(rf.di_Ea_m),
        di_Fa_m: Math.round(rf.di_Fa_m),
        di_Fb_m: Math.round(rf.di_Fb_m),

        di_Ha_e: Math.round(rf.di_Ha_e),
        di_Hb_e: Math.round(rf.di_Hb_e),
        di_Hc_e: Math.round(rf.di_Hc_e),
        di_Sa_e: Math.round(rf.di_Sa_e),
        di_Sb_e: Math.round(rf.di_Sb_e),
        di_Sc_e: Math.round(rf.di_Sc_e),
        di_Sd_e: Math.round(rf.di_Sd_e),
        di_Ea_e: Math.round(rf.di_Ea_e),
        di_Fa_e: Math.round(rf.di_Fa_e),
        di_Fb_e: Math.round(rf.di_Fb_e),

        di_Ha: Math.round(rf.di_Ha),
        di_Hb: Math.round(rf.di_Hb),
        di_Hc: Math.round(rf.di_Hc),
        di_Sa: Math.round(rf.di_Sa),
        di_Sb: Math.round(rf.di_Sb),
        di_Sc: Math.round(rf.di_Sc),
        di_Sd: Math.round(rf.di_Sd),
        di_Ea: Math.round(rf.di_Ea),
        di_Fa: Math.round(rf.di_Fa),
        di_Fb: Math.round(rf.di_Fb),

        di: Math.round(rf.di),

        ii_Ha_c: Math.round(rf.ii_Ha_c),
        ii_Hb_c: Math.round(rf.ii_Hb_c),
        ii_Hc_c: Math.round(rf.ii_Hc_c),
        ii_Sa_c: Math.round(rf.ii_Sa_c),
        ii_Sb_c: Math.round(rf.ii_Sb_c),
        ii_Sc_c: Math.round(rf.ii_Sc_c),
        ii_Sd_c: Math.round(rf.ii_Sd_c),
        ii_Ea_c: Math.round(rf.ii_Ea_c),
        ii_Fa_c: Math.round(rf.ii_Fa_c),
        ii_Fb_c: Math.round(rf.ii_Fb_c),

        ii_Ha_m: Math.round(rf.ii_Ha_m),
        ii_Hb_m: Math.round(rf.ii_Hb_m),
        ii_Hc_m: Math.round(rf.ii_Hc_m),
        ii_Sa_m: Math.round(rf.ii_Sa_m),
        ii_Sb_m: Math.round(rf.ii_Sb_m),
        ii_Sc_m: Math.round(rf.ii_Sc_m),
        ii_Sd_m: Math.round(rf.ii_Sd_m),
        ii_Ea_m: Math.round(rf.ii_Ea_m),
        ii_Fa_m: Math.round(rf.ii_Fa_m),
        ii_Fb_m: Math.round(rf.ii_Fb_m),

        ii_Ha_e: Math.round(rf.ii_Ha_e),
        ii_Hb_e: Math.round(rf.ii_Hb_e),
        ii_Hc_e: Math.round(rf.ii_Hc_e),
        ii_Sa_e: Math.round(rf.ii_Sa_e),
        ii_Sb_e: Math.round(rf.ii_Sb_e),
        ii_Sc_e: Math.round(rf.ii_Sc_e),
        ii_Sd_e: Math.round(rf.ii_Sd_e),
        ii_Ea_e: Math.round(rf.ii_Ea_e),
        ii_Fa_e: Math.round(rf.ii_Fa_e),
        ii_Fb_e: Math.round(rf.ii_Fb_e),

        ii_Ha: Math.round(rf.ii_Ha),
        ii_Hb: Math.round(rf.ii_Hb),
        ii_Hc: Math.round(rf.ii_Hc),
        ii_Sa: Math.round(rf.ii_Sa),
        ii_Sb: Math.round(rf.ii_Sb),
        ii_Sc: Math.round(rf.ii_Sc),
        ii_Sd: Math.round(rf.ii_Sd),
        ii_Ea: Math.round(rf.ii_Ea),
        ii_Fa: Math.round(rf.ii_Fa),
        ii_Fb: Math.round(rf.ii_Fb),

        ii: Math.round(rf.ii),

        ti_Ha_c: Math.round(rf.ti_Ha_c),
        ti_Hb_c: Math.round(rf.ti_Hb_c),
        ti_Hc_c: Math.round(rf.ti_Hc_c),
        ti_Sa_c: Math.round(rf.ti_Sa_c),
        ti_Sb_c: Math.round(rf.ti_Sb_c),
        ti_Sc_c: Math.round(rf.ti_Sc_c),
        ti_Sd_c: Math.round(rf.ti_Sd_c),
        ti_Ea_c: Math.round(rf.ti_Ea_c),
        ti_Fa_c: Math.round(rf.ti_Fa_c),
        ti_Fb_c: Math.round(rf.ti_Fb_c),

        ti_Ha_m: Math.round(rf.ti_Ha_m),
        ti_Hb_m: Math.round(rf.ti_Hb_m),
        ti_Hc_m: Math.round(rf.ti_Hc_m),
        ti_Sa_m: Math.round(rf.ti_Sa_m),
        ti_Sb_m: Math.round(rf.ti_Sb_m),
        ti_Sc_m: Math.round(rf.ti_Sc_m),
        ti_Sd_m: Math.round(rf.ti_Sd_m),
        ti_Ea_m: Math.round(rf.ti_Ea_m),
        ti_Fa_m: Math.round(rf.ti_Fa_m),
        ti_Fb_m: Math.round(rf.ti_Fb_m),

        ti_Ha_e: Math.round(rf.ti_Ha_e),
        ti_Hb_e: Math.round(rf.ti_Hb_e),
        ti_Hc_e: Math.round(rf.ti_Hc_e),
        ti_Sa_e: Math.round(rf.ti_Sa_e),
        ti_Sb_e: Math.round(rf.ti_Sb_e),
        ti_Sc_e: Math.round(rf.ti_Sc_e),
        ti_Sd_e: Math.round(rf.ti_Sd_e),
        ti_Ea_e: Math.round(rf.ti_Ea_e),
        ti_Fa_e: Math.round(rf.ti_Fa_e),
        ti_Fb_e: Math.round(rf.ti_Fb_e),

        ti_Ha: Math.round(rf.ti_Ha),
        ti_Hb: Math.round(rf.ti_Hb),
        ti_Hc: Math.round(rf.ti_Hc),
        ti_Sa: Math.round(rf.ti_Sa),
        ti_Sb: Math.round(rf.ti_Sb),
        ti_Sc: Math.round(rf.ti_Sc),
        ti_Sd: Math.round(rf.ti_Sd),
        ti_Ea: Math.round(rf.ti_Ea),
        ti_Fa: Math.round(rf.ti_Fa),
        ti_Fb: Math.round(rf.ti_Fb),

        ti: Math.round(rf.ti),

        causes: rf.causes.map((c: any) => ({
          id: c.cause.cr4de_riskfilesid,
          cascadeId: c.cause.cr4de_bnrariskcascadeid,

          title: c.cause.cr4de_title,

          ip_c: c.ip_c,
          ip_m: c.ip_m,
          ip_e: c.ip_e,
          ip: c.ip_c + c.ip_m + c.ip_e,
        })),

        effects: rf.effects.map((e: any) => ({
          risk: e.effect.cr4de_riskfilesid,
          cascadeId: e.cause.cr4de_bnrariskcascadeid,

          title: e.cause.cr4de_title,

          ii_Ha_c: Math.round(e.ii_Ha_c),
          ii_Hb_c: Math.round(e.ii_Hb_c),
          ii_Hc_c: Math.round(e.ii_Hc_c),
          ii_Sa_c: Math.round(e.ii_Sa_c),
          ii_Sb_c: Math.round(e.ii_Sb_c),
          ii_Sc_c: Math.round(e.ii_Sc_c),
          ii_Sd_c: Math.round(e.ii_Sd_c),
          ii_Ea_c: Math.round(e.ii_Ea_c),
          ii_Fa_c: Math.round(e.ii_Fa_c),
          ii_Fb_c: Math.round(e.ii_Fb_c),

          ii_Ha_m: Math.round(e.ii_Ha_m),
          ii_Hb_m: Math.round(e.ii_Hb_m),
          ii_Hc_m: Math.round(e.ii_Hc_m),
          ii_Sa_m: Math.round(e.ii_Sa_m),
          ii_Sb_m: Math.round(e.ii_Sb_m),
          ii_Sc_m: Math.round(e.ii_Sc_m),
          ii_Sd_m: Math.round(e.ii_Sd_m),
          ii_Ea_m: Math.round(e.ii_Ea_m),
          ii_Fa_m: Math.round(e.ii_Fa_m),
          ii_Fb_m: Math.round(e.ii_Fb_m),

          ii_Ha_e: Math.round(e.ii_Ha_e),
          ii_Hb_e: Math.round(e.ii_Hb_e),
          ii_Hc_e: Math.round(e.ii_Hc_e),
          ii_Sa_e: Math.round(e.ii_Sa_e),
          ii_Sb_e: Math.round(e.ii_Sb_e),
          ii_Sc_e: Math.round(e.ii_Sc_e),
          ii_Sd_e: Math.round(e.ii_Sd_e),
          ii_Ea_e: Math.round(e.ii_Ea_e),
          ii_Fa_e: Math.round(e.ii_Fa_e),
          ii_Fb_e: Math.round(e.ii_Fb_e),

          ii_Ha: Math.round(e.ii_Ha_c + e.ii_Ha_m + e.ii_Ha_e),
          ii_Hb: Math.round(e.ii_Hb_c + e.ii_Hb_m + e.ii_Hb_e),
          ii_Hc: Math.round(e.ii_Hc_c + e.ii_Hc_m + e.ii_Hc_e),
          ii_Sa: Math.round(e.ii_Sa_c + e.ii_Sa_m + e.ii_Sa_e),
          ii_Sb: Math.round(e.ii_Sb_c + e.ii_Sb_m + e.ii_Sb_e),
          ii_Sc: Math.round(e.ii_Sc_c + e.ii_Sc_m + e.ii_Sc_e),
          ii_Sd: Math.round(e.ii_Sd_c + e.ii_Sd_m + e.ii_Sd_e),
          ii_Ea: Math.round(e.ii_Ea_c + e.ii_Ea_m + e.ii_Ea_e),
          ii_Fa: Math.round(e.ii_Fa_c + e.ii_Fa_m + e.ii_Fa_e),
          ii_Fb: Math.round(e.ii_Fb_c + e.ii_Fb_m + e.ii_Fb_e),
        })),
      };

      await fetch(`https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${rf.cr4de_riskfilesid})`, {
        method: "PATCH",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQzMjMxOCwibmJmIjoxNjY0NDMyMzE5LCJleHAiOjE2NjQ0MzMyMTksImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.DSkyEOprtyUJ6juSh5fp1wRUTuH29GQpvLKpGS-rAJfOO98ZQmhzCkdj4zbq3BEH_XJDEJ2wIlvuNscu1HhfV55A37im1Lt0R-Im3rikctYX4mcVRlCCQJ00NA_KUJs5EPigqBZjo7FY9o1xjVuhXo1mOTs3Ozo18inuX0i5mWcuwEQ4oUPxS__NC4ARKTKfGJ4SHcxC3cdQfCLsCfi--AKfYZh5It4YXnuLnttNkRcFDD08lFBBlVKMOprwCcXJNCvzXEbJx9l9silBz_xWYUjed2PIY0ob_ErUiAj6uvMfJDtRu9cgj0pj2EEXyugYFASI2SU9lpz5_yzgFr5c_w",
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cr4de_calculated: JSON.stringify(calculatedFields),
        }),
      });

      innerLog.splice(innerLog.length - 1, 1, `Saving calculations (${i + 1}/${results.length})`);
      setLog(innerLog);
    }

    innerLog.push("Done");
    setLog(innerLog);
  };

  const runCalculations = async () => {
    setIsCalculating(true);

    const [riskFiles, innerLog] = await prepareRiskFiles();

    if (!riskFiles) return;

    await calculateProbabilities(riskFiles, innerLog);
    await calculateImpacts(riskFiles, innerLog);

    setResults(riskFiles);

    innerLog.push("Done");
    setLog(innerLog);

    setIsCalculating(false);

    console.log(riskFiles);
  };

  return (
    <>
      <Container sx={{ mt: 4, pb: 8 }}>
        <Paper sx={{ p: 2 }}>
          {(!riskFiles || !cascades) && <Typography variant="body1">Loading Risk Files...</Typography>}

          {riskFiles && cascades && (
            <>
              <Typography variant="overline" sx={{ mt: 0, display: "block" }}>
                Loaded {riskFiles.length} Risk Files
              </Typography>
              <Typography variant="overline" sx={{ mb: 2, display: "block" }}>
                Loaded {cascades.length} Cascades
              </Typography>

              {log.map((l, i) => (
                <Typography key={i} variant="overline" sx={{ mt: 0, display: "block" }}>
                  {l}
                </Typography>
              ))}

              <Stack direction="row">
                <Button sx={{ mt: 2 }} onClick={runCalculations}>
                  Start calculation
                </Button>
                {results && !isCalculating && (
                  <Button sx={{ mt: 2 }} onClick={saveResults}>
                    Save results
                  </Button>
                )}
              </Stack>
            </>
          )}
        </Paper>
      </Container>
    </>
  );
}
