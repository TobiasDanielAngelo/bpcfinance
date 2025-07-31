import moment from "moment";
import { StyleSheet, Text, View } from "react-native";
import { useVisible } from "../constants/hooks";
import { DatePicker } from "./DatePicker";
import { DateTimePicker } from "./DateTimePicker";
import { MyIcon } from "./MyIcon";
import { TimePicker } from "./TimePicker";

const toString = (dt: Date, isDateOnly?: boolean, isTimeOnly?: boolean) => {
  return isDateOnly
    ? moment(dt).format("MMM D, YYYY")
    : isTimeOnly
    ? moment(dt).format("h:mm A")
    : moment(dt).format("MMM D YYYY h:mm A");
};

export const MyDateTimePicker = (props: {
  hidden?: boolean;
  value: string;
  label?: string;
  onChangeValue: (t: string) => void;
  isDateOnly?: boolean;
  isTimeOnly?: boolean;
  dateFormat?: string;
  msg?: string;
}) => {
  const { hidden, onChangeValue, value, isDateOnly, isTimeOnly, label } = props;
  const { isVisible1, setVisible1 } = useVisible();

  const valueMoment =
    value !== "" && value
      ? isDateOnly
        ? moment(value, "MMM D, YYYY")
        : isTimeOnly
        ? moment(value, "h:mm A")
        : moment(value, "MMM D YYYY h:mm A")
      : undefined;

  const dateString = valueMoment ? valueMoment.format("MMM D, YYYY") : "N/D";
  const timeString = valueMoment ? valueMoment.format("h:mm A") : "N/T";

  const calendarLabel = isDateOnly
    ? dateString
    : isTimeOnly
    ? timeString
    : `${dateString} ${timeString}`;

  return (
    !hidden && (
      <View style={styles.main}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MyIcon icon="times" size={10} onPress={() => onChangeValue("")} />
            <Text style={{ paddingLeft: 5 }}>{label}</Text>
          </View>
          <View>
            <MyIcon
              icon="calendar"
              size={10}
              onPress={() =>
                onChangeValue(toString(new Date(), isDateOnly, isTimeOnly))
              }
              label="Now"
            />
          </View>
        </View>

        <MyIcon
          icon="calendar"
          onPress={() => setVisible1(true)}
          label={calendarLabel}
        />
        {isDateOnly ? (
          <DatePicker
            date={value}
            setDate={onChangeValue}
            open={isVisible1}
            setOpen={setVisible1}
          />
        ) : isTimeOnly ? (
          <TimePicker
            time={value}
            setTime={onChangeValue}
            open={isVisible1}
            setOpen={setVisible1}
          />
        ) : (
          <DateTimePicker
            dateTime={value}
            setDateTime={onChangeValue}
            open={isVisible1}
            setOpen={setVisible1}
          />
        )}
      </View>
    )
  );
};

const styles = StyleSheet.create({
  main: {
    margin: 5,
  },
  text: {
    color: "teal",
    marginHorizontal: 5,
  },
  bar: {
    flexDirection: "row",
  },
});
