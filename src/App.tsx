import { useEffect } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import AuthenticationPage from "./pages/main/AuthenticationPage";
import HomePage from "./pages/main/HomePage";
import ValidationIntroPage from "./pages/validation/ValidationIntroPage";
import ValidationPage from "./pages/validation/ValidationPage";

function App() {
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

  const router = createHashRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/auth",
      element: <AuthenticationPage />,
    },
    {
      path: "/validation",
      element: <ValidationIntroPage />,
    },
    {
      path: "/validation/:hazard_id",
      element: <ValidationPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
