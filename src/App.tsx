import { useEffect } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import AuthenticationPage from "./pages/auth/AuthenticationPage";
import HomePage from "./pages/main/HomePage";
import LocalAPI from "./pages/main/LocalAPI";
import CalculationPage from "./pages/CalculationPage/CalculationPage";
import RankingPage from "./pages/reporting/RankingPage";
import RiskReportingPage from "./pages/reporting/RiskPage";
import ValidationIntroPage from "./pages/validation/ValidationIntroPage";
import ValidationPage from "./pages/validation/ValidationPage";
import RiskPage from "./pages/learning/RiskPage";

import "./App.css";
import BasePage from "./pages/BasePage";
import EditorIntroPage from "./pages/riskFile/EditorIntroPage";
import EditorPage from "./pages/riskFile/EditorPage";
import LearningOverviewPage from "./pages/learning/LearningOverviewPage";
import OverviewPage from "./pages/main/OverviewPage";
import AuthPage from "./pages/AuthPage";
import TranslationsPage from "./pages/admin/TranslationsPage";
import LearningPage from "./pages/learning/LearningPage";
import RiskCataloguePage from "./pages/learning/RiskCataloguePage";
import QuantitativeScalesPage from "./pages/learning/QuantitativeScalesPage";
import RegistrationPage from "./pages/auth/RegistrationPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ErrorPage from "./pages/ErrorPage";
import Step2APage from "./pages/step2A/Step2APage";
import ProcessManagementPage from "./pages/admin/Management/ProcessManagementPage";
import ExpertManagementPage from "./pages/admin/ExpertManagementPage";
import Step2BPage from "./pages/step2B/Step2BPage";
import RiskFilePage from "./pages/riskFile/RiskFilePage";
import ConsensusExpertPage from "./pages/consensus/ConsensusExpertPage";
import AdminPage from "./pages/AdminPage";
import HazardCataloguePage from "./pages/HazardCataloguePage/HazardCataloguePage";
import BaseRisksPage from "./pages/BaseRisksPage";
import BaseRiskFilePage from "./pages/BaseRiskFilePage";
import RiskIdentificationPage from "./pages/RiskIdentificationPage/RiskIdentificationPage";
import RiskFileSummaryPage from "./pages/RiskFileSummaryPage/RiskFileSummaryPage";
import RiskAnalysisPage from "./pages/RiskAnalysisPage/RiskAnalysisPage";
import RiskDataPage from "./pages/RiskDataPage/RiskDataPage";
import RiskInputPage from "./pages/RiskInputPage/RiskInputPage";
import CorrectionsPage from "./pages/CorrectionsPage/CorrectionsPage";

function App() {
  useEffect(() => {
    const getAntiForgeryToken = async () => {
      const response = await fetch(`https://bnra.powerappsportals.com/_layout/tokenhtml?_=${Date.now()}`, {
        method: "GET",
      });

      localStorage.setItem("antiforgerytoken", await (await response.text()).split("value")[1].split('"')[1]);
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
              element: <HomePage />,
            },

            {
              path: "/",
              element: <BaseRisksPage />,
              children: [
                {
                  path: "/risks",
                  element: <HazardCataloguePage />,
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
                      path: "/risks/:risk_file_id/identification",
                      element: <RiskIdentificationPage />,
                    },
                    {
                      path: "/risks/:risk_file_id/analysis",
                      element: <RiskAnalysisPage />,
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
              ],
            },

            {
              path: "/",
              element: <AuthPage />,
              children: [
                {
                  path: "/learning",
                  element: <LearningOverviewPage />,
                },
                {
                  path: "/learning/risk-catalogue",
                  element: <RiskCataloguePage />,
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
                  path: "/hazards/:risk_file_id",
                  element: <EditorPage />,
                },
                {
                  path: "/risks/:risk_file_id",
                  element: <RiskFilePage />,
                },

                {
                  path: "/overview",
                  element: <OverviewPage />,
                },

                {
                  path: "/validation/:validation_id",
                  element: <ValidationPage />,
                },
                {
                  path: "/step2A/:step2A_id",
                  element: <Step2APage />,
                },
                {
                  path: "/step2B/:step2A_id",
                  element: <Step2BPage />,
                },
                {
                  path: "/consensus/:riskFile_id",
                  element: <ConsensusExpertPage />,
                },

                {
                  path: "/analysis/calculator",
                  element: <CalculationPage />,
                },

                {
                  path: "/reporting",
                  element: <RankingPage />,
                },
                {
                  path: "/reporting/:risk_id",
                  element: <RiskReportingPage />,
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
              ],
            },
          ],
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

export default App;
