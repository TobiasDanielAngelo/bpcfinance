import { PropsWithChildren, useEffect, useRef } from "react";
import {
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Overlay } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { StateSetter } from "../constants/interfaces";
import { HView } from "./HView";
import { MyIcon } from "./MyIcon";

export const MyModal = (
  props: PropsWithChildren<{
    isVisible: boolean;
    setVisible: StateSetter<boolean> | ((t: boolean) => void);
    fullWidth?: boolean;
    title?: string;
    subTitle?: string;
    disableClose?: boolean;
  }>
) => {
  const { isVisible, setVisible, children, title, subTitle } = props;

  return (
    <Overlay
      isVisible={isVisible}
      statusBarTranslucent
      navigationBarTranslucent
      onBackdropPress={() => setVisible(false)}
      supportedOrientations={["portrait", "landscape"]}
    >
      <SafeAreaView style={styles.safeAreaContainer}>
        <HView>
          <Text style={styles.text}>{title}</Text>
          <Text style={styles.text}>{subTitle}</Text>
          <MyIcon icon="times" onPress={() => setVisible(false)} />
        </HView>
        <FlatList
          data={[1]}
          renderItem={() => <View style={styles.children}>{children}</View>}
          keyboardShouldPersistTaps="handled"
        />
      </SafeAreaView>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  text: {},
  bar: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  children: {},
  safeAreaContainer: {
    width: 600,
    maxHeight: "100%",
  },
});
