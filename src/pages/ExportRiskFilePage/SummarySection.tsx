import { Image, Page, Text, View } from "@react-pdf/renderer";
import Footer from "./Footer";
import {
  bodyStyle,
  boldStyle,
  h3Style,
  h4Style,
  PAGE_DPI,
  PAGE_SIZE,
  PAGE_STYLES,
  POINTS_PER_CM,
  SCALE,
  smallStyle,
} from "./styles";
import html2PDF from "../../functions/html2pdf";
import { Trans, useTranslation } from "react-i18next";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { useEffect, useState } from "react";
import svg2PDF from "../../functions/svg2PDF";
import getScaleString from "../../functions/getScaleString";
import { getSummary } from "../../functions/translations";
import i18next from "i18next";
import { BLACK } from "../../functions/colors";
import Watermark from "./Watermark";
import { LoggedInUser } from "../../hooks/useLoggedInUser";

export default function SummarySection({
  riskFile,
  tp,
  H,
  S,
  E,
  F,
  user,
}: {
  riskFile: DVRiskFile;
  tp: number;
  H: number;
  S: number;
  E: number;
  F: number;
  user: LoggedInUser | null | undefined;
}) {
  const { t } = useTranslation();

  const [pBarChart, setpBarChart] = useState("");
  const [hChart, setHChart] = useState("");
  const [sChart, setSChart] = useState("");
  const [eChart, setEChart] = useState("");
  const [fChart, setFChart] = useState("");

  useEffect(() => {
    setTimeout(() => {
      svg2PDF(
        document.querySelector(`#pBars-${riskFile.cr4de_riskfilesid}`)
          ?.outerHTML || ""
      ).then((uri) => setpBarChart(uri || ""));
      svg2PDF(
        document.querySelector(`#hChart-${riskFile.cr4de_riskfilesid} svg`)
          ?.outerHTML || ""
      ).then((uri) => setHChart(uri || ""));
      svg2PDF(
        document.querySelector(`#sChart-${riskFile.cr4de_riskfilesid} svg`)
          ?.outerHTML || ""
      ).then((uri) => setSChart(uri || ""));
      svg2PDF(
        document.querySelector(`#eChart-${riskFile.cr4de_riskfilesid} svg`)
          ?.outerHTML || ""
      ).then((uri) => setEChart(uri || ""));
      svg2PDF(
        document.querySelector(`#fChart-${riskFile.cr4de_riskfilesid} svg`)
          ?.outerHTML || ""
      ).then((uri) => setFChart(uri || ""));
    }, 5000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wrapperStyle = {
    width: 3 * POINTS_PER_CM,
    // height: 4.5 * POINTS_PER_CM,
    textAlign: "center" as const,
  };
  const titleStyle = { ...bodyStyle, ...smallStyle, ...boldStyle };
  const imageStyle = {
    marginTop: 0.25 * POINTS_PER_CM,
    marginLeft: 0.25 * POINTS_PER_CM,
    width: 2.5 * POINTS_PER_CM,
    height: 1.3 * POINTS_PER_CM,
  };
  const scaleStyle = {
    ...bodyStyle,
    marginTop: 0.25 * POINTS_PER_CM,
    marginBottom: 0,
  };

  return (
    <Page
      size={PAGE_SIZE}
      dpi={PAGE_DPI}
      style={{
        ...PAGE_STYLES,
        backgroundColor: "white",
        color: BLACK,
      }}
      // wrap={false}
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
          borderWidth: SCALE,
          borderColor: "rgb(232, 232, 232)",
          paddingTop: 0.25 * POINTS_PER_CM,
          paddingBottom: 0.25 * POINTS_PER_CM,
          // height: 3 * POINTS_PER_CM,
          // width: "3.8cm",
          display: "flex",
          flexDirection: "row",
          marginBottom: 0.5 * POINTS_PER_CM,
          justifyContent: "space-between",
        }}
      >
        <View
          style={wrapperStyle}
          // debug={true}
        >
          <Text style={titleStyle} debug={false}>
            {riskFile.cr4de_risk_type === RISK_TYPE.MANMADE
              ? t("learning.motivation.text.title", "Motivation")
              : t("learning.probability.2.text.title", "Probability")}
          </Text>
          {pBarChart && <Image src={pBarChart} style={imageStyle} />}
          <Text style={scaleStyle}>{t(getScaleString(tp))}</Text>
        </View>
        <View style={wrapperStyle}>
          <Text style={titleStyle} debug={false}>
            <Trans i18nKey="Human">Human</Trans>
          </Text>
          {hChart && <Image src={hChart} style={imageStyle} />}
          <Text style={scaleStyle}>{t(getScaleString(H))}</Text>
        </View>
        <View style={wrapperStyle}>
          <Text style={titleStyle} debug={false}>
            <Trans i18nKey="Societal">Societal</Trans>
          </Text>
          {sChart && <Image src={sChart} style={imageStyle} />}
          <Text style={scaleStyle}>{t(getScaleString(S))}</Text>
        </View>
        <View style={wrapperStyle}>
          <Text style={titleStyle} debug={false}>
            <Trans i18nKey="Environmental">Environmental</Trans>
          </Text>
          {eChart && <Image src={eChart} style={imageStyle} />}
          <Text style={scaleStyle}>{t(getScaleString(E))}</Text>
        </View>
        <View style={wrapperStyle}>
          <Text style={titleStyle} debug={false}>
            <Trans i18nKey="Financial">Financial</Trans>
          </Text>
          {fChart && <Image src={fChart} style={imageStyle} />}
          <Text style={scaleStyle}>{t(getScaleString(F))}</Text>
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
        {html2PDF(getSummary(riskFile, i18next.language), "summary")}
      </View>
      {!user?.roles.analist && <Watermark user={user} />}
    </Page>
  );
}
