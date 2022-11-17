import React, { useEffect, useState } from "react";
import HtmlEditor, { Toolbar, Item } from "devextreme-react/html-editor";
import useDebounce from "../hooks/useDebounce";
import { TextField } from "@mui/material";

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
  height = "300px",
  initialValue,
  limitedOptions,

  onSave,
  onBlur,
  setUpdatedValue,
}: {
  height?: string;
  initialValue: string | null;
  limitedOptions?: boolean;

  onSave?: (newValue: string | null) => void;
  onBlur?: () => void;
  setUpdatedValue?: (newValue: string | null | undefined) => void;
}) {
  const [savedValue, setSavedValue] = useState(initialValue);
  const [innerValue, setInnerValue] = useState(initialValue);
  const [debouncedValue] = useDebounce(innerValue, 2000);

  useEffect(() => {
    if (onSave && debouncedValue !== savedValue) {
      onSave(debouncedValue);
      setSavedValue(debouncedValue);
      setUpdatedValue && setUpdatedValue(undefined);
    }
  }, [debouncedValue, savedValue, onSave, setSavedValue, setUpdatedValue]);

  // @ts-ignore-next-line
  if (window.Cypress) {
    console.log("CYPRESSSS");
    return (
      <TextField
        multiline
        fullWidth
        minRows={6}
        value={innerValue || ""}
        onChange={(e) => {
          setInnerValue(e.target.value);
          if (setUpdatedValue) setUpdatedValue(e.target.value);
        }}
      />
    );
  }

  return (
    <HtmlEditor
      height={height}
      value={innerValue}
      onValueChanged={(e) => {
        setInnerValue(e.value);
        if (setUpdatedValue) setUpdatedValue(e.value);
      }}
      onFocusOut={onBlur}
    >
      <Toolbar multiline>
        <Item name="undo" />
        <Item name="redo" />
        <Item name="separator" />
        {!limitedOptions && <Item name="size" acceptedValues={sizeValues} />}
        {!limitedOptions && <Item name="font" acceptedValues={fontValues} />}
        {!limitedOptions && <Item name="separator" />}
        <Item name="bold" />
        <Item name="italic" />
        <Item name="strike" />
        <Item name="underline" />
        <Item name="separator" />
        {!limitedOptions && <Item name="alignLeft" />}
        {!limitedOptions && <Item name="alignCenter" />}
        {!limitedOptions && <Item name="alignRight" />}
        {!limitedOptions && <Item name="alignJustify" />}
        {!limitedOptions && <Item name="separator" />}
        <Item name="orderedList" />
        <Item name="bulletList" />
        <Item name="separator" />
        {!limitedOptions && <Item name="header" acceptedValues={headerValues} />}
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
      </Toolbar>
    </HtmlEditor>
  );
}

export default React.memo(TextInputBox);
