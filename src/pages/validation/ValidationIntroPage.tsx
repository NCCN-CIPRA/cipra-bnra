import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, CssBaseline, Typography } from "@mui/material";
import RiskFileList from "../../components/RiskFileList";
import TitleBar from "../../components/TitleBar";

export default function ValidationIntroPage() {
  const navigate = useNavigate();
  const [validations, setValidations] = useState<any>(null);

  useEffect(() => {
    const getRiskFiles = async function () {
      try {
        const response = await fetch(
          `https://bnra.powerappsportals.com/_api/cr4de_bnravalidations?$expand=cr4de_RiskFile`,
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

        setValidations(responseJson.value);
      } catch (e) {
        console.log(e);
      }
    };

    getRiskFiles();
  }, []);

  return (
    <>
      <Container>
        <Box mt={5}>
          <Typography variant="body1" my={2}>
            Welcome to the{" "}
            <b>BNRA 2023 - 2026 Risk File Validation Application</b>, the first
            step in the risk analysis process!
          </Typography>
          <Typography variant="body1" my={2}>
            In this phase we present to you a first look at the hazards and
            their corresponding risk files for which you have volunteered to
            participate as expert. Each of these hazards should be visible in
            the list below.
          </Typography>
          <Typography variant="body1" my={2}>
            Because the risk files will form the basis for all of the following
            analytical phases, it is of utmost importance that the information
            they hold is correct and complete. A preliminary risk file has been
            written out by NCCN analists, but your topical expertise is required
            to validate the compiled information. Therefore,{" "}
            <b>
              we kindly ask you to read the different sections for each of the
              hazards in the list and provide any corrections, feedback or
              comments in the fields provided
            </b>
            . All input may be provided in the language you feel most
            comfortable with.
          </Typography>
          <Typography variant="body1" my={2}>
            If you believe an error has been made with regards to the hazards
            assigned to you, please get in touch with your contact person at
            NCCN, or email us at{" "}
            <a href="mailto:dist.nccn.bnra@nccn.fgov.be">
              dist.nccn.bnra@nccn.fgov.be
            </a>
          </Typography>
        </Box>

        <RiskFileList
          riskFiles={
            validations && validations.map((v: any) => v.cr4de_RiskFile)
          }
          onClick={async (riskFile: any) => {
            navigate(
              `/validation/${
                validations.find(
                  (v: any) =>
                    v.cr4de_RiskFile.cr4de_hazard_id ===
                    riskFile.cr4de_hazard_id
                ).cr4de_bnravalidationid
              }`
            );
          }}
        />
      </Container>
    </>
  );
}
