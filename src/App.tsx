import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import AuthenticationPage from "./pages/auth/AuthenticationPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import CalculationPage from "./pages/CalculationPage/CalculationPage";
import RiskPage from "./pages/learning/RiskPage";

import "./App.css";
import BasePage from "./pages/BasePage";
import InformationPortalPage from "./pages/InformationPortalPage/InformationPortalPage";
import TranslationsPage from "./pages/TranslationsPage/TranslationsPage";
import LearningPage from "./pages/learning/LearningPage";
import RegistrationPage from "./pages/auth/RegistrationPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ErrorPage from "./pages/ErrorPage";
import ProcessManagementPage from "./pages/admin/Management/ProcessManagementPage";
import ExpertManagementPage from "./pages/admin/ExpertManagementPage";
import BaseRiskFilePage from "./pages/BaseRiskFilePage";
import RiskFileSummaryPage from "./pages/RiskFileSummaryPage/RiskFileSummaryPage";
import RiskAnalysisPage from "./pages/RiskAnalysisPage/RiskAnalysisPage";
import RiskDataPage from "./pages/RiskDataPage/RiskDataPage";
import RiskInputPage from "./pages/RiskInputPage/RiskInputPage";
import CorrectionsPage from "./pages/CorrectionsPage/CorrectionsPage";
import PermissionDeniedPage from "./pages/PermissionDeniedPage/PermissionDeniedPage";
import UserManagementPage from "./pages/UserManagementPage/UserManagementPage";
import RiskMatrixPage from "./pages/RiskMatrixPage/RiskMatrixPage";
import RiskEvolutionPage from "./pages/RiskEvolution/RiskEvolutionPage";
import ExportBNRAPage from "./pages/ExportBNRAPage/ExportBNRAPage";
import { useEffect } from "react";
import RiskCataloguePage from "./pages/RiskCataloguePage/RiskCataloguePage";
import MethodologyPage from "./pages/MethodologyPage/MethodologyPage";
import MethodologyScalesPage from "./pages/MethodologyScalesPage/MethodologyScalesPage";
import RiskDescriptionPage from "./pages/RiskDescriptionPage/RiskDescriptionPage";
import { getAntiForgeryToken } from "./functions/api";
import AdministrationPage from "./pages/AdministrationPage/AdministrationPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import RiskLogPage from "./pages/RiskLogPage/RiskLogPage";
import SimulationPage from "./pages/SimulationPage/SimulationPage";
import RiskAssistantPage from "./pages/RiskAssistantPage/RiskAssistantPage";
import WhatIsBNRAPage from "./pages/InformationPortalPage/pages/WhatIsBNRAPage";
import WhatIsARiskPage from "./pages/InformationPortalPage/pages/WhatIsARiskPage";
import HowDoWeMeasureImpactPage from "./pages/InformationPortalPage/pages/HowDoWeMeasureImpactPage";
import HowDoWeMeasureProbabilityPage from "./pages/InformationPortalPage/pages/HowDoWeMeasureProbabilityPage";
import LearningRiskCataloguePage from "./pages/InformationPortalPage/pages/LearningRiskCataloguePage";
import IntensityScenariosPage from "./pages/InformationPortalPage/pages/IntensityScenariosPage";
import RiskCascadesPage from "./pages/InformationPortalPage/pages/RiskCascadesPage";
import MaliciousActorsPage from "./pages/InformationPortalPage/pages/MaliciousActorsPage";
import ImpactProbabilityScalesPage from "./pages/InformationPortalPage/pages/ImpactProbabilityScalesPage";
import CascadeProbabilitiesPage from "./pages/InformationPortalPage/pages/CascadeProbabilitiesPage";
import MonteCarloSimulationPage from "./pages/InformationPortalPage/pages/MonteCarloSimulationPage";
import AggregationAndReportingPage from "./pages/InformationPortalPage/pages/AggregationAndReportingPage";
import BestPracticesGovPage from "./pages/InformationPortalPage/pages/BestPracticesGovPage";
import ProbabilityScalesPage from "./pages/InformationPortalPage/pages/ProbabilityScalesPage";
import ImpactScalesPage from "./pages/InformationPortalPage/pages/ImpactScalesPage";

