import { Outlet, useOutletContext } from "react-router-dom";
import useAPI, { DataTable } from "../hooks/useAPI";
import { LoggedInUser } from "../hooks/useLoggedInUser";
import satisfies from "../types/satisfies";
import { BasePageContext } from "./BasePage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Environment } from "../types/global";
import { DVRiskSummary } from "../types/dataverse/DVRiskSummary";

export interface RiskPageContext {
  user: LoggedInUser | null | undefined;
  riskSummaries: DVRiskSummary[] | undefined;
}

export default function BaseRisksPage() {
  const { user, environment, ...baseContext } =
    useOutletContext<BasePageContext>();
  const api = useAPI();
  const queryClient = useQueryClient();

  const { data: riskSummaries } = useQuery({
    queryKey: [DataTable.RISK_SUMMARY],
    queryFn: () => api.getRiskSummaries(),
    select: (data) => data.filter((rf) => !rf.cr4de_hazard_id.startsWith("X")),
  });

  if (user && user.roles.verified && environment === Environment.PUBLIC) {
    queryClient.prefetchQuery({
      queryKey: [DataTable.RISK_SNAPSHOT],
      queryFn: () => api.getRiskSnapshots(),
    });
  }

  return (
    <Outlet
      context={satisfies<RiskPageContext>({
        ...baseContext,
        user,
        riskSummaries,
      })}
    />
  );
}
