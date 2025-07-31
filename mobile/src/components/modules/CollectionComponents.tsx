import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import {
  Collection,
  CollectionFields,
  CollectionInterface,
} from "../../api/CollectionStore";
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
import { sortByKey, toOptions } from "../../constants/helpers";

export const {
  Context: CollectionViewContext,
  useGenericView: useCollectionView,
} = createGenericViewContext<CollectionInterface>();

const title = "Collections";

export const CollectionIdMap = {} as const;

export const CollectionForm = ({
  item,
  setVisible,
  fetchFcn,
}: {
  item?: Collection;
  setVisible?: (t: boolean) => void;
  fetchFcn?: () => void;
}) => {
  const { collectionStore, memberStore } = useStore();

  const fields = useMemo(
    () =>
      [
        [
          {
            name: "collectionDate",
            label: "Collection Date",
            type: "date",
          },
        ],
        [
          {
            name: "member",
            label: "Member",
            type: "select",
            options: toOptions(
              sortByKey(
                memberStore.items.map((s) => s.$view),
                "fullName"
              ),
              "fullName"
            ),
          },
        ],
        [{ name: "receiptNumber", label: "Receipt Number", type: "text" }],
        [{ name: "amount", label: "Amount", type: "text" }],
      ] satisfies Field[][],
    [memberStore.items.length]
  );

  return (
    <MyGenericForm<CollectionInterface>
      item={item?.$ ?? item}
      setVisible={setVisible}
      fetchFcn={fetchFcn}
      objectName="collection"
      fields={fields}
      store={collectionStore}
      datetimeFields={CollectionFields.datetimeFields}
      dateFields={CollectionFields.dateFields}
      timeFields={CollectionFields.timeFields}
    />
  );
};

export const CollectionCard = observer((props: { item: Collection }) => {
  const { item } = props;
  const { fetchFcn, shownFields, itemMap } = useCollectionView();
  const { collectionStore } = useStore();

  return (
    <MyGenericCard
      item={item}
      shownFields={shownFields}
      header={["id"]}
      prices={CollectionFields.pricesFields}
      FormComponent={CollectionForm}
      deleteItem={collectionStore.deleteItem}
      fetchFcn={fetchFcn}
      itemMap={itemMap}
    />
  );
});

export const CollectionCollection = observer(() => {
  const { collectionStore } = useStore();
  const { pageDetails, PageBar } = useCollectionView();

  return (
    <SideBySideView
      SideA={
        <MyGenericCollection
          CardComponent={CollectionCard}
          title={title}
          pageDetails={pageDetails}
          PageBar={PageBar}
          items={collectionStore.items}
        />
      }
      SideB=""
      ratio={0.7}
    />
  );
});

export const CollectionFilter = observer(() => {
  return (
    <MyGenericFilter
      view={new Collection({}).$view}
      title="Collection Filters"
      dateFields={[
        ...CollectionFields.datetimeFields,
        ...CollectionFields.dateFields,
      ]}
      excludeFields={["id", "createdAt", "amount", "startMonth", "endMonth"]}
      relatedFields={[]}
      optionFields={[]}
    />
  );
});

export const CollectionRow = observer((props: { item: Collection }) => {
  const { item } = props;
  const { fetchFcn } = useCollectionView();
  const { collectionStore } = useStore();

  return (
    <MyGenericRow
      item={item}
      FormComponent={CollectionForm}
      deleteItem={collectionStore.deleteItem}
      fetchFcn={fetchFcn}
    />
  );
});

export const CollectionTable = observer(() => {
  const { collectionStore } = useStore();
  const values = useCollectionView();
  const { pageDetails } = values;

  return (
    <MyGenericTable
      items={collectionStore.items}
      pageIds={pageDetails?.ids ?? []}
      renderActions={(item) => <CollectionRow item={item} />}
      priceFields={CollectionFields.pricesFields}
      {...values}
      shownFields={[
        "member",
        "collectionDate",
        "receiptNumber",
        "amount",
        "startMonth",
        "endMonth",
      ]}
    />
  );
});

export const CollectionView = observer(() => {
  const { collectionStore, settingStore, memberStore } = useStore();
  const { isVisible, setVisible } = useVisible();
  const values = useViewValues<CollectionInterface, Collection>(
    settingStore,
    "Collection",
    new Collection({})
  );
  const { params, setPageDetails } = values;

  const fetchFcn = async () => {
    const resp = await collectionStore.fetchAll(params.toString());
    if (!resp.ok || !resp.data) {
      return;
    }
    setPageDetails(resp.pageDetails);
  };

  const itemMap = useMemo(
    () =>
      [
        {
          key: "member",
          values: memberStore.items.map((s) => s.$view),
          label: "fullName",
        },
      ] satisfies KV<any>[],
    [memberStore.items.length]
  );

  const actionModalDefs = [] satisfies ActionModalDef[];

  return (
    <MyGenericView<CollectionInterface>
      title={title}
      FormComponent={CollectionForm}
      FilterComponent={CollectionFilter}
      Context={CollectionViewContext}
      CollectionComponent={CollectionCollection}
      TableComponent={CollectionTable}
      fetchFcn={fetchFcn}
      actionModalDefs={actionModalDefs}
      isVisible={isVisible}
      setVisible={setVisible}
      itemMap={itemMap}
      {...values}
    />
  );
});
