import moment from "moment";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { StateSetter } from "../constants/interfaces";
import { MyIcon } from "./MyIcon";
import { MyInput } from "./MyInput";
import { MyModal } from "./MyModal";

type TimePickerProps = {
  time: string;
  setTime: (t: string) => void;
  open: boolean;
  setOpen: StateSetter<boolean>;
};

export const TimePicker = ({
  time,
  setTime,
  open,
  setOpen,
}: TimePickerProps) => {
  const [hour, setHour] = useState(moment(time).format("hh"));
  const [minute, setMinute] = useState(moment(time).format("mm"));
  const [isAM, setIsAM] = useState(moment(time).format("A") === "AM");

  const onPressCheck = () => {
    setTime(`${hour}:${minute} ${isAM ? "AM" : "PM"}`);
    setOpen(false);
  };

  const correctorHour = (t: string) => {
    return String(
      isNaN(parseInt(t)) ? 1 : Math.max(1, Math.min(parseInt(t), 12))
    ).padStart(2, "0");
  };

  const correctorMinute = (t: string) => {
    return String(
      isNaN(parseInt(t)) ? 0 : Math.max(0, Math.min(parseInt(t), 59))
    ).padStart(2, "0");
  };

  return (
    <MyModal isVisible={open} setVisible={setOpen}>
      <View style={styles.container}>
        <MyInput
          value={hour}
          onChangeValue={setHour}
          corrector={correctorHour}
          flex={1}
          centered
          numeric
        />
        <MyInput
          value={minute}
          onChangeValue={setMinute}
          corrector={correctorMinute}
          flex={1}
          centered
          numeric
        />
        <Pressable
          style={{
            alignItems: "center",
            flexDirection: "row",
            gap: 3,
          }}
          onPress={() => setIsAM((t) => !t)}
        >
          <Text onPress={() => setIsAM((t) => !t)}>{isAM ? "AM" : "PM"}</Text>
          <MyIcon
            icon={isAM ? "sun" : "moon"}
            size={10}
            onPress={() => setIsAM((t) => !t)}
          />
        </Pressable>
      </View>

      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <MyIcon icon="check" onPress={onPressCheck} />
      </View>
    </MyModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: 120,
    height: 120,
    alignItems: "center",
    margin: "auto",
  },
});
