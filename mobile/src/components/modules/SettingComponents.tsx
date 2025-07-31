import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import {
  Setting,
  SettingFields,
  SettingInterface,
} from "../../api/SettingStore";
import { useStore } from "../../api/Store";
import { ActionModalDef, KV } from "../../constants/interfaces";
import { MyGenericCard } from "../../blueprints/MyGenericComponents/MyGenericCard";
import { MyGenericCollection } from "../../blueprints/MyGenericComponents/MyGenericCollection";
import { MyGenericFilter } from "../../blueprints/MyGenericComponents/MyGenericFilter";
import { MyGenericForm } from "../../blueprints/MyGenericComponents/MyGenericForm";
import { createGenericViewContext } from "../../blueprints/MyGenericComponents/MyGenericProps";
import { MyGenericRow } from "../../blueprints/MyGenericComponents/MyGenericRow";
import { MyGenericTable } from "../../blueprints/MyGenericComponents/MyGenericTable";
import {
  MyGenericView,
  useViewValues,
} from "../../blueprints/MyGenericComponents/MyGenericView";
import { SideBySideView } from "../../blueprints/SideBySideView";
import { useVisible } from "../../constants/hooks";
import { Field } from "../../constants/interfaces";

export const { Context: SettingViewContext, useGenericView: useSettingView } =
  createGenericViewContext<SettingInterface>();

const title = "Settings";

export const SettingIdMap = {} as const;

export const SettingForm = ({
  item,
  setVisible,
  fetchFcn,
}: {
  item?: Setting;
  setVisible?: (t: boolean) => void;
  fetchFcn?: () => void;
}) => {
  const { settingStore } = useStore();

  const fields = useMemo(
    () =>
      [
        [{ name: "key", label: "Key", type: "text" }],
        [{ name: "value", label: "Value", type: "textarea" }],
        [{ name: "description", label: "Description", type: "text" }],
      ] satisfies Field[][],
    []
  );

  return (
    <MyGenericForm<SettingInterface>
      item={item?.$ ?? item}
      setVisible={setVisible}
      fetchFcn={fetchFcn}
      objectName="setting"
      fields={fields}
      store={settingStore}
      datetimeFields={SettingFields.datetimeFields}
      dateFields={SettingFields.dateFields}
      timeFields={SettingFields.timeFields}
    />
  );
};

export const SettingCard = observer((props: { item: Setting }) => {
  const { item } = props;
  const { fetchFcn, shownFields, itemMap } = useSettingView();
  const { settingStore } = useStore();

  return (
    <MyGenericCard
      item={item}
      shownFields={shownFields}
      header={["id"]}
      important={[]}
      prices={SettingFields.pricesFields}
      FormComponent={SettingForm}
      deleteItem={settingStore.deleteItem}
      fetchFcn={fetchFcn}
      itemMap={itemMap}
    />
  );
});

export const SettingCollection = observer(() => {
  const { settingStore } = useStore();
  const { pageDetails, PageBar } = useSettingView();

  return (
    <SideBySideView
      SideA={
        <MyGenericCollection
          CardComponent={SettingCard}
          title={title}
          pageDetails={pageDetails}
          PageBar={PageBar}
          items={settingStore.items}
        />
      }
      SideB=""
      ratio={0.7}
    />
  );
});

export const SettingFilter = observer(() => {
  return (
    <MyGenericFilter
      view={new Setting({}).$view}
      title="Setting Filters"
      dateFields={[
        ...SettingFields.datetimeFields,
        ...SettingFields.dateFields,
      ]}
      excludeFields={["id"]}
      relatedFields={[]}
      optionFields={[]}
    />
  );
});

export const SettingRow = observer((props: { item: Setting }) => {
  const { item } = props;
  const { fetchFcn } = useSettingView();
  const { settingStore } = useStore();

  return (
    <MyGenericRow
      item={item}
      FormComponent={SettingForm}
      deleteItem={settingStore.deleteItem}
      fetchFcn={fetchFcn}
    />
  );
});

export const SettingTable = observer(() => {
  const { settingStore } = useStore();
  const values = useSettingView();
  const { pageDetails } = values;

  return (
    <MyGenericTable
      items={settingStore.items}
      pageIds={pageDetails?.ids ?? []}
      renderActions={(item) => <SettingRow item={item} />}
      priceFields={SettingFields.pricesFields}
      {...values}
    />
  );
});

export const SettingView = observer(() => {
  const { settingStore } = useStore();
  const { isVisible, setVisible } = useVisible();
  const values = useViewValues<SettingInterface, Setting>(
    settingStore,
    "Setting",
    new Setting({})
  );
  const { params, setPageDetails } = values;

  const fetchFcn = async () => {
    const resp = await settingStore.fetchAll(params.toString());
    if (!resp.ok || !resp.data) {
      return;
    }
    setPageDetails(resp.pageDetails);
  };

  const itemMap = useMemo(() => [] satisfies KV<any>[], []);

  const actionModalDefs = [] satisfies ActionModalDef[];

  return (
    <MyGenericView<SettingInterface>
      title={title}
      FormComponent={SettingForm}
      FilterComponent={SettingFilter}
      Context={SettingViewContext}
      CollectionComponent={SettingCollection}
      TableComponent={SettingTable}
      fetchFcn={fetchFcn}
      actionModalDefs={actionModalDefs}
      isVisible={isVisible}
      setVisible={setVisible}
      itemMap={itemMap}
      {...values}
    />
  );
});
