/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DOMParser } from "@xmldom/xmldom";
import { Canvg, presets } from "canvg";
import { ReactElement } from "react";
import { renderToString } from "react-dom/server";
import { createCanvas } from "canvas";

const preset = presets.offscreen({
  DOMParser,
});

// const scale = 1;

export default async function svg2PDF(
  jsxChart: ReactElement,
  width: number,
  height: number,
  type: string = "image/jpeg"
) {
  const svgString = renderToString(jsxChart);

  try {
    const canvas = createCanvas(width, height);
    // canvas.width = scale*1000; // Default width if not specified
    // canvas.height = scale*550; // Default height if not specified

    const context = canvas.getContext("2d");

    if (context) {
      // context.imageSmoothingEnabled = true;
      // context.imageSmoothingQuality = 'low';

      // @ts-expect-error any
      const v = Canvg.fromString(context, svgString.trim(), preset);
      await v.render();

      if (type.indexOf("jpeg") >= 0) {
        //set to draw behind current content
        // @ts-ignore
        context.globalCompositeOperation = "destination-over";

        //set background color
        // @ts-ignore
        context.fillStyle = "#FFFFFF";

        //draw background / rect on entire canvas
        // @ts-ignore
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      // @ts-ignore
      // const blob = await canvas.convertToBlob({ type, quality: 1 });

      const dataUri = canvas.toDataURL();
      return dataUri;
    }

    throw Error("No context");
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
}
