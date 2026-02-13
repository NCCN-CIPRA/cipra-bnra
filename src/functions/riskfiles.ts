import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import {
  DVRiskSnapshot,
  DVRiskSnapshotQuantiType,
  parseRiskSnapshot,
  RiskSnapshotResults,
  SerializedRiskSnapshotResults,
} from "../types/dataverse/DVRiskSnapshot";
import { snapshotFromRiskfile } from "./snapshot";

export function isMaliciousAction(riskFileId: string) {
  return (
    [
      "6596cd55-aa6c-ed11-9561-000d3adf7089", // Cyber attack against a CBRNe infrastructure
      "6496cd55-aa6c-ed11-9561-000d3adf7089", // Cyber attack against a government institution
      "7458db5b-aa6c-ed11-9561-000d3adf7089", // Cyber attack against a vital infrastructure

      "9258db5b-aa6c-ed11-9561-000d3adf7089", // Attack against a CBRNe infrastructure
      "9358db5b-aa6c-ed11-9561-000d3adf7089", // Attack against a government or international institution
      "9158db5b-aa6c-ed11-9561-000d3adf7089", // Attack against a group of people or community
      "9058db5b-aa6c-ed11-9561-000d3adf7089", // Attack against a soft target
      "9558db5b-aa6c-ed11-9561-000d3adf7089", // Attack against a VIP
      "9758db5b-aa6c-ed11-9561-000d3adf7089", // Attack against a vital infrastructure
      "9658db5b-aa6c-ed11-9561-000d3adf7089", // Attack on a transport of dangerous goods
      "9458db5b-aa6c-ed11-9561-000d3adf7089", // Information operations
      "9b58db5b-aa6c-ed11-9561-000d3adf7089", // Espionage
      "9a58db5b-aa6c-ed11-9561-000d3adf7089", // FDI
      "9858db5b-aa6c-ed11-9561-000d3adf7089", // Interference
      "9958db5b-aa6c-ed11-9561-000d3adf7089", // IAC
      "9e58db5b-aa6c-ed11-9561-000d3adf7089", // Drug trade
      "9c58db5b-aa6c-ed11-9561-000d3adf7089", // Economic fraud
      "9f58db5b-aa6c-ed11-9561-000d3adf7089", // Human trafficking
    ].indexOf(riskFileId) >= 0
  );
}

export type RiskCatalogue<
  RiskType = unknown,
  QuantiType extends DVRiskSnapshotQuantiType = RiskSnapshotResults,
> = { [key: string]: DVRiskSnapshot<RiskType, QuantiType> };

export function getRiskFileCatalogue(riskFiles: DVRiskFile[]): {
  [id: string]: DVRiskFile;
} {
  return riskFiles.reduce(
    (hc, rf) => ({
      ...hc,
      [rf.cr4de_riskfilesid]: rf,
    }),
    {} as { [id: string]: DVRiskFile },
  );
}

export function getRiskCatalogue(
  riskFiles: DVRiskFile[],
): RiskCatalogue<DVRiskFile, SerializedRiskSnapshotResults> {
  const snapshots = riskFiles.map((rf) => snapshotFromRiskfile(rf));

  return getRiskCatalogueFromSnapshots(snapshots);
}

export function getParsedRiskCatalogue(
  riskFiles: DVRiskFile[],
): RiskCatalogue<DVRiskFile> {
  const snapshots = riskFiles.map((rf) =>
    parseRiskSnapshot(snapshotFromRiskfile(rf)),
  );

  return getRiskCatalogueFromSnapshots(snapshots);
}

export function getRiskCatalogueFromSnapshots<T, R>(
  riskFiles: DVRiskSnapshot<T, R>[],
): RiskCatalogue<T, R> {
  return riskFiles.reduce(
    (hc, rf) => ({
      ...hc,
      [rf._cr4de_risk_file_value]: rf,
    }),
    {} as RiskCatalogue<T, R>,
  );
}
