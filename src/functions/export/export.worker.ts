/* eslint-disable no-restricted-globals */
import exportExcel from "./exportExcel";
import { EXPORT_TYPE, renderPDF } from "./renderPDF";

/* @ts-expect-error any */
if (import.meta.webpackHot) {
  /* @ts-expect-error any */
  import.meta.webpackHot.accept();
}

self.onmessage = async (event: MessageEvent) => {
  console.log(event.data);

  if (event.data.exportType === EXPORT_TYPE.ALL) {
    self.postMessage({ type: "progress", message: "Exporting all risk files" });
  } else {
    self.postMessage({
      type: "progress",
      message: `Exporting ${event.data.exportedRiskFiles.length} risk file${
        event.data.exportedRiskFiles.length > 1 ? "s" : ""
      }`,
    });
  }

  const onProgress = (message: string) => {
    self.postMessage({
      type: "progress",
      message,
    });
  };

  let blob;

  if (event.data.exportType === EXPORT_TYPE.DATA) {
    blob = await exportExcel({
      exportedRiskFiles: event.data.exportedRiskFiles,
      riskFiles: event.data.riskFiles,
      allCascades: event.data.cascades,
      onProgress,
    });
  } else {
    blob = await renderPDF({
      exportType: event.data.exportType,
      exportedRiskFiles: event.data.exportedRiskFiles,
      riskFiles: event.data.riskFiles,
      allCascades: event.data.cascades,
      allAttachments: event.data.attachments,
      onProgress,
    });
  }

  self.postMessage({
    type: "result",
    fileType: event.data.exportType === EXPORT_TYPE.DATA ? "excel" : "pdf",
    value: blob,
  });
};

export {};
