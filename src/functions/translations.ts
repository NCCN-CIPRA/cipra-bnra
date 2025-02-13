import { DVRiskFile } from "../types/dataverse/DVRiskFile";

export type Language = "nl" | "fr" | "de" | "en";

export const getLanguage = (rawLanguage: string): Language => {
    if (rawLanguage === "nl" || (rawLanguage.toLowerCase().indexOf("nl") >= 0)) return "nl";
    if (rawLanguage === "fr" || rawLanguage.toLowerCase().indexOf("fr") >= 0) return "fr";
    if (rawLanguage === "de" || rawLanguage.toLowerCase().indexOf("de") >= 0) return "de";
    return "en";
}

export const getSummary = (rf: DVRiskFile, rawLanguage: string) => {
    const lan = getLanguage(rawLanguage);

    if (lan === "nl" || lan.toLowerCase().indexOf("nl") >= 0) return rf.cr4de_mrs_summary_nl;
    if (lan === "fr" || lan.toLowerCase().indexOf("fr") >= 0) return rf.cr4de_mrs_summary_fr;
    if (lan === "de" || lan.toLowerCase().indexOf("de") >= 0) return rf.cr4de_mrs_summary_de;
    
    return rf.cr4de_mrs_summary;
  };