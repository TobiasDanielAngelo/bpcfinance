import { StyleSheet, Text, TouchableOpacity } from "react-native";

export const MyButton = (props: {
  hidden?: boolean;
  onPress?: () => void;
  label: string;
  flex?: boolean;
  isLoading?: boolean;
}) => {
  const { hidden, onPress, label, flex } = props;
  return (
    !hidden && (
      <TouchableOpacity style={[styles.main]} onPress={onPress}>
        <Text style={styles.text}>{label}</Text>
      </TouchableOpacity>
    )
  );
};

const styles = StyleSheet.create({
  main: {
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: "teal",
    borderRadius: 30,
    paddingHorizontal: 10,
  },
  text: { textAlign: "center", color: "white", fontSize: 20 },
});
