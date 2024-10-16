import { Text, View } from "@react-pdf/renderer";
import { ReactElement } from "react";
import { NCCN_GREEN } from "./colors";

const BLACK = "#231F20";

type HTMLTag = { tagName: string; tagOptions: string | null; content: string | HTMLTag[]; size: number };

// html string should start with opening tag <...>
const parseTag = (html: string): HTMLTag => {
  let currentHtml = html.replace(/<br>/g, "").replace(/<br\/>/g, "");
  let nextTagStart = currentHtml.slice(1).indexOf("<") + 1;

  if (nextTagStart < 0) throw new Error("No closing tag found");

  const nestedTags = [];

  while (currentHtml[nextTagStart + 1] !== "/") {
    // console.log(nextTagStart, currentHtml);
    // This tag contains nested tags, process these first
    const nestedTag = parseTag(currentHtml.slice(nextTagStart));
    nestedTags.push(nestedTag);

    currentHtml = currentHtml.slice(0, nextTagStart) + currentHtml.slice(nextTagStart + nestedTag.size);
    nextTagStart = currentHtml.slice(1).indexOf("<") + 1;
    if (nextTagStart < 0) throw new Error("No closing tag found");
  }

  const closingTagIndex = currentHtml.indexOf("</");

  const tagNameEnd = currentHtml.indexOf(" ") >= 0 ? currentHtml.indexOf(" ") : currentHtml.indexOf(">");
  const tagName = currentHtml.slice(1, tagNameEnd);

  const contentIndex = currentHtml.indexOf(">") + 1;
  const content = currentHtml.slice(contentIndex, closingTagIndex);

  const tagOptions = currentHtml[tagNameEnd] === ">" ? null : currentHtml.slice(tagNameEnd + 1, contentIndex - 1);

  const size =
    nestedTags.reduce((t, i) => t + i.size, 0) + closingTagIndex + currentHtml.slice(closingTagIndex).indexOf(">") + 1;

  //   console.log("Parsed tag:", tagName, " with size", size);

  return { tagName, tagOptions, content: nestedTags.length > 0 ? nestedTags : content, size };
};

const tag2PDF = (tag: HTMLTag): ReactElement | null => {
  if (tag.content === "") return null;

  if (typeof tag.content === "string")
    return <Text style={{ fontFamily: "Arial", fontWeight: 400, color: BLACK, fontSize: "16pt" }}>{tag.content}</Text>;

  if (tag.tagName === "p" && tag.content[0] && tag.content[0].tagName === "strong")
    return (
      <View style={{ marginTop: "15pt", width: "8cm" }}>
        <Text style={{ fontFamily: "NH", fontWeight: 700, color: NCCN_GREEN, fontSize: "16pt" }}>
          {tag.content[0].content as string}
        </Text>
      </View>
    );

  if (tag.tagName === "p" && tag.content[0] && tag.content[0].tagName === "span")
    return (
      <View style={{ marginTop: "15pt", width: "8cm" }}>
        <Text style={{ fontFamily: "NH", fontWeight: 300, lineHeight: "1.5pt", color: BLACK, fontSize: "11pt" }}>
          {tag.content[0].content as string}
        </Text>
      </View>
    );

  return null;
};

export default function html2PDF(html: string | null): (ReactElement | null)[] {
  if (html === null) return [null];

  const parsed = parseTag(`<div>${html}</div>`);

  return (parsed.content as HTMLTag[]).map(tag2PDF);
}
