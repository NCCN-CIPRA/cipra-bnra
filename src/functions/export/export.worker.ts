import "./workerShim";

import { createElement } from "react";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import DataverseBackend from "../i18Backend";
import renderSVG from "./renderSVG";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import { Cascades, getCascades } from "../cascades";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { BNRAExport } from "../../components/export/BNRAExport";
import RiskFileExport from "../../components/export/RiskFilePDF";
import exportExcel from "./exportExcel";
import svg2PDF from "../svg2PDF.worker";
import "../../components/export/fonts";
import FrontPageExport from "../../components/export/FontPageExport";
import { expose } from "comlink";

export enum EXPORT_TYPE {
  ALL = "ALL",
  SINGLE = "SINGLE",
  DATA = "DATA",
  FRONTPAGE = "FRONT_PAGE",
}

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .use(new DataverseBackend())
  .init({
    lng: "en",
    debug: false,
    fallbackLng: "en",
    saveMissing: true,
    load: "languageOnly",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: false,
    },
  });

const exportBNRA = async (
  data: {
    exportType: EXPORT_TYPE;
    exportedRiskFiles: DVRiskFile[];
    riskFiles: DVRiskFile[];
    allCascades: DVRiskCascade[];
    allAttachments: DVAttachment[];
  },
  onProgress: (message: string) => void
): Promise<Blob | null> => {
  try {
    const {
      exportType,
      exportedRiskFiles,
      riskFiles,
      allCascades,
      allAttachments,
    } = data;
    onProgress("Start export process...");
    const { pdf } = await import("@react-pdf/renderer");

    let doc: Blob;

    const hc: { [key: string]: DVRiskFile } = riskFiles.reduce(
      (acc, sr) => ({ ...acc, [sr.cr4de_riskfilesid]: sr }),
      {}
    );
    const riskCascades: DVRiskCascade<SmallRisk, SmallRisk>[] = allCascades.map(
      (c) => ({
        ...c,
        cr4de_cause_hazard: hc[c._cr4de_cause_hazard_value],
        cr4de_effect_hazard: hc[c._cr4de_effect_hazard_value],
      })
    );

    const cascades: { [key: string]: Cascades } = riskFiles.reduce(
      (acc, rf) => getCascades(rf, acc, hc)(riskCascades),
      {}
    );

    if (exportType === EXPORT_TYPE.DATA) {
      doc = exportExcel({
        exportedRiskFiles,
        riskFiles,
        allCascades,
      });
    } else if (exportType === EXPORT_TYPE.FRONTPAGE) {
      const svgImages = await renderSVG([], {}, svg2PDF);
      doc = await pdf(
        createElement(FrontPageExport, {
          svgImages,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any
      ).toBlob();
    } else {
      const svgImages = await renderSVG(
        exportType === EXPORT_TYPE.ALL ? riskFiles : exportedRiskFiles,
        cascades,
        svg2PDF
      );

      onProgress("Rendering charts complete.");

      if (exportType === EXPORT_TYPE.SINGLE) {
        doc = await pdf(
          createElement(RiskFileExport, {
            toExport: exportedRiskFiles,
            allCascades: cascades,
            svgImages,
            allAttachments: allAttachments.map((a) => ({
              ...a,
              cr4de_risk_file: a._cr4de_risk_file_value
                ? hc[a._cr4de_risk_file_value]
                : null,
            })),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          }) as any
        ).toBlob();
      } else {
        doc = await pdf(
          createElement(BNRAExport, {
            riskFiles,
            allCascades: cascades,
            allAttachments: allAttachments.map((a) => ({
              ...a,
              cr4de_risk_file: a._cr4de_risk_file_value
                ? hc[a._cr4de_risk_file_value]
                : null,
            })),
            svgImages,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          }) as any
        ).toBlob();
      }
    }

    onProgress("Rendering complete");
    onProgress("Opening preview...");

    return doc;
    // return doc;
  } catch (e) {
    console.log("Rendering error", e);

    return null;
  }
};

const operations = { exportBNRA };

expose(operations);

export type ExportBNRAWorker = typeof operations;
