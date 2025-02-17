
import { Font } from "@react-pdf/renderer";

import Robo100 from "../../assets/fonts/Roboto-Thin.ttf";
import Robo100i from "../../assets/fonts/Roboto-ThinItalic.ttf";
import Robo200 from "../../assets/fonts/Roboto-ExtraLight.ttf";
import Robo200i from "../../assets/fonts/Roboto-ExtraLightItalic.ttf";
import Robo300 from "../../assets/fonts/Roboto-Light.ttf";
import Robo300i from "../../assets/fonts/Roboto-LightItalic.ttf";
import Robo400 from "../../assets/fonts/Roboto-Regular.ttf";
import Robo400i from "../../assets/fonts/Roboto-Italic.ttf";
import Robo500 from "../../assets/fonts/Roboto-Medium.ttf";
import Robo500i from "../../assets/fonts/Roboto-MediumItalic.ttf";
import Robo600 from "../../assets/fonts/Roboto-SemiBold.ttf";
import Robo600i from "../../assets/fonts/Roboto-SemiBoldItalic.ttf";
import Robo700 from "../../assets/fonts/Roboto-Bold.ttf";
import Robo700i from "../../assets/fonts/Roboto-BoldItalic.ttf";
import Robo800 from "../../assets/fonts/Roboto-ExtraBold.ttf";
import Robo800i from "../../assets/fonts/Roboto-ExtraBoldItalic.ttf";
import Robo900 from "../../assets/fonts/Roboto-Black.ttf";
import Robo900i from "../../assets/fonts/Roboto-BlackItalic.ttf";

Font.register({
  family: "NH",
  fonts: [
    {
      src: Robo100,
      fontWeight: 100,
    },
    {
      src: Robo100i,
      fontWeight: 100,
      fontStyle: "italic",
    },
    {
      src: Robo200,
      fontWeight: 200,
    },
    {
      src: Robo200i,
      fontWeight: 200,
      fontStyle: "italic",
    },
    {
      src: Robo300,
      fontWeight: 300,
    },
    {
      src: Robo300i,
      fontWeight: 300,
      fontStyle: "italic",
    },
    {
      src: Robo400,
      fontWeight: 400,
    },
    {
      src: Robo400i,
      fontWeight: 400,
      fontStyle: "italic",
    },
    {
      src: Robo500,
      fontWeight: 500,
    },
    {
      src: Robo500i,
      fontWeight: 500,
      fontStyle: "italic",
    },
    {
      src: Robo600,
      fontWeight: 600,
    },
    {
      src: Robo600i,
      fontWeight: 600,
      fontStyle: "italic",
    },
    {
      src: Robo700,
      fontWeight: 700,
    },
    {
      src: Robo700i,
      fontWeight: 700,
      fontStyle: "italic",
    },
    {
      src: Robo800,
      fontWeight: 800,
    },
    {
      src: Robo800i,
      fontWeight: 800,
      fontStyle: "italic",
    },
    {
      src: Robo900,
      fontWeight: 900,
    },
    {
      src: Robo900i,
      fontWeight: 9300,
      fontStyle: "italic",
    },
  ],
});
Font.registerHyphenationCallback((word) => [word]);