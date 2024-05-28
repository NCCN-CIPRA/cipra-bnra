import { useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import useRecords from "../hooks/useRecords";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import { DVAnalysisRun, RiskCalculation } from "../types/dataverse/DVAnalysisRun";
import { SmallRisk } from "../types/dataverse/DVSmallRisk";
import { DataTable } from "../hooks/useAPI";
import useLazyRecord, { GetRecordParams } from "../hooks/useLazyRecord";
import { DVRiskCascade } from "../types/dataverse/DVRiskCascade";
import useLazyRecords from "../hooks/useLazyRecords";
import { PanoramaSharp } from "@mui/icons-material";
import { Breadcrumb } from "../components/BreadcrumbNavigation";
import { useTranslation } from "react-i18next";
import usePageTitle from "../hooks/usePageTitle";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import { DVContact } from "../types/dataverse/DVContact";
import useLoggedInUser from "../hooks/useLoggedInUser";
import { getCatalyzingEffects, getCauses, getClimateChange, getEffects } from "../functions/cascades";

export interface RiskPageContext {
  user: DVContact | null | undefined;
  hazardCatalogue: SmallRisk[] | null;
  srf: { [riskId: string]: SmallRisk };
  riskFiles: { [riskId: string]: DVRiskFile };
  cascades: {
    [riskId: string]: {
      all: DVRiskCascade<SmallRisk, SmallRisk>[];
      causes: DVRiskCascade<SmallRisk, SmallRisk>[];
      effects: DVRiskCascade<SmallRisk, SmallRisk>[];
      catalyzingEffects: DVRiskCascade<SmallRisk, SmallRisk>[];
      climateChange: DVRiskCascade<SmallRisk, SmallRisk> | null;
    };
  };
  analyses: { [riskId: string]: RiskCalculation };

  loadRiskFile: (params: Partial<GetRecordParams<DVRiskFile<any>>>) => Promise<void>;
  reloadRiskFile: (params: Partial<GetRecordParams<DVRiskFile<any>>>) => Promise<void>;
}

export default function BaseRisksPage() {
  const { t } = useTranslation();

  const { user, refreshUser } = useLoggedInUser();

  useEffect(() => {
    let interval: any;

    if (user === undefined) {
      interval = setInterval(refreshUser, 1000);
    }

    return () => interval && clearInterval(interval);
  }, [user, refreshUser]);

  const [riskFiles, setRiskFiles] = useState<{ [id: string]: DVRiskFile }>({});
  const [srf, setSRF] = useState<{ [id: string]: SmallRisk }>({});
  const [cascades, setCascades] = useState({});
  const [analyses, setAnalyses] = useState({});

  const {
    data: hazardCatalogue,
    dataPromise: hcPromise,
    reloadData: reloadHazardCatalogue,
  } = useRecords<SmallRisk>({
    table: DataTable.RISK_FILE,
    query:
      "$orderby=cr4de_hazard_id&$select=cr4de_hazard_id,cr4de_title,cr4de_risk_type,cr4de_risk_category,cr4de_definition",
    transformResult: (data) => data.filter((r: SmallRisk) => !r.cr4de_hazard_id.startsWith("X")),
    onComplete: async (results) => setSRF(results.reduce((acc, sr) => ({ ...acc, [sr.cr4de_riskfilesid]: sr }), {})),
  });

  const { getData: loadRiskFile, isFetching: loadingRiskFile } = useLazyRecord<
    DVRiskFile<DVAnalysisRun<unknown, string>>
  >({
    table: DataTable.RISK_FILE,
    id: "",
    query: "$expand=cr4de_latest_calculation",
    onComplete: async (rfResult: DVRiskFile<DVAnalysisRun<unknown, string>>) => {
      const hc: { [id: string]: SmallRisk } = (await hcPromise).reduce(
        (acc, sr) => ({ ...acc, [sr.cr4de_riskfilesid]: sr }),
        {}
      );

      loadRiskCascades({
        query: `$filter=_cr4de_cause_hazard_value eq '${rfResult.cr4de_riskfilesid}' or _cr4de_effect_hazard_value eq '${rfResult.cr4de_riskfilesid}'`,
        transformResult: (results: DVRiskCascade[]) =>
          results.map((r) => {
            return {
              ...r,
              cr4de_cause_hazard: hc[r._cr4de_cause_hazard_value],
              cr4de_effect_hazard: hc[r._cr4de_effect_hazard_value],
            };
          }),
        onComplete: async (rcResult) => {
          const causes = getCauses(rfResult, rcResult, hc);
          const effects = getEffects(rfResult, rcResult);
          const catalyzingEffects = getCatalyzingEffects(rfResult, rcResult, hc);
          const climateChange = getClimateChange(rfResult, rcResult, hc);

          setRiskFiles({ ...riskFiles, [rfResult.cr4de_riskfilesid]: rfResult });
          setAnalyses({
            ...analyses,
            [rfResult.cr4de_riskfilesid]: JSON.parse(rfResult.cr4de_latest_calculation?.cr4de_results || ""),
          });
          setCascades({
            ...cascades,
            [rfResult.cr4de_riskfilesid]: {
              all: rcResult,
              causes,
              effects,
              catalyzingEffects,
              climateChange,
            },
          });
        },
      });
    },
  });

  const { getData: loadRiskCascades } = useLazyRecords<DVRiskCascade<SmallRisk, SmallRisk>>({
    table: DataTable.RISK_CASCADE,
  });

  usePageTitle(t("sideDrawer.hazardCatalogue", "Hazard Catalogue"));
  useBreadcrumbs([
    { name: t("bnra.shortName"), url: "/" },
    { name: t("sideDrawer.hazardCatalogue", "Hazard Catalogue"), url: "" },
  ]);

  return (
    <Outlet
      context={{
        user,
        hazardCatalogue,
        reloadHazardCatalogue,
        loadRiskFile: (params: GetRecordParams<DVRiskFile<any>>) => {
          if (!riskFiles[params.id] && !loadingRiskFile) {
            loadRiskFile(params);
          }
        },
        reloadRiskFile: (params: GetRecordParams<DVRiskFile<any>>) => loadRiskFile(params),
        riskFiles,
        cascades,
        analyses,
      }}
    />
  );
}
