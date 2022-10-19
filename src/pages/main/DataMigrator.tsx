import { Typography, CssBaseline, Container, Paper } from "@mui/material";
import TitleBar from "../../components/TitleBar";
import { useEffect, useState } from "react";
import { dir } from "console";

export default function DataMigrator() {
  const [riskFiles, setRiskFiles] = useState<{ [key: string]: any } | null>(null);
  const [cascades, setCascades] = useState<any[] | null>(null);
  const [cascadeDict, setCascadeDict] = useState<{ [key: string]: any } | null>(null);
  const [directAnalyses, setDirectAnalyses] = useState<any[] | null>(null);
  const [cascadeAnalyses, setCascadeAnalyses] = useState<any[] | null>(null);

  const [updatedCascades, setUpdatedCascades] = useState(0);
  const [updatedDAs, setUpdatedDAs] = useState(0);
  const [updatedCAs, setUpdatedCAs] = useState(0);

  useEffect(() => {
    if (riskFiles) return;

    const getRiskFiles = async () => {
      const response = await fetch(`https://bnra.powerappsportals.com/_api/cr4de_riskfileses`, {
        method: "GET",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQzMjMxOCwibmJmIjoxNjY0NDMyMzE5LCJleHAiOjE2NjQ0MzMyMTksImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.DSkyEOprtyUJ6juSh5fp1wRUTuH29GQpvLKpGS-rAJfOO98ZQmhzCkdj4zbq3BEH_XJDEJ2wIlvuNscu1HhfV55A37im1Lt0R-Im3rikctYX4mcVRlCCQJ00NA_KUJs5EPigqBZjo7FY9o1xjVuhXo1mOTs3Ozo18inuX0i5mWcuwEQ4oUPxS__NC4ARKTKfGJ4SHcxC3cdQfCLsCfi--AKfYZh5It4YXnuLnttNkRcFDD08lFBBlVKMOprwCcXJNCvzXEbJx9l9silBz_xWYUjed2PIY0ob_ErUiAj6uvMfJDtRu9cgj0pj2EEXyugYFASI2SU9lpz5_yzgFr5c_w",
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
        },
      });

      const responseJson = await response.json();

      setRiskFiles(
        responseJson.value.reduce(
          (acc: any, el: any) => ({
            ...acc,
            [el.cr4de_id]: el,
          }),
          {}
        )
      );
    };

    const getCascades = async () => {
      const response = await fetch(`https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades`, {
        method: "GET",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQzMjMxOCwibmJmIjoxNjY0NDMyMzE5LCJleHAiOjE2NjQ0MzMyMTksImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.DSkyEOprtyUJ6juSh5fp1wRUTuH29GQpvLKpGS-rAJfOO98ZQmhzCkdj4zbq3BEH_XJDEJ2wIlvuNscu1HhfV55A37im1Lt0R-Im3rikctYX4mcVRlCCQJ00NA_KUJs5EPigqBZjo7FY9o1xjVuhXo1mOTs3Ozo18inuX0i5mWcuwEQ4oUPxS__NC4ARKTKfGJ4SHcxC3cdQfCLsCfi--AKfYZh5It4YXnuLnttNkRcFDD08lFBBlVKMOprwCcXJNCvzXEbJx9l9silBz_xWYUjed2PIY0ob_ErUiAj6uvMfJDtRu9cgj0pj2EEXyugYFASI2SU9lpz5_yzgFr5c_w",
          __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
          "Content-Type": "application/json",
          Prefer: 'odata.include-annotations="*"',
        },
      });

      const responseJson = await response.json();

      setCascades(responseJson.value.filter((c: any) => c.cr4de_risk_file === null));
      setCascadeDict(
        responseJson.value.reduce(
          (acc: any, el: any) => ({
            ...acc,
            [el.cr4de_id]: el,
          }),
          {}
        )
      );
    };

    getRiskFiles();
    getCascades();
  }, []);

  // useEffect(() => {
  //   if (riskFiles && cascades) {
  //     const updateCascades = async () => {
  //       for (let i = 0; i < cascades.length; i++) {
  //         const cascade = cascades[i];

  //         const cause: any = riskFiles[cascade.cr4de_cause_id];
  //         const effect: any = riskFiles[cascade.cr4de_effect_id];

  //         if (!cause || !effect) {
  //           // try {
  //           // const response = await fetch(
  //           //   `https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades(${cascade.cr4de_bnrariskcascadeid})`,
  //           //   {
  //           //     method: "DELETE",
  //           //     headers: {
  //           //       Authorization:
  //           //         "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQzMjMxOCwibmJmIjoxNjY0NDMyMzE5LCJleHAiOjE2NjQ0MzMyMTksImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.DSkyEOprtyUJ6juSh5fp1wRUTuH29GQpvLKpGS-rAJfOO98ZQmhzCkdj4zbq3BEH_XJDEJ2wIlvuNscu1HhfV55A37im1Lt0R-Im3rikctYX4mcVRlCCQJ00NA_KUJs5EPigqBZjo7FY9o1xjVuhXo1mOTs3Ozo18inuX0i5mWcuwEQ4oUPxS__NC4ARKTKfGJ4SHcxC3cdQfCLsCfi--AKfYZh5It4YXnuLnttNkRcFDD08lFBBlVKMOprwCcXJNCvzXEbJx9l9silBz_xWYUjed2PIY0ob_ErUiAj6uvMfJDtRu9cgj0pj2EEXyugYFASI2SU9lpz5_yzgFr5c_w",
  //           //       __RequestVerificationToken:
  //           //         localStorage.getItem("antiforgerytoken") || "",
  //           //       "Content-Type": "application/json",
  //           //     }
  //           //   }
  //           // );
  //           // } catch(e){
  //           //   // Empty by design
  //           // }
  //         } else {
  //           const response = await fetch(
  //             `https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades(${cascade.cr4de_bnrariskcascadeid})`,
  //             {
  //               method: "PATCH",
  //               headers: {
  //                 Authorization:
  //                   "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQzMjMxOCwibmJmIjoxNjY0NDMyMzE5LCJleHAiOjE2NjQ0MzMyMTksImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.DSkyEOprtyUJ6juSh5fp1wRUTuH29GQpvLKpGS-rAJfOO98ZQmhzCkdj4zbq3BEH_XJDEJ2wIlvuNscu1HhfV55A37im1Lt0R-Im3rikctYX4mcVRlCCQJ00NA_KUJs5EPigqBZjo7FY9o1xjVuhXo1mOTs3Ozo18inuX0i5mWcuwEQ4oUPxS__NC4ARKTKfGJ4SHcxC3cdQfCLsCfi--AKfYZh5It4YXnuLnttNkRcFDD08lFBBlVKMOprwCcXJNCvzXEbJx9l9silBz_xWYUjed2PIY0ob_ErUiAj6uvMfJDtRu9cgj0pj2EEXyugYFASI2SU9lpz5_yzgFr5c_w",
  //                 __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
  //                 "Content-Type": "application/json",
  //               },
  //               body: JSON.stringify({
  //                 "cr4de_cause_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${cause.cr4de_riskfilesid})`,
  //                 "cr4de_effect_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${effect.cr4de_riskfilesid})`,
  //               }),
  //             }
  //           );
  //         }

  //         setUpdatedCascades(i + 1);
  //       }
  //     };

  //     updateCascades();
  //   }
  // }, [riskFiles, cascades]);

  useEffect(() => {
    if (!riskFiles || !cascades || updatedCascades < cascades.length) return;

    if (directAnalyses) return;

    const getDirectAnalyses = async () => {
      const response = await fetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnradirectanalysises?$filter=cr4de_risk_file eq null`,
        {
          method: "GET",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQzMjMxOCwibmJmIjoxNjY0NDMyMzE5LCJleHAiOjE2NjQ0MzMyMTksImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.DSkyEOprtyUJ6juSh5fp1wRUTuH29GQpvLKpGS-rAJfOO98ZQmhzCkdj4zbq3BEH_XJDEJ2wIlvuNscu1HhfV55A37im1Lt0R-Im3rikctYX4mcVRlCCQJ00NA_KUJs5EPigqBZjo7FY9o1xjVuhXo1mOTs3Ozo18inuX0i5mWcuwEQ4oUPxS__NC4ARKTKfGJ4SHcxC3cdQfCLsCfi--AKfYZh5It4YXnuLnttNkRcFDD08lFBBlVKMOprwCcXJNCvzXEbJx9l9silBz_xWYUjed2PIY0ob_ErUiAj6uvMfJDtRu9cgj0pj2EEXyugYFASI2SU9lpz5_yzgFr5c_w",
            __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
            "Content-Type": "application/json",
          },
        }
      );

      const responseJson = await response.json();

      setDirectAnalyses(responseJson.value);
    };

    const getCascadeAnalyses = async () => {
      const response = await fetch(
        `https://bnra.powerappsportals.com/_api/cr4de_bnracascadeanalysises?$filter=cr4de_cascade eq null`,
        {
          method: "GET",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQzMjMxOCwibmJmIjoxNjY0NDMyMzE5LCJleHAiOjE2NjQ0MzMyMTksImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.DSkyEOprtyUJ6juSh5fp1wRUTuH29GQpvLKpGS-rAJfOO98ZQmhzCkdj4zbq3BEH_XJDEJ2wIlvuNscu1HhfV55A37im1Lt0R-Im3rikctYX4mcVRlCCQJ00NA_KUJs5EPigqBZjo7FY9o1xjVuhXo1mOTs3Ozo18inuX0i5mWcuwEQ4oUPxS__NC4ARKTKfGJ4SHcxC3cdQfCLsCfi--AKfYZh5It4YXnuLnttNkRcFDD08lFBBlVKMOprwCcXJNCvzXEbJx9l9silBz_xWYUjed2PIY0ob_ErUiAj6uvMfJDtRu9cgj0pj2EEXyugYFASI2SU9lpz5_yzgFr5c_w",
            __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
            "Content-Type": "application/json",
            Prefer: 'odata.include-annotations="*"',
          },
        }
      );

      const responseJson = await response.json();

      setCascadeAnalyses(responseJson.value);
    };

    getDirectAnalyses();
    getCascadeAnalyses();
  }, [riskFiles, cascades, updatedCascades]);

  // useEffect(() => {
  //   if (riskFiles && directAnalyses) {
  //     const updateDirectAnalyses = async () => {
  //       for (let i = 0; i < directAnalyses.length; i++) {
  //         const analysis = directAnalyses[i];

  //         const riskFile: any = riskFiles[analysis.cr4de_risk_file_id];

  //         if (riskFile) {
  //           await fetch(
  //             `https://bnra.powerappsportals.com/_api/cr4de_bnradirectanalysises(${analysis.cr4de_bnradirectanalysisid})`,
  //             {
  //               method: "PATCH",
  //               headers: {
  //                 Authorization:
  //                   "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQzMjMxOCwibmJmIjoxNjY0NDMyMzE5LCJleHAiOjE2NjQ0MzMyMTksImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.DSkyEOprtyUJ6juSh5fp1wRUTuH29GQpvLKpGS-rAJfOO98ZQmhzCkdj4zbq3BEH_XJDEJ2wIlvuNscu1HhfV55A37im1Lt0R-Im3rikctYX4mcVRlCCQJ00NA_KUJs5EPigqBZjo7FY9o1xjVuhXo1mOTs3Ozo18inuX0i5mWcuwEQ4oUPxS__NC4ARKTKfGJ4SHcxC3cdQfCLsCfi--AKfYZh5It4YXnuLnttNkRcFDD08lFBBlVKMOprwCcXJNCvzXEbJx9l9silBz_xWYUjed2PIY0ob_ErUiAj6uvMfJDtRu9cgj0pj2EEXyugYFASI2SU9lpz5_yzgFr5c_w",
  //                 __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
  //                 "Content-Type": "application/json",
  //               },
  //               body: JSON.stringify({
  //                 "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`,
  //               }),
  //             }
  //           );
  //         }

  //         setUpdatedDAs(i + 1);
  //       }
  //     };

  //     updateDirectAnalyses();
  //   }
  // }, [riskFiles, cascades]);

  useEffect(() => {
    if (riskFiles && cascadeDict && cascadeAnalyses && directAnalyses) {
      const updateCascadeAnalyses = async () => {
        for (let i = 0; i < cascadeAnalyses.length; i++) {
          const analysis = cascadeAnalyses[i];

          const cascade: any = cascadeDict[analysis.cr4de_risk_cascadeid];

          if (cascade) {
            await fetch(
              `https://bnra.powerappsportals.com/_api/cr4de_bnracascadeanalysises(${analysis.cr4de_bnracascadeanalysisid})`,
              {
                method: "PATCH",
                headers: {
                  Authorization:
                    "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQzMjMxOCwibmJmIjoxNjY0NDMyMzE5LCJleHAiOjE2NjQ0MzMyMTksImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.DSkyEOprtyUJ6juSh5fp1wRUTuH29GQpvLKpGS-rAJfOO98ZQmhzCkdj4zbq3BEH_XJDEJ2wIlvuNscu1HhfV55A37im1Lt0R-Im3rikctYX4mcVRlCCQJ00NA_KUJs5EPigqBZjo7FY9o1xjVuhXo1mOTs3Ozo18inuX0i5mWcuwEQ4oUPxS__NC4ARKTKfGJ4SHcxC3cdQfCLsCfi--AKfYZh5It4YXnuLnttNkRcFDD08lFBBlVKMOprwCcXJNCvzXEbJx9l9silBz_xWYUjed2PIY0ob_ErUiAj6uvMfJDtRu9cgj0pj2EEXyugYFASI2SU9lpz5_yzgFr5c_w",
                  __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  "cr4de_cascade@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades(${cascade.cr4de_bnrariskcascadeid})`,
                }),
              }
            );
          }

          setUpdatedCAs(i + 1);
        }
      };

      updateCascadeAnalyses();
    }
  }, [riskFiles, cascadeDict, directAnalyses, updatedDAs, cascadeAnalyses]);

  return (
    <>
      <Container sx={{ mt: 4, pb: 8 }}>
        <Paper sx={{ p: 2 }}>
          <Typography>
            {riskFiles ? `Loaded ${Object.keys(riskFiles).length} risk files` : "Loading risk files..."}
          </Typography>
          <Typography>{cascades ? `Loaded ${cascades.length} cascades to migrate` : "Loading cascades..."}</Typography>
          {riskFiles && cascades && (
            <Typography sx={{ mb: 2 }}>
              Updating Cascades ({updatedCascades}/{cascades.length})
            </Typography>
          )}

          {riskFiles && cascades && updatedCascades >= cascades.length && (
            <>
              <Typography>
                {directAnalyses
                  ? `Loaded ${directAnalyses.length} direct analyses to migrate`
                  : "Loading direct analyses..."}
              </Typography>
              <Typography>
                {cascadeAnalyses
                  ? `Loaded ${cascadeAnalyses.length} cascade analyses to migrate`
                  : "Loading cascade analyses..."}
              </Typography>
              {directAnalyses && (
                <Typography sx={{ mb: 0 }}>
                  Updating direct analyses ({updatedDAs}/{directAnalyses.length})
                </Typography>
              )}
              {directAnalyses && cascadeAnalyses && updatedDAs >= directAnalyses.length && (
                <Typography sx={{ mb: 2 }}>
                  Updating cascade analyses ({updatedCAs}/{cascadeAnalyses.length})
                </Typography>
              )}
            </>
          )}
        </Paper>
      </Container>
    </>
  );
}
