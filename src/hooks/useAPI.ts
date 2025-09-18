import { API, getAPI } from "../functions/api";
export { DataTable } from "../types/dataverse/tables";

export default function useAPI(): API {
  return getAPI(localStorage.getItem("antiforgerytoken") || "", fetch);
}
