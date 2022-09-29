import { useEffect, useState } from "react";
import { Box, Container, CssBaseline, Typography } from "@mui/material";
import RiskFileList from "../../components/RiskFileList";
import TitleBar from "../../components/TitleBar";

export default function ValidationIntroPage() {
  const [riskFiles, setRiskFiles] = useState<any>(null);

  // useEffect(() => {
  //   const getRiskFiles = async function () {
  //     try {
  //       const response = await fetch(
  //         "https://bnra.powerappsportals.com/_api/cr4de_riskfileses",
  //         {
  //           headers: {
  //             Authorization:
  //               "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQ0MDY0NywibmJmIjoxNjY0NDQwNjQ4LCJleHAiOjE2NjQ0NDE1NDgsImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.xaCkc7KJLU4UYsTaXIt4TVw0B8ymzGCgPgLLEn6BE5tzwtaxKbvQOUC-Y6P7thgWmI56FTpR4wwr-Cu2Floq5xbHcHhKvbV0Om7vnZjwUI4WEpOu-cltr101b3_3W-bmwKilXVFLP-qg9_NHEvtZNTlCf5Rt3GbYiDFl8w8zQQgwd0rDg84DD2znPdnoaQ47lC-OR7xjET5LegiBtIneFW7oezCKDlOYHx4EET66Y_vEmOmNWyCb6BcnxAVcAwpe3nwmK1ZitkqkNgpFVpoN_O-gg2lQIRzd96tVn28E6Uo_YrU96tP4cISvaGzr4L8pbFQnxn-CZi18EQ-NGYmDIg",
  //             __RequestVerificationToken:
  //               localStorage.getItem("antiforgerytoken") || "",
  //             "Content-Type": "application/json",
  //             Accept: "application/json",
  //           },
  //         }
  //       );

  //       const responseJson = await response.json();

  //       setRiskFiles(responseJson.value);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

  //   getRiskFiles();
  // }, []);

  useEffect(() => {
    // @ts-expect-error
    window.frames.localApi.postMessage(
      {
        url: "https://bnra.powerappsportals.com/_api/cr4de_riskfileses",
        options: {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQ0MDY0NywibmJmIjoxNjY0NDQwNjQ4LCJleHAiOjE2NjQ0NDE1NDgsImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.xaCkc7KJLU4UYsTaXIt4TVw0B8ymzGCgPgLLEn6BE5tzwtaxKbvQOUC-Y6P7thgWmI56FTpR4wwr-Cu2Floq5xbHcHhKvbV0Om7vnZjwUI4WEpOu-cltr101b3_3W-bmwKilXVFLP-qg9_NHEvtZNTlCf5Rt3GbYiDFl8w8zQQgwd0rDg84DD2znPdnoaQ47lC-OR7xjET5LegiBtIneFW7oezCKDlOYHx4EET66Y_vEmOmNWyCb6BcnxAVcAwpe3nwmK1ZitkqkNgpFVpoN_O-gg2lQIRzd96tVn28E6Uo_YrU96tP4cISvaGzr4L8pbFQnxn-CZi18EQ-NGYmDIg",
            __RequestVerificationToken:
              localStorage.getItem("antiforgerytoken") || "",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      },
      "*"
    );

    window.onmessage = function (e) {
      console.log(e);
    };
  }, []);

  return (
    <>
      <iframe
        name="localApi"
        src="https://bnra.powerappsportals.com/#/__dev/localapi"
      />
      <CssBaseline />
      <TitleBar title="BNRA 2023 - 2026 Risk Identification - Validation" />
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

        <RiskFileList riskFiles={riskFiles} />
      </Container>
    </>
  );
}
