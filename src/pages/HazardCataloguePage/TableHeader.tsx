import ArrowUpIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownIcon from "@mui/icons-material/ArrowDownward";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useTranslation } from "react-i18next";
import { IconButton, TableCell } from "@mui/material";
import { useState } from "react";

export default function TableHeader({
  name,
  width = "auto",
  minWidth = "auto",
  sort = null,
  onSort,
}: //   onFilter,
{
  name: string;
  width?: string;
  minWidth?: string;
  sort?: null | "ASC" | "DESC";
  onSort?: (s: null | "ASC" | "DESC") => void;
  //   onFilter: (v: string | null) => void;
}) {
  const { t } = useTranslation();

  //   const [sort, setSort] = useState<null | "ASC" | "DESC">(null);
  //   const [filter, setFilter] = useFilter<string | null>(null);

  return (
    <TableCell sx={{ pr: 3, width, minWidth, whiteSpace: "nowrap", ":hover .sortIcon": { opacity: 0.4 } }}>
      {name}
      {onSort && (
        <IconButton
          className="sortIcon"
          size="small"
          sx={{ p: 0, ml: 1, transition: ".3s opacity ease", opacity: sort === null ? 0 : 1 }}
          onClick={() => {
            if (sort === null) {
              onSort("ASC");
            } else if (sort === "ASC") {
              onSort("DESC");
            } else if (sort === "DESC") {
              onSort(null);
            }
          }}
        >
          {sort === "DESC" ? <ArrowDownIcon /> : <ArrowUpIcon />}
        </IconButton>
      )}
      {/* <IconButton size="small" sx={{ p: 0 }}>
        <FilterAltIcon />
      </IconButton> */}
    </TableCell>
  );
}
