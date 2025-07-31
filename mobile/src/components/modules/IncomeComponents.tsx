import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import {
  Income,
  INCOME_CATEGORY_CHOICES,
  IncomeFields,
  IncomeInterface,
} from "../../api/IncomeStore";
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

export const { Context: IncomeViewContext, useGenericView: useIncomeView } =
  createGenericViewContext<IncomeInterface>();

const title = "Incomes";

export const IncomeIdMap = {} as const;

export const IncomeForm = ({
  item,
  setVisible,
  fetchFcn,
}: {
  item?: Partial<Income>;
  setVisible?: (t: boolean) => void;
  fetchFcn?: () => void;
}) => {
  const { incomeStore, reportStore } = useStore();

  const fields = useMemo(
    () =>
      [
        [{ name: "dateAdded", label: "Date Added", type: "date" }],
        [{ name: "amount", label: "Amount", type: "text" }],
        [{ name: "notes", label: "Notes", type: "textarea" }],
        [
          {
            name: "category",
            label: "Category",
            type: "select",
            options: toOptions(INCOME_CATEGORY_CHOICES),
          },
        ],
      ] satisfies Field[][],
    []
  );

  return (
    <MyGenericForm<IncomeInterface>
      item={item?.$ ?? { ...item, dateAdded: new Date().toISOString() }}
      setVisible={setVisible}
      fetchFcn={fetchFcn}
      objectName="income"
      fields={fields}
      store={incomeStore}
      datetimeFields={IncomeFields.datetimeFields}
      dateFields={IncomeFields.dateFields}
      timeFields={IncomeFields.timeFields}
    />
  );
};

export const IncomeCard = observer((props: { item: Income }) => {
  const { item } = props;
  const { fetchFcn, shownFields, itemMap } = useIncomeView();
  const { incomeStore } = useStore();

  return (
    <MyGenericCard
      item={item}
      shownFields={shownFields}
      header={["id"]}
      prices={IncomeFields.pricesFields}
      FormComponent={IncomeForm}
      deleteItem={incomeStore.deleteItem}
      fetchFcn={fetchFcn}
      itemMap={itemMap}
    />
  );
});

export const IncomeCollection = observer(() => {
  const { incomeStore } = useStore();
  const { pageDetails, PageBar } = useIncomeView();

  return (
    <SideBySideView
      SideA={
        <MyGenericCollection
          CardComponent={IncomeCard}
          title={title}
          pageDetails={pageDetails}
          PageBar={PageBar}
          items={incomeStore.items}
        />
      }
      SideB=""
      ratio={0.7}
    />
  );
});

export const IncomeFilter = observer(() => {
  return (
    <MyGenericFilter
      view={new Income({}).$view}
      title="Income Filters"
      dateFields={[...IncomeFields.datetimeFields, ...IncomeFields.dateFields]}
      excludeFields={["id"]}
      relatedFields={[]}
      optionFields={[]}
    />
  );
});

export const IncomeRow = observer((props: { item: Income }) => {
  const { item } = props;
  const { fetchFcn } = useIncomeView();
  const { incomeStore } = useStore();

  return (
    <MyGenericRow
      item={item}
      FormComponent={IncomeForm}
      deleteItem={incomeStore.deleteItem}
      fetchFcn={fetchFcn}
    />
  );
});

export const IncomeTable = observer(() => {
  const { incomeStore } = useStore();
  const values = useIncomeView();
  const { pageDetails } = values;

  return (
    <MyGenericTable
      items={incomeStore.items}
      pageIds={pageDetails?.ids ?? []}
      renderActions={(item) => <IncomeRow item={item} />}
      priceFields={IncomeFields.pricesFields}
      {...values}
    />
  );
});

export const IncomeView = observer(() => {
  const { incomeStore, settingStore } = useStore();
  const { isVisible, setVisible } = useVisible();
  const values = useViewValues<IncomeInterface, Income>(
    settingStore,
    "Income",
    new Income({})
  );
  const { params, setPageDetails } = values;

  const fetchFcn = async () => {
    const resp = await incomeStore.fetchAll(params.toString());
    if (!resp.ok || !resp.data) {
      return;
    }
    setPageDetails(resp.pageDetails);
  };

  const itemMap = useMemo(
    () =>
      [
        {
          key: "category",
          values: INCOME_CATEGORY_CHOICES,
          label: "",
        },
      ] satisfies KV<any>[],
    []
  );

  const actionModalDefs = [] satisfies ActionModalDef[];

  return (
    <MyGenericView<IncomeInterface>
      title={title}
      FormComponent={IncomeForm}
      FilterComponent={IncomeFilter}
      Context={IncomeViewContext}
      CollectionComponent={IncomeCollection}
      TableComponent={IncomeTable}
      fetchFcn={fetchFcn}
      actionModalDefs={actionModalDefs}
      isVisible={isVisible}
      setVisible={setVisible}
      itemMap={itemMap}
      {...values}
    />
  );
});
