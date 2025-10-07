export type SerializedChangeDiff = string & {
  __json_seralized: ChangeDiff[];
};

export type ChangeDiff = {
  property: string;
  originalValue: string | number | null;
  newValue: string | number | null;
};

export function serializeChangeLogDiff(
  quanti: ChangeDiff[]
): SerializedChangeDiff {
  return JSON.stringify(quanti) as SerializedChangeDiff;
}

export function parseChangeLogDiff(quanti: SerializedChangeDiff): ChangeDiff[] {
  return JSON.parse(quanti) as ChangeDiff[];
}

export type DVChangeLogDiffType = unknown | SerializedChangeDiff | ChangeDiff;

export interface DVChangeLog<
  ChangeDiffType extends DVChangeLogDiffType = SerializedChangeDiff,
  ContactType = unknown
> {
  cr4de_bnravalidationid: string;

  // Bind value for update only
  "cr4de_changed_by@odata.bind": string | null | undefined;
  cr4de_changed_by: ContactType;
  _cr4de_changed_by_value: string;

  cr4de_changed_object_type: "RISK_FILE" | "CASCADE" | "ATTACHMENT";
  cr4de_changed_object_id: string;

  cr4de_diff: ChangeDiffType;

  createdon: Date;
  modifiedon: Date;
}
