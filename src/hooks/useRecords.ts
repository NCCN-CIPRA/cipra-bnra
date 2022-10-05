import { useState, useEffect } from "react";
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
  const { loading, data, getData } = useLazyRecords<T>(options);

  const [_fired, setFired] = useState(false);

  useEffect(() => {
    if (_fired) return;

    getData();
    setFired(true);
  }, [_fired, getData]);

  return { loading, data, reloadData: getData };
}
