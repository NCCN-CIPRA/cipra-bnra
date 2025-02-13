import { Canvg } from "canvg";

// const scale= 1;

export default async function (svgString: string, width?: number, height?: number) {
  try {
    const canvas = document.createElement("canvas");
    if (width) {
      canvas.width = width;
    }
    if (height) {
      canvas.height = height;
    }
    // canvas.width = scale*1000; // Default width if not specified
    // canvas.height = scale*550; // Default height if not specified
    
    const context = canvas.getContext("2d");

    if (context) {
      // context.imageSmoothingEnabled = true;
      // context.imageSmoothingQuality = 'low';


      const v = Canvg.fromString(context, svgString.trim());
      await v.render();

      //store the current globalCompositeOperation
      var compositeOperation = context.globalCompositeOperation;

      //set to draw behind current content
      context.globalCompositeOperation = "destination-over";

      //set background color
      context.fillStyle = "#FFFFFF";

      //draw background / rect on entire canvas
      context.fillRect(0, 0, canvas.width, canvas.height);

      const dataUri = canvas.toDataURL("image/jpeg", 1);
      return dataUri;
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return null;
  }
}
