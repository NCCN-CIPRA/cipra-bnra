import { useOutletContext } from "react-router-dom";
import { RiskPageContext } from "../BaseRisksPage";
import { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import NCCNLoader from "../../components/NCCNLoader";
import { NCCN_GREEN } from "../../functions/colors";
import { ReactComponent as BNRALogo } from "../../assets/icons/BNRA_Logo.svg";
import { ReactComponent as NCCNLogo } from "../../assets/icons/NCCN_Logo.svg";
import { ReactComponent as NCCNDetail } from "../../assets/icons/Triangles_detail.svg";
import RiskMatrix from "../../components/charts/RiskMatrix";
import {
  CATEGORY_NAMES,
  RISK_CATEGORY,
} from "../../types/dataverse/DVRiskFile";
import {
  Document,
  Font,
  Image,
  Page,
  PDFViewer,
  Text,
  View,
} from "@react-pdf/renderer";
import { renderToStaticMarkup } from "react-dom/server";
import svg2PDF from "../../functions/svg2PDF";
import NH15 from "../../assets/fonts/NHaasGroteskDSPro-15UltTh.ttf";
import NH25 from "../../assets/fonts/NHaasGroteskDSPro-25Th.ttf";
import NH45 from "../../assets/fonts/NHaasGroteskDSPro-45Lt.ttf";
import NH46 from "../../assets/fonts/NHaasGroteskDSPro-46LtIt.ttf";
import NH55 from "../../assets/fonts/NHaasGroteskDSPro-55Rg.ttf";
import NH65 from "../../assets/fonts/NHaasGroteskDSPro-65Md.ttf";
import NH66 from "../../assets/fonts/NHaasGroteskDSPro-66MdIt.ttf";
import NH75 from "../../assets/fonts/NHaasGroteskDSPro-75Bd.ttf";

const categories = [
  RISK_CATEGORY.MANMADE,
  RISK_CATEGORY.CYBER,
  RISK_CATEGORY.TRANSVERSAL,
  RISK_CATEGORY.ECOTECH,
  RISK_CATEGORY.HEALTH,
  RISK_CATEGORY.NATURE,
  RISK_CATEGORY.EMERGING,
];

const SPLASH: Partial<{ [key in RISK_CATEGORY]: string }> = {
  Cyber: "splash1.png",
  "Emerging Risk": "splash7.png",
  Health: "splash5.png",
  "Man-made": "splash2.png",
  Nature: "splash6.png",
  Transversal: "spalsh3.png",
  EcoTech: "splash4.png",
};

Font.register({
  family: "NH",
  fonts: [
    {
      src: NH15,
      fontWeight: 100,
    },
    {
      src: NH25,
      fontWeight: 200,
    },
    {
      src: NH45,
      fontWeight: 300,
    },
    {
      src: NH46,
      fontWeight: 300,
      fontStyle: "italic",
    },
    {
      src: NH55,
      fontWeight: 400,
    },
    {
      src: NH65,
      fontWeight: 500,
    },
    {
      src: NH66,
      fontWeight: 500,
      fontStyle: "italic",
    },
    {
      src: NH75,
      fontWeight: 700,
    },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

export default function ExportBNRAPage() {
  const [detailSVG, setDetailSVG] = useState("");
  const [nccnLogoSVG, setNccnLogoSVG] = useState("");
  const [bnraLogoSVG, setBnraLogoSVG] = useState("");

  useEffect(() => {
    svg2PDF(
      renderToStaticMarkup(
        <NCCNDetail style={{ position: "absolute", bottom: 0, left: 0 }} />
      )
    ).then((uri) => setDetailSVG(uri || ""));
    svg2PDF(
      renderToStaticMarkup(
        <NCCNLogo style={{ position: "absolute", bottom: 0, left: 0 }} />
      )
    ).then((uri) => setNccnLogoSVG(uri || ""));
    svg2PDF(
      renderToStaticMarkup(
        <BNRALogo style={{ position: "absolute", bottom: 0, left: 0 }} />
      )
    ).then((uri) => setBnraLogoSVG(uri || ""));
  }, []);

  return (
    <Box sx={{ width: "100vw", height: "100vh" }}>
      <PDFViewer
        style={{ overflow: "hidden", height: "100%", width: "100%" }}
        height="100%"
        width="100%"
      >
        <Document>
          <Page
            size="A5"
            style={{
              backgroundColor: NCCN_GREEN,
            }}
          >
            <View
              style={{
                width: "70%",
                margin: "auto",
                textAlign: "center",
                marginTop: "60pt",
                marginBottom: 0,
              }}
            >
              <Text
                style={{
                  fontFamily: "NH",
                  fontSize: "30pt",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Belgian National Risk Assessment
              </Text>
            </View>
            <View
              style={{
                width: "80%",
                margin: "auto",
                textAlign: "center",
                marginTop: "10pt",
                marginBottom: "30pt",
              }}
            >
              <Text
                style={{
                  fontFamily: "NH",
                  fontSize: "20pt",
                  color: "white",
                  fontWeight: "normal",
                }}
              >
                Full Report
              </Text>
              <Text
                style={{
                  fontFamily: "NH",
                  fontSize: "20pt",
                  color: "white",
                  fontWeight: "normal",
                }}
              >
                2023 - 2026
              </Text>
            </View>
            <Image src="https://bnra.powerappsportals.com/report-front.png" />
            <View
              style={{
                position: "absolute",
                width: "100%",
                bottom: "-0.5cm",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: "0.5cm",
                paddingRight: "0cm",
              }}
            >
              <Image src={nccnLogoSVG} style={{ height: "3cm" }} />
              <Image src={bnraLogoSVG} style={{ height: "2cm" }} />
            </View>
          </Page>
          <Page
            size="A5"
            style={{
              backgroundColor: NCCN_GREEN,
            }}
          >
            <View
              style={{
                width: "80%",
                height: "80%",
                margin: "auto",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginBottom: "100px",
              }}
            >
              <Text
                style={{
                  fontFamily: "NH",
                  fontSize: "16pt",
                  color: "white",
                  fontWeight: "semibold",
                }}
              >
                Better prepared. Better response.
              </Text>
            </View>
            <View
              style={{
                position: "absolute",
                width: "100%",
                bottom: "0",
              }}
            >
              <Image src={detailSVG} />
            </View>
          </Page>
          <Page
            size="A5"
            style={{
              backgroundColor: NCCN_GREEN,
            }}
          ></Page>
        </Document>
      </PDFViewer>
    </Box>
  );
}

export function ExportBNRAPage2() {
  const {
    riskFiles,
    loadAllRiskFiles,
    allRiskFilesLoaded,
    loadAllAttachments,
    allRiskFilesLoading,
    allAttachmentsLoaded,
    allAttachmentsLoading,
  } = useOutletContext<RiskPageContext>();

  useEffect(() => {
    if (!allRiskFilesLoading && !allRiskFilesLoaded) loadAllRiskFiles();
    if (!allAttachmentsLoading && !allAttachmentsLoaded) loadAllAttachments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadAllRiskFiles, loadAllAttachments]);

  if (!allRiskFilesLoaded || !allAttachmentsLoaded)
    return (
      <Box sx={{ width: "100%", mt: 20, textAlign: "center" }}>
        <NCCNLoader />
      </Box>
    );

  return (
    <Box id="bnra-export">
      <Box
        style={{
          width: "21cm",
          height: "29.7cm",
          margin: "auto",
          backgroundColor: NCCN_GREEN,
          position: "relative",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            textAlign: "center",
            color: "white",
            fontWeight: "600",
            width: "60%",
            margin: "auto",
            paddingTop: "130px",
            fontSize: "53px",
          }}
        >
          Belgian National Risk Assessment
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
            color: "white",
            width: "60%",
            margin: "auto",
            fontSize: "30px",
            paddingTop: "20px",
            paddingBottom: "40px",
          }}
        >
          Full Report
          <br />
          2023 - 2026
        </Typography>
        <img
          alt="Report front page"
          src="https://bnra.powerappsportals.com/report-front.png"
          style={{ width: "100%" }}
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ position: "absolute", bottom: 20, px: 5, width: "100%" }}
        >
          <NCCNLogo style={{ width: "7cm", height: "50px" }} />
          <BNRALogo style={{ width: "4cm", height: "50px" }} />
        </Stack>
      </Box>

      <Box
        style={{
          width: "21cm",
          height: "29.7cm",
          margin: "auto",
          backgroundColor: NCCN_GREEN,
          position: "relative",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            textAlign: "center",
            color: "white",
            fontWeight: "600",
            width: "90%",
            margin: "auto",
            paddingTop: "370px",
            fontSize: "24px",
          }}
        >
          Better prepared. Better response.
        </Typography>
        <NCCNDetail style={{ position: "absolute", bottom: 0, left: 0 }} />
      </Box>

      <Box
        style={{
          width: "21cm",
          height: "29.7cm",
          margin: "auto",
          position: "relative",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            textAlign: "left",
            color: "#231F20",
            fontWeight: "600",
            width: "90%",
            margin: "auto",
            fontSize: "36px",
            marginBottom: 5,
          }}
        >
          Risk Matrix
        </Typography>
        <Box sx={{ width: "19cm", height: "19cm", margin: "auto" }}>
          <RiskMatrix
            riskFiles={Object.values(riskFiles)}
            labels={true}
            labelSize={10}
          />
        </Box>
      </Box>

      <Box className="break" />

      {categories.map((c) => (
        <>
          <CategoryFrontPage category={c} />
          {Object.values(riskFiles)
            .filter((rf) => rf.cr4de_risk_category === c)
            .sort((a, b) => a.cr4de_hazard_id.localeCompare(b.cr4de_hazard_id))
            .map(() => (
              <>
                {/* <ExportRiskFile
                  key={rf.cr4de_riskfilesid}
                  hazardCatalogue={hazardCatalogue}
                  riskFile={rf}
                  cascades={cascades[rf.cr4de_riskfilesid]}
                  attachments={allAttachments.filter((a) => a._cr4de_risk_file_value === rf.cr4de_riskfilesid)}
                /> */}
                <Box className="break" />
              </>
            ))}
        </>
      ))}
    </Box>
  );
}

const SPLASH_POS: Partial<{ [key in RISK_CATEGORY]: string }> = {
  "Man-made": "65% 50%",
};

function CategoryFrontPage({ category }: { category: RISK_CATEGORY }) {
  return (
    <Box
      style={{
        width: "21cm",
        height: "29.7cm",
        margin: "auto",
        backgroundColor: NCCN_GREEN,
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0.2,
          backgroundImage: `url('https://bnra.powerappsportals.com/${SPLASH[category]}')`,
          backgroundSize: "cover",
          backgroundPosition: SPLASH_POS[category] || "center",
          zIndex: 1,
        }}
      />
      <Typography
        variant="h1"
        sx={{
          textAlign: "center",
          color: "white",
          fontWeight: "600",
          width: "60%",
          margin: "auto",
          fontSize: "40px",
          zIndex: 2,
        }}
      >
        {CATEGORY_NAMES[category]}
      </Typography>
    </Box>
  );
}
