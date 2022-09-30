import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
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
import TextInputBox from "../../components/TextInputBox";
import tableToJson from "../../functions/tableToJson";
import TransferList from "../../components/TransferList";
import SaveIcon from "@mui/icons-material/Save";

export default function ValidationPage() {
  const params = useParams();
  const navigate = useNavigate();

  const [validation, setValidation] = useState<any>(null);
  const [riskFile, setRiskFile] = useState<any>(null);
  const [otherHazards, setOtherHazards] = useState<any>(null);
  const [causes, setCauses] = useState<any>(null);
  const [effects, setEffects] = useState<any>(null);
  const [catalysing, setCatalysing] = useState<any>(null);

  const [definitionFeedback, setDefinitionFeedback] = useState("");
  const [historicalEventsFeedback, setHistoricalEventsFeedback] = useState("");
  const [parametersFeedback, setParametersFeedback] = useState("");
  const [scenariosFeedback, setScenariosFeedback] = useState("");
  const [causesFeedback, setCausesFeedback] = useState("");
  const [effectsFeedback, setEffectsFeedback] = useState("");
  const [catalysingFeedback, setCatalysingFeedback] = useState("");
  const [horizonFeedback, setHorizonFeedback] = useState("");

  const [saving, setSaving] = useState(false);

  const fieldsToUpdate: any = {};

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
        setDefinitionFeedback(responseJson.cr4de_definition_feedback);
        setHistoricalEventsFeedback(responseJson.cr4de_historical_events_feedback);
        setParametersFeedback(responseJson.cr4de_intensity_parameters_feedback);
        setScenariosFeedback(responseJson.cr4de_scenarios_feedback);
        setCausesFeedback(responseJson.cr4de_causes_feedback);
        setEffectsFeedback(responseJson.cr4de_effects_feedback);
        setCatalysingFeedback(responseJson.cr4de_catalysing_effects_feedback);
        setHorizonFeedback(responseJson.cr4de_horizon_analysis_feedback);
      } catch (e) {
        console.log(e);
      }
    };

    getValidation();
  }, []);

  useEffect(() => {
    if (!riskFile || causes || effects || catalysing) return;

    const getOtherHazards = async function () {
      try {
        const response = await fetch(
          `https://bnra.powerappsportals.com/_api/cr4de_riskfileses?$filter=cr4de_riskfilesid ne ${riskFile.cr4de_riskfilesid}&$select=cr4de_riskfilesid,cr4de_title`,
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
        
        setOtherHazards(responseJson.value);
      } catch (e) {
        console.log(e);
      }
    };

    const getCauses = async function () {
      try {
        const response = await fetch(
          `https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades?$filter=_cr4de_effect_hazard_value eq ${riskFile.cr4de_riskfilesid} and not cr4de_is_catalyser&$expand=cr4de_cause_hazard`,
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
        
        setCauses(responseJson.value);
      } catch (e) {
        console.log(e);
      }
    };

    const getEffects = async function () {
      try {
        const response = await fetch(
          `https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades?$filter=_cr4de_cause_hazard_value eq ${riskFile.cr4de_riskfilesid}&$expand=cr4de_effect_hazard`,
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
        
        setEffects(responseJson.value);
      } catch (e) {
        console.log(e);
      }
    };

    const getCatalysers = async function () {
      try {
        const response = await fetch(
          `https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades?$filter=_cr4de_effect_hazard_value eq ${riskFile.cr4de_riskfilesid} and cr4de_is_catalyser&$expand=cr4de_cause_hazard`,
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
        
        setCatalysing(responseJson.value);
      } catch (e) {
        console.log(e);
      }
    };
    
    getOtherHazards();
    getCauses();
    getEffects();
    getCatalysers();
  }, [riskFile]);

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
  }, [fieldsToUpdate]);

  if (!validation || !riskFile) return null;

  if (definitionFeedback !== validation.cr4de_definition_feedback)
    fieldsToUpdate.cr4de_definition_feedback = definitionFeedback;
  if (historicalEventsFeedback !== validation.cr4de_historical_events_feedback)
    fieldsToUpdate.cr4de_historical_events_feedback = historicalEventsFeedback;
  if (parametersFeedback !== validation.cr4de_intensity_parameters_feedback)
    fieldsToUpdate.cr4de_intensity_parameters_feedback = parametersFeedback;
  if (scenariosFeedback !== validation.cr4de_scenarios_feedback)
    fieldsToUpdate.cr4de_scenarios_feedback = scenariosFeedback;
  if (causesFeedback !== validation.cr4de_causes_feedback)
    fieldsToUpdate.cr4de_causes_feedback = causesFeedback;
  if (effectsFeedback !== validation.cr4de_effects_feedback)
    fieldsToUpdate.cr4de_effects_feedback = effectsFeedback;
    if (catalysingFeedback !== validation.cr4de_catalysing_effects_feedback)
      fieldsToUpdate.cr4de_catalysing_effects_feedback = catalysingFeedback;
      if (horizonFeedback !== validation.cr4de_horizon_analysis_feedback)
        fieldsToUpdate.cr4de_horizon_analysis_feedback = horizonFeedback;
  console.log(causes, riskFile);
  const updateValidation = async () => {
    if (!validation) return;

    if (Object.keys(fieldsToUpdate).length <= 0) return;

    await fetch(
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

    setValidation({
      ...validation,
      ...fieldsToUpdate
    });
  };
console.log(riskFile.cr4de_risk_type)
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
              setValue={setDefinitionFeedback}
            />
          </Box>
        </Paper>

{riskFile.cr4de_risk_type === "Standard Risk" && (
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
              initialValue={validation.cr4de_historical_events_feedback}
              setValue={setHistoricalEventsFeedback}
            />
          </Box>
        </Paper>
)}


{riskFile.cr4de_risk_type === "Standard Risk" && (
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
              initialValue={validation.cr4de_intensity_parameters_feedback}
              setValue={setParametersFeedback}
            />
          </Box>
        </Paper>
)}

{riskFile.cr4de_risk_type === "Standard Risk" && (
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
              setValue={setScenariosFeedback}
            />
          </Box>
        </Paper>
)}

{riskFile.cr4de_risk_type === "Malicious Man-made Risk" && (
        <Paper>
          <Box p={2} my={8}>
              
          
            <Typography variant="h6" mb={1} color="secondary">
              2. Actor Capabilities
            </Typography>

            <Divider />

            <Box mt={1}>
              <Typography variant="caption" paragraph>
                Outline of the actor groups according to three levels of capabilities
                - <i>considerable, major</i> and <i>extreme</i>.
              </Typography>
              <Typography variant="caption" paragraph>
              The information contained in the risk files is considered 'Limited Distribution'.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2">Considerable Capabilities</Typography>
              <Box
                dangerouslySetInnerHTML={{ __html: riskFile.scenarios.considerable[0][0] }}
              />
              <Typography variant="subtitle2">Major Capabilities</Typography>
              <Box
                dangerouslySetInnerHTML={{ __html: riskFile.scenarios.major[0][0] }}
              />
              <Typography variant="subtitle2">Extreme Capabilities</Typography>
              <Box
                dangerouslySetInnerHTML={{ __html: riskFile.scenarios.extreme[0][0] }}
              />
            </Box>

            <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
              Please provide any comments or feedback on the actor capabilities
              of the hazard below:
            </Typography>

            <TextInputBox
              initialValue={validation.cr4de_scenarios_feedback}
              setValue={setScenariosFeedback}
            />
          </Box>
        </Paper>
)}

{riskFile.cr4de_risk_type === "Standard Risk" && (
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

{causes && otherHazards && (
            <TransferList
            choices={otherHazards.filter((rf: any) => causes.find((c: any) => c._cr4de_cause_hazard_value === rf.cr4de_riskfilesid))}
            chosen={causes.map((c: any) => c.cr4de_cause_hazard)}
              choicesLabel="Non-causing hazards"
              chosenLabel="Causing hazards"
            />)}

            <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
              Please provide any comments or feedback on the intensity scenarios
              of the hazard below:
            </Typography>

            <TextInputBox
              initialValue={validation.cr4de_causes_feedback}
              setValue={setCausesFeedback}
            />
          </Box>
        </Paper>
)}

{riskFile.cr4de_risk_type === "Malicious Man-made Risk" && effects &&otherHazards &&  (
        <Paper>
          <Box p={2} my={8}>
            <Typography variant="h6" mb={1} color="secondary">
            3. Malicious Actions
            </Typography>
            <Divider />

            <Box mt={1}>
              <Typography variant="caption" paragraph>
              This section tries to identify potential malicious actions in the BNRA hazard catalogue that may be taken by the actors described by this hazard. A short reason should be provided for each non-evident action.
              </Typography>
              <Typography variant="caption" paragraph>
              On the left are the hazards that were identified by NCCN analist as being a potential malicious actions. On the right are all the other malicious actions in the hazard catalogue. The definition of a hazard selected in the windows below can be found beneath the comment box.
              </Typography>
            </Box>

            <TransferList
            choices={otherHazards.filter((rf: any) => effects.find((c: any) => c._cr4de_effect_hazard_value === rf.cr4de_riskfilesid))}
            chosen={effects.map((c: any) => c.cr4de_effect_hazard)}
              choicesLabel="Non-potential action hazards"
              chosenLabel="Potential action hazards"
            />

            <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
              Please provide any comments or feedback on the list of potential actions of these actors below:
            </Typography>

            <TextInputBox
              initialValue={validation.cr4de_causes_feedback}
              setValue={setCausesFeedback}
            />
          </Box>
        </Paper>
)}

        {riskFile.cr4de_risk_type === "Standard Risk" && effects && otherHazards && (
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
            choices={otherHazards.filter((rf: any) => effects.find((c: any) => c._cr4de_effect_hazard_value === rf.cr4de_riskfilesid))}
            chosen={effects.map((c: any) => c.cr4de_effect_hazard)}
              choicesLabel="Non-effect hazards"
              chosenLabel="Effect hazards"
            />

            <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
              Please provide any comments or feedback on the intensity scenarios
              of the hazard below:
            </Typography>

            <TextInputBox
              initialValue={validation.cr4de_effects_feedback}
              setValue={setEffectsFeedback}
            />
          </Box>
        </Paper>
        )}

{catalysing &&otherHazards &&  (
        <Paper>
          <Box p={2} my={8}>
          {riskFile.cr4de_risk_type === "Standard Risk" && (
          <Typography variant="h6" mb={1} color="secondary">
              7. Catalysing Effects
            </Typography>
          )}
          {riskFile.cr4de_risk_type === "Malicious Man-made Risk" && (
          <Typography variant="h6" mb={1} color="secondary">
              4. Catalysing Effects
            </Typography>
          )}
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
            choices={otherHazards.filter((rf: any) => catalysing.find((c: any) => c._cr4de_effect_hazard_value === rf.cr4de_riskfilesid))}
            chosen={catalysing.map((c: any) => c.cr4de_cause_hazard)}
              choicesLabel="Non-catalysing hazards"
              chosenLabel="Catalysing hazards"
            />

            <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
              Please provide any comments or feedback on the intensity scenarios
              of the hazard below:
            </Typography>

            <TextInputBox
              initialValue={validation.cr4de_catalysing_effects_feedback}
              setValue={setCatalysingFeedback}
            />
          </Box>
        </Paper>
)}
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
        elevation={5}
      >
        <Button color="error" sx={{ mr: 1 }} component={RouterLink} to="/validation">
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

        <Button color="secondary" onClick={() => {
          updateValidation();
          navigate("/validation")
        }}>Save & Exit</Button>
      </Box>
    </>
  );
}
