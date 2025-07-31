import React from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";

function getDimensions(matrix: any[][]): { width: number[]; height: number[] } {
  const colCount = matrix[0]?.length || 0;
  const rowCount = matrix.length;
  const width: number[] = Array(colCount).fill(0);
  const height: number[] = Array(rowCount).fill(0);

  for (let row = 0; row < rowCount; row++) {
    let maxLines = 1;

    for (let col = 0; col < colCount; col++) {
      const cell = matrix[row][col] ?? "";
      if (typeof cell === "string") {
        const lines = cell.split("\n");
        const maxLen = Math.max(...lines.map((l) => l.length));
        width[col] = Math.max(width[col], Math.max(maxLen * 15 + 10, 100)); // estimate width
        maxLines = Math.max(maxLines, lines.length);
      }
    }

    height[row] = Math.max(maxLines * 40, 40); // estimate height
  }

  return { width, height };
}

export const MyTable = (props: {
  matrix: React.ReactNode[][];
  hidden?: boolean;
}) => {
  const { matrix, hidden } = props;

  const { width: colWidths, height: rowHeights } = getDimensions(matrix);

  return hidden ? (
    <></>
  ) : matrix.length < 2 ? (
    <Text style={{ textAlign: "center", paddingTop: 10 }}>No entries.</Text>
  ) : (
    <ScrollView
      style={styles.container}
      horizontal
      keyboardShouldPersistTaps="handled"
    >
      <View>
        <View
          style={{
            height: rowHeights[0],
            flexDirection: "row",
          }}
        >
          {matrix[0].map((s, ind) => (
            <View
              key={ind}
              style={{
                width: colWidths[ind],
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: ind % 2 ? undefined : "rgba(20,20,20,0.1)",
              }}
            >
              <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                {s}
              </Text>
            </View>
          ))}
        </View>
        <FlatList
          data={matrix.slice(1)}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item: s, index: i }) => (
            <View
              style={{
                height: rowHeights[i + 1],
                flexDirection: "row",
                backgroundColor: i % 2 ? undefined : "rgba(255,255,255,0.2)",
              }}
            >
              {s.map((t, ind) => (
                <View
                  key={ind}
                  style={{
                    width: colWidths[ind],
                    backgroundColor: ind % 2 ? undefined : "rgba(20,20,20,0.1)",
                    justifyContent: "center",
                    padding: 10,
                  }}
                >
                  <Text>{t}</Text>
                </View>
              ))}
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    margin: "auto",
  },
  // row: { height: 40 },
});
