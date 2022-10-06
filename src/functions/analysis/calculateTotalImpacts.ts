import { RiskCalculation } from "../../types/RiskCalculation";

export default function calculateTotalImpacts(risk: RiskCalculation) {
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

  risk.di_c =
    risk.di_Ha_c +
    risk.di_Hb_c +
    risk.di_Hc_c +
    risk.di_Sa_c +
    risk.di_Sb_c +
    risk.di_Sc_c +
    risk.di_Sd_c +
    risk.di_Ea_c +
    risk.di_Fa_c +
    risk.di_Fb_c;

  risk.di_m =
    risk.di_Ha_m +
    risk.di_Hb_m +
    risk.di_Hc_m +
    risk.di_Sa_m +
    risk.di_Sb_m +
    risk.di_Sc_m +
    risk.di_Sd_m +
    risk.di_Ea_m +
    risk.di_Fa_m +
    risk.di_Fb_m;

  risk.di_e =
    risk.di_Ha_e +
    risk.di_Hb_e +
    risk.di_Hc_e +
    risk.di_Sa_e +
    risk.di_Sb_e +
    risk.di_Sc_e +
    risk.di_Sd_e +
    risk.di_Ea_e +
    risk.di_Fa_e +
    risk.di_Fb_e;

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
}
