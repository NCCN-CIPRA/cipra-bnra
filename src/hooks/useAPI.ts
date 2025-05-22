import { useNavigate } from "react-router-dom";
import { API, getAPI } from "../functions/api";
export { DataTable } from "../types/dataverse/tables";

export default function useAPI(): API {
  const navigate = useNavigate();

  return getAPI(
    localStorage.getItem("antiforgerytoken") || "",
    navigate,
    fetch
  );
}
