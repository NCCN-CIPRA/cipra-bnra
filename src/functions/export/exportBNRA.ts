import { EXPORT_TYPE } from "../../functions/export/export.worker";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { proxy, wrap } from "vite-plugin-comlink/symbol";
import { saveAs } from "file-saver";
import { API } from "../../hooks/useAPI";
import workerUrl from "./export.worker?worker&url";

export function getExporter() {
  if (window.location.href.indexOf("localhost") >= 0) {
    return new ComlinkWorker<typeof import("./export.worker")>(
      new URL("./export.worker", import.meta.url),
      {
        type: "module",
      }
    );
  }

  const js = `import ${JSON.stringify(new URL(workerUrl, import.meta.url))}`;
  const blob = new Blob([js], { type: "application/javascript" });

  const objURL = URL.createObjectURL(blob);

  return wrap(
    new Worker(objURL, { type: "module" })
  ) as unknown as typeof import("./export.worker");
}

export default function handleExportRiskfile(riskFile: DVRiskFile, api: API) {
  return async (onProgress?: (message: string) => void) => {
    if (onProgress) onProgress("Loading data");

    const riskFiles = await api.getRiskFiles(
      "$select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type"
    );
    const cascades = await api.getRiskCascades(
      `$filter=_cr4de_cause_hazard_value eq '${riskFile.cr4de_riskfilesid}' or _cr4de_effect_hazard_value eq '${riskFile.cr4de_riskfilesid}'`
    );
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

    console.log(exporter);

    const blob = await exporter.exportBNRA(
      {
        exportType: EXPORT_TYPE.SINGLE,
        exportedRiskFiles: [riskFile],
        riskFiles: riskFiles,
        allCascades: cascades,
        allAttachments: attachments,
      },
      proxy(onProgress || (() => {}))
    );

    if (blob) {
      saveAs(blob, "BNRA_export.pdf");
    }
  };
}
