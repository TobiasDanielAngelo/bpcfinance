import { observer } from "mobx-react-lite";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigate } from "react-router-native";
import { ImageNameType, MyImage } from "../../blueprints/MyImages";
import { titleToCamel, toTitleCase } from "../../constants/helpers";
import { allViewPaths, ViewPath } from "../main/";

const MAX_SIZE = 18;
const MIN_SIZE = 10;
const MIN_LENGTH = 10;
const NEG_SLOPE = 0.5;
// ModuleCard Component
const ModuleCard = ({
  path,
  onPress,
}: {
  path: ViewPath;
  onPress?: () => void;
}) => {
  const navigate = useNavigate();

  const pathLink =
    path.mainLink === "back"
      ? ""
      : path.mainLink !== "" && path.mainLink !== undefined
      ? "/" + path.mainLink
      : "";

  const gotoNavigate = () => {
    path.mainLink === "back" ? onPress?.() : navigate(pathLink);
  };
  return (
    <View style={styles.module}>
      <MyImage
        image={titleToCamel(path.title) as ImageNameType}
        onPress={onPress ?? gotoNavigate}
      />
      <View>
        <Text
          numberOfLines={2}
          adjustsFontSizeToFit
          style={{
            fontSize:
              path.title.length <= MIN_LENGTH
                ? MAX_SIZE
                : Math.max(
                    MIN_SIZE,
                    MAX_SIZE - (path.title.length - MIN_LENGTH) * NEG_SLOPE
                  ),
            marginHorizontal: 5,
            flexShrink: 1,
            fontWeight: "bold",
            color: pathLink !== "" || path.title === "Back" ? "green" : "black",
          }}
          onPress={gotoNavigate}
        >
          {path.title.replace(" ", "\n")}
        </Text>
        <Text
          style={{
            fontSize: 20,
            flexShrink: 1,
            fontWeight: "bold",
            marginLeft: 10,
            color: path.items?.length ? "green" : "black",
            display: path.items?.length ? "flex" : "none",
          }}
          onPress={onPress}
        >
          ...
        </Text>
      </View>
    </View>
  );
};

// ModularView Component
export const ModularView = observer(() => {
  const [module, setModule] = useState<string>("");

  const currentPaths = allViewPaths.find((s) => s.title === module);

  return (
    <View style={styles.main}>
      <ScrollView contentContainerStyle={styles.container}>
        {!currentPaths ? (
          allViewPaths.map((path, index) => (
            <ModuleCard
              path={path}
              onPress={() => setModule(path.title)}
              key={index}
            />
          ))
        ) : (
          <>
            {currentPaths.items?.map((item, index) => (
              <ModuleCard
                key={index}
                path={{ title: toTitleCase(item), items: [], mainLink: item }}
              />
            ))}
            <ModuleCard
              path={{ title: "Back", items: [], mainLink: "back" }}
              onPress={() => setModule("")}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  module: {
    borderRadius: 50,
    borderWidth: 4,
    width: 200,
    margin: 20,
    padding: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    borderColor: "teal",
  },
  main: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "auto",
  },
  container: {
    paddingVertical: 30,
    paddingHorizontal: 80,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
