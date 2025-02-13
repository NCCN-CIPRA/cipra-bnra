import { Image, Page, Text, View } from "@react-pdf/renderer";
import Footer from "./Footer";
import { BLACK } from "./styles";
import html2PDF, {
  bodyStyle,
  boldStyle,
  h3Style,
  h4Style,
  h5Style,
} from "../../functions/html2pdf";
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

export default function DescriptionSection({
  riskFile,
}: {
  riskFile: DVRiskFile;
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
        300,
        270
      ).then((uri) => setScenarioChart(uri || ""));
    }, 5000);
  }, []);

  const colorList = Object.values(colors);

  const scenario = riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE;

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
              backgroundColor: "#eee",
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
            {html2PDF(riskFile.cr4de_definition, "description")}
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
        <Text style={h5Style}>
          <Trans i18nKey="riskFile.historicalEvents.title">
            Historical Events
          </Trans>
        </Text>

        {events.map((e, i) => {
          return (
            <View
              key={e.id}
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
                  backgroundColor: colorList[i],
                }}
              />
              <View
                style={{
                  flexDirection: "column",
                  marginTop: "5pt",
                  marginBottom: "0pt",
                  width: "3cm",
                  flexShrink: 0,
                  borderRadius: 2,
                  rowGap: 1,
                }}
              >
                <Text style={{ ...bodyStyle, ...boldStyle, fontSize: "8pt" }}>
                  {e.time}
                </Text>
                <Text style={{ ...bodyStyle, ...boldStyle, fontSize: "8pt" }}>
                  {e.location}
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  marginTop: "5pt",
                  marginLeft: "5pt",
                  ...bodyStyle,
                }}
              >
                {html2PDF(e.description, "description")}
              </View>
            </View>
          );
        })}
      </View>

      <View
        style={
          {
            // backgroundColor: "green"
          }
        }
      >
        <Text style={h5Style}>
          <Trans i18nKey="hazardCatalogue.mrs">Most Relevant Scenario</Trans>
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
            {html2PDF(riskFile.cr4de_mrs_scenario, "description")}
          </View>
          {scenarioChart && (
            <Image
              src={scenarioChart}
              style={{
                marginTop: "0.25cm",
                // marginLeft: "0.25cm",
                width: "4cm",
                height: "3.6cm",
              }}
              // debug={true}
            />
          )}
        </View>
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
