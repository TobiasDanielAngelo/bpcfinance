import {
  DimensionValue,
  FlatList,
  useWindowDimensions,
  View,
} from "react-native";

type Props = {
  SideA: React.ReactNode;
  SideB: React.ReactNode;
  ratio?: number; // SideA weight (e.g. 2 for 2:1)
  reversed?: boolean;
};

export const SideBySideView = ({
  SideA,
  SideB,
  ratio = 1,
  reversed = false,
}: Props) => {
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width || (height < width && height < 600);
  const total = ratio + 1;

  const widthA = `${(ratio / total) * 100}%` as DimensionValue;
  const widthB = `${(1 / total) * 100}%` as DimensionValue;

  const orderedItems =
    reversed && isPortrait
      ? [
          { key: "B", content: SideB },
          { key: "A", content: SideA },
        ]
      : [
          { key: "A", content: SideA },
          { key: "B", content: SideB },
        ];

  if (isPortrait) {
    return (
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={orderedItems}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 8 }}>{item.content}</View>
        )}
      />
    );
  }

  // Landscape: side-by-side with width control
  return (
    <View
      style={{
        flexDirection: "row",
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 10,
      }}
    >
      <View style={{ width: widthA }}>{SideA}</View>
      <View style={{ width: widthB }}>{SideB}</View>
    </View>
  );
};
