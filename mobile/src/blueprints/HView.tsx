import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

export const HView = (props: PropsWithChildren<{ hidden?: boolean }>) => {
  const { hidden, children } = props;

  return !hidden && <View style={styles.main}>{children}</View>;
};

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
