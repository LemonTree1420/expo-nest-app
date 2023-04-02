import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { API_HEADER } from "../constants/api";
import { storeState } from "../recoil/atoms";
import getEnvVars from "../../environment";
import { tokenValidateHandler } from "../constants/validate";
const { apiUrl, asyncStorageTokenName, notificationTokenName } = getEnvVars();

export default function Root({ navigation }: any) {
  const setStore = useSetRecoilState(storeState);

  const validateToken = async () => {
    const token = await tokenValidateHandler(setStore, navigation);
    const notificationToken = await AsyncStorage.getItem(notificationTokenName);
    const data = {
      notificationToken,
    };
    return await axios
      .post(`${apiUrl}store/validate/token`, data, API_HEADER(token))
      .then((res) => validateSuccessHandler(res.data))
      .catch((err) => validateFailHandler());
  };

  const validateSuccessHandler = async (data: any) => {
    await AsyncStorage.setItem(asyncStorageTokenName, data.token);
    delete data.token;
    setStore(data);
    return navigation.replace("token", { screen: "list" });
  };

  const validateFailHandler = async () => {
    navigation.replace("noToken", { screen: "signIn" });
    await AsyncStorage.removeItem(asyncStorageTokenName);
    setStore(null);
  };

  useEffect(() => {
    validateToken();
  }, []);

  return null;
}
