import { Text, View } from "@react-pdf/renderer";
import { ReactElement } from "react";
import { NCCN_GREEN } from "./colors";

const BLACK = "#231F20";

type HTMLTag = {
  tagName: string;
  tagOptions: string | null;
  content: string | HTMLTag[];
  size: number;
};

export type Section =
  | "summary"
  | "description"
  | "analysis"
  | "evolution"
  | "bibliography";

// Global Title
export const h1Style = {};

// Chapter Title
export const h2Style = {};

// Risk File Title
export const h3Style = {
  fontFamily: "NH",
  fontWeight: 700,
  fontSize: "20pt",
  marginBottom: "0.5cm",
};

// Section Title (i.e. Summary, Risk Description)
export const h4Style = {
  fontFamily: "NH",
  fontWeight: 700,
  color: NCCN_GREEN,
  fontSize: "16pt",
  marginBottom: "0.5cm",
};

// Subsection Title (i.e description, definition, probability analysis)
export const h5Style = {
  fontFamily: "NH",
  fontSize: "11pt",
  fontWeight: 500,
  // lineHeight: "1.5pt",
  color: BLACK,
  marginTop: "5pt",
  marginBottom: "5pt",
};

// Subsubsection Title (i.e. Human impact)
export const h6Style = {
  marginTop: "5pt",
  fontFamily: "NH",
  fontWeight: 300,
  color: BLACK,
  fontSize: "11pt",
};

export const bodyStyle = {
  fontFamily: "NH",
  fontSize: "10pt",
  fontWeight: 300,
  lineHeight: "1.5pt",
  color: BLACK,
  marginBottom: "5pt",
};

export const boldStyle = {
  fontWeight: 500,
};

const fixText = (txt: string) => {
  return txt.replaceAll("&#39;", "'");
};

// html string should start with opening tag <...>
const parseTag = (html: string): HTMLTag => {
  let currentHtml = html.replace(/<br>/g, "").replace(/<br\/>/g, "");
  let currentTagEnd = currentHtml.slice(1).indexOf(">") + 1;
  let nextTagStart = currentHtml.slice(1).indexOf("<") + 1;

  if (nextTagStart < 0) throw new Error("No closing tag found");

  const nestedTags = [];

  while (currentHtml[nextTagStart + 1] !== "/") {
    // Check if there is plain text before next nested tag
    if (currentTagEnd + 1 !== nextTagStart) {
      nestedTags.push({
        tagName: "span",
        tagOptions: null,
        content: currentHtml.slice(currentTagEnd + 1, nextTagStart),
        size: nextTagStart - currentTagEnd - 1,
      });

      currentHtml =
        currentHtml.slice(0, currentTagEnd + 1) +
        currentHtml.slice(nextTagStart);
      nextTagStart = currentTagEnd + 1;
    }

    // This tag contains nested tags, process these first
    const nestedTag = parseTag(currentHtml.slice(nextTagStart));
    nestedTags.push(nestedTag);

    currentHtml =
      currentHtml.slice(0, nextTagStart) +
      currentHtml.slice(nextTagStart + nestedTag.size);
    nextTagStart = currentHtml.slice(1).indexOf("<") + 1;

    if (nextTagStart < 0) throw new Error("No closing tag found");
  }

  let closingTagIndex = currentHtml.indexOf("</");

  const tagNameEnd = Math.min(
    currentHtml.indexOf(" ") < 0 ? 1000000000 : currentHtml.indexOf(" "),
    currentHtml.indexOf(">") < 0 ? 1000000000 : currentHtml.indexOf(">")
  );
  const tagName = currentHtml.slice(1, tagNameEnd);

  const contentIndex = currentHtml.indexOf(">") + 1;
  const content = currentHtml.slice(contentIndex, closingTagIndex);

  if (nestedTags.length > 0) {
    if (content.trim() !== "") {
      nestedTags.push({
        tagName: "span",
        tagOptions: null,
        content: content,
        size: content.length,
      });

      currentHtml =
        currentHtml.slice(0, currentTagEnd + 1) +
        currentHtml.slice(currentTagEnd + 1 + content.length);
      closingTagIndex = currentHtml.indexOf("</");
    }
  }

  const tagOptions =
    currentHtml[tagNameEnd] === ">"
      ? null
      : currentHtml.slice(tagNameEnd + 1, contentIndex - 1);

  const size =
    nestedTags.reduce((t, i) => t + i.size, 0) +
    closingTagIndex +
    currentHtml.slice(closingTagIndex).indexOf(">") +
    1;

  //   console.log("Parsed tag:", tagName, " with size", size);

  return {
    tagName,
    tagOptions,
    content: nestedTags.length > 0 ? nestedTags : content,
    size,
  };
};

