import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";

export default function calculateIndirectImpacts(risk: RiskCalculation) {
  risk.effects.forEach((effect) => {
    effect.ii_Ha_c =
      effect.c2c * (effect.risk.ti_Ha_c || 0) +
      effect.c2m * (effect.risk.ti_Ha_m || 0) +
      effect.c2e * (effect.risk.ti_Ha_e || 0);
    effect.ii_Hb_c =
      effect.c2c * (effect.risk.ti_Hb_c || 0) +
      effect.c2m * (effect.risk.ti_Hb_m || 0) +
      effect.c2e * (effect.risk.ti_Hb_e || 0);
    effect.ii_Hc_c =
      effect.c2c * (effect.risk.ti_Hc_c || 0) +
      effect.c2m * (effect.risk.ti_Hc_m || 0) +
      effect.c2e * (effect.risk.ti_Hc_e || 0);
    effect.ii_Sa_c =
      effect.c2c * (effect.risk.ti_Sa_c || 0) +
      effect.c2m * (effect.risk.ti_Sa_m || 0) +
      effect.c2e * (effect.risk.ti_Sa_e || 0);
    effect.ii_Sb_c =
      effect.c2c * (effect.risk.ti_Sb_c || 0) +
      effect.c2m * (effect.risk.ti_Sb_m || 0) +
      effect.c2e * (effect.risk.ti_Sb_e || 0);
    effect.ii_Sc_c =
      effect.c2c * (effect.risk.ti_Sc_c || 0) +
      effect.c2m * (effect.risk.ti_Sc_m || 0) +
      effect.c2e * (effect.risk.ti_Sc_e || 0);
    effect.ii_Sd_c =
      effect.c2c * (effect.risk.ti_Sd_c || 0) +
      effect.c2m * (effect.risk.ti_Sd_m || 0) +
      effect.c2e * (effect.risk.ti_Sd_e || 0);
    effect.ii_Ea_c =
      effect.c2c * (effect.risk.ti_Ea_c || 0) +
      effect.c2m * (effect.risk.ti_Ea_m || 0) +
      effect.c2e * (effect.risk.ti_Ea_e || 0);
    effect.ii_Fa_c =
      effect.c2c * (effect.risk.ti_Fa_c || 0) +
      effect.c2m * (effect.risk.ti_Fa_m || 0) +
      effect.c2e * (effect.risk.ti_Fa_e || 0);
    effect.ii_Fb_c =
      effect.c2c * (effect.risk.ti_Fb_c || 0) +
      effect.c2m * (effect.risk.ti_Fb_m || 0) +
      effect.c2e * (effect.risk.ti_Fb_e || 0);

    effect.ii_Ha_m =
      effect.m2c * (effect.risk.ti_Ha_c || 0) +
      effect.m2m * (effect.risk.ti_Ha_m || 0) +
      effect.m2e * (effect.risk.ti_Ha_e || 0);
    effect.ii_Hb_m =
      effect.m2c * (effect.risk.ti_Hb_c || 0) +
      effect.m2m * (effect.risk.ti_Hb_m || 0) +
      effect.m2e * (effect.risk.ti_Hb_e || 0);
    effect.ii_Hc_m =
      effect.m2c * (effect.risk.ti_Hc_c || 0) +
      effect.m2m * (effect.risk.ti_Hc_m || 0) +
      effect.m2e * (effect.risk.ti_Hc_e || 0);
    effect.ii_Sa_m =
      effect.m2c * (effect.risk.ti_Sa_c || 0) +
      effect.m2m * (effect.risk.ti_Sa_m || 0) +
      effect.m2e * (effect.risk.ti_Sa_e || 0);
    effect.ii_Sb_m =
      effect.m2c * (effect.risk.ti_Sb_c || 0) +
      effect.m2m * (effect.risk.ti_Sb_m || 0) +
      effect.m2e * (effect.risk.ti_Sb_e || 0);
    effect.ii_Sc_m =
      effect.m2c * (effect.risk.ti_Sc_c || 0) +
      effect.m2m * (effect.risk.ti_Sc_m || 0) +
      effect.m2e * (effect.risk.ti_Sc_e || 0);
    effect.ii_Sd_m =
      effect.m2c * (effect.risk.ti_Sd_c || 0) +
      effect.m2m * (effect.risk.ti_Sd_m || 0) +
      effect.m2e * (effect.risk.ti_Sd_e || 0);
    effect.ii_Ea_m =
      effect.m2c * (effect.risk.ti_Ea_c || 0) +
      effect.m2m * (effect.risk.ti_Ea_m || 0) +
      effect.m2e * (effect.risk.ti_Ea_e || 0);
    effect.ii_Fa_m =
      effect.m2c * (effect.risk.ti_Fa_c || 0) +
      effect.m2m * (effect.risk.ti_Fa_m || 0) +
      effect.m2e * (effect.risk.ti_Fa_e || 0);
    effect.ii_Fb_m =
      effect.m2c * (effect.risk.ti_Fb_c || 0) +
      effect.m2m * (effect.risk.ti_Fb_m || 0) +
      effect.m2e * (effect.risk.ti_Fb_e || 0);

    effect.ii_Ha_e =
      effect.e2c * (effect.risk.ti_Ha_c || 0) +
      effect.e2m * (effect.risk.ti_Ha_m || 0) +
      effect.e2e * (effect.risk.ti_Ha_e || 0);
    effect.ii_Hb_e =
      effect.e2c * (effect.risk.ti_Hb_c || 0) +
      effect.e2m * (effect.risk.ti_Hb_m || 0) +
      effect.e2e * (effect.risk.ti_Hb_e || 0);
    effect.ii_Hc_e =
      effect.e2c * (effect.risk.ti_Hc_c || 0) +
      effect.e2m * (effect.risk.ti_Hc_m || 0) +
      effect.e2e * (effect.risk.ti_Hc_e || 0);
    effect.ii_Sa_e =
      effect.e2c * (effect.risk.ti_Sa_c || 0) +
      effect.e2m * (effect.risk.ti_Sa_m || 0) +
      effect.e2e * (effect.risk.ti_Sa_e || 0);
    effect.ii_Sb_e =
      effect.e2c * (effect.risk.ti_Sb_c || 0) +
      effect.e2m * (effect.risk.ti_Sb_m || 0) +
      effect.e2e * (effect.risk.ti_Sb_e || 0);
    effect.ii_Sc_e =
      effect.e2c * (effect.risk.ti_Sc_c || 0) +
      effect.e2m * (effect.risk.ti_Sc_m || 0) +
      effect.e2e * (effect.risk.ti_Sc_e || 0);
    effect.ii_Sd_e =
      effect.e2c * (effect.risk.ti_Sd_c || 0) +
      effect.e2m * (effect.risk.ti_Sd_m || 0) +
      effect.e2e * (effect.risk.ti_Sd_e || 0);
    effect.ii_Ea_e =
      effect.e2c * (effect.risk.ti_Ea_c || 0) +
      effect.e2m * (effect.risk.ti_Ea_m || 0) +
      effect.e2e * (effect.risk.ti_Ea_e || 0);
    effect.ii_Fa_e =
      effect.e2c * (effect.risk.ti_Fa_c || 0) +
      effect.e2m * (effect.risk.ti_Fa_m || 0) +
      effect.e2e * (effect.risk.ti_Fa_e || 0);
    effect.ii_Fb_e =
      effect.e2c * (effect.risk.ti_Fb_c || 0) +
      effect.e2m * (effect.risk.ti_Fb_m || 0) +
      effect.e2e * (effect.risk.ti_Fb_e || 0);

    effect.ii_Ha = risk.rp_c * effect.ii_Ha_c + risk.rp_m * effect.ii_Ha_m + risk.rp_e * effect.ii_Ha_e;
    effect.ii_Hb = risk.rp_c * effect.ii_Hb_c + risk.rp_m * effect.ii_Hb_m + risk.rp_e * effect.ii_Hb_e;
    effect.ii_Hc = risk.rp_c * effect.ii_Hc_c + risk.rp_m * effect.ii_Hc_m + risk.rp_e * effect.ii_Hc_e;
    effect.ii_Sa = risk.rp_c * effect.ii_Sa_c + risk.rp_m * effect.ii_Sa_m + risk.rp_e * effect.ii_Sa_e;
    effect.ii_Sb = risk.rp_c * effect.ii_Sb_c + risk.rp_m * effect.ii_Sb_m + risk.rp_e * effect.ii_Sb_e;
    effect.ii_Sc = risk.rp_c * effect.ii_Sc_c + risk.rp_m * effect.ii_Sc_m + risk.rp_e * effect.ii_Sc_e;
    effect.ii_Sd = risk.rp_c * effect.ii_Sd_c + risk.rp_m * effect.ii_Sd_m + risk.rp_e * effect.ii_Sd_e;
    effect.ii_Ea = risk.rp_c * effect.ii_Ea_c + risk.rp_m * effect.ii_Ea_m + risk.rp_e * effect.ii_Ea_e;
    effect.ii_Fa = risk.rp_c * effect.ii_Fa_c + risk.rp_m * effect.ii_Fa_m + risk.rp_e * effect.ii_Fa_e;
    effect.ii_Fb = risk.rp_c * effect.ii_Fb_c + risk.rp_m * effect.ii_Fb_m + risk.rp_e * effect.ii_Fb_e;

    effect.ii =
      effect.ii_Ha +
      effect.ii_Hb +
      effect.ii_Hc +
      effect.ii_Sa +
      effect.ii_Sb +
      effect.ii_Sc +
      effect.ii_Sd +
      effect.ii_Ea +
      effect.ii_Fa +
      effect.ii_Fb;
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
}
