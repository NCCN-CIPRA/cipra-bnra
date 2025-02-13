import { Image, Page, Text, View } from "@react-pdf/renderer";
import Footer from "./Footer";
import { BLACK } from "./styles";
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
      size="B5"
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
        <View style={{ flexDirection: "row", marginTop: "10pt" }}>
          <View
            style={{
              width: "5pt",
              marginRight: "5pt",
              height: "100%",
              backgroundColor: "#eee",
            }}
          />
          <View
            style={{ flex: 1, flexDirection: "column", marginBottom: "5pt" }}
          >
            {html2PDF(riskFile.cr4de_mrs_probability, "analysis")}
          </View>
        </View>
      </View>

      <View
        style={
          {
            // backgroundColor: "green"
          }
        }
      >
        <Text style={h5Style}>{t("Impact Assessment")}</Text>
        <View style={{ flexDirection: "row", marginTop: "10pt" }}>
          <View
            style={{
              width: "5pt",
              marginRight: "5pt",
              height: "100%",
              backgroundColor: getImpactColor("H"),
            }}
          />
          <View
            style={{ flex: 1, flexDirection: "column", marginBottom: "5pt" }}
          >
            <Text
              style={{
                marginTop: "5pt",
                fontFamily: "NH",
                fontWeight: 300,
                color: BLACK,
                fontSize: "12pt",
              }}
            >
              {t("learning.impact.h.title")}
            </Text>
            {html2PDF(riskFile.cr4de_mrs_impact_h, "analysis")}
          </View>
        </View>

        <View style={{ flexDirection: "row", marginTop: "10pt" }}>
          <View
            style={{
              width: "5pt",
              marginRight: "5pt",
              height: "100%",
              backgroundColor: getImpactColor("S"),
            }}
          />
          <View
            style={{ flex: 1, flexDirection: "column", marginBottom: "5pt" }}
          >
            <Text style={h6Style}>{t("learning.impact.s.title")}</Text>
            {html2PDF(riskFile.cr4de_mrs_impact_s, "analysis")}
          </View>
        </View>

        <View style={{ flexDirection: "row", marginTop: "10pt" }}>
          <View
            style={{
              width: "5pt",
              marginRight: "5pt",
              height: "100%",
              backgroundColor: getImpactColor("E"),
            }}
          />
          <View
            style={{ flex: 1, flexDirection: "column", marginBottom: "5pt" }}
          >
            <Text style={h6Style}>{t("learning.impact.e.title")}</Text>
            {html2PDF(riskFile.cr4de_mrs_impact_e, "analysis")}
          </View>
        </View>

        <View style={{ flexDirection: "row", marginTop: "10pt" }}>
          <View
            style={{
              width: "5pt",
              marginRight: "5pt",
              height: "100%",
              backgroundColor: getImpactColor("F"),
            }}
          />
          <View
            style={{ flex: 1, flexDirection: "column", marginBottom: "5pt" }}
          >
            <Text style={h6Style}>{t("learning.impact.f.title")}</Text>
            {html2PDF(riskFile.cr4de_mrs_impact_f, "analysis")}
          </View>
        </View>
      </View>
    </Page>
  );
}
