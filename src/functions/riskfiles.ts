import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import {
  DVRiskSnapshot,
  DVRiskSnapshotQuantiType,
  parseRiskSnapshot,
  RiskSnapshotResults,
  SerializedRiskSnapshotResults,
} from "../types/dataverse/DVRiskSnapshot";
import { snapshotFromRiskfile } from "./snapshot";

export type RiskCatalogue<
  RiskType = unknown,
  QuantiType extends DVRiskSnapshotQuantiType = RiskSnapshotResults
> = { [key: string]: DVRiskSnapshot<RiskType, QuantiType> };

export function getRiskFileCatalogue(riskFiles: DVRiskFile[]): {
  [id: string]: DVRiskFile;
} {
  return riskFiles.reduce(
    (hc, rf) => ({
      ...hc,
      [rf.cr4de_riskfilesid]: rf,
    }),
    {} as { [id: string]: DVRiskFile }
  );
}

export function getRiskCatalogue(
  riskFiles: DVRiskFile[]
): RiskCatalogue<DVRiskFile, SerializedRiskSnapshotResults> {
  const snapshots = riskFiles.map((rf) => snapshotFromRiskfile(rf));

  return getRiskCatalogueFromSnapshots(snapshots);
}

export function getParsedRiskCatalogue(
  riskFiles: DVRiskFile[]
): RiskCatalogue<DVRiskFile> {
  const snapshots = riskFiles.map((rf) =>
    parseRiskSnapshot(snapshotFromRiskfile(rf))
  );

  return getRiskCatalogueFromSnapshots(snapshots);
}

export function getRiskCatalogueFromSnapshots<T, R>(
  riskFiles: DVRiskSnapshot<T, R>[]
): RiskCatalogue<T, R> {
  return riskFiles.reduce(
    (hc, rf) => ({
      ...hc,
      [rf._cr4de_risk_file_value]: rf,
    }),
    {} as RiskCatalogue<T, R>
  );
}
