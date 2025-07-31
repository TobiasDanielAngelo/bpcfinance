import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Page } from "../constants/interfaces";

export const MyDropdownMenu = (props: {
  open?: boolean;
  setOpen?: (t: boolean) => void;
  actions?: Page[];
  margin?: number;
}) => {
  const { open, setOpen, actions, margin } = props;
  if (!open) return null;

  return (
    <View
      style={[
        styles.dropdown,
        {
          marginLeft: -(margin ?? 0) * 16,
          marginRight: -(margin ?? 0) * 16,
        },
      ]}
    >
      <FlatList
        data={actions}
        keyExtractor={(_, i) => i.toString()}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const onPress = () => {
            item.onPress?.();
            setOpen?.(false);
          };
          return (
            <Pressable onPress={onPress}>
              <Text style={styles.item} onPress={onPress}>
                {item.title}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    position: "absolute",
    top: 25,
    zIndex: 10,
    // maxHeight: "400%",
    overflow: "scroll",
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    width: 176, // w-44
  },
  list: {
    paddingVertical: 8,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: "#374151",
  },
});
