import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { API_HEADER, API_URL } from "../constants/api";
import { tks } from "../constants/asyncStorage";
import { storeState } from "../recoil/atoms";

export default function Root({ navigation }: any) {
  const setStore = useSetRecoilState(storeState);

  const validateToken = async () => {
    const token = (await AsyncStorage.getItem(tks)) as string;
    if (!token) return validateFailHandler();

    return await axios
      .post(`${API_URL}store/validate/token`, null, API_HEADER(token))
      .then((res) => validateSuccessHandler(res.data))
      .catch((err) => validateFailHandler());
  };

  const validateSuccessHandler = async (data: any) => {
    await AsyncStorage.setItem(tks, data.token);
    delete data.token;
    setStore(data);
    return navigation.replace("token", { screen: "home" });
  };

  const validateFailHandler = async () => {
    await AsyncStorage.removeItem(tks);
    setStore(null);
    return navigation.replace("noToken", { screen: "signIn" });
  };

  useEffect(() => {
    validateToken();
  }, []);

  return null;
}
