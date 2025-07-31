import { observer } from "mobx-react-lite";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigate } from "react-router-native";
import { useStore } from "../../api/Store";

export const LoginView = observer(() => {
  const { userStore } = useStore();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const loginUser = async () => {
    const response = await userStore.loginUser({
      username: credentials.username.toLowerCase(),
      password: credentials.password,
    });
    if (!response.ok) {
      setMsg(response.details);
      return;
    }
    navigate("/");
  };

  return (
    <View style={styles.main}>
      <TextInput
        style={styles.input}
        placeholder="ID"
        value={credentials.username}
        onChangeText={(userId) =>
          setCredentials({ ...credentials, username: userId })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="PIN"
        secureTextEntry={true}
        value={credentials.password}
        onChangeText={(code) =>
          setCredentials({ ...credentials, password: code })
        }
      />
      <Text style={styles.errorText}>{msg}</Text>
      <TouchableOpacity style={styles.loginBtn} onPress={() => loginUser()}>
        <View style={styles.loginView}>
          <Text style={styles.loginText}>Login</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  main: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "lightcyan",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    width: 250,
    borderColor: "gainsboro",
    fontSize: 20,
    height: 50,
    padding: 10,
    margin: 10,
    backgroundColor: "white",
  },
  loginView: { justifyContent: "center", flex: 1 },
  loginText: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },
  errorText: {
    color: "darkred",
    textAlign: "center",
    marginBottom: 5,
  },
  container: {
    marginTop: 25,
    padding: 10,
  },

  header: {
    fontSize: 20,
  },
  loginBtn: {
    width: 250,
    height: 50,
    borderRadius: 25,
    borderColor: "gray",
    backgroundColor: "teal",
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  subNavItem: {
    padding: 5,
  },
  topic: {
    textAlign: "center",
    fontSize: 15,
  },
});
