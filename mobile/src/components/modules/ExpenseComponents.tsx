import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import {
  Expense,
  EXPENSE_CATEGORY_CHOICES,
  ExpenseFields,
  ExpenseInterface,
} from "../../api/ExpenseStore";
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
import moment from "moment";

export const { Context: ExpenseViewContext, useGenericView: useExpenseView } =
  createGenericViewContext<ExpenseInterface>();

const title = "Expenses";

export const ExpenseIdMap = {} as const;

export const ExpenseForm = ({
  item,
  setVisible,
  fetchFcn,
}: {
  item?: Partial<Expense>;
  setVisible?: (t: boolean) => void;
  fetchFcn?: () => void;
}) => {
  const { expenseStore } = useStore();

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
            options: toOptions(EXPENSE_CATEGORY_CHOICES),
          },
        ],
      ] satisfies Field[][],
    []
  );

  return (
    <MyGenericForm<ExpenseInterface>
      item={item?.$ ?? item}
      setVisible={setVisible}
      fetchFcn={fetchFcn}
      objectName="expense"
      fields={fields}
      store={expenseStore}
      datetimeFields={ExpenseFields.datetimeFields}
      dateFields={ExpenseFields.dateFields}
      timeFields={ExpenseFields.timeFields}
    />
  );
};

export const ExpenseCard = observer((props: { item: Expense }) => {
  const { item } = props;
  const { fetchFcn, shownFields, itemMap } = useExpenseView();
  const { expenseStore } = useStore();

  return (
    <MyGenericCard
      item={item}
      shownFields={shownFields}
      header={["id"]}
      prices={ExpenseFields.pricesFields}
      FormComponent={ExpenseForm}
      deleteItem={expenseStore.deleteItem}
      fetchFcn={fetchFcn}
      itemMap={itemMap}
    />
  );
});

export const ExpenseCollection = observer(() => {
  const { expenseStore } = useStore();
  const { pageDetails, PageBar } = useExpenseView();

  return (
    <SideBySideView
      SideA={
        <MyGenericCollection
          CardComponent={ExpenseCard}
          title={title}
          pageDetails={pageDetails}
          PageBar={PageBar}
          items={expenseStore.items}
        />
      }
      SideB=""
      ratio={0.7}
    />
  );
});

export const ExpenseFilter = observer(() => {
  return (
    <MyGenericFilter
      view={new Expense({}).$view}
      title="Expense Filters"
      dateFields={[
        ...ExpenseFields.datetimeFields,
        ...ExpenseFields.dateFields,
      ]}
      excludeFields={["id"]}
      relatedFields={[]}
      optionFields={[]}
    />
  );
});

export const ExpenseRow = observer((props: { item: Expense }) => {
  const { item } = props;
  const { fetchFcn } = useExpenseView();
  const { expenseStore } = useStore();

  return (
    <MyGenericRow
      item={item}
      FormComponent={ExpenseForm}
      deleteItem={expenseStore.deleteItem}
      fetchFcn={fetchFcn}
    />
  );
});

export const ExpenseTable = observer(() => {
  const { expenseStore } = useStore();
  const values = useExpenseView();
  const { pageDetails } = values;

  return (
    <MyGenericTable
      items={expenseStore.items}
      pageIds={pageDetails?.ids ?? []}
      renderActions={(item) => <ExpenseRow item={item} />}
      priceFields={ExpenseFields.pricesFields}
      {...values}
    />
  );
});

export const ExpenseView = observer(() => {
  const { expenseStore, settingStore } = useStore();
  const { isVisible, setVisible } = useVisible();
  const values = useViewValues<ExpenseInterface, Expense>(
    settingStore,
    "Expense",
    new Expense({})
  );
  const { params, setPageDetails } = values;

  const fetchFcn = async () => {
    const resp = await expenseStore.fetchAll(params.toString());
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
          values: EXPENSE_CATEGORY_CHOICES,
          label: "",
        },
      ] satisfies KV<any>[],
    []
  );

  const actionModalDefs = [] satisfies ActionModalDef[];

  return (
    <MyGenericView<ExpenseInterface>
      title={title}
      FormComponent={ExpenseForm}
      FilterComponent={ExpenseFilter}
      Context={ExpenseViewContext}
      CollectionComponent={ExpenseCollection}
      TableComponent={ExpenseTable}
      fetchFcn={fetchFcn}
      actionModalDefs={actionModalDefs}
      isVisible={isVisible}
      setVisible={setVisible}
      itemMap={itemMap}
      {...values}
    />
  );
});
