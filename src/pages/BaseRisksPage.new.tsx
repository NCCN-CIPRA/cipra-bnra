// import {  useState } from "react";
// import { Outlet } from "react-router-dom";
// import useRecords from "../hooks/useRecords";
// import { DVRiskFile } from "../types/dataverse/DVRiskFile";
// import { getResultSnapshot, SmallRisk } from "../types/dataverse/DVSmallRisk";
// import { DataTable } from "../hooks/useAPI";
// import useLazyRecord, { GetRecordParams } from "../hooks/useLazyRecord";
// import {
//   DVRiskCascade,
//   getCascadeResultSnapshot,
// } from "../types/dataverse/DVRiskCascade";
// import useLazyRecords, { GetRecordsParams } from "../hooks/useLazyRecords";
// import { Cascades, getCascades } from "../functions/cascades";
// import satisfies from "../types/satisfies";
// import { DVAttachment } from "../types/dataverse/DVAttachment";

// export interface RiskPageContext {
//   hazardCatalogue: SmallRisk[] | null;
//   srf: { [riskId: string]: SmallRisk };
//   riskFiles: { [riskId: string]: DVRiskFile };
//   cascades: { [riskId: string]: Cascades };
//   allAttachments: DVAttachment<unknown, DVAttachment>[];

//   allRiskFilesLoading: boolean;
//   allRiskFilesLoaded: boolean;
//   allAttachmentsLoading: boolean;
//   allAttachmentsLoaded: boolean;

//   loadHazardCatalogue: (
//     lazyOptions?: Partial<GetRecordsParams<SmallRisk>> | undefined
//   ) => Promise<unknown>;
//   loadRiskFile: (
//     params: Partial<GetRecordParams<DVRiskFile>>
//   ) => Promise<unknown>;
//   loadRiskFileAuth: (
//     params: Partial<GetRecordParams<DVRiskFile>>
//   ) => Promise<unknown>;
// }

// export default function BaseRisksPage() {
//   const [riskFiles, setRiskFiles] = useState<{ [id: string]: DVRiskFile }>({});
//   const [srf, setSRF] = useState<{ [id: string]: SmallRisk } | null>(null);
//   const [cascades, setCascades] = useState<{ [riskId: string]: Cascades }>({});
//   const [attachments, setAttachments] = useState<
//     DVAttachment<unknown, DVAttachment>[]
//   >([]);

//   const {
//     data: hazardCatalogue,
//     dataPromise: hcPromise,
//     reloadData: reloadHazardCatalogue,
//   } = useRecords<SmallRisk>({
//     table: DataTable.RISK_FILE,
//     query:
//       "$orderby=cr4de_hazard_id&$select=cr4de_hazard_id,cr4de_title,cr4de_risk_type,cr4de_risk_category,cr4de_definition,cr4de_mrs,cr4de_label_hilp,cr4de_label_cc,cr4de_label_cb,cr4de_label_impact,cr4de_result_snapshot",
//     transformResult: (data: SmallRisk[]) =>
//       data
//         .filter((r: SmallRisk) => !r.cr4de_hazard_id.startsWith("X"))
//         .map((rf) => ({
//           ...rf,
//           results: getResultSnapshot(rf),
//         })),
//     onComplete: async (results) =>
//       setSRF(
//         results.reduce(
//           (acc, sr) => ({ ...acc, [sr.cr4de_riskfilesid]: sr }),
//           {}
//         )
//       ),
//   });

//   const getRiskFiles = (
//     rfResult: DVRiskFile,
//     rfs: { [riskId: string]: DVRiskFile }
//   ) => {
//     return { ...rfs, [rfResult.cr4de_riskfilesid]: rfResult };
//   };

//   // const transformRiskFile = (rf: DVRiskFile): DVRiskFile => ({
//   //   ...rf,
//   //   cr4de_latest_calculation:
//   //     rf.cr4de_latest_calculation != null
//   //       ? {
//   //           ...rf.cr4de_latest_calculation,
//   //           cr4de_results: JSON.parse(rf.cr4de_latest_calculation?.cr4de_results as unknown as string),
//   //           cr4de_risk_file_metrics: JSON.parse(
//   //             rf.cr4de_latest_calculation?.cr4de_risk_file_metrics as unknown as string
//   //           ),
//   //           cr4de_metrics: null,
//   //         }
//   //       : null,
//   // });

//   const { getData: loadRiskFile, isFetching: loadingRiskFile } =
//     useLazyRecord<DVRiskFile>({
//       table: DataTable.RISK_FILE,
//       id: "",
//       // query: "$expand=cr4de_latest_calculation",
//       transformResult: (rf) => ({
//         ...rf,
//         results: getResultSnapshot(rf),
//       }),
//     });

