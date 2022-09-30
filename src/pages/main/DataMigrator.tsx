import { Typography } from "@mui/material";
import { useEffect, useState } from "react";



export default function DataMigrator() {
  const [riskFiles, setRiskFiles] = useState<{ [key: string]: any} | null>(null);
  const [cascades, setCascades] = useState<any[] | null>(null);
  const [updated, setUpdated] = useState(0);

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

      setRiskFiles(responseJson.value.reduce((acc: any, el: any) => ({
        ...acc,
        [el.cr4de_id]: el
      }), {}));
        }

        const getCascades = async () => {
          const response = await fetch(
            `https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades?$filter=cr4de_cause_hazard eq null`,
            {
              method: "GET",
              headers: {
                Authorization:
                  "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQzMjMxOCwibmJmIjoxNjY0NDMyMzE5LCJleHAiOjE2NjQ0MzMyMTksImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.DSkyEOprtyUJ6juSh5fp1wRUTuH29GQpvLKpGS-rAJfOO98ZQmhzCkdj4zbq3BEH_XJDEJ2wIlvuNscu1HhfV55A37im1Lt0R-Im3rikctYX4mcVRlCCQJ00NA_KUJs5EPigqBZjo7FY9o1xjVuhXo1mOTs3Ozo18inuX0i5mWcuwEQ4oUPxS__NC4ARKTKfGJ4SHcxC3cdQfCLsCfi--AKfYZh5It4YXnuLnttNkRcFDD08lFBBlVKMOprwCcXJNCvzXEbJx9l9silBz_xWYUjed2PIY0ob_ErUiAj6uvMfJDtRu9cgj0pj2EEXyugYFASI2SU9lpz5_yzgFr5c_w",
                __RequestVerificationToken:
                  localStorage.getItem("antiforgerytoken") || "",
                "Content-Type": "application/json",
                Prefer: 'odata.include-annotations="*"'
              },
            }
          );

          const responseJson = await response.json();
    
          setCascades(responseJson.value);
            }

            getRiskFiles();
            getCascades();
  }, []);

  useEffect(() => {
    if (riskFiles && cascades) {
      const updateCascades = async () => {
        for (let i = 0; i < cascades.length; i++) {
          const cascade = cascades[i];

          const cause: any = riskFiles[cascade.cr4de_cause_id];
          const effect: any = riskFiles[cascade.cr4de_effect_id];

          if (!cause || !effect) {
            // try {
            // const response = await fetch(
            //   `https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades(${cascade.cr4de_bnrariskcascadeid})`,
            //   {
            //     method: "DELETE",
            //     headers: {
            //       Authorization:
            //         "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQzMjMxOCwibmJmIjoxNjY0NDMyMzE5LCJleHAiOjE2NjQ0MzMyMTksImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.DSkyEOprtyUJ6juSh5fp1wRUTuH29GQpvLKpGS-rAJfOO98ZQmhzCkdj4zbq3BEH_XJDEJ2wIlvuNscu1HhfV55A37im1Lt0R-Im3rikctYX4mcVRlCCQJ00NA_KUJs5EPigqBZjo7FY9o1xjVuhXo1mOTs3Ozo18inuX0i5mWcuwEQ4oUPxS__NC4ARKTKfGJ4SHcxC3cdQfCLsCfi--AKfYZh5It4YXnuLnttNkRcFDD08lFBBlVKMOprwCcXJNCvzXEbJx9l9silBz_xWYUjed2PIY0ob_ErUiAj6uvMfJDtRu9cgj0pj2EEXyugYFASI2SU9lpz5_yzgFr5c_w",
            //       __RequestVerificationToken:
            //         localStorage.getItem("antiforgerytoken") || "",
            //       "Content-Type": "application/json",
            //     }
            //   }
            // );
            // } catch(e){
            //   // Empty by design
            // }

          } else {
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
              body: JSON.stringify({
                "cr4de_cause_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${cause.cr4de_riskfilesid})`,
                "cr4de_effect_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${effect.cr4de_riskfilesid})`,
              }),
            }
          );
          }

          setUpdated(i + 1);
        }
      }

      updateCascades();
    }
  }, [riskFiles, cascades])

  if (!riskFiles) {
    return <Typography>Loading Risk Files</Typography>
  }

  if (!cascades) {
    return <Typography>Loading Cascades</Typography>
  }

  return <Typography>Updating Cascades ({updated}/{cascades.length})</Typography>
}
