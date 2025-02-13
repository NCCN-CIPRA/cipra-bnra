import { Image, Page, Text, View } from "@react-pdf/renderer";
import Footer from "./Footer";
import { BLACK, PAGE_SIZE } from "./styles";
import html2PDF, {
  h3Style,
  h4Style,
  h5Style,
  h6Style,
} from "../../functions/html2pdf";
import { Trans, useTranslation } from "react-i18next";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { useEffect, useState } from "react";
import svg2PDF from "../../functions/svg2PDF";
import getScaleString from "../../functions/getScaleString";
import getImpactColor from "../../functions/getImpactColor";
import Header from "./Header";
import LeftBorderSection from "./LeftBorderSection";
import { getScenarioSuffix, SCENARIOS } from "../../functions/scenarios";

const bottomDebug = true;

export default function AnalysisSection({
  riskFile,
}: {
  riskFile: DVRiskFile;
}) {
  const { t } = useTranslation();

  const [probChart, setProbChart] = useState("");
  const [impactChart, setImpactChart] = useState("");
  const [impactBarChart, setImpactBarChart] = useState("");

  useEffect(() => {
    setTimeout(() => {
      svg2PDF(document.querySelector("#probChart svg")?.outerHTML || "").then(
        (uri) => setProbChart(uri || "")
      );
      svg2PDF(document.querySelector("#impactChart svg")?.outerHTML || "").then(
        (uri) => setImpactChart(uri || "")
      );
      svg2PDF(
        document.querySelector("#impactBarChart svg")?.outerHTML || "",
        400,
        600
      ).then((uri) => setImpactBarChart(uri || ""));
    }, 5000);
  }, []);

  return (
    <Page
      size={PAGE_SIZE}
      style={{
        backgroundColor: "white",
        padding: "1.5cm",
        color: BLACK,
        position: "relative",
        minHeight: "10cm",
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
        <Text style={h4Style}>
          <Trans i18nKey="risk.bottombar.riskAnalysis">Risk Analysis</Trans>
        </Text>
      </View>

      <View
        style={{
          // backgroundColor: "green"
          marginLeft: "-0.25cm",
          marginRight: "-0.25cm",
        }}
      >
        {probChart && impactChart && (
          <View
            style={{
              display: "flex",
              width: "100%",
              height: "12cm",
              flexDirection: "row",
            }}
          >
            <Image
              src={probChart}
              style={{
                display: "flex",
                marginTop: "0.25cm",
                marginLeft: "0.25cm",
                width: "5cm",
                height: "10cm",
              }}
            />
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                marginLeft: "4pt",
                justifyContent: "center",
              }}
              debug={false}
            >
              <Image
                src={impactBarChart}
                style={{
                  // position: "absolute",
                  // display: "flex",
                  // width: "4cm",
                  // height: "4cm",
                  width: "100%",
                }}
                debug={false}
              />
            </View>
            <Image
              src={impactChart}
              style={{
                display: "flex",
                marginTop: "0.25cm",
                marginLeft: "0.25cm",
                width: "5cm",
                height: "10cm",
              }}
            />
          </View>
        )}
      </View>

      <View
        style={
          {
            // backgroundColor: "green"
          }
        }
      >
        <Text style={h5Style}>{t("Probability Assessment")}</Text>
        <LeftBorderSection
          color="#eee"
          style={{ paddingTop: "5pt", marginBottom: "10pt" }}
        >
          {html2PDF(riskFile.cr4de_mrs_probability, "analysis")}
        </LeftBorderSection>
      </View>

      <View
        style={
          {
            // backgroundColor: "green"
          }
        }
      >
        <Text style={h5Style}>{t("Impact Assessment")}</Text>
        <LeftBorderSection color={getImpactColor("H")}>
          <Text
            style={{
              ...h5Style,
              color: getImpactColor("H"),
              marginTop: "0pt",
              marginBottom: "5pt",
            }}
          >
            {t("learning.impact.h.title")}
          </Text>
          {html2PDF(riskFile.cr4de_mrs_impact_h, "analysis")}
        </LeftBorderSection>

        <LeftBorderSection color={getImpactColor("S")}>
          <Text
            style={{
              ...h5Style,
              color: getImpactColor("S"),
              marginTop: "0pt",
              marginBottom: "5pt",
            }}
          >
            {t("learning.impact.s.title")}
          </Text>
          {html2PDF(riskFile.cr4de_mrs_impact_s, "analysis")}
        </LeftBorderSection>

        <LeftBorderSection color={getImpactColor("E")}>
          <Text
            style={{
              ...h5Style,
              color: getImpactColor("E"),
              marginTop: "0pt",
              marginBottom: "5pt",
            }}
          >
            {t("learning.impact.e.title")}
          </Text>
          {html2PDF(riskFile.cr4de_mrs_impact_e, "analysis")}
        </LeftBorderSection>

        <LeftBorderSection color={getImpactColor("F")}>
          <Text
            style={{
              ...h5Style,
              color: getImpactColor("F"),
              marginTop: "0pt",
              marginBottom: "5pt",
            }}
          >
            {t("learning.impact.f.title")}
          </Text>
          {html2PDF(riskFile.cr4de_mrs_impact_f, "analysis")}
        </LeftBorderSection>

        <LeftBorderSection color="#eee" style={{ marginBottom: "-5pt" }}>
          <Text
            style={{
              ...h5Style,
              color: BLACK,
              marginTop: "0pt",
              marginBottom: "5pt",
            }}
          >
            {t("Cross-border Impact")}
          </Text>
          {html2PDF(
            riskFile[
              `cr4de_cross_border_impact_quali${getScenarioSuffix(
                riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE
              )}`
            ],
            "analysis"
          )}
          <View style={{ marginTop: "-5pt", width: "100%", height: "1pt" }} />
        </LeftBorderSection>
      </View>
    </Page>
  );
}
