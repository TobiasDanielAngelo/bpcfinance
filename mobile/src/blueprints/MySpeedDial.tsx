import { useState } from "react";
import { StyleSheet } from "react-native";
import { SpeedDial } from "react-native-elements";
import { MySpeedDialProps } from "../constants/interfaces";

export const MySpeedDial = (props: {
  actions?: MySpeedDialProps[];
  leftSide?: boolean;
  center?: boolean;
}) => {
  const { actions, leftSide } = props;
  const [open, setOpen] = useState(false);

  return (
    <SpeedDial
      isOpen={open}
      icon={{
        name: leftSide ? "sliders-h" : "pen",
        color: "#fff",
        size: 20,
        type: "font-awesome-5",
      }}
      openIcon={{ name: "close", color: "#fff" }}
      onOpen={() => setOpen(!open)}
      onClose={() => setOpen(!open)}
      placement={leftSide ? "left" : "right"}
      color="teal"
      buttonStyle={{
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100,
      }}
      containerStyle={{
        bottom: -10,
        right: leftSide ? 10 : -10,
      }}
    >
      {actions?.map((s, ind) => (
        <SpeedDial.Action
          icon={{
            name: s.icon,
            color: "#fff",
            type: "font-awesome-5",
            size: 20,
          }}
          title={s.name}
          onPress={s.onPress}
          key={ind}
          style={{ top: -50, right: -20 }}
          titleStyle={{ top: -50, right: -20 }}
          color="teal"
          buttonStyle={{
            borderRadius: 100,
          }}
        />
      ))}
    </SpeedDial>
  );
};

const styles = StyleSheet.create({});
