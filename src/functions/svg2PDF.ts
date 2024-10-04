import { Canvg } from "canvg";

export default async function (svgString: string) {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
      const v = Canvg.fromString(context, svgString.trim());
      await v.render();
      const dataUri = canvas.toDataURL("image/png");
      return dataUri;
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return null;
  }
}
