import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { API_HEADER } from "../constants/api";
import { storeState } from "../recoil/atoms";
import getEnvVars from "../../environment";
import { tokenValidateHandler } from "../constants/validate";
const { apiUrl, asyncStorageTokenName } = getEnvVars();

export default function Root({ navigation }: any) {
  const setStore = useSetRecoilState(storeState);

  const validateToken = async () => {
    const token = await tokenValidateHandler(setStore, navigation);

    return await axios
      .post(`${apiUrl}store/validate/token`, null, API_HEADER(token))
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
    await AsyncStorage.removeItem(asyncStorageTokenName);
    setStore(null);
    return navigation.replace("noToken", { screen: "signIn" });
  };

  useEffect(() => {
    validateToken();
  }, []);

  return null;
}
