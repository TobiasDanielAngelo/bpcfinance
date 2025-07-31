import { StyleSheet, View } from "react-native";
import { MyIcon } from "./MyIcon";

export const MyCheckBox = (props: {
  hidden?: boolean;
  label?: string;
  value?: boolean;
  onChangeValue?: (val: boolean) => void;
  msg?: string;
}) => {
  const { hidden, value, onChangeValue, label } = props;

  return (
    !hidden && (
      <View style={styles.main}>
        <MyIcon
          icon={value ? "check" : "square"}
          onPress={() => onChangeValue?.(!value)}
          label={label}
        />
      </View>
    )
  );
};
const styles = StyleSheet.create({
  checkbox: {
    alignSelf: "center",
  },
  main: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
});
