import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import {
  HistoricalEvent,
  unwrap,
  wrap,
} from "../../functions/historicalEvents";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { colors } from "../../functions/getCategoryColor";
import useAPI from "../../hooks/useAPI";
import { useEffect, useState } from "react";
import TextInputBox from "../../components/TextInputBox";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";

export default function HistoricalEvents({
  riskFile,
  mode,
  attachments = null,
  updateAttachments = null,
  isEditingOther,
  setIsEditing,
  reloadRiskFile,
  allRisks,
}: {
  riskFile: DVRiskFile;
  mode: "view" | "edit";
  attachments?: DVAttachment[] | null;
  updateAttachments?: null | (() => Promise<unknown>);
  isEditingOther: boolean;
  setIsEditing: (isEditing: boolean) => void;
  reloadRiskFile: () => Promise<unknown>;
  allRisks: SmallRisk[] | null;
}) {
  const api = useAPI();
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(-1);
  const [events, setEvents] = useState(
    unwrap(riskFile.cr4de_historical_events)
  );
  const [location, setLocation] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(
    () => setIsEditing(editing >= 0),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editing]
  );

  useEffect(
    () => setEvents(unwrap(riskFile.cr4de_historical_events)),
    [riskFile]
  );

  const colorList = Object.values(colors);

  const handleEdit = (event: HistoricalEvent, index: number) => {
    if (isEditingOther) {
      window.alert(
        "You are already editing another section. Please close this section before editing another."
      );
    } else {
      setEditing(index);
      setLocation(event.location);
      setTime(event.time);
      setDescription(event.description);
    }
  };

  const saveRiskFile = async (i: number) => {
    setSaving(true);

    const newEvents = [...events];
    newEvents[i].description = description;
    newEvents[i].time = time;
    newEvents[i].location = location;
    setEvents(newEvents);

    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      cr4de_historical_events: wrap(newEvents),
    });
    reloadRiskFile();
    // console.log("Saving:");
    // console.log(wrap(newEvents));

    setEditing(-1);
    // await reloadRiskFile();
    setSaving(false);
    // setOpen(false);
  };

  return (
    <Box
      sx={{ display: "flex", rowGap: 3, flexDirection: "column", mt: 2, ml: 0 }}
      className="historical"
    >
      {events.map((e, i) => {
        return (
          <Box
            key={e.id}
            className="historical-event-wrapper"
            sx={{
              backgroundColor: "white",
              borderLeft: "8px solid " + colorList[i],
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack direction="row">
              <Stack
                direction="column"
                sx={{
                  padding: 2,
                  justifyContent: "center",
                  width: 200,
                  flexShrink: 0,
                  borderRadius: 2,
                  rowGap: 1,
                }}
              >
                {editing === i ? (
                  <TextField
                    size="small"
                    defaultValue={time}
                    label="Time"
                    onChange={(e) => setTime(e.target.value)}
                  />
                ) : (
                  <Typography variant="subtitle2" sx={{}}>
                    {e.time}
                  </Typography>
                )}
                {editing === i ? (
                  <TextField
                    size="small"
                    defaultValue={location}
                    label="Location"
                    onChange={(e) => setLocation(e.target.value)}
                  />
                ) : (
                  <Typography variant="subtitle2">{e.location}</Typography>
                )}
              </Stack>
              {editing === i ? (
                <Box sx={{ py: 2 }}>
                  <TextInputBox
                    height="400px"
                    initialValue={description}
                    limitedOptions
                    setUpdatedValue={(v) => setDescription(v || "")}
                    sources={attachments}
                    updateSources={updateAttachments}
                    allRisks={allRisks}
                  />
                </Box>
              ) : (
                <Box
                  className="htmleditor"
                  sx={{ ml: 4, mr: 2, my: 1 }}
                  dangerouslySetInnerHTML={{ __html: e.description || "" }}
                />
              )}
            </Stack>
            {mode === "edit" && (editing < 0 || editing === i) && (
              <Stack
                direction="row"
                sx={{ borderTop: "1px solid #eee", pt: 1, mr: 2 }}
              >
                {editing !== i && (
                  <>
                    <Button onClick={() => handleEdit(e, i)}>Edit</Button>
                    <Box sx={{ flex: 1 }} />
                    {/* <Button
                      color="error"
                      loading={saving}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you wish to reset this field to default? All changes made to this field will be gone."
                          )
                        )
                          saveRiskFile();
                      }}
                    >
                      Reset to default
                    </Button> */}
                  </>
                )}
                {editing === i && (
                  <>
                    <Button loading={saving} onClick={() => saveRiskFile(i)}>
                      Save
                    </Button>
                    <Box sx={{ flex: 1 }} />
                    <Button
                      color="warning"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you wish to discard your changes?"
                          )
                        )
                          setEditing(-1);
                      }}
                    >
                      Discard Changes
                    </Button>
                  </>
                )}
              </Stack>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
