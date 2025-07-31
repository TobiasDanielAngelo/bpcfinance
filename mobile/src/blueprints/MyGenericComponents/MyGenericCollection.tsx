import { observer } from "mobx-react-lite";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { sortAndFilterByIds } from "../../constants/helpers";
import { useVisible } from "../../constants/hooks";
import { PaginatedDetails } from "../../constants/interfaces";
import { MyIcon } from "../MyIcon";

const styles2 = StyleSheet.create({
  topBar: {
    height: 50,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomBar: {
    height: 60,
    backgroundColor: "#50E3C2",
    justifyContent: "center",
    alignItems: "center",
  },
  barText: {
    color: "#fff",
    fontWeight: "bold",
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});

export const MyGenericCollection = observer(
  <T extends { id: number | string /* & object */ }>(props: {
    PageBar?: React.FC;
    pageDetails?: PaginatedDetails | undefined; // set page details to undefined if you don't want any filters
    items: T[];
    CardComponent: React.ComponentType<{
      item: T;
    }>;
    title: string;
  }) => {
    const { PageBar, items, pageDetails, CardComponent, title } = props;
    const { isVisible1, setVisible1 } = useVisible();

    // useEffect(() => {
    //   setVisible1(true);
    // }, []);

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={[styles.headerText]}>{title.toUpperCase()}</Text>
          <MyIcon
            icon={isVisible1 ? "eye" : "eye-slash"}
            onPress={() => setVisible1((t) => !t)}
          />
        </View>
        {isVisible1 && (
          <>
            {PageBar ? <PageBar /> : <></>}
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={sortAndFilterByIds(
                items,
                pageDetails?.ids ?? items.map((s) => s.id),
                (s) => s.id
              )}
              renderItem={({ item: s }) => (
                <CardComponent item={s} key={s.id} />
              )}
              keyExtractor={(item) => `${item.id}`}
              style={styles.list}
              initialNumToRender={5}
              maxToRenderPerBatch={10}
              windowSize={10}
              removeClippedSubviews={true}
            />
          </>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    borderRadius: 12,
  },
  content: {},
  list: {},
  header: {
    flexDirection: "row",
    borderBottomWidth: 2,
    // borderBottomColor: "teal",
    padding: 8,
    borderRadius: 6,
    // backgroundColor: "#ccfbf1", // bg-teal-100
    top: 0,
    zIndex: 0,
    width: "100%",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
    flex: 1,
    color: "#000",
  },
});
