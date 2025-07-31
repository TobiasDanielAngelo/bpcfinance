import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useStore } from "../../api/Store";
import { MyButton, MyDropdownSelector } from "../../blueprints";
import { MyModal } from "../../blueprints/MyModal";
import { MySpeedDial } from "../../blueprints/MySpeedDial";
import { winWidth } from "../../constants/constants";
import { useVisible } from "../../constants/hooks";
import {
  Field,
  MySpeedDialProps,
  StateSetter,
} from "../../constants/interfaces";
import { ExpenseForm } from "./ExpenseComponents";
import { IncomeForm } from "./IncomeComponents";
import { TransferForm } from "./TransferComponents";
import { mySum, toMoney, toMoneySpaced } from "../../constants/helpers";
import { MyTable } from "../../blueprints/MyTable";
import { EXPENSE_CATEGORY_CHOICES } from "../../api/ExpenseStore";
import { INCOME_CATEGORY_CHOICES } from "../../api/IncomeStore";
import { MyForm } from "../../blueprints/MyForm";

const allLines = [
  ["FORM VIII"],
  ["Diocese of Cabanatuan"],
  ["Barangay Monthly Financial Report"],
  ["Brgy. General Luna"],
  ["Month: _VAR_MONTH"],
  ["Cash Beginning Balance:", "_VAR_BEGBAL"],
  ["Add: Receipts"],
  ["Mass Bag Collections", "_VAR_COLLBAG"],
  ["Mass Envelope Offerings", "_VAR_COLLENV"],
  ["Mass Intentions", "_VAR_COLLINT"],
  ["Donations", "_VAR_COLLDON"],
  ["Solicitations", "_VAR_COLLSOL"],
  ["Total Receipts of the Month ", "_VAR_TOTREC"],
  ["Less: 10% of Total Receipts ", "_VAR_TOT10"],
  ["(excluding the beginning balance)"],
  ["TOTAL FUNDS AVAILABLE FOR USE", "_VAR_TOTFAU"],
  ["Less: Operational Expenses"],
  ["Electric Bill", "_VAR_EXPELEC"],
  ["Water Bill", "_VAR_EXPWATER"],
  ["Priest's Stipend", "_VAR_EXPPRIEST"],
  ["Food", "_VAR_EXPFOOD"],
  ["Transportation", "_VAR_EXPTRANS"],
  ["Repairs/Maintenance", "_VAR_EXMAINT"],
  ["Committee Expenses"],
  ["Worship", "_VAR_EXPCOMMW"],
  ["Evangelization", "_VAR_EXPCOMME"],
  ["Service", "_VAR_EXPCOMMS1"],
  ["Stewardship", "_VAR_EXPCOMM2"],
  ["Youth", "_VAR_EXPCOMMY"],
  ["Family & Life ", "_VAR_EXPCOMMF"],
  ["Recollection/Seminar", "_VAR_EXPRECOL"],
  ["Others", "_VAR_EXPOTH"],
  ["TOTAL EXPENSES:", "_VAR_TOTEXP"],
  ["Cash Ending Balance/Deficit", "_VAR_ENDBAL"],
  ["Prepared By:", "Checked By:", "Noted By:"],
  ["_VAR_TREAS", "_VAR_AUDIT", "_VAR_CHAIR"],
  ["BPC Treasurer", "BPC Auditor", "BPC Chairman"],
];

const BOLD_LINE_NUMS = [0, 1, 2, 5, 6, 12, 13, 15, 16, 32, 33];
const CENTER_LINE_NUMS = [0, 1, 2, 3, 4];
const SPACE_BETWEEN_NUMS = [5, 33, 34, 35, 36];
const ONE_INDENT_NUMS = [
  7, 8, 9, 10, 11, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31,
];
const TWO_INDENT_NUMS = [24, 25, 26, 27, 28, 29];
const FIXED_LEFT1_NUMS = [...ONE_INDENT_NUMS, ...TWO_INDENT_NUMS];
const FIXED_LEFT2_NUMS = [12, 13, 15, 32];
const BOTTOM_GAP1_NUMS = [4, 5, 14, 31, 32, 33];
const BOTTOM_GAP2_NUMS = [0, 11, 15, 33];
const UNDERLINE_NUMS = [35];

const isDebug = false;

const EDITABLE_NUMS = [5, ...FIXED_LEFT1_NUMS].filter((s) => ![23].includes(s));

const VISIBLE_FORM_MAP = [
  ...Array.from(new Set(EDITABLE_NUMS))
    .sort((a, b) => (a > b ? 1 : -1))
    .map((s) => `1-${s}`),
  "0-35",
  "1-35",
  "2-35",
];

