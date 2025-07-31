import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "../../api/Store";
import { MyDropdownSelector } from "../../blueprints";
import { MyModal } from "../../blueprints/MyModal";
import { MySpeedDial } from "../../blueprints/MySpeedDial";
import { MyTable } from "../../blueprints/MyTable";
import { sortByKey, toOptions } from "../../constants/helpers";
import { useVisible } from "../../constants/hooks";
import {
  Field,
  MySpeedDialProps,
  StateSetter,
} from "../../constants/interfaces";
import { MyForm } from "../../blueprints/MyForm";
import { TwoDates } from "../../constants/classes";
import { Pressable, View } from "react-native";
import { Text } from "react-native";
import { Member, MemberInterface } from "../../api/MemberStore";
import { MemberCard, MemberForm, MemberRow } from "./MemberComponents";

const CollectionRowName = (props: { item: Member }) => {
  const { item } = props;
  const { isVisible1, setVisible1 } = useVisible();

  return (
    <View>
      <MyModal isVisible={isVisible1} setVisible={setVisible1}>
        <MemberCard item={item} />
      </MyModal>
      <Pressable onPress={() => setVisible1(true)}>
        <Text style={{ color: item.isActive ? "blue" : "red" }}>
          {item.firstName} {item.lastName}
        </Text>
      </Pressable>
    </View>
  );
};

export const CollectionTableForm = observer(
  (props: { setVisible: StateSetter<boolean> }) => {
    const { setVisible } = props;
    const { memberStore, collectionStore } = useStore();
    const [msg, setMsg] = useState<any>("");
    const [details, setDetails] = useState({
      collectionDate: moment(new Date()).format("MMM D, YYYY"),
      member: null,
      receiptNumber: "",
      startMonth: "2025-01",
      endMonth: "2025-12",
      unitAmount: 150,
      amount: 0,
    });

    const monthOptions = Array.from(Array(100).keys()).map((s) => ({
      id: `${moment(new Date(2025 + Math.floor(s / 12), s % 12, 1)).format(
        "YYYY-MM"
      )}`,
      name: `${moment(new Date(2025 + Math.floor(s / 12), s % 12, 1)).format(
        "MMM YYYY"
      )}`,
    }));

    const fields = useMemo(
      () =>
        [
          [
            {
              name: "collectionDate",
              label: "Collection Date",
              type: "date",
            },
          ],
          [
            {
              name: "member",
              label: "Member",
              type: "select",
              options: toOptions(
                sortByKey(
                  memberStore.items.map((s) => s.$view),
                  "fullName"
                ),
                "fullName"
              ),
            },
          ],
          [{ name: "receiptNumber", label: "Receipt Number", type: "text" }],
          [
            {
              name: "startMonth",
              label: "From",
              type: "select",
              options: monthOptions,
            },
          ],
          [
            {
              name: "endMonth",
              label: "To",
              type: "select",
              options: monthOptions,
            },
          ],
          [{ name: "unitAmount", label: "Unit Amount", type: "text" }],
          [{ name: "amount", label: "Amount", type: "text" }],
        ] satisfies Field[][],
      [memberStore.items.length, details.startMonth, details.endMonth]
    );

    useEffect(() => {
      if (details.startMonth !== null && details.endMonth !== null) {
        const start = moment(details.startMonth, "YYYY-MM");
        const end = moment(details.endMonth, "YYYY-MM");

        const numberOfMonths = end.diff(start, "months", true) + 1;
        setDetails({ ...details, amount: numberOfMonths * details.unitAmount });
      } else {
        setDetails({ ...details, amount: 0 });
      }
    }, [details.startMonth, details.endMonth, details.unitAmount]);

    const onPressSubmit = async () => {
      const resp = await collectionStore.addItem({
        ...details,
        collectionDate: moment(details.collectionDate, "MMM D, YYYY").format(
          "YYYY-MM-DD"
        ),
      });
      if (!resp.ok) return setMsg(resp.details);
      setVisible(false);
    };

    return (
      <MyForm
        fields={fields}
        title="Add Collection"
        details={details}
        setDetails={setDetails}
        onPressSubmit={onPressSubmit}
        onPressSubmitAdd={onPressSubmit}
        msg={msg}
      />
    );
  }
);

export const CollectionTableView = observer(() => {
  const { memberStore, collectionStore } = useStore();
  const [member, setMember] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(2025);
  const {
    isVisible1,
    setVisible1,
    isVisible2,
    setVisible2,
    isVisible3,
    setVisible3,
  } = useVisible();

  useEffect(() => {
    collectionStore.resetItems();
    collectionStore.fetchAll(`page=all&start_month__year=${year}`);
    collectionStore.fetchAll(`page=all&end_month__year=${year}`);
  }, [year]);

  const allCollections = collectionStore.items.flatMap((s) => {
    const monthsBetween = new TwoDates(s.startMonth, s.endMonth).monthsBetween;

    return monthsBetween.map((month) => ({
      ...s.$view,
      currentMonth: month, // Assign each month from monthsBetween
    }));
  });

  const matrix = useMemo(() => {
    const header = [
      "Collection",
      ...Array.from(Array(12).keys()).map((s) =>
        moment(new Date(year ?? 2025, s)).format("YYYY-MMM")
      ),
    ];
    const rows = sortByKey(
      memberStore.items.filter((s) =>
        member !== null ? s.id === member : true
      ),
      "lastName"
    ).map((s) => {
      return [
        <CollectionRowName item={s} />,
        ...Array.from(Array(12).keys()).map((t) => {
          const collected = allCollections.find(
            (u) =>
              u.member === s.id &&
              u.currentMonth ===
                moment(new Date(year ?? 2025, t)).format("YYYY-MM")
          );
          if (!collected) return "";
          return `AR # ${collected.receiptNumber}\n@ ${collected.collectionDate}`;
        }),
      ];
    });

    return [header, ...rows];
  }, [memberStore.items.length, year, member, collectionStore.items.length]);

  const actions = [
    { icon: "filter", name: "Filter", onPress: () => setVisible1(true) },
    { icon: "money-bill", name: "Collect", onPress: () => setVisible2(true) },
    { icon: "user-plus", name: "Add Member", onPress: () => setVisible3(true) },
  ] satisfies MySpeedDialProps[];

  return (
    <>
      <MyModal isVisible={isVisible1} setVisible={setVisible1}>
        <MyDropdownSelector
          value={member}
          onChangeValue={setMember}
          options={toOptions(
            sortByKey(
              memberStore.items.map((s) => s.$view),
              "lastName"
            ),
            "fullName"
          )}
          label="Members"
        />
        <MyDropdownSelector
          value={year}
          onChangeValue={setYear}
          options={Array.from(Array(3).keys())
            .map((s) => s + 2025)
            .map((s) => ({ id: s, name: s.toString() }))}
          label="Year"
        />
      </MyModal>
      <MyModal isVisible={isVisible2} setVisible={setVisible2}>
        <CollectionTableForm setVisible={setVisible2} />
      </MyModal>
      <MyModal isVisible={isVisible3} setVisible={setVisible3}>
        <MemberForm setVisible={setVisible3} />
      </MyModal>
      <MyTable matrix={matrix} />
      <MySpeedDial actions={actions} />
    </>
  );
});
