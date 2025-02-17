import { BLACK, NCCN_GREEN } from "../../functions/colors";

export const DPI = 300
export const SCALE = 300 / 72
export const POINTS_PER_CM = 28.3465 * SCALE;


export const PAGE_SIZE = "A4"
export const PAGE_DPI = DPI;
export const PAGE_STYLES = {
    padding: 2.5 *  POINTS_PER_CM,
    paddingBottom: 3 *  POINTS_PER_CM
}
// export const PAGE_SIZE = "B5"
// export const PAGE_STYLES = {
//     padding: "1.5cm",
//     paddingBottom: "1.5cm"
// }

// Global Title
export const h1Style = {};

// Chapter Title
export const h2Style = {};

// Risk File Title
export const h3Style = {
  fontFamily: "NH",
  fontWeight: 700,
  fontSize: 20 * SCALE,
  marginBottom: 0.5 * POINTS_PER_CM,
};

// Section Title (i.e. Summary, Risk Description)
export const h4Style = {
  fontFamily: "NH",
  fontWeight: 700,
  color: NCCN_GREEN,
  fontSize: 16 * SCALE,
  marginBottom: 0.5 * POINTS_PER_CM,
};

// Subsection Title (i.e description, definition, probability analysis)
export const h5Style = {
  fontFamily: "NH",
  fontSize: 11 * SCALE,
  fontWeight: 500,
  // lineHeight: "1.5pt",
  color: BLACK,
  marginTop: 5 * SCALE,
  marginBottom: 5 * SCALE,
};

// Subsubsection Title (i.e. Human impact)
export const h6Style = {
  marginTop: 5 * SCALE,
  fontFamily: "NH",
  fontWeight: 300,
  color: BLACK,
  fontSize: 11 * SCALE,
};

export const bodyStyle = {
  fontFamily: "NH",
  fontSize: 10 * SCALE,
  fontWeight: 300,
  lineHeight: 1.5,
  color: BLACK,
  marginBottom: 5 * SCALE,
};

export const boldStyle = {
  fontWeight: 500,
};

export const smallStyle = {
    fontSize: 8 * SCALE,
};


