import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../../types/dataverse/tables";
import useAPI from "../../hooks/useAPI";

import { BasePageContext } from "../BasePage";
import { Environment } from "../../types/global";
import AdvancedRiskCatalogue from "./AdvancedRiskCatalogue";
import { snapshotFromRiskfile } from "../../functions/snapshot";
import { parseRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import BasicRiskCatalogue from "./BasicRiskCatalogue";

export default function RiskCataloguePage() {
  const { t } = useTranslation();
  const api = useAPI();
  const { user, environment } = useOutletContext<BasePageContext>();

  const { data: riskSummaries, isLoading: isLoadingSummaries } = useQuery({
    queryKey: [DataTable.RISK_SUMMARY],
    queryFn: () => api.getRiskSummaries(),
  });

  const { data: riskSnapshots, isLoading: isLoadingSnapshots } = useQuery({
    queryKey: [DataTable.RISK_SNAPSHOT, "catalogue"],
    queryFn: () =>
      api.getRiskSnapshots(
        "$select=_cr4de_risk_file_value,cr4de_hazard_id,cr4de_title,cr4de_category,cr4de_mrs,cr4de_quanti",
      ),
    enabled: Boolean(user),
    select: (data) => data.map((rf) => parseRiskSnapshot(rf)),
  });

  const { data: riskFiles, isLoading: isLoadingRiskFiles } = useQuery({
    queryKey: [DataTable.RISK_FILE, "catalogue"],
    queryFn: async () => {
      const res = await api.getRiskFiles(
        "$select=cr4de_hazard_id,cr4de_title,cr4de_risk_category,cr4de_mrs,cr4de_quanti,cr4de_result_snapshot,cr4de_quanti_results",
      );
      return res;
    },
    enabled: Boolean(
      user && user.roles.analist && environment === Environment.DYNAMIC,
    ),
    select: (data) => {
      const res = data.map((rf) => parseRiskSnapshot(snapshotFromRiskfile(rf)));
      return res;
    },
  });

  usePageTitle(t("sideDrawer.hazardCatalogue", "Hazard Catalogue"));
  useBreadcrumbs([
    { name: t("bnra.shortName"), url: "/" },
    { name: t("sideDrawer.hazardCatalogue", "Hazard Catalogue"), url: "" },
  ]);

  if (riskFiles && environment === Environment.DYNAMIC)
    return (
      <AdvancedRiskCatalogue
        riskFiles={riskFiles}
        isLoading={isLoadingRiskFiles}
      />
    );

  if (riskSnapshots && !isLoadingRiskFiles)
    return (
      <AdvancedRiskCatalogue
        riskFiles={riskSnapshots}
        isLoading={isLoadingSnapshots}
      />
    );

  return (
    <BasicRiskCatalogue
      riskFiles={riskSummaries}
      isLoading={isLoadingSummaries}
    />
  );
}
