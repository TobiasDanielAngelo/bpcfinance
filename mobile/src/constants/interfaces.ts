import { prop } from "mobx-keystone";

export type CalendarView = "week" | "month" | "year" | "decade";

export type PropsToInterface<P> = {
  [K in keyof P]?: P[K] extends ReturnType<typeof prop<infer T>> ? T : never;
};

export type InterfaceToProps<T> = {
  [K in keyof T]: ReturnType<typeof prop<T[K]>>;
};

export interface KV<U extends Record<string, any>> {
  key: string;
  values: U[];
  label: keyof U;
}

export const graphTypes = ["pie", "line", "bar", "area"] as const;

export type GraphType = (typeof graphTypes)[number];

export type ActionModalDef = {
  icon: string;
  label: string;
  name: string;
  modal: React.ReactNode;
};

export interface ItemDetailsProps<T> {
  item: T;
  shownFields?: (keyof T)[];
  header?: (keyof T)[];
  important?: (keyof T)[];
  prices?: (keyof T)[];
  showMore?: boolean;
  setShowMore?: StateSetter<boolean>;
  itemMap?: KV<any>[];
}

export interface Option {
  id: number | string;
  name: string;
}

export type Page = {
  title: string;
  link?: string;
  selected?: boolean;
  onPress?: () => void;
  hidden?: boolean;
  children?: Page[];
};

export type Field = {
  name: string;
  label: string;
  type: string;
  options?: Option[];
  function?: (t: any) => any;
  centered?: boolean;
  infoType?: string;
};

export type MySpeedDialProps = {
  icon: string;
  name: string;
  onPress?: () => void;
  hidden?: boolean;
};

export type CalendarEvent = {
  id: string | number;
  title: string;
  dateStart: string;
  dateEnd?: string;
  dateCompleted?: string;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
  currentPage: number;
  totalPages: number;
  ids: number[];
};

export type PaginatedDetails = Omit<PaginatedResponse<unknown>, "results">;

export type Graph = "line" | "pie";

export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export type KeyboardCodes =
  | `Digit${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
  | `Numpad${
      | 0
      | 1
      | 2
      | 3
      | 4
      | 5
      | 6
      | 7
      | 8
      | 9
      | "Decimal"
      | "Enter"
      | "Multiply"
      | "Divide"
      | "Add"
      | "Subtract"}`
  | `F${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`
  | `Arrow${"Up" | "Down" | "Left" | "Right"}`
  | `Key${
      | "A"
      | "B"
      | "C"
      | "D"
      | "E"
      | "F"
      | "G"
      | "H"
      | "I"
      | "J"
      | "K"
      | "L"
      | "M"
      | "N"
      | "O"
      | "P"
      | "Q"
      | "R"
      | "S"
      | "T"
      | "U"
      | "V"
      | "W"
      | "X"
      | "Y"
      | "Z"}`
  | `${"Alt" | "Bracket" | "Control" | "Shift" | "Meta"}${
      | ""
      | "Left"
      | "Right"}`
  | "Backquote"
  | "Quote"
  | "Backslash"
  | "Slash"
  | "Backspace"
  | "Space"
  | `${"Caps" | "Num" | "Scroll"}Lock`
  | "Comma"
  | "ContextMenu"
  | "Enter"
  | "Insert"
  | "Equal"
  | "Escape"
  | "Minus"
  | "Period"
  | "Semicolon"
  | "Tab";

export type ViewFields<T> = Record<
  `${"datetime" | "date" | "time" | "prices"}Fields`,
  (keyof T)[]
>;

// Unused yet
export type DjangoField =
  | "ID"
  | "AmountField"
  | "DecimalField"
  | "LongCharField"
  | "MediumCharField"
  | "ShortCharField"
  | "ColorField"
  | "AutoCreatedAtField"
  | "AutoUpdatedAtField"
  | "DefaultNowField"
  | "DefaultTodayField"
  | "OptionalDateTimeField"
  | "OptionalDateField"
  | "ChoiceIntegerField"
  | "DefaultBooleanField"
  | "OptionalLimitedTimeField"
  | "ForeignKey"
  | "CascadeRequiredForeignKey"
  | "CascadeOptionalForeignKey"
  | "SetNullOptionalForeignKey"
  | "ManyToManyField"
  | "OptionalManyToManyField"
  | "OneToOneField"
  | "OptionalOneToOneField"
  | "OptionalSetNullOneToOneField"
  | "OptionalEmailField"
  | "OptionalURLField"
  | "LimitedDecimalField"
  | "OptionalLimitedDecimalField"
  | "StringArrayField"
  | "NumberArrayField"
  | "ChoicesStringArrayField"
  | "ChoicesNumberArrayField"
  | "FileField";

// Unused yet
export type JsType =
  | "number"
  | "number[]"
  | "number | null"
  | "number[] | null"
  | "string"
  | "string[]"
  | "boolean"
  | "string | null"
  | "string[] | null"
  | "File | null";

// Unused yet
export const djangoToJsType: Record<DjangoField, JsType> = {
  ID: "number",
  AmountField: "number",
  DecimalField: "number",
  LongCharField: "string",
  MediumCharField: "string",
  ShortCharField: "string",
  ColorField: "string",
  AutoCreatedAtField: "string",
  AutoUpdatedAtField: "string",
  DefaultNowField: "string",
  DefaultTodayField: "string",
  OptionalDateTimeField: "string | null",
  OptionalDateField: "string | null",
  ChoiceIntegerField: "number",
  DefaultBooleanField: "boolean",
  OptionalLimitedTimeField: "string | null",
  ForeignKey: "number",
  CascadeRequiredForeignKey: "number",
  CascadeOptionalForeignKey: "number | null",
  SetNullOptionalForeignKey: "number",
  ManyToManyField: "number[]",
  OptionalManyToManyField: "number[] | null",
  OneToOneField: "number",
  OptionalOneToOneField: "number | null",
  OptionalSetNullOneToOneField: "number | null",
  OptionalEmailField: "string",
  OptionalURLField: "string",
  LimitedDecimalField: "number",
  OptionalLimitedDecimalField: "number",
  StringArrayField: "string[]",
  NumberArrayField: "number[]",
  ChoicesStringArrayField: "string[]",
  ChoicesNumberArrayField: "number[]",
  FileField: "File | null",
};

type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

type NumberRange<F extends number, T extends number> =
  | Exclude<Enumerate<T>, Enumerate<F>>
  | F;

export type Numbers<T extends number> = NumberRange<0, T>;
