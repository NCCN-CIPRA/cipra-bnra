import { proxy } from "comlink";
import { saveAs } from "file-saver";
import { getExporter } from "../../functions/export/exportBNRA";
import { EXPORT_TYPE } from "../../functions/export/export.worker";
import { DVRiskSummary } from "../../types/dataverse/DVRiskSummary";
import { API } from "../../functions/api";
import {
  DVRiskSnapshot,
  parseRiskSnapshot,
} from "../../types/dataverse/DVRiskSnapshot";
import { Environment } from "../../types/global";
import {
  linkCascadeSnapshot,
  parseCascadeSnapshot,
} from "../../types/dataverse/DVRiskCascade";
import { getRiskCatalogueFromSnapshots } from "../../functions/riskfiles";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import {
  snapshotFromRiskCascade,
  snapshotFromRiskfile,
} from "../../functions/snapshot";
import {
  CauseSnapshotResults,
  DVCascadeSnapshot,
  EffectSnapshotResults,
} from "../../types/dataverse/DVCascadeSnapshot";

export async function ExportSingle(
  selectedRiskFiles: DVRiskSummary[],
  allSummaries: DVRiskSummary[],
  environment: Environment,
  api: API,
  exporter: ReturnType<typeof getExporter>,
  loggerCallback: (m: string) => void
) {
  let riskSnapshots: DVRiskSnapshot[],
    cascades: DVCascadeSnapshot<
      unknown,
      DVRiskSnapshot,
      DVRiskSnapshot,
      CauseSnapshotResults,
      EffectSnapshotResults
    >[];

  if (environment === Environment.PUBLIC) {
    loggerCallback("Loading risk snapshots");
    riskSnapshots = await api
      .getRiskSnapshots()
      .then((d) => d.map((rf) => parseRiskSnapshot(rf)));
    const rc = getRiskCatalogueFromSnapshots(riskSnapshots);

    loggerCallback("Loading cascade snapshots");
    cascades = await api
      .getCascadeSnapshots()
      .then((d) =>
        d.map((c) => parseCascadeSnapshot(linkCascadeSnapshot(c, rc)))
      );
  } else {
    loggerCallback("Loading risk files");
    const riskFiles = await api.getRiskFiles();
    riskSnapshots = riskFiles.map((rf) =>
      parseRiskSnapshot(snapshotFromRiskfile(rf))
    );
    const rc = getRiskCatalogueFromSnapshots(riskSnapshots);

    loggerCallback("Loading risk cascades");
    cascades = await api
      .getRiskCascades()
      .then((d) =>
        d.map((c) =>
          parseCascadeSnapshot(
            linkCascadeSnapshot(snapshotFromRiskCascade(c), rc)
          )
        )
      );
  }

  loggerCallback("Loading attachments");
  const attachments = await api
    .getAttachments(
      `$orderby=cr4de_reference&$filter=cr4de_reference ne null&$expand=cr4de_referencedSource`
    )
    .then((d) =>
      d.map(
        (a) =>
          (a.cr4de_referencedSource
            ? {
                ...a.cr4de_referencedSource,
                cr4de_bnraattachmentid: a.cr4de_bnraattachmentid,
                cr4de_field: a.cr4de_field,
                cr4de_referencedSource: a.cr4de_referencedSource,
              }
            : a) as DVAttachment<unknown, DVAttachment>
      )
    );

  const blob = await exporter.exportBNRA(
    {
      exportType: EXPORT_TYPE.SINGLE,
      exportedRiskFiles: selectedRiskFiles,
      riskSnapshots,
      riskFiles: allSummaries,
      allCascades: cascades,
      allAttachments: attachments,
    },
    proxy(loggerCallback)
  );

  if (blob) saveAs(blob, "BNRA_export.pdf");
}
