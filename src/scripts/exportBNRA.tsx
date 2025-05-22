import { getAPI } from "../hooks/useAPI";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import DataverseBackend from "../functions/i18Backend";
import fetch from "node-fetch";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import { getResultSnapshot, SmallRisk } from "../types/dataverse/DVSmallRisk";
import {
  DVRiskCascade,
  getCascadeResultSnapshot,
} from "../types/dataverse/DVRiskCascade";
import { Cascades, getCascades } from "../functions/cascades";
import renderSVG from "../functions/export/renderSVG";
import ReactPDF from "@react-pdf/renderer";
import { BNRAExport } from "../components/export/BNRAExport";
import "./fonts";
import svg2PDF from "./svg2PDF";
import { cookie } from "./cookie";
import { DVAttachment } from "../types/dataverse/DVAttachment";

(async () => {
  try {
    console.log("Starting export");

    const cookieFetch = async (
      input: string,
      init?: RequestInit | undefined
    ) => {
      return fetch(input, {
        ...init,
        body: null,
        headers: {
          ...(init?.headers || {}),
          cookie: cookie,
        },
      }) as unknown as Promise<Response>;
    };
    const api = getAPI("test", () => {}, cookieFetch);

    i18n
      // pass the i18n instance to react-i18next.
      .use(initReactI18next)
      // init i18next
      // for all options read: https://www.i18next.com/overview/configuration-options
      .use(new DataverseBackend())
      .init({
        lng: "en",
        debug: false,
        fallbackLng: "en",
        saveMissing: true,
        load: "languageOnly",
        interpolation: {
          escapeValue: false, // not needed for react as it escapes by default
        },
        react: {
          useSuspense: false,
        },
      });

    const [riskFiles, allCascades] = await Promise.all([
      api
        .getRiskFiles(
          "$orderby=cr4de_hazard_id&$filter=cr4de_risk_category ne 'test'"
        )
        .then((rf) =>
          rf.map((rf: DVRiskFile) => ({
            ...rf,
            results: getResultSnapshot(rf),
          }))
        ),
      api.getRiskCascades().then((c) =>
        c.map((r: DVRiskCascade) => {
          return {
            ...r,
            results: getCascadeResultSnapshot(r),
          } as DVRiskCascade<SmallRisk, SmallRisk>;
        })
      ),
    ]);

    const allAttachments = (
      await api.getAttachments(
        "$orderby=cr4de_reference&$filter=cr4de_reference ne null&$expand=cr4de_referencedSource"
      )
    ).map((a) =>
      a.cr4de_referencedSource
        ? ({
            ...a.cr4de_referencedSource,
            cr4de_bnraattachmentid: a.cr4de_bnraattachmentid,
            cr4de_field: a.cr4de_field,
            cr4de_referencedSource: a.cr4de_referencedSource,
          } as DVAttachment)
        : a
    );

    console.log("Fetch complete");

    const hc: { [key: string]: DVRiskFile } = riskFiles.reduce(
      (acc, sr) => ({ ...acc, [sr.cr4de_riskfilesid]: sr }),
      {}
    );
    const riskCascades: DVRiskCascade<SmallRisk, SmallRisk>[] = allCascades.map(
      (c) => ({
        ...c,
        cr4de_cause_hazard: hc[c._cr4de_cause_hazard_value],
        cr4de_effect_hazard: hc[c._cr4de_effect_hazard_value],
      })
    );

    const cascades: { [key: string]: Cascades } = riskFiles.reduce(
      (acc, rf) => getCascades(rf, acc, hc)(riskCascades),
      {}
    );

    console.log("Generating SVG Images");

    const filteredRiskFiles = riskFiles.filter(
      (r) => r.cr4de_title.indexOf("Fire or explosion") >= 0
    );
    // const filteredRiskFiles = riskFiles.slice(0, 10);

    const svgImages = await renderSVG(filteredRiskFiles, cascades, svg2PDF);

    console.log("Done");

    //   const doc = createElement(BNRAExport, {
    //     riskFiles,
    //     allCascades: cascades,
    //     allAttachments: attachments,
    //     svgImages: [], // You may want to stub or include real renderSVG output here
    //   });

    //   const pdfDoc = await pdf(doc).toBuffer();

    // const outputPath = path.resolve(__dirname, "BNRA_export.pdf");
    //   fs.writeFileSync(outputPath, pdfDoc);
    // console.log(`✅ Exported PDF to ${outputPath}`);
    ReactPDF.render(
      <BNRAExport
        riskFiles={filteredRiskFiles}
        allCascades={cascades}
        allAttachments={allAttachments.map((a) => ({
          ...a,
          cr4de_risk_file: a._cr4de_risk_file_value
            ? hc[a._cr4de_risk_file_value]
            : null,
        }))}
        svgImages={svgImages}
      />,
      `dist/example.pdf`
    );
  } catch (e) {
    console.log(e);
  }
})();
