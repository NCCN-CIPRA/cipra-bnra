import { useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import useRecords from "../hooks/useRecords";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import { DVAnalysisRun, RiskAnalysisResults, RiskCalculation } from "../types/dataverse/DVAnalysisRun";
import { getResultSnapshot, SmallRisk } from "../types/dataverse/DVSmallRisk";
import { DataTable } from "../hooks/useAPI";
import useLazyRecord, { GetRecordParams } from "../hooks/useLazyRecord";
import { DVRiskCascade, getCascadeResultSnapshot } from "../types/dataverse/DVRiskCascade";
import useLazyRecords, { GetRecordsParams } from "../hooks/useLazyRecords";
import { PanoramaSharp } from "@mui/icons-material";
import { Breadcrumb } from "../components/BreadcrumbNavigation";
import { useTranslation } from "react-i18next";
import usePageTitle from "../hooks/usePageTitle";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import { DVContact } from "../types/dataverse/DVContact";
import { LoggedInUser } from "../hooks/useLoggedInUser";
import {
  CascadeAnalysisInput,
  getCatalyzingEffects,
  getCauses,
  getClimateChange,
  getEffects,
} from "../functions/cascades";
import satisfies from "../types/satisfies";
import { AuthPageContext } from "./AuthPage";

export type Cascades = {
  all: DVRiskCascade<SmallRisk, SmallRisk>[];
  causes: DVRiskCascade<SmallRisk, SmallRisk>[];
  effects: DVRiskCascade<SmallRisk, SmallRisk>[];
  catalyzingEffects: DVRiskCascade<SmallRisk, SmallRisk>[];
  climateChange: DVRiskCascade<SmallRisk, SmallRisk> | null;
};

export interface RiskPageContext {
  user: LoggedInUser | null | undefined;
  hazardCatalogue: SmallRisk[] | null;
  srf: { [riskId: string]: SmallRisk };
  riskFiles: { [riskId: string]: DVRiskFile };
  cascades: { [riskId: string]: Cascades };

  allRiskFilesLoading: boolean;
  allRiskFilesLoaded: boolean;

  reloadHazardCatalogue: (lazyOptions?: Partial<GetRecordsParams<SmallRisk>> | undefined) => Promise<unknown>;
  loadRiskFile: (params: Partial<GetRecordParams<DVRiskFile<any>>>) => Promise<unknown>;
  reloadRiskFile: (params: Partial<GetRecordParams<DVRiskFile<any>>>) => Promise<unknown>;
  reloadCascades: (riskFile: DVRiskFile) => Promise<unknown>;
  loadAllRiskFiles: (params?: Partial<GetRecordsParams<DVRiskFile>>) => Promise<unknown>;
}

export default function BaseRisksPage() {
  const { user, refreshUser } = useOutletContext<AuthPageContext>();

  useEffect(() => {
    let interval: any;

    if (user === undefined) {
      interval = setInterval(refreshUser, 1000);
    }

    return () => interval && clearInterval(interval);
  }, [user, refreshUser]);

  const [riskFiles, setRiskFiles] = useState<{ [id: string]: DVRiskFile }>({});
  const [srf, setSRF] = useState<{ [id: string]: SmallRisk } | null>(null);
  const [cascades, setCascades] = useState<{ [riskId: string]: Cascades }>({});
  // const [isRunning, setIsRunning] = useState(false);

  const {
    data: hazardCatalogue,
    dataPromise: hcPromise,
    reloadData: reloadHazardCatalogue,
  } = useRecords<SmallRisk>({
    table: DataTable.RISK_FILE,
    query:
      "$orderby=cr4de_hazard_id&$select=cr4de_hazard_id,cr4de_title,cr4de_risk_type,cr4de_risk_category,cr4de_definition,cr4de_mrs,cr4de_label_hilp,cr4de_label_cc,cr4de_label_cb,cr4de_label_impact,cr4de_result_snapshot",
    transformResult: (data: SmallRisk[]) =>
      data
        .filter((r: SmallRisk) => !r.cr4de_hazard_id.startsWith("X"))
        .map((rf) => ({
          ...rf,
          results: getResultSnapshot(rf),
        })),
    onComplete: async (results) => setSRF(results.reduce((acc, sr) => ({ ...acc, [sr.cr4de_riskfilesid]: sr }), {})),
  });

  const getRiskFiles = (rfResult: DVRiskFile, rfs: { [riskId: string]: DVRiskFile }) => {
    return { ...rfs, [rfResult.cr4de_riskfilesid]: rfResult };
  };

  const getCascades =
    (riskFile: DVRiskFile, cs: { [riskId: string]: Cascades }, hc: { [id: string]: SmallRisk }) =>
    (rcResult: DVRiskCascade<SmallRisk, SmallRisk>[]) => {
      const causes = getCauses(riskFile, rcResult, hc);
      const effects = getEffects(riskFile, rcResult);
      const catalyzingEffects = getCatalyzingEffects(riskFile, rcResult, hc, false);
      const climateChange = getClimateChange(riskFile, rcResult, hc);

      return {
        ...cs,
        [riskFile.cr4de_riskfilesid]: {
          all: [...causes, ...effects, ...catalyzingEffects],
          causes,
          effects,
          catalyzingEffects,
          climateChange,
        },
      };
    };

  // const transformRiskFile = (rf: DVRiskFile): DVRiskFile => ({
  //   ...rf,
  //   cr4de_latest_calculation:
  //     rf.cr4de_latest_calculation != null
  //       ? {
  //           ...rf.cr4de_latest_calculation,
  //           cr4de_results: JSON.parse(rf.cr4de_latest_calculation?.cr4de_results as unknown as string),
  //           cr4de_risk_file_metrics: JSON.parse(
  //             rf.cr4de_latest_calculation?.cr4de_risk_file_metrics as unknown as string
  //           ),
  //           cr4de_metrics: null,
  //         }
  //       : null,
  // });

  const { getData: loadRiskFile, isFetching: loadingRiskFile } = useLazyRecord<DVRiskFile>({
    table: DataTable.RISK_FILE,
    id: "",
    // query: "$expand=cr4de_latest_calculation",
    transformResult: (rf) => ({
      ...rf,
      results: getResultSnapshot(rf),
    }),
  });

  const { getData: loadRiskCascades } = useLazyRecords<DVRiskCascade<SmallRisk, SmallRisk>>({
    table: DataTable.RISK_CASCADE,
  });

  const {
    getData: loadAllRiskFiles,
    hasRun: allRiskFilesRun,
    isFetching: loadingAllRiskFiles,
  } = useLazyRecords<DVRiskFile>({
    table: DataTable.RISK_FILE,
    // query: "$expand=cr4de_latest_calculation",
    transformResult: (data: DVRiskFile[]) =>
      data
        .filter((r) => !r.cr4de_hazard_id.startsWith("X"))
        .map((r) => ({
          ...r,
          results: getResultSnapshot(r),
        })),
    // .map(transformRiskFile),
    onComplete: async (rfResult: DVRiskFile[]) => {
      const hc: { [id: string]: SmallRisk } =
        srf || (await hcPromise).reduce((acc, sr) => ({ ...acc, [sr.cr4de_riskfilesid]: sr }), {});

      loadRiskCascades({
        transformResult: (results: DVRiskCascade[]) =>
          results.map((r) => {
            return {
              ...r,
              cr4de_cause_hazard: hc[r._cr4de_cause_hazard_value],
              cr4de_effect_hazard: hc[r._cr4de_effect_hazard_value],
              results: getCascadeResultSnapshot(r),
            };
          }),

        onComplete: async (rcResult: DVRiskCascade<SmallRisk, SmallRisk>[]) => {
          setRiskFiles(rfResult.reduce((acc, rf) => getRiskFiles(rf, acc), {}));

          setCascades(rfResult.reduce((acc, rf) => getCascades(rf, acc, hc)(rcResult), {}));
        },
      });
    },
  });

  return (
    <Outlet
      context={satisfies<RiskPageContext>({
        user,
        hazardCatalogue,
        srf: srf || {},
        reloadHazardCatalogue,
        loadRiskFile: async (params: Partial<GetRecordParams<DVRiskFile<any>>>) => {
          if (!params.id) return;

          if (!riskFiles[params.id] && !loadingRiskFile) {
            loadRiskFile({
              onComplete: async (rfResult: DVRiskFile) => {
                const hc: { [id: string]: SmallRisk } =
                  srf || (await hcPromise).reduce((acc, sr) => ({ ...acc, [sr.cr4de_riskfilesid]: sr }), {});

                loadRiskCascades({
                  query: `$filter=_cr4de_cause_hazard_value eq '${rfResult.cr4de_riskfilesid}' or _cr4de_effect_hazard_value eq '${rfResult.cr4de_riskfilesid}'`,
                  transformResult: (results: DVRiskCascade[]) =>
                    results.map((r) => {
                      return {
                        ...r,
                        cr4de_cause_hazard: hc[r._cr4de_cause_hazard_value],
                        cr4de_effect_hazard: hc[r._cr4de_effect_hazard_value],
                        results: getCascadeResultSnapshot(r),
                      };
                    }),
                  onComplete: async (rcResult: DVRiskCascade<SmallRisk, SmallRisk>[]) => {
                    const hc: { [id: string]: SmallRisk } =
                      srf || (await hcPromise).reduce((acc, sr) => ({ ...acc, [sr.cr4de_riskfilesid]: sr }), {});

                    setCascades(getCascades(rfResult, cascades, hc)(rcResult));
                    setRiskFiles(getRiskFiles(rfResult, riskFiles));
                  },
                });

                if (params.onComplete) return params.onComplete(rfResult);
              },
              ...params,
            });
          }
        },
        reloadRiskFile: (params: Partial<GetRecordParams<DVRiskFile>>) =>
          loadRiskFile({
            onComplete: async (rfResult: DVRiskFile) => {
              setRiskFiles(getRiskFiles(rfResult, riskFiles));

              if (params.onComplete) return params.onComplete(rfResult);
            },
            ...params,
          }),
        reloadCascades: async (riskFile: DVRiskFile) => {
          const hc: { [id: string]: SmallRisk } =
            srf || (await hcPromise).reduce((acc, sr) => ({ ...acc, [sr.cr4de_riskfilesid]: sr }), {});

          loadRiskCascades({
            query: `$filter=_cr4de_cause_hazard_value eq '${riskFile.cr4de_riskfilesid}' or _cr4de_effect_hazard_value eq '${riskFile.cr4de_riskfilesid}'`,
            transformResult: (results: DVRiskCascade[]) =>
              results.map((r) => {
                return {
                  ...r,
                  cr4de_cause_hazard: hc[r._cr4de_cause_hazard_value],
                  cr4de_effect_hazard: hc[r._cr4de_effect_hazard_value],
                };
              }),
            onComplete: async (rcResult: DVRiskCascade<SmallRisk, SmallRisk>[]) => {
              const hc: { [id: string]: SmallRisk } =
                srf || (await hcPromise).reduce((acc, sr) => ({ ...acc, [sr.cr4de_riskfilesid]: sr }), {});

              setCascades(getCascades(riskFile, cascades, hc)(rcResult));
            },
          });
        },
        loadAllRiskFiles,
        allRiskFilesLoading: loadingAllRiskFiles,
        allRiskFilesLoaded: allRiskFilesRun && !loadingAllRiskFiles,
        riskFiles,
        cascades,
      })}
    />
  );
}
