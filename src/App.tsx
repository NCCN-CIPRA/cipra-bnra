import { useEffect } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import AnalysisAveragerPage from "./pages/analysis/AnalysisAveragerPage";
import AuthenticationPage from "./pages/auth/AuthenticationPage";
import DataMigrator from "./pages/main/DataMigrator";
import HomePage from "./pages/main/HomePage";
import LocalAPI from "./pages/main/LocalAPI";
import CalculationPage from "./pages/analysis/CalculationPage";
import RankingPage from "./pages/reporting/RankingPage";
import ValidationIntroPage from "./pages/validation/ValidationIntroPage";
import ValidationPage from "./pages/validation/ValidationPage";
import RiskPage from "./pages/learning/RiskPage";

import "./App.css";
import BasePage from "./pages/BasePage";
import EditorIntroPage from "./pages/editor/EditorIntroPage";
import EditorPage from "./pages/editor/EditorPage";
import LearningOverviewPage from "./pages/learning/LearningOverviewPage";
import OverviewPage from "./pages/main/OverviewPage";
import AuthPage from "./pages/AuthPage";
import TranslationsPage from "./pages/admin/TranslationsPage";
import ExpertManagementPage from "./pages/admin/ExpertManagementPage";
import LearningPage from "./pages/learning/LearningPage";
import UploadCodePage from "./pages/_dev/UploadCodePage";
import RiskCataloguePage from "./pages/learning/RiskCataloguePage";
import QuantitativeScalesPage from "./pages/learning/QuantitativeScalesPage";
import RegistrationPage from "./pages/auth/RegistrationPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ErrorPage from "./pages/ErrorPage";
import Step2APage from "./pages/step2A/Step2APage";

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
                  path: "/hazards",
                  element: <EditorIntroPage />,
                },
                {
                  path: "/hazards/:risk_file_id",
                  element: <EditorPage />,
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
                  path: "/step2A",
                  element: <Step2APage />,
                },

                {
                  path: "/analysis/averager",
                  element: <AnalysisAveragerPage />,
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
                  element: <RiskPage />,
                },

                { path: "/admin/translations", element: <TranslationsPage /> },
                { path: "/admin/experts", element: <ExpertManagementPage /> },

                // DEV ONLY
                {
                  path: "/__dev/migrate",
                  element: <DataMigrator />,
                },
                {
                  path: "/__dev/code",
                  element: <UploadCodePage />,
                },
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
