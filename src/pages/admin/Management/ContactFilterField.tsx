import { useEffect } from "react";
import { useDifferentDebounce } from "../../../hooks/useDebounce";
import { TextField } from "@mui/material";

export default function ContactFilterField({ filter, setFilter }: { filter: string; setFilter: (f: string) => void }) {
  const [displayFilter, debouncedFilter, setDebouncedFilter] = useDifferentDebounce(filter, 200);

  useEffect(() => {
    setFilter(debouncedFilter);
  }, [debouncedFilter]);

  return (
    <TextField
      id="standard-basic"
      placeholder="Filter expert name or risk file"
      variant="standard"
      fullWidth
      value={displayFilter}
      onChange={(e) => setDebouncedFilter(e.target.value)}
      sx={{ mr: 4 }}
    />
  );
}
