import { Text, View } from "@react-pdf/renderer";
import { ReactElement } from "react";
import { BLACK } from "./colors";
import { Style } from "@react-pdf/types";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import {
  bodyStyle,
  boldStyle,
  h5Style,
  POINTS_PER_CM,
  SCALE,
  smallStyle,
  italicStyle,
} from "../components/export/styles";
import { DVRiskSummary } from "../types/dataverse/DVRiskSummary";
import { DVRiskSnapshot } from "../types/dataverse/DVRiskSnapshot";

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

const fixText = (txt: string) => {
  return txt
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&");
};

// html string should start with opening tag <...>
const parseTag = (html: string): HTMLTag => {
  let currentHtml = html.replace(/<br>/g, "").replace(/<br\/>/g, "");
  const currentTagEnd = currentHtml.slice(1).indexOf(">") + 1;
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

  let styles = {} as Style;

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
    } else if (tag.tagName === "ref") {
      return <Text style={[bodyStyle, italicStyle]}> ({tag.content})</Text>;
    }

    return (
      <Text style={styles} debug={false}>
        {fixText(tag.content as string)}
      </Text>
    );
  }

  if (tag.tagName === "p") {
    let styles = { ...bodyStyle } as Style;

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
            (s.content.indexOf("of total impact") >= 0 ||
              s.content.indexOf("of total probability") >= 0)
        ) ||
        (tag.content.length === 1 && tag.content[0].content === " ")
      ) {
        styles = { ...styles, marginTop: -8 * SCALE, ...smallStyle };
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
          fontSize: 8 * SCALE,
          marginBottom: "0pt",
        };
      }

      // Risk file title
      if (
        (tag.content.length === 1 &&
          tag.content[0].tagName === "strong" &&
          tag.content[0].content.length === 2 &&
          typeof tag.content[0].content[1] !== "string" &&
          tag.content[0].content[1].tagName === "a") ||
        (tag.content.length === 2 &&
          tag.content[0].tagName === "strong" &&
          tag.content[1].tagName === "strong" &&
          tag.content[1].content.length === 1 &&
          typeof tag.content[1].content[0] !== "string" &&
          tag.content[1].content[0].tagName === "a")
      ) {
        tag.content[0].tagName = "span";
        styles = { ...styles, textDecoration: "underline" };
      }
    }

    if (
      tag.content.length <= 0 ||
      (tag.content.length === 1 &&
        typeof tag.content[0].content === "string" &&
        tag.content[0].content.trim() === "")
    ) {
      return null;
    }

    // Risk file titles in probability section
    if (
      tag.content[0].tagName === "strong" &&
      typeof tag.content[0].content !== "string" &&
      tag.content[0].content.some(
        (s) =>
          typeof s.content === "string" &&
          s.content.indexOf("of total probability)") >= 0
      )
    ) {
      if (typeof tag.content[0].content[2].content !== "string")
        return <Text>Error</Text>;

      const percIndex = tag.content[0].content[2].content.indexOf("%");
      const percPart = tag.content[0].content[2].content.slice(
        0,
        percIndex + 1
      );
      const otherPart = tag.content[0].content[2].content.slice(percIndex + 1);

      return (
        <>
          {tag2PDF(
            {
              ...tag,
              content: [
                {
                  ...tag.content[0],
                  content: tag.content[0].content.slice(0, 2),
                },
              ],
            },
            parent,
            section
          )}
          {tag2PDF(
            {
              tagName: "p",
              size: 1,
              tagOptions: "",
              content: [
                {
                  ...tag.content[0].content[2],
                  tagName: "strong",
                  content: percPart
                    .replaceAll("(", "")
                    .replaceAll(")", "")
                    .trim(),
                },
                {
                  ...tag.content[0].content[2],
                  content:
                    " " +
                    otherPart.replaceAll("(", "").replaceAll(")", "").trim(),
                },
              ],
            },
            parent,
            section
          )}
        </>
      );
    }

    return (
      <Text style={styles} debug={false}>
        {tag.content.map((e) => tag2PDF(e, tag, section))}
      </Text>
    );
  }

  if (tag.tagName === "ol") {
    return (
      <View style={{ marginLeft: 10 * SCALE }}>
        {tag.content.map((li, i) => (
          <View key={i} style={{ flexDirection: "row" }} wrap={false}>
            <Text style={{ ...bodyStyle, width: 0.5 * POINTS_PER_CM }}>
              {i + 1}.
            </Text>
            {typeof li.content === "string" ? (
              <Text style={{ ...bodyStyle, flex: 1 }} debug={false}>
                {li.content}
              </Text>
            ) : (
              <Text style={{ ...bodyStyle, flex: 1 }} debug={false}>
                {(li.content as HTMLTag[]).map((e) => tag2PDF(e, tag, section))}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  }

  if (tag.tagName === "ul") {
    return (
      <View style={{ marginLeft: 10 * SCALE }}>
        {tag.content.map((li, i) => (
          <View key={i} style={{ flexDirection: "row" }} wrap={false}>
            <View
              style={{
                backgroundColor: BLACK,
                borderTopLeftRadius: "100%",
                borderTopRightRadius: "100%",
                borderBottomLeftRadius: "100%",
                borderBottomRightRadius: "100%",
                marginTop: 3 * SCALE,
                marginRight: 6 * SCALE,
                width: 3 * SCALE,
                height: 3 * SCALE,
              }}
            />
            {typeof li.content === "string" ? (
              <Text style={{ ...bodyStyle, flex: 1 }} debug={false}>
                {li.content}
              </Text>
            ) : (
              <Text style={{ ...bodyStyle, flex: 1 }} debug={false}>
                {(li.content as HTMLTag[]).map((e) => tag2PDF(e, tag, section))}
              </Text>
            )}
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
  section: Section,
  riskFile: DVRiskFile | DVRiskSummary | DVRiskSnapshot
): (ReactElement | null)[] {
  if (html === null) return [null];

  const parsed = parseTag(
    `<div>${html.replace(
      / ?<a href="#ref-\d+" .*?>\((\d+)\)<\/a>/g,
      `<ref>${riskFile.cr4de_hazard_id}-$1</ref>`
    )}</div>`
  );
  // console.log(html, parsed);
  // console.log(parsed, (parsed.content as HTMLTag[]).map(e => tag2PDF(e)).filter(e=>e!==null))

  return (parsed.content as HTMLTag[])
    .map((e) => tag2PDF(e, null, section))
    .filter((e) => e !== null);
}