export const FigureForm = (props: {
  title: string;
  value: string;
  onChangeValue: StateSetter<string>;
  setVisible: (t: boolean) => void;
  isNumber?: boolean;
}) => {
  const { title, onChangeValue, setVisible, value, isNumber } = props;
  const [details, setDetails] = useState({
    value: value,
  });

  const onSubmit = () => {
    if (!isNaN(parseFloat(details.value)) || !isNumber)
      onChangeValue(details.value);
    setVisible(false);
  };

  const fields = [
    [{ name: "value", label: title, type: "text" }],
  ] satisfies Field[][];
  return (
    <View style={{ alignItems: "center" }}>
      <MyForm
        fields={fields}
        title={title}
        details={details}
        setDetails={setDetails}
        onPressSubmit={onSubmit}
        onPressSubmitAdd={() => {}}
        msg={""}
        hasNoAdd
      />
    </View>
  );
};

export const ReportView = observer(() => {
  const { expenseStore, incomeStore, reportStore } = useStore();
  const { setVisible, isVisible } = useVisible();
  const [month, setMonth] = useState<number | null>(null);

  const prevReport = reportStore.items.find(
    (s) =>
      s.monthYear ===
      moment(month, "YYYY-MM").subtract(1, "month").format("YYYY-MM")
  );
  const existingReport = reportStore.items.find(
    (s) => s.monthYear === String(month)
  );

  const [begBal, setBegBal] = useState("0");
  const [treasurer, setTreasurer] = useState(
    prevReport?.treasurer ?? "TREASURER"
  );
  const [auditor, setAuditor] = useState(prevReport?.auditor ?? "AUDITOR");
  const [chairman, setChairman] = useState(prevReport?.chairman ?? "CHAIRMAN");
  const [msg, setMsg] = useState("");

  const monthPart = String(month).slice(5, 7);
  const yearPart = String(month).slice(0, 4);

  const fetchFcn = async () => {
    const params = `page=all&date_added__month=${Number(
      monthPart
    )}&date_added__year=${Number(yearPart)}`;
    expenseStore.fetchAll(params);
    incomeStore.fetchAll(params);
  };

  useEffect(() => {
    if (existingReport) {
      setBegBal(existingReport.beginningBalance.toString());
      setTreasurer(existingReport.treasurer);
      setAuditor(existingReport.auditor);
      setChairman(existingReport.chairman);
    } else if (prevReport) {
      setBegBal(prevReport.endingBalance.toString());
      setTreasurer(prevReport.treasurer);
      setAuditor(prevReport.auditor);
      setChairman(prevReport.chairman);
    } else {
      setBegBal("0");
      setTreasurer("TREASURER");
      setAuditor("AUDITOR");
      setChairman("CHAIRMAN");
    }
    if (month) fetchFcn();
    setMsg("");
  }, [month]);

  const setVisibleForIndex = (index: number) => {
    return (value: boolean) => {
      setVisible(index, value); // Use setVisible with the given index
    };
  };

  const monthOptions = Array.from(Array(100).keys()).map((s) => ({
    id: `${moment(new Date(2025 + Math.floor(s / 12), s % 12, 1)).format(
      "YYYY-MM"
    )}`,
    name: `${moment(new Date(2025 + Math.floor(s / 12), s % 12, 1)).format(
      "MMM YYYY"
    )}`,
  }));

  useEffect(() => {
    setMonth(moment(new Date()).format("YYYY-MM") as any);
  }, []);

  const allIncomeItems = incomeStore.items.filter(
    (t) => moment(t.dateAdded, "YYYY-MM-DD").format("YYYY-MM") === String(month)
  );
  const allIncomes = Array.from(Array(5).keys()).map((s) =>
    mySum(allIncomeItems.filter((t) => t.category === s).map((s) => s.amount))
  );
  const allIncomeAmounts = allIncomes.map((s) => toMoneySpaced(s));
  const totalIncome = mySum(allIncomes);
  const totalIncomeAmount = toMoneySpaced(totalIncome);

  const allExpenseItems = expenseStore.items.filter(
    (t) => moment(t.dateAdded, "YYYY-MM-DD").format("YYYY-MM") === String(month)
  );
  const allExpenses = Array.from(Array(14).keys()).map(
    (s) =>
      -mySum(
        allExpenseItems.filter((t) => t.category === s).map((s) => s.amount)
      )
  );
  const allExpenseAmounts = allExpenses.map((s) => toMoneySpaced(s));
  const totalExpense = mySum(allExpenses);
  const totalExpenseAmount = toMoneySpaced(totalExpense);

  const allValues: Record<string, any> = {
    MONTH: moment(month, "YYYY-MM").format("MMMM YYYY"),
    BEGBAL: toMoneySpaced(parseFloat(begBal)),
    COLLBAG: allIncomeAmounts[0],
    COLLENV: allIncomeAmounts[1],
    COLLINT: allIncomeAmounts[2],
    COLLDON: allIncomeAmounts[3],
    COLLSOL: allIncomeAmounts[4],
    TOTREC: totalIncomeAmount,
    TOT10: toMoneySpaced(0),
    TOTFAU: toMoneySpaced(parseFloat(begBal) + totalIncome),
    EXPELEC: allExpenseAmounts[0],
    EXPWATER: allExpenseAmounts[1],
    EXPPRIEST: allExpenseAmounts[2],
    EXPFOOD: allExpenseAmounts[3],
    EXPTRANS: allExpenseAmounts[4],
    EXMAINT: allExpenseAmounts[5],
    EXPCOMMW: allExpenseAmounts[6],
    EXPCOMME: allExpenseAmounts[7],
    EXPCOMMS1: allExpenseAmounts[8],
    EXPCOMM2: allExpenseAmounts[9],
    EXPCOMMY: allExpenseAmounts[10],
    EXPCOMMF: allExpenseAmounts[11],
    EXPRECOL: allExpenseAmounts[12],
    EXPOTH: allExpenseAmounts[13],
    TOTEXP: totalExpenseAmount,
    ENDBAL: toMoneySpaced(parseFloat(begBal) + totalIncome + totalExpense),
    TREAS: treasurer,
    AUDIT: auditor,
    CHAIR: chairman,
  };

  const modifiedLines = allLines.map((s) => {
    return s.map((t) =>
      t.replace(/_VAR_(\w+)/g, (_, word) => {
        return allValues[word as keyof typeof allValues];
      })
    );
  });

  const AllModals = [
    <TransferForm setVisible={setVisibleForIndex(1)} />,
    <IncomeForm setVisible={setVisibleForIndex(2)} />,
    <ExpenseForm setVisible={setVisibleForIndex(3)} />,
    <FigureForm
      title="Cash Beginning Balance"
      value={begBal}
      onChangeValue={setBegBal}
      setVisible={setVisibleForIndex(4)}
      isNumber
    />,
    ...Array.from(Array(5).keys()).map((t, ind) => (
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 300, paddingHorizontal: 10 }}>
          <Text style={{ fontWeight: "bold" }}>
            All {INCOME_CATEGORY_CHOICES[t]} Incomes
          </Text>
          {allIncomeItems
            .filter((s) => s.category === t)
            .map((s, ind) => (
              <View
                key={ind}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ width: 80 }}>{s.dateAdded}</Text>
                <Text style={{ width: 100 }}>
                  {s.notes === "" ? "-" : s.notes}
                </Text>
                <Text style={{ width: 80 }}>{toMoney(-s.amount)}</Text>
              </View>
            ))}
        </View>
        <IncomeForm
          setVisible={setVisibleForIndex(t + 5)}
          item={{ category: t }}
        />
      </View>
    )),
    ...Array.from(Array(14).keys()).map((t, ind) => (
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 300, paddingHorizontal: 10 }}>
          <Text style={{ fontWeight: "bold" }}>
            All {EXPENSE_CATEGORY_CHOICES[t]} Expenses
          </Text>
          {allExpenseItems
            .filter((s) => s.category === t)
            .map((s, ind) => (
              <View
                key={ind}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ width: 80 }}>{s.dateAdded}</Text>
                <Text style={{ width: 100 }}>
                  {s.notes === "" ? "-" : s.notes}
                </Text>
                <Text style={{ width: 80 }}>{toMoney(-s.amount)}</Text>
              </View>
            ))}
        </View>
        <ExpenseForm
          setVisible={setVisibleForIndex(t + 10)}
          item={{ category: t }}
        />
      </View>
    )),
    <FigureForm
      title="BPC Treasurer"
      value={treasurer}
      onChangeValue={setTreasurer}
      setVisible={setVisibleForIndex(24)}
    />,
    <FigureForm
      title="BPC Auditor"
      value={auditor}
      onChangeValue={setAuditor}
      setVisible={setVisibleForIndex(25)}
    />,
    <FigureForm
      title="BPC Chairman"
      value={chairman}
      onChangeValue={setChairman}
      setVisible={setVisibleForIndex(26)}
    />,
  ];

  const onPressSubmit = async () => {
    const newReport = {
      monthYear: String(month),
      treasurer: treasurer,
      auditor: auditor,
      chairman: chairman,
      beginningBalance: parseFloat(begBal),
      endingBalance: parseFloat(begBal) + totalIncome + totalExpense,
    };

    const resp = existingReport
      ? await reportStore.updateItem(existingReport.id, newReport)
      : await reportStore.addItem(newReport);
    if (!resp.ok) {
      setMsg(resp.details ?? "Error");
      return;
    } else {
      setMsg("Success!");
    }
  };

  return (
    <View style={{ paddingTop: 10, paddingHorizontal: 20, flex: 1 }}>
      {AllModals.map((s, ind) => (
        <MyModal
          isVisible={isVisible[ind + 1]}
          setVisible={setVisibleForIndex(ind + 1)}
          key={ind}
        >
          {s}
        </MyModal>
      ))}
      <MyDropdownSelector
        options={monthOptions}
        value={month}
        onChangeValue={setMonth}
      />
      <ScrollView>
        <View style={styles.main}>
          {modifiedLines.map((s, ind) => (
            <View
              key={ind}
              style={{
                flexDirection: s.length > 1 ? "row" : "column",
                justifyContent: SPACE_BETWEEN_NUMS.includes(ind)
                  ? "space-between"
                  : "flex-start",
                marginBottom: BOTTOM_GAP2_NUMS.includes(ind)
                  ? "6%"
                  : BOTTOM_GAP1_NUMS.includes(ind)
                  ? "3%"
                  : "0.5%",
              }}
            >
              {s.map((t, idx) => (
                <Text
                  onPress={() => {
                    const index =
                      VISIBLE_FORM_MAP.findIndex((t) => `${idx}-${ind}` === t) +
                      4;
                    setVisible(index, true);
                  }}
                  key={idx}
                  style={{
                    color:
                      idx !== 1 && ind !== 35
                        ? "black"
                        : EDITABLE_NUMS.includes(ind) || ind === 35
                        ? "blue"
                        : "black",
                    fontSize: winWidth * 0.014,
                    fontFamily: t.includes("₱") ? "monospace" : "serif",
                    fontWeight:
                      idx !== 0
                        ? undefined
                        : BOLD_LINE_NUMS.includes(ind)
                        ? "bold"
                        : "normal",
                    textAlign: CENTER_LINE_NUMS.includes(ind)
                      ? "center"
                      : t.includes("₱")
                      ? "right"
                      : "left",
                    marginLeft: TWO_INDENT_NUMS.includes(ind)
                      ? "10%"
                      : ONE_INDENT_NUMS.includes(ind)
                      ? "5%"
                      : "0%",
                    width: t.includes("₱") ? 200 : undefined,
                    textDecorationLine:
                      UNDERLINE_NUMS.includes(ind) ||
                      ([
                        5,
                        ...FIXED_LEFT1_NUMS,
                        ...FIXED_LEFT2_NUMS,
                        33,
                      ].includes(ind) &&
                        idx === 1)
                        ? "underline"
                        : "none",
                    left:
                      idx !== 1
                        ? undefined
                        : FIXED_LEFT2_NUMS.includes(ind)
                        ? "60%"
                        : FIXED_LEFT1_NUMS.includes(ind)
                        ? TWO_INDENT_NUMS.includes(ind)
                          ? "35%"
                          : "40%"
                        : undefined,
                    position:
                      idx !== 1
                        ? "static"
                        : [...FIXED_LEFT2_NUMS, ...FIXED_LEFT1_NUMS].includes(
                            ind
                          )
                        ? "absolute"
                        : "static",
                  }}
                >
                  {isDebug ? `${idx}-${ind}` : ""} {t}
                </Text>
              ))}
            </View>
          ))}
          <MyButton
            label={
              existingReport ? "Update and Replace Report" : "Save New Report"
            }
            onPress={onPressSubmit}
          />
          <Text
            style={{
              color: msg === "Success!" ? "green" : "darkred",
              textAlign: "center",
            }}
          >
            {msg}
          </Text>
        </View>
      </ScrollView>
      {/* <MySpeedDial actions={actions} /> */}
    </View>
  );
});

const styles = StyleSheet.create({
  text: {
    fontFamily: "serif",
    fontSize: 15,
  },
  bold: {
    fontWeight: "bold",
  },
  lined: {
    textDecorationLine: "underline",
  },
  main: {
    flex: 1,
    backgroundColor: "white",
    aspectRatio: 1 / 1.294,
    width: "100%",
    borderWidth: 1,
    padding: "5%",
    paddingHorizontal: "10%",
  },
});
