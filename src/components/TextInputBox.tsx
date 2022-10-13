import React, { ForwardedRef } from "react";
import HtmlEditor, { Toolbar, Item } from "devextreme-react/html-editor";

const sizeValues = ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"];
const fontValues = [
  "Arial",
  "Courier New",
  "Georgia",
  "Impact",
  "Lucida Console",
  "Tahoma",
  "Times New Roman",
  "Verdana",
];
const headerValues = [false, 1, 2, 3, 4, 5];

const TextInputBox = React.forwardRef(
  (
    {
      height = "300px",
      initialValue,
      value,
      limitedOptions,
      setValue,
      onBlur,
    }: {
      height?: string;
      initialValue?: string;
      value?: string | null;
      limitedOptions?: boolean;
      setValue: (value: string) => void;
      onBlur?: () => void;
    },
    ref?: ForwardedRef<HtmlEditor>
  ) => {
    return (
      <HtmlEditor
        ref={ref}
        height={height}
        defaultValue={value || initialValue || ""}
        value={value}
        onValueChanged={(e) => {
          setValue(e.value);
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
);

export default React.memo(TextInputBox);