const tag2PDF = (
  tag: HTMLTag,
  parent: HTMLTag | null,
  section: Section
): ReactElement | null => {
  if (tag.content === "") return null;

  let styles = {} as any;

  if (parent === null) {
    styles = { ...styles, ...bodyStyle };
  }

  if (typeof tag.content === "string") {
    if (tag.tagName === "strong") {
      if (tag.content.indexOf("margin of error") < 0) {
        styles = { ...styles, ...boldStyle };
      }
    } else if (tag.tagName === "span") {
      // styles = bodyStyle;
    } else if (tag.tagName === "a") {
      // styles = bodyStyle;
    }

    return (
      <Text style={styles} debug={false}>
        {fixText(tag.content as string)}
      </Text>
    );
  }

  if (tag.tagName === "p") {
    let styles = { ...bodyStyle } as any;

    if (
      tag.content.length <= 1 &&
      tag.content[0].tagName === "strong" &&
      section === "summary"
    ) {
      styles = { ...h5Style };
    }

    if (section === "analysis") {
      // Empty line (for spacing?)
      if (
        tag.content.some(
          (s) =>
            typeof s.content === "string" &&
            s.content.indexOf("of total impact") >= 0
        ) ||
        (tag.content.length === 1 && tag.content[0].content === " ")
      ) {
        styles = { ...styles, marginTop: "-8pt", fontSize: "8pt" };
      }

      // Empty line (for spacing?)
      if (
        tag.content.some(
          (s) =>
            typeof s.content === "string" &&
            s.content.indexOf("fall within the margin of error") >= 0
        ) ||
        (tag.content.length === 1 && tag.content[0].content === " ")
      ) {
        styles = {
          ...styles,
          ...h5Style,
          fontSize: "8pt",
          marginBottom: "0pt",
        };
      }

      // Risk file title
      if (
        tag.content.length === 1 &&
        tag.content[0].tagName === "strong" &&
        tag.content[0].content.length === 2
      ) {
        styles = { ...styles, textDecoration: "underline" };
      }
    }

    if (tag.content.length <= 0) {
      return null;
    }

    return (
      <Text style={styles} debug={false}>
        {tag.content.map((e) => tag2PDF(e, tag, section))}
      </Text>
    );
  }

  if (tag.tagName === "ol") {
    return (
      <View style={{ marginLeft: "10pt" }}>
        {tag.content.map((li, i) => (
          <View style={{ flexDirection: "row" }} wrap={false}>
            <Text style={{ ...bodyStyle, width: "0.5cm" }}>{i + 1}.</Text>
            <Text style={{ ...bodyStyle, flex: 1 }} debug={false}>
              {(li.content as HTMLTag[]).map((e) => tag2PDF(e, tag, section))}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <Text style={{}}>{tag.content.map((e) => tag2PDF(e, tag, section))}</Text>
  );
};

export default function html2PDF(
  html: string | null,
  section: Section
): (ReactElement | null)[] {
  if (html === null) return [null];

  const parsed = parseTag(`<div>${html}</div>`);
  // console.log(html, parsed);
  // console.log(parsed, (parsed.content as HTMLTag[]).map(e => tag2PDF(e)).filter(e=>e!==null))

  return (parsed.content as HTMLTag[])
    .map((e) => tag2PDF(e, null, section))
    .filter((e) => e !== null);
}
