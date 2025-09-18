import "./workerShim";

import { createElement } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import DataverseBackend from "../i18Backend";
import renderSVG from "./renderSVG";
import { getParsedCascadesSnapshotCatalogue } from "../cascades";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { BNRAExport } from "../../components/export/BNRAExport";
import RiskFileExport from "../../components/export/RiskFilePDF";
import exportExcel from "./exportExcel";
import svg2PDF from "../svg2PDF.worker";
import "../../components/export/fonts";
import FrontPageExport from "../../components/export/FontPageExport";
import { expose } from "comlink";
import { DVRiskSummary } from "../../types/dataverse/DVRiskSummary";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";
import { getRiskCatalogueFromSnapshots } from "../riskfiles";

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
    exportedRiskFiles: DVRiskSummary[];
    riskFiles: DVRiskSummary[];
    riskSnapshots: DVRiskSnapshot[];
    allCascades: DVCascadeSnapshot<unknown, DVRiskSnapshot, DVRiskSnapshot>[];
    allAttachments: DVAttachment[];
  },
  onProgress: (message: string) => void
): Promise<Blob | null> => {
  try {
    const {
      exportType,
      exportedRiskFiles,
      riskFiles,
      riskSnapshots,
      allCascades,
      allAttachments,
    } = data;
    onProgress("Start export process...");
    const { pdf } = await import("@react-pdf/renderer");

    let doc: Blob;

    const hc = getRiskCatalogueFromSnapshots(riskSnapshots);
    const cascades = getParsedCascadesSnapshotCatalogue(
      riskSnapshots,
      hc,
      allCascades
    );

    if (exportType === EXPORT_TYPE.DATA) {
      doc = exportExcel({
        exportedRiskFiles,
        riskSnapshots: hc,
        cascadeCatalogue: cascades,
      });
    } else if (exportType === EXPORT_TYPE.FRONTPAGE) {
      const svgImages = await renderSVG([], {}, {}, svg2PDF);
      doc = await pdf(
        createElement(FrontPageExport, {
          svgImages,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any
      ).toBlob();
    } else {
      const svgImages = await renderSVG(
        exportType === EXPORT_TYPE.ALL ? riskFiles : exportedRiskFiles,
        hc,
        cascades,
        svg2PDF
      );

      onProgress("Rendering charts complete.");

      if (exportType === EXPORT_TYPE.SINGLE) {
        doc = await pdf(
          createElement(RiskFileExport, {
            toExport: exportedRiskFiles,
            riskSnapshots: hc,
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
            riskSnapshots: hc,
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
