import { Image, Page, Text, View } from "@react-pdf/renderer";
import Footer from "./Footer";
import { BLACK } from "./styles";
import html2PDF, { h3Style, h4Style } from "../../functions/html2pdf";
import { Trans, useTranslation } from "react-i18next";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { useEffect, useState } from "react";
import svg2PDF from "../../functions/svg2PDF";
import getScaleString from "../../functions/getScaleString";
import { NCCN_GREEN } from "../../functions/colors";
import Header from "./Header";

export default function EvolutionSection({
  riskFile,
}: {
  riskFile: DVRiskFile;
}) {
  const { t } = useTranslation();

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
          }}
        >
          {t("Climate Change", "Climate Change")}
        </Text>
        {/* {html2PDF(riskFile.cr4de_historical_events)} */}
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
          }}
        >
          {t("Other Catalysing Effects", "Other Catalysing Effects")}
        </Text>
        {/* {html2PDF(riskFile.cr4de_historical_events)} */}
      </View>
    </Page>
  );
}
