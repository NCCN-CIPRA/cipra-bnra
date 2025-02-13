import { Image, Page, Text, View } from "@react-pdf/renderer";
import Footer from "./Footer";
import { BLACK, PAGE_SIZE } from "./styles";
import html2PDF, {
  bodyStyle,
  boldStyle,
  h3Style,
  h4Style,
  h6Style,
} from "../../functions/html2pdf";
import { Trans, useTranslation } from "react-i18next";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { useEffect, useState } from "react";
import svg2PDF from "../../functions/svg2PDF";
import getScaleString from "../../functions/getScaleString";
import { NCCN_GREEN } from "../../functions/colors";
import Header from "./Header";
import { Cascades } from "../BaseRisksPage";

export default function EvolutionSection({
  riskFile,
  cascades,
}: {
  riskFile: DVRiskFile;
  cascades: Cascades;
}) {
  const { t } = useTranslation();

  const [ccChart, setCCChart] = useState("");

  useEffect(() => {
    setTimeout(() => {
      svg2PDF(
        document.querySelector("#climateChart svg")?.outerHTML || "",
        750,
        450
      ).then((uri) => setCCChart(uri || ""));
    }, 5000);
  }, []);

  return (
    <Page
      size={PAGE_SIZE}
      style={{
        backgroundColor: "white",
        padding: "1.5cm",
        color: BLACK,
      }}
    >
      <Header riskFile={riskFile} />
      <Footer />

      <View
        style={
          {
            // backgroundColor: "green"
          }
        }
      >
        <Text
          style={{
            marginTop: "15pt",
            fontFamily: "NH",
            fontWeight: 700,
            color: NCCN_GREEN,
            fontSize: "16pt",
          }}
        >
          <Trans i18nKey="risk.bottombar.riskEvolution">Risk Evolution</Trans>
        </Text>
      </View>

      <View
        style={
          {
            // backgroundColor: "green"
          }
        }
      >
        <Text
          style={{
            marginTop: "15pt",
            fontFamily: "NH",
            fontWeight: 500,
            color: BLACK,
            fontSize: "12pt",
            marginBottom: "5pt",
          }}
        >
          {t("Climate Change", "Climate Change")}
        </Text>
        {ccChart && (
          <Image
            src={ccChart}
            style={{
              marginTop: "0.25cm",
              marginLeft: "auto",
              marginRight: "auto",
              width: "80%",
            }}
            // debug={true}
          />
        )}
        {html2PDF(riskFile.cr4de_mrs_cc, "evolution")}
      </View>

      <View
        style={
          {
            // backgroundColor: "green"
          }
        }
      >
        <Text
          style={{
            marginTop: "15pt",
            fontFamily: "NH",
            fontWeight: 500,
            color: BLACK,
            fontSize: "12pt",
            marginBottom: "10pt",
          }}
        >
          {t("Other Catalysing Effects", "Other Catalysing Effects")}
        </Text>
        {cascades.catalyzingEffects.map((c) => (
          <View style={{ marginBottom: "10pt" }}>
            <Text
              style={{
                ...bodyStyle,
                textDecoration: "underline",
                marginBottom: "2pt",
              }}
            >
              {c.cr4de_cause_hazard.cr4de_title}
            </Text>
            {html2PDF(c.cr4de_quali, "evolution")}
          </View>
        ))}
      </View>
    </Page>
  );
}
