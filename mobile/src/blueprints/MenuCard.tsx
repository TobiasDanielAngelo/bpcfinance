import { StyleSheet, TouchableOpacity } from "react-native";
import { MyIcon } from "./MyIcon";

export type Menu = {
  name: string;
  label: string;
  onPress: () => void;
  selected?: boolean;
};

export const MenuCard = (props: Menu) => {
  const { name, label, selected, onPress } = props;
  return (
    <TouchableOpacity
      style={[
        styles.main,
        {
          backgroundColor: selected ? "lightseagreen" : "teal",
        },
      ]}
      onPress={onPress}
    >
      <MyIcon
        icon={name}
        label={label}
        onPress={onPress}
        color="white"
        size={15}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  main: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 10,
  },
  text: { color: "white" },
});
