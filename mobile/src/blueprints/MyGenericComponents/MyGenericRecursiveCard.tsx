import { observer } from "mobx-react-lite";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ItemDetails } from "../../blueprints/ItemDetails";
import { useVisible } from "../../constants/hooks";
import { ItemDetailsProps, KV, Page } from "../../constants/interfaces";
import { MyConfirmModal } from "../MyConfirmModal";
import { MyDropdownMenu } from "../MyDropdownMenu";
import { MyIcon } from "../MyIcon";
import { MyModal } from "../MyModal";

interface MyGenericRecursiveCardProps<T> extends ItemDetailsProps<T> {
  FormComponent: React.ComponentType<{
    item: T;
    setVisible: (v: boolean) => void;
    fetchFcn: () => void;
  }>;
  deleteItem: (
    id: number | string
  ) => Promise<{ ok: boolean; details?: string }>;
  fetchFcn: () => void;
  items: T[];
  itemMap?: KV<any>[];
  parentKey: keyof T;
  border?: boolean;
}

export const MyGenericRecursiveCard = observer(
  <T extends object & { id: number | string; $view: any }>({
    item,
    header,
    important,
    prices,
    shownFields,
    FormComponent,
    deleteItem,
    fetchFcn,
    items,
    parentKey,
    border,
    itemMap = [],
  }: MyGenericRecursiveCardProps<T>) => {
    const {
      isVisible1,
      setVisible1,
      isVisible2,
      setVisible2,
      isVisible3,
      setVisible3,
    } = useVisible();
    const [msg, setMsg] = useState("");

    const [showMore, setShowMore] = useState(false);

    const subItems = items.filter((g) => g[parentKey] === item.id);
    const [showChildren, setShowChildren] = useState(true);

    const onDelete = async () => {
      const resp = await deleteItem(item?.id ?? -1);
      if (!resp.ok) {
        setMsg(resp.details ?? "Error");
        return;
      }
      setVisible2(false);
    };

    const actions = [
      { onPress: () => setVisible1(true), title: "Edit" },
      { onPress: () => setVisible2(true), title: "Delete" },
    ] satisfies Page[];

    return (
      <View style={[styles.card, { borderWidth: border ? 1 : 0 }]}>
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
          <View style={styles.actionsRow}>
            <View style={styles.relative}>
              <MyIcon icon="cog" onPress={() => setVisible3((t) => !t)} />
              <MyDropdownMenu
                setOpen={setVisible3}
                open={isVisible3}
                actions={actions}
                margin={0}
              />
              <MyIcon
                icon={showMore ? "angle-up" : "angle-down"}
                onPress={() => setShowMore((t) => !t)}
              />
            </View>
          </View>

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
            {showMore &&
              subItems.length > 0 &&
              subItems.map((s) => (
                <MyGenericRecursiveCard
                  key={s.id}
                  item={s}
                  header={header}
                  important={important}
                  prices={prices}
                  shownFields={shownFields}
                  FormComponent={FormComponent}
                  deleteItem={deleteItem}
                  fetchFcn={fetchFcn}
                  items={items}
                  parentKey={parentKey}
                  itemMap={itemMap}
                />
              ))}
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
    marginTop: 8,
  },
  relative: {
    flexDirection: "column",
    gap: 10,
    position: "relative",
  },
});
