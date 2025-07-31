import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { useWindowDimensions } from "react-native";
import { SetURLSearchParams, useSearchParams } from "react-router-native";
import { SettingStore } from "../../api/SettingStore";
import { useStore } from "../../api/Store";
import { toTitleCase } from "../../constants/helpers";
import { useSettings, VisibleMap } from "../../constants/hooks";
import {
  ActionModalDef,
  GraphType,
  KV,
  PaginatedDetails,
  StateSetter,
} from "../../constants/interfaces";
import { MyModal } from "../MyModal";
import { MyMultiDropdownSelector } from "../MyMultiDropdownSelector";
import { MyPageBar } from "../MyPageBar";
import { MySpeedDial } from "../MySpeedDial";
import { GenericViewProps } from "./MyGenericProps";

export const useViewValues = <
  U extends Object & { id?: number | string | null },
  T extends { $view: Record<string, any> }
>(
  settingStore: SettingStore,
  name: string,
  obj: T,
  graphs: GraphType[] = ["pie", "line"]
) => {
  const [pageDetails, setPageDetails] = useState<
    PaginatedDetails | undefined
  >();
  const [params, setParams] = useSearchParams();
  const availableGraphs = graphs as GraphType[];
  const objWithFields = obj.$view;
  const [graph, setGraph] = useSettings<GraphType>(
    settingStore,
    "pie",
    `graph${name}`
  );
  const [shownFields, setShownFields] = useSettings(
    settingStore,
    Object.keys(objWithFields) as (keyof U)[],
    `shownFields${name}`
  );
  const [sortFields, setSortFields] = useSettings(
    settingStore,
    [] as string[],
    `sortFields${name}`
  );

  return {
    pageDetails,
    setPageDetails,
    params,
    setParams,
    availableGraphs,
    graph,
    setGraph,
    shownFields,
    setShownFields,
    sortFields,
    setSortFields,
    objWithFields,
  };
};

export const MyGenericView = observer(
  <T extends Record<string, any>>(props: {
    fetchFcn: () => void;
    Context: React.Context<GenericViewProps<T> | null>;
    CollectionComponent: React.FC;
    TableComponent: React.FC;
    FormComponent: React.ComponentType<{
      setVisible: (v: boolean) => void;
      fetchFcn: () => void;
    }>;
    FilterComponent: React.FC;
    shownFields: (keyof T)[];
    setShownFields: StateSetter<(keyof T)[]>;
    objWithFields: Record<string, any>;
    sortFields: string[];
    setSortFields: StateSetter<string[]>;
    graph: GraphType;
    setGraph: StateSetter<GraphType>;
    availableGraphs: GraphType[];
    actionModalDefs?: readonly ActionModalDef[];
    pageDetails: PaginatedDetails | undefined;
    setPageDetails: StateSetter<PaginatedDetails | undefined>;
    isVisible: VisibleMap;
    setVisible: (index: number, visible: boolean) => void;
    params: URLSearchParams;
    setParams: SetURLSearchParams;
    itemMap: KV<any>[];
    title: string;
  }) => {
    const {
      fetchFcn,
      Context,
      CollectionComponent,
      TableComponent,
      FormComponent,
      FilterComponent,
      objWithFields,
      actionModalDefs,
      isVisible,
      setVisible,
      shownFields,
      setShownFields,
      availableGraphs,
      pageDetails,
      setPageDetails,
      params,
      setParams,
      itemMap,
      sortFields,
      setSortFields,
      graph,
      setGraph,
      title,
    } = props;
    const { width, height } = useWindowDimensions();
    const isPortrait = height >= width;
    const { settingStore } = useStore();
    const setVisibleForIndex = (index: number) => {
      return (value: boolean) => {
        setVisible(index, value); // Use setVisible with the given index
      };
    };

    const defaultActionModalDefs = [
      {
        icon: "plus",
        label: "NEW",
        name: `Add ${title}`,
        modal: (
          <FormComponent
            fetchFcn={fetchFcn}
            setVisible={setVisibleForIndex(1)}
          />
        ),
      },

      {
        icon: "search",
        label: "Search",
        name: "Search",
        modal: <FilterComponent />,
      },
    ] satisfies ActionModalDef[];

    const graphIconMap: Record<GraphType, { icon: string; label: string }> =
      availableGraphs.reduce((acc, type) => {
        const iconMap: Record<GraphType, { icon: string; label: string }> = {
          pie: { icon: "chart-pie", label: "PIE" },
          line: { icon: "chart-line", label: "LINE" },
          bar: { icon: "chart-bar", label: "BAR" },
          area: { icon: "chart-area", label: "AREA" },
        };
        acc[type] = iconMap[type];
        return acc;
      }, {} as Record<GraphType, { icon: string; label: string }>);

    const [view, setView] = useState("table");

    const toggleGraph = () => {
      setGraph((prev) => {
        const currentIndex = availableGraphs.indexOf(prev);
        const nextIndex = (currentIndex + 1) % availableGraphs.length;
        return availableGraphs[nextIndex];
      });
    };

    const updatePage = (updateFn: (curr: number) => number) => {
      setParams((t: any) => {
        const p = new URLSearchParams(t);
        const curr = Number(p.get("page")) || 1;
        p.set("page", String(updateFn(curr)));
        return p;
      });
    };

    const PageBar = () => (
      <MyPageBar
        pageDetails={pageDetails}
        onPressPrev={() => updatePage((curr) => Math.max(curr - 1, 1))}
        onPressNext={() =>
          updatePage((curr) =>
            Math.min(curr + 1, pageDetails?.totalPages ?? curr)
          )
        }
        onPressPage={(n: number) => updatePage(() => n)}
        title={title}
      />
    );

    const Modals = [...defaultActionModalDefs, ...(actionModalDefs ?? [])]
      .map((s) => s.modal)
      .map((child, i) => (
        <MyModal
          key={i}
          isVisible={isVisible[i + 1]}
          setVisible={(v) =>
            setVisible(
              i + 1,
              typeof v === "function" ? (v as any)(isVisible[i + 1]) : v
            )
          }
          disableClose
        >
          {child}
        </MyModal>
      ));

    const actions = useMemo(
      () =>
        [...defaultActionModalDefs, ...(actionModalDefs ?? [])].map(
          (def, i) => ({
            icon: def.icon,
            name: def.name,
            onPress: () => setVisible(i + 1, true),
          })
        ),
      [setVisible, actionModalDefs, defaultActionModalDefs]
    );

    useEffect(() => {
      fetchFcn();
    }, [params]);

    const value = {
      shownFields,
      setShownFields,
      params,
      setParams,
      pageDetails,
      setPageDetails,
      PageBar,
      fetchFcn,
      itemMap,
      graph,
      sortFields,
      setSortFields,
    };

    return (
      <Context.Provider value={value}>
        {view === "card" ? <CollectionComponent /> : <TableComponent />}
        {Modals}
        {isPortrait ? (
          <MySpeedDial actions={[...actions]} />
        ) : (
          <>
            <MySpeedDial actions={actions} />
          </>
        )}
      </Context.Provider>
    );
  }
);
