import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const Login = () => {
  [userId, setUserId] = useState();
  [password, setPassword] = useState();

  const router = useRouter();

  const onPressHandler = async () => {
    const data = {
      userId: userId,
      password: password,
    };
    await axios
      .post("http://13.209.57.85:6001/manager/login", data)
      .then((res) => {
        if (res) {
          router.push("/yetPoints");
        }
      })
      .catch((err) => {
        throw new Error("Logon failed.");
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>CHOICE</Text>
        <Text style={styles.subtitle}>관리자</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input]}
          placeholder="아이디"
          value={userId}
          onChangeText={setUserId}
        />
        <TextInput
          style={[styles.input, styles.secondInput]}
          placeholder="비밀번호"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <KeyboardAvoidingView
        style={styles.buttonContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable style={styles.login} onPress={onPressHandler}>
          <Text style={styles.loginText}>로그인</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "flex-end",
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#4169E1",
  },
  subtitle: {
    fontSize: 16,
    color: "#4169E1",
    textAlign: "center",
  },
  inputContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: 64,
  },
  input: {
    width: "100%",
    height: 36,
    lineHeight: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#4169E1",
    fontSize: 20,
  },
  secondInput: {
    marginTop: 24,
  },
  buttonContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 64,
  },
  login: {
    width: "100%",
    height: 36,
    backgroundColor: "#4169E1",
    alignItems: "center",
    justifyContent: "center",
  },
  loginText: {
    fontSize: 20,
    color: "white",
  },
});
