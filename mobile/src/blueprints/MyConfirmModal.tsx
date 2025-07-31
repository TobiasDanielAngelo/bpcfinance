import { Text, View } from "react-native";
import { StateSetter } from "../constants/interfaces";
import { MyIcon } from "./MyIcon";
import { MyModal } from "./MyModal";

export const MyConfirmModal = (props: {
  isVisible: boolean;
  setVisible: StateSetter<boolean>;
  onPressCheck: () => void;
  objectName?: string;
  actionName?: string;
  msg?: Object;
  isLoading?: boolean;
}) => {
  const {
    isVisible,
    setVisible,
    onPressCheck,
    objectName,
    actionName,
    msg,
    isLoading,
  } = props;

  return (
    <MyModal
      isVisible={isVisible}
      setVisible={setVisible}
      title="Confirm Action"
      disableClose
    >
      <View
        style={{ height: 200, justifyContent: "center", alignItems: "center" }}
      >
        <Text>
          {objectName
            ? `${actionName ?? "Confirm"} this ${objectName}?`
            : `${actionName ?? "Confirm"} this item?`}
        </Text>
      </View>
      <View>
        {msg &&
        !`${msg["nonFieldErrors" as keyof Object]}`.includes("undefined")
          ? `${msg["nonFieldErrors" as keyof Object]}`
          : ""}
      </View>
      <View>
        {msg && !`${msg["detail" as keyof Object]}`.includes("undefined")
          ? `${msg["detail" as keyof Object]}`
          : ""}
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <MyIcon icon="check" onPress={onPressCheck} />
      </View>
    </MyModal>
  );
};
