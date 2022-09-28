import { createHashRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import AuthenticationPage from "./pages/main/AuthenticationPage";
import HomePage from "./pages/main/HomePage";
import ValidationIntroPage from "./pages/validation/ValidationIntroPage";
import ValidationPage from "./pages/validation/ValidationPage";

function App() {
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
