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
import { Trans } from "react-i18next";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import Header from "./Header";
import { unwrap as unwrapHE } from "../../functions/historicalEvents";
import { colors } from "../../functions/getCategoryColor";
import { SCENARIO_PARAMS, SCENARIOS } from "../../functions/scenarios";
import LeftBorderSection from "./LeftBorderSection";
import { BLACK } from "../../functions/colors";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
// import { LoggedInUser } from "../../hooks/useLoggedInUser";

export default function DescriptionSection({
  riskFile,
  scenarioChart,
}: {
  riskFile: DVRiskSnapshot;
  // user: LoggedInUser | null | undefined;
  scenarioChart: string;
}) {
  const events = unwrapHE(riskFile.cr4de_historical_events);

  const colorList = Object.values(colors);

  const scenario = riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE;

  const mrs_description = html2PDF(
    riskFile.cr4de_quali_scenario_mrs,
    "description",
    riskFile
  );

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
          {html2PDF(riskFile.cr4de_definition, "description", riskFile)}
          <View
            style={{ marginTop: -5 * SCALE, width: "100%", height: "1pt" }}
          />
        </LeftBorderSection>
      </View>

      {riskFile.cr4de_risk_type === RISK_TYPE.STANDARD && (
        <View
          style={
            {
              // backgroundColor: "green"
            }
          }
        >
          {events.map((e, i) => {
            return (
              <View key={i} wrap={false}>
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
                      <Text
                        style={{ ...bodyStyle, ...boldStyle, ...smallStyle }}
                      >
                        {e.time}
                      </Text>
                      <Text
                        style={{ ...bodyStyle, ...boldStyle, ...smallStyle }}
                      >
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
                      {html2PDF(e.description, "description", riskFile)}
                    </View>
                  </View>
                </LeftBorderSection>
              </View>
            );
          })}
        </View>
      )}

      {riskFile.cr4de_risk_type === RISK_TYPE.STANDARD && (
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
              </View>
            </View>
            {mrs_description.slice(1)}
          </LeftBorderSection>
        </View>
      )}

      {riskFile.cr4de_risk_type === RISK_TYPE.MANMADE && (
        <View
          style={{
            marginTop: 10 * SCALE,
          }}
        >
          <Text style={h5Style} wrap={false}>
            <Trans i18nKey="Most Relevant Actor Group">
              Most Relevant Actor Group
            </Trans>
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
              <View style={{ flex: 1 }}>
                <Text style={bodyStyle}>
                  Actors of this type with{" "}
                  <Text style={boldStyle}>{riskFile.cr4de_mrs}</Text>{" "}
                  capabilities were identified as the{" "}
                  <Text style={boldStyle}>most relevant actor group</Text>. This
                  means that they represent the highest amount of risk
                  (motivation x impact). They can be described as follows:
                </Text>
              </View>
              <View
                style={{
                  width: 6 * POINTS_PER_CM,
                  height: 5.4 * POINTS_PER_CM,
                  marginLeft: 0.5 * POINTS_PER_CM,
                }}
              >
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
              </View>
            </View>

            {mrs_description}
          </LeftBorderSection>
        </View>
      )}
    </Page>
  );
}
