import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import AuthenticationPage from "./pages/auth/AuthenticationPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import LocalAPI from "./pages/main/LocalAPI";
import CalculationPage from "./pages/CalculationPage/CalculationPage";
import RiskPage from "./pages/learning/RiskPage";

import "./App.css";
import BasePage from "./pages/BasePage";
import InformationPortalPage from "./pages/InformationPortalPage/InformationPortalPage";
import AuthPage from "./pages/AuthPage";
import TranslationsPage from "./pages/TranslationsPage/TranslationsPage";
import LearningPage from "./pages/learning/LearningPage";
import LearningRiskCataloguePage from "./pages/learning/RiskCataloguePage";
import QuantitativeScalesPage from "./pages/learning/QuantitativeScalesPage";
import RegistrationPage from "./pages/auth/RegistrationPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ErrorPage from "./pages/ErrorPage";
import ProcessManagementPage from "./pages/admin/Management/ProcessManagementPage";
import ExpertManagementPage from "./pages/admin/ExpertManagementPage";
import AdminPage from "./pages/AdminPage";
import BaseRisksPage from "./pages/BaseRisksPage";
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
import ExportRiskFilePage from "./pages/ExportRiskFilePage/ExportRiskFilePage";
import ExportBNRAPage from "./pages/ExportBNRAPage/ExportBNRAPage";
import { useEffect } from "react";
import RiskCataloguePage from "./pages/RiskCataloguePage/RiskCataloguePage";
import MethodologyPage from "./pages/MethodologyPage/MethodologyPage";
import MethodologyScalesPage from "./pages/MethodologyScalesPage/MethodologyScalesPage";
import RiskDescriptionPage from "./pages/RiskDescriptionPage/RiskDescriptionPage";

export default function App() {
  useEffect(() => {
    const getAntiForgeryToken = async () => {
      const response = await fetch(
        `https://bnra.powerappsportals.com/_layout/tokenhtml?_=${Date.now()}`,
        {
          method: "GET",
        }
      );

      localStorage.setItem(
        "antiforgerytoken",
        await (await response.text()).split("value")[1].split('"')[1]
      );
    };

    getAntiForgeryToken();
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
              path: "/auth/register/:registration_code",
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
                  element: <RiskDescriptionPage />,
                },
                {
                  path: "/risks/:risk_file_id/analysis",
                  element: <RiskAnalysisPage />,
                },
                {
                  path: "/risks/:risk_file_id/evolution",
                  element: <RiskEvolutionPage />,
                },
                {
                  path: "/risks/:risk_file_id/data",
                  element: <RiskDataPage />,
                },
                {
                  path: "/risks/:risk_file_id/input",
                  element: <RiskInputPage />,
                },
              ],
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
              path: "/",
              element: <AuthPage />,
              children: [
                {
                  path: "/",
                  element: <BaseRisksPage />,
                  children: [
                    // {
                    //   path: "/risks",
                    //   element: <HazardCataloguePage />,
                    // },
                    {
                      path: "/risks/matrix",
                      element: <RiskMatrixPage />,
                    },

                    // {
                    //   path: "/risks/:risk_file_id",
                    //   element: <BaseRiskFilePage />,
                    //   children: [
                    //     {
                    //       path: "/risks/:risk_file_id",
                    //       element: <RiskFileSummaryPage />,
                    //     },
                    //     {
                    //       path: "/risks/:risk_file_id/identification",
                    //       element: <RiskIdentificationPage />,
                    //     },
                    //     {
                    //       path: "/risks/:risk_file_id/analysis",
                    //       element: <RiskAnalysisPage />,
                    //     },
                    //     {
                    //       path: "/risks/:risk_file_id/evolution",
                    //       element: <RiskEvolutionPage />,
                    //     },
                    //     {
                    //       path: "/risks/:risk_file_id/data",
                    //       element: <RiskDataPage />,
                    //     },
                    //     {
                    //       path: "/risks/:risk_file_id/input",
                    //       element: <RiskInputPage />,
                    //     },
                    //   ],
                    // },
                  ],
                },

                {
                  path: "/learning",
                  element: <InformationPortalPage />,
                },
                {
                  path: "/learning/risk-catalogue",
                  element: <LearningRiskCataloguePage />,
                },
                {
                  path: "/learning/quantitative-categories",
                  element: <QuantitativeScalesPage />,
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
                  element: <ExportBNRAPage />,
                },

                // DEPRECATED

                // {
                //   path: "/overview",
                //   element: <OverviewPage />,
                // },
                // {
                //   path: "/validation/:validation_id",
                //   element: <ValidationPage />,
                // },
                // {
                //   path: "/step2A/:step2A_id",
                //   element: <Step2APage />,
                // },
                // {
                //   path: "/step2B/:step2A_id",
                //   element: <Step2BPage />,
                // },
                // {
                //   path: "/consensus/:riskFile_id",
                //   element: <ConsensusExpertPage />,
                // },

                {
                  path: "/analysis/calculator",
                  element: <CalculationPage />,
                },
              ],
            },
            {
              path: "/",
              element: <AdminPage />,
              children: [
                { path: "/admin/translations", element: <TranslationsPage /> },
                { path: "/admin/process", element: <ProcessManagementPage /> },
                { path: "/admin/experts", element: <ExpertManagementPage /> },
                { path: "/admin/corrections", element: <CorrectionsPage /> },
                { path: "/admin/users", element: <UserManagementPage /> },
              ],
            },
          ],
        },
        {
          path: "/risks/:risk_file_id/export",
          element: <ExportRiskFilePage />,
        },
        {
          path: "/risks/export",
          element: <ExportBNRAPage />,
        },

        // DEV ONLY
        {
          path: "/__dev/localapi",
          element: <LocalAPI />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
}
