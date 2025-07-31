import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import {
  Transfer,
  TransferFields,
  TransferInterface,
} from "../../api/TransferStore";
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
import { toOptions } from "../../constants/helpers";

export const { Context: TransferViewContext, useGenericView: useTransferView } =
  createGenericViewContext<TransferInterface>();

const title = "Transfers";

export const TransferIdMap = {} as const;

export const TransferForm = ({
  item,
  setVisible,
  fetchFcn,
}: {
  item?: Transfer;
  setVisible?: (t: boolean) => void;
  fetchFcn?: () => void;
}) => {
  const { transferStore, reportStore } = useStore();

  const fields = useMemo(
    () =>
      [
        [{ name: "dateAdded", label: "Date Added", type: "date" }],
        [{ name: "amount", label: "Amount", type: "text" }],
        [{ name: "toBank", label: "To Bank", type: "check" }],
        [{ name: "notes", label: "Notes", type: "textarea" }],
      ] satisfies Field[][],
    [reportStore.items.length]
  );

  return (
    <MyGenericForm<TransferInterface>
      item={
        item?.$ ?? {
          ...item,
          dateAdded: new Date().toISOString(),
          toBank: true,
        }
      }
      setVisible={setVisible}
      fetchFcn={fetchFcn}
      objectName="transfer"
      fields={fields}
      store={transferStore}
      datetimeFields={TransferFields.datetimeFields}
      dateFields={TransferFields.dateFields}
      timeFields={TransferFields.timeFields}
    />
  );
};

export const TransferCard = observer((props: { item: Transfer }) => {
  const { item } = props;
  const { fetchFcn, shownFields, itemMap } = useTransferView();
  const { transferStore } = useStore();

  return (
    <MyGenericCard
      item={item}
      shownFields={shownFields}
      header={["id"]}
      prices={TransferFields.pricesFields}
      FormComponent={TransferForm}
      deleteItem={transferStore.deleteItem}
      fetchFcn={fetchFcn}
      itemMap={itemMap}
    />
  );
});

export const TransferCollection = observer(() => {
  const { transferStore } = useStore();
  const { pageDetails, PageBar } = useTransferView();

  return (
    <SideBySideView
      SideA={
        <MyGenericCollection
          CardComponent={TransferCard}
          title={title}
          pageDetails={pageDetails}
          PageBar={PageBar}
          items={transferStore.items}
        />
      }
      SideB=""
      ratio={0.7}
    />
  );
});

export const TransferFilter = observer(() => {
  return (
    <MyGenericFilter
      view={new Transfer({}).$view}
      title="Transfer Filters"
      dateFields={[
        ...TransferFields.datetimeFields,
        ...TransferFields.dateFields,
      ]}
      excludeFields={["id"]}
      relatedFields={[]}
      optionFields={[]}
    />
  );
});

export const TransferRow = observer((props: { item: Transfer }) => {
  const { item } = props;
  const { fetchFcn } = useTransferView();
  const { transferStore } = useStore();

  return (
    <MyGenericRow
      item={item}
      FormComponent={TransferForm}
      deleteItem={transferStore.deleteItem}
      fetchFcn={fetchFcn}
    />
  );
});

export const TransferTable = observer(() => {
  const { transferStore } = useStore();
  const values = useTransferView();
  const { pageDetails } = values;

  return (
    <MyGenericTable
      items={transferStore.items}
      pageIds={pageDetails?.ids ?? []}
      renderActions={(item) => <TransferRow item={item} />}
      priceFields={TransferFields.pricesFields}
      {...values}
    />
  );
});

export const TransferView = observer(() => {
  const { transferStore, settingStore } = useStore();
  const { isVisible, setVisible } = useVisible();
  const values = useViewValues<TransferInterface, Transfer>(
    settingStore,
    "Transfer",
    new Transfer({})
  );
  const { params, setPageDetails } = values;

  const fetchFcn = async () => {
    const resp = await transferStore.fetchAll(params.toString());
    if (!resp.ok || !resp.data) {
      return;
    }
    setPageDetails(resp.pageDetails);
  };

  const itemMap = useMemo(() => [] satisfies KV<any>[], []);

  const actionModalDefs = [] satisfies ActionModalDef[];

  return (
    <MyGenericView<TransferInterface>
      title={title}
      FormComponent={TransferForm}
      FilterComponent={TransferFilter}
      Context={TransferViewContext}
      CollectionComponent={TransferCollection}
      TableComponent={TransferTable}
      fetchFcn={fetchFcn}
      actionModalDefs={actionModalDefs}
      isVisible={isVisible}
      setVisible={setVisible}
      itemMap={itemMap}
      {...values}
    />
  );
});
