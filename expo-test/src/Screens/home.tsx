import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect } from "react";
import { Alert, BackHandler, Text, TouchableOpacity, View } from "react-native";
import { useRecoilState } from "recoil";
import { API_URL } from "../configure";
import { tokenState } from "../recoil/atoms";
import CheckToken from "./checkToken";

export default function Home({ navigation }: any) {
  const [token, setToken] = useRecoilState(tokenState);

  useEffect(() => {
    const backAction = () => {
      if (navigation.getState().index > 1) return false;
      else {
        Alert.alert("", "앱을 종료하시겠습니까?", [
          { text: "CANCEL", onPress: () => null },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const testAuthGuard = async () => {
    await axios
      .get(API_URL + "auth/test", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data)
      .catch((err) => console.error(err));
  };

  return (
    <>
      <CheckToken navigation={navigation} />
      <View className="flex-1 items-center justify-center bg-black">
        <TouchableOpacity
          className="bg-blue-500 p-2 rounded"
          onPress={testAuthGuard}
        >
          <Text className="text-white">AuthGuard Test</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-500 p-2 rounded"
          onPress={() => {
            navigation.navigate("list");
          }}
        >
          <Text className="text-white">리스트 보기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-blue-500 p-2 rounded"
          onPress={async () => {
            setToken(null);
            navigation.navigate("signIn");
          }}
        >
          <Text className="text-white">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