export default function App() {
  useEffect(() => {
    getAntiForgeryToken().then((token) =>
      localStorage.setItem("antiforgerytoken", token),
    );
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Outlet />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <BasePage />,
          children: [
            {
              path: "/",
              element: <LandingPage />,
            },
            {
              path: "/403",
              element: <PermissionDeniedPage />,
            },

            {
              path: "/auth",
              element: <AuthenticationPage />,
            },
            {
              path: "/auth/register/:registration_code?",
              element: <RegistrationPage />,
            },
            {
              path: "/auth/resetPassword",
              element: <ResetPasswordPage />,
            },

            {
              path: "/risks",
              element: <RiskCataloguePage />,
            },

            {
              path: "/risks/:risk_file_id",
              element: <BaseRiskFilePage />,
              children: [
                {
                  path: "/risks/:risk_file_id",
                  element: <RiskFileSummaryPage />,
                },
                {
                  path: "/risks/:risk_file_id/description",
                  element: (
                    <ProtectedRoute>
                      <RiskDescriptionPage />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "/risks/:risk_file_id/analysis",
                  element: (
                    <ProtectedRoute>
                      <RiskAnalysisPage />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "/risks/:risk_file_id/evolution",
                  element: (
                    <ProtectedRoute>
                      <RiskEvolutionPage />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "/risks/:risk_file_id/data",
                  element: (
                    <ProtectedRoute allowedRole="expert">
                      <RiskDataPage />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "/risks/:risk_file_id/input",
                  element: (
                    <ProtectedRoute allowedRole="analist">
                      <RiskInputPage />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "/risks/:risk_file_id/log",
                  element: (
                    <ProtectedRoute allowedRole="analist">
                      <RiskLogPage />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "/risks/:risk_file_id/ai",
                  element: (
                    <ProtectedRoute allowedRole="analist">
                      <RiskAssistantPage />
                    </ProtectedRoute>
                  ),
                },
              ],
            },

            {
              path: "/risks/matrix",
              element: (
                <ProtectedRoute>
                  <RiskMatrixPage />
                </ProtectedRoute>
              ),
            },

            {
              path: "/methodology",
              element: <MethodologyPage />,
            },
            {
              path: "/methodology/scales",
              element: <MethodologyScalesPage />,
            },

            {
              path: "/learning",
              element: <InformationPortalPage />,
            },

            {
              path: "/learning/what-is-the-bnra",
              element: <WhatIsBNRAPage />,
            },
            {
              path: "/learning/what-is-a-risk",
              element: <WhatIsARiskPage />,
            },
            {
              path: "/learning/how-do-we-measure-probability",
              element: <HowDoWeMeasureProbabilityPage />,
            },
            {
              path: "/learning/how-do-we-measure-impact",
              element: <HowDoWeMeasureImpactPage />,
            },
            {
              path: "/learning/risk-catalogue",
              element: <LearningRiskCataloguePage />,
            },
            {
              path: "/learning/intensity-scenarios",
              element: <IntensityScenariosPage />,
            },
            {
              path: "/learning/risk-cascades",
              element: <RiskCascadesPage />,
            },
            {
              path: "/learning/malicious-actors",
              element: <MaliciousActorsPage />,
            },
            {
              path: "/learning/impact-and-probability-scales",
              element: <ImpactProbabilityScalesPage />,
            },
            {
              path: "/learning/cascade-probabilities",
              element: <CascadeProbabilitiesPage />,
            },
            {
              path: "/learning/monte-carlo-simulation",
              element: <MonteCarloSimulationPage />,
            },
            {
              path: "/learning/aggregation-and-reporting",
              element: <AggregationAndReportingPage />,
            },

            {
              path: "/learning/best-practices-gov",
              element: <BestPracticesGovPage />,
            },
            {
              path: "/learning/probability-scales",
              element: <ProbabilityScalesPage />,
            },
            {
              path: "/learning/impact-scales",
              element: <ImpactScalesPage />,
            },

            {
              path: "/learning/risk/:risk_file_id",
              element: <RiskPage />,
            },
            {
              path: "/learning/:page_name",
              element: <LearningPage />,
            },

            {
              path: "/export",
              element: (
                <ProtectedRoute allowedRole="analist">
                  <ExportBNRAPage />
                </ProtectedRoute>
              ),
            },

            {
              path: "/analysis/calculator",
              element: (
                <ProtectedRoute allowedRole="admin">
                  <CalculationPage />
                </ProtectedRoute>
              ),
            },

            {
              path: "/admin/translations",
              element: (
                <ProtectedRoute allowedRole="admin">
                  <TranslationsPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "/admin/process",
              element: (
                <ProtectedRoute allowedRole="admin">
                  <ProcessManagementPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "/admin/experts",
              element: (
                <ProtectedRoute allowedRole="admin">
                  <ExpertManagementPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "/admin/corrections",
              element: (
                <ProtectedRoute allowedRole="admin">
                  <CorrectionsPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "/admin/functions/:tabName?",
              element: (
                <ProtectedRoute allowedRole="admin">
                  <AdministrationPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "/admin/simulation/:tabName?",
              element: (
                <ProtectedRoute allowedRole="admin">
                  <SimulationPage />
                </ProtectedRoute>
              ),
            },
            {
              path: "/admin/users/:tabName?",
              element: (
                <ProtectedRoute allowedRole="admin">
                  <UserManagementPage />
                </ProtectedRoute>
              ),
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
}
