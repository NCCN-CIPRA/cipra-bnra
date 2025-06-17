import { Document } from "@react-pdf/renderer";
import FrontPage from "./FrontPage";
import { SVGImages } from "../../functions/export/renderSVG";

export default function FrontPageExport({
  svgImages,
}: {
  svgImages: SVGImages;
}) {
  return (
    <Document>
      <FrontPage
        nccnLogo={svgImages.nccnLogo}
        bnraLogo={svgImages.bnraLogo}
        triangles={svgImages.triangles}
        raw={true}
      />
    </Document>
  );
}
