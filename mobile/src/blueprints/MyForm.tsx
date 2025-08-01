import { observer } from "mobx-react-lite";
import { Text, View } from "react-native";
import { useVisible } from "../constants/hooks";
import { Field } from "../constants/interfaces";
import {
  MyButton,
  MyCheckBox,
  MyConfirmModal,
  MyDateTimePicker,
  MyDropdownSelector,
  MyInput,
  MyMultiDropdownSelector,
  MyTextArea,
} from "./";
import { MyIcon } from "./MyIcon";

const getMsg = (msg: any, name: string) =>
  msg && !`${msg[name as keyof Object]}`.includes("undefined")
    ? `${msg[name as keyof Object]}`.includes("Invalid pk")
      ? "Select one that applies"
      : `${msg[name as keyof Object]}`
    : "";

const renderField = (
  t: Field,
  details: any,
  onChangeValue: any,
  msg: any,
  key: number
) => {
  const commonProps = {
    label: t.label,
    value: details[t.name],
    onChangeValue: (u: any) => onChangeValue(u, t.name),
    msg: getMsg(msg, t.name),
  };

  switch (t.type) {
    case "function":
      return (
        <View key={key}>
          <Text>{t.label}</Text>
          <Text style={{ textAlign: "center" }}>{t.function?.(details)}</Text>
        </View>
      );
    case "password":
      return <MyInput key={key} {...commonProps} isPassword />;
    case "select":
      return (
        <MyDropdownSelector key={key} {...commonProps} options={t.options} />
      );
    case "date":
    case "time":
    case "datetime":
      return (
        <MyDateTimePicker
          {...commonProps}
          key={key}
          isDateOnly={t.type === "date"}
          isTimeOnly={t.type === "time"}
        />
      );
    case "multi":
      return (
        <MyMultiDropdownSelector
          key={key}
          {...commonProps}
          value={details[t.name] ?? []}
          options={t.options}
        />
      );
    case "textarea":
      return (
        <MyTextArea
          key={key}
          {...commonProps}
          value={details[t.name] ?? ""}
          centered={t.centered}
        />
      );
    case "color":
      return <MyInput key={key} {...commonProps} />;
    case "check":
      return <MyCheckBox key={key} {...commonProps} />;
    case "number":
    case "text":
      return (
        <MyInput
          key={key}
          {...commonProps}
          value={details[t.name] ?? ""}
          centered={t.centered}
        />
      );
    default:
      return (
        <Text key={key} style={{ textAlign: "center" }}>
          {t.label}
        </Text>
      );
  }
};

type FormProps = {
  fields: (Field | undefined)[][];
  title: string;
  objectName?: string;
  details: any;
  setDetails: (t: any) => void;
  onPressSubmit: () => void;
  onPressSubmitAdd: () => void;
  hasDelete?: boolean;
  onDelete?: () => Promise<void>;
  msg?: Object;
  isLoading?: boolean;
  hasNoAdd?: boolean;
};

export type MyFormProps<T extends Object & { id: number | null }> = {
  item?: T;
  setVisible?: (t: boolean) => void;
  fetchFcn?: () => void;
};

export const MyForm = observer(
  ({
    fields,
    title,
    objectName,
    details,
    setDetails,
    onPressSubmit,
    onPressSubmitAdd,
    hasDelete,
    onDelete,
    msg,
    isLoading,
    hasNoAdd,
  }: FormProps) => {
    const { isVisible1, setVisible1 } = useVisible();

    const onChangeValue = (val: any, name: string) =>
      setDetails({ ...details, [name]: val });

    const onPressDelete = () => {
      setVisible1?.(true);
    };
    const onPressConfirm = async () => {
      await onDelete?.();
    };

    return (
      <View>
        <MyConfirmModal
          isVisible={isVisible1}
          setVisible={setVisible1}
          onPressCheck={onPressConfirm}
          objectName={objectName}
          actionName="Delete"
        />
        <Text
          style={{
            width: 300,
            borderBottomWidth: 1,
            borderBottomColor: "#dddddd",
          }}
        >
          {title}
        </Text>
        {fields.map((row, rowIdx) => (
          <View key={rowIdx}>
            {row.map((t, colIdx) =>
              t ? (
                renderField(t, details, onChangeValue, msg, colIdx)
              ) : (
                <View key={colIdx}></View>
              )
            )}
          </View>
        ))}
        <Text
          style={{
            color: "darkred",
            display:
              getMsg(msg, "nonFieldErrors") !== "" ||
              getMsg(msg, "detail") !== ""
                ? "contents"
                : "none",
          }}
        >
          {getMsg(msg, "nonFieldErrors")} {getMsg(msg, "detail")}
        </Text>
        <View
          style={{
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          }}
        >
          <MyButton
            onPress={onPressSubmit}
            isLoading={isLoading}
            label="Save"
          />
          {!hasDelete ? (
            !hasNoAdd ? (
              <MyButton
                onPress={onPressSubmitAdd}
                isLoading={isLoading}
                label="Save and Add"
              />
            ) : (
              <></>
            )
          ) : (
            <MyIcon icon="trash" onPress={onPressDelete} />
          )}
        </View>
      </View>
    );
  }
);
