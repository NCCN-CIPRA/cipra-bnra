import { useOutletContext } from "react-router-dom";
import { RiskPageContext } from "../BaseRisksPage";
import { createElement, useEffect, useMemo, useState } from "react";
import {
  ExportRiskFile,
  ExportRiskFileCharts,
} from "../ExportRiskFilePage/ExportRiskFilePage";
import { DataTable } from "../../hooks/useAPI";
import useRecords from "../../hooks/useRecords";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { Box, Stack, Typography } from "@mui/material";
import NCCNLoader from "../../components/NCCNLoader";
import { NCCN_GREEN } from "../../functions/colors";
import { ReactComponent as BNRA_Logo } from "../../assets/icons/BNRA_Logo.svg";
import { ReactComponent as NCCN_Logo } from "../../assets/icons/NCCN_Logo.svg";
import { ReactComponent as NCCN_Detail } from "../../assets/icons/Triangles_detail.svg";
import RiskMatrix from "../../components/charts/RiskMatrix";
import {
  CATEGORY_NAMES,
  DVRiskFile,
  RISK_CATEGORY,
  RISK_TYPE,
} from "../../types/dataverse/DVRiskFile";
import {
  Document,
  Font,
  Image,
  Page,
  PDFViewer,
  Text,
  View,
} from "@react-pdf/renderer";
import { renderToStaticMarkup } from "react-dom/server";
import { Canvg } from "canvg";
import svg2PDF from "../../functions/svg2PDF";
import NH15 from "../../assets/fonts/NHaasGroteskDSPro-15UltTh.ttf";
import NH25 from "../../assets/fonts/NHaasGroteskDSPro-25Th.ttf";
import NH45 from "../../assets/fonts/NHaasGroteskDSPro-45Lt.ttf";
import NH46 from "../../assets/fonts/NHaasGroteskDSPro-46LtIt.ttf";
import NH55 from "../../assets/fonts/NHaasGroteskDSPro-55Rg.ttf";
import NH65 from "../../assets/fonts/NHaasGroteskDSPro-65Md.ttf";
import NH66 from "../../assets/fonts/NHaasGroteskDSPro-66MdIt.ttf";
import NH75 from "../../assets/fonts/NHaasGroteskDSPro-75Bd.ttf";
import {
  DVAnalysisRun,
  RiskCalculation,
} from "../../types/dataverse/DVAnalysisRun";
import {
  getResultSnapshot,
  SmallRisk,
} from "../../types/dataverse/DVSmallRisk";
import {
  DVRiskCascade,
  getCascadeResultSnapshot,
} from "../../types/dataverse/DVRiskCascade";
import useLazyRecords from "../../hooks/useLazyRecords";
import { getCascades } from "../../functions/cascades";
import "../ExportRiskFilePage/fonts";
import { expose, wrap } from "comlink";
import useLoggedInUser, { LoggedInUser } from "../../hooks/useLoggedInUser";
import { getScenarioParameter, SCENARIOS } from "../../functions/scenarios";
import {
  DPI,
  h2Style,
  PAGE_HEIGHT,
  PAGE_SIZE,
  PAGE_STYLES,
  PAGE_WIDTH,
  POINTS_PER_CM,
  SCALE,
} from "../ExportRiskFilePage/styles";
import { getCategoryImpactRescaled } from "../../functions/CategoryImpact";
import BibliographySection from "../ExportRiskFilePage/BibliographySection";

const categories = [
  // RISK_CATEGORY.MANMADE,
  RISK_CATEGORY.CYBER,
  // RISK_CATEGORY.TRANSVERSAL,
  // RISK_CATEGORY.ECOTECH,
  // RISK_CATEGORY.HEALTH,
  // RISK_CATEGORY.NATURE,
  // RISK_CATEGORY.EMERGING,
];

const SPLASH: Partial<{ [key in RISK_CATEGORY]: string }> = {
  Cyber: "splash1.png",
  "Emerging Risk": "splash7.png",
  Health: "splash5.png",
  "Man-made": "splash2.png",
  Nature: "splash6.png",
  Transversal: "spalsh3.png",
  EcoTech: "splash4.png",
};

