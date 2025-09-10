import { Image, Page, Text, View } from "@react-pdf/renderer";
import Footer from "./Footer";
import {
  h4Style,
  h5Style,
  PAGE_DPI,
  PAGE_SIZE,
  PAGE_STYLES,
  POINTS_PER_CM,
  SCALE,
} from "./styles";
import html2PDF from "../../functions/html2pdf";
import { Trans, useTranslation } from "react-i18next";
import getImpactColor from "../../functions/getImpactColor";
import Header from "./Header";
import LeftBorderSection from "./LeftBorderSection";
import { BLACK } from "../../functions/colors";
import { RiskFileCharts } from "../../functions/export/renderSVG";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
// import { LoggedInUser } from "../../hooks/useLoggedInUser";

export default function AnalysisSection({
  riskFile,
  charts,
}: {
  riskFile: DVRiskSnapshot;
  charts: RiskFileCharts;
  // user: LoggedInUser | null | undefined;
}) {
  const { t } = useTranslation();

  return (
    <Page
      size={PAGE_SIZE}
      dpi={PAGE_DPI}
      style={{
        ...PAGE_STYLES,
        backgroundColor: "white",
        color: BLACK,
        position: "relative",
        minHeight: 10 * POINTS_PER_CM,
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
          marginLeft: -0.25 * POINTS_PER_CM,
          marginRight: -0.25 * POINTS_PER_CM,
          height: 12.5 * POINTS_PER_CM,
        }}
      >
        <View
          style={{
            display: "flex",
            width: "100%",
            height: 12.5 * POINTS_PER_CM,
            flexDirection: "row",
          }}
        >
          <Image
            src={charts.sankey.probability}
            style={{
              display: "flex",
              marginTop: 0.25 * POINTS_PER_CM,
              marginLeft: 0.25 * POINTS_PER_CM,
              width: 6 * POINTS_PER_CM,
              height: 12 * POINTS_PER_CM,
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              marginLeft: 4 * SCALE,
              justifyContent: "center",
            }}
            debug={false}
          >
            <Image
              src={charts.sankey.impactBars}
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
            src={charts.sankey.impact}
            style={{
              display: "flex",
              marginTop: 0.25 * POINTS_PER_CM,
              marginLeft: 0.25 * POINTS_PER_CM,
              width: 6 * POINTS_PER_CM,
              height: 12 * POINTS_PER_CM,
            }}
          />
        </View>
      </View>

      <View
        style={
          {
            // backgroundColor: "green"
            // marginTop: POINTS_PER_CM,
            // marginBottom: POINTS_PER_CM,
          }
        }
      >
        <Text style={h5Style}>{t("Probability Assessment")}</Text>
        <LeftBorderSection
          color="#eee"
          // style={{ paddingTop: 5 * SCALE, marginBottom: 10 * SCALE }}
        >
          {html2PDF(riskFile.cr4de_quali_p_mrs, "analysis", riskFile)}
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
              marginBottom: 5 * SCALE,
            }}
          >
            {t("learning.impact.h.title")}
          </Text>
          {html2PDF(riskFile.cr4de_quali_h_mrs, "analysis", riskFile)}
        </LeftBorderSection>

        <LeftBorderSection color={getImpactColor("S")}>
          <Text
            style={{
              ...h5Style,
              color: getImpactColor("S"),
              marginTop: "0pt",
              marginBottom: 5 * SCALE,
            }}
          >
            {t("learning.impact.s.title")}
          </Text>
          {html2PDF(riskFile.cr4de_quali_s_mrs, "analysis", riskFile)}
        </LeftBorderSection>

        <LeftBorderSection color={getImpactColor("E")}>
          <Text
            style={{
              ...h5Style,
              color: getImpactColor("E"),
              marginTop: "0pt",
              marginBottom: 5 * SCALE,
            }}
          >
            {t("learning.impact.e.title")}
          </Text>
          {html2PDF(riskFile.cr4de_quali_e_mrs, "analysis", riskFile)}
        </LeftBorderSection>

        <LeftBorderSection color={getImpactColor("F")}>
          <Text
            style={{
              ...h5Style,
              color: getImpactColor("F"),
              marginTop: "0pt",
              marginBottom: 5 * SCALE,
            }}
          >
            {t("learning.impact.f.title")}
          </Text>
          {html2PDF(riskFile.cr4de_quali_f_mrs, "analysis", riskFile)}
        </LeftBorderSection>

        <LeftBorderSection color="#eee" style={{ marginBottom: -5 * SCALE }}>
          <Text
            style={{
              ...h5Style,
              color: BLACK,
              marginTop: "0pt",
              marginBottom: 5 * SCALE,
            }}
          >
            {t("Cross-border Impact")}
          </Text>
          {html2PDF(riskFile.cr4de_quali_cb_mrs, "analysis", riskFile)}
          <View
            style={{ marginTop: -5 * SCALE, width: "100%", height: "1pt" }}
          />
        </LeftBorderSection>
      </View>
    </Page>
  );
}
