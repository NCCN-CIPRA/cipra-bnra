import { Ea } from "../../components/indicators/E";
import { Fa, Fb } from "../../components/indicators/F";
import { Ha } from "../../components/indicators/Ha";
import { Hb } from "../../components/indicators/Hb";
import { Hc } from "../../components/indicators/Hc";
import { Sa, Sb, Sc, Sc7, Sd, Sd7 } from "../../components/indicators/S";
import { prettyRound } from "../roundNumberString";

export type QuantiIndicator =
  | "ha"
  | "hb"
  | "hc"
  | "sa"
  | "sb"
  | "ea"
  | "fa"
  | "fb";
export type Indicator = QuantiIndicator | "sc" | "sd";

export const Impacts = {
  ha: Ha,
  hb: Hb,
  hc: Hc,
  sa: Sa,
  sb: Sb,
  sc: Sc,
  sd: Sd,
  ea: Ea,
  fa: Fa,
  fb: Fb,
};

export const ImpactColor = {
  Ha: "#de6148",
  Hb: "#f39d87",
  Hc: "#ffd7cc",
  Sa: "#bca632",
  Sb: "#d2ba37",
  Sc: "#e8ce3d",
  Sd: "#ffe342",
  Ea: "#83af70",
  Fa: "#6996b3",
  Fb: "#c1e7ff",
};

/**
 *
 * @param iScale7 The number on the 0-7 point scale
 * @param aggregation The amount of damage indicators that are aggregated in the scale
 *
 */
export function eurosFromIScale7(iScale7: number, aggregation: number = 1) {
  if (iScale7 <= 0.5) {
    // Linear from 0 to 0.5
    return (iScale7 / 0.5) * 500000;
  }

  return aggregation * Math.exp(1.92 * (iScale7 - 0.5) + 13.2);
}

export function iScale7FromEuros(
  euros: number,
  aggregation: number = 1,
  round = 10,
) {
  if (euros <= 500000) {
    return Math.round(round * (euros / 500000) * 0.5) / round;
  }

  return (
    Math.round(round * ((Math.log(euros / aggregation) - 13.2) / 1.92 + 0.5)) /
    round
  );
}

const BASE_TI_SCALE_5_IMPACT = 8 * 10 ** 8;

export function tiScale5FromEuros(euros: number, round = 10) {
  if (euros < BASE_TI_SCALE_5_IMPACT) return euros / BASE_TI_SCALE_5_IMPACT;

  return (
    Math.round(
      round * (1 + Math.log10(euros / BASE_TI_SCALE_5_IMPACT) / Math.log10(5)),
    ) / round
  );
}

export function eurosFromTIScale5(tiScale5: number) {
  if (tiScale5 <= 1) return tiScale5 * BASE_TI_SCALE_5_IMPACT;

  return BASE_TI_SCALE_5_IMPACT * Math.pow(5, tiScale5 - 1);
}

export function tiScale5to7(tiScale5: number, round = 10) {
  return iScale7FromEuros(eurosFromTIScale5(tiScale5), 10, round);
}

export function tiScale7to5(iScale7: number, round = 10) {
  return tiScale5FromEuros(eurosFromIScale7(iScale7, 10), round);
}

const BASE_DI_SCALE_5_IMPACT = 5000000;

export function eurosFromDIScale5(diScale5: number) {
  if (diScale5 <= 0.5) return (diScale5 / 0.5) * BASE_DI_SCALE_5_IMPACT;

  return 1600000 * Math.pow(10, diScale5);
}

export function diScale5FromEuros(euros: number, round = 2) {
  if (euros <= BASE_DI_SCALE_5_IMPACT)
    return Math.round(round * (euros / BASE_DI_SCALE_5_IMPACT) * 0.5) / round;

  return Math.round(round * Math.log10(euros / 1600000)) / round;
}

export function diScale5to7(diScale5: number, round = 10) {
  return iScale7FromEuros(eurosFromDIScale5(diScale5), 1, round);
}

export function diScale7to5(iScale7: number, round = 10) {
  return diScale5FromEuros(eurosFromIScale7(iScale7), round);
}

export function categoryImpactScale5to7(iScale5: number) {
  return (iScale5 / 5) * 7;
}

export function categoryImpactScale7to5(iScale7: number) {
  return (iScale7 / 7) * 5;
}

const eurosFactor: Record<QuantiIndicator, number> = {
  ha: 10 / 50000000,
  hb: 100 / 50000000,
  hc: 200000 / 50000000,
  sa: 10000 / 50000000,
  sb: 100000 / 50000000,
  ea: 1000 / 50000000,
  fa: 1,
  fb: 1,
};

const units: Record<QuantiIndicator, string> = {
  ha: "human casualties",
  hb: "weighted sick or injured people",
  hc: "person days of people in need of assistance",
  sa: "person days of people with weighted unmet needs",
  sb: "person days of people experiencing diminished public order or sense of security",
  ea: "km² years of affected area",
  fa: "€ of financial asset damages",
  fb: "€-equivalent of macro-economic losses",
};

export function getIntervalStringQuantiScale5(
  scale5: number,
  prefix: keyof typeof eurosFactor,
) {
  const factor = eurosFactor[prefix];

  return getIntervalStringQuantiScale(
    scale5,
    units[prefix],
    factor,
    eurosFromDIScale5,
    5,
  );
}

export function getIntervalStringQuantiScale7(
  scale7: number,
  prefix: Indicator,
) {
  if (prefix === "sc" || prefix === "sd") {
    return getIntervalStringQualiScale(scale7, prefix, 7);
  }

  const factor = eurosFactor[prefix];

  return getIntervalStringQuantiScale(
    scale7,
    units[prefix],
    factor,
    eurosFromIScale7,
    7,
  );
}

function getIntervalStringQuantiScale(
  scale: number,
  unit: string,
  factor: number,
  eurosGetter: (n: number) => number,
  maxScale: number,
) {
  if (scale <= 0) return `0 ${unit}`;

  if (scale <= 1)
    return `< ${prettyRound(eurosGetter(scale + 0.5) * factor)} ${unit}`;

  if (scale >= maxScale)
    return `> ${prettyRound(eurosGetter(scale - 0.5) * factor)} ${unit}`;

  return `${prettyRound(eurosGetter(scale - 0.5) * factor)} - ${prettyRound(
    eurosGetter(scale + 0.5) * factor,
  )} ${unit}`;
}

function getIntervalStringQualiScale(
  scale: number,
  prefix: Indicator,
  maxScale: number,
) {
  if (scale <= 0) return `No impact`;

  const nearestScale = Math.round(scale);
  let intervals;
  if (prefix === "sc") {
    if (maxScale > 5) intervals = Sc7.intervals;
    else intervals = Sc.intervals;
  } else {
    if (maxScale > 5) intervals = Sd7.intervals;
    else intervals = Sd.intervals;
  }

  return intervals[nearestScale][1];
}

export function getImpactStringDIScale5(diScale5: number, prefix: string) {
  const p = prefix.toLowerCase();

  if (p in eurosFactor)
    return getIntervalStringQuantiScale5(
      diScale5,
      p as keyof typeof eurosFactor,
    );

  return "";
}

export function getImpactStringIScale7(iScale7: number, prefix: string) {
  const p = prefix.toLowerCase();

  if (p in eurosFactor)
    return getIntervalStringQuantiScale7(
      iScale7,
      p as keyof typeof eurosFactor,
    );

  return "";
}
