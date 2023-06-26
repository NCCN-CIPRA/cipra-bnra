export enum QUALITY {
  CONSENSUS,
  AVERAGE,
  ZERO,
}

export default interface AnalysisData {
  metrics: {
    runtime_s: number;
  };
  quality: {
    directAnalyses: {
      consensus: number;
      average: number;
      zeroed: number;
      total: number;
    };
    cascadeAnalyses: {
      consensus: number;
      average: number;
      zoroed: number;
      total: number;
    };
    riskFiles: {
      id: string;
      directAnalysis: {
        cr4de_dp_quanti_c: number;
        cr4de_dp_quanti_m: number;
        cr4de_dp_quanti_e: number;

        cr4de_di_quanti_ha_c: number;
        cr4de_di_quanti_hb_c: number;
        cr4de_di_quanti_hc_c: number;
        cr4de_di_quanti_sa_c: number;
        cr4de_di_quanti_sb_c: number;
        cr4de_di_quanti_sc_c: number;
        cr4de_di_quanti_sd_c: number;
        cr4de_di_quanti_ea_c: number;
        cr4de_di_quanti_fa_c: number;
        cr4de_di_quanti_fb_c: number;

        cr4de_di_quanti_ha_m: number;
        cr4de_di_quanti_hb_m: number;
        cr4de_di_quanti_hc_m: number;
        cr4de_di_quanti_sa_m: number;
        cr4de_di_quanti_sb_m: number;
        cr4de_di_quanti_sc_m: number;
        cr4de_di_quanti_sd_m: number;
        cr4de_di_quanti_ea_m: number;
        cr4de_di_quanti_fa_m: number;
        cr4de_di_quanti_fb_m: number;

        cr4de_di_quanti_ha_e: number;
        cr4de_di_quanti_hb_e: number;
        cr4de_di_quanti_hc_e: number;
        cr4de_di_quanti_sa_e: number;
        cr4de_di_quanti_sb_e: number;
        cr4de_di_quanti_sc_e: number;
        cr4de_di_quanti_sd_e: number;
        cr4de_di_quanti_ea_e: number;
        cr4de_di_quanti_fa_e: number;
        cr4de_di_quanti_fb_e: number;

        cr4de_climate_change_quanti_c: number;
        cr4de_climate_change_quanti_m: number;
        cr4de_climate_change_quanti_e: number;

        quality: QUALITY;
      };
      causes: [
        {
          id: string;

          cr4de_c2c: number;
          cr4de_c2m: number;
          cr4de_c2e: number;
          cr4de_m2c: number;
          cr4de_m2m: number;
          cr4de_m2e: number;
          cr4de_e2c: number;
          cr4de_e2m: number;
          cr4de_e2e: number;

          quality: QUALITY;
        }
      ];
    };
  };
}
