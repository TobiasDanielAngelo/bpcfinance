import { StyleSheet, View } from "react-native";
import { Menu, MenuCard } from "./MenuCard";

export const MenuBar = (props: { items: Menu[]; hidden?: boolean }) => {
  const { items, hidden } = props;
  return (
    !hidden && (
      <View style={styles.main}>
        {items.map((s, ind) => (
          <MenuCard {...s} key={ind} />
        ))}
      </View>
    )
  );
};

const styles = StyleSheet.create({
  main: {
    minHeight: 20,
    maxHeight: "15%",
    backgroundColor: "gainsboro",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
