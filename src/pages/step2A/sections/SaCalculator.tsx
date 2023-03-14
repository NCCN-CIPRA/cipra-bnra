import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Stack,
  TextField,
  CardActions,
  Button,
  Slide,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import { Trans, useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";

const SCALE_TO_SLIDER = {
  Hb0: 0,
  Hb1: 1,
  Hb2: 2,
  Hb3: 3,
  Hb4: 4,
  Hb5: 5,
};

const generateQualiInput = (severe: number, moderate: number, minor: number) => {
  return `
  <p>
Severe injuries and illnesses: ${severe}<br />
Moderate injuries and illnesses: ${moderate}<br />
Minor injuries and illnesses: ${minor}
</p>
`;
};

export default function SaCalculator({
  open,
  onClose,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  onApply: (scale: string, quali?: string) => void;
}) {
  const { t } = useTranslation();

  const [severe, setSevere] = useState(0);
  const [moderate, setModerate] = useState(0);
  const [minor, setMinor] = useState(0);

  const [scale, setScale] = useState<keyof typeof SCALE_TO_SLIDER>("Hb0");
  const [includeQuali, setIncludeQuali] = useState(false);

  useEffect(() => {
    const total = severe + 0.1 * moderate + 0.01 * minor;

    if (total === 0) setScale("Hb0");
    else if (total < 100) setScale("Hb1");
    else if (total < 1000) setScale("Hb2");
    else if (total < 10000) setScale("Hb3");
    else if (total < 100000) setScale("Hb4");
    else setScale("Hb5");
  }, [severe, moderate, minor, setScale]);

  return (
    <Slide direction="up" in={open}>
      <Card sx={{ position: "fixed", bottom: 72, right: 16, zIndex: 4000, width: 600 }} elevation={5}>
        <CardHeader
          avatar={
            <Avatar>
              <CalculateIcon />
            </Avatar>
          }
          title={t("calculator.title", "Impact Calculator")}
          subheader={t("2A.s.quanti.sa.title", "Sa - Supply shortfalls and unmet human needs")}
          action={
            <IconButton aria-label="settings" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          }
        />
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="body2" color="text.secondary">
              <Trans i18nKey="calculator.sa.helpText">
                Enter some indicative values in the correct order of magnitude below to automatically calculate the
                corresponding scale for Hb.
              </Trans>
            </Typography>
            <Stack direction="row">
              <FormControl>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                  //  value={age}
                  label="Age"
                  // onChange={handleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label={t("calculator.hb.severe", "People with severe injuries or illnesses")}
                helperText={t(
                  "calculator.hb.severe.helpText",
                  "Hospital stay of at least 7 days or chronic illness requiring medical treatment"
                )}
                variant="standard"
                type="number"
                value={severe}
                onChange={(e) => setSevere(e.target.value === "" ? 0 : parseInt(e.target.value, 10))}
              />
              <TextField
                label={t("calculator.hb.severe", "People with severe injuries or illnesses")}
                helperText={t(
                  "calculator.hb.severe.helpText",
                  "Hospital stay of at least 7 days or chronic illness requiring medical treatment"
                )}
                variant="standard"
                type="number"
                value={severe}
                onChange={(e) => setSevere(e.target.value === "" ? 0 : parseInt(e.target.value, 10))}
              />
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">
                <Trans i18nKey="calculator.result">Resulting Scale:</Trans>
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {scale}
              </Typography>
            </Stack>
            <FormControlLabel
              label={t("calculator.include", "Include calculation in qualitative input.")}
              control={<Checkbox checked={includeQuali} onChange={(e) => setIncludeQuali(e.target.checked)} />}
            />
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button color="error" onClick={onClose}>
            <Trans i18nKey="calculator.close">Close</Trans>
          </Button>
          <Button
            onClick={() => onApply(scale, includeQuali ? generateQualiInput(severe, moderate, minor) : undefined)}
          >
            <Trans i18nKey="calculator.apply">Apply</Trans>
          </Button>
        </CardActions>
      </Card>
    </Slide>
  );
}
