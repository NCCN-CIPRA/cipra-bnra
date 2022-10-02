import {
  Typography,
  CssBaseline,
  Container,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import TitleBar from "../../components/TitleBar";

const getScaleValue = (scaleString: string) => {
  if (scaleString === null) return 0;

  const matches = scaleString.match(/[A-Z]{1,2}([\d.]+)/);

  if (!matches || matches.length <= 1) return 0;

  return parseFloat(matches[1]);
};

const getScaleString = (scaleNumber: number, prefix: string) => {
  // Round to nearest 0.5
  const rounded = Math.round(scaleNumber * 2) / 2;

  return `${prefix}${rounded}`;
};

const getAverage = (
  fieldName: string,
  scalePrefix: string,
  record: any,
  analyses: any
) => {
  if (record[fieldName]) return record[fieldName];

  if (analyses.length <= 0) return getScaleString(0, scalePrefix);

  return getScaleString(
    analyses.reduce(
      (acc: number, an: any) => acc + getScaleValue(an[fieldName]),
      0
    ) / analyses.length,
    scalePrefix
  );
};

export default function AnalysisAveragerPage() {
  const [riskFiles, setRiskFiles] = useState<{ [key: string]: any } | null>(
    null
  );
  const [cascades, setCascades] = useState<any[] | null>(null);
  const [directAnalyses, setDirectAnalyses] = useState<any[] | null>(null);
  const [cascadeAnalyses, setCascadeAnalyses] = useState<any[] | null>(null);

  const [updatedDAs, setUpdatedDAs] = useState(0);
  const [updatedCAs, setUpdatedCAs] = useState(0);

  useEffect(() => {
    const getRiskFiles = async () => {
      const response = await fetch(
        `https://bnra.powerappsportals.com/_api/cr4de_riskfileses`,
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

      setRiskFiles(responseJson.value);
    };
    const getCascades = async () => {
      const response = await fetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades`,
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

      setCascades(responseJson.value);
    };

    const getDirectAnalyses = async () => {
      const response = await fetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnradirectanalysises`,
        {
          method: "GET",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQzMjMxOCwibmJmIjoxNjY0NDMyMzE5LCJleHAiOjE2NjQ0MzMyMTksImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.DSkyEOprtyUJ6juSh5fp1wRUTuH29GQpvLKpGS-rAJfOO98ZQmhzCkdj4zbq3BEH_XJDEJ2wIlvuNscu1HhfV55A37im1Lt0R-Im3rikctYX4mcVRlCCQJ00NA_KUJs5EPigqBZjo7FY9o1xjVuhXo1mOTs3Ozo18inuX0i5mWcuwEQ4oUPxS__NC4ARKTKfGJ4SHcxC3cdQfCLsCfi--AKfYZh5It4YXnuLnttNkRcFDD08lFBBlVKMOprwCcXJNCvzXEbJx9l9silBz_xWYUjed2PIY0ob_ErUiAj6uvMfJDtRu9cgj0pj2EEXyugYFASI2SU9lpz5_yzgFr5c_w",
            __RequestVerificationToken:
              localStorage.getItem("antiforgerytoken") || "",
            "Content-Type": "application/json",
            Prefer: 'odata.include-annotations="*"',
          },
        }
      );

      const responseJson = await response.json();

      setDirectAnalyses(responseJson.value);
    };

    const getCascadeAnalyses = async () => {
      const response = await fetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnracascadeanalysises`,
        {
          method: "GET",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQzMjMxOCwibmJmIjoxNjY0NDMyMzE5LCJleHAiOjE2NjQ0MzMyMTksImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.DSkyEOprtyUJ6juSh5fp1wRUTuH29GQpvLKpGS-rAJfOO98ZQmhzCkdj4zbq3BEH_XJDEJ2wIlvuNscu1HhfV55A37im1Lt0R-Im3rikctYX4mcVRlCCQJ00NA_KUJs5EPigqBZjo7FY9o1xjVuhXo1mOTs3Ozo18inuX0i5mWcuwEQ4oUPxS__NC4ARKTKfGJ4SHcxC3cdQfCLsCfi--AKfYZh5It4YXnuLnttNkRcFDD08lFBBlVKMOprwCcXJNCvzXEbJx9l9silBz_xWYUjed2PIY0ob_ErUiAj6uvMfJDtRu9cgj0pj2EEXyugYFASI2SU9lpz5_yzgFr5c_w",
            __RequestVerificationToken:
              localStorage.getItem("antiforgerytoken") || "",
            "Content-Type": "application/json",
            Prefer: 'odata.include-annotations="*"',
          },
        }
      );

      const responseJson = await response.json();

      setCascadeAnalyses(responseJson.value);
    };

    getRiskFiles();
    getCascades();
    getDirectAnalyses();
    getCascadeAnalyses();
  }, []);

  const averageDirectAnalyses = async () => {
    if (riskFiles && directAnalyses) {
      for (let i = 0; i < riskFiles.length; i++) {
        const riskFile = riskFiles[i];
        const analyses = directAnalyses.filter(
          (da) => da._cr4de_risk_file_value === riskFile.cr4de_riskfilesid
        );

        if (riskFile) {
          const fieldsToUpdate = {
            cr4de_dp_quanti_c: getAverage(
              "cr4de_dp_quanti_c",
              riskFile.cr4de_risk_type === "Malicious Man-made Risk"
                ? "M"
                : "DP",
              riskFile,
              analyses
            ),
            cr4de_dp_quanti_m: getAverage(
              "cr4de_dp_quanti_m",
              riskFile.cr4de_risk_type === "Malicious Man-made Risk"
                ? "M"
                : "DP",
              riskFile,
              analyses
            ),
            cr4de_dp_quanti_e: getAverage(
              "cr4de_dp_quanti_e",
              riskFile.cr4de_risk_type === "Malicious Man-made Risk"
                ? "M"
                : "DP",
              riskFile,
              analyses
            ),

            cr4de_di_quanti_ha_c: getAverage(
              "cr4de_di_quanti_ha_c",
              "Ha",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_hb_c: getAverage(
              "cr4de_di_quanti_hb_c",
              "Hb",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_hc_c: getAverage(
              "cr4de_di_quanti_hc_c",
              "Hc",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_sa_c: getAverage(
              "cr4de_di_quanti_sa_c",
              "Sa",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_sb_c: getAverage(
              "cr4de_di_quanti_sb_c",
              "Sb",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_sc_c: getAverage(
              "cr4de_di_quanti_sc_c",
              "Sc",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_sd_c: getAverage(
              "cr4de_di_quanti_sd_c",
              "Sd",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_ea_c: getAverage(
              "cr4de_di_quanti_ea_c",
              "Ea",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_fa_c: getAverage(
              "cr4de_di_quanti_fa_c",
              "Fa",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_fb_c: getAverage(
              "cr4de_di_quanti_fb_c",
              "Fb",
              riskFile,
              analyses
            ),

            cr4de_di_quanti_ha_m: getAverage(
              "cr4de_di_quanti_ha_m",
              "Ha",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_hb_m: getAverage(
              "cr4de_di_quanti_hb_m",
              "Hb",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_hc_m: getAverage(
              "cr4de_di_quanti_hc_m",
              "Hc",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_sa_m: getAverage(
              "cr4de_di_quanti_sa_m",
              "Sa",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_sb_m: getAverage(
              "cr4de_di_quanti_sb_m",
              "Sb",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_sc_m: getAverage(
              "cr4de_di_quanti_sc_m",
              "Sc",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_sd_m: getAverage(
              "cr4de_di_quanti_sd_m",
              "Sd",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_ea_m: getAverage(
              "cr4de_di_quanti_ea_m",
              "Ea",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_fa_m: getAverage(
              "cr4de_di_quanti_fa_m",
              "Fa",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_fb_m: getAverage(
              "cr4de_di_quanti_fb_m",
              "Fb",
              riskFile,
              analyses
            ),

            cr4de_di_quanti_ha_e: getAverage(
              "cr4de_di_quanti_ha_e",
              "Ha",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_hb_e: getAverage(
              "cr4de_di_quanti_hb_e",
              "Hb",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_hc_e: getAverage(
              "cr4de_di_quanti_hc_e",
              "Hc",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_sa_e: getAverage(
              "cr4de_di_quanti_sa_e",
              "Sa",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_sb_e: getAverage(
              "cr4de_di_quanti_sb_e",
              "Sb",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_sc_e: getAverage(
              "cr4de_di_quanti_sc_e",
              "Sc",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_sd_e: getAverage(
              "cr4de_di_quanti_sd_e",
              "Sd",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_ea_e: getAverage(
              "cr4de_di_quanti_ea_e",
              "Ea",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_fa_e: getAverage(
              "cr4de_di_quanti_fa_e",
              "Fa",
              riskFile,
              analyses
            ),
            cr4de_di_quanti_fb_e: getAverage(
              "cr4de_di_quanti_fb_e",
              "Fb",
              riskFile,
              analyses
            ),
          };

          const response = await fetch(
            `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`,
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

          if (response.status !== 204) {
            return console.error(
              "FAILED ON PATCH: ",
              riskFile,
              analyses,
              fieldsToUpdate
            );
          }
        }

        setUpdatedDAs(i + 1);
      }
    }
  };

  const averageCascadeAnalyses = async () => {
    if (cascades && cascadeAnalyses) {
      for (let i = 0; i < cascades.length; i++) {
        const cascade = cascades[i];
        const analyses = cascadeAnalyses.filter(
          (da) => da._cr4de_cascade_value === cascade.cr4de_bnrariskcascadeid
        );

        if (cascade && analyses.length > 0) {
          const fieldsToUpdate = {
            cr4de_c2c:
              cascade.c2c || getAverage("cr4de_c2c", "CP", cascade, analyses),
            cr4de_c2m:
              cascade.c2m || getAverage("cr4de_c2m", "CP", cascade, analyses),
            cr4de_c2e:
              cascade.c2e || getAverage("cr4de_c2e", "CP", cascade, analyses),

            cr4de_m2c:
              cascade.m2c || getAverage("cr4de_m2c", "CP", cascade, analyses),
            cr4de_m2m:
              cascade.m2m || getAverage("cr4de_m2m", "CP", cascade, analyses),
            cr4de_m2e:
              cascade.m2e || getAverage("cr4de_m2e", "CP", cascade, analyses),

            cr4de_e2c:
              cascade.e2c || getAverage("cr4de_e2c", "CP", cascade, analyses),
            cr4de_e2m:
              cascade.e2m || getAverage("cr4de_e2m", "CP", cascade, analyses),
            cr4de_e2e:
              cascade.e2e || getAverage("cr4de_e2e", "CP", cascade, analyses),
          };

          const response = await fetch(
            `https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades(${cascade.cr4de_bnrariskcascadeid})`,
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

          if (response.status !== 204) {
            return console.error(
              "FAILED ON PATCH: ",
              cascade,
              analyses,
              fieldsToUpdate
            );
          }
        }

        setUpdatedCAs(i + 1);
      }
    }
  };

  return (
    <>
      <Container sx={{ mt: 4, pb: 8 }}>
        <Paper sx={{ p: 2 }}>
          <Typography>
            {riskFiles
              ? `Loaded ${riskFiles.length} risk files`
              : "Loading risk files..."}
          </Typography>
          <Typography>
            {cascades
              ? `Loaded ${cascades.length} risk cascades`
              : "Loading risk cascades..."}
          </Typography>
          <Typography>
            {directAnalyses
              ? `Loaded ${directAnalyses.length} direct analysis objects to process`
              : "Loading direct analyses..."}
          </Typography>
          <Typography>
            {cascadeAnalyses
              ? `Loaded ${cascadeAnalyses.length} cascade analysis objects to process`
              : "Loading cascade analyses..."}
          </Typography>
          {riskFiles && directAnalyses && updatedDAs > 0 && (
            <Typography sx={{ mb: 2 }}>
              Updating direct analysis averages ({updatedDAs}/{riskFiles.length}
              )
            </Typography>
          )}
          {cascades && cascadeAnalyses && updatedCAs > 0 && (
            <Typography sx={{ mb: 2 }}>
              Updating cascade analysis averages ({updatedCAs}/{cascades.length}
              )
            </Typography>
          )}
          <Stack direction="row">
            <Button onClick={averageDirectAnalyses}>
              Average Direct Analyses
            </Button>
            <Button onClick={averageCascadeAnalyses}>
              Average Cascade Analyses
            </Button>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}
