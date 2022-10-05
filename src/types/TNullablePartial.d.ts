export type TNullablePartial<T> = { [P in keyof T]?: T[P] | null };