export default function ExportBNRAPage({}: {}) {
  const { user } = useLoggedInUser();

  return <ExportBNRA user={user} />;
}

function ExportBNRA({ user }: { user: LoggedInUser | null | undefined }) {
  const [detailSVG, setDetailSVG] = useState("");
  const [nccnLogoSVG, setNccnLogoSVG] = useState("");
  const [bnraLogoSVG, setBnraLogoSVG] = useState("");

  const { data: risks } = useRecords<DVRiskFile>({
    table: DataTable.RISK_FILE,
    query: "$orderby=cr4de_hazard_id",
    transformResult: (data: DVRiskFile[]) =>
      data
        .filter((r: DVRiskFile) => !r.cr4de_hazard_id.startsWith("X"))
        .map((rf) => ({
          ...rf,
          results: getResultSnapshot(rf),
        })),
  });

  const { data: rawCascades, getData: getRawCascades } = useLazyRecords<
    DVRiskCascade<SmallRisk, SmallRisk>
  >({
    table: DataTable.RISK_CASCADE,
  });

  const hazardCatalogue = useMemo(() => {
    if (!risks) return null;

    const hc = risks.reduce(
      (acc, sr) => ({ ...acc, [sr.cr4de_riskfilesid]: sr }),
      {} as { [key: string]: DVRiskFile }
    );

    getRawCascades({
      transformResult: (results: DVRiskCascade[]) =>
        results.map((r) => {
          return {
            ...r,
            cr4de_cause_hazard: hc[r._cr4de_cause_hazard_value],
            cr4de_effect_hazard: hc[r._cr4de_effect_hazard_value],
            results: getCascadeResultSnapshot(r),
          } as DVRiskCascade<SmallRisk, SmallRisk>;
        }),
    });

    return hc;
  }, [risks]);

  const cascades = useMemo(() => {
    if (!risks || !hazardCatalogue || !rawCascades) return null;

    return getCascades(risks, rawCascades, hazardCatalogue);
  }, [risks, hazardCatalogue, rawCascades]);

  const { data: attachments } = useRecords<DVAttachment<unknown, DVAttachment>>(
    {
      table: DataTable.ATTACHMENT,
      query: `$expand=cr4de_referencedSource,cr4de_risk_file($select=cr4de_hazard_id)`,
      transformResult: (results: DVAttachment<unknown, DVAttachment>[]) =>
        results.map((a) =>
          a.cr4de_referencedSource
            ? {
                ...a.cr4de_referencedSource,
                cr4de_bnraattachmentid: a.cr4de_bnraattachmentid,
                cr4de_field: a.cr4de_field,
                cr4de_referencedSource: a.cr4de_referencedSource,
              }
            : a
        ),
    }
  );

  useEffect(() => {
    svg2PDF(
      renderToStaticMarkup(
        <NCCN_Detail style={{ position: "absolute", bottom: 0, left: 0 }} />
      ),
      undefined,
      undefined,
      "image/png"
    ).then((uri) => setDetailSVG(uri || ""));
    svg2PDF(
      renderToStaticMarkup(
        <NCCN_Logo style={{ position: "absolute", bottom: 0, left: 0 }} />
      ),
      undefined,
      undefined,
      "image/png"
    ).then((uri) => setNccnLogoSVG(uri || ""));
    svg2PDF(
      renderToStaticMarkup(
        <BNRA_Logo style={{ position: "absolute", bottom: 0, left: 0 }} />
      ),
      undefined,
      undefined,
      "image/png"
    ).then((uri) => setBnraLogoSVG(uri || ""));
  }, []);

  if (!risks || !cascades || !attachments) return null;

  return (
    <Box sx={{ width: "100vw", height: "100vh" }}>
      {risks
        .filter((c) => false)
        .map((riskFile) => {
          const scenario = riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE;

          const tp = getScenarioParameter(riskFile, "TP", scenario) || 0;

          const H = getCategoryImpactRescaled(riskFile, "H", scenario);
          const S = getCategoryImpactRescaled(riskFile, "S", scenario);
          const E = getCategoryImpactRescaled(riskFile, "E", scenario);
          const F = getCategoryImpactRescaled(riskFile, "F", scenario);

          return (
            <ExportRiskFileCharts
              riskFile={riskFile}
              cascades={cascades[riskFile.cr4de_riskfilesid]}
              E={E}
              F={F}
              H={H}
              S={S}
              tp={tp}
              user={user}
              scenario={scenario}
            />
          );
        })}

      <PDFViewer
        style={{ overflow: "hidden", height: "100%", width: "100%" }}
        height="100%"
        width="100%"
      >
        <Document>
          <Page
            size={PAGE_SIZE}
            style={{
              backgroundColor: NCCN_GREEN,
            }}
            dpi={DPI}
          >
            <View
              style={{
                width: "70%",
                margin: "auto",
                textAlign: "center",
                marginTop: PAGE_STYLES.padding,
                marginBottom: 0,
              }}
            >
              <Text
                style={{
                  fontFamily: "NH",
                  fontSize: 30 * SCALE,
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Belgian National Risk Assessment
              </Text>
            </View>
            <View
              style={{
                width: "80%",
                margin: "auto",
                textAlign: "center",
                marginTop: 10 * SCALE,
                marginBottom: 30 * SCALE,
              }}
            >
              <Text
                style={{
                  fontFamily: "NH",
                  fontSize: 20 * SCALE,
                  color: "white",
                  fontWeight: "normal",
                }}
              >
                Full Report
              </Text>
              <Text
                style={{
                  fontFamily: "NH",
                  fontSize: 20 * SCALE,
                  color: "white",
                  fontWeight: "normal",
                }}
              >
                2023 - 2026
              </Text>
            </View>
            <Image src="https://bnra.powerappsportals.com/report-front.png" />
            <View
              style={{
                position: "absolute",
                width: "100%",
                bottom: 0,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: PAGE_STYLES.padding,
                paddingRight: PAGE_STYLES.padding,
                paddingBottom: PAGE_STYLES.padding - 1.5 * POINTS_PER_CM,
              }}
              // debug={true}
            >
              <Image src={nccnLogoSVG} style={{ height: 3 * POINTS_PER_CM }} />
              <Image src={bnraLogoSVG} style={{ height: 2 * POINTS_PER_CM }} />
            </View>
          </Page>
          <Page
            size={PAGE_SIZE}
            style={{
              backgroundColor: NCCN_GREEN,
            }}
            dpi={DPI}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                margin: "auto",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginBottom: 10 * SCALE,
              }}
              // debug={true}
            >
              <Text
                style={{
                  fontFamily: "NH",
                  fontSize: 16 * SCALE,
                  color: "white",
                  fontWeight: "semibold",
                }}
              >
                Better prepared. Better response.
              </Text>
              <View
                style={{
                  position: "absolute",
                  width: "100%",
                  bottom: -1 * POINTS_PER_CM,
                  left: "0",
                }}
              >
                <Image src={detailSVG} />
              </View>
            </View>
          </Page>
          {categories
            .filter((c) => false)
            .map((c) => (
              <>
                <CategoryFrontPage category={c} />
                {Object.values(risks)
                  .filter((rf) => rf.cr4de_risk_category === c)
                  .sort((a, b) =>
                    a.cr4de_hazard_id.localeCompare(b.cr4de_hazard_id)
                  )
                  .map((riskFile) => {
                    const scenario =
                      riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE;

                    const tp =
                      getScenarioParameter(riskFile, "TP", scenario) || 0;

                    const H = getCategoryImpactRescaled(
                      riskFile,
                      "H",
                      scenario
                    );
                    const S = getCategoryImpactRescaled(
                      riskFile,
                      "S",
                      scenario
                    );
                    const E = getCategoryImpactRescaled(
                      riskFile,
                      "E",
                      scenario
                    );
                    const F = getCategoryImpactRescaled(
                      riskFile,
                      "F",
                      scenario
                    );

                    return (
                      <ExportRiskFile
                        riskFile={riskFile}
                        cascades={cascades[riskFile.cr4de_riskfilesid]}
                        E={E}
                        F={F}
                        H={H}
                        S={S}
                        attachments={null}
                        tp={tp}
                        user={user}
                      />
                    );
                  })}
              </>
            ))}
          <BibliographySection
            riskFile={null}
            allAttachments={attachments
              .filter((a: any) => a.cr4de_reference && a.cr4de_risk_file)
              .sort((a: any, b: any) =>
                a.cr4de_risk_file.cr4de_hazard_id.localeCompare(
                  b.cr4de_risk_file.cr4de_hazard_id
                )
              )
              .map((a: any) => ({
                ...a,
                cr4de_reference: `${a.cr4de_risk_file.cr4de_hazard_id}-${a.cr4de_reference}`,
              }))}
          />
          {/* {risks
            .filter((rf) => rf.cr4de_risk_type === RISK_TYPE.STANDARD)
            .slice(0, 30)
            .map((rf) => {
              console.log(rf);
              return (
                <ExportRiskFile
                  riskFile={rf}
                  cascades={cascades[rf.cr4de_riskfilesid]}
                  E={0}
                  F={0}
                  H={0}
                  S={0}
                  attachments={[]}
                  tp={0}
                  user={user}
                />
              );
            })} */}
          <Page
            size={PAGE_SIZE}
            style={{
              backgroundColor: NCCN_GREEN,
            }}
            dpi={DPI}
          ></Page>
        </Document>
      </PDFViewer>
    </Box>
  );
}

