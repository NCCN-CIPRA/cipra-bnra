import { useState, useEffect } from "react";
import useLazyRecord, { GetRecordParams } from "./useLazyRecord";

/**
 * Retrieve a record from the database when the page loads
 *
 * @param table The database table from which to retrieve records
 * @param id The database id of the record to retrieve
 * @param query The WebAPI query to filter or expand records
 *
 * @returns {
 *  loading: A boolean indicating if the query is still running or not
 *  data: An array of records of the given type
 * }
 */
export default function useRecord<T>(options: GetRecordParams<T>) {
  const { loading, isFetching, data, getData } = useLazyRecord<T>(options);

  const [_fired, setFired] = useState(false);

  useEffect(() => {
    if (_fired) return;

    getData();
    setFired(true);
  }, [_fired, getData]);

  useEffect(() => {
    if (_fired && data) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.id]);

  return { loading, isFetching, data, reloadData: getData };
}
