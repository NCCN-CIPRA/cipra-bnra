/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import useAPI, { DataTable } from "./useAPI";

export interface GetRecordsParams<T> {
  table: DataTable;
  query?: string;
  transformResult?: (result: any) => T[];
  saveOptions?: boolean;
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

  const [hasRun, setHasRun] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<T[] | null>(null);
  const [lastOptions, setLastOptions] = useState<GetRecordsParams<T>>(options);

  const getData = async (lazyOptions?: Partial<GetRecordsParams<T>>) => {
    let response;
    const o = { ...lastOptions, ...lazyOptions };

    if (o.saveOptions) setLastOptions(o);

    setHasRun(true);
    setIsFetching(true);

    if (o.table === DataTable.CONTACT) {
      response = await api.getContacts<T>(o.query);
    } else if (o.table === DataTable.RISK_FILE) {
      response = await api.getRiskFiles<T>(o.query);

      const customTransformResult = o.transformResult;

      o.transformResult = (result: any[]) => {
        const parsedResult = result.map((r) => ({
          ...r,
          cr4de_discussion_required:
            r.cr4de_discussion_required != null
              ? JSON.parse(r.cr4de_discussion_required)
              : null,
        }));

        if (customTransformResult) {
          return customTransformResult(parsedResult);
        }

        return parsedResult;
      };
    } else if (o.table === DataTable.RISK_CASCADE) {
      response = await api.getRiskCascades<T>(o.query);
    } else if (o.table === DataTable.PARTICIPATION) {
      response = await api.getParticipants<T>(o.query);
    } else if (o.table === DataTable.VALIDATION) {
      response = await api.getValidations<T>(o.query);
    } else if (o.table === DataTable.DIRECT_ANALYSIS) {
      response = await api.getDirectAnalyses<T>(o.query);

      const customTransformResult = o.transformResult;

      o.transformResult = (result: any[]) => {
        const parsedResult = result.map((r) => ({
          ...r,
          cr4de_quality:
            r.cr4de_quality != null ? JSON.parse(r.cr4de_quality) : null,
        }));

        if (customTransformResult) {
          return customTransformResult(parsedResult);
        }

        return parsedResult;
      };
    } else if (o.table === DataTable.CASCADE_ANALYSIS) {
      response = await api.getCascadeAnalyses<T>(o.query);
    } else if (o.table === DataTable.FEEDBACK) {
      response = await api.getFeedbacks<T>(o.query);
    } else if (o.table === DataTable.ATTACHMENT) {
      response = await api.getAttachments<T>(o.query);
    } else if (o.table === DataTable.ANALYSIS_RUN) {
      response = await api.getAnalysisRuns<T>(o.query);

      const customTransformResult = o.transformResult;

      o.transformResult = (result: any[]) => {
        const parsedResult = result.map((r) => ({
          ...r,
          cr4de_metrics:
            r.cr4de_metrics != null ? JSON.parse(r.cr4de_metrics) : null,
          cr4de_risk_file_metrics:
            r.cr4de_risk_file_metrics != null
              ? JSON.parse(r.cr4de_risk_file_metrics)
              : null,
          cr4de_results:
            r.cr4de_results != null ? JSON.parse(r.cr4de_results) : null,
        }));

        if (customTransformResult) {
          return customTransformResult(parsedResult);
        }

        return parsedResult;
      };
    } else if (o.table === DataTable.PAGE) {
      response = await api.getPages<T>(o.query);
    } else if (o.table === DataTable.RISK_SUMMARY) {
      response = await api.getRiskSummaries<T>(o.query);
    } else {
      // (o.table === DataTable.TRANSLATIONS) {
      response = await api.getTranslations<T>(o.query);
    }

    const result = o.transformResult ? o.transformResult(response) : response;

    setData(result);

    if (o.onComplete) o.onComplete(result);

    setLoading(false);
    setIsFetching(false);

    return result;
  };

  return { hasRun, loading, isFetching, data, getData };
}
