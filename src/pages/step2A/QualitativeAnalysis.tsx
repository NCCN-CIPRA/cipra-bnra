import TextInputBox from "../../components/TextInputBox";
import { Paper } from "@mui/material";
import SavingOverlay from "./SavingOverlay";

export default function QualitativeAnalysis({
  initialValue,
  handleUpdateValue,
}: {
  initialValue: string;
  handleUpdateValue: (v: string | null) => void;
}) {
  return (
    <>
      <Paper sx={{ p: 2 }}>
        <TextInputBox initialValue={initialValue} onSave={handleUpdateValue} debounceInterval={100} />
      </Paper>
    </>
  );
}
