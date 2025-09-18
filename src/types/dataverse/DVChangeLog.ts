export type SerializedChangeDiff<T = unknown> = string & {
  __json_seralized: ChangeDiff<T>;
};

export type ChangeDiff<T = unknown> = {
  original_fields: T;
  new_fields: T;
};

export type DVChangeLogDiffType = unknown | SerializedChangeDiff | ChangeDiff;

export interface DVChangeLog<
  ChangeDiffType extends DVChangeLogDiffType = ChangeDiff,
  ContactType = unknown
> {
  cr4de_bnravalidationid: string;

  cr4de_changed_by: ContactType;
  _cr4de_changed_by_value: string;

  cr4de_changed_object_type: "RISK_FILE" | "CASCADE" | "ATTACHMENT";
  cr4de_changed_object_id: string;

  cr4de_diff: ChangeDiffType;

  createdon: Date;
  modifiedon: Date;
}