//   const { getData: loadRiskCascades } = useLazyRecords<
//     DVRiskCascade<SmallRisk, SmallRisk>
//   >({
//     table: DataTable.RISK_CASCADE,
//   });

//   const {
//     getData: loadAllRiskFiles,
//     hasRun: allRiskFilesRun,
//     isFetching: loadingAllRiskFiles,
//   } = useLazyRecords<DVRiskFile>({
//     table: DataTable.RISK_FILE,
//     // query: "$expand=cr4de_latest_calculation",
//     transformResult: (data: DVRiskFile[]) =>
//       data
//         .filter((r) => !r.cr4de_hazard_id.startsWith("X"))
//         .map((r) => ({
//           ...r,
//           results: getResultSnapshot(r),
//         })),
//     // .map(transformRiskFile),
//     onComplete: async (rfResult: DVRiskFile[]) => {
//       const hc: { [id: string]: SmallRisk } =
//         srf ||
//         (await hcPromise).reduce(
//           (acc, sr) => ({ ...acc, [sr.cr4de_riskfilesid]: sr }),
//           {}
//         );

//       loadRiskCascades({
//         transformResult: (results: DVRiskCascade[]) =>
//           results.map((r) => {
//             return {
//               ...r,
//               cr4de_cause_hazard: hc[r._cr4de_cause_hazard_value],
//               cr4de_effect_hazard: hc[r._cr4de_effect_hazard_value],
//               results: getCascadeResultSnapshot(r),
//             };
//           }),

//         onComplete: async (rcResult: DVRiskCascade<SmallRisk, SmallRisk>[]) => {
//           setRiskFiles(rfResult.reduce((acc, rf) => getRiskFiles(rf, acc), {}));

//           setCascades(
//             rfResult.reduce((acc, rf) => getCascades(rf, acc, hc)(rcResult), {})
//           );
//         },
//       });
//     },
//   });

//   const {
//     hasRun: allAttachmentsRun,
//     getData: loadAllAttachments,
//     isFetching: loadingAllAttachments,
//   } = useLazyRecords<DVAttachment<unknown, DVAttachment>>({
//     table: DataTable.ATTACHMENT,
//     query: `$expand=cr4de_referencedSource`,
//     onComplete: async (result) => {
//       setAttachments(result);
//     },
//   });

//   return (
//     <Outlet
//       context={satisfies<RiskPageContext>({
//         hazardCatalogue,
//         srf: srf || {},
//         loadRiskFile: async (params: Partial<GetRecordParams<DVRiskFile>>) => {
//           if (!params.id) return;

//           if (!riskFiles[params.id] && !loadingRiskFile) {
//             loadRiskFile({
//               onComplete: async (rfResult: DVRiskFile) => {
//                 const hc: { [id: string]: SmallRisk } =
//                   srf ||
//                   (await hcPromise).reduce(
//                     (acc, sr) => ({ ...acc, [sr.cr4de_riskfilesid]: sr }),
//                     {}
//                   );

//                 loadRiskCascades({
//                   query: `$filter=_cr4de_cause_hazard_value eq '${rfResult.cr4de_riskfilesid}' or _cr4de_effect_hazard_value eq '${rfResult.cr4de_riskfilesid}'`,
//                   transformResult: (results: DVRiskCascade[]) =>
//                     results.map((r) => {
//                       return {
//                         ...r,
//                         cr4de_cause_hazard: hc[r._cr4de_cause_hazard_value],
//                         cr4de_effect_hazard: hc[r._cr4de_effect_hazard_value],
//                         results: getCascadeResultSnapshot(r),
//                       };
//                     }),
//                   onComplete: async (
//                     rcResult: DVRiskCascade<SmallRisk, SmallRisk>[]
//                   ) => {
//                     const hc: { [id: string]: SmallRisk } =
//                       srf ||
//                       (await hcPromise).reduce(
//                         (acc, sr) => ({ ...acc, [sr.cr4de_riskfilesid]: sr }),
//                         {}
//                       );

//                     setCascades(getCascades(rfResult, cascades, hc)(rcResult));
//                     setRiskFiles(getRiskFiles(rfResult, riskFiles));
//                   },
//                 });

//                 if (params.onComplete) return params.onComplete(rfResult);
//               },
//               ...params,
//             });
//           }
//         },
//         loadHazardCatalogue: loadAllRiskFiles,
//         allRiskFilesLoading: loadingAllRiskFiles,
//         allRiskFilesLoaded: allRiskFilesRun && !loadingAllRiskFiles,
//         riskFiles,
//         cascades,
//         loadAllAttachments,
//         allAttachmentsLoading: loadingAllAttachments,
//         allAttachmentsLoaded: allAttachmentsRun && !loadingAllAttachments,
//         allAttachments: attachments,
//       })}
//     />
//   );
// }
