import { observer } from "mobx-react-lite";
import { useState } from "react";
import { View } from "react-native";
import { useVisible } from "../../constants/hooks";
import { MyConfirmModal } from "../MyConfirmModal";
import { MyIcon } from "../MyIcon";
import { MyModal } from "../MyModal";

interface MyGenericRowProps<T> {
  item: T;
  FormComponent: React.ComponentType<{
    item: T;
    setVisible: (v: boolean) => void;
    fetchFcn: () => void;
  }>;
  deleteItem: (
    id: number | string
  ) => Promise<{ ok: boolean; details?: string }>;
  fetchFcn: () => void;
}

export const MyGenericRow = observer(
  <T extends object & { id: number | string }>({
    item,
    FormComponent,
    deleteItem,
    fetchFcn,
  }: MyGenericRowProps<T>) => {
    const { isVisible1, setVisible1, isVisible2, setVisible2 } = useVisible();
    const [msg, setMsg] = useState("");

    const onDelete = async () => {
      const resp = await deleteItem(item.id);
      if (!resp.ok) {
        setMsg(resp.details ?? "Error");
        return;
      }
      fetchFcn();
      setVisible2(false);
    };

    return (
      <View>
        <MyModal isVisible={isVisible1} setVisible={setVisible1}>
          <FormComponent
            item={item}
            setVisible={setVisible1}
            fetchFcn={fetchFcn}
          />
        </MyModal>

        <MyConfirmModal
          isVisible={isVisible2}
          setVisible={setVisible2}
          onPressCheck={onDelete}
          actionName="Delete"
          msg={msg}
        />
        <View style={{ flexDirection: "row", gap: 5, paddingHorizontal: 25 }}>
          <MyIcon icon="edit" onPress={() => setVisible1(true)} size={20} />
        </View>
      </View>
    );
  }
);
