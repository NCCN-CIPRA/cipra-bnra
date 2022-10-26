import React, { ReactNode, useEffect, useRef, useState } from "react";
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
import { SmallRisk } from "../types/dataverse/DVSmallRisk";
import TextInputBox from "./TextInputBox";
import { HtmlEditor } from "devextreme-react";

type SIDE = "LEFT" | "RIGHT";

interface CascadeRisk extends SmallRisk {
  cascadeId: string;
  reason: string;
}

function TransferList({
  choicesLabel,
  choicesSubheader,
  chosenLabel,
  chosenSubheader,
  choices,
  chosen,
  onAddChosen,
  onRemoveChosen,
  onChangeReason,
}: {
  choicesLabel: string;
  choicesSubheader?: string;
  chosenLabel: string;
  chosenSubheader?: string;
  choices: SmallRisk[];
  chosen: CascadeRisk[];
  onAddChosen?: (added: SmallRisk) => void;
  onRemoveChosen?: (removed: CascadeRisk) => void;
  onChangeReason?: (selected: CascadeRisk, newReason: string | null) => void;
}) {
  const [selected, setSelected] = useState<{
    side: SIDE;
    index: number;
  } | null>(null);
  const reason = useRef<string | null>(null);
  const [hasChanged, setHasChanged] = useState(false);
  const [resetTextInput, setResetTextInput] = useState(false);

  const handleListItemClick = (side: SIDE, index: number) => {
    commitChangedReason();
    setSelected({ side, index });
    if (side === "RIGHT") {
      reason.current = chosen[index].reason;
    } else {
      reason.current = null;
    }
    setResetTextInput(!resetTextInput);
  };

  const handleChangeReason = (newReason: string | null | undefined) => {
    if (newReason === undefined) {
      setHasChanged(false);
    } else {
      reason.current = newReason;
      setHasChanged(true);
    }
  };

  const commitChangedReason = () => {
    if (hasChanged && onChangeReason && selected) {
      setHasChanged(false);
      onChangeReason(chosen[selected.index], reason.current);
    }
  };

  const customList = (title: ReactNode, items: readonly any[], side: SIDE, subheader?: string) => (
    <Card elevation={0} sx={{ border: "1px solid #eee", flex: 1, mt: 2 }}>
      <CardHeader
        sx={{ ml: -2, py: 1 }}
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
          {onAddChosen && onRemoveChosen ? (
            <>
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={() => {
                  if (selected) {
                    setSelected(null);
                    onAddChosen(choices[selected.index]);
                  }
                }}
                disabled={choices.length === 0 || selected?.side !== "LEFT"}
                aria-label="move selected right"
              >
                &gt;
              </Button>
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={() => {
                  if (selected) {
                    setSelected(null);
                    selected && onRemoveChosen(chosen[selected.index]);
                  }
                }}
                disabled={chosen.length === 0 || selected?.side !== "RIGHT"}
                aria-label="move selected left"
              >
                &lt;
              </Button>
            </>
          ) : (
            <ArrowForwardIcon color="disabled" fontSize="large" />
          )}
        </Box>
        {customList(chosenLabel, chosen, "RIGHT", chosenSubheader)}
      </Box>
      {selected && selected.side === "RIGHT" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 2,
          }}
        >
          <Typography variant="subtitle2" mb={1}>
            <Trans i18nKey="transferList.reason">Reason for the causal relationship</Trans>
          </Typography>
          {onChangeReason ? (
            <>
              {resetTextInput && (
                <TextInputBox
                  initialValue={reason.current || ""}
                  onSave={commitChangedReason}
                  setUpdatedValue={handleChangeReason}
                  onBlur={commitChangedReason}
                />
              )}
              {!resetTextInput && (
                <TextInputBox
                  initialValue={reason.current || ""}
                  onSave={commitChangedReason}
                  setUpdatedValue={handleChangeReason}
                  onBlur={commitChangedReason}
                />
              )}
            </>
          ) : (
            <Box
              dangerouslySetInnerHTML={{
                __html: chosen[selected.index].reason || "<p>(No reason provided)</p>",
              }}
            />
          )}
        </Box>
      )}
      {selected && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 2,
          }}
        >
          <Typography variant="subtitle2" mb={1}>
            <Trans i18nKey="transferList.definition">Definition of</Trans> '
            {(selected.side === "LEFT" ? choices : chosen)[selected.index].cr4de_title}'
          </Typography>
          <Box
            dangerouslySetInnerHTML={{
              __html:
                (selected.side === "LEFT" ? choices : chosen)[selected.index].cr4de_definition ||
                "<p>(No definition provided)</p>",
            }}
          />
        </Box>
      )}
    </>
  );
}

export default React.memo(TransferList);
