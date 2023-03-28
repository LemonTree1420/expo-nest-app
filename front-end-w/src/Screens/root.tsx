import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { API_HEADER, API_URL } from "../constants/api";
import { tkw } from "../constants/asyncStorage";
import { workerState } from "../recoil/atoms";

export default function Root({ navigation }: any) {
  const setWorker = useSetRecoilState(workerState);

  const validateToken = async () => {
    const token = (await AsyncStorage.getItem(tkw)) as string;
    if (!token) return validateFailHandler();

    return await axios
      .post(`${API_URL}worker/validate/token`, null, API_HEADER(token))
      .then((res) => validateSuccessHandler(res.data))
      .catch((err) => validateFailHandler());
  };

  const validateSuccessHandler = async (data: any) => {
    await AsyncStorage.setItem(tkw, data.token);
    delete data.token;
    setWorker(data);
    return navigation.replace("token", { screen: "home" });
  };

  const validateFailHandler = async () => {
    await AsyncStorage.removeItem(tkw);
    setWorker(null);
    return navigation.replace("noToken", { screen: "signIn" });
  };

  useEffect(() => {
    validateToken();
  }, []);

  return null;
}
