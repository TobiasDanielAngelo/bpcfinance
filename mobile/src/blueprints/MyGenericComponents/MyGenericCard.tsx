import { observer } from "mobx-react-lite";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useVisible } from "../../constants/hooks";
import { ItemDetailsProps, KV, Page } from "../../constants/interfaces";
import { ItemDetails } from "../ItemDetails";
import { MyConfirmModal } from "../MyConfirmModal";
import { MyDropdownMenu } from "../MyDropdownMenu";
import { MyIcon } from "../MyIcon";
import { MyModal } from "../MyModal";

export interface IAction {
  onPress: () => void;
  icon: string;
  color?:
    | "inherit"
    | "action"
    | "disabled"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
}

interface MyGenericCardProps<T> extends ItemDetailsProps<T> {
  FormComponent: React.ComponentType<{
    item: T;
    setVisible: (v: boolean) => void;
    fetchFcn: () => void;
  }>;
  deleteItem: (
    id: number | string
  ) => Promise<{ ok: boolean; details?: string }>;
  fetchFcn: () => void;
  moreActions?: IAction[];
  dropdownActions?: Page[];
  itemMap?: KV<any>[];
}

export const MyGenericCard = observer(
  <T extends object & { id: number | string; $view: any }>({
    item,
    shownFields,
    header,
    important,
    prices,
    FormComponent,
    deleteItem,
    fetchFcn,
    moreActions,
    dropdownActions,
    itemMap,
  }: MyGenericCardProps<T>) => {
    const {
      isVisible1,
      setVisible1,
      isVisible2,
      setVisible2,
      isVisible3,
      setVisible3,
    } = useVisible();
    const [showMore, setShowMore] = useState(false);
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

    const actions = [
      { onPress: () => setVisible1(true), title: "Edit" },
      { onPress: () => setVisible2(true), title: "Delete" },
      ...(dropdownActions ?? []),
    ] satisfies Page[];

    return (
      <View style={styles.card}>
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

        <View style={styles.wrapper}>
          <View style={styles.flex1}>
            <ItemDetails<T>
              item={item.$view}
              shownFields={shownFields}
              header={header}
              important={important}
              prices={prices}
              showMore={showMore}
              setShowMore={setShowMore}
              itemMap={itemMap}
            />

            <View style={styles.actionsRow}>
              <View style={styles.relative}>
                <MyIcon icon="cog" onPress={() => setVisible3((t) => !t)} />
                <MyDropdownMenu
                  setOpen={setVisible3}
                  open={isVisible3}
                  actions={actions}
                  margin={9}
                />
              </View>

              {moreActions?.map((s, ind) => (
                <MyIcon key={ind} icon={s.icon} onPress={s.onPress} />
              ))}

              <MyIcon
                icon={showMore ? "angle-up" : "angle-down"}
                onPress={() => setShowMore((t) => !t)}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    margin: 12, // m-3
    padding: 8, // pt-3
    borderRadius: 8, // rounded-lg
    borderWidth: 1, // border
    borderColor: "teal", // border-teal-300
    // For dark mode, override this dynamically
  },
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flex1: {
    flex: 1,
  },
  actionsRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 8, // mt-2 → 8px
    alignItems: "center",
  },
  relative: {
    position: "relative",
  },
});
