import { Box } from "@mui/material";
import { DVAttachment } from "../types/dataverse/DVAttachment";
import { SmallRisk } from "../types/dataverse/DVSmallRisk";

export interface TextInputBoxGetter {
  getValue: (() => string) | null;
}
/** 
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
*/
function TextInputBox({
  initialValue,
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
  return (
    <Box
      dangerouslySetInnerHTML={{
        __html: initialValue || "",
      }}
      sx={{
        mt: 1,
        mb: 2,
        ml: 1,
        pl: 1,
        borderLeft: "4px solid #eee",
      }}
    />
  );
}

export default TextInputBox;
