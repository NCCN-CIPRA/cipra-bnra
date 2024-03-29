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
  Alert,
  AlertTitle,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import { Trans, useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";

const SCALE_TO_SLIDER = {
  Sa0: 0,
  Sa1: 1,
  Sa2: 2,
  Sa3: 3,
  Sa4: 4,
  Sa5: 5,
};

const generateQualiInput = (shortfalls: { id: number; service: string; amount: number; duration: number }[]) => {
  return `<b>Calculation Results:</b><br />
  <p>
  ${shortfalls
    .filter((s) => SERVICE_WEIGHTS[s.service as keyof typeof SERVICE_WEIGHTS])
    .map((s) => {
      return `<u>${s.service}:</u> ${SERVICE_WEIGHTS[s.service as keyof typeof SERVICE_WEIGHTS]} (weight) x ${
        s.amount
      } people x ${s.duration} days`;
    })
    .join("<br />")}
</p>
`;
};

const getCorrespondingEffects = (
  shortfall: keyof typeof SERVICE_WEIGHTS,
  effects: DVRiskCascade<unknown, DVRiskFile>[]
) => {
  const riskFileIds = CORRESPONDING_RISK_FILES[shortfall];

  return effects.filter((e) => riskFileIds.indexOf(e._cr4de_effect_hazard_value) >= 0);
};

const SERVICE_WEIGHTS = {
  "Basic foodstuffs": 1,
  Electricity: 0.5,
  "Financial services": 0.5,
  "First responders communication": 1,
  Fuel: 0.1,
  Government: 0.1,
  Heating: 0.5,
  Media: 0.1,
  "Medical emergency service": 1,
  Medicine: 1,
  "Non-emergency medical care": 0.5,
  "Postal and courier services": 0.1,
  "Potable water": 1,
  Telecommunications: 0.5,
  Transport: 0.5,
  "Waste management": 0.1,
};

const CORRESPONDING_RISK_FILES: { [key in keyof typeof SERVICE_WEIGHTS]: string[] } = {
  "Basic foodstuffs": ["cf58db5b-aa6c-ed11-9561-000d3adf7089"],
  Electricity: ["b958db5b-aa6c-ed11-9561-000d3adf7089", "ba58db5b-aa6c-ed11-9561-000d3adf7089"],
  "Financial services": ["c158db5b-aa6c-ed11-9561-000d3adf7089"],
  "First responders communication": ["ca58db5b-aa6c-ed11-9561-000d3adf7089"],
  Fuel: ["bb58db5b-aa6c-ed11-9561-000d3adf7089"],
  Government: ["c858db5b-aa6c-ed11-9561-000d3adf7089"],
  Heating: [],
  Media: [],
  "Medical emergency service": ["c058db5b-aa6c-ed11-9561-000d3adf7089"],
  Medicine: ["c658db5b-aa6c-ed11-9561-000d3adf7089"],
  "Non-emergency medical care": ["c058db5b-aa6c-ed11-9561-000d3adf7089"],
  "Postal and courier services": ["cd58db5b-aa6c-ed11-9561-000d3adf7089"],
  "Potable water": ["c758db5b-aa6c-ed11-9561-000d3adf7089"],
  Telecommunications: ["c458db5b-aa6c-ed11-9561-000d3adf7089"],
  Transport: [
    "bc58db5b-aa6c-ed11-9561-000d3adf7089",
    "bd58db5b-aa6c-ed11-9561-000d3adf7089",
    "c258db5b-aa6c-ed11-9561-000d3adf7089",
    "c358db5b-aa6c-ed11-9561-000d3adf7089",
  ],
  "Waste management": ["c558db5b-aa6c-ed11-9561-000d3adf7089", "ce58db5b-aa6c-ed11-9561-000d3adf7089"],
};

export default function SaCalculator({
  open,
  effects,
  onClose,
  onApply,
}: {
  open: boolean;
  effects: DVRiskCascade<unknown, DVRiskFile>[];
  onClose: () => void;
  onApply: (scale: string, quali?: string) => void;
}) {
  const { t } = useTranslation();

  const [shortfalls, setShortfalls] = useState<
    {
      id: number;
      service: keyof typeof SERVICE_WEIGHTS | "";
      amount: number;
      duration: number;
      amountDisplay: string;
      durationDisplay: string;
    }[]
  >([{ id: 0, service: "", amount: 0, duration: 0, amountDisplay: "0", durationDisplay: "0" }]);

  const [scale, setScale] = useState<keyof typeof SCALE_TO_SLIDER>("Sa0");
  const [includeQuali, setIncludeQuali] = useState(false);

  useEffect(() => {
    const total = shortfalls.reduce((t, s) => {
      if (!SERVICE_WEIGHTS[s.service as keyof typeof SERVICE_WEIGHTS]) return t;

      return SERVICE_WEIGHTS[s.service as keyof typeof SERVICE_WEIGHTS] * s.amount * s.duration + t;
    }, 0);

    if (total === 0) setScale("Sa0");
    else if (total < 10000) setScale("Sa1");
    else if (total < 100000) setScale("Sa2");
    else if (total < 1000000) setScale("Sa3");
    else if (total < 10000000) setScale("Sa4");
    else setScale("Sa5");
  }, [shortfalls]);

  const addShortfall = () => {
    setShortfalls([
      ...shortfalls,
      {
        id: shortfalls[shortfalls.length - 1].id + 1,
        service: "",
        amount: 0,
        duration: 0,
        amountDisplay: "0",
        durationDisplay: "0",
      },
    ]);
  };

  const removeShortfall = (id: number) => {
    if (shortfalls.length <= 1)
      setShortfalls([
        {
          id: shortfalls[shortfalls.length - 1].id + 1,
          service: "",
          amount: 0,
          duration: 0,
          amountDisplay: "0",
          durationDisplay: "0",
        },
      ]);
    else setShortfalls(shortfalls.filter((s) => s.id !== id));
  };

  const handleChangeService = (id: number, service: keyof typeof SERVICE_WEIGHTS) => {
    setShortfalls(
      shortfalls.map((s) => {
        if (s.id !== id) return s;

        return {
          ...s,
          service,
        };
      })
    );
  };

  const handleChangeAmount = (id: number, amount: string) => {
    setShortfalls(
      shortfalls.map((s) => {
        if (s.id !== id) return s;

        return {
          ...s,
          amount: isNaN(parseInt(amount, 10)) ? 0 : parseInt(amount, 10),
          amountDisplay: amount,
        };
      })
    );
  };

  const handleChangeDuration = (id: number, duration: string) => {
    setShortfalls(
      shortfalls.map((s) => {
        if (s.id !== id) return s;

        return {
          ...s,
          duration: isNaN(parseInt(duration, 10)) ? 0 : parseInt(duration, 10),
          durationDisplay: duration,
        };
      })
    );
  };

  const overlappingEffects = shortfalls.reduce<DVRiskCascade<unknown, DVRiskFile>[]>(
    (acc, s) => (s.service === "" ? acc : [...acc, ...getCorrespondingEffects(s.service, effects)]),
    []
  );

  return (
    <Slide direction="up" in={open}>
      <Card
        sx={{
          position: "fixed",
          bottom: 72,
          right: 16,
          zIndex: 4000,
          width: 600,
          maxHeight: "calc(100vh - 152px)",
          overflowY: "scroll",
        }}
        elevation={5}
      >
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
            {overlappingEffects.length > 0 && (
              <Alert severity="warning">
                <AlertTitle>
                  <Trans i18nKey="calculator.sa.cascade.warning.title">Attention!</Trans>
                </AlertTitle>
                <Trans i18nKey="calculator.sa.cascade.warning.body">
                  You have selected a service which is also present in the potential consequences of this risk file.
                  Please be aware that you are currently analyzing the <b>direct</b> impact and should not take into
                  account the effects of cascade risks.
                </Trans>
                <Trans i18nKey="calculator.sa.cascade.warning.cascades">
                  The following cascade risks have been identified as potential consequences:
                </Trans>
                <ul>
                  {overlappingEffects.map((o) => (
                    <li>{`${o.cr4de_effect_hazard.cr4de_hazard_id} - ${o.cr4de_effect_hazard.cr4de_title}`}</li>
                  ))}
                </ul>
              </Alert>
            )}
            {shortfalls.map((s) => (
              <>
                <Stack key={s.id} direction="row" spacing={2}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel>Shortfall</InputLabel>
                    <Select
                      value={s.service}
                      label="Shortfall"
                      onChange={(e) => handleChangeService(s.id, e.target.value as keyof typeof SERVICE_WEIGHTS)}
                      MenuProps={{ sx: { zIndex: 4001 } }}
                    >
                      <MenuItem value={"Basic foodstuffs"}>
                        <Trans i18nKey="calculator.sa.food">Basic foodstuffs</Trans>
                      </MenuItem>
                      <MenuItem value={"Electricity"}>
                        <Trans i18nKey="calculator.sa.electricity">Electricity</Trans>
                      </MenuItem>
                      <MenuItem value={"Financial services"}>
                        <Trans i18nKey="calculator.sa.financial">Financial services</Trans>
                      </MenuItem>
                      <MenuItem value={"First responders communication"}>
                        <Trans i18nKey="calculator.sa.firstResponder">First responders communication</Trans>
                      </MenuItem>
                      <MenuItem value={"Fuel"}>
                        <Trans i18nKey="calculator.sa.fuel">Fuel</Trans>
                      </MenuItem>
                      <MenuItem value={"Government"}>
                        <Trans i18nKey="calculator.sa.government">Government</Trans>
                      </MenuItem>
                      <MenuItem value={"Heating"}>
                        <Trans i18nKey="calculator.sa.heating">Heating</Trans>
                      </MenuItem>
                      <MenuItem value={"Media"}>
                        <Trans i18nKey="calculator.sa.media">Media</Trans>
                      </MenuItem>
                      <MenuItem value={"Medical emergency service"}>
                        <Trans i18nKey="calculator.sa.emergency">Medical emergency service</Trans>
                      </MenuItem>
                      <MenuItem value={"Medicine"}>
                        <Trans i18nKey="calculator.sa.medicine">Medicine</Trans>
                      </MenuItem>
                      <MenuItem value={"Non-emergency medical care"}>
                        <Trans i18nKey="calculator.sa.care">Non-emergency medical care</Trans>
                      </MenuItem>
                      <MenuItem value={"Postal and courier services"}>
                        <Trans i18nKey="calculator.sa.post">Postal and courier services</Trans>
                      </MenuItem>
                      <MenuItem value={"Potable water"}>
                        <Trans i18nKey="calculator.sa.water">Potable water</Trans>
                      </MenuItem>
                      <MenuItem value={"Telecommunications"}>
                        <Trans i18nKey="calculator.sa.telecommunications">Telecommunications</Trans>
                      </MenuItem>
                      <MenuItem value={"Transport"}>
                        <Trans i18nKey="calculator.sa.transport">Transport</Trans>
                      </MenuItem>
                      <MenuItem value={"Waste management"}>
                        <Trans i18nKey="calculator.sa.waste">Waste management</Trans>
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label={t("calculator.sa.numberOfPeople", "# people")}
                    variant="outlined"
                    type="number"
                    value={s.amountDisplay}
                    onChange={(e) => handleChangeAmount(s.id, e.target.value)}
                    sx={{ width: 250 }}
                  />
                  <TextField
                    label={t("calculator.sa.duration", "Duration (days)")}
                    variant="outlined"
                    type="number"
                    value={s.durationDisplay}
                    onChange={(e) => handleChangeDuration(s.id, e.target.value)}
                    sx={{ width: 250 }}
                  />
                  <IconButton onClick={() => removeShortfall(s.id)} color="error">
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </Stack>
              </>
            ))}

            <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }} spacing={2}>
              <Button variant="outlined" onClick={addShortfall}>
                <Trans i18nKey="button.addAnother">Add Another</Trans>
              </Button>
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="justify-content" sx={{ mt: 4, mb: 2 }}>
            <Typography variant="body1" fontWeight="bold">
              <Trans i18nKey="calculator.result">Resulting Scale:</Trans>
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {scale}
            </Typography>
          </Stack>
          <FormControlLabel
            label={t("calculator.include", "Include calculation in qualitative input.")}
            control={<Checkbox checked={includeQuali} onChange={(e) => setIncludeQuali(e.target.checked)} />}
          />
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button color="error" onClick={onClose}>
            <Trans i18nKey="calculator.close">Close</Trans>
          </Button>
          <Button onClick={() => onApply(scale, includeQuali ? generateQualiInput(shortfalls) : undefined)}>
            <Trans i18nKey="calculator.apply">Apply</Trans>
          </Button>
        </CardActions>
      </Card>
    </Slide>
  );
}
