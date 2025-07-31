import { observer } from "mobx-react-lite";
import { Text, View, StyleSheet } from "react-native";
import { toRomanWithExponents, toTitleCase } from "../constants/helpers";
import { ItemDetailsProps } from "../constants/interfaces";
import { formatValue } from "../constants/JSXHelpers";
import { isWideScreen } from "../constants/constants";

const secStyles = StyleSheet.create({
  header: {
    fontSize: 14,
    flexDirection: "row",
  },
  important: {
    fontSize: 30,
    fontWeight: "bold",
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  body: {
    fontSize: 18,
    paddingHorizontal: 28,
  },
});

const sectionStyles: Record<string, any> = {
  Header: secStyles.header,
  Important: secStyles.important,
  Body: secStyles.body,
};

export const ItemDetails = observer(
  <T extends Record<string, any>>({
    item,
    shownFields = [],
    header = [],
    important = [],
    prices = [],
    showMore,
    itemMap = [],
  }: ItemDetailsProps<T>) => {
    const itemView = item.$view ?? item;

    const allItemKeys = [
      ...new Set(Object.keys(itemView).filter((s) => !s.includes("$"))),
    ] as (keyof T)[];

    const sections = [
      { title: "Header", keys: header },
      { title: "Important", keys: important },
      {
        title: "Body",
        keys: allItemKeys.filter(
          (key) => !header.includes(key) && !important.includes(key)
        ),
      },
    ];

    const renderRow = (key: keyof T, title: string) => {
      const value = item[key];
      const kv = itemMap?.find((s) => s.key === key);
      const keyTitle = key === "id" ? "ID" : toTitleCase(key as string);
      const body =
        key === "id"
          ? toRomanWithExponents(value)
          : formatValue(value, String(key), prices as string[], kv);

      if (body === "—") return <View key={String(key)} />;
      return (
        <View key={String(key)} style={styles.container}>
          {title === "Body" && <Text style={styles.keyTitle}>{keyTitle}</Text>}
          <Text style={[styles.body, sectionStyles[title]]}>{body}</Text>
        </View>
      );
    };

    return (
      <>
        {sections.map(({ title, keys }) => (
          <View key={title} style={sectionStyles[title] || {}}>
            {keys
              // .filter((key) => shownFields.includes(key) || showMore)
              .map((key) => renderRow(key, title))}
          </View>
        ))}
      </>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: isWideScreen ? "row" : "column",
  },
  keyTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  body: {
    paddingLeft: 12,
    flexWrap: "wrap",
  },
});
