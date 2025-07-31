import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSearchParams } from "react-router-native";
import {
  camelToSnakeCase,
  decodeShortParam,
  generateShortParam,
  getMonthName,
  toOptions,
  toTitleCase,
} from "../../constants/helpers";
import { Field } from "../../constants/interfaces";
import { MyButton } from "../MyButton";
import { MyDateTimePicker } from "../MyDateTimePicker";
import { MyInput } from "../MyInput";
import { MyMultiDropdownSelector } from "../MyMultiDropdownSelector";

const getInitialDetails = (fields: Field[][]) =>
  fields.flat().reduce<Record<string, string>>((acc, { name }) => {
    acc[name] = "";
    return acc;
  }, {});

const parseMultiValue = (val: string) =>
  val ? val.split(",").map(Number) : [];

const formatMultiValue = (val: number[]) => val.join(",");

const renderField = (
  field: Field,
  value: any,
  onChangeValue: (val: string) => void
) => {
  const commonProps = {
    label: field.label,
    value,
  };

  switch (field.type) {
    case "number":
    case "text":
      return (
        <MyInput
          {...commonProps}
          key={field.name}
          onChangeValue={onChangeValue}
          value={value ?? ""}
        />
      );
    case "check":
      return (
        <MyMultiDropdownSelector
          {...commonProps}
          key={field.name}
          options={toOptions(["No", "Yes"])}
          value={parseMultiValue(value)}
          onChangeValue={(u) =>
            onChangeValue(
              formatMultiValue((u as (string | number)[]).map(Number))
            )
          }
        />
      );
    case "date":
    case "time":
    case "datetime":
      return (
        <View key={field.name}>
          <MyDateTimePicker
            {...commonProps}
            isDateOnly={["date", "month"].includes(field.type)}
            isTimeOnly={field.type === "time"}
            onChangeValue={(u) =>
              onChangeValue(
                field.type === "date"
                  ? moment(u).format("YYYY-MM-DD")
                  : moment(u).toISOString()
              )
            }
          />
        </View>
      );
    case "year":
      return (
        <MyMultiDropdownSelector
          {...commonProps}
          key={field.name}
          options={Array.from({ length: 51 }, (_, i) => ({
            id: 2000 + i,
            name: String(2000 + i),
          }))}
          value={parseMultiValue(value)}
          onChangeValue={(u) =>
            onChangeValue(
              formatMultiValue((u as (string | number)[]).map(Number))
            )
          }
        />
      );
    case "month":
      return (
        <MyMultiDropdownSelector
          {...commonProps}
          key={field.name}
          options={Array.from({ length: 12 }, (_, i) => ({
            id: i + 1,
            name: getMonthName(i),
          }))}
          value={parseMultiValue(value)}
          onChangeValue={(u) =>
            onChangeValue(
              formatMultiValue((u as (string | number)[]).map(Number))
            )
          }
        />
      );
    case "day":
      return (
        <MyMultiDropdownSelector
          {...commonProps}
          key={field.name}
          options={Array.from({ length: 31 }, (_, i) => ({
            id: i + 1,
            name: String(i + 1),
          }))}
          value={parseMultiValue(value)}
          onChangeValue={(u) =>
            onChangeValue(
              formatMultiValue((u as (string | number)[]).map(Number))
            )
          }
        />
      );
    default:
      return (
        <View key={field.name}>
          <Text>{field.label}</Text>
        </View>
      );
  }
};

export const MyFilter = observer(({ fields }: { fields: Field[][] }) => {
  const [details, setDetails] = useState(getInitialDetails(fields));
  const [params, setParams] = useSearchParams();

  const onChangeValue = (val: string, name: string) => {
    setDetails({ ...details, [name]: val });
  };

  const onPressFilter = () => {
    if (
      !Object.entries(details).filter(([_, v]) => v != null && v !== "").length
    ) {
      setParams("");
      return;
    }

    const filtered = Object.fromEntries(
      Object.entries(details).filter(([_, v]) => v != null && v !== "")
    );
    setParams("q=" + generateShortParam(filtered));
  };

  const onPressReset = () => {
    setDetails(getInitialDetails(fields));
    setParams("");
  };

  useEffect(() => {
    if (params.size) {
      setDetails(decodeShortParam(params.toString().replace("q=", "")));
    }
  }, [params.size]);

  return (
    <View style={{ width: 300 }}>
      {fields.map((row, i) => (
        <View key={i}>
          {row.map((field) =>
            renderField(field, details[field.name], (val) =>
              onChangeValue(val, field.name)
            )
          )}
        </View>
      ))}

      <View>
        <MyButton onPress={onPressFilter} label="Filter Results" />
      </View>
    </View>
  );
});

type Props<T extends Record<string, any>> = {
  view: T;
  title?: string;
  setVisible?: (t: boolean) => void;
  dateFields?: (keyof T)[];
  excludeFields?: (keyof T)[];
  relatedFields?: (keyof T)[];
  optionFields?: (keyof T)[];
};

export const MyGenericFilter = <T extends Record<string, any>>({
  view,
  title = "Filters",
  dateFields = [],
  excludeFields = [],
  relatedFields = [],
  optionFields = [],
}: Props<T>) => {
  const [shownFields, setShownFields] = useState([
    ...Object.keys(view),
    ...optionFields.map((f) => f as string),
  ]);

  const fields: Field[][] = Object.entries(view).flatMap(([key, value]) => {
    if (excludeFields.includes(key) || !shownFields.includes(key)) return [];

    const baseName = camelToSnakeCase(key, relatedFields.includes(key));
    const label = toTitleCase(key);

    if (typeof value === "string") {
      if (dateFields.includes(key)) {
        return [
          [
            {
              name: `${baseName}`,
              label: `${label}`,
              type: "",
            },
          ],
          [
            {
              name: `${baseName}__gte`,
              label: `Start`,
              type: "date",
            },
            {
              name: `${baseName}__lte`,
              label: `End`,
              type: "date",
            },
          ],
        ];
      } else {
        return [
          [
            {
              name: `${baseName}__search`,
              label: `${label} Search`,
              type: "text",
            },
          ],
        ];
      }
    }

    if (typeof value === "number") {
      return [
        [
          {
            name: `${baseName}__gte`,
            label: `${label} ≥`,
            type: "number",
          },
          {
            name: `${baseName}`,
            label: `${label} =`,
            type: "number",
          },
          {
            name: `${baseName}__lte`,
            label: `${label} ≤`,
            type: "number",
          },
        ],
      ];
    }

    if (typeof value === "boolean") {
      return [
        [
          {
            name: `${baseName}__in`,
            label: `${label}?`,
            type: "check",
          },
        ],
      ];
    }

    return [];
  });

  const moreFields = optionFields.map((s) => [
    {
      name: `${camelToSnakeCase(s as string)}__search`,
      label: `${toTitleCase(s as string)} Search`,
      type: "text",
    },
  ]) satisfies Field[][];

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <Text>{title}</Text>

      <MyFilter fields={[...fields, ...moreFields]} />
    </ScrollView>
  );
};
