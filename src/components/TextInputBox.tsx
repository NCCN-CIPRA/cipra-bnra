import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import HtmlEditor, { Toolbar, Item } from "devextreme-react/html-editor";
import useDebounce from "../hooks/useDebounce";
import { Button, Stack } from "@mui/material";
import { DVAttachment } from "../types/dataverse/DVAttachment";
import { Popup, ScrollView } from "devextreme-react";
import useAPI from "../hooks/useAPI";
import { SmallRisk } from "../types/dataverse/DVSmallRisk";

export interface TextInputBoxGetter {
  getValue: (() => string) | null;
}

const sizeValues = ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"];
const fontValues = [
  "Arial",
  "Courier New",
  "Georgia",
  "Impact",
  "Lucida Console",
  "Roboto",
  "Tahoma",
  "Times New Roman",
  "Verdana",
];
const headerValues = [false, 1, 2, 3, 4, 5];

function TextInputBox({
  id,
  height = "300px",
  initialValue,
  limitedOptions,
  debounceInterval = 5000,
  disabled = false,
  reset,
  sources = null,
  allRisks = null,
  editorStyle = {},
  updateSources = null,

  onSave,
  onBlur,
  setUpdatedValue,
  onReset,
}: {
  id?: string;
  height?: string;
  initialValue: string | null;
  limitedOptions?: boolean;
  debounceInterval?: number;
  disabled?: boolean | null;
  reset?: boolean;
  allRisks?: SmallRisk[] | null;
  sources?: DVAttachment[] | null;
  editorStyle?: unknown;
  updateSources?: null | (() => Promise<unknown>);

  onSave?: (newValue: string | null) => void;
  onBlur?: () => void;
  setUpdatedValue?: (newValue: string | null | undefined) => void;
  onReset?: (oldValue: string | null) => void;
}) {
  const api = useAPI();
  const htmlEditor = useRef<HtmlEditor>(null);
  const cursor = useRef(0);
  const [savedValue, setSavedValue] = useState(initialValue);
  const [innerValue, setInnerValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useDebounce(
    innerValue,
    debounceInterval
  );
  const [sourcePopupVisible, setSourcesPopupVisible] = useState(false);
  const [riskFilesPopupVisible, setRiskFilesPopupVisible] = useState(false);

  useEffect(() => {
    if (onSave && debouncedValue !== savedValue) {
      onSave(debouncedValue);
      setSavedValue(debouncedValue);
    }
  }, [debouncedValue, savedValue, onSave, setSavedValue, setUpdatedValue]);

  useEffect(() => {
    if (reset) {
      const oldValue = innerValue;

      setSavedValue(initialValue);
      setInnerValue(initialValue);
      setDebouncedValue(initialValue);

      if (onReset) onReset(oldValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  const getSourcesButtonOptions = useMemo(
    () => ({
      // text: "Show markup",
      icon: "attach",
      stylingMode: "text",
      onClick: () => {
        setSourcesPopupVisible(true);
        if (htmlEditor.current) {
          cursor.current =
            htmlEditor.current.instance.getSelection()?.index || 0;
        }
      },
    }),
    []
  );

  const getRiskButtonOptions = useMemo(
    () => ({
      // text: "Show markup",
      icon: "share",
      stylingMode: "text",
      onClick: () => {
        setRiskFilesPopupVisible(true);
        if (htmlEditor.current) {
          cursor.current =
            htmlEditor.current.instance.getSelection()?.index || 0;
        }
      },
    }),
    []
  );

  const popupHiding = useCallback(() => {
    setSourcesPopupVisible(false);
    setRiskFilesPopupVisible(false);
  }, [setSourcesPopupVisible, setRiskFilesPopupVisible]);

  const insertSourceButtonClick = (a: DVAttachment) => {
    if (!htmlEditor.current || sources === null) return;

    let ref = a.cr4de_reference;
    if (ref === null) {
      ref =
        sources.reduce((max, s) => {
          if (s.cr4de_reference !== null && s.cr4de_reference > max)
            return s.cr4de_reference;

          return max;
        }, 0) + 1;

      api
        .updateAttachmentFields(a.cr4de_bnraattachmentid, {
          cr4de_reference: ref,
        })
        .then(updateSources);
    }

    htmlEditor.current.instance.insertEmbed(cursor.current, "link", {
      class: "ref-link",
      href: `#ref-${ref}`,
      text: `(${ref})`,
      target: null,
      font: "Arial",
      size: "10pt",
    });

    popupHiding();
  };

  const insertRiskFileButtonClick = (a: SmallRisk) => {
    if (!htmlEditor.current || sources === null) {
      return;
    }

    htmlEditor.current.instance.insertEmbed(cursor.current, "link", {
      class: "risk-link",
      href: `/risks/${a.cr4de_riskfilesid}`,
      text: a.cr4de_title,
      target: "_blank",
      font: "Arial",
      size: "10pt",
    });

    popupHiding();
  };

  return (
    <>
      <HtmlEditor
        id={id}
        ref={htmlEditor}
        height={height}
        value={innerValue}
        readOnly={Boolean(disabled)}
        onValueChanged={(e) => {
          setInnerValue(e.value);

          if (setUpdatedValue) setUpdatedValue(e.value);
        }}
        onFocusOut={onBlur}
        style={editorStyle}
      >
        <Toolbar multiline>
          <Item name="undo" />
          <Item name="redo" />
          <Item name="separator" />
          <Item name="size" acceptedValues={sizeValues} />
          <Item name="font" acceptedValues={fontValues} />
          <Item name="separator" />
          <Item name="bold" />
          <Item name="italic" />
          <Item name="strike" />
          <Item name="underline" />
          <Item name="separator" />
          <Item name="alignLeft" />
          <Item name="alignCenter" />
          <Item name="alignRight" />
          <Item name="alignJustify" />
          <Item name="separator" />
          <Item name="orderedList" />
          <Item name="bulletList" />
          <Item name="separator" />
          {!limitedOptions && (
            <Item name="header" acceptedValues={headerValues} />
          )}
          {!limitedOptions && <Item name="separator" />}
          {!limitedOptions && <Item name="color" />}
          {!limitedOptions && <Item name="background" />}
          {!limitedOptions && <Item name="separator" />}
          <Item name="link" />
          <Item name="separator" />
          <Item name="clear" />
          {!limitedOptions && <Item name="codeBlock" />}
          {!limitedOptions && <Item name="blockquote" />}
          {!limitedOptions && <Item name="separator" />}
          {!limitedOptions && <Item name="insertTable" />}
          {!limitedOptions && <Item name="deleteTable" />}
          {!limitedOptions && <Item name="insertRowAbove" />}
          {!limitedOptions && <Item name="insertRowBelow" />}
          {!limitedOptions && <Item name="deleteRow" />}
          {!limitedOptions && <Item name="insertColumnLeft" />}
          {!limitedOptions && <Item name="insertColumnRight" />}
          {!limitedOptions && <Item name="deleteColumn" />}
          {sources !== null || (allRisks !== null && <Item name="separator" />)}
          {sources !== null && (
            <Item widget="dxButton" options={getSourcesButtonOptions} />
          )}
          {allRisks !== null && (
            <Item widget="dxButton" options={getRiskButtonOptions} />
          )}
        </Toolbar>
      </HtmlEditor>
      {sources && (
        <Popup
          showTitle={true}
          title="Insert Reference"
          visible={sourcePopupVisible}
          onHiding={popupHiding}
          showCloseButton={true}
        >
          <ScrollView>
            <Stack direction="column">
              {sources.map((a) => (
                <Button
                  key={a.cr4de_bnraattachmentid}
                  id={a.cr4de_bnraattachmentid}
                  onClick={() => insertSourceButtonClick(a)}
                >
                  {a.cr4de_name}
                </Button>
              ))}
            </Stack>
          </ScrollView>
        </Popup>
      )}
      {allRisks && (
        <Popup
          showTitle={true}
          title="Insert Risk File Link"
          visible={riskFilesPopupVisible}
          onHiding={popupHiding}
          showCloseButton={true}
        >
          <ScrollView>
            <Stack direction="column">
              {allRisks
                .sort((a, b) =>
                  a.cr4de_hazard_id < b.cr4de_hazard_id ? -1 : 1
                )
                .map((a) => (
                  <Button
                    key={a.cr4de_riskfilesid}
                    id={a.cr4de_riskfilesid}
                    onClick={() => insertRiskFileButtonClick(a)}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    {a.cr4de_hazard_id} - {a.cr4de_title}
                  </Button>
                ))}
            </Stack>
          </ScrollView>
        </Popup>
      )}
    </>
  );
}

export default React.memo(TextInputBox);
