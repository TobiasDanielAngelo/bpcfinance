import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeRouter, Route, Routes } from "react-router-native";
import { createStore, StoreContext } from "./src/api/Store";
import { MainView } from "./src/components/main/MainView";
import { LoginView } from "./src/components/main/LoginView";

export default function App() {
  const store = createStore();
  return (
    <SafeAreaProvider>
      <StoreContext.Provider value={store}>
        <NativeRouter>
          <Routes>
            <Route path="/*" element={<MainView />} />
            <Route path="/login" element={<LoginView />} />
          </Routes>
        </NativeRouter>
      </StoreContext.Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
