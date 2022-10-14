import { useState } from "react";
import useAPI, { DataTable } from "./useAPI";

export interface GetRecordsParams<T> {
  table: DataTable;
  query?: string;
  transformResult?: (result: any) => T[];
  onComplete?: (result: T[]) => Promise<void>;
}

/**
 * Retrieve records from the database when the returned function is called
 *
 * @param table The database table from which to retrieve records
 * @param query The WebAPI query to filter or expand records
 *
 * @returns {
 *  loading: A boolean indicating if the query is still running or not
 *  data: An array of records of the given type
 *  getData: The function to call when records should be retrieved
 * }
 */
export default function useLazyRecords<T>(options: GetRecordsParams<T>) {
  const api = useAPI();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T[] | null>(null);

  const getData = async (lazyOptions?: Partial<GetRecordsParams<T>>) => {
    let response;
    const o = { ...options, ...lazyOptions };

    if (o.table === DataTable.RISK_FILE) {
      response = await api.getRiskFiles<T>(o.query);
    } else if (o.table === DataTable.RISK_CASCADE) {
      response = await api.getRiskCascades<T>(o.query);
    } else if (o.table === DataTable.PARTICIPATION) {
      response = await api.getParticipants<T>(o.query);
    } else if (o.table === DataTable.VALIDATION) {
      response = await api.getValidations<T>(o.query);
    } else if (o.table === DataTable.DIRECT_ANALYSIS) {
      response = await api.getDirectAnalyses<T>(o.query);
    } else if (o.table === DataTable.CASCADE_ANALYSIS) {
      response = await api.getCascadeAnalyses<T>(o.query);
    } else if (o.table === DataTable.ATTACHMENT) {
      response = await api.getAttachments<T>(o.query);
    } else {
      // (o.table === DataTable.TRANSLATIONS) {
      response = await api.getTranslations<T>(o.query);
    }

    const result = o.transformResult ? o.transformResult(response) : response;

    setData(result);

    if (o.onComplete) o.onComplete(result);

    setLoading(false);
  };

  return { loading, data, getData };
}
