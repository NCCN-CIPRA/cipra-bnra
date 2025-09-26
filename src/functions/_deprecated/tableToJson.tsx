export default function tableToJson(tableString?: string) {
  if (!tableString) return null;

  const rows = tableString
    .replace(/<table>/g, "")
    .replace(/<\/table>/g, "")
    .replace(/<\/tr>/g, "")
    .replace("<tr>", "")
    .split("<tr>");

  const table = rows.map((r) =>
    r
      .replace(/<\/td>/g, "")
      .replace("<td>", "")
      .split("<td>")
  );

  return table;
}
