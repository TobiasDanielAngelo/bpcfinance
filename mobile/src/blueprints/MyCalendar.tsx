import { observer } from "mobx-react-lite";
import moment from "moment";
import { Calendar } from "react-native-calendars";
import { CalendarEvent, StateSetter } from "../constants/interfaces";
import { View } from "react-native";
import { MyModal } from "./MyModal";
import { useVisible } from "../constants/hooks";
import { MyTable } from "./MyTable";

export const MyCalendar = observer(
  (props: {
    date: Date;
    setDate: StateSetter<Date>;
    events?: CalendarEvent[];
    noModal?: boolean;
  }) => {
    const { date, setDate, events, noModal } = props;
    const { isVisible1, setVisible1 } = useVisible();

    const selected = moment(date).format("YYYY-MM-DD");

    return (
      <View>
        <MyModal isVisible={isVisible1} setVisible={setVisible1}>
          <MyTable
            matrix={[
              ["Event", "Time"],
              ...(events ?? []).map((s) => [
                s.title,
                moment(s.dateStart).format("h:mm A"),
              ]),
            ]}
          />
        </MyModal>
        <Calendar
          onDayPress={(day) => {
            setDate(moment(day.dateString, "YYYY-MM-DD").toDate());
            !noModal && setVisible1(true);
          }}
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: "orange",
            },
          }}
          style={{
            borderRadius: 10,
            margin: 10,
            backgroundColor: "transparent",
          }}
          theme={{
            textDisabledColor: "darkgray",
            textInactiveColor: "blue",
            todayTextColor: "blue",
            calendarBackground: "transparent",
            textSectionTitleColor: "blue",
          }}
        />
      </View>
    );
  }
);
