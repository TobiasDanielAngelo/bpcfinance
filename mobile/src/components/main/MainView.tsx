import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Route, Routes, useNavigate } from "react-router-native";
import { useStore } from "../../api/Store";
import { MenuBar } from "../../blueprints/MenuBar";
import { Menu } from "../../blueprints/MenuCard";
import { useVisible } from "../../constants/hooks";
import { ModularView } from "../dashboards/ModularView";
import { SettingView } from "../modules/SettingComponents";
import { NavBar } from "./NavigationBar";
import { TestingView } from "./TestingView";
import { MemberView } from "../modules/MemberComponents";
import { CollectionTableView } from "../modules/CollectionTableComponents";
import { CollectionView } from "../modules/CollectionComponents";
import { ReportView } from "../modules/ReportComponents";
import { TransferView } from "../modules/TransferComponents";
import { ExpenseView } from "../modules/ExpenseComponents";
import { IncomeView } from "../modules/IncomeComponents";

export const MainView = observer(() => {
  const navigate = useNavigate();
  const insets = useSafeAreaInsets();
  const { isVisible1, setVisible1 } = useVisible();

  const { reportStore } = useStore();

  const fetchAll = async () => {
    const arr = await Promise.all([reportStore.fetchAll("page=all")]);
    if (!arr.every((item) => item.ok)) {
      navigate("/login");
    }
  };

  const menuItems = [
    // { name: "bars", label: "Menu", onPress: () => navigate("/menu") },
    { name: "bars", label: "Menu", onPress: () => setVisible1(true) },
    // { name: "star", label: "Testing", onPress: () => navigate("/testing") },
  ] satisfies Menu[];

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <ImageBackground
        source={require("../../../assets/faintgreen.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <Routes>
          <Route path="menu" element={<ModularView />} />
          <Route path="" element={<ReportView />} />
          <Route path="members" element={<MemberView />} />
          <Route path="collection-table" element={<CollectionTableView />} />
          <Route path="receipts" element={<CollectionView />} />
          <Route path="reports" element={<ReportView />} />
          <Route path="settings" element={<SettingView />} />
          <Route path="bank-statements" element={<TransferView />} />
          <Route path="expenses" element={<ExpenseView />} />
          <Route path="incomes" element={<IncomeView />} />
          <Route path="/testing" element={<TestingView />} />
        </Routes>
      </ImageBackground>
      <NavBar drawerOpen={isVisible1} setDrawerOpen={setVisible1} />
    </View>
  );
});

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
