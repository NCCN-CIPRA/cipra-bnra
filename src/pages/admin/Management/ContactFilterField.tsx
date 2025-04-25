import { useEffect } from "react";
import { useDifferentDebounce } from "../../../hooks/useDebounce";
import { TextField, Typography } from "@mui/material";

export default function ContactFilterField({
  filter,
  setFilter,
  count,
}: {
  filter: string;
  setFilter: (f: string) => void;
  count: number;
}) {
  const [displayFilter, debouncedFilter, setDebouncedFilter] =
    useDifferentDebounce(filter, 200);

  useEffect(() => {
    setFilter(debouncedFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilter]);

  return (
    <>
      <TextField
        id="standard-basic"
        placeholder="Filter expert name or risk file"
        variant="standard"
        fullWidth
        value={displayFilter}
        onChange={(e) => setDebouncedFilter(e.target.value)}
        sx={{ mr: 4 }}
      />
      <Typography
        variant="subtitle2"
        sx={{ position: "absolute", right: 0, marginTop: 1 }}
      >
        ({count})
      </Typography>
    </>
  );
}
