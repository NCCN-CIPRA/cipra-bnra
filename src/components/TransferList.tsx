import React, { ReactNode, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItemButton from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Button from "@mui/material/Button";
import { Divider, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Trans } from "react-i18next";

type SIDE = "LEFT" | "RIGHT";

function TransferList({
  choicesLabel,
  choicesSubheader,
  chosenLabel,
  chosenSubheader,
  choices,
  chosen,
}: {
  choicesLabel: string;
  choicesSubheader?: string;
  chosenLabel: string;
  chosenSubheader?: string;
  choices: any[];
  chosen: any[];
}) {
  const [selected, setSelected] = useState<{
    side: SIDE;
    index: number;
  } | null>(null);

  const handleListItemClick = (side: SIDE, index: number) => {
    setSelected({ side, index });
  };

  const customList = (title: ReactNode, items: readonly any[], side: SIDE, subheader?: string) => (
    <Card elevation={0} sx={{ border: "1px solid #eee", flex: 1, mt: 2 }}>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        title={title}
        avatar={" "}
        subheader={subheader || "-"}
        subheaderTypographyProps={subheader ? {} : { sx: { color: "rgba(0, 0, 0, 0)" } }}
      />
      <Divider />
      <List
        sx={{
          width: "100%",
          height: 230,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value: any, i) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItemButton
              key={value.cr4de_riskfilesid}
              role="listitem"
              button
              selected={Boolean(selected && selected.side === side && selected.index === i)}
              onClick={(event) => handleListItemClick(side, i)}
            >
              <ListItemIcon>{value.cr4de_hazard_id}</ListItemIcon>
              <ListItemText id={labelId} primary={value.cr4de_title} />
            </ListItemButton>
          );
        })}
        <ListItemButton />
      </List>
    </Card>
  );

  return (
    <>
      <Box justifyContent="center" alignItems="center" sx={{ display: "flex", flexDirection: "row" }}>
        {customList(choicesLabel, choices, "LEFT", choicesSubheader)}
        <Box alignItems="center" sx={{ mx: 2, display: "flex", flexDirection: "column" }}>
          <ArrowForwardIcon color="disabled" fontSize="large" />
        </Box>
        {customList(chosenLabel, chosen, "RIGHT", chosenSubheader)}
      </Box>
      {selected && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 2,
            p: 1,
            border: "1px solid #eee",
          }}
        >
          <Typography variant="subtitle2" mb={1}>
            <Trans i18nKey="transferList.definition">Definition of</Trans> '
            {(selected.side === "LEFT" ? choices : chosen)[selected.index].cr4de_title}'
          </Typography>
          <Box
            dangerouslySetInnerHTML={{
              __html: (selected.side === "LEFT" ? choices : chosen)[selected.index].cr4de_definition,
            }}
          />
        </Box>
      )}
      {selected && selected.side === "RIGHT" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 2,
            p: 1,
            border: "1px solid #eee",
          }}
        >
          <Typography variant="subtitle2" mb={1}>
            <Trans i18nKey="transferList.reason">Reason for the causal relationship</Trans>
          </Typography>
          <Box
            dangerouslySetInnerHTML={{
              __html: chosen[selected.index].reason,
            }}
          />
        </Box>
      )}
    </>
  );
}

export default React.memo(TransferList);
