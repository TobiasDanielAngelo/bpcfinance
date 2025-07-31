import moment from "moment";
import { View } from "react-native";
import { isDatetimeValue, isDateValue, prettifyJSON, toMoney } from "./helpers";
import { KV } from "./interfaces";

function paragraphWrapper(t: string, maxLen = 80): string {
  const words = t.split(" ");
  let line = "";
  const lines: string[] = [];

  for (const word of words) {
    if ((line + word).length > maxLen) {
      lines.push(line.trim());
      line = "";
    }
    line += word + " ";
  }

  if (line) lines.push(line.trim());
  return lines.join("\n");
}

export const formatValue = (
  value: any,
  key: string,
  prices?: string[],
  kv?: KV<any>,
  arrayIsInfinite?: boolean
) => {
  const formatList = (
    value: Date[],
    formatStr: string,
    suffixLabel: string
  ): string => {
    const list = value
      .slice(0, 3)
      .map((s) => moment(s).format(formatStr))
      .join("\n");

    const remaining = value.length - 4;
    const suffix = arrayIsInfinite
      ? `${suffixLabel}ad infinitum...`
      : value.length > 4
      ? `${suffixLabel}and ${remaining} more...`
      : "";

    const finalDate =
      !arrayIsInfinite && value.length > 3
        ? `\nup to ${moment(value[value.length - 1]).format(formatStr)}`
        : "";

    return list + "\n" + suffix + finalDate;
  };

  const fileExtensionRegex = /\.(jpg|jpeg|png|gif|pdf|docx?|xlsx?|txt)$/i;
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i;

  if (kv) {
    const lookup = (val: any) =>
      kv.label === ""
        ? kv.values.find((_, i) => i === val)
        : kv.values.find((v) => v.id === val)?.[kv.label] ?? "—";

    return Array.isArray(value) ? value.map(lookup).join(",") : lookup(value);
  }
  if (prices?.includes(key)) return toMoney(value);

  if (value instanceof File) {
    const url = URL.createObjectURL(value);
    return `⬇️ Download ${value.name}`;
  } else if (value instanceof Blob) {
    const url = URL.createObjectURL(value);
    return <View>⬇️ Download file</View>;
  } else if (typeof value === "string" && value.match(fileExtensionRegex)) {
    return "🔗 Link";
  }

  if (typeof value === "boolean") {
    return value ? "✅ Yes" : "❌ No";
  }
  if (Array.isArray(value) && value.length > 0) {
    if (isDatetimeValue(value[0])) {
      return formatList(value, "MMM D, YYYY h:mm A", " ");
    }
    if (isDateValue(value[0])) {
      return formatList(value, "MMM D, YYYY", "and ");
    } else {
      return value.join(", ");
    }
  } else {
    if (isDatetimeValue(value)) {
      return moment(value).format("MMM D, YYYY h:mm A");
    }
    if (isDateValue(value)) {
      return moment(value).format("MMM D, YYYY");
    }
  }

  return value && value !== "—"
    ? prettifyJSON(paragraphWrapper(String(value))) || "—"
    : "—";
};
