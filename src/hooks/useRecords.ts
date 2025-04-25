import { useState, useEffect, useMemo, useRef } from "react";
import useLazyRecords, { GetRecordsParams } from "./useLazyRecords";

/**
 * Retrieve records from database when the page loads
 *
 * @param table The database table from which to retrieve records
 * @param query The WebAPI query to filter or expand records
 *
 * @returns {
 *  loading: A boolean indicating if the query is still running or not
 *  data: An array of records of the given type
 * }
 */
export default function useRecords<T>(options: GetRecordsParams<T>) {
  const { loading, isFetching, data, getData } = useLazyRecords<T>(options);

  const [_fired, setFired] = useState(false);
  const resolveFn = useRef<((data: T[]) => void) | null>(null);

  const dataPromise = useMemo(
    () =>
      new Promise<T[]>((resolve) => {
        resolveFn.current = resolve;
      }),
    []
  );

  useEffect(() => {
    if (_fired) return;

    getData().then((value) => {
      if (resolveFn.current) resolveFn.current(value);
    });
    setFired(true);
  }, [_fired, getData]);

  return { loading, isFetching, data, dataPromise, reloadData: getData };
}
