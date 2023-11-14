import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";

export default function calculateIndirectImpacts(risk: RiskCalculation, damping: number = 1) {
  risk.effects.forEach((cascade) => {
    cascade.ii_Ha_c =
      cascade.c2c * (cascade.effect.ti_Ha_c || 0) * damping +
      cascade.c2m * (cascade.effect.ti_Ha_m || 0) * damping +
      cascade.c2e * (cascade.effect.ti_Ha_e || 0) * damping;
    cascade.ii_Hb_c =
      cascade.c2c * (cascade.effect.ti_Hb_c || 0) * damping +
      cascade.c2m * (cascade.effect.ti_Hb_m || 0) * damping +
      cascade.c2e * (cascade.effect.ti_Hb_e || 0) * damping;
    cascade.ii_Hc_c =
      cascade.c2c * (cascade.effect.ti_Hc_c || 0) * damping +
      cascade.c2m * (cascade.effect.ti_Hc_m || 0) * damping +
      cascade.c2e * (cascade.effect.ti_Hc_e || 0) * damping;
    cascade.ii_Sa_c =
      cascade.c2c * (cascade.effect.ti_Sa_c || 0) * damping +
      cascade.c2m * (cascade.effect.ti_Sa_m || 0) * damping +
      cascade.c2e * (cascade.effect.ti_Sa_e || 0) * damping;
    cascade.ii_Sb_c =
      cascade.c2c * (cascade.effect.ti_Sb_c || 0) * damping +
      cascade.c2m * (cascade.effect.ti_Sb_m || 0) * damping +
      cascade.c2e * (cascade.effect.ti_Sb_e || 0) * damping;
    cascade.ii_Sc_c =
      cascade.c2c * (cascade.effect.ti_Sc_c || 0) * damping +
      cascade.c2m * (cascade.effect.ti_Sc_m || 0) * damping +
      cascade.c2e * (cascade.effect.ti_Sc_e || 0) * damping;
    cascade.ii_Sd_c =
      cascade.c2c * (cascade.effect.ti_Sd_c || 0) * damping +
      cascade.c2m * (cascade.effect.ti_Sd_m || 0) * damping +
      cascade.c2e * (cascade.effect.ti_Sd_e || 0) * damping;
    cascade.ii_Ea_c =
      cascade.c2c * (cascade.effect.ti_Ea_c || 0) * damping +
      cascade.c2m * (cascade.effect.ti_Ea_m || 0) * damping +
      cascade.c2e * (cascade.effect.ti_Ea_e || 0) * damping;
    cascade.ii_Fa_c =
      cascade.c2c * (cascade.effect.ti_Fa_c || 0) * damping +
      cascade.c2m * (cascade.effect.ti_Fa_m || 0) * damping +
      cascade.c2e * (cascade.effect.ti_Fa_e || 0) * damping;
    cascade.ii_Fb_c =
      cascade.c2c * (cascade.effect.ti_Fb_c || 0) * damping +
      cascade.c2m * (cascade.effect.ti_Fb_m || 0) * damping +
      cascade.c2e * (cascade.effect.ti_Fb_e || 0) * damping;

    cascade.ii_Ha_m =
      cascade.m2c * (cascade.effect.ti_Ha_c || 0) * damping +
      cascade.m2m * (cascade.effect.ti_Ha_m || 0) * damping +
      cascade.m2e * (cascade.effect.ti_Ha_e || 0) * damping;
    cascade.ii_Hb_m =
      cascade.m2c * (cascade.effect.ti_Hb_c || 0) * damping +
      cascade.m2m * (cascade.effect.ti_Hb_m || 0) * damping +
      cascade.m2e * (cascade.effect.ti_Hb_e || 0) * damping;
    cascade.ii_Hc_m =
      cascade.m2c * (cascade.effect.ti_Hc_c || 0) * damping +
      cascade.m2m * (cascade.effect.ti_Hc_m || 0) * damping +
      cascade.m2e * (cascade.effect.ti_Hc_e || 0) * damping;
    cascade.ii_Sa_m =
      cascade.m2c * (cascade.effect.ti_Sa_c || 0) * damping +
      cascade.m2m * (cascade.effect.ti_Sa_m || 0) * damping +
      cascade.m2e * (cascade.effect.ti_Sa_e || 0) * damping;
    cascade.ii_Sb_m =
      cascade.m2c * (cascade.effect.ti_Sb_c || 0) * damping +
      cascade.m2m * (cascade.effect.ti_Sb_m || 0) * damping +
      cascade.m2e * (cascade.effect.ti_Sb_e || 0) * damping;
    cascade.ii_Sc_m =
      cascade.m2c * (cascade.effect.ti_Sc_c || 0) * damping +
      cascade.m2m * (cascade.effect.ti_Sc_m || 0) * damping +
      cascade.m2e * (cascade.effect.ti_Sc_e || 0) * damping;
    cascade.ii_Sd_m =
      cascade.m2c * (cascade.effect.ti_Sd_c || 0) * damping +
      cascade.m2m * (cascade.effect.ti_Sd_m || 0) * damping +
      cascade.m2e * (cascade.effect.ti_Sd_e || 0) * damping;
    cascade.ii_Ea_m =
      cascade.m2c * (cascade.effect.ti_Ea_c || 0) * damping +
      cascade.m2m * (cascade.effect.ti_Ea_m || 0) * damping +
      cascade.m2e * (cascade.effect.ti_Ea_e || 0) * damping;
    cascade.ii_Fa_m =
      cascade.m2c * (cascade.effect.ti_Fa_c || 0) * damping +
      cascade.m2m * (cascade.effect.ti_Fa_m || 0) * damping +
      cascade.m2e * (cascade.effect.ti_Fa_e || 0) * damping;
    cascade.ii_Fb_m =
      cascade.m2c * (cascade.effect.ti_Fb_c || 0) * damping +
      cascade.m2m * (cascade.effect.ti_Fb_m || 0) * damping +
      cascade.m2e * (cascade.effect.ti_Fb_e || 0) * damping;

    cascade.ii_Ha_e =
      cascade.e2c * (cascade.effect.ti_Ha_c || 0) * damping +
      cascade.e2m * (cascade.effect.ti_Ha_m || 0) * damping +
      cascade.e2e * (cascade.effect.ti_Ha_e || 0) * damping;
    cascade.ii_Hb_e =
      cascade.e2c * (cascade.effect.ti_Hb_c || 0) * damping +
      cascade.e2m * (cascade.effect.ti_Hb_m || 0) * damping +
      cascade.e2e * (cascade.effect.ti_Hb_e || 0) * damping;
    cascade.ii_Hc_e =
      cascade.e2c * (cascade.effect.ti_Hc_c || 0) * damping +
      cascade.e2m * (cascade.effect.ti_Hc_m || 0) * damping +
      cascade.e2e * (cascade.effect.ti_Hc_e || 0) * damping;
    cascade.ii_Sa_e =
      cascade.e2c * (cascade.effect.ti_Sa_c || 0) * damping +
      cascade.e2m * (cascade.effect.ti_Sa_m || 0) * damping +
      cascade.e2e * (cascade.effect.ti_Sa_e || 0) * damping;
    cascade.ii_Sb_e =
      cascade.e2c * (cascade.effect.ti_Sb_c || 0) * damping +
      cascade.e2m * (cascade.effect.ti_Sb_m || 0) * damping +
      cascade.e2e * (cascade.effect.ti_Sb_e || 0) * damping;
    cascade.ii_Sc_e =
      cascade.e2c * (cascade.effect.ti_Sc_c || 0) * damping +
      cascade.e2m * (cascade.effect.ti_Sc_m || 0) * damping +
      cascade.e2e * (cascade.effect.ti_Sc_e || 0) * damping;
    cascade.ii_Sd_e =
      cascade.e2c * (cascade.effect.ti_Sd_c || 0) * damping +
      cascade.e2m * (cascade.effect.ti_Sd_m || 0) * damping +
      cascade.e2e * (cascade.effect.ti_Sd_e || 0) * damping;
    cascade.ii_Ea_e =
      cascade.e2c * (cascade.effect.ti_Ea_c || 0) * damping +
      cascade.e2m * (cascade.effect.ti_Ea_m || 0) * damping +
      cascade.e2e * (cascade.effect.ti_Ea_e || 0) * damping;
    cascade.ii_Fa_e =
      cascade.e2c * (cascade.effect.ti_Fa_c || 0) * damping +
      cascade.e2m * (cascade.effect.ti_Fa_m || 0) * damping +
      cascade.e2e * (cascade.effect.ti_Fa_e || 0) * damping;
    cascade.ii_Fb_e =
      cascade.e2c * (cascade.effect.ti_Fb_c || 0) * damping +
      cascade.e2m * (cascade.effect.ti_Fb_m || 0) * damping +
      cascade.e2e * (cascade.effect.ti_Fb_e || 0) * damping;

    cascade.ii_Ha = risk.rp_c * cascade.ii_Ha_c + risk.rp_m * cascade.ii_Ha_m + risk.rp_e * cascade.ii_Ha_e;
    cascade.ii_Hb = risk.rp_c * cascade.ii_Hb_c + risk.rp_m * cascade.ii_Hb_m + risk.rp_e * cascade.ii_Hb_e;
    cascade.ii_Hc = risk.rp_c * cascade.ii_Hc_c + risk.rp_m * cascade.ii_Hc_m + risk.rp_e * cascade.ii_Hc_e;
    cascade.ii_Sa = risk.rp_c * cascade.ii_Sa_c + risk.rp_m * cascade.ii_Sa_m + risk.rp_e * cascade.ii_Sa_e;
    cascade.ii_Sb = risk.rp_c * cascade.ii_Sb_c + risk.rp_m * cascade.ii_Sb_m + risk.rp_e * cascade.ii_Sb_e;
    cascade.ii_Sc = risk.rp_c * cascade.ii_Sc_c + risk.rp_m * cascade.ii_Sc_m + risk.rp_e * cascade.ii_Sc_e;
    cascade.ii_Sd = risk.rp_c * cascade.ii_Sd_c + risk.rp_m * cascade.ii_Sd_m + risk.rp_e * cascade.ii_Sd_e;
    cascade.ii_Ea = risk.rp_c * cascade.ii_Ea_c + risk.rp_m * cascade.ii_Ea_m + risk.rp_e * cascade.ii_Ea_e;
    cascade.ii_Fa = risk.rp_c * cascade.ii_Fa_c + risk.rp_m * cascade.ii_Fa_m + risk.rp_e * cascade.ii_Fa_e;
    cascade.ii_Fb = risk.rp_c * cascade.ii_Fb_c + risk.rp_m * cascade.ii_Fb_m + risk.rp_e * cascade.ii_Fb_e;

    cascade.ii =
      cascade.ii_Ha +
      cascade.ii_Hb +
      cascade.ii_Hc +
      cascade.ii_Sa +
      cascade.ii_Sb +
      cascade.ii_Sc +
      cascade.ii_Sd +
      cascade.ii_Ea +
      cascade.ii_Fa +
      cascade.ii_Fb;
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

  risk.ii_c =
    risk.ii_Ha_c +
    risk.ii_Hb_c +
    risk.ii_Hc_c +
    risk.ii_Sa_c +
    risk.ii_Sb_c +
    risk.ii_Sc_c +
    risk.ii_Sd_c +
    risk.ii_Ea_c +
    risk.ii_Fa_c +
    risk.ii_Fb_c;

  risk.ii_m =
    risk.ii_Ha_m +
    risk.ii_Hb_m +
    risk.ii_Hc_m +
    risk.ii_Sa_m +
    risk.ii_Sb_m +
    risk.ii_Sc_m +
    risk.ii_Sd_m +
    risk.ii_Ea_m +
    risk.ii_Fa_m +
    risk.ii_Fb_m;

  risk.ii_e =
    risk.ii_Ha_e +
    risk.ii_Hb_e +
    risk.ii_Hc_e +
    risk.ii_Sa_e +
    risk.ii_Sb_e +
    risk.ii_Sc_e +
    risk.ii_Sd_e +
    risk.ii_Ea_e +
    risk.ii_Fa_e +
    risk.ii_Fb_e;

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
