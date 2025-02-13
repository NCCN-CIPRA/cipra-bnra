import { Image, Page, Text, View } from "@react-pdf/renderer";
import Footer from "./Footer";
import { BLACK } from "./styles";
import html2PDF, { h3Style, h4Style } from "../../functions/html2pdf";
import { Trans, useTranslation } from "react-i18next";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { useEffect, useState } from "react";
import svg2PDF from "../../functions/svg2PDF";
import getScaleString from "../../functions/getScaleString";

export default function SummarySection({
  riskFile,
  tp,
  H,
  S,
  E,
  F,
}: {
  riskFile: DVRiskFile;
  tp: number;
  H: number;
  S: number;
  E: number;
  F: number;
}) {
  const { t } = useTranslation();

  const [pBarChart, setpBarChart] = useState("");
  const [hChart, setHChart] = useState("");
  const [sChart, setSChart] = useState("");
  const [eChart, setEChart] = useState("");
  const [fChart, setFChart] = useState("");

  useEffect(() => {
    setTimeout(() => {
      svg2PDF(document.querySelector("#pBars")?.outerHTML || "").then((uri) =>
        setpBarChart(uri || "")
      );
      svg2PDF(document.querySelector("#hChart svg")?.outerHTML || "").then(
        (uri) => setHChart(uri || "")
      );
      svg2PDF(document.querySelector("#sChart svg")?.outerHTML || "").then(
        (uri) => setSChart(uri || "")
      );
      svg2PDF(document.querySelector("#eChart svg")?.outerHTML || "").then(
        (uri) => setEChart(uri || "")
      );
      svg2PDF(document.querySelector("#fChart svg")?.outerHTML || "").then(
        (uri) => setFChart(uri || "")
      );
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
      wrap={false}
    >
      <Footer />
      <View>
        <Text style={h3Style}>
          {t(`risk.${riskFile.cr4de_hazard_id}.name`, riskFile.cr4de_title)}
        </Text>
        <Text style={h4Style}>
          <Trans i18nKey="risk.bottombar.summary">Summary</Trans>
        </Text>
      </View>

      <View
        style={{
          // position: "absolute",
          // top: "1.5cm",
          // left: "1.5cm",
          // right: "1.5cm",
          // backgroundColor: "rgba(0,0,0,0.1)",
          border: "1pt solid black",
          borderColor: "rgb(232, 232, 232)",
          paddingTop: "0.25cm",
          paddingBottom: "0.25cm",
          height: "3cm",
          // width: "3.8cm",
          display: "flex",
          flexDirection: "row",
          marginBottom: "0.5cm",
        }}
        // debug={true}
      >
        <View style={{ width: "3cm", height: "4.5cm", textAlign: "center" }}>
          <Text
            style={{ fontFamily: "NH", fontWeight: 500, fontSize: "8pt" }}
            debug={false}
          >
            {riskFile.cr4de_risk_type === RISK_TYPE.MANMADE
              ? t("learning.motivation.text.title", "Motivation")
              : t("learning.probability.2.text.title", "Probability")}
          </Text>
          {pBarChart && (
            <Image
              src={pBarChart}
              style={{
                marginTop: "0.25cm",
                marginLeft: "0.25cm",
                width: "2.5cm",
                height: "1.375cm",
              }}
            />
          )}
          <Text
            style={{
              marginTop: "0.25cm",
              fontFamily: "NH",
              fontWeight: 300,
              lineHeight: "1.5pt",
              color: BLACK,
              fontSize: "9pt",
            }}
          >
            {t(getScaleString(tp))}
          </Text>
        </View>
        <View style={{ width: "3cm", height: "4.5cm", textAlign: "center" }}>
          <Text
            style={{ fontFamily: "NH", fontWeight: 500, fontSize: "8pt" }}
            debug={false}
          >
            <Trans i18nKey="Human">Human</Trans>
          </Text>
          {hChart && (
            <Image
              src={hChart}
              style={{
                marginTop: "0.25cm",
                marginLeft: "0.25cm",
                width: "2.5cm",
                height: "1.375cm",
              }}
            />
          )}
          <Text
            style={{
              marginTop: "0.25cm",
              fontFamily: "NH",
              fontWeight: 300,
              lineHeight: "1.5pt",
              color: BLACK,
              fontSize: "9pt",
            }}
          >
            {t(getScaleString(H))}
          </Text>
        </View>
        <View style={{ width: "3cm", height: "4.5cm", textAlign: "center" }}>
          <Text
            style={{ fontFamily: "NH", fontWeight: 500, fontSize: "8pt" }}
            debug={false}
          >
            <Trans i18nKey="Societal">Societal</Trans>
          </Text>
          {sChart && (
            <Image
              src={sChart}
              style={{
                marginTop: "0.25cm",
                marginLeft: "0.25cm",
                width: "2.5cm",
                height: "1.375cm",
              }}
            />
          )}
          <Text
            style={{
              marginTop: "0.25cm",
              fontFamily: "NH",
              fontWeight: 300,
              lineHeight: "1.5pt",
              color: BLACK,
              fontSize: "9pt",
            }}
          >
            {t(getScaleString(S))}
          </Text>
        </View>
        <View style={{ width: "3cm", height: "4.5cm", textAlign: "center" }}>
          <Text
            style={{ fontFamily: "NH", fontWeight: 500, fontSize: "8pt" }}
            debug={false}
          >
            <Trans i18nKey="Environmental">Environmental</Trans>
          </Text>
          {eChart && (
            <Image
              src={eChart}
              style={{
                marginTop: "0.25cm",
                marginLeft: "0.25cm",
                width: "2.5cm",
                height: "1.375cm",
              }}
            />
          )}
          <Text
            style={{
              marginTop: "0.25cm",
              fontFamily: "NH",
              fontWeight: 300,
              lineHeight: "1.5pt",
              color: BLACK,
              fontSize: "9pt",
            }}
          >
            {t(getScaleString(E))}
          </Text>
        </View>
        <View style={{ width: "3cm", height: "4.5cm", textAlign: "center" }}>
          <Text
            style={{ fontFamily: "NH", fontWeight: 500, fontSize: "8pt" }}
            debug={false}
          >
            <Trans i18nKey="Financial">Financial</Trans>
          </Text>
          {fChart && (
            <Image
              src={fChart}
              style={{
                marginTop: "0.25cm",
                marginLeft: "0.25cm",
                width: "2.5cm",
                height: "1.375cm",
              }}
            />
          )}
          <Text
            style={{
              marginTop: "0.25cm",
              fontFamily: "NH",
              fontWeight: 300,
              lineHeight: "1.5pt",
              color: BLACK,
              fontSize: "9pt",
            }}
          >
            {t(getScaleString(F))}
          </Text>
        </View>
      </View>

      <View
        style={
          {
            // backgroundColor: "green"
          }
        }
        // debug={true}
      >
        {html2PDF(riskFile.cr4de_mrs_summary, "summary")}
      </View>
    </Page>
  );
}
