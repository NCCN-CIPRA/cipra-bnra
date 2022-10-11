import { useEffect } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import AnalysisAveragerPage from "./pages/analysis/AnalysisAveragerPage";
import AuthenticationPage from "./pages/main/AuthenticationPage";
import DataMigrator from "./pages/main/DataMigrator";
import HomePage from "./pages/main/HomePage";
import LocalAPI from "./pages/main/LocalAPI";
import CalculationPage from "./pages/analysis/CalculationPage";
import RankingPage from "./pages/reporting/RankingPage";
import ValidationIntroPage from "./pages/validation/ValidationIntroPage";
import ValidationPage from "./pages/validation/ValidationPage";
import RiskPage from "./pages/reporting/RiskPage";

import "./App.css";
import BasePage from "./pages/BasePage";
import EditorIntroPage from "./pages/editor/EditorIntroPage";
import EditorPage from "./pages/editor/EditorPage";

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

  const router = createHashRouter([
    {
      path: "/",
      element: <BasePage />,
      children: [
        {
          path: "/",
          element: <HomePage />,
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
          path: "/validation",
          element: <ValidationIntroPage />,
        },
        {
          path: "/validation/:validation_id",
          element: <ValidationPage />,
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
      ],
    },
    {
      path: "/auth",
      element: <AuthenticationPage />,
    },

    // DEV ONLY
    {
      path: "/__dev/localapi",
      element: <LocalAPI />,
    },
    {
      path: "/__dev/migrate",
      element: <DataMigrator />,
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
