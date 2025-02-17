import { Image, Page, Text, View } from "@react-pdf/renderer";
import Footer from "./Footer";
import {
  bodyStyle,
  boldStyle,
  h4Style,
  h5Style,
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
import { useEffect, useMemo, useState } from "react";
import svg2PDF from "../../functions/svg2PDF";
import getScaleString from "../../functions/getScaleString";
import Header from "./Header";
import { unwrap as unwrapHE } from "../../functions/historicalEvents";
import { colors } from "../../functions/getCategoryColor";
import { unwrap as unwrapParams } from "../../functions/intensityParameters";
import {
  SCENARIO_PARAMS,
  SCENARIOS,
  unwrap as unwrapScenarios,
} from "../../functions/scenarios";
import LeftBorderSection from "./LeftBorderSection";
import { BLACK } from "../../functions/colors";
import { LoggedInUser } from "../../hooks/useLoggedInUser";

export default function DescriptionSection({
  riskFile,
  user,
}: {
  riskFile: DVRiskFile;
  user: LoggedInUser | null | undefined;
}) {
  const { t } = useTranslation();

  const events = useMemo(() => {
    return unwrapHE(riskFile.cr4de_historical_events);
  }, [riskFile]);
  const parameters = useMemo(
    () => unwrapParams(riskFile.cr4de_intensity_parameters),
    [riskFile]
  );
  const scenarios = useMemo(
    () =>
      unwrapScenarios(
        parameters,
        riskFile.cr4de_scenario_considerable,
        riskFile.cr4de_scenario_major,
        riskFile.cr4de_scenario_extreme
      ),
    [parameters, riskFile]
  );

  const [scenarioChart, setScenarioChart] = useState("");

  useEffect(() => {
    setTimeout(() => {
      svg2PDF(
        document.querySelector("#scenarioChart")?.outerHTML || "",
        600,
        540
      ).then((uri) => setScenarioChart(uri || ""));
    }, 5000);
  }, []);

  const colorList = Object.values(colors);

  const scenario = riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE;

  const mrs_description = html2PDF(riskFile.cr4de_mrs_scenario, "description");

  return (
    <Page
      size={PAGE_SIZE}
      dpi={PAGE_DPI}
      style={{
        ...PAGE_STYLES,
        backgroundColor: "white",
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
          <Trans i18nKey="risk.bottombar.riskIdentification">
            Risk Description
          </Trans>
        </Text>
      </View>

      <View
        style={
          {
            // backgroundColor: "green"
          }
        }
      >
        <Text style={h5Style}>
          <Trans i18nKey="riskFile.definition.title">Definition</Trans>
        </Text>
        <LeftBorderSection
          color="#eee"
          style={{ paddingTop: 5 * SCALE, marginBottom: 10 * SCALE }}
        >
          {html2PDF(riskFile.cr4de_definition, "description")}
          <View
            style={{ marginTop: -5 * SCALE, width: "100%", height: "1pt" }}
          />
        </LeftBorderSection>
      </View>

      <View
        style={
          {
            // backgroundColor: "green"
          }
        }
      >
        {events.map((e, i) => {
          return (
            <View wrap={false}>
              {i === 0 && (
                <Text style={h5Style}>
                  <Trans i18nKey="riskFile.historicalEvents.title">
                    Historical Events
                  </Trans>
                </Text>
              )}
              <LeftBorderSection key={e.id} color={colorList[i]} wrap={false}>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      flexDirection: "column",
                      marginTop: 10 * SCALE,
                      marginBottom: "0pt",
                      width: 3 * POINTS_PER_CM,
                      flexShrink: 0,
                      borderRadius: 2,
                      rowGap: 1,
                    }}
                  >
                    <Text style={{ ...bodyStyle, ...boldStyle, ...smallStyle }}>
                      {e.time}
                    </Text>
                    <Text style={{ ...bodyStyle, ...boldStyle, ...smallStyle }}>
                      {e.location}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      marginTop: 5 * SCALE,
                      marginLeft: 5 * SCALE,
                      ...bodyStyle,
                      marginBottom: "0pt",
                    }}
                  >
                    {html2PDF(e.description, "description")}
                  </View>
                </View>
              </LeftBorderSection>
            </View>
          );
        })}
      </View>

      <View
        style={{
          marginTop: 10 * SCALE,
        }}
      >
        <Text style={h5Style} wrap={false}>
          <Trans i18nKey="hazardCatalogue.mrs">Most Relevant Scenario</Trans>
        </Text>

        <LeftBorderSection color={SCENARIO_PARAMS[scenario].color}>
          <View
            style={{
              flexDirection: "row",
              marginTop: 5 * SCALE,
              marginBottom: 0.5 * POINTS_PER_CM,
            }}
            wrap={false}
          >
            <View style={{ flex: 1 }}>{mrs_description[0]}</View>
            <View
              style={{
                width: 6 * POINTS_PER_CM,
                height: 5.4 * POINTS_PER_CM,
                marginLeft: 0.5 * POINTS_PER_CM,
              }}
            >
              {scenarioChart && (
                <Image
                  src={scenarioChart}
                  style={{
                    marginTop: 0,
                    // marginLeft: "0.25cm",
                    width: 6 * POINTS_PER_CM,
                    height: 5.4 * POINTS_PER_CM,
                  }}
                  // debug={true}
                />
              )}
            </View>
          </View>
          {mrs_description.slice(1)}
        </LeftBorderSection>
      </View>

      {/* <View
        style={
          {
            // backgroundColor: "green"
          }
        }
      >
        <Text style={h5Style}>
          {t("riskFile.intensityParameters.title", "Intensity Parameters")} &{" "}
          {t("riskFile.scenarios.title", "Scenarios")}
        </Text>

        <View
          style={{
            flexDirection: "row",
            marginTop: "5pt",
            marginBottom: "0.5cm",
          }}
        >
          <View
            style={{
              width: "5pt",
              marginRight: "5pt",
              height: "100%",
              backgroundColor: SCENARIO_PARAMS[scenario].color,
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              marginTop: "5pt",
              marginBottom: "0cm",
            }}
          >
            <View style={{ flexDirection: "column" }}>
              {scenarios[scenario].map((p) => {
                return (
                  <View
                    key={`${riskFile.cr4de_riskfilesid}-${p.name}`}
                    style={{ marginBottom: "5pt" }}
                  >
                    <Text
                      style={{ ...bodyStyle, ...boldStyle, fontSize: "8pt" }}
                    >
                      {p.name}
                    </Text>
                    {/* {html2PDF(p.value, "description")} 
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View> */}
    </Page>
  );
}
