import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  CssBaseline,
  Typography,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Button,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import TitleBar from "../../components/TitleBar";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link as RouterLink } from "react-router-dom";
import TextInputBox from "../../components/TextInputBox";
import tableToJson from "../../functions/tableToJson";
import TransferList from "../../components/TransferList";
import SaveIcon from "@mui/icons-material/Save";

export default function ValidationPage() {
  const params = useParams();

  const [validation, setValidation] = useState<any>(null);
  const [riskFile, setRiskFile] = useState<any>(null);

  const [definition, setDefinition] = useState("");
  const [historicalEvents, setHistoricalEvents] = useState("");
  const [parameters, setParameters] = useState("");
  const [scenarios, setScenarios] = useState("");
  const [causes, setCauses] = useState("");
  const [effects, setEffects] = useState("");
  const [catalysing, setCatalysing] = useState("");
  const [horizon, setHorizon] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const getValidation = async function () {
      try {
        const response = await fetch(
          `https://bnra.powerappsportals.com/_api/cr4de_bnravalidations(${params.validation_id})?$expand=cr4de_RiskFile`,
          {
            method: "GET",
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQzMjMxOCwibmJmIjoxNjY0NDMyMzE5LCJleHAiOjE2NjQ0MzMyMTksImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.DSkyEOprtyUJ6juSh5fp1wRUTuH29GQpvLKpGS-rAJfOO98ZQmhzCkdj4zbq3BEH_XJDEJ2wIlvuNscu1HhfV55A37im1Lt0R-Im3rikctYX4mcVRlCCQJ00NA_KUJs5EPigqBZjo7FY9o1xjVuhXo1mOTs3Ozo18inuX0i5mWcuwEQ4oUPxS__NC4ARKTKfGJ4SHcxC3cdQfCLsCfi--AKfYZh5It4YXnuLnttNkRcFDD08lFBBlVKMOprwCcXJNCvzXEbJx9l9silBz_xWYUjed2PIY0ob_ErUiAj6uvMfJDtRu9cgj0pj2EEXyugYFASI2SU9lpz5_yzgFr5c_w",
              __RequestVerificationToken:
                localStorage.getItem("antiforgerytoken") || "",
              "Content-Type": "application/json",
            },
          }
        );

        const responseJson = await response.json();
        console.log(responseJson);
        setValidation(responseJson);

        setRiskFile({
          ...responseJson.cr4de_RiskFile,
          intensity_parameters: tableToJson(
            responseJson.cr4de_RiskFile.cr4de_intensity_parameters
          ),
          scenarios: {
            considerable: tableToJson(
              responseJson.cr4de_RiskFile.cr4de_scenario_considerable
            ),
            major: tableToJson(
              responseJson.cr4de_RiskFile.cr4de_scenario_major
            ),
            extreme: tableToJson(
              responseJson.cr4de_RiskFile.cr4de_scenario_extreme
            ),
          },
        });
      } catch (e) {
        console.log(e);
      }
    };

    getValidation();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (Object.keys(fieldsToUpdate).length <= 0) return;

      setSaving(true);

      try {
        await updateValidation();
      } catch (e) {
        // Empty by design
      }

      setSaving(false);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!validation || !riskFile) return null;

  const fieldsToUpdate: any = {};

  if (definition !== validation.cr4de_definition_feedback)
    fieldsToUpdate.cr4de_definition_feedback = definition;
  if (historicalEvents !== validation.cr4de_historical_events_feedback)
    fieldsToUpdate.cr4de_historical_events_feedback = historicalEvents;
  if (parameters !== validation.cr4de_intensity_parameters_feedback)
    fieldsToUpdate.cr4de_intensity_parameters_feedback = parameters;
  if (scenarios !== validation.cr4de_scenarios_feedback)
    fieldsToUpdate.cr4de_scenarios_feedback = scenarios;
  if (causes !== validation.cr4de_causes_feedback)
    fieldsToUpdate.cr4de_causes_feedback = causes;
  if (effects !== validation.cr4de_effects_feedback)
    fieldsToUpdate.cr4de_effects_feedback = effects;
  if (catalysing !== validation.cr4de_catalysing_effects_feedback)
    fieldsToUpdate.cr4de_catalysing_effects_feedback = catalysing;
  console.log(fieldsToUpdate);
  const updateValidation = async () => {
    if (!validation) return;

    if (Object.keys(fieldsToUpdate).length <= 0) return;

    return fetch(
      `https://bnra.powerappsportals.com/_api/cr4de_bnravalidations(${params.validation_id})`,
      {
        method: "PATCH",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQzMjMxOCwibmJmIjoxNjY0NDMyMzE5LCJleHAiOjE2NjQ0MzMyMTksImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.DSkyEOprtyUJ6juSh5fp1wRUTuH29GQpvLKpGS-rAJfOO98ZQmhzCkdj4zbq3BEH_XJDEJ2wIlvuNscu1HhfV55A37im1Lt0R-Im3rikctYX4mcVRlCCQJ00NA_KUJs5EPigqBZjo7FY9o1xjVuhXo1mOTs3Ozo18inuX0i5mWcuwEQ4oUPxS__NC4ARKTKfGJ4SHcxC3cdQfCLsCfi--AKfYZh5It4YXnuLnttNkRcFDD08lFBBlVKMOprwCcXJNCvzXEbJx9l9silBz_xWYUjed2PIY0ob_ErUiAj6uvMfJDtRu9cgj0pj2EEXyugYFASI2SU9lpz5_yzgFr5c_w",
          __RequestVerificationToken:
            localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fieldsToUpdate),
      }
    );
  };

  return (
    <>
      <CssBaseline />
      <TitleBar title="BNRA 2023 - 2026 Risk Identification - Validation" />
      <Box m={2} ml="76px">
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<NavigateNextIcon fontSize="small" />}
        >
          <Link underline="hover" color="inherit" to="/" component={RouterLink}>
            BNRA 2023 - 2026
          </Link>
          <Link
            underline="hover"
            color="inherit"
            to="/validation"
            component={RouterLink}
          >
            Validation
          </Link>
          <Typography color="text.primary">
            {riskFile && riskFile.cr4de_title}
          </Typography>
        </Breadcrumbs>
      </Box>
      <Container>
        <Paper>
          <Box p={2} my={4}>
            <Typography variant="h6" mb={1} color="secondary">
              1. Definition
            </Typography>
            <Divider />
            <Box
              mt={3}
              dangerouslySetInnerHTML={{ __html: riskFile.cr4de_definition }}
            />

            <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
              Please provide any comments or feedback on the definition of the
              hazard below:
            </Typography>

            <TextInputBox
              initialValue={validation.cr4de_definition_feedback}
              setValue={setDefinition}
            />
          </Box>
        </Paper>

        <Paper>
          <Box p={2} my={8}>
            <Typography variant="h6" mb={1} color="secondary">
              2. Historical Events
            </Typography>
            <Divider />

            <Box mt={1}>
              <Typography variant="caption" paragraph>
                Examples of events corresponding to the definition of this
                hazard in Belgium or other countries.
              </Typography>
              <Typography variant="caption" paragraph>
                This field is optional and serves as a guide when determining
                intensity parameters and building scenarios. It is in no way
                meant to be a complete overview of all known events.
              </Typography>
            </Box>

            <Table>
              <TableBody>
                {tableToJson(riskFile.cr4de_historical_events).map((e) => (
                  <TableRow key={e[2]}>
                    <TableCell
                      sx={{ whiteSpace: "nowrap", verticalAlign: "top" }}
                    >
                      <Typography variant="subtitle1">{e[1]}</Typography>
                      <Typography variant="subtitle2">{e[0]}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" paragraph>
                        {e[2]}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
              Please provide any comments or feedback on the historical event
              examples of the hazard below:
            </Typography>

            <TextInputBox
              initialValue={validation.cr4de_historicalEvents_feedback}
              setValue={setHistoricalEvents}
            />
          </Box>
        </Paper>

        <Paper>
          <Box p={2} my={8}>
            <Typography variant="h6" mb={1} color="secondary">
              3. Intensity Parameters
            </Typography>
            <Divider />

            <Box mt={1}>
              <Typography variant="caption" paragraph>
                Factors which influence the evolution and consequences of an
                event of this type.
              </Typography>
            </Box>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    Parameter Name
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    Parameter Description
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {riskFile.intensity_parameters.map((e: any) => (
                  <TableRow key={e[0]}>
                    <TableCell
                      sx={{ whiteSpace: "nowrap", verticalAlign: "top" }}
                    >
                      <Typography variant="body1">{e[0]}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" paragraph>
                        {e[1]}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
              Please provide any comments or feedback on the intensity
              parameters of the hazard below:
            </Typography>

            <TextInputBox
              initialValue={validation.cr4de_parameters_feedback}
              setValue={setParameters}
            />
          </Box>
        </Paper>

        <Paper>
          <Box p={2} my={8}>
            <Typography variant="h6" mb={1} color="secondary">
              4. Intensity Scenarios
            </Typography>
            <Divider />

            <Box mt={1}>
              <Typography variant="caption" paragraph>
                Outline of the scenarios according to three levels of intensity
                - <i>considerable, major</i> and <i>extreme</i> - described in
                terms of the intensity parameters defined in the previous
                section.
              </Typography>
              <Typography variant="caption" paragraph>
                Each scenario should be intuitively differentiable with respect
                to its impact, but no strict rules are defined as to the limits
                of the scenarios.
              </Typography>
            </Box>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    Parameter Name
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    Considerable
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Major</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Extreme</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {riskFile.intensity_parameters.map((p: any, i: number) => (
                  <TableRow key={p[0]}>
                    <TableCell
                      sx={{ whiteSpace: "nowrap", verticalAlign: "top" }}
                    >
                      <Typography variant="body1">{p[0]}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" paragraph>
                        {riskFile.scenarios.considerable[i][0]}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" paragraph>
                        {riskFile.scenarios.major[i][0]}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" paragraph>
                        {riskFile.scenarios.extreme[i][0]}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
              Please provide any comments or feedback on the intensity scenarios
              of the hazard below:
            </Typography>

            <TextInputBox
              initialValue={validation.cr4de_scenarios_feedback}
              setValue={setScenarios}
            />
          </Box>
        </Paper>

        <Paper>
          <Box p={2} my={8}>
            <Typography variant="h6" mb={1} color="secondary">
              5. Causing Hazards
            </Typography>
            <Divider />

            <Box mt={1}>
              <Typography variant="caption" paragraph>
                This section identifies other hazards in the BNRA hazard
                catalogue that may cause the current hazard. A short reason
                should be provided for each non-trivial causal relation.
              </Typography>
              <Typography variant="caption" paragraph>
                On the left are the hazards that were identified by NCCN analist
                as being a potential cause. On the right are all the other
                hazards in the hazard catalogue. The definition of a hazard
                selected in the windows below can be found beneath the comment
                box.
              </Typography>
            </Box>

            <TransferList
              choicesLabel="Non-causing hazards"
              chosenLabel="Causing hazards"
            />

            <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
              Please provide any comments or feedback on the intensity scenarios
              of the hazard below:
            </Typography>

            <TextInputBox
              initialValue={validation.cr4de_causes_feedback}
              setValue={setCauses}
            />
          </Box>
        </Paper>

        <Paper>
          <Box p={2} my={8}>
            <Typography variant="h6" mb={1} color="secondary">
              6. Effect Hazards
            </Typography>
            <Divider />

            <Box mt={1}>
              <Typography variant="caption" paragraph>
                This section identifies other hazards in the BNRA hazard
                catalogue that may be a direct consequence of the current
                hazard. A short reason should be provided for each non-trivial
                causal relation.
              </Typography>
              <Typography variant="caption" paragraph>
                On the left are the hazards that were identified by NCCN analist
                as being a potential effect. On the right are all the other
                hazards in the hazard catalogue. The definition of a hazard
                selected in the windows below can be found beneath the comment
                box.
              </Typography>
            </Box>

            <TransferList
              choicesLabel="Non-effect hazards"
              chosenLabel="Effect hazards"
            />

            <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
              Please provide any comments or feedback on the intensity scenarios
              of the hazard below:
            </Typography>

            <TextInputBox
              initialValue={validation.cr4de_effects_feedback}
              setValue={setEffects}
            />
          </Box>
        </Paper>

        <Paper>
          <Box p={2} my={8}>
            <Typography variant="h6" mb={1} color="secondary">
              7. Catalysing Effects
            </Typography>
            <Divider />

            <Box mt={1}>
              <Typography variant="caption" paragraph>
                This section tries to identifies the emerging risks in the BNRA
                hazard catalogue that may catalyse the current hazard (this
                means in the future it may have an effect on the probability
                and/or impact of this hazard). A short reason may be provided
                for each non-trivial causal relation.
              </Typography>
              <Typography variant="caption" paragraph>
                On the left are the hazards that were identified by NCCN analist
                as having a potential catalysing effect. On the right are all
                the other emerging risks in the hazard catalogue. The definition
                of a hazard selected in the windows below can be found beneath
                the comment box.
              </Typography>
            </Box>

            <TransferList
              choicesLabel="Non-catalysing hazards"
              chosenLabel="Catalysing hazards"
            />

            <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
              Please provide any comments or feedback on the intensity scenarios
              of the hazard below:
            </Typography>

            <TextInputBox
              initialValue={validation.cr4de_catalysing_feedback}
              setValue={setCatalysing}
            />
          </Box>
        </Paper>
      </Container>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          p: 1,
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
        component={Paper}
      >
        <Button color="error" sx={{ mr: 1 }}>
          Exit
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        {saving && (
          <LoadingButton
            color="secondary"
            sx={{ mr: 1 }}
            loading
            loadingPosition="start"
            startIcon={<SaveIcon />}
          >
            Saving
          </LoadingButton>
        )}
        {!saving && Object.keys(fieldsToUpdate).length > 0 && (
          <Button color="secondary" sx={{ mr: 1 }} onClick={updateValidation}>
            Save
          </Button>
        )}
        {!saving && Object.keys(fieldsToUpdate).length <= 0 && (
          <Button color="secondary" disabled sx={{ mr: 1 }}>
            Saved
          </Button>
        )}

        <Button color="secondary">Save & Exit</Button>
      </Box>
    </>
  );
}