const SPLASH_STYLE: { [key in RISK_CATEGORY]: any } = {
  "Man-made": {
    top: 0,
    left: "-100%",
    width: 1.78 * PAGE_HEIGHT * POINTS_PER_CM,
    height: PAGE_HEIGHT * POINTS_PER_CM,
  },
  Cyber: {
    top: 0,
    left: "-40%",
    width: 1.5 * PAGE_HEIGHT * POINTS_PER_CM,
    height: PAGE_HEIGHT * POINTS_PER_CM,
  },
  EcoTech: {
    top: 0,
    left: "0%",
    aspectRatio: 1,
    width: 0.71 * PAGE_HEIGHT * POINTS_PER_CM,
    height: PAGE_HEIGHT * POINTS_PER_CM,
  },
  Health: {
    top: 3 * POINTS_PER_CM,
    left: -10 * POINTS_PER_CM,
    width: 1.5 * PAGE_HEIGHT * POINTS_PER_CM,
    height: (1.5 * (PAGE_HEIGHT * POINTS_PER_CM)) / 1.78,
    transform: "rotate(90deg)",
  },
  Nature: {
    top: 0,
    left: "0%",
    width: (PAGE_HEIGHT * POINTS_PER_CM) / 1.25,
    height: PAGE_HEIGHT * POINTS_PER_CM,
  },
  Transversal: {
    top: 0,
    left: "0%",
    aspectRatio: 1,
    width: (PAGE_HEIGHT * POINTS_PER_CM) / 1.25,
    height: PAGE_HEIGHT * POINTS_PER_CM,
  },
  "Emerging Risk": {
    top: 0,
    left: "-50%",
    width: PAGE_HEIGHT * POINTS_PER_CM * 1.5,
    height: PAGE_HEIGHT * POINTS_PER_CM,
  },
  Test: {},
};

function CategoryFrontPage({ category }: { category: RISK_CATEGORY }) {
  return (
    <Page
      size={PAGE_SIZE}
      style={{
        backgroundColor: NCCN_GREEN,
      }}
      dpi={DPI}
    >
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0.2,
          zIndex: 1,
        }}
      >
        <Image
          src={`https://bnra.powerappsportals.com/${SPLASH[category]}`}
          style={{ position: "absolute", ...SPLASH_STYLE[category] }}
        />
      </View>
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ ...h2Style }}>{CATEGORY_NAMES[category]}</Text>
      </View>
    </Page>
  );
}
