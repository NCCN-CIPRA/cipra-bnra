/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import useAPI, { DataTable } from "./useAPI";

export interface GetRecordParams<T> {
  table: DataTable;
  id: string;
  query?: string;
  transformResult?: (result: any) => T;
  onComplete?: (result: T) => Promise<void>;
  onError?: (errorCode: number) => Promise<void>;
}

/**
 * Retrieve a record from the database when the returned function is called
 *
 * @param table The database table from which to retrieve records
 * @param id The database id of the record to retrieve
 * @param query The WebAPI query to filter or expand records
 *
 * @returns {
 *  loading: A boolean indicating if the query is still running or not
 *  data: An array of records of the given type
 *  getData: The function to call when records should be retrieved
 * }
 */
export default function useLazyRecord<T>(options: GetRecordParams<T>) {
  const api = useAPI();

  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const getData = async (lazyOptions?: Partial<GetRecordParams<T>>) => {
    setLoading(true);
    setIsFetching(true);
    let response;
    const o = { ...options, ...lazyOptions };

    try {
      if (o.table === DataTable.RISK_FILE) {
        response = await api.getRiskFile<T>(o.id, o.query);

        const customTransformResult = o.transformResult;

        o.transformResult = (result: any) => {
          const parsedResult = {
            ...result,
            cr4de_discussion_required:
              result.cr4de_discussion_required != null
                ? JSON.parse(result.cr4de_discussion_required)
                : null,
          };

          if (customTransformResult) {
            return customTransformResult(parsedResult);
          }

          return parsedResult;
        };
      } else if (o.table === DataTable.RISK_CASCADE) {
        response = await api.getRiskCascade<T>(o.id, o.query);
      } else if (o.table === DataTable.VALIDATION) {
        response = await api.getValidation<T>(o.id, o.query);
      } else {
        // (o.table === DataTable.PAGE) {
        response = await api.getPage<T>(o.id, o.query);
      }
    } catch (e: any) {
      if (e.message === "Not Found") {
        setData(null);
        setLoading(false);
        setIsFetching(false);

        if (o.onError) await o.onError(404);

        return;
      }
      throw e;
    }

    const result = o.transformResult ? o.transformResult(response) : response;

    if (o.onComplete) await o.onComplete(result);
    setData(result);

    setLoading(false);
    setIsFetching(false);
  };

  return { loading, isFetching, data, getData };
}
