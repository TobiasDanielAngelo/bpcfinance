import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import { Member, MemberFields, MemberInterface } from "../../api/MemberStore";
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
import { MyIcon } from "../../blueprints/MyIcon";
import { View } from "react-native";

export const { Context: MemberViewContext, useGenericView: useMemberView } =
  createGenericViewContext<MemberInterface>();

const title = "Members";

export const MemberIdMap = {} as const;

export const MemberForm = ({
  item,
  setVisible,
  fetchFcn,
}: {
  item?: Member;
  setVisible?: (t: boolean) => void;
  fetchFcn?: () => void;
}) => {
  const { memberStore } = useStore();

  const fields = useMemo(
    () =>
      [
        [{ name: "firstName", label: "First Name", type: "text" }],
        [{ name: "lastName", label: "Last Name", type: "text" }],
      ] satisfies Field[][],
    []
  );

  return (
    <MyGenericForm<MemberInterface>
      item={item?.$ ?? { ...item, isActive: true }}
      setVisible={setVisible}
      fetchFcn={fetchFcn}
      objectName="member"
      fields={fields}
      store={memberStore}
      datetimeFields={MemberFields.datetimeFields}
      dateFields={MemberFields.dateFields}
      timeFields={MemberFields.timeFields}
    />
  );
};

export const MemberCard = observer((props: { item: Member }) => {
  const { item } = props;
  const { fetchFcn, shownFields, itemMap } = useMemberView();
  const { memberStore } = useStore();

  return (
    <MyGenericCard
      item={item}
      shownFields={shownFields}
      header={["id"]}
      prices={MemberFields.pricesFields}
      FormComponent={MemberForm}
      deleteItem={memberStore.deleteItem}
      fetchFcn={fetchFcn}
      itemMap={itemMap}
    />
  );
});

export const MemberCollection = observer(() => {
  const { memberStore } = useStore();
  const { pageDetails, PageBar } = useMemberView();

  return (
    <SideBySideView
      SideA={
        <MyGenericCollection
          CardComponent={MemberCard}
          title={title}
          pageDetails={pageDetails}
          PageBar={PageBar}
          items={memberStore.items}
        />
      }
      SideB=""
      ratio={0.7}
    />
  );
});

export const MemberFilter = observer(() => {
  return (
    <MyGenericFilter
      view={new Member({}).$view}
      title="Member Filters"
      dateFields={[...MemberFields.datetimeFields, ...MemberFields.dateFields]}
      excludeFields={["id", "dateAdded"]}
      relatedFields={[]}
      optionFields={[]}
    />
  );
});

export const MemberRow = observer((props: { item: Member }) => {
  const { item } = props;
  const { fetchFcn } = useMemberView();
  const { memberStore } = useStore();

  return (
    <View style={{ flexDirection: "row" }}>
      <MyIcon
        icon={item.isActive ? "check" : "square"}
        onPress={() =>
          memberStore.updateItem(item.id, { isActive: !item.isActive })
        }
        color={item.isActive ? "green" : "black"}
        label={item.isActive ? "Active" : "Inactive"}
        size={10}
      />
      <MyGenericRow
        item={item}
        FormComponent={MemberForm}
        deleteItem={memberStore.deleteItem}
        fetchFcn={fetchFcn}
      />
    </View>
  );
});

export const MemberTable = observer(() => {
  const { memberStore } = useStore();
  const values = useMemberView();
  const { pageDetails } = values;

  return (
    <MyGenericTable
      items={memberStore.items}
      pageIds={pageDetails?.ids ?? []}
      renderActions={(item) => <MemberRow item={item} />}
      priceFields={MemberFields.pricesFields}
      {...values}
      sortFields={["last_name"]}
      shownFields={["lastName", "firstName"]}
    />
  );
});

export const MemberView = observer(() => {
  const { memberStore, settingStore } = useStore();
  const { isVisible, setVisible } = useVisible();
  const values = useViewValues<MemberInterface, Member>(
    settingStore,
    "Member",
    new Member({})
  );
  const { params, setPageDetails } = values;

  const fetchFcn = async () => {
    const resp = await memberStore.fetchAll(params.toString());
    if (!resp.ok || !resp.data) {
      return;
    }
    setPageDetails(resp.pageDetails);
  };

  const itemMap = useMemo(() => [] satisfies KV<any>[], []);

  const actionModalDefs = [] satisfies ActionModalDef[];

  return (
    <MyGenericView<MemberInterface>
      title={title}
      FormComponent={MemberForm}
      FilterComponent={MemberFilter}
      Context={MemberViewContext}
      CollectionComponent={MemberCollection}
      TableComponent={MemberTable}
      fetchFcn={fetchFcn}
      actionModalDefs={actionModalDefs}
      isVisible={isVisible}
      setVisible={setVisible}
      itemMap={itemMap}
      {...values}
    />
  );
});
