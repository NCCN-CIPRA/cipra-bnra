import { EXPORT_TYPE } from "../../functions/export/export.worker";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { proxy, wrap } from "vite-plugin-comlink/symbol";
import { saveAs } from "file-saver";
import { API } from "../../functions/api";
import workerUrl from "./export.worker?worker&url";
import type { ExportBNRAWorker } from "../../functions/export/export.worker";
import "../../components/export/fonts";
import { DVRiskSummary } from "../../types/dataverse/DVRiskSummary";
import { Environment } from "../../types/global";
import {
  DVRiskSnapshot,
  parseRiskSnapshot,
} from "../../types/dataverse/DVRiskSnapshot";
import { getParsedCascadeSnapshots, getRiskCascades } from "../cascades";
import {
  getParsedRiskCatalogue,
  getRiskCatalogueFromSnapshots,
  getRiskFileCatalogue,
} from "../riskfiles";
import {
  snapshotFromRiskCascade,
  snapshotFromRiskfile,
  summaryFromRiskfile,
} from "../snapshot";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";
import {
  linkCascadeSnapshot,
  parseCascadeSnapshot,
} from "../../types/dataverse/DVRiskCascade";

export function getExporter() {
  const jsWorker = `import ${JSON.stringify(
    new URL(workerUrl, import.meta.url)
  )}`;
  const blobWorker = new Blob([jsWorker], { type: "application/javascript" });
  const ww = new Worker(URL.createObjectURL(blobWorker), { type: "module" });
  const worker = wrap<ExportBNRAWorker>(ww);

  return worker;
}

export default function handleExportRiskfile(
  risk: DVRiskSummary,
  api: API,
  environment: Environment
) {
  return async (onProgress?: (message: string) => void) => {
    if (onProgress) onProgress("Loading data");

    let riskSummaries: DVRiskSummary[],
      riskSnapshots: DVRiskSnapshot[],
      cascadeSnapshots: DVCascadeSnapshot<
        unknown,
        DVRiskSnapshot,
        DVRiskSnapshot
      >[];

    if (environment == Environment.PUBLIC) {
      riskSummaries = await api.getRiskSummaries();
      riskSnapshots = await api.getRiskSnapshots();
      const hc = getRiskCatalogueFromSnapshots(riskSnapshots);

      cascadeSnapshots = getParsedCascadeSnapshots(
        await api.getCascadeSnapshots(),
        hc
      );
    } else {
      const riskFiles = await api.getRiskFiles();
      const rc = getRiskFileCatalogue(riskFiles);
      const cascades = await api.getRiskCascades();
      const baseCascadesCatalogue = getRiskCascades(
        rc[risk._cr4de_risk_file_value],
        cascades,
        rc
      );
      riskSummaries = riskFiles.map((rf) =>
        summaryFromRiskfile(rf, baseCascadesCatalogue)
      );
      riskSnapshots = riskFiles.map((rf) =>
        parseRiskSnapshot(snapshotFromRiskfile(rf))
      );
      const rsc = getParsedRiskCatalogue(riskFiles);

      cascadeSnapshots = cascades.map((c) =>
        linkCascadeSnapshot(
          parseCascadeSnapshot(snapshotFromRiskCascade(c)),
          rsc
        )
      );
    }

    const attachments = await api
      .getAttachments<DVAttachment<unknown, DVAttachment>>(
        `$orderby=cr4de_reference&$filter=cr4de_reference ne null&$expand=cr4de_referencedSource`
      )
      .then((results: DVAttachment<unknown, DVAttachment>[]) =>
        results.map((a) =>
          a.cr4de_referencedSource
            ? {
                ...a.cr4de_referencedSource,
                cr4de_bnraattachmentid: a.cr4de_bnraattachmentid,
                cr4de_field: a.cr4de_field,
                cr4de_referencedSource: a.cr4de_referencedSource,
              }
            : a
        )
      );

    const exporter = getExporter();

    const blob = await exporter.exportBNRA(
      {
        exportType: EXPORT_TYPE.SINGLE,
        exportedRiskFiles: [risk],
        riskFiles: riskSummaries,
        riskSnapshots: riskSnapshots,
        allCascades: cascadeSnapshots,
        allAttachments: attachments,
      },
      proxy(onProgress || (() => {}))
    );

    if (blob) {
      saveAs(blob, "BNRA_export.pdf");
    }
  };
}
